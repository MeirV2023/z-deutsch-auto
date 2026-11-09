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
      } catch (_) {
        // Игнорируем ошибки TTS
      }
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
      deName: 'Auto-Marathon (73 Wörter)',
      description: 'Финальный главный уровень AUTO: все 73 слова из всех категорий в динамичном космическом потоке!',
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

  // --- Получение перевода слова в зависимости от выбранного языка (RU / HE / Оба) ---
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
  const overlayBadge = document.getElementById('overlayBadge');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayDesc = document.getElementById('overlayDesc');
  const overlayWordsHeader = document.getElementById('overlayWordsHeader');
  const overlayWordsPreview = document.getElementById('overlayWordsPreview');
  const btnStartLevel = document.getElementById('btnStartLevel');
  const btnNextLevel = document.getElementById('btnNextLevel');
  const btnPracticeMistakes = document.getElementById('btnPracticeMistakes');

  const levelQuizBox = document.getElementById('levelQuizBox');
  const quizScoreText = document.getElementById('quizScoreText');
  const quizQuestionWord = document.getElementById('quizQuestionWord');
  const quizOptionsGrid = document.getElementById('quizOptionsGrid');

  const dictDialog = document.getElementById('dictDialog');
  const btnCloseDict = document.getElementById('btnCloseDict');
  const dictSearchInput = document.getElementById('dictSearchInput');
  const dictFullList = document.getElementById('dictFullList');

  const customWordsDialog = document.getElementById('customWordsDialog');
  const btnCloseCustom = document.getElementById('btnCloseCustom');
  const customWordsInput = document.getElementById('customWordsInput');
  const btnSaveCustomWords = document.getElementById('btnSaveCustomWords');

  // --- Размеры игрового поля с учётом экранной клавиатуры ZType и боковых панелей ---
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

  // --- Формирование строки для ввода ---
  function getTargetString(wordEntry) {
    return state.typeWithArticle ? wordEntry.withArticle : wordEntry.word;
  }

  // --- Базовая латинская клавиша для немецкой буквы (для подсветки на клавиатуре) ---
  function mapGermanCharToBaseKey(ch) {
    if (!ch) return '';
    const low = ch.toLowerCase();
    if (low === 'ä') return 'a';
    if (low === 'ö') return 'o';
    if (low === 'ü') return 'u';
    if (low === 'ß') return 's';
    return low;
  }

  // --- Умное сравнение немецких букв (поддержка ä=a, ö=o, ü=u, ß=s и регистронезависимости) ---
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

  // --- Перемешивание массива (Fisher-Yates) ---
  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // --- Переключение языка перевода (RU / עברית / Оба) ---
  function setTranslationLanguage(langId) {
    state.translationLang = langId;
    const modeObj = state.langModes.find(m => m.id === langId) || state.langModes[0];
    btnLangMode.textContent = modeObj.label;

    document.querySelectorAll('.lang-quick-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === langId);
    });

    const lvl = levels[state.currentLevelIndex];
    if (lvl) {
      renderWordsPreviewList(lvl.words, overlayWordsPreview);
    }
    if (dictDialog && dictDialog.open) {
      renderFullDictionary(dictSearchInput.value);
    }
    rerenderKillFeed();
    updateBottomTargetUI();
  }

  // --- Отрисовка списка уровней (боковая панель ПК + быстрые чипы в меню для телефона) ---
  function renderLevelSidebar() {
    levelListContainer.innerHTML = '';
    overlayLevelChips.innerHTML = '';

    const totalWords = levels
      .filter(l => l.id !== 'level-auto-all')
      .reduce((acc, l) => acc + l.words.length, 0);
    totalWordsCounter.textContent = `${totalWords} слова`;

    levels.forEach((lvl, idx) => {
      // 1. Карточка для левой панели на ПК
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'level-card' +
        (idx === state.currentLevelIndex ? ' active' : '') +
        (lvl.completed ? ' completed' : '');

      const badgeLabel = lvl.id === 'level-auto-all'
        ? '🏆 ГЛАВНЫЙ AUTO'
        : `УРОВЕНЬ ${lvl.number}`;

      btn.innerHTML = `
        <div class="level-card-top">
          <span class="level-badge">${lvl.completed ? '✓ ' : ''}${badgeLabel}</span>
          <span class="level-word-count">${lvl.words.length} сл.</span>
        </div>
        <div class="level-card-name">${lvl.name}</div>
        <div class="level-card-sub">${lvl.deName}</div>
      `;

      btn.addEventListener('click', () => {
        selectLevel(idx, true);
      });
      levelListContainer.appendChild(btn);

      // 2. Компактный чип выбора уровня для мобильного меню
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'level-chip-btn' +
        (idx === state.currentLevelIndex ? ' active' : '') +
        (lvl.completed ? ' completed' : '');
      chip.textContent = lvl.id === 'level-auto-all'
        ? `🏆 AUTO (${lvl.words.length})`
        : `Ур.${lvl.number}: ${lvl.name.split(',')[0]}`;
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
    hudLevelTitle.textContent = lvl.id === 'level-auto-all'
      ? 'AUTO (Все слова)'
      : `Ур.${lvl.number}: ${lvl.name}`;
    hudProgressBar.style.width = '0%';
    if (kbdProgressFill) kbdProgressFill.style.width = '0%';
    hudProgressText.textContent = `0 / ${lvl.words.length}`;

    renderLevelSidebar();
    updateBottomTargetUI();

    if (showStartOverlay) {
      showLevelIntroOverlay(lvl);
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
      const dirAttr = isRtlTranslation(item) ? ' dir="rtl"' : '';
      div.innerHTML = `
        <span class="preview-word-de">${escapeHtml(item.raw)}</span>
        <span class="preview-word-ru"${dirAttr}>${escapeHtml(transText)}</span>
      `;
      div.title = 'Нажмите, чтобы прослушать немецкое произношение';
      div.style.cursor = 'pointer';
      div.addEventListener('click', () => {
        sound.speakGerman(item.withArticle || item.word);
      });
      container.appendChild(div);
    });
  }

  function showLevelIntroOverlay(lvl) {
    levelQuizBox.style.display = 'none';
    overlayBadge.textContent = lvl.id === 'level-auto-all'
      ? '🏆 ГЛАВНЫЙ УРОВЕНЬ: AUTO (73 СЛОВА)'
      : `КАМПАНИЯ AUTO · УРОВЕНЬ ${lvl.number} ИЗ ${levels.length - 1}`;
    overlayTitle.textContent = `${lvl.name} (${lvl.deName})`;
    overlayDesc.innerHTML = `${escapeHtml(lvl.description)}`;
    overlayWordsHeader.textContent = `📋 Посмотреть слова этого уровня (${lvl.words.length})`;

    renderWordsPreviewList(lvl.words, overlayWordsPreview);

    btnStartLevel.textContent = '🚀 В бой! Начать уровень';
    btnStartLevel.style.display = 'inline-flex';
    btnNextLevel.style.display = 'none';
    btnPracticeMistakes.style.display = state.mistakeWordsMap.size > 0 ? 'inline-flex' : 'none';

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

    centerOverlay.classList.add('hidden');
    updateHudStats();
    updateBottomTargetUI();
    renderLevelSidebar();

    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
  }

  // --- Подбор размера шрифта слова, чтобы длинные немецкие слова всегда помещались на экране телефона ---
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
    // На узких/невысоких экранах телефона масштабируем базовую скорость под высоту поля
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

  // --- Выстрел по букве и проверка взрыва всего слова ---
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

  // --- ВЗРЫВ СЛОВА + ПОКАЗ ПЕРЕВОДА В КОСМОСЕ И В ЖУРНАЛЕ ---
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

  // --- Отрисовка журнала сбитых слов в правой панели ---
  function rerenderKillFeed() {
    if (!killFeedContainer) return;
    if (state.killHistory.length === 0) {
      killFeedContainer.innerHTML = `
        <div class="kill-feed-empty">
          Сбивайте летящие немецкие слова!<br><br>
          При взрыве перевод (🇷🇺 / 🇮🇱 עברית) всплывает прямо в космосе и сохраняется здесь.
        </div>
      `;
      return;
    }

    killFeedContainer.innerHTML = '';
    state.killHistory.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'kill-card';
      card.dataset.art = entry.article || '';
      card.title = 'Нажмите, чтобы прослушать немецкое произношение';

      const transText = getWordTranslation(entry);
      const dirAttr = isRtlTranslation(entry) ? ' dir="rtl"' : '';

      card.innerHTML = `
        <div class="kill-card-top">
          <span class="kill-de">${escapeHtml(entry.raw)}</span>
          <button type="button" class="kill-speak-btn" aria-label="Прослушать">🔊</button>
        </div>
        <div class="kill-ru"${dirAttr}>${escapeHtml(transText)}</div>
      `;

      card.addEventListener('click', () => {
        sound.speakGerman(entry.withArticle || entry.word);
      });

      killFeedContainer.appendChild(card);
    });
  }

  // --- Подсветка следующей нужной клавиши на экранной клавиатуре ZType ---
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

  // --- Обработка нажатий по встроенной экранной клавиатуре ZType ---
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
      bottomTargetPreview.innerHTML = `<span style="color: var(--text-muted);">Нажимайте буквы, чтобы стрелять по словам...</span>`;
      return;
    }

    const typedPart = locked.text.slice(0, locked.typedCount);
    const remainPart = locked.text.slice(locked.typedCount);
    const transText = getWordTranslation(locked.entry);
    const dirAttr = isRtlTranslation(locked.entry) ? ' dir="rtl"' : '';

    bottomTargetPreview.innerHTML = `
      <span style="color: var(--accent-cyan);">[${escapeHtml(locked.entry.article)}]</span>
      <span><span class="target-word-typed">${escapeHtml(typedPart)}</span><strong style="color:#fff;">${escapeHtml(remainPart)}</strong></span>
      <span style="color: var(--accent-amber);"${dirAttr}>— ${escapeHtml(transText)}</span>
    `;
  }

  // --- Обновление верхнего HUD и полосы прогресса над клавиатурой ---
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
    const lvl = levels[state.currentLevelIndex];
    lvl.completed = true;
    renderLevelSidebar();

    overlayBadge.textContent = `🎉 УРОВЕНЬ ПРОЙДЕН! МАКС. КОМБО: x${state.maxCombo}`;
    overlayTitle.textContent = `Отличная стрельба! «${lvl.name}» зачищен`;
    overlayDesc.innerHTML = `Вы успешно сбили все слова уровня. Пройдите быстрый <strong>блиц из 3 вопросов</strong> или переходите к следующему уровню!`;

    overlayWordsHeader.textContent = `📋 Выученные слова (${lvl.words.length})`;
    renderWordsPreviewList(lvl.words, overlayWordsPreview);

    btnStartLevel.textContent = '🔄 Ещё раз';
    btnStartLevel.style.display = 'inline-flex';

    if (state.currentLevelIndex < levels.length - 1) {
      btnNextLevel.style.display = 'inline-flex';
      btnNextLevel.textContent = `Следующий: Ур.${levels[state.currentLevelIndex + 1].number} ➔`;
    } else {
      btnNextLevel.style.display = 'none';
    }

    btnPracticeMistakes.style.display = state.mistakeWordsMap.size > 0 ? 'inline-flex' : 'none';

    startPostLevelQuiz(lvl.words);
    centerOverlay.classList.remove('hidden');
  }

  // --- Мини-блиц из 3 слов после уровня ---
  function startPostLevelQuiz(levelWords) {
    if (!levelWords || levelWords.length < 4) {
      levelQuizBox.style.display = 'none';
      return;
    }

    levelQuizBox.style.display = 'flex';
    const questions = shuffleArray(levelWords).slice(0, 3);
    let qIndex = 0;
    let correctCount = 0;

    function renderQuestion() {
      if (qIndex >= questions.length) {
        quizScoreText.textContent = `${correctCount} / ${questions.length} верно!`;
        quizQuestionWord.textContent = `✨ Блиц завершён! Результат: ${correctCount} из ${questions.length}`;
        quizOptionsGrid.innerHTML = '';
        return;
      }

      const currentQ = questions[qIndex];
      const correctTrans = getWordTranslation(currentQ);
      quizScoreText.textContent = `${qIndex + 1} / ${questions.length}`;
      quizQuestionWord.textContent = currentQ.raw;
      sound.speakGerman(currentQ.withArticle || currentQ.word);

      const wrongPool = allAutoWords.filter(w => getWordTranslation(w) !== correctTrans);
      const wrongChoices = shuffleArray(wrongPool).slice(0, 3);
      const options = shuffleArray([currentQ, ...wrongChoices]);

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
        }
        btn.addEventListener('click', () => {
          const allBtns = quizOptionsGrid.querySelectorAll('button');
          allBtns.forEach(b => (b.disabled = true));

          if (optText === correctTrans) {
            btn.classList.add('correct');
            correctCount++;
            state.score += 150;
            updateHudStats();
            sound.playExplosion();
          } else {
            btn.classList.add('wrong');
            allBtns.forEach(b => {
              if (b.textContent === correctTrans) b.classList.add('correct');
            });
            sound.playMiss();
          }

          setTimeout(() => {
            qIndex++;
            renderQuestion();
          }, 900);
        });
        quizOptionsGrid.appendChild(btn);
      });
    }

    renderQuestion();
  }

  // --- Поражение ---
  function triggerGameOver() {
    state.running = false;
    state.gameOver = true;
    const lvl = levels[state.currentLevelIndex];

    levelQuizBox.style.display = 'none';
    overlayBadge.textContent = '💥 ЩИТ КОРАБЛЯ ПРОБИТ';
    overlayTitle.textContent = `Уровень «${lvl.name}» не завершён`;
    overlayDesc.innerHTML = `Сбито слов: <strong>${state.wordsDestroyedInLevel} из ${state.totalWordsInLevel}</strong>. Попробуйте ещё раз!`;

    overlayWordsHeader.textContent = `📋 Слова этого уровня (${lvl.words.length})`;
    renderWordsPreviewList(lvl.words, overlayWordsPreview);

    btnStartLevel.textContent = '🚀 Попробовать снова';
    btnStartLevel.style.display = 'inline-flex';
    btnNextLevel.style.display = 'none';
    btnPracticeMistakes.style.display = state.mistakeWordsMap.size > 0 ? 'inline-flex' : 'none';

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
    const lvl = levels[state.currentLevelIndex];
    levelQuizBox.style.display = 'none';
    overlayBadge.textContent = '⏸ ИГРА НА ПАУЗЕ';
    overlayTitle.textContent = `${lvl.name}`;
    overlayDesc.innerHTML = `Прогресс: <strong>${state.wordsDestroyedInLevel} / ${state.totalWordsInLevel}</strong> слов. Вы можете продолжить бой или выбрать другой уровень:`;
    btnStartLevel.textContent = '▶ Продолжить уровень';
    btnStartLevel.dataset.resumeMode = '1';
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

    // 1. Космическая сетка в стиле ZType
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

    // 2. Звёзды
    for (const s of state.stars) {
      if (s.y > bounds.bottom) continue;
      ctx.fillStyle = `rgba(203, 213, 225, ${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Линия прицела
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

    // 4. Лазеры
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

    // 5. Ударные кольца
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

    // 6. Частицы
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

    // 7. Корабль игрока прямо над клавиатурой ZType
    drawPlayerShip();

    // 8. Летящие немецкие слова
    for (const w of state.activeWords) {
      if (w.id !== state.lockedWordId) {
        drawWordNode(w, false, bounds);
      }
    }
    if (lockedWord) {
      drawWordNode(lockedWord, true, bounds);
    }

    // 9. ВСПЛЫВАЮЩИЕ ПЕРЕВОДЫ НА МЕСТЕ ВЗРЫВА!
    for (const ft of state.floatingTranslations) {
      drawFloatingTranslation(ft, bounds);
    }

    // 10. Предупреждение раскладки
    if (state.layoutWarningTimer > 0) {
      drawLayoutWarning(bounds);
    }
  }

  function drawPlayerShip() {
    const { x, y, angle, recoil } = state.ship;
    ctx.save();
    ctx.translate(x - Math.cos(angle) * recoil, y - Math.sin(angle) * recoil);
    ctx.rotate(angle + Math.PI / 2);

    // Пламя двигателя
    ctx.fillStyle = 'rgba(45, 212, 191, 0.85)';
    ctx.beginPath();
    ctx.moveTo(-5, 13);
    ctx.lineTo(0, 21 + Math.random() * 5);
    ctx.lineTo(5, 13);
    ctx.closePath();
    ctx.fill();

    // Корпус корабля в стиле ZType (бирюзовый неоновый истребитель)
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

    // Удерживаем плашку слова строго внутри границ экрана
    const clampedDrawX = Math.max(bounds.left + boxW / 2 + 4, Math.min(bounds.right - boxW / 2 - 4, w.x));
    w.x = clampedDrawX;

    ctx.save();
    ctx.translate(clampedDrawX, w.y);

    // Оранжевый/цветной кружок-прицел врага, как в оригинальном ZType
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

    // Бейдж артикля и мн.ч. сверху
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

      ctx.fillStyle = style.main;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeStr, 0, boxY - 8);
    }

    // Чёрная контрастная плашка под словом (как в ZType)
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

    // Отрисовка букв
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

  // --- Отрисовка голограммы с переводом (RU / עברית) на месте взрыва слова ---
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
    ctx.fillText('⚠️ Переключите раскладку на DE / EN!', 0, 0);
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

  // --- Парсер пользовательских немецких слов ---
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
      btnArticleMode.textContent = state.typeWithArticle
        ? '🏷️ С артиклем'
        : '🏷️ Бейдж';
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
    if (parsedWords.length === 0) {
      alert('Введите хотя бы одно слово в формате: немецкое слово;перевод');
      return;
    }

    const customLevelNum = levels.length + 1;
    levels.push({
      id: `custom-${Date.now()}`,
      number: customLevelNum,
      name: `Свой список #${customLevelNum - 7}`,
      deName: `Eigene Wörter (${parsedWords.length})`,
      description: 'Пользовательский набор немецких слов для тренировки.',
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
  selectLevel(0, true);
  requestAnimationFrame(gameLoop);
})();
