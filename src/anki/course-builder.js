// Построитель модульных курсов игрока и парсер учебных блоков Супер-Админа
import { detectDeckCefrLevel } from './text-utils.js';
import { normalizeCardToWordEntry } from './field-mapper.js';

// --- Сборка трёхступенчатого личного курса игрока (с группировкой по подколодам Anki + Босс-уроками!) ---
export function buildUserCourse({
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


// --- Умный парсер учебных списков Супер-Админа (поддерживает (Тема), Start, der (-s);..., Inhaber/in, der/die (-/-nen);...) ---
function parseSingleAdminVocabLine(frontInput, backInput, targetLang = 'de', inputTransLang = 'ru', sectionTag = '') {
  const rawFront = String(frontInput || '').replace(/\s+/g, ' ').trim();
  const rawBack = String(backInput || '').replace(/\s+/g, ' ').trim();
  if (!rawFront || !rawBack) return null;

  // Разбор переводов: можно передать один язык (напр. RU) или сразу 3 через "|" (RU | EN | HE)
  const backCols = rawBack.split(/\s*\|\s*/).map(s => s.trim()).filter(Boolean);
  const primaryTrans = backCols[0] || rawBack;
  const translations = {
    ru: inputTransLang === 'ru' ? primaryTrans : (backCols.find(c => /[а-яёА-ЯЁ]/.test(c) && !/[іїєґІЇЄҐ]/.test(c)) || primaryTrans),
    uk: inputTransLang === 'uk' ? primaryTrans : (backCols.find(c => /[іїєґІЇЄҐ]/.test(c)) || primaryTrans),
    en: inputTransLang === 'en' ? primaryTrans : (backCols.find(c => !/[а-яёА-ЯЁіїєґІЇЄҐ\u0590-\u05FF\u0600-\u06FF]/.test(c)) || primaryTrans),
    de: inputTransLang === 'de' ? primaryTrans : primaryTrans,
    es: inputTransLang === 'es' ? primaryTrans : primaryTrans,
    tr: inputTransLang === 'tr' ? primaryTrans : (backCols.find(c => /[çğıİöşüÇĞÖŞÜ]/.test(c)) || primaryTrans),
    he: inputTransLang === 'he' ? primaryTrans : (backCols.find(c => /[\u0590-\u05FF]/.test(c)) || primaryTrans),
    ar: inputTransLang === 'ar' ? primaryTrans : (backCols.find(c => /[\u0600-\u06FF]/.test(c)) || primaryTrans)
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

export function parseAdminTextbookBlock(rawText, targetLang = 'de', inputTransLang = 'ru') {
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
export function buildOfficialAdminCourse({
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
    de: (titles && titles.de) || fallbackTitle,
    es: (titles && titles.es) || fallbackTitle,
    uk: (titles && titles.uk) || fallbackTitle,
    tr: (titles && titles.tr) || fallbackTitle,
    he: (titles && titles.he) || fallbackTitle,
    ar: (titles && titles.ar) || fallbackTitle
  };

  const resolvedDescs = {
    ru: (descriptions && descriptions.ru) || `Официальный курс (${cleanWords.length} сл. · уровень ${levelTag}).`,
    en: (descriptions && descriptions.en) || `Official course (${cleanWords.length} words · level ${levelTag}).`,
    de: (descriptions && descriptions.de) || `Offizieller Kurs (${cleanWords.length} Wörter · Niveau ${levelTag}).`,
    es: (descriptions && descriptions.es) || `Curso oficial (${cleanWords.length} palabras · nivel ${levelTag}).`,
    uk: (descriptions && descriptions.uk) || `Офіційний курс (${cleanWords.length} сл. · рівень ${levelTag}).`,
    tr: (descriptions && descriptions.tr) || `Resmî kurs (${cleanWords.length} kelime · seviye ${levelTag}).`,
    he: (descriptions && descriptions.he) || `קורס רשמי (${cleanWords.length} מילים · רמה ${levelTag}).`,
    ar: (descriptions && descriptions.ar) || `دورة رسمية (${cleanWords.length} كلمة · مستوى ${levelTag}).`
  };

  // Обновляем описания уроков со «Личный набор» на «Официальный урок»
  const officialModules = (builtLikeUser.modules || []).map((m, mIdx) => {
    const modTitleBase = m.subdeckTag || resolvedTitles.ru;
    return {
      ...m,
      titles: m.subdeckTag ? m.titles : {
        ru: `Модуль ${mIdx + 1}: ${resolvedTitles.ru}`,
        en: `Module ${mIdx + 1}: ${resolvedTitles.en}`,
        de: `Modul ${mIdx + 1}: ${resolvedTitles.de}`,
        es: `Módulo ${mIdx + 1}: ${resolvedTitles.es}`,
        uk: `Модуль ${mIdx + 1}: ${resolvedTitles.uk}`,
        tr: `Modül ${mIdx + 1}: ${resolvedTitles.tr}`,
        he: `מודול ${mIdx + 1}: ${resolvedTitles.he}`,
        ar: `الوحدة ${mIdx + 1}: ${resolvedTitles.ar}`
      },
      lessons: (m.lessons || []).map((ls, lIdx) => {
        if (ls.isBoss) return ls;
        const cnt = (ls.words || []).length;
        const partN = mIdx * 3 + lIdx + 1;
        return {
          ...ls,
          titles: m.subdeckTag ? ls.titles : {
            ru: `${resolvedTitles.ru} · Часть ${partN}`,
            en: `${resolvedTitles.en} · Part ${partN}`,
            de: `${resolvedTitles.de} · Teil ${partN}`,
            es: `${resolvedTitles.es} · Parte ${partN}`,
            uk: `${resolvedTitles.uk} · Частина ${partN}`,
            tr: `${resolvedTitles.tr} · Bölüm ${partN}`,
            he: `${resolvedTitles.he} · חלק ${partN}`,
            ar: `${resolvedTitles.ar} · الجزء ${partN}`
          },
          descriptions: {
            ru: `Тема «${modTitleBase}» (${cnt} сл. · уровень ${levelTag}).`,
            en: `Topic "${resolvedTitles.en}" (${cnt} words · level ${levelTag}).`,
            de: `Thema „${resolvedTitles.de}“ (${cnt} Wörter · Niveau ${levelTag}).`,
            es: `Tema "${resolvedTitles.es}" (${cnt} palabras · nivel ${levelTag}).`,
            uk: `Тема «${resolvedTitles.uk}» (${cnt} сл. · рівень ${levelTag}).`,
            tr: `Konu "${resolvedTitles.tr}" (${cnt} kelime · seviye ${levelTag}).`,
            he: `נושא «${resolvedTitles.he}» (${cnt} מילים · רמה ${levelTag}).`,
            ar: `الموضوع «${resolvedTitles.ar}» (${cnt} كلمة · مستوى ${levelTag}).`
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

