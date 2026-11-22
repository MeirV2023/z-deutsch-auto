// Центральное реактивное хранилище состояния игры и прогресса пилота (SRP / DIP)
// Изменения прогресса публикуются через EventBus, не связывая стор с конкретными UI-компонентами.

import { bus } from '../core/events.js';
import {
  PINNED_STORAGE_KEY,
  FAV_DECKS_KEY,
  LEARNED_STORAGE_KEY,
  DAILY_PROGRESS_KEY,
  RECENT_DECKS_LS_KEY,
  getLocalIsoDateString,
  loadJsonStorage,
  saveJsonStorage,
  loadSavedSettings,
  detectBrowserNativeLanguage,
  detectDefaultTargetLanguage
} from '../core/storage.js';
import { TARGET_LANG_META } from '../config/constants.js';
import { WEAPONS } from '../config/weapons.js';
import { UI_TEXT } from '../i18n/index.js';
import { GAME_CATALOG } from '../data/index.js';
import { sound } from '../services/sound-engine.js';

const initialSave = loadSavedSettings();

// Восстановление выученных слов (для прокачки оружия)
const savedLearnedArr = loadJsonStorage(LEARNED_STORAGE_KEY, []);
export const learnedWordsSet = new Set(Array.isArray(savedLearnedArr) ? savedLearnedArr : []);

// Если у игрока уже были закрытые уровни в старой версии — зачисляем стартовый бонус, чтобы не терялся прогресс
if (learnedWordsSet.size === 0 && Array.isArray(initialSave.completedLevelIds) && initialSave.completedLevelIds.length > 0) {
  const deAuto = (GAME_CATALOG.courses.de || [])[0];
  if (deAuto) {
    const creditLessons = Math.min(initialSave.completedLevelIds.length, 4);
    let credited = 0;
    for (const mod of deAuto.modules) {
      for (const ls of mod.lessons) {
        if (ls.isBoss) continue;
        if (credited < creditLessons) {
          ls.words.forEach(w => learnedWordsSet.add(`de::${w.word.toLowerCase()}`));
          credited++;
        }
      }
    }
    saveJsonStorage(LEARNED_STORAGE_KEY, Array.from(learnedWordsSet));
  }
}

// Восстановление слов со звёздочкой ⭐ («Повторить ещё раз») и избранных колод
const savedPinnedObj = loadJsonStorage(PINNED_STORAGE_KEY, {});
export const pinnedWordsMap = new Map(Object.entries(savedPinnedObj || {}));
const savedFavDecksArr = loadJsonStorage(FAV_DECKS_KEY, []);
export const favoriteDeckIds = new Set(Array.isArray(savedFavDecksArr) ? savedFavDecksArr : []);

const rawRecentDecks = loadJsonStorage(RECENT_DECKS_LS_KEY, []);
const recentDeckActivity = Array.isArray(rawRecentDecks)
  ? rawRecentDecks
      .filter(x => x && typeof x.courseId === 'string' && x.courseId)
      .slice(0, 15)
  : [];

export function recordDeckActivity(courseId, action = 'open') {
  if (!courseId) return;
  const idx = recentDeckActivity.findIndex(x => x.courseId === courseId);
  const entry = {
    courseId,
    ts: Date.now(),
    action: action || 'open'
  };
  if (idx !== -1) {
    recentDeckActivity.splice(idx, 1);
  }
  recentDeckActivity.unshift(entry);
  if (recentDeckActivity.length > 15) {
    recentDeckActivity.length = 15;
  }
  saveJsonStorage(RECENT_DECKS_LS_KEY, recentDeckActivity);
}

export function getRecentDeckActivity() {
  return recentDeckActivity.slice();
}

// Ударная серия дней подряд (🔥 Streak) и счётчик выученных за сегодня слов
export const dailyProgress = (() => {
  const today = getLocalIsoDateString();
  const saved = loadJsonStorage(DAILY_PROGRESS_KEY, {
    lastActiveDate: '',
    streakDays: 1,
    bestStreakDays: 1,
    todayDate: today,
    todayWords: []
  });
  let streak = Math.max(1, Number(saved.streakDays) || 1);
  let bestStreak = Math.max(streak, Number(saved.bestStreakDays) || 1);
  const lastDate = String(saved.lastActiveDate || '');

  if (!lastDate) {
    streak = 1;
  } else if (lastDate !== today) {
    const dPrev = new Date(`${lastDate}T00:00:00`);
    const dNow = new Date(`${today}T00:00:00`);
    const diffDays = Math.round((dNow - dPrev) / 86400000);
    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      streak = 1;
    }
  }
  bestStreak = Math.max(bestStreak, streak);
  const todayWords = saved.todayDate === today && Array.isArray(saved.todayWords)
    ? saved.todayWords
    : [];

  const normalized = {
    lastActiveDate: today,
    streakDays: streak,
    bestStreakDays: bestStreak,
    todayDate: today,
    todayWords
  };
  saveJsonStorage(DAILY_PROGRESS_KEY, normalized);
  return normalized;
})();

