// Боевой цикл 60 FPS, физика раунда, клавиатура ZType и блиц-опрос после урока (SRP)
import { actions } from '../core/events.js';
import { saveSettingsPatch } from '../core/storage.js';
import { allocateEntityId, escapeHtml, shuffleArray } from '../core/utils.js';
import { KEYBOARD_LAYOUTS, getArticleStyle } from '../config/constants.js';
import { WEAPONS } from '../config/weapons.js';
import { sound } from '../services/sound-engine.js';
import { ttsManager } from '../services/tts-service.js';
import {
  getCurrentWeapon,
  getLocalizedField,
  getPinnedEntriesForTargetLang,
  getWordTranslation,
  isEntryPinned,
  isHebrewUI,
  isRtlTranslation,
  isWeaponUnlocked,
  learnedWordsSet,
  recordWordLearned,
  state,
  t,
  togglePinWord
} from '../state/store.js';
import {
  getActiveSelection,
  getAllWordsInTargetLang,
  getNextLessonPointer,
  resolveLessonBaseWords
} from '../domain/catalog-service.js';
import {
  arcadeTitleScreen,
  btnArcadeLaunch,
  btnArticleMode,
  btnBackToTitle,
  btnClearFeed,
  btnCloseOverlay,
  btnDrillPinned,
  btnEmp,
  btnHitKnow,
  btnHitRepeat,
  btnHitSpeak,
  btnHudHome,
  btnMobHudEmp,
  btnMobHudPause,
  btnMobHudWave,
  btnNextLevel,
  btnPause,
  btnPracticeMistakes,
  btnPracticePinned,
  btnPromoWeaponCycle,
  btnQuickLevels,
  btnQuizSpeak,
  btnSpeedMode,
  btnStartLevel,
  btnTitleSpeed,
  btnToggleDesktopKbd,
  btnWeaponMode,
  canvas,
  centerOverlay,
  courseBrowserDialog,
  customWordsDialog,
  dictDialog,
  gameSettingsDialog,
  hudProgressBar,
  hudProgressText,
  kbdProgressFill,
  labelBtnNextLevel,
  labelBtnStartLevel,
  labelFeatSettings,
  labelPracticeMistakes,
  leaderboardDialog,
  levelQuizBox,
  mobHudProgressText,
  ovStatComboLabel,
  ovStatComboVal,
  ovStatLearnedLabel,
  ovStatLearnedVal,
  ovStatMistakesLabel,
  ovStatMistakesVal,
  ovStatQuizLabel,
  ovStatQuizVal,
  overlayBadge,
  overlayCard,
  overlayDesc,
  overlayLessonPill,
  overlayLessonPillLabel,
  overlayLessonStepper,
  overlayOriginBadge,
  overlayTitle,
  overlayWeaponTitle,
  overlayWordsHeader,
  overlayWordsPreview,
  quizHeaderTitle,
  quizOptionsGrid,
  quizProgressDots,
  quizQuestionWord,
  quizScoreText,
  statsDialog,
  studyModeGroup,
  ttsSettingsDialog,
  ztypeKeysContainer
} from '../ui/dom.js';
import {
  charsMatchTargetLang,
  computeWordLengthSpeedFactor,
  findSafeSpawnX,
  getHorizontalPan,
  getPlayBounds,
  getTargetString,
  mapTargetCharToBaseKey,
  measureWordCapsule,
  resizeCanvas,
  resolveWordCollisions,
  scatterWordsToTop,
  separateFloatingTranslations,
  spawnParticles
} from './arena-physics.js';
import { equipWeapon, spawnWeaponVisualEffect } from './weapon-vfx.js';
import { render } from './canvas-renderer.js';
import {
  refreshHitSpotlightPinState,
  renderLevelSidebar,
  rerenderKillFeed,
  updateBottomTargetUI,
  updateHitSpotlightCard,
  updateHudStats,
  updateOriginBadgeElement,
  updatePilotRankUI,
  updatePinnedCountUI,
  updateStudyModeButtonsUI
} from '../ui/hud-widgets.js';
import {
  launchFromTitleScreen,
  returnToTitleScreen,
  seedTitleDemoWords,
  updateTitleDemo
} from './promo-autopilot.js';

export function bindVirtualKeyListeners(btn) {
  let lastTriggerTs = 0;
  const triggerOnce = (e) => {
    const now = performance.now();
    if (now - lastTriggerTs < 35) {
      if (e && e.cancelable) e.preventDefault();
      return;
    }
    lastTriggerTs = now;
    handleVirtualKeyPress(btn, e);
  };

  if (window.PointerEvent) {
    btn.addEventListener('pointerdown', triggerOnce);
  } else {
    btn.addEventListener('touchstart', triggerOnce, { passive: false });
    btn.addEventListener('mousedown', triggerOnce);
  }

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
}

export function renderZtypeKeyboard() {
  if (!ztypeKeysContainer) return;
  const rows = KEYBOARD_LAYOUTS[state.targetLang] || KEYBOARD_LAYOUTS.de;
  ztypeKeysContainer.innerHTML = '';

  rows.forEach((rowItems, rIdx) => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'ztype-key-row' +
      (rIdx === 1 ? ' row-middle' + (state.targetLang === 'es' ? ' es-row' : '') : '') +
      (rIdx === 2 ? ' row-bottom' : '');

    rowItems.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';

      if (item.action === 'reset') {
        btn.className = 'zkey zkey-fn';
        btn.dataset.action = 'reset';
        btn.title = 'Backspace';
        btn.textContent = '⌫';
      } else if (item.action === 'emp') {
        btn.className = 'zkey zkey-emp';
        btn.dataset.action = 'emp';
        btn.id = 'btnKbdEmp';
        btn.title = 'EMP (Enter)';
        btn.style.opacity = state.empCharges <= 0 ? '0.42' : '1';
        btn.innerHTML = `⚡<span class="emp-mini-badge" id="kbdEmpCount">${state.empCharges}</span>`;
      } else {
        btn.className = 'zkey';
        btn.dataset.key = item.k;
        btn.innerHTML = item.sub
          ? `${escapeHtml(item.l)}<span class="uml-sub">${escapeHtml(item.sub)}</span>`
          : escapeHtml(item.l);
      }

      bindVirtualKeyListeners(btn);
      rowDiv.appendChild(btn);
    });

    ztypeKeysContainer.appendChild(rowDiv);
  });

  updateKeyboardNextHint();
}

export function selectCourseLesson(courseId, moduleIndex, lessonIndex, showIntro = true) {
  const courseChanged = state.activeCourseId !== courseId;
  state.activeCourseId = courseId;
  state.activeModuleIndex = moduleIndex;
  state.activeLessonIndex = lessonIndex;
  state.activeCustomRoundTitle = '';
  saveSettingsPatch({
    activeCourseId: courseId,
    activeModuleIndex: moduleIndex,
    activeLessonIndex: lessonIndex
  });

  state.running = false;
  state.paused = false;
  state.gameOver = false;
  state.activeWords = [];
  state.lockedWordId = null;
  state.lasers = [];
  state.missiles = [];

  const { course, mod, lesson } = getActiveSelection();
  if (course && mod && lesson) {
    const pool = resolveLessonBaseWords(course, mod, lesson, state.activeLessonIndex);
    hudProgressBar.style.width = '0%';
    if (kbdProgressFill) kbdProgressFill.style.width = '0%';
    hudProgressText.textContent = `0 / ${pool.length}`;
    if (mobHudProgressText) mobHudProgressText.textContent = `0/${pool.length}`;
  }

  renderLevelSidebar();
  actions.applyStaticUILocalization();
  updateBottomTargetUI();

  if (state.screenMode === 'title') {
    if (courseChanged) {
      requestAnimationFrame(() => seedTitleDemoWords());
    }
    sound.init();
    sound._playTactileClick(sound.ctx ? sound.ctx.currentTime : 0, sound.masterGain, 2200, 0.05);
    return;
  }

  if (showIntro) {
    showLevelIntroOverlay();
  } else {
    startLevelNow();
  }
}

