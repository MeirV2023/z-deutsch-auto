// Студия Супер-Админа (#adminStudioView): AI-обогащение Gemini, категории и публикация на GitHub (SRP)
import { actions } from '../core/events.js';
import {
  ADMIN_CATALOG_LS_KEY,
  ADMIN_GH_TOKEN_LS_KEY,
  ADMIN_PASSWORD_LS_KEY,
  ADMIN_UNLOCKED_LS_KEY,
  saveJsonStorage
} from '../core/storage.js';
import { escapeHtml } from '../core/utils.js';
import { TARGET_LANG_META } from '../config/constants.js';
import { AnkiImporter } from '../anki/index.js';
import { ttsManager } from '../services/tts-service.js';
import { state, t } from '../state/store.js';
import {
  ensureValidCourseSelection,
  getAllCategories,
  getAllWordsInCourse,
  getCategoryById,
  getOfficialCoursesForTargetLang,
  inferCourseCategory,
  normalizeAdminCatalogObject,
  saveAdminCatalogLocal
} from '../domain/catalog-service.js';
import {
  adminAiCloneTargetsCheck,
  adminAiEnrichUiCheck,
  adminAppendTargetWrap,
  adminCategoriesTree,
  adminCategorySelect,
  adminCourseTitleInput,
  adminGeminiKeyInput,
  adminGithubTokenInput,
  adminIconInput,
  adminImportJsonInput,
  adminLevelSelect,
  adminLiveCountBadge,
  adminLiveParseSummary,
  adminLivePreviewList,
  adminNewCatIcon,
  adminNewCatTitleEn,
  adminNewCatTitleRu,
  adminNewCategoryBox,
  adminOrganizerLangTabs,
  adminPasswordInput,
  adminPlacementModeSelect,
  adminRawWordsTextarea,
  adminSourceLangSelect,
  adminStatusBanner,
  adminStudioView,
  adminTargetCourseSelect,
  adminTransLangSelect,
  arcadeTitleScreen,
  btnAdminAiPreview,
  btnAdminBackToDecks,
  btnAdminCreateAndPublish,
  btnAdminCreateCategory,
  btnAdminExportJson,
  btnAdminImportJson,
  btnAdminLockMode,
  btnAdminSaveCreds,
  btnAdminSyncCloud,
  btnAdminToggleNewCat,
  btnDecksOpenAdmin,
  btnNavAdmin,
  btnOpenAdminFromSettings,
  centerOverlay,
  courseBrowserDialog,
  homeBrandLogo
} from './dom.js';
import { renderHomeDashboardWidgets, renderLevelSidebar } from './hud-widgets.js';
import { selectCourseLesson } from '../engine/gameplay.js';
import { launchDeckLessonFromPage, openDecksPage, renderDecksPage } from './decks-page.js';

export function isAdminUnlocked() {
  try {
    if (localStorage.getItem(ADMIN_UNLOCKED_LS_KEY) === '1') return true;
    if (localStorage.getItem(ADMIN_GH_TOKEN_LS_KEY) || localStorage.getItem(ADMIN_PASSWORD_LS_KEY)) {
      return true;
    }
  } catch (_) {}
  return false;
}

export function syncAdminVisibilityUI() {
  const unlocked = isAdminUnlocked();
  document.body.classList.toggle('is-admin-unlocked', unlocked);
  [btnNavAdmin, btnDecksOpenAdmin, btnOpenAdminFromSettings].forEach(el => {
    if (!el) return;
    el.hidden = !unlocked;
    el.setAttribute('aria-hidden', unlocked ? 'false' : 'true');
  });
}

export async function promptAndUnlockAdmin(autoOpenStudio = true) {
  if (isAdminUnlocked()) {
    syncAdminVisibilityUI();
    if (autoOpenStudio) openAdminStudio();
    return true;
  }

  const tr = t();
  const entered = window.prompt(tr.adminUnlockPrompt || '🔐 Введите пароль Супер-Админа:');
  if (!entered || !entered.trim()) {
    return false;
  }
  const cleanPass = entered.trim();

  const isLocalHost = /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname) || window.location.protocol === 'file:';
  try {
    const res = await fetch('/api/admin-publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': cleanPass
      },
      body: JSON.stringify({ action: 'verify' })
    });

    if (res.status === 401) {
      window.alert(tr.adminUnlockWrongPass || '❌ Неверный пароль администратора.');
      return false;
    }

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      try {
        localStorage.setItem(ADMIN_UNLOCKED_LS_KEY, '1');
        localStorage.setItem(ADMIN_PASSWORD_LS_KEY, cleanPass);
      } catch (_) {}
      syncAdminVisibilityUI();
      if (autoOpenStudio) openAdminStudio();
      if (!data.hasServerPassword) {
        showAdminStatus('⚠️ На сервере Vercel ещё не задан ADMIN_PASSWORD — добавьте его в Environment Variables для защиты публикации.', false);
      }
      return true;
    }

    if (isLocalHost && (res.status === 404 || res.status === 501)) {
      try {
        localStorage.setItem(ADMIN_UNLOCKED_LS_KEY, '1');
        localStorage.setItem(ADMIN_PASSWORD_LS_KEY, cleanPass);
      } catch (_) {}
      syncAdminVisibilityUI();
      if (autoOpenStudio) openAdminStudio();
      return true;
    }

    window.alert(tr.adminUnlockWrongPass || '❌ Ошибка проверки доступа администратора.');
    return false;
  } catch (_) {
    if (isLocalHost) {
      try {
        localStorage.setItem(ADMIN_UNLOCKED_LS_KEY, '1');
        localStorage.setItem(ADMIN_PASSWORD_LS_KEY, cleanPass);
      } catch (__) {}
      syncAdminVisibilityUI();
      if (autoOpenStudio) openAdminStudio();
      return true;
    }
    window.alert('⚠️ Нет соединения с сервером проверки пароля.');
    return false;
  }
}

export function lockAdminMode() {
  try {
    localStorage.removeItem(ADMIN_UNLOCKED_LS_KEY);
    localStorage.removeItem(ADMIN_PASSWORD_LS_KEY);
    localStorage.removeItem(ADMIN_GH_TOKEN_LS_KEY);
  } catch (_) {}
  if (adminPasswordInput) adminPasswordInput.value = '';
  if (adminGithubTokenInput) adminGithubTokenInput.value = '';
  syncAdminVisibilityUI();
  if (state.homeSubView === 'admin') {
    actions.switchHomeSubView('home');
  }
  if (state.homeSubView === 'decks') {
    renderDecksPage();
  }
}

export function openAdminStudio(focusCourseLang = '') {
  if (!isAdminUnlocked()) {
    promptAndUnlockAdmin(true);
    return;
  }
  if (courseBrowserDialog && courseBrowserDialog.open) {
    courseBrowserDialog.close();
  }
  if (state.screenMode === 'play') {
    state.paused = true;
    state.decksOpenedFromPlay = true;
    state.screenMode = 'title';
    centerOverlay.classList.add('hidden');
    if (arcadeTitleScreen) arcadeTitleScreen.hidden = false;
    document.body.classList.remove('mode-play');
    document.body.classList.add('mode-title');
  }
  if (focusCourseLang && TARGET_LANG_META[focusCourseLang]) {
    state.adminOrgLang = focusCourseLang;
  } else {
    state.adminOrgLang = state.targetLang;
  }
  actions.switchHomeSubView('admin');
}

