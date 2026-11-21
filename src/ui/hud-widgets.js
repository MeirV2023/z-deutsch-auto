// Виджеты Главного дашборда, карточка попадания, сайдбар уроков и лента сбитых слов (SRP)
import { actions } from '../core/events.js';
import { escapeHtml } from '../core/utils.js';
import { getArticleStyle } from '../config/constants.js';
import { ttsManager } from '../services/tts-service.js';
import {
  DAILY_GOAL_WORDS,
  dailyProgress,
  getLocalizedField,
  getNextLockedWeapon,
  getPinnedEntriesForTargetLang,
  getWeaponName,
  getWordTranslation,
  isEntryPinned,
  isRtlTranslation,
  learnedWordsSet,
  state,
  t,
  todayLearnedSet,
  togglePinWord
} from '../state/store.js';
import {
  countLearnedWordsInCourse,
  courseMatchesLevelFilter,
  getActiveSelection,
  getAllWordsInCourse,
  getCourseVisualTheme,
  getCoursesForTargetLang,
  getMergedLeaderboardEntries,
  inferCourseCategory,
  resolveLessonBaseWords
} from '../domain/catalog-service.js';
import {
  arenaWavePill,
  bottomTargetPreview,
  btnDrillPinned,
  btnEmp,
  btnHitRepeat,
  btnMobHudEmp,
  btnOpenCatalogTitle,
  btnPracticePinned,
  desktopTopicsChips,
  desktopTypingPreview,
  empCountEl,
  hitSpotlightCard,
  hitVisualEmoji,
  hitVisualTag,
  hitWordArticle,
  hitWordMain,
  hitWordTranslation,
  homeDailyGoalFill,
  homeDailyGoalTarget,
  homeDailyGoalText,
  homeLeaderboardMiniList,
  homeLevelPills,
  homeMissionArtwork,
  homeMissionProgFill,
  homeMissionProgText,
  homeMissionSubtitle,
  homeMissionTitle,
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
  labelContinueMission,
  labelDailyGoalTitle,
  labelDesktopTopics,
  labelHomeLevelFilter,
  labelMissionLaunch,
  labelMobChooseLevel,
  labelMobChooseTopic,
  labelMobLives,
  mobEmpCount,
  mobHudLivesHearts,
  mobHudProgressText,
  mobHudWaveText,
  mobileLevelCardsList,
  mobileTopicGrid,
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
  promoTargetLabel,
  promoTargetPill,
  promoTargetWordText,
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


export function getLangFlagSvg(code) {
  switch (code) {
    case 'de':
      return `<svg class="svg-flag-icon" viewBox="0 0 24 16" aria-hidden="true"><clipPath id="flgDe"><rect width="24" height="16" rx="3"/></clipPath><g clip-path="url(#flgDe)"><rect width="24" height="5.4" y="0" fill="#111827"/><rect width="24" height="5.4" y="5.3" fill="#dc2626"/><rect width="24" height="5.4" y="10.6" fill="#facc15"/></g></svg>`;
    case 'en':
      return `<svg class="svg-flag-icon" viewBox="0 0 24 16" aria-hidden="true"><clipPath id="flgEn"><rect width="24" height="16" rx="3"/></clipPath><g clip-path="url(#flgEn)"><rect width="24" height="16" fill="#1e3a8a"/><path d="M0 0l24 16M24 0L0 16" stroke="#ffffff" stroke-width="3.2"/><path d="M0 0l24 16M24 0L0 16" stroke="#dc2626" stroke-width="1.6"/><path d="M12 0v16M0 8h24" stroke="#ffffff" stroke-width="5"/><path d="M12 0v16M0 8h24" stroke="#dc2626" stroke-width="3"/></g></svg>`;
    case 'es':
      return `<svg class="svg-flag-icon" viewBox="0 0 24 16" aria-hidden="true"><clipPath id="flgEs"><rect width="24" height="16" rx="3"/></clipPath><g clip-path="url(#flgEs)"><rect width="24" height="16" fill="#dc2626"/><rect width="24" height="8" y="4" fill="#facc15"/><circle cx="7.5" cy="8" r="1.9" fill="#b45309"/></g></svg>`;
    case 'ru':
      return `<svg class="svg-flag-icon" viewBox="0 0 24 16" aria-hidden="true"><clipPath id="flgRu"><rect width="24" height="16" rx="3"/></clipPath><g clip-path="url(#flgRu)"><rect width="24" height="5.4" y="0" fill="#f8fafc"/><rect width="24" height="5.4" y="5.3" fill="#2563eb"/><rect width="24" height="5.4" y="10.6" fill="#dc2626"/></g></svg>`;
    case 'he':
      return `<svg class="svg-flag-icon" viewBox="0 0 24 16" aria-hidden="true"><clipPath id="flgHe"><rect width="24" height="16" rx="3"/></clipPath><g clip-path="url(#flgHe)"><rect width="24" height="16" fill="#f8fafc"/><rect width="24" height="2.4" y="2" fill="#2563eb"/><rect width="24" height="2.4" y="11.6" fill="#2563eb"/><path d="M12 5.2l2.3 4H9.7l2.3-4Zm0 5.6l-2.3-4h4.6l-2.3 4Z" fill="none" stroke="#1d4ed8" stroke-width="0.9"/></g></svg>`;
    default:
      return `<svg class="svg-flag-icon" viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" rx="3" fill="#1e293b"/></svg>`;
  }
}

function getMissionArtworkSvg(course) {
  const isUser = course && course.source === 'user';
  const cat = isUser ? 'anki' : inferCourseCategory(course);
  if (cat === 'auto') {
    return `<svg class="mission-art-svg" viewBox="0 0 134 134" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="mSkyAuto" x1="67" y1="0" x2="67" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#1d4ed8"/>
          <stop offset="65%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#93c5fd"/>
        </linearGradient>
        <linearGradient id="mCarAuto" x1="36" y1="62" x2="98" y2="112" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#93c5fd"/>
          <stop offset="45%" stop-color="#2563eb"/>
          <stop offset="100%" stop-color="#1e3a8a"/>
        </linearGradient>
      </defs>
      <rect width="134" height="134" fill="url(#mSkyAuto)"/>
      <circle cx="96" cy="24" r="14" fill="#fef08a" fill-opacity="0.45"/>
      <ellipse cx="32" cy="28" rx="22" ry="9" fill="#ffffff" fill-opacity="0.72"/>
      <ellipse cx="96" cy="34" rx="26" ry="8" fill="#ffffff" fill-opacity="0.62"/>
      <path d="M0 78L28 46l24 22 26-26 30 22 26-16v42H0V78Z" fill="#1e40af" fill-opacity="0.48"/>
      <path d="M0 84L38 68l36 8 60-14v72H0V84Z" fill="#15803d"/>
      <path d="M46 74L12 134h110L88 74H46Z" fill="#1e293b"/>
      <path d="M65 77h4l3 57h-10l3-57Z" fill="#e2e8f0" fill-opacity="0.82"/>
      <ellipse cx="67" cy="112" rx="34" ry="8" fill="#020617" fill-opacity="0.58"/>
      <path d="M35 90l9-18c2-4 7-6 13-6h20c6 0 11 2 13 6l9 18c3 2 5 5 5 9v8c0 3-2 5-5 5H35c-3 0-5-2-5-5v-8c0-4 2-7 5-9Z" fill="url(#mCarAuto)" stroke="#bfdbfe" stroke-width="1.4"/>
      <path d="M46 75h42l6 13H40l6-13Z" fill="#0f172a" stroke="#60a5fa" stroke-width="1"/>
      <rect x="35" y="95" width="12" height="5" rx="2.5" fill="#fef08a"/>
      <rect x="87" y="95" width="12" height="5" rx="2.5" fill="#fef08a"/>
      <rect x="55" y="97" width="24" height="6" rx="2" fill="#0f172a"/>
    </svg>`;
  }
  if (cat === 'business') {
    return `<svg class="mission-art-svg" viewBox="0 0 134 134" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="mSkyBiz" x1="0" y1="0" x2="134" y2="134" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#1e1b4b"/><stop offset="60%" stop-color="#312e81"/><stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="mCaseBiz" x1="30" y1="54" x2="104" y2="112" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
      </defs>
      <rect width="134" height="134" fill="url(#mSkyBiz)"/>
      <rect x="14" y="34" width="22" height="100" rx="2" fill="#1e293b" fill-opacity="0.72"/>
      <rect x="44" y="20" width="28" height="114" rx="2" fill="#1e293b" fill-opacity="0.86"/>
      <rect x="82" y="42" width="26" height="92" rx="2" fill="#1e293b" fill-opacity="0.74"/>
      <path d="M54 54v-7a5 5 0 0 1 5-5h16a5 5 0 0 1 5 5v7" stroke="#fde68a" stroke-width="4" stroke-linecap="round"/>
      <rect x="28" y="54" width="78" height="54" rx="10" fill="url(#mCaseBiz)" stroke="#fde68a" stroke-width="1.6"/>
      <path d="M28 74h78" stroke="#78350f" stroke-width="2.5"/>
      <rect x="61" y="69" width="12" height="10" rx="3" fill="#fef08a"/>
    </svg>`;
  }
  if (cat === 'it') {
    return `<svg class="mission-art-svg" viewBox="0 0 134 134" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="mSkyIt" x1="0" y1="0" x2="134" y2="134" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#1e1b4b"/><stop offset="55%" stop-color="#0e7490"/><stop offset="100%" stop-color="#090d1f"/>
        </linearGradient>
      </defs>
      <rect width="134" height="134" fill="url(#mSkyIt)"/>
      <rect x="24" y="32" width="86" height="58" rx="8" fill="#0f172a" stroke="#67e8f9" stroke-width="2"/>
      <rect x="30" y="38" width="74" height="46" rx="4" fill="#1e293b"/>
      <path d="M52 55l-9 7 9 7M82 55l9 7-9 7M70 52l-6 20" stroke="#38bdf8" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14 96h106l-7 12H21l-7-12Z" fill="#64748b" stroke="#cbd5e1" stroke-width="1.2"/>
    </svg>`;
  }
  if (cat === 'travel') {
    return `<svg class="mission-art-svg" viewBox="0 0 134 134" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="mSkyTrv" x1="67" y1="0" x2="67" y2="134" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#1d4ed8"/><stop offset="65%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0c4a6e"/>
        </linearGradient>
      </defs>
      <rect width="134" height="134" fill="url(#mSkyTrv)"/>
      <ellipse cx="32" cy="92" rx="28" ry="12" fill="#e0f2fe" fill-opacity="0.35"/>
      <ellipse cx="98" cy="100" rx="30" ry="13" fill="#e0f2fe" fill-opacity="0.4"/>
      <path d="M26 78l78-36-22 44-16-8-14 14-2-20-24 6Z" fill="#f8fafc" stroke="#7dd3fc" stroke-width="1.6" stroke-linejoin="round"/>
    </svg>`;
  }
  if (cat === 'food') {
    return `<svg class="mission-art-svg" viewBox="0 0 134 134" fill="none" aria-hidden="true">
      <rect width="134" height="134" fill="#1e1b4b"/>
      <circle cx="67" cy="67" r="44" fill="#f43f5e" fill-opacity="0.18"/>
      <path d="M40 58c-6 0-11-5-11-12s6-12 13-11c4-8 14-12 25-12s21 4 25 12c7-1 13 4 13 11s-5 12-11 12v14H40V58Z" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
      <rect x="38" y="72" width="58" height="14" rx="4" fill="#cbd5e1"/>
      <path d="M32 98h70" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  }
  if (cat === 'finance') {
    return `<svg class="mission-art-svg" viewBox="0 0 134 134" fill="none" aria-hidden="true">
      <rect width="134" height="134" fill="#064e3b"/>
      <ellipse cx="56" cy="96" rx="22" ry="7" fill="#d97706"/>
      <ellipse cx="56" cy="86" rx="22" ry="7" fill="#f59e0b"/>
      <ellipse cx="56" cy="76" rx="22" ry="7" fill="#fbbf24"/>
      <ellipse cx="82" cy="88" rx="20" ry="6.5" fill="#d97706"/>
      <ellipse cx="82" cy="78" rx="20" ry="6.5" fill="#fbbf24"/>
      <ellipse cx="82" cy="68" rx="20" ry="6.5" fill="#fde047"/>
      <path d="M26 52l26-18 18 10 34-22" stroke="#34d399" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }
  if (cat === 'anki') {
    return `<svg class="mission-art-svg" viewBox="0 0 134 134" fill="none" aria-hidden="true">
      <rect width="134" height="134" fill="#31105f"/>
      <rect x="34" y="34" width="66" height="72" rx="12" transform="rotate(-7 67 70)" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <rect x="36" y="32" width="66" height="72" rx="12" fill="#0f172a" stroke="#c084fc" stroke-width="2.2"/>
      <path d="M69 48l5.5 11.2 12.3 1.8-8.9 8.7 2.1 12.3L69 76.2 58 82l2.1-12.3-8.9-8.7 12.3-1.8L69 48Z" fill="#fde047"/>
    </svg>`;
  }
  return `<svg class="mission-art-svg" viewBox="0 0 134 134" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="mSkyBase" x1="67" y1="0" x2="67" y2="134" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#0c4a6e"/><stop offset="65%" stop-color="#0f766e"/><stop offset="100%" stop-color="#064e3b"/>
      </linearGradient>
    </defs>
    <rect width="134" height="134" fill="url(#mSkyBase)"/>
    <circle cx="96" cy="30" r="16" fill="#fde047" fill-opacity="0.35"/>
    <path d="M67 104V58" stroke="#4ade80" stroke-width="5" stroke-linecap="round"/>
    <path d="M67 66c0-20-16-28-30-26 2 16 14 28 30 26Z" fill="#4ade80"/>
    <path d="M67 60c0-22 18-30 32-27-2 17-15 29-32 27Z" fill="#22c55e"/>
    <ellipse cx="67" cy="108" rx="34" ry="8" fill="#022c22" fill-opacity="0.65"/>
  </svg>`;
}

function getCourseCardIconSvg(course) {
  const isUser = course && course.source === 'user';
  const cat = isUser ? 'anki' : inferCourseCategory(course);
  switch (cat) {
    case 'auto':
      return `<svg class="qs-svg-icon" viewBox="0 0 64 52" fill="none" aria-hidden="true">
        <ellipse cx="32" cy="44" rx="22" ry="4" fill="#020617" fill-opacity="0.55"/>
        <path d="M12 27l6-11c1.5-2.5 4.5-4 8-4h12c3.5 0 6.5 1.5 8 4l6 11c2.5 1.2 4 3.5 4 6v6a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3v-6c0-2.5 1.5-4.8 4-6Z" fill="#2563eb" stroke="#93c5fd" stroke-width="1.6"/>
        <path d="M18 16h28l4 9H14l4-9Z" fill="#0f172a" stroke="#60a5fa" stroke-width="1.2"/>
        <rect x="12" y="30" width="8" height="4" rx="2" fill="#fef08a"/>
        <rect x="44" y="30" width="8" height="4" rx="2" fill="#fef08a"/>
        <circle cx="17" cy="41" r="4" fill="#0f172a" stroke="#94a3b8" stroke-width="1.5"/>
        <circle cx="47" cy="41" r="4" fill="#0f172a" stroke="#94a3b8" stroke-width="1.5"/>
      </svg>`;
    case 'business':
      return `<svg class="qs-svg-icon" viewBox="0 0 64 52" fill="none" aria-hidden="true">
        <path d="M23 15v-3.5A3.5 3.5 0 0 1 26.5 8h11A3.5 3.5 0 0 1 41 11.5V15" stroke="#fcd34d" stroke-width="3" stroke-linecap="round"/>
        <rect x="11" y="15" width="42" height="30" rx="6" fill="#d97706" stroke="#fde68a" stroke-width="1.6"/>
        <path d="M11 26h42" stroke="#78350f" stroke-width="2"/>
        <rect x="28" y="23" width="8" height="6" rx="2" fill="#fef08a"/>
      </svg>`;
    case 'base':
      return `<svg class="qs-svg-icon" viewBox="0 0 64 52" fill="none" aria-hidden="true">
        <path d="M32 44V22" stroke="#4ade80" stroke-width="4" stroke-linecap="round"/>
        <path d="M32 28c0-13-11-19-20-17 1 11 9 18 20 17Z" fill="#4ade80" stroke="#bbf7d0" stroke-width="1.2"/>
        <path d="M32 24c0-14 12-20 21-18-1 12-10 19-21 18Z" fill="#22c55e" stroke="#86efac" stroke-width="1.2"/>
      </svg>`;
    case 'it':
      return `<svg class="qs-svg-icon" viewBox="0 0 64 52" fill="none" aria-hidden="true">
        <rect x="12" y="10" width="40" height="27" rx="4" fill="#1e293b" stroke="#93c5fd" stroke-width="1.8"/>
        <rect x="16" y="14" width="32" height="19" rx="2" fill="#0f172a"/>
        <path d="M26 20l-5 3.5 5 3.5M38 20l5 3.5-5 3.5M33.5 18l-3 11" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 40h50l-3 5H10l-3-5Z" fill="#64748b"/>
      </svg>`;
    case 'finance':
      return `<svg class="qs-svg-icon" viewBox="0 0 64 52" fill="none" aria-hidden="true">
        <ellipse cx="26" cy="39" rx="12" ry="4" fill="#d97706"/>
        <ellipse cx="26" cy="33" rx="12" ry="4" fill="#f59e0b"/>
        <ellipse cx="26" cy="27" rx="12" ry="4" fill="#fbbf24" stroke="#fef08a" stroke-width="1"/>
        <ellipse cx="39" cy="35" rx="11" ry="3.8" fill="#d97706"/>
        <ellipse cx="39" cy="29" rx="11" ry="3.8" fill="#f59e0b"/>
        <ellipse cx="39" cy="23" rx="11" ry="3.8" fill="#fde047" stroke="#fef9c3" stroke-width="1"/>
      </svg>`;
    case 'food':
      return `<svg class="qs-svg-icon" viewBox="0 0 64 52" fill="none" aria-hidden="true">
        <path d="M18 28c-4 0-7-3-7-7s4-7 8-6.5C21 10 26 8 32 8s11 2 13 6.5c4-.5 8 2.5 8 6.5s-3 7-7 7v9H18v-9Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
        <rect x="17" y="36" width="30" height="7" rx="2.5" fill="#cbd5e1"/>
      </svg>`;
    case 'travel':
      return `<svg class="qs-svg-icon" viewBox="0 0 64 52" fill="none" aria-hidden="true">
        <path d="M10 30l42-18-13 26-9-4.5-8 8-1-11-11 2.5Z" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>`;
    case 'anki':
      return `<svg class="qs-svg-icon" viewBox="0 0 64 52" fill="none" aria-hidden="true">
        <rect x="18" y="8" width="28" height="34" rx="5" transform="rotate(-7 32 25)" fill="#1e293b" stroke="#38bdf8" stroke-width="1.6"/>
        <rect x="18" y="10" width="28" height="34" rx="5" fill="#0f172a" stroke="#c084fc" stroke-width="1.8"/>
        <path d="M32 18l2.6 5.4 6 .8-4.4 4.2 1 6L32 31.6 26.8 34.4l1-6-4.4-4.2 6-.8L32 18Z" fill="#fde047"/>
      </svg>`;
    default:
      return `<svg class="qs-svg-icon" viewBox="0 0 64 52" fill="none" aria-hidden="true">
        <circle cx="32" cy="26" r="16" fill="#0ea5e9" fill-opacity="0.22" stroke="#38bdf8" stroke-width="2"/>
        <ellipse cx="32" cy="26" rx="7" ry="16" stroke="#7dd3fc" stroke-width="1.4"/>
        <path d="M17 21h30M17 31h30" stroke="#7dd3fc" stroke-width="1.4"/>
      </svg>`;
  }
}

function getTopicChipIconSvg(cat) {
  switch (cat) {
    case 'auto':
      return `<svg class="topic-chip-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 13l2.5-5.5c.7-1.4 2-2.2 3.5-2.2h4c1.5 0 2.8.8 3.5 2.2L20 13c1 .6 1.5 1.5 1.5 2.6V18a1.5 1.5 0 0 1-1.5 1.5h-1.5v-1.5h-13v1.5H4A1.5 1.5 0 0 1 2.5 18v-2.4c0-1.1.5-2 1.5-2.6Z" fill="#38bdf8"/><circle cx="7" cy="14.5" r="1.2" fill="#082f49"/><circle cx="17" cy="14.5" r="1.2" fill="#082f49"/></svg>`;
    case 'business':
      return `<svg class="topic-chip-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" stroke="#fcd34d" stroke-width="1.8"/><rect x="3.5" y="7" width="17" height="12.5" rx="2.5" fill="#f59e0b"/><path d="M3.5 12h17" stroke="#78350f" stroke-width="1.4"/></svg>`;
    case 'travel':
      return `<svg class="topic-chip-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.5 14l16.5-7-5.2 10.5-3.6-1.8-3.2 3.2-.5-4.3L3.5 14Z" fill="#60a5fa" stroke="#bfdbfe" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
    case 'food':
      return `<svg class="topic-chip-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.5 13a3.5 3.5 0 0 1-.5-6.9 4.5 4.5 0 0 1 12 0A3.5 3.5 0 0 1 17.5 13v4.5h-11V13Z" fill="#f1f5f9"/><rect x="6" y="17" width="12" height="2.8" rx="1" fill="#cbd5e1"/></svg>`;
    case 'finance':
      return `<svg class="topic-chip-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><ellipse cx="10" cy="17" rx="5.5" ry="2.2" fill="#d97706"/><ellipse cx="10" cy="13.5" rx="5.5" ry="2.2" fill="#f59e0b"/><ellipse cx="10" cy="10" rx="5.5" ry="2.2" fill="#fde047"/><ellipse cx="15.5" cy="15.5" rx="4.5" ry="1.8" fill="#f59e0b"/><ellipse cx="15.5" cy="12" rx="4.5" ry="1.8" fill="#fde047"/></svg>`;
    default:
      return `<svg class="topic-chip-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10.5L12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H14v-5h-4v5H5.5A1.5 1.5 0 0 1 4 19v-8.5Z" fill="#a78bfa"/></svg>`;
  }
}

function getLeaderboardCrownSvg(rank) {
  const color = rank === 1 ? '#fde047' : (rank === 2 ? '#e2e8f0' : '#f59e0b');
  return `<svg class="leader-crown-svg" viewBox="0 0 24 20" fill="none" aria-hidden="true"><path d="M2.5 16L4 6l5 4.5L12 3l3 7.5L20 6l1.5 10h-19Z" fill="${color}"/></svg>`;
}

function getPilotAvatarSvg(idx, isYou) {
  const palettes = [
    { bg: '#1e3a8a', hair: '#475569', shirt: '#3b82f6' },
    { bg: '#581c87', hair: '#7c2d12', shirt: '#ec4899' },
    { bg: '#0f766e', hair: '#1e293b', shirt: '#38bdf8' }
  ];
  const p = isYou ? palettes[2] : palettes[idx % palettes.length];
  return `<svg class="leader-avatar-svg" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="16" cy="16" r="15" fill="${p.bg}" stroke="rgba(148,163,184,0.45)" stroke-width="1.2"/>
    <path d="M7.5 27.5c1.5-4.4 4.8-6.5 8.5-6.5s7 2.1 8.5 6.5" fill="${p.shirt}"/>
    <circle cx="16" cy="13.5" r="5" fill="#fed7aa"/>
    <path d="M11 12.5c.4-3.4 2.6-5 5-5s4.6 1.6 5 5c-1.5-1.2-3.2-1.7-5-1.7s-3.5.5-5 1.7Z" fill="${p.hair}"/>
  </svg>`;
}

export function updatePromoTargetPill() {
  if (!promoTargetPill || !promoTargetWordText) return;
  const tr = t();
  if (promoTargetLabel && tr.promoTargetPrefix) {
    promoTargetLabel.textContent = tr.promoTargetPrefix;
  }
  let targetObj = state.demoWords.find(w => w.id === state.demoTargetId) || state.demoWords[0] || null;
  let targetEntry = targetObj ? targetObj.entry : null;
  if (!targetEntry) {
    const { course, mod, lesson } = getActiveSelection();
    if (course && mod && lesson) {
      const words = resolveLessonBaseWords(course, mod, lesson, state.activeLessonIndex);
      if (words.length > 0) targetEntry = words[0];
    }
  }
  const translated = targetEntry ? getWordTranslation(targetEntry) : '';
  promoTargetWordText.textContent = translated ? `«${translated}»` : '«…»';
}

export function renderDesktopMissionCard() {
  const tr = t();
  if (labelDailyGoalTitle && tr.dailyGoalTitle) {
    labelDailyGoalTitle.textContent = tr.dailyGoalTitle;
  }

  const { course, mod } = getActiveSelection();
  let hasCourseProgress = false;
  if (course) {
    const artKey = course.source === 'user' ? 'anki' : inferCourseCategory(course);
    if (homeMissionArtwork && homeMissionArtwork.dataset.artKey !== artKey) {
      homeMissionArtwork.dataset.artKey = artKey;
      homeMissionArtwork.innerHTML = getMissionArtworkSvg(course);
    }
    if (homeMissionTitle) {
      homeMissionTitle.textContent = getLocalizedField(course, 'titles');
    }
    if (homeMissionSubtitle) {
      const modTitle = mod ? getLocalizedField(mod, 'titles') : '';
      const levelBit = course.levelTag ? ` (${course.levelTag})` : '';
      homeMissionSubtitle.textContent = modTitle ? `${modTitle}${levelBit}` : (course.levelTag || '');
    }
    const { learned, total } = countLearnedWordsInCourse(course);
    const hasDoneLesson = (course.modules || []).some(
      m => (m.lessons || []).some(ls => state.completedLessonIds.has(ls.id))
    );
    hasCourseProgress = learned > 0 || hasDoneLesson;
    const pct = total > 0 ? Math.min(100, Math.round((learned / total) * 100)) : 0;
    if (homeMissionProgFill) {
      homeMissionProgFill.style.width = `${pct}%`;
    }
    if (homeMissionProgText) {
      homeMissionProgText.textContent = tr.missionProgressSummary
        ? tr.missionProgressSummary(learned, total, pct)
        : `${learned} / ${total} · ${pct}%`;
    }
  }

  if (labelContinueMission) {
    labelContinueMission.textContent = hasCourseProgress
      ? (tr.continueMissionTitle || 'Продолжить миссию')
      : (tr.startMissionTitle || 'Начать миссию');
  }
  if (labelMissionLaunch) {
    labelMissionLaunch.textContent = hasCourseProgress
      ? (tr.continueGameBtn || 'Продолжить игру')
      : (tr.launchFreeBtn || 'Начать игру');
  }

  const doneToday = todayLearnedSet.size;
  const goalPct = Math.min(100, Math.round((doneToday / DAILY_GOAL_WORDS) * 100));
  if (homeDailyGoalTarget) {
    const unit = tr.dailyGoalWordsUnit ? tr.dailyGoalWordsUnit(DAILY_GOAL_WORDS) : 'words';
    homeDailyGoalTarget.innerHTML = `<strong>${DAILY_GOAL_WORDS}</strong> ${escapeHtml(unit)}`;
  }
  if (homeDailyGoalFill) {
    homeDailyGoalFill.style.width = `${goalPct}%`;
  }
  if (homeDailyGoalText) {
    homeDailyGoalText.textContent = `${doneToday} / ${DAILY_GOAL_WORDS}`;
  }
}

export function renderDesktopLevelPills() {
  if (!homeLevelPills) return;
  const tr = t();
  if (labelHomeLevelFilter && tr.homeLevelLabel) {
    labelHomeLevelFilter.textContent = tr.homeLevelLabel;
  }
  const { course } = getActiveSelection();
  let hintMatched = false;
  homeLevelPills.querySelectorAll('.home-level-pill').forEach(btn => {
    const lvl = btn.dataset.homeLevel;
    const isExplicit = state.homeLevelFilter === lvl;
    const matchesCourse = state.homeLevelFilter === 'all' && !hintMatched && course && courseMatchesLevelFilter(course, lvl);
    if (matchesCourse) hintMatched = true;
    btn.classList.toggle('active', isExplicit);
    btn.classList.toggle('course-hint', Boolean(matchesCourse));
    btn.setAttribute('aria-pressed', isExplicit ? 'true' : 'false');
  });
}

export function renderDesktopTopicsBar() {
  if (!desktopTopicsChips) return;
  const tr = t();
  if (labelDesktopTopics && tr.topicsBarTitle) {
    labelDesktopTopics.textContent = tr.topicsBarTitle;
  }
  const { course: activeCourse } = getActiveSelection();
  const activeCat = activeCourse && activeCourse.source !== 'user' ? inferCourseCategory(activeCourse) : '';
  const allCourses = getCoursesForTargetLang(state.targetLang);

  const topicSpecs = [
    { cat: 'auto', title: tr.topicAutoTitle },
    { cat: 'business', title: tr.topicBusinessTitle },
    { cat: 'travel', title: tr.topicTravelTitle },
    { cat: 'food', title: tr.topicFoodTitle },
    { cat: 'finance', title: tr.topicFinanceTitle },
    { cat: 'base', title: tr.topicDailyTitle }
  ];

  desktopTopicsChips.innerHTML = '';
  topicSpecs.forEach(tp => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'desktop-topic-chip' + (activeCat === tp.cat ? ' active' : '');
    btn.innerHTML = `${getTopicChipIconSvg(tp.cat)}<span>${escapeHtml(tp.title || tp.cat)}</span>`;
    btn.addEventListener('click', () => {
      state.homeLevelFilter = 'all';
      const matched = allCourses.find(c => c.source !== 'user' && inferCourseCategory(c) === tp.cat);
      if (matched) {
        actions.selectCourseLesson(matched.id, 0, 0, false);
      } else {
        actions.openDecksPage({
          sourceFilter: 'all',
          categoryFilter: tp.cat,
          levelFilter: 'all'
        });
      }
    });
    desktopTopicsChips.appendChild(btn);
  });
}

