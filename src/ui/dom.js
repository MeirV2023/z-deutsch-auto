// Централизованный реестр DOM-элементов интерфейса Z-LINGO (ISP)

export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

// Титульный экран
export const arcadeTitleScreen = document.getElementById('arcadeTitleScreen');
export const titleHeaderCard = document.getElementById('titleHeaderCard');
export const titleBottomDock = document.getElementById('titleBottomDock');
export const pilotRankText = document.getElementById('pilotRankText');
export const labelNativeFilter = document.getElementById('labelNativeFilter');
export const labelTargetFilter = document.getElementById('labelTargetFilter');
export const arcadeLogoMain = document.getElementById('arcadeLogoMain');
export const arcadeLogoSub = document.getElementById('arcadeLogoSub');
export const titleTagline = document.getElementById('titleTagline');
export const titleArsenalLabel = document.getElementById('titleArsenalLabel');
export const learnedProgressPill = document.getElementById('learnedProgressPill');
export const titleWeaponDesc = document.getElementById('titleWeaponDesc');
export const titleWeaponRow = document.getElementById('titleWeaponRow');
export const titleCourseOriginBadge = document.getElementById('titleCourseOriginBadge');
export const titleCourseName = document.getElementById('titleCourseName');
export const btnOpenCatalogTitle = document.getElementById('btnOpenCatalogTitle');
export const btnTitleAllCourses = document.getElementById('btnTitleAllCourses');
export const labelOpenCatalogTitle = document.getElementById('labelOpenCatalogTitle');
export const titleStageChips = document.getElementById('titleStageChips');
export const btnArcadeLaunch = document.getElementById('btnArcadeLaunch');
export const labelArcadeLaunch = document.getElementById('labelArcadeLaunch');
export const btnTitleSpeed = document.getElementById('btnTitleSpeed');
export const btnTitleVoice = document.getElementById('btnTitleVoice');
export const btnTitleDict = document.getElementById('btnTitleDict');
export const labelTitleDict = document.getElementById('labelTitleDict');
export const btnTitleCustom = document.getElementById('btnTitleCustom');
export const labelTitleCustom = document.getElementById('labelTitleCustom');

// Верхний HUD
export const labelPause = document.getElementById('labelPause');
export const labelScore = document.getElementById('labelScore');
export const labelCombo = document.getElementById('labelCombo');
export const labelLearnedHud = document.getElementById('labelLearnedHud');
export const hudLearnedCount = document.getElementById('hudLearnedCount');
export const labelShield = document.getElementById('labelShield');
export const labelCatalogHud = document.getElementById('labelCatalogHud');
export const labelCustomBtn = document.getElementById('labelCustomBtn');

export const sidebarOriginBadge = document.getElementById('sidebarOriginBadge');
export const sidebarLevelsTitle = document.getElementById('sidebarLevelsTitle');
export const btnSidebarCatalog = document.getElementById('btnSidebarCatalog');
export const btnSidebarAnki = document.getElementById('btnSidebarAnki');
export const sidebarKillsTitle = document.getElementById('sidebarKillsTitle');
export const btnDrillPinned = document.getElementById('btnDrillPinned');
export const pinnedCountBadge = document.getElementById('pinnedCountBadge');

export const legendDer = document.getElementById('legendDer');
export const legendDie = document.getElementById('legendDie');
export const legendDas = document.getElementById('legendDas');
export const legendVerb = document.getElementById('legendVerb');

export const hudLevelTitle = document.getElementById('hudLevelTitle');
export const hudProgressBar = document.getElementById('hudProgressBar');
export const hudProgressText = document.getElementById('hudProgressText');
export const hudScore = document.getElementById('hudScore');
export const hudCombo = document.getElementById('hudCombo');
export const hudShields = document.getElementById('hudShields');
export const empCountEl = document.getElementById('empCount');

export const btnWeaponMode = document.getElementById('btnWeaponMode');
export const btnEmp = document.getElementById('btnEmp');
export const btnTargetLangHud = document.getElementById('btnTargetLangHud');
export const btnLangMode = document.getElementById('btnLangMode');
export const btnArticleMode = document.getElementById('btnArticleMode');
export const btnSpeedMode = document.getElementById('btnSpeedMode');
export const btnOpenTtsSettings = document.getElementById('btnOpenTtsSettings');
export const btnOpenCatalogHud = document.getElementById('btnOpenCatalogHud');
export const btnOpenCustom = document.getElementById('btnOpenCustom');
export const btnPause = document.getElementById('btnPause');
export const btnHudHome = document.getElementById('btnHudHome');
export const btnQuickLevels = document.getElementById('btnQuickLevels');
export const btnClearFeed = document.getElementById('btnClearFeed');

// Экранная клавиатура ZType
export const ztypeKeyboard = document.getElementById('ztypeKeyboard');
export const ztypeKeysContainer = document.getElementById('ztypeKeysContainer');
export const kbdProgressFill = document.getElementById('kbdProgressFill');
export const levelListContainer = document.getElementById('levelListContainer');
export const overlayLevelChips = document.getElementById('overlayLevelChips');
export const totalWordsCounter = document.getElementById('totalWordsCounter');
export const killFeedContainer = document.getElementById('killFeedContainer');
export const bottomTargetPreview = document.getElementById('bottomTargetPreview');

// Центральный оверлей
export const centerOverlay = document.getElementById('centerOverlay');
export const overlayCard = document.getElementById('overlayCard');
export const btnCloseOverlay = document.getElementById('btnCloseOverlay');
export const overlayOriginBadge = document.getElementById('overlayOriginBadge');
export const overlayBadge = document.getElementById('overlayBadge');
export const overlayTitle = document.getElementById('overlayTitle');
export const overlayLessonPill = document.getElementById('overlayLessonPill');
export const overlayLessonPillLabel = document.getElementById('overlayLessonPillLabel');
export const overlayDesc = document.getElementById('overlayDesc');
export const ovStatLearnedVal = document.getElementById('ovStatLearnedVal');
export const ovStatLearnedLabel = document.getElementById('ovStatLearnedLabel');
export const ovStatMistakesVal = document.getElementById('ovStatMistakesVal');
export const ovStatMistakesLabel = document.getElementById('ovStatMistakesLabel');
export const ovStatQuizVal = document.getElementById('ovStatQuizVal');
export const ovStatQuizLabel = document.getElementById('ovStatQuizLabel');
export const ovStatComboLabel = document.getElementById('ovStatComboLabel');
export const ovStatComboVal = document.getElementById('ovStatComboVal');
export const overlayLessonStepper = document.getElementById('overlayLessonStepper');
export const overlayWeaponTitle = document.getElementById('overlayWeaponTitle');
export const overlayLearnedPill = document.getElementById('overlayLearnedPill');
export const overlayWeaponRow = document.getElementById('overlayWeaponRow');
export const overlayWordsHeader = document.getElementById('overlayWordsHeader');
export const overlayWordsPreview = document.getElementById('overlayWordsPreview');
export const btnStartLevel = document.getElementById('btnStartLevel');
export const labelBtnStartLevel = document.getElementById('labelBtnStartLevel');
export const btnNextLevel = document.getElementById('btnNextLevel');
export const labelBtnNextLevel = document.getElementById('labelBtnNextLevel');
export const btnPracticePinned = document.getElementById('btnPracticePinned');
export const labelPracticePinned = document.getElementById('labelPracticePinned');
export const btnPracticeMistakes = document.getElementById('btnPracticeMistakes');
export const labelPracticeMistakes = document.getElementById('labelPracticeMistakes');
export const btnOverlayCatalog = document.getElementById('btnOverlayCatalog');
export const labelOverlayCatalog = document.getElementById('labelOverlayCatalog');
export const btnBackToTitle = document.getElementById('btnBackToTitle');
export const labelOverlayBackMenu = document.getElementById('labelOverlayBackMenu');

