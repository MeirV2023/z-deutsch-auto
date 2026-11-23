// Доменный сервис каталога курсов, прогресса колод, CEFR-фильтрации и рейтинга (SRP — 0 зависимостей от DOM)
import { ALL_LANG_CODES } from '../config/constants.js';
import { ADMIN_CATALOG_LS_KEY, saveJsonStorage } from '../core/storage.js';
import { shuffleArray } from '../core/utils.js';
import { GAME_CATALOG } from '../data/index.js';
import {
  state,
  learnedWordsSet,
  favoriteDeckIds,
  makeWordKey,
  isEntryPinned,
  getPinnedEntriesForTargetLang,
  t,
  getLocalizedField
} from '../state/store.js';

export function normalizeAdminCatalogObject(rawObj) {
  const obj = (rawObj && typeof rawObj === 'object') ? rawObj : {};
  const courses = {};
  for (const lg of ALL_LANG_CODES) {
    courses[lg] = (obj.courses && Array.isArray(obj.courses[lg])) ? obj.courses[lg] : [];
  }
  return {
    version: 1,
    updatedAt: typeof obj.updatedAt === 'string' ? obj.updatedAt : '',
    categories: Array.isArray(obj.categories) ? obj.categories : [],
    courses,
    courseOverrides: (obj.courseOverrides && typeof obj.courseOverrides === 'object')
      ? obj.courseOverrides
      : {},
    deletedCourseIds: Array.isArray(obj.deletedCourseIds) ? obj.deletedCourseIds : []
  };
}

export function saveAdminCatalogLocal() {
  state.adminCatalog.updatedAt = new Date().toISOString();
  saveJsonStorage(ADMIN_CATALOG_LS_KEY, state.adminCatalog);
}

export function getAllCategories() {
  const baseCats = (GAME_CATALOG && Array.isArray(GAME_CATALOG.categories))
    ? GAME_CATALOG.categories
    : [];
  const adminCats = (state.adminCatalog && Array.isArray(state.adminCatalog.categories))
    ? state.adminCatalog.categories
    : [];
  const byId = new Map();
  for (const c of baseCats) {
    if (c && c.id) byId.set(c.id, c);
  }
  for (const c of adminCats) {
    if (c && c.id) byId.set(c.id, c);
  }
  return Array.from(byId.values());
}

export function getCategoryById(catId) {
  if (!catId) return null;
  return getAllCategories().find(c => c.id === catId) || null;
}

export function inferCourseCategory(course) {
  if (!course) return 'base';
  if (course.category) return course.category;
  const cid = String(course.id || '').toLowerCase();
  if (cid.includes('auto')) return 'auto';
  if (cid.includes('business') || cid.includes('existenz') || cid.includes('arbeit') || cid.includes('bewerbung') || cid.includes('start')) return 'business';
  if (cid.includes('finance') || cid.includes('bank') || cid.includes('money')) return 'finance';
  if (cid.includes('food') || cid.includes('kitchen')) return 'food';
  if (cid.includes('it') || cid.includes('digital')) return 'it';
  if (cid.includes('travel') || cid.includes('reisen')) return 'travel';
  if (cid.includes('gesund') || cid.includes('med')) return 'medicine';
  if (cid.includes('natur') || cid.includes('umwelt')) return 'nature';
  if (cid.includes('politik') || cid.includes('zukunft') || cid.includes('wie-wird')) return 'society';
  return 'base';
}

