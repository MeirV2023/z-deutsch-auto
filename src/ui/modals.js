// Контроллеры модальных окон (<dialog>): Anki .apkg, TTS, Словарь, Профиль, Статистика и Рейтинг (SRP)
import { actions } from '../core/events.js';
import { escapeHtml } from '../core/utils.js';
import { GEMINI_VOICES, TARGET_LANG_META } from '../config/constants.js';
import { WEAPONS } from '../config/weapons.js';
import { AnkiImporter } from '../anki/index.js';
import { sound } from '../services/sound-engine.js';
import { ttsManager } from '../services/tts-service.js';
import {
  dailyProgress,
  getPinnedEntriesForTargetLang,
  getWordTranslation,
  isEntryPinned,
  isRtlTranslation,
  isWeaponUnlocked,
  learnedWordsSet,
  state,
  t,
  todayLearnedSet
} from '../state/store.js';
import {
  getActiveSelection,
  getAllWordsInCourse,
  getAllWordsInTargetLang,
  getMergedLeaderboardEntries
} from '../domain/catalog-service.js';
import {
  achievementsGrid,
  ankiAutoMapBanner,
  ankiBackSelect,
  ankiDeckTitleInput,
  ankiDropzone,
  ankiFileInput,
  ankiFrontSelect,
  ankiImportPane,
  ankiManualColsDetails,
  ankiParseStatus,
  ankiPreviewBox,
  ankiSampleCards,
  btnClearApiKey,
  btnCloseCatalog,
  btnCloseCustom,
  btnCloseDict,
  btnCloseGameSettings,
  btnCloseLeaderboardDialog,
  btnCloseStatsDialog,
  btnCloseTtsDialog,
  btnConfirmAnkiImport,
  btnDecksImportAnki,
  btnDictOnlyPinned,
  btnDownloadSampleApkg,
  btnFooterAnki,
  btnHomeSettings,
  btnHomeStreakChip,
  btnHudGameSettings,
  btnNavLeaderboard,
  btnNavStats,
  btnOpenAdminFromSettings,
  btnOpenAnkiFromCatalog,
  btnOpenAnkiFromSettings,
  btnOpenCustom,
  btnOpenDictFromSettings,
  btnOpenLeaderboardCard,
  btnOpenLeaderboardFromSettings,
  btnOpenLeaderboardFromStats,
  btnOpenStatsCard,
  btnOpenStatsFromSettings,
  btnOpenTtsSettings,
  btnOpenVoiceFromSettings,
  btnQuickStartAnki,
  btnSaveAnkiToDecks,
  btnSaveApiKey,
  btnSaveCustomWords,
  btnSettingsToggleArticle,
  btnSettingsToggleKbd,
  btnSidebarAnki,
  btnSidebarGameSettings,
  btnSwapAnkiCols,
  btnTestGeminiVoice,
  btnTitleCustom,
  btnTitleDict,
  btnTitleVoice,
  btnToggleTtsMaster,
  centerOverlay,
  courseBrowserDialog,
  customWordsDialog,
  customWordsInput,
  dictDialog,
  dictFullList,
  dictSearchInput,
  gameSettingsDialog,
  gameSettingsDialogTitle,
  geminiApiKeyInput,
  labelAchievementsHeading,
  labelOpenLeaderFromStats,
  labelSettingArticle,
  labelSettingDesktopKbd,
  labelSettingDictBtn,
  labelSettingNativeLang,
  labelSettingSpeed,
  labelSettingTargetLang,
  labelSettingVoiceStudio,
  labelSettingWeapon,
  labelSettingsAdminBtn,
  labelSettingsAnkiBtn,
  labelSettingsLeaderboardBtn,
  labelSettingsStatsBtn,
  leaderboardDialog,
  leaderboardDialogTitle,
  leaderboardFullList,
  manualDeckTitleInput,
  manualImportPane,
  pilotRankPill,
  settingsPilotRankLabel,
  settingsPilotSubStats,
  settingsSpeedGroup,
  statsDialog,
  statsDialogTitle,
  statsModalGrid,
  tabImportAnki,
  tabImportManual,
  ttsApiKeyHint,
  ttsApiKeySummary,
  ttsDialogTitle,
  ttsEnableLabel,
  ttsModelFlashDesc,
  ttsModelGrid,
  ttsModelLabel,
  ttsModelLiteDesc,
  ttsSettingsDialog,
  ttsStatusBanner,
  ttsVoiceGrid,
  ttsVoiceLabel
} from './dom.js';
import { renderWeaponSelectors } from '../engine/weapon-vfx.js';
import { launchFromTitleScreen } from '../engine/promo-autopilot.js';
import {
  applySpeedPresetByIndex,
  renderWordsPreviewList,
  selectCourseLesson,
  startLevelNow,
  toggleArticleTypingMode,
  toggleDesktopKeyboard
} from '../engine/gameplay.js';
import { openDecksPage } from './decks-page.js';

