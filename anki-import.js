// ============================================================================
// Z-LINGO: Импорт колод Anki (.apkg / .colpkg / .tsv / .csv / .txt) в браузере
// Поддерживает:
//  - ZIP-распаковку .apkg (STORED + DEFLATE через DecompressionStream)
//  - collection.anki2, collection.anki21 и сжатый Zstd collection.anki21b (Anki 23.10+)
//  - Умное автораспознавание полей для многошаблонных колод AnkiWeb (10+ Note Models,
//    отдельные поля Artikel / Plural / Wort_ru / Infinitiv / обратные карточки RU->DE)
//  - Группировку по реальным подколодам Anki (01. Substantiv, 02. Verben и т.д.)
//  - Чтение SQLite3 через sql.js WASM + автономный Pure-JS парсер B-tree страниц SQLite3
//  - Разбивку колоды на модули по 3 коротких урока (12 слов) + 4-й Урок-босс (Повторение)
//  - Хранение и редактирование личных курсов игрока в IndexedDB (с резервом в localStorage)
// ============================================================================
(() => {
  'use strict';

  const IDB_NAME = 'zlingo_user_courses_v1';
  const IDB_STORE = 'courses';
  const LS_FALLBACK_KEY = 'zlingo_user_courses_backup_v1';

  let sqlJsInitPromise = null;
  let fzstdLoadPromise = null;

  function loadExternalScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-dyn-src="${src}"]`);
      if (existing) {
        if (existing.dataset.loaded === '1') return resolve();
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.dataset.dynSrc = src;
      s.addEventListener('load', () => {
        s.dataset.loaded = '1';
        resolve();
      });
      s.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)));
      document.head.appendChild(s);
    });
  }

  async function ensureSqlJs() {
    if (sqlJsInitPromise) return sqlJsInitPromise;
    sqlJsInitPromise = (async () => {
      const base = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3';
      if (typeof window.initSqlJs !== 'function') {
        await loadExternalScript(`${base}/sql-wasm.js`);
      }
      if (typeof window.initSqlJs !== 'function') {
        throw new Error('initSqlJs unavailable');
      }
      return await window.initSqlJs({
        locateFile: (file) => `${base}/${file}`
      });
    })();
    return sqlJsInitPromise;
  }

  async function ensureFzstd() {
    if (window.fzstd && typeof window.fzstd.decompress === 'function') {
      return window.fzstd;
    }
    if (!fzstdLoadPromise) {
      fzstdLoadPromise = loadExternalScript('https://cdn.jsdelivr.net/npm/fzstd@0.1.1/umd/index.js')
        .then(() => window.fzstd);
    }
    return fzstdLoadPromise;
  }

  // --- Чистый JS-распаковщик ZIP-архивов (.apkg / .colpkg) ---
  async function inflateRawBytes(compressedBytes) {
    if (typeof DecompressionStream === 'undefined') {
      throw new Error('DecompressionStream not supported in this browser');
    }
    const ds = new DecompressionStream('deflate-raw');
    const writer = ds.writable.getWriter();
    writer.write(compressedBytes);
    writer.close();

    const reader = ds.readable.getReader();
    const chunks = [];
    let total = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        total += value.byteLength;
      }
    }
    const out = new Uint8Array(total);
    let offset = 0;
    for (const c of chunks) {
      out.set(c, offset);
      offset += c.byteLength;
    }
    return out;
  }

  async function extractZipEntries(arrayBuffer) {
    const bytes = new Uint8Array(arrayBuffer);
    const view = new DataView(arrayBuffer);
    const decoder = new TextDecoder('utf-8');

    // Поиск End of Central Directory (0x06054b50) с конца файла
    let eocdOffset = -1;
    const minSearch = Math.max(0, bytes.length - 65558);
    for (let i = bytes.length - 22; i >= minSearch; i--) {
      if (view.getUint32(i, true) === 0x06054b50) {
        eocdOffset = i;
        break;
      }
    }
    if (eocdOffset < 0) {
      throw new Error('Файл не является корректным ZIP / .apkg архивом');
    }

    const totalEntries = view.getUint16(eocdOffset + 10, true);
    const cdOffset = view.getUint32(eocdOffset + 16, true);

    const entries = new Map();
    let ptr = cdOffset;
    for (let idx = 0; idx < totalEntries && ptr + 46 <= bytes.length; idx++) {
      const sig = view.getUint32(ptr, true);
      if (sig !== 0x02014b50) break;

      const method = view.getUint16(ptr + 10, true);
      const compSize = view.getUint32(ptr + 20, true);
      const nameLen = view.getUint16(ptr + 28, true);
      const extraLen = view.getUint16(ptr + 30, true);
      const commentLen = view.getUint16(ptr + 32, true);
      const localHeaderOffset = view.getUint32(ptr + 42, true);

      const fileName = decoder.decode(bytes.subarray(ptr + 46, ptr + 46 + nameLen));
      ptr += 46 + nameLen + extraLen + commentLen;

      // Извлекаем только файлы коллекций Anki (пропуская тысячи медиафайлов картинок/MP3 для мгновенной скорости!)
      const lowName = fileName.toLowerCase();
      const isAnkiDb =
        lowName.endsWith('.anki21b') ||
        lowName.endsWith('.anki21') ||
        lowName.endsWith('.anki2') ||
        lowName.endsWith('.sqlite') ||
        lowName.endsWith('.db');

      if (!isAnkiDb) continue;
      if (localHeaderOffset + 30 > bytes.length) continue;
      if (view.getUint32(localHeaderOffset, true) !== 0x04034b50) continue;

      const lfNameLen = view.getUint16(localHeaderOffset + 26, true);
      const lfExtraLen = view.getUint16(localHeaderOffset + 28, true);
      const dataStart = localHeaderOffset + 30 + lfNameLen + lfExtraLen;
      const rawSlice = bytes.subarray(dataStart, dataStart + compSize);

      if (method === 0) {
        entries.set(fileName, rawSlice.slice());
      } else if (method === 8) {
        const inflated = await inflateRawBytes(rawSlice);
        entries.set(fileName, inflated);
      }
    }

    return entries;
  }

  // --- Очистка HTML, Cloze-шаблонов и звуковых тегов Anki ---
  // ВАЖНО: инлайновые теги внутри слова (например <i>be</i>fehlen, b<span>a</span>cken)
  // заменяем на пустую строку '', чтобы НЕ разрывать слова пробелами!
  function cleanAnkiField(rawHtml) {
    if (!rawHtml) return '';
    let s = String(rawHtml);

    // Удаляем [sound:...], <style>, <script> и <img>
    s = s.replace(/\[sound:[^\]]*\]/gi, ' ');
    s = s.replace(/<style[\s\S]*?<\/style>/gi, ' ');
    s = s.replace(/<script[\s\S]*?<\/script>/gi, ' ');
    s = s.replace(/<img\b[^>]*>/gi, '');

    // Cloze: {{c1::Kofferraum::подсказка}} -> Kofferraum
    s = s.replace(/\{\{c\d+::(.*?)(?:::(.*?))?\}\}/gi, '$1');

    // Блочные переносы строк -> разделитель ·, ячейки таблиц -> пробел
    s = s.replace(/<br\s*\/?>/gi, ' · ');
    s = s.replace(/<\/(div|p|li|tr|h[1-6])>/gi, ' · ');
    s = s.replace(/<\/(td|th)>/gi, ' ');

    // Все остальные инлайновые теги (<b>, <i>, <span>, <u>, <font>...) удаляем БЕЗ пробела!
    s = s.replace(/<[^>]+>/g, '');

    // HTML-сущности и неразрывные дефисы/пробелы
    s = s
      .replace(/&nbsp;/gi, ' ')
      .replace(/\u00a0/g, ' ')
      .replace(/&#8209;|\u2011/g, '-')
      .replace(/&ndash;/gi, '–')
      .replace(/&mdash;/gi, '—')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&#x27;/gi, "'")
      .replace(/&#(\d+);/g, (_, code) => {
        const num = Number(code);
        return num > 31 ? String.fromCharCode(num) : '';
      })
      .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
        const num = parseInt(hex, 16);
        return num > 31 ? String.fromCharCode(num) : '';
      });

    // Схлопываем пробелы и лишние разделители по краям
    s = s
      .replace(/\s*·\s*(·\s*)+/g, ' · ')
      .replace(/\s+/g, ' ')
      .replace(/^(\s*·\s*)+|(\s*·\s*)+$/g, '')
      .trim();
    return s;
  }

  // --- Определение уровня CEFR и языка по названию и содержимому колоды ---
  function detectDeckCefrLevel(titleStr = '') {
    const s = String(titleStr || '').toUpperCase();
    if (/A1\s*[-–_/\s]\s*A2/.test(s)) return 'A1–A2';
    if (/A2\s*[-–_/\s]\s*B1/.test(s)) return 'A2–B1';
    if (/B1\s*[-–_/\s]\s*B2/.test(s)) return 'B1–B2';
    if (/B2\s*[-–_/\s]\s*C1/.test(s)) return 'B2–C1';
    if (/\bA1\b/.test(s)) return 'A1';
    if (/\bA2\b/.test(s)) return 'A2';
    if (/\bB1\b/.test(s)) return 'B1';
    if (/\bB2\b/.test(s)) return 'B2';
    if (/\bC1\b/.test(s)) return 'C1';
    return '';
  }

  function prettifyDeckTitle(rawName = '') {
    let s = String(rawName || '').trim();
    // Очищаем технические префиксы вида "-__Goethe_A2_B1" -> "Goethe A2–B1"
    s = s.replace(/^[-_\s]+/, '').replace(/_+/g, ' ').replace(/\s+/g, ' ').trim();
    s = s.replace(/\b(A1|A2|B1|B2|C1)\s+(A2|B1|B2|C1)\b/gi, (_, a, b) => `${a.toUpperCase()}–${b.toUpperCase()}`);
    return s || 'Anki Deck';
  }

  function prettifySubdeckTitle(rawSubdeck = '') {
    let s = String(rawSubdeck || '').trim();
    if (!s) return '';
    // Например "01_Goethe..." -> "01. Goethe..."
    s = s.replace(/^(\d{1,2})_+\s*/, '$1. ').replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
    return s;
  }

  // --- Умное сопоставление колонок для каждого шаблона заметок Anki (Note Model) ---
  function inferModelFieldMapping(fieldNames = [], sampleRows = []) {
    const colCount = Math.max(
      fieldNames.length,
      sampleRows.reduce((m, r) => Math.max(m, r.length), 0)
    );
    if (colCount === 0) {
      return { wordIdx: 0, transIdx: 1, artIdx: -1, pluralIdx: -1, sichIdx: -1 };
    }

    const colStats = Array.from({ length: colCount }, (_, idx) => {
      const rawName = String(fieldNames[idx] || '').trim();
      const lowName = rawName.toLowerCase();
      let nonEmpty = 0;
      let cyrCount = 0;
      let hebCount = 0;
      let latCount = 0;
      let articleValCount = 0;
      let sichValCount = 0;
      let totalLen = 0;

      const limit = Math.min(sampleRows.length, 60);
      for (let r = 0; r < limit; r++) {
        const val = String((sampleRows[r] && sampleRows[r][idx]) || '').trim();
        if (!val) continue;
        nonEmpty++;
        totalLen += val.length;
        if (/[а-яёА-ЯЁ]/.test(val)) cyrCount++;
        if (/[\u0590-\u05FF]/.test(val)) hebCount++;
        if (/[a-zA-ZäöüßÄÖÜáéíóúñÁÉÍÓÚÑ]/.test(val)) latCount++;
        if (/^(der|die|das|el|la|los|las|pl\.|der\/die|die\s*\(pl\.?\))$/i.test(val)) {
          articleValCount++;
        }
        if (/^sich$/i.test(val)) {
          sichValCount++;
        }
      }

      const avgLen = nonEmpty > 0 ? totalLen / nonEmpty : 0;
      const fillRate = limit > 0 ? nonEmpty / limit : 0;
      const cyrRatio = nonEmpty > 0 ? cyrCount / nonEmpty : 0;
      const hebRatio = nonEmpty > 0 ? hebCount / nonEmpty : 0;
      const latRatio = nonEmpty > 0 ? latCount / nonEmpty : 0;
      const artRatio = nonEmpty > 0 ? articleValCount / nonEmpty : 0;
      const sichRatio = nonEmpty > 0 ? sichValCount / nonEmpty : 0;

      const isAuxMetaCol =
        /^(sich|reflexiv|artikel|article|genus|plural|wort_de_plural|plural_ohne_die|präsens|praesens|präteritum|praeteritum|partizip|perfekt|hilfsverb|erklärung|erklaerung|synonym|antonym|audio|sound|ton|bild|image|foto|ipa|transkription|tags?|id|nummer|index|level|niveau|kommentar|schema_html|tabelle_html|muster|kategorie|verbtyp|zeit)$/i.test(lowName) ||
        /(audio|sound|bild|image|plural|artikel|präsens|präteritum|partizip|erklärung|_erkl\b|erkl$|kommentar|schema|tabelle|synonym)/i.test(lowName);

      return {
        idx,
        rawName,
        lowName,
        nonEmpty,
        avgLen,
        fillRate,
        cyrRatio,
        hebRatio,
        latRatio,
        artRatio,
        sichRatio,
        isAuxMetaCol
      };
    });

    // 1. Определяем вспомогательные поля: Artikel, Plural, sich
    let artIdx = -1;
    let pluralIdx = -1;
    let sichIdx = -1;

    for (const st of colStats) {
      if (artIdx === -1 && (/(^|_|\b)(artikel|article|genus)($|_|\b)/i.test(st.lowName) || (st.nonEmpty >= 3 && st.artRatio >= 0.72))) {
        artIdx = st.idx;
      }
      if (sichIdx === -1 && (st.lowName === 'sich' || (st.nonEmpty >= 1 && st.sichRatio >= 0.8))) {
        sichIdx = st.idx;
      }
      if (pluralIdx === -1 && /plural/i.test(st.lowName)) {
        pluralIdx = st.idx;
      }
    }

    // 2. Вычисляем лучший столбец изучаемого слова (wordIdx)
    let bestWordIdx = 0;
    let bestWordScore = -Infinity;

    for (const st of colStats) {
      if (st.idx === artIdx || st.idx === sichIdx || st.idx === pluralIdx) continue;
      let score = 0;

      // Имя поля
      if (/^(wort_de_singular|wort_de|infinitiv|wort|vokabel|german|deutsch|english|spanish|español|word|term|expression)$/i.test(st.lowName)) {
        score += 95;
      } else if (/(wort_de|infinitiv|vorderseite|^front$|target|foreign)/i.test(st.lowName)) {
        score += 75;
      } else if (/beispiel_de|satz_de|example_de|sentence_de/i.test(st.lowName)) {
        score += 42;
      }

      // Штраф за явные поля перевода или метаданных
      if (/(wort_ru|_ru\b|рус|перевод|translation|meaning|bedeutung|hebrew|עברית|rückseite|^back$)/i.test(st.lowName)) {
        score -= 85;
      }
      if (st.isAuxMetaCol) score -= 70;

      // Содержимое ячеек
      if (st.nonEmpty === 0) {
        score -= 120;
      } else {
        score += st.fillRate * 26;
        score += st.latRatio * 42;
        score -= st.cyrRatio * 75;
        score -= st.hebRatio * 75;
        if (st.artRatio > 0.65) score -= 80;
        if (st.avgLen >= 2 && st.avgLen <= 38) score += 16;
        else if (st.avgLen > 75) score -= 18;
      }

      if (st.idx === 0) score += 6; // лёгкий приоритет первому полю при равенстве

      if (score > bestWordScore) {
        bestWordScore = score;
        bestWordIdx = st.idx;
      }
    }

    // 3. Вычисляем лучший столбец перевода (transIdx != bestWordIdx)
    let bestTransIdx = bestWordIdx === 0 ? Math.min(1, colCount - 1) : 0;
    let bestTransScore = -Infinity;

    for (const st of colStats) {
      if (st.idx === bestWordIdx || st.idx === artIdx || st.idx === sichIdx || st.idx === pluralIdx) continue;
      let score = 0;

      // Имя поля
      if (/^(wort_ru|wort_ru\+fall|перевод|русский|translation|meaning|bedeutung|rückseite|back)$/i.test(st.lowName)) {
        score += 145;
      } else if (!st.isAuxMetaCol && (/(wort_ru|пример_ru|перевод|русск|meaning_ru|trans_ru)/i.test(st.lowName) || /(^|_)(ru|rus|he|heb)($|_|\+)/i.test(st.lowName))) {
        score += 110;
      } else if (/beispiel_ru|satz_ru/i.test(st.lowName)) {
        score += 95;
      } else if (/(translation|meaning|rückseite|^back$|definition|bedeutung|antwort|answer)/i.test(st.lowName)) {
        score += 58;
      }

      if (st.isAuxMetaCol) score -= 90;
      if (/(wort_de|infinitiv|beispiel_de|satz_de|erklärung)/i.test(st.lowName)) {
        score -= 70;
      }

      if (st.nonEmpty === 0) {
        score -= 130;
      } else {
        score += st.fillRate * 28;
        // Наличие кириллицы или иврита — сильнейший сигнал настоящего перевода!
        score += st.cyrRatio * 115;
        score += st.hebRatio * 115;
        if (st.artRatio > 0.6) score -= 95;
        if (st.sichRatio > 0.5) score -= 95;
        if (st.avgLen >= 2 && st.avgLen <= 65) score += 12;
      }

      if (score > bestTransScore) {
        bestTransScore = score;
        bestTransIdx = st.idx;
      }
    }

    return {
      wordIdx: bestWordIdx,
      transIdx: bestTransIdx,
      artIdx,
      pluralIdx,
      sichIdx
    };
  }

  // Резервное сопоставление строки без метаданных модели (для Pure-JS B-Tree сканера)
  function inferSingleRowFallback(cols = []) {
    if (!cols || cols.length < 2) return null;
    let cyrIdx = -1;
    let latIdx = -1;
    let explicitArt = '';

    for (let i = 0; i < cols.length; i++) {
      const v = String(cols[i] || '').trim();
      if (!v) continue;
      if (!explicitArt && /^(der|die|das)$/i.test(v)) {
        explicitArt = v.toLowerCase();
        continue;
      }
      if (/^sich$/i.test(v)) continue;
      if (cyrIdx === -1 && /[а-яёА-ЯЁ\u0590-\u05FF]/.test(v)) {
        cyrIdx = i;
      }
      if (latIdx === -1 && /[a-zA-ZäöüßÄÖÜáéíóúñÁÉÍÓÚÑ]{2,}/.test(v) && !/[а-яёА-ЯЁ\u0590-\u05FF]/.test(v)) {
        latIdx = i;
      }
    }

    if (latIdx !== -1 && cyrIdx !== -1 && latIdx !== cyrIdx) {
      return { front: cols[latIdx], back: cols[cyrIdx], article: explicitArt };
    }
    return { front: cols[0] || '', back: cols[1] || '', article: '' };
  }

  // --- Автономный Pure-JS сканер записей SQLite3 (резерв без интернета/WASM) ---
  function readSqliteVarint(bytes, pos) {
    let value = 0;
    for (let i = 0; i < 8; i++) {
      if (pos + i >= bytes.length) return { value, length: i + 1 };
      const b = bytes[pos + i];
      value = value * 128 + (b & 0x7f);
      if ((b & 0x80) === 0) {
        return { value, length: i + 1 };
      }
    }
    const b9 = bytes[pos + 8] || 0;
    value = value * 256 + b9;
    return { value, length: 9 };
  }

  function serialTypeByteLen(serialType) {
    if (serialType === 0 || serialType === 8 || serialType === 9) return 0;
    if (serialType === 1) return 1;
    if (serialType === 2) return 2;
    if (serialType === 3) return 3;
    if (serialType === 4) return 4;
    if (serialType === 5) return 6;
    if (serialType === 6 || serialType === 7) return 8;
    if (serialType >= 12 && serialType % 2 === 0) return (serialType - 12) / 2;
    if (serialType >= 13 && serialType % 2 === 1) return (serialType - 13) / 2;
    return 0;
  }

  function parseSqliteNotesPureJS(dbBytes) {
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const headerMagic = decoder.decode(dbBytes.subarray(0, 15));
    if (headerMagic !== 'SQLite format 3') {
      throw new Error('Некорректный заголовок базы данных SQLite3 внутри .apkg');
    }

    const view = new DataView(dbBytes.buffer, dbBytes.byteOffset, dbBytes.byteLength);
    let pageSize = view.getUint16(16, false);
    if (pageSize === 1) pageSize = 65536;
    const totalPages = Math.floor(dbBytes.length / pageSize);

    const extractedRows = [];
    const seenFlds = new Set();

    for (let p = 0; p < totalPages; p++) {
      const pageStart = p * pageSize;
      const bhdr = pageStart + (p === 0 ? 100 : 0);
      if (bhdr + 8 > dbBytes.length) continue;

      const pageType = dbBytes[bhdr];
      if (pageType !== 0x0d) continue;

      const cellCount = view.getUint16(bhdr + 3, false);
      const cellPtrArr = bhdr + 8;

      for (let c = 0; c < cellCount; c++) {
        if (cellPtrArr + c * 2 + 2 > dbBytes.length) break;
        const cellRel = view.getUint16(cellPtrArr + c * 2, false);
        const cellPos = pageStart + cellRel;
        if (cellPos >= pageStart + pageSize || cellPos >= dbBytes.length) continue;

        const payloadVar = readSqliteVarint(dbBytes, cellPos);
        const rowidVar = readSqliteVarint(dbBytes, cellPos + payloadVar.length);
        const recordStart = cellPos + payloadVar.length + rowidVar.length;
        const payloadEnd = Math.min(dbBytes.length, recordStart + payloadVar.value);
        if (recordStart >= payloadEnd) continue;

        const hdrSizeVar = readSqliteVarint(dbBytes, recordStart);
        const hdrEnd = Math.min(payloadEnd, recordStart + hdrSizeVar.value);

        const serialTypes = [];
        let hCursor = recordStart + hdrSizeVar.length;
        while (hCursor < hdrEnd) {
          const st = readSqliteVarint(dbBytes, hCursor);
          serialTypes.push(st.value);
          hCursor += st.length;
          if (st.length === 0) break;
        }

        let bodyCursor = hdrEnd;
        for (let colIdx = 0; colIdx < serialTypes.length; colIdx++) {
          const st = serialTypes[colIdx];
          const len = serialTypeByteLen(st);
          if (bodyCursor + len > payloadEnd) break;

          if (st >= 13 && st % 2 === 1 && len >= 3) {
            const colBytes = dbBytes.subarray(bodyCursor, bodyCursor + len);
            let hasUnitSep = false;
            for (let k = 0; k < colBytes.length; k++) {
              if (colBytes[k] === 0x1f) {
                hasUnitSep = true;
                break;
              }
            }
            if (hasUnitSep) {
              const rawFlds = decoder.decode(colBytes);
              if (!seenFlds.has(rawFlds)) {
                seenFlds.add(rawFlds);
                const splitFields = rawFlds.split('\x1f').map(cleanAnkiField);
                if (splitFields.length >= 2 && splitFields.some(Boolean)) {
                  extractedRows.push(splitFields);
                }
              }
            }
          }
          bodyCursor += len;
        }
      }
    }

    return extractedRows;
  }

  // --- Основной разбор SQLite3 базы Anki (с поддержкой многошаблонных колод и подколод!) ---
  async function parseAnkiSqliteBytes(dbBytes, fallbackDeckName) {
    let deckName = prettifyDeckTitle(fallbackDeckName);
    let fieldNames = [];
    let rows = [];
    let autoCards = [];
    let modelCount = 0;
    let subdeckCount = 0;
    let detectedFrontIdx = 0;
    let detectedBackIdx = 1;

    try {
      const SQL = await ensureSqlJs();
      const db = new SQL.Database(dbBytes);
      try {
        const deckIdToFullName = new Map();
        const modelMap = new Map(); // midStr -> { name, fieldNames }

        // 1. Читаем метаданные колод и моделей из таблицы col (Anki 2.0 / 2.1)
        try {
          const colRes = db.exec('SELECT decks, models FROM col LIMIT 1');
          if (colRes.length > 0 && colRes[0].values.length > 0) {
            const [decksJson, modelsJson] = colRes[0].values[0];
            if (decksJson && decksJson !== '{}') {
              const decksObj = JSON.parse(decksJson);
              for (const [did, dObj] of Object.entries(decksObj)) {
                if (dObj && dObj.name) {
                  deckIdToFullName.set(String(did), String(dObj.name).replace(/\x1f/g, '::'));
                }
              }
            }
            if (modelsJson && modelsJson !== '{}') {
              const modelsObj = JSON.parse(modelsJson);
              for (const [mid, mObj] of Object.entries(modelsObj)) {
                if (mObj && Array.isArray(mObj.flds)) {
                  modelMap.set(String(mid), {
                    name: String(mObj.name || `Model ${mid}`),
                    fieldNames: mObj.flds.map((f, idx) => (f && f.name) ? String(f.name) : `Поле ${idx + 1}`)
                  });
                }
              }
            }
          }
        } catch (_) {}

        // 2. Дополнительно проверяем таблицы decks / notetypes / fields (Anki 23.10+ .anki21b)
        if (deckIdToFullName.size <= 1) {
          try {
            const dRes = db.exec('SELECT id, name FROM decks');
            if (dRes.length > 0 && Array.isArray(dRes[0].values)) {
              for (const [did, rawName] of dRes[0].values) {
                const cleanN = String(rawName || '').replace(/\x1f/g, '::').trim();
                if (cleanN) deckIdToFullName.set(String(did), cleanN);
              }
            }
          } catch (_) {}
        }

        if (modelMap.size === 0) {
          try {
            const ntNames = new Map();
            try {
              const ntRes = db.exec('SELECT id, name FROM notetypes');
              if (ntRes.length > 0 && Array.isArray(ntRes[0].values)) {
                for (const [ntid, ntName] of ntRes[0].values) {
                  ntNames.set(String(ntid), String(ntName || ''));
                }
              }
            } catch (_) {}

            const fRes = db.exec('SELECT ntid, ord, name FROM fields ORDER BY ntid, ord');
            if (fRes.length > 0 && Array.isArray(fRes[0].values)) {
              for (const [ntid, , fName] of fRes[0].values) {
                const key = String(ntid);
                if (!modelMap.has(key)) {
                  modelMap.set(key, {
                    name: ntNames.get(key) || `Model ${key}`,
                    fieldNames: []
                  });
                }
                modelMap.get(key).fieldNames.push(String(fName || ''));
              }
            }
          } catch (_) {}
        }

        // 3. Связываем заметки (nid) с колодами/подколодами (did) через таблицу cards
        const noteDeckMap = new Map(); // nidStr -> didStr
        const rootDeckCounts = new Map(); // rootDeckName -> count
        const subdeckSet = new Set();

        try {
          const cardsRes = db.exec('SELECT nid, did FROM cards ORDER BY ord ASC');
          if (cardsRes.length > 0 && Array.isArray(cardsRes[0].values)) {
            for (const [nid, did] of cardsRes[0].values) {
              const nidKey = String(nid);
              const didKey = String(did);
              if (!noteDeckMap.has(nidKey)) {
                noteDeckMap.set(nidKey, didKey);
              }
              const fullDeck = deckIdToFullName.get(didKey) || '';
              if (fullDeck && fullDeck !== 'Default' && fullDeck !== 'По умолчанию') {
                const parts = fullDeck.split('::').map(p => p.trim()).filter(Boolean);
                if (parts.length > 0) {
                  const root = parts[0];
                  rootDeckCounts.set(root, (rootDeckCounts.get(root) || 0) + 1);
                  if (parts.length > 1) {
                    subdeckSet.add(parts.slice(1).join(' · '));
                  }
                }
              }
            }
          }
        } catch (_) {}

        // Выбираем настоящее корневое имя колоды (например «Deutsch A2-B1» вместо случайной подколоды)
        if (rootDeckCounts.size > 0) {
          let bestRoot = '';
          let bestCnt = -1;
          for (const [rName, cnt] of rootDeckCounts.entries()) {
            if (cnt > bestCnt) {
              bestCnt = cnt;
              bestRoot = rName;
            }
          }
          if (bestRoot) deckName = prettifyDeckTitle(bestRoot);
        } else if (deckIdToFullName.size > 0) {
          const customDecks = Array.from(deckIdToFullName.values())
            .filter(n => n && n !== 'Default' && n !== 'По умолчанию');
          if (customDecks.length > 0) {
            const rootCandidate = customDecks[0].split('::')[0].trim();
            if (rootCandidate) deckName = prettifyDeckTitle(rootCandidate);
          }
        }
        subdeckCount = subdeckSet.size;

        // 4. Читаем заметки вместе с их моделью (mid) и id (nid)
        const notesByMid = new Map(); // midStr -> Array<{ nidStr, cols }>
        const orderedNoteRefs = [];

        const notesRes = db.exec('SELECT id, mid, flds FROM notes');
        if (notesRes.length > 0 && Array.isArray(notesRes[0].values)) {
          for (const [nid, mid, rawFlds] of notesRes[0].values) {
            const fldsStr = String(rawFlds || '');
            if (!fldsStr) continue;
            const cols = fldsStr.split('\x1f').map(cleanAnkiField);
            if (cols.length < 2 || !cols.some(Boolean)) continue;

            rows.push(cols);
            const midKey = String(mid);
            const nidKey = String(nid);
            const noteItem = { nidKey, midKey, cols };
            orderedNoteRefs.push(noteItem);

            if (!notesByMid.has(midKey)) {
              notesByMid.set(midKey, []);
            }
            notesByMid.get(midKey).push(noteItem);
          }
        }

        // 5. Для КАЖДОЙ модели карточек вычисляем свою точную карту полей!
        const mappingByMid = new Map();
        let dominantMid = null;
        let dominantCount = -1;

        for (const [midKey, modelNotes] of notesByMid.entries()) {
          const modelMeta = modelMap.get(midKey) || { name: `Model ${midKey}`, fieldNames: [] };
          const sampleRows = modelNotes.slice(0, 60).map(n => n.cols);
          const mapping = inferModelFieldMapping(modelMeta.fieldNames, sampleRows);
          mappingByMid.set(midKey, {
            ...mapping,
            modelName: modelMeta.name,
            fieldNames: modelMeta.fieldNames
          });

          if (modelNotes.length > dominantCount) {
            dominantCount = modelNotes.length;
            dominantMid = midKey;
          }
        }

        modelCount = notesByMid.size;
        if (dominantMid && mappingByMid.has(dominantMid)) {
          const dom = mappingByMid.get(dominantMid);
          fieldNames = dom.fieldNames.slice();
          detectedFrontIdx = dom.wordIdx;
          detectedBackIdx = dom.transIdx;
        }

        // 6. Собираем готовые карточки с правильным переводом, артиклем и подколодой
        for (const item of orderedNoteRefs) {
          const mapInfo = mappingByMid.get(item.midKey);
          if (!mapInfo) continue;

          const cols = item.cols;
          const front = cols[mapInfo.wordIdx] || '';
          const back = cols[mapInfo.transIdx] || '';
          const explicitArticle = mapInfo.artIdx >= 0 ? (cols[mapInfo.artIdx] || '') : '';
          const explicitPlural = mapInfo.pluralIdx >= 0 ? (cols[mapInfo.pluralIdx] || '') : '';
          const sichPart = mapInfo.sichIdx >= 0 ? (cols[mapInfo.sichIdx] || '') : '';

          // Ищем дополнительный перевод (например EN/HE), если есть ещё колонка
          let extraTrans = '';
          for (let ci = 0; ci < cols.length; ci++) {
            if (
              ci !== mapInfo.wordIdx &&
              ci !== mapInfo.transIdx &&
              ci !== mapInfo.artIdx &&
              ci !== mapInfo.pluralIdx &&
              ci !== mapInfo.sichIdx &&
              cols[ci] &&
              /[\u0590-\u05FF]/.test(cols[ci])
            ) {
              extraTrans = cols[ci];
              break;
            }
          }

          let subdeck = '';
          const didKey = noteDeckMap.get(item.nidKey);
          if (didKey && deckIdToFullName.has(didKey)) {
            const fullD = deckIdToFullName.get(didKey);
            const dParts = fullD.split('::').map(p => p.trim()).filter(Boolean);
            if (dParts.length > 1) {
              subdeck = prettifySubdeckTitle(dParts[1]);
            }
          }

          autoCards.push({
            front,
            back,
            article: explicitArticle,
            plural: explicitPlural,
            sich: sichPart,
            extraTrans,
            subdeck,
            modelName: mapInfo.modelName,
            rawRow: cols
          });
        }
      } finally {
        db.close();
      }
    } catch (_) {
      rows = parseSqliteNotesPureJS(dbBytes);
    }

    if (rows.length === 0) {
      rows = parseSqliteNotesPureJS(dbBytes);
    }

    // Если работал резервный парсер без WASM — применяем умный построчный разбор
    if (autoCards.length === 0 && rows.length > 0) {
      const fallbackMap = inferModelFieldMapping(fieldNames, rows.slice(0, 60));
      detectedFrontIdx = fallbackMap.wordIdx;
      detectedBackIdx = fallbackMap.transIdx;
      autoCards = rows.map(cols => {
        const pair = cols.length > 2 ? inferSingleRowFallback(cols) : { front: cols[0] || '', back: cols[1] || '', article: '' };
        return {
          front: pair ? pair.front : (cols[detectedFrontIdx] || ''),
          back: pair ? pair.back : (cols[detectedBackIdx] || ''),
          article: (pair && pair.article) || (fallbackMap.artIdx >= 0 ? cols[fallbackMap.artIdx] : ''),
          plural: fallbackMap.pluralIdx >= 0 ? (cols[fallbackMap.pluralIdx] || '') : '',
          sich: '',
          extraTrans: '',
          subdeck: '',
          modelName: '',
          rawRow: cols
        };
      });
    }

    const maxCols = rows.reduce((m, r) => Math.max(m, r.length), 0);
    if (fieldNames.length < maxCols) {
      fieldNames = Array.from({ length: maxCols }, (_, idx) => fieldNames[idx] || `Поле ${idx + 1}`);
    }

    const levelTag = detectDeckCefrLevel(deckName) || detectDeckCefrLevel(fallbackDeckName) || 'ANKI';
    const detectedTargetLang = detectTargetLanguageFromCards(deckName, autoCards);

    return {
      deckName,
      levelTag,
      detectedTargetLang,
      fieldNames,
      rows,
      autoCards,
      autoMapped: autoCards.length > 0,
      isMultiModel: modelCount > 1,
      modelCount: Math.max(1, modelCount),
      subdeckCount,
      detectedFrontIdx,
      detectedBackIdx
    };
  }

  function detectTargetLanguageFromCards(deckName = '', autoCards = []) {
    const titleLow = String(deckName || '').toLowerCase();
    if (/(deutsch|german|goethe|telc|daf|dsh|немецк)/i.test(titleLow)) return 'de';
    if (/(english|ielts|toefl|cambridge|английск)/i.test(titleLow)) return 'en';
    if (/(español|espanol|spanish|dele|испанск)/i.test(titleLow)) return 'es';

    let deSignals = 0;
    let esSignals = 0;
    const sample = autoCards.slice(0, 60);
    for (const c of sample) {
      const f = `${c.article || ''} ${c.front || ''}`.trim();
      if (/^(der|die|das)\b/i.test(f) || /[äöüßÄÖÜ]/.test(f)) deSignals++;
      if (/^(el|la|los|las)\b/i.test(f) || /[ñáéíóú¿¡]/i.test(f)) esSignals++;
    }
    if (deSignals >= 4 && deSignals >= esSignals) return 'de';
    if (esSignals >= 4 && esSignals > deSignals) return 'es';
    return '';
  }

  // --- Разбор любого поддерживаемого файла (.apkg / .colpkg / .tsv / .csv / .txt) ---
  async function parseUploadedDeckFile(file) {
    const fileName = file.name || 'Anki Deck';
    const baseTitle = prettifyDeckTitle(fileName.replace(/\.(apkg|colpkg|tsv|csv|txt)$/i, ''));
    const lower = fileName.toLowerCase();

    if (lower.endsWith('.tsv') || lower.endsWith('.csv') || lower.endsWith('.txt')) {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(l => l.trim() && !l.trim().startsWith('#'));
      const rows = [];
      for (const line of lines) {
        const delim = line.includes('\t') ? '\t' : (line.includes(';') ? ';' : ',');
        const cols = line.split(delim).map(cleanAnkiField);
        if (cols.length >= 2 && cols[0] && cols[1]) {
          rows.push(cols);
        }
      }
      if (rows.length === 0) {
        throw new Error('В текстовом файле не найдено карточек (нужно минимум 2 колонки: слово и перевод).');
      }
      const maxCols = rows.reduce((m, r) => Math.max(m, r.length), 2);
      const fieldNames = Array.from({ length: maxCols }, (_, i) => i === 0 ? 'Front (Слово)' : i === 1 ? 'Back (Перевод)' : `Поле ${i + 1}`);
      const mapping = inferModelFieldMapping(fieldNames, rows.slice(0, 50));
      const autoCards = rows.map(r => ({
        front: r[mapping.wordIdx] || '',
        back: r[mapping.transIdx] || '',
        article: mapping.artIdx >= 0 ? (r[mapping.artIdx] || '') : '',
        plural: '',
        sich: '',
        extraTrans: r[2] || '',
        subdeck: '',
        modelName: 'Text',
        rawRow: r
      }));
      return {
        deckName: baseTitle,
        levelTag: detectDeckCefrLevel(baseTitle) || 'CUSTOM',
        detectedTargetLang: detectTargetLanguageFromCards(baseTitle, autoCards),
        fieldNames,
        rows,
        autoCards,
        autoMapped: true,
        isMultiModel: false,
        modelCount: 1,
        subdeckCount: 0,
        detectedFrontIdx: mapping.wordIdx,
        detectedBackIdx: mapping.transIdx
      };
    }

    const buf = await file.arrayBuffer();
    const entries = await extractZipEntries(buf);
    if (entries.size === 0) {
      throw new Error('Внутри .apkg не найдена база карточек Anki (collection.anki2 / anki21 / anki21b).');
    }

    // Приоритет выбора базы: anki21b (современный Anki) -> anki21 -> anki2 -> любая .db/.sqlite
    let chosenName = null;
    let dbBytes = null;
    const keys = Array.from(entries.keys());
    const priorityMatchers = [
      (k) => k.endsWith('collection.anki21b'),
      (k) => k.endsWith('collection.anki21'),
      (k) => k.endsWith('collection.anki2'),
      () => true
    ];

    for (const matchFn of priorityMatchers) {
      const found = keys.find(matchFn);
      if (found) {
        chosenName = found;
        dbBytes = entries.get(found);
        break;
      }
    }

    // Если файл сжат Zstandard (magic 0x28 0xB5 0x2F 0xFD в collection.anki21b)
    if (
      dbBytes &&
      dbBytes.length >= 4 &&
      dbBytes[0] === 0x28 &&
      dbBytes[1] === 0xb5 &&
      dbBytes[2] === 0x2f &&
      dbBytes[3] === 0xfd
    ) {
      const fzstd = await ensureFzstd();
      dbBytes = fzstd.decompress(dbBytes);
    }

    const parsed = await parseAnkiSqliteBytes(dbBytes, baseTitle);
    if (!parsed.rows || parsed.rows.length === 0) {
      throw new Error(`Колода «${chosenName}» прочитана, но не содержит текстовых заметок.`);
    }
    return parsed;
  }

  // --- Нормализация карточки под выбранный изучаемый язык (DE / EN / ES) ---
  function normalizeCardToWordEntry(
    frontRaw,
    backRaw,
    targetLang = 'de',
    extraTrans = '',
    explicitArticle = '',
    explicitPlural = '',
    subdeck = ''
  ) {
    let cleanedFront = String(frontRaw || '')
      .replace(/\s*\(.*?\)\s*/g, ' ')
      .replace(/\s*\[.*?\]\s*/g, ' ')
      .split('·')[0]
      .trim();

    if (!cleanedFront) return null;

    // Для длинных примеров/фраз оставляем первую ключевую клаузу до ; / — / ! / ?
    if (cleanedFront.length > 42 && cleanedFront.includes('/')) {
      cleanedFront = cleanedFront.split('/')[0].trim();
    }
    if (cleanedFront.length > 44) {
      const clauseSplit = cleanedFront.split(/\s*[;—–!?]\s*|\.\s+/)[0].trim();
      if (clauseSplit.length >= 3) {
        cleanedFront = clauseSplit;
      }
    }

    // Сохраняем пометку управления падежом (например «abhängen von Dat» -> печатаем «abhängen von», а подсказку держим в raw!)
    let caseSuffixHint = '';
    if (targetLang === 'de') {
      const caseMatch = cleanedFront.match(/\s+(?:\+\s*)?(Dat(?:iv)?|Akk(?:usativ)?|Gen(?:itiv)?|Nom(?:inativ)?)(?:\s*\/\s*(?:Dat|Akk|Gen|Nom))?\s*$/i);
      if (caseMatch && cleanedFront.length > caseMatch[0].length + 2) {
        caseSuffixHint = `(+${caseMatch[1]})`;
        cleanedFront = cleanedFront.slice(0, cleanedFront.length - caseMatch[0].length).trim();
      }
    }

    const beforeComma = cleanedFront.split(',')[0].trim();
    const afterComma = cleanedFront.includes(',')
      ? cleanedFront.split(',').slice(1).join(',').trim()
      : String(explicitPlural || '').trim();

    let article = '';
    let word = beforeComma;
    let withArticle = beforeComma;

    // Нормализуем явный артикль из отдельной колонки Anki (например Artikel = "der" / "die" / "das")
    const normExpArt = String(explicitArticle || '').trim().toLowerCase();

    if (targetLang === 'de') {
      if (/^(der|die|das)\s+/i.test(beforeComma)) {
        const parts = beforeComma.split(/\s+/);
        article = parts[0].toLowerCase();
        word = parts.slice(1).join(' ');
        withArticle = `${article} ${word}`;
      } else if (!beforeComma.includes(' ') && /^(der|die|das)$/.test(normExpArt)) {
        article = normExpArt;
        word = beforeComma;
        withArticle = `${article} ${word}`;
      } else if (!beforeComma.includes(' ') && normExpArt.includes('der') && normExpArt.includes('die')) {
        article = 'der/die';
        word = beforeComma;
        withArticle = `der ${word}`;
      } else if (afterComma.includes('Pl.') || normExpArt.startsWith('pl')) {
        article = 'Pl.';
      } else if (/^(sich\s+)?[a-zäöüß]/.test(beforeComma)) {
        if (/^sich\s+/i.test(beforeComma)) {
          word = beforeComma.replace(/^sich\s+/i, '').trim();
          withArticle = beforeComma;
        }
        article = 'Verb';
      } else {
        article = 'DE';
      }
    } else if (targetLang === 'es') {
      if (/^(el|la|los|las)\s+/i.test(beforeComma)) {
        const parts = beforeComma.split(/\s+/);
        article = parts[0].toLowerCase();
        word = parts.slice(1).join(' ');
        withArticle = `${article} ${word}`;
      } else if (/^(el|la|los|las)$/.test(normExpArt)) {
        article = normExpArt;
        word = beforeComma;
        withArticle = `${article} ${word}`;
      } else if (/[aáeéiíoóuú]r$/i.test(beforeComma) && !beforeComma.includes(' ')) {
        article = 'Verbo';
      } else {
        article = 'ES';
      }
    } else {
      if (/^to\s+/i.test(beforeComma)) {
        article = 'Verb';
        word = beforeComma.replace(/^to\s+/i, '').trim();
        withArticle = word;
      } else if (/^(the|a|an)\s+/i.test(beforeComma)) {
        const parts = beforeComma.split(/\s+/);
        article = 'Noun';
        word = parts.slice(1).join(' ');
        withArticle = word;
      } else {
        article = 'EN';
      }
    }

    // Очищаем слово от знаков препинания/кавычек по краям (например "Liebe Anna," -> "Liebe Anna")
    word = word
      .replace(/^[¿¡"'«»„“‚‘*•\-–—\s]+|[?!"'«»„“‚‘.,;:…*•\s]+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!word || word.length < 1) return null;

    // Если карточка слишком длинная для аркадного полёта (> 48 симв.), аккуратно укорачиваем по словам
    if (word.length > 48 && word.includes(' ')) {
      const tokens = word.split(' ');
      let acc = '';
      for (const tk of tokens) {
        if ((acc ? acc.length + 1 + tk.length : tk.length) > 42) break;
        acc = acc ? `${acc} ${tk}` : tk;
      }
      if (acc.length >= 3) {
        word = acc.replace(/[.,;:!?]+$/, '');
      }
    }

    if (/^(der|die|das|el|la|los|las)$/i.test(article)) {
      withArticle = `${article} ${word}`;
    } else if (!withArticle) {
      withArticle = word;
    }

    let mainTrans = String(backRaw || '')
      .replace(/\s*·\s*/g, '; ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!mainTrans) return null;

    // Делаем перевод лаконичным и читабельным при взрыве в космосе
    if (mainTrans.length > 72) {
      const shortParts = mainTrans.split(/[;·]/).map(p => p.trim()).filter(Boolean);
      if (shortParts.length > 0 && shortParts[0].length >= 2) {
        mainTrans = shortParts.slice(0, 2).join('; ');
      }
      if (mainTrans.length > 78) {
        mainTrans = mainTrans.slice(0, 75).trim() + '…';
      }
    }

    const secondTrans = String(extraTrans || '').trim();
    const hasHeMain = /[\u0590-\u05FF]/.test(mainTrans);
    const hasHeSecond = /[\u0590-\u05FF]/.test(secondTrans);
    const hasCyrMain = /[а-яёА-ЯЁ]/.test(mainTrans);

    const translations = {
      ru: hasCyrMain ? mainTrans : (secondTrans && /[а-яёА-ЯЁ]/.test(secondTrans) ? secondTrans : mainTrans),
      en: (!hasCyrMain && !hasHeMain) ? mainTrans : (secondTrans && !hasHeSecond ? secondTrans : mainTrans),
      he: hasHeMain ? mainTrans : (hasHeSecond ? secondTrans : mainTrans)
    };

    let displayRaw = /^(der|die|das|el|la|los|las)$/i.test(article)
      ? `${article} ${word}`
      : word;
    if (afterComma && afterComma.length <= 16 && !displayRaw.includes(',')) {
      displayRaw = `${displayRaw}, ${afterComma}`;
    }
    if (caseSuffixHint) {
      displayRaw = `${displayRaw} ${caseSuffixHint}`;
    }

    const entry = {
      raw: displayRaw,
      word,
      withArticle: withArticle || word,
      article: article || targetLang.toUpperCase(),
      plural: afterComma,
      translations
    };
    if (subdeck) {
      entry.subdeck = subdeck;
    }
    return entry;
  }

  // Пакетная конвертация разобранной колоды Anki в игровые карточки (авто-режим или ручной выбор полей)
  function extractNormalizedWordsFromParsedDeck(parsedData, targetLang = 'de', manualOverride = null) {
    if (!parsedData) return [];
    const out = [];
    const seenKeys = new Set();

    const useAuto = Boolean(parsedData.autoMapped && Array.isArray(parsedData.autoCards) && parsedData.autoCards.length > 0 && !manualOverride);

    if (useAuto) {
      for (const card of parsedData.autoCards) {
        const frontText = card.sich && /^sich$/i.test(card.sich) && !/^sich\b/i.test(card.front)
          ? `sich ${card.front}`
          : card.front;
        const entry = normalizeCardToWordEntry(
          frontText,
          card.back,
          targetLang,
          card.extraTrans || '',
          card.article || '',
          card.plural || '',
          card.subdeck || ''
        );
        if (!entry) continue;
        const dedupeKey = `${entry.article}::${entry.word.toLowerCase()}`;
        if (seenKeys.has(dedupeKey)) continue;
        seenKeys.add(dedupeKey);
        out.push(entry);
      }
      return out;
    }

    const frontIdx = manualOverride ? Number(manualOverride.frontIdx) || 0 : (parsedData.detectedFrontIdx || 0);
    const backIdx = manualOverride ? Number(manualOverride.backIdx) || 1 : (parsedData.detectedBackIdx || 1);

    for (const row of (parsedData.rows || [])) {
      const entry = normalizeCardToWordEntry(
        row[frontIdx],
        row[backIdx],
        targetLang,
        row[2] || ''
      );
      if (!entry) continue;
      const dedupeKey = `${entry.article}::${entry.word.toLowerCase()}`;
      if (seenKeys.has(dedupeKey)) continue;
      seenKeys.add(dedupeKey);
      out.push(entry);
    }
    return out;
  }

  // Проверка здоровья переводов в пользовательской колоде (выявляет старые сломанные импорты без кириллицы)
  function inspectDeckTranslationHealth(course) {
    if (!course || course.source !== 'user') {
      return { total: 0, cyrillicCount: 0, sameOrArticleCount: 0, brokenRu: false };
    }
    let total = 0;
    let cyrillicCount = 0;
    let sameOrArticleCount = 0;

    for (const mod of (course.modules || [])) {
      for (const ls of (mod.lessons || [])) {
        if (ls.isBoss) continue;
        for (const w of (ls.words || [])) {
          total++;
          const ru = String((w.translations && w.translations.ru) || '').trim();
          if (/[а-яёА-ЯЁ]/.test(ru)) {
            cyrillicCount++;
          }
          if (!ru || /^(der|die|das|sich)$/i.test(ru) || ru.toLowerCase() === String(w.word || '').toLowerCase()) {
            sameOrArticleCount++;
          }
        }
      }
    }

    const brokenRu = total >= 10 && cyrillicCount === 0 && sameOrArticleCount >= Math.floor(total * 0.25);
    return { total, cyrillicCount, sameOrArticleCount, brokenRu };
  }

  // --- Сборка трёхступенчатого личного курса игрока (с группировкой по подколодам Anki + Босс-уроками!) ---
  function buildUserCourse({
    id = '',
    title,
    description = '',
    targetLang = 'de',
    originType = 'anki', // 'anki' | 'custom'
    levelTag = '',
    createdAt = 0,
    words = [],
    lessonSize = 12
  }) {
    const cleanWords = words.filter(w => w && w.word);
    const chunkSize = Math.max(6, Math.min(15, lessonSize));
    const lessonsPerModule = 3;
    const courseId = id || `user-${originType}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    // Проверяем, есть ли осмысленные подколоды Anki (например 01. Substantiv, 02. Verben...)
    const subdeckBuckets = new Map();
    for (const w of cleanWords) {
      const sd = String(w.subdeck || '').trim();
      if (sd) {
        if (!subdeckBuckets.has(sd)) subdeckBuckets.set(sd, []);
        subdeckBuckets.get(sd).push(w);
      }
    }

    const hasSubdecks = subdeckBuckets.size >= 2;
    const modules = [];
    let globalLessonCounter = 0;
    let modCounter = 0;

    const appendModulesForWordGroup = (groupWords, groupLabel = '') => {
      const chunks = [];
      for (let i = 0; i < groupWords.length; i += chunkSize) {
        chunks.push(groupWords.slice(i, i + chunkSize));
      }
      const totalSubParts = Math.ceil(chunks.length / lessonsPerModule);

      for (let cIdx = 0; cIdx < chunks.length; cIdx += lessonsPerModule) {
        modCounter++;
        const modNum = modCounter;
        const partNum = Math.floor(cIdx / lessonsPerModule) + 1;
        const slice = chunks.slice(cIdx, cIdx + lessonsPerModule);

        const lessons = slice.map((chunk, localIdx) => {
          globalLessonCounter++;
          const gNum = globalLessonCounter;
          const shortTopic = groupLabel
            ? (totalSubParts > 1 ? `${groupLabel} · ${partNum}.${localIdx + 1}` : `${groupLabel} · ${localIdx + 1}`)
            : '';

          return {
            id: `${courseId}-m${modNum}-l${localIdx + 1}`,
            speedMultiplier: 0.92,
            spawnIntervalMs: 2700,
            titles: {
              ru: shortTopic ? `${shortTopic} (${chunk.length} сл.)` : `Урок ${gNum} (${chunk.length} сл.)`,
              en: shortTopic ? `${shortTopic} (${chunk.length} w.)` : `Lesson ${gNum} (${chunk.length} w.)`,
              he: shortTopic ? `${shortTopic} (${chunk.length} מיל׳)` : `שלב ${gNum} (${chunk.length} מיל׳)`
            },
            descriptions: {
              ru: groupLabel
                ? `Раздел «${groupLabel}» (${originType === 'anki' ? 'Anki .apkg' : 'Личная колода'}), урок ${gNum}.`
                : `Личный набор карточек (${originType === 'anki' ? 'Anki .apkg' : 'Свои слова'}), урок ${gNum}.`,
              en: groupLabel
                ? `Section "${groupLabel}" (${originType === 'anki' ? 'Anki .apkg' : 'Custom deck'}), lesson ${gNum}.`
                : `Personal deck (${originType === 'anki' ? 'Anki .apkg' : 'Custom list'}), lesson ${gNum}.`,
              he: groupLabel
                ? `פרק «${groupLabel}» (${originType === 'anki' ? 'Anki .apkg' : 'חפיסה אישית'}), שלב ${gNum}.`
                : `חפיסה אישית (${originType === 'anki' ? 'Anki .apkg' : 'מילים משלך'}), שלב ${gNum}.`
            },
            words: chunk
          };
        });

        if (lessons.length >= 2 || groupWords.length >= 12) {
          lessons.push({
            id: `${courseId}-m${modNum}-boss`,
            isBoss: true,
            speedMultiplier: 1.0,
            spawnIntervalMs: 2550,
            titles: {
              ru: `👹 Босс-урок: Повторение модуля ${modNum}`,
              en: `👹 Boss Review: Module ${modNum}`,
              he: `👹 שלב בוס: חזרה מודול ${modNum}`
            },
            descriptions: {
              ru: 'Автоматический микс карточек модуля с упором на ошибки и слова со звёздочкой ⭐!',
              en: 'Automatic review mix prioritizing your mistakes & ⭐ pinned cards!',
              he: 'חזרת בוס אוטומטית עם דגש על טעויות ומילים עם כוכב ⭐!'
            },
            words: []
          });
        }

        const modTitleRu = groupLabel
          ? (totalSubParts > 1 ? `${groupLabel} · Часть ${partNum}` : groupLabel)
          : `Модуль ${modNum}: Карточки ${(modNum - 1) * lessonsPerModule * chunkSize + 1}–${Math.min(cleanWords.length, modNum * lessonsPerModule * chunkSize)}`;
        const modTitleEn = groupLabel
          ? (totalSubParts > 1 ? `${groupLabel} · Part ${partNum}` : groupLabel)
          : `Module ${modNum}: Cards ${(modNum - 1) * lessonsPerModule * chunkSize + 1}–${Math.min(cleanWords.length, modNum * lessonsPerModule * chunkSize)}`;
        const modTitleHe = groupLabel
          ? (totalSubParts > 1 ? `${groupLabel} · חלק ${partNum}` : groupLabel)
          : `מודול ${modNum}: כרטיסים ${(modNum - 1) * lessonsPerModule * chunkSize + 1}–${Math.min(cleanWords.length, modNum * lessonsPerModule * chunkSize)}`;

        modules.push({
          id: `${courseId}-m${modNum}`,
          subdeckTag: groupLabel || '',
          titles: {
            ru: modTitleRu,
            en: modTitleEn,
            he: modTitleHe
          },
          lessons
        });
      }
    };

    if (hasSubdecks) {
      const sortedEntries = Array.from(subdeckBuckets.entries()).sort((a, b) =>
        a[0].localeCompare(b[0], undefined, { numeric: true, sensitivity: 'base' })
      );
      for (const [sdName, sdWords] of sortedEntries) {
        appendModulesForWordGroup(sdWords, sdName);
      }
      const ungrouped = cleanWords.filter(w => !String(w.subdeck || '').trim());
      if (ungrouped.length > 0) {
        appendModulesForWordGroup(ungrouped, 'Дополнительно');
      }
    } else {
      appendModulesForWordGroup(cleanWords, '');
    }

    const safeTitle = String(title || 'Моя колода Anki').trim();
    const resolvedLevel = levelTag || detectDeckCefrLevel(safeTitle) || (originType === 'anki' ? 'A2–B1' : 'A1–B1');
    const customDesc = String(description || '').trim();
    const subdeckNoteRu = hasSubdecks ? ` · ${subdeckBuckets.size} разд.` : '';
    const subdeckNoteEn = hasSubdecks ? ` · ${subdeckBuckets.size} sections` : '';
    const subdeckNoteHe = hasSubdecks ? ` · ${subdeckBuckets.size} פרקים` : '';

    return {
      id: courseId,
      targetLang,
      source: 'user',
      originType,
      createdAt: createdAt || Date.now(),
      icon: originType === 'anki' ? '📦' : '✍️',
      levelTag: resolvedLevel,
      subdeckCount: hasSubdecks ? subdeckBuckets.size : 0,
      titles: {
        ru: safeTitle,
        en: safeTitle,
        he: safeTitle
      },
      descriptions: {
        ru: customDesc || `Личный курс пользователя (${cleanWords.length.toLocaleString('ru-RU')} сл.${subdeckNoteRu} · ${originType === 'anki' ? 'импорт Anki .apkg' : 'ручной список'}).`,
        en: customDesc || `Personal user deck (${cleanWords.length.toLocaleString('en-US')} words${subdeckNoteEn} · ${originType === 'anki' ? 'Anki .apkg import' : 'custom list'}).`,
        he: customDesc || `קורס אישי של המשתמש (${cleanWords.length} מילים${subdeckNoteHe} · ${originType === 'anki' ? 'ייבוא Anki' : 'רשימה אישית'}).`
      },
      modules
    };
  }

  // --- Сохранение и загрузка личных курсов в IndexedDB + localStorage ---
  function openCoursesDb() {
    if (!('indexedDB' in window)) return Promise.resolve(null);
    return new Promise((resolve) => {
      try {
        const req = indexedDB.open(IDB_NAME, 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(IDB_STORE)) {
            db.createObjectStore(IDB_STORE, { keyPath: 'id' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch (_) {
        resolve(null);
      }
    });
  }

  async function loadUserCourses() {
    const db = await openCoursesDb();
    if (db) {
      try {
        const items = await new Promise((resolve) => {
          const tx = db.transaction(IDB_STORE, 'readonly');
          const req = tx.objectStore(IDB_STORE).getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        });
        if (Array.isArray(items) && items.length > 0) {
          return items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        }
      } catch (_) {}
    }

    try {
      const raw = localStorage.getItem(LS_FALLBACK_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  async function saveUserCourse(course) {
    const existing = await loadUserCourses();
    const updated = [course, ...existing.filter(c => c.id !== course.id)];

    try {
      localStorage.setItem(LS_FALLBACK_KEY, JSON.stringify(updated.slice(0, 12)));
    } catch (_) {}

    const db = await openCoursesDb();
    if (db) {
      await new Promise((resolve) => {
        try {
          const tx = db.transaction(IDB_STORE, 'readwrite');
          tx.objectStore(IDB_STORE).put(course);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch (_) {
          resolve();
        }
      });
    }
    return course;
  }

  async function deleteUserCourse(courseId) {
    const existing = await loadUserCourses();
    const updated = existing.filter(c => c.id !== courseId);
    try {
      localStorage.setItem(LS_FALLBACK_KEY, JSON.stringify(updated));
    } catch (_) {}

    const db = await openCoursesDb();
    if (db) {
      await new Promise((resolve) => {
        try {
          const tx = db.transaction(IDB_STORE, 'readwrite');
          tx.objectStore(IDB_STORE).delete(courseId);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch (_) {
          resolve();
        }
      });
    }
  }

  // --- Генератор настоящего тестового файла .apkg (ZIP + валидная SQLite3 страница notes) ---
  function crc32(bytes) {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) {
      c ^= bytes[i];
      for (let k = 0; k < 8; k++) {
        c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function encodeSqliteVarint(num) {
    if (num < 128) return [num];
    const out = [num & 0x7f];
    let n = Math.floor(num / 128);
    while (n > 0) {
      out.unshift((n & 0x7f) | 0x80);
      n = Math.floor(n / 128);
    }
    return out;
  }

  function createMinimalAnkiSqliteBytes(cards) {
    const enc = new TextEncoder();
    const pageSize = 4096;
    const db = new Uint8Array(pageSize * 2);
    const view = new DataView(db.buffer);

    const buildRecord = (cols) => {
      const stParts = [];
      let bodyLen = 0;
      for (const [st, bytes] of cols) {
        stParts.push(...encodeSqliteVarint(st));
        bodyLen += bytes.length;
      }
      const hdrLenVal = (1 + stParts.length >= 128) ? (2 + stParts.length) : (1 + stParts.length);
      const hdrLenVar = encodeSqliteVarint(hdrLenVal);
      const out = new Uint8Array(hdrLenVar.length + stParts.length + bodyLen);
      let off = 0;
      out.set(hdrLenVar, off); off += hdrLenVar.length;
      out.set(stParts, off); off += stParts.length;
      for (const [, bytes] of cols) {
        out.set(bytes, off);
        off += bytes.length;
      }
      return out;
    };

    const textCol = (str) => {
      const b = enc.encode(str);
      return [b.length * 2 + 13, b];
    };

    // Заголовок файла SQLite3 (100 байт на странице 1 — проходит PRAGMA integrity_check = ok)
    db.set(enc.encode('SQLite format 3\0'), 0);
    view.setUint16(16, pageSize, false);
    db[18] = 1;
    db[19] = 1;
    db[21] = 64;
    db[22] = 32;
    db[23] = 32;
    view.setUint32(28, 2, false); // 2 страницы
    view.setUint32(40, 1, false); // schema cookie = 1
    view.setUint32(44, 4, false); // schema format = 4
    view.setUint32(56, 1, false); // UTF-8

    // Страница 1 — таблица sqlite_master (leaf table 0x0d, 1 запись для таблицы notes на странице 2)
    const masterRec = buildRecord([
      textCol('table'),
      textCol('notes'),
      textCol('notes'),
      [1, new Uint8Array([2])],
      textCol('CREATE TABLE notes (flds TEXT)')
    ]);
    const mPayloadVar = encodeSqliteVarint(masterRec.length);
    const mRowIdVar = encodeSqliteVarint(1);
    const masterCellLen = mPayloadVar.length + mRowIdVar.length + masterRec.length;
    const masterCellOff = pageSize - masterCellLen;
    let mPos = masterCellOff;
    db.set(mPayloadVar, mPos); mPos += mPayloadVar.length;
    db.set(mRowIdVar, mPos); mPos += mRowIdVar.length;
    db.set(masterRec, mPos);

    db[100] = 0x0d;
    view.setUint16(103, 1, false);
    view.setUint16(105, masterCellOff, false);
    view.setUint16(108, masterCellOff, false);

    // Страница 2 — leaf table 0x0d с записями таблицы `notes` (поле `flds` с разделителем \x1f)
    const p2 = pageSize;
    db[p2] = 0x0d;
    view.setUint16(p2 + 3, cards.length, false);

    let cellWriteCursor = pageSize;
    cards.forEach((pair, idx) => {
      const recordBytes = buildRecord([textCol(`${pair[0]}\x1f${pair[1]}`)]);
      const payloadLenVar = encodeSqliteVarint(recordBytes.length);
      const rowIdVar = encodeSqliteVarint(idx + 1);
      const cellTotal = payloadLenVar.length + rowIdVar.length + recordBytes.length;

      cellWriteCursor -= cellTotal;
      let pos = p2 + cellWriteCursor;
      db.set(payloadLenVar, pos); pos += payloadLenVar.length;
      db.set(rowIdVar, pos); pos += rowIdVar.length;
      db.set(recordBytes, pos);

      view.setUint16(p2 + 8 + idx * 2, cellWriteCursor, false);
    });
    view.setUint16(p2 + 5, cellWriteCursor, false);

    return db;
  }

  function wrapSingleFileZip(fileName, fileBytes) {
    const enc = new TextEncoder();
    const nameBytes = enc.encode(fileName);
    const crc = crc32(fileBytes);
    const size = fileBytes.length;

    const localHdr = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHdr.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(8, 0, true); // STORED
    lv.setUint32(14, crc, true);
    lv.setUint32(18, size, true);
    lv.setUint32(22, size, true);
    lv.setUint16(26, nameBytes.length, true);
    localHdr.set(nameBytes, 30);

    const cdOffset = localHdr.length + size;
    const cdHdr = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(cdHdr.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(10, 0, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, size, true);
    cv.setUint32(24, size, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint32(42, 0, true);
    cdHdr.set(nameBytes, 46);

    const eocd = new Uint8Array(22);
    const ev = new DataView(eocd.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(8, 1, true);
    ev.setUint16(10, 1, true);
    ev.setUint32(12, cdHdr.length, true);
    ev.setUint32(16, cdOffset, true);

    const out = new Uint8Array(localHdr.length + size + cdHdr.length + eocd.length);
    let p = 0;
    out.set(localHdr, p); p += localHdr.length;
    out.set(fileBytes, p); p += size;
    out.set(cdHdr, p); p += cdHdr.length;
    out.set(eocd, p);
    return new Blob([out], { type: 'application/octet-stream' });
  }

  function generateSampleApkgBlob(targetLang = 'de') {
    const samples = {
      de: [
        ['die Ladestation, -en', 'зарядная станция для электромобиля'],
        ['der Tempomat, -en', 'круиз-контроль'],
        ['die Rückfahrkamera, -s', 'камера заднего вида'],
        ['das Navigationsgerät, -e', 'навигатор'],
        ['der Spurhalteassistent, -en', 'ассистент удержания полосы'],
        ['der Reifendruck, Sg.', 'давление в шинах'],
        ['die Werkstatt, ¨-en', 'автомастерская'],
        ['der Abschleppdienst, -e', 'служба эвакуации'],
        ['die Hauptuntersuchung, -en', 'техосмотр (TÜV)'],
        ['das Fernlicht, -er', 'дальний свет фар'],
        ['die Nebelschlussleuchte, -n', 'задний противотуманный фонарь'],
        ['überholen', 'обгонять']
      ],
      en: [
        ['navigation', 'навигация'],
        ['dashboard', 'приборная панель'],
        ['headlight', 'фара'],
        ['accelerator', 'педаль газа'],
        ['emergency', 'экстренная ситуация'],
        ['checkpoint', 'контрольный пункт'],
        ['shortcut', 'короткий путь'],
        ['crosswalk', 'пешеходный переход'],
        ['passenger', 'пассажир'],
        ['destination', 'пункт назначения'],
        ['maintenance', 'техобслуживание'],
        ['warranty', 'гарантия']
      ],
      es: [
        ['el navegador', 'навигатор'],
        ['la gasolina', 'бензин'],
        ['el taller', 'мастерская, автосервис'],
        ['la rueda', 'колесо'],
        ['el semáforo', 'светофор'],
        ['el cruce', 'перекрёсток'],
        ['el pasajero', 'пассажир'],
        ['la velocidad', 'скорость'],
        ['frenar', 'тормозить'],
        ['girar', 'поворачивать'],
        ['estacionar', 'парковать'],
        ['la batería', 'аккумулятор']
      ]
    };

    const dbBytes = createMinimalAnkiSqliteBytes(samples[targetLang] || samples.de);
    return wrapSingleFileZip('collection.anki2', dbBytes);
  }

  // --- Умный парсер учебных списков Супер-Админа (поддерживает (Тема), Start, der (-s);..., Inhaber/in, der/die (-/-nen);...) ---
  function parseSingleAdminVocabLine(frontInput, backInput, targetLang = 'de', inputTransLang = 'ru', sectionTag = '') {
    const rawFront = String(frontInput || '').replace(/\s+/g, ' ').trim();
    const rawBack = String(backInput || '').replace(/\s+/g, ' ').trim();
    if (!rawFront || !rawBack) return null;

    // Разбор переводов: можно передать один язык (напр. RU) или сразу 3 через "|" (RU | EN | HE)
    const backCols = rawBack.split(/\s*\|\s*/).map(s => s.trim()).filter(Boolean);
    const primaryTrans = backCols[0] || rawBack;
    const translations = {
      ru: inputTransLang === 'ru' ? primaryTrans : (backCols[1] && /[а-яёА-ЯЁ]/.test(backCols[1]) ? backCols[1] : primaryTrans),
      en: inputTransLang === 'en' ? primaryTrans : (backCols.find(c => !/[а-яёА-ЯЁ\u0590-\u05FF]/.test(c)) || primaryTrans),
      he: inputTransLang === 'he' ? primaryTrans : (backCols.find(c => /[\u0590-\u05FF]/.test(c)) || primaryTrans)
    };

    // 1. Постфиксный книжный формат существительных:
    //    "Start, der (-s)" / "Inhaber/in, der/die (-/-nen)" / "Verantwortung, die (Sg.)" / "Finanzen, die (Pl.)" / "Gewerbe, das (-)"
    const commaIdx = rawFront.indexOf(',');
    if (commaIdx > 0) {
      const head = rawFront.slice(0, commaIdx).trim();
      const tail = rawFront.slice(commaIdx + 1).trim();
      const postfixMatch = tail.match(/^(der\s*\/\s*die|die\s*\/\s*der|der|die|das|el|la|los|las)\b(?:\s*\(([^)]*)\)|\s*,?\s*(.*))?$/i);
      if (postfixMatch && head) {
        let artToken = postfixMatch[1].replace(/\s+/g, '').toLowerCase();
        if (artToken === 'die/der') artToken = 'der/die';
        const pluralNote = String(postfixMatch[2] !== undefined ? postfixMatch[2] : (postfixMatch[3] || '')).trim();
        const primaryArt = artToken.split('/')[0];

        // Для форм с гендерным слэшем ("Inhaber/in", "Experte/Expertin", "Lieferant/in") в полёт даём чистую основу без слэша, а в словаре оставляем полную форму!
        let cleanTypable = head;
        if (head.includes('/')) {
          cleanTypable = head.split('/')[0].replace(/-$/, '').trim();
        }
        cleanTypable = cleanTypable.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ').trim();

        let displayRaw = `${artToken} ${head}`;
        if (pluralNote) {
          if (head.includes('/') || pluralNote === 'Sg.' || pluralNote === 'Pl.' || pluralNote.includes('/')) {
            displayRaw = `${artToken} ${head} (${pluralNote})`;
          } else {
            displayRaw = `${artToken} ${head}, ${pluralNote}`;
          }
        }

        const entry = {
          raw: displayRaw,
          word: cleanTypable,
          withArticle: `${primaryArt} ${cleanTypable}`,
          article: artToken,
          plural: pluralNote,
          translations
        };
        if (sectionTag) entry.subdeck = sectionTag;
        return entry;
      }
    }

    // 2. Возвратные глаголы и выражения с "sich " (напр. "sich selbstständig machen", "sich lohnen", "sich auskennen")
    if (targetLang === 'de' && /^sich\s+/i.test(rawFront)) {
      const withoutSich = rawFront
        .replace(/^sich\s+/i, '')
        .replace(/\s*\(.*?\)\s*/g, ' ')
        .replace(/[.!?]+$/, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (withoutSich) {
        const entry = {
          raw: rawFront,
          word: withoutSich,
          withArticle: `sich ${withoutSich}`,
          article: 'sich',
          plural: '',
          translations
        };
        if (sectionTag) entry.subdeck = sectionTag;
        return entry;
      }
    }

    // 3. Аббревиатура с расшифровкой в скобках без запятой (напр. "WKO (Wirtschaftskammer)")
    const parenOnlyMatch = rawFront.match(/^([A-Za-zÄÖÜäöüß0-9\-]{2,18})\s*\(([^)]+)\)$/);
    if (parenOnlyMatch) {
      const shortWord = parenOnlyMatch[1].trim();
      const entry = {
        raw: rawFront,
        word: shortWord,
        withArticle: rawFront,
        article: targetLang.toUpperCase(),
        plural: '',
        translations
      };
      if (sectionTag) entry.subdeck = sectionTag;
      return entry;
    }

    // 4. Целые предложения и устойчивые словосочетания (напр. "Das Geschäft läuft gut.", "Verantwortung tragen", "einen Kredit aufnehmen")
    const strippedParens = rawFront.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
    const isSentence = /[.!?]$/.test(strippedParens) && strippedParens.includes(' ');
    const hasSpacesNoLeadingArticle = strippedParens.includes(' ') &&
      !/^(der|die|das|el|la|los|las|the|a|an|to)\s+/i.test(strippedParens);

    if (isSentence || hasSpacesNoLeadingArticle) {
      const cleanPhrase = strippedParens.replace(/^[¿¡"'«»„“]+|[.!?,"'«»„“]+$/g, '').trim();
      if (cleanPhrase) {
        const entry = {
          raw: rawFront,
          word: cleanPhrase,
          withArticle: cleanPhrase,
          article: isSentence ? (targetLang === 'de' ? 'Satz' : 'Phrase') : 'Phrase',
          plural: '',
          translations
        };
        if (sectionTag) entry.subdeck = sectionTag;
        return entry;
      }
    }

    // 5. Одиночные немецкие глаголы vs прилагательные/наречия (напр. "leiten" -> Verb, "hart" / "ziemlich" / "schließend" -> Adj./Adv.)
    if (targetLang === 'de' && !strippedParens.includes(' ') && !strippedParens.includes(',') && /^[a-zäöüß]/.test(strippedParens)) {
      const cleanSingle = strippedParens.replace(/[.!?]+$/, '').trim();
      const looksLikeVerb = /(en|ern|eln|tun|sein)$/i.test(cleanSingle) && !/(chen|lein)$/i.test(cleanSingle);
      const entry = {
        raw: rawFront,
        word: cleanSingle,
        withArticle: cleanSingle,
        article: looksLikeVerb ? 'Verb' : 'Adj.',
        plural: '',
        translations
      };
      if (sectionTag) entry.subdeck = sectionTag;
      return entry;
    }

    // 6. Универсальный разбор (стандартные "der Motor;двигатель", "to launch;запускать", "el plan;план")
    const fallback = normalizeCardToWordEntry(rawFront, primaryTrans, targetLang, '', '', '', sectionTag);
    if (fallback) {
      fallback.translations = translations;
    }
    return fallback;
  }

  function parseAdminTextbookBlock(rawText, targetLang = 'de', inputTransLang = 'ru') {
    const lines = String(rawText || '').split(/\r?\n/);
    let detectedTitle = '';
    let currentSection = '';
    const words = [];
    const skippedLines = [];

    for (const rawLine of lines) {
      const trimmed = rawLine.trim();
      if (!trimmed) continue;

      // Заголовок темы в круглых/квадратных скобках или markdown: "(Existenzgründung)" / "[Модуль 1]" / "# Тема"
      if (!trimmed.includes(';') && !trimmed.includes('\t')) {
        const headerMatch = trimmed.match(/^\(([^()]{2,90})\)$/) ||
          trimmed.match(/^\[([^\[\]]{2,90})\]$/) ||
          trimmed.match(/^#{1,3}\s+(.{2,90})$/);
        if (headerMatch) {
          const topic = headerMatch[1].trim();
          if (!detectedTitle) detectedTitle = topic;
          currentSection = topic;
          continue;
        }
      }

      // Ищем разделитель: сначала ";", затем TAB, затем " — " / " - "
      let frontPart = '';
      let backPart = '';
      const semiIdx = trimmed.indexOf(';');
      const tabIdx = trimmed.indexOf('\t');

      if (semiIdx > 0) {
        frontPart = trimmed.slice(0, semiIdx).trim();
        backPart = trimmed.slice(semiIdx + 1).trim();
      } else if (tabIdx > 0) {
        frontPart = trimmed.slice(0, tabIdx).trim();
        backPart = trimmed.slice(tabIdx + 1).trim();
      } else {
        const dashMatch = trimmed.match(/^(.+?)\s+[—–]\s+(.+)$/);
        if (dashMatch) {
          frontPart = dashMatch[1].trim();
          backPart = dashMatch[2].trim();
        }
      }

      if (!frontPart || !backPart) {
        skippedLines.push(trimmed);
        continue;
      }

      const entry = parseSingleAdminVocabLine(frontPart, backPart, targetLang, inputTransLang, currentSection);
      if (entry) {
        words.push(entry);
      } else {
        skippedLines.push(trimmed);
      }
    }

    // Если в списке был всего один общий заголовок (например "(Existenzgründung)" в первой строке),
    // очищаем subdeck, чтобы курс аккуратно разбился на стандартные модули по 3 урока + Босс
    const distinctSections = new Set(words.map(w => w.subdeck).filter(Boolean));
    if (distinctSections.size <= 1) {
      words.forEach(w => { delete w.subdeck; });
    }

    return {
      detectedTitle,
      words,
      skippedCount: skippedLines.length,
      sectionCount: distinctSections.size
    };
  }

  // --- Сборка официального курса от Супер-Админа (для публикации всем игрокам) ---
  function buildOfficialAdminCourse({
    id = '',
    targetLang = 'de',
    category = 'business',
    icon = '💼',
    levelTag = 'B1',
    titles = null,
    descriptions = null,
    fallbackTitle = 'Новый курс',
    words = [],
    lessonSize = 12
  }) {
    const cleanWords = words.filter(w => w && w.word);
    const slugBase = String(fallbackTitle || 'course')
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 24) || 'pack';
    const courseId = id || `${targetLang}-${category}-${slugBase}-${Date.now().toString(36).slice(-4)}`;

    const builtLikeUser = buildUserCourse({
      id: courseId,
      title: (titles && titles.ru) || fallbackTitle,
      description: (descriptions && descriptions.ru) || '',
      targetLang,
      originType: 'custom',
      levelTag,
      words: cleanWords,
      lessonSize
    });

    const resolvedTitles = {
      ru: (titles && titles.ru) || fallbackTitle,
      en: (titles && titles.en) || fallbackTitle,
      he: (titles && titles.he) || fallbackTitle
    };

    const resolvedDescs = {
      ru: (descriptions && descriptions.ru) || `Официальный курс (${cleanWords.length} сл. · уровень ${levelTag}).`,
      en: (descriptions && descriptions.en) || `Official course (${cleanWords.length} words · level ${levelTag}).`,
      he: (descriptions && descriptions.he) || `קורס רשמי (${cleanWords.length} מילים · רמה ${levelTag}).`
    };

    // Обновляем описания уроков со «Личный набор» на «Официальный урок»
    const officialModules = (builtLikeUser.modules || []).map((m, mIdx) => {
      const modTitleBase = m.subdeckTag || resolvedTitles.ru;
      return {
        ...m,
        titles: m.subdeckTag ? m.titles : {
          ru: `Модуль ${mIdx + 1}: ${resolvedTitles.ru}`,
          en: `Module ${mIdx + 1}: ${resolvedTitles.en}`,
          he: `מודול ${mIdx + 1}: ${resolvedTitles.he}`
        },
        lessons: (m.lessons || []).map((ls, lIdx) => {
          if (ls.isBoss) return ls;
          const cnt = (ls.words || []).length;
          return {
            ...ls,
            titles: m.subdeckTag ? ls.titles : {
              ru: `${resolvedTitles.ru} · Часть ${mIdx * 3 + lIdx + 1}`,
              en: `${resolvedTitles.en} · Part ${mIdx * 3 + lIdx + 1}`,
              he: `${resolvedTitles.he} · חלק ${mIdx * 3 + lIdx + 1}`
            },
            descriptions: {
              ru: `Тема «${modTitleBase}» (${cnt} сл. · уровень ${levelTag}).`,
              en: `Topic "${resolvedTitles.en}" (${cnt} words · level ${levelTag}).`,
              he: `נושא «${resolvedTitles.he}» (${cnt} מילים · רמה ${levelTag}).`
            }
          };
        })
      };
    });

    return {
      id: courseId,
      targetLang,
      category,
      source: 'official',
      isAdminCreated: true,
      createdAt: Date.now(),
      icon: icon || '📚',
      levelTag: levelTag || 'B1',
      titles: resolvedTitles,
      descriptions: resolvedDescs,
      modules: officialModules
    };
  }

  window.AnkiImporter = {
    parseUploadedDeckFile,
    normalizeCardToWordEntry,
    parseAdminTextbookBlock,
    buildOfficialAdminCourse,
    extractNormalizedWordsFromParsedDeck,
    inspectDeckTranslationHealth,
    detectDeckCefrLevel,
    buildUserCourse,
    loadUserCourses,
    saveUserCourse,
    deleteUserCourse,
    generateSampleApkgBlob,
    cleanAnkiField
  };
})();