export function getOfficialCoursesForTargetLang(targetLang = state.targetLang) {
  const baseList = (GAME_CATALOG && GAME_CATALOG.courses && GAME_CATALOG.courses[targetLang]) || [];
  const adminList = (state.adminCatalog && state.adminCatalog.courses && state.adminCatalog.courses[targetLang]) || [];
  const deletedSet = new Set((state.adminCatalog && state.adminCatalog.deletedCourseIds) || []);
  const overrides = (state.adminCatalog && state.adminCatalog.courseOverrides) || {};

  const mergedById = new Map();
  baseList.forEach((c, idx) => {
    if (!c || !c.id || deletedSet.has(c.id)) return;
    mergedById.set(c.id, { ...c, _baseOrder: idx });
  });
  adminList.forEach((c, idx) => {
    if (!c || !c.id || deletedSet.has(c.id)) return;
    mergedById.set(c.id, { ...c, isAdminCreated: true, _baseOrder: baseList.length + idx });
  });

  const resolved = Array.from(mergedById.values()).map(course => {
    const ov = overrides[course.id];
    let out = {
      ...course,
      category: inferCourseCategory(course)
    };
    if (ov && typeof ov === 'object') {
      if (ov.category) out.category = ov.category;
      if (ov.levelTag) out.levelTag = ov.levelTag;
      if (ov.icon) out.icon = ov.icon;
      if (ov.titles && typeof ov.titles === 'object') {
        out.titles = { ...(out.titles || {}), ...ov.titles };
      }
      if (typeof ov.orderIndex === 'number') {
        out._orderIndex = ov.orderIndex;
      }
      let mods = Array.isArray(out.modules) ? out.modules.slice() : [];
      if (Array.isArray(ov.removedModuleIds) && ov.removedModuleIds.length > 0) {
        const remSet = new Set(ov.removedModuleIds);
        mods = mods.filter(m => !remSet.has(m.id));
      }
      if (Array.isArray(ov.appendedModules) && ov.appendedModules.length > 0) {
        const existingIds = new Set(mods.map(m => m.id));
        for (const am of ov.appendedModules) {
          if (am && !existingIds.has(am.id)) {
            mods.push(am);
            existingIds.add(am.id);
          }
        }
      }
      out.modules = mods;
    }
    return out;
  });

  resolved.sort((a, b) => {
    const ao = typeof a._orderIndex === 'number' ? a._orderIndex : a._baseOrder;
    const bo = typeof b._orderIndex === 'number' ? b._orderIndex : b._baseOrder;
    return ao - bo;
  });

  return resolved;
}

export function getCoursesForTargetLang(targetLang = state.targetLang) {
  const official = getOfficialCoursesForTargetLang(targetLang);
  const personal = state.userCourses.filter(c => c.targetLang === targetLang);
  return [...official, ...personal];
}

export function ensureValidCourseSelection() {
  const available = getCoursesForTargetLang(state.targetLang);
  if (available.length === 0) return null;

  let course = available.find(c => c.id === state.activeCourseId);
  if (!course) {
    course = available[0];
    state.activeCourseId = course.id;
    state.activeModuleIndex = 0;
    state.activeLessonIndex = 0;
  }

  if (!course.modules || course.modules.length === 0) return course;
  if (state.activeModuleIndex < 0 || state.activeModuleIndex >= course.modules.length) {
    state.activeModuleIndex = 0;
    state.activeLessonIndex = 0;
  }

  const mod = course.modules[state.activeModuleIndex];
  if (!mod.lessons || mod.lessons.length === 0) return course;
  if (state.activeLessonIndex < 0 || state.activeLessonIndex >= mod.lessons.length) {
    state.activeLessonIndex = 0;
  }

  return course;
}

export function getActiveSelection() {
  const course = ensureValidCourseSelection();
  if (!course) return { course: null, mod: null, lesson: null };
  const mod = course.modules[state.activeModuleIndex] || course.modules[0];
  const lesson = (mod && mod.lessons && mod.lessons[state.activeLessonIndex]) || (mod && mod.lessons && mod.lessons[0]) || null;
  return { course, mod, lesson };
}

export function getAllWordsInCourse(course) {
  if (!course || !Array.isArray(course.modules)) return [];
  const seen = new Set();
  const out = [];
  for (const mod of course.modules) {
    for (const ls of (mod.lessons || [])) {
      if (ls.isBoss) continue;
      for (const w of (ls.words || [])) {
        const k = w.raw || w.word;
        if (!seen.has(k)) {
          seen.add(k);
          out.push(w);
        }
      }
    }
  }
  return out;
}

export function getAllWordsInTargetLang(targetLang = state.targetLang) {
  const courses = getCoursesForTargetLang(targetLang);
  const seen = new Set();
  const out = [];
  for (const c of courses) {
    for (const w of getAllWordsInCourse(c)) {
      const k = w.raw || w.word;
      if (!seen.has(k)) {
        seen.add(k);
        out.push(w);
      }
    }
  }
  return out;
}

// Сборка слов для урока (для каждого 4-го Босс-урока — умный микс предыдущих 3 уроков + ошибок + ⭐!)
export function resolveLessonBaseWords(course, mod, lesson, lessonIdx) {
  if (!lesson) return [];
  if (!lesson.isBoss) {
    return Array.isArray(lesson.words) ? lesson.words.slice() : [];
  }

  const preceding = (mod.lessons || [])
    .slice(0, lessonIdx)
    .filter(l => !l.isBoss)
    .slice(-3);

  const moduleWords = preceding.flatMap(l => l.words || []);
  if (moduleWords.length === 0) {
    return getAllWordsInCourse(course).slice(0, 12);
  }

  const priority = [];
  const regular = [];
  const added = new Set();

  // 1. Сначала слова из этих 3 уроков, где игрок ошибался или поставил звёздочку ⭐
  for (const w of moduleWords) {
    const k = w.raw || w.word;
    if (added.has(k)) continue;
    if (state.mistakeWordsMap.has(k) || isEntryPinned(w, course.targetLang)) {
      priority.push(w);
      added.add(k);
    } else {
      regular.push(w);
      added.add(k);
    }
  }

  // 2. Плюс до 3 отмеченных ⭐ слов из других модулей этого языка
  for (const pw of getPinnedEntriesForTargetLang(course.targetLang)) {
    const k = pw.raw || pw.word;
    if (!added.has(k) && priority.length < 10) {
      priority.push(pw);
      added.add(k);
    }
  }

  const bossCount = Math.min(14, priority.length + regular.length);
  return [...shuffleArray(priority), ...shuffleArray(regular)].slice(0, bossCount);
}

