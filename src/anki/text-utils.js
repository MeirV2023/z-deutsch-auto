// Чистые утилиты очистки HTML/Cloze-полей и названий колод Anki (SRP)

// --- Очистка HTML, Cloze-шаблонов и звуковых тегов Anki ---
// ВАЖНО: инлайновые теги внутри слова (например <i>be</i>fehlen, b<span>a</span>cken)
// заменяем на пустую строку '', чтобы НЕ разрывать слова пробелами!
export function cleanAnkiField(rawHtml) {
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
export function detectDeckCefrLevel(titleStr = '') {
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

export function prettifyDeckTitle(rawName = '') {
  let s = String(rawName || '').trim();
  // Очищаем технические префиксы вида "-__Goethe_A2_B1" -> "Goethe A2–B1"
  s = s.replace(/^[-_\s]+/, '').replace(/_+/g, ' ').replace(/\s+/g, ' ').trim();
  s = s.replace(/\b(A1|A2|B1|B2|C1)\s+(A2|B1|B2|C1)\b/gi, (_, a, b) => `${a.toUpperCase()}–${b.toUpperCase()}`);
  return s || 'Anki Deck';
}

export function prettifySubdeckTitle(rawSubdeck = '') {
  let s = String(rawSubdeck || '').trim();
  if (!s) return '';
  // Например "01_Goethe..." -> "01. Goethe..."
  s = s.replace(/^(\d{1,2})_+\s*/, '$1. ').replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
  return s;
}

