(() => {
  'use strict';

  // --- Константы цветов по родам немецких слов ---
  const ARTICLE_COLORS = {
    'der': { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', label: 'der' },
    'die': { main: '#fb7185', glow: 'rgba(251, 113, 133, 0.45)', label: 'die' },
    'das': { main: '#34d399', glow: 'rgba(52, 211, 153, 0.45)', label: 'das' },
    'Pl.': { main: '#fbbf24', glow: 'rgba(251, 191, 36, 0.45)', label: 'Pl.' },
    'der/die': { main: '#60a5fa', glow: 'rgba(96, 165, 250, 0.45)', label: 'der/die' },
    'Verb': { main: '#a78bfa', glow: 'rgba(167, 139, 250, 0.45)', label: 'Verb' },
    'Adj.': { main: '#c084fc', glow: 'rgba(192, 132, 252, 0.45)', label: 'Adj.' },
    'Adv.': { main: '#e879f9', glow: 'rgba(232, 121, 249, 0.45)', label: 'Adv.' },
    'Pron.': { main: '#f472b6', glow: 'rgba(244, 114, 182, 0.45)', label: 'Pron.' }
  };

  function getArticleStyle(article) {
    return ARTICLE_COLORS[article] || { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.4)', label: article || 'DE' };
  }

  // --- Полная локализация интерфейса (RU / עברית) ---
  const UI_TEXT = {
    ru: {
      pause: 'Пауза',
      score: 'Очки',
      combo: 'Комбо',
      accuracy: 'Точность',
      shield: 'Щит',
      badgeMode: '🏷️ Бейдж',
      articleMode: '🏷️ С артиклем',
      dictBtn: ' Словарь',
      customBtn: 'Свои слова',
      sidebarLevels: '🚗 Уровни «AUTO»',
      wordsCount: (n) => `${n} слова`,
      wordsShort: (n) => `${n} сл.`,
      sidebarKills: '💥 Взорванные слова',
      clearBtn: 'Очистить',
      killFeedEmpty: 'Сбивайте летящие немецкие слова!<br><br>При взрыве перевод всплывает прямо в космосе и сохраняется здесь.',
      legendDer: 'der (м.р.)',
      legendDie: 'die (ж.р.)',
      legendDas: 'das (ср.р.)',
      legendVerb: 'Глаг./Пр.',
      targetIdle: 'Нажимайте буквы, чтобы стрелять по словам...',
      levelShort: (num, title) => `Ур.${num}: ${title}`,
      levelBadgeMain: '🏆 ГЛАВНЫЙ AUTO',
      levelBadgeNum: (num) => `УРОВЕНЬ ${num}`,
      autoAllShort: 'AUTO (Все слова)',
      introBadgeMain: '🏆 ГЛАВНЫЙ УРОВЕНЬ: AUTO (73 СЛОВА)',
      introBadgeStep: (num, total) => `КАМПАНИЯ AUTO · УРОВЕНЬ ${num} ИЗ ${total}`,
      wordsInLevelHeader: (n) => `📋 Посмотреть слова этого уровня (${n})`,
      learnedWordsHeader: (n) => `📋 Выученные слова (${n})`,
      startLevelBtn: '🚀 В бой! Начать уровень',
      retryBtn: '🔄 Ещё раз',
      tryAgainBtn: '🚀 Попробовать снова',
      resumeBtn: '▶ Продолжить уровень',
      nextLevelBtn: (num) => `Следующий: Ур.${num} ➔`,
      mistakesBtn: '🎯 Сложные слова',
      completeBadge: (maxCombo) => `🎉 УРОВЕНЬ ПРОЙДЕН! МАКС. КОМБО: x${maxCombo}`,
      completeTitle: (name) => `Отличная стрельба! «${name}» зачищен`,
      completeDesc: 'Вы успешно сбили все слова уровня. Пройдите быстрый <strong>блиц из 3 вопросов</strong> или переходите к следующему уровню!',
      quizHeader: '🧠 БЛИЦ: Выберите перевод!',
      quizDoneScore: (c, t) => `${c} / ${t} верно!`,
      quizDoneTitle: (c, t) => `✨ Блиц завершён! Результат: ${c} из ${t}`,
      gameOverBadge: '💥 ЩИТ КОРАБЛЯ ПРОБИТ',
      gameOverTitle: (name) => `Уровень «${name}» не завершён`,
      gameOverDesc: (done, total) => `Сбито слов: <strong>${done} из ${total}</strong>. Попробуйте ещё раз!`,
      pauseBadge: '⏸ ИГРА НА ПАУЗЕ',
      pauseDesc: (done, total) => `Прогресс: <strong>${done} / ${total}</strong> слов. Вы можете продолжить бой или выбрать другой уровень:`,
      dictTitle: (n) => `📚 Словарь «AUTO» (${n} слова)`,
      dictSearchPlaceholder: 'Поиск: немецкий, русский или עברית...',
      customTitle: '➕ Добавить свои немецкие слова',
      customHint: 'Формат: <code>немецкое слово;перевод RU;перевод HE</code> (каждое с новой строки).',
      customSaveBtn: 'Создать уровень и играть 🚀',
      layoutWarning: '⚠️ Переключите раскладку на DE / EN!'
    },
    he: {
      pause: 'הפסקה',
      score: 'ניקוד',
      combo: 'רצף',
      accuracy: 'דיוק',
      shield: 'מגן',
      badgeMode: '🏷️ תגית',
      articleMode: '🏷️ עם תווית',
      dictBtn: ' מילון',
      customBtn: 'מילים משלך',
      sidebarLevels: '🚗 שלבי «AUTO»',
      wordsCount: (n) => `${n} מילים`,
      wordsShort: (n) => `${n} מיל׳`,
      sidebarKills: '💥 מילים שפוצצו',
      clearBtn: 'נקה',
      killFeedEmpty: 'פוצצו את המילים בגרמנית!<br><br>בעת הפיצוץ התרגום לעברית יופיע בחלל ויישמר כאן לחזרה.',
      legendDer: 'der (זכר)',
      legendDie: 'die (נקבה)',
      legendDas: 'das (נייטרלי)',
      legendVerb: 'פועל/אחר',
      targetIdle: 'הקישו על האותיות כדי לירות במילים...',
      levelShort: (num, title) => `שלב ${num}: ${title}`,
      levelBadgeMain: '🏆 שלב AUTO ראשי',
      levelBadgeNum: (num) => `שלב ${num}`,
      autoAllShort: 'AUTO (כל המילים)',
      introBadgeMain: '🏆 השלב הראשי: AUTO (73 מילים)',
      introBadgeStep: (num, total) => `קמפיין AUTO · שלב ${num} מתוך ${total}`,
      wordsInLevelHeader: (n) => `📋 הצג את מילות השלב (${n})`,
      learnedWordsHeader: (n) => `📋 מילים שנלמדו (${n})`,
      startLevelBtn: '🚀 לקרב! התחל שלב',
      retryBtn: '🔄 שחק שוב',
      tryAgainBtn: '🚀 נסה שוב',
      resumeBtn: '▶ המשך בשלב',
      nextLevelBtn: (num) => `הבא: שלב ${num} ➔`,
      mistakesBtn: '🎯 מילים קשות',
      completeBadge: (maxCombo) => `🎉 השלב הושלם! רצף שיא: x${maxCombo}`,
      completeTitle: (name) => `ירייה מעולה! השלב «${name}» הושלם`,
      completeDesc: 'פוצצתם בהצלחה את כל המילים בשלב! ענו על <strong>חידון בזק של 3 שאלות</strong> או עברו לשלב הבא!',
      quizHeader: '🧠 חידון בזק: בחרו את התרגום הנכון!',
      quizDoneScore: (c, t) => `${c} / ${t} נכון!`,
      quizDoneTitle: (c, t) => `✨ החידון הסתיים! תוצאה: ${c} מתוך ${t}`,
      gameOverBadge: '💥 מגן החללית נפרץ',
      gameOverTitle: (name) => `השלב «${name}» לא הושלם`,
      gameOverDesc: (done, total) => `מילים שפוצצו: <strong>${done} מתוך ${total}</strong>. נסו שוב!`,
      pauseBadge: '⏸ המשחק בהפסקה',
      pauseDesc: (done, total) => `התקדמות: <strong>${done} / ${total}</strong> מילים. ניתן להמשיך בקרב או לבחור שלב אחר:`,
      dictTitle: (n) => `📚 מילון «AUTO» (${n} מילים)`,
      dictSearchPlaceholder: 'חיפוש: גרמנית, עברית או רוסית...',
      customTitle: '➕ הוספת מילים משלך בגרמנית',
      customHint: 'פורמט: <code>מילה בגרמנית;תרגום</code> (כל מילה בשורה חדשה).',
      customSaveBtn: 'צור שלב ושחק 🚀',
      layoutWarning: '⚠️ החליפו מקלדת ל-DE / EN!'
    }
  };

  // --- Звуковой движок (Web Audio API синтезатор + Web Speech API немецкая озвучка) ---
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.ttsEnabled = true;
      this.sfxEnabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playLaser(pitchIndex = 0) {
      if (!this.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const baseFreq = Math.min(920, 420 + pitchIndex * 28);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.075);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }

    playExplosion() {
      if (!this.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(170, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.36);

      oscGain.gain.setValueAtTime(0.22, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.37);

      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const chime = this.ctx.createOscillator();
        const cGain = this.ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(freq, now + idx * 0.035);
        cGain.gain.setValueAtTime(0.055, now + idx * 0.035);
        cGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28 + idx * 0.035);
        chime.connect(cGain);
        cGain.connect(this.ctx.destination);
        chime.start(now + idx * 0.035);
        chime.stop(now + 0.3 + idx * 0.035);
      });
    }

    playMiss() {
      if (!this.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(135, now);
      osc.frequency.setValueAtTime(98, now + 0.05);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    }

    playShieldHit() {
      if (!this.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.linearRampToValueAtTime(45, now + 0.4);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.43);
    }

    speakGerman(text) {
      if (!this.ttsEnabled || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'de-DE';
        utter.rate = 0.96;
        utter.volume = 0.9;
        const voices = window.speechSynthesis.getVoices();
        const deVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('de'));
        if (deVoice) utter.voice = deVoice;
        window.speechSynthesis.speak(utter);
      } catch (_) {}
    }
  }

  const sound = new SoundEngine();

  // --- Подготовка уровней: 6 тематических подуровней + 7-й Главный уровень "AUTO (Все 73 слова)" ---
  const baseLevels = window.AUTO_CAMPAIGN.levels.slice();
  const allAutoWords = baseLevels.flatMap(l => l.words);

  const levels = [
    ...baseLevels,
    {
      id: 'level-auto-all',
      number: 7,
      name: 'ГЛАВНЫЙ УРОВЕНЬ: AUTO (Все слова)',
      heName: 'השלב הראשי: AUTO (כל 73 המילים)',
      deName: 'Auto-Marathon (73 Wörter)',
      description: 'Финальный главный уровень AUTO: все 73 слова из всех категорий в динамичном космическом потоке!',
      heDescription: 'השלב המרכזי של AUTO: כל 73 המילים מכל הקטגוריות בזרימה קוסמית דינמית!',
      speedMultiplier: 1.0,
      spawnIntervalMs: 2550,
      words: allAutoWords
    }
  ];

  // --- Состояние игры ---
  const state = {
    currentLevelIndex: 0,
    running: false,
    paused: false,
    gameOver: false,
    overlayMode: 'intro', // 'intro' | 'complete' | 'gameover' | 'pause'
    activeQuiz: null,     // Текущее состояние блиц-теста (чтобы мгновенно переводить варианты на иврит)

    // Язык перевода: 'ru' (Русский), 'he' (Иврит עברית), 'both' (Оба языка)
    translationLang: 'ru',
    langModes: [
      { id: 'ru', label: '🇷🇺 RU' },
      { id: 'he', label: '🇮🇱 עברית' },
      { id: 'both', label: '🇷🇺+🇮🇱' }
    ],

    // Настройки игрока
    typeWithArticle: false,
    speedPresetIndex: 0, // По умолчанию 0.5x
    speedPresets: [
      { mult: 0.5, label: '🐌 0.5x' },
      { mult: 0.7, label: '🐢 0.7x' },
      { mult: 1.0, label: '🚀 1.0x' },
      { mult: 1.35, label: '⚡ 1.35x' }
    ],

    // Метрики
    score: 0,
    combo: 1,
    maxCombo: 1,
    shotsFired: 0,
    shotsHit: 0,
    shields: 4,
    maxShields: 4,
    empCharges: 2,

    // Очередь слов текущего уровня
    wordQueue: [],
    totalWordsInLevel: 0,
    wordsDestroyedInLevel: 0,
    spawnTimer: 0,
    mistakeWordsMap: new Map(),
    killHistory: [],

    // Игровые объекты на холсте
    activeWords: [],
    lockedWordId: null,
    lastAbsorbedUmlautE: false,
    lastAbsorbedEszettS: false,

    lasers: [],
    particles: [],
    shockwaves: [],
    floatingTranslations: [],
    stars: [],
    layoutWarningTimer: 0,

    // Корабль игрока
    ship: {
      x: 0,
      y: 0,
      angle: -Math.PI / 2,
      targetAngle: -Math.PI / 2,
      recoil: 0
    }
  };

  let nextEntityId = 1;

  // --- Вспомогательные функции локализации ---
  function isHebrewUI() {
    return state.translationLang === 'he';
  }

  function t() {
    return isHebrewUI() ? UI_TEXT.he : UI_TEXT.ru;
  }

  function getLevelTitle(lvl) {
    if (isHebrewUI() && lvl.heName) return lvl.heName;
    return lvl.name;
  }

  function getLevelDesc(lvl) {
    if (isHebrewUI() && lvl.heDescription) return lvl.heDescription;
    return lvl.description;
  }

  function getWordTranslation(entry, langOverride = null) {
    const lang = langOverride || state.translationLang;
    const ru = entry.ru || '';
    const he = entry.he || '';

    if (lang === 'he') return he || ru;
    if (lang === 'both') {
      if (ru && he && ru !== he) return `${ru} · ${he}`;
      return ru || he;
    }
    return ru || he;
  }

  function isRtlTranslation(entry, langOverride = null) {
    const lang = langOverride || state.translationLang;
    return lang === 'he' && Boolean(entry && entry.he);
  }

  // --- DOM-элементы ---
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const labelPause = document.getElementById('labelPause');
  const labelScore = document.getElementById('labelScore');
  const labelCombo = document.getElementById('labelCombo');
  const labelAccuracy = document.getElementById('labelAccuracy');
  const labelShield = document.getElementById('labelShield');
  const labelDictBtn = document.getElementById('labelDictBtn');
  const labelCustomBtn = document.getElementById('labelCustomBtn');
  const sidebarLevelsTitle = document.getElementById('sidebarLevelsTitle');
  const sidebarKillsTitle = document.getElementById('sidebarKillsTitle');
  const legendDer = document.getElementById('legendDer');
  const legendDie = document.getElementById('legendDie');
  const legendDas = document.getElementById('legendDas');
  const legendVerb = document.getElementById('legendVerb');

  const hudLevelTitle = document.getElementById('hudLevelTitle');
  const hudProgressBar = document.getElementById('hudProgressBar');
  const hudProgressText = document.getElementById('hudProgressText');
  const hudScore = document.getElementById('hudScore');
  const hudCombo = document.getElementById('hudCombo');
  const hudAccuracy = document.getElementById('hudAccuracy');
  const hudShields = document.getElementById('hudShields');
  const empCountEl = document.getElementById('empCount');

  const btnEmp = document.getElementById('btnEmp');
  const btnLangMode = document.getElementById('btnLangMode');
  const btnArticleMode = document.getElementById('btnArticleMode');
  const btnSpeedMode = document.getElementById('btnSpeedMode');
  const btnTtsMode = document.getElementById('btnTtsMode');
  const btnOpenDict = document.getElementById('btnOpenDict');
  const btnOpenCustom = document.getElementById('btnOpenCustom');
  const btnPause = document.getElementById('btnPause');
  const btnQuickLevels = document.getElementById('btnQuickLevels');
  const btnClearFeed = document.getElementById('btnClearFeed');

  const ztypeKeyboard = document.getElementById('ztypeKeyboard');
  const kbdProgressFill = document.getElementById('kbdProgressFill');
  const levelListContainer = document.getElementById('levelListContainer');
  const overlayLevelChips = document.getElementById('overlayLevelChips');
  const totalWordsCounter = document.getElementById('totalWordsCounter');
  const killFeedContainer = document.getElementById('killFeedContainer');
  const bottomTargetPreview = document.getElementById('bottomTargetPreview');

  const centerOverlay = document.getElementById('centerOverlay');
  const overlayCard = document.getElementById('overlayCard');
  const overlayBadge = document.getElementById('overlayBadge');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayDesc = document.getElementById('overlayDesc');
  const overlayWordsHeader = document.getElementById('overlayWordsHeader');
  const overlayWordsPreview = document.getElementById('overlayWordsPreview');
  const btnStartLevel = document.getElementById('btnStartLevel');
  const btnNextLevel = document.getElementById('btnNextLevel');
  const btnPracticeMistakes = document.getElementById('btnPracticeMistakes');

  const levelQuizBox = document.getElementById('levelQuizBox');
  const quizHeaderTitle = document.getElementById('quizHeaderTitle');
  const quizScoreText = document.getElementById('quizScoreText');
  const quizQuestionWord = document.getElementById('quizQuestionWord');
  const quizOptionsGrid = document.getElementById('quizOptionsGrid');

  const dictDialog = document.getElementById('dictDialog');
  const dictDialogTitle = document.getElementById('dictDialogTitle');
  const btnCloseDict = document.getElementById('btnCloseDict');
  const dictSearchInput = document.getElementById('dictSearchInput');
  const dictFullList = document.getElementById('dictFullList');

  const customWordsDialog = document.getElementById('customWordsDialog');
  const customDialogTitle = document.getElementById('customDialogTitle');
  const customDialogHint = document.getElementById('customDialogHint');
  const btnCloseCustom = document.getElementById('btnCloseCustom');
  const customWordsInput = document.getElementById('customWordsInput');
  const btnSaveCustomWords = document.getElementById('btnSaveCustomWords');

  // --- Размеры игрового поля ---
  function getPlayBounds() {
    const isDesktopWide = window.innerWidth > 960;
    const leftPad = isDesktopWide ? 264 : 8;
    const rightPad = isDesktopWide ? 294 : 8;

    const kbdRect = ztypeKeyboard ? ztypeKeyboard.getBoundingClientRect() : { height: 185 };
    const kbdHeight = kbdRect.height || 185;

    const left = leftPad;
    const right = Math.max(left + 260, canvas.width - rightPad);
    const top = isDesktopWide ? 64 : 52;
    const bottom = Math.max(top + 180, canvas.height - kbdHeight);

    return {
      left,
      right,
      top,
      bottom,
      centerX: (left + right) / 2
    };
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const bounds = getPlayBounds();
    state.ship.x = bounds.centerX;
    state.ship.y = bounds.bottom - 24;
    initStars();
  }

  function initStars() {
    const count = Math.floor((canvas.width * canvas.height) / 11000);
    state.stars = [];
    for (let i = 0; i < count; i++) {
      state.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.4,
        speed: Math.random() * 18 + 6,
        alpha: Math.random() * 0.65 + 0.2
      });
    }
  }

  window.addEventListener('resize', resizeCanvas);

  function getTargetString(wordEntry) {
    return state.typeWithArticle ? wordEntry.withArticle : wordEntry.word;
  }

  function mapGermanCharToBaseKey(ch) {
    if (!ch) return '';
    const low = ch.toLowerCase();
    if (low === 'ä') return 'a';
    if (low === 'ö') return 'o';
    if (low === 'ü') return 'u';
    if (low === 'ß') return 's';
    return low;
  }

  function charsMatchGerman(inputChar, targetChar) {
    const inp = inputChar.toLowerCase();
    const tgt = targetChar.toLowerCase();
    if (inp === tgt) return { matched: true, umlautSub: false, eszettSub: false };

    if (tgt === 'ä' && inp === 'a') return { matched: true, umlautSub: true, eszettSub: false };
    if (tgt === 'ö' && inp === 'o') return { matched: true, umlautSub: true, eszettSub: false };
    if (tgt === 'ü' && inp === 'u') return { matched: true, umlautSub: true, eszettSub: false };
    if (tgt === 'ß' && inp === 's') return { matched: true, umlautSub: false, eszettSub: true };

    return { matched: false, umlautSub: false, eszettSub: false };
  }

  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // --- Переключение языка перевода и ВСЕГО меню (RU / עברית / Оба) ---
  function setTranslationLanguage(langId) {
    state.translationLang = langId;
    const modeObj = state.langModes.find(m => m.id === langId) || state.langModes[0];
    btnLangMode.textContent = modeObj.label;

    document.querySelectorAll('.lang-quick-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === langId);
    });

    applyStaticUILocalization();
    renderLevelSidebar();
    refreshOverlayContent();
    if (state.activeQuiz && levelQuizBox.style.display !== 'none') {
      renderCurrentQuizQuestion(false);
    }
    if (dictDialog && dictDialog.open) {
      renderFullDictionary(dictSearchInput.value);
    }
    rerenderKillFeed();
    updateBottomTargetUI();
  }

  // --- Локализация всех статичных подписей интерфейса ---
  function applyStaticUILocalization() {
    const tr = t();
    const isHe = isHebrewUI();

    if (overlayCard) {
      overlayCard.dir = isHe ? 'rtl' : 'ltr';
    }
    if (labelPause) labelPause.textContent = tr.pause;
    if (labelScore) labelScore.textContent = tr.score;
    if (labelCombo) labelCombo.textContent = tr.combo;
    if (labelAccuracy) labelAccuracy.textContent = tr.accuracy;
    if (labelShield) labelShield.textContent = tr.shield;
    if (btnArticleMode) {
      btnArticleMode.textContent = state.typeWithArticle ? tr.articleMode : tr.badgeMode;
    }
    if (labelDictBtn) labelDictBtn.textContent = tr.dictBtn;
    if (labelCustomBtn) labelCustomBtn.textContent = tr.customBtn;
    if (sidebarLevelsTitle) sidebarLevelsTitle.textContent = tr.sidebarLevels;
    if (sidebarKillsTitle) sidebarKillsTitle.textContent = tr.sidebarKills;
    if (btnClearFeed) btnClearFeed.textContent = tr.clearBtn;
    if (legendDer) legendDer.textContent = tr.legendDer;
    if (legendDie) legendDie.textContent = tr.legendDie;
    if (legendDas) legendDas.textContent = tr.legendDas;
    if (legendVerb) legendVerb.textContent = tr.legendVerb;
    if (quizHeaderTitle) quizHeaderTitle.textContent = tr.quizHeader;
    if (dictDialogTitle) dictDialogTitle.textContent = tr.dictTitle(allAutoWords.length);
    if (dictSearchInput) dictSearchInput.placeholder = tr.dictSearchPlaceholder;
    if (customDialogTitle) customDialogTitle.textContent = tr.customTitle;
    if (customDialogHint) customDialogHint.innerHTML = tr.customHint;
    if (btnSaveCustomWords) btnSaveCustomWords.textContent = tr.customSaveBtn;

    const lvl = levels[state.currentLevelIndex];
    if (lvl && hudLevelTitle) {
      hudLevelTitle.textContent = lvl.id === 'level-auto-all'
        ? tr.autoAllShort
        : tr.levelShort(lvl.number, getLevelTitle(lvl));
    }
  }

  // --- Перерисовка содержимого центрального меню в соответствии с текущим режимом и языком ---
  function refreshOverlayContent() {
    const lvl = levels[state.currentLevelIndex];
    if (!lvl) return;
    const tr = t();
    const title = getLevelTitle(lvl);
    const desc = getLevelDesc(lvl);

    btnPracticeMistakes.textContent = tr.mistakesBtn;
    btnPracticeMistakes.style.display = state.mistakeWordsMap.size > 0 ? 'inline-flex' : 'none';

    if (state.overlayMode === 'intro') {
      overlayBadge.textContent = lvl.id === 'level-auto-all'
        ? tr.introBadgeMain
        : tr.introBadgeStep(lvl.number, levels.length - 1);
      overlayTitle.textContent = `${title} (${lvl.deName})`;
      overlayDesc.innerHTML = escapeHtml(desc);
      overlayWordsHeader.textContent = tr.wordsInLevelHeader(lvl.words.length);
      btnStartLevel.textContent = tr.startLevelBtn;
      btnStartLevel.style.display = 'inline-flex';
      btnNextLevel.style.display = 'none';
    } else if (state.overlayMode === 'complete') {
      overlayBadge.textContent = tr.completeBadge(state.maxCombo);
      overlayTitle.textContent = tr.completeTitle(title);
      overlayDesc.innerHTML = tr.completeDesc;
      overlayWordsHeader.textContent = tr.learnedWordsHeader(lvl.words.length);
      btnStartLevel.textContent = tr.retryBtn;
      btnStartLevel.style.display = 'inline-flex';
      if (state.currentLevelIndex < levels.length - 1) {
        btnNextLevel.style.display = 'inline-flex';
        btnNextLevel.textContent = tr.nextLevelBtn(levels[state.currentLevelIndex + 1].number);
      } else {
        btnNextLevel.style.display = 'none';
      }
    } else if (state.overlayMode === 'gameover') {
      overlayBadge.textContent = tr.gameOverBadge;
      overlayTitle.textContent = tr.gameOverTitle(title);
      overlayDesc.innerHTML = tr.gameOverDesc(state.wordsDestroyedInLevel, state.totalWordsInLevel);
      overlayWordsHeader.textContent = tr.wordsInLevelHeader(lvl.words.length);
      btnStartLevel.textContent = tr.tryAgainBtn;
      btnStartLevel.style.display = 'inline-flex';
      btnNextLevel.style.display = 'none';
    } else if (state.overlayMode === 'pause') {
      overlayBadge.textContent = tr.pauseBadge;
      overlayTitle.textContent = title;
      overlayDesc.innerHTML = tr.pauseDesc(state.wordsDestroyedInLevel, state.totalWordsInLevel);
      overlayWordsHeader.textContent = tr.wordsInLevelHeader(lvl.words.length);
      btnStartLevel.textContent = tr.resumeBtn;
      btnStartLevel.style.display = 'inline-flex';
      btnNextLevel.style.display = 'none';
    }

    renderWordsPreviewList(lvl.words, overlayWordsPreview);
  }

  // --- Отрисовка списка уровней (боковая панель ПК + чипы в меню) ---
  function renderLevelSidebar() {
    levelListContainer.innerHTML = '';
    overlayLevelChips.innerHTML = '';
    const tr = t();

    const totalWords = levels
      .filter(l => l.id !== 'level-auto-all')
      .reduce((acc, l) => acc + l.words.length, 0);
    totalWordsCounter.textContent = tr.wordsCount(totalWords);

    levels.forEach((lvl, idx) => {
      const localTitle = getLevelTitle(lvl);

      // 1. Карточка для левой панели на ПК
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'level-card' +
        (idx === state.currentLevelIndex ? ' active' : '') +
        (lvl.completed ? ' completed' : '');

      const badgeLabel = lvl.id === 'level-auto-all'
        ? tr.levelBadgeMain
        : tr.levelBadgeNum(lvl.number);

      btn.innerHTML = `
        <div class="level-card-top">
          <span class="level-badge">${lvl.completed ? '✓ ' : ''}${badgeLabel}</span>
          <span class="level-word-count">${tr.wordsShort(lvl.words.length)}</span>
        </div>
        <div class="level-card-name">${escapeHtml(localTitle)}</div>
        <div class="level-card-sub" dir="ltr">${escapeHtml(lvl.deName)}</div>
      `;

      btn.addEventListener('click', () => {
        selectLevel(idx, true);
      });
      levelListContainer.appendChild(btn);

      // 2. Компактный чип выбора уровня для меню
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'level-chip-btn' +
        (idx === state.currentLevelIndex ? ' active' : '') +
        (lvl.completed ? ' completed' : '');
      chip.textContent = lvl.id === 'level-auto-all'
        ? `🏆 AUTO (${lvl.words.length})`
        : tr.levelShort(lvl.number, localTitle.split(',')[0]);
      chip.addEventListener('click', () => {
        selectLevel(idx, true);
      });
      overlayLevelChips.appendChild(chip);
    });
  }

  // --- Выбор и показ превью уровня ---
  function selectLevel(levelIndex, showStartOverlay = true) {
    state.currentLevelIndex = levelIndex;
    state.running = false;
    state.paused = false;
    state.gameOver = false;
    state.activeWords = [];
    state.lockedWordId = null;
    state.lasers = [];

    const lvl = levels[levelIndex];
    const tr = t();
    hudLevelTitle.textContent = lvl.id === 'level-auto-all'
      ? tr.autoAllShort
      : tr.levelShort(lvl.number, getLevelTitle(lvl));
    hudProgressBar.style.width = '0%';
    if (kbdProgressFill) kbdProgressFill.style.width = '0%';
    hudProgressText.textContent = `0 / ${lvl.words.length}`;

    renderLevelSidebar();
    updateBottomTargetUI();

    if (showStartOverlay) {
      showLevelIntroOverlay();
    } else {
      startLevelNow();
    }
  }

  function renderWordsPreviewList(wordsArray, container) {
    container.innerHTML = '';
    wordsArray.forEach(item => {
      const div = document.createElement('div');
      div.className = 'preview-word-item';
      div.dataset.art = item.article || '';
      const transText = getWordTranslation(item);
      const dirAttr = isRtlTranslation(item) ? ' dir="rtl"' : ' dir="ltr"';
      div.innerHTML = `
        <span class="preview-word-de" dir="ltr">${escapeHtml(item.raw)}</span>
        <span class="preview-word-ru"${dirAttr}>${escapeHtml(transText)}</span>
      `;
      div.title = '🔊';
      div.style.cursor = 'pointer';
      div.addEventListener('click', () => {
        sound.speakGerman(item.withArticle || item.word);
      });
      container.appendChild(div);
    });
  }

  function showLevelIntroOverlay() {
    state.overlayMode = 'intro';
    state.activeQuiz = null;
    levelQuizBox.style.display = 'none';
    delete btnStartLevel.dataset.resumeMode;
    refreshOverlayContent();
    centerOverlay.classList.remove('hidden');
  }

  function startLevelNow(customWordPool = null) {
    const lvl = levels[state.currentLevelIndex];
    const pool = customWordPool || lvl.words;

    resizeCanvas();
    state.wordQueue = shuffleArray(pool);
    state.totalWordsInLevel = state.wordQueue.length;
    state.wordsDestroyedInLevel = 0;
    state.activeWords = [];
    state.lockedWordId = null;
    state.lasers = [];
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

    centerOverlay.classList.add('hidden');
    updateHudStats();
    updateBottomTargetUI();
    renderLevelSidebar();

    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
  }

  function getWordFontPx(textLength) {
    const isMobile = canvas.width < 520;
    if (!isMobile) return 18;
    if (textLength >= 22) return 12.5;
    if (textLength >= 17) return 14;
    if (textLength >= 13) return 15.5;
    return 17;
  }

  // --- Спавн нового слова сверху ---
  function spawnNextWord() {
    if (state.wordQueue.length === 0) return;

    const entry = state.wordQueue.pop();
    const targetText = getTargetString(entry);
    const bounds = getPlayBounds();

    const fontPx = getWordFontPx(targetText.length);
    ctx.font = `700 ${fontPx}px "JetBrains Mono", Consolas, monospace`;
    const textWidth = ctx.measureText(targetText).width;
    const halfW = Math.min((bounds.right - bounds.left) / 2 - 6, Math.max(48, textWidth / 2 + 16));

    const minX = bounds.left + halfW;
    const maxX = Math.max(minX + 4, bounds.right - halfW);

    let bestX = minX + Math.random() * (maxX - minX);
    for (let attempt = 0; attempt < 6; attempt++) {
      const candidateX = minX + Math.random() * (maxX - minX);
      const tooClose = state.activeWords.some(w => w.y < bounds.top + 110 && Math.abs(w.x - candidateX) < 110);
      if (!tooClose) {
        bestX = candidateX;
        break;
      }
    }

    const lvl = levels[state.currentLevelIndex];
    const speedPreset = state.speedPresets[state.speedPresetIndex].mult;
    const lengthFactor = Math.max(0.58, Math.min(1.12, 11 / Math.max(6, targetText.length)));
    const playHeight = bounds.bottom - bounds.top;
    const heightScale = Math.max(0.68, Math.min(1.05, playHeight / 560));
    const baseSpeedUnscaled = (33 + Math.random() * 9) * (lvl.speedMultiplier || 1) * lengthFactor * heightScale;

    state.activeWords.push({
      id: nextEntityId++,
      entry,
      text: targetText,
      typedCount: 0,
      x: bestX,
      y: bounds.top - 10,
      vx: 0,
      baseSpeedUnscaled,
      vy: baseSpeedUnscaled * speedPreset,
      recoilY: 0,
      hitFlash: 0,
      spawnTime: performance.now()
    });

    updateKeyboardNextHint();
  }

  // --- Выстрел по букве ---
  function hitWordLetter(wordObj) {
    wordObj.typedCount++;
    wordObj.recoilY = Math.min(14, wordObj.recoilY + 4.5);
    wordObj.hitFlash = 1.0;

    state.shotsFired++;
    state.shotsHit++;
    state.score += 10 * state.combo;

    const dx = wordObj.x - state.ship.x;
    const dy = wordObj.y - state.ship.y;
    state.ship.targetAngle = Math.atan2(dy, dx);
    state.ship.recoil = 7;

    const style = getArticleStyle(wordObj.entry.article);
    const noseX = state.ship.x + Math.cos(state.ship.targetAngle) * 22;
    const noseY = state.ship.y + Math.sin(state.ship.targetAngle) * 22;

    state.lasers.push({
      x1: noseX,
      y1: noseY,
      x2: wordObj.x,
      y2: wordObj.y,
      color: style.main,
      alpha: 1.0
    });

    spawnParticles(wordObj.x, wordObj.y + 6, style.main, 6, 90);
    sound.playLaser(wordObj.typedCount);

    if (wordObj.typedCount >= wordObj.text.length) {
      explodeWord(wordObj, true);
    } else {
      updateBottomTargetUI();
      updateKeyboardNextHint();
    }

    updateHudStats();
  }

  // --- ВЗРЫВ СЛОВА + ПОКАЗ ПЕРЕВОДА ---
  function explodeWord(wordObj, byPlayer = true) {
    const idx = state.activeWords.findIndex(w => w.id === wordObj.id);
    if (idx !== -1) {
      state.activeWords.splice(idx, 1);
    }

    if (state.lockedWordId === wordObj.id) {
      state.lockedWordId = null;
    }

    const style = getArticleStyle(wordObj.entry.article);

    state.shockwaves.push({
      x: wordObj.x,
      y: wordObj.y,
      radius: 8,
      maxRadius: 78,
      color: style.main,
      alpha: 1.0
    });

    spawnParticles(wordObj.x, wordObj.y, style.main, 24, 190);
    spawnParticles(wordObj.x, wordObj.y, '#fbbf24', 10, 130);

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

    state.killHistory.unshift(wordObj.entry);
    if (state.killHistory.length > 40) state.killHistory.pop();
    rerenderKillFeed();

    if (byPlayer) {
      state.wordsDestroyedInLevel++;
      state.combo = Math.min(12, state.combo + 1);
      state.maxCombo = Math.max(state.maxCombo, state.combo);
      state.score += wordObj.text.length * 25 * state.combo;

      sound.playExplosion();
      sound.speakGerman(wordObj.entry.withArticle || wordObj.entry.word);
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

  function spawnParticles(x, y, color, count, maxSpeed) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 25 + Math.random() * maxSpeed;
      state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.8 + 1.4,
        color,
        alpha: 1.0,
        decay: 0.9 + Math.random() * 0.9
      });
    }
  }

  // --- Отрисовка журнала сбитых слов ---
  function rerenderKillFeed() {
    if (!killFeedContainer) return;
    if (state.killHistory.length === 0) {
      killFeedContainer.innerHTML = `
        <div class="kill-feed-empty">${t().killFeedEmpty}</div>
      `;
      return;
    }

    killFeedContainer.innerHTML = '';
    state.killHistory.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'kill-card';
      card.dataset.art = entry.article || '';
      card.title = '🔊';

      const transText = getWordTranslation(entry);
      const dirAttr = isRtlTranslation(entry) ? ' dir="rtl"' : ' dir="ltr"';

      card.innerHTML = `
        <div class="kill-card-top" dir="ltr">
          <span class="kill-de">${escapeHtml(entry.raw)}</span>
          <button type="button" class="kill-speak-btn" aria-label="🔊">🔊</button>
        </div>
        <div class="kill-ru"${dirAttr}>${escapeHtml(transText)}</div>
      `;

      card.addEventListener('click', () => {
        sound.speakGerman(entry.withArticle || entry.word);
      });

      killFeedContainer.appendChild(card);
    });
  }

  // --- Подсветка следующей нужной клавиши на экранной клавиатуре ---
  function updateKeyboardNextHint() {
    document.querySelectorAll('.zkey.next-key-hint').forEach(el => {
      el.classList.remove('next-key-hint');
    });

    if (!state.running || state.paused) return;

    const locked = state.activeWords.find(w => w.id === state.lockedWordId);
    if (locked) {
      let nextChar = locked.text[locked.typedCount];
      if (nextChar === '-' || nextChar === ' ') {
        nextChar = locked.text[locked.typedCount + 1];
      }
      const baseKey = mapGermanCharToBaseKey(nextChar);
      if (baseKey) {
        const keyBtn = document.querySelector(`.zkey[data-key="${baseKey}"]`);
        if (keyBtn) keyBtn.classList.add('next-key-hint');
      }
    }
  }

  // --- Обработка ввода с физической клавиатуры ---
  window.addEventListener('keydown', (e) => {
    if ((dictDialog && dictDialog.open) || (customWordsDialog && customWordsDialog.open)) {
      return;
    }

    if (!centerOverlay.classList.contains('hidden')) {
      if (e.key === 'Enter') {
        e.preventDefault();
        btnStartLevel.click();
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
    flashVirtualKey(mapGermanCharToBaseKey(char));
    processTypedChar(char);
  });

  function flashVirtualKey(baseKey) {
    if (!baseKey) return;
    const btn = document.querySelector(`.zkey[data-key="${baseKey}"]`);
    if (!btn) return;
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 110);
  }

  // --- Обработка нажатий по экранной клавиатуре ZType ---
  document.querySelectorAll('.zkey').forEach(btn => {
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      sound.init();

      if (!state.running || state.paused || state.gameOver) return;

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
    });
  });

  function processTypedChar(char) {
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

      if ((expectedChar === '-' || expectedChar === ' ') && char !== '-' && char !== ' ') {
        const afterSeparator = lockedWord.text[lockedWord.typedCount + 1];
        if (afterSeparator) {
          const checkAfter = charsMatchGerman(char, afterSeparator);
          if (checkAfter.matched) {
            lockedWord.typedCount++;
            state.lastAbsorbedUmlautE = checkAfter.umlautSub;
            state.lastAbsorbedEszettS = checkAfter.eszettSub;
            hitWordLetter(lockedWord);
            return;
          }
        }
      }

      const matchRes = charsMatchGerman(char, expectedChar);
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
      return firstChar && charsMatchGerman(char, firstChar).matched;
    });

    if (candidates.length > 0) {
      candidates.sort((a, b) => b.y - a.y);
      const chosen = candidates[0];
      state.lockedWordId = chosen.id;

      const matchRes = charsMatchGerman(char, chosen.text[chosen.typedCount]);
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

  // --- EMP-Волна ---
  function triggerEmpWave() {
    if (!state.running || state.paused || state.empCharges <= 0 || state.activeWords.length === 0) return;

    state.empCharges--;
    empCountEl.textContent = String(state.empCharges);
    btnEmp.disabled = state.empCharges <= 0;

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

  // --- Обновление строки прицела над клавиатурой ---
  function updateBottomTargetUI() {
    const locked = state.activeWords.find(w => w.id === state.lockedWordId);
    if (!locked) {
      bottomTargetPreview.innerHTML = `<span style="color: var(--text-muted);">${escapeHtml(t().targetIdle)}</span>`;
      return;
    }

    const typedPart = locked.text.slice(0, locked.typedCount);
    const remainPart = locked.text.slice(locked.typedCount);
    const transText = getWordTranslation(locked.entry);
    const dirAttr = isRtlTranslation(locked.entry) ? ' dir="rtl"' : ' dir="ltr"';

    bottomTargetPreview.innerHTML = `
      <span style="color: var(--accent-cyan);" dir="ltr">[${escapeHtml(locked.entry.article)}]</span>
      <span dir="ltr"><span class="target-word-typed">${escapeHtml(typedPart)}</span><strong style="color:#fff;">${escapeHtml(remainPart)}</strong></span>
      <span style="color: var(--accent-amber);"${dirAttr}>— ${escapeHtml(transText)}</span>
    `;
  }

  // --- Обновление верхнего HUD ---
  function updateHudStats() {
    hudScore.textContent = state.score.toLocaleString('ru-RU');
    if (hudCombo) hudCombo.textContent = `x${state.combo}`;

    const acc = state.shotsFired > 0
      ? Math.round((state.shotsHit / state.shotsFired) * 100)
      : 100;
    if (hudAccuracy) hudAccuracy.textContent = `${acc}%`;

    hudShields.textContent = '❤️'.repeat(Math.max(0, state.shields)) +
      '🖤'.repeat(Math.max(0, state.maxShields - state.shields));

    empCountEl.textContent = String(state.empCharges);
    btnEmp.disabled = state.empCharges <= 0;

    const pct = state.totalWordsInLevel > 0
      ? Math.min(100, Math.round((state.wordsDestroyedInLevel / state.totalWordsInLevel) * 100))
      : 0;
    hudProgressBar.style.width = `${pct}%`;
    if (kbdProgressFill) kbdProgressFill.style.width = `${pct}%`;
    hudProgressText.textContent = `${state.wordsDestroyedInLevel} / ${state.totalWordsInLevel}`;
  }

  // --- Завершение уровня + Мини-блиц ---
  function completeLevel() {
    state.running = false;
    state.overlayMode = 'complete';
    const lvl = levels[state.currentLevelIndex];
    lvl.completed = true;
    renderLevelSidebar();
    refreshOverlayContent();
    startPostLevelQuiz(lvl.words);
    centerOverlay.classList.remove('hidden');
  }

  // --- Мини-блиц из 3 слов после уровня (мгновенно переводится при переключении RU / עברית) ---
  function startPostLevelQuiz(levelWords) {
    if (!levelWords || levelWords.length < 4) {
      state.activeQuiz = null;
      levelQuizBox.style.display = 'none';
      return;
    }

    levelQuizBox.style.display = 'flex';
    const questions = shuffleArray(levelWords).slice(0, 3).map(currentQ => {
      const wrongPool = allAutoWords.filter(w => w.raw !== currentQ.raw);
      const wrongChoices = shuffleArray(wrongPool).slice(0, 3);
      const options = shuffleArray([currentQ, ...wrongChoices]);
      return { currentQ, options };
    });

    state.activeQuiz = {
      questions,
      qIndex: 0,
      correctCount: 0,
      answered: false,
      selectedOptRaw: null
    };

    renderCurrentQuizQuestion(true);
  }

  function renderCurrentQuizQuestion(speakNow = false) {
    const quiz = state.activeQuiz;
    if (!quiz) return;
    const tr = t();

    if (quizHeaderTitle) quizHeaderTitle.textContent = tr.quizHeader;

    if (quiz.qIndex >= quiz.questions.length) {
      quizScoreText.textContent = tr.quizDoneScore(quiz.correctCount, quiz.questions.length);
      quizQuestionWord.dir = isHebrewUI() ? 'rtl' : 'ltr';
      quizQuestionWord.textContent = tr.quizDoneTitle(quiz.correctCount, quiz.questions.length);
      quizOptionsGrid.innerHTML = '';
      return;
    }

    const { currentQ, options } = quiz.questions[quiz.qIndex];
    quizScoreText.textContent = `${quiz.qIndex + 1} / ${quiz.questions.length}`;
    quizQuestionWord.dir = 'ltr';
    quizQuestionWord.textContent = currentQ.raw;

    if (speakNow) {
      sound.speakGerman(currentQ.withArticle || currentQ.word);
    }

    quizOptionsGrid.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-opt-btn';
      const optText = getWordTranslation(opt);
      btn.textContent = optText;
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

        if (opt.raw === currentQ.raw) {
          quiz.correctCount++;
          state.score += 150;
          updateHudStats();
          sound.playExplosion();
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

  // --- Поражение ---
  function triggerGameOver() {
    state.running = false;
    state.gameOver = true;
    state.overlayMode = 'gameover';
    state.activeQuiz = null;
    levelQuizBox.style.display = 'none';
    refreshOverlayContent();
    centerOverlay.classList.remove('hidden');
  }

  function togglePause() {
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

  // --- Главный игровой цикл ---
  let lastFrameTime = performance.now();

  function gameLoop(now) {
    const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
    lastFrameTime = now;

    update(dt);
    render();

    requestAnimationFrame(gameLoop);
  }

  function update(dt) {
    const bounds = getPlayBounds();
    state.ship.x = bounds.centerX;
    state.ship.y = bounds.bottom - 24;

    for (const s of state.stars) {
      s.y += s.speed * (state.running && !state.paused ? 1.35 : 0.4) * dt;
      if (s.y > bounds.bottom) {
        s.y = 0;
        s.x = Math.random() * canvas.width;
      }
    }

    if (state.layoutWarningTimer > 0) {
      state.layoutWarningTimer = Math.max(0, state.layoutWarningTimer - dt);
    }

    for (let i = state.lasers.length - 1; i >= 0; i--) {
      state.lasers[i].alpha -= dt * 7.5;
      if (state.lasers[i].alpha <= 0) state.lasers.splice(i, 1);
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

    if (!state.running || state.paused) return;

    const lvl = levels[state.currentLevelIndex];
    const speedPreset = state.speedPresets[state.speedPresetIndex].mult;
    state.spawnTimer -= dt;

    const maxActiveOnScreen = canvas.width < 520 ? 5 : 7;

    if (state.spawnTimer <= 0 && state.wordQueue.length > 0 && state.activeWords.length < maxActiveOnScreen) {
      spawnNextWord();
      const baseInterval = (lvl.spawnIntervalMs || 2600) / 1000;
      state.spawnTimer = baseInterval / Math.sqrt(speedPreset);
    } else if (state.activeWords.length === 0 && state.wordQueue.length > 0) {
      spawnNextWord();
      state.spawnTimer = 1.8;
    }

    for (let i = state.activeWords.length - 1; i >= 0; i--) {
      const w = state.activeWords[i];

      const dxToShip = state.ship.x - w.x;
      const pullFactor = w.y > bounds.bottom * 0.55 ? 0.12 : 0.03;
      w.x += dxToShip * pullFactor * dt;

      if (w.recoilY > 0) {
        w.y -= w.recoilY * 9 * dt;
        w.recoilY = Math.max(0, w.recoilY - 28 * dt);
      } else {
        w.y += w.vy * dt;
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

  // --- Отрисовка игрового мира на Canvas ---
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bounds = getPlayBounds();

    ctx.save();
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = canvas.width < 520 ? 44 : 60;
    for (let x = bounds.left; x <= bounds.right; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, bounds.bottom);
      ctx.stroke();
    }
    for (let y = 0; y <= bounds.bottom; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(bounds.left, y);
      ctx.lineTo(bounds.right, y);
      ctx.stroke();
    }
    ctx.restore();

    for (const s of state.stars) {
      if (s.y > bounds.bottom) continue;
      ctx.fillStyle = `rgba(203, 213, 225, ${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    const lockedWord = state.activeWords.find(w => w.id === state.lockedWordId);
    if (lockedWord && state.running) {
      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(state.ship.x, state.ship.y);
      ctx.lineTo(lockedWord.x, lockedWord.y);
      ctx.stroke();
      ctx.restore();
    }

    for (const l of state.lasers) {
      ctx.save();
      ctx.strokeStyle = l.color;
      ctx.shadowColor = l.color;
      ctx.shadowBlur = 12;
      ctx.globalAlpha = Math.max(0, l.alpha);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(l.x1, l.y1);
      ctx.lineTo(l.x2, l.y2);
      ctx.stroke();
      ctx.restore();
    }

    for (const sw of state.shockwaves) {
      ctx.save();
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = Math.max(0, sw.alpha);
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    for (const p of state.particles) {
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 7;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    drawPlayerShip();

    for (const w of state.activeWords) {
      if (w.id !== state.lockedWordId) {
        drawWordNode(w, false, bounds);
      }
    }
    if (lockedWord) {
      drawWordNode(lockedWord, true, bounds);
    }

    for (const ft of state.floatingTranslations) {
      drawFloatingTranslation(ft, bounds);
    }

    if (state.layoutWarningTimer > 0) {
      drawLayoutWarning(bounds);
    }
  }

  function drawPlayerShip() {
    const { x, y, angle, recoil } = state.ship;
    ctx.save();
    ctx.translate(x - Math.cos(angle) * recoil, y - Math.sin(angle) * recoil);
    ctx.rotate(angle + Math.PI / 2);

    ctx.fillStyle = 'rgba(45, 212, 191, 0.85)';
    ctx.beginPath();
    ctx.moveTo(-5, 13);
    ctx.lineTo(0, 21 + Math.random() * 5);
    ctx.lineTo(5, 13);
    ctx.closePath();
    ctx.fill();

    ctx.shadowColor = '#2dd4bf';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(14, 12);
    ctx.lineTo(5, 8);
    ctx.lineTo(0, 13);
    ctx.lineTo(-5, 8);
    ctx.lineTo(-14, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#5eead4';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(4, 3);
    ctx.lineTo(-4, 3);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  function drawWordNode(w, isLocked, bounds) {
    const style = getArticleStyle(w.entry.article);
    const remainText = w.text.slice(w.typedCount);
    const typedText = w.text.slice(0, w.typedCount);

    const fontPx = getWordFontPx(w.text.length);
    ctx.font = `700 ${fontPx}px "JetBrains Mono", Consolas, monospace`;
    const typedW = ctx.measureText(typedText).width;
    const remainW = ctx.measureText(remainText).width;
    const totalW = typedW + remainW;

    const padX = canvas.width < 520 ? 8 : 11;
    const boxW = totalW + padX * 2;
    const boxH = fontPx + 11;

    const clampedDrawX = Math.max(bounds.left + boxW / 2 + 4, Math.min(bounds.right - boxW / 2 - 4, w.x));
    w.x = clampedDrawX;

    ctx.save();
    ctx.translate(clampedDrawX, w.y);

    ctx.fillStyle = isLocked ? '#fb923c' : style.main;
    ctx.shadowColor = isLocked ? '#fb923c' : style.main;
    ctx.shadowBlur = isLocked ? 12 : 6;

    ctx.beginPath();
    ctx.arc(boxW / 2 + 6, -boxH / 2 + 4, isLocked ? 4.5 : 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = isLocked ? 'rgba(251, 146, 60, 0.85)' : style.glow;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(boxW / 2 + 6, -boxH / 2 + 4, isLocked ? 9 : 7, 0, Math.PI * 2);
    ctx.stroke();

    const boxX = -boxW / 2;
    const boxY = -boxH / 2;

    if (!state.typeWithArticle && w.entry.article) {
      const badgeStr = w.entry.plural
        ? `${w.entry.article} · ${w.entry.plural}`
        : `${w.entry.article}`;
      ctx.font = '700 10px Inter, sans-serif';
      const bw = ctx.measureText(badgeStr).width + 10;
      ctx.fillStyle = 'rgba(10, 15, 28, 0.92)';
      ctx.strokeStyle = style.main;
      ctx.lineWidth = 1;
      roundRect(ctx, -bw / 2, boxY - 15, bw, 14, 4);
      ctx.fill();
      ctx.stroke();

      ctx.direction = 'ltr';
      ctx.fillStyle = style.main;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeStr, 0, boxY - 8);
    }

    ctx.fillStyle = isLocked
      ? 'rgba(28, 17, 10, 0.95)'
      : 'rgba(5, 9, 17, 0.92)';
    ctx.strokeStyle = isLocked
      ? '#fb923c'
      : (w.hitFlash > 0 ? '#ffffff' : 'rgba(148, 163, 184, 0.28)');
    ctx.lineWidth = isLocked ? 1.8 : 1;

    roundRect(ctx, boxX, boxY, boxW, boxH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.direction = 'ltr';
    ctx.font = `700 ${fontPx}px "JetBrains Mono", Consolas, monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const startTextX = -totalW / 2;

    if (typedText.length > 0) {
      ctx.fillStyle = 'rgba(52, 211, 153, 0.38)';
      ctx.fillText(typedText, startTextX, 0.5);
    }

    if (remainText.length > 0) {
      const firstRemain = remainText[0];
      const restRemain = remainText.slice(1);
      const firstRemainW = ctx.measureText(firstRemain).width;

      ctx.fillStyle = isLocked ? '#fb923c' : '#2dd4bf';
      ctx.fillText(firstRemain, startTextX + typedW, 0.5);

      ctx.fillStyle = '#f8fafc';
      ctx.fillText(restRemain, startTextX + typedW + firstRemainW, 0.5);
    }

    ctx.restore();
  }

  function drawFloatingTranslation(ft, bounds) {
    ctx.save();

    let alpha = 1.0;
    if (ft.life < 0.16) {
      alpha = ft.life / 0.16;
    } else if (ft.life > ft.maxLife - 0.75) {
      alpha = Math.max(0, (ft.maxLife - ft.life) / 0.75);
    }

    ctx.globalAlpha = alpha;

    const isMobile = canvas.width < 520;
    const deFontPx = isMobile ? 11.5 : 13;
    let ruFontPx = isMobile ? 14.5 : 17;

    ctx.font = `700 ${deFontPx}px "JetBrains Mono", Consolas, monospace`;
    const deW = ctx.measureText(ft.rawDe).width;

    const translatedStr = getWordTranslation(ft.entry);
    const transText = `💥 ${translatedStr}`;
    ctx.font = `800 ${ruFontPx}px Inter, sans-serif`;
    let transW = ctx.measureText(transText).width;

    const maxAllowedW = (bounds.right - bounds.left) - 16;
    if (transW + 24 > maxAllowedW && ruFontPx > 11) {
      ruFontPx = Math.max(11, Math.floor(ruFontPx * (maxAllowedW - 24) / transW));
      ctx.font = `800 ${ruFontPx}px Inter, sans-serif`;
      transW = ctx.measureText(transText).width;
    }

    const cardW = Math.min(maxAllowedW, Math.max(deW, transW) + 26);
    const cardH = isMobile ? 48 : 54;

    const drawX = Math.max(bounds.left + cardW / 2 + 6, Math.min(bounds.right - cardW / 2 - 6, ft.x));
    const drawY = Math.max(bounds.top + cardH / 2 + 6, Math.min(bounds.bottom - cardH / 2 - 6, ft.y));

    ctx.translate(drawX, drawY);

    ctx.shadowColor = ft.color;
    ctx.shadowBlur = 14;
    ctx.fillStyle = 'rgba(8, 14, 28, 0.95)';
    ctx.strokeStyle = ft.color;
    ctx.lineWidth = 1.6;

    roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 10);
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.direction = 'ltr';
    ctx.font = `700 ${deFontPx}px "JetBrains Mono", Consolas, monospace`;
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.rawDe, 0, -10);

    ctx.direction = isRtlTranslation(ft.entry) ? 'rtl' : 'ltr';
    ctx.font = `800 ${ruFontPx}px Inter, sans-serif`;
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(transText, 0, 10);

    ctx.restore();
  }

  function drawLayoutWarning(bounds) {
    ctx.save();
    const w = Math.min(380, bounds.right - bounds.left - 20);
    ctx.translate(bounds.centerX, state.ship.y - 60);
    ctx.fillStyle = 'rgba(127, 29, 29, 0.94)';
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 1.5;
    roundRect(ctx, -w / 2, -18, w, 36, 9);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 12.5px Inter, sans-serif';
    ctx.fillStyle = '#fecdd3';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(t().layoutWarning, 0, 0);
    ctx.restore();
  }

  function roundRect(context, x, y, width, height, radius) {
    context.beginPath();
    if (context.roundRect) {
      context.roundRect(x, y, width, height, radius);
    } else {
      context.moveTo(x + radius, y);
      context.lineTo(x + width - radius, y);
      context.quadraticCurveTo(x + width, y, x + width, y + radius);
      context.lineTo(x + width, y + height - radius);
      context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      context.lineTo(x + radius, y + height);
      context.quadraticCurveTo(x, y + height, x, y + height - radius);
      context.lineTo(x, y + radius);
      context.quadraticCurveTo(x, y, x + radius, y);
      context.closePath();
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function parseGermanEntryLine(line) {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.includes(';')) return null;

    const parts = trimmed.split(';').map(s => s.trim());
    const raw = parts[0];
    const second = parts[1] || '';
    const third = parts[2] || '';
    if (!raw || !second) return null;

    const hasHebrewInSecond = /[\u0590-\u05FF]/.test(second);
    const ru = second;
    const he = third || (hasHebrewInSecond ? second : second);

    const beforeComma = raw.split(',')[0].trim();
    const afterComma = raw.includes(',') ? raw.split(',').slice(1).join(',').trim() : '';

    let article = '';
    let word = beforeComma;
    let withArticle = beforeComma;

    if (/^(der|die|das)\s+/i.test(beforeComma)) {
      const wParts = beforeComma.split(/\s+/);
      article = wParts[0].toLowerCase();
      word = wParts.slice(1).join(' ');
      withArticle = `${article} ${word}`;
    } else if (afterComma.includes('Pl.')) {
      article = 'Pl.';
    } else if (/^[a-zäöüß]/.test(beforeComma)) {
      article = 'Verb';
    }

    return {
      raw,
      word,
      withArticle,
      article: article || 'DE',
      plural: afterComma,
      ru,
      he
    };
  }

  // --- События кнопок интерфейса ---
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
    if (state.currentLevelIndex < levels.length - 1) {
      selectLevel(state.currentLevelIndex + 1, false);
    }
  });

  btnPracticeMistakes.addEventListener('click', () => {
    sound.init();
    const mistakes = Array.from(state.mistakeWordsMap.values());
    if (mistakes.length > 0) {
      startLevelNow(mistakes);
    }
  });

  btnEmp.addEventListener('click', () => {
    triggerEmpWave();
    btnEmp.blur();
  });

  btnLangMode.addEventListener('click', () => {
    const idx = state.langModes.findIndex(m => m.id === state.translationLang);
    const nextMode = state.langModes[(idx + 1) % state.langModes.length];
    setTranslationLanguage(nextMode.id);
    btnLangMode.blur();
  });

  document.querySelectorAll('.lang-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setTranslationLanguage(btn.dataset.lang);
      btn.blur();
    });
  });

  if (btnArticleMode) {
    btnArticleMode.addEventListener('click', () => {
      state.typeWithArticle = !state.typeWithArticle;
      const tr = t();
      btnArticleMode.textContent = state.typeWithArticle ? tr.articleMode : tr.badgeMode;
      btnArticleMode.classList.toggle('active', state.typeWithArticle);

      state.activeWords.forEach(w => {
        if (w.typedCount === 0) {
          w.text = getTargetString(w.entry);
        }
      });
      btnArticleMode.blur();
    });
  }

  btnSpeedMode.addEventListener('click', () => {
    state.speedPresetIndex = (state.speedPresetIndex + 1) % state.speedPresets.length;
    const preset = state.speedPresets[state.speedPresetIndex];
    btnSpeedMode.textContent = preset.label;

    state.activeWords.forEach(w => {
      if (w.baseSpeedUnscaled) {
        w.vy = w.baseSpeedUnscaled * preset.mult;
      }
    });
    btnSpeedMode.blur();
  });

  btnTtsMode.addEventListener('click', () => {
    sound.ttsEnabled = !sound.ttsEnabled;
    btnTtsMode.classList.toggle('active', sound.ttsEnabled);
    btnTtsMode.innerHTML = sound.ttsEnabled
      ? '🔊<span class="hide-mobile"> DE</span>'
      : '🔇<span class="hide-mobile"> DE</span>';
    btnTtsMode.blur();
  });

  btnPause.addEventListener('click', () => {
    togglePause();
    btnPause.blur();
  });

  if (btnQuickLevels) {
    btnQuickLevels.addEventListener('click', () => {
      togglePause();
    });
  }

  if (btnClearFeed) {
    btnClearFeed.addEventListener('click', () => {
      state.killHistory = [];
      rerenderKillFeed();
    });
  }

  function renderFullDictionary(filterQuery = '') {
    const q = filterQuery.trim().toLowerCase();
    const filtered = allAutoWords.filter(item =>
      !q ||
      item.raw.toLowerCase().includes(q) ||
      (item.ru && item.ru.toLowerCase().includes(q)) ||
      (item.he && item.he.toLowerCase().includes(q))
    );
    renderWordsPreviewList(filtered, dictFullList);
  }

  btnOpenDict.addEventListener('click', () => {
    if (state.running && !state.paused) {
      state.paused = true;
    }
    renderFullDictionary(dictSearchInput.value);
    dictDialog.showModal();
  });

  btnCloseDict.addEventListener('click', () => {
    dictDialog.close();
    if (state.running && centerOverlay.classList.contains('hidden')) {
      state.paused = false;
    }
  });

  dictSearchInput.addEventListener('input', () => {
    renderFullDictionary(dictSearchInput.value);
  });

  if (btnOpenCustom) {
    btnOpenCustom.addEventListener('click', () => {
      if (state.running && !state.paused) state.paused = true;
      customWordsDialog.showModal();
    });
  }

  btnCloseCustom.addEventListener('click', () => {
    customWordsDialog.close();
    if (state.running && centerOverlay.classList.contains('hidden')) {
      state.paused = false;
    }
  });

  btnSaveCustomWords.addEventListener('click', () => {
    const rawLines = customWordsInput.value.split(/\r?\n/);
    const parsedWords = rawLines.map(parseGermanEntryLine).filter(Boolean);
    if (parsedWords.length === 0) return;

    const customLevelNum = levels.length + 1;
    levels.push({
      id: `custom-${Date.now()}`,
      number: customLevelNum,
      name: `Свой список #${customLevelNum - 7}`,
      heName: `רשימה משלי #${customLevelNum - 7}`,
      deName: `Eigene Wörter (${parsedWords.length})`,
      description: 'Пользовательский набор немецких слов для тренировки.',
      heDescription: 'מאגר מילים מותאם אישית בגרמנית לתרגול.',
      speedMultiplier: 0.95,
      spawnIntervalMs: 2700,
      words: parsedWords
    });

    allAutoWords.push(...parsedWords);
    customWordsDialog.close();
    selectLevel(levels.length - 1, true);
  });

  // --- Инициализация ---
  resizeCanvas();
  applyStaticUILocalization();
  selectLevel(0, true);
  requestAnimationFrame(gameLoop);
})();