export const levelQuizBox = document.getElementById('levelQuizBox');
export const quizHeaderTitle = document.getElementById('quizHeaderTitle');
export const quizScoreText = document.getElementById('quizScoreText');
export const quizProgressDots = document.getElementById('quizProgressDots');
export const btnQuizSpeak = document.getElementById('btnQuizSpeak');
export const quizQuestionWord = document.getElementById('quizQuestionWord');
export const quizOptionsGrid = document.getElementById('quizOptionsGrid');

// Диалог 3-ступенчатого каталога курсов
export const courseBrowserDialog = document.getElementById('courseBrowserDialog');
export const catalogDialogBody = document.getElementById('catalogDialogBody');
export const catalogDialogTitle = document.getElementById('catalogDialogTitle');
export const btnCloseCatalog = document.getElementById('btnCloseCatalog');
export const tabSourceAll = document.getElementById('tabSourceAll');
export const tabSourceOfficial = document.getElementById('tabSourceOfficial');
export const tabSourceUser = document.getElementById('tabSourceUser');
export const btnOpenAnkiFromCatalog = document.getElementById('btnOpenAnkiFromCatalog');
export const labelImportFromCatalog = document.getElementById('labelImportFromCatalog');
export const catalogCoursesContainer = document.getElementById('catalogCoursesContainer');

// Диалог импорта Anki .apkg и своих слов
export const customWordsDialog = document.getElementById('customWordsDialog');
export const customDialogBody = document.getElementById('customDialogBody');
export const customDialogTitle = document.getElementById('customDialogTitle');
export const btnCloseCustom = document.getElementById('btnCloseCustom');
export const tabImportAnki = document.getElementById('tabImportAnki');
export const tabImportManual = document.getElementById('tabImportManual');
export const importTargetLangLabel = document.getElementById('importTargetLangLabel');
export const ankiImportPane = document.getElementById('ankiImportPane');
export const manualImportPane = document.getElementById('manualImportPane');
export const ankiDropzone = document.getElementById('ankiDropzone');
export const ankiDropTitle = document.getElementById('ankiDropTitle');
export const ankiDropSub = document.getElementById('ankiDropSub');
export const ankiFileInput = document.getElementById('ankiFileInput');
export const btnDownloadSampleApkg = document.getElementById('btnDownloadSampleApkg');
export const ankiParseStatus = document.getElementById('ankiParseStatus');
export const ankiPreviewBox = document.getElementById('ankiPreviewBox');
export const ankiAutoMapBanner = document.getElementById('ankiAutoMapBanner');
export const labelAnkiDeckName = document.getElementById('labelAnkiDeckName');
export const ankiDeckTitleInput = document.getElementById('ankiDeckTitleInput');
export const ankiManualColsDetails = document.getElementById('ankiManualColsDetails');
export const ankiManualColsSummary = document.getElementById('ankiManualColsSummary');
export const labelAnkiFront = document.getElementById('labelAnkiFront');
export const labelAnkiBack = document.getElementById('labelAnkiBack');
export const ankiFrontSelect = document.getElementById('ankiFrontSelect');
export const ankiBackSelect = document.getElementById('ankiBackSelect');
export const btnSwapAnkiCols = document.getElementById('btnSwapAnkiCols');
export const ankiSampleCards = document.getElementById('ankiSampleCards');
export const btnConfirmAnkiImport = document.getElementById('btnConfirmAnkiImport');
export const btnSaveAnkiToDecks = document.getElementById('btnSaveAnkiToDecks');
export const manualDeckTitleInput = document.getElementById('manualDeckTitleInput');
export const customDialogHint = document.getElementById('customDialogHint');
export const customWordsInput = document.getElementById('customWordsInput');
export const btnSaveCustomWords = document.getElementById('btnSaveCustomWords');

// Диалог Gemini 3.8 TTS
export const ttsSettingsDialog = document.getElementById('ttsSettingsDialog');
export const ttsDialogBody = document.getElementById('ttsDialogBody');
export const ttsDialogTitle = document.getElementById('ttsDialogTitle');
export const btnCloseTtsDialog = document.getElementById('btnCloseTtsDialog');
export const ttsStatusBanner = document.getElementById('ttsStatusBanner');
export const ttsEnableLabel = document.getElementById('ttsEnableLabel');
export const btnToggleTtsMaster = document.getElementById('btnToggleTtsMaster');
export const ttsModelLabel = document.getElementById('ttsModelLabel');
export const ttsModelGrid = document.getElementById('ttsModelGrid');
export const ttsModelFlashDesc = document.getElementById('ttsModelFlashDesc');
export const ttsModelLiteDesc = document.getElementById('ttsModelLiteDesc');
export const ttsVoiceLabel = document.getElementById('ttsVoiceLabel');
export const ttsVoiceGrid = document.getElementById('ttsVoiceGrid');
export const btnTestGeminiVoice = document.getElementById('btnTestGeminiVoice');
export const ttsApiKeySummary = document.getElementById('ttsApiKeySummary');
export const ttsApiKeyHint = document.getElementById('ttsApiKeyHint');
export const geminiApiKeyInput = document.getElementById('geminiApiKeyInput');
export const btnSaveApiKey = document.getElementById('btnSaveApiKey');
export const btnClearApiKey = document.getElementById('btnClearApiKey');

// Диалог словаря
export const dictDialog = document.getElementById('dictDialog');
export const dictDialogBody = document.getElementById('dictDialogBody');
export const dictDialogTitle = document.getElementById('dictDialogTitle');
export const btnCloseDict = document.getElementById('btnCloseDict');
export const dictSearchInput = document.getElementById('dictSearchInput');
export const btnDictOnlyPinned = document.getElementById('btnDictOnlyPinned');
export const labelDictPinnedFilter = document.getElementById('labelDictPinnedFilter');
export const dictFullList = document.getElementById('dictFullList');

