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

      // Повышаем тон по мере набора букв в слове, как в аркадах
      const baseFreq = Math.min(920, 420 + pitchIndex * 28);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.075);

      gain.gain.setValueAtTime(0.09, now);
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

      // Низкочастотный удар взрыва
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(170, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.36);

      oscGain.gain.setValueAtTime(0.24, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.37);

      // Аккорд успеха (приятный синтезаторный импульс)
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const chime = this.ctx.createOscillator();
        const cGain = this.ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(freq, now + idx * 0.035);
        cGain.gain.setValueAtTime(0.06, now + idx * 0.035);
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

      gain.gain.setValueAtTime(0.08, now);
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

      gain.gain.setValueAtTime(0.22, now);
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
        // Игнорируем ошибки TTS в браузерах без голосов
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
      { id: 'ru', label: '🌐 Перевод: 🇷🇺 RU' },
      { id: 'he', label: '🌐 Перевод: 🇮🇱 עברית' },
      { id: 'both', label: '🌐 Перевод: 🇷🇺+🇮🇱' }
    ],

    // Настройки игрока
    typeWithArticle: false,     // false = печатаем само слово (бейдж рода сверху), true = печатаем с артиклем
    speedPresetIndex: 0,        // По умолчанию 0.5x по запросу пользователя (доступны 0.5x, 0.7x, 1.0x, 1.35x)
    speedPresets: [
      { mult: 0.5, label: '🐌 Скорость: 0.5x' },
      { mult: 0.7, label: '🐢 Скорость: 0.7x' },
      { mult: 1.0, label: '🚀 Скорость: 1.0x' },
      { mult: 1.35, label: '⚡ Скорость: 1.35x' }
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
    mistakeWordsMap: new Map(), // Слова, где игрок ошибался или пропустил
    killHistory: [],            // История сбитых слов для перерисовки при смене языка

    // Игровые объекты на холсте
    activeWords: [],
    lockedWordId: null,
    lastAbsorbedUmlautE: false,
    lastAbsorbedEszettS: false,

    lasers: [],
    particles: [],
    shockwaves: [],
    floatingTranslations: [], // Всплывающие переводы на месте взрыва!
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

    if (lang === 'he') {
      return he || ru;
    }
    if (lang === 'both') {
      if (ru && he && ru !== he) {
        return `${ru} · ${he}`;
      }
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
  const btnClearFeed = document.getElementById('btnClearFeed');

  const levelListContainer = document.getElementById('levelListContainer');
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

  // --- Размеры игрового поля с учётом боковых панелей ---
  function getPlayBounds() {
    const isWide = window.innerWidth > 860;
    const leftPad = isWide ? 285 : 24;
    const rightPad = isWide ? 325 : 24;
    return {
      left: leftPad,
      right: Math.max(leftPad + 300, canvas.width - rightPad),
      top: 84,
      bottom: canvas.height - 76,
      centerX: (leftPad + Math.max(leftPad + 300, canvas.width - rightPad)) / 2
    };
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const bounds = getPlayBounds();
    state.ship.x = bounds.centerX;
    state.ship.y = bounds.bottom - 28;
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

    // Обновляем все открытые списки слов и журнал взрывов
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

  // --- Отрисовка списка уровней слева ---
  function renderLevelSidebar() {
    levelListContainer.innerHTML = '';
    const totalWords = levels
      .filter(l => l.id !== 'level-auto-all')
      .reduce((acc, l) => acc + l.words.length, 0);
    totalWordsCounter.textContent = `${totalWords} слова`;

    levels.forEach((lvl, idx) => {
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
    hudLevelTitle.textContent = `${lvl.id === 'level-auto-all' ? 'Главный уровень AUTO' : 'Уровень ' + lvl.number}: ${lvl.name}`;
    hudProgressBar.style.width = '0%';
    hudProgressText.textContent = `0 / ${lvl.words.length} слов`;

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
      ? '🏆 ГЛАВНЫЙ УРОВЕНЬ КУРСА: AUTO (МАРАФОН)'
      : `КАМПАНИЯ AUTO · УРОВЕНЬ ${lvl.number} ИЗ ${levels.length - 1}`;
    overlayTitle.textContent = `${lvl.name} (${lvl.deName})`;
    overlayDesc.innerHTML = `${escapeHtml(lvl.description)}<br><small style="color: var(--accent-cyan);">Выберите язык перевода (🇷🇺 Русский / 🇮🇱 עברית) сверху и нажмите на любое слово для прослушивания или жмите «В бой!»</small>`;
    overlayWordsHeader.textContent = `Слова на этом уровне (${lvl.words.length}):`;

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
    state.spawnTimer = 0.25; // Спавним первое слово почти сразу!
    state.running = true;
    state.paused = false;
    state.gameOver = false;

    centerOverlay.classList.add('hidden');
    updateHudStats();
    updateBottomTargetUI();
    renderLevelSidebar();

    // Снимаем фокус с кнопок, чтобы пробел/Enter не нажимали кнопки повторно
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
  }

  // --- Спавн нового слова сверху ---
  function spawnNextWord() {
    if (state.wordQueue.length === 0) return;

    const entry = state.wordQueue.pop();
    const targetText = getTargetString(entry);
    const bounds = getPlayBounds();

    // Выбираем координату X так, чтобы длинные слова не вылезали за края и не накладывались по высоте
    ctx.font = '700 20px "JetBrains Mono", Consolas, monospace';
    const textWidth = ctx.measureText(targetText).width;
    const halfW = Math.max(70, textWidth / 2 + 26);

    const minX = bounds.left + halfW;
    const maxX = Math.max(minX + 20, bounds.right - halfW);

    // Ищем X с минимальным перекрытием с недавно появившимися словами сверху
    let bestX = minX + Math.random() * (maxX - minX);
    for (let attempt = 0; attempt < 6; attempt++) {
      const candidateX = minX + Math.random() * (maxX - minX);
      const tooClose = state.activeWords.some(w => w.y < 180 && Math.abs(w.x - candidateX) < 150);
      if (!tooClose) {
        bestX = candidateX;
        break;
      }
    }

    const lvl = levels[state.currentLevelIndex];
    const speedPreset = state.speedPresets[state.speedPresetIndex].mult;
    // Длинные слова (например Kfz-Haftpflichtversicherung) летят чуть медленнее, чтобы их было комфортно напечатать!
    const lengthFactor = Math.max(0.58, Math.min(1.12, 11 / Math.max(6, targetText.length)));
    const baseSpeedUnscaled = (34 + Math.random() * 10) * (lvl.speedMultiplier || 1) * lengthFactor;

    state.activeWords.push({
      id: nextEntityId++,
      entry,
      text: targetText,
      typedCount: 0,
      x: bestX,
      y: bounds.top - 18,
      vx: 0,
      baseSpeedUnscaled,
      vy: baseSpeedUnscaled * speedPreset,
      recoilY: 0,
      hitFlash: 0,
      spawnTime: performance.now()
    });
  }

  // --- Выстрел по букве и проверка взрыва всего слова ---
  function hitWordLetter(wordObj) {
    wordObj.typedCount++;
    wordObj.recoilY = Math.min(14, wordObj.recoilY + 4.5);
    wordObj.hitFlash = 1.0;

    state.shotsFired++;
    state.shotsHit++;
    state.score += 10 * state.combo;

    // Поворачиваем корабль на цель
    const dx = wordObj.x - state.ship.x;
    const dy = wordObj.y - state.ship.y;
    state.ship.targetAngle = Math.atan2(dy, dx);
    state.ship.recoil = 7;

    // Создаём лазерный импульс от носа корабля к слову
    const style = getArticleStyle(wordObj.entry.article);
    const noseX = state.ship.x + Math.cos(state.ship.targetAngle) * 24;
    const noseY = state.ship.y + Math.sin(state.ship.targetAngle) * 24;

    state.lasers.push({
      x1: noseX,
      y1: noseY,
      x2: wordObj.x,
      y2: wordObj.y,
      color: style.main,
      alpha: 1.0
    });

    // Искры попадания по букве
    spawnParticles(wordObj.x, wordObj.y + 8, style.main, 6, 95);
    sound.playLaser(wordObj.typedCount);

    if (wordObj.typedCount >= wordObj.text.length) {
      explodeWord(wordObj, true);
    } else {
      updateBottomTargetUI();
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

    // 1. Взрывная волна и частицы
    state.shockwaves.push({
      x: wordObj.x,
      y: wordObj.y,
      radius: 8,
      maxRadius: 85,
      color: style.main,
      alpha: 1.0
    });

    spawnParticles(wordObj.x, wordObj.y, style.main, 28, 210);
    spawnParticles(wordObj.x, wordObj.y, '#fbbf24', 12, 140);

    // 2. ВСПЛЫВАЮЩАЯ ГОЛОГРАММА С ПЕРЕВОДОМ НА МЕСТЕ ВЗРЫВА!
    const bounds = getPlayBounds();
    const clampedX = Math.max(bounds.left + 150, Math.min(bounds.right - 150, wordObj.x));
    const clampedY = Math.max(bounds.top + 60, Math.min(bounds.bottom - 90, wordObj.y));

    state.floatingTranslations.push({
      x: clampedX,
      y: clampedY,
      vy: -22, // Плавно всплывает вверх
      entry: wordObj.entry,
      rawDe: wordObj.entry.raw,
      color: style.main,
      life: 0,
      maxLife: 4.0 // Держится 4 секунды, чтобы игрок спокойно прочитал перевод!
    });

    // 3. Добавляем в правую панель "Взорванные слова"
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

    // Проверяем, закончился ли уровень
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
        size: Math.random() * 3 + 1.5,
        color,
        alpha: 1.0,
        decay: 0.9 + Math.random() * 0.9
      });
    }
  }

  // --- Отрисовка журнала сбитых слов в правой панели ---
  function rerenderKillFeed() {
    if (state.killHistory.length === 0) {
      killFeedContainer.innerHTML = `
        <div class="kill-feed-empty">
          Сбивайте летящие немецкие слова!<br><br>
          При взрыве перевод (🇷🇺 / 🇮🇱 עברית) всплывает прямо в космосе и сохраняется здесь для повторения.
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

  // --- Обработка ввода с клавиатуры (Ядро ZType) ---
  window.addEventListener('keydown', (e) => {
    // Если открыто модальное окно словаря или добавления слов — не перехватываем ввод
    if ((dictDialog && dictDialog.open) || (customWordsDialog && customWordsDialog.open)) {
      return;
    }

    // Если открыт стартовый/финальный экран — Enter запускает уровень
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

    // Сброс текущего захвата цели (Backspace или Tab)
    if (e.key === 'Backspace' || e.key === 'Tab') {
      e.preventDefault();
      state.lockedWordId = null;
      updateBottomTargetUI();
      return;
    }

    // EMP-волна на Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      triggerEmpWave();
      return;
    }

    // Игнорируем модификаторы
    if (e.ctrlKey || e.altKey || e.metaKey || e.key.length !== 1) return;

    const char = e.key;

    // Проверка на случайную русскую или ивритскую раскладку (кириллица / иврит)
    if (/[а-яёА-ЯЁ\u0590-\u05FF]/.test(char)) {
      e.preventDefault();
      state.layoutWarningTimer = 2.6;
      sound.playMiss();
      return;
    }

    e.preventDefault();
    processTypedChar(char);
  });

  function processTypedChar(char) {
    // Если игрок только что ввёл 'a' вместо 'ä' и по привычке допечатал 'e' (ae / oe / ue)
    if (state.lastAbsorbedUmlautE && char.toLowerCase() === 'e') {
      state.lastAbsorbedUmlautE = false;
      const locked = state.activeWords.find(w => w.id === state.lockedWordId);
      if (!locked || (locked.text[locked.typedCount] || '').toLowerCase() !== 'e') {
        return; // Мягко поглощаем 'e' после замены умлаута
      }
    }
    state.lastAbsorbedUmlautE = false;

    // Аналогично для 'ss' при вводе 'ß'
    if (state.lastAbsorbedEszettS && char.toLowerCase() === 's') {
      state.lastAbsorbedEszettS = false;
      const locked = state.activeWords.find(w => w.id === state.lockedWordId);
      if (!locked || (locked.text[locked.typedCount] || '').toLowerCase() !== 's') {
        return;
      }
    }
    state.lastAbsorbedEszettS = false;

    let lockedWord = state.activeWords.find(w => w.id === state.lockedWordId);

    // Если цель уже захвачена — проверяем следующую букву захваченного слова
    if (lockedWord) {
      let expectedChar = lockedWord.text[lockedWord.typedCount];

      // Если следующий символ в слове дефис '-' или пробел ' ', а игрок сразу печатает букву после дефиса/пробела
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
        // Ошибка ввода
        state.shotsFired++;
        state.combo = 1;
        state.mistakeWordsMap.set(lockedWord.entry.raw, lockedWord.entry);
        sound.playMiss();
        updateHudStats();
      }
      return;
    }

    // Если цель ещё НЕ захвачена — ищем ближайшее к кораблю слово (максимальный Y), начинающееся с этой буквы
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

  // --- EMP-Волна (взрывает до 3 ближайших слов и показывает их переводы) ---
  function triggerEmpWave() {
    if (!state.running || state.paused || state.empCharges <= 0 || state.activeWords.length === 0) return;

    state.empCharges--;
    empCountEl.textContent = String(state.empCharges);
    btnEmp.disabled = state.empCharges <= 0;

    state.shockwaves.push({
      x: state.ship.x,
      y: state.ship.y,
      radius: 15,
      maxRadius: 520,
      color: '#fbbf24',
      alpha: 1.0
    });

    const sorted = state.activeWords.slice().sort((a, b) => b.y - a.y);
    const toDestroy = sorted.slice(0, 3);
    toDestroy.forEach(w => explodeWord(w, true));
  }

  // --- Обновление нижней строки прицела ---
  function updateBottomTargetUI() {
    const locked = state.activeWords.find(w => w.id === state.lockedWordId);
    if (!locked) {
      bottomTargetPreview.innerHTML = `<span style="color: var(--text-muted); font-weight: 500;">Печатайте первую букву любого слова...</span>`;
      return;
    }

    const typedPart = locked.text.slice(0, locked.typedCount);
    const remainPart = locked.text.slice(locked.typedCount);
    const transText = getWordTranslation(locked.entry);
    const dirAttr = isRtlTranslation(locked.entry) ? ' dir="rtl"' : '';

    bottomTargetPreview.innerHTML = `
      <span style="color: var(--text-muted); font-size: 0.78rem;">[${escapeHtml(locked.entry.article)}]</span>
      <span class="target-word-typed">${escapeHtml(typedPart)}</span><span>${escapeHtml(remainPart)}</span>
      <span style="color: var(--accent-amber); font-size: 0.8rem; margin-left: 8px;"${dirAttr}>— ${escapeHtml(transText)}</span>
    `;
  }

  // --- Обновление верхнего HUD ---
  function updateHudStats() {
    hudScore.textContent = state.score.toLocaleString('ru-RU');
    hudCombo.textContent = `x${state.combo}`;

    const acc = state.shotsFired > 0
      ? Math.round((state.shotsHit / state.shotsFired) * 100)
      : 100;
    hudAccuracy.textContent = `${acc}%`;

    hudShields.textContent = '❤️'.repeat(Math.max(0, state.shields)) +
      '🖤'.repeat(Math.max(0, state.maxShields - state.shields));

    empCountEl.textContent = String(state.empCharges);
    btnEmp.disabled = state.empCharges <= 0;

    const pct = state.totalWordsInLevel > 0
      ? Math.min(100, Math.round((state.wordsDestroyedInLevel / state.totalWordsInLevel) * 100))
      : 0;
    hudProgressBar.style.width = `${pct}%`;
    hudProgressText.textContent = `${state.wordsDestroyedInLevel} / ${state.totalWordsInLevel} слов`;
  }

  // --- Завершение уровня + Мини-блиц на проверку переводов ---
  function completeLevel() {
    state.running = false;
    const lvl = levels[state.currentLevelIndex];
    lvl.completed = true;
    renderLevelSidebar();

    overlayBadge.textContent = `🎉 УРОВЕНЬ ПРОЙДЕН! ТОЧНОСТЬ: ${hudAccuracy.textContent} · МАКС. КОМБО: x${state.maxCombo}`;
    overlayTitle.textContent = `Отличная стрельба! «${lvl.name}» зачищен`;
    overlayDesc.innerHTML = `Вы успешно сбили все слова уровня. Пройдите быстрый <strong>блиц из 3 вопросов</strong> ниже, чтобы закрепить переводы, или переходите к следующему уровню!`;

    overlayWordsHeader.textContent = `Слова, которые вы только что выучили (${lvl.words.length}):`;
    renderWordsPreviewList(lvl.words, overlayWordsPreview);

    btnStartLevel.textContent = '🔄 Пройти этот уровень ещё раз';
    btnStartLevel.style.display = 'inline-flex';

    if (state.currentLevelIndex < levels.length - 1) {
      btnNextLevel.style.display = 'inline-flex';
      btnNextLevel.textContent = `Следующий уровень (${levels[state.currentLevelIndex + 1].name}) ➔`;
    } else {
      btnNextLevel.style.display = 'none';
    }

    btnPracticeMistakes.style.display = state.mistakeWordsMap.size > 0 ? 'inline-flex' : 'none';

    startPostLevelQuiz(lvl.words);
    centerOverlay.classList.remove('hidden');
  }

  // --- Мини-блиц из 3 слов после уровня (с поддержкой иврита и русского) ---
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
      quizScoreText.textContent = `Вопрос ${qIndex + 1} / ${questions.length}`;
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
          }, 950);
        });
        quizOptionsGrid.appendChild(btn);
      });
    }

    renderQuestion();
  }

  // --- Поражение (Щит корабля разрушен) ---
  function triggerGameOver() {
    state.running = false;
    state.gameOver = true;
    const lvl = levels[state.currentLevelIndex];

    levelQuizBox.style.display = 'none';
    overlayBadge.textContent = '💥 ЩИТ КОРАБЛЯ ПРОБИТ';
    overlayTitle.textContent = `Корабль повреждён на уровне «${lvl.name}»`;
    overlayDesc.innerHTML = `Сбито слов: <strong>${state.wordsDestroyedInLevel} из ${state.totalWordsInLevel}</strong>. Попробуйте ещё раз или выберите скорость <code>0.5x</code> в верхней панели!`;

    overlayWordsHeader.textContent = 'Слова этого уровня для повторения:';
    renderWordsPreviewList(lvl.words, overlayWordsPreview);

    btnStartLevel.textContent = '🚀 Попробовать снова';
    btnStartLevel.style.display = 'inline-flex';
    btnNextLevel.style.display = 'none';
    btnPracticeMistakes.style.display = state.mistakeWordsMap.size > 0 ? 'inline-flex' : 'none';

    centerOverlay.classList.remove('hidden');
  }

  function togglePause() {
    if (!state.running && !state.paused) return;
    state.paused = !state.paused;
    btnPause.textContent = state.paused ? '▶ Продолжить' : '⏸ Пауза';
    btnPause.classList.toggle('active', state.paused);
  }

  // --- Главный игровой цикл (Обновление и рендеринг Canvas) ---
  let lastFrameTime = performance.now();

  function gameLoop(now) {
    const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
    lastFrameTime = now;

    update(dt);
    render();

    requestAnimationFrame(gameLoop);
  }

  function update(dt) {
    // Звёздное небо движется всегда
    for (const s of state.stars) {
      s.y += s.speed * (state.running && !state.paused ? 1.35 : 0.4) * dt;
      if (s.y > canvas.height) {
        s.y = 0;
        s.x = Math.random() * canvas.width;
      }
    }

    if (state.layoutWarningTimer > 0) {
      state.layoutWarningTimer = Math.max(0, state.layoutWarningTimer - dt);
    }

    // Обновляем частицы, волны и всплывающие переводы даже после последнего слова
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

    // Плавный поворот корабля
    const angleDiff = state.ship.targetAngle - state.ship.angle;
    state.ship.angle += angleDiff * Math.min(1, dt * 18);
    state.ship.recoil = Math.max(0, state.ship.recoil - dt * 35);

    if (!state.running || state.paused) return;

    // Спавн новых слов
    const lvl = levels[state.currentLevelIndex];
    const speedPreset = state.speedPresets[state.speedPresetIndex].mult;
    state.spawnTimer -= dt;

    if (state.spawnTimer <= 0 && state.wordQueue.length > 0 && state.activeWords.length < 7) {
      spawnNextWord();
      const baseInterval = (lvl.spawnIntervalMs || 2600) / 1000;
      state.spawnTimer = baseInterval / Math.sqrt(speedPreset);
    } else if (state.activeWords.length === 0 && state.wordQueue.length > 0) {
      spawnNextWord();
      state.spawnTimer = 1.8;
    }

    // Движение активных слов к кораблю
    for (let i = state.activeWords.length - 1; i >= 0; i--) {
      const w = state.activeWords[i];

      // Лёгкое смещение по горизонтали к кораблю на нижней трети экрана (как в ZType)
      const dxToShip = state.ship.x - w.x;
      const pullFactor = w.y > canvas.height * 0.55 ? 0.14 : 0.03;
      w.x += dxToShip * pullFactor * dt;

      // Отдача назад при попадании лазера
      if (w.recoilY > 0) {
        w.y -= w.recoilY * 9 * dt;
        w.recoilY = Math.max(0, w.recoilY - 28 * dt);
      } else {
        w.y += w.vy * dt;
      }

      if (w.hitFlash > 0) {
        w.hitFlash = Math.max(0, w.hitFlash - dt * 5);
      }

      // Если слово долетело до корабля!
      if (w.y >= state.ship.y - 26) {
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

    // 1. Тонкая космическая сетка в стиле ZType
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
    ctx.lineWidth = 1;
    const gridSize = 64;
    for (let x = bounds.left; x <= bounds.right; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(bounds.left, y);
      ctx.lineTo(bounds.right, y);
      ctx.stroke();
    }
    ctx.restore();

    // 2. Звёзды
    for (const s of state.stars) {
      ctx.fillStyle = `rgba(203, 213, 225, ${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Линия лазерного прицела к захваченному слову
    const lockedWord = state.activeWords.find(w => w.id === state.lockedWordId);
    if (lockedWord && state.running) {
      ctx.save();
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.28)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(state.ship.x, state.ship.y);
      ctx.lineTo(lockedWord.x, lockedWord.y);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Лазерные лучи выстрелов
    for (const l of state.lasers) {
      ctx.save();
      ctx.strokeStyle = l.color;
      ctx.shadowColor = l.color;
      ctx.shadowBlur = 14;
      ctx.globalAlpha = Math.max(0, l.alpha);
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(l.x1, l.y1);
      ctx.lineTo(l.x2, l.y2);
      ctx.stroke();
      ctx.restore();
    }

    // 5. Ударные кольца взрывов
    for (const sw of state.shockwaves) {
      ctx.save();
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = Math.max(0, sw.alpha);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 6. Частицы взрывов
    for (const p of state.particles) {
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 7. Корабль игрока
    drawPlayerShip();

    // 8. Летящие немецкие слова (сначала обычные, поверх них — захваченная цель)
    for (const w of state.activeWords) {
      if (w.id !== state.lockedWordId) {
        drawWordNode(w, false);
      }
    }
    if (lockedWord) {
      drawWordNode(lockedWord, true);
    }

    // 9. ВСПЛЫВАЮЩИЕ ПЕРЕВОДЫ НА МЕСТЕ ВЗРЫВА!
    for (const ft of state.floatingTranslations) {
      drawFloatingTranslation(ft);
    }

    // 10. Предупреждение, если нажата русская или ивритская клавиша
    if (state.layoutWarningTimer > 0) {
      drawLayoutWarning();
    }

    // 11. Индикатор паузы
    if (state.paused) {
      ctx.save();
      ctx.fillStyle = 'rgba(6, 9, 19, 0.55)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '800 28px Inter, sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'center';
      ctx.fillText('⏸ ПАУЗА (Нажмите Esc для продолжения)', bounds.centerX, canvas.height / 2);
      ctx.restore();
    }
  }

  function drawPlayerShip() {
    const { x, y, angle, recoil } = state.ship;
    ctx.save();
    ctx.translate(x - Math.cos(angle) * recoil, y - Math.sin(angle) * recoil);
    ctx.rotate(angle + Math.PI / 2);

    // Защитный ореол щита вокруг корабля
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 2, 28, 0, Math.PI * 2);
    ctx.stroke();

    // Пламя двигателя
    ctx.fillStyle = 'rgba(251, 146, 60, 0.85)';
    ctx.beginPath();
    ctx.moveTo(-6, 15);
    ctx.lineTo(0, 25 + Math.random() * 6);
    ctx.lineTo(6, 15);
    ctx.closePath();
    ctx.fill();

    // Корпус истребителя в стиле ZType
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.2;

    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(17, 14);
    ctx.lineTo(6, 10);
    ctx.lineTo(0, 15);
    ctx.lineTo(-6, 10);
    ctx.lineTo(-17, 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Кабина пилота
    ctx.fillStyle = '#7dd3fc';
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(4.5, 4);
    ctx.lineTo(-4.5, 4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  function drawWordNode(w, isLocked) {
    const style = getArticleStyle(w.entry.article);
    const remainText = w.text.slice(w.typedCount);
    const typedText = w.text.slice(0, w.typedCount);

    ctx.save();

    // Вражеский дрон-носитель слова
    ctx.translate(w.x, w.y);
    ctx.fillStyle = isLocked ? '#fb923c' : style.main;
    ctx.shadowColor = isLocked ? '#fb923c' : style.main;
    ctx.shadowBlur = isLocked ? 14 : 8;

    ctx.beginPath();
    ctx.arc(0, -18, isLocked ? 6 : 4.5, 0, Math.PI * 2);
    ctx.fill();

    if (isLocked) {
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.85)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, -18, 11, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Измеряем текст слова
    ctx.font = '700 19px "JetBrains Mono", Consolas, monospace';
    const typedW = ctx.measureText(typedText).width;
    const remainW = ctx.measureText(remainText).width;
    const totalW = typedW + remainW;

    const padX = 12;
    const boxW = totalW + padX * 2;
    const boxH = 31;
    const boxX = -boxW / 2;
    const boxY = -10;

    // Если артикль показан как бейдж — рисуем аккуратный цветной бейдж рода и мн.ч. над словом
    if (!state.typeWithArticle && w.entry.article) {
      const badgeStr = w.entry.plural
        ? `${w.entry.article} · ${w.entry.plural}`
        : `${w.entry.article}`;
      ctx.font = '700 11px Inter, sans-serif';
      const bw = ctx.measureText(badgeStr).width + 12;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = style.main;
      ctx.lineWidth = 1;
      roundRect(ctx, -bw / 2, boxY - 19, bw, 16, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = style.main;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeStr, 0, boxY - 11);
    }

    // Фон плашки самого немецкого слова
    ctx.fillStyle = isLocked
      ? 'rgba(26, 19, 14, 0.94)'
      : 'rgba(11, 17, 32, 0.88)';
    ctx.strokeStyle = isLocked
      ? '#fb923c'
      : (w.hitFlash > 0 ? '#ffffff' : style.main);
    ctx.lineWidth = isLocked ? 2 : 1.2;

    roundRect(ctx, boxX, boxY, boxW, boxH, 8);
    ctx.fill();
    ctx.stroke();

    // Отрисовка букв: уже простреленные буквы тускнеют и зеленеют, следующая буква ярко светится!
    ctx.font = '700 19px "JetBrains Mono", Consolas, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const startTextX = -totalW / 2;
    const textCenterY = boxY + boxH / 2 + 0.5;

    if (typedText.length > 0) {
      ctx.fillStyle = 'rgba(52, 211, 153, 0.42)';
      ctx.fillText(typedText, startTextX, textCenterY);
    }

    if (remainText.length > 0) {
      const firstRemain = remainText[0];
      const restRemain = remainText.slice(1);
      const firstRemainW = ctx.measureText(firstRemain).width;

      // Первая активная буква для выстрела
      ctx.fillStyle = isLocked ? '#fb923c' : '#38bdf8';
      ctx.fillText(firstRemain, startTextX + typedW, textCenterY);

      // Остальные буквы слова
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(restRemain, startTextX + typedW + firstRemainW, textCenterY);
    }

    ctx.restore();
  }

  // --- Отрисовка голограммы с переводом (RU / עברית) на месте взрыва слова ---
  function drawFloatingTranslation(ft) {
    ctx.save();

    let alpha = 1.0;
    if (ft.life < 0.18) {
      alpha = ft.life / 0.18;
    } else if (ft.life > ft.maxLife - 0.75) {
      alpha = Math.max(0, (ft.maxLife - ft.life) / 0.75);
    }

    ctx.globalAlpha = alpha;
    ctx.translate(ft.x, ft.y);

    ctx.font = '700 13px "JetBrains Mono", Consolas, monospace';
    const deW = ctx.measureText(ft.rawDe).width;

    const translatedStr = getWordTranslation(ft.entry);
    const transText = `💥 ${translatedStr}`;
    ctx.font = '800 18px Inter, sans-serif';
    const transW = ctx.measureText(transText).width;

    const cardW = Math.max(deW, transW) + 34;
    const cardH = 56;

    ctx.shadowColor = ft.color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = 'rgba(10, 16, 31, 0.94)';
    ctx.strokeStyle = ft.color;
    ctx.lineWidth = 1.8;

    roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Немецкая словарная форма сверху (всегда LTR)
    ctx.direction = 'ltr';
    ctx.font = '700 12.5px "JetBrains Mono", Consolas, monospace';
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.rawDe, 0, -11);

    // Крупный перевод снизу (RTL для иврита, LTR для русского)
    ctx.direction = isRtlTranslation(ft.entry) ? 'rtl' : 'ltr';
    ctx.font = '800 17px Inter, sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(transText, 0, 12);

    ctx.restore();
  }

  function drawLayoutWarning() {
    const bounds = getPlayBounds();
    ctx.save();
    ctx.translate(bounds.centerX, state.ship.y - 72);
    ctx.fillStyle = 'rgba(127, 29, 29, 0.92)';
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 1.5;
    roundRect(ctx, -230, -20, 460, 40, 10);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 14px Inter, sans-serif';
    ctx.fillStyle = '#fecdd3';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚠️ Включена раскладка RU / עברית! Переключите на DE / EN', 0, 0);
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

  // --- Парсер пользовательских немецких слов (формат "der Motor, -en;двигатель;מנוע") ---
  function parseGermanEntryLine(line) {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.includes(';')) return null;

    const parts = trimmed.split(';').map(s => s.trim());
    const raw = parts[0];
    const second = parts[1] || '';
    const third = parts[2] || '';
    if (!raw || !second) return null;

    // Если во втором поле иврит, а третьего нет — заполняем и ru, и he
    const hasHebrewInSecond = /[\u0590-\u05FF]/.test(second);
    const ru = hasHebrewInSecond && !third ? second : second;
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

  // Переключение языка перевода в верхней панели (RU -> עברית -> Оба)
  btnLangMode.addEventListener('click', () => {
    const idx = state.langModes.findIndex(m => m.id === state.translationLang);
    const nextMode = state.langModes[(idx + 1) % state.langModes.length];
    setTranslationLanguage(nextMode.id);
    btnLangMode.blur();
  });

  // Быстрые кнопки выбора языка на стартовом экране
  document.querySelectorAll('.lang-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setTranslationLanguage(btn.dataset.lang);
      btn.blur();
    });
  });

  btnArticleMode.addEventListener('click', () => {
    state.typeWithArticle = !state.typeWithArticle;
    btnArticleMode.textContent = state.typeWithArticle
      ? '🏷️ Артикль: Печатать'
      : '🏷️ Артикль: Бейдж';
    btnArticleMode.classList.toggle('active', state.typeWithArticle);

    state.activeWords.forEach(w => {
      if (w.typedCount === 0) {
        w.text = getTargetString(w.entry);
      }
    });
    btnArticleMode.blur();
  });

  // Переключение скорости (0.5x -> 0.7x -> 1.0x -> 1.35x) с мгновенным пересчётом уже летящих слов
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
    btnTtsMode.textContent = sound.ttsEnabled ? '🔊 Озвучка DE' : '🔇 Озвучка DE';
    btnTtsMode.blur();
  });

  btnPause.addEventListener('click', () => {
    togglePause();
    btnPause.blur();
  });

  btnClearFeed.addEventListener('click', () => {
    state.killHistory = [];
    rerenderKillFeed();
  });

  // Кнопки экранного ввода умлаутов внизу
  document.querySelectorAll('.umlaut-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const ch = chip.dataset.char;
      if (ch && state.running && !state.paused) {
        processTypedChar(ch);
      }
      chip.blur();
    });
  });

  // Модальное окно полного словаря (73 слова, поиск по DE / RU / HE)
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
    if (state.running && !state.paused) togglePause();
    renderFullDictionary(dictSearchInput.value);
    dictDialog.showModal();
  });

  btnCloseDict.addEventListener('click', () => {
    dictDialog.close();
  });

  dictSearchInput.addEventListener('input', () => {
    renderFullDictionary(dictSearchInput.value);
  });

  // Модальное окно добавления своих слов
  btnOpenCustom.addEventListener('click', () => {
    if (state.running && !state.paused) togglePause();
    customWordsDialog.showModal();
  });

  btnCloseCustom.addEventListener('click', () => {
    customWordsDialog.close();
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

    btnOpenDict.textContent = `📚 Словарь (${allAutoWords.length + parsedWords.length})`;
    allAutoWords.push(...parsedWords);
    customWordsDialog.close();
    selectLevel(levels.length - 1, true);
  });

  // Автопауза при сворачивании вкладки браузера (Page Visibility API)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && state.running && !state.paused) {
      togglePause();
    }
  });

  // --- Инициализация при загрузке ---
  resizeCanvas();
  selectLevel(0, true);
  requestAnimationFrame(gameLoop);
})();
