// Единая точка сборки встроенного каталога курсов VOCANOVA (SRP / OCP)
import { TARGET_LANGUAGES, NATIVE_LANGUAGES, BASE_CATEGORIES } from './catalog-meta.js';
import { buildAllCoursesMap } from './b1-catalog-builder.js';

export const GAME_CATALOG = {
  targetLanguages: TARGET_LANGUAGES,
  nativeLanguages: NATIVE_LANGUAGES,
  courses: buildAllCoursesMap(),
  categories: BASE_CATEGORIES
};

if (typeof window !== 'undefined') {
  window.GAME_CATALOG = GAME_CATALOG;
}