function renderOverlayLessonStepper(course, mod) {
  if (!overlayLessonStepper || !course || !mod) return;
  const lessons = Array.isArray(mod.lessons) ? mod.lessons : [];
  const tr = t();
  overlayLessonStepper.innerHTML = '';
  if (lessons.length === 0) return;

  const maxStart = Math.max(0, lessons.length - 3);
  const winStart = Math.max(0, Math.min(state.activeLessonIndex, maxStart));
  const visible = lessons.slice(winStart, winStart + 3);
  const shortPrefix = state.nativeLang === 'ru' ? 'Ур.' : (state.nativeLang === 'he' ? 'שלב ' : 'L');

  visible.forEach((ls, offset) => {
    const lIdx = winStart + offset;
    const isCompleted = state.completedLessonIds.has(ls.id);
    const isCurrent = lIdx === state.activeLessonIndex;
    const tagText = ls.isBoss ? (tr.ovStepBossTag || 'Boss') : `${shortPrefix}${lIdx + 1}`;
    const titleText = getLocalizedField(ls, 'titles');

    const nodeBtn = document.createElement('button');
    nodeBtn.type = 'button';
    nodeBtn.className = 'ov-step-node' +
      (isCompleted ? ' is-done' : '') +
      (isCurrent ? ' is-current' : '');
    nodeBtn.innerHTML = `
      <span class="ov-step-circle" aria-hidden="true">${isCompleted ? '✓' : ''}</span>
      <span class="ov-step-tag">${escapeHtml(tagText)}</span>
      <span class="ov-step-name" title="${escapeHtml(titleText)}">${escapeHtml(titleText)}</span>
    `;
    nodeBtn.addEventListener('click', () => {
      selectCourseLesson(course.id, state.activeModuleIndex, lIdx, false);
    });
    overlayLessonStepper.appendChild(nodeBtn);

    if (offset < visible.length - 1) {
      const conn = document.createElement('span');
      conn.className = 'ov-step-connector' + (isCompleted ? ' is-done' : '');
      conn.setAttribute('aria-hidden', 'true');
      overlayLessonStepper.appendChild(conn);
    }
  });
}

function syncQuizProgressUI() {
  const quiz = state.activeQuiz;
  if (quizProgressDots) {
    quizProgressDots.innerHTML = '';
    if (quiz && Array.isArray(quiz.questions)) {
      const total = quiz.questions.length;
      for (let i = 0; i < total; i++) {
        const res = quiz.results && quiz.results[i];
        const dot = document.createElement('span');
        dot.className = 'quiz-dot' +
          (res === 'ok' ? ' is-ok' : '') +
          (res === 'wrong' ? ' is-wrong' : '') +
          (!res && i === quiz.qIndex ? ' is-current' : '');
        quizProgressDots.appendChild(dot);
        if (i < total - 1) {
          const line = document.createElement('span');
          line.className = 'quiz-dot-line' + (res ? ' is-done' : '');
          quizProgressDots.appendChild(line);
        }
      }
    }
  }
  if (ovStatQuizVal) {
    if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
      ovStatQuizVal.textContent = '—';
    } else if (quiz.qIndex >= quiz.questions.length) {
      ovStatQuizVal.textContent = `${quiz.correctCount}/${quiz.questions.length}`;
    } else {
      ovStatQuizVal.textContent = `${quiz.qIndex + 1}/${quiz.questions.length}`;
    }
  }
}

export function refreshOverlayContent() {
  const { course, mod, lesson } = getActiveSelection();
  if (!course || !mod || !lesson) return;
  const tr = t();

  if (overlayCard) {
    overlayCard.classList.remove('mode-intro', 'mode-complete', 'mode-gameover', 'mode-pause');
    overlayCard.classList.add(`mode-${state.overlayMode}`);
    if (state.overlayMode !== 'complete') {
      overlayCard.classList.remove('has-next-lesson', 'no-quiz');
    }
  }
  if (overlayLessonPill) {
    overlayLessonPill.classList.toggle('hidden', state.overlayMode !== 'complete');
  }

  updateOriginBadgeElement(overlayOriginBadge, course);
  const lTitle = state.activeCustomRoundTitle || getLocalizedField(lesson, 'titles');
  const lDesc = getLocalizedField(lesson, 'descriptions');
  const previewWords = state.currentRoundPool.length > 0 && state.overlayMode !== 'intro'
    ? state.currentRoundPool
    : resolveLessonBaseWords(course, mod, lesson, state.activeLessonIndex);

  const mistakesCount = state.mistakeWordsMap.size;
  if (labelPracticeMistakes) {
    labelPracticeMistakes.textContent = state.overlayMode === 'complete' && tr.ovRepeatMistakesBtn
      ? tr.ovRepeatMistakesBtn(mistakesCount)
      : tr.mistakesBtn(mistakesCount);
  }
  if (btnPracticeMistakes) {
    if (state.overlayMode === 'complete') {
      btnPracticeMistakes.style.display = 'inline-flex';
      btnPracticeMistakes.disabled = mistakesCount === 0;
      btnPracticeMistakes.classList.toggle('is-empty', mistakesCount === 0);
    } else {
      btnPracticeMistakes.style.display = mistakesCount > 0 ? 'inline-flex' : 'none';
      btnPracticeMistakes.disabled = false;
      btnPracticeMistakes.classList.remove('is-empty');
    }
  }
  updatePinnedCountUI();

  const setStartLabel = (txt) => {
    if (labelBtnStartLevel) labelBtnStartLevel.textContent = txt;
    else if (btnStartLevel) btnStartLevel.textContent = txt;
  };

  if (state.overlayMode === 'intro') {
    if (overlayWeaponTitle) overlayWeaponTitle.textContent = tr.overlayWeaponTitle;
    overlayBadge.textContent = tr.introBadge(
      getLocalizedField(mod, 'titles'),
      state.activeLessonIndex + 1,
      mod.lessons.length
    );
    overlayTitle.textContent = lTitle;
    overlayDesc.innerHTML = escapeHtml(lDesc);
    overlayWordsHeader.textContent = tr.wordsInLevelHeader(previewWords.length);
    setStartLabel(tr.startLevelBtn);
    btnStartLevel.style.display = 'inline-flex';
    btnNextLevel.style.display = 'none';
  } else if (state.overlayMode === 'complete') {
    if (overlayWeaponTitle) overlayWeaponTitle.textContent = tr.ovArsenalShortLabel || tr.overlayWeaponTitle;
    overlayBadge.textContent = tr.completeBadge(state.maxCombo);
    overlayTitle.textContent = tr.missionCompleteTitle || tr.completeTitle(lTitle);
    overlayDesc.innerHTML = tr.completeDesc;
    overlayWordsHeader.textContent = tr.learnedWordsHeader(previewWords.length);

    if (overlayLessonPillLabel) {
      const hasNumPrefix = /^(урок|lesson|שלב)\s*\d+/i.test(lTitle);
      overlayLessonPillLabel.textContent = state.activeCustomRoundTitle
        ? state.activeCustomRoundTitle
        : ((lesson.isBoss || hasNumPrefix)
            ? lTitle
            : (tr.overlayLessonPillText ? tr.overlayLessonPillText(state.activeLessonIndex + 1, lTitle) : lTitle));
    }

    if (ovStatLearnedVal) ovStatLearnedVal.textContent = learnedWordsSet.size.toLocaleString();
    if (ovStatLearnedLabel) ovStatLearnedLabel.textContent = tr.ovStatWordsLearned || '';
    if (ovStatMistakesVal) ovStatMistakesVal.textContent = String(mistakesCount);
    if (ovStatMistakesLabel) ovStatMistakesLabel.textContent = tr.ovStatMistakesLabel ? tr.ovStatMistakesLabel(mistakesCount) : '';
    if (ovStatQuizLabel) ovStatQuizLabel.textContent = tr.ovStatBlitzLabel || '';
    if (ovStatComboLabel) ovStatComboLabel.textContent = tr.ovStatComboLabel || '';
    if (ovStatComboVal) ovStatComboVal.textContent = `×${Math.max(1, state.maxCombo || 1)}`;

    renderOverlayLessonStepper(course, mod);
    syncQuizProgressUI();

    const nextPtr = getNextLessonPointer();
    if (overlayCard) {
      overlayCard.classList.toggle('has-next-lesson', Boolean(nextPtr));
    }

    setStartLabel(tr.ovReplayCta || tr.retryBtn);
    btnStartLevel.style.display = 'inline-flex';

    if (nextPtr) {
      btnNextLevel.style.display = 'inline-flex';
      if (labelBtnNextLevel) labelBtnNextLevel.textContent = tr.ovContinueCta || tr.nextLevelBtn(getLocalizedField(nextPtr.lesson, 'titles'));
      btnNextLevel.title = tr.nextLevelBtn(getLocalizedField(nextPtr.lesson, 'titles'));
    } else {
      btnNextLevel.style.display = 'none';
    }
  } else if (state.overlayMode === 'gameover') {
    if (overlayWeaponTitle) overlayWeaponTitle.textContent = tr.overlayWeaponTitle;
    overlayBadge.textContent = tr.gameOverBadge;
    overlayTitle.textContent = tr.gameOverTitle(lTitle);
    overlayDesc.innerHTML = tr.gameOverDesc(state.wordsDestroyedInLevel, state.totalWordsInLevel);
    overlayWordsHeader.textContent = tr.wordsInLevelHeader(previewWords.length);
    setStartLabel(tr.tryAgainBtn);
    btnStartLevel.style.display = 'inline-flex';
    btnNextLevel.style.display = 'none';
  } else if (state.overlayMode === 'pause') {
    if (overlayWeaponTitle) overlayWeaponTitle.textContent = tr.overlayWeaponTitle;
    overlayBadge.textContent = tr.pauseBadge;
    overlayTitle.textContent = lTitle;
    overlayDesc.innerHTML = tr.pauseDesc(state.wordsDestroyedInLevel, state.totalWordsInLevel);
    overlayWordsHeader.textContent = tr.wordsInLevelHeader(previewWords.length);
    setStartLabel(tr.resumeBtn);
    btnStartLevel.style.display = 'inline-flex';
    btnNextLevel.style.display = 'none';
  }

  renderWordsPreviewList(previewWords, overlayWordsPreview);
}