export function onTtsStatusChanged() {
  const tr = t();
  if (btnOpenTtsSettings) {
    btnOpenTtsSettings.classList.toggle('active', ttsManager.enabled);
    const shortBadge = !ttsManager.enabled
      ? ' OFF'
      : (ttsManager.localApiKey || ttsManager.serverAvailable === true ? ' 3.8 TTS' : ' TTS');
    btnOpenTtsSettings.innerHTML = `${ttsManager.enabled ? '🎙️' : '🔇'}<span class="sr-only" id="hudTtsBadge">${shortBadge}</span>`;
  }

  if (!ttsStatusBanner) return;
  if (!ttsManager.enabled) {
    ttsStatusBanner.textContent = tr.ttsStatusMuted;
    ttsStatusBanner.classList.add('fallback');
  } else if (ttsManager.localApiKey) {
    ttsStatusBanner.textContent = tr.ttsStatusReadyLocal(ttsManager.model, ttsManager.voice);
    ttsStatusBanner.classList.remove('fallback');
  } else if (ttsManager.serverAvailable === false || (location.protocol !== 'http:' && location.protocol !== 'https:')) {
    ttsStatusBanner.textContent = tr.ttsStatusFallback;
    ttsStatusBanner.classList.add('fallback');
  } else {
    ttsStatusBanner.textContent = tr.ttsStatusReadyServer(ttsManager.model, ttsManager.voice);
    ttsStatusBanner.classList.remove('fallback');
  }
}

export function renderTtsSettingsUI() {
  if (!ttsSettingsDialog) return;
  const tr = t();
  const meta = TARGET_LANG_META[state.targetLang] || TARGET_LANG_META.de;

  if (ttsDialogTitle) ttsDialogTitle.textContent = tr.ttsDialogTitle;
  if (ttsEnableLabel) ttsEnableLabel.textContent = tr.ttsEnableLabel;
  if (btnToggleTtsMaster) {
    btnToggleTtsMaster.textContent = ttsManager.enabled ? tr.ttsOn : tr.ttsOff;
    btnToggleTtsMaster.classList.toggle('active', ttsManager.enabled);
  }
  if (ttsModelLabel) ttsModelLabel.textContent = tr.ttsModelLabel;
  if (ttsModelFlashDesc) ttsModelFlashDesc.textContent = tr.ttsModelFlashDesc;
  if (ttsModelLiteDesc) ttsModelLiteDesc.textContent = tr.ttsModelLiteDesc;
  if (ttsVoiceLabel) ttsVoiceLabel.textContent = tr.ttsVoiceLabel;
  if (btnTestGeminiVoice) btnTestGeminiVoice.textContent = tr.ttsTestBtn(meta.sampleWord);
  if (ttsApiKeySummary) ttsApiKeySummary.textContent = tr.ttsApiKeySummary;
  if (ttsApiKeyHint) ttsApiKeyHint.innerHTML = tr.ttsApiKeyHint;
  if (geminiApiKeyInput && document.activeElement !== geminiApiKeyInput) {
    geminiApiKeyInput.value = ttsManager.localApiKey;
  }

  if (ttsModelGrid) {
    ttsModelGrid.querySelectorAll('.tts-option-card').forEach(card => {
      card.classList.toggle('active', card.dataset.model === ttsManager.model);
    });
  }

  if (ttsVoiceGrid) {
    ttsVoiceGrid.innerHTML = '';
    GEMINI_VOICES.forEach(v => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tts-voice-btn' + (v.id === ttsManager.voice ? ' active' : '');
      const toneLabel = (v.tones && (v.tones[state.nativeLang] || v.tones.en)) || '';
      btn.innerHTML = `
        <span class="tts-voice-name">🎙️ ${escapeHtml(v.id)}</span>
        <span class="tts-voice-tone">${escapeHtml(toneLabel)}</span>
      `;
      btn.addEventListener('click', () => {
        ttsManager.voice = v.id;
        ttsManager.saveConfig();
        renderTtsSettingsUI();
        onTtsStatusChanged();
      });
      ttsVoiceGrid.appendChild(btn);
    });
  }

  onTtsStatusChanged();
}


export function switchImportTab(tabId) {
  const isAnki = tabId === 'anki';
  if (tabImportAnki) tabImportAnki.classList.toggle('active', isAnki);
  if (tabImportManual) tabImportManual.classList.toggle('active', !isAnki);
  if (ankiImportPane) ankiImportPane.classList.toggle('hidden', !isAnki);
  if (manualImportPane) manualImportPane.classList.toggle('hidden', isAnki);
}

