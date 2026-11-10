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

  // --- Арсенал из 5 уникальных видов космического оружия ---
  const WEAPONS = [
    {
      id: 'plasma',
      key: '1',
      icon: '⚡',
      color: '#22d3ee',
      secondaryColor: '#34d399',
      recoilBoost: 1.0,
      ruName: 'Плазма',
      heName: 'פלזמה',
      ruDesc: 'Сдвоенные плазменные импульсы с нарастающей комбо-гармоникой',
      heDesc: 'צמד פולסי פלזמה מהירים עם הרמוניית קומבו מתגברת'
    },
    {
      id: 'railgun',
      key: '2',
      icon: '🔴',
      color: '#fb7185',
      secondaryColor: '#f43f5e',
      recoilBoost: 1.75,
      ruName: 'Рельсотрон',
      heName: 'תותח מסילה',
      ruDesc: 'Мощный гиперлуч с басовым ударом, кольцами волны и сильной отдачей',
      heDesc: 'קרן על-קולית עוצמתית עם הדף חזק וטבעות הדף'
    },
    {
      id: 'tesla',
      key: '3',
      icon: '🌩️',
      color: '#a78bfa',
      secondaryColor: '#38bdf8',
      recoilBoost: 1.15,
      ruName: 'Тесла',
      heName: 'טסלה',
      ruDesc: 'Ветвящаяся дуга молнии с электрическим треском и цепными искрами',
      heDesc: 'קשת ברק מתפצלת עם פריקה חשמלית וניצוצות'
    },
    {
      id: 'missiles',
      key: '4',
      icon: '🚀',
      color: '#fb923c',
      secondaryColor: '#fbbf24',
      recoilBoost: 1.35,
      ruName: 'Ракеты',
      heName: 'טילים',
      ruDesc: 'Самонаводящийся рой микро-ракет с дымным шлейфом и микро-взрывом',
      heDesc: 'נחיל טילי מיקרו מתבייתים עם שובל אש ופיצוץ ממוקד'
    },
    {
      id: 'synth',
      key: '5',
      icon: '🎵',
      color: '#e879f9',
      secondaryColor: '#22d3ee',
      recoilBoost: 1.1,
      ruName: 'Неон-Синт',
      heName: 'סינת׳ווייב',
      ruDesc: 'Призма-лазер: каждая буква играет мелодичную ноту в стиле Synthwave!',
      heDesc: 'לייזר פריזמה מנגן: כל אות מפיקה צליל סינת׳ווייב מלודי!'
    }
  ];

  // --- Студийные голоса Gemini 3.8 TTS ---
  const GEMINI_VOICES = [
    { id: 'Kore', ruTone: 'Чёткий студийный (Ж)', heTone: 'אולפני וברור (נ)' },
    { id: 'Puck', ruTone: 'Энергичный и живой (М)', heTone: 'אנרגטי וחי (ג)' },
    { id: 'Charon', ruTone: 'Глубокий диктор (М)', heTone: 'קריין עמוק (ג)' },
    { id: 'Aoede', ruTone: 'Мягкий и тёплый (Ж)', heTone: 'רך ונעים (נ)' },
    { id: 'Fenrir', ruTone: 'Динамичный драйв (М)', heTone: 'דינמי ונמרץ (ג)' },
    { id: 'Leda', ruTone: 'Чистый и светлый (Ж)', heTone: 'צלול ובהיר (נ)' }
  ];

  // --- Полная локализация интерфейса (RU / עברית) ---
  const UI_TEXT = {
    ru: {
      titleTagline: 'Сбивайте немецкие слова по буквам и запоминайте перевод при взрыве!',
      titleArsenalLabel: '⚔️ Выберите оружие:',
      launchMissionBtn: (lvlNum, name) => `🚀 Начать игру · Уровень ${lvlNum}: ${name}`,
      launchAutoBtn: '🚀 Начать игру · Главный AUTO-марафон (73)',
      titleVoiceLink: '🎙️ Озвучка AI',
      titleDictLink: (n) => `Словарь (${n})`,
      titleCustomLink: 'Свои слова',
      ranks: ['КАДЕТ', 'ПИЛОТ АВТОБАНА', 'ШТУРМАН ГАЛАКТИКИ', 'КОМАНДОР AUTO'],
      rankLine: (rank, best) => `${rank} · РЕКОРД: ${best}`,
      overlayWeaponTitle: '⚔️ Оружие корабля:',
      backToMenuBtn: '🏠 В меню',
      weaponBanner: (icon, name) => `${icon} Оружие: ${name}`,

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
      pauseDesc: (done, total) => `Прогресс: <strong>${done} / ${total}</strong> слов. Смените оружие, выберите уровень или продолжайте бой:`,
      dictTitle: (n) => `📚 Словарь «AUTO» (${n} слова)`,
      dictSearchPlaceholder: 'Поиск: немецкий, русский или עברית...',
      customTitle: '➕ Добавить свои немецкие слова',
      customHint: 'Формат: <code>немецкое слово;перевод RU;перевод HE</code> (каждое с новой строки).',
      customSaveBtn: 'Создать уровень и играть 🚀',
      layoutWarning: '⚠️ Переключите раскладку на DE / EN!',

      // Gemini 3.8 TTS диалог
      ttsDialogTitle: '🎙️ Студия озвучки Gemini 3.8 TTS',
      ttsEnableLabel: 'Произношение немецких слов при взрыве:',
      ttsOn: '🔊 Включено',
      ttsOff: '🔇 Выключено',
      ttsModelLabel: 'Языковая аудио-модель Gemini 3.8:',
      ttsModelFlashDesc: 'Максимальное студийное HD качество и живая немецкая дикция',
      ttsModelLiteDesc: 'Сверхбыстрый отклик для скоростной печати',
      ttsVoiceLabel: 'Студийный голос:',
      ttsTestBtn: '▶️ Прослушать голос («der Kofferraum»)',
      ttsTestingBtn: '⏳ Генерация аудио Gemini 3.8...',
      ttsApiKeySummary: '🔑 Настройка ключа GEMINI_API_KEY (Vercel / Браузер)',
      ttsApiKeyHint: 'На Vercel добавьте переменную <code>GEMINI_API_KEY</code> в настройках проекта (Settings → Environment Variables) — и все слова будут озвучиваться через серверный кэш <code>/api/tts</code>. Или вставьте свой ключ ниже (сохраняется только локально в вашем браузере):',
      ttsStatusReadyServer: (model, voice) => `✨ Активен: ${model} · голос ${voice} (сервер Vercel)`,
      ttsStatusReadyLocal: (model, voice) => `✨ Активен: ${model} · голос ${voice} (локальный ключ API)`,
      ttsStatusFallback: '🔊 Сейчас активен встроенный голос браузера. Добавьте GEMINI_API_KEY в Vercel или ниже для студийного голоса Gemini 3.8 TTS!',
      ttsStatusMuted: '🔇 Озвучка слов выключена'
    },
    he: {
      titleTagline: 'פוצצו מילים בגרמנית אות אחר אות וזכרו את התרגום בפיצוץ!',
      titleArsenalLabel: '⚔️ בחרו נשק לחללית:',
      launchMissionBtn: (lvlNum, name) => `🚀 התחל משחק · שלב ${lvlNum}: ${name}`,
      launchAutoBtn: '🚀 התחל משחק · מרתון AUTO הראשי (73)',
      titleVoiceLink: '🎙️ קריינות AI',
      titleDictLink: (n) => `מילון (${n})`,
      titleCustomLink: 'מילים משלך',
      ranks: ['צוער חלל', 'טייס אוטובאן', 'נווט גלקטי', 'מפקד AUTO'],
      rankLine: (rank, best) => `${rank} · שיא: ${best}`,
      overlayWeaponTitle: '⚔️ נשק החללית:',
      backToMenuBtn: '🏠 מסך ראשי',
      weaponBanner: (icon, name) => `${icon} נשק: ${name}`,

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
      pauseDesc: (done, total) => `התקדמות: <strong>${done} / ${total}</strong> מילים. החליפו נשק, בחרו שלב או המשיכו בקרב:`,
      dictTitle: (n) => `📚 מילון «AUTO» (${n} מילים)`,
      dictSearchPlaceholder: 'חיפוש: גרמנית, עברית או רוסית...',
      customTitle: '➕ הוספת מילים משלך בגרמנית',
      customHint: 'פורמט: <code>מילה בגרמנית;תרגום</code> (כל מילה בשורה חדשה).',
      customSaveBtn: 'צור שלב ושחק 🚀',
      layoutWarning: '⚠️ החליפו מקלדת ל-DE / EN!',

      ttsDialogTitle: '🎙️ אולפן קריינות Gemini 3.8 TTS',
      ttsEnableLabel: 'הגיית מילים בגרמנית בעת פיצוץ:',
      ttsOn: '🔊 מופעל',
      ttsOff: '🔇 מושתק',
      ttsModelLabel: 'מודל קול Gemini 3.8:',
      ttsModelFlashDesc: 'איכות אולפן HD מקסימלית והגייה גרמנית טבעית',
      ttsModelLiteDesc: 'תגובה מהירה במיוחד להקלדה מהירה',
      ttsVoiceLabel: 'קול אולפן:',
      ttsTestBtn: '▶️ בדיקת קול («der Kofferraum»)',
      ttsTestingBtn: '⏳ מפיק אודיו ב-Gemini 3.8...',
      ttsApiKeySummary: '🔑 הגדרת מפתח GEMINI_API_KEY (ב-Vercel או בדפדפן)',
      ttsApiKeyHint: 'ב-Vercel מומלץ להוסיף משתנה סביבה <code>GEMINI_API_KEY</code> בהגדרות הפרויקט — או להדביק מפתח אישי למטה (נשמר מקומית בדפדפן בלבד):',
      ttsStatusReadyServer: (model, voice) => `✨ פעיל: ${model} · קול ${voice} (שרת Vercel)`,
      ttsStatusReadyLocal: (model, voice) => `✨ פעיל: ${model} · קול ${voice} (מפתח מקומי)`,
      ttsStatusFallback: '🔊 פעיל קול מובנה של הדפדפן. הוסיפו GEMINI_API_KEY ב-Vercel או למטה להפעלת Gemini 3.8 TTS!',
      ttsStatusMuted: '🔇 הקראת המילים כבויה'
    }
  };

  // --- Хранилище прогресса и настроек (localStorage) ---
  const STORAGE_KEY = 'zdeutsch_save_v2';
  const KEY_STORAGE_NAME = 'zdeutsch_gemini_api_key';

  function loadSavedSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  function saveSettingsPatch(patch) {
    try {
      const prev = loadSavedSettings();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prev, ...patch }));
    } catch (_) {}
  }

  // ==========================================================================
  // МНОГОСЛОЙНЫЙ СИНТЕЗАТОР ЗВУКА (SoundEngine 2.0)
  // ==========================================================================
  const SYNTH_SCALE_HZ = [
    293.66, // D4
    349.23, // F4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    698.46, // F5
    783.99, // G5
    880.00, // A5
    1046.50 // C6
  ];

  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.noiseBuffer = null;
      this.sfxEnabled = true;
      this.synthNoteCursor = 0;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.value = 0.88;
          this.masterGain.connect(this.ctx.destination);
          this._buildNoiseBuffer();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    _buildNoiseBuffer() {
      if (!this.ctx) return;
      const sampleRate = this.ctx.sampleRate;
      const length = sampleRate * 1.0;
      const buffer = this.ctx.createBuffer(1, length, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      this.noiseBuffer = buffer;
    }

    _createPanDest(pan = 0) {
      if (!this.ctx || !this.masterGain) return null;
      if (typeof this.ctx.createStereoPanner === 'function') {
        const panner = this.ctx.createStereoPanner();
        panner.pan.value = Math.max(-0.7, Math.min(0.7, pan));
        panner.connect(this.masterGain);
        return panner;
      }
      return this.masterGain;
    }

    // Тактильный механический щелчок клавиши при каждом выстреле
    _playTactileClick(now, dest, freq = 2100, vol = 0.06) {
      if (!this.noiseBuffer) return;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq, now);
      filter.Q.value = 2.4;

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(vol, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.016);

      src.connect(filter);
      filter.connect(g);
      g.connect(dest);
      src.start(now, Math.random() * 0.4, 0.02);
    }

    playWeaponShot(weaponId = 'plasma', pitchIndex = 0, combo = 1, pan = 0, isFinalLetter = false) {
      if (!this.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const dest = this._createPanDest(pan);
      if (!dest) return;

      const comboBoost = Math.min(180, (combo - 1) * 18);
      const letterStep = Math.min(280, pitchIndex * 24);

      if (weaponId === 'plasma') {
        // 1. Щелчок затвора + двойной расстроенный плазменный импульс + гармонический обертон
        this._playTactileClick(now, dest, 2400, 0.055);

        const base = 520 + letterStep + comboBoost * 0.5;
        [-7, 7].forEach(detuneCents => {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.detune.value = detuneCents;
          osc.frequency.setValueAtTime(base, now);
          osc.frequency.exponentialRampToValueAtTime(145, now + 0.095);

          const lp = this.ctx.createBiquadFilter();
          lp.type = 'lowpass';
          lp.frequency.setValueAtTime(3400, now);
          lp.frequency.exponentialRampToValueAtTime(650, now + 0.095);

          g.gain.setValueAtTime(0.068, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

          osc.connect(lp);
          lp.connect(g);
          g.connect(dest);
          osc.start(now);
          osc.stop(now + 0.1);
        });

        // Кристальный пинг комбо
        const ping = this.ctx.createOscillator();
        const pg = this.ctx.createGain();
        ping.type = 'sine';
        ping.frequency.setValueAtTime(880 + letterStep * 1.4, now);
        pg.gain.setValueAtTime(0.032, now);
        pg.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
        ping.connect(pg);
        pg.connect(dest);
        ping.start(now);
        ping.stop(now + 0.07);
      } else if (weaponId === 'railgun') {
        // 2. Мощный рельсотрон: глубокий саб-бас + металлический звон катушек + импульсный щелчок
        this._playTactileClick(now, dest, 1750, 0.09);

        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(155, now);
        sub.frequency.exponentialRampToValueAtTime(36, now + 0.14);
        subGain.gain.setValueAtTime(0.2, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.145);
        sub.connect(subGain);
        subGain.connect(dest);
        sub.start(now);
        sub.stop(now + 0.15);

        const rail = this.ctx.createOscillator();
        const railGain = this.ctx.createGain();
        rail.type = 'triangle';
        rail.frequency.setValueAtTime(1420 + letterStep, now);
        rail.frequency.exponentialRampToValueAtTime(390, now + 0.11);
        railGain.gain.setValueAtTime(0.075, now);
        railGain.gain.exponentialRampToValueAtTime(0.001, now + 0.115);
        rail.connect(railGain);
        railGain.connect(dest);
        rail.start(now);
        rail.stop(now + 0.12);
      } else if (weaponId === 'tesla') {
        // 3. Тесла-дуга: высоковольтный треск + резонансный свип фильтра
        if (this.noiseBuffer) {
          const nz = this.ctx.createBufferSource();
          nz.buffer = this.noiseBuffer;
          const bp = this.ctx.createBiquadFilter();
          bp.type = 'bandpass';
          bp.frequency.setValueAtTime(3100, now);
          bp.frequency.exponentialRampToValueAtTime(900, now + 0.09);
          bp.Q.value = 4.2;

          const ng = this.ctx.createGain();
          ng.gain.setValueAtTime(0.14, now);
          ng.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

          nz.connect(bp);
          bp.connect(ng);
          ng.connect(dest);
          nz.start(now, Math.random() * 0.5, 0.1);
        }

        const zap = this.ctx.createOscillator();
        const zg = this.ctx.createGain();
        zap.type = 'sawtooth';
        zap.frequency.setValueAtTime(1150 + letterStep * 1.2, now);
        zap.frequency.setValueAtTime(680, now + 0.025);
        zap.frequency.exponentialRampToValueAtTime(190, now + 0.085);
        zg.gain.setValueAtTime(0.065, now);
        zg.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        zap.connect(zg);
        zg.connect(dest);
        zap.start(now);
        zap.stop(now + 0.095);
      } else if (weaponId === 'missiles') {
        // 4. Микро-ракета: пневматический пуск "пшш-вжух" + упругий микро-хлопок детонации
        this._playTactileClick(now, dest, 1900, 0.05);

        if (this.noiseBuffer) {
          const whoosh = this.ctx.createBufferSource();
          whoosh.buffer = this.noiseBuffer;
          const bp = this.ctx.createBiquadFilter();
          bp.type = 'bandpass';
          bp.frequency.setValueAtTime(600, now);
          bp.frequency.exponentialRampToValueAtTime(2400, now + 0.085);
          bp.Q.value = 2.8;

          const wg = this.ctx.createGain();
          wg.gain.setValueAtTime(0.11, now);
          wg.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

          whoosh.connect(bp);
          bp.connect(wg);
          wg.connect(dest);
          whoosh.start(now, Math.random() * 0.4, 0.1);
        }

        const popTime = now + 0.065;
        const pop = this.ctx.createOscillator();
        const pg = this.ctx.createGain();
        pop.type = 'triangle';
        pop.frequency.setValueAtTime(260 + letterStep * 0.7, popTime);
        pop.frequency.exponentialRampToValueAtTime(62, popTime + 0.075);
        pg.gain.setValueAtTime(0.12, popTime);
        pg.gain.exponentialRampToValueAtTime(0.001, popTime + 0.08);
        pop.connect(pg);
        pg.connect(dest);
        pop.start(popTime);
        pop.stop(popTime + 0.085);
      } else if (weaponId === 'synth') {
        // 5. Неоновый Синтвейв: мягкий ASMR-"thock" клавиши + стерео мелодичная нота!
        this._playTactileClick(now, dest, 1450, 0.055);

        const noteHz = SYNTH_SCALE_HZ[(this.synthNoteCursor++) % SYNTH_SCALE_HZ.length];
        [-6, 6].forEach(detune => {
          const lead = this.ctx.createOscillator();
          const lg = this.ctx.createGain();
          const filt = this.ctx.createBiquadFilter();

          lead.type = 'sawtooth';
          lead.frequency.setValueAtTime(noteHz, now);
          lead.detune.value = detune;

          filt.type = 'lowpass';
          filt.frequency.setValueAtTime(2600, now);
          filt.frequency.exponentialRampToValueAtTime(750, now + 0.17);

          lg.gain.setValueAtTime(0.052, now);
          lg.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

          lead.connect(filt);
          filt.connect(lg);
          lg.connect(dest);
          lead.start(now);
          lead.stop(now + 0.185);
        });
      }

      // Дополнительный кристальный акцент на последней букве слова
      if (isFinalLetter) {
        const fin = this.ctx.createOscillator();
        const fg = this.ctx.createGain();
        fin.type = 'sine';
        fin.frequency.setValueAtTime(1046.5, now);
        fin.frequency.exponentialRampToValueAtTime(1567.98, now + 0.09);
        fg.gain.setValueAtTime(0.06, now);
        fg.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        fin.connect(fg);
        fg.connect(dest);
        fin.start(now);
        fin.stop(now + 0.105);
      }
    }

    playExplosion(combo = 1, pan = 0) {
      if (!this.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const dest = this._createPanDest(pan);
      if (!dest) return;

      // Саб-бас удар взрыва
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'triangle';
      sub.frequency.setValueAtTime(185, now);
      sub.frequency.exponentialRampToValueAtTime(30, now + 0.38);
      subGain.gain.setValueAtTime(0.24, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.39);
      sub.connect(subGain);
      subGain.connect(dest);
      sub.start(now);
      sub.stop(now + 0.4);

      // Тёплый фильтрованный шумовой "бум"
      if (this.noiseBuffer) {
        const boom = this.ctx.createBufferSource();
        boom.buffer = this.noiseBuffer;
        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(950, now);
        lp.frequency.exponentialRampToValueAtTime(140, now + 0.32);

        const bg = this.ctx.createGain();
        bg.gain.setValueAtTime(0.14, now);
        bg.gain.exponentialRampToValueAtTime(0.001, now + 0.33);

        boom.connect(lp);
        lp.connect(bg);
        bg.connect(dest);
        boom.start(now, 0, 0.35);
      }

      // Победный аккорд (повышается с ростом комбо)
      const semitoneShift = Math.min(7, Math.floor((combo - 1) / 2));
      const mult = Math.pow(2, semitoneShift / 12);
      [523.25 * mult, 659.25 * mult, 783.99 * mult].forEach((freq, idx) => {
        const chime = this.ctx.createOscillator();
        const cGain = this.ctx.createGain();
        chime.type = 'sine';
        const t0 = now + idx * 0.032;
        chime.frequency.setValueAtTime(freq, t0);
        cGain.gain.setValueAtTime(0.05, t0);
        cGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.28);
        chime.connect(cGain);
        cGain.connect(dest);
        chime.start(t0);
        chime.stop(t0 + 0.29);
      });
    }

    playWeaponEquip(weaponId) {
      if (!this.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      this._playTactileClick(now, this.masterGain, 2800, 0.07);
      this.playWeaponShot(weaponId, 3, 2, 0, false);
    }

    playWarpLaunch() {
      if (!this.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const dest = this.masterGain;

      const sweep = this.ctx.createOscillator();
      const sg = this.ctx.createGain();
      sweep.type = 'sawtooth';
      sweep.frequency.setValueAtTime(95, now);
      sweep.frequency.exponentialRampToValueAtTime(620, now + 0.42);

      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(400, now);
      lp.frequency.exponentialRampToValueAtTime(3200, now + 0.42);

      sg.gain.setValueAtTime(0.14, now);
      sg.gain.exponentialRampToValueAtTime(0.001, now + 0.46);

      sweep.connect(lp);
      lp.connect(sg);
      sg.connect(dest);
      sweep.start(now);
      sweep.stop(now + 0.48);
    }

    playMiss() {
      if (!this.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(96, now + 0.045);

      gain.gain.setValueAtTime(0.065, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.12);
    }

    playShieldHit() {
      if (!this.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(125, now);
      osc.frequency.linearRampToValueAtTime(42, now + 0.4);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.43);
    }
  }

  const sound = new SoundEngine();

  // ==========================================================================
  // МЕНЕДЖЕР ВЫСОКОКАЧЕСТВЕННОЙ ОЗВУЧКИ GEMINI 3.8 TTS (С КЭШЕМ И ПРЕДЗАГРУЗКОЙ)
  // ==========================================================================
  class GeminiTTSManager {
    constructor(soundEngine) {
      this.soundEngine = soundEngine;
      this.enabled = true;
      this.model = 'gemini-3.8-flash-tts';
      this.voice = 'Kore';
      this.localApiKey = '';
      this.serverAvailable = null; // null = ещё не проверяли, true = работает, false = нет ключа на сервере

      this.memoryBufferCache = new Map(); // cacheKey -> AudioBuffer
      this.inflightPromises = new Map();  // cacheKey -> Promise<AudioBuffer|null>
      this.prefetchQueue = [];
      this.activePrefetches = 0;
      this.currentSource = null;
      this.dbPromise = null;

      this._loadConfig();
    }

    _loadConfig() {
      const saved = loadSavedSettings();
      if (typeof saved.ttsEnabled === 'boolean') this.enabled = saved.ttsEnabled;
      if (saved.ttsModel === 'gemini-3.8-flash-tts' || saved.ttsModel === 'gemini-3.8-flash-lite-tts') {
        this.model = saved.ttsModel;
      }
      if (saved.ttsVoice && GEMINI_VOICES.some(v => v.id === saved.ttsVoice)) {
        this.voice = saved.ttsVoice;
      }
      try {
        this.localApiKey = (localStorage.getItem(KEY_STORAGE_NAME) || '').trim();
      } catch (_) {
        this.localApiKey = '';
      }
    }

    saveConfig() {
      saveSettingsPatch({
        ttsEnabled: this.enabled,
        ttsModel: this.model,
        ttsVoice: this.voice
      });
    }

    setLocalApiKey(keyStr) {
      this.localApiKey = (keyStr || '').trim();
      try {
        if (this.localApiKey) {
          localStorage.setItem(KEY_STORAGE_NAME, this.localApiKey);
        } else {
          localStorage.removeItem(KEY_STORAGE_NAME);
        }
      } catch (_) {}
    }

    canAttemptGemini() {
      if (this.localApiKey) return true;
      const isHttp = location.protocol === 'http:' || location.protocol === 'https:';
      if (isHttp && this.serverAvailable !== false) return true;
      return false;
    }

    _cacheKey(text) {
      return `${this.model}|${this.voice}|${text.trim()}`;
    }

    _openDb() {
      if (this.dbPromise) return this.dbPromise;
      if (!('indexedDB' in window)) return Promise.resolve(null);

      this.dbPromise = new Promise((resolve) => {
        try {
          const req = indexedDB.open('zdeutsch_gemini_tts_v1', 1);
          req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains('wavs')) {
              db.createObjectStore('wavs');
            }
          };
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => resolve(null);
        } catch (_) {
          resolve(null);
        }
      });
      return this.dbPromise;
    }

    async _readFromIdb(key) {
      const db = await this._openDb();
      if (!db) return null;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction('wavs', 'readonly');
          const req = tx.objectStore('wavs').get(key);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        } catch (_) {
          resolve(null);
        }
      });
    }

    async _writeToIdb(key, arrayBuffer) {
      const db = await this._openDb();
      if (!db) return;
      try {
        const tx = db.transaction('wavs', 'readwrite');
        tx.objectStore('wavs').put(arrayBuffer, key);
      } catch (_) {}
    }

    _extractBase64Audio(data) {
      if (!data || typeof data !== 'object') return null;
      if (Array.isArray(data.steps)) {
        for (let i = data.steps.length - 1; i >= 0; i--) {
          const step = data.steps[i];
          if (step && step.type === 'model_output' && Array.isArray(step.content)) {
            for (let j = step.content.length - 1; j >= 0; j--) {
              const part = step.content[j];
              if (part && part.type === 'audio' && part.data) {
                return part.data;
              }
            }
          }
        }
      }
      if (data.output_audio && data.output_audio.data) return data.output_audio.data;
      return null;
    }

    _base64ToArrayBuffer(b64) {
      const binary = atob(b64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes.buffer;
    }

    async _fetchWavArrayBuffer(cleanText) {
      // Вариант А: Если пользователь указал свой ключ в настройках браузера — прямой запрос к Gemini 3.8 Interactions API
      if (this.localApiKey) {
        const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
          method: 'POST',
          headers: {
            'x-goog-api-key': this.localApiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: this.model,
            store: false,
            input: [{
              type: 'user_input',
              content: [{
                type: 'text',
                text: cleanText,
                annotations: [{
                  type: 'speech_metadata',
                  style: 'clear, natural Standard German pronunciation, crisp diction, warm studio voice'
                }]
              }]
            }],
            response_format: { type: 'audio' },
            generation_config: {
              speech_config: [{ voice: this.voice }]
            }
          })
        });

        if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
        const json = await res.json();
        const b64 = this._extractBase64Audio(json);
        if (!b64) throw new Error('No audio data in Gemini response');
        return this._base64ToArrayBuffer(b64);
      }

      // Вариант Б: Серверный прокси /api/tts на Vercel с глобальным CDN-кэшированием
      const isHttp = location.protocol === 'http:' || location.protocol === 'https:';
      if (isHttp && this.serverAvailable !== false) {
        const params = new URLSearchParams({
          text: cleanText,
          voice: this.voice,
          model: this.model
        });
        const res = await fetch(`/api/tts?${params.toString()}`, { method: 'GET' });
        if (res.status === 503 || res.status === 404) {
          this.serverAvailable = false;
          onTtsStatusChanged();
          return null;
        }
        if (!res.ok) throw new Error(`Server TTS HTTP ${res.status}`);
        this.serverAvailable = true;
        onTtsStatusChanged();
        return await res.arrayBuffer();
      }

      return null;
    }

    async getOrFetchAudioBuffer(text) {
      const cleanText = String(text || '').trim();
      if (!cleanText) return null;

      const key = this._cacheKey(cleanText);
      if (this.memoryBufferCache.has(key)) {
        return this.memoryBufferCache.get(key);
      }

      if (this.inflightPromises.has(key)) {
        return this.inflightPromises.get(key);
      }

      const promise = (async () => {
        try {
          const audioCtx = this.soundEngine.init();
          if (!audioCtx) return null;

          let wavBytes = await this._readFromIdb(key);
          if (!wavBytes) {
            if (!this.canAttemptGemini()) return null;
            wavBytes = await this._fetchWavArrayBuffer(cleanText);
            if (!wavBytes) return null;
            this._writeToIdb(key, wavBytes.slice(0));
          }

          const decoded = await audioCtx.decodeAudioData(wavBytes.slice(0));
          this.memoryBufferCache.set(key, decoded);
          return decoded;
        } catch (_) {
          return null;
        } finally {
          this.inflightPromises.delete(key);
        }
      })();

      this.inflightPromises.set(key, promise);
      return promise;
    }

    // Фоновая предзагрузка слов, летящих на экране (чтобы в момент взрыва озвучка звучала без задержки!)
    prefetch(text) {
      if (!this.enabled || !this.canAttemptGemini()) return;
      const cleanText = String(text || '').trim();
      if (!cleanText) return;
      const key = this._cacheKey(cleanText);
      if (this.memoryBufferCache.has(key) || this.inflightPromises.has(key)) return;
      if (this.prefetchQueue.includes(cleanText)) return;

      this.prefetchQueue.push(cleanText);
      this._drainPrefetchQueue();
    }

    _drainPrefetchQueue() {
      while (this.activePrefetches < 2 && this.prefetchQueue.length > 0) {
        const nextText = this.prefetchQueue.shift();
        this.activePrefetches++;
        this.getOrFetchAudioBuffer(nextText).finally(() => {
          this.activePrefetches--;
          this._drainPrefetchQueue();
        });
      }
    }

    async speakGerman(text, forceSpeak = false) {
      if (!this.enabled && !forceSpeak) return false;
      const cleanText = String(text || '').trim();
      if (!cleanText) return false;

      if (this.canAttemptGemini()) {
        const buffer = await this.getOrFetchAudioBuffer(cleanText);
        if (buffer) {
          this._playDecodedBuffer(buffer);
          return true;
        }
      }

      // Плавный резервный фолбэк на системный немецкий голос, если ключ ещё не задан
      this._speakBrowserFallback(cleanText);
      return false;
    }

    _playDecodedBuffer(audioBuffer) {
      const audioCtx = this.soundEngine.init();
      if (!audioCtx) return;

      if (this.currentSource) {
        try { this.currentSource.stop(); } catch (_) {}
        this.currentSource = null;
      }
      if ('speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch (_) {}
      }

      const src = audioCtx.createBufferSource();
      src.buffer = audioBuffer;
      const gain = audioCtx.createGain();
      gain.gain.value = 1.05;
      src.connect(gain);
      gain.connect(audioCtx.destination);
      src.start(0);
      this.currentSource = src;
    }

    _speakBrowserFallback(text) {
      if (!('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'de-DE';
        utter.rate = 0.96;
        utter.volume = 0.95;
        const voices = window.speechSynthesis.getVoices();
        const deVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('de'));
        if (deVoice) utter.voice = deVoice;
        window.speechSynthesis.speak(utter);
      } catch (_) {}
    }
  }

  const ttsManager = new GeminiTTSManager(sound);

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

  // Восстановление пройденных уровней из сохранения
  const initialSave = loadSavedSettings();
  if (Array.isArray(initialSave.completedLevelIds)) {
    levels.forEach(lvl => {
      if (initialSave.completedLevelIds.includes(lvl.id)) {
        lvl.completed = true;
      }
    });
  }

  // --- Состояние игры ---
  const state = {
    screenMode: 'title', // 'title' (аркадный стартовый экран) | 'play' (боевой режим)
    currentLevelIndex: 0,
    running: false,
    paused: false,
    gameOver: false,
    overlayMode: 'pause', // 'intro' | 'complete' | 'gameover' | 'pause'
    activeQuiz: null,

    // Язык перевода: 'ru' (Русский), 'he' (Иврит עברית), 'both' (Оба языка)
    translationLang: initialSave.translationLang || 'ru',
    langModes: [
      { id: 'ru', label: '🇷🇺 RU' },
      { id: 'he', label: '🇮🇱 עברית' },
      { id: 'both', label: '🇷🇺+🇮🇱' }
    ],

    // Выбранное оружие
    weaponId: WEAPONS.some(w => w.id === initialSave.weaponId) ? initialSave.weaponId : 'plasma',
    missileAlternateSide: 1,
    weaponBannerText: '',
    weaponBannerTimer: 0,

    // Настройки игрока
    typeWithArticle: Boolean(initialSave.typeWithArticle),
    speedPresetIndex: typeof initialSave.speedPresetIndex === 'number' ? initialSave.speedPresetIndex : 0,
    speedPresets: [
      { mult: 0.5, label: '🐌 0.5x' },
      { mult: 0.7, label: '🐢 0.7x' },
      { mult: 1.0, label: '🚀 1.0x' },
      { mult: 1.35, label: '⚡ 1.35x' }
    ],

    // Метрики и рекорды
    score: 0,
    highScore: Number(initialSave.highScore) || 0,
    combo: 1,
    maxCombo: 1,
    shotsFired: 0,
    shotsHit: 0,
    shields: 4,
    maxShields: 4,
    empCharges: 2,

    // Эффект гиперпрыжка при старте с титульного экрана
    warpTimer: 0,

    // Автопилот-демо для живого титульного экрана
    demoWords: [],
    demoSpawnTimer: 0.4,
    demoFireTimer: 0.25,
    demoTargetId: null,

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
    missiles: [],
    particles: [],
    shockwaves: [],
    floatingTranslations: [],
    stars: [],
    nebulae: [],
    layoutWarningTimer: 0,

    // Корабль игрока
    ship: {
      x: 0,
      y: 0,
      targetY: 0,
      angle: -Math.PI / 2,
      targetAngle: -Math.PI / 2,
      recoil: 0
    }
  };

  let nextEntityId = 1;

  function getCurrentWeapon() {
    return WEAPONS.find(w => w.id === state.weaponId) || WEAPONS[0];
  }

  function isHebrewUI() {
    return state.translationLang === 'he';
  }

  function t() {
    return isHebrewUI() ? UI_TEXT.he : UI_TEXT.ru;
  }

  function getWeaponName(w) {
    return isHebrewUI() ? w.heName : w.ruName;
  }

  function getWeaponDesc(w) {
    return isHebrewUI() ? w.heDesc : w.ruDesc;
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

  // Титульный аркадный экран
  const arcadeTitleScreen = document.getElementById('arcadeTitleScreen');
  const titleHeaderCard = document.getElementById('titleHeaderCard');
  const titleSpaceWindow = document.getElementById('titleSpaceWindow');
  const titleBottomDock = document.getElementById('titleBottomDock');
  const pilotRankText = document.getElementById('pilotRankText');
  const titleTagline = document.getElementById('titleTagline');
  const titleArsenalLabel = document.getElementById('titleArsenalLabel');
  const titleWeaponDesc = document.getElementById('titleWeaponDesc');
  const titleWeaponRow = document.getElementById('titleWeaponRow');
  const titleStageChips = document.getElementById('titleStageChips');
  const btnArcadeLaunch = document.getElementById('btnArcadeLaunch');
  const labelArcadeLaunch = document.getElementById('labelArcadeLaunch');
  const btnTitleSpeed = document.getElementById('btnTitleSpeed');
  const btnTitleVoice = document.getElementById('btnTitleVoice');
  const btnTitleDict = document.getElementById('btnTitleDict');
  const labelTitleDict = document.getElementById('labelTitleDict');
  const btnTitleCustom = document.getElementById('btnTitleCustom');
  const labelTitleCustom = document.getElementById('labelTitleCustom');

  // Боевой HUD
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

  const btnWeaponMode = document.getElementById('btnWeaponMode');
  const hudWeaponLabel = document.getElementById('hudWeaponLabel');
  const btnEmp = document.getElementById('btnEmp');
  const btnLangMode = document.getElementById('btnLangMode');
  const btnArticleMode = document.getElementById('btnArticleMode');
  const btnSpeedMode = document.getElementById('btnSpeedMode');
  const btnOpenTtsSettings = document.getElementById('btnOpenTtsSettings');
  const hudTtsBadge = document.getElementById('hudTtsBadge');
  const btnOpenDict = document.getElementById('btnOpenDict');
  const btnOpenCustom = document.getElementById('btnOpenCustom');
  const btnPause = document.getElementById('btnPause');
  const btnHudHome = document.getElementById('btnHudHome');
  const btnQuickLevels = document.getElementById('btnQuickLevels');
  const btnClearFeed = document.getElementById('btnClearFeed');

  const ztypeKeyboard = document.getElementById('ztypeKeyboard');
  const kbdProgressFill = document.getElementById('kbdProgressFill');
  const btnKbdEmp = document.getElementById('btnKbdEmp');
  const kbdEmpCount = document.getElementById('kbdEmpCount');
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
  const overlayWeaponTitle = document.getElementById('overlayWeaponTitle');
  const overlayWeaponRow = document.getElementById('overlayWeaponRow');
  const overlayWordsHeader = document.getElementById('overlayWordsHeader');
  const overlayWordsPreview = document.getElementById('overlayWordsPreview');
  const btnStartLevel = document.getElementById('btnStartLevel');
  const btnNextLevel = document.getElementById('btnNextLevel');
  const btnPracticeMistakes = document.getElementById('btnPracticeMistakes');
  const btnBackToTitle = document.getElementById('btnBackToTitle');

  const levelQuizBox = document.getElementById('levelQuizBox');
  const quizHeaderTitle = document.getElementById('quizHeaderTitle');
  const quizScoreText = document.getElementById('quizScoreText');
  const quizQuestionWord = document.getElementById('quizQuestionWord');
  const quizOptionsGrid = document.getElementById('quizOptionsGrid');

  // Диалог Gemini 3.8 TTS
  const ttsSettingsDialog = document.getElementById('ttsSettingsDialog');
  const ttsDialogBody = document.getElementById('ttsDialogBody');
  const ttsDialogTitle = document.getElementById('ttsDialogTitle');
  const btnCloseTtsDialog = document.getElementById('btnCloseTtsDialog');
  const ttsStatusBanner = document.getElementById('ttsStatusBanner');
  const ttsEnableLabel = document.getElementById('ttsEnableLabel');
  const btnToggleTtsMaster = document.getElementById('btnToggleTtsMaster');
  const ttsModelLabel = document.getElementById('ttsModelLabel');
  const ttsModelGrid = document.getElementById('ttsModelGrid');
  const ttsModelFlashDesc = document.getElementById('ttsModelFlashDesc');
  const ttsModelLiteDesc = document.getElementById('ttsModelLiteDesc');
  const ttsVoiceLabel = document.getElementById('ttsVoiceLabel');
  const ttsVoiceGrid = document.getElementById('ttsVoiceGrid');
  const btnTestGeminiVoice = document.getElementById('btnTestGeminiVoice');
  const ttsApiKeySummary = document.getElementById('ttsApiKeySummary');
  const ttsApiKeyHint = document.getElementById('ttsApiKeyHint');
  const geminiApiKeyInput = document.getElementById('geminiApiKeyInput');
  const btnSaveApiKey = document.getElementById('btnSaveApiKey');
  const btnClearApiKey = document.getElementById('btnClearApiKey');

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
    if (state.screenMode === 'title') {
      const headerRect = titleHeaderCard ? titleHeaderCard.getBoundingClientRect() : null;
      const dockRect = titleBottomDock ? titleBottomDock.getBoundingClientRect() : null;
      const headerBottom = headerRect && headerRect.height > 0 ? headerRect.bottom : 140;
      const dockTop = dockRect && dockRect.height > 0 ? dockRect.top : (canvas.height - 260);
      const safeTop = Math.max(16, headerBottom + 10);
      const safeBottom = Math.max(safeTop + 70, dockTop - 10);
      return {
        left: 16,
        right: Math.max(280, canvas.width - 16),
        top: safeTop,
        bottom: safeBottom,
        centerX: canvas.width / 2
      };
    }

    const isDesktopWide = window.innerWidth > 960;
    const leftPad = isDesktopWide ? 264 : 8;
    const rightPad = isDesktopWide ? 294 : 8;

    const kbdRect = ztypeKeyboard ? ztypeKeyboard.getBoundingClientRect() : { height: 185 };
    const kbdHeight = kbdRect.height > 20 ? kbdRect.height : 185;

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
    state.ship.targetY = state.screenMode === 'title'
      ? Math.max(bounds.top + 48, bounds.bottom - 26)
      : bounds.bottom - 24;
    if (!state.ship.y) state.ship.y = state.ship.targetY;
    initStars();
    initNebulae();
  }

  function initStars() {
    const count = Math.floor((canvas.width * canvas.height) / 9500);
    state.stars = [];
    for (let i = 0; i < count; i++) {
      state.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.9 + 0.4,
        speed: Math.random() * 24 + 7,
        alpha: Math.random() * 0.7 + 0.2,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
  }

  function initNebulae() {
    const palette = [
      'rgba(34, 211, 238, 0.08)',
      'rgba(139, 92, 246, 0.085)',
      'rgba(16, 185, 129, 0.07)'
    ];
    state.nebulae = palette.map((color, idx) => ({
      x: canvas.width * (0.22 + idx * 0.28),
      y: canvas.height * (0.28 + (idx % 2) * 0.22),
      radius: Math.max(canvas.width, canvas.height) * (0.28 + idx * 0.05),
      vx: (idx % 2 === 0 ? 1 : -1) * (4 + idx * 1.5),
      vy: (idx === 1 ? -1 : 1) * 2.5,
      color
    }));
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

  function getHorizontalPan(x) {
    const bounds = getPlayBounds();
    const halfSpan = Math.max(120, (bounds.right - bounds.left) / 2);
    return Math.max(-0.65, Math.min(0.65, (x - bounds.centerX) / halfSpan));
  }

  // --- Ранг пилота и рекорд на титульном экране ---
  function updatePilotRankUI() {
    if (!pilotRankText) return;
    const completedCount = levels.filter(l => l.completed).length;
    const tr = t();
    let rankIdx = 0;
    if (completedCount >= 6 || state.highScore >= 18000) rankIdx = 3;
    else if (completedCount >= 3 || state.highScore >= 7500) rankIdx = 2;
    else if (completedCount >= 1 || state.highScore >= 2000) rankIdx = 1;

    const rankName = tr.ranks[rankIdx] || tr.ranks[0];
    pilotRankText.textContent = tr.rankLine(rankName, state.highScore.toLocaleString('ru-RU'));
  }

  // --- Смена и рендер оружия ---
  function equipWeapon(weaponId, withPreviewShot = true) {
    const found = WEAPONS.find(w => w.id === weaponId);
    if (!found) return;
    state.weaponId = found.id;
    saveSettingsPatch({ weaponId: found.id });

    renderWeaponSelectors();
    updateHudWeaponBtn();

    if (withPreviewShot) {
      sound.playWeaponEquip(found.id);

      // Показываем баннер на холсте в боевом режиме или делаем живой залп на стартовом экране
      if (state.screenMode === 'play') {
        state.weaponBannerText = t().weaponBanner(found.icon, getWeaponName(found));
        state.weaponBannerTimer = 1.6;
      } else {
        const bounds = getPlayBounds();
        const targetX = state.demoWords.length > 0
          ? state.demoWords[0].x
          : state.ship.x + (Math.random() * 100 - 50);
        const targetY = state.demoWords.length > 0
          ? state.demoWords[0].y
          : Math.max(bounds.top + 28, (bounds.top + state.ship.y) / 2);
        spawnWeaponVisualEffect(found.id, targetX, targetY, found.color);
      }
    }
  }

  function updateHudWeaponBtn() {
    const w = getCurrentWeapon();
    if (btnWeaponMode) {
      btnWeaponMode.style.borderColor = w.color;
      btnWeaponMode.innerHTML = `${w.icon}<span class="hide-mobile" id="hudWeaponLabel"> ${escapeHtml(getWeaponName(w))}</span>`;
    }
    if (titleWeaponDesc) {
      titleWeaponDesc.textContent = getWeaponDesc(w);
    }
  }

  function renderWeaponSelectors() {
    const current = getCurrentWeapon();
    [titleWeaponRow, overlayWeaponRow].forEach(container => {
      if (!container) return;
      container.innerHTML = '';
      WEAPONS.forEach(w => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'weapon-pill-btn' + (w.id === current.id ? ' active' : '');
        btn.style.setProperty('--w-color', w.color);
        btn.title = `${getWeaponName(w)} — ${getWeaponDesc(w)}`;
        btn.innerHTML = `
          <span class="weapon-pill-icon">${w.icon}</span>
          <span class="weapon-pill-name">${escapeHtml(getWeaponName(w))}</span>
        `;
        btn.addEventListener('click', () => {
          equipWeapon(w.id, true);
          btn.blur();
        });
        container.appendChild(btn);
      });
    });
  }

  // --- Визуальные эффекты выстрелов каждого вида оружия ---
  function buildLightningPoints(x1, y1, x2, y2, segments = 8, jitter = 15) {
    const pts = [{ x: x1, y: y1 }];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    for (let i = 1; i < segments; i++) {
      const frac = i / segments;
      const offset = (Math.random() * 2 - 1) * jitter * Math.sin(frac * Math.PI);
      pts.push({
        x: x1 + dx * frac + nx * offset,
        y: y1 + dy * frac + ny * offset
      });
    }
    pts.push({ x: x2, y: y2 });
    return pts;
  }

  function spawnWeaponVisualEffect(weaponId, targetX, targetY, articleColor) {
    const dx = targetX - state.ship.x;
    const dy = targetY - state.ship.y;
    const angle = Math.atan2(dy, dx);
    state.ship.targetAngle = angle;

    const w = WEAPONS.find(item => item.id === weaponId) || WEAPONS[0];
    state.ship.recoil = 6.5 * w.recoilBoost;

    const noseX = state.ship.x + Math.cos(angle) * 20;
    const noseY = state.ship.y + Math.sin(angle) * 20;
    const perpX = -Math.sin(angle);
    const perpY = Math.cos(angle);

    if (weaponId === 'plasma') {
      // Двойные параллельные плазменные разряды с крыльев
      [-7, 7].forEach(offset => {
        state.lasers.push({
          kind: 'plasma',
          x1: noseX + perpX * offset,
          y1: noseY + perpY * offset,
          x2: targetX + perpX * (offset * 0.45),
          y2: targetY + perpY * (offset * 0.45),
          color: w.color,
          coreColor: '#ecfeff',
          width: 2.8,
          alpha: 1.0,
          decay: 8.0
        });
      });
      spawnParticles(targetX, targetY + 4, w.color, 7, 105);
    } else if (weaponId === 'railgun') {
      // Мощный пробивной рельсовый гиперлуч + звуковые кольца вдоль траектории
      state.lasers.push({
        kind: 'railgun',
        x1: noseX,
        y1: noseY,
        x2: targetX,
        y2: targetY,
        color: w.color,
        coreColor: '#ffffff',
        width: 5.5,
        alpha: 1.0,
        decay: 5.2
      });
      [0.35, 0.7, 1.0].forEach(frac => {
        state.shockwaves.push({
          x: noseX + (targetX - noseX) * frac,
          y: noseY + (targetY - noseY) * frac,
          radius: 3,
          maxRadius: frac === 1.0 ? 28 : 16,
          color: w.color,
          alpha: 0.9
        });
      });
      spawnParticles(targetX, targetY, '#fda4af', 10, 145);
    } else if (weaponId === 'tesla') {
      // Ветвящаяся электрическая молния
      const mainBolt = buildLightningPoints(noseX, noseY, targetX, targetY, 9, 18);
      const midPoint = mainBolt[Math.floor(mainBolt.length / 2)];
      const branchBolt = buildLightningPoints(
        midPoint.x,
        midPoint.y,
        midPoint.x + (Math.random() * 56 - 28),
        midPoint.y - (20 + Math.random() * 30),
        4,
        9
      );
      state.lasers.push({
        kind: 'tesla',
        points: mainBolt,
        branch: branchBolt,
        color: w.color,
        coreColor: '#e0f2fe',
        width: 2.6,
        alpha: 1.0,
        decay: 6.8
      });
      spawnParticles(targetX, targetY, '#c4b5fd', 8, 120);
    } else if (weaponId === 'missiles') {
      // Изогнутая самонаводящаяся микро-ракета + тонкий луч целеуказателя
      state.missileAlternateSide *= -1;
      const curveSign = state.missileAlternateSide;
      const dist = Math.hypot(dx, dy);
      const ctrlX = (noseX + targetX) / 2 + perpX * curveSign * Math.min(95, dist * 0.32);
      const ctrlY = (noseY + targetY) / 2 + perpY * curveSign * 24;

      state.lasers.push({
        kind: 'designator',
        x1: noseX,
        y1: noseY,
        x2: targetX,
        y2: targetY,
        color: 'rgba(251, 146, 60, 0.45)',
        width: 1.2,
        alpha: 0.75,
        decay: 9.0
      });

      state.missiles.push({
        x0: noseX + perpX * curveSign * 9,
        y0: noseY + perpY * curveSign * 9,
        cx: ctrlX,
        cy: ctrlY,
        x2: targetX,
        y2: targetY,
        x: noseX,
        y: noseY,
        progress: 0,
        speed: 7.4,
        color: w.color
      });
    } else if (weaponId === 'synth') {
      // Хроматический неоновый луч Synthwave + музыкальная пульсирующая волна
      const hueColors = ['#e879f9', '#22d3ee', '#fbbf24', '#34d399'];
      const noteColor = hueColors[sound.synthNoteCursor % hueColors.length];
      state.lasers.push({
        kind: 'synth',
        x1: noseX,
        y1: noseY,
        x2: targetX,
        y2: targetY,
        color: noteColor,
        secondaryColor: articleColor || '#22d3ee',
        coreColor: '#ffffff',
        width: 3.8,
        alpha: 1.0,
        decay: 6.2
      });
      state.shockwaves.push({
        x: targetX,
        y: targetY,
        radius: 4,
        maxRadius: 24,
        color: noteColor,
        alpha: 0.85
      });
      spawnParticles(targetX, targetY, noteColor, 8, 115);
    }
  }

  // --- Переключение между Аркадным Титульным Экраном и Игрой ---
  function launchFromTitleScreen() {
    if (state.screenMode !== 'title') return;
    sound.init();
    sound.playWarpLaunch();

    state.screenMode = 'play';
    state.warpTimer = 0.65;
    state.demoWords = [];
    state.demoTargetId = null;

    if (arcadeTitleScreen) arcadeTitleScreen.hidden = true;
    document.body.classList.remove('mode-title');
    document.body.classList.add('mode-play');

    startLevelNow();
  }

  function returnToTitleScreen() {
    state.running = false;
    state.paused = false;
    state.gameOver = false;
    state.activeWords = [];
    state.lockedWordId = null;
    state.activeQuiz = null;
    state.lasers = [];
    state.missiles = [];
    state.shockwaves = [];
    state.floatingTranslations = [];
    state.demoWords = [];
    state.demoTargetId = null;
    state.screenMode = 'title';
    state.warpTimer = 0.35;

    centerOverlay.classList.add('hidden');
    if (arcadeTitleScreen) arcadeTitleScreen.hidden = false;
    document.body.classList.remove('mode-play');
    document.body.classList.add('mode-title');

    resizeCanvas();
    requestAnimationFrame(() => resizeCanvas());
    updatePilotRankUI();
    renderLevelSidebar();
    applyStaticUILocalization();
  }

  // --- Живой Автопилот на Аркадном Титульном Экране (строго в центральном окне космоса) ---
  function updateTitleDemo(dt) {
    const bounds = getPlayBounds();
    const corridorH = bounds.bottom - bounds.top;

    // Плавное покачивание корабля в нижней части открытого космического окна
    state.ship.targetY = Math.max(bounds.top + 44, bounds.bottom - 26);
    state.ship.x = canvas.width / 2 + Math.sin(performance.now() * 0.0011) * 24;

    // На очень узких по высоте экранах (альбомная ориентация телефона) не спавним демо-слова, чтобы не теснить карточки
    if (corridorH < 120) {
      state.demoWords = [];
      state.demoTargetId = null;
      return;
    }

    const spawnY = bounds.top + 22;

    state.demoSpawnTimer -= dt;
    if (state.demoSpawnTimer <= 0 && state.demoWords.length < 2) {
      const sample = allAutoWords[Math.floor(Math.random() * allAutoWords.length)];
      if (sample) {
        const margin = Math.min(150, canvas.width * 0.24);
        const rx = margin + Math.random() * Math.max(60, canvas.width - margin * 2);
        state.demoWords.push({
          id: nextEntityId++,
          entry: sample,
          text: sample.word,
          typedCount: 0,
          x: rx,
          y: spawnY,
          vy: Math.max(9, Math.min(16, corridorH * 0.065)),
          recoilY: 0,
          hitFlash: 0
        });
      }
      state.demoSpawnTimer = 1.85;
    }

    for (let i = state.demoWords.length - 1; i >= 0; i--) {
      const dw = state.demoWords[i];
      if (dw.recoilY > 0) {
        dw.y = Math.max(bounds.top + 18, dw.y - dw.recoilY * 6 * dt);
        dw.recoilY = Math.max(0, dw.recoilY - 24 * dt);
      } else {
        dw.y += dw.vy * dt;
      }
      if (dw.hitFlash > 0) dw.hitFlash = Math.max(0, dw.hitFlash - dt * 5);

      if (dw.y > state.ship.y - 38) {
        state.demoWords.splice(i, 1);
        if (state.demoTargetId === dw.id) state.demoTargetId = null;
      }
    }

    // Автоприцеливание и красивая демонстрационная стрельба выбранным оружием
    state.demoFireTimer -= dt;
    if (state.demoFireTimer <= 0 && state.demoWords.length > 0) {
      let target = state.demoWords.find(w => w.id === state.demoTargetId);
      if (!target) {
        target = state.demoWords[0];
        state.demoTargetId = target.id;
      }

      if (target && target.y >= spawnY + 4) {
        target.typedCount++;
        target.hitFlash = 1.0;
        target.recoilY = 2.6;
        const style = getArticleStyle(target.entry.article);
        spawnWeaponVisualEffect(state.weaponId, target.x, target.y, style.main);

        if (target.typedCount >= target.text.length) {
          // Красивый беззвучный взрыв слова с показом перевода внутри космического окна
          const idx = state.demoWords.findIndex(w => w.id === target.id);
          if (idx !== -1) state.demoWords.splice(idx, 1);
          state.demoTargetId = null;

          state.shockwaves.push({
            x: target.x,
            y: target.y,
            radius: 6,
            maxRadius: 52,
            color: style.main,
            alpha: 0.9
          });
          spawnParticles(target.x, target.y, style.main, 16, 140);
          state.floatingTranslations.push({
            x: target.x,
            y: Math.min(bounds.bottom - 36, Math.max(bounds.top + 36, target.y)),
            vy: -10,
            entry: target.entry,
            rawDe: target.entry.raw,
            color: style.main,
            life: 0,
            maxLife: 2.5
          });
          state.demoFireTimer = 0.65;
        } else {
          state.demoFireTimer = 0.14;
        }
      } else {
        state.demoFireTimer = 0.18;
      }
    }
  }

  // --- Переключение языка перевода и ВСЕГО меню (RU / עברית / Оба) ---
  function setTranslationLanguage(langId) {
    state.translationLang = langId;
    saveSettingsPatch({ translationLang: langId });

    const modeObj = state.langModes.find(m => m.id === langId) || state.langModes[0];
    if (btnLangMode) btnLangMode.textContent = modeObj.label;

    document.querySelectorAll('.lang-quick-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === langId);
    });

    applyStaticUILocalization();
    renderWeaponSelectors();
    updateHudWeaponBtn();
    renderLevelSidebar();
    refreshOverlayContent();
    renderTtsSettingsUI();
    updatePilotRankUI();

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

    if (arcadeTitleScreen) arcadeTitleScreen.dir = isHe ? 'rtl' : 'ltr';
    if (overlayCard) overlayCard.dir = isHe ? 'rtl' : 'ltr';
    if (ttsDialogBody) ttsDialogBody.dir = isHe ? 'rtl' : 'ltr';

    if (titleTagline) titleTagline.textContent = tr.titleTagline;
    if (titleArsenalLabel) titleArsenalLabel.textContent = tr.titleArsenalLabel;
    if (btnTitleVoice) btnTitleVoice.textContent = tr.titleVoiceLink;
    if (labelTitleDict) labelTitleDict.textContent = tr.titleDictLink(allAutoWords.length);
    if (labelTitleCustom) labelTitleCustom.textContent = tr.titleCustomLink;
    if (overlayWeaponTitle) overlayWeaponTitle.textContent = tr.overlayWeaponTitle;
    if (btnBackToTitle) btnBackToTitle.textContent = tr.backToMenuBtn;

    const lvl = levels[state.currentLevelIndex];
    if (lvl && labelArcadeLaunch) {
      labelArcadeLaunch.textContent = lvl.id === 'level-auto-all'
        ? tr.launchAutoBtn
        : tr.launchMissionBtn(lvl.number, getLevelTitle(lvl).split(',')[0]);
    }

    if (labelPause) labelPause.textContent = tr.pause;
    if (labelScore) labelScore.textContent = tr.score;
    if (labelCombo) labelCombo.textContent = tr.combo;
    if (labelAccuracy) labelAccuracy.textContent = tr.accuracy;
    if (labelShield) labelShield.textContent = tr.shield;
    if (btnArticleMode) {
      btnArticleMode.textContent = state.typeWithArticle ? tr.articleMode : tr.badgeMode;
      btnArticleMode.classList.toggle('active', state.typeWithArticle);
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

    const preset = state.speedPresets[state.speedPresetIndex] || state.speedPresets[0];
    if (btnSpeedMode) btnSpeedMode.textContent = preset.label;
    if (btnTitleSpeed) btnTitleSpeed.textContent = preset.label;

    if (lvl && hudLevelTitle) {
      hudLevelTitle.textContent = lvl.id === 'level-auto-all'
        ? tr.autoAllShort
        : tr.levelShort(lvl.number, getLevelTitle(lvl));
    }

    onTtsStatusChanged();
  }

  // --- Окно настроек Gemini 3.8 TTS ---
  function onTtsStatusChanged() {
    const tr = t();
    if (btnOpenTtsSettings) {
      btnOpenTtsSettings.classList.toggle('active', ttsManager.enabled);
      const shortBadge = !ttsManager.enabled
        ? ' OFF'
        : (ttsManager.localApiKey || ttsManager.serverAvailable === true ? ' 3.8 TTS' : ' TTS');
      btnOpenTtsSettings.innerHTML = `${ttsManager.enabled ? '🎙️' : '🔇'}<span class="hide-mobile" id="hudTtsBadge">${shortBadge}</span>`;
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

  function renderTtsSettingsUI() {
    if (!ttsSettingsDialog) return;
    const tr = t();

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
    if (btnTestGeminiVoice) btnTestGeminiVoice.textContent = tr.ttsTestBtn;
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
        btn.innerHTML = `
          <span class="tts-voice-name">🎙️ ${escapeHtml(v.id)}</span>
          <span class="tts-voice-tone">${escapeHtml(isHebrewUI() ? v.heTone : v.ruTone)}</span>
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

  // --- Перерисовка содержимого центрального меню ---
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

  // --- Отрисовка списка уровней (боковая панель ПК + чипы в меню + чипы на титульном экране) ---
  function renderLevelSidebar() {
    if (levelListContainer) levelListContainer.innerHTML = '';
    if (overlayLevelChips) overlayLevelChips.innerHTML = '';
    if (titleStageChips) titleStageChips.innerHTML = '';
    const tr = t();

    const totalWords = levels
      .filter(l => l.id !== 'level-auto-all')
      .reduce((acc, l) => acc + l.words.length, 0);
    if (totalWordsCounter) totalWordsCounter.textContent = tr.wordsCount(totalWords);

    levels.forEach((lvl, idx) => {
      const localTitle = getLevelTitle(lvl);

      // 1. Карточка для левой панели на ПК
      if (levelListContainer) {
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
      }

      const shortChipLabel = lvl.id === 'level-auto-all'
        ? `🏆 AUTO (${lvl.words.length})`
        : `${lvl.completed ? '✓ ' : ''}${tr.levelShort(lvl.number, localTitle.split(',')[0])}`;

      // 2. Чип для центрального оверлея
      if (overlayLevelChips) {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'level-chip-btn' +
          (idx === state.currentLevelIndex ? ' active' : '') +
          (lvl.completed ? ' completed' : '');
        chip.textContent = shortChipLabel;
        chip.addEventListener('click', () => {
          selectLevel(idx, true);
        });
        overlayLevelChips.appendChild(chip);
      }

      // 3. Чип выбора миссии на аркадном титульном экране
      if (titleStageChips) {
        const tChip = document.createElement('button');
        tChip.type = 'button';
        tChip.className = 'level-chip-btn' +
          (idx === state.currentLevelIndex ? ' active' : '') +
          (lvl.completed ? ' completed' : '');
        tChip.textContent = shortChipLabel;
        tChip.addEventListener('click', () => {
          state.currentLevelIndex = idx;
          sound.init();
          sound._playTactileClick(sound.ctx ? sound.ctx.currentTime : 0, sound.masterGain, 2200, 0.05);
          renderLevelSidebar();
          applyStaticUILocalization();
        });
        titleStageChips.appendChild(tChip);
      }
    });
  }

  function selectLevel(levelIndex, showStartOverlay = true) {
    state.currentLevelIndex = levelIndex;
    state.running = false;
    state.paused = false;
    state.gameOver = false;
    state.activeWords = [];
    state.lockedWordId = null;
    state.lasers = [];
    state.missiles = [];

    const lvl = levels[levelIndex];
    const tr = t();
    hudLevelTitle.textContent = lvl.id === 'level-auto-all'
      ? tr.autoAllShort
      : tr.levelShort(lvl.number, getLevelTitle(lvl));
    hudProgressBar.style.width = '0%';
    if (kbdProgressFill) kbdProgressFill.style.width = '0%';
    hudProgressText.textContent = `0 / ${lvl.words.length}`;

    renderLevelSidebar();
    applyStaticUILocalization();
    updateBottomTargetUI();

    if (state.screenMode === 'title') {
      return;
    }

    if (showStartOverlay) {
      showLevelIntroOverlay();
    } else {
      startLevelNow();
    }
  }

  function renderWordsPreviewList(wordsArray, container) {
    if (!container) return;
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
      div.title = '🔊 Прослушать произношение (Gemini 3.8 TTS)';
      div.style.cursor = 'pointer';
      div.addEventListener('click', () => {
        ttsManager.speakGerman(item.withArticle || item.word, true);
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

    state.screenMode = 'play';
    if (arcadeTitleScreen) arcadeTitleScreen.hidden = true;
    document.body.classList.remove('mode-title');
    document.body.classList.add('mode-play');

    resizeCanvas();
    requestAnimationFrame(() => resizeCanvas());
    state.wordQueue = shuffleArray(pool);
    state.totalWordsInLevel = state.wordQueue.length;
    state.wordsDestroyedInLevel = 0;
    state.activeWords = [];
    state.lockedWordId = null;
    state.lasers = [];
    state.missiles = [];
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

    // Предзагружаем первые 3 слова уровня в кэш Gemini 3.8 TTS заранее!
    const previewSlice = state.wordQueue.slice(-3);
    previewSlice.forEach(entry => {
      ttsManager.prefetch(entry.withArticle || entry.word);
    });

    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
  }

  function getWordFontPx(textLength) {
    const isMobile = canvas.width < 520;
    if (!isMobile) {
      return textLength >= 20 ? 17.5 : 20;
    }
    if (textLength >= 22) return 14;
    if (textLength >= 17) return 15.5;
    if (textLength >= 13) return 17;
    return 18.5;
  }

  // --- Спавн нового слова сверху ---
  function spawnNextWord() {
    if (state.wordQueue.length === 0) return;

    const entry = state.wordQueue.pop();
    const targetText = getTargetString(entry);
    const bounds = getPlayBounds();

    // Заранее запрашиваем аудио Gemini 3.8 TTS, пока слово только летит сверху!
    ttsManager.prefetch(entry.withArticle || entry.word);
    if (state.wordQueue.length > 0) {
      const nextUp = state.wordQueue[state.wordQueue.length - 1];
      ttsManager.prefetch(nextUp.withArticle || nextUp.word);
    }

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

  // --- Выстрел по букве выбранным оружием ---
  function hitWordLetter(wordObj) {
    const weapon = getCurrentWeapon();
    wordObj.typedCount++;
    wordObj.recoilY = Math.min(18, wordObj.recoilY + 4.2 * weapon.recoilBoost);
    wordObj.hitFlash = 1.0;

    state.shotsFired++;
    state.shotsHit++;
    state.score += 10 * state.combo;
    if (state.score > state.highScore) {
      state.highScore = state.score;
      saveSettingsPatch({ highScore: state.highScore });
    }

    const style = getArticleStyle(wordObj.entry.article);
    const isFinalLetter = wordObj.typedCount >= wordObj.text.length;
    const pan = getHorizontalPan(wordObj.x);

    spawnWeaponVisualEffect(weapon.id, wordObj.x, wordObj.y, style.main);
    sound.playWeaponShot(weapon.id, wordObj.typedCount, state.combo, pan, isFinalLetter);

    if (isFinalLetter) {
      explodeWord(wordObj, true);
    } else {
      updateBottomTargetUI();
      updateKeyboardNextHint();
    }

    updateHudStats();
  }

  // --- ВЗРЫВ СЛОВА + ПЕРЕВОД + ОЗВУЧКА GEMINI 3.8 TTS ---
  function explodeWord(wordObj, byPlayer = true) {
    const idx = state.activeWords.findIndex(w => w.id === wordObj.id);
    if (idx !== -1) {
      state.activeWords.splice(idx, 1);
    }

    if (state.lockedWordId === wordObj.id) {
      state.lockedWordId = null;
    }

    const style = getArticleStyle(wordObj.entry.article);
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

    state.killHistory.unshift(wordObj.entry);
    if (state.killHistory.length > 40) state.killHistory.pop();
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

      const pan = getHorizontalPan(wordObj.x);
      sound.playExplosion(state.combo, pan);
      ttsManager.speakGerman(wordObj.entry.withArticle || wordObj.entry.word);
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
      card.title = '🔊 Gemini 3.8 TTS';

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
        ttsManager.speakGerman(entry.withArticle || entry.word, true);
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
    if (
      (dictDialog && dictDialog.open) ||
      (customWordsDialog && customWordsDialog.open) ||
      (ttsSettingsDialog && ttsSettingsDialog.open)
    ) {
      return;
    }

    // Горячие клавиши 1–5 для мгновенной смены оружия
    if (!e.ctrlKey && !e.altKey && !e.metaKey && /^[1-5]$/.test(e.key)) {
      const idx = Number(e.key) - 1;
      if (WEAPONS[idx]) {
        e.preventDefault();
        equipWeapon(WEAPONS[idx].id, true);
        return;
      }
    }

    // Запуск с титульного экрана по Enter / Space
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

  // --- Обработка нажатий по экранной клавиатуре ZType (мгновенный тач без пробивания подложек) ---
  function handleVirtualKeyPress(btn, e) {
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

  document.querySelectorAll('.zkey').forEach(btn => {
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

      // Моментально повышаем приоритет предзагрузки озвучки захваченного слова
      ttsManager.prefetch(chosen.entry.withArticle || chosen.entry.word);

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
    if (kbdEmpCount) kbdEmpCount.textContent = String(state.empCharges);
    btnEmp.disabled = state.empCharges <= 0;
    if (btnKbdEmp) btnKbdEmp.style.opacity = state.empCharges <= 0 ? '0.42' : '1';

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
    if (kbdEmpCount) kbdEmpCount.textContent = String(state.empCharges);
    btnEmp.disabled = state.empCharges <= 0;
    if (btnKbdEmp) btnKbdEmp.style.opacity = state.empCharges <= 0 ? '0.42' : '1';

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

    const completedIds = levels.filter(l => l.completed).map(l => l.id);
    saveSettingsPatch({
      completedLevelIds: completedIds,
      highScore: Math.max(state.highScore, state.score)
    });

    updatePilotRankUI();
    renderLevelSidebar();
    refreshOverlayContent();
    startPostLevelQuiz(lvl.words);
    centerOverlay.classList.remove('hidden');
  }

  // --- Мини-блиц из 3 слов после уровня ---
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
      ttsManager.speakGerman(currentQ.withArticle || currentQ.word);
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

  // --- Главный игровой цикл ---
  let lastFrameTime = performance.now();

  function gameLoop(now) {
    const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
    lastFrameTime = now;

    update(dt, now);
    render(now);

    requestAnimationFrame(gameLoop);
  }

  function update(dt, now) {
    const bounds = getPlayBounds();

    if (state.screenMode === 'play') {
      state.ship.x = bounds.centerX;
      state.ship.targetY = bounds.bottom - 24;
    }

    // Плавный перелёт корабля по вертикали (при старте с титульного экрана в бой)
    state.ship.y += (state.ship.targetY - state.ship.y) * Math.min(1, dt * 8.5);

    if (state.warpTimer > 0) {
      state.warpTimer = Math.max(0, state.warpTimer - dt);
    }

    if (state.weaponBannerTimer > 0) {
      state.weaponBannerTimer = Math.max(0, state.weaponBannerTimer - dt);
    }

    // Движение туманностей
    for (const neb of state.nebulae) {
      neb.x += neb.vx * dt;
      neb.y += neb.vy * dt;
      if (neb.x < -neb.radius * 0.4 || neb.x > canvas.width + neb.radius * 0.4) neb.vx *= -1;
      if (neb.y < -neb.radius * 0.4 || neb.y > canvas.height + neb.radius * 0.4) neb.vy *= -1;
    }

    // Звёздное поле + ускорение во время гиперпрыжка
    const warpMult = state.warpTimer > 0 ? 14.0 : (state.running && !state.paused ? 1.45 : 0.75);
    const starMaxY = state.screenMode === 'title' ? canvas.height : bounds.bottom;
    for (const s of state.stars) {
      s.y += s.speed * warpMult * dt;
      if (s.y > starMaxY) {
        s.y = 0;
        s.x = Math.random() * canvas.width;
      }
    }

    if (state.layoutWarningTimer > 0) {
      state.layoutWarningTimer = Math.max(0, state.layoutWarningTimer - dt);
    }

    // Обновление лучей и молний
    for (let i = state.lasers.length - 1; i >= 0; i--) {
      const l = state.lasers[i];
      l.alpha -= dt * (l.decay || 7.5);
      if (l.alpha <= 0) state.lasers.splice(i, 1);
    }

    // Обновление самонаводящихся микро-ракет
    for (let i = state.missiles.length - 1; i >= 0; i--) {
      const m = state.missiles[i];
      m.progress += m.speed * dt;
      const tProg = Math.min(1, m.progress);
      const inv = 1 - tProg;
      m.x = inv * inv * m.x0 + 2 * inv * tProg * m.cx + tProg * tProg * m.x2;
      m.y = inv * inv * m.y0 + 2 * inv * tProg * m.cy + tProg * tProg * m.y2;

      // Дымный огненный шлейф ракеты
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
      updateTitleDemo(dt, now);
      return;
    }

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
  function render(now = 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bounds = getPlayBounds();
    const starClipBottom = state.screenMode === 'title' ? canvas.height : bounds.bottom;

    // 1. Глубокие живые космические туманности
    for (const neb of state.nebulae) {
      const grad = ctx.createRadialGradient(neb.x, neb.y, 10, neb.x, neb.y, neb.radius);
      grad.addColorStop(0, neb.color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(neb.x, neb.y, neb.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Тактическая сетка ZType в боевом режиме
    if (state.screenMode === 'play') {
      ctx.save();
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.045)';
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
    }

    // 3. Звёзды (или гиперпространственные росчерки при варп-прыжке!)
    for (const s of state.stars) {
      if (s.y > starClipBottom) continue;
      const twinkle = 0.78 + 0.22 * Math.sin(now * 0.003 + s.twinklePhase);
      const a = s.alpha * twinkle;

      if (state.warpTimer > 0) {
        ctx.strokeStyle = `rgba(165, 243, 252, ${Math.min(1, a + 0.25)})`;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y - s.speed * 1.15);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(226, 232, 240, ${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 4. Линия захвата цели
    const lockedWord = state.activeWords.find(w => w.id === state.lockedWordId);
    if (lockedWord && state.running) {
      const w = getCurrentWeapon();
      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = w.color;
      ctx.globalAlpha = 0.34;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(state.ship.x, state.ship.y);
      ctx.lineTo(lockedWord.x, lockedWord.y);
      ctx.stroke();
      ctx.restore();
    }

    // 5. Отрисовка всех видов оружейных залпов (Плазма, Рельсотрон, Молния Тесла, Синтвейв)
    for (const l of state.lasers) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, l.alpha);

      if (l.kind === 'tesla' && Array.isArray(l.points)) {
        ctx.strokeStyle = l.color;
        ctx.shadowColor = l.color;
        ctx.shadowBlur = 16;
        ctx.lineWidth = l.width || 2.6;
        ctx.beginPath();
        l.points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        // Яркое белое ядро молнии
        ctx.strokeStyle = l.coreColor || '#ffffff';
        ctx.lineWidth = 1.1;
        ctx.stroke();

        if (Array.isArray(l.branch)) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          l.branch.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.stroke();
        }
      } else {
        ctx.strokeStyle = l.color;
        ctx.shadowColor = l.color;
        ctx.shadowBlur = l.kind === 'railgun' ? 20 : 13;
        ctx.lineWidth = l.width || 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(l.x1, l.y1);
        ctx.lineTo(l.x2, l.y2);
        ctx.stroke();

        if (l.coreColor) {
          ctx.strokeStyle = l.coreColor;
          ctx.lineWidth = Math.max(1, (l.width || 3) * 0.38);
          ctx.beginPath();
          ctx.moveTo(l.x1, l.y1);
          ctx.lineTo(l.x2, l.y2);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // 6. Отрисовка летящих микро-ракет
    for (const m of state.missiles) {
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = m.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 7. Ударные волны
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

    // 8. Частицы
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

    // 9. Корабль игрока (меняет обшивку и пушки в зависимости от выбранного оружия!)
    drawPlayerShip(now);

    // 10. Слова (в режиме титульного экрана — демо-слова автопилота; в бою — боевые слова)
    if (state.screenMode === 'title') {
      const demoTarget = state.demoWords.find(w => w.id === state.demoTargetId);
      for (const dw of state.demoWords) {
        if (!demoTarget || dw.id !== demoTarget.id) {
          drawWordNode(dw, false, bounds);
        }
      }
      if (demoTarget) {
        drawWordNode(demoTarget, true, bounds);
      }
    } else {
      for (const w of state.activeWords) {
        if (w.id !== state.lockedWordId) {
          drawWordNode(w, false, bounds);
        }
      }
      if (lockedWord) {
        drawWordNode(lockedWord, true, bounds);
      }
    }

    // 11. Всплывающие карточки переводов
    for (const ft of state.floatingTranslations) {
      drawFloatingTranslation(ft, bounds);
    }

    // 12. Уведомления над кораблём (смена оружия / раскладка)
    if (state.weaponBannerTimer > 0 && state.weaponBannerText) {
      drawWeaponBanner(bounds);
    }
    if (state.layoutWarningTimer > 0) {
      drawLayoutWarning(bounds);
    }
  }

  function drawPlayerShip(now = 0) {
    const { x, y, angle, recoil } = state.ship;
    const weapon = getCurrentWeapon();
    const primary = weapon.color;
    const secondary = weapon.secondaryColor;

    ctx.save();
    ctx.translate(x - Math.cos(angle) * recoil, y - Math.sin(angle) * recoil);
    ctx.rotate(angle + Math.PI / 2);

    // Длинный реактивный шлейф двигателя (особенно эффектный на титульном экране в стиле ZType!)
    const isTitle = state.screenMode === 'title';
    const flameLen = (isTitle ? 48 : 23) + Math.sin(now * 0.03) * 4 + Math.random() * 4;
    const grad = ctx.createLinearGradient(0, 11, 0, 11 + flameLen);
    grad.addColorStop(0, primary);
    grad.addColorStop(0.45, secondary);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(-5.5, 12);
    ctx.lineTo(0, 12 + flameLen);
    ctx.lineTo(5.5, 12);
    ctx.closePath();
    ctx.fill();

    ctx.shadowColor = primary;
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#0b1324';
    ctx.strokeStyle = primary;
    ctx.lineWidth = 2;

    if (weapon.id === 'railgun') {
      // Двойной магнитный рельсовый ствол
      ctx.beginPath();
      ctx.moveTo(-4, -23);
      ctx.lineTo(-4, -6);
      ctx.moveTo(4, -23);
      ctx.lineTo(4, -6);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(15, 12);
      ctx.lineTo(5, 9);
      ctx.lineTo(0, 14);
      ctx.lineTo(-5, 9);
      ctx.lineTo(-15, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (weapon.id === 'tesla') {
      // Корпус с энергетической сферой Теслы на носу
      ctx.beginPath();
      ctx.moveTo(0, -17);
      ctx.lineTo(14, 12);
      ctx.lineTo(0, 8);
      ctx.lineTo(-14, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.arc(0, -19, 3.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (weapon.id === 'missiles') {
      // Ударный перехватчик с боковыми ракетными пилонами
      ctx.beginPath();
      ctx.moveTo(0, -17);
      ctx.lineTo(17, 10);
      ctx.lineTo(11, 13);
      ctx.lineTo(5, 9);
      ctx.lineTo(0, 13);
      ctx.lineTo(-5, 9);
      ctx.lineTo(-11, 13);
      ctx.lineTo(-17, 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      // Классический скоростной перехватчик (Plasma / Synthwave)
      ctx.beginPath();
      ctx.moveTo(0, -19);
      ctx.lineTo(15, 12);
      ctx.lineTo(5, 8);
      ctx.lineTo(0, 13);
      ctx.lineTo(-5, 8);
      ctx.lineTo(-15, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (weapon.id === 'plasma') {
        ctx.fillStyle = secondary;
        ctx.beginPath();
        ctx.arc(-11, 5, 2.2, 0, Math.PI * 2);
        ctx.arc(11, 5, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Светящаяся кабина пилота
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.moveTo(0, -9);
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

    const padX = canvas.width < 520 ? 10 : 13;
    const boxW = totalW + padX * 2;
    const boxH = fontPx + 14;

    const clampedDrawX = Math.max(bounds.left + boxW / 2 + 4, Math.min(bounds.right - boxW / 2 - 4, w.x));
    w.x = clampedDrawX;

    ctx.save();
    ctx.translate(clampedDrawX, w.y);

    ctx.fillStyle = isLocked ? '#fb923c' : style.main;
    ctx.shadowColor = isLocked ? '#fb923c' : style.main;
    ctx.shadowBlur = isLocked ? 12 : 6;

    ctx.beginPath();
    ctx.arc(boxW / 2 + 7, -boxH / 2 + 5, isLocked ? 4.5 : 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = isLocked ? 'rgba(251, 146, 60, 0.9)' : style.glow;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(boxW / 2 + 7, -boxH / 2 + 5, isLocked ? 9.5 : 7, 0, Math.PI * 2);
    ctx.stroke();

    const boxX = -boxW / 2;
    const boxY = -boxH / 2;

    if (!state.typeWithArticle && w.entry.article) {
      const badgeStr = w.entry.article;
      ctx.shadowBlur = 0;
      ctx.font = '800 12.5px Inter, sans-serif';
      const bw = ctx.measureText(badgeStr).width + 14;
      ctx.fillStyle = 'rgba(7, 13, 26, 0.96)';
      ctx.strokeStyle = style.main;
      ctx.lineWidth = 1.3;
      roundRect(ctx, -bw / 2, boxY - 19, bw, 18, 6);
      ctx.fill();
      ctx.stroke();

      ctx.direction = 'ltr';
      ctx.fillStyle = style.main;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeStr, 0, boxY - 10);
    }

    ctx.shadowBlur = isLocked ? 12 : 0;
    ctx.fillStyle = isLocked
      ? 'rgba(30, 16, 8, 0.97)'
      : 'rgba(6, 11, 23, 0.96)';
    ctx.strokeStyle = isLocked
      ? '#fb923c'
      : (w.hitFlash > 0 ? '#ffffff' : style.main);
    ctx.lineWidth = isLocked ? 2.2 : 1.5;

    roundRect(ctx, boxX, boxY, boxW, boxH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.direction = 'ltr';
    ctx.font = `700 ${fontPx}px "JetBrains Mono", Consolas, monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const startTextX = -totalW / 2;

    if (typedText.length > 0) {
      ctx.fillStyle = '#34d399';
      ctx.fillText(typedText, startTextX, 0.5);
    }

    if (remainText.length > 0) {
      const firstRemain = remainText[0];
      const restRemain = remainText.slice(1);
      const firstRemainW = ctx.measureText(firstRemain).width;

      ctx.fillStyle = isLocked ? '#fde047' : '#38bdf8';
      ctx.fillText(firstRemain, startTextX + typedW, 0.5);

      ctx.fillStyle = '#ffffff';
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
    const cleanDe = (ft.entry && (ft.entry.withArticle || ft.entry.word)) || ft.rawDe;
    let deFontPx = isMobile ? 14.5 : 16.5;
    let ruFontPx = isMobile ? 16.5 : 19;

    ctx.font = `700 ${deFontPx}px "JetBrains Mono", Consolas, monospace`;
    let deW = ctx.measureText(cleanDe).width;

    const translatedStr = getWordTranslation(ft.entry);
    const transText = `💥 ${translatedStr}`;
    ctx.font = `800 ${ruFontPx}px Inter, sans-serif`;
    let transW = ctx.measureText(transText).width;

    const maxAllowedW = (bounds.right - bounds.left) - 16;
    if (deW + 28 > maxAllowedW && deFontPx > 12) {
      deFontPx = Math.max(12, Math.floor(deFontPx * (maxAllowedW - 28) / deW));
      ctx.font = `700 ${deFontPx}px "JetBrains Mono", Consolas, monospace`;
      deW = ctx.measureText(cleanDe).width;
    }
    if (transW + 28 > maxAllowedW && ruFontPx > 12.5) {
      ruFontPx = Math.max(12.5, Math.floor(ruFontPx * (maxAllowedW - 28) / transW));
      ctx.font = `800 ${ruFontPx}px Inter, sans-serif`;
      transW = ctx.measureText(transText).width;
    }

    const cardW = Math.min(maxAllowedW, Math.max(deW, transW) + 30);
    const cardH = isMobile ? 56 : 64;

    const drawX = Math.max(bounds.left + cardW / 2 + 6, Math.min(bounds.right - cardW / 2 - 6, ft.x));
    const drawY = Math.max(bounds.top + cardH / 2 + 6, Math.min(bounds.bottom - cardH / 2 - 6, ft.y));

    ctx.translate(drawX, drawY);

    ctx.shadowColor = ft.color;
    ctx.shadowBlur = 16;
    ctx.fillStyle = 'rgba(6, 12, 24, 0.97)';
    ctx.strokeStyle = ft.color;
    ctx.lineWidth = 2;

    roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 11);
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.direction = 'ltr';
    ctx.font = `700 ${deFontPx}px "JetBrains Mono", Consolas, monospace`;
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(cleanDe, 0, -11.5);

    ctx.direction = isRtlTranslation(ft.entry) ? 'rtl' : 'ltr';
    ctx.font = `800 ${ruFontPx}px Inter, sans-serif`;
    ctx.fillStyle = '#fde047';
    ctx.fillText(transText, 0, 12.5);

    ctx.restore();
  }

  function drawWeaponBanner(bounds) {
    const w = getCurrentWeapon();
    ctx.save();
    ctx.globalAlpha = Math.min(1, state.weaponBannerTimer * 1.4);
    ctx.font = '800 14px Inter, sans-serif';
    const textW = ctx.measureText(state.weaponBannerText).width + 30;
    ctx.translate(bounds.centerX, state.ship.y - 56);
    ctx.fillStyle = 'rgba(7, 13, 26, 0.96)';
    ctx.strokeStyle = w.color;
    ctx.lineWidth = 1.8;
    roundRect(ctx, -textW / 2, -16, textW, 32, 999);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.weaponBannerText, 0, 0);
    ctx.restore();
  }

  function drawLayoutWarning(bounds) {
    ctx.save();
    const w = Math.min(390, bounds.right - bounds.left - 20);
    ctx.translate(bounds.centerX, state.ship.y - 60);
    ctx.fillStyle = 'rgba(127, 29, 29, 0.96)';
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 1.8;
    roundRect(ctx, -w / 2, -19, w, 38, 10);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 14px Inter, sans-serif';
    ctx.fillStyle = '#ffe4e6';
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

  // --- События кнопок Титульного Экрана и Боевого Интерфейса ---
  if (btnArcadeLaunch) {
    btnArcadeLaunch.addEventListener('click', () => {
      launchFromTitleScreen();
    });
  }

  if (btnBackToTitle) {
    btnBackToTitle.addEventListener('click', () => {
      returnToTitleScreen();
    });
  }

  if (btnHudHome) {
    btnHudHome.addEventListener('click', () => {
      returnToTitleScreen();
    });
  }

  if (btnWeaponMode) {
    btnWeaponMode.addEventListener('click', () => {
      const idx = WEAPONS.findIndex(w => w.id === state.weaponId);
      const nextW = WEAPONS[(idx + 1) % WEAPONS.length];
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
      saveSettingsPatch({ typeWithArticle: state.typeWithArticle });
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

  function cycleSpeedPreset() {
    state.speedPresetIndex = (state.speedPresetIndex + 1) % state.speedPresets.length;
    saveSettingsPatch({ speedPresetIndex: state.speedPresetIndex });
    const preset = state.speedPresets[state.speedPresetIndex];
    if (btnSpeedMode) btnSpeedMode.textContent = preset.label;
    if (btnTitleSpeed) btnTitleSpeed.textContent = preset.label;

    state.activeWords.forEach(w => {
      if (w.baseSpeedUnscaled) {
        w.vy = w.baseSpeedUnscaled * preset.mult;
      }
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

  // --- Открытие и управление студией Gemini 3.8 TTS ---
  function openTtsStudioDialog() {
    if (state.running && !state.paused) state.paused = true;
    renderTtsSettingsUI();
    ttsSettingsDialog.showModal();
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
      btnTestGeminiVoice.disabled = true;
      btnTestGeminiVoice.textContent = tr.ttsTestingBtn;
      try {
        await ttsManager.speakGerman('der Kofferraum', true);
      } finally {
        btnTestGeminiVoice.disabled = false;
        btnTestGeminiVoice.textContent = tr.ttsTestBtn;
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

  function openDictionaryModal() {
    if (state.running && !state.paused) {
      state.paused = true;
    }
    renderFullDictionary(dictSearchInput.value);
    dictDialog.showModal();
  }

  btnOpenDict.addEventListener('click', openDictionaryModal);
  if (btnTitleDict) btnTitleDict.addEventListener('click', openDictionaryModal);

  btnCloseDict.addEventListener('click', () => {
    dictDialog.close();
    if (state.screenMode === 'play' && state.running && centerOverlay.classList.contains('hidden')) {
      state.paused = false;
    }
  });

  dictSearchInput.addEventListener('input', () => {
    renderFullDictionary(dictSearchInput.value);
  });

  function openCustomWordsModal() {
    if (state.running && !state.paused) state.paused = true;
    customWordsDialog.showModal();
  }

  if (btnOpenCustom) btnOpenCustom.addEventListener('click', openCustomWordsModal);
  if (btnTitleCustom) btnTitleCustom.addEventListener('click', openCustomWordsModal);

  btnCloseCustom.addEventListener('click', () => {
    customWordsDialog.close();
    if (state.screenMode === 'play' && state.running && centerOverlay.classList.contains('hidden')) {
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
    state.currentLevelIndex = levels.length - 1;
    if (state.screenMode === 'title') {
      launchFromTitleScreen();
    } else {
      startLevelNow();
    }
  });

  // --- Инициализация на живом аркадном титульном экране ---
  setTranslationLanguage(state.translationLang);
  updatePilotRankUI();
  resizeCanvas();
  requestAnimationFrame(() => resizeCanvas());
  requestAnimationFrame(gameLoop);
})();