export function getStoredAdminCreds() {
  let ghToken = '';
  let adminPass = '';
  try {
    ghToken = localStorage.getItem(ADMIN_GH_TOKEN_LS_KEY) || '';
    adminPass = localStorage.getItem(ADMIN_PASSWORD_LS_KEY) || '';
  } catch (_) {}
  const geminiKey = (adminGeminiKeyInput && adminGeminiKeyInput.value.trim()) || ttsManager.localApiKey || '';
  return {
    geminiKey,
    ghToken: (adminGithubTokenInput && adminGithubTokenInput.value.trim()) || ghToken,
    adminPass: (adminPasswordInput && adminPasswordInput.value.trim()) || adminPass
  };
}

export function showAdminStatus(message, isError = false) {
  if (!adminStatusBanner) return;
  adminStatusBanner.textContent = message;
  adminStatusBanner.classList.remove('hidden');
  adminStatusBanner.style.borderColor = isError ? 'rgba(248, 113, 113, 0.55)' : 'rgba(52, 211, 153, 0.45)';
  adminStatusBanner.style.background = isError ? 'rgba(127, 29, 29, 0.32)' : 'rgba(6, 78, 59, 0.32)';
  adminStatusBanner.style.color = isError ? '#fecaca' : '#a7f3d0';
}