export function setImportTargetLang(langCode) {
  if (!TARGET_LANG_META[langCode]) return;
  state.importTargetLang = langCode;
  document.querySelectorAll('.import-tlang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.importLang === langCode);
  });
  if (state.parsedAnkiData) {
    renderAnkiPreviewCards();
  }
}

export function extractAnkiWordsForCurrentPreview(data) {
  if (!data || !AnkiImporter) return [];
  const frontIdx = Number(ankiFrontSelect ? ankiFrontSelect.value : 0) || 0;
  const backIdx = Number(ankiBackSelect ? ankiBackSelect.value : 1) || 1;
  const manualOverride = state.ankiManualOverride ? { frontIdx, backIdx } : null;
  if (AnkiImporter.extractNormalizedWordsFromParsedDeck) {
    return AnkiImporter.extractNormalizedWordsFromParsedDeck(data, state.importTargetLang, manualOverride);
  }
  return (data.rows || [])
    .map(r => AnkiImporter.normalizeCardToWordEntry(r[frontIdx], r[backIdx], state.importTargetLang, r[2] || ''))
    .filter(Boolean);
}

export function renderAnkiPreviewCards() {
  const data = state.parsedAnkiData;
  if (!data || !ankiSampleCards) return;
  const tr = t();

  const normalizedWords = extractAnkiWordsForCurrentPreview(data);
  const validCount = normalizedWords.length;
  const previewItems = normalizedWords.slice(0, 8);

  if (ankiAutoMapBanner) {
    if (data.autoMapped && !state.ankiManualOverride && validCount > 0) {
      ankiAutoMapBanner.textContent = tr.ankiAutoMappedBanner(
        validCount,
        data.modelCount || 1,
        data.subdeckCount || 1
      );
      ankiAutoMapBanner.classList.remove('hidden');
    } else {
      ankiAutoMapBanner.classList.add('hidden');
    }
  }

  ankiSampleCards.innerHTML = '';
  previewItems.forEach(item => {
    const rowEl = document.createElement('div');
    rowEl.className = 'anki-preview-item';
    const transText = getWordTranslation(item);
    const rtlAttr = isRtlTranslation(item) ? ' dir="rtl"' : ' dir="ltr"';
    rowEl.innerHTML = `
      <strong style="color:#fff; font-family: var(--font-ui);" dir="ltr">${escapeHtml(item.raw)}</strong>
      <span style="color: var(--accent-amber); font-weight: 600;"${rtlAttr}>${escapeHtml(transText)}</span>
    `;
    ankiSampleCards.appendChild(rowEl);
  });

  if (btnConfirmAnkiImport) {
    btnConfirmAnkiImport.textContent = tr.ankiConfirmBtn(validCount);
    btnConfirmAnkiImport.disabled = validCount === 0;
  }
  if (btnSaveAnkiToDecks) {
    btnSaveAnkiToDecks.textContent = tr.ankiSaveToDecksBtn;
    btnSaveAnkiToDecks.disabled = validCount === 0;
  }
}

export async function handleAnkiFileSelected(file) {
  if (!file) return;
  ankiParseStatus.classList.remove('error');
  ankiParseStatus.textContent = '⏳ ...';
  ankiPreviewBox.classList.add('hidden');
  state.ankiManualOverride = false;

  try {
    const parsed = await AnkiImporter.parseUploadedDeckFile(file);
    state.parsedAnkiData = parsed;
    state.ankiManualOverride = false;

    if (parsed.detectedTargetLang && TARGET_LANG_META[parsed.detectedTargetLang]) {
      setImportTargetLang(parsed.detectedTargetLang);
    }

    ankiDeckTitleInput.value = parsed.deckName;
    ankiFrontSelect.innerHTML = '';
    ankiBackSelect.innerHTML = '';

    parsed.fieldNames.forEach((fName, idx) => {
      const opt1 = document.createElement('option');
      opt1.value = String(idx);
      opt1.textContent = `${idx + 1}. ${fName}`;
      ankiFrontSelect.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = String(idx);
      opt2.textContent = `${idx + 1}. ${fName}`;
      ankiBackSelect.appendChild(opt2);
    });

    const defFront = typeof parsed.detectedFrontIdx === 'number' ? parsed.detectedFrontIdx : 0;
    const defBack = typeof parsed.detectedBackIdx === 'number'
      ? parsed.detectedBackIdx
      : (parsed.fieldNames.length > 1 ? 1 : 0);
    ankiFrontSelect.value = String(defFront);
    ankiBackSelect.value = String(defBack);

    if (ankiManualColsDetails) {
      ankiManualColsDetails.open = !parsed.autoMapped;
    }

    const countNum = Array.isArray(parsed.autoCards) && parsed.autoCards.length > 0
      ? parsed.autoCards.length
      : parsed.rows.length;
    ankiParseStatus.textContent = t().ankiParsedOk(countNum);
    ankiPreviewBox.classList.remove('hidden');
    renderAnkiPreviewCards();
  } catch (err) {
    ankiParseStatus.classList.add('error');
    ankiParseStatus.textContent = `⚠️ ${err && err.message ? err.message : 'Ошибка чтения файла'}`;
  }
}