export function renderWordsPreviewList(wordsArray, container) {
  if (!container) return;
  container.innerHTML = '';
  const tr = t();

  wordsArray.forEach(item => {
    const div = document.createElement('div');
    div.className = 'preview-word-item';
    div.dataset.art = item.article || '';
    const transText = getWordTranslation(item);
    const dirAttr = isRtlTranslation(item) ? ' dir="rtl"' : ' dir="ltr"';
    const pinned = isEntryPinned(item);

    div.innerHTML = `
      <div class="preview-word-top" dir="ltr">
        <span class="preview-word-de">${escapeHtml(item.raw)}</span>
        <button type="button" class="pin-star-btn${pinned ? ' pinned' : ''}" title="${escapeHtml(tr.pinTooltip)}">${pinned ? '⭐' : '☆'}</button>
      </div>
      <span class="preview-word-ru"${dirAttr}>${escapeHtml(transText)}</span>
    `;
    div.style.cursor = 'pointer';

    const starBtn = div.querySelector('.pin-star-btn');
    if (starBtn) {
      starBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePinWord(item, state.targetLang);
      });
    }

    div.addEventListener('click', () => {
      ttsManager.speak(item.withArticle || item.word, state.targetLang, true);
    });
    container.appendChild(div);
  });
}

export function showLevelIntroOverlay() {
  state.overlayMode = 'intro';
  state.activeQuiz = null;
  levelQuizBox.style.display = 'none';
  delete btnStartLevel.dataset.resumeMode;
  refreshOverlayContent();
  centerOverlay.classList.remove('hidden');
}

// Подмешивание отмеченных ⭐ слов в следующие раунды, чтобы незнакомые слова чаще закреплялись!
export function buildRoundWordPool(basePool, isCustomPool = false) {
  const cleanBase = basePool.slice();
  if (isCustomPool) return shuffleArray(cleanBase);

  const pinnedForLang = shuffleArray(getPinnedEntriesForTargetLang(state.targetLang));
  if (pinnedForLang.length === 0) return shuffleArray(cleanBase);

  const existingKeys = new Set(cleanBase.map(w => (w.word || '').toLowerCase()));
  const extraPinned = [];
  for (const pw of pinnedForLang) {
    if (extraPinned.length >= 3) break;
    if (!existingKeys.has((pw.word || '').toLowerCase())) {
      extraPinned.push(pw);
    }
  }
  return shuffleArray([...cleanBase, ...extraPinned]);
}

export function startLevelNow(customWordPool = null, customTitle = '') {
  const { course, mod, lesson } = getActiveSelection();
  if (!course || !mod || !lesson) return;

  state.activeCustomRoundTitle = customTitle || '';
  const basePool = customWordPool
    ? customWordPool
    : resolveLessonBaseWords(course, mod, lesson, state.activeLessonIndex);
  const finalPool = buildRoundWordPool(basePool, Boolean(customWordPool) || Boolean(lesson.isBoss));

  state.screenMode = 'play';
  if (arcadeTitleScreen) arcadeTitleScreen.hidden = true;
  document.body.classList.remove('mode-title');
  document.body.classList.add('mode-play');

  resizeCanvas();
  requestAnimationFrame(() => resizeCanvas());

  state.currentRoundPool = finalPool.slice();
  state.wordQueue = finalPool.slice();
  state.totalWordsInLevel = state.wordQueue.length;
  state.wordsDestroyedInLevel = 0;
  state.activeWords = [];
  state.lockedWordId = null;
  state.lasers = [];
  state.missiles = [];
  state.repulsorWaves = [];
  state.gravityEquipCooldown = 0;
  state.particles = [];
  state.shockwaves = [];
  state.floatingTranslations = [];
  state.shields = state.maxShields;
  state.empCharges = 2;
  state.spawnTimer = 0.25;
  state.running = true;
  state.paused = false;
  state.gameOver = false;
  state.activeQuiz = null;

  if (state.weaponId === 'gravity' && state.wordQueue.length > 0) {
    const bounds = getPlayBounds();
    const waveCount = Math.min(4, state.wordQueue.length);
    for (let k = 0; k < waveCount; k++) {
      if (spawnNextWord(true)) {
        const spawned = state.activeWords[state.activeWords.length - 1];
        if (spawned) {
          spawned.y = bounds.top + Math.min(170, (bounds.bottom - bounds.top) * (0.32 + k * 0.07));
        }
      }
    }
    scatterWordsToTop(state.activeWords, bounds, 1.0, 34);
    state.spawnTimer = 3.0;
  }

  centerOverlay.classList.add('hidden');
  if (finalPool.length > 0) {
    updateHitSpotlightCard(finalPool[finalPool.length - 1], false);
  }
  actions.applyStaticUILocalization();
  updateHudStats();
  updateBottomTargetUI();
  renderLevelSidebar();

  const previewSlice = state.wordQueue.slice(-3);
  previewSlice.forEach(entry => {
    ttsManager.prefetch(entry.withArticle || entry.word, state.targetLang);
  });

  if (document.activeElement && document.activeElement !== document.body) {
    document.activeElement.blur();
  }
}