// --- Z-LINGO 2.0: DOM-элементы Главной панели, страницы «Мои колоды» и Космической Академии ---
export const homeDashboardView = document.getElementById('homeDashboardView');
export const decksPageView = document.getElementById('decksPageView');
export const labelDecksFiltersTitle = document.getElementById('labelDecksFiltersTitle');
export const labelDecksLangHeader = document.getElementById('labelDecksLangHeader');
export const decksCompactLangPills = document.getElementById('decksCompactLangPills');
export const decksCategoryFilterGroup = document.getElementById('decksCategoryFilterGroup');
export const labelDecksLevelHeader = document.getElementById('labelDecksLevelHeader');
export const decksLevelFilterGroup = document.getElementById('decksLevelFilterGroup');
export const btnDecksLevelAll = document.getElementById('btnDecksLevelAll');
export const decksDesktopTabsBar = document.getElementById('decksDesktopTabsBar');
export const btnDesktopTabCourses = document.getElementById('btnDesktopTabCourses');
export const labelDesktopTabCourses = document.getElementById('labelDesktopTabCourses');
export const btnDesktopTabUser = document.getElementById('btnDesktopTabUser');
export const labelDesktopTabUser = document.getElementById('labelDesktopTabUser');
export const btnDesktopFilterAll = document.getElementById('btnDesktopFilterAll');
export const labelDesktopFilterAll = document.getElementById('labelDesktopFilterAll');
export const btnDesktopFilterRecent = document.getElementById('btnDesktopFilterRecent');
export const labelDesktopFilterRecent = document.getElementById('labelDesktopFilterRecent');
export const btnDesktopFilterFav = document.getElementById('btnDesktopFilterFav');
export const labelDesktopFilterFav = document.getElementById('labelDesktopFilterFav');
export const decksQuickFiltersList = document.getElementById('decksQuickFiltersList');
export const btnQuickFilterAll = document.getElementById('btnQuickFilterAll');
export const labelQuickFilterAll = document.getElementById('labelQuickFilterAll');
export const countQuickAll = document.getElementById('countQuickAll');
export const btnQuickFilterCourses = document.getElementById('btnQuickFilterCourses');
export const labelQuickFilterCourses = document.getElementById('labelQuickFilterCourses');
export const countQuickCourses = document.getElementById('countQuickCourses');
export const btnQuickFilterUser = document.getElementById('btnQuickFilterUser');
export const labelQuickFilterUser = document.getElementById('labelQuickFilterUser');
export const countQuickUser = document.getElementById('countQuickUser');
export const btnQuickFilterFav = document.getElementById('btnQuickFilterFav');
export const labelQuickFilterFav = document.getElementById('labelQuickFilterFav');
export const countQuickFav = document.getElementById('countQuickFav');
export const labelDecksRecentTitle = document.getElementById('labelDecksRecentTitle');
export const decksRecentActivityList = document.getElementById('decksRecentActivityList');
export const decksHeroTitle = document.getElementById('decksHeroTitle');
export const decksHeroSubtitle = document.getElementById('decksHeroSubtitle');
export const decksHeroSubtitleMobile = document.getElementById('decksHeroSubtitleMobile');
export const decksSearchInput = document.getElementById('decksSearchInput');
export const btnDecksImportAnki = document.getElementById('btnDecksImportAnki');
export const labelDecksImportAnkiBtn = document.getElementById('labelDecksImportAnkiBtn');
export const btnDecksCreateDeck = document.getElementById('btnDecksCreateDeck');
export const labelDecksCreateBtn = document.getElementById('labelDecksCreateBtn');
export const decksMobileFilterBar = document.getElementById('decksMobileFilterBar');
export const btnMobFilterAll = document.getElementById('btnMobFilterAll');
export const labelMobFilterAll = document.getElementById('labelMobFilterAll');
export const btnMobFilterCourses = document.getElementById('btnMobFilterCourses');
export const labelMobFilterCourses = document.getElementById('labelMobFilterCourses');
export const btnMobFilterUser = document.getElementById('btnMobFilterUser');
export const labelMobFilterUser = document.getElementById('labelMobFilterUser');
export const btnMobFilterFav = document.getElementById('btnMobFilterFav');
export const labelMobFilterFav = document.getElementById('labelMobFilterFav');
export const decksMobileActiveFilterRow = document.getElementById('decksMobileActiveFilterRow');
export const deckContextMenu = document.getElementById('deckContextMenu');
export const labelDecksStatTotal = document.getElementById('labelDecksStatTotal');
export const decksHeroTotalCount = document.getElementById('decksHeroTotalCount');
export const labelDecksStatLearned = document.getElementById('labelDecksStatLearned');
export const decksHeroLearnedCount = document.getElementById('decksHeroLearnedCount');
export const labelDecksStatStreak = document.getElementById('labelDecksStatStreak');
export const decksHeroStreakCount = document.getElementById('decksHeroStreakCount');
export const btnDecksOpenAdmin = document.getElementById('btnDecksOpenAdmin');
export const labelDecksOpenAdmin = document.getElementById('labelDecksOpenAdmin');
export const btnDecksReturnBattle = document.getElementById('btnDecksReturnBattle');
export const labelDecksReturnBattle = document.getElementById('labelDecksReturnBattle');
export const decksOverviewPane = document.getElementById('decksOverviewPane');
export const decksContinueSection = document.getElementById('decksContinueSection');
export const labelDecksContinueHeading = document.getElementById('labelDecksContinueHeading');
export const decksContinueGrid = document.getElementById('decksContinueGrid');
export const labelDecksAllHeading = document.getElementById('labelDecksAllHeading');
export const decksAllCountBadge = document.getElementById('decksAllCountBadge');
export const decksAllGrid = document.getElementById('decksAllGrid');
export const deckDetailPane = document.getElementById('deckDetailPane');

