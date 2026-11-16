// Виджеты Главного дашборда, карточка попадания, сайдбар уроков и лента сбитых слов (SRP)
import { actions } from '../core/events.js';
import { escapeHtml } from '../core/utils.js';
import { getArticleStyle } from '../config/constants.js';
import { ttsManager } from '../services/tts-service.js';
import {
  dailyProgress,
  getLocalizedField,
  getNextLockedWeapon,
  getPinnedEntriesForTargetLang,
  getWeaponName,
  getWordTranslation,
  isEntryPinned,
  isRtlTranslation,
  learnedWordsSet,
  makeWordKey,
  state,
  t,
  todayLearnedSet,
  togglePinWord
} from '../state/store.js';
import {
  countLearnedWordsInCourse,
  getActiveSelection,
  getAllWordsInCourse,
  getAllWordsInTargetLang,
  getCourseVisualTheme,
  getCoursesForTargetLang,
  getMergedLeaderboardEntries,
  getOfficialCoursesForTargetLang,
  resolveLessonBaseWords
} from '../domain/catalog-service.js';
import {
  arenaWavePill,
  bottomTargetPreview,
  btnDrillPinned,
  btnEmp,
  btnHitRepeat,
  btnOpenCatalogTitle,
  btnPracticePinned,
  desktopTypingPreview,
  empCountEl,
  hitSpotlightCard,
  hitVisualEmoji,
  hitVisualTag,
  hitWordArticle,
  hitWordMain,
  hitWordTranslation,
  homeLeaderboardMiniList,
  homeProgressPercent,
  homeProgressRingCircle,
  homeQuickStartGrid,
  homeScoreBadge,
  homeStatDecks,
  homeStatLearned,
  homeStatStreak,
  homeStreakBadge,
  hudCombo,
  hudLearnedCount,
  hudProgressBar,
  hudProgressText,
  hudRingCircle,
  hudScore,
  hudShields,
  kbdProgressFill,
  killFeedContainer,
  labelHitBanner,
  labelHitRepeat,
  learnedProgressPill,
  levelListContainer,
  overlayLearnedPill,
  overlayLevelChips,
  overlayOriginBadge,
  pilotRankPill,
  pilotRankText,
  pinnedCountBadge,
  sidebarActiveLessonSub,
  sidebarDeckProgFill,
  sidebarDeckProgNum,
  sidebarDeckThumb,
  sidebarLessonsDrawer,
  sidebarLevelsTitle,
  sidebarOriginBadge,
  studyModeGroup,
  titleCourseName,
  titleCourseOriginBadge,
  titleStageChips,
  todayLearnedCount,
  totalWordsCounter
} from './dom.js';

export function updateOriginBadgeElement(badgeEl, course, compact = false) {
  if (!badgeEl || !course) return;
  const tr = t();
  const isUser = course.source === 'user';
  const fullLabel = !isUser
    ? tr.originOfficial
    : (course.originType === 'anki' ? tr.originUserAnki : tr.originUserCustom);
  badgeEl.classList.toggle('official', !isUser);
  badgeEl.classList.toggle('user', isUser);
  badgeEl.title = fullLabel;
  badgeEl.textContent = compact ? (!isUser ? '🏛️' : '👤') : fullLabel;
}

export function updatePilotRankUI() {
  const learnedCount = learnedWordsSet.size;
  const tr = t();
  let rankIdx = 0;
  const bestPts = Math.max(state.highScore, state.score);
  if (learnedCount >= 70 || bestPts >= 22000) rankIdx = 3;
  else if (learnedCount >= 35 || bestPts >= 9000) rankIdx = 2;
  else if (learnedCount >= 10 || bestPts >= 2500) rankIdx = 1;

  const rankName = tr.ranks[rankIdx] || tr.ranks[0];
  if (pilotRankText) {
    pilotRankText.textContent = tr.rankLine(rankName, learnedCount, bestPts.toLocaleString());
  }
  if (pilotRankPill) {
    pilotRankPill.title = tr.rankLine(rankName, learnedCount, bestPts.toLocaleString());
  }
  if (homeScoreBadge) {
    homeScoreBadge.textContent = bestPts.toLocaleString();
  }
  if (homeStreakBadge) {
    homeStreakBadge.textContent = tr.streakDays(dailyProgress.streakDays || 1);
  }
}

