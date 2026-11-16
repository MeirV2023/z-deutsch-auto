// Полноэкранная страница «Мои колоды» / «Курсы» (ПК + Мобильные карточки и редактор) (SRP)
import { actions } from '../core/events.js';
import { FAV_DECKS_KEY, saveJsonStorage } from '../core/storage.js';
import { escapeHtml } from '../core/utils.js';
import { AnkiImporter } from '../anki/index.js';
import { sound } from '../services/sound-engine.js';
import { ttsManager } from '../services/tts-service.js';
import {
  dailyProgress,
  favoriteDeckIds,
  formatDeckWordsCountFull,
  getLocalizedField,
  getWordTranslation,
  isEntryPinned,
  isRtlTranslation,
  learnedWordsSet,
  state,
  t,
  toggleDeckFavorite,
  togglePinWord
} from '../state/store.js';
import {
  computeDeckStats,
  courseMatchesLevelFilter,
  ensureValidCourseSelection,
  getAllCategories,
  getAllWordsInCourse,
  getCourseCategoryBadgeText,
  getCoursesForTargetLang,
  getDeckArtClass,
  inferCourseCategory,
  isDeckFavorite
} from '../domain/catalog-service.js';
import {
  adminStudioView,
  arcadeLogoSub,
  arcadeTitleScreen,
  btnDecksCreateDeck,
  btnDecksMobileFilterToggle,
  btnDecksReturnBattle,
  btnDecksViewGrid,
  btnDecksViewList,
  btnMobFilterAll,
  btnMobFilterCourses,
  btnMobFilterFav,
  btnMobFilterUser,
  btnNavAdmin,
  btnNavDecks,
  btnNavHome,
  btnOpenCatalogHud,
  btnOpenCatalogTitle,
  btnOverlayCatalog,
  btnSidebarCatalog,
  btnTitleAllCourses,
  centerOverlay,
  courseBrowserDialog,
  deckContextMenu,
  deckDetailPane,
  decksAllCountBadge,
  decksAllGrid,
  decksCategoryFilterGroup,
  decksContinueGrid,
  decksContinueSection,
  decksFilterCard,
  decksHeroLearnedCount,
  decksHeroStreakCount,
  decksHeroSubtitleMobile,
  decksHeroTitle,
  decksHeroTotalCount,
  decksLevelFilterGroup,
  decksMobileFilterBar,
  decksOverviewPane,
  decksPageView,
  decksSearchInput,
  decksSidebarProgFill,
  decksSidebarProgPct,
  decksSidebarStartedNum,
  decksSidebarTotalLabel,
  decksSourceFilterGroup,
  homeDashboardView,
  labelMobFilterAll,
  labelMobFilterCourses,
  labelMobFilterFav,
  labelMobFilterUser,
  sidebarActiveDeckCard
} from './dom.js';
import { resizeCanvas } from '../engine/arena-physics.js';
import { renderLevelSidebar } from './hud-widgets.js';
import { launchFromTitleScreen } from '../engine/promo-autopilot.js';
import { selectCourseLesson, showLevelIntroOverlay, startLevelNow } from '../engine/gameplay.js';

export function closeDeckContextMenu() {
  if (!deckContextMenu || deckContextMenu.classList.contains('hidden')) return;
  deckContextMenu.classList.add('hidden');
  deckContextMenu.innerHTML = '';
  deckContextMenu.dataset.courseId = '';
}

export function openDeckContextMenu(anchorEl, course) {
  if (!deckContextMenu || !anchorEl || !course) return;
  if (!deckContextMenu.classList.contains('hidden') && deckContextMenu.dataset.courseId === course.id) {
    closeDeckContextMenu();
    return;
  }

  const tr = t();
  const isUser = course.source === 'user';
  const isFavExplicit = favoriteDeckIds.has(course.id);

  deckContextMenu.innerHTML = '';
  deckContextMenu.dataset.courseId = course.id;

  const addMenuAction = (label, onSelect, extraClass = '') => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'deck-action-item' + (extraClass ? ` ${extraClass}` : '');
    item.setAttribute('role', 'menuitem');
    item.textContent = label;
    item.addEventListener('click', (ev) => {
      ev.stopPropagation();
      closeDeckContextMenu();
      onSelect();
    });
    deckContextMenu.appendChild(item);
  };

  addMenuAction(tr.deckMenuOpen, () => {
    state.openedDeckId = course.id;
    state.openedDeckEditMode = false;
    state.openedDeckSubdeckFilter = 'all';
    state.openedDeckWordQuery = '';
    state.openedDeckWordsLimit = 120;
    renderDecksPage();
    if (arcadeTitleScreen) arcadeTitleScreen.scrollTo({ top: 0, behavior: 'smooth' });
  });

  addMenuAction(isFavExplicit ? tr.deckMenuFavRemove : tr.deckMenuFavAdd, () => {
    toggleDeckFavorite(course.id);
  });

  if (isUser) {
    addMenuAction(tr.deckMenuEdit, () => {
      state.openedDeckId = course.id;
      state.openedDeckEditMode = true;
      state.openedDeckSubdeckFilter = 'all';
      state.openedDeckWordQuery = '';
      state.openedDeckWordsLimit = 120;
      renderDecksPage();
      if (arcadeTitleScreen) arcadeTitleScreen.scrollTo({ top: 0, behavior: 'smooth' });
    });
    addMenuAction(tr.deleteDeckBtn, () => {
      removeUserDeckById(course.id);
    }, 'danger');
  } else {
    addMenuAction(tr.deckMenuAdmin, () => {
      actions.openAdminStudio(course.targetLang || state.targetLang);
    });
  }

  deckContextMenu.style.left = '12px';
  deckContextMenu.style.top = '12px';
  deckContextMenu.classList.remove('hidden');

  const btnRect = anchorEl.getBoundingClientRect();
  const menuRect = deckContextMenu.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isRtl = document.documentElement.dir === 'rtl';

  let left = isRtl ? btnRect.left : (btnRect.right - menuRect.width);
  left = Math.max(12, Math.min(vw - menuRect.width - 12, left));

  let top = btnRect.bottom + 6;
  if (top + menuRect.height > vh - 86) {
    top = Math.max(12, btnRect.top - menuRect.height - 6);
  }

  deckContextMenu.style.left = `${Math.round(left)}px`;
  deckContextMenu.style.top = `${Math.round(top)}px`;
}

export function openDecksPage(opts = {}) {
  closeDeckContextMenu();
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

  if (opts.sourceFilter) {
    state.catalogSourceFilter = opts.sourceFilter;
  }
  state.decksOnlyFavorites = Boolean(opts.onlyFavorites);
  if (typeof opts.openCourseId === 'string') {
    state.openedDeckId = opts.openCourseId;
  } else {
    state.openedDeckId = '';
  }
  state.openedDeckEditMode = Boolean(opts.editMode);
  state.openedDeckSubdeckFilter = 'all';
  state.openedDeckWordQuery = '';
  state.openedDeckWordsLimit = 120;

  actions.switchHomeSubView('decks');
}

