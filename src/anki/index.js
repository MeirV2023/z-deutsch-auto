// Публичный фасад подсистемы Anki & Курсов (LSP / ISP)
import { cleanAnkiField, detectDeckCefrLevel } from './text-utils.js';
import { generateSampleApkgBlob } from './binary-sqlite.js';
import {
  parseUploadedDeckFile,
  normalizeCardToWordEntry,
  extractNormalizedWordsFromParsedDeck,
  inspectDeckTranslationHealth
} from './field-mapper.js';
import {
  buildUserCourse,
  parseAdminTextbookBlock,
  buildOfficialAdminCourse
} from './course-builder.js';
import {
  loadUserCourses,
  saveUserCourse,
  deleteUserCourse
} from './user-decks-repo.js';

export const AnkiImporter = {
  parseUploadedDeckFile,
  normalizeCardToWordEntry,
  parseAdminTextbookBlock,
  buildOfficialAdminCourse,
  extractNormalizedWordsFromParsedDeck,
  inspectDeckTranslationHealth,
  detectDeckCefrLevel,
  buildUserCourse,
  loadUserCourses,
  saveUserCourse,
  deleteUserCourse,
  generateSampleApkgBlob,
  cleanAnkiField
};

if (typeof window !== 'undefined') {
  window.AnkiImporter = AnkiImporter;
}