// --- DOM-элементы Студии Супер-Админа (#adminStudioView) ---
export const adminStudioView = document.getElementById('adminStudioView');
export const btnAdminBackToDecks = document.getElementById('btnAdminBackToDecks');
export const btnAdminExportJson = document.getElementById('btnAdminExportJson');
export const btnAdminImportJson = document.getElementById('btnAdminImportJson');
export const adminImportJsonInput = document.getElementById('adminImportJsonInput');
export const btnAdminSyncCloud = document.getElementById('btnAdminSyncCloud');
export const btnAdminLockMode = document.getElementById('btnAdminLockMode');
export const adminGeminiKeyInput = document.getElementById('adminGeminiKeyInput');
export const adminGithubTokenInput = document.getElementById('adminGithubTokenInput');
export const adminPasswordInput = document.getElementById('adminPasswordInput');
export const btnAdminSaveCreds = document.getElementById('btnAdminSaveCreds');
export const adminStatusBanner = document.getElementById('adminStatusBanner');
export const adminLiveCountBadge = document.getElementById('adminLiveCountBadge');
export const adminSourceLangSelect = document.getElementById('adminSourceLangSelect');
export const adminTransLangSelect = document.getElementById('adminTransLangSelect');
export const adminLevelSelect = document.getElementById('adminLevelSelect');
export const adminCategorySelect = document.getElementById('adminCategorySelect');
export const btnAdminToggleNewCat = document.getElementById('btnAdminToggleNewCat');
export const adminIconInput = document.getElementById('adminIconInput');
export const adminNewCategoryBox = document.getElementById('adminNewCategoryBox');
export const adminNewCatIcon = document.getElementById('adminNewCatIcon');
export const adminNewCatTitleRu = document.getElementById('adminNewCatTitleRu');
export const adminNewCatTitleEn = document.getElementById('adminNewCatTitleEn');
export const btnAdminCreateCategory = document.getElementById('btnAdminCreateCategory');
export const adminPlacementModeSelect = document.getElementById('adminPlacementModeSelect');
export const adminAppendTargetWrap = document.getElementById('adminAppendTargetWrap');
export const adminTargetCourseSelect = document.getElementById('adminTargetCourseSelect');
export const adminCourseTitleInput = document.getElementById('adminCourseTitleInput');
export const adminRawWordsTextarea = document.getElementById('adminRawWordsTextarea');
export const adminAiEnrichUiCheck = document.getElementById('adminAiEnrichUiCheck');
export const adminAiCloneTargetsCheck = document.getElementById('adminAiCloneTargetsCheck');
export const adminLiveParseSummary = document.getElementById('adminLiveParseSummary');
export const adminLivePreviewList = document.getElementById('adminLivePreviewList');
export const btnAdminAiPreview = document.getElementById('btnAdminAiPreview');
export const btnAdminCreateAndPublish = document.getElementById('btnAdminCreateAndPublish');
export const adminOrganizerLangTabs = document.getElementById('adminOrganizerLangTabs');
export const adminCategoriesTree = document.getElementById('adminCategoriesTree');

export const homeBrandLogo = document.getElementById('homeBrandLogo');
export const homeBrandSub = document.getElementById('homeBrandSub');
export const btnNavHome = document.getElementById('btnNavHome');
export const btnNavPlay = document.getElementById('btnNavPlay');
export const btnNavDecks = document.getElementById('btnNavDecks');
export const btnNavStats = document.getElementById('btnNavStats');
export const btnNavLeaderboard = document.getElementById('btnNavLeaderboard');
export const btnNavAbout = document.getElementById('btnNavAbout');
export const btnNavAdmin = document.getElementById('btnNavAdmin');
export const labelNavHome = document.getElementById('labelNavHome');
export const labelNavPlay = document.getElementById('labelNavPlay');
export const labelNavDecks = document.getElementById('labelNavDecks');
export const labelNavStats = document.getElementById('labelNavStats');
export const labelNavLeaderboard = document.getElementById('labelNavLeaderboard');
export const labelNavAbout = document.getElementById('labelNavAbout');
export const labelNavAdmin = document.getElementById('labelNavAdmin');
export const aboutPageView = document.getElementById('aboutPageView');
export const btnHomeStreakChip = document.getElementById('btnHomeStreakChip');
export const homeStreakBadge = document.getElementById('homeStreakBadge');
export const pilotRankPill = document.getElementById('pilotRankPill');
export const homeScoreBadge = document.getElementById('homeScoreBadge');
export const navLangDropdownWrap = document.getElementById('navLangDropdownWrap');
export const btnNavLangToggle = document.getElementById('btnNavLangToggle');
export const navLangDropdownMenu = document.getElementById('navLangDropdownMenu');
export const navLangFlag = document.getElementById('navLangFlag');
export const navLangCode = document.getElementById('navLangCode');
export const btnHomeSettings = document.getElementById('btnHomeSettings');

export const labelContinueMission = document.getElementById('labelContinueMission');
export const homeMissionArtwork = document.getElementById('homeMissionArtwork');
export const homeMissionTitle = document.getElementById('homeMissionTitle');
export const homeMissionSubtitle = document.getElementById('homeMissionSubtitle');
export const homeMissionProgFill = document.getElementById('homeMissionProgFill');
export const homeMissionProgText = document.getElementById('homeMissionProgText');
export const btnMissionLaunch = document.getElementById('btnMissionLaunch');
export const labelMissionLaunch = document.getElementById('labelMissionLaunch');
export const btnMissionDailyGoal = document.getElementById('btnMissionDailyGoal');
export const labelDailyGoalTitle = document.getElementById('labelDailyGoalTitle');
export const homeDailyGoalTarget = document.getElementById('homeDailyGoalTarget');
export const homeDailyGoalFill = document.getElementById('homeDailyGoalFill');
export const homeDailyGoalText = document.getElementById('homeDailyGoalText');

export const homeHeroTitleTop = document.getElementById('homeHeroTitleTop');
export const homeHeroTitleAccent = document.getElementById('homeHeroTitleAccent');
export const labelPerkPlay = document.getElementById('labelPerkPlay');
export const labelPerkMemory = document.getElementById('labelPerkMemory');
export const labelPerkAnki = document.getElementById('labelPerkAnki');
export const titleTaglineMobile = document.getElementById('titleTaglineMobile');
export const mobileHeroArtArticle = document.getElementById('mobileHeroArtArticle');
export const mobileHeroArtWord = document.getElementById('mobileHeroArtWord');
export const titleSpaceWindow = document.getElementById('titleSpaceWindow');
export const promoLiveLabel = document.getElementById('promoLiveLabel');
export const promoMonitorBadge = document.getElementById('promoMonitorBadge');
export const promoTargetPill = document.getElementById('promoTargetPill');
export const promoTargetLabel = document.getElementById('promoTargetLabel');
export const promoTargetWordText = document.getElementById('promoTargetWordText');
export const btnPromoWeaponCycle = document.getElementById('btnPromoWeaponCycle');

export const targetLangDropdownWrap = document.getElementById('targetLangDropdownWrap');
export const btnTargetLangDropdown = document.getElementById('btnTargetLangDropdown');
export const targetLangDropdownFlag = document.getElementById('targetLangDropdownFlag');
export const targetLangDropdownName = document.getElementById('targetLangDropdownName');
export const targetLangDropdownMenu = document.getElementById('targetLangDropdownMenu');
export const labelHomeLevelFilter = document.getElementById('labelHomeLevelFilter');
export const homeLevelPills = document.getElementById('homeLevelPills');
export const homeThemeSection = document.getElementById('homeThemeSection');
export const labelHomeThemeFilter = document.getElementById('labelHomeThemeFilter');
export const homeThemeDropdownWrap = document.getElementById('homeThemeDropdownWrap');
export const btnHomeThemeDropdown = document.getElementById('btnHomeThemeDropdown');
export const homeThemeDropdownIcon = document.getElementById('homeThemeDropdownIcon');
export const homeThemeDropdownName = document.getElementById('homeThemeDropdownName');
export const homeThemeDropdownMenu = document.getElementById('homeThemeDropdownMenu');
export const desktopTopicsBar = document.getElementById('desktopTopicsBar');
export const labelDesktopTopics = document.getElementById('labelDesktopTopics');
export const desktopTopicsChips = document.getElementById('desktopTopicsChips');

