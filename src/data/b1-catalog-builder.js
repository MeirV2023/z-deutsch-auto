// Единый построитель каталога VOCANOVA (A2 + B1) для всех 8 изучаемых языков (0 дублирования слов, уроки по ~15 слов)
import { ALL_LANG_CODES, REAL_ARTICLES } from '../config/constants.js';
import { THEME_A2_ALLTAG_FAMILIE } from './a2-themes/alltag-familie.js';
import { THEME_A2_SCHULE_BERUF } from './a2-themes/schule-beruf.js';
import { THEME_A2_MEDIEN_KINO } from './a2-themes/medien-kino.js';
import { THEME_A2_EREIGNISSE_GEFUEHLE } from './a2-themes/ereignisse-gefuehle.js';
import { THEME_A2_STADT_BEHOERDEN } from './a2-themes/stadt-behoerden.js';
import { THEME_A2_BERUF_BAHNHOF } from './a2-themes/beruf-bahnhof.js';
import { THEME_A2_VERKEHR_ROUTEN } from './a2-themes/verkehr-routen.js';
import { THEME_A2_LERNEN_PRUEFUNGEN } from './a2-themes/lernen-pruefungen.js';
import { THEME_A2_SPORT_REISEN } from './a2-themes/sport-reisen.js';
import { THEME_A2_WOHNEN_NACHBARN } from './a2-themes/wohnen-nachbarn.js';
import { THEME_A2_LEBENSPHASEN_AUSFLUG } from './a2-themes/lebensphasen-ausflug.js';
import { THEME_A2_KULTUR_FESTIVALS } from './a2-themes/kultur-festivals.js';
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

export const A2_THEMES = [
  THEME_A2_ALLTAG_FAMILIE,
  THEME_A2_SCHULE_BERUF,
  THEME_A2_MEDIEN_KINO,
  THEME_A2_EREIGNISSE_GEFUEHLE,
  THEME_A2_STADT_BEHOERDEN,
  THEME_A2_BERUF_BAHNHOF,
  THEME_A2_VERKEHR_ROUTEN,
  THEME_A2_LERNEN_PRUEFUNGEN,
  THEME_A2_SPORT_REISEN,
  THEME_A2_WOHNEN_NACHBARN,
  THEME_A2_LEBENSPHASEN_AUSFLUG,
  THEME_A2_KULTUR_FESTIVALS
];

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

export const ALL_THEMES = [...A2_THEMES, ...B1_THEMES];

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

function buildLessonDescriptions(themeTitles, lessonNum, count, levelTag = 'B1') {
  return {
    ru: `${themeTitles.ru} — урок ${lessonNum} (${count} слов ${levelTag}).`,
    en: `${themeTitles.en} — lesson ${lessonNum} (${count} ${levelTag} words).`,
    de: `${themeTitles.de} — Lektion ${lessonNum} (${count} ${levelTag}-Wörter).`,
    es: `${themeTitles.es} — lección ${lessonNum} (${count} palabras ${levelTag}).`,
    uk: `${themeTitles.uk} — урок ${lessonNum} (${count} слів ${levelTag}).`,
    tr: `${themeTitles.tr} — ders ${lessonNum} (${count} ${levelTag} kelime).`,
    he: `${themeTitles.he} — שלב ${lessonNum} (${count} מילים ${levelTag}).`,
    ar: `${themeTitles.ar} — الدرس ${lessonNum} (${count} كلمة ${levelTag}).`
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
  return ALL_THEMES.map(theme => {
    const levelTag = String(theme.levelTag || 'B1').toUpperCase();
    const courseId = `${targetLang}-${levelTag.toLowerCase()}-${theme.slug}`;
    const chunks = splitIntoLessonsOf15(theme.items);
    const lessons = chunks.map((chunk, idx) => {
      const lessonNum = idx + 1;
      const words = chunk.map(it => buildWordEntryForLang(it, targetLang)).filter(Boolean);
      return {
        id: `${courseId}-m1-l${lessonNum}`,
        speedMultiplier: 0.9,
        spawnIntervalMs: 2750,
        titles: buildLessonTitles(lessonNum, words.length),
        descriptions: buildLessonDescriptions(theme.titles, lessonNum, words.length, levelTag),
        words
      };
    });

    return {
      id: courseId,
      targetLang,
      category: theme.category,
      source: 'official',
      icon: theme.icon,
      levelTag,
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