export const todayLearnedSet = new Set(dailyProgress.todayWords || []);

export function recordTodayWord(wordKey) {
  const today = getLocalIsoDateString();
  if (dailyProgress.todayDate !== today) {
    dailyProgress.todayDate = today;
    dailyProgress.lastActiveDate = today;
    todayLearnedSet.clear();
  }
  if (!todayLearnedSet.has(wordKey)) {
    todayLearnedSet.add(wordKey);
    dailyProgress.todayWords = Array.from(todayLearnedSet);
    saveJsonStorage(DAILY_PROGRESS_KEY, dailyProgress);
  }
}

function determineInitialNativeLang() {
  if (initialSave.nativeLang && UI_TEXT[initialSave.nativeLang]) {
    return initialSave.nativeLang;
  }
  if (initialSave.translationLang === 'he') return 'he';
  if (initialSave.translationLang === 'ru') return 'ru';
  return detectBrowserNativeLanguage();
}

const initialNativeLang = determineInitialNativeLang();
const initialTargetLang = (initialSave.targetLang && TARGET_LANG_META[initialSave.targetLang])
  ? initialSave.targetLang
  : detectDefaultTargetLanguage();

export const DAILY_GOAL_WORDS = 20;

export const state = {
  screenMode: 'title', // 'title' | 'play'
  running: false,
  paused: false,
  gameOver: false,
  overlayMode: 'pause', // 'intro' | 'complete' | 'gameover' | 'pause'
  activeQuiz: null,

  // Два независимых языковых фильтра
  targetLang: initialTargetLang, // 'de' | 'en' | 'es'
  nativeLang: initialNativeLang, // 'ru' | 'en' | 'he'
  nativeLangModes: [
    { id: 'ru', short: '🇷🇺 RU' },
    { id: 'en', short: '🇬🇧 EN' },
    { id: 'he', short: '🇮🇱 עברית' }
  ],

  // Режим обучения в Академии ('type' | 'listen' | 'translate') и клавиатура ПК
  studyMode: (initialSave.studyMode === 'listen' || initialSave.studyMode === 'translate')
    ? initialSave.studyMode
    : 'type',
  desktopKbdOpen: Boolean(initialSave.desktopKbdOpen),
  lastSpotlightEntry: null,
  lastSpotlightIsHit: false,
  lastPromoRect: null,

  // Трёхступенчатый выбор курса -> модуля -> урока + полноэкранная страница «Мои колоды» + Студия Супер-Админа
  userCourses: [],
  adminCatalog: (() => {
    try {
      const raw = localStorage.getItem('zlingo_admin_catalog_v1');
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && typeof parsed === 'object') {
        return {
          version: 1,
          updatedAt: parsed.updatedAt || '',
          categories: Array.isArray(parsed.categories) ? parsed.categories : [],
          courses: {
            de: (parsed.courses && Array.isArray(parsed.courses.de)) ? parsed.courses.de : [],
            en: (parsed.courses && Array.isArray(parsed.courses.en)) ? parsed.courses.en : [],
            es: (parsed.courses && Array.isArray(parsed.courses.es)) ? parsed.courses.es : []
          },
          courseOverrides: (parsed.courseOverrides && typeof parsed.courseOverrides === 'object')
            ? parsed.courseOverrides
            : {},
          deletedCourseIds: Array.isArray(parsed.deletedCourseIds) ? parsed.deletedCourseIds : []
        };
      }
    } catch (_) {}
    return {
      version: 1,
      updatedAt: '',
      categories: [],
      courses: { de: [], en: [], es: [] },
      courseOverrides: {},
      deletedCourseIds: []
    };
  })(),
  adminOrgLang: initialTargetLang,
  adminAiPreviewResult: null,
  adminTitleManuallyEdited: false,
  catalogSourceFilter: 'all', // 'all' | 'official' | 'user'
  decksOnlyFavorites: false,
  decksOnlyRecent: false,
  homeSubView: 'home', // 'home' | 'decks' | 'admin'
  decksViewMode: 'grid', // 'grid' | 'list'
  decksCategoryFilter: 'all',
  decksLevelFilter: 'all',
  homeLevelFilter: 'all',
  decksSearchQuery: '',
  openedDeckId: '',
  openedDeckEditMode: false,
  openedDeckSubdeckFilter: 'all',
  openedDeckWordQuery: '',
  openedDeckWordsLimit: 120,
  decksOpenedFromPlay: false,
  ankiManualOverride: false,
  activeCourseId: initialSave.activeCourseId || '',
  activeModuleIndex: Number(initialSave.activeModuleIndex) || 0,
  activeLessonIndex: Number(initialSave.activeLessonIndex) || 0,
  completedLessonIds: new Set(Array.isArray(initialSave.completedLessonIds) ? initialSave.completedLessonIds : []),
  activeCustomRoundTitle: '',

  // Арсенал и прогресс прокачки за выученные слова
  weaponId: 'plasma',
  missileAlternateSide: 1,
  weaponBannerText: '',
  weaponBannerColor: '',
  weaponBannerTimer: 0,

  // Скорость и режим ввода артикля
  typeWithArticle: Boolean(initialSave.typeWithArticle),
  speedPresetIndex: (() => {
    const presets = [0.25, 0.5, 0.75, 1.0, 1.35];
    if (typeof initialSave.speedMult === 'number') {
      const idx = presets.findIndex(m => Math.abs(m - initialSave.speedMult) < 0.03);
      if (idx !== -1) return idx;
    }
    return 1; // 0.5x по умолчанию, 0.25x в один клик
  })(),
  speedPresets: [
    { mult: 0.25, label: '🦥 0.25x' },
    { mult: 0.5, label: '🐌 0.5x' },
    { mult: 0.75, label: '🐢 0.75x' },
    { mult: 1.0, label: '🚀 1.0x' },
    { mult: 1.35, label: '⚡ 1.35x' }
  ],

  // Очки и боевые показатели
  score: 0,
  highScore: Number(initialSave.highScore) || 0,
  combo: 1,
  maxCombo: 1,
  shotsFired: 0,
  shotsHit: 0,
  shields: 4,
  maxShields: 4,
  empCharges: 2,

  warpTimer: 0,
  demoWords: [],
  demoSpawnTimer: 0.35,
  demoFireTimer: 0.25,
  demoTargetId: null,

  wordQueue: [],
  currentRoundPool: [],
  totalWordsInLevel: 0,
  wordsDestroyedInLevel: 0,
  spawnTimer: 0,
  mistakeWordsMap: new Map(),
  killHistory: [],
  dictOnlyPinned: false,

  // Состояние диалога импорта Anki .apkg
  importTargetLang: initialTargetLang,
  parsedAnkiData: null,

  activeWords: [],
  lockedWordId: null,
  lastAbsorbedUmlautE: false,
  lastAbsorbedEszettS: false,

  lasers: [],
  missiles: [],
  repulsorWaves: [],
  gravityEquipCooldown: 0,
  particles: [],
  shockwaves: [],
  floatingTranslations: [],
  stars: [],
  nebulae: [],
  layoutWarningTimer: 0,

  ship: {
    x: 0,
    y: 0,
    targetY: 0,
    angle: -Math.PI / 2,
    targetAngle: -Math.PI / 2,
    recoil: 0
  }
};