export const labelHowItWorks = document.getElementById('labelHowItWorks');
export const mobileDiscoverySection = document.getElementById('mobileDiscoverySection');
export const labelMobChooseLevel = document.getElementById('labelMobChooseLevel');
export const mobileLevelCardsList = document.getElementById('mobileLevelCardsList');
export const labelMobChooseTopic = document.getElementById('labelMobChooseTopic');
export const mobileTopicGrid = document.getElementById('mobileTopicGrid');
export const homeStepItem1 = document.getElementById('homeStepItem1');
export const homeStepItem2 = document.getElementById('homeStepItem2');
export const homeStepItem3 = document.getElementById('homeStepItem3');
export const labelStep1 = document.getElementById('labelStep1');
export const labelStep2 = document.getElementById('labelStep2');
export const labelStep3 = document.getElementById('labelStep3');
export const labelMobStep1 = document.getElementById('labelMobStep1');
export const labelMobStep2 = document.getElementById('labelMobStep2');
export const labelMobStep3 = document.getElementById('labelMobStep3');

export const decksFilterCard = document.getElementById('decksFilterCard');
export const btnDecksMobileFilterToggle = document.getElementById('btnDecksMobileFilterToggle');

export const mobileBottomNav = document.getElementById('mobileBottomNav');
export const btnMobNavHome = document.getElementById('btnMobNavHome');
export const btnMobNavPlay = document.getElementById('btnMobNavPlay');
export const btnMobNavDecks = document.getElementById('btnMobNavDecks');
export const btnMobNavStats = document.getElementById('btnMobNavStats');
export const btnMobNavAbout = document.getElementById('btnMobNavAbout');
export const labelMobNavHome = document.getElementById('labelMobNavHome');
export const labelMobNavPlay = document.getElementById('labelMobNavPlay');
export const labelMobNavDecks = document.getElementById('labelMobNavDecks');
export const labelMobNavStats = document.getElementById('labelMobNavStats');
export const labelMobNavAbout = document.getElementById('labelMobNavAbout');

export const labelQuickStartTitle = document.getElementById('labelQuickStartTitle');
export const btnQuickStartAnki = document.getElementById('btnQuickStartAnki');
export const labelQuickAnkiBtn = document.getElementById('labelQuickAnkiBtn');
export const homeQuickStartGrid = document.getElementById('homeQuickStartGrid');

export const labelHomeProgressTitle = document.getElementById('labelHomeProgressTitle');
export const btnOpenStatsCard = document.getElementById('btnOpenStatsCard');
export const homeProgressRingCircle = document.getElementById('homeProgressRingCircle');
export const homeProgressPercent = document.getElementById('homeProgressPercent');
export const labelMetricLearned = document.getElementById('labelMetricLearned');
export const labelMetricDecks = document.getElementById('labelMetricDecks');
export const labelMetricStreak = document.getElementById('labelMetricStreak');
export const homeStatLearned = document.getElementById('homeStatLearned');
export const homeStatDecks = document.getElementById('homeStatDecks');
export const homeStatStreak = document.getElementById('homeStatStreak');

export const labelHomeTopTitle = document.getElementById('labelHomeTopTitle');
export const btnOpenLeaderboardCard = document.getElementById('btnOpenLeaderboardCard');
export const labelSeeAllTop = document.getElementById('labelSeeAllTop');
export const homeLeaderboardMiniList = document.getElementById('homeLeaderboardMiniList');

export const labelFeatCourses = document.getElementById('labelFeatCourses');
export const btnFooterAnki = document.getElementById('btnFooterAnki');
export const labelFeatAnki = document.getElementById('labelFeatAnki');
export const labelFeatSettings = document.getElementById('labelFeatSettings');
export const labelFeatVoice = document.getElementById('labelFeatVoice');

// Боевой экран Академии
export const labelAcademySub = document.getElementById('labelAcademySub');
export const btnHudLangPair = document.getElementById('btnHudLangPair');
export const hudLangPairText = document.getElementById('hudLangPairText');
export const hudRingCircle = document.getElementById('hudRingCircle');
export const btnHudGameSettings = document.getElementById('btnHudGameSettings');
export const btnMobHudWave = document.getElementById('btnMobHudWave');
export const mobHudWaveText = document.getElementById('mobHudWaveText');
export const mobHudProgressText = document.getElementById('mobHudProgressText');
export const btnMobHudPause = document.getElementById('btnMobHudPause');
export const btnMobHudSettings = document.getElementById('btnMobHudSettings');
export const mobileBattleSubbar = document.getElementById('mobileBattleSubbar');
export const labelMobLives = document.getElementById('labelMobLives');
export const mobHudLivesHearts = document.getElementById('mobHudLivesHearts');
export const btnMobHudEmp = document.getElementById('btnMobHudEmp');
export const mobEmpCount = document.getElementById('mobEmpCount');

export const battleArenaFrame = document.getElementById('battleArenaFrame');
export const arenaWavePill = document.getElementById('arenaWavePill');
export const desktopTypingPromptBar = document.getElementById('desktopTypingPromptBar');
export const desktopTypingPreview = document.getElementById('desktopTypingPreview');
export const btnToggleDesktopKbd = document.getElementById('btnToggleDesktopKbd');

export const labelSidebarDecksHeader = document.getElementById('labelSidebarDecksHeader');
export const sidebarActiveDeckCard = document.getElementById('sidebarActiveDeckCard');
export const sidebarDeckThumb = document.getElementById('sidebarDeckThumb');
export const sidebarActiveLessonSub = document.getElementById('sidebarActiveLessonSub');
export const sidebarDeckProgFill = document.getElementById('sidebarDeckProgFill');
export const sidebarDeckProgNum = document.getElementById('sidebarDeckProgNum');
export const sidebarLessonsDrawer = document.getElementById('sidebarLessonsDrawer');
export const labelLessonsDrawerSummary = document.getElementById('labelLessonsDrawerSummary');
export const labelSidebarAnkiBtn = document.getElementById('labelSidebarAnkiBtn');

export const labelStudyModeHeader = document.getElementById('labelStudyModeHeader');
export const studyModeGroup = document.getElementById('studyModeGroup');
export const labelModeType = document.getElementById('labelModeType');
export const labelModeListen = document.getElementById('labelModeListen');
export const labelModeTranslate = document.getElementById('labelModeTranslate');

