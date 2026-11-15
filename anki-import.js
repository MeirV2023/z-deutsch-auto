// ============================================================================
// Z-LINGO: Импорт колод Anki (.apkg / .colpkg / .tsv / .csv / .txt) в браузере
// Поддерживает:
//  - ZIP-распаковку .apkg (STORED + DEFLATE через DecompressionStream)
//  - collection.anki2, collection.anki21 и сжатый Zstd collection.anki21b (Anki 23.10+)
//  - Чтение SQLite3 через sql.js WASM + автономный Pure-JS парсер B-tree страниц SQLite3
//  - Разбивку колоды на модули по 3 коротких урока (12 слов) + 4-й Урок-босс (Повторение)
//  - Хранение личных курсов игрока в IndexedDB (с резервом в localStorage)
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
  function cleanAnkiField(rawHtml) {
    if (!rawHtml) return '';
    let s = String(rawHtml);

    // Удаляем [sound:...] и <style>/<script>
    s = s.replace(/\[sound:[^\]]*\]/gi, ' ');
    s = s.replace(/<style[\s\S]*?<\/style>/gi, ' ');
    s = s.replace(/<script[\s\S]*?<\/script>/gi, ' ');

    // Cloze: {{c1::Kofferraum::подсказка}} -> Kofferraum
    s = s.replace(/\{\{c\d+::(.*?)(?:::(.*?))?\}\}/gi, '$1');

    // Переводы строк и теги
    s = s.replace(/<br\s*\/?>/gi, ' · ');
    s = s.replace(/<\/(div|p|li)>/gi, ' · ');
    s = s.replace(/<[^>]+>/g, ' ');

    // HTML-сущности
    s = s
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&#x27;/gi, "'");

    // Схлопываем пробелы и лишние разделители по краям
    s = s.replace(/\s+/g, ' ').replace(/^(\s*·\s*)+|(\s*·\s*)+$/g, '').trim();
    return s;
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
      // 0x0d = Leaf Table B-Tree Page
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

          // В таблице Anki `notes` поле `flds` — это строка с разделителем 0x1F (Unit Separator)
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
                if (splitFields.length >= 2 && (splitFields[0] || splitFields[1])) {
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

  // --- Основной разбор SQLite3 базы Anki (сначала sql.js WASM, при сбое — Pure-JS) ---
  async function parseAnkiSqliteBytes(dbBytes, fallbackDeckName) {
    let deckName = fallbackDeckName;
    let fieldNames = [];
    let rows = [];

    try {
      const SQL = await ensureSqlJs();
      const db = new SQL.Database(dbBytes);
      try {
        // Пытаемся прочитать название колоды и имена полей из таблицы col или decks
        try {
          const colRes = db.exec('SELECT decks, models FROM col LIMIT 1');
          if (colRes.length > 0 && colRes[0].values.length > 0) {
            const [decksJson, modelsJson] = colRes[0].values[0];
            if (decksJson) {
              const decksObj = JSON.parse(decksJson);
              const customDecks = Object.values(decksObj)
                .map(d => d && d.name)
                .filter(n => n && n !== 'Default' && n !== 'По умолчанию');
              if (customDecks.length > 0) {
                deckName = customDecks[0].split('::').pop().trim() || deckName;
              }
            }
            if (modelsJson) {
              const modelsObj = JSON.parse(modelsJson);
              const firstModel = Object.values(modelsObj)[0];
              if (firstModel && Array.isArray(firstModel.flds)) {
                fieldNames = firstModel.flds.map((f, idx) => (f && f.name) ? f.name : `Поле ${idx + 1}`);
              }
            }
          }
        } catch (_) {
          // В Anki 23.10+ названия колод могут лежать в отдельной таблице decks
          try {
            const dRes = db.exec("SELECT name FROM decks WHERE id != 1 LIMIT 5");
            if (dRes.length > 0 && dRes[0].values.length > 0) {
              const rawName = String(dRes[0].values[0][0] || '').replace(/\x1f/g, '::');
              if (rawName) deckName = rawName.split('::').pop().trim() || deckName;
            }
          } catch (_) {}
          try {
            const fRes = db.exec('SELECT name FROM fields ORDER BY ntid, ord LIMIT 12');
            if (fRes.length > 0 && fRes[0].values.length > 0) {
              fieldNames = fRes[0].values.map(v => String(v[0] || ''));
            }
          } catch (_) {}
        }

        const notesRes = db.exec('SELECT flds FROM notes');
        if (notesRes.length > 0 && Array.isArray(notesRes[0].values)) {
          for (const row of notesRes[0].values) {
            const fldsStr = String(row[0] || '');
            if (!fldsStr) continue;
            const parts = fldsStr.split('\x1f').map(cleanAnkiField);
            if (parts.length >= 2 && parts.some(Boolean)) {
              rows.push(parts);
            }
          }
        }
      } finally {
        db.close();
      }
    } catch (_) {
      // Фолбэк на встроенный автономный парсер страниц SQLite3
      rows = parseSqliteNotesPureJS(dbBytes);
    }

    if (rows.length === 0) {
      rows = parseSqliteNotesPureJS(dbBytes);
    }

    const maxCols = rows.reduce((m, r) => Math.max(m, r.length), 0);
    if (fieldNames.length < maxCols) {
      fieldNames = Array.from({ length: maxCols }, (_, idx) => fieldNames[idx] || `Поле ${idx + 1}`);
    }

    return {
      deckName,
      fieldNames,
      rows
    };
  }

  // --- Разбор любого поддерживаемого файла (.apkg / .colpkg / .tsv / .csv / .txt) ---
  async function parseUploadedDeckFile(file) {
    const fileName = file.name || 'Anki Deck';
    const baseTitle = fileName.replace(/\.(apkg|colpkg|tsv|csv|txt)$/i, '').trim() || 'Anki Deck';
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
      return {
        deckName: baseTitle,
        fieldNames: Array.from({ length: maxCols }, (_, i) => i === 0 ? 'Front (Слово)' : i === 1 ? 'Back (Перевод)' : `Поле ${i + 1}`),
        rows
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
  function normalizeCardToWordEntry(frontRaw, backRaw, targetLang = 'de', extraTrans = '') {
    let cleanedFront = String(frontRaw || '')
      .replace(/\s*\(.*?\)\s*/g, ' ')
      .replace(/\s*\[.*?\]\s*/g, ' ')
      .split('·')[0]
      .trim();

    // Для шутера отсекаем слишком длинные предложения (> 42 символов) до ключевой фразы
    if (cleanedFront.length > 42 && cleanedFront.includes('/')) {
      cleanedFront = cleanedFront.split('/')[0].trim();
    }

    const beforeComma = cleanedFront.split(',')[0].trim();
    const afterComma = cleanedFront.includes(',') ? cleanedFront.split(',').slice(1).join(',').trim() : '';

    let article = '';
    let word = beforeComma;
    let withArticle = beforeComma;

    if (targetLang === 'de') {
      if (/^(der|die|das)\s+/i.test(beforeComma)) {
        const parts = beforeComma.split(/\s+/);
        article = parts[0].toLowerCase();
        word = parts.slice(1).join(' ');
        withArticle = `${article} ${word}`;
      } else if (afterComma.includes('Pl.')) {
        article = 'Pl.';
      } else if (/^[a-zäöüß]/.test(beforeComma)) {
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

    // Очищаем слово от знаков вопроса/восклицания по краям (например испанские ¿...?)
    word = word.replace(/^[¿¡"'«»]+|[?!"'«».]+$/g, '').trim();
    if (!word) return null;

    const mainTrans = String(backRaw || '').trim();
    if (!mainTrans) return null;

    const secondTrans = String(extraTrans || '').trim();
    const hasHeMain = /[\u0590-\u05FF]/.test(mainTrans);
    const hasHeSecond = /[\u0590-\u05FF]/.test(secondTrans);
    const hasCyrMain = /[а-яёА-ЯЁ]/.test(mainTrans);

    const translations = {
      ru: hasCyrMain ? mainTrans : (secondTrans && /[а-яёА-ЯЁ]/.test(secondTrans) ? secondTrans : mainTrans),
      en: (!hasCyrMain && !hasHeMain) ? mainTrans : (secondTrans && !hasHeSecond ? secondTrans : mainTrans),
      he: hasHeMain ? mainTrans : (hasHeSecond ? secondTrans : mainTrans)
    };

    return {
      raw: cleanedFront,
      word,
      withArticle: withArticle || word,
      article: article || targetLang.toUpperCase(),
      plural: afterComma,
      translations
    };
  }

  // --- Сборка трёхступенчатого личного курса игрока (по 12 слов в уроке + каждый 4-й Урок-босс!) ---
  function buildUserCourse({
    title,
    targetLang = 'de',
    originType = 'anki', // 'anki' | 'custom'
    words = [],
    lessonSize = 12
  }) {
    const cleanWords = words.filter(w => w && w.word);
    const chunkSize = Math.max(6, Math.min(15, lessonSize));
    const wordChunks = [];
    for (let i = 0; i < cleanWords.length; i += chunkSize) {
      wordChunks.push(cleanWords.slice(i, i + chunkSize));
    }

    // Группируем по 3 обычных урока в тематический модуль + 4-й Босс-урок в конце каждого модуля
    const courseId = `user-${originType}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const modules = [];
    const lessonsPerModule = 3;

    for (let mIdx = 0; mIdx < wordChunks.length; mIdx += lessonsPerModule) {
      const modNum = Math.floor(mIdx / lessonsPerModule) + 1;
      const slice = wordChunks.slice(mIdx, mIdx + lessonsPerModule);
      const lessons = slice.map((chunk, localIdx) => {
        const globalLessonNum = mIdx + localIdx + 1;
        return {
          id: `${courseId}-m${modNum}-l${localIdx + 1}`,
          speedMultiplier: 0.92,
          spawnIntervalMs: 2700,
          titles: {
            ru: `Урок ${globalLessonNum} (${chunk.length} сл.)`,
            en: `Lesson ${globalLessonNum} (${chunk.length} w.)`,
            he: `שלב ${globalLessonNum} (${chunk.length} מיל׳)`
          },
          descriptions: {
            ru: `Личный набор карточек (${originType === 'anki' ? 'Anki .apkg' : 'Свои слова'}), часть ${globalLessonNum}.`,
            en: `Personal deck (${originType === 'anki' ? 'Anki .apkg' : 'Custom list'}), part ${globalLessonNum}.`,
            he: `חפיסה אישית (${originType === 'anki' ? 'Anki .apkg' : 'מילים משלך'}), חלק ${globalLessonNum}.`
          },
          words: chunk
        };
      });

      // Если в модуле >= 2 уроков (или >= 12 слов), добавляем 4-м этапом Урок-босс (Повторение)!
      if (lessons.length >= 2 || cleanWords.length >= 12) {
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

      modules.push({
        id: `${courseId}-m${modNum}`,
        titles: {
          ru: `Модуль ${modNum}: Карточки ${mIdx + 1}–${Math.min(cleanWords.length, (mIdx + slice.length) * chunkSize)}`,
          en: `Module ${modNum}: Cards ${mIdx + 1}–${Math.min(cleanWords.length, (mIdx + slice.length) * chunkSize)}`,
          he: `מודול ${modNum}: כרטיסים ${mIdx + 1}–${Math.min(cleanWords.length, (mIdx + slice.length) * chunkSize)}`
        },
        lessons
      });
    }

    const safeTitle = String(title || 'Моя колода Anki').trim();
    return {
      id: courseId,
      targetLang,
      source: 'user',
      originType,
      createdAt: Date.now(),
      icon: originType === 'anki' ? '📦' : '✍️',
      levelTag: originType === 'anki' ? 'ANKI' : 'CUSTOM',
      titles: {
        ru: safeTitle,
        en: safeTitle,
        he: safeTitle
      },
      descriptions: {
        ru: `Личный курс пользователя (${cleanWords.length} сл. · ${originType === 'anki' ? 'импорт Anki .apkg' : 'ручной список'}).`,
        en: `Personal user deck (${cleanWords.length} words · ${originType === 'anki' ? 'Anki .apkg import' : 'custom list'}).`,
        he: `קורס אישי של המשתמש (${cleanWords.length} מילים · ${originType === 'anki' ? 'ייבוא Anki' : 'רשימה אישית'}).`
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

  window.AnkiImporter = {
    parseUploadedDeckFile,
    normalizeCardToWordEntry,
    buildUserCourse,
    loadUserCourses,
    saveUserCourse,
    deleteUserCourse,
    generateSampleApkgBlob,
    cleanAnkiField
  };
})();