export function openCustomWordsModal(defaultTab = 'anki') {
  if (state.running && !state.paused) state.paused = true;
  setImportTargetLang(state.targetLang);
  switchImportTab(defaultTab);
  customWordsDialog.showModal();
}

export async function finalizeAndLaunchUserCourse(userCourse, openOnDecksPage = false) {
  await AnkiImporter.saveUserCourse(userCourse);
  state.userCourses = [userCourse, ...state.userCourses.filter(c => c.id !== userCourse.id)];
  customWordsDialog.close();

  if (state.targetLang !== userCourse.targetLang) {
    actions.setTargetLanguage(userCourse.targetLang);
  }

  selectCourseLesson(userCourse.id, 0, 0, false);

  if (openOnDecksPage) {
    openDecksPage({
      sourceFilter: 'all',
      navMode: 'decks',
      openCourseId: userCourse.id
    });
    return;
  }

  if (state.screenMode === 'title') {
    launchFromTitleScreen();
  } else {
    startLevelNow();
  }
}

export async function buildAndImportCurrentAnkiDeck(openOnDecksPage = false) {
  const data = state.parsedAnkiData;
  if (!data) return;
  const words = extractAnkiWordsForCurrentPreview(data);
  if (words.length === 0) return;

  const deckTitle = (ankiDeckTitleInput && ankiDeckTitleInput.value.trim()) || data.deckName || 'Anki Deck';
  const userCourse = AnkiImporter.buildUserCourse({
    title: deckTitle,
    targetLang: state.importTargetLang,
    originType: 'anki',
    levelTag: data.levelTag || undefined,
    words,
    lessonSize: 12
  });

  await finalizeAndLaunchUserCourse(userCourse, openOnDecksPage);
}

export function openTtsStudioDialog() {
  if (state.running && !state.paused) state.paused = true;
  renderTtsSettingsUI();
  ttsSettingsDialog.showModal();
}

export function renderFullDictionary(filterQuery = '') {
  const { course } = getActiveSelection();
  const allWords = course ? getAllWordsInCourse(course) : getAllWordsInTargetLang(state.targetLang);
  const q = filterQuery.trim().toLowerCase();

  const filtered = allWords.filter(item => {
    if (state.dictOnlyPinned && !isEntryPinned(item)) return false;
    if (!q) return true;
    const trObj = item.translations || {};
    return (
      item.raw.toLowerCase().includes(q) ||
      (trObj.ru && trObj.ru.toLowerCase().includes(q)) ||
      (trObj.en && trObj.en.toLowerCase().includes(q)) ||
      (trObj.he && trObj.he.toLowerCase().includes(q))
    );
  });
  renderWordsPreviewList(filtered, dictFullList);
}

export function openDictionaryModal() {
  if (state.running && !state.paused) state.paused = true;
  renderFullDictionary(dictSearchInput.value);
  dictDialog.showModal();
}

