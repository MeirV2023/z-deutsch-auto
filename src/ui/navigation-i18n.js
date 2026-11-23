// Навигация экранов, мобильный нижний док и реактивная локализация RU / EN / HE (SRP)
import { saveSettingsPatch } from '../core/storage.js';
import { escapeHtml } from '../core/utils.js';
import { ALL_LANG_CODES, TARGET_LANG_META } from '../config/constants.js';
import { UI_TEXT } from '../i18n/index.js';
import { sound } from '../services/sound-engine.js';
import {
  getLocalizedField,
  isRtlUI,
  state,
  t
} from '../state/store.js';
import {
  ensureValidCourseSelection,
  getActiveSelection,
  getAllWordsInCourse,
  resolveLessonBaseWords
} from '../domain/catalog-service.js';
import {
  aboutPageView,
  adminStudioView,
  ankiDropSub,
  ankiDropTitle,
  ankiManualColsSummary,
  arcadeLogoMain,
  arcadeLogoSub,
  arcadeTitleScreen,
  arenaWavePill,
  btnAdminLockMode,
  btnArticleMode,
  btnDecksLevelAll,
  btnDecksReturnBattle,
  btnDownloadSampleApkg,
  btnHudLangPair,
  btnLangMode,
  btnMissionDailyGoal,
  btnMissionLaunch,
  btnMobNavAbout,
  btnMobNavDecks,
  btnMobNavHome,
  btnMobNavPlay,
  btnMobNavStats,
  btnNavAbout,
  btnNavAdmin,
  btnNavDecks,
  btnNavHome,
  btnNavLangToggle,
  btnNavPlay,
  btnSaveAnkiToDecks,
  btnSaveCustomWords,
  btnSidebarCatalog,
  btnSpeedMode,
  btnTargetLangDropdown,
  btnTargetLangHud,
  catalogDialogBody,
  catalogDialogTitle,
  centerOverlay,
  courseBrowserDialog,
  customDialogBody,
  customDialogHint,
  customDialogTitle,
  customWordsDialog,
  decksCompactLangPills,
  decksHeroSubtitle,
  decksHeroSubtitleMobile,
  decksHeroTitle,
  decksPageView,
  decksSearchInput,
  dictDialog,
  dictDialogBody,
  dictDialogTitle,
  dictSearchInput,
  gameSettingsDialog,
  gameSettingsDialogBody,
  homeBrandLogo,
  homeBrandSub,
  homeDashboardView,
  homeHeroTitleAccent,
  homeHeroTitleTop,
  homeLevelPills,
  homeStepItem1,
  homeStepItem2,
  homeStepItem3,
  hudLangPairText,
  hudLevelTitle,
  importTargetLangLabel,
  labelAcademySub,
  labelAnkiBack,
  labelAnkiDeckName,
  labelAnkiFront,
  labelArcadeLaunch,
  labelCatalogHud,
  labelCombo,
  labelCustomBtn,
  labelDecksAllHeading,
  labelDecksContinueHeading,
  labelDecksCreateBtn,
  labelDecksFiltersTitle,
  labelDecksImportAnkiBtn,
  labelDecksLangHeader,
  labelDecksLevelHeader,
  labelDecksOpenAdmin,
  labelDecksRecentTitle,
  labelDecksReturnBattle,
  labelDecksStatLearned,
  labelDecksStatStreak,
  labelDecksStatTotal,
  labelDesktopFilterAll,
  labelDesktopFilterFav,
  labelDesktopFilterRecent,
  labelDesktopTabCourses,
  labelDesktopTabUser,
  labelQuickFilterAll,
  labelQuickFilterCourses,
  labelQuickFilterFav,
  labelQuickFilterUser,
  labelDictPinnedFilter,
  labelFeatAnki,
  labelFeatCourses,
  labelFeatSettings,
  labelFeatVoice,
  labelHitBanner,
  labelHitKnow,
  labelHomeProgressTitle,
  labelHomeTopTitle,
  labelHowItWorks,
  labelImportFromCatalog,
  labelLearnedHud,
  labelLessonsDrawerSummary,
  labelMetricDecks,
  labelMetricLearned,
  labelMetricStreak,
  labelMobLives,
  labelMobNavDecks,
  labelMobNavHome,
  labelMobNavPlay,
  labelMobNavStats,
  labelMobNavAbout,
  labelMobStep1,
  labelMobStep2,
  labelMobStep3,
  labelModeListen,
  labelModeTranslate,
  labelModeType,
  labelNativeFilter,
  labelOverlayBackMenu,
  labelOverlayCatalog,
  labelNavAbout,
  labelNavAdmin,
  labelNavDecks,
  labelNavHome,
  labelNavLeaderboard,
  labelNavPlay,
  labelNavStats,
  labelOpenCatalogTitle,
  labelPause,
  labelPerkAnki,
  labelPerkMemory,
  labelPerkPlay,
  labelQuickAnkiBtn,
  labelQuickStartTitle,
  labelScore,
  labelSeeAllTop,
  labelShield,
  labelSidebarAnkiBtn,
  labelSidebarDecksHeader,
  labelSidebarGameSettings,
  labelSidebarWeaponsHeader,
  labelStep1,
  labelStep2,
  labelStep3,
  labelStudyModeHeader,
  labelTargetFilter,
  labelTitleCustom,
  labelTitleDict,
  labelTodayCaption,
  leaderboardDialog,
  leaderboardDialogBody,
  legendDas,
  legendDer,
  legendDie,
  legendVerb,
  levelQuizBox,
  mobileHeroArtArticle,
  mobileHeroArtWord,
  mobHudWaveText,
  navLangCode,
  navLangDropdownMenu,
  navLangDropdownWrap,
  navLangFlag,
  overlayCard,
  overlayWeaponTitle,
  promoLiveLabel,
  promoMonitorBadge,
  quizHeaderTitle,
  sidebarKillsTitle,
  statsDialog,
  statsDialogBody,
  tabImportAnki,
  tabImportManual,
  tabSourceAll,
  tabSourceOfficial,
  tabSourceUser,
  targetLangDropdownFlag,
  targetLangDropdownMenu,
  targetLangDropdownName,
  targetLangDropdownWrap,
  titleArsenalLabel,
  titleTagline,
  titleTaglineMobile,
  ttsDialogBody,
  ttsSettingsDialog
} from './dom.js';
import { resizeCanvas } from '../engine/arena-physics.js';
import { renderWeaponSelectors, updateHudWeaponBtn } from '../engine/weapon-vfx.js';
import {
  getLangFlagSvg,
  refreshHitSpotlightPinState,
  renderDesktopLevelPills,
  renderHomeDashboardWidgets,
  renderHomeQuickStartGrid,
  renderLevelSidebar,
  rerenderKillFeed,
  updateBottomTargetUI,
  updateHitSpotlightCard,
  updateLearnedProgressUI,
  updatePilotRankUI,
  updatePinnedCountUI,
  updateStudyModeButtonsUI
} from './hud-widgets.js';
import { launchFromTitleScreen, returnToTitleScreen, seedTitleDemoWords } from '../engine/promo-autopilot.js';
import {
  refreshOverlayContent,
  renderCurrentQuizQuestion,
  renderZtypeKeyboard,
  showLevelIntroOverlay
} from '../engine/gameplay.js';
import { openDecksPage, renderCourseBrowserModal, renderDecksPage } from './decks-page.js';
import {
  onTtsStatusChanged,
  openGameSettingsModal,
  openStatsModal,
  renderFullDictionary,
  renderGameSettingsModal,
  renderLeaderboardModal,
  renderStatsModal,
  renderTtsSettingsUI
} from './modals.js';
import { renderAdminStudio } from './admin-studio.js';
import { renderAboutPage } from './about-page.js';