export function resumeBattleFromDecksPage() {
  if (!state.decksOpenedFromPlay) {
    launchFromTitleScreen();
    return;
  }
  state.decksOpenedFromPlay = false;
  state.homeSubView = 'home';
  if (homeDashboardView) homeDashboardView.classList.remove('hidden');
  if (decksPageView) decksPageView.classList.add('hidden');
  if (adminStudioView) adminStudioView.classList.add('hidden');
  if (btnNavHome) btnNavHome.classList.add('active');
  if (btnNavDecks) btnNavDecks.classList.remove('active');
  if (btnNavAdmin) btnNavAdmin.classList.remove('active');

  state.screenMode = 'play';
  if (arcadeTitleScreen) arcadeTitleScreen.hidden = true;
  document.body.classList.remove('mode-title');
  document.body.classList.add('mode-play');
  resizeCanvas();

  if (state.running && !state.gameOver) {
    state.paused = false;
    centerOverlay.classList.add('hidden');
  } else {
    showLevelIntroOverlay();
  }
}

export function launchDeckLessonFromPage(courseId, modIdx = 0, lessonIdx = 0) {
  state.decksOpenedFromPlay = false;
  selectCourseLesson(courseId, modIdx, lessonIdx, false);
  if (state.screenMode === 'title') {
    launchFromTitleScreen();
  } else {
    startLevelNow();
  }
}

export async function removeUserDeckById(courseId) {
  if (!AnkiImporter) return;
  await AnkiImporter.deleteUserCourse(courseId);
  state.userCourses = state.userCourses.filter(x => x.id !== courseId);
  if (favoriteDeckIds.delete(courseId)) {
    saveJsonStorage(FAV_DECKS_KEY, Array.from(favoriteDeckIds));
  }
  if (state.activeCourseId === courseId) {
    state.activeCourseId = '';
    ensureValidCourseSelection();
  }
  if (state.openedDeckId === courseId) {
    state.openedDeckId = '';
    state.openedDeckEditMode = false;
  }
  renderLevelSidebar();
  actions.applyStaticUILocalization();
  renderDecksPage();
}