export function getCourseVisualTheme(course) {
  if (!course) return { cls: 'art-auto', emoji: '🚀', tag: 'Z-LINGO' };
  if (course.source === 'user') {
    return {
      cls: 'art-anki',
      emoji: course.originType === 'anki' ? '🗂️' : '✨',
      tag: course.originType === 'anki' ? 'ANKI' : 'MY DECK'
    };
  }
  const cat = inferCourseCategory(course);
  if (cat === 'auto') return { cls: 'art-auto', emoji: '🚘', tag: 'AUTO' };
  if (cat === 'business') return { cls: 'art-business', emoji: '💼', tag: 'BUSINESS' };
  if (cat === 'finance') return { cls: 'art-base', emoji: '🪙', tag: 'FINANCE' };
  if (cat === 'food') return { cls: 'art-food', emoji: '👨‍🍳', tag: 'FOOD' };
  if (cat === 'it') return { cls: 'art-it', emoji: '💻', tag: 'DIGITAL' };
  if (cat === 'travel') return { cls: 'art-travel', emoji: '✈️', tag: 'TRAVEL' };
  if (cat === 'medicine') return { cls: 'art-base', emoji: '🩺', tag: 'MED' };
  if (cat === 'nature') return { cls: 'art-base', emoji: '🌿', tag: 'NATURE' };
  if (cat === 'society') return { cls: 'art-it', emoji: '🏛️', tag: 'SOCIETY' };
  return { cls: 'art-base', emoji: '🌍', tag: course.levelTag || 'B1' };
}

export function countLearnedWordsInCourse(course) {
  if (!course) return { learned: 0, total: 0 };
  const words = getAllWordsInCourse(course);
  let learned = 0;
  const cLang = course.targetLang || state.targetLang;
  for (const w of words) {
    if (learnedWordsSet.has(makeWordKey(cLang, w))) {
      learned++;
    }
  }
  return { learned, total: words.length };
}

export function getMergedLeaderboardEntries() {
  const tr = t();
  const myBest = Math.max(state.highScore, state.score);
  const baseRivals = [
    { name: 'LeoBerlin', score: 26540, avatar: '🧑‍🚀', isYou: false },
    { name: 'AnnaAT', score: 24980, avatar: '👩‍🚀', isYou: false },
    { name: 'VictorVienna', score: 23410, avatar: '🚀', isYou: false },
    { name: 'MayaTLV', score: 15800, avatar: '⚡', isYou: false },
    { name: 'CarlosMadrid', score: 9450, avatar: '🌟', isYou: false }
  ];
  const youEntry = {
    name: tr.youPilotLabel,
    score: myBest,
    avatar: '🏆',
    isYou: true
  };
  const all = [...baseRivals, youEntry].sort((a, b) => b.score - a.score);
  return all.map((item, idx) => ({ ...item, rank: idx + 1 }));
}

export function getNextLessonPointer() {
  const { course, mod } = getActiveSelection();
  if (!course || !mod) return null;

  if (state.activeLessonIndex + 1 < mod.lessons.length) {
    return {
      courseId: course.id,
      moduleIndex: state.activeModuleIndex,
      lessonIndex: state.activeLessonIndex + 1,
      lesson: mod.lessons[state.activeLessonIndex + 1]
    };
  }
  if (state.activeModuleIndex + 1 < course.modules.length) {
    const nextMod = course.modules[state.activeModuleIndex + 1];
    if (nextMod && nextMod.lessons && nextMod.lessons.length > 0) {
      return {
        courseId: course.id,
        moduleIndex: state.activeModuleIndex + 1,
        lessonIndex: 0,
        lesson: nextMod.lessons[0]
      };
    }
  }
  return null;
}