export function updateTodayLearnedUI() {
  const tr = t();
  if (todayLearnedCount) {
    todayLearnedCount.textContent = tr.todayWordsVal(todayLearnedSet.size);
  }
}


export function renderHomeQuickStartGrid() {
  if (!homeQuickStartGrid) return;
  const tr = t();
  const courses = getCoursesForTargetLang(state.targetLang);
  homeQuickStartGrid.innerHTML = '';

  const displayCourses = courses.slice(0, 4);
  displayCourses.forEach(course => {
    const theme = getCourseVisualTheme(course);
    const { learned, total } = countLearnedWordsInCourse(course);
    const pct = total > 0 ? Math.min(100, Math.round((learned / total) * 100)) : 0;
    const isActive = course.id === state.activeCourseId;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'qs-course-card' + (isActive ? ' active' : '');
    btn.innerHTML = `
      <div class="qs-card-art ${theme.cls}">
        <span class="qs-art-badge">${escapeHtml(theme.tag)}</span>
        <span class="qs-art-emoji">${escapeHtml(course.icon || theme.emoji)}</span>
        <span class="qs-art-play" data-launch-now="1" title="▶">▶</span>
      </div>
      <div class="qs-card-body">
        <div class="qs-card-title">${escapeHtml(getLocalizedField(course, 'titles'))}</div>
        <div class="qs-card-prog-row">
          <div class="qs-prog-bar">
            <div class="qs-prog-fill" style="width:${pct}%;"></div>
          </div>
          <span class="qs-prog-text">${learned} / ${total}</span>
        </div>
      </div>
    `;

    btn.addEventListener('click', (e) => {
      const clickedPlayIcon = e.target && e.target.closest && e.target.closest('[data-launch-now="1"]');
      if (clickedPlayIcon || course.id === state.activeCourseId) {
        if (course.id !== state.activeCourseId) {
          actions.selectCourseLesson(course.id, 0, 0, false);
        }
        actions.launchFromTitleScreen();
      } else {
        actions.selectCourseLesson(course.id, 0, 0, false);
      }
    });

    homeQuickStartGrid.appendChild(btn);
  });

  if (displayCourses.length < 4) {
    const ankiCard = document.createElement('button');
    ankiCard.type = 'button';
    ankiCard.className = 'qs-course-card';
    ankiCard.innerHTML = `
      <div class="qs-card-art art-anki">
        <span class="qs-art-badge">+ .APKG</span>
        <span class="qs-art-emoji">📥</span>
        <span class="qs-art-play">＋</span>
      </div>
      <div class="qs-card-body">
        <div class="qs-card-title">${escapeHtml(tr.quickAnkiCardTitle)}</div>
        <div class="qs-card-prog-row">
          <div class="qs-prog-bar">
            <div class="qs-prog-fill" style="width:0%;"></div>
          </div>
          <span class="qs-prog-text">Anki</span>
        </div>
      </div>
    `;
    ankiCard.addEventListener('click', () => actions.openCustomWordsModal('anki'));
    homeQuickStartGrid.appendChild(ankiCard);
  }
}

