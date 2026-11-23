// ============================================================================
// Z-LINGO · Composition Root (Точка входа приложения — SOLID / DIP)
// Связывает шину событий EventBus, доменные сервисы, игровой движок и UI-контроллеры.
// ============================================================================

import { bus, registerActions } from './core/events.js';
import { AnkiImporter } from './anki/index.js';
import { state } from './state/store.js';
import {
  ensureValidCourseSelection,
  getActiveSelection,
  resolveLessonBaseWords
} from './domain/catalog-service.js';
import {
  centerOverlay,
  dictDialog,
  dictSearchInput
} from './ui/dom.js';
import { resizeCanvas, measureWordCapsule } from './engine/arena-physics.js';
import { renderWeaponSelectors } from './engine/weapon-vfx.js';
import {
  launchFromTitleScreen,
  returnToTitleScreen,
  seedTitleDemoWords
} from './engine/promo-autopilot.js';
import {
  renderZtypeKeyboard,
  selectCourseLesson,
  refreshOverlayContent,
  showLevelIntroOverlay,
  startLevelNow,
  spawnNextWord,
  gameLoop,
  bindGameplayEvents
} from './engine/gameplay.js';
import {
  updatePilotRankUI,
  updateTodayLearnedUI,
  renderHomeDashboardWidgets,
  refreshHitSpotlightPinState,
  updateHitSpotlightCard,
  updateLearnedProgressUI,
  updatePinnedCountUI,
  rerenderKillFeed
} from './ui/hud-widgets.js';
import {
  openDecksPage,
  resumeBattleFromDecksPage,
  renderDecksPage,
  openCourseCatalogModal,
  bindDecksPageEvents
} from './ui/decks-page.js';
import {
  onTtsStatusChanged,
  openCustomWordsModal,
  openTtsStudioDialog,
  renderFullDictionary,
  openDictionaryModal,
  renderGameSettingsModal,
  openGameSettingsModal,
  openStatsModal,
  openLeaderboardModal,
  bindModalEvents
} from './ui/modals.js';
import {
  openAdminStudio,
  fetchAndMergeCloudAdminCatalog,
  renderAdminStudio,
  bindAdminStudioEvents
} from './ui/admin-studio.js';
import {
  openAboutPage,
  renderAboutPage,
  bindAboutPageEvents
} from './ui/about-page.js';
import {
  setNativeLanguage,
  setTargetLanguage,
  applyStaticUILocalization,
  syncMobileBottomNavUI,
  switchHomeSubView,
  resumePlayIfAllDialogsClosed,
  bindNavigationEvents
} from './ui/navigation-i18n.js';

// 1. Восстанавливаем режим экранной клавиатуры на ПК
if (state.desktopKbdOpen) {
  document.body.classList.add('desktop-kbd-open');
}

// 2. Регистрируем команды межмодульной навигации (устраняет циклические зависимости — DIP)
registerActions({
  spawnNextWord,
  startLevelNow,
  selectCourseLesson,
  launchFromTitleScreen,
  returnToTitleScreen,
  showLevelIntroOverlay,
  openDecksPage,
  renderDecksPage,
  resumeBattleFromDecksPage,
  openCourseCatalogModal,
  openCustomWordsModal,
  openTtsStudioDialog,
  openDictionaryModal,
  renderGameSettingsModal,
  openGameSettingsModal,
  openStatsModal,
  openLeaderboardModal,
  openAdminStudio,
  renderAdminStudio,
  openAboutPage,
  renderAboutPage,
  setNativeLanguage,
  setTargetLanguage,
  applyStaticUILocalization,
  syncMobileBottomNavUI,
  switchHomeSubView,
  resumePlayIfAllDialogsClosed
});

// 3. Реактивные подписки UI на события домена и сервисов (OCP)
bus.on('pins:changed', () => {
  updatePinnedCountUI();
  rerenderKillFeed();
  refreshHitSpotlightPinState();
  if (centerOverlay && !centerOverlay.classList.contains('hidden')) {
    refreshOverlayContent();
  }
  if (dictDialog && dictDialog.open) {
    renderFullDictionary(dictSearchInput ? dictSearchInput.value : '');
  }
  if (state.homeSubView === 'decks') {
    renderDecksPage();
  }
});

bus.on('learned:updated', ({ alreadyKnown } = {}) => {
  if (alreadyKnown) {
    updateTodayLearnedUI();
    renderHomeDashboardWidgets();
    if (state.homeSubView === 'decks') renderDecksPage();
    return;
  }
  renderWeaponSelectors();
  updateLearnedProgressUI();
  updateTodayLearnedUI();
  updatePilotRankUI();
  renderHomeDashboardWidgets();
  if (state.homeSubView === 'decks') {
    renderDecksPage();
  }
});

bus.on('favorites:changed', () => {
  if (state.homeSubView === 'decks') {
    renderDecksPage();
  }
});

bus.on('tts:status', () => {
  onTtsStatusChanged();
});

// 4. Подключаем обработчики событий всех независимых контроллеров
bindGameplayEvents();
bindDecksPageEvents();
bindModalEvents();
bindAdminStudioEvents();
bindAboutPageEvents();
bindNavigationEvents();

// 5. Асинхронная инициализация пользовательских колод, облачного каталога и 60 FPS цикла
async function initGame() {
  if (AnkiImporter) {
    state.userCourses = await AnkiImporter.loadUserCourses();
  }
  await fetchAndMergeCloudAdminCatalog();
  ensureValidCourseSelection();
  renderZtypeKeyboard();
  setTargetLanguage(state.targetLang);
  setNativeLanguage(state.nativeLang);

  const sel = getActiveSelection();
  if (sel.course && sel.mod && sel.lesson) {
    const startWords = resolveLessonBaseWords(sel.course, sel.mod, sel.lesson, state.activeLessonIndex);
    if (startWords.length > 0) {
      updateHitSpotlightCard(startWords[0], false);
    }
  }

  updatePilotRankUI();
  renderHomeDashboardWidgets();
  resizeCanvas();
  requestAnimationFrame(() => {
    resizeCanvas();
    seedTitleDemoWords();
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      for (const list of [state.activeWords, state.demoWords]) {
        for (const w of list) {
          const dims = measureWordCapsule(w.text, w.entry);
          w.boxW = dims.boxW;
          w.boxH = dims.boxH;
        }
      }
    }).catch(() => {});
  }

  requestAnimationFrame(gameLoop);
}

initGame();