export function getDeckArtClass(course) {
  if (!course) return '';
  if (course.source === 'user') return course.originType === 'anki' ? 'art-anki' : 'art-it';
  const id = String(course.id || '').toLowerCase();
  const icon = course.icon || '';
  if (id.includes('food') || icon.includes('🥐') || icon.includes('🍽')) return 'art-food';
  const cat = inferCourseCategory(course);
  if (cat === 'auto') return 'art-auto';
  if (cat === 'business') return 'art-business';
  if (cat === 'finance') return 'art-base';
  if (cat === 'food') return 'art-food';
  if (cat === 'travel') return 'art-travel';
  if (cat === 'it' || cat === 'society') return 'art-it';
  if (cat === 'base' || cat === 'medicine' || cat === 'nature') return 'art-base';
  return '';
}

export function courseHasPinnedWords(course) {
  if (!course) return false;
  const words = getAllWordsInCourse(course);
  for (const w of words) {
    if (isEntryPinned(w, course.targetLang)) return true;
  }
  return false;
}

export function isDeckFavorite(course) {
  if (!course) return false;
  return favoriteDeckIds.has(course.id) || courseHasPinnedWords(course);
}

export function getCourseCategoryBadgeText(course) {
  if (!course || course.source === 'user') return '';
  const catId = inferCourseCategory(course);
  const catObj = getCategoryById(catId);
  if (!catObj) return '';
  const title = getLocalizedField(catObj, 'titles') || catId;
  return `${catObj.icon || '🗂️'} ${title}`.trim();
}

export function normalizeCefrBucket(levelTag) {
  const raw = String(levelTag || '').toUpperCase().replace(/-/g, '–').trim();
  if (!raw) return 'A2–B1';
  if (raw.includes('A1') && raw.includes('A2')) return 'A1–A2';
  if (raw.includes('A2') && raw.includes('B1')) return 'A2–B1';
  if (raw.includes('B1') && raw.includes('B2')) return 'B1–B2';
  if (raw === 'A1') return 'A1–A2';
  if (raw === 'A2') return 'A2–B1';
  if (raw === 'B1') return 'B1';
  if (raw === 'B2' || raw.includes('C1')) return 'B1–B2';
  return raw;
}

export function courseMatchesLevelFilter(course, filterVal) {
  if (!filterVal || filterVal === 'all') return true;
  const raw = String(course.levelTag || '').toUpperCase().replace(/-/g, '–');
  const bucket = normalizeCefrBucket(course.levelTag);
  if (bucket === filterVal) return true;
  if (filterVal === 'A1' && raw.includes('A1')) return true;
  if (filterVal === 'A2' && raw.includes('A2')) return true;
  if (filterVal === 'B1' && (raw === 'B1' || raw === 'A2–B1' || raw.includes('B1'))) return true;
  if (filterVal === 'B2' && (raw.includes('B2') || raw.includes('C1'))) return true;
  if (filterVal === 'A1–A2' && (raw.includes('A1') || raw === 'A2')) return true;
  if (filterVal === 'A2–B1' && (raw.includes('A2') || raw === 'A1–B1')) return true;
  if (filterVal === 'B1–B2' && (raw.includes('B2') || raw.includes('C1'))) return true;
  return false;
}

export function computeDeckStats(course) {
  const allWords = getAllWordsInCourse(course);
  const totalWords = allWords.length;
  let learnedInCourse = 0;
  for (const w of allWords) {
    if (learnedWordsSet.has(makeWordKey(course.targetLang, w))) {
      learnedInCourse++;
    }
  }

  const flatLessons = [];
  let nextModIdx = 0;
  let nextLessonIdx = 0;
  let foundNext = false;

  (course.modules || []).forEach((mod, mIdx) => {
    (mod.lessons || []).forEach((ls, lIdx) => {
      const isDone = state.completedLessonIds.has(ls.id);
      if (!foundNext && !isDone) {
        nextModIdx = mIdx;
        nextLessonIdx = lIdx;
        foundNext = true;
      }
      flatLessons.push({ mod, ls, mIdx, lIdx, isDone });
    });
  });

  const regularLessons = flatLessons.filter(x => !x.ls.isBoss);
  const trackedLessons = regularLessons.length > 0 ? regularLessons : flatLessons;
  const totalLessons = Math.max(1, trackedLessons.length);
  const doneLessons = trackedLessons.filter(x => x.isDone).length;

  const lessonRatio = doneLessons / totalLessons;
  const wordRatio = totalWords > 0 ? learnedInCourse / totalWords : 0;
  const pct = Math.min(100, Math.round(Math.max(lessonRatio, wordRatio) * 100));
  const isStarted = doneLessons > 0 || learnedInCourse > 0 || course.id === state.activeCourseId;

  return {
    totalWords,
    learnedInCourse,
    totalLessons,
    doneLessons,
    pct,
    isStarted,
    nextModIdx,
    nextLessonIdx,
    previewLessons: trackedLessons.slice(0, 3)
  };
}