export function renderHomeDashboardWidgets() {
  const tr = t();
  renderHomeQuickStartGrid();

  // Круговая диаграмма «Твой прогресс»
  const langWords = getAllWordsInTargetLang(state.targetLang);
  let learnedInLang = 0;
  for (const w of langWords) {
    if (learnedWordsSet.has(makeWordKey(state.targetLang, w))) {
      learnedInLang++;
    }
  }
  const pct = langWords.length > 0
    ? Math.min(100, Math.round((learnedInLang / langWords.length) * 100))
    : 0;

  if (homeProgressPercent) homeProgressPercent.textContent = `${pct}%`;
  if (homeProgressRingCircle) {
    const circ = 219.9;
    homeProgressRingCircle.style.strokeDashoffset = (circ * (1 - pct / 100)).toFixed(1);
  }
  if (homeStatLearned) homeStatLearned.textContent = learnedWordsSet.size.toLocaleString();
  if (homeStatDecks) {
    const officialCount = ['de', 'en', 'es'].reduce((acc, lg) => {
      return acc + getOfficialCoursesForTargetLang(lg).length;
    }, 0);
    homeStatDecks.textContent = String(officialCount + state.userCourses.length);
  }
  if (homeStatStreak) {
    homeStatStreak.textContent = tr.streakDays(dailyProgress.bestStreakDays || 1);
  }

  // Мини-список Топ-3 недели на Главной
  if (homeLeaderboardMiniList) {
    const ranked = getMergedLeaderboardEntries();
    const topSlice = ranked.slice(0, 3);
    if (!topSlice.some(x => x.isYou)) {
      const youRow = ranked.find(x => x.isYou);
      if (youRow) topSlice[2] = youRow;
    }
    homeLeaderboardMiniList.innerHTML = '';
    topSlice.forEach(row => {
      const rankCls = row.rank === 1 ? 'r1' : (row.rank === 2 ? 'r2' : (row.rank === 3 ? 'r3' : ''));
      const div = document.createElement('div');
      div.className = 'mini-leader-row' + (row.isYou ? ' is-you' : '');
      div.innerHTML = `
        <span class="mini-leader-left">
          <span class="leader-rank-badge ${rankCls}">${row.rank}</span>
          <span class="leader-name">${escapeHtml(row.avatar)} ${escapeHtml(row.name)}</span>
        </span>
        <span class="leader-score">${row.score.toLocaleString()}</span>
      `;
      homeLeaderboardMiniList.appendChild(div);
    });
  }
}

export function refreshHitSpotlightPinState() {
  if (!btnHitRepeat || !labelHitRepeat) return;
  const tr = t();
  const entry = state.lastSpotlightEntry;
  const pinned = entry ? isEntryPinned(entry, state.targetLang) : false;
  btnHitRepeat.classList.toggle('pinned', pinned);
  labelHitRepeat.textContent = pinned ? tr.hitPinnedBtn : tr.hitRepeatBtn;
}

export function updateHitSpotlightCard(entry, isHitFlash = true) {
  if (!entry || !hitSpotlightCard) return;
  state.lastSpotlightEntry = entry;
  state.lastSpotlightIsHit = isHitFlash;

  const tr = t();
  const style = getArticleStyle(entry.article, state.targetLang);
  const { course } = getActiveSelection();
  const theme = getCourseVisualTheme(course);

  if (labelHitBanner) {
    labelHitBanner.textContent = isHitFlash ? tr.hitBanner : tr.hitReadyBanner;
  }
  if (hitWordArticle) {
    hitWordArticle.textContent = entry.article || '';
    hitWordArticle.style.color = style.main;
    hitWordArticle.style.display = entry.article ? 'inline' : 'none';
  }
  if (hitWordMain) {
    hitWordMain.textContent = entry.word || entry.raw || '';
  }
  if (hitVisualEmoji) {
    hitVisualEmoji.textContent = (course && course.icon) || theme.emoji;
  }
  if (hitVisualTag) {
    hitVisualTag.textContent = `${theme.tag} · ${state.targetLang.toUpperCase()}`;
  }
  if (hitWordTranslation) {
    hitWordTranslation.textContent = getWordTranslation(entry);
    hitWordTranslation.dir = isRtlTranslation(entry) ? 'rtl' : 'ltr';
  }
  refreshHitSpotlightPinState();

  if (isHitFlash) {
    hitSpotlightCard.classList.remove('flash-hit');
    void hitSpotlightCard.offsetWidth;
    hitSpotlightCard.classList.add('flash-hit');
    setTimeout(() => {
      if (hitSpotlightCard) hitSpotlightCard.classList.remove('flash-hit');
    }, 260);
  }
}