export function renderDeckDetailPane(course, stats) {
  if (!deckDetailPane || !course) return;
  const tr = t();
  const isUser = course.source === 'user';
  const artCls = getDeckArtClass(course);
  const originBadgeCls = !isUser ? 'creator' : 'anki';
  const originText = !isUser
    ? tr.decksCreatorBadge
    : (course.originType === 'anki' ? tr.decksAnkiBadge : tr.decksCustomBadge);
  const iconChar = course.icon || (isUser ? '📦' : '📚');
  const cTitle = getLocalizedField(course, 'titles');
  const cDesc = getLocalizedField(course, 'descriptions');
  const health = isUser && AnkiImporter && AnkiImporter.inspectDeckTranslationHealth
    ? AnkiImporter.inspectDeckTranslationHealth(course)
    : null;

  deckDetailPane.innerHTML = '';

  // 1. Верхняя полоса с возвратом ко всем колодам и быстрыми действиями
  const topbar = document.createElement('div');
  topbar.className = 'deck-detail-topbar';

  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'deck-back-btn';
  backBtn.textContent = tr.decksBackToAll;
  backBtn.addEventListener('click', () => {
    state.openedDeckId = '';
    state.openedDeckEditMode = false;
    renderDecksPage();
  });
  topbar.appendChild(backBtn);

  const actionsWrap = document.createElement('div');
  actionsWrap.className = 'deck-detail-actions';

  const playBtn = document.createElement('button');
  playBtn.type = 'button';
  playBtn.className = 'deck-btn-primary';
  playBtn.textContent = tr.decksContinueBtn;
  playBtn.addEventListener('click', () => {
    launchDeckLessonFromPage(course.id, stats.nextModIdx, stats.nextLessonIdx);
  });
  actionsWrap.appendChild(playBtn);

  const favToggleBtn = document.createElement('button');
  favToggleBtn.type = 'button';
  favToggleBtn.className = 'deck-btn-secondary';
  favToggleBtn.textContent = favoriteDeckIds.has(course.id) ? tr.deckMenuFavRemove : tr.deckMenuFavAdd;
  favToggleBtn.addEventListener('click', () => {
    toggleDeckFavorite(course.id);
  });
  actionsWrap.appendChild(favToggleBtn);

  if (isUser) {
    const editToggleBtn = document.createElement('button');
    editToggleBtn.type = 'button';
    editToggleBtn.className = 'deck-btn-secondary';
    editToggleBtn.textContent = tr.decksEditBtn;
    editToggleBtn.addEventListener('click', () => {
      state.openedDeckEditMode = !state.openedDeckEditMode;
      renderDeckDetailPane(course, stats);
    });
    actionsWrap.appendChild(editToggleBtn);

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'deck-delete-danger-btn';
    delBtn.textContent = tr.deleteDeckBtn;
    delBtn.addEventListener('click', () => removeUserDeckById(course.id));
    actionsWrap.appendChild(delBtn);
  } else {
    const manageAdminBtn = document.createElement('button');
    manageAdminBtn.type = 'button';
    manageAdminBtn.className = 'deck-btn-secondary';
    manageAdminBtn.textContent = `👑 ${tr.decksAdminBtn}`;
    manageAdminBtn.addEventListener('click', () => {
      actions.openAdminStudio(course.targetLang || state.targetLang);
    });
    actionsWrap.appendChild(manageAdminBtn);
  }

  topbar.appendChild(actionsWrap);
  deckDetailPane.appendChild(topbar);

  // 2. Шапка колоды и прогресс
  const catBadgeText = getCourseCategoryBadgeText(course);
  const heroRow = document.createElement('div');
  heroRow.className = 'deck-detail-hero';
  heroRow.innerHTML = `
    <div class="deck-detail-title-wrap">
      <div class="deck-icon-tile ${artCls}">${escapeHtml(iconChar)}</div>
      <div>
        <div class="deck-badges-inline">
          <span class="deck-tag-badge ${originBadgeCls}">${escapeHtml(originText)}</span>
          ${catBadgeText ? `<span class="deck-tag-badge category">${escapeHtml(catBadgeText)}</span>` : ''}
          <span class="deck-tag-badge cefr">${escapeHtml(course.levelTag || 'A2–B1')}</span>
          <span class="deck-tag-badge cefr">${escapeHtml(tr.wordsCount(stats.totalWords))}</span>
        </div>
        <h2 class="deck-detail-title">${escapeHtml(cTitle)}</h2>
        <p class="deck-detail-desc">${escapeHtml(cDesc)}</p>
      </div>
    </div>
    <div style="min-width: 220px; flex: 0 1 280px;">
      <div class="decks-prog-bar-row">
        <div class="decks-prog-track">
          <div class="decks-prog-fill" style="width: ${stats.pct}%;"></div>
        </div>
        <span class="decks-prog-pct">${stats.pct}%</span>
      </div>
      <div class="deck-lessons-count-sub" style="margin-top: 5px;">
        ${escapeHtml(tr.decksLessonsProgress(stats.doneLessons, stats.totalLessons))}
      </div>
    </div>
  `;
  deckDetailPane.appendChild(heroRow);

  if (health && health.brokenRu && state.nativeLang === 'ru') {
    const warnEl = document.createElement('div');
    warnEl.className = 'deck-broken-ru-alert';
    warnEl.innerHTML = `<span>${escapeHtml(tr.decksBrokenRuWarn)}</span>`;
    const fixDelBtn = document.createElement('button');
    fixDelBtn.type = 'button';
    fixDelBtn.textContent = tr.decksBrokenRuDeleteBtn;
    fixDelBtn.addEventListener('click', () => removeUserDeckById(course.id));
    warnEl.appendChild(fixDelBtn);
    deckDetailPane.appendChild(warnEl);
  }

  // 3. Встроенный редактор колоды (для личных и Anki-колод)
  if (isUser && state.openedDeckEditMode) {
    const editorBox = document.createElement('div');
    editorBox.className = 'deck-inline-editor';
    editorBox.innerHTML = `
      <div style="font-weight: 800; color: #6ee7b7; font-size: 0.95rem;">${escapeHtml(tr.decksEditorHeading)}</div>
      <div class="deck-editor-grid">
        <div class="anki-field-col">
          <label>${escapeHtml(tr.decksEditorTitleLabel)}</label>
          <input type="text" class="dict-search-input" id="inlineEditDeckTitle" value="${escapeHtml(cTitle)}" />
        </div>
        <div class="anki-field-col">
          <label>${escapeHtml(tr.decksEditorLevelLabel)}</label>
          <select class="dict-search-input" id="inlineEditDeckLevel">
            ${['A1–A2', 'A2–B1', 'B1', 'B1–B2', 'C1'].map(lv =>
              `<option value="${lv}"${(course.levelTag || 'A2–B1') === lv ? ' selected' : ''}>${lv}</option>`
            ).join('')}
          </select>
        </div>
      </div>
      <div class="anki-field-col">
        <label>${escapeHtml(tr.decksEditorAddLabel)}</label>
        <textarea class="custom-words-textarea" id="inlineEditAppendWords" rows="4" placeholder="der Bahnhof;вокзал&#10;abfahren;отправляться"></textarea>
      </div>
      <div class="deck-card-actions" style="justify-content: flex-start;">
        <button type="button" class="deck-btn-primary" style="flex: 0 0 auto;" id="btnInlineSaveDeck">${escapeHtml(tr.decksEditorSaveBtn)}</button>
        <button type="button" class="deck-btn-secondary" style="flex: 0 0 auto;" id="btnInlineCancelDeck">${escapeHtml(tr.decksEditorCancelBtn)}</button>
      </div>
    `;
    deckDetailPane.appendChild(editorBox);

    const saveBtn = editorBox.querySelector('#btnInlineSaveDeck');
    const cancelBtn = editorBox.querySelector('#btnInlineCancelDeck');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        state.openedDeckEditMode = false;
        renderDeckDetailPane(course, stats);
      });
    }
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        const titleInp = editorBox.querySelector('#inlineEditDeckTitle');
        const levelSel = editorBox.querySelector('#inlineEditDeckLevel');
        const appendArea = editorBox.querySelector('#inlineEditAppendWords');
        const existingWords = getAllWordsInCourse(course);
        const addedWords = [];
        if (appendArea && appendArea.value.trim()) {
          if (AnkiImporter && AnkiImporter.parseAdminTextbookBlock) {
            const parsedBlock = AnkiImporter.parseAdminTextbookBlock(
              appendArea.value,
              course.targetLang,
              state.nativeLang
            );
            addedWords.push(...(parsedBlock.words || []));
          } else {
            for (const line of appendArea.value.split(/\r?\n/)) {
              const trimmed = line.trim();
              if (!trimmed || (!trimmed.includes(';') && !trimmed.includes('\t'))) continue;
              const delim = trimmed.includes(';') ? ';' : '\t';
              const parts = trimmed.split(delim).map(s => s.trim());
              if (parts.length >= 2 && parts[0] && parts[1]) {
                const wEntry = AnkiImporter.normalizeCardToWordEntry(parts[0], parts[1], course.targetLang, parts[2] || '');
                if (wEntry) addedWords.push(wEntry);
              }
            }
          }
        }
        const combined = [...existingWords, ...addedWords];
        if (combined.length === 0) return;

        const rebuilt = AnkiImporter.buildUserCourse({
          id: course.id,
          title: (titleInp && titleInp.value.trim()) || cTitle,
          targetLang: course.targetLang,
          originType: course.originType || 'custom',
          levelTag: (levelSel && levelSel.value) || course.levelTag || 'A2–B1',
          createdAt: course.createdAt,
          words: combined,
          lessonSize: 12
        });
        await AnkiImporter.saveUserCourse(rebuilt);
        state.userCourses = state.userCourses.map(c => c.id === course.id ? rebuilt : c);
        state.openedDeckEditMode = false;
        renderLevelSidebar();
        actions.applyStaticUILocalization();
        renderDecksPage();
      });
    }
  }

  // 4. Фильтр разделов / подколод (особенно удобно для Anki с 10 подколодами!)
  const modules = course.modules || [];
  if (modules.length > 1) {
    const pillsRow = document.createElement('div');
    pillsRow.className = 'deck-subdeck-pills';

    const allPill = document.createElement('button');
    allPill.type = 'button';
    allPill.className = 'decks-level-pill' + (state.openedDeckSubdeckFilter === 'all' ? ' active' : '');
    allPill.textContent = tr.decksAllSections(modules.length);
    allPill.addEventListener('click', () => {
      state.openedDeckSubdeckFilter = 'all';
      state.openedDeckWordsLimit = 120;
      renderDeckDetailPane(course, stats);
    });
    pillsRow.appendChild(allPill);

    modules.forEach((mod, mIdx) => {
      const p = document.createElement('button');
      p.type = 'button';
      const key = String(mIdx);
      p.className = 'decks-level-pill' + (state.openedDeckSubdeckFilter === key ? ' active' : '');
      p.textContent = getLocalizedField(mod, 'titles');
      p.addEventListener('click', () => {
        state.openedDeckSubdeckFilter = key;
        state.openedDeckWordsLimit = 120;
        renderDeckDetailPane(course, stats);
      });
      pillsRow.appendChild(p);
    });

    deckDetailPane.appendChild(pillsRow);
  }

  // 5. Все уроки выбранного раздела (клик сразу запускает урок!)
  const visibleModules = state.openedDeckSubdeckFilter === 'all'
    ? modules.map((m, idx) => ({ mod: m, mIdx: idx }))
    : modules
      .map((m, idx) => ({ mod: m, mIdx: idx }))
      .filter(item => String(item.mIdx) === state.openedDeckSubdeckFilter);

  const allVisibleLessons = [];
  visibleModules.forEach(({ mod, mIdx }) => {
    (mod.lessons || []).forEach((ls, lIdx) => {
      allVisibleLessons.push({ mod, mIdx, ls, lIdx });
    });
  });

  const lessonsHeading = document.createElement('h3');
  lessonsHeading.className = 'decks-section-heading';
  lessonsHeading.style.fontSize = '1.02rem';
  lessonsHeading.textContent = tr.decksLessonsSectionTitle(allVisibleLessons.length);
  deckDetailPane.appendChild(lessonsHeading);

  const lessonsGrid = document.createElement('div');
  lessonsGrid.className = 'deck-detail-lessons-grid';
  allVisibleLessons.forEach(({ mod, mIdx, ls, lIdx }) => {
    const isDone = state.completedLessonIds.has(ls.id);
    const lTitle = getLocalizedField(ls, 'titles');
    const resolvedCount = ls.isBoss ? 14 : (ls.words || []).length;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'deck-mini-lesson' + (isDone ? ' done' : '');
    btn.innerHTML = `
      <div class="deck-mini-top">
        <span>${escapeHtml(ls.isBoss ? lTitle : `${tr.decksMiniLessonNum(lIdx + 1)} · ${tr.wordsShort(resolvedCount)}`)}</span>
        ${isDone ? '<span class="deck-mini-check">✓</span>' : ''}
      </div>
      <div class="deck-mini-sub">${escapeHtml(ls.isBoss ? tr.bossMetaLabel : `${getLocalizedField(mod, 'titles')} — ${lTitle}`)}</div>
    `;
    btn.addEventListener('click', () => {
      launchDeckLessonFromPage(course.id, mIdx, lIdx);
    });
    lessonsGrid.appendChild(btn);
  });
  deckDetailPane.appendChild(lessonsGrid);

  // 6. Список слов и переводов с живым поиском, озвучкой и звёздочкой ⭐
  const wordsBox = document.createElement('div');
  wordsBox.className = 'deck-detail-words-box';

  const sectionWords = [];
  const seenRaw = new Set();
  visibleModules.forEach(({ mod }) => {
    (mod.lessons || []).forEach(ls => {
      if (ls.isBoss) return;
      (ls.words || []).forEach(w => {
        const k = w.raw || w.word;
        if (!seenRaw.has(k)) {
          seenRaw.add(k);
          sectionWords.push(w);
        }
      });
    });
  });

  const q = (state.openedDeckWordQuery || '').trim().toLowerCase();
  const filteredWords = q
    ? sectionWords.filter(w => {
        const trMap = w.translations || {};
        return (
          String(w.raw || '').toLowerCase().includes(q) ||
          String(w.word || '').toLowerCase().includes(q) ||
          String(trMap.ru || '').toLowerCase().includes(q) ||
          String(trMap.en || '').toLowerCase().includes(q) ||
          String(trMap.he || '').toLowerCase().includes(q)
        );
      })
    : sectionWords;

  const wordsTopBar = document.createElement('div');
  wordsTopBar.className = 'deck-detail-topbar';
  wordsTopBar.style.borderBottom = 'none';
  wordsTopBar.style.paddingBottom = '0';

  const wTitle = document.createElement('h3');
  wTitle.className = 'decks-section-heading';
  wTitle.style.fontSize = '1.02rem';
  wTitle.textContent = tr.decksWordsSectionTitle(filteredWords.length);
  wordsTopBar.appendChild(wTitle);

  const wSearch = document.createElement('input');
  wSearch.type = 'search';
  wSearch.className = 'dict-search-input';
  wSearch.style.maxWidth = '320px';
  wSearch.placeholder = tr.dictSearchPlaceholder;
  wSearch.value = state.openedDeckWordQuery;
  wSearch.addEventListener('input', () => {
    state.openedDeckWordQuery = wSearch.value;
    state.openedDeckWordsLimit = 120;
    renderDeckDetailPane(course, stats);
    const nextInput = deckDetailPane.querySelector('.deck-detail-words-box input[type="search"]');
    if (nextInput) {
      nextInput.focus();
      const len = nextInput.value.length;
      nextInput.setSelectionRange(len, len);
    }
  });
  wordsTopBar.appendChild(wSearch);
  wordsBox.appendChild(wordsTopBar);

  const wordsGrid = document.createElement('div');
  wordsGrid.className = 'deck-words-list-grid';
  const visibleSlice = filteredWords.slice(0, state.openedDeckWordsLimit);

  visibleSlice.forEach(item => {
    const wCard = document.createElement('div');
    wCard.className = 'deck-word-item';
    const pinned = isEntryPinned(item, course.targetLang);
    const transStr = getWordTranslation(item);
    const rtlAttr = isRtlTranslation(item) ? ' dir="rtl"' : ' dir="ltr"';

    wCard.innerHTML = `
      <div class="deck-word-item-main">
        <div class="deck-word-foreign" dir="ltr">${escapeHtml(item.raw)}</div>
        <div class="deck-word-trans"${rtlAttr}>${escapeHtml(transStr)}</div>
      </div>
      <div class="deck-word-item-btns">
        <button type="button" class="hud-btn btn-speak-w" title="TTS">🔊</button>
        <button type="button" class="pin-star-btn${pinned ? ' pinned' : ''}" title="${escapeHtml(tr.pinTooltip)}">${pinned ? '⭐' : '☆'}</button>
        ${isUser && state.openedDeckEditMode ? '<button type="button" class="hud-btn btn-del-w" title="Удалить слово">✕</button>' : ''}
      </div>
    `;

    const speakBtn = wCard.querySelector('.btn-speak-w');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        sound.init();
        ttsManager.speak(item.withArticle || item.word, course.targetLang, true);
      });
    }
    const starBtn = wCard.querySelector('.pin-star-btn');
    if (starBtn) {
      starBtn.addEventListener('click', () => {
        togglePinWord(item, course.targetLang);
      });
    }
    const delWordBtn = wCard.querySelector('.btn-del-w');
    if (delWordBtn) {
      delWordBtn.addEventListener('click', async () => {
        const remaining = getAllWordsInCourse(course).filter(x => (x.raw || x.word) !== (item.raw || item.word));
        if (remaining.length === 0) return;
        const rebuilt = AnkiImporter.buildUserCourse({
          id: course.id,
          title: cTitle,
          targetLang: course.targetLang,
          originType: course.originType || 'custom',
          levelTag: course.levelTag || 'A2–B1',
          createdAt: course.createdAt,
          words: remaining,
          lessonSize: 12
        });
        await AnkiImporter.saveUserCourse(rebuilt);
        state.userCourses = state.userCourses.map(c => c.id === course.id ? rebuilt : c);
        renderLevelSidebar();
        renderDecksPage();
      });
    }

    wordsGrid.appendChild(wCard);
  });

  wordsBox.appendChild(wordsGrid);

  if (filteredWords.length > visibleSlice.length) {
    const moreBtn = document.createElement('button');
    moreBtn.type = 'button';
    moreBtn.className = 'deck-btn-secondary';
    moreBtn.style.alignSelf = 'center';
    moreBtn.textContent = tr.decksShowMoreWords(filteredWords.length - visibleSlice.length);
    moreBtn.addEventListener('click', () => {
      state.openedDeckWordsLimit += 150;
      renderDeckDetailPane(course, stats);
    });
    wordsBox.appendChild(moreBtn);
  }

  deckDetailPane.appendChild(wordsBox);
}

