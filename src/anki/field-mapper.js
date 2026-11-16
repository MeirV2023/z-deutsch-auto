// Эвристический маппер шаблонов Anki (Note Models) и нормализатор карточек в формат Z-LINGO
import { cleanAnkiField, detectDeckCefrLevel, prettifyDeckTitle, prettifySubdeckTitle } from './text-utils.js';
import { ensureSqlJs, ensureFzstd, extractZipEntries, parseSqliteNotesPureJS } from './binary-sqlite.js';

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
export async function parseUploadedDeckFile(file) {
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
export function normalizeCardToWordEntry(
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
export function extractNormalizedWordsFromParsedDeck(parsedData, targetLang = 'de', manualOverride = null) {
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
export function inspectDeckTranslationHealth(course) {
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