export const labelSidebarWeaponsHeader = document.getElementById('labelSidebarWeaponsHeader');
export const sidebarWeaponRow = document.getElementById('sidebarWeaponRow');
export const btnSidebarGameSettings = document.getElementById('btnSidebarGameSettings');
export const labelSidebarGameSettings = document.getElementById('labelSidebarGameSettings');

export const labelHitBanner = document.getElementById('labelHitBanner');
export const hitSpotlightCard = document.getElementById('hitSpotlightCard');
export const hitWordArticle = document.getElementById('hitWordArticle');
export const hitWordMain = document.getElementById('hitWordMain');
export const btnHitSpeak = document.getElementById('btnHitSpeak');
export const hitVisualBanner = document.getElementById('hitVisualBanner');
export const hitVisualEmoji = document.getElementById('hitVisualEmoji');
export const hitVisualTag = document.getElementById('hitVisualTag');
export const hitWordTranslation = document.getElementById('hitWordTranslation');
export const btnHitKnow = document.getElementById('btnHitKnow');
export const labelHitKnow = document.getElementById('labelHitKnow');
export const btnHitRepeat = document.getElementById('btnHitRepeat');
export const labelHitRepeat = document.getElementById('labelHitRepeat');

export const labelTodayCaption = document.getElementById('labelTodayCaption');
export const todayLearnedCount = document.getElementById('todayLearnedCount');

// Новые диалоги: Профиль / Настройки игры, Статистика и Рейтинг
export const gameSettingsDialog = document.getElementById('gameSettingsDialog');
export const gameSettingsDialogTitle = document.getElementById('gameSettingsDialogTitle');
export const gameSettingsDialogBody = document.getElementById('gameSettingsDialogBody');
export const btnCloseGameSettings = document.getElementById('btnCloseGameSettings');
export const settingsPilotRankLabel = document.getElementById('settingsPilotRankLabel');
export const settingsPilotSubStats = document.getElementById('settingsPilotSubStats');
export const btnOpenLeaderboardFromSettings = document.getElementById('btnOpenLeaderboardFromSettings');
export const labelSettingsLeaderboardBtn = document.getElementById('labelSettingsLeaderboardBtn');
export const btnOpenStatsFromSettings = document.getElementById('btnOpenStatsFromSettings');
export const labelSettingsStatsBtn = document.getElementById('labelSettingsStatsBtn');
export const labelSettingTargetLang = document.getElementById('labelSettingTargetLang');
export const labelSettingNativeLang = document.getElementById('labelSettingNativeLang');
export const labelSettingWeapon = document.getElementById('labelSettingWeapon');
export const settingsWeaponRow = document.getElementById('settingsWeaponRow');
export const labelSettingSpeed = document.getElementById('labelSettingSpeed');
export const settingsSpeedGroup = document.getElementById('settingsSpeedGroup');
export const labelSettingArticle = document.getElementById('labelSettingArticle');
export const btnSettingsToggleArticle = document.getElementById('btnSettingsToggleArticle');
export const labelSettingDesktopKbd = document.getElementById('labelSettingDesktopKbd');
export const btnSettingsToggleKbd = document.getElementById('btnSettingsToggleKbd');
export const labelSettingVoiceStudio = document.getElementById('labelSettingVoiceStudio');
export const btnOpenVoiceFromSettings = document.getElementById('btnOpenVoiceFromSettings');
export const labelSettingDictBtn = document.getElementById('labelSettingDictBtn');
export const btnOpenDictFromSettings = document.getElementById('btnOpenDictFromSettings');
export const btnOpenAnkiFromSettings = document.getElementById('btnOpenAnkiFromSettings');
export const labelSettingsAnkiBtn = document.getElementById('labelSettingsAnkiBtn');
export const btnOpenAdminFromSettings = document.getElementById('btnOpenAdminFromSettings');
export const labelSettingsAdminBtn = document.getElementById('labelSettingsAdminBtn');

export const statsDialog = document.getElementById('statsDialog');
export const statsDialogTitle = document.getElementById('statsDialogTitle');
export const statsDialogBody = document.getElementById('statsDialogBody');
export const btnCloseStatsDialog = document.getElementById('btnCloseStatsDialog');
export const statsModalGrid = document.getElementById('statsModalGrid');
export const btnOpenLeaderboardFromStats = document.getElementById('btnOpenLeaderboardFromStats');
export const labelOpenLeaderFromStats = document.getElementById('labelOpenLeaderFromStats');

export const leaderboardDialog = document.getElementById('leaderboardDialog');
export const leaderboardDialogTitle = document.getElementById('leaderboardDialogTitle');
export const leaderboardDialogBody = document.getElementById('leaderboardDialogBody');
export const btnCloseLeaderboardDialog = document.getElementById('btnCloseLeaderboardDialog');
export const leaderboardFullList = document.getElementById('leaderboardFullList');
export const labelAchievementsHeading = document.getElementById('labelAchievementsHeading');
export const achievementsGrid = document.getElementById('achievementsGrid');