let _resizeBound = false;

function closeAllHomeDropdowns() {
  if (navLangDropdownMenu) {
    navLangDropdownMenu.classList.add('hidden');
  }
  if (btnNavLangToggle) {
    btnNavLangToggle.setAttribute('aria-expanded', 'false');
  }
  if (targetLangDropdownMenu) {
    targetLangDropdownMenu.classList.add('hidden');
  }
  if (btnTargetLangDropdown) {
    btnTargetLangDropdown.setAttribute('aria-expanded', 'false');
  }
  const langCard = targetLangDropdownWrap && targetLangDropdownWrap.closest('.home-lang-card');
  if (langCard) {
    langCard.classList.remove('dropdown-open');
  }
}

function syncDropdownTriggerLabels() {
  if (navLangFlag) {
    navLangFlag.innerHTML = getLangFlagSvg(state.nativeLang);
  }
  if (navLangCode) {
    navLangCode.textContent = state.nativeLang.toUpperCase();
  }
  if (navLangDropdownMenu) {
    navLangDropdownMenu.querySelectorAll('.native-lang-btn').forEach(btn => {
      const code = btn.dataset.nativeLang;
      const labels = {
        ru: 'RU · Русский',
        en: 'EN · English',
        de: 'DE · Deutsch',
        es: 'ES · Español',
        uk: 'UK · Українська',
        tr: 'TR · Türkçe',
        he: 'HE · עברית',
        ar: 'AR · العربية'
      };
      btn.innerHTML = `${getLangFlagSvg(code)}<span>${escapeHtml(labels[code] || code.toUpperCase())}</span>`;
    });
  }

  const targetMeta = TARGET_LANG_META[state.targetLang] || TARGET_LANG_META.de;
  if (targetLangDropdownFlag) {
    targetLangDropdownFlag.innerHTML = getLangFlagSvg(state.targetLang);
  }
  if (targetLangDropdownName) {
    targetLangDropdownName.textContent = targetMeta.names[state.nativeLang] || targetMeta.names.en;
  }
  if (targetLangDropdownMenu) {
    targetLangDropdownMenu.querySelectorAll('.target-lang-pill').forEach(btn => {
      const code = btn.dataset.targetLang;
      const flagEl = btn.querySelector('.home-lang-flag');
      if (flagEl) {
        flagEl.innerHTML = getLangFlagSvg(code);
      }
    });
  }
  if (decksCompactLangPills) {
    decksCompactLangPills.querySelectorAll('.target-lang-pill').forEach(btn => {
      const code = btn.dataset.targetLang;
      const flagEl = btn.querySelector('.decks-lang-flag');
      if (flagEl) {
        flagEl.innerHTML = getLangFlagSvg(code);
      }
    });
  }
}