export function updateLearnedProgressUI() {
  const learnedCount = learnedWordsSet.size;
  const nextW = getNextLockedWeapon();
  const tr = t();
  const text = nextW
    ? tr.learnedPill(learnedCount, nextW.unlockWords, getWeaponName(nextW))
    : tr.learnedPill(learnedCount, 0, '');

  if (learnedProgressPill) learnedProgressPill.textContent = text;
  if (overlayLearnedPill) overlayLearnedPill.textContent = text;
  if (hudLearnedCount) hudLearnedCount.textContent = String(learnedCount);
  updateTodayLearnedUI();
}

export function updatePinnedCountUI() {
  const pinnedForLang = getPinnedEntriesForTargetLang(state.targetLang);
  const count = pinnedForLang.length;
  if (pinnedCountBadge) pinnedCountBadge.textContent = String(count);
  if (btnDrillPinned) {
    btnDrillPinned.disabled = count === 0;
    btnDrillPinned.style.opacity = count === 0 ? '0.5' : '1';
    btnDrillPinned.title = t().drillPinnedBtn(count);
  }
  if (btnPracticePinned) {
    btnPracticePinned.textContent = t().drillPinnedBtn(count);
    btnPracticePinned.style.display = count > 0 ? 'inline-flex' : 'none';
  }
}

export function updateStudyModeButtonsUI() {
  if (!studyModeGroup) return;
  studyModeGroup.querySelectorAll('.study-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.studyMode === state.studyMode);
  });
}