// --- Спавн нового слова с проверкой свободной дорожки по X и Y + авто-замедлением длинных слов ---
export function spawnNextWord(forceSpawn = false) {
  if (state.wordQueue.length === 0) return false;

  const candidateEntry = state.wordQueue[state.wordQueue.length - 1];
  const targetText = getTargetString(candidateEntry);
  const bounds = getPlayBounds();
  const spawnY = bounds.top + 22;
  const meas = measureWordCapsule(targetText, candidateEntry);

  const slot = findSafeSpawnX(meas.boxW, meas.boxH, spawnY, state.activeWords, bounds);
  // Если верхняя полоса космоса сейчас плотно занята, откладываем спавн на 0.45 сек вместо наложения плашек!
  if (!slot.clear && !forceSpawn && state.activeWords.length > 0) {
    return false;
  }

  const entry = state.wordQueue.pop();

  ttsManager.prefetch(entry.withArticle || entry.word, state.targetLang);
  if (state.wordQueue.length > 0) {
    const nextUp = state.wordQueue[state.wordQueue.length - 1];
    ttsManager.prefetch(nextUp.withArticle || nextUp.word, state.targetLang);
  }

  const { lesson } = getActiveSelection();
  const speedPreset = state.speedPresets[state.speedPresetIndex].mult;
  const lengthFactor = computeWordLengthSpeedFactor(targetText.length);
  const playHeight = bounds.bottom - bounds.top;
  const heightScale = Math.max(0.68, Math.min(1.05, playHeight / 560));
  const lessonMult = (lesson && lesson.speedMultiplier) || 0.94;
  const baseSpeedUnscaled = (33 + Math.random() * 8) * lessonMult * lengthFactor * heightScale;

  state.activeWords.push({
    id: allocateEntityId(),
    entry,
    text: targetText,
    typedCount: 0,
    boxW: meas.boxW,
    boxH: meas.boxH,
    x: slot.x,
    y: spawnY,
    vx: 0,
    pushVx: 0,
    pushVy: 0,
    baseSpeedUnscaled,
    vy: baseSpeedUnscaled * speedPreset,
    frameVy: baseSpeedUnscaled * speedPreset,
    recoilY: 0,
    hitFlash: 0,
    spawnTime: performance.now()
  });

  if (state.studyMode === 'listen' && !state.lockedWordId && state.activeWords.length === 1) {
    ttsManager.speak(entry.withArticle || entry.word, state.targetLang);
  }

  updateKeyboardNextHint();
  return true;
}

export function hitWordLetter(wordObj) {
  const weapon = getCurrentWeapon();
  wordObj.typedCount++;
  // Авто-завершение хвостовой пунктуации (точка, воскл./вопр. знак в конце фразы)
  let remIdx = wordObj.typedCount;
  while (remIdx < wordObj.text.length && isBridgeSeparator(wordObj.text[remIdx])) {
    remIdx++;
  }
  if (remIdx >= wordObj.text.length) {
    wordObj.typedCount = wordObj.text.length;
  }
  wordObj.recoilY = Math.min(18, wordObj.recoilY + 4.2 * weapon.recoilBoost);
  wordObj.hitFlash = 1.0;

  state.shotsFired++;
  state.shotsHit++;
  state.score += 10 * state.combo;
  if (state.score > state.highScore) {
    state.highScore = state.score;
    saveSettingsPatch({ highScore: state.highScore });
  }

  const style = getArticleStyle(wordObj.entry.article, state.targetLang);
  const isFinalLetter = wordObj.typedCount >= wordObj.text.length;
  const pan = getHorizontalPan(wordObj.x);

  spawnWeaponVisualEffect(weapon.id, wordObj.x, wordObj.y, style.main);
  sound.playWeaponShot(weapon.id, wordObj.typedCount, state.combo, pan, isFinalLetter);

  if (weapon.id === 'gravity' && !isFinalLetter) {
    const bounds = getPlayBounds();
    scatterWordsToTop(state.activeWords, bounds, 0.58, 34);
  }

  if (isFinalLetter) {
    explodeWord(wordObj, true);
  } else {
    updateBottomTargetUI();
    updateKeyboardNextHint();
  }

  updateHudStats();
}

export function explodeWord(wordObj, byPlayer = true) {
  const idx = state.activeWords.findIndex(w => w.id === wordObj.id);
  if (idx !== -1) {
    state.activeWords.splice(idx, 1);
  }

  if (state.lockedWordId === wordObj.id) {
    state.lockedWordId = null;
  }

  const style = getArticleStyle(wordObj.entry.article, state.targetLang);
  const weapon = getCurrentWeapon();

  state.shockwaves.push({
    x: wordObj.x,
    y: wordObj.y,
    radius: 8,
    maxRadius: 82,
    color: style.main,
    alpha: 1.0
  });

  spawnParticles(wordObj.x, wordObj.y, style.main, 24, 195);
  spawnParticles(wordObj.x, wordObj.y, weapon.color, 12, 155);

  const bounds = getPlayBounds();
  const clampedX = Math.max(bounds.left + 80, Math.min(bounds.right - 80, wordObj.x));
  const clampedY = Math.max(bounds.top + 48, Math.min(bounds.bottom - 55, wordObj.y));

  state.floatingTranslations.push({
    x: clampedX,
    y: clampedY,
    vy: -18,
    entry: wordObj.entry,
    rawDe: wordObj.entry.raw,
    color: style.main,
    life: 0,
    maxLife: 4.0
  });
  separateFloatingTranslations(bounds);

  // Сохраняем в правую колонку «Взорванные слова» без дублей подряд
  const existingHistIdx = state.killHistory.findIndex(e => e.raw === wordObj.entry.raw);
  if (existingHistIdx !== -1) state.killHistory.splice(existingHistIdx, 1);
  state.killHistory.unshift(wordObj.entry);
  if (state.killHistory.length > 45) state.killHistory.pop();
  rerenderKillFeed();

  if (byPlayer) {
    state.wordsDestroyedInLevel++;
    state.combo = Math.min(12, state.combo + 1);
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    state.score += wordObj.text.length * 25 * state.combo;
    if (state.score > state.highScore) {
      state.highScore = state.score;
      saveSettingsPatch({ highScore: state.highScore });
    }

    // Засчитываем выученное слово для прокачки оружия и обновляем карточку «ПОПАДАНИЕ!»
    recordWordLearned(wordObj.entry, state.targetLang);
    updateHitSpotlightCard(wordObj.entry, true);
    updatePilotRankUI();

    const pan = getHorizontalPan(wordObj.x);
    sound.playExplosion(state.combo, pan);
    ttsManager.speak(wordObj.entry.withArticle || wordObj.entry.word, state.targetLang);

    if (weapon.id === 'gravity' && state.activeWords.length > 0) {
      scatterWordsToTop(state.activeWords, bounds, 1.0, 34);
      sound.playGravityWave(0.85);
    }
  }

  updateHudStats();
  updateBottomTargetUI();
  updateKeyboardNextHint();

  if (state.wordQueue.length === 0 && state.activeWords.length === 0 && state.shields > 0) {
    setTimeout(() => {
      if (state.running && state.activeWords.length === 0 && state.wordQueue.length === 0) {
        completeLevel();
      }
    }, 1350);
  }
}

export function updateKeyboardNextHint() {
  document.querySelectorAll('.zkey.next-key-hint').forEach(el => {
    el.classList.remove('next-key-hint');
  });

  if (!state.running || state.paused) return;

  const locked = state.activeWords.find(w => w.id === state.lockedWordId);
  if (locked) {
    let idx = locked.typedCount;
    while (idx < locked.text.length && isBridgeSeparator(locked.text[idx])) {
      idx++;
    }
    const nextChar = locked.text[idx];
    const baseKey = mapTargetCharToBaseKey(nextChar);
    if (baseKey) {
      let keyBtn = document.querySelector(`.zkey[data-key="${CSS.escape(baseKey)}"]`);
      if (!keyBtn && baseKey === 'ñ') {
        keyBtn = document.querySelector('.zkey[data-key="n"]');
      }
      if (keyBtn) keyBtn.classList.add('next-key-hint');
    }
  }
}

export function flashVirtualKey(baseKey) {
  if (!baseKey) return;
  const btn = document.querySelector(`.zkey[data-key="${CSS.escape(baseKey)}"]`);
  if (!btn) return;
  btn.classList.add('pressed');
  setTimeout(() => btn.classList.remove('pressed'), 110);
}

