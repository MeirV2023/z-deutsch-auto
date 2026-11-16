// Декларативные константы языков, цветовой кодировки артиклей, шрифтов и раскладок клавиатуры

// --- Цветовая кодировка категорий и артиклей (DE / EN / ES) ---
export const ARTICLE_COLORS = {
  // Deutsch
  'der': { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', label: 'der' },
  'die': { main: '#fb7185', glow: 'rgba(251, 113, 133, 0.45)', label: 'die' },
  'das': { main: '#34d399', glow: 'rgba(52, 211, 153, 0.45)', label: 'das' },
  'Pl.': { main: '#fbbf24', glow: 'rgba(251, 191, 36, 0.45)', label: 'Pl.' },
  'der/die': { main: '#60a5fa', glow: 'rgba(96, 165, 250, 0.45)', label: 'der/die' },
  // Español
  'el': { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', label: 'el' },
  'los': { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', label: 'los' },
  'la': { main: '#fb7185', glow: 'rgba(251, 113, 133, 0.45)', label: 'la' },
  'las': { main: '#fb7185', glow: 'rgba(251, 113, 133, 0.45)', label: 'las' },
  'Verbo': { main: '#a78bfa', glow: 'rgba(167, 139, 250, 0.45)', label: 'Verbo' },
  // English & Shared POS
  'Noun': { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', label: 'Noun' },
  'Verb': { main: '#a78bfa', glow: 'rgba(167, 139, 250, 0.45)', label: 'Verb' },
  'Adj.': { main: '#34d399', glow: 'rgba(52, 211, 153, 0.45)', label: 'Adj.' },
  'Adv.': { main: '#e879f9', glow: 'rgba(232, 121, 249, 0.45)', label: 'Adv.' },
  'Pron.': { main: '#f472b6', glow: 'rgba(244, 114, 182, 0.45)', label: 'Pron.' },
  'sich': { main: '#c084fc', glow: 'rgba(192, 132, 252, 0.45)', label: 'sich' },
  'Phrase': { main: '#fbbf24', glow: 'rgba(251, 191, 36, 0.45)', label: 'Phrase' },
  'Satz': { main: '#2dd4bf', glow: 'rgba(45, 212, 191, 0.45)', label: 'Satz' }
};

export function getArticleStyle(article, fallbackLang = 'de') {
  return ARTICLE_COLORS[article] || {
    main: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.4)',
    label: article || fallbackLang.toUpperCase()
  };
}

// --- Студийные голоса Gemini 3.8 TTS ---
export const GEMINI_VOICES = [
  { id: 'Kore', tones: { ru: 'Чёткий студийный (Ж)', en: 'Crisp studio (F)', he: 'אולפני וברור (נ)' } },
  { id: 'Puck', tones: { ru: 'Энергичный и живой (М)', en: 'Energetic & bright (M)', he: 'אנרגטי וחי (ג)' } },
  { id: 'Charon', tones: { ru: 'Глубокий диктор (М)', en: 'Deep narrator (M)', he: 'קריין עמוק (ג)' } },
  { id: 'Aoede', tones: { ru: 'Мягкий и тёплый (Ж)', en: 'Warm & smooth (F)', he: 'רך ונעים (נ)' } },
  { id: 'Fenrir', tones: { ru: 'Динамичный драйв (М)', en: 'Dynamic drive (M)', he: 'דינמי ונמרץ (ג)' } },
  { id: 'Leda', tones: { ru: 'Чистый и светлый (Ж)', en: 'Clear & light (F)', he: 'צלול ובהיר (נ)' } }
];

export const TARGET_LANG_META = {
  de: {
    flag: '🇩🇪',
    code: 'DE',
    heroBrand: '🚀 Z-DEUTSCH',
    sampleWord: 'der Kofferraum',
    speechStyle: 'clear, natural Standard German pronunciation, crisp diction, warm studio voice',
    bcp47: 'de-DE',
    names: { ru: 'Немецкий', en: 'German', he: 'גרמנית' }
  },
  en: {
    flag: '🇬🇧',
    code: 'EN',
    heroBrand: '🚀 Z-ENGLISH',
    sampleWord: 'destination',
    speechStyle: 'clear, natural English pronunciation, crisp diction, warm studio voice',
    bcp47: 'en-US',
    names: { ru: 'Английский', en: 'English', he: 'אנגלית' }
  },
  es: {
    flag: '🇪🇸',
    code: 'ES',
    heroBrand: '🚀 Z-ESPAÑOL',
    speechStyle: 'clear, natural Spanish pronunciation, crisp diction, warm studio voice',
    sampleWord: 'la autopista',
    bcp47: 'es-ES',
    names: { ru: 'Испанский', en: 'Spanish', he: 'ספרדית' }
  }
};

export const SYNTH_SCALE_HZ = [
  293.66, 349.23, 392.00, 440.00, 523.25,
  587.33, 698.46, 783.99, 880.00, 1046.50
];

export const KEYBOARD_LAYOUTS = {
  de: [
    [
      { k: 'q', l: 'Q' }, { k: 'w', l: 'W' }, { k: 'e', l: 'E' }, { k: 'r', l: 'R' }, { k: 't', l: 'T' },
      { k: 'y', l: 'Y' }, { k: 'u', l: 'U', sub: 'ü' }, { k: 'i', l: 'I' }, { k: 'o', l: 'O', sub: 'ö' }, { k: 'p', l: 'P' }
    ],
    [
      { k: 'a', l: 'A', sub: 'ä' }, { k: 's', l: 'S', sub: 'ß' }, { k: 'd', l: 'D' }, { k: 'f', l: 'F' },
      { k: 'g', l: 'G' }, { k: 'h', l: 'H' }, { k: 'j', l: 'J' }, { k: 'k', l: 'K' }, { k: 'l', l: 'L' }
    ],
    [
      { action: 'reset' },
      { k: 'z', l: 'Z' }, { k: 'x', l: 'X' }, { k: 'c', l: 'C' }, { k: 'v', l: 'V' },
      { k: 'b', l: 'B' }, { k: 'n', l: 'N' }, { k: 'm', l: 'M' },
      { action: 'emp' }
    ]
  ],
  en: [
    [
      { k: 'q', l: 'Q' }, { k: 'w', l: 'W' }, { k: 'e', l: 'E' }, { k: 'r', l: 'R' }, { k: 't', l: 'T' },
      { k: 'y', l: 'Y' }, { k: 'u', l: 'U' }, { k: 'i', l: 'I' }, { k: 'o', l: 'O' }, { k: 'p', l: 'P' }
    ],
    [
      { k: 'a', l: 'A' }, { k: 's', l: 'S' }, { k: 'd', l: 'D' }, { k: 'f', l: 'F' },
      { k: 'g', l: 'G' }, { k: 'h', l: 'H' }, { k: 'j', l: 'J' }, { k: 'k', l: 'K' }, { k: 'l', l: 'L' }
    ],
    [
      { action: 'reset' },
      { k: 'z', l: 'Z' }, { k: 'x', l: 'X' }, { k: 'c', l: 'C' }, { k: 'v', l: 'V' },
      { k: 'b', l: 'B' }, { k: 'n', l: 'N' }, { k: 'm', l: 'M' },
      { action: 'emp' }
    ]
  ],
  es: [
    [
      { k: 'q', l: 'Q' }, { k: 'w', l: 'W' }, { k: 'e', l: 'E', sub: 'é' }, { k: 'r', l: 'R' }, { k: 't', l: 'T' },
      { k: 'y', l: 'Y' }, { k: 'u', l: 'U', sub: 'ú' }, { k: 'i', l: 'I', sub: 'í' }, { k: 'o', l: 'O', sub: 'ó' }, { k: 'p', l: 'P' }
    ],
    [
      { k: 'a', l: 'A', sub: 'á' }, { k: 's', l: 'S' }, { k: 'd', l: 'D' }, { k: 'f', l: 'F' },
      { k: 'g', l: 'G' }, { k: 'h', l: 'H' }, { k: 'j', l: 'J' }, { k: 'k', l: 'K' }, { k: 'l', l: 'L' }, { k: 'ñ', l: 'Ñ' }
    ],
    [
      { action: 'reset' },
      { k: 'z', l: 'Z' }, { k: 'x', l: 'X' }, { k: 'c', l: 'C' }, { k: 'v', l: 'V' },
      { k: 'b', l: 'B' }, { k: 'n', l: 'N' }, { k: 'm', l: 'M' },
      { action: 'emp' }
    ]
  ]
};

export const CANVAS_WORD_FONT = '"Rubik", "Noto Sans Hebrew", sans-serif';
export const CANVAS_HEADING_FONT = '"Exo 2", "Rubik", "Noto Sans Hebrew", sans-serif';