export function setNativeLanguage(langId) {
  if (!UI_TEXT[langId]) return;
  const prevNative = state.nativeLang;
  state.nativeLang = langId;
  let swappedTarget = false;

  if (state.targetLang === langId) {
    const fallbackTarget = (prevNative && prevNative !== langId && TARGET_LANG_META[prevNative])
      ? prevNative
      : (langId === 'de' ? 'en' : 'de');
    state.targetLang = fallbackTarget;
    swappedTarget = true;
    saveSettingsPatch({ nativeLang: langId, targetLang: fallbackTarget });
    document.querySelectorAll('.target-lang-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.targetLang === fallbackTarget);
    });
    const tMeta = TARGET_LANG_META[fallbackTarget];
    if (btnTargetLangHud && tMeta) {
      btnTargetLangHud.textContent = `${tMeta.flag} ${tMeta.code}`;
    }
    ensureValidCourseSelection();
    renderZtypeKeyboard();
    state.homeLevelFilter = 'all';
    state.demoWords = [];
    state.demoTargetId = null;
    state.killHistory = [];
  } else {
    saveSettingsPatch({ nativeLang: langId });
  }
  document.documentElement.lang = langId;

  const modeObj = state.nativeLangModes.find(m => m.id === langId) || state.nativeLangModes[0];
  if (btnLangMode) btnLangMode.textContent = modeObj.short;

  document.querySelectorAll('.native-lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.nativeLang === langId);
  });

  closeAllHomeDropdowns();
  applyStaticUILocalization();
  renderWeaponSelectors();
  updateHudWeaponBtn();
  renderLevelSidebar();
  refreshOverlayContent();
  renderTtsSettingsUI();
  updatePilotRankUI();
  updateLearnedProgressUI();
  updatePinnedCountUI();

  if (swappedTarget) {
    const sel = getActiveSelection();
    if (sel.course && sel.mod && sel.lesson) {
      const lWords = resolveLessonBaseWords(sel.course, sel.mod, sel.lesson, state.activeLessonIndex);
      if (lWords.length > 0) updateHitSpotlightCard(lWords[0], false);
    }
    if (state.screenMode === 'title') {
      requestAnimationFrame(() => seedTitleDemoWords());
    }
  } else if (state.lastSpotlightEntry) {
    updateHitSpotlightCard(state.lastSpotlightEntry, false);
  }
  if (courseBrowserDialog && courseBrowserDialog.open) {
    renderCourseBrowserModal();
  }
  if (gameSettingsDialog && gameSettingsDialog.open) {
    renderGameSettingsModal();
  }
  if (statsDialog && statsDialog.open) {
    renderStatsModal();
  }
  if (leaderboardDialog && leaderboardDialog.open) {
    renderLeaderboardModal();
  }
  if (state.activeQuiz && levelQuizBox.style.display !== 'none') {
    renderCurrentQuizQuestion(false);
  }
  if (dictDialog && dictDialog.open) {
    renderFullDictionary(dictSearchInput.value);
  }
  rerenderKillFeed();
  updateBottomTargetUI();
}

export function setTargetLanguage(targetLangId) {
  if (!TARGET_LANG_META[targetLangId]) return;
  const prevTarget = state.targetLang;
  const changed = prevTarget !== targetLangId;
  state.targetLang = targetLangId;

  if (state.nativeLang === targetLangId) {
    const fallbackNative = (prevTarget && prevTarget !== targetLangId && UI_TEXT[prevTarget])
      ? prevTarget
      : (targetLangId === 'ru' ? 'en' : 'ru');
    state.nativeLang = fallbackNative;
    saveSettingsPatch({ targetLang: targetLangId, nativeLang: fallbackNative });
    document.documentElement.lang = fallbackNative;
    const modeObj = state.nativeLangModes.find(m => m.id === fallbackNative) || state.nativeLangModes[0];
    if (btnLangMode && modeObj) btnLangMode.textContent = modeObj.short;
    document.querySelectorAll('.native-lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.nativeLang === fallbackNative);
    });
  } else {
    saveSettingsPatch({ targetLang: targetLangId });
  }

  document.querySelectorAll('.target-lang-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.targetLang === targetLangId);
  });

  const meta = TARGET_LANG_META[targetLangId];
  if (btnTargetLangHud) {
    btnTargetLangHud.textContent = `${meta.flag} ${meta.code}`;
  }

  ensureValidCourseSelection();
  renderZtypeKeyboard();

  if (changed) {
    state.homeLevelFilter = 'all';
    state.demoWords = [];
    state.demoTargetId = null;
    state.killHistory = [];
    const sel = getActiveSelection();
    if (sel.course && sel.mod && sel.lesson) {
      const lWords = resolveLessonBaseWords(sel.course, sel.mod, sel.lesson, state.activeLessonIndex);
      if (lWords.length > 0) {
        updateHitSpotlightCard(lWords[0], false);
      }
    }
  }

  closeAllHomeDropdowns();
  applyStaticUILocalization();
  renderWeaponSelectors();
  updateHudWeaponBtn();
  renderLevelSidebar();
  refreshOverlayContent();
  renderTtsSettingsUI();
  updatePilotRankUI();
  updateLearnedProgressUI();
  updatePinnedCountUI();
  rerenderKillFeed();
  updateBottomTargetUI();

  if (changed && state.screenMode === 'title') {
    requestAnimationFrame(() => seedTitleDemoWords());
  }

  if (courseBrowserDialog && courseBrowserDialog.open) {
    renderCourseBrowserModal();
  }
}

