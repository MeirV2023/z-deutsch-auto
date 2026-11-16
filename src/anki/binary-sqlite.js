// Бинарный слой Anki: распаковка ZIP/Zstd, чтение SQLite3 (sql.js + Pure-JS B-tree) и генератор тестового .apkg
import { cleanAnkiField } from './text-utils.js';

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

export async function ensureSqlJs() {
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

export async function ensureFzstd() {
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

export async function extractZipEntries(arrayBuffer) {
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

export function parseSqliteNotesPureJS(dbBytes) {
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

export function generateSampleApkgBlob(targetLang = 'de') {
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