export function renderGameSettingsModal() {
  if (!gameSettingsDialog) return;
  const tr = t();
  if (gameSettingsDialogTitle) gameSettingsDialogTitle.textContent = tr.gameSettingsTitle;
  if (labelSettingTargetLang && tr.settingTargetLang) labelSettingTargetLang.textContent = tr.settingTargetLang;
  if (labelSettingNativeLang && tr.settingNativeLang) labelSettingNativeLang.textContent = tr.settingNativeLang;
  if (labelSettingWeapon && tr.settingWeapon) labelSettingWeapon.textContent = tr.settingWeapon;
  if (labelSettingsLeaderboardBtn && tr.settingsLeaderboardBtn) labelSettingsLeaderboardBtn.textContent = tr.settingsLeaderboardBtn;
  if (labelSettingsStatsBtn && tr.settingsStatsBtn) labelSettingsStatsBtn.textContent = tr.settingsStatsBtn;
  if (labelSettingsAnkiBtn && tr.settingsAnkiBtn) labelSettingsAnkiBtn.textContent = tr.settingsAnkiBtn;
  if (labelSettingsAdminBtn && tr.settingsAdminBtn) labelSettingsAdminBtn.textContent = tr.settingsAdminBtn;

  const learnedCount = learnedWordsSet.size;
  const ranks = tr.ranks || ['КАДЕТ', 'ПИЛОТ', 'ШТУРМАН', 'КОМАНДОР'];
  const rankIdx = learnedCount >= 65 ? 3 : (learnedCount >= 35 ? 2 : (learnedCount >= 12 ? 1 : 0));
  const bestPts = Math.max(state.highScore, state.score);
  const streakStr = tr.streakDays ? tr.streakDays(dailyProgress.streakDays || 1) : `${dailyProgress.streakDays || 1}d`;
  if (settingsPilotRankLabel) {
    settingsPilotRankLabel.textContent = ranks[rankIdx] || ranks[0];
  }
  if (settingsPilotSubStats) {
    settingsPilotSubStats.textContent = `📖 ${tr.wordsShort(learnedCount)} · 🔥 ${streakStr} · 🏆 ${bestPts.toLocaleString()}`;
  }

  renderWeaponSelectors();

  if (labelSettingSpeed) labelSettingSpeed.textContent = tr.settingSpeed;
  if (labelSettingArticle) labelSettingArticle.textContent = tr.settingArticle;
  if (labelSettingDesktopKbd) labelSettingDesktopKbd.textContent = tr.settingDesktopKbd;
  if (labelSettingVoiceStudio) labelSettingVoiceStudio.textContent = tr.settingVoiceStudio;
  if (btnOpenVoiceFromSettings) btnOpenVoiceFromSettings.textContent = tr.openVoiceBtn;
  if (labelSettingDictBtn) labelSettingDictBtn.textContent = tr.settingDictLabel;
  if (btnOpenDictFromSettings) btnOpenDictFromSettings.textContent = tr.openDictBtn;

  if (btnSettingsToggleArticle) {
    btnSettingsToggleArticle.textContent = state.typeWithArticle ? tr.articleMode : tr.badgeMode;
    btnSettingsToggleArticle.classList.toggle('active', state.typeWithArticle);
  }
  if (btnSettingsToggleKbd) {
    btnSettingsToggleKbd.textContent = state.desktopKbdOpen ? tr.kbdShown : tr.kbdHidden;
    btnSettingsToggleKbd.classList.toggle('active', state.desktopKbdOpen);
  }

  if (settingsSpeedGroup) {
    settingsSpeedGroup.innerHTML = '';
    state.speedPresets.forEach((sp, idx) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'hud-btn' + (idx === state.speedPresetIndex ? ' active' : '');
      b.textContent = sp.label;
      b.addEventListener('click', () => {
        sound.init();
        applySpeedPresetByIndex(idx);
      });
      settingsSpeedGroup.appendChild(b);
    });
  }
}

export function openGameSettingsModal() {
  if (!gameSettingsDialog) return;
  if (state.running && !state.paused) state.paused = true;
  renderGameSettingsModal();
  gameSettingsDialog.showModal();
  actions.syncMobileBottomNavUI('profile');
}

export function renderStatsModal() {
  if (!statsDialog || !statsModalGrid) return;
  const tr = t();
  if (statsDialogTitle) statsDialogTitle.textContent = tr.statsDialogTitle;
  if (labelOpenLeaderFromStats && tr.openLeaderFromStats) {
    labelOpenLeaderFromStats.textContent = tr.openLeaderFromStats;
  }

  const accPct = state.shotsFired > 0
    ? `${Math.round((state.shotsHit / state.shotsFired) * 100)}%`
    : '100%';
  const unlockedCount = WEAPONS.filter(isWeaponUnlocked).length;
  const pinnedCount = getPinnedEntriesForTargetLang(state.targetLang).length;
  const bestPts = Math.max(state.highScore, state.score);

  const tiles = [
    { icon: '📖', val: learnedWordsSet.size.toLocaleString(), label: tr.statTotalLearned },
    { icon: '🌱', val: tr.todayWordsVal(todayLearnedSet.size), label: tr.statTodayLearned },
    { icon: '🏆', val: bestPts.toLocaleString(), label: tr.statBestScore },
    { icon: '🔥', val: tr.streakDays(dailyProgress.bestStreakDays || 1), label: tr.statBestStreak },
    { icon: '✅', val: String(state.completedLessonIds.size), label: tr.statLessonsDone },
    { icon: '🎯', val: accPct, label: tr.statAccuracy },
    { icon: '🚀', val: `${unlockedCount} / ${WEAPONS.length}`, label: tr.statUnlockedWeapons },
    { icon: '⭐', val: String(pinnedCount), label: tr.statPinnedCount }
  ];

  statsModalGrid.innerHTML = '';
  tiles.forEach(tItem => {
    const card = document.createElement('div');
    card.className = 'stat-tile-card';
    card.innerHTML = `
      <div class="stat-tile-val">${escapeHtml(tItem.icon)} ${escapeHtml(tItem.val)}</div>
      <div class="stat-tile-label">${escapeHtml(tItem.label)}</div>
    `;
    statsModalGrid.appendChild(card);
  });
}