export function applyStaticUILocalization() {
  const tr = t();
  const isRtl = isRtlUI();
  const targetMeta = TARGET_LANG_META[state.targetLang] || TARGET_LANG_META.de;
  const targetLangLocalName = targetMeta.names[state.nativeLang] || targetMeta.names.en;
  const nativeLangLocalName = (tr.nativeLangNames && tr.nativeLangNames[state.nativeLang]) || state.nativeLang.toUpperCase();

  if (arcadeTitleScreen) arcadeTitleScreen.dir = isRtl ? 'rtl' : 'ltr';
  if (decksPageView) decksPageView.dir = isRtl ? 'rtl' : 'ltr';
  if (adminStudioView) adminStudioView.dir = isRtl ? 'rtl' : 'ltr';
  if (aboutPageView) aboutPageView.dir = isRtl ? 'rtl' : 'ltr';
  if (overlayCard) overlayCard.dir = isRtl ? 'rtl' : 'ltr';
  if (ttsDialogBody) ttsDialogBody.dir = isRtl ? 'rtl' : 'ltr';
  if (catalogDialogBody) catalogDialogBody.dir = isRtl ? 'rtl' : 'ltr';
  if (customDialogBody) customDialogBody.dir = isRtl ? 'rtl' : 'ltr';
  if (dictDialogBody) dictDialogBody.dir = isRtl ? 'rtl' : 'ltr';
  if (gameSettingsDialogBody) gameSettingsDialogBody.dir = isRtl ? 'rtl' : 'ltr';
  if (statsDialogBody) statsDialogBody.dir = isRtl ? 'rtl' : 'ltr';
  if (leaderboardDialogBody) leaderboardDialogBody.dir = isRtl ? 'rtl' : 'ltr';

  if (labelNativeFilter) labelNativeFilter.textContent = tr.nativeFilterLabel;
  if (labelTargetFilter) labelTargetFilter.textContent = tr.chooseLangTitle;

  document.querySelectorAll('[data-tlang-name]').forEach(span => {
    const code = span.getAttribute('data-tlang-name');
    if (TARGET_LANG_META[code]) {
      span.textContent = TARGET_LANG_META[code].names[state.nativeLang] || TARGET_LANG_META[code].names.en;
    }
  });

  // Z-LINGO / VOCANOVA: Навбар Главной страницы
  if (arcadeLogoMain) arcadeLogoMain.textContent = 'VOCANOVA';
  if (homeBrandSub) homeBrandSub.textContent = tr.homeBrandSub;
  if (labelNavHome) labelNavHome.textContent = tr.navHome;
  if (labelNavPlay) labelNavPlay.textContent = tr.navPlay;
  if (labelNavDecks) labelNavDecks.textContent = tr.navDecks;
  if (labelNavStats) labelNavStats.textContent = tr.navStats;
  if (labelNavLeaderboard) labelNavLeaderboard.textContent = tr.navLeaderboard;
  if (labelNavAbout && tr.navAbout) labelNavAbout.textContent = tr.navAbout;
  if (labelNavAdmin) labelNavAdmin.textContent = tr.navAdmin;
  if (btnAdminLockMode && tr.adminLockBtn) btnAdminLockMode.textContent = tr.adminLockBtn;

  // Hero-блок и рамка живого промо-боя
  const { course, mod, lesson } = getActiveSelection();
  if (homeHeroTitleTop) homeHeroTitleTop.textContent = tr.heroTitleTop;
  if (homeHeroTitleAccent) homeHeroTitleAccent.textContent = tr.heroTitleAccent;
  if (titleTagline) titleTagline.textContent = tr.titleTagline(targetLangLocalName);
  if (titleTaglineMobile) titleTaglineMobile.textContent = tr.mobileHeroTagline || tr.titleTagline(targetLangLocalName);
  if (labelPerkPlay) labelPerkPlay.textContent = tr.perkPlay;
  if (labelPerkMemory) labelPerkMemory.textContent = tr.perkMemory;
  if (labelPerkAnki) labelPerkAnki.textContent = tr.perkAnki;
  if (labelArcadeLaunch) labelArcadeLaunch.textContent = tr.launchFreeBtn;

  const heroArtSamples = {
    de: { art: 'der', word: 'Start' },
    en: { art: 'Noun', word: 'Opportunity' },
    es: { art: 'la', word: 'Oportunidad' },
    ru: { art: 'Сущ.', word: 'Возможность' },
    uk: { art: 'Імен.', word: 'Можливість' },
    tr: { art: 'İsim', word: 'Başlangıç' },
    he: { art: 'ש״ע', word: 'התחלה' },
    ar: { art: 'اسم', word: 'البداية' }
  };
  const hSample = heroArtSamples[state.targetLang] || heroArtSamples.de;
  if (mobileHeroArtArticle) mobileHeroArtArticle.textContent = hSample.art;
  if (mobileHeroArtWord) mobileHeroArtWord.textContent = hSample.word;

  if (arcadeLogoSub && course) {
    const lNum = state.activeLessonIndex + 1;
    const cTitle = getLocalizedField(course, 'titles');
    arcadeLogoSub.innerHTML = `<span class="course-pill-name">${escapeHtml(course.icon || '🚀')} ${escapeHtml(cTitle)}</span><span class="course-pill-lnum"> · #${lNum}</span> <span class="course-pill-caret">▾</span>`;
  }
  if (promoLiveLabel && tr.livePreviewBadge) {
    promoLiveLabel.textContent = tr.livePreviewBadge;
  }
  if (promoMonitorBadge && course) {
    promoMonitorBadge.textContent = tr.promoMonitorBadge(
      state.activeLessonIndex + 1,
      getLocalizedField(course, 'titles').toUpperCase()
    );
  }

  // Полоса 3 шагов и мобильная навигация
  if (labelHowItWorks && tr.howItWorksTitle) labelHowItWorks.textContent = tr.howItWorksTitle;
  if (labelStep1) labelStep1.textContent = tr.step1;
  if (labelStep2) labelStep2.textContent = tr.step2;
  if (labelStep3) labelStep3.textContent = tr.step3;
  if (labelMobStep1 && tr.mobStep1) labelMobStep1.textContent = tr.mobStep1;
  if (labelMobStep2 && tr.mobStep2) labelMobStep2.textContent = tr.mobStep2;
  if (labelMobStep3 && tr.mobStep3) labelMobStep3.textContent = tr.mobStep3;

  if (labelMobNavHome && tr.mobNavHome) labelMobNavHome.textContent = tr.mobNavHome;
  if (labelMobNavPlay && tr.mobNavPlay) labelMobNavPlay.textContent = tr.mobNavPlay;
  if (labelMobNavDecks && tr.mobNavDecks) labelMobNavDecks.textContent = tr.mobNavDecks;
  if (labelMobNavStats && tr.mobNavStats) labelMobNavStats.textContent = tr.mobNavStats;
  if (labelMobNavAbout && tr.mobNavAbout) labelMobNavAbout.textContent = tr.mobNavAbout;

  if (labelQuickStartTitle) labelQuickStartTitle.textContent = tr.popularCoursesTitle || tr.quickStartTitle;
  if (labelQuickAnkiBtn) labelQuickAnkiBtn.textContent = tr.quickAnkiBtn;
  if (labelOpenCatalogTitle) labelOpenCatalogTitle.textContent = tr.allCoursesBtn;
  if (titleArsenalLabel) titleArsenalLabel.textContent = tr.titleArsenalLabel;

  if (labelHomeProgressTitle) labelHomeProgressTitle.textContent = tr.myProgressTitle || tr.homeProgressTitle;
  if (labelMetricLearned) labelMetricLearned.textContent = tr.metricCourseLearned || tr.metricLearned;
  if (labelMetricDecks) labelMetricDecks.textContent = tr.metricCourseTotal || tr.metricDecks;
  if (labelMetricStreak) labelMetricStreak.textContent = tr.metricDailyGoal || tr.metricStreak;
  if (labelHomeTopTitle) labelHomeTopTitle.textContent = tr.homeTopTitle;
  if (labelSeeAllTop) labelSeeAllTop.textContent = tr.seeAllTop;
  syncDropdownTriggerLabels();

  const courseWords = course ? getAllWordsInCourse(course) : [];
  const preset = state.speedPresets[state.speedPresetIndex] || state.speedPresets[0];

  // Нижняя полоса возможностей (сохраняем дочерние иконки .feat-icon!)
  if (labelFeatCourses) labelFeatCourses.textContent = tr.featCourses;
  if (labelFeatAnki) labelFeatAnki.textContent = tr.featAnki;
  if (labelFeatSettings) labelFeatSettings.textContent = tr.featSpeed(preset.label);
  if (labelFeatVoice) labelFeatVoice.textContent = tr.featVoice;
  if (labelTitleDict) labelTitleDict.textContent = tr.titleDictLink(courseWords.length);
  if (labelTitleCustom) labelTitleCustom.textContent = tr.titleCustomLink;

  // Боевой экран Академии Z-LINGO
  if (labelAcademySub) labelAcademySub.textContent = tr.academySub;
  const nativeModeObj = state.nativeLangModes.find(m => m.id === state.nativeLang);
  const nativeFlag = (nativeModeObj && nativeModeObj.short.split(' ')[0]) || '';
  if (hudLangPairText) {
    hudLangPairText.textContent = `${nativeFlag} ${nativeLangLocalName} → ${targetMeta.flag} ${targetLangLocalName}`;
  }
  if (labelCatalogHud) labelCatalogHud.textContent = tr.coursesHudBtn;
  if (btnSidebarCatalog) btnSidebarCatalog.textContent = `${tr.seeAllTop} ▾`;
  if (labelOverlayCatalog) labelOverlayCatalog.textContent = tr.allCoursesBtn;
  if (overlayWeaponTitle) {
    overlayWeaponTitle.textContent = state.overlayMode === 'complete'
      ? (tr.ovArsenalShortLabel || tr.overlayWeaponTitle)
      : tr.overlayWeaponTitle;
  }
  if (labelOverlayBackMenu) labelOverlayBackMenu.textContent = tr.ovMenuShortLabel || tr.backToMenuBtn;

  if (labelSidebarDecksHeader) labelSidebarDecksHeader.textContent = tr.sidebarDecksHeader;
  if (labelLessonsDrawerSummary) labelLessonsDrawerSummary.textContent = tr.lessonsDrawerSummary;
  if (labelSidebarAnkiBtn) labelSidebarAnkiBtn.textContent = tr.quickAnkiBtn;
  if (labelStudyModeHeader) labelStudyModeHeader.textContent = tr.studyModeHeader;
  if (labelModeType) labelModeType.textContent = tr.modeType;
  if (labelModeListen) labelModeListen.textContent = tr.modeListen;
  if (labelModeTranslate) labelModeTranslate.textContent = tr.modeTranslate;
  if (labelSidebarWeaponsHeader) labelSidebarWeaponsHeader.textContent = tr.sidebarWeaponsHeader;
  if (labelSidebarGameSettings) labelSidebarGameSettings.textContent = tr.sidebarGameSettings;

  if (labelHitBanner) {
    labelHitBanner.textContent = state.lastSpotlightIsHit ? tr.hitBanner : tr.hitReadyBanner;
  }
  if (labelHitKnow) labelHitKnow.textContent = tr.hitKnowBtn;
  if (labelTodayCaption) labelTodayCaption.textContent = tr.todayCaption;

  if (labelPause) labelPause.textContent = tr.pause;
  if (labelScore) labelScore.textContent = tr.score;
  if (labelCombo) labelCombo.textContent = tr.combo;
  if (labelLearnedHud) labelLearnedHud.textContent = tr.learnedHud;
  if (labelShield) labelShield.textContent = tr.shield;

  if (btnArticleMode) {
    btnArticleMode.textContent = state.typeWithArticle ? tr.articleMode : tr.badgeMode;
    btnArticleMode.classList.toggle('active', state.typeWithArticle);
  }
  if (labelCustomBtn) labelCustomBtn.textContent = tr.customBtn;
  if (sidebarKillsTitle) sidebarKillsTitle.textContent = tr.sidebarKills;

  const leg = tr.legends[state.targetLang] || tr.legends.de;
  if (legendDer) legendDer.textContent = leg[0];
  if (legendDie) legendDie.textContent = leg[1];
  if (legendDas) legendDas.textContent = leg[2];
  if (legendVerb) legendVerb.textContent = leg[3];

  if (quizHeaderTitle) quizHeaderTitle.textContent = tr.ovQuickBlitzTitle || tr.quizHeader;
  if (dictDialogTitle && course) {
    dictDialogTitle.textContent = tr.dictTitle(getLocalizedField(course, 'titles'), courseWords.length);
  }
  if (dictSearchInput) dictSearchInput.placeholder = tr.dictSearchPlaceholder;
  if (labelDictPinnedFilter) labelDictPinnedFilter.textContent = tr.dictPinnedFilter;

  // Каталог и окно Anki
  if (catalogDialogTitle) catalogDialogTitle.textContent = tr.catalogTitle;
  if (tabSourceAll) tabSourceAll.textContent = tr.tabAll;
  if (tabSourceOfficial) tabSourceOfficial.textContent = tr.tabOfficial;
  if (tabSourceUser) tabSourceUser.textContent = tr.tabUser;
  if (labelImportFromCatalog) labelImportFromCatalog.textContent = tr.importAnkiBtn;

  if (customDialogTitle) customDialogTitle.textContent = tr.customTitle;
  if (tabImportAnki) tabImportAnki.textContent = tr.tabImportAnki;
  if (tabImportManual) tabImportManual.textContent = tr.tabImportManual;
  if (importTargetLangLabel) importTargetLangLabel.textContent = tr.importLangLabel;
  if (ankiDropTitle) ankiDropTitle.textContent = tr.ankiDropTitle;
  if (ankiDropSub) ankiDropSub.textContent = tr.ankiDropSub;
  if (btnDownloadSampleApkg) btnDownloadSampleApkg.textContent = tr.sampleApkgBtn;
  if (labelAnkiDeckName) labelAnkiDeckName.textContent = tr.ankiDeckNameLabel;
  if (ankiManualColsSummary) ankiManualColsSummary.textContent = tr.ankiManualColsSummary;
  if (labelAnkiFront) labelAnkiFront.textContent = tr.ankiFrontLabel;
  if (labelAnkiBack) labelAnkiBack.textContent = tr.ankiBackLabel;
  if (btnSaveAnkiToDecks) btnSaveAnkiToDecks.textContent = tr.ankiSaveToDecksBtn;
  if (customDialogHint) customDialogHint.innerHTML = tr.customHint;
  if (btnSaveCustomWords) btnSaveCustomWords.textContent = tr.customSaveBtn;

  // Полноэкранная страница «Мои колоды» / «Курсы»
  if (labelDecksFiltersTitle) labelDecksFiltersTitle.textContent = tr.decksQuickFiltersTitle || tr.decksFiltersTitle;
  if (labelDecksLangHeader) labelDecksLangHeader.textContent = tr.decksLangHeader;
  if (labelDecksLevelHeader) labelDecksLevelHeader.textContent = tr.decksLevelHeader;
  if (btnDecksLevelAll) btnDecksLevelAll.textContent = tr.decksLevelAll;
  if (labelDecksOpenAdmin) labelDecksOpenAdmin.textContent = tr.decksAdminBtn;
  if (labelDesktopTabCourses && tr.decksTabCourses) labelDesktopTabCourses.textContent = tr.decksTabCourses;
  if (labelDesktopTabUser && tr.decksTabUser) labelDesktopTabUser.textContent = tr.decksTabUser;
  if (labelDesktopFilterAll && tr.decksPillAll) labelDesktopFilterAll.textContent = tr.decksPillAll;
  if (labelDesktopFilterRecent && tr.decksPillRecent) labelDesktopFilterRecent.textContent = tr.decksPillRecent;
  if (labelDesktopFilterFav && tr.decksPillFav) labelDesktopFilterFav.textContent = tr.decksPillFav;
  if (labelQuickFilterAll && tr.decksQuickAll) labelQuickFilterAll.textContent = tr.decksQuickAll;
  if (labelQuickFilterCourses && tr.decksTabCourses) labelQuickFilterCourses.textContent = tr.decksTabCourses;
  if (labelQuickFilterUser && tr.decksTabUser) labelQuickFilterUser.textContent = tr.decksTabUser;
  if (labelQuickFilterFav && tr.decksPillFav) labelQuickFilterFav.textContent = tr.decksPillFav;
  if (labelDecksRecentTitle && tr.decksRecentActivityTitle) labelDecksRecentTitle.textContent = tr.decksRecentActivityTitle;
  if (decksHeroTitle) {
    decksHeroTitle.textContent = tr.decksHeroTitleMy;
  }
  if (decksHeroSubtitle) decksHeroSubtitle.textContent = tr.decksHeroSub;
  if (decksHeroSubtitleMobile && tr.decksHeroSubMobile) {
    decksHeroSubtitleMobile.textContent = tr.decksHeroSubMobile;
  }
  if (decksSearchInput) {
    decksSearchInput.placeholder = (window.innerWidth <= 768 && tr.decksSearchPlaceholderMobile)
      ? tr.decksSearchPlaceholderMobile
      : tr.decksSearchPlaceholder;
  }
  if (labelDecksImportAnkiBtn) labelDecksImportAnkiBtn.textContent = tr.decksImportAnkiBtn;
  if (labelDecksCreateBtn) labelDecksCreateBtn.textContent = tr.decksCreateBtn;
  if (labelDecksStatTotal) labelDecksStatTotal.textContent = tr.decksStatTotal;
  if (labelDecksStatLearned) labelDecksStatLearned.textContent = tr.decksStatLearned;
  if (labelDecksStatStreak) labelDecksStatStreak.textContent = tr.decksStatStreak;
  if (labelDecksReturnBattle) labelDecksReturnBattle.textContent = tr.decksReturnBattle;
  if (labelDecksContinueHeading) labelDecksContinueHeading.textContent = tr.decksContinueHeading;
  if (labelDecksAllHeading) labelDecksAllHeading.textContent = tr.decksAllHeading;

  if (btnSpeedMode) btnSpeedMode.textContent = preset.label;
  if (btnTargetLangHud) btnTargetLangHud.textContent = `${targetMeta.flag} ${targetMeta.code}`;

  if (course && hudLevelTitle) {
    hudLevelTitle.textContent = state.activeCustomRoundTitle
      ? state.activeCustomRoundTitle
      : `${course.icon || '🚀'} ${getLocalizedField(course, 'titles')}`;
  }
  if (arenaWavePill || mobHudWaveText) {
    const waveNum = Math.max(1, Math.ceil((state.wordsDestroyedInLevel + 1) / 4));
    const wText = tr.arenaWaveLabel(state.activeLessonIndex + 1, waveNum);
    if (arenaWavePill) arenaWavePill.textContent = wText;
    if (mobHudWaveText) mobHudWaveText.textContent = wText;
  }
  if (labelMobLives && tr.mobLivesLabel) {
    labelMobLives.textContent = tr.mobLivesLabel;
  }

  updatePilotRankUI();
  updateLearnedProgressUI();
  updatePinnedCountUI();
  updateStudyModeButtonsUI();
  renderHomeDashboardWidgets();
  if (state.homeSubView === 'decks') {
    renderDecksPage();
  } else if (state.homeSubView === 'admin') {
    renderAdminStudio();
  } else if (state.homeSubView === 'about') {
    renderAboutPage();
  }
  refreshHitSpotlightPinState();
  onTtsStatusChanged();
}