export function renderDecksPage() {
  if (!decksPageView) return;
  closeDeckContextMenu();
  const tr = t();
  const isMobileViewport = window.innerWidth <= 768;
  const allForLang = getCoursesForTargetLang(state.targetLang);
  const statsById = new Map();
  let startedCount = 0;

  allForLang.forEach(c => {
    const st = computeDeckStats(c);
    statsById.set(c.id, st);
    if (st.isStarted) startedCount++;
  });

  // 1. Синхронизация шапки, мобильных чипов и боковых фильтров
  if (decksHeroTitle) {
    decksHeroTitle.textContent = tr.decksHeroTitleMy;
  }
  if (decksHeroSubtitleMobile && tr.decksHeroSubMobile) {
    decksHeroSubtitleMobile.textContent = tr.decksHeroSubMobile;
  }
  if (decksSearchInput) {
    decksSearchInput.placeholder = (isMobileViewport && tr.decksSearchPlaceholderMobile)
      ? tr.decksSearchPlaceholderMobile
      : tr.decksSearchPlaceholder;
  }
  if (btnNavDecks && state.homeSubView === 'decks') {
    btnNavDecks.classList.add('active');
  }
  if (btnDecksReturnBattle) {
    btnDecksReturnBattle.classList.toggle('hidden', !state.decksOpenedFromPlay);
    const subbarRow = btnDecksReturnBattle.closest('.decks-subbar-row');
    if (subbarRow) {
      subbarRow.classList.toggle('has-return-battle', Boolean(state.decksOpenedFromPlay));
    }
  }
  if (btnDecksViewGrid) {
    btnDecksViewGrid.classList.toggle('active', state.decksViewMode !== 'list');
  }
  if (btnDecksViewList) {
    btnDecksViewList.classList.toggle('active', state.decksViewMode === 'list');
  }
  if (decksAllGrid) {
    decksAllGrid.classList.toggle('list-mode', state.decksViewMode === 'list');
  }

  // Мобильная полоса из 4 чипов фильтрации с живыми счётчиками: Все (N) · Курсы (N) · Мои (N) · Избранные
  const allCount = allForLang.length;
  const officialCount = allForLang.filter(c => c.source !== 'user').length;
  const userCount = allForLang.filter(c => c.source === 'user').length;
  const favCount = allForLang.filter(c => isDeckFavorite(c)).length;

  if (labelMobFilterAll && tr.mobFilterAll) labelMobFilterAll.textContent = tr.mobFilterAll(allCount);
  if (labelMobFilterCourses && tr.mobFilterCourses) labelMobFilterCourses.textContent = tr.mobFilterCourses(officialCount);
  if (labelMobFilterUser && tr.mobFilterMy) labelMobFilterUser.textContent = tr.mobFilterMy(userCount);
  if (labelMobFilterFav && tr.mobFilterFav) labelMobFilterFav.textContent = tr.mobFilterFav(favCount);

  if (btnMobFilterAll) {
    btnMobFilterAll.classList.toggle('active', !state.decksOnlyFavorites && state.catalogSourceFilter === 'all');
  }
  if (btnMobFilterCourses) {
    btnMobFilterCourses.classList.toggle('active', !state.decksOnlyFavorites && state.catalogSourceFilter === 'official');
  }
  if (btnMobFilterUser) {
    btnMobFilterUser.classList.toggle('active', !state.decksOnlyFavorites && state.catalogSourceFilter === 'user');
  }
  if (btnMobFilterFav) {
    btnMobFilterFav.classList.toggle('active', Boolean(state.decksOnlyFavorites));
  }

  if (decksSourceFilterGroup) {
    decksSourceFilterGroup.querySelectorAll('.decks-source-btn').forEach(btn => {
      btn.classList.toggle('active', !state.decksOnlyFavorites && btn.dataset.sourceFilter === state.catalogSourceFilter);
    });
  }
  if (decksCategoryFilterGroup) {
    const usedCatIds = new Set();
    allForLang.forEach(c => {
      if (c.source !== 'user') usedCatIds.add(inferCourseCategory(c));
    });
    const allCats = getAllCategories().filter(cat =>
      usedCatIds.has(cat.id) || cat.id === 'auto' || cat.id === 'business'
    );
    if (state.decksCategoryFilter !== 'all' && !allCats.some(c => c.id === state.decksCategoryFilter)) {
      state.decksCategoryFilter = 'all';
    }
    decksCategoryFilterGroup.innerHTML = '';
    const allCatBtn = document.createElement('button');
    allCatBtn.type = 'button';
    allCatBtn.className = 'decks-level-pill' + (state.decksCategoryFilter === 'all' ? ' active' : '');
    allCatBtn.dataset.categoryFilter = 'all';
    allCatBtn.textContent = tr.decksLevelAll;
    decksCategoryFilterGroup.appendChild(allCatBtn);

    allCats.forEach(cat => {
      const cBtn = document.createElement('button');
      cBtn.type = 'button';
      cBtn.className = 'decks-level-pill' + (state.decksCategoryFilter === cat.id ? ' active' : '');
      cBtn.dataset.categoryFilter = cat.id;
      const cLabel = getLocalizedField(cat, 'titles') || cat.id;
      cBtn.textContent = `${cat.icon || '🗂️'} ${cLabel}`;
      decksCategoryFilterGroup.appendChild(cBtn);
    });
  }
  if (decksLevelFilterGroup) {
    decksLevelFilterGroup.querySelectorAll('.decks-level-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.levelFilter === state.decksLevelFilter);
    });
  }

  // 2. Карточка прогресса в левом сайдбаре и 3 метрики в Hero-баннере
  const totalDecksCount = allForLang.length;
  const sidebarPct = totalDecksCount > 0 ? Math.round((startedCount / totalDecksCount) * 100) : 0;
  if (decksSidebarStartedNum) decksSidebarStartedNum.textContent = String(startedCount);
  if (decksSidebarTotalLabel) decksSidebarTotalLabel.textContent = tr.decksOfTotalDecks(totalDecksCount);
  if (decksSidebarProgFill) decksSidebarProgFill.style.width = `${sidebarPct}%`;
  if (decksSidebarProgPct) decksSidebarProgPct.textContent = `${sidebarPct}%`;

  if (decksHeroTotalCount) decksHeroTotalCount.textContent = String(totalDecksCount);
  if (decksHeroLearnedCount) decksHeroLearnedCount.textContent = learnedWordsSet.size.toLocaleString();
  if (decksHeroStreakCount) decksHeroStreakCount.textContent = tr.streakDays(dailyProgress.streakDays || 1);

  // 3. Если открыта конкретная колода — показываем встроенную страницу деталей вместо обзора
  if (state.openedDeckId) {
    const openedCourse = allForLang.find(c => c.id === state.openedDeckId);
    if (openedCourse) {
      decksPageView.classList.add('detail-open');
      if (decksOverviewPane) decksOverviewPane.classList.add('hidden');
      if (deckDetailPane) deckDetailPane.classList.remove('hidden');
      renderDeckDetailPane(openedCourse, statsById.get(openedCourse.id) || computeDeckStats(openedCourse));
      return;
    }
    state.openedDeckId = '';
    state.openedDeckEditMode = false;
  }

  decksPageView.classList.remove('detail-open');
  if (decksOverviewPane) decksOverviewPane.classList.remove('hidden');
  if (deckDetailPane) deckDetailPane.classList.add('hidden');

  // 4. Полоса «▶ Продолжить обучение» (до 3 колод: активная + пользовательские Anki + начатые)
  if (decksContinueGrid && decksContinueSection) {
    const prioritized = allForLang.slice().sort((a, b) => {
      const aActive = a.id === state.activeCourseId ? 1 : 0;
      const bActive = b.id === state.activeCourseId ? 1 : 0;
      if (aActive !== bActive) return bActive - aActive;
      const aUser = a.source === 'user' ? 1 : 0;
      const bUser = b.source === 'user' ? 1 : 0;
      if (aUser !== bUser) return bUser - aUser;
      const stA = statsById.get(a.id);
      const stB = statsById.get(b.id);
      return (stB ? stB.pct : 0) - (stA ? stA.pct : 0);
    }).slice(0, 3);

    decksContinueSection.classList.toggle('hidden', prioritized.length === 0);
    decksContinueGrid.innerHTML = '';

    prioritized.forEach(course => {
      const st = statsById.get(course.id) || computeDeckStats(course);
      const isUser = course.source === 'user';
      const artCls = getDeckArtClass(course);
      const badgeCls = !isUser ? 'creator' : 'anki';
      const badgeText = !isUser
        ? tr.decksCreatorBadge
        : (course.originType === 'anki' ? tr.decksAnkiBadge : tr.decksCustomBadge);
      const iconChar = course.icon || (isUser ? '📦' : '📚');
      const titleStr = getLocalizedField(course, 'titles');
      const catBadgeText = getCourseCategoryBadgeText(course);

      const contCard = document.createElement('div');
      contCard.className = 'deck-continue-card' + (course.id === state.activeCourseId ? ' is-active' : '');
      contCard.innerHTML = `
        <div class="deck-icon-tile ${artCls}">${escapeHtml(iconChar)}</div>
        <div class="deck-cont-body">
          <div class="deck-badges-inline">
            <span class="deck-tag-badge ${badgeCls}">${escapeHtml(badgeText)}</span>
            ${catBadgeText ? `<span class="deck-tag-badge category">${escapeHtml(catBadgeText)}</span>` : ''}
            <span class="deck-tag-badge cefr">${escapeHtml(course.levelTag || 'A2–B1')}</span>
          </div>
          <div class="deck-cont-title" title="${escapeHtml(titleStr)}">${escapeHtml(titleStr)}</div>
          <div class="deck-cont-meta">${escapeHtml(tr.decksMetaWordsLessons(st.totalWords.toLocaleString(), st.doneLessons, st.totalLessons))}</div>
          <div class="decks-prog-bar-row">
            <div class="decks-prog-track">
              <div class="decks-prog-fill" style="width: ${st.pct}%;"></div>
            </div>
            <span class="decks-prog-pct">${st.pct}%</span>
          </div>
        </div>
        <button type="button" class="deck-cont-btn">${escapeHtml(tr.decksContinueBtn)}</button>
      `;

      const btn = contCard.querySelector('.deck-cont-btn');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          launchDeckLessonFromPage(course.id, st.nextModIdx, st.nextLessonIdx);
        });
      }
      contCard.addEventListener('click', () => {
        state.openedDeckId = course.id;
        state.openedDeckEditMode = false;
        state.openedDeckSubdeckFilter = 'all';
        state.openedDeckWordQuery = '';
        state.openedDeckWordsLimit = 120;
        renderDecksPage();
      });
      decksContinueGrid.appendChild(contCard);
    });
  }

  // 5. Сетка «📚 Все колоды (N)» с учётом фильтров источника, избранных, категории, уровня CEFR и поиска
  const searchQ = (state.decksSearchQuery || '').trim().toLowerCase();
  const filteredDecks = allForLang.filter(course => {
    if (state.decksOnlyFavorites) {
      if (!isDeckFavorite(course)) return false;
    } else {
      if (state.catalogSourceFilter === 'official' && course.source === 'user') return false;
      if (state.catalogSourceFilter === 'user' && course.source !== 'user') return false;
    }
    if (!isMobileViewport) {
      if (state.decksCategoryFilter && state.decksCategoryFilter !== 'all') {
        if (course.source === 'user') return false;
        if (inferCourseCategory(course) !== state.decksCategoryFilter) return false;
      }
      if (!courseMatchesLevelFilter(course, state.decksLevelFilter)) return false;
    }

    if (!searchQ) return true;
    const tStr = getLocalizedField(course, 'titles').toLowerCase();
    const dStr = getLocalizedField(course, 'descriptions').toLowerCase();
    if (tStr.includes(searchQ) || dStr.includes(searchQ)) return true;

    const words = getAllWordsInCourse(course);
    for (const w of words) {
      if (
        String(w.raw || '').toLowerCase().includes(searchQ) ||
        String((w.translations && w.translations.ru) || '').toLowerCase().includes(searchQ) ||
        String((w.translations && w.translations.en) || '').toLowerCase().includes(searchQ)
      ) {
        return true;
      }
    }
    return false;
  });

  // На мобильном: активная колода первой, далее курсы и личные колоды в естественном порядке; на ПК — личные/Anki тоже в 1-м ряду
  const orderedDecks = filteredDecks.slice().sort((a, b) => {
    if (isMobileViewport) {
      const aAct = a.id === state.activeCourseId ? 1 : 0;
      const bAct = b.id === state.activeCourseId ? 1 : 0;
      return bAct - aAct;
    }
    const aFirst = a.id === state.activeCourseId ? 2 : (a.source === 'user' ? 1 : 0);
    const bFirst = b.id === state.activeCourseId ? 2 : (b.source === 'user' ? 1 : 0);
    if (aFirst !== bFirst) return bFirst - aFirst;
    return 0;
  });

  if (decksAllCountBadge) {
    decksAllCountBadge.textContent = `(${orderedDecks.length})`;
  }
  if (!decksAllGrid) return;
  decksAllGrid.innerHTML = '';

  if (orderedDecks.length === 0) {
    const emptyBox = document.createElement('div');
    emptyBox.className = 'kill-feed-empty';
    emptyBox.style.gridColumn = '1 / -1';
    emptyBox.style.padding = '28px';
    emptyBox.textContent = state.catalogSourceFilter === 'user' && !state.decksOnlyFavorites && !searchQ && state.decksLevelFilter === 'all'
      ? tr.emptyUserCourses
      : tr.decksEmptyFiltered;
    decksAllGrid.appendChild(emptyBox);
    return;
  }

  const openCourseDetails = (courseId, editMode = false) => {
    state.openedDeckId = courseId;
    state.openedDeckEditMode = Boolean(editMode);
    state.openedDeckSubdeckFilter = 'all';
    state.openedDeckWordQuery = '';
    state.openedDeckWordsLimit = 120;
    renderDecksPage();
    if (arcadeTitleScreen) arcadeTitleScreen.scrollTo({ top: 0, behavior: 'smooth' });
  };

  orderedDecks.forEach(course => {
    const st = statsById.get(course.id) || computeDeckStats(course);
    const isUser = course.source === 'user';
    const artCls = getDeckArtClass(course);
    const badgeCls = !isUser ? 'creator' : 'anki';
    const badgeText = !isUser
      ? tr.decksCreatorBadge
      : (course.originType === 'anki' ? tr.decksAnkiBadge : tr.decksCustomBadge);
    const iconChar = course.icon || (isUser ? '📦' : '📚');
    const titleStr = getLocalizedField(course, 'titles');
    const descStr = getLocalizedField(course, 'descriptions');
    const catBadgeText = getCourseCategoryBadgeText(course);
    const health = isUser && AnkiImporter && AnkiImporter.inspectDeckTranslationHealth
      ? AnkiImporter.inspectDeckTranslationHealth(course)
      : null;

    const card = document.createElement('article');
    card.className = 'deck-full-card' + (course.id === state.activeCourseId ? ' is-active' : '');

    // --- А) ДЕСКТОПНОЕ СОДЕРЖИМОЕ КАРТОЧКИ (> 768px — 100% без изменений!) ---
    const desktopInner = document.createElement('div');
    desktopInner.className = 'deck-desktop-card-inner';

    const topDiv = document.createElement('div');
    topDiv.className = 'deck-card-top';
    topDiv.innerHTML = `
      <div class="deck-icon-tile ${artCls}">${escapeHtml(iconChar)}</div>
      <div class="deck-card-head-info">
        <div class="deck-card-top-bar">
          <div class="deck-badges-inline">
            <span class="deck-tag-badge ${badgeCls}">${escapeHtml(badgeText)}</span>
            ${catBadgeText ? `<span class="deck-tag-badge category">${escapeHtml(catBadgeText)}</span>` : ''}
            <span class="deck-tag-badge cefr">${escapeHtml(course.levelTag || 'A2–B1')}</span>
          </div>
          <button type="button" class="deck-more-btn" aria-label="More">•••</button>
        </div>
        <h3 class="deck-card-title">${escapeHtml(titleStr)}</h3>
        <p class="deck-card-desc">${escapeHtml(descStr)}</p>
      </div>
    `;
    const moreBtn = topDiv.querySelector('.deck-more-btn');
    if (moreBtn) {
      moreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDeckContextMenu(moreBtn, course);
      });
    }
    desktopInner.appendChild(topDiv);

    if (health && health.brokenRu && state.nativeLang === 'ru') {
      const warnRow = document.createElement('div');
      warnRow.className = 'deck-broken-ru-alert';
      warnRow.innerHTML = `<span>${escapeHtml(tr.decksBrokenRuWarn)}</span>`;
      const quickDel = document.createElement('button');
      quickDel.type = 'button';
      quickDel.textContent = tr.decksBrokenRuDeleteBtn;
      quickDel.addEventListener('click', (e) => {
        e.stopPropagation();
        removeUserDeckById(course.id);
      });
      warnRow.appendChild(quickDel);
      desktopInner.appendChild(warnRow);
    }

    // 3 мини-плитки первых уроков колоды
    if (st.previewLessons.length > 0) {
      const previewRow = document.createElement('div');
      previewRow.className = 'deck-lessons-preview-row';
      st.previewLessons.forEach((pItem, idx) => {
        const miniBtn = document.createElement('button');
        miniBtn.type = 'button';
        miniBtn.className = 'deck-mini-lesson' + (pItem.isDone ? ' done' : '');
        const cleanLessonName = getLocalizedField(pItem.ls, 'titles');
        miniBtn.innerHTML = `
          <div class="deck-mini-top">
            <span>${escapeHtml(tr.decksMiniLessonNum(idx + 1))}</span>
            ${pItem.isDone ? '<span class="deck-mini-check">✓</span>' : ''}
          </div>
          <div class="deck-mini-sub">${escapeHtml(cleanLessonName)}</div>
        `;
        miniBtn.addEventListener('click', () => {
          launchDeckLessonFromPage(course.id, pItem.mIdx, pItem.lIdx);
        });
        previewRow.appendChild(miniBtn);
      });
      desktopInner.appendChild(previewRow);
    }

    // Полоса прогресса + счётчик уроков
    const progBlock = document.createElement('div');
    progBlock.className = 'deck-progress-block';
    progBlock.innerHTML = `
      <div class="decks-prog-bar-row">
        <div class="decks-prog-track">
          <div class="decks-prog-fill" style="width: ${st.pct}%;"></div>
        </div>
        <span class="decks-prog-pct">${st.pct}%</span>
      </div>
      <div class="deck-lessons-count-sub">${escapeHtml(tr.decksLessonsProgress(st.doneLessons, st.totalLessons))}</div>
    `;
    desktopInner.appendChild(progBlock);

    // Кнопки карточки: [▶ Продолжить] [📖 Открыть] + [✏️ Редактировать] для личных/Anki
    const actRow = document.createElement('div');
    actRow.className = 'deck-card-actions';

    const contBtn = document.createElement('button');
    contBtn.type = 'button';
    contBtn.className = 'deck-btn-primary';
    contBtn.textContent = tr.decksContinueBtn;
    contBtn.addEventListener('click', () => {
      launchDeckLessonFromPage(course.id, st.nextModIdx, st.nextLessonIdx);
    });
    actRow.appendChild(contBtn);

    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'deck-btn-secondary';
    openBtn.textContent = tr.decksOpenBtn;
    openBtn.addEventListener('click', () => {
      openCourseDetails(course.id, false);
    });
    actRow.appendChild(openBtn);

    if (isUser) {
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'deck-btn-secondary';
      editBtn.textContent = tr.decksEditBtn;
      editBtn.addEventListener('click', () => {
        openCourseDetails(course.id, true);
      });
      actRow.appendChild(editBtn);
    }

    desktopInner.appendChild(actRow);
    card.appendChild(desktopInner);

    // --- Б) МОБИЛЬНАЯ ГОРИЗОНТАЛЬНАЯ КАРТОЧКА КОЛОДЫ (<= 768px) ---
    const mobInner = document.createElement('div');
    mobInner.className = 'deck-mobile-card-inner';

    const isAnkiDeck = isUser && course.originType === 'anki';
    const mobIconMarkup = isAnkiDeck
      ? `<svg class="deck-anki-cards-svg" viewBox="0 0 36 36" fill="none" aria-hidden="true">
           <g transform="rotate(-10 15 18)">
             <rect x="6.5" y="7" width="17" height="22" rx="3.5" fill="#93c5fd" fill-opacity="0.55" stroke="#dbeafe" stroke-width="1.15"/>
           </g>
           <g transform="rotate(6 21 18)">
             <rect x="12.5" y="6.5" width="17.5" height="22.5" rx="3.6" fill="#f8fafc" stroke="#dbeafe" stroke-width="1.15"/>
             <path d="M18 22.5L21.25 13L24.5 22.5M19.1 20H23.4" stroke="#2563eb" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
           </g>
         </svg>`
      : escapeHtml(iconChar);

    const wordsFullText = formatDeckWordsCountFull(st.totalWords);
    const mobMetaSvg = !isUser
      ? `<svg class="deck-mob-meta-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3Zm-6.5 9.18V16c0 2.21 2.91 4 6.5 4s6.5-1.79 6.5-4v-3.82L12 15.73l-6.5-3.55Z"/></svg>`
      : `<svg class="deck-mob-meta-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2.25c-4.2 0-7.75 2.15-7.75 4.95 0 .72.58 1.3 1.3 1.3h12.9c.72 0 1.3-.58 1.3-1.3 0-2.8-3.55-4.95-7.75-4.95Z"/></svg>`;

    const mobMetaText = !isUser
      ? `${course.levelTag || 'A2–B1'} · ${wordsFullText} · ${tr.deckMetaCourseLabel || 'Курс'}`
      : `${wordsFullText} · ${isAnkiDeck ? (tr.deckMetaAnkiLabel || 'Импорт Anki') : (tr.deckMetaCustomLabel || 'Личная')}`;

    const ctaStarted = st.pct > 0;
    const ctaClass = ctaStarted ? 'continue' : 'start';
    const ctaLabel = ctaStarted ? (tr.decksContinueLabel || 'Продолжить') : (tr.decksStartLabel || 'Начать');
    const favStarHtml = favoriteDeckIds.has(course.id)
      ? `<span class="deck-mob-fav-star" aria-hidden="true">★</span>`
      : '';

    mobInner.innerHTML = `
      <div class="deck-icon-tile deck-mob-icon-tile ${artCls}">${mobIconMarkup}</div>
      <div class="deck-mob-body">
        <div class="deck-mob-top-row">
          <h3 class="deck-mob-title" title="${escapeHtml(titleStr)}">${escapeHtml(titleStr)}</h3>
          <button type="button" class="deck-mob-dots-btn" aria-label="More">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <circle cx="12" cy="5" r="2"/>
              <circle cx="12" cy="12" r="2"/>
              <circle cx="12" cy="19" r="2"/>
            </svg>
          </button>
        </div>
        <div class="deck-mob-meta">
          ${mobMetaSvg}
          <span>${escapeHtml(mobMetaText)}</span>
          ${favStarHtml}
        </div>
        <div class="deck-mob-bottom-row">
          <div class="deck-mob-prog-wrap">
            <div class="deck-mob-prog-track">
              <div class="deck-mob-prog-fill" style="width: ${st.pct}%;"></div>
            </div>
            <span class="deck-mob-prog-pct">${st.pct}%</span>
          </div>
          <button type="button" class="deck-mob-cta ${ctaClass}">
            <span class="deck-mob-play-tri" aria-hidden="true">▶</span>
            <span>${escapeHtml(ctaLabel)}</span>
          </button>
        </div>
      </div>
    `;

    const mobCtaBtn = mobInner.querySelector('.deck-mob-cta');
    if (mobCtaBtn) {
      mobCtaBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDeckContextMenu();
        launchDeckLessonFromPage(course.id, st.nextModIdx, st.nextLessonIdx);
      });
    }

    const mobDotsBtn = mobInner.querySelector('.deck-mob-dots-btn');
    if (mobDotsBtn) {
      mobDotsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDeckContextMenu(mobDotsBtn, course);
      });
    }

    mobInner.addEventListener('click', () => {
      closeDeckContextMenu();
      openCourseDetails(course.id, false);
    });

    card.appendChild(mobInner);

    if (health && health.brokenRu && state.nativeLang === 'ru' && isMobileViewport) {
      const mobWarn = document.createElement('div');
      mobWarn.className = 'deck-broken-ru-alert';
      mobWarn.innerHTML = `<span>${escapeHtml(tr.decksBrokenRuWarn)}</span>`;
      const mobQuickDel = document.createElement('button');
      mobQuickDel.type = 'button';
      mobQuickDel.textContent = tr.decksBrokenRuDeleteBtn;
      mobQuickDel.addEventListener('click', (e) => {
        e.stopPropagation();
        removeUserDeckById(course.id);
      });
      mobWarn.appendChild(mobQuickDel);
      card.appendChild(mobWarn);
    }

    decksAllGrid.appendChild(card);
  });
}

