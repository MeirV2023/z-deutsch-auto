// Адаптер локального хранилища (localStorage) и авто-определение локали браузера (SRP)

// --- Сохранение прогресса, выученных слов и слов со звёздочкой (localStorage) ---
export const STORAGE_KEY = 'zdeutsch_save_v2';
export const PINNED_STORAGE_KEY = 'zlingo_pinned_words_v1';
export const FAV_DECKS_KEY = 'zlingo_fav_decks_v1';
export const LEARNED_STORAGE_KEY = 'zlingo_learned_words_v1';
export const DAILY_PROGRESS_KEY = 'zlingo_daily_progress_v1';
export const KEY_STORAGE_NAME = 'zdeutsch_gemini_api_key';

export function getLocalIsoDateString(dateObj = new Date()) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function loadJsonStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

export function saveJsonStorage(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (_) {}
}

export function loadSavedSettings() {
  return loadJsonStorage(STORAGE_KEY, {});
}

export function saveSettingsPatch(patch) {
  const prev = loadSavedSettings();
  saveJsonStorage(STORAGE_KEY, { ...prev, ...patch });
}

// Авто-определение языка интерфейса и перевода по navigator.language при первом входе!
export function detectBrowserNativeLanguage() {
  const candidates = Array.isArray(navigator.languages) && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language || 'en'];
  for (const rawTag of candidates) {
    const tag = String(rawTag || '').toLowerCase();
    if (/^(ru|uk|be|kk)/.test(tag)) return 'ru';
    if (/^(he|iw)/.test(tag)) return 'he';
    if (/^en/.test(tag)) return 'en';
  }
  const primary = String(candidates[0] || '').toLowerCase();
  if (/^(ru|uk|be|kk)/.test(primary)) return 'ru';
  if (/^(he|iw)/.test(primary)) return 'he';
  return 'en';
}

export function detectDefaultTargetLanguage() {
  const primary = String(navigator.language || '').toLowerCase();
  // Если браузер немецкий — по умолчанию предложим учить английский, иначе немецкий (с 1-клик переключателем над кнопкой старта)
  if (primary.startsWith('de')) return 'en';
  return 'de';
}

export const ADMIN_CATALOG_LS_KEY = 'zlingo_admin_catalog_v1';
export const ADMIN_GH_TOKEN_LS_KEY = 'zlingo_admin_gh_token';
export const ADMIN_PASSWORD_LS_KEY = 'zlingo_admin_password';