export function syncMobileBottomNavUI(overrideTab = '') {
  let activeTab = overrideTab;
  if (!activeTab) {
    if ((statsDialog && statsDialog.open) || (leaderboardDialog && leaderboardDialog.open)) {
      activeTab = 'stats';
    } else if (state.homeSubView === 'decks') {
      activeTab = 'decks';
    } else if (state.homeSubView === 'about') {
      activeTab = 'about';
    } else if (state.homeSubView === 'admin') {
      activeTab = 'profile';
    } else {
      activeTab = 'home';
    }
  }
  if (btnMobNavHome) btnMobNavHome.classList.toggle('active', activeTab === 'home');
  if (btnMobNavPlay) btnMobNavPlay.classList.toggle('active', activeTab === 'play');
  if (btnMobNavDecks) btnMobNavDecks.classList.toggle('active', activeTab === 'decks');
  if (btnMobNavStats) btnMobNavStats.classList.toggle('active', activeTab === 'stats');
  if (btnMobNavAbout) btnMobNavAbout.classList.toggle('active', activeTab === 'about');
}

export function switchHomeSubView(subView) {
  state.homeSubView = (subView === 'decks' || subView === 'admin' || subView === 'about') ? subView : 'home';
  const onHome = state.homeSubView === 'home';
  const onDecks = state.homeSubView === 'decks';
  const onAdmin = state.homeSubView === 'admin';
  const onAbout = state.homeSubView === 'about';

  if (homeDashboardView) homeDashboardView.classList.toggle('hidden', !onHome);
  if (decksPageView) decksPageView.classList.toggle('hidden', !onDecks);
  if (adminStudioView) adminStudioView.classList.toggle('hidden', !onAdmin);
  if (aboutPageView) aboutPageView.classList.toggle('hidden', !onAbout);

  if (btnNavHome) btnNavHome.classList.toggle('active', onHome);
  if (btnNavDecks) btnNavDecks.classList.toggle('active', onDecks);
  if (btnNavAdmin) btnNavAdmin.classList.toggle('active', onAdmin);
  if (btnNavAbout) btnNavAbout.classList.toggle('active', onAbout);
  syncMobileBottomNavUI();

  if (btnDecksReturnBattle) {
    btnDecksReturnBattle.classList.toggle('hidden', !state.decksOpenedFromPlay);
  }

  if (arcadeTitleScreen) {
    arcadeTitleScreen.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (onDecks) {
    state.demoWords = [];
    state.demoTargetId = null;
    renderDecksPage();
  } else if (onAdmin) {
    state.demoWords = [];
    state.demoTargetId = null;
    renderAdminStudio();
  } else if (onAbout) {
    state.demoWords = [];
    state.demoTargetId = null;
    renderAboutPage();
  } else if (state.screenMode === 'title') {
    resizeCanvas();
    requestAnimationFrame(() => {
      resizeCanvas();
      seedTitleDemoWords();
    });
  }
}

export function resumePlayIfAllDialogsClosed() {
  const anyOpen = (
    (courseBrowserDialog && courseBrowserDialog.open) ||
    (customWordsDialog && customWordsDialog.open) ||
    (ttsSettingsDialog && ttsSettingsDialog.open) ||
    (dictDialog && dictDialog.open) ||
    (gameSettingsDialog && gameSettingsDialog.open) ||
    (statsDialog && statsDialog.open) ||
    (leaderboardDialog && leaderboardDialog.open)
  );
  syncMobileBottomNavUI();
  if (!anyOpen && state.screenMode === 'play' && state.running && centerOverlay.classList.contains('hidden')) {
    state.paused = false;
  }
}

export function closeAllTopDialogs() {
  [
    courseBrowserDialog,
    customWordsDialog,
    ttsSettingsDialog,
    dictDialog,
    gameSettingsDialog,
    statsDialog,
    leaderboardDialog
  ].forEach(dlg => {
    if (dlg && dlg.open) dlg.close();
  });
}

export function bindInteractiveStep(el, handler) {
  if (!el) return;
  el.addEventListener('click', () => {
    sound.init();
    handler();
  });
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      sound.init();
      handler();
    }
  });
}

