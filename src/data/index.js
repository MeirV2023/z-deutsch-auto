// Единая точка сборки встроенного каталога курсов Z-LINGO (SRP / OCP)
import { TARGET_LANGUAGES, NATIVE_LANGUAGES, BASE_CATEGORIES } from './catalog-meta.js';
import { COURSES_DE } from './courses-de.js';
import { COURSES_EN } from './courses-en.js';
import { COURSES_ES } from './courses-es.js';

export const GAME_CATALOG = {
  targetLanguages: TARGET_LANGUAGES,
  nativeLanguages: NATIVE_LANGUAGES,
  courses: {
    de: COURSES_DE,
    en: COURSES_EN,
    es: COURSES_ES
  },
  categories: BASE_CATEGORIES
};

if (typeof window !== 'undefined') {
  window.GAME_CATALOG = GAME_CATALOG;
}