export function handleVirtualKeyPress(btn, e) {
  if (e) {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
  }
  sound.init();

  if (state.screenMode !== 'play' || !state.running || state.paused || state.gameOver) return;

  btn.classList.add('pressed');
  setTimeout(() => btn.classList.remove('pressed'), 120);

  if (navigator.vibrate) {
    try { navigator.vibrate(7); } catch (_) {}
  }

  const action = btn.dataset.action;
  if (action === 'reset') {
    state.lockedWordId = null;
    updateBottomTargetUI();
    updateKeyboardNextHint();
    return;
  }
  if (action === 'emp') {
    triggerEmpWave();
    return;
  }

  const ch = btn.dataset.key;
  if (ch) {
    processTypedChar(ch);
  }
}

export function isBridgeSeparator(ch) {
  return ch === '-' || ch === ' ' || ch === "'" || ch === '/' ||
    ch === '.' || ch === ',' || ch === '!' || ch === '?' || ch === '(' || ch === ')';
}

export function processTypedChar(char) {
  if (state.lastAbsorbedUmlautE && char.toLowerCase() === 'e') {
    state.lastAbsorbedUmlautE = false;
    const locked = state.activeWords.find(w => w.id === state.lockedWordId);
    if (!locked || (locked.text[locked.typedCount] || '').toLowerCase() !== 'e') {
      return;
    }
  }
  state.lastAbsorbedUmlautE = false;

  if (state.lastAbsorbedEszettS && char.toLowerCase() === 's') {
    state.lastAbsorbedEszettS = false;
    const locked = state.activeWords.find(w => w.id === state.lockedWordId);
    if (!locked || (locked.text[locked.typedCount] || '').toLowerCase() !== 's') {
      return;
    }
  }
  state.lastAbsorbedEszettS = false;

  let lockedWord = state.activeWords.find(w => w.id === state.lockedWordId);

  if (lockedWord) {
    let expectedChar = lockedWord.text[lockedWord.typedCount];

    if (isBridgeSeparator(expectedChar) && !isBridgeSeparator(char)) {
      let skipIdx = lockedWord.typedCount;
      while (skipIdx < lockedWord.text.length && isBridgeSeparator(lockedWord.text[skipIdx])) {
        skipIdx++;
      }
      const afterSeparator = lockedWord.text[skipIdx];
      if (afterSeparator) {
        const checkAfter = charsMatchTargetLang(char, afterSeparator);
        if (checkAfter.matched) {
          lockedWord.typedCount = skipIdx;
          state.lastAbsorbedUmlautE = checkAfter.umlautSub;
          state.lastAbsorbedEszettS = checkAfter.eszettSub;
          hitWordLetter(lockedWord);
          return;
        }
      }
    }

    const matchRes = charsMatchTargetLang(char, expectedChar);
    if (matchRes.matched) {
      state.lastAbsorbedUmlautE = matchRes.umlautSub;
      state.lastAbsorbedEszettS = matchRes.eszettSub;
      hitWordLetter(lockedWord);
    } else {
      state.shotsFired++;
      state.combo = 1;
      state.mistakeWordsMap.set(lockedWord.entry.raw, lockedWord.entry);
      sound.playMiss();
      updateHudStats();
    }
    return;
  }

  const candidates = state.activeWords.filter(w => {
    const firstChar = w.text[w.typedCount];
    return firstChar && charsMatchTargetLang(char, firstChar).matched;
  });

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.y - a.y);
    const chosen = candidates[0];
    state.lockedWordId = chosen.id;

    ttsManager.prefetch(chosen.entry.withArticle || chosen.entry.word, state.targetLang);
    if (state.studyMode === 'listen') {
      ttsManager.speak(chosen.entry.withArticle || chosen.entry.word, state.targetLang);
    }

    const matchRes = charsMatchTargetLang(char, chosen.text[chosen.typedCount]);
    state.lastAbsorbedUmlautE = matchRes.umlautSub;
    state.lastAbsorbedEszettS = matchRes.eszettSub;

    hitWordLetter(chosen);
  } else {
    state.shotsFired++;
    state.combo = 1;
    sound.playMiss();
    updateHudStats();
  }
}

export function triggerEmpWave() {
  if (!state.running || state.paused || state.empCharges <= 0 || state.activeWords.length === 0) return;

  state.empCharges--;
  updateHudStats();

  state.shockwaves.push({
    x: state.ship.x,
    y: state.ship.y,
    radius: 15,
    maxRadius: 480,
    color: '#fbbf24',
    alpha: 1.0
  });

  const sorted = state.activeWords.slice().sort((a, b) => b.y - a.y);
  const toDestroy = sorted.slice(0, 3);
  toDestroy.forEach(w => explodeWord(w, true));
}

export function completeLevel() {
  state.running = false;
  state.overlayMode = 'complete';
  const { lesson } = getActiveSelection();
  if (lesson && !state.activeCustomRoundTitle) {
    state.completedLessonIds.add(lesson.id);
    saveSettingsPatch({
      completedLessonIds: Array.from(state.completedLessonIds),
      highScore: Math.max(state.highScore, state.score)
    });
  }

  updatePilotRankUI();
  renderLevelSidebar();
  refreshOverlayContent();
  startPostLevelQuiz(state.currentRoundPool);
  centerOverlay.classList.remove('hidden');
}

// --- Мини-блиц из 3 слов после завершения урока ---
export function startPostLevelQuiz(levelWords) {
  const langWords = getAllWordsInTargetLang(state.targetLang);
  if (!levelWords || levelWords.length < 3 || langWords.length < 4) {
    state.activeQuiz = null;
    levelQuizBox.style.display = 'none';
    if (overlayCard) overlayCard.classList.add('no-quiz');
    syncQuizProgressUI();
    return;
  }

  if (overlayCard) overlayCard.classList.remove('no-quiz');
  levelQuizBox.style.display = 'flex';
  const questions = shuffleArray(levelWords).slice(0, 3).map(currentQ => {
    const wrongPool = langWords.filter(w => w.raw !== currentQ.raw && getWordTranslation(w) !== getWordTranslation(currentQ));
    const wrongChoices = shuffleArray(wrongPool).slice(0, 3);
    const options = shuffleArray([currentQ, ...wrongChoices]);
    return { currentQ, options };
  });

  state.activeQuiz = {
    questions,
    qIndex: 0,
    correctCount: 0,
    answered: false,
    selectedOptRaw: null,
    results: []
  };

  renderCurrentQuizQuestion(true);
}

export function renderCurrentQuizQuestion(speakNow = false) {
  const quiz = state.activeQuiz;
  if (!quiz) return;
  const tr = t();

  if (quizHeaderTitle) quizHeaderTitle.textContent = tr.ovQuickBlitzTitle || tr.quizHeader;
  syncQuizProgressUI();

  if (quiz.qIndex >= quiz.questions.length) {
    quizScoreText.textContent = tr.quizDoneScore(quiz.correctCount, quiz.questions.length);
    if (btnQuizSpeak) btnQuizSpeak.style.display = 'none';
    quizQuestionWord.dir = isHebrewUI() ? 'rtl' : 'ltr';
    quizQuestionWord.textContent = tr.quizDoneTitle(quiz.correctCount, quiz.questions.length);
    quizOptionsGrid.innerHTML = '';
    return;
  }

  const { currentQ, options } = quiz.questions[quiz.qIndex];
  if (btnQuizSpeak) btnQuizSpeak.style.display = 'inline-flex';
  quizScoreText.textContent = `${quiz.qIndex + 1}/${quiz.questions.length}`;
  quizQuestionWord.dir = 'ltr';
  quizQuestionWord.textContent = currentQ.raw;

  if (speakNow) {
    ttsManager.speak(currentQ.withArticle || currentQ.word, state.targetLang);
  }

  quizOptionsGrid.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quiz-opt-btn';
    btn.textContent = getWordTranslation(opt);
    if (isRtlTranslation(opt)) {
      btn.dir = 'rtl';
      btn.style.textAlign = 'right';
    } else {
      btn.dir = 'ltr';
      btn.style.textAlign = 'left';
    }

    if (quiz.answered) {
      btn.disabled = true;
      if (opt.raw === currentQ.raw) {
        btn.classList.add('correct');
      } else if (opt.raw === quiz.selectedOptRaw) {
        btn.classList.add('wrong');
      }
    }

    btn.addEventListener('click', () => {
      if (quiz.answered) return;
      quiz.answered = true;
      quiz.selectedOptRaw = opt.raw;
      const isRight = opt.raw === currentQ.raw;
      if (!Array.isArray(quiz.results)) quiz.results = [];
      quiz.results[quiz.qIndex] = isRight ? 'ok' : 'wrong';

      if (isRight) {
        quiz.correctCount++;
        state.score += 150;
        if (state.score > state.highScore) {
          state.highScore = state.score;
          saveSettingsPatch({ highScore: state.highScore });
        }
        updateHudStats();
        sound.playExplosion(3, 0);
      } else {
        sound.playMiss();
      }

      renderCurrentQuizQuestion(false);

      setTimeout(() => {
        quiz.qIndex++;
        quiz.answered = false;
        quiz.selectedOptRaw = null;
        renderCurrentQuizQuestion(true);
      }, 900);
    });
    quizOptionsGrid.appendChild(btn);
  });
}

