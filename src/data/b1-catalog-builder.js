// Единый построитель B1-каталога VOCANOVA для всех 8 изучаемых языков (0 дублирования слов, уроки по ~15 слов)
import { ALL_LANG_CODES, REAL_ARTICLES } from '../config/constants.js';
import { THEME_EIN_NEUER_START } from './b1-themes/ein-neuer-start.js';
import { THEME_BEWERBUNG_FIRMA } from './b1-themes/bewerbung-firma.js';
import { THEME_ARBEITSWELT } from './b1-themes/arbeitswelt.js';
import { THEME_FAMILIE } from './b1-themes/familie.js';
import { THEME_DIGITALE_WELT } from './b1-themes/digitale-welt.js';
import { THEME_GESUNDHEIT } from './b1-themes/gesundheit.js';
import { THEME_REISEN_VERKEHR } from './b1-themes/reisen-verkehr.js';
import { THEME_NATUR_UMWELT } from './b1-themes/natur-umwelt.js';
import { THEME_POLITIK_GESELLSCHAFT } from './b1-themes/politik-gesellschaft.js';
import { THEME_DAMALS_HEUTE } from './b1-themes/damals-heute.js';
import { THEME_WUENSCHE } from './b1-themes/wuensche.js';
import { THEME_WIE_WIRD_ES_SEIN } from './b1-themes/wie-wird-es-sein.js';

export const B1_THEMES = [
  THEME_EIN_NEUER_START,
  THEME_BEWERBUNG_FIRMA,
  THEME_ARBEITSWELT,
  THEME_FAMILIE,
  THEME_DIGITALE_WELT,
  THEME_GESUNDHEIT,
  THEME_REISEN_VERKEHR,
  THEME_NATUR_UMWELT,
  THEME_POLITIK_GESELLSCHAFT,
  THEME_DAMALS_HEUTE,
  THEME_WUENSCHE,
  THEME_WIE_WIRD_ES_SEIN
];

export function splitIntoLessonsOf15(items) {
  if (!Array.isArray(items) || items.length === 0) return [];
  const total = items.length;
  const fullChunks = Math.floor(total / 15);
  const rem = total % 15;

  let sizes = [];
  for (let i = 0; i < fullChunks; i++) sizes.push(15);
  if (rem > 0) sizes.push(rem);

  if (sizes.length >= 2) {
    const tailLen = sizes[sizes.length - 1];
    if (tailLen <= 3) {
      sizes.pop();
      for (let j = 0; j < tailLen; j++) {
        const idx = sizes.length - tailLen + j;
        if (idx >= 0) sizes[idx] += 1;
        else sizes[j % sizes.length] += 1;
      }
    } else if (tailLen <= 7) {
      const a = sizes.pop();
      const b = sizes.pop();
      const sum = a + b;
      const firstHalf = Math.ceil(sum / 2);
      sizes.push(firstHalf, sum - firstHalf);
    }
  }

  const result = [];
  let cursor = 0;
  for (const sz of sizes) {
    result.push(items.slice(cursor, cursor + sz));
    cursor += sz;
  }
  return result;
}

function buildWordEntryForLang(item, targetLang) {
  const src = item[targetLang];
  if (!src || !src.w) return null;

  const word = src.w;
  const art = src.art || '';
  const hasRealArt = REAL_ARTICLES.has(art);
  const primaryArt = art.includes('/') ? art.split('/')[0] : art;
  const withArticle = hasRealArt ? `${primaryArt} ${word}` : word;

  let raw = word;
  if (targetLang === 'de') {
    raw = src.raw || withArticle;
  } else if (targetLang === 'es' && hasRealArt) {
    raw = `${art} ${word}`;
  }

  const translations = {};
  for (const lg of ALL_LANG_CODES) {
    translations[lg] = (item[lg] && item[lg].tr) ? item[lg].tr : '';
  }

  return {
    raw,
    word,
    withArticle,
    article: art,
    plural: src.pl || '',
    translations
  };
}

function buildLessonTitles(lessonNum, count) {
  return {
    ru: `Урок ${lessonNum} · ${count} сл.`,
    en: `Lesson ${lessonNum} · ${count} wds`,
    de: `Lektion ${lessonNum} · ${count} W.`,
    es: `Lección ${lessonNum} · ${count} pal.`,
    uk: `Урок ${lessonNum} · ${count} сл.`,
    tr: `Ders ${lessonNum} · ${count} kel.`,
    he: `שלב ${lessonNum} · ${count} מיל׳`,
    ar: `الدرس ${lessonNum} · ${count} ك.`
  };
}

function buildLessonDescriptions(themeTitles, lessonNum, count) {
  return {
    ru: `${themeTitles.ru} — урок ${lessonNum} (${count} слов B1).`,
    en: `${themeTitles.en} — lesson ${lessonNum} (${count} B1 words).`,
    de: `${themeTitles.de} — Lektion ${lessonNum} (${count} B1-Wörter).`,
    es: `${themeTitles.es} — lección ${lessonNum} (${count} palabras B1).`,
    uk: `${themeTitles.uk} — урок ${lessonNum} (${count} слів B1).`,
    tr: `${themeTitles.tr} — ders ${lessonNum} (${count} B1 kelime).`,
    he: `${themeTitles.he} — שלב ${lessonNum} (${count} מילים B1).`,
    ar: `${themeTitles.ar} — الدرس ${lessonNum} (${count} كلمة B1).`
  };
}

function buildModuleTitles(themeTitles) {
  return {
    ru: `Модуль 1: ${themeTitles.ru}`,
    en: `Module 1: ${themeTitles.en}`,
    de: `Modul 1: ${themeTitles.de}`,
    es: `Módulo 1: ${themeTitles.es}`,
    uk: `Модуль 1: ${themeTitles.uk}`,
    tr: `Modül 1: ${themeTitles.tr}`,
    he: `מודול 1: ${themeTitles.he}`,
    ar: `الوحدة 1: ${themeTitles.ar}`
  };
}

export function buildCoursesForTargetLang(targetLang) {
  return B1_THEMES.map(theme => {
    const courseId = `${targetLang}-b1-${theme.slug}`;
    const chunks = splitIntoLessonsOf15(theme.items);
    const lessons = chunks.map((chunk, idx) => {
      const lessonNum = idx + 1;
      const words = chunk.map(it => buildWordEntryForLang(it, targetLang)).filter(Boolean);
      return {
        id: `${courseId}-m1-l${lessonNum}`,
        speedMultiplier: 0.9,
        spawnIntervalMs: 2750,
        titles: buildLessonTitles(lessonNum, words.length),
        descriptions: buildLessonDescriptions(theme.titles, lessonNum, words.length),
        words
      };
    });

    return {
      id: courseId,
      targetLang,
      category: theme.category,
      source: 'official',
      icon: theme.icon,
      levelTag: 'B1',
      titles: { ...theme.titles },
      descriptions: { ...theme.descriptions },
      modules: [
        {
          id: `${courseId}-m1`,
          titles: buildModuleTitles(theme.titles),
          lessons
        }
      ]
    };
  });
}

export function buildAllCoursesMap() {
  const courses = {};
  for (const lg of ALL_LANG_CODES) {
    courses[lg] = buildCoursesForTargetLang(lg);
  }
  return courses;
}