export function renderCourseBrowserModal() {
  renderDecksPage();
}

export function openCourseCatalogModal(initialFilter = 'all') {
  openDecksPage({
    sourceFilter: initialFilter
  });
}

export function bindDecksPageEvents() {
  [btnNavDecks, btnOpenCatalogTitle, btnTitleAllCourses, arcadeLogoSub, btnOpenCatalogHud, btnSidebarCatalog, btnOverlayCatalog].forEach(el => {
    if (!el) return;
    el.addEventListener('click', () => {
      openDecksPage({ sourceFilter: 'all' });
      el.blur();
    });
  });

  if (btnDecksReturnBattle) {
    btnDecksReturnBattle.addEventListener('click', () => {
      resumeBattleFromDecksPage();
      btnDecksReturnBattle.blur();
    });
  }

  if (btnDecksViewGrid) {
    btnDecksViewGrid.addEventListener('click', () => {
      state.decksViewMode = 'grid';
      renderDecksPage();
    });
  }

  if (btnDecksViewList) {
    btnDecksViewList.addEventListener('click', () => {
      state.decksViewMode = 'list';
      renderDecksPage();
    });
  }

  if (decksSourceFilterGroup) {
    decksSourceFilterGroup.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest && e.target.closest('.decks-source-btn');
      if (!btn || !btn.dataset.sourceFilter) return;
      state.catalogSourceFilter = btn.dataset.sourceFilter;
      state.decksOnlyFavorites = false;
      state.openedDeckId = '';
      renderDecksPage();
    });
  }

  if (decksMobileFilterBar) {
    decksMobileFilterBar.addEventListener('click', (e) => {
      const chip = e.target && e.target.closest && e.target.closest('[data-mob-deck-filter]');
      if (!chip) return;
      sound.init();
      const f = chip.dataset.mobDeckFilter;
      if (f === 'favorites') {
        state.decksOnlyFavorites = true;
        state.catalogSourceFilter = 'all';
      } else {
        state.decksOnlyFavorites = false;
        state.catalogSourceFilter = (f === 'official' || f === 'user') ? f : 'all';
      }
      state.openedDeckId = '';
      renderDecksPage();
      actions.syncMobileBottomNavUI();
      chip.blur();
    });
  }

  if (decksCategoryFilterGroup) {
    decksCategoryFilterGroup.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest && e.target.closest('.decks-level-pill');
      if (!btn || !btn.dataset.categoryFilter) return;
      state.decksCategoryFilter = btn.dataset.categoryFilter;
      state.openedDeckId = '';
      renderDecksPage();
    });
  }

  if (decksLevelFilterGroup) {
    decksLevelFilterGroup.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest && e.target.closest('.decks-level-pill');
      if (!btn || !btn.dataset.levelFilter) return;
      state.decksLevelFilter = btn.dataset.levelFilter;
      state.openedDeckId = '';
      renderDecksPage();
    });
  }

  if (decksSearchInput) {
    decksSearchInput.addEventListener('input', () => {
      state.decksSearchQuery = decksSearchInput.value || '';
      if (state.openedDeckId) {
        state.openedDeckId = '';
      }
      renderDecksPage();
    });
  }

  if (btnDecksCreateDeck) {
    btnDecksCreateDeck.addEventListener('click', () => {
      actions.openCustomWordsModal('manual');
      btnDecksCreateDeck.blur();
    });
  }

  document.querySelectorAll('.source-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.catalogSourceFilter = btn.dataset.sourceFilter || 'all';
      renderDecksPage();
    });
  });

  if (sidebarActiveDeckCard) {
    sidebarActiveDeckCard.addEventListener('click', () => {
      openCourseCatalogModal('all');
    });
    sidebarActiveDeckCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCourseCatalogModal('all');
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (!deckContextMenu || deckContextMenu.classList.contains('hidden')) return;
    if (deckContextMenu.contains(e.target)) return;
    if (e.target && e.target.closest && e.target.closest('.deck-mob-dots-btn, .deck-more-btn')) return;
    closeDeckContextMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && deckContextMenu && !deckContextMenu.classList.contains('hidden')) {
      closeDeckContextMenu();
    }
  });

  if (arcadeTitleScreen) {
    arcadeTitleScreen.addEventListener('scroll', closeDeckContextMenu, { passive: true });
  }
  window.addEventListener('resize', () => {
    closeDeckContextMenu();
    if (state.homeSubView === 'decks') {
      renderDecksPage();
    }
  });

  if (btnDecksMobileFilterToggle && decksFilterCard) {
    const toggleMobileFilters = () => {
      if (window.innerWidth > 768) return;
      const isOpen = decksFilterCard.classList.toggle('is-open');
      btnDecksMobileFilterToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };
    btnDecksMobileFilterToggle.addEventListener('click', toggleMobileFilters);
    btnDecksMobileFilterToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMobileFilters();
      }
    });
  }
}