export function triggerGameOver() {
  state.running = false;
  state.gameOver = true;
  state.overlayMode = 'gameover';
  state.activeQuiz = null;
  levelQuizBox.style.display = 'none';
  refreshOverlayContent();
  centerOverlay.classList.remove('hidden');
}

export function togglePause() {
  if (state.screenMode === 'title') return;

  if (!centerOverlay.classList.contains('hidden')) {
    if (state.running || state.paused) {
      state.paused = false;
      state.running = true;
      centerOverlay.classList.add('hidden');
    }
    return;
  }

  if (!state.running) return;
  state.paused = true;
  state.overlayMode = 'pause';
  state.activeQuiz = null;
  levelQuizBox.style.display = 'none';
  btnStartLevel.dataset.resumeMode = '1';
  refreshOverlayContent();
  centerOverlay.classList.remove('hidden');
}


let lastFrameTime = performance.now();

export function gameLoop(now) {
  const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
  lastFrameTime = now;

  update(dt, now);
  render(now);

  requestAnimationFrame(gameLoop);
}

export function update(dt, now) {
  const bounds = getPlayBounds();

  if (state.screenMode === 'play') {
    state.ship.x = bounds.centerX;
    state.ship.targetY = bounds.bottom - 24;
  }

  state.ship.y += (state.ship.targetY - state.ship.y) * Math.min(1, dt * 8.5);

  if (state.warpTimer > 0) state.warpTimer = Math.max(0, state.warpTimer - dt);
  if (state.weaponBannerTimer > 0) state.weaponBannerTimer = Math.max(0, state.weaponBannerTimer - dt);
  if (state.gravityEquipCooldown > 0) state.gravityEquipCooldown = Math.max(0, state.gravityEquipCooldown - dt);
  if (state.layoutWarningTimer > 0) state.layoutWarningTimer = Math.max(0, state.layoutWarningTimer - dt);

  for (const neb of state.nebulae) {
    neb.x += neb.vx * dt;
    neb.y += neb.vy * dt;
    if (neb.x < -neb.radius * 0.4 || neb.x > canvas.width + neb.radius * 0.4) neb.vx *= -1;
    if (neb.y < -neb.radius * 0.4 || neb.y > canvas.height + neb.radius * 0.4) neb.vy *= -1;
  }

  const warpMult = state.warpTimer > 0 ? 14.0 : (state.running && !state.paused ? 1.45 : 0.75);
  const starMaxY = state.screenMode === 'title' ? canvas.height : bounds.bottom;
  for (const s of state.stars) {
    s.y += s.speed * warpMult * dt;
    if (s.y > starMaxY) {
      s.y = 0;
      s.x = Math.random() * canvas.width;
    }
  }

  for (let i = state.lasers.length - 1; i >= 0; i--) {
    const l = state.lasers[i];
    l.alpha -= dt * (l.decay || 7.5);
    if (l.alpha <= 0) state.lasers.splice(i, 1);
  }

  for (let i = state.missiles.length - 1; i >= 0; i--) {
    const m = state.missiles[i];
    m.progress += m.speed * dt;
    const tProg = Math.min(1, m.progress);
    const inv = 1 - tProg;
    m.x = inv * inv * m.x0 + 2 * inv * tProg * m.cx + tProg * tProg * m.x2;
    m.y = inv * inv * m.y0 + 2 * inv * tProg * m.cy + tProg * tProg * m.y2;

    state.particles.push({
      x: m.x + (Math.random() * 4 - 2),
      y: m.y + (Math.random() * 4 - 2),
      vx: (Math.random() - 0.5) * 20,
      vy: 15 + Math.random() * 20,
      size: Math.random() * 2.1 + 1.1,
      color: Math.random() > 0.4 ? '#fb923c' : '#fde047',
      alpha: 0.85,
      decay: 3.4
    });

    if (m.progress >= 1) {
      spawnParticles(m.x2, m.y2, '#fb923c', 9, 125);
      state.shockwaves.push({
        x: m.x2,
        y: m.y2,
        radius: 3,
        maxRadius: 22,
        color: '#fbbf24',
        alpha: 0.9
      });
      state.missiles.splice(i, 1);
    }
  }

  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.96;
    p.vy *= 0.96;
    p.alpha -= p.decay * dt;
    if (p.alpha <= 0) state.particles.splice(i, 1);
  }

  for (let i = state.shockwaves.length - 1; i >= 0; i--) {
    const sw = state.shockwaves[i];
    sw.radius += (sw.maxRadius - sw.radius) * 8 * dt;
    sw.alpha -= dt * 2.2;
    if (sw.alpha <= 0) state.shockwaves.splice(i, 1);
  }

  for (let i = state.repulsorWaves.length - 1; i >= 0; i--) {
    const rw = state.repulsorWaves[i];
    rw.radius += (rw.maxRadius - rw.radius) * 5.4 * dt;
    rw.alpha -= dt * 1.65;
    if (rw.alpha <= 0) state.repulsorWaves.splice(i, 1);
  }

  for (let i = state.floatingTranslations.length - 1; i >= 0; i--) {
    const ft = state.floatingTranslations[i];
    ft.life += dt;
    ft.y += ft.vy * dt;
    ft.vy *= 0.95;
    if (ft.life >= ft.maxLife) {
      state.floatingTranslations.splice(i, 1);
    }
  }

  const angleDiff = state.ship.targetAngle - state.ship.angle;
  state.ship.angle += angleDiff * Math.min(1, dt * 18);
  state.ship.recoil = Math.max(0, state.ship.recoil - dt * 35);

  if (state.screenMode === 'title') {
    if (state.homeSubView === 'home') {
      updateTitleDemo(dt, now);
    }
    return;
  }

  if (!state.running || state.paused) return;

  const { lesson } = getActiveSelection();
  const speedPreset = state.speedPresets[state.speedPresetIndex].mult;
  state.spawnTimer -= dt;

  const maxActiveOnScreen = state.weaponId === 'gravity'
    ? (canvas.width < 520 ? 5 : 7)
    : (canvas.width < 520 ? 4 : 6);

  if (state.spawnTimer <= 0 && state.wordQueue.length > 0 && state.activeWords.length < maxActiveOnScreen) {
    const didSpawn = spawnNextWord(false);
    if (didSpawn) {
      const lastSpawned = state.activeWords[state.activeWords.length - 1];
      const longWordBonus = lastSpawned && lastSpawned.text.length > 15 ? 0.55 : 0;
      const baseInterval = ((lesson && lesson.spawnIntervalMs) || 2650) / 1000 + longWordBonus;
      state.spawnTimer = baseInterval / Math.pow(speedPreset, 0.72);
    } else {
      // Если все верхние дорожки заняты, ждём 0.45 сек, чтобы плашки не наслаивались!
      state.spawnTimer = 0.45;
    }
  } else if (state.activeWords.length === 0 && state.wordQueue.length > 0) {
    spawnNextWord(true);
    state.spawnTimer = 1.85;
  }

  const minStartY = bounds.top + 32;
  // Выравнивание скоростей и мягкое разведение плашек слов в полёте
  resolveWordCollisions(state.activeWords, bounds, dt, minStartY);

  for (let i = state.activeWords.length - 1; i >= 0; i--) {
    const w = state.activeWords[i];

    if (w.pushVx) {
      w.x += w.pushVx * dt;
      w.pushVx *= Math.exp(-3.0 * dt);
      if (w.x <= bounds.left + 52 || w.x >= bounds.right - 52) {
        w.pushVx *= -0.35;
      }
      if (Math.abs(w.pushVx) < 1) w.pushVx = 0;
    }

    if (w.pushVy) {
      w.y += w.pushVy * dt;
      w.pushVy *= Math.exp(-2.8 * dt);
      if (w.pushVy < -55 && Math.random() < 0.35) {
        state.particles.push({
          x: w.x + (Math.random() * 28 - 14),
          y: w.y + 12,
          vx: (Math.random() - 0.5) * 24,
          vy: 30 + Math.random() * 35,
          size: Math.random() * 2 + 1.1,
          color: '#2dd4bf',
          alpha: 0.78,
          decay: 2.8
        });
      }
      if (Math.abs(w.pushVy) < 1) w.pushVy = 0;
    }

    const dxToShip = state.ship.x - w.x;
    const pullFactor = w.y > bounds.bottom * 0.65 ? 0.08 : 0.015;
    w.x += dxToShip * pullFactor * dt;

    if (w.recoilY > 0) {
      w.y -= w.recoilY * 9 * dt;
      w.recoilY = Math.max(0, w.recoilY - 28 * dt);
    } else {
      w.y += (w.frameVy ?? w.vy) * dt;
    }

    if (w.y < minStartY) {
      w.y = minStartY;
      if (w.pushVy < 0) w.pushVy = 0;
    }

    if (w.hitFlash > 0) {
      w.hitFlash = Math.max(0, w.hitFlash - dt * 5);
    }

    if (w.y >= state.ship.y - 22) {
      state.mistakeWordsMap.set(w.entry.raw, w.entry);
      state.shields--;
      state.combo = 1;
      sound.playShieldHit();
      explodeWord(w, false);

      if (state.shields <= 0) {
        triggerGameOver();
        return;
      }
    }
  }
}