export function openStatsModal() {
  if (!statsDialog) return;
  if (state.running && !state.paused) state.paused = true;
  renderStatsModal();
  statsDialog.showModal();
  actions.syncMobileBottomNavUI('stats');
}

export function renderLeaderboardModal() {
  if (!leaderboardDialog) return;
  const tr = t();
  if (leaderboardDialogTitle) leaderboardDialogTitle.textContent = tr.leaderboardDialogTitle;
  if (labelAchievementsHeading) labelAchievementsHeading.textContent = tr.achievementsHeading;

  if (leaderboardFullList) {
    leaderboardFullList.innerHTML = '';
    const ranked = getMergedLeaderboardEntries();
    ranked.forEach(row => {
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
      leaderboardFullList.appendChild(div);
    });
  }

  if (achievementsGrid) {
    const learnedCount = learnedWordsSet.size;
    const achItems = [
      { icon: '🌟', meta: tr.achFirstTen, ok: learnedCount >= 10 },
      { icon: '🚀', meta: tr.achArsenalHalf, ok: learnedCount >= 35 },
      { icon: '⚡', meta: tr.achTeslaMaster, ok: learnedCount >= 50 },
      { icon: '🎯', meta: tr.achCombo8, ok: state.maxCombo >= 8 },
      { icon: '🏅', meta: tr.achLesson3, ok: state.completedLessonIds.size >= 3 },
      { icon: '🗂️', meta: tr.achAnkiDeck, ok: state.userCourses.length > 0 }
    ];
    achievementsGrid.innerHTML = '';
    achItems.forEach(a => {
      const div = document.createElement('div');
      div.className = 'ach-card' + (a.ok ? ' unlocked' : '');
      div.innerHTML = `
        <span class="ach-icon">${a.icon}</span>
        <div>
          <div class="ach-title">${escapeHtml(a.meta.title)}</div>
          <div class="ach-desc">${escapeHtml(a.meta.desc)}</div>
        </div>
      `;
      achievementsGrid.appendChild(div);
    });
  }
}

export function openLeaderboardModal() {
  if (!leaderboardDialog) return;
  if (state.running && !state.paused) state.paused = true;
  renderLeaderboardModal();
  leaderboardDialog.showModal();
  actions.syncMobileBottomNavUI('stats');
}