export function isWeaponUnlocked(weaponObj) {
  return learnedWordsSet.size >= (weaponObj.unlockWords || 0);
}

if (
  initialSave.weaponId &&
  WEAPONS.some(w => w.id === initialSave.weaponId && isWeaponUnlocked(w))
) {
  state.weaponId = initialSave.weaponId;
} else {
  state.weaponId = 'plasma';
}

export function getNextLockedWeapon() {
  return WEAPONS.find(w => !isWeaponUnlocked(w)) || null;
}

export function makeWordKey(targetLang, entry) {
  return `${targetLang}::${String(entry.word || entry.raw || '').trim().toLowerCase()}`;
}

export function isEntryPinned(entry, targetLang = state.targetLang) {
  if (!entry) return false;
  return pinnedWordsMap.has(makeWordKey(targetLang, entry));
}

export function getPinnedEntriesForTargetLang(targetLang = state.targetLang) {
  const prefix = `${targetLang}::`;
  const list = [];
  for (const [k, val] of pinnedWordsMap.entries()) {
    if (k.startsWith(prefix) && val && val.word) {
      list.push(val);
    }
  }
  return list;
}


export function togglePinWord(entry, targetLang = state.targetLang) {
  if (!entry) return false;
  const key = makeWordKey(targetLang, entry);
  const nowPinned = !pinnedWordsMap.has(key);
  if (nowPinned) {
    pinnedWordsMap.set(key, entry);
  } else {
    pinnedWordsMap.delete(key);
  }
  saveJsonStorage(PINNED_STORAGE_KEY, Object.fromEntries(pinnedWordsMap.entries()));
  sound.playStarChime(nowPinned);

  const tr = t();
  state.weaponBannerText = nowPinned ? tr.pinAddedBanner(entry.word) : tr.pinRemovedBanner(entry.word);
  state.weaponBannerColor = '#fde047';
  state.weaponBannerTimer = 1.65;

  bus.emit('pins:changed', { entry, targetLang, nowPinned });
  return nowPinned;
}