export function renderHomeQuickStartGrid() {
  if (!homeQuickStartGrid) return;
  const tr = t();
  const allCourses = getCoursesForTargetLang(state.targetLang);
  const filteredCourses = state.homeLevelFilter !== 'all'
    ? allCourses.filter(c => courseMatchesLevelFilter(c, state.homeLevelFilter))
    : allCourses;

  let displayCourses = filteredCourses.slice(0, 4);
  if (
    state.homeLevelFilter === 'all' &&
    allCourses.length > 4 &&
    state.activeCourseId &&
    !displayCourses.some(c => c.id === state.activeCourseId)
  ) {
    const activeCourseObj = allCourses.find(c => c.id === state.activeCourseId);
    if (activeCourseObj) {
      displayCourses = [...allCourses.slice(0, 3), activeCourseObj];
    }
  }

  homeQuickStartGrid.innerHTML = '';

  displayCourses.forEach(course => {
    const { learned, total } = countLearnedWordsInCourse(course);
    const regularLessons = (course.modules || []).reduce(
      (sum, m) => sum + (m.lessons ? m.lessons.filter(l => !l.isBoss).length : 0),
      0
    );
    const totalLessons = regularLessons || (course.modules || []).reduce((sum, m) => sum + (m.lessons ? m.lessons.length : 0), 0);
    const pct = total > 0 ? Math.min(100, Math.round((learned / total) * 100)) : 0;
    const isActive = course.id === state.activeCourseId;
    const metaLabel = tr.courseMetaWordsLessons
      ? tr.courseMetaWordsLessons(total, totalLessons)
      : `${total} · ${totalLessons}`;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'qs-course-card' + (isActive ? ' active' : '');
    btn.innerHTML = `
      <div class="qs-card-icon-wrap">
        ${getCourseCardIconSvg(course)}
      </div>
      <div class="qs-card-body">
        <div class="qs-card-title">${escapeHtml(getLocalizedField(course, 'titles'))}</div>
        <div class="qs-card-meta-row">
          <span class="qs-card-meta">${escapeHtml(metaLabel)}</span>
          <span class="qs-art-play" data-launch-now="1" title="▶">▶</span>
        </div>
        <div class="qs-card-prog-row">
          <div class="qs-prog-bar">
            <div class="qs-prog-fill" style="width:${pct}%;"></div>
          </div>
          <span class="qs-prog-text">${pct}%</span>
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
    ankiCard.className = 'qs-course-card qs-anki-card';
    ankiCard.innerHTML = `
      <div class="qs-card-icon-wrap">
        ${getCourseCardIconSvg({ source: 'user' })}
      </div>
      <div class="qs-card-body">
        <div class="qs-card-title">${escapeHtml(tr.quickAnkiCardTitle)}</div>
        <div class="qs-card-meta-row">
          <span class="qs-card-meta">.apkg / .tsv</span>
          <span class="qs-art-play">＋</span>
        </div>
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

export function renderMobileDiscoveryBlocks() {
  const tr = t();
  if (labelMobChooseLevel && tr.mobChooseLevelTitle) {
    labelMobChooseLevel.textContent = tr.mobChooseLevelTitle;
  }
  if (labelMobChooseTopic && tr.mobChooseTopicTitle) {
    labelMobChooseTopic.textContent = tr.mobChooseTopicTitle;
  }

  const allCourses = getCoursesForTargetLang(state.targetLang);

  if (mobileLevelCardsList) {
    const levelSpecs = [
      {
        id: 'A1–A2',
        cls: 'level-a1',
        title: 'A1–A2',
        sub: tr.lvlA1Sub,
        iconHtml: '<span class="mob-lvl-emoji" aria-hidden="true">🌱</span>'
      },
      {
        id: 'B1',
        cls: 'level-b1',
        title: 'B1',
        sub: tr.lvlB1Sub,
        iconHtml: `<svg class="mob-lvl-svg" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect x="4" y="18" width="5.6" height="9" rx="2" fill="#38bdf8"/>
          <rect x="13.2" y="12.2" width="5.6" height="14.8" rx="2" fill="#60a5fa"/>
          <rect x="22.4" y="6.2" width="5.6" height="20.8" rx="2" fill="#93c5fd"/>
        </svg>`
      },
      {
        id: 'B2',
        cls: 'level-b2',
        title: 'B2',
        sub: tr.lvlB2Sub,
        iconHtml: `<svg class="mob-lvl-svg" viewBox="0 0 36 32" fill="none" aria-hidden="true">
          <path d="M18 4.5L3 11.8L18 19.1L33 11.8L18 4.5Z" fill="#a855f7" stroke="#d8b4fe" stroke-width="1.1"/>
          <path d="M9.5 15.2V22.4C9.5 24.8 13.3 26.8 18 26.8C22.7 26.8 26.5 24.8 26.5 22.4V15.2L18 19.4L9.5 15.2Z" fill="#7e22ce"/>
          <path d="M29.5 13.2V21.5" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="29.5" cy="22.5" r="1.8" fill="#fbbf24"/>
        </svg>`
      }
    ];

    mobileLevelCardsList.innerHTML = '';
    levelSpecs.forEach(spec => {
      const matched = allCourses.filter(c => courseMatchesLevelFilter(c, spec.id));
      const lessonsTotal = matched.reduce((sum, c) => {
        return sum + (c.modules || []).reduce((mSum, m) => mSum + (m.lessons ? m.lessons.length : 0), 0);
      }, 0);
      const metaStr = tr.lvlMetaCounts ? tr.lvlMetaCounts(matched.length, lessonsTotal) : `${matched.length} · ${lessonsTotal}`;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `mob-level-card ${spec.cls}`;
      btn.innerHTML = `
        <div class="mob-lvl-icon-tile">${spec.iconHtml}</div>
        <div class="mob-lvl-body">
          <div class="mob-lvl-title">${escapeHtml(spec.title)}</div>
          <div class="mob-lvl-sub">${escapeHtml(spec.sub || '')}</div>
          <div class="mob-lvl-meta">
            <svg class="mob-lvl-book-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1Z"/>
            </svg>
            <span>${escapeHtml(metaStr)}</span>
          </div>
        </div>
        <svg class="mob-lvl-chevron" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M7.5 4.5L13 10l-5.5 5.5"/>
        </svg>
      `;
      btn.addEventListener('click', () => {
        if (matched.length > 0 && matched[0].id !== state.activeCourseId) {
          actions.selectCourseLesson(matched[0].id, 0, 0, false);
        }
        actions.openDecksPage({
          sourceFilter: 'all',
          levelFilter: spec.id,
          categoryFilter: 'all'
        });
      });
      mobileLevelCardsList.appendChild(btn);
    });
  }

  if (mobileTopicGrid) {
    const topicSpecs = [
      { cat: 'finance', cls: 'topic-finance', icon: '🪙', title: tr.topicFinanceTitle, sub: tr.topicFinanceSub },
      { cat: 'auto', cls: 'topic-auto', icon: '🚗', title: tr.topicAutoTitle, sub: tr.topicAutoSub },
      { cat: 'food', cls: 'topic-food', icon: '👨‍🍳', title: tr.topicFoodTitle, sub: tr.topicFoodSub },
      { cat: 'business', cls: 'topic-business', icon: '💼', title: tr.topicBusinessTitle, sub: tr.topicBusinessSub },
      { cat: 'travel', cls: 'topic-travel', icon: '✈️', title: tr.topicTravelTitle, sub: tr.topicTravelSub },
      { cat: 'base', cls: 'topic-daily', icon: '🏠', title: tr.topicDailyTitle, sub: tr.topicDailySub }
    ];

    mobileTopicGrid.innerHTML = '';
    topicSpecs.forEach(tp => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `mob-topic-card ${tp.cls}`;
      btn.innerHTML = `
        <span class="mob-topic-icon" aria-hidden="true">${tp.icon}</span>
        <span class="mob-topic-sep" aria-hidden="true"></span>
        <span class="mob-topic-copy">
          <span class="mob-topic-title">${escapeHtml(tp.title || '')}</span>
          <span class="mob-topic-sub">${escapeHtml(tp.sub || '')}</span>
        </span>
      `;
      btn.addEventListener('click', () => {
        const matched = allCourses.filter(c => c.source !== 'user' && inferCourseCategory(c) === tp.cat);
        if (matched.length > 0 && matched[0].id !== state.activeCourseId) {
          actions.selectCourseLesson(matched[0].id, 0, 0, false);
        }
        actions.openDecksPage({
          sourceFilter: 'all',
          categoryFilter: tp.cat,
          levelFilter: 'all'
        });
      });
      mobileTopicGrid.appendChild(btn);
    });
  }
}

export function renderHomeDashboardWidgets() {
  renderDesktopMissionCard();
  renderDesktopLevelPills();
  renderHomeQuickStartGrid();
  renderDesktopTopicsBar();
  renderMobileDiscoveryBlocks();
  updatePromoTargetPill();

  // Круговая диаграмма «Мой прогресс» по активному курсу
  const { course } = getActiveSelection();
  const courseStats = course ? countLearnedWordsInCourse(course) : { learned: 0, total: 0 };
  const pct = courseStats.total > 0
    ? Math.min(100, Math.round((courseStats.learned / courseStats.total) * 100))
    : 0;

  if (homeProgressPercent) homeProgressPercent.textContent = `${pct}%`;
  if (homeProgressRingCircle) {
    const circ = 219.9;
    homeProgressRingCircle.style.strokeDashoffset = (circ * (1 - pct / 100)).toFixed(1);
  }
  if (homeStatLearned) homeStatLearned.textContent = courseStats.learned.toLocaleString();
  if (homeStatDecks) homeStatDecks.textContent = courseStats.total.toLocaleString();
  if (homeStatStreak) {
    homeStatStreak.textContent = `${todayLearnedSet.size} / ${DAILY_GOAL_WORDS}`;
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
    topSlice.forEach((row, idx) => {
      const div = document.createElement('div');
      div.className = 'mini-leader-row' + (row.isYou ? ' is-you' : '');
      div.innerHTML = `
        <span class="mini-leader-left">
          ${getLeaderboardCrownSvg(idx + 1)}
          ${getPilotAvatarSvg(idx, row.isYou)}
          <span class="leader-name">${escapeHtml(row.name)}</span>
        </span>
        <span class="leader-score">${row.score.toLocaleString('ru-RU')}</span>
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
    const tr = t();
    if (window.innerWidth <= 768) {
      const idleTxt = tr.mobTargetPromptIdle || tr.targetIdle;
      bottomTargetPreview.innerHTML = `
        <span class="mob-prompt-idle-wrap">
          <svg class="mob-prompt-crosshair" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true">
            <circle cx="10" cy="10" r="6" />
            <circle cx="10" cy="10" r="1.7" fill="currentColor" stroke="none" />
            <path d="M10 1.8v2.6M10 15.6v2.6M1.8 10h2.6M15.6 10h2.6" />
          </svg>
          <span>${escapeHtml(idleTxt)}</span>
        </span>
      `;
    } else {
      bottomTargetPreview.innerHTML = `<span style="color: var(--text-muted);">${escapeHtml(tr.targetIdle)}</span>`;
    }
    if (desktopTypingPreview) {
      desktopTypingPreview.innerHTML = `<span style="color: #cbd5e1;">${escapeHtml(tr.desktopPromptIdle)}</span>`;
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

  if (labelMobLives && t().mobLivesLabel) {
    labelMobLives.textContent = t().mobLivesLabel;
  }
  if (mobHudLivesHearts) {
    let heartsHtml = '';
    const fullCount = Math.max(0, state.shields);
    const totalCount = Math.max(fullCount, state.maxShields);
    for (let i = 0; i < totalCount; i++) {
      heartsHtml += `<span class="mob-heart ${i < fullCount ? 'full' : 'empty'}">❤</span>`;
    }
    mobHudLivesHearts.innerHTML = heartsHtml;
  }

  empCountEl.textContent = String(state.empCharges);
  if (mobEmpCount) mobEmpCount.textContent = String(state.empCharges);
  const kbdEmpBadge = document.getElementById('kbdEmpCount');
  const kbdEmpBtn = document.getElementById('btnKbdEmp');
  if (kbdEmpBadge) kbdEmpBadge.textContent = String(state.empCharges);
  btnEmp.disabled = state.empCharges <= 0;
  if (btnMobHudEmp) btnMobHudEmp.disabled = state.empCharges <= 0;
  if (kbdEmpBtn) kbdEmpBtn.style.opacity = state.empCharges <= 0 ? '0.42' : '1';

  const pct = state.totalWordsInLevel > 0
    ? Math.min(100, Math.round((state.wordsDestroyedInLevel / state.totalWordsInLevel) * 100))
    : 0;
  hudProgressBar.style.width = `${pct}%`;
  if (kbdProgressFill) kbdProgressFill.style.width = `${pct}%`;
  hudProgressText.textContent = `${state.wordsDestroyedInLevel} / ${state.totalWordsInLevel}`;
  if (mobHudProgressText) {
    mobHudProgressText.textContent = `${state.wordsDestroyedInLevel}/${state.totalWordsInLevel}`;
  }

  if (hudRingCircle) {
    const ringCirc = 65.97;
    hudRingCircle.style.strokeDashoffset = (ringCirc * (1 - pct / 100)).toFixed(2);
  }
  if (sidebarDeckProgFill) sidebarDeckProgFill.style.width = `${pct}%`;
  if (sidebarDeckProgNum) {
    sidebarDeckProgNum.textContent = `${state.wordsDestroyedInLevel} / ${state.totalWordsInLevel}`;
  }
  const waveNum = Math.max(1, Math.ceil((state.wordsDestroyedInLevel + 1) / 4));
  const waveLabel = t().arenaWaveLabel(state.activeLessonIndex + 1, waveNum);
  if (arenaWavePill) {
    arenaWavePill.textContent = waveLabel;
  }
  if (mobHudWaveText) {
    mobHudWaveText.textContent = waveLabel;
  }
}