export const dom = {
  canvas,
  ctx,
  arcadeTitleScreen,
  titleHeaderCard,
  titleBottomDock,
  pilotRankText,
  labelNativeFilter,
  labelTargetFilter,
  arcadeLogoMain,
  arcadeLogoSub,
  titleTagline,
  titleArsenalLabel,
  learnedProgressPill,
  titleWeaponDesc,
  titleWeaponRow,
  titleCourseOriginBadge,
  titleCourseName,
  btnOpenCatalogTitle,
  btnTitleAllCourses,
  labelOpenCatalogTitle,
  titleStageChips,
  btnArcadeLaunch,
  labelArcadeLaunch,
  btnTitleSpeed,
  btnTitleVoice,
  btnTitleDict,
  labelTitleDict,
  btnTitleCustom,
  labelTitleCustom,
  labelPause,
  labelScore,
  labelCombo,
  labelLearnedHud,
  hudLearnedCount,
  labelShield,
  labelCatalogHud,
  labelCustomBtn,
  sidebarOriginBadge,
  sidebarLevelsTitle,
  btnSidebarCatalog,
  btnSidebarAnki,
  sidebarKillsTitle,
  btnDrillPinned,
  pinnedCountBadge,
  legendDer,
  legendDie,
  legendDas,
  legendVerb,
  hudLevelTitle,
  hudProgressBar,
  hudProgressText,
  hudScore,
  hudCombo,
  hudShields,
  empCountEl,
  btnWeaponMode,
  btnEmp,
  btnTargetLangHud,
  btnLangMode,
  btnArticleMode,
  btnSpeedMode,
  btnOpenTtsSettings,
  btnOpenCatalogHud,
  btnOpenCustom,
  btnPause,
  btnHudHome,
  btnQuickLevels,
  btnClearFeed,
  ztypeKeyboard,
  ztypeKeysContainer,
  kbdProgressFill,
  levelListContainer,
  overlayLevelChips,
  totalWordsCounter,
  killFeedContainer,
  bottomTargetPreview,
  centerOverlay,
  overlayCard,
  btnCloseOverlay,
  overlayOriginBadge,
  overlayBadge,
  overlayTitle,
  overlayLessonPill,
  overlayLessonPillLabel,
  overlayDesc,
  ovStatLearnedVal,
  ovStatLearnedLabel,
  ovStatMistakesVal,
  ovStatMistakesLabel,
  ovStatQuizVal,
  ovStatQuizLabel,
  ovStatComboLabel,
  ovStatComboVal,
  overlayLessonStepper,
  overlayWeaponTitle,
  overlayLearnedPill,
  overlayWeaponRow,
  overlayWordsHeader,
  overlayWordsPreview,
  btnStartLevel,
  labelBtnStartLevel,
  btnNextLevel,
  labelBtnNextLevel,
  btnPracticePinned,
  labelPracticePinned,
  btnPracticeMistakes,
  labelPracticeMistakes,
  btnOverlayCatalog,
  labelOverlayCatalog,
  btnBackToTitle,
  labelOverlayBackMenu,
  levelQuizBox,
  quizHeaderTitle,
  quizScoreText,
  quizProgressDots,
  btnQuizSpeak,
  quizQuestionWord,
  quizOptionsGrid,
  courseBrowserDialog,
  catalogDialogBody,
  catalogDialogTitle,
  btnCloseCatalog,
  tabSourceAll,
  tabSourceOfficial,
  tabSourceUser,
  btnOpenAnkiFromCatalog,
  labelImportFromCatalog,
  catalogCoursesContainer,
  customWordsDialog,
  customDialogBody,
  customDialogTitle,
  btnCloseCustom,
  tabImportAnki,
  tabImportManual,
  importTargetLangLabel,
  ankiImportPane,
  manualImportPane,
  ankiDropzone,
  ankiDropTitle,
  ankiDropSub,
  ankiFileInput,
  btnDownloadSampleApkg,
  ankiParseStatus,
  ankiPreviewBox,
  ankiAutoMapBanner,
  labelAnkiDeckName,
  ankiDeckTitleInput,
  ankiManualColsDetails,
  ankiManualColsSummary,
  labelAnkiFront,
  labelAnkiBack,
  ankiFrontSelect,
  ankiBackSelect,
  btnSwapAnkiCols,
  ankiSampleCards,
  btnConfirmAnkiImport,
  btnSaveAnkiToDecks,
  manualDeckTitleInput,
  customDialogHint,
  customWordsInput,
  btnSaveCustomWords,
  ttsSettingsDialog,
  ttsDialogBody,
  ttsDialogTitle,
  btnCloseTtsDialog,
  ttsStatusBanner,
  ttsEnableLabel,
  btnToggleTtsMaster,
  ttsModelLabel,
  ttsModelGrid,
  ttsModelFlashDesc,
  ttsModelLiteDesc,
  ttsVoiceLabel,
  ttsVoiceGrid,
  btnTestGeminiVoice,
  ttsApiKeySummary,
  ttsApiKeyHint,
  geminiApiKeyInput,
  btnSaveApiKey,
  btnClearApiKey,
  dictDialog,
  dictDialogBody,
  dictDialogTitle,
  btnCloseDict,
  dictSearchInput,
  btnDictOnlyPinned,
  labelDictPinnedFilter,
  dictFullList,
  homeDashboardView,
  decksPageView,
  labelDecksFiltersTitle,
  labelDecksLangHeader,
  decksCompactLangPills,
  decksCategoryFilterGroup,
  labelDecksLevelHeader,
  decksLevelFilterGroup,
  btnDecksLevelAll,
  decksDesktopTabsBar,
  btnDesktopTabCourses,
  labelDesktopTabCourses,
  btnDesktopTabUser,
  labelDesktopTabUser,
  btnDesktopFilterAll,
  labelDesktopFilterAll,
  btnDesktopFilterRecent,
  labelDesktopFilterRecent,
  btnDesktopFilterFav,
  labelDesktopFilterFav,
  decksQuickFiltersList,
  btnQuickFilterAll,
  labelQuickFilterAll,
  countQuickAll,
  btnQuickFilterCourses,
  labelQuickFilterCourses,
  countQuickCourses,
  btnQuickFilterUser,
  labelQuickFilterUser,
  countQuickUser,
  btnQuickFilterFav,
  labelQuickFilterFav,
  countQuickFav,
  labelDecksRecentTitle,
  decksRecentActivityList,
  decksHeroTitle,
  decksHeroSubtitle,
  decksHeroSubtitleMobile,
  decksSearchInput,
  btnDecksImportAnki,
  labelDecksImportAnkiBtn,
  btnDecksCreateDeck,
  labelDecksCreateBtn,
  decksMobileFilterBar,
  btnMobFilterAll,
  labelMobFilterAll,
  btnMobFilterCourses,
  labelMobFilterCourses,
  btnMobFilterUser,
  labelMobFilterUser,
  btnMobFilterFav,
  labelMobFilterFav,
  decksMobileActiveFilterRow,
  deckContextMenu,
  labelDecksStatTotal,
  decksHeroTotalCount,
  labelDecksStatLearned,
  decksHeroLearnedCount,
  labelDecksStatStreak,
  decksHeroStreakCount,
  btnDecksOpenAdmin,
  labelDecksOpenAdmin,
  btnDecksReturnBattle,
  labelDecksReturnBattle,
  decksOverviewPane,
  decksContinueSection,
  labelDecksContinueHeading,
  decksContinueGrid,
  labelDecksAllHeading,
  decksAllCountBadge,
  decksAllGrid,
  deckDetailPane,
  adminStudioView,
  btnAdminBackToDecks,
  btnAdminExportJson,
  btnAdminImportJson,
  adminImportJsonInput,
  btnAdminSyncCloud,
  btnAdminLockMode,
  adminGeminiKeyInput,
  adminGithubTokenInput,
  adminPasswordInput,
  btnAdminSaveCreds,
  adminStatusBanner,
  adminLiveCountBadge,
  adminSourceLangSelect,
  adminTransLangSelect,
  adminLevelSelect,
  adminCategorySelect,
  btnAdminToggleNewCat,
  adminIconInput,
  adminNewCategoryBox,
  adminNewCatIcon,
  adminNewCatTitleRu,
  adminNewCatTitleEn,
  btnAdminCreateCategory,
  adminPlacementModeSelect,
  adminAppendTargetWrap,
  adminTargetCourseSelect,
  adminCourseTitleInput,
  adminRawWordsTextarea,
  adminAiEnrichUiCheck,
  adminAiCloneTargetsCheck,
  adminLiveParseSummary,
  adminLivePreviewList,
  btnAdminAiPreview,
  btnAdminCreateAndPublish,
  adminOrganizerLangTabs,
  adminCategoriesTree,
  homeBrandLogo,
  homeBrandSub,
  btnNavHome,
  btnNavPlay,
  btnNavDecks,
  btnNavStats,
  btnNavLeaderboard,
  btnNavAbout,
  btnNavAdmin,
  labelNavHome,
  labelNavPlay,
  labelNavDecks,
  labelNavStats,
  labelNavLeaderboard,
  labelNavAbout,
  labelNavAdmin,
  aboutPageView,
  btnHomeStreakChip,
  homeStreakBadge,
  pilotRankPill,
  homeScoreBadge,
  navLangDropdownWrap,
  btnNavLangToggle,
  navLangDropdownMenu,
  navLangFlag,
  navLangCode,
  btnHomeSettings,
  labelContinueMission,
  homeMissionArtwork,
  homeMissionTitle,
  homeMissionSubtitle,
  homeMissionProgFill,
  homeMissionProgText,
  btnMissionLaunch,
  labelMissionLaunch,
  btnMissionDailyGoal,
  labelDailyGoalTitle,
  homeDailyGoalTarget,
  homeDailyGoalFill,
  homeDailyGoalText,
  homeHeroTitleTop,
  homeHeroTitleAccent,
  labelPerkPlay,
  labelPerkMemory,
  labelPerkAnki,
  titleTaglineMobile,
  mobileHeroArtArticle,
  mobileHeroArtWord,
  titleSpaceWindow,
  promoLiveLabel,
  promoMonitorBadge,
  promoTargetPill,
  promoTargetLabel,
  promoTargetWordText,
  btnPromoWeaponCycle,
  targetLangDropdownWrap,
  btnTargetLangDropdown,
  targetLangDropdownFlag,
  targetLangDropdownName,
  targetLangDropdownMenu,
  labelHomeLevelFilter,
  homeLevelPills,
  homeThemeSection,
  labelHomeThemeFilter,
  homeThemeDropdownWrap,
  btnHomeThemeDropdown,
  homeThemeDropdownIcon,
  homeThemeDropdownName,
  homeThemeDropdownMenu,
  desktopTopicsBar,
  labelDesktopTopics,
  desktopTopicsChips,
  labelHowItWorks,
  mobileDiscoverySection,
  labelMobChooseLevel,
  mobileLevelCardsList,
  labelMobChooseTopic,
  mobileTopicGrid,
  homeStepItem1,
  homeStepItem2,
  homeStepItem3,
  labelStep1,
  labelStep2,
  labelStep3,
  labelMobStep1,
  labelMobStep2,
  labelMobStep3,
  decksFilterCard,
  btnDecksMobileFilterToggle,
  mobileBottomNav,
  btnMobNavHome,
  btnMobNavPlay,
  btnMobNavDecks,
  btnMobNavStats,
  btnMobNavAbout,
  labelMobNavHome,
  labelMobNavPlay,
  labelMobNavDecks,
  labelMobNavStats,
  labelMobNavAbout,
  labelQuickStartTitle,
  btnQuickStartAnki,
  labelQuickAnkiBtn,
  homeQuickStartGrid,
  labelHomeProgressTitle,
  btnOpenStatsCard,
  homeProgressRingCircle,
  homeProgressPercent,
  labelMetricLearned,
  labelMetricDecks,
  labelMetricStreak,
  homeStatLearned,
  homeStatDecks,
  homeStatStreak,
  labelHomeTopTitle,
  btnOpenLeaderboardCard,
  labelSeeAllTop,
  homeLeaderboardMiniList,
  labelFeatCourses,
  btnFooterAnki,
  labelFeatAnki,
  labelFeatSettings,
  labelFeatVoice,
  labelAcademySub,
  btnHudLangPair,
  hudLangPairText,
  hudRingCircle,
  btnHudGameSettings,
  btnMobHudWave,
  mobHudWaveText,
  mobHudProgressText,
  btnMobHudPause,
  btnMobHudSettings,
  mobileBattleSubbar,
  labelMobLives,
  mobHudLivesHearts,
  btnMobHudEmp,
  mobEmpCount,
  battleArenaFrame,
  arenaWavePill,
  desktopTypingPromptBar,
  desktopTypingPreview,
  btnToggleDesktopKbd,
  labelSidebarDecksHeader,
  sidebarActiveDeckCard,
  sidebarDeckThumb,
  sidebarActiveLessonSub,
  sidebarDeckProgFill,
  sidebarDeckProgNum,
  sidebarLessonsDrawer,
  labelLessonsDrawerSummary,
  labelSidebarAnkiBtn,
  labelStudyModeHeader,
  studyModeGroup,
  labelModeType,
  labelModeListen,
  labelModeTranslate,
  labelSidebarWeaponsHeader,
  sidebarWeaponRow,
  btnSidebarGameSettings,
  labelSidebarGameSettings,
  labelHitBanner,
  hitSpotlightCard,
  hitWordArticle,
  hitWordMain,
  btnHitSpeak,
  hitVisualBanner,
  hitVisualEmoji,
  hitVisualTag,
  hitWordTranslation,
  btnHitKnow,
  labelHitKnow,
  btnHitRepeat,
  labelHitRepeat,
  labelTodayCaption,
  todayLearnedCount,
  gameSettingsDialog,
  gameSettingsDialogTitle,
  gameSettingsDialogBody,
  btnCloseGameSettings,
  settingsPilotRankLabel,
  settingsPilotSubStats,
  btnOpenLeaderboardFromSettings,
  labelSettingsLeaderboardBtn,
  btnOpenStatsFromSettings,
  labelSettingsStatsBtn,
  labelSettingTargetLang,
  labelSettingNativeLang,
  labelSettingWeapon,
  settingsWeaponRow,
  labelSettingSpeed,
  settingsSpeedGroup,
  labelSettingArticle,
  btnSettingsToggleArticle,
  labelSettingDesktopKbd,
  btnSettingsToggleKbd,
  labelSettingVoiceStudio,
  btnOpenVoiceFromSettings,
  labelSettingDictBtn,
  btnOpenDictFromSettings,
  btnOpenAnkiFromSettings,
  labelSettingsAnkiBtn,
  btnOpenAdminFromSettings,
  labelSettingsAdminBtn,
  statsDialog,
  statsDialogTitle,
  statsDialogBody,
  btnCloseStatsDialog,
  statsModalGrid,
  btnOpenLeaderboardFromStats,
  labelOpenLeaderFromStats,
  leaderboardDialog,
  leaderboardDialogTitle,
  leaderboardDialogBody,
  btnCloseLeaderboardDialog,
  leaderboardFullList,
  labelAchievementsHeading,
  achievementsGrid
};