export function recordWordLearned(entry, targetLang = state.targetLang) {
  if (!entry) return;
  const prevCount = learnedWordsSet.size;
  const key = makeWordKey(targetLang, entry);
  recordTodayWord(key);
  if (state.activeCourseId) {
    recordDeckActivity(state.activeCourseId, 'study');
  }

  if (learnedWordsSet.has(key)) {
    bus.emit('learned:updated', { entry, targetLang, newlyUnlocked: null, alreadyKnown: true });
    return;
  }

  learnedWordsSet.add(key);
  saveJsonStorage(LEARNED_STORAGE_KEY, Array.from(learnedWordsSet));
  const newCount = learnedWordsSet.size;

  const newlyUnlocked = WEAPONS.find(w => w.unlockWords > prevCount && w.unlockWords <= newCount) || null;
  if (newlyUnlocked) {
    sound.playUnlockFanfare();
    state.weaponBannerText = t().unlockedWeaponBanner(newlyUnlocked.icon, getWeaponName(newlyUnlocked));
    state.weaponBannerColor = '#fde047';
    state.weaponBannerTimer = 3.2;
  }

  bus.emit('learned:updated', { entry, targetLang, newlyUnlocked, alreadyKnown: false });
}

export function toggleDeckFavorite(courseId) {
  if (!courseId) return false;
  const nowFav = !favoriteDeckIds.has(courseId);
  if (nowFav) {
    favoriteDeckIds.add(courseId);
  } else {
    favoriteDeckIds.delete(courseId);
  }
  saveJsonStorage(FAV_DECKS_KEY, Array.from(favoriteDeckIds));
  sound.init();
  sound.playStarChime(nowFav);
  bus.emit('favorites:changed', { courseId, nowFav });
  return nowFav;
}

export function isHebrewUI() {
  return state.nativeLang === 'he';
}

export function t() {
  return UI_TEXT[state.nativeLang] || UI_TEXT.ru;
}

export function getLocalizedField(obj, fieldName = 'titles') {
  if (!obj) return '';
  const map = obj[fieldName];
  if (map && typeof map === 'object') {
    return map[state.nativeLang] || map.en || map.ru || map.he || '';
  }
  return '';
}

export function getCurrentWeapon() {
  return WEAPONS.find(w => w.id === state.weaponId) || WEAPONS[0];
}

export function getWeaponName(w) {
  return (w.names && (w.names[state.nativeLang] || w.names.en)) || w.id;
}

export function getWeaponDesc(w) {
  return (w.descs && (w.descs[state.nativeLang] || w.descs.en)) || '';
}

export function getWordTranslation(entry) {
  if (!entry) return '';
  if (entry.translations && typeof entry.translations === 'object') {
    return entry.translations[state.nativeLang] || entry.translations.en || entry.translations.ru || entry.translations.he || '';
  }
  if (state.nativeLang === 'he') return entry.he || entry.ru || '';
  return entry.ru || entry.he || '';
}

export function isRtlTranslation(entry) {
  const txt = getWordTranslation(entry);
  return state.nativeLang === 'he' || /[\u0590-\u05FF]/.test(txt);
}

export function formatDeckWordsCountFull(n) {
  const count = Math.max(0, Number(n) || 0);
  if (state.nativeLang === 'ru') {
    const numStr = count.toLocaleString('ru-RU');
    const mod100 = count % 100;
    const mod10 = count % 10;
    let noun = 'слов';
    if (mod100 >= 11 && mod100 <= 14) {
      noun = 'слов';
    } else if (mod10 === 1) {
      noun = 'слово';
    } else if (mod10 >= 2 && mod10 <= 4) {
      noun = 'слова';
    }
    return `${numStr} ${noun}`;
  }
  if (state.nativeLang === 'he') {
    return `${count.toLocaleString('he-IL')} מילים`;
  }
  return `${count.toLocaleString('en-US')} ${count === 1 ? 'word' : 'words'}`;
}

export function formatDeckLessonsCountFull(n) {
  const count = Math.max(0, Number(n) || 0);
  if (state.nativeLang === 'ru') {
    const numStr = count.toLocaleString('ru-RU');
    const mod100 = count % 100;
    const mod10 = count % 10;
    let noun = 'уроков';
    if (mod100 >= 11 && mod100 <= 14) {
      noun = 'уроков';
    } else if (mod10 === 1) {
      noun = 'урок';
    } else if (mod10 >= 2 && mod10 <= 4) {
      noun = 'урока';
    }
    return `${numStr} ${noun}`;
  }
  if (state.nativeLang === 'he') {
    return `${count.toLocaleString('he-IL')} שלבים`;
  }
  return `${count.toLocaleString('en-US')} ${count === 1 ? 'lesson' : 'lessons'}`;
}