export function renderLevelSidebar() {
  const { course, mod, lesson } = getActiveSelection();
  if (!course || !mod) return;
  const tr = t();

  updateOriginBadgeElement(titleCourseOriginBadge, course, true);
  updateOriginBadgeElement(sidebarOriginBadge, course, true);
  updateOriginBadgeElement(overlayOriginBadge, course, false);

  const courseTitle = `${course.icon || '🚀'} ${getLocalizedField(course, 'titles')}`;
  const modTitle = getLocalizedField(mod, 'titles');
  if (titleCourseName) {
    const modPrefix = state.nativeLang === 'ru' ? 'М' : (state.nativeLang === 'he' ? 'מ׳' : 'M');
    titleCourseName.textContent = `${courseTitle} · ${modPrefix}${state.activeModuleIndex + 1}`;
    if (btnOpenCatalogTitle) {
      btnOpenCatalogTitle.title = `${courseTitle} — ${modTitle}`;
    }
  }
  if (sidebarDeckThumb) {
    sidebarDeckThumb.textContent = course.icon || '🚀';
  }
  if (sidebarLevelsTitle) {
    sidebarLevelsTitle.textContent = courseTitle;
  }
  if (lesson && sidebarActiveLessonSub) {
    sidebarActiveLessonSub.textContent = state.activeCustomRoundTitle
      ? state.activeCustomRoundTitle
      : tr.lessonShort(state.activeLessonIndex + 1, getLocalizedField(lesson, 'titles'));
  }
  if (lesson && !state.running) {
    const baseWords = resolveLessonBaseWords(course, mod, lesson, state.activeLessonIndex);
    const isDone = state.completedLessonIds.has(lesson.id);
    const doneNum = isDone ? baseWords.length : 0;
    const pct = baseWords.length > 0 ? Math.round((doneNum / baseWords.length) * 100) : 0;
    if (sidebarDeckProgFill) sidebarDeckProgFill.style.width = `${pct}%`;
    if (sidebarDeckProgNum) sidebarDeckProgNum.textContent = `${doneNum} / ${baseWords.length}`;
  }

  const totalWords = getAllWordsInCourse(course).length;
  if (totalWordsCounter) totalWordsCounter.textContent = tr.wordsCount(totalWords);

  // 1. Левая панель ПК: все модули курса и короткие уроки внутри них
  if (levelListContainer) {
    levelListContainer.innerHTML = '';
    course.modules.forEach((mObj, mIdx) => {
      const modHeader = document.createElement('div');
      modHeader.className = 'module-divider-label';
      modHeader.textContent = getLocalizedField(mObj, 'titles');
      levelListContainer.appendChild(modHeader);

      (mObj.lessons || []).forEach((ls, lIdx) => {
        const isCurrent = mIdx === state.activeModuleIndex && lIdx === state.activeLessonIndex;
        const isDone = state.completedLessonIds.has(ls.id);
        const lTitle = getLocalizedField(ls, 'titles');
        const resolvedWords = resolveLessonBaseWords(course, mObj, ls, lIdx);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'level-card' +
          (isCurrent ? ' active' : '') +
          (isDone ? ' completed' : '') +
          (ls.isBoss ? ' boss' : '');

        const badgeLabel = ls.isBoss ? tr.lessonBadgeBoss : tr.lessonBadgeNum(lIdx + 1);
        btn.innerHTML = `
          <div class="level-card-top">
            <span class="level-badge">${isDone ? '✓ ' : ''}${escapeHtml(badgeLabel)}</span>
            <span class="level-word-count">${escapeHtml(tr.wordsShort(resolvedWords.length))}</span>
          </div>
          <div class="level-card-name">${escapeHtml(lTitle)}</div>
        `;
        btn.addEventListener('click', () => {
          if (sidebarLessonsDrawer) sidebarLessonsDrawer.open = false;
          actions.selectCourseLesson(course.id, mIdx, lIdx, true);
        });
        levelListContainer.appendChild(btn);
      });
    });
  }

  // 2. Компактные чипы ТЕКУЩЕГО модуля (3 коротких урока + 1 Босс — никакой бесконечной прокрутки!)
  [overlayLevelChips, titleStageChips].forEach((chipBox, boxIdx) => {
    if (!chipBox) return;
    chipBox.innerHTML = '';
    (mod.lessons || []).forEach((ls, lIdx) => {
      const isCurrent = lIdx === state.activeLessonIndex;
      const isDone = state.completedLessonIds.has(ls.id);
      const lTitle = getLocalizedField(ls, 'titles');
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'level-chip-btn' +
        (isCurrent ? ' active' : '') +
        (isDone ? ' completed' : '') +
        (ls.isBoss ? ' boss' : '');
      chip.textContent = ls.isBoss
        ? `${isDone ? '✓ ' : ''}${lTitle}`
        : `${isDone ? '✓ ' : ''}${tr.lessonShort(lIdx + 1, lTitle)}`;
      chip.addEventListener('click', () => {
        if (boxIdx === 1 && state.screenMode === 'title') {
          actions.selectCourseLesson(course.id, state.activeModuleIndex, lIdx, false);
        } else {
          actions.selectCourseLesson(course.id, state.activeModuleIndex, lIdx, true);
        }
      });
      chipBox.appendChild(chip);
    });
  });
}

export function rerenderKillFeed() {
  if (!killFeedContainer) return;
  const tr = t();

  if (state.killHistory.length === 0) {
    killFeedContainer.innerHTML = `<div class="kill-feed-empty">${tr.killFeedEmpty}</div>`;
    return;
  }

  killFeedContainer.innerHTML = '';
  state.killHistory.forEach(entry => {
    const card = document.createElement('div');
    card.className = 'kill-card';
    card.dataset.art = entry.article || '';

    const transText = getWordTranslation(entry);
    const dirAttr = isRtlTranslation(entry) ? ' dir="rtl"' : ' dir="ltr"';
    const pinned = isEntryPinned(entry);

    card.innerHTML = `
      <div class="kill-card-top" dir="ltr">
        <span class="kill-de">${escapeHtml(entry.raw)}</span>
        <div class="kill-card-actions">
          <button type="button" class="pin-star-btn${pinned ? ' pinned' : ''}" title="${escapeHtml(tr.pinTooltip)}" aria-label="${escapeHtml(tr.pinTooltip)}">${pinned ? '⭐' : '☆'}</button>
          <button type="button" class="kill-speak-btn" title="🔊 Gemini 3.8 TTS" aria-label="🔊">🔊</button>
        </div>
      </div>
      <div class="kill-ru"${dirAttr}>${escapeHtml(transText)}</div>
    `;

    const starBtn = card.querySelector('.pin-star-btn');
    if (starBtn) {
      starBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePinWord(entry, state.targetLang);
      });
    }

    card.addEventListener('click', () => {
      ttsManager.speak(entry.withArticle || entry.word, state.targetLang, true);
    });

    killFeedContainer.appendChild(card);
  });
}