export function bindModalEvents() {
  if (btnCloseCatalog) {
    btnCloseCatalog.addEventListener('click', () => {
      courseBrowserDialog.close();
      actions.resumePlayIfAllDialogsClosed();
    });
  }

  if (btnOpenAnkiFromCatalog) {
    btnOpenAnkiFromCatalog.addEventListener('click', () => {
      courseBrowserDialog.close();
      openCustomWordsModal('anki');
    });
  }

  // Открытие окна импорта Anki .apkg / Своих слов
  [btnSidebarAnki, btnOpenCustom, btnTitleCustom, btnQuickStartAnki, btnFooterAnki, btnDecksImportAnki].forEach(el => {
    if (!el) return;
    el.addEventListener('click', () => {
      openCustomWordsModal('anki');
      el.blur();
    });
  });

  if (tabImportAnki) tabImportAnki.addEventListener('click', () => switchImportTab('anki'));
  if (tabImportManual) tabImportManual.addEventListener('click', () => switchImportTab('manual'));

  document.querySelectorAll('.import-tlang-btn').forEach(btn => {
    btn.addEventListener('click', () => setImportTargetLang(btn.dataset.importLang));
  });

  if (ankiFileInput) {
    ankiFileInput.addEventListener('change', () => {
      if (ankiFileInput.files && ankiFileInput.files[0]) {
        handleAnkiFileSelected(ankiFileInput.files[0]);
      }
    });
  }

  if (ankiDropzone) {
    ['dragenter', 'dragover'].forEach(evName => {
      ankiDropzone.addEventListener(evName, (e) => {
        e.preventDefault();
        ankiDropzone.classList.add('dragover');
      });
    });
    ['dragleave', 'drop'].forEach(evName => {
      ankiDropzone.addEventListener(evName, (e) => {
        e.preventDefault();
        ankiDropzone.classList.remove('dragover');
      });
    });
    ankiDropzone.addEventListener('drop', (e) => {
      const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) handleAnkiFileSelected(f);
    });
  }

  if (btnDownloadSampleApkg) {
    btnDownloadSampleApkg.addEventListener('click', () => {
      const blob = AnkiImporter.generateSampleApkgBlob(state.importTargetLang);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zlingo-sample-${state.importTargetLang}.apkg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    });
  }

  if (ankiFrontSelect) {
    ankiFrontSelect.addEventListener('change', () => {
      state.ankiManualOverride = true;
      renderAnkiPreviewCards();
    });
  }
  if (ankiBackSelect) {
    ankiBackSelect.addEventListener('change', () => {
      state.ankiManualOverride = true;
      renderAnkiPreviewCards();
    });
  }
  if (btnSwapAnkiCols) {
    btnSwapAnkiCols.addEventListener('click', () => {
      state.ankiManualOverride = true;
      const tmp = ankiFrontSelect.value;
      ankiFrontSelect.value = ankiBackSelect.value;
      ankiBackSelect.value = tmp;
      renderAnkiPreviewCards();
    });
  }

  if (btnConfirmAnkiImport) {
    btnConfirmAnkiImport.addEventListener('click', () => {
      buildAndImportCurrentAnkiDeck(false);
    });
  }

  if (btnSaveAnkiToDecks) {
    btnSaveAnkiToDecks.addEventListener('click', () => {
      buildAndImportCurrentAnkiDeck(true);
    });
  }

  if (btnSaveCustomWords) {
    btnSaveCustomWords.addEventListener('click', async () => {
      let parsedWords = [];
      let autoDetectedTitle = '';
      if (AnkiImporter && AnkiImporter.parseAdminTextbookBlock) {
        const block = AnkiImporter.parseAdminTextbookBlock(
          customWordsInput.value,
          state.importTargetLang,
          state.nativeLang
        );
        parsedWords = block.words || [];
        autoDetectedTitle = block.detectedTitle || '';
      } else {
        const rawLines = customWordsInput.value.split(/\r?\n/);
        for (const line of rawLines) {
          const trimmed = line.trim();
          if (!trimmed || (!trimmed.includes(';') && !trimmed.includes('\t'))) continue;
          const delim = trimmed.includes(';') ? ';' : '\t';
          const parts = trimmed.split(delim).map(s => s.trim());
          if (parts.length >= 2 && parts[0] && parts[1]) {
            const entry = AnkiImporter.normalizeCardToWordEntry(
              parts[0],
              parts[1],
              state.importTargetLang,
              parts[2] || ''
            );
            if (entry) parsedWords.push(entry);
          }
        }
      }
      if (parsedWords.length === 0) return;

      const userCourse = AnkiImporter.buildUserCourse({
        title: manualDeckTitleInput.value.trim() || autoDetectedTitle || `Мои слова (${parsedWords.length})`,
        targetLang: state.importTargetLang,
        originType: 'custom',
        words: parsedWords,
        lessonSize: 12
      });

      await finalizeAndLaunchUserCourse(userCourse);
    });
  }

  if (btnCloseCustom) {
    btnCloseCustom.addEventListener('click', () => {
      customWordsDialog.close();
      if (state.screenMode === 'play' && state.running && centerOverlay.classList.contains('hidden')) {
        state.paused = false;
      }
    });
  }

  if (btnOpenTtsSettings) {
    btnOpenTtsSettings.addEventListener('click', () => {
      openTtsStudioDialog();
      btnOpenTtsSettings.blur();
    });
  }
  if (btnTitleVoice) {
    btnTitleVoice.addEventListener('click', () => {
      openTtsStudioDialog();
      btnTitleVoice.blur();
    });
  }
  if (btnCloseTtsDialog) {
    btnCloseTtsDialog.addEventListener('click', () => {
      ttsSettingsDialog.close();
      if (state.screenMode === 'play' && state.running && centerOverlay.classList.contains('hidden')) {
        state.paused = false;
      }
    });
  }
  if (btnToggleTtsMaster) {
    btnToggleTtsMaster.addEventListener('click', () => {
      ttsManager.enabled = !ttsManager.enabled;
      ttsManager.saveConfig();
      renderTtsSettingsUI();
    });
  }
  if (ttsModelGrid) {
    ttsModelGrid.querySelectorAll('.tts-option-card').forEach(card => {
      card.addEventListener('click', () => {
        const model = card.dataset.model;
        if (model === 'gemini-3.8-flash-tts' || model === 'gemini-3.8-flash-lite-tts') {
          ttsManager.model = model;
          ttsManager.saveConfig();
          renderTtsSettingsUI();
        }
      });
    });
  }
  if (btnTestGeminiVoice) {
    btnTestGeminiVoice.addEventListener('click', async () => {
      sound.init();
      const tr = t();
      const meta = TARGET_LANG_META[state.targetLang] || TARGET_LANG_META.de;
      btnTestGeminiVoice.disabled = true;
      btnTestGeminiVoice.textContent = tr.ttsTestingBtn;
      try {
        await ttsManager.speak(meta.sampleWord, state.targetLang, true);
      } finally {
        btnTestGeminiVoice.disabled = false;
        btnTestGeminiVoice.textContent = tr.ttsTestBtn(meta.sampleWord);
        onTtsStatusChanged();
      }
    });
  }
  if (btnSaveApiKey) {
    btnSaveApiKey.addEventListener('click', () => {
      ttsManager.setLocalApiKey(geminiApiKeyInput.value);
      renderTtsSettingsUI();
    });
  }
  if (btnClearApiKey) {
    btnClearApiKey.addEventListener('click', () => {
      geminiApiKeyInput.value = '';
      ttsManager.setLocalApiKey('');
      renderTtsSettingsUI();
    });
  }

  if (btnTitleDict) btnTitleDict.addEventListener('click', openDictionaryModal);

  if (btnDictOnlyPinned) {
    btnDictOnlyPinned.addEventListener('click', () => {
      state.dictOnlyPinned = !state.dictOnlyPinned;
      btnDictOnlyPinned.classList.toggle('active', state.dictOnlyPinned);
      renderFullDictionary(dictSearchInput.value);
    });
  }

  btnCloseDict.addEventListener('click', () => {
    dictDialog.close();
    actions.resumePlayIfAllDialogsClosed();
  });

  dictSearchInput.addEventListener('input', () => {
    renderFullDictionary(dictSearchInput.value);
  });

  [btnHomeSettings, btnHudGameSettings, btnSidebarGameSettings].forEach(el => {
    if (!el) return;
    el.addEventListener('click', () => {
      openGameSettingsModal();
      el.blur();
    });
  });

  if (btnOpenLeaderboardFromSettings) {
    btnOpenLeaderboardFromSettings.addEventListener('click', () => {
      gameSettingsDialog.close();
      openLeaderboardModal();
    });
  }
  if (btnOpenStatsFromSettings) {
    btnOpenStatsFromSettings.addEventListener('click', () => {
      gameSettingsDialog.close();
      openStatsModal();
    });
  }
  if (btnOpenAnkiFromSettings) {
    btnOpenAnkiFromSettings.addEventListener('click', () => {
      gameSettingsDialog.close();
      openCustomWordsModal('anki');
    });
  }
  if (btnOpenAdminFromSettings) {
    btnOpenAdminFromSettings.addEventListener('click', () => {
      gameSettingsDialog.close();
      actions.openAdminStudio(state.targetLang);
    });
  }

  if (btnSettingsToggleArticle) {
    btnSettingsToggleArticle.addEventListener('click', () => {
      sound.init();
      toggleArticleTypingMode();
    });
  }
  if (btnSettingsToggleKbd) {
    btnSettingsToggleKbd.addEventListener('click', () => {
      sound.init();
      toggleDesktopKeyboard();
    });
  }
  if (btnOpenVoiceFromSettings) {
    btnOpenVoiceFromSettings.addEventListener('click', () => {
      gameSettingsDialog.close();
      openTtsStudioDialog();
    });
  }
  if (btnOpenDictFromSettings) {
    btnOpenDictFromSettings.addEventListener('click', () => {
      gameSettingsDialog.close();
      openDictionaryModal();
    });
  }
  if (btnCloseGameSettings) {
    btnCloseGameSettings.addEventListener('click', () => {
      gameSettingsDialog.close();
      actions.resumePlayIfAllDialogsClosed();
    });
  }

  [btnNavStats, btnOpenStatsCard, btnHomeStreakChip].forEach(el => {
    if (!el) return;
    el.addEventListener('click', () => {
      openStatsModal();
      el.blur();
    });
  });

  if (btnOpenLeaderboardFromStats) {
    btnOpenLeaderboardFromStats.addEventListener('click', () => {
      statsDialog.close();
      openLeaderboardModal();
    });
  }

  if (btnCloseStatsDialog) {
    btnCloseStatsDialog.addEventListener('click', () => {
      statsDialog.close();
      actions.resumePlayIfAllDialogsClosed();
    });
  }

  [btnNavLeaderboard, btnOpenLeaderboardCard, pilotRankPill].forEach(el => {
    if (!el) return;
    el.addEventListener('click', () => {
      openLeaderboardModal();
      el.blur();
    });
  });

  if (btnCloseLeaderboardDialog) {
    btnCloseLeaderboardDialog.addEventListener('click', () => {
      leaderboardDialog.close();
      actions.resumePlayIfAllDialogsClosed();
    });
  }
}