export function launchPinnedWordsDrill() {
  sound.init();
  const pinned = getPinnedEntriesForTargetLang(state.targetLang);
  if (pinned.length === 0) return;
  startLevelNow(pinned, t().pinnedRoundTitle);
}

export function toggleArticleTypingMode() {
  state.typeWithArticle = !state.typeWithArticle;
  saveSettingsPatch({ typeWithArticle: state.typeWithArticle });
  const tr = t();
  if (btnArticleMode) {
    btnArticleMode.textContent = state.typeWithArticle ? tr.articleMode : tr.badgeMode;
    btnArticleMode.classList.toggle('active', state.typeWithArticle);
  }

  state.activeWords.forEach(w => {
    if (w.typedCount === 0) {
      w.text = getTargetString(w.entry);
      const m = measureWordCapsule(w.text, w.entry);
      w.boxW = m.boxW;
      w.boxH = m.boxH;
    }
  });

  if (gameSettingsDialog && gameSettingsDialog.open) {
    actions.renderGameSettingsModal();
  }
}

export function applySpeedPresetByIndex(newIndex) {
  if (newIndex < 0 || newIndex >= state.speedPresets.length) return;
  state.speedPresetIndex = newIndex;
  const preset = state.speedPresets[state.speedPresetIndex];
  saveSettingsPatch({
    speedPresetIndex: state.speedPresetIndex,
    speedMult: preset.mult
  });
  if (btnSpeedMode) btnSpeedMode.textContent = preset.label;
  if (labelFeatSettings) labelFeatSettings.textContent = t().featSpeed(preset.label);

  state.activeWords.forEach(w => {
    if (w.baseSpeedUnscaled) {
      w.vy = w.baseSpeedUnscaled * preset.mult;
    }
  });

  if (state.screenMode === 'play') {
    state.weaponBannerText = t().speedBanner(preset.label);
    state.weaponBannerColor = '#38bdf8';
    state.weaponBannerTimer = 1.45;
  }
  if (gameSettingsDialog && gameSettingsDialog.open) {
    actions.renderGameSettingsModal();
  }
}

export function cycleSpeedPreset() {
  applySpeedPresetByIndex((state.speedPresetIndex + 1) % state.speedPresets.length);
}

export function setStudyMode(modeId) {
  if (!['type', 'listen', 'translate'].includes(modeId)) return;
  state.studyMode = modeId;
  saveSettingsPatch({ studyMode: modeId });
  updateStudyModeButtonsUI();

  state.activeWords.forEach(w => {
    const m = measureWordCapsule(w.text, w.entry);
    w.boxW = m.boxW;
    w.boxH = m.boxH;
  });

  const tr = t();
  const modeLabel = modeId === 'listen' ? tr.modeListen : (modeId === 'translate' ? tr.modeTranslate : tr.modeType);
  if (state.screenMode === 'play') {
    state.weaponBannerText = tr.studyModeBanner(modeLabel);
    state.weaponBannerColor = '#34d399';
    state.weaponBannerTimer = 1.65;
  }

  if (modeId === 'listen' && state.activeWords.length > 0) {
    const targetWord = state.activeWords.find(w => w.id === state.lockedWordId) || state.activeWords[0];
    if (targetWord) {
      ttsManager.speak(targetWord.entry.withArticle || targetWord.entry.word, state.targetLang, true);
    }
  }
}

export function toggleDesktopKeyboard(forceState) {
  state.desktopKbdOpen = typeof forceState === 'boolean' ? forceState : !state.desktopKbdOpen;
  saveSettingsPatch({ desktopKbdOpen: state.desktopKbdOpen });
  document.body.classList.toggle('desktop-kbd-open', state.desktopKbdOpen);
  if (btnToggleDesktopKbd) {
    btnToggleDesktopKbd.classList.toggle('active', state.desktopKbdOpen);
  }
  resizeCanvas();
  requestAnimationFrame(() => resizeCanvas());
  if (gameSettingsDialog && gameSettingsDialog.open) {
    actions.renderGameSettingsModal();
  }
}