export function bindNavigationEvents() {
  if (!_resizeBound) {
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!target || !target.closest) return;
      if (!target.closest('#navLangDropdownWrap') && !target.closest('#targetLangDropdownWrap')) {
        closeAllHomeDropdowns();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllHomeDropdowns();
    });
    _resizeBound = true;
  }

  if (btnNavLangToggle && navLangDropdownMenu) {
    btnNavLangToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = navLangDropdownMenu.classList.contains('hidden');
      closeAllHomeDropdowns();
      if (willOpen) {
        navLangDropdownMenu.classList.remove('hidden');
        btnNavLangToggle.setAttribute('aria-expanded', 'true');
      }
    });
  }

  if (btnTargetLangDropdown && targetLangDropdownMenu) {
    btnTargetLangDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = targetLangDropdownMenu.classList.contains('hidden');
      closeAllHomeDropdowns();
      if (willOpen) {
        targetLangDropdownMenu.classList.remove('hidden');
        btnTargetLangDropdown.setAttribute('aria-expanded', 'true');
        const langCard = targetLangDropdownWrap && targetLangDropdownWrap.closest('.home-lang-card');
        if (langCard) langCard.classList.add('dropdown-open');
      }
    });
  }

  if (homeLevelPills) {
    homeLevelPills.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest && e.target.closest('[data-home-level]');
      if (!btn) return;
      const lvl = btn.dataset.homeLevel;
      state.homeLevelFilter = state.homeLevelFilter === lvl ? 'all' : lvl;
      renderDesktopLevelPills();
      renderHomeQuickStartGrid();
      btn.blur();
    });
  }

  if (btnMissionLaunch) {
    btnMissionLaunch.addEventListener('click', () => {
      launchFromTitleScreen();
      btnMissionLaunch.blur();
    });
  }

  if (btnMissionDailyGoal) {
    btnMissionDailyGoal.addEventListener('click', () => {
      sound.init();
      openStatsModal();
      btnMissionDailyGoal.blur();
    });
  }
  btnLangMode.addEventListener('click', () => {
    const idx = state.nativeLangModes.findIndex(m => m.id === state.nativeLang);
    const nextMode = state.nativeLangModes[(idx + 1) % state.nativeLangModes.length];
    setNativeLanguage(nextMode.id);
    btnLangMode.blur();
  });

  document.querySelectorAll('.native-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setNativeLanguage(btn.dataset.nativeLang);
      btn.blur();
    });
  });

  // Переключение Фильтра 1 (Я учу)
  document.querySelectorAll('.target-lang-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      setTargetLanguage(btn.dataset.targetLang);
      btn.blur();
    });
  });

  if (btnTargetLangHud) {
    btnTargetLangHud.addEventListener('click', () => {
      const order = ALL_LANG_CODES;
      const next = order[(order.indexOf(state.targetLang) + 1) % order.length];
      setTargetLanguage(next);
      if (state.screenMode === 'play') {
        showLevelIntroOverlay();
      }
      btnTargetLangHud.blur();
    });
  }

  [homeBrandLogo, btnNavHome].forEach(el => {
    if (!el) return;
    el.addEventListener('click', () => {
      if (state.decksOpenedFromPlay) {
        returnToTitleScreen();
      } else if (state.homeSubView !== 'home') {
        switchHomeSubView('home');
      } else if (arcadeTitleScreen) {
        arcadeTitleScreen.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (el.blur) el.blur();
    });
  });

  if (btnNavPlay) {
    btnNavPlay.addEventListener('click', () => {
      launchFromTitleScreen();
      btnNavPlay.blur();
    });
  }

  if (btnNavAbout) {
    btnNavAbout.addEventListener('click', () => {
      sound.init();
      closeAllTopDialogs();
      switchHomeSubView('about');
      btnNavAbout.blur();
    });
  }

  if (btnHudLangPair) {
    btnHudLangPair.addEventListener('click', (e) => {
      sound.init();
      if (e.shiftKey) {
        const order = ALL_LANG_CODES;
        const nextT = order[(order.indexOf(state.targetLang) + 1) % order.length];
        setTargetLanguage(nextT);
        showLevelIntroOverlay();
      } else {
        const idx = state.nativeLangModes.findIndex(m => m.id === state.nativeLang);
        const nextMode = state.nativeLangModes[(idx + 1) % state.nativeLangModes.length];
        setNativeLanguage(nextMode.id);
      }
      btnHudLangPair.blur();
    });
  }

  if (btnMobNavHome) {
    btnMobNavHome.addEventListener('click', () => {
      sound.init();
      closeAllTopDialogs();
      if (state.decksOpenedFromPlay) {
        returnToTitleScreen();
      } else if (state.homeSubView !== 'home') {
        switchHomeSubView('home');
      } else if (arcadeTitleScreen) {
        arcadeTitleScreen.scrollTo({ top: 0, behavior: 'smooth' });
      }
      syncMobileBottomNavUI('home');
      btnMobNavHome.blur();
    });
  }

  if (btnMobNavPlay) {
    btnMobNavPlay.addEventListener('click', () => {
      sound.init();
      closeAllTopDialogs();
      launchFromTitleScreen();
      btnMobNavPlay.blur();
    });
  }

  if (btnMobNavDecks) {
    btnMobNavDecks.addEventListener('click', () => {
      sound.init();
      closeAllTopDialogs();
      openDecksPage({ sourceFilter: 'all', onlyFavorites: false });
      syncMobileBottomNavUI('decks');
      btnMobNavDecks.blur();
    });
  }

  if (btnMobNavStats) {
    btnMobNavStats.addEventListener('click', () => {
      sound.init();
      if (gameSettingsDialog && gameSettingsDialog.open) gameSettingsDialog.close();
      openStatsModal();
      btnMobNavStats.blur();
    });
  }

  if (btnMobNavAbout) {
    btnMobNavAbout.addEventListener('click', () => {
      sound.init();
      closeAllTopDialogs();
      switchHomeSubView('about');
      syncMobileBottomNavUI('about');
      btnMobNavAbout.blur();
    });
  }

  bindInteractiveStep(homeStepItem1, () => openDecksPage({ sourceFilter: 'all' }));
  bindInteractiveStep(homeStepItem2, () => launchFromTitleScreen());
  bindInteractiveStep(homeStepItem3, () => openGameSettingsModal());


  [
    courseBrowserDialog,
    customWordsDialog,
    ttsSettingsDialog,
    dictDialog,
    gameSettingsDialog,
    statsDialog,
    leaderboardDialog
  ].forEach(dlg => {
    if (!dlg) return;
    dlg.addEventListener('close', resumePlayIfAllDialogsClosed);
  });
}