export function updateBottomTargetUI() {
  const locked = state.activeWords.find(w => w.id === state.lockedWordId);
  if (!locked) {
    bottomTargetPreview.innerHTML = `<span style="color: var(--text-muted);">${escapeHtml(t().targetIdle)}</span>`;
    if (desktopTypingPreview) {
      desktopTypingPreview.innerHTML = `<span style="color: #cbd5e1;">${escapeHtml(t().desktopPromptIdle)}</span>`;
    }
    return;
  }

  const typedPart = locked.text.slice(0, locked.typedCount);
  const remainPart = locked.text.slice(locked.typedCount);
  const transText = getWordTranslation(locked.entry);
  const dirAttr = isRtlTranslation(locked.entry) ? ' dir="rtl"' : ' dir="ltr"';
  const artBadge = locked.entry.article
    ? `<span style="color: var(--accent-cyan);" dir="ltr">[${escapeHtml(locked.entry.article)}]</span> `
    : '';

  const lockedHtml = `
    ${artBadge}<span dir="ltr"><span class="target-word-typed">${escapeHtml(typedPart)}</span><strong style="color:#fff;">${escapeHtml(remainPart)}</strong></span>
    <span style="color: var(--accent-amber);"${dirAttr}>— ${escapeHtml(transText)}</span>
  `;
  bottomTargetPreview.innerHTML = lockedHtml;
  if (desktopTypingPreview) {
    desktopTypingPreview.innerHTML = `⌨️ ${lockedHtml}`;
  }
}

export function updateHudStats() {
  hudScore.textContent = state.score.toLocaleString();
  if (homeScoreBadge) {
    homeScoreBadge.textContent = Math.max(state.highScore, state.score).toLocaleString();
  }
  if (hudCombo) hudCombo.textContent = `x${state.combo}`;
  if (hudLearnedCount) hudLearnedCount.textContent = String(learnedWordsSet.size);

  hudShields.textContent = '❤️'.repeat(Math.max(0, state.shields)) +
    '🖤'.repeat(Math.max(0, state.maxShields - state.shields));

  empCountEl.textContent = String(state.empCharges);
  const kbdEmpBadge = document.getElementById('kbdEmpCount');
  const kbdEmpBtn = document.getElementById('btnKbdEmp');
  if (kbdEmpBadge) kbdEmpBadge.textContent = String(state.empCharges);
  btnEmp.disabled = state.empCharges <= 0;
  if (kbdEmpBtn) kbdEmpBtn.style.opacity = state.empCharges <= 0 ? '0.42' : '1';

  const pct = state.totalWordsInLevel > 0
    ? Math.min(100, Math.round((state.wordsDestroyedInLevel / state.totalWordsInLevel) * 100))
    : 0;
  hudProgressBar.style.width = `${pct}%`;
  if (kbdProgressFill) kbdProgressFill.style.width = `${pct}%`;
  hudProgressText.textContent = `${state.wordsDestroyedInLevel} / ${state.totalWordsInLevel}`;

  if (hudRingCircle) {
    const ringCirc = 65.97;
    hudRingCircle.style.strokeDashoffset = (ringCirc * (1 - pct / 100)).toFixed(2);
  }
  if (sidebarDeckProgFill) sidebarDeckProgFill.style.width = `${pct}%`;
  if (sidebarDeckProgNum) {
    sidebarDeckProgNum.textContent = `${state.wordsDestroyedInLevel} / ${state.totalWordsInLevel}`;
  }
  if (arenaWavePill) {
    const waveNum = Math.max(1, Math.ceil((state.wordsDestroyedInLevel + 1) / 4));
    arenaWavePill.textContent = t().arenaWaveLabel(state.activeLessonIndex + 1, waveNum);
  }
}