export async function fetchAndMergeCloudAdminCatalog() {
  if (location.protocol !== 'http:' && location.protocol !== 'https:') return;
  try {
    const res = await fetch(`./admin-catalog.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return;
    const cloudRaw = await res.json();
    const cloud = normalizeAdminCatalogObject(cloudRaw);
    const local = normalizeAdminCatalogObject(state.adminCatalog);

    const cloudTime = Date.parse(cloud.updatedAt || '') || 0;
    const localTime = Date.parse(local.updatedAt || '') || 0;
    const cloudNewer = cloudTime >= localTime;

    const catMap = new Map();
    (cloudNewer ? local.categories : cloud.categories).forEach(c => { if (c && c.id) catMap.set(c.id, c); });
    (cloudNewer ? cloud.categories : local.categories).forEach(c => { if (c && c.id) catMap.set(c.id, c); });

    const mergedCourses = { de: [], en: [], es: [] };
    const delSet = new Set(cloudNewer ? cloud.deletedCourseIds : local.deletedCourseIds);

    ['de', 'en', 'es'].forEach(lg => {
      const cMap = new Map();
      const olderList = cloudNewer ? local.courses[lg] : cloud.courses[lg];
      const newerList = cloudNewer ? cloud.courses[lg] : local.courses[lg];
      olderList.forEach(c => { if (c && c.id && !delSet.has(c.id)) cMap.set(c.id, c); });
      newerList.forEach(c => { if (c && c.id && !delSet.has(c.id)) cMap.set(c.id, c); });
      mergedCourses[lg] = Array.from(cMap.values());
    });

    const mergedOverrides = cloudNewer
      ? { ...local.courseOverrides, ...cloud.courseOverrides }
      : { ...cloud.courseOverrides, ...local.courseOverrides };

    state.adminCatalog = {
      version: 1,
      updatedAt: cloudNewer ? (cloud.updatedAt || local.updatedAt) : (local.updatedAt || cloud.updatedAt),
      categories: Array.from(catMap.values()),
      courses: mergedCourses,
      courseOverrides: mergedOverrides,
      deletedCourseIds: Array.from(delSet)
    };

    saveJsonStorage(ADMIN_CATALOG_LS_KEY, state.adminCatalog);
    ensureValidCourseSelection();
    renderLevelSidebar();
    renderHomeDashboardWidgets();
    if (state.homeSubView === 'decks') renderDecksPage();
    if (state.homeSubView === 'admin') renderAdminStudio();
  } catch (_) {
    // Тихий фоллбэк при локальном запуске без сервера
  }
}

export async function publishAdminCatalogToCloud(commitMessage = 'chore(catalog): update courses via Super Admin Studio') {
  saveAdminCatalogLocal();
  const creds = getStoredAdminCreds();

  if (location.protocol !== 'http:' && location.protocol !== 'https:') {
    showAdminStatus(
      '💾 Сохранено локально в браузере! (Для авто-публикации на хостинг откройте сайт на Vercel или скачайте admin-catalog.json).',
      false
    );
    return false;
  }

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (creds.ghToken) headers['x-github-token'] = creds.ghToken;
    if (creds.adminPass) headers['x-admin-password'] = creds.adminPass;

    const res = await fetch('/api/admin-publish', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        catalog: state.adminCatalog,
        commitMessage
      })
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data && data.ok) {
      showAdminStatus(
        `🌍 Опубликовано на хостинг (${data.repo || 'GitHub'} · коммит ${data.commitSha || 'main'})! Vercel автоматически обновляет игру для всех игроков.`,
        false
      );
      return true;
    }

    if (res.status === 503 && data && data.localSavedOnly) {
      showAdminStatus(
        `💾 Изменения уже работают у вас в браузере! Чтобы опубликовать их для всех игроков в 1 клик, откройте «🔑 Настройка глобальной публикации» выше и укажите GitHub Token (или нажмите «📥 Скачать JSON»).`,
        false
      );
      return false;
    }

    showAdminStatus(
      `⚠️ Сохранено локально, но публикация на GitHub вернула ответ: ${(data && data.message) || res.statusText || res.status}`,
      true
    );
    return false;
  } catch (err) {
    showAdminStatus(
      `💾 Сохранено локально в браузере! Облачный эндпоинт сейчас недоступен (${err && err.message ? err.message : 'offline'}) — вы также можете нажать «📥 Скачать JSON».`,
      false
    );
    return false;
  }
}

export function ensureCourseOverrideRecord(courseId) {
  if (!state.adminCatalog.courseOverrides || typeof state.adminCatalog.courseOverrides !== 'object') {
    state.adminCatalog.courseOverrides = {};
  }
  if (!state.adminCatalog.courseOverrides[courseId]) {
    state.adminCatalog.courseOverrides[courseId] = {};
  }
  return state.adminCatalog.courseOverrides[courseId];
}

export function findMutableAdminCourse(courseId, langHint = '') {
  const langs = langHint ? [langHint, 'de', 'en', 'es'] : ['de', 'en', 'es'];
  for (const lg of langs) {
    const arr = state.adminCatalog.courses && state.adminCatalog.courses[lg];
    if (!Array.isArray(arr)) continue;
    const hit = arr.find(c => c && c.id === courseId);
    if (hit) return hit;
  }
  return null;
}

export function populateAdminCategorySelect(preferredCatId = '') {
  if (!adminCategorySelect) return;
  const prevVal = preferredCatId || adminCategorySelect.value || 'business';
  const cats = getAllCategories();
  adminCategorySelect.innerHTML = '';
  cats.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    const title = (cat.titles && (cat.titles.ru || cat.titles.en)) || cat.id;
    opt.textContent = `${cat.icon || '🗂️'} ${title}`;
    adminCategorySelect.appendChild(opt);
  });
  if (cats.some(c => c.id === prevVal)) {
    adminCategorySelect.value = prevVal;
  } else if (cats.some(c => c.id === 'business')) {
    adminCategorySelect.value = 'business';
  } else if (cats.length > 0) {
    adminCategorySelect.value = cats[0].id;
  }
}

export function populateAdminTargetCourseSelect() {
  if (!adminTargetCourseSelect) return;
  const srcLang = (adminSourceLangSelect && adminSourceLangSelect.value) || 'de';
  const prevCourseId = adminTargetCourseSelect.value;
  const courses = getOfficialCoursesForTargetLang(srcLang);
  adminTargetCourseSelect.innerHTML = '';
  courses.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    const catObj = getCategoryById(inferCourseCategory(c));
    const catTag = catObj ? `[${(catObj.titles && catObj.titles.ru) || catObj.id}] ` : '';
    opt.textContent = `${c.icon || '📚'} ${catTag}${(c.titles && c.titles.ru) || c.id} (${c.levelTag || 'B1'})`;
    adminTargetCourseSelect.appendChild(opt);
  });
  if (courses.some(c => c.id === prevCourseId)) {
    adminTargetCourseSelect.value = prevCourseId;
  }
}

export function getAdminParsedDraft() {
  const rawText = (adminRawWordsTextarea && adminRawWordsTextarea.value) || '';
  const srcLang = (adminSourceLangSelect && adminSourceLangSelect.value) || 'de';
  const transLang = (adminTransLangSelect && adminTransLangSelect.value) || 'ru';
  if (!AnkiImporter || !AnkiImporter.parseAdminTextbookBlock) {
    return { detectedTitle: '', words: [], skippedCount: 0, sectionCount: 0 };
  }
  const parsed = AnkiImporter.parseAdminTextbookBlock(rawText, srcLang, transLang);

  // Если есть кешированный AI-перевод для этих же слов — накладываем { ru, en, he }
  const aiCache = state.adminAiPreviewResult;
  if (aiCache && aiCache.targetLang === srcLang && Array.isArray(aiCache.byWordKey)) {
    const mapByRaw = new Map(aiCache.byWordKey);
    parsed.words.forEach(w => {
      const hit = mapByRaw.get(w.raw);
      if (hit) {
        w.translations = {
          ru: hit.ru || (w.translations && w.translations.ru) || '',
          en: hit.en || (w.translations && w.translations.en) || '',
          he: hit.he || (w.translations && w.translations.he) || ''
        };
      }
    });
  }
  return parsed;
}

export function renderAdminLivePreview() {
  if (!adminLivePreviewList || !adminLiveParseSummary) return;
  const parsed = getAdminParsedDraft();
  const count = parsed.words.length;

  if (adminLiveCountBadge) {
    adminLiveCountBadge.textContent = `${count} сл.`;
  }

  if (parsed.detectedTitle && adminCourseTitleInput && !state.adminTitleManuallyEdited) {
    adminCourseTitleInput.value = parsed.detectedTitle;
  }

  if (count === 0) {
    adminLiveParseSummary.textContent = 'Вставьте список слов выше — парсер мгновенно покажет разбивку на уроки (по 12 слов + Босс-уроки).';
    adminLivePreviewList.innerHTML = '';
    return;
  }

  const lessonCount = Math.ceil(count / 12);
  const modCount = Math.ceil(lessonCount / 3);
  const bossCount = count >= 12 ? modCount : 0;
  const aiBadge = state.adminAiPreviewResult ? ' · ✨ AI-перевод (RU/EN/HE) готов' : '';
  const skipNote = parsed.skippedCount > 0 ? ` · пропущено строк: ${parsed.skippedCount}` : '';
  adminLiveParseSummary.textContent =
    `✓ Распознано ${count} сл. → ${modCount} мод. (${lessonCount} ур. по ≤12 сл.${bossCount ? ` + ${bossCount} 👹 Босс` : ''})${aiBadge}${skipNote}`;

  adminLivePreviewList.innerHTML = '';
  parsed.words.slice(0, 80).forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'admin-preview-row';
    const trMap = item.translations || {};
    const ruTxt = trMap.ru || '—';
    const enTxt = trMap.en && trMap.en !== trMap.ru ? ` · EN: ${trMap.en}` : '';
    const heTxt = trMap.he && trMap.he !== trMap.ru ? ` · HE: ${trMap.he}` : '';
    row.innerHTML = `
      <div class="admin-prev-left" dir="ltr">
        <span class="admin-prev-art">${escapeHtml(item.article || 'Wort')}</span>
        <strong style="color:#f8fafc;">${escapeHtml(item.word)}</strong>
        ${item.raw !== item.word ? `<span style="color:#64748b; font-size:0.74rem;">(${escapeHtml(item.raw)})</span>` : ''}
      </div>
      <div class="admin-prev-trans">${idx + 1}. 🇷🇺 ${escapeHtml(ruTxt)}${escapeHtml(enTxt)}${escapeHtml(heTxt)}</div>
    `;
    adminLivePreviewList.appendChild(row);
  });
}

export async function enrichWordsViaGeminiApi(words, targetLang, inputTransLang, courseTitle, levelTag) {
  const creds = getStoredAdminCreds();
  const headers = { 'Content-Type': 'application/json' };
  if (creds.geminiKey) headers['x-gemini-api-key'] = creds.geminiKey;

  const batchSize = 45;
  let mergedCourseTitles = null;
  let mergedCourseDescs = null;
  const byWordKey = [];
  const enrichedWords = words.map(w => ({
    ...w,
    translations: { ...(w.translations || {}) }
  }));

  for (let offset = 0; offset < enrichedWords.length; offset += batchSize) {
    const slice = enrichedWords.slice(offset, offset + batchSize);
    const payloadItems = slice.map((w, localIdx) => ({
      idx: localIdx,
      front: w.raw || w.withArticle || w.word,
      trans: (w.translations && w.translations[inputTransLang]) || (w.translations && w.translations.ru) || ''
    }));

    const res = await fetch('/api/translate', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        mode: 'enrich_ui_langs',
        targetLang,
        inputTransLang,
        courseTitle,
        levelTag,
        items: payloadItems
      })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data || !data.ok || !data.result) {
      const msg = (data && data.message) || (data && data.error) || `HTTP ${res.status}`;
      const err = new Error(msg);
      err.code = (data && data.error) || '';
      throw err;
    }

    if (!mergedCourseTitles && data.result.courseTitles) {
      mergedCourseTitles = data.result.courseTitles;
    }
    if (!mergedCourseDescs && data.result.courseDescs) {
      mergedCourseDescs = data.result.courseDescs;
    }

    const transArr = Array.isArray(data.result.translations) ? data.result.translations : [];
    transArr.forEach(tRow => {
      const targetItem = slice[tRow.idx];
      if (!targetItem) return;
      const authorVal = (targetItem.translations && targetItem.translations[inputTransLang]) || '';
      targetItem.translations = {
        ru: (inputTransLang === 'ru' && authorVal) ? authorVal : (tRow.ru || authorVal),
        en: (inputTransLang === 'en' && authorVal) ? authorVal : (tRow.en || authorVal),
        he: (inputTransLang === 'he' && authorVal) ? authorVal : (tRow.he || authorVal)
      };
    });
  }

  enrichedWords.forEach(w => {
    byWordKey.push([w.raw, { ...w.translations }]);
  });

  return {
    courseTitles: mergedCourseTitles,
    courseDescs: mergedCourseDescs,
    words: enrichedWords,
    byWordKey
  };
}

export async function cloneCourseToTargetLangViaGemini(words, fromLang, toLang, courseTitle, levelTag, category, icon) {
  const creds = getStoredAdminCreds();
  const headers = { 'Content-Type': 'application/json' };
  if (creds.geminiKey) headers['x-gemini-api-key'] = creds.geminiKey;

  const batchSize = 45;
  let cloneTitles = null;
  let cloneDescs = null;
  const clonedEntries = [];

  for (let offset = 0; offset < words.length; offset += batchSize) {
    const slice = words.slice(offset, offset + batchSize);
    const payloadItems = slice.map((w, localIdx) => ({
      idx: localIdx,
      front: w.raw || w.withArticle || w.word,
      ru: (w.translations && w.translations.ru) || '',
      en: (w.translations && w.translations.en) || ''
    }));

    const res = await fetch('/api/translate', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        mode: 'clone_target_course',
        fromLang,
        toLang,
        courseTitle,
        levelTag,
        items: payloadItems
      })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data || !data.ok || !data.result) {
      throw new Error((data && data.message) || `Clone ${toLang} HTTP ${res.status}`);
    }

    if (!cloneTitles && data.result.courseTitles) cloneTitles = data.result.courseTitles;
    if (!cloneDescs && data.result.courseDescs) cloneDescs = data.result.courseDescs;

    const itemsOut = Array.isArray(data.result.items) ? data.result.items : [];
    itemsOut.forEach(row => {
      if (!row || !row.front) return;
      const parsedOne = AnkiImporter.parseAdminTextbookBlock(
        `${row.front};${row.ru || row.en || ''}`,
        toLang,
        'ru'
      );
      const wObj = parsedOne.words && parsedOne.words[0];
      if (wObj) {
        wObj.translations = {
          ru: row.ru || wObj.translations.ru || '',
          en: row.en || wObj.translations.en || '',
          he: row.he || wObj.translations.he || ''
        };
        clonedEntries.push(wObj);
      }
    });
  }

  if (clonedEntries.length === 0) return null;

  return AnkiImporter.buildOfficialAdminCourse({
    targetLang: toLang,
    category,
    icon,
    levelTag,
    titles: cloneTitles,
    descriptions: cloneDescs,
    fallbackTitle: courseTitle,
    words: clonedEntries,
    lessonSize: 12
  });
}

export function moveModuleBetweenOfficialCourses(langCode, fromCourseId, moduleId, toCourseId) {
  if (!fromCourseId || !toCourseId || fromCourseId === toCourseId) return;
  const allCourses = getOfficialCoursesForTargetLang(langCode);
  const fromCourse = allCourses.find(c => c.id === fromCourseId);
  const toCourse = allCourses.find(c => c.id === toCourseId);
  if (!fromCourse || !toCourse) return;

  const modObj = (fromCourse.modules || []).find(m => m.id === moduleId);
  if (!modObj) return;

  const clonedMod = JSON.parse(JSON.stringify(modObj));
  const newModId = `${toCourseId}-mv-${Date.now().toString(36).slice(-4)}`;
  clonedMod.id = newModId;
  clonedMod.lessons = (clonedMod.lessons || []).map((ls, idx) => ({
    ...ls,
    id: ls.isBoss ? `${newModId}-boss` : `${newModId}-l${idx + 1}`
  }));

  // 1. Убираем модуль из исходного курса
  const mutableFrom = findMutableAdminCourse(fromCourseId, langCode);
  if (mutableFrom && Array.isArray(mutableFrom.modules)) {
    mutableFrom.modules = mutableFrom.modules.filter(m => m.id !== moduleId);
  } else {
    const ovFrom = ensureCourseOverrideRecord(fromCourseId);
    if (Array.isArray(ovFrom.appendedModules)) {
      ovFrom.appendedModules = ovFrom.appendedModules.filter(m => m.id !== moduleId);
    }
    const rem = new Set(Array.isArray(ovFrom.removedModuleIds) ? ovFrom.removedModuleIds : []);
    rem.add(moduleId);
    ovFrom.removedModuleIds = Array.from(rem);
  }

  // 2. Добавляем модуль в целевой курс
  const mutableTo = findMutableAdminCourse(toCourseId, langCode);
  if (mutableTo) {
    mutableTo.modules = [...(mutableTo.modules || []), clonedMod];
  } else {
    const ovTo = ensureCourseOverrideRecord(toCourseId);
    ovTo.appendedModules = [...(Array.isArray(ovTo.appendedModules) ? ovTo.appendedModules : []), clonedMod];
  }

  saveAdminCatalogLocal();
  ensureValidCourseSelection();
  renderLevelSidebar();
  renderHomeDashboardWidgets();
  renderAdminStudio();
  showAdminStatus(
    `✅ Модуль «${(modObj.titles && modObj.titles.ru) || moduleId}» перенесён в курс «${(toCourse.titles && toCourse.titles.ru) || toCourseId}»! Нажмите «🌍 Опубликовать изменения на хостинг», чтобы обновить у всех игроков.`,
    false
  );
}

export function renderAdminCategoriesTree() {
  if (!adminCategoriesTree) return;
  const orgLang = state.adminOrgLang || state.targetLang || 'de';

  if (adminOrganizerLangTabs) {
    adminOrganizerLangTabs.querySelectorAll('[data-admin-org-lang]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-admin-org-lang') === orgLang);
    });
  }

  const cats = getAllCategories();
  const courses = getOfficialCoursesForTargetLang(orgLang);
  const levelOptions = ['A1', 'A1–A2', 'A2', 'A2–B1', 'B1', 'B1–B2', 'B2', 'C1'];

  adminCategoriesTree.innerHTML = '';

  cats.forEach(cat => {
    const inCat = courses.filter(c => inferCourseCategory(c) === cat.id);
    const groupEl = document.createElement('div');
    groupEl.className = 'admin-cat-group';

    const catTitle = (cat.titles && (cat.titles.ru || cat.titles.en)) || cat.id;
    const headEl = document.createElement('div');
    headEl.className = 'admin-cat-group-head';
    headEl.innerHTML = `
      <span class="admin-cat-group-title">${escapeHtml(cat.icon || '🗂️')} ${escapeHtml(catTitle)}</span>
      <span class="deck-tag-badge cefr">${inCat.length} курс.</span>
    `;
    groupEl.appendChild(headEl);

    if (inCat.length === 0) {
      const emptyHint = document.createElement('div');
      emptyHint.style.fontSize = '0.78rem';
      emptyHint.style.color = '#64748b';
      emptyHint.style.padding = '4px 2px';
      emptyHint.textContent = 'Пока нет курсов в этой категории — перенесите сюда курс ниже или создайте новый слева.';
      groupEl.appendChild(emptyHint);
    }

    inCat.forEach((course) => {
      const globalIdx = courses.findIndex(x => x.id === course.id);
      const wordsTotal = getAllWordsInCourse(course).length;
      const modList = course.modules || [];
      const regularLessonCount = modList.reduce(
        (acc, m) => acc + (m.lessons || []).filter(ls => !ls.isBoss).length,
        0
      );

      const rowCard = document.createElement('div');
      rowCard.className = 'admin-course-org-row';

      const topRow = document.createElement('div');
      topRow.className = 'admin-course-org-top';
      topRow.innerHTML = `
        <div>
          <div class="admin-course-org-name">
            ${escapeHtml(course.icon || '📚')} ${escapeHtml((course.titles && course.titles.ru) || course.id)}
            ${course.isAdminCreated ? '<span class="deck-tag-badge creator" style="margin-left:6px;">ADMIN</span>' : ''}
          </div>
          <div class="admin-course-org-meta">
            ${wordsTotal} сл. · ${modList.length} мод. · ${regularLessonCount} ур. · ID: <code>${escapeHtml(course.id)}</code>
          </div>
        </div>
        <div style="display:flex; gap:5px; align-items:center;">
          <button type="button" class="hud-btn btn-org-up" title="Поднять выше" ${globalIdx <= 0 ? 'disabled' : ''}>↑</button>
          <button type="button" class="hud-btn btn-org-down" title="Опустить ниже" ${globalIdx >= courses.length - 1 ? 'disabled' : ''}>↓</button>
          <button type="button" class="hud-btn active btn-org-play" title="Запустить курс">▶</button>
          <button type="button" class="hud-btn btn-org-del" title="Удалить / скрыть курс" style="color:#fca5a5;">🗑️</button>
        </div>
      `;
      rowCard.appendChild(topRow);

      // Контролы смены Категории и Уровня CEFR
      const controlsRow = document.createElement('div');
      controlsRow.className = 'admin-course-org-controls';

      const catSelect = document.createElement('select');
      catSelect.title = 'Категория курса';
      cats.forEach(cOpt => {
        const o = document.createElement('option');
        o.value = cOpt.id;
        o.textContent = `🗂️ ${(cOpt.titles && cOpt.titles.ru) || cOpt.id}`;
        if (cOpt.id === inferCourseCategory(course)) o.selected = true;
        catSelect.appendChild(o);
      });
      catSelect.addEventListener('change', () => {
        const newCat = catSelect.value;
        const mutable = findMutableAdminCourse(course.id, orgLang);
        if (mutable) mutable.category = newCat;
        const ov = ensureCourseOverrideRecord(course.id);
        ov.category = newCat;
        saveAdminCatalogLocal();
        renderHomeDashboardWidgets();
        renderAdminStudio();
        showAdminStatus(`✅ Курс «${(course.titles && course.titles.ru) || course.id}» перемещён в категорию «${newCat}».`, false);
      });
      controlsRow.appendChild(catSelect);

      const lvlSelect = document.createElement('select');
      lvlSelect.title = 'Уровень CEFR';
      const curLvl = course.levelTag || 'B1';
      const allLvls = levelOptions.includes(curLvl) ? levelOptions : [curLvl, ...levelOptions];
      allLvls.forEach(lv => {
        const o = document.createElement('option');
        o.value = lv;
        o.textContent = `📊 ${lv}`;
        if (lv === curLvl) o.selected = true;
        lvlSelect.appendChild(o);
      });
      lvlSelect.addEventListener('change', () => {
        const newLvl = lvlSelect.value;
        const mutable = findMutableAdminCourse(course.id, orgLang);
        if (mutable) mutable.levelTag = newLvl;
        const ov = ensureCourseOverrideRecord(course.id);
        ov.levelTag = newLvl;
        saveAdminCatalogLocal();
        renderHomeDashboardWidgets();
        renderAdminStudio();
        showAdminStatus(`✅ Уровень курса «${(course.titles && course.titles.ru) || course.id}» изменён на ${newLvl}.`, false);
      });
      controlsRow.appendChild(lvlSelect);

      rowCard.appendChild(controlsRow);

      // Раскрывающийся список модулей и уроков с возможностью переноса модуля в другой курс
      if (modList.length > 0) {
        const detailsEl = document.createElement('details');
        detailsEl.style.marginTop = '4px';
        const summaryEl = document.createElement('summary');
        summaryEl.style.cursor = 'pointer';
        summaryEl.style.fontSize = '0.78rem';
        summaryEl.style.color = '#7dd3fc';
        summaryEl.style.fontWeight = '600';
        summaryEl.textContent = `📖 Уроки внутри курса (${modList.length} мод. / ${regularLessonCount} ур.)`;
        detailsEl.appendChild(summaryEl);

        const modsWrap = document.createElement('div');
        modsWrap.style.display = 'flex';
        modsWrap.style.flexDirection = 'column';
        modsWrap.style.gap = '6px';
        modsWrap.style.marginTop = '6px';

        modList.forEach((mObj, mIdx) => {
          const mBox = document.createElement('div');
          mBox.style.padding = '7px 9px';
          mBox.style.borderRadius = '8px';
          mBox.style.background = 'rgba(2, 6, 23, 0.52)';
          mBox.style.border = '1px solid rgba(148, 163, 184, 0.14)';

          const lessonNames = (mObj.lessons || [])
            .map((ls, lIdx) => ls.isBoss ? '👹 Босс' : `${lIdx + 1}. ${(ls.titles && ls.titles.ru) || ls.id} (${(ls.words || []).length})`)
            .join(' · ');

          mBox.innerHTML = `
            <div style="font-size:0.8rem; font-weight:700; color:#e2e8f0;">
              ${escapeHtml((mObj.titles && mObj.titles.ru) || `Модуль ${mIdx + 1}`)}
            </div>
            <div style="font-size:0.74rem; color:#94a3b8; margin:3px 0 6px;">
              ${escapeHtml(lessonNames)}
            </div>
          `;

          const otherCourses = courses.filter(c => c.id !== course.id);
          if (otherCourses.length > 0) {
            const moveSelect = document.createElement('select');
            moveSelect.style.width = '100%';
            moveSelect.style.padding = '4px 8px';
            moveSelect.style.borderRadius = '7px';
            moveSelect.style.background = 'rgba(15, 23, 42, 0.9)';
            moveSelect.style.color = '#cbd5e1';
            moveSelect.style.border = '1px solid rgba(56, 189, 248, 0.25)';
            moveSelect.style.fontSize = '0.75rem';

            const placeholderOpt = document.createElement('option');
            placeholderOpt.value = '';
            placeholderOpt.textContent = '↪ Перенести эти уроки в другой курс...';
            moveSelect.appendChild(placeholderOpt);

            otherCourses.forEach(oc => {
              const opt = document.createElement('option');
              opt.value = oc.id;
              opt.textContent = `→ ${oc.icon || '📚'} ${(oc.titles && oc.titles.ru) || oc.id}`;
              moveSelect.appendChild(opt);
            });

            moveSelect.addEventListener('change', () => {
              if (moveSelect.value) {
                moveModuleBetweenOfficialCourses(orgLang, course.id, mObj.id, moveSelect.value);
              }
            });
            mBox.appendChild(moveSelect);
          }

          modsWrap.appendChild(mBox);
        });

        detailsEl.appendChild(modsWrap);
        rowCard.appendChild(detailsEl);
      }

      // Кнопки ↑ / ↓ / ▶ / 🗑️
      const upBtn = topRow.querySelector('.btn-org-up');
      if (upBtn) {
        upBtn.addEventListener('click', () => {
          if (globalIdx <= 0) return;
          courses.forEach((cItem, i) => {
            ensureCourseOverrideRecord(cItem.id).orderIndex = i;
          });
          const prevCourse = courses[globalIdx - 1];
          ensureCourseOverrideRecord(course.id).orderIndex = globalIdx - 1;
          ensureCourseOverrideRecord(prevCourse.id).orderIndex = globalIdx;
          saveAdminCatalogLocal();
          renderHomeDashboardWidgets();
          renderAdminStudio();
        });
      }

      const downBtn = topRow.querySelector('.btn-org-down');
      if (downBtn) {
        downBtn.addEventListener('click', () => {
          if (globalIdx >= courses.length - 1) return;
          courses.forEach((cItem, i) => {
            ensureCourseOverrideRecord(cItem.id).orderIndex = i;
          });
          const nextCourse = courses[globalIdx + 1];
          ensureCourseOverrideRecord(course.id).orderIndex = globalIdx + 1;
          ensureCourseOverrideRecord(nextCourse.id).orderIndex = globalIdx;
          saveAdminCatalogLocal();
          renderHomeDashboardWidgets();
          renderAdminStudio();
        });
      }

      const playBtn = topRow.querySelector('.btn-org-play');
      if (playBtn) {
        playBtn.addEventListener('click', () => {
          if (state.targetLang !== orgLang) {
            setTargetLanguage(orgLang);
          }
          launchDeckLessonFromPage(course.id, 0, 0);
        });
      }

      const delBtn = topRow.querySelector('.btn-org-del');
      if (delBtn) {
        delBtn.addEventListener('click', () => {
          const titleLabel = (course.titles && course.titles.ru) || course.id;
          if (!window.confirm(`Удалить / скрыть курс «${titleLabel}» из каталога?`)) return;
          if (Array.isArray(state.adminCatalog.courses[orgLang])) {
            state.adminCatalog.courses[orgLang] = state.adminCatalog.courses[orgLang].filter(c => c.id !== course.id);
          }
          if (!course.isAdminCreated) {
            const delSet = new Set(state.adminCatalog.deletedCourseIds || []);
            delSet.add(course.id);
            state.adminCatalog.deletedCourseIds = Array.from(delSet);
          }
          saveAdminCatalogLocal();
          ensureValidCourseSelection();
          renderLevelSidebar();
          renderHomeDashboardWidgets();
          renderAdminStudio();
          showAdminStatus(`🗑️ Курс «${titleLabel}» удалён из активного каталога.`, false);
        });
      }

      groupEl.appendChild(rowCard);
    });

    adminCategoriesTree.appendChild(groupEl);
  });

  if (Array.isArray(state.adminCatalog.deletedCourseIds) && state.adminCatalog.deletedCourseIds.length > 0) {
    const restoreBtn = document.createElement('button');
    restoreBtn.type = 'button';
    restoreBtn.className = 'deck-btn-secondary';
    restoreBtn.style.alignSelf = 'flex-start';
    restoreBtn.textContent = `↺ Восстановить скрытые базовые курсы (${state.adminCatalog.deletedCourseIds.length})`;
    restoreBtn.addEventListener('click', () => {
      state.adminCatalog.deletedCourseIds = [];
      saveAdminCatalogLocal();
      renderHomeDashboardWidgets();
      renderAdminStudio();
      showAdminStatus('✅ Все базовые курсы восстановлены!', false);
    });
    adminCategoriesTree.appendChild(restoreBtn);
  }
}

export function renderAdminStudio() {
  if (!adminStudioView) return;

  // Подгружаем сохранённые ключи в поля (если пользователь сейчас не печатает в них)
  const creds = getStoredAdminCreds();
  if (adminGeminiKeyInput && document.activeElement !== adminGeminiKeyInput) {
    adminGeminiKeyInput.value = ttsManager.localApiKey || '';
  }
  if (adminGithubTokenInput && document.activeElement !== adminGithubTokenInput) {
    adminGithubTokenInput.value = creds.ghToken;
  }
  if (adminPasswordInput && document.activeElement !== adminPasswordInput) {
    adminPasswordInput.value = creds.adminPass;
  }

  populateAdminCategorySelect();
  populateAdminTargetCourseSelect();

  const isAppend = adminPlacementModeSelect && adminPlacementModeSelect.value === 'append_course';
  if (adminAppendTargetWrap) {
    adminAppendTargetWrap.classList.toggle('hidden', !isAppend);
  }

  renderAdminLivePreview();
  renderAdminCategoriesTree();
}

export function bindAdminStudioEvents() {
  syncAdminVisibilityUI();

  if (btnAdminLockMode) {
    btnAdminLockMode.addEventListener('click', () => {
      lockAdminMode();
      btnAdminLockMode.blur();
    });
  }

  if (homeBrandLogo) {
    let logoClicks = 0;
    let logoTimer = null;
    homeBrandLogo.addEventListener('click', () => {
      logoClicks += 1;
      if (logoTimer) clearTimeout(logoTimer);
      logoTimer = setTimeout(() => { logoClicks = 0; }, 2500);
      if (logoClicks >= 5) {
        logoClicks = 0;
        clearTimeout(logoTimer);
        promptAndUnlockAdmin(true);
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.code === 'KeyA')) {
      e.preventDefault();
      promptAndUnlockAdmin(true);
    }
  });

  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1' || window.location.hash === '#admin') {
      params.delete('admin');
      const nextSearch = params.toString();
      const nextUrl = window.location.pathname + (nextSearch ? `?${nextSearch}` : '');
      window.history.replaceState({}, '', nextUrl);
      setTimeout(() => {
        promptAndUnlockAdmin(true);
      }, 120);
    }
  } catch (_) {}

  [btnNavAdmin, btnDecksOpenAdmin].forEach(el => {
    if (!el) return;
    el.addEventListener('click', () => {
      openAdminStudio();
      el.blur();
    });
  });

  if (btnAdminBackToDecks) {
    btnAdminBackToDecks.addEventListener('click', () => {
      openDecksPage({ sourceFilter: 'official' });
    });
  }

  if (btnAdminSaveCreds) {
    btnAdminSaveCreds.addEventListener('click', () => {
      const gemKey = (adminGeminiKeyInput && adminGeminiKeyInput.value.trim()) || '';
      const ghTok = (adminGithubTokenInput && adminGithubTokenInput.value.trim()) || '';
      const admPass = (adminPasswordInput && adminPasswordInput.value.trim()) || '';
      ttsManager.setLocalApiKey(gemKey);
      try {
        if (ghTok) localStorage.setItem(ADMIN_GH_TOKEN_LS_KEY, ghTok);
        else localStorage.removeItem(ADMIN_GH_TOKEN_LS_KEY);
        if (admPass) localStorage.setItem(ADMIN_PASSWORD_LS_KEY, admPass);
        else localStorage.removeItem(ADMIN_PASSWORD_LS_KEY);
      } catch (_) {}
      showAdminStatus('🔑 Ключи сохранены локально в вашем браузере (Gemini 3.8 AI + публикация на GitHub/Vercel).', false);
    });
  }

  if (btnAdminToggleNewCat && adminNewCategoryBox) {
    btnAdminToggleNewCat.addEventListener('click', () => {
      adminNewCategoryBox.classList.toggle('hidden');
      if (!adminNewCategoryBox.classList.contains('hidden') && adminNewCatTitleRu) {
        adminNewCatTitleRu.focus();
      }
    });
  }

  if (btnAdminCreateCategory) {
    btnAdminCreateCategory.addEventListener('click', () => {
      const ruTitle = (adminNewCatTitleRu && adminNewCatTitleRu.value.trim()) || '';
      if (!ruTitle) return;
      const enTitle = (adminNewCatTitleEn && adminNewCatTitleEn.value.trim()) || ruTitle;
      const iconChar = (adminNewCatIcon && adminNewCatIcon.value.trim()) || '📁';
      const catId = ruTitle
        .toLowerCase()
        .replace(/[^a-z0-9а-яё]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 24) || `cat-${Date.now().toString(36).slice(-4)}`;

      const existing = state.adminCatalog.categories || [];
      state.adminCatalog.categories = [
        ...existing.filter(c => c.id !== catId),
        {
          id: catId,
          icon: iconChar,
          titles: { ru: ruTitle, en: enTitle, he: enTitle }
        }
      ];
      saveAdminCatalogLocal();
      if (adminNewCatTitleRu) adminNewCatTitleRu.value = '';
      if (adminNewCatTitleEn) adminNewCatTitleEn.value = '';
      if (adminNewCategoryBox) adminNewCategoryBox.classList.add('hidden');
      if (adminIconInput) adminIconInput.value = iconChar;
      populateAdminCategorySelect(catId);
      renderAdminCategoriesTree();
      showAdminStatus(`🗂️ Создана новая категория «${iconChar} ${ruTitle}»!`, false);
    });
  }

  if (adminCategorySelect) {
    adminCategorySelect.addEventListener('change', () => {
      const catObj = getCategoryById(adminCategorySelect.value);
      if (catObj && catObj.icon && adminIconInput) {
        adminIconInput.value = catObj.icon;
      }
    });
  }

  if (adminPlacementModeSelect) {
    adminPlacementModeSelect.addEventListener('change', () => {
      const isAppend = adminPlacementModeSelect.value === 'append_course';
      if (adminAppendTargetWrap) {
        adminAppendTargetWrap.classList.toggle('hidden', !isAppend);
      }
      populateAdminTargetCourseSelect();
    });
  }

  if (adminCourseTitleInput) {
    adminCourseTitleInput.addEventListener('input', () => {
      state.adminTitleManuallyEdited = Boolean(adminCourseTitleInput.value.trim());
    });
  }

  [adminRawWordsTextarea, adminSourceLangSelect, adminTransLangSelect].forEach(el => {
    if (!el) return;
    const evName = el.tagName === 'TEXTAREA' ? 'input' : 'change';
    el.addEventListener(evName, () => {
      state.adminAiPreviewResult = null;
      if (el === adminSourceLangSelect) {
        populateAdminTargetCourseSelect();
      }
      renderAdminLivePreview();
    });
  });

  if (adminOrganizerLangTabs) {
    adminOrganizerLangTabs.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest && e.target.closest('[data-admin-org-lang]');
      if (!btn) return;
      const lg = btn.getAttribute('data-admin-org-lang');
      if (lg && TARGET_LANG_META[lg]) {
        state.adminOrgLang = lg;
        renderAdminCategoriesTree();
      }
    });
  }

  if (btnAdminAiPreview) {
    btnAdminAiPreview.addEventListener('click', async () => {
      const parsed = getAdminParsedDraft();
      if (parsed.words.length === 0) {
        showAdminStatus('⚠️ Сначала вставьте список слов в текстовое поле.', true);
        return;
      }
      const srcLang = (adminSourceLangSelect && adminSourceLangSelect.value) || 'de';
      const transLang = (adminTransLangSelect && adminTransLangSelect.value) || 'ru';
      const levelTag = (adminLevelSelect && adminLevelSelect.value) || 'B1';
      const courseTitle = (adminCourseTitleInput && adminCourseTitleInput.value.trim()) || parsed.detectedTitle || 'Новый курс';

      const prevText = btnAdminAiPreview.textContent;
      btnAdminAiPreview.disabled = true;
      btnAdminAiPreview.textContent = '⏳ Gemini 3.8 AI переводит...';
      showAdminStatus(`🤖 Переводим ${parsed.words.length} сл. на RU / EN / עברית через Gemini 3.8 Flash...`, false);

      try {
        const aiOut = await enrichWordsViaGeminiApi(parsed.words, srcLang, transLang, courseTitle, levelTag);
        state.adminAiPreviewResult = {
          targetLang: srcLang,
          courseTitles: aiOut.courseTitles,
          courseDescs: aiOut.courseDescs,
          byWordKey: aiOut.byWordKey
        };
        if (aiOut.courseTitles && aiOut.courseTitles.ru && adminCourseTitleInput && !state.adminTitleManuallyEdited) {
          adminCourseTitleInput.value = aiOut.courseTitles.ru;
        }
        renderAdminLivePreview();
        showAdminStatus(`✨ Готово! Переведены все ${parsed.words.length} карточек на русский, английский и иврит.`, false);
      } catch (err) {
        showAdminStatus(`⚠️ Не удалось выполнить AI-перевод: ${err && err.message ? err.message : 'ошибка'}. Проверьте ключ Gemini в блоке «🔑 Настройка».`, true);
      } finally {
        btnAdminAiPreview.disabled = false;
        btnAdminAiPreview.textContent = prevText;
      }
    });
  }

  if (btnAdminCreateAndPublish) {
    btnAdminCreateAndPublish.addEventListener('click', async () => {
      let parsed = getAdminParsedDraft();
      if (parsed.words.length === 0) {
        showAdminStatus('⚠️ Вставьте список слов (например, Start, der (-s);старт, начало) перед созданием уроков.', true);
        return;
      }

      const srcLang = (adminSourceLangSelect && adminSourceLangSelect.value) || 'de';
      const transLang = (adminTransLangSelect && adminTransLangSelect.value) || 'ru';
      const levelTag = (adminLevelSelect && adminLevelSelect.value) || 'B1';
      const category = (adminCategorySelect && adminCategorySelect.value) || 'business';
      const icon = (adminIconInput && adminIconInput.value.trim()) || '💼';
      const placementMode = (adminPlacementModeSelect && adminPlacementModeSelect.value) || 'new_course';
      const rawTitle = (adminCourseTitleInput && adminCourseTitleInput.value.trim()) || parsed.detectedTitle || 'Новый курс';

      const prevBtnLabel = btnAdminCreateAndPublish.textContent;
      btnAdminCreateAndPublish.disabled = true;
      btnAdminCreateAndPublish.textContent = '⏳ Собираем уроки и переводим...';

      let wordsToUse = parsed.words;
      let aiTitles = state.adminAiPreviewResult ? state.adminAiPreviewResult.courseTitles : null;
      let aiDescs = state.adminAiPreviewResult ? state.adminAiPreviewResult.courseDescs : null;

      try {
        if (adminAiEnrichUiCheck && adminAiEnrichUiCheck.checked && !state.adminAiPreviewResult) {
          try {
            showAdminStatus(`🤖 Авто-перевод ${wordsToUse.length} сл. (RU / EN / עברית) через Gemini 3.8 AI...`, false);
            const aiRes = await enrichWordsViaGeminiApi(wordsToUse, srcLang, transLang, rawTitle, levelTag);
            wordsToUse = aiRes.words;
            aiTitles = aiRes.courseTitles;
            aiDescs = aiRes.courseDescs;
          } catch (_) {
            // Продолжаем с авторским переводом без блокировки создания курса!
          }
        }

        if (placementMode === 'append_course') {
          const targetCourseId = adminTargetCourseSelect && adminTargetCourseSelect.value;
          if (!targetCourseId) {
            showAdminStatus('⚠️ Выберите существующий курс для добавления уроков.', true);
            return;
          }
          const tempCourse = AnkiImporter.buildOfficialAdminCourse({
            id: `${targetCourseId}-add-${Date.now().toString(36).slice(-4)}`,
            targetLang: srcLang,
            category,
            icon,
            levelTag,
            titles: aiTitles || { ru: rawTitle, en: rawTitle, he: rawTitle },
            descriptions: aiDescs,
            fallbackTitle: rawTitle,
            words: wordsToUse,
            lessonSize: 12
          });

          const mutableTarget = findMutableAdminCourse(targetCourseId, srcLang);
          if (mutableTarget) {
            mutableTarget.modules = [...(mutableTarget.modules || []), ...(tempCourse.modules || [])];
          } else {
            const ov = ensureCourseOverrideRecord(targetCourseId);
            ov.appendedModules = [...(Array.isArray(ov.appendedModules) ? ov.appendedModules : []), ...(tempCourse.modules || [])];
          }

          saveAdminCatalogLocal();
          await publishAdminCatalogToCloud(`feat(catalog): append ${wordsToUse.length} words (${rawTitle}) to ${targetCourseId}`);
        } else {
          const newCourse = AnkiImporter.buildOfficialAdminCourse({
            targetLang: srcLang,
            category,
            icon,
            levelTag,
            titles: aiTitles ? { ...aiTitles, ru: adminCourseTitleInput.value.trim() || aiTitles.ru } : null,
            descriptions: aiDescs,
            fallbackTitle: rawTitle,
            words: wordsToUse,
            lessonSize: 12
          });

          if (!Array.isArray(state.adminCatalog.courses[srcLang])) {
            state.adminCatalog.courses[srcLang] = [];
          }
          state.adminCatalog.courses[srcLang].push(newCourse);

          // Опциональное клонирование курса на другие изучаемые языки (EN / ES / DE)
          if (adminAiCloneTargetsCheck && adminAiCloneTargetsCheck.checked) {
            const otherLangs = ['de', 'en', 'es'].filter(lg => lg !== srcLang);
            for (const toLg of otherLangs) {
              try {
                showAdminStatus(`🌐 Генерируем версию курса для языка ${toLg.toUpperCase()} через Gemini 3.8 AI...`, false);
                const cloned = await cloneCourseToTargetLangViaGemini(
                  wordsToUse,
                  srcLang,
                  toLg,
                  rawTitle,
                  levelTag,
                  category,
                  icon
                );
                if (cloned) {
                  state.adminCatalog.courses[toLg].push(cloned);
                }
              } catch (_) {}
            }
          }

          state.adminOrgLang = srcLang;
          saveAdminCatalogLocal();
          if (state.targetLang === srcLang) {
            selectCourseLesson(newCourse.id, 0, 0, false);
          }
          await publishAdminCatalogToCloud(`feat(catalog): add ${srcLang.toUpperCase()} ${levelTag} course "${rawTitle}" (${wordsToUse.length} words)`);
        }

        // Очищаем черновик после успешного создания
        if (adminRawWordsTextarea) adminRawWordsTextarea.value = '';
        if (adminCourseTitleInput) adminCourseTitleInput.value = '';
        state.adminTitleManuallyEdited = false;
        state.adminAiPreviewResult = null;

        ensureValidCourseSelection();
        renderLevelSidebar();
        renderHomeDashboardWidgets();
        renderAdminStudio();
      } finally {
        btnAdminCreateAndPublish.disabled = false;
        btnAdminCreateAndPublish.textContent = prevBtnLabel;
      }
    });
  }

  if (btnAdminSyncCloud) {
    btnAdminSyncCloud.addEventListener('click', async () => {
      btnAdminSyncCloud.disabled = true;
      try {
        await publishAdminCatalogToCloud('chore(catalog): sync categories & courses from Super Admin Studio');
      } finally {
        btnAdminSyncCloud.disabled = false;
      }
    });
  }

  if (btnAdminExportJson) {
    btnAdminExportJson.addEventListener('click', () => {
      saveAdminCatalogLocal();
      const blob = new Blob([JSON.stringify(state.adminCatalog, null, 2) + '\n'], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'admin-catalog.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      showAdminStatus('📥 Файл admin-catalog.json скачан.', false);
    });
  }

  if (btnAdminImportJson && adminImportJsonInput) {
    btnAdminImportJson.addEventListener('click', () => {
      adminImportJsonInput.click();
    });
    adminImportJsonInput.addEventListener('change', async () => {
      const f = adminImportJsonInput.files && adminImportJsonInput.files[0];
      if (!f) return;
      try {
        const text = await f.text();
        const parsed = JSON.parse(text);
        state.adminCatalog = normalizeAdminCatalogObject(parsed);
        saveAdminCatalogLocal();
        ensureValidCourseSelection();
        renderLevelSidebar();
        renderHomeDashboardWidgets();
        renderAdminStudio();
        showAdminStatus('📤 Файл admin-catalog.json успешно загружен и применён!', false);
      } catch (err) {
        showAdminStatus(`⚠️ Ошибка чтения JSON: ${err && err.message ? err.message : 'некорректный файл'}`, true);
      } finally {
        adminImportJsonInput.value = '';
      }
    });
  }
}
