// Декларативные константы языков, цветовой кодировки артиклей, шрифтов и раскладок клавиатуры

export const ALL_LANG_CODES = ['de', 'en', 'es', 'ru', 'uk', 'tr', 'he', 'ar'];

export const REAL_ARTICLES = new Set([
  'der', 'die', 'das', 'der/die', 'sich',
  'el', 'la', 'los', 'las', 'el/la'
]);

// --- Цветовая кодировка категорий и артиклей (8 языков) ---
export const ARTICLE_COLORS = {
  // Deutsch
  'der': { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', label: 'der' },
  'die': { main: '#fb7185', glow: 'rgba(251, 113, 133, 0.45)', label: 'die' },
  'das': { main: '#34d399', glow: 'rgba(52, 211, 153, 0.45)', label: 'das' },
  'Pl.': { main: '#fbbf24', glow: 'rgba(251, 191, 36, 0.45)', label: 'Pl.' },
  'der/die': { main: '#60a5fa', glow: 'rgba(96, 165, 250, 0.45)', label: 'der/die' },
  'Konj.': { main: '#f472b6', glow: 'rgba(244, 114, 182, 0.45)', label: 'Konj.' },
  'Präp.': { main: '#e879f9', glow: 'rgba(232, 121, 249, 0.45)', label: 'Präp.' },
  // Español
  'el': { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', label: 'el' },
  'los': { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', label: 'los' },
  'la': { main: '#fb7185', glow: 'rgba(251, 113, 133, 0.45)', label: 'la' },
  'las': { main: '#fb7185', glow: 'rgba(251, 113, 133, 0.45)', label: 'las' },
  'el/la': { main: '#60a5fa', glow: 'rgba(96, 165, 250, 0.45)', label: 'el/la' },
  'Verbo': { main: '#a78bfa', glow: 'rgba(167, 139, 250, 0.45)', label: 'Verbo' },
  'Conj.': { main: '#f472b6', glow: 'rgba(244, 114, 182, 0.45)', label: 'Conj.' },
  'Prep.': { main: '#e879f9', glow: 'rgba(232, 121, 249, 0.45)', label: 'Prep.' },
  'Frase': { main: '#fbbf24', glow: 'rgba(251, 191, 36, 0.45)', label: 'Frase' },
  // English & Shared POS
  'Noun': { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', label: 'Noun' },
  'Verb': { main: '#a78bfa', glow: 'rgba(167, 139, 250, 0.45)', label: 'Verb' },
  'Adj.': { main: '#34d399', glow: 'rgba(52, 211, 153, 0.45)', label: 'Adj.' },
  'Adv.': { main: '#e879f9', glow: 'rgba(232, 121, 249, 0.45)', label: 'Adv.' },
  'Pron.': { main: '#f472b6', glow: 'rgba(244, 114, 182, 0.45)', label: 'Pron.' },
  'sich': { main: '#c084fc', glow: 'rgba(192, 132, 252, 0.45)', label: 'sich' },
  'Phrase': { main: '#fbbf24', glow: 'rgba(251, 191, 36, 0.45)', label: 'Phrase' },
  'Satz': { main: '#2dd4bf', glow: 'rgba(45, 212, 191, 0.45)', label: 'Satz' },
  // Русский
  'Сущ.': { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', label: 'Сущ.' },
  'Глаг.': { main: '#a78bfa', glow: 'rgba(167, 139, 250, 0.45)', label: 'Глаг.' },
  'Прил.': { main: '#34d399', glow: 'rgba(52, 211, 153, 0.45)', label: 'Прил.' },
  'Нареч.': { main: '#e879f9', glow: 'rgba(232, 121, 249, 0.45)', label: 'Нареч.' },
  'Союз': { main: '#f472b6', glow: 'rgba(244, 114, 182, 0.45)', label: 'Союз' },
  'Предл.': { main: '#e879f9', glow: 'rgba(232, 121, 249, 0.45)', label: 'Предл.' },
  'Фраза': { main: '#fbbf24', glow: 'rgba(251, 191, 36, 0.45)', label: 'Фраза' },
  // Українська
  'Імен.': { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', label: 'Імен.' },
  'Дієсл.': { main: '#a78bfa', glow: 'rgba(167, 139, 250, 0.45)', label: 'Дієсл.' },
  'Прикм.': { main: '#34d399', glow: 'rgba(52, 211, 153, 0.45)', label: 'Прикм.' },
  'Присл.': { main: '#e879f9', glow: 'rgba(232, 121, 249, 0.45)', label: 'Присл.' },
  'Спол.': { main: '#f472b6', glow: 'rgba(244, 114, 182, 0.45)', label: 'Спол.' },
  'Прийм.': { main: '#e879f9', glow: 'rgba(232, 121, 249, 0.45)', label: 'Прийм.' },
  // Türkçe
  'İsim': { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', label: 'İsim' },
  'Fiil': { main: '#a78bfa', glow: 'rgba(167, 139, 250, 0.45)', label: 'Fiil' },
  'Sıfat': { main: '#34d399', glow: 'rgba(52, 211, 153, 0.45)', label: 'Sıfat' },
  'Zarf': { main: '#e879f9', glow: 'rgba(232, 121, 249, 0.45)', label: 'Zarf' },
  'Bağlaç': { main: '#f472b6', glow: 'rgba(244, 114, 182, 0.45)', label: 'Bağlaç' },
  'Edat': { main: '#e879f9', glow: 'rgba(232, 121, 249, 0.45)', label: 'Edat' },
  'İfade': { main: '#fbbf24', glow: 'rgba(251, 191, 36, 0.45)', label: 'İfade' },
  // עברית
  'ש״ע': { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', label: 'ש״ע' },
  'פועל': { main: '#a78bfa', glow: 'rgba(167, 139, 250, 0.45)', label: 'פועל' },
  'תואר': { main: '#34d399', glow: 'rgba(52, 211, 153, 0.45)', label: 'תואר' },
  'תה״פ': { main: '#e879f9', glow: 'rgba(232, 121, 249, 0.45)', label: 'תה״פ' },
  'מילת חיבור': { main: '#f472b6', glow: 'rgba(244, 114, 182, 0.45)', label: 'מילת חיבור' },
  'ביטוי': { main: '#fbbf24', glow: 'rgba(251, 191, 36, 0.45)', label: 'ביטוי' },
  // العربية
  'اسم': { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', label: 'اسم' },
  'فعل': { main: '#a78bfa', glow: 'rgba(167, 139, 250, 0.45)', label: 'فعل' },
  'صفة': { main: '#34d399', glow: 'rgba(52, 211, 153, 0.45)', label: 'صفة' },
  'ظرف': { main: '#e879f9', glow: 'rgba(232, 121, 249, 0.45)', label: 'ظرف' },
  'حرف': { main: '#f472b6', glow: 'rgba(244, 114, 182, 0.45)', label: 'حرف' },
  'عبارة': { main: '#fbbf24', glow: 'rgba(251, 191, 36, 0.45)', label: 'عبارة' }
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
  {
    id: 'Kore',
    tones: {
      ru: 'Чёткий студийный (Ж)', en: 'Crisp studio (F)', de: 'Klar Studio (W)', es: 'Estudio claro (F)',
      uk: 'Чіткий студійний (Ж)', tr: 'Net stüdyo (K)', he: 'אולפני וברור (נ)', ar: 'استوديو واضح (أنثى)'
    }
  },
  {
    id: 'Puck',
    tones: {
      ru: 'Энергичный и живой (М)', en: 'Energetic & bright (M)', de: 'Lebhaft & klar (M)', es: 'Enérgico y vivo (M)',
      uk: 'Енергійний і живий (Ч)', tr: 'Enerjik ve canlı (E)', he: 'אנרגטי וחי (ג)', ar: 'حيوي ونشيط (ذكر)'
    }
  },
  {
    id: 'Charon',
    tones: {
      ru: 'Глубокий диктор (М)', en: 'Deep narrator (M)', de: 'Tiefer Sprecher (M)', es: 'Locutor profundo (M)',
      uk: 'Глибокий диктор (Ч)', tr: 'Derin spiker (E)', he: 'קריין עמוק (ג)', ar: 'مذيع عميق (ذكر)'
    }
  },
  {
    id: 'Aoede',
    tones: {
      ru: 'Мягкий и тёплый (Ж)', en: 'Warm & smooth (F)', de: 'Warm & weich (W)', es: 'Suave y cálido (F)',
      uk: 'М’який і теплий (Ж)', tr: 'Sıcak ve yumuşak (K)', he: 'רך ונעים (נ)', ar: 'دافئ وناعم (أنثى)'
    }
  },
  {
    id: 'Fenrir',
    tones: {
      ru: 'Динамичный драйв (М)', en: 'Dynamic drive (M)', de: 'Dynamisch (M)', es: 'Dinámico (M)',
      uk: 'Динамічний драйв (Ч)', tr: 'Dinamik ve güçlü (E)', he: 'דינמי ונמרץ (ג)', ar: 'حماسي وديناميكي (ذكر)'
    }
  },
  {
    id: 'Leda',
    tones: {
      ru: 'Чистый и светлый (Ж)', en: 'Clear & light (F)', de: 'Hell & klar (W)', es: 'Limpio y brillante (F)',
      uk: 'Чистий і світлий (Ж)', tr: 'Berrak ve hafif (K)', he: 'צלול ובהיר (נ)', ar: 'صافٍ ومشرق (أنثى)'
    }
  }
];

export const TARGET_LANG_META = {
  de: {
    flag: '🇩🇪',
    code: 'DE',
    heroBrand: '🚀 Z-DEUTSCH',
    sampleWord: 'der Start',
    speechStyle: 'clear, natural Standard German pronunciation, crisp diction, warm studio voice',
    bcp47: 'de-DE',
    dir: 'ltr',
    script: 'latin',
    names: {
      ru: 'Немецкий', en: 'German', de: 'Deutsch', es: 'Alemán',
      uk: 'Німецька', tr: 'Almanca', he: 'גרמנית', ar: 'الألمانية'
    }
  },
  en: {
    flag: '🇬🇧',
    code: 'EN',
    heroBrand: '🚀 Z-ENGLISH',
    sampleWord: 'opportunity',
    speechStyle: 'clear, natural English pronunciation, crisp diction, warm studio voice',
    bcp47: 'en-US',
    dir: 'ltr',
    script: 'latin',
    names: {
      ru: 'Английский', en: 'English', de: 'Englisch', es: 'Inglés',
      uk: 'Англійська', tr: 'İngilizce', he: 'אנגלית', ar: 'الإنجليزية'
    }
  },
  es: {
    flag: '🇪🇸',
    code: 'ES',
    heroBrand: '🚀 Z-ESPAÑOL',
    sampleWord: 'la oportunidad',
    speechStyle: 'clear, natural Spanish pronunciation, crisp diction, warm studio voice',
    bcp47: 'es-ES',
    dir: 'ltr',
    script: 'latin',
    names: {
      ru: 'Испанский', en: 'Spanish', de: 'Spanisch', es: 'Español',
      uk: 'Іспанська', tr: 'İspanyolca', he: 'ספרדית', ar: 'الإسبانية'
    }
  },
  ru: {
    flag: '🇷🇺',
    code: 'RU',
    heroBrand: '🚀 Z-RUSSIAN',
    sampleWord: 'ответственность',
    speechStyle: 'clear, natural Standard Russian pronunciation, crisp diction, warm studio voice',
    bcp47: 'ru-RU',
    dir: 'ltr',
    script: 'cyrillic',
    names: {
      ru: 'Русский', en: 'Russian', de: 'Russisch', es: 'Ruso',
      uk: 'Російська', tr: 'Rusça', he: 'רוסית', ar: 'الروسية'
    }
  },
  uk: {
    flag: '🇺🇦',
    code: 'UK',
    heroBrand: '🚀 Z-UKRAINIAN',
    sampleWord: 'можливість',
    speechStyle: 'clear, natural Standard Ukrainian pronunciation, crisp diction, warm studio voice',
    bcp47: 'uk-UA',
    dir: 'ltr',
    script: 'cyrillic',
    names: {
      ru: 'Украинский', en: 'Ukrainian', de: 'Ukrainisch', es: 'Ucraniano',
      uk: 'Українська', tr: 'Ukraynaca', he: 'אוקראינית', ar: 'الأوكرانية'
    }
  },
  tr: {
    flag: '🇹🇷',
    code: 'TR',
    heroBrand: '🚀 Z-TÜRKÇE',
    sampleWord: 'başlangıç',
    speechStyle: 'clear, natural Standard Turkish pronunciation, crisp diction, warm studio voice',
    bcp47: 'tr-TR',
    dir: 'ltr',
    script: 'latin',
    names: {
      ru: 'Турецкий', en: 'Turkish', de: 'Türkisch', es: 'Turco',
      uk: 'Турецька', tr: 'Türkçe', he: 'טורקית', ar: 'التركية'
    }
  },
  he: {
    flag: '🇮🇱',
    code: 'HE',
    heroBrand: '🚀 Z-HEBREW',
    sampleWord: 'התחלה',
    speechStyle: 'clear, natural Modern Israeli Hebrew pronunciation, crisp diction, warm studio voice',
    bcp47: 'he-IL',
    dir: 'rtl',
    script: 'hebrew',
    names: {
      ru: 'Иврит', en: 'Hebrew', de: 'Hebräisch', es: 'Hebreo',
      uk: 'Іврит', tr: 'İbranice', he: 'עברית', ar: 'العبرية'
    }
  },
  ar: {
    flag: '🇸🇦',
    code: 'AR',
    heroBrand: '🚀 Z-ARABIC',
    sampleWord: 'البداية',
    speechStyle: 'clear, natural Modern Standard Arabic pronunciation, crisp diction, warm studio voice',
    bcp47: 'ar-SA',
    dir: 'rtl',
    script: 'arabic',
    names: {
      ru: 'Арабский', en: 'Arabic', de: 'Arabisch', es: 'Árabe',
      uk: 'Арабська', tr: 'Arapça', he: 'ערבית', ar: 'العربية'
    }
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
  ],
  tr: [
    [
      { k: 'q', l: 'Q' }, { k: 'w', l: 'W' }, { k: 'e', l: 'E' }, { k: 'r', l: 'R' }, { k: 't', l: 'T' },
      { k: 'y', l: 'Y' }, { k: 'u', l: 'U', sub: 'ü' }, { k: 'i', l: 'I', sub: 'ı' }, { k: 'o', l: 'O', sub: 'ö' }, { k: 'p', l: 'P' }
    ],
    [
      { k: 'a', l: 'A' }, { k: 's', l: 'S', sub: 'ş' }, { k: 'd', l: 'D' }, { k: 'f', l: 'F' },
      { k: 'g', l: 'G', sub: 'ğ' }, { k: 'h', l: 'H' }, { k: 'j', l: 'J' }, { k: 'k', l: 'K' }, { k: 'l', l: 'L' }
    ],
    [
      { action: 'reset' },
      { k: 'z', l: 'Z' }, { k: 'x', l: 'X' }, { k: 'c', l: 'C', sub: 'ç' }, { k: 'v', l: 'V' },
      { k: 'b', l: 'B' }, { k: 'n', l: 'N' }, { k: 'm', l: 'M' },
      { action: 'emp' }
    ]
  ],
  ru: [
    [
      { k: 'й', l: 'Й' }, { k: 'ц', l: 'Ц' }, { k: 'у', l: 'У' }, { k: 'к', l: 'К' }, { k: 'е', l: 'Е', sub: 'ё' },
      { k: 'н', l: 'Н' }, { k: 'г', l: 'Г' }, { k: 'ш', l: 'Ш' }, { k: 'щ', l: 'Щ' }, { k: 'з', l: 'З' }, { k: 'х', l: 'Х' }
    ],
    [
      { k: 'ф', l: 'Ф' }, { k: 'ы', l: 'Ы' }, { k: 'в', l: 'В' }, { k: 'а', l: 'А' }, { k: 'п', l: 'П' },
      { k: 'р', l: 'Р' }, { k: 'о', l: 'О' }, { k: 'л', l: 'Л' }, { k: 'д', l: 'Д' }, { k: 'ж', l: 'Ж' }, { k: 'э', l: 'Э' }
    ],
    [
      { action: 'reset' },
      { k: 'я', l: 'Я' }, { k: 'ч', l: 'Ч' }, { k: 'с', l: 'С' }, { k: 'м', l: 'М' }, { k: 'и', l: 'И' },
      { k: 'т', l: 'Т' }, { k: 'ь', l: 'Ь', sub: 'ъ' }, { k: 'б', l: 'Б' }, { k: 'ю', l: 'Ю' },
      { action: 'emp' }
    ]
  ],
  uk: [
    [
      { k: 'й', l: 'Й' }, { k: 'ц', l: 'Ц' }, { k: 'у', l: 'У' }, { k: 'к', l: 'К' }, { k: 'е', l: 'Е' },
      { k: 'н', l: 'Н' }, { k: 'г', l: 'Г', sub: 'ґ' }, { k: 'ш', l: 'Ш' }, { k: 'щ', l: 'Щ' }, { k: 'з', l: 'З' }, { k: 'х', l: 'Х' }
    ],
    [
      { k: 'ф', l: 'Ф' }, { k: 'і', l: 'І', sub: 'ї' }, { k: 'в', l: 'В' }, { k: 'а', l: 'А' }, { k: 'п', l: 'П' },
      { k: 'р', l: 'Р' }, { k: 'о', l: 'О' }, { k: 'л', l: 'Л' }, { k: 'д', l: 'Д' }, { k: 'ж', l: 'Ж' }, { k: 'є', l: 'Є' }
    ],
    [
      { action: 'reset' },
      { k: 'я', l: 'Я' }, { k: 'ч', l: 'Ч' }, { k: 'с', l: 'С' }, { k: 'м', l: 'М' }, { k: 'и', l: 'И' },
      { k: 'т', l: 'Т' }, { k: 'ь', l: 'Ь' }, { k: 'б', l: 'Б' }, { k: 'ю', l: 'Ю' },
      { action: 'emp' }
    ]
  ],
  he: [
    [
      { k: 'ק', l: 'ק' }, { k: 'ר', l: 'ר' }, { k: 'א', l: 'א' }, { k: 'ט', l: 'ט' },
      { k: 'ו', l: 'ו' }, { k: 'ן', l: 'ן' }, { k: 'ם', l: 'ם' }, { k: 'פ', l: 'פ' }
    ],
    [
      { k: 'ש', l: 'ש' }, { k: 'ד', l: 'ד' }, { k: 'ג', l: 'ג' }, { k: 'כ', l: 'כ' },
      { k: 'ע', l: 'ע' }, { k: 'י', l: 'י' }, { k: 'ח', l: 'ח' }, { k: 'ל', l: 'ל' }, { k: 'ך', l: 'ך' }, { k: 'ף', l: 'ף' }
    ],
    [
      { action: 'reset' },
      { k: 'ז', l: 'ז' }, { k: 'ס', l: 'ס' }, { k: 'ב', l: 'ב' }, { k: 'ה', l: 'ה' },
      { k: 'נ', l: 'נ' }, { k: 'מ', l: 'מ' }, { k: 'צ', l: 'צ' }, { k: 'ת', l: 'ת' }, { k: 'ץ', l: 'ץ' },
      { action: 'emp' }
    ]
  ],
  ar: [
    [
      { k: 'ض', l: 'ض' }, { k: 'ص', l: 'ص' }, { k: 'ث', l: 'ث' }, { k: 'ق', l: 'ق' }, { k: 'ف', l: 'ف' },
      { k: 'غ', l: 'غ' }, { k: 'ع', l: 'ع' }, { k: 'ه', l: 'ه' }, { k: 'خ', l: 'خ' }, { k: 'ح', l: 'ح' }, { k: 'ج', l: 'ج' }
    ],
    [
      { k: 'ش', l: 'ش' }, { k: 'س', l: 'س' }, { k: 'ي', l: 'ي' }, { k: 'ب', l: 'ب' }, { k: 'ل', l: 'ل' },
      { k: 'ا', l: 'ا', sub: 'أ' }, { k: 'ت', l: 'ت' }, { k: 'ن', l: 'ن' }, { k: 'م', l: 'م' }, { k: 'ك', l: 'ك' }, { k: 'ط', l: 'ط' }
    ],
    [
      { action: 'reset' },
      { k: 'ذ', l: 'ذ' }, { k: 'د', l: 'د' }, { k: 'ر', l: 'ر' }, { k: 'ز', l: 'ز' }, { k: 'و', l: 'و', sub: 'ؤ' },
      { k: 'ظ', l: 'ظ' }, { k: 'ة', l: 'ة' }, { k: 'ى', l: 'ى' }, { k: 'ء', l: 'ء' },
      { action: 'emp' }
    ]
  ]
};

export const CANVAS_WORD_FONT = '"Rubik", "Noto Sans Hebrew", "Noto Sans Arabic", sans-serif';
export const CANVAS_HEADING_FONT = '"Exo 2", "Rubik", "Noto Sans Hebrew", "Noto Sans Arabic", sans-serif';