export function bindGameplayEvents() {
  window.addEventListener('keydown', (e) => {
    if (
      (dictDialog && dictDialog.open) ||
      (customWordsDialog && customWordsDialog.open) ||
      (ttsSettingsDialog && ttsSettingsDialog.open) ||
      (courseBrowserDialog && courseBrowserDialog.open) ||
      (gameSettingsDialog && gameSettingsDialog.open) ||
      (statsDialog && statsDialog.open) ||
      (leaderboardDialog && leaderboardDialog.open)
    ) {
      return;
    }

    const activeEl = document.activeElement;
    const isTypingInInput = Boolean(
      activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.tagName === 'SELECT' ||
        activeEl.isContentEditable
      )
    );

    if (state.screenMode === 'title' && (state.homeSubView === 'decks' || state.homeSubView === 'admin')) {
      if (e.key === 'Escape' && !isTypingInInput) {
        e.preventDefault();
        if (state.homeSubView === 'decks' && state.openedDeckId) {
          state.openedDeckId = '';
          state.openedDeckEditMode = false;
          actions.renderDecksPage();
        } else if (state.decksOpenedFromPlay) {
          actions.resumeBattleFromDecksPage();
        } else {
          actions.switchHomeSubView('home');
        }
      }
      return;
    }

    if (isTypingInInput) {
      return;
    }

    if (!e.ctrlKey && !e.altKey && !e.metaKey && /^[1-6]$/.test(e.key)) {
      const idx = Number(e.key) - 1;
      if (WEAPONS[idx]) {
        e.preventDefault();
        equipWeapon(WEAPONS[idx].id, true);
        return;
      }
    }

    if (state.screenMode === 'title') {
      if (e.key === 'Enter') {
        e.preventDefault();
        launchFromTitleScreen();
      }
      return;
    }

    if (!centerOverlay.classList.contains('hidden')) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (state.overlayMode === 'complete' && btnNextLevel && btnNextLevel.style.display !== 'none') {
          btnNextLevel.click();
        } else {
          btnStartLevel.click();
        }
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      togglePause();
      return;
    }

    if (!state.running || state.paused || state.gameOver) return;

    if (e.key === 'Backspace' || e.key === 'Tab') {
      e.preventDefault();
      state.lockedWordId = null;
      updateBottomTargetUI();
      updateKeyboardNextHint();
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      triggerEmpWave();
      return;
    }

    if (e.ctrlKey || e.altKey || e.metaKey || e.key.length !== 1) return;

    const char = e.key;
    if (/[а-яёА-ЯЁ\u0590-\u05FF]/.test(char)) {
      e.preventDefault();
      state.layoutWarningTimer = 2.6;
      sound.playMiss();
      return;
    }

    e.preventDefault();
    flashVirtualKey(mapTargetCharToBaseKey(char));
    processTypedChar(char);
  });

  if (btnArcadeLaunch) {
    btnArcadeLaunch.addEventListener('click', launchFromTitleScreen);
  }
  if (btnBackToTitle) {
    btnBackToTitle.addEventListener('click', returnToTitleScreen);
  }
  if (btnCloseOverlay) {
    btnCloseOverlay.addEventListener('click', () => {
      if (state.overlayMode === 'pause' && state.paused) {
        togglePause();
      } else {
        returnToTitleScreen();
      }
    });
  }
  if (btnQuizSpeak) {
    btnQuizSpeak.addEventListener('click', () => {
      const quiz = state.activeQuiz;
      const q = quiz && quiz.questions && quiz.questions[quiz.qIndex];
      if (!q || !q.currentQ) return;
      sound.init();
      ttsManager.speak(q.currentQ.withArticle || q.currentQ.word, state.targetLang, true);
      btnQuizSpeak.blur();
    });
  }
  if (btnHudHome) {
    btnHudHome.addEventListener('click', returnToTitleScreen);
  }

  if (btnWeaponMode) {
    btnWeaponMode.addEventListener('click', () => {
      const unlockedList = WEAPONS.filter(isWeaponUnlocked);
      if (unlockedList.length === 0) return;
      const curIdx = unlockedList.findIndex(w => w.id === state.weaponId);
      const nextW = unlockedList[(curIdx + 1) % unlockedList.length];
      equipWeapon(nextW.id, true);
      btnWeaponMode.blur();
    });
  }

  btnStartLevel.addEventListener('click', () => {
    sound.init();
    if (btnStartLevel.dataset.resumeMode === '1' && state.paused) {
      delete btnStartLevel.dataset.resumeMode;
      state.paused = false;
      centerOverlay.classList.add('hidden');
      return;
    }
    delete btnStartLevel.dataset.resumeMode;
    startLevelNow();
  });

  btnNextLevel.addEventListener('click', () => {
    sound.init();
    const nextPtr = getNextLessonPointer();
    if (nextPtr) {
      selectCourseLesson(nextPtr.courseId, nextPtr.moduleIndex, nextPtr.lessonIndex, false);
    }
  });

  btnPracticeMistakes.addEventListener('click', () => {
    sound.init();
    const mistakes = Array.from(state.mistakeWordsMap.values());
    if (mistakes.length > 0) {
      startLevelNow(mistakes, t().mistakesBtn(mistakes.length));
    }
  });


  if (btnDrillPinned) {
    btnDrillPinned.addEventListener('click', () => {
      launchPinnedWordsDrill();
      btnDrillPinned.blur();
    });
  }
  if (btnPracticePinned) {
    btnPracticePinned.addEventListener('click', launchPinnedWordsDrill);
  }

  btnEmp.addEventListener('click', () => {
    triggerEmpWave();
    btnEmp.blur();
  });

  if (btnArticleMode) {
    btnArticleMode.addEventListener('click', () => {
      toggleArticleTypingMode();
      btnArticleMode.blur();
    });
  }

  btnSpeedMode.addEventListener('click', () => {
    cycleSpeedPreset();
    btnSpeedMode.blur();
  });

  if (btnTitleSpeed) {
    btnTitleSpeed.addEventListener('click', () => {
      cycleSpeedPreset();
      btnTitleSpeed.blur();
    });
  }

  btnPause.addEventListener('click', () => {
    togglePause();
    btnPause.blur();
  });

  if (btnMobHudPause) {
    btnMobHudPause.addEventListener('click', () => {
      togglePause();
      btnMobHudPause.blur();
    });
  }

  if (btnMobHudWave) {
    btnMobHudWave.addEventListener('click', () => {
      actions.openCourseCatalogModal('all');
      btnMobHudWave.blur();
    });
  }

  if (btnMobHudEmp) {
    btnMobHudEmp.addEventListener('click', () => {
      triggerEmpWave();
      btnMobHudEmp.blur();
    });
  }

  if (btnQuickLevels) {
    btnQuickLevels.addEventListener('click', () => {
      actions.openCourseCatalogModal('all');
    });
  }

  if (btnClearFeed) {
    btnClearFeed.addEventListener('click', () => {
      state.killHistory = [];
      rerenderKillFeed();
    });
  }

  if (studyModeGroup) {
    studyModeGroup.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest && e.target.closest('.study-mode-btn');
      if (!btn || !btn.dataset.studyMode) return;
      sound.init();
      setStudyMode(btn.dataset.studyMode);
      btn.blur();
    });
  }

  if (btnToggleDesktopKbd) {
    btnToggleDesktopKbd.classList.toggle('active', state.desktopKbdOpen);
    btnToggleDesktopKbd.addEventListener('click', () => {
      toggleDesktopKeyboard();
      btnToggleDesktopKbd.blur();
    });
  }

  if (btnPromoWeaponCycle) {
    btnPromoWeaponCycle.addEventListener('click', () => {
      sound.init();
      const curIdx = WEAPONS.findIndex(w => w.id === state.weaponId);
      const nextW = WEAPONS[(curIdx + 1) % WEAPONS.length];
      equipWeapon(nextW.id, true);
      btnPromoWeaponCycle.blur();
    });
  }

  if (btnHitSpeak) {
    btnHitSpeak.addEventListener('click', () => {
      sound.init();
      if (state.lastSpotlightEntry) {
        ttsManager.speak(state.lastSpotlightEntry.withArticle || state.lastSpotlightEntry.word, state.targetLang, true);
      }
      btnHitSpeak.blur();
    });
  }

  if (btnHitKnow) {
    btnHitKnow.addEventListener('click', () => {
      sound.init();
      const entry = state.lastSpotlightEntry;
      if (!entry) return;
      recordWordLearned(entry, state.targetLang);
      if (isEntryPinned(entry, state.targetLang)) {
        togglePinWord(entry, state.targetLang);
      } else {
        refreshHitSpotlightPinState();
      }
      updatePilotRankUI();
      state.weaponBannerText = t().hitKnownToast(entry.word || entry.raw);
      state.weaponBannerColor = '#4ade80';
      state.weaponBannerTimer = 1.6;
      sound._playTactileClick(sound.ctx ? sound.ctx.currentTime : 0, sound.masterGain, 2400, 0.06);
      btnHitKnow.blur();
    });
  }

  if (btnHitRepeat) {
    btnHitRepeat.addEventListener('click', () => {
      sound.init();
      const entry = state.lastSpotlightEntry;
      if (!entry) return;
      togglePinWord(entry, state.targetLang);
      refreshHitSpotlightPinState();
      btnHitRepeat.blur();
    });
  }
}
