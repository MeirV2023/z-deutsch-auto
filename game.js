(() => {
  'use strict';

  // --- Цветовая кодировка категорий и артиклей (DE / EN / ES) ---
  const ARTICLE_COLORS = {
    // Deutsch
    'der': { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', label: 'der' },
    'die': { main: '#fb7185', glow: 'rgba(251, 113, 133, 0.45)', label: 'die' },
    'das': { main: '#34d399', glow: 'rgba(52, 211, 153, 0.45)', label: 'das' },
    'Pl.': { main: '#fbbf24', glow: 'rgba(251, 191, 36, 0.45)', label: 'Pl.' },
    'der/die': { main: '#60a5fa', glow: 'rgba(96, 165, 250, 0.45)', label: 'der/die' },
    // Español
    'el': { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', label: 'el' },
    'los': { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', label: 'los' },
    'la': { main: '#fb7185', glow: 'rgba(251, 113, 133, 0.45)', label: 'la' },
    'las': { main: '#fb7185', glow: 'rgba(251, 113, 133, 0.45)', label: 'las' },
    'Verbo': { main: '#a78bfa', glow: 'rgba(167, 139, 250, 0.45)', label: 'Verbo' },
    // English & Shared POS
    'Noun': { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', label: 'Noun' },
    'Verb': { main: '#a78bfa', glow: 'rgba(167, 139, 250, 0.45)', label: 'Verb' },
    'Adj.': { main: '#34d399', glow: 'rgba(52, 211, 153, 0.45)', label: 'Adj.' },
    'Adv.': { main: '#e879f9', glow: 'rgba(232, 121, 249, 0.45)', label: 'Adv.' },
    'Pron.': { main: '#f472b6', glow: 'rgba(244, 114, 182, 0.45)', label: 'Pron.' },
    'sich': { main: '#c084fc', glow: 'rgba(192, 132, 252, 0.45)', label: 'sich' },
    'Phrase': { main: '#fbbf24', glow: 'rgba(251, 191, 36, 0.45)', label: 'Phrase' },
    'Satz': { main: '#2dd4bf', glow: 'rgba(45, 212, 191, 0.45)', label: 'Satz' }
  };

  function getArticleStyle(article, fallbackLang = 'de') {
    return ARTICLE_COLORS[article] || {
      main: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.4)',
      label: article || fallbackLang.toUpperCase()
    };
  }

  // --- Арсенал из 6 видов оружия с прокачкой за выученные слова ---
  const WEAPONS = [
    {
      id: 'plasma',
      key: '1',
      icon: '⚡',
      unlockWords: 0,
      color: '#22d3ee',
      secondaryColor: '#34d399',
      recoilBoost: 1.0,
      names: { ru: 'Плазма', en: 'Plasma', he: 'פלזמה' },
      descs: {
        ru: 'Сдвоенные плазменные импульсы с нарастающей комбо-гармоникой',
        en: 'Twin plasma pulses with rising combo harmonics',
        he: 'צמד פולסי פלזמה מהירים עם הרמוניית קומבו מתגברת'
      }
    },
    {
      id: 'gravity',
      key: '2',
      icon: '🌀',
      unlockWords: 8,
      color: '#2dd4bf',
      secondaryColor: '#38bdf8',
      recoilBoost: 2.2,
      names: { ru: 'Грави-волна', en: 'Gravity Wave', he: 'גל כבידה' },
      descs: {
        ru: 'Антигравитация: сразу много слов разлетаются высоко к самому началу экрана!',
        en: 'Anti-gravity surge: blasts multiple words all the way back to the top!',
        he: 'אנטי-כבידה: הודף בבת אחת מילים רבות חזרה למעלה לתחילת המסך!'
      }
    },
    {
      id: 'railgun',
      key: '3',
      icon: '🔴',
      unlockWords: 20,
      color: '#fb7185',
      secondaryColor: '#f43f5e',
      recoilBoost: 1.75,
      names: { ru: 'Рельсотрон', en: 'Railgun', he: 'תותח מסילה' },
      descs: {
        ru: 'Мощный гиперлуч с басовым ударом, кольцами волны и сильной отдачей',
        en: 'Hyper-velocity beam with sonic shockwaves and heavy recoil',
        he: 'קרן על-קולית עוצמתית עם הדף חזק וטבעות הדף'
      }
    },
    {
      id: 'missiles',
      key: '4',
      icon: '🚀',
      unlockWords: 35,
      color: '#fb923c',
      secondaryColor: '#fbbf24',
      recoilBoost: 1.35,
      names: { ru: 'Ракеты', en: 'Missiles', he: 'טילים' },
      descs: {
        ru: 'Самонаводящийся рой микро-ракет с дымным шлейфом и микро-взрывом',
        en: 'Homing micro-missile swarm with fiery smoke trails',
        he: 'נחיל טילי מיקרו מתבייתים עם שובל אש ופיצוץ ממוקד'
      }
    },
    {
      id: 'tesla',
      key: '5',
      icon: '🌩️',
      unlockWords: 50,
      color: '#a78bfa',
      secondaryColor: '#38bdf8',
      recoilBoost: 1.15,
      names: { ru: 'Тесла', en: 'Tesla Coil', he: 'טסלה' },
      descs: {
        ru: 'Ветвящаяся дуга молнии с электрическим треском (открывается за 50 слов!)',
        en: 'Branching high-voltage lightning arc (unlocks at 50 learned words!)',
        he: 'קשת ברק מתפצלת עם פריקה חשמלית (נפתח ב-50 מילים!)'
      }
    },
    {
      id: 'synth',
      key: '6',
      icon: '🎵',
      unlockWords: 70,
      color: '#e879f9',
      secondaryColor: '#22d3ee',
      recoilBoost: 1.1,
      names: { ru: 'Неон-Синт', en: 'Neon Synth', he: 'סינת׳ווייב' },
      descs: {
        ru: 'Призма-лазер: каждая буква играет мелодичную ноту в стиле Synthwave!',
        en: 'Prism laser: every typed letter plays a melodic Synthwave note!',
        he: 'לייזר פריזמה מנגן: כל אות מפיקה צליל סינת׳ווייב מלודי!'
      }
    }
  ];

  // --- Студийные голоса Gemini 3.8 TTS ---
  const GEMINI_VOICES = [
    { id: 'Kore', tones: { ru: 'Чёткий студийный (Ж)', en: 'Crisp studio (F)', he: 'אולפני וברור (נ)' } },
    { id: 'Puck', tones: { ru: 'Энергичный и живой (М)', en: 'Energetic & bright (M)', he: 'אנרגטי וחי (ג)' } },
    { id: 'Charon', tones: { ru: 'Глубокий диктор (М)', en: 'Deep narrator (M)', he: 'קריין עמוק (ג)' } },
    { id: 'Aoede', tones: { ru: 'Мягкий и тёплый (Ж)', en: 'Warm & smooth (F)', he: 'רך ונעים (נ)' } },
    { id: 'Fenrir', tones: { ru: 'Динамичный драйв (М)', en: 'Dynamic drive (M)', he: 'דינמי ונמרץ (ג)' } },
    { id: 'Leda', tones: { ru: 'Чистый и светлый (Ж)', en: 'Clear & light (F)', he: 'צלול ובהיר (נ)' } }
  ];

  const TARGET_LANG_META = {
    de: {
      flag: '🇩🇪',
      code: 'DE',
      heroBrand: '🚀 Z-DEUTSCH',
      sampleWord: 'der Kofferraum',
      speechStyle: 'clear, natural Standard German pronunciation, crisp diction, warm studio voice',
      bcp47: 'de-DE',
      names: { ru: 'Немецкий', en: 'German', he: 'גרמנית' }
    },
    en: {
      flag: '🇬🇧',
      code: 'EN',
      heroBrand: '🚀 Z-ENGLISH',
      sampleWord: 'destination',
      speechStyle: 'clear, natural English pronunciation, crisp diction, warm studio voice',
      bcp47: 'en-US',
      names: { ru: 'Английский', en: 'English', he: 'אנגלית' }
    },
    es: {
      flag: '🇪🇸',
      code: 'ES',
      heroBrand: '🚀 Z-ESPAÑOL',
      speechStyle: 'clear, natural Spanish pronunciation, crisp diction, warm studio voice',
      sampleWord: 'la autopista',
      bcp47: 'es-ES',
      names: { ru: 'Испанский', en: 'Spanish', he: 'ספרדית' }
    }
  };

  // --- Полная локализация интерфейса (RU / EN / עברית) ---
  const UI_TEXT = {
    ru: {
      nativeFilterLabel: 'Перевод:',
      targetFilterLabel: '🎯 Я учу:',
      titleTagline: (langName) => `Сбивайте слова (${langName}) по буквам, запоминайте перевод и открывайте оружие!`,
      titleArsenalLabel: '⚔️ Оружие за слова:',
      learnedPill: (done, nextGoal, nextWeapon) =>
        nextGoal ? `📖 Выучено: ${done} / ${nextGoal} до «${nextWeapon}»` : `📖 Выучено: ${done} сл. (Весь арсенал открыт!)`,
      lockedWeaponHint: (icon, name, needMore, totalNeed) =>
        `🔒 Выучите ещё ${needMore} сл., чтобы открыть ${icon} ${name} (нужно ${totalNeed})`,
      unlockedWeaponBanner: (icon, name) => `🎉 ОТКРЫТО НОВОЕ ОРУЖИЕ: ${icon} ${name}!`,
      lockTagShort: (n) => `🔒 ${n} сл.`,

      originOfficial: '🏛️ ОТ СОЗДАТЕЛЯ',
      originUserAnki: '👤 ЛИЧНЫЙ · ANKI',
      originUserCustom: '👤 ЛИЧНЫЙ КУРС',
      allCoursesBtn: 'Все курсы',
      coursesHudBtn: 'Курсы',
      launchLessonBtn: (num, title, count) => `🚀 Начать игру · Урок ${num}: ${title} (${count})`,
      launchBossBtn: (title) => `👹 В бой! ${title}`,
      titleVoiceLink: '🎙️ Озвучка AI',
      titleDictLink: (n) => `Словарь (${n})`,
      titleCustomLink: 'Anki / Свои слова',
      ranks: ['КАДЕТ', 'ПИЛОТ ГАЛАКТИКИ', 'ШТУРМАН ЛИНГВО', 'КОМАНДОР СЛОВАРЯ'],
      rankLine: (rank, learned, best) => `${rank} · 📖 ${learned} СЛ. · РЕКОРД: ${best}`,
      overlayWeaponTitle: '⚔️ Оружие корабля:',
      backToMenuBtn: '🏠 В меню',
      weaponBanner: (icon, name) => `${icon} Оружие: ${name}`,
      speedBanner: (label) => `Скорость спуска слов: ${label}`,
      gravitySurgeBanner: '🌀 ГРАВИ-ВОЛНА: СЛОВА ОТБРОШЕНЫ К НАЧАЛУ!',

      pause: 'Пауза',
      score: 'Очки',
      combo: 'Комбо',
      learnedHud: 'Выучено',
      shield: 'Щит',
      badgeMode: '🏷️ Бейдж',
      articleMode: '🏷️ С артиклем',
      customBtn: 'Anki',
      wordsCount: (n) => `${n} сл.`,
      wordsShort: (n) => `${n} сл.`,
      sidebarKills: 'Последние слова:',
      killFeedEmpty: 'Сбивайте летящие слова!<br><br>Нажмите <strong>☆</strong> («Повторить ещё раз») рядом со словом — игра сохранит его и будет чаще подкидывать в следующих раундах!',
      pinTooltip: 'Повторить ещё раз (чаще подкидывать в следующих раундах)',
      pinAddedBanner: (w) => `⭐ «${w}» добавлено в повтор!`,
      pinRemovedBanner: (w) => `☆ «${w}» убрано из повтора`,
      drillPinnedBtn: (n) => `⭐ Повторить отмеченные (${n})`,
      pinnedRoundTitle: '⭐ Тренировка отмеченных слов',

      // Z-LINGO 2.0: Главная панель и Космическая Академия
      homeBrandSub: 'Играй · Учись · Запоминай',
      navHome: 'Главная',
      navPlay: 'Играть',
      navCourses: 'Курсы',
      navDecks: 'Мои колоды',
      navStats: 'Статистика',
      navLeaderboard: 'Рейтинг',
      navAdmin: 'Админ',
      streakDays: (n) => `${n} дн.`,
      heroTitleTop: 'Изучай иностранные языки',
      heroTitleAccent: 'в формате игры!',
      launchFreeBtn: 'Начать игру бесплатно',
      perkPlay: 'Игра и практика',
      perkMemory: 'Эффективное запоминание',
      perkAnki: 'Свои колоды (Anki)',
      step1: 'Выбери язык и уровень',
      step2: 'Играй с готовыми колодами или загрузи Anki',
      step3: 'Стреляй по словам, учись и прокачивай арсенал!',
      chooseLangTitle: 'Выбери язык',
      quickStartTitle: 'Быстрый старт',
      quickAnkiBtn: 'Импорт Anki',
      quickAnkiCardTitle: 'Загрузить свою колоду Anki (.apkg)',
      homeProgressTitle: 'Твой прогресс',
      metricLearned: 'Выучено слов',
      metricDecks: 'Колоды',
      metricStreak: 'Рекорд серии',
      homeTopTitle: 'Топ игроков (неделя)',
      seeAllTop: 'Все',
      youPilotLabel: 'Вы (Пилот)',
      featCourses: 'Готовые курсы по темам',
      featAnki: 'Импорт колод Anki (.apkg)',
      featSpeed: (lbl) => `Скорость: ${lbl}`,
      featVoice: 'Озвучка Gemini 3.8 AI',
      promoMonitorBadge: (num, title) => `УРОК ${num} · ${title}`,
      academySub: 'SPACE LANGUAGE ACADEMY',
      nativeLangNames: { ru: 'Русский', en: 'Английский', he: 'Иврит' },
      arenaWaveLabel: (lessonNum, waveNum) => `УРОК ${lessonNum} · ВОЛНА ${String(waveNum).padStart(2, '0')}`,
      desktopPromptIdle: '⌨️ Печатайте слово, чтобы стрелять',
      sidebarDecksHeader: 'МОИ КОЛОДЫ',
      lessonsDrawerSummary: '📋 Выбрать урок курса ▾',
      studyModeHeader: 'РЕЖИМ ОБУЧЕНИЯ',
      modeType: 'Печатать',
      modeListen: 'Слушать',
      modeTranslate: 'Переводить',
      studyModeBanner: (name) => `🎯 Режим обучения: ${name}`,
      sidebarWeaponsHeader: 'ОРУЖИЕ',
      sidebarGameSettings: 'Настройки игры',
      hitBanner: 'ПОПАДАНИЕ!',
      hitReadyBanner: 'ЦЕЛЬ В ПРИЦЕЛЕ',
      hitKnowBtn: 'Знаю',
      hitKnownToast: (w) => `✓ «${w}» отмечено как изученное!`,
      hitRepeatBtn: 'Повторить',
      hitPinnedBtn: 'В повторе ⭐',
      todayCaption: 'СЕГОДНЯ ВЫУЧЕНО',
      todayWordsVal: (n) => `${n} сл.`,
      gameSettingsTitle: '⚙️ Гибкие настройки игры',
      settingSpeed: 'Скорость падения слов:',
      settingArticle: 'Ввод артикля вместе со словом:',
      settingDesktopKbd: 'Экранная клавиатура ZType на ПК:',
      kbdShown: '⌨️ Показана',
      kbdHidden: '⌨️ Скрыта',
      settingVoiceStudio: 'Студия озвучки Gemini 3.8 TTS:',
      openVoiceBtn: '🎙️ Настроить голос',
      settingDictLabel: 'Полный словарь текущего курса:',
      openDictBtn: '📚 Открыть словарь',
      statsDialogTitle: '📊 Подробная статистика пилота',
      statTotalLearned: 'Всего выучено слов',
      statTodayLearned: 'Выучено сегодня',
      statBestScore: 'Рекорд очков',
      statBestStreak: 'Рекорд серии',
      statLessonsDone: 'Пройдено уроков',
      statAccuracy: 'Точность стрельбы',
      statUnlockedWeapons: 'Открыто пушек',
      statPinnedCount: 'Слов в повторе (⭐)',
      leaderboardDialogTitle: '🏆 Рейтинг недели и достижения',
      achievementsHeading: '🎖️ Достижения пилота',
      achFirstTen: { title: 'Первая десятка', desc: 'Выучить 10 иностранных слов' },
      achArsenalHalf: { title: 'Оружейник', desc: 'Выучить 35 слов и открыть Ракеты' },
      achTeslaMaster: { title: 'Повелитель молний', desc: 'Выучить 50 слов и открыть Теслу' },
      achCombo8: { title: 'Снайпер x8', desc: 'Набрать комбо x8 без единого промаха' },
      achLesson3: { title: 'Покоритель курса', desc: 'Пройти 3 урока до конца' },
      achAnkiDeck: { title: 'Своя колода', desc: 'Импортировать личный курс Anki' },

      legends: {
        de: ['der (м.р.)', 'die (ж.р.)', 'das (ср.р.)', 'Глаг./Пр.'],
        en: ['Noun (сущ.)', 'Adj. (прил.)', 'Verb (глаг.)', 'Adv./Пр.'],
        es: ['el (м.р.)', 'la (ж.р.)', 'Verbo (глаг.)', 'Adj./Пр.']
      },

      targetIdle: 'Нажимайте буквы, чтобы стрелять по словам...',
      lessonShort: (num, title) => `Ур.${num}: ${title}`,
      lessonBadgeBoss: '👹 БОСС-УРОК',
      lessonBadgeNum: (num) => `УРОК ${num}`,
      introBadge: (modTitle, num, total) => `${modTitle.toUpperCase()} · УРОК ${num} ИЗ ${total}`,
      wordsInLevelHeader: (n) => `📋 Слова этого урока (${n})`,
      learnedWordsHeader: (n) => `📋 Пройденные слова (${n})`,
      startLevelBtn: '🚀 В бой! Начать урок',
      retryBtn: '🔄 Ещё раз',
      tryAgainBtn: '🚀 Попробовать снова',
      resumeBtn: '▶ Продолжить урок',
      nextLevelBtn: (title) => `Дальше: ${title} ➔`,
      mistakesBtn: (n) => `🎯 Ошибки (${n})`,
      completeBadge: (maxCombo) => `🎉 УРОК ПРОЙДЕН! МАКС. КОМБО: x${maxCombo}`,
      completeTitle: (name) => `Отличная стрельба! «${name}» зачищен`,
      completeDesc: 'Все слова сбиты! Пройдите быстрый <strong>блиц из 3 вопросов</strong> или переходите к следующему короткому уроку!',
      quizHeader: '🧠 БЛИЦ: Выберите верный перевод!',
      quizDoneScore: (c, t) => `${c} / ${t} верно!`,
      quizDoneTitle: (c, t) => `✨ Блиц завершён! Результат: ${c} из ${t}`,
      gameOverBadge: '💥 ЩИТ КОРАБЛЯ ПРОБИТ',
      gameOverTitle: (name) => `Урок «${name}» не завершён`,
      gameOverDesc: (done, total) => `Сбито слов: <strong>${done} из ${total}</strong>. Длинные слова летят медленнее, а вы всегда можете включить скорость 0.25x или 0.5x!`,
      pauseBadge: '⏸ ИГРА НА ПАУЗЕ',
      pauseDesc: (done, total) => `Прогресс: <strong>${done} / ${total}</strong> слов. Смените оружие, выберите курс или продолжайте бой:`,
      dictTitle: (courseTitle, n) => `📚 Словарь: ${courseTitle} (${n} сл.)`,
      dictSearchPlaceholder: 'Поиск слова или перевода...',
      dictPinnedFilter: 'Отмеченные',
      layoutWarning: '⚠️ Переключите раскладку клавиатуры на латиницу!',

      // Каталог курсов и импорт Anki
      catalogTitle: '🗂️ Трёхступенчатый каталог курсов и уроков',
      tabAll: 'Все курсы',
      tabOfficial: '🏛️ От создателя',
      tabUser: '👤 Личные / Anki',
      importAnkiBtn: 'Загрузить Anki (.apkg)',
      deleteDeckBtn: '🗑️ Удалить',
      emptyUserCourses: 'У вас пока нет личных курсов для этого языка. Загрузите файл Anki (.apkg) или добавьте свой список слов!',
      bossMetaLabel: 'Повторение 3 уроков + ⭐',
      customTitle: '📦 Импорт Anki (.apkg) или своих слов',
      tabImportAnki: '📦 Файл Anki (.apkg / .tsv)',
      tabImportManual: '✍️ Вставить текстом',
      importLangLabel: 'Язык изучаемых слов:',
      ankiDropTitle: 'Перетащите файл .apkg сюда или нажмите для выбора',
      ankiDropSub: 'Поддерживаются колоды Anki 2.0 / 2.1 / 23.10+ (.apkg, .colpkg, .tsv, .csv, .txt)',
      sampleApkgBtn: '📥 Скачать тестовый .apkg (12 слов)',
      ankiDeckNameLabel: 'Название личного курса:',
      ankiFrontLabel: 'Изучаемое слово (летит):',
      ankiBackLabel: 'Перевод (при взрыве):',
      ankiConfirmBtn: (n) => `🚀 Импортировать (${n} карт.) и играть!`,
      ankiParsedOk: (n) => `✓ Прочитано карточек: ${n}`,
      customHint: 'Формат: <code>слово;перевод</code> (каждое с новой строки). Игра разобьёт список на уроки по 12 слов + Босс-урок!',
      customSaveBtn: 'Создать личный курс и играть 🚀',

      // Полноэкранная страница «Мои колоды» / «Курсы»
      decksFiltersTitle: 'Фильтры',
      decksLangHeader: 'Язык обучения',
      decksSourceHeader: 'Источник',
      decksSrcAll: 'Все',
      decksSrcOfficial: 'От создателя',
      decksSrcUser: 'Личные / Anki',
      decksCategoryHeader: 'Категория',
      decksAdminBtn: 'Супер-Админ',
      decksLevelHeader: 'Уровень',
      decksLevelAll: 'Все',
      decksSidebarProgTitle: 'Ваш прогресс',
      decksOfTotalDecks: (n) => `из ${n} колод`,
      decksInProgressSub: 'в процессе обучения',
      decksHeroTitleMy: 'Мои колоды',
      decksHeroTitleCourses: 'Курсы и колоды',
      decksHeroSub: 'Ваши личные курсы и импортированные Anki-колоды',
      decksSearchPlaceholder: 'Поиск по названию, описанию или словам...',
      decksImportAnkiBtn: 'Импорт Anki (.apkg)',
      decksCreateBtn: 'Создать колоду',
      decksStatTotal: 'Всего колод',
      decksStatLearned: 'Выучено слов',
      decksStatStreak: 'Текущая серия',
      decksViewGrid: 'Карточки',
      decksViewList: 'Список',
      decksReturnBattle: 'Вернуться в бой',
      decksContinueHeading: 'Продолжить обучение',
      decksAllHeading: 'Все колоды',
      decksContinueBtn: '▶ Продолжить',
      decksOpenBtn: '📖 Открыть',
      decksEditBtn: '✏️ Редактировать',
      decksCreatorBadge: '🏛️ ОТ СОЗДАТЕЛЯ',
      decksAnkiBadge: 'ANKI',
      decksCustomBadge: 'ЛИЧНАЯ',
      decksLessonsProgress: (done, total) => `${done} из ${total} уроков`,
      decksMetaWordsLessons: (words, done, total) => `${words} сл. · ${done} из ${total} уроков`,
      decksMiniLessonNum: (n) => `Ур. ${n}`,
      decksEmptyFiltered: 'По выбранным фильтрам колод не найдено. Сбросьте фильтр или загрузите файл Anki (.apkg)!',
      decksBackToAll: '← Назад ко всем колодам',
      decksAllSections: (n) => `Все разделы (${n})`,
      decksLessonsSectionTitle: (n) => `🎯 Уроки колоды (${n})`,
      decksWordsSectionTitle: (n) => `📖 Слова и переводы (${n})`,
      decksShowMoreWords: (rem) => `Показать ещё слова (осталось ${rem})`,
      decksEditorHeading: '✏️ Редактирование личной колоды',
      decksEditorTitleLabel: 'Название колоды:',
      decksEditorLevelLabel: 'Уровень (CEFR):',
      decksEditorAddLabel: 'Добавить новые слова (слово;перевод — каждое с новой строки):',
      decksEditorSaveBtn: '💾 Сохранить изменения',
      decksEditorCancelBtn: 'Отмена',
      decksBrokenRuWarn: '⚠️ Старый импорт без русских переводов: удалите эту колоду и загрузите .apkg заново — русский перевод подтянется автоматически!',
      decksBrokenRuDeleteBtn: '🗑️ Удалить старую',
      ankiAutoMappedBanner: (cardsCount, modelsCount, subdecksCount) => modelsCount > 1
        ? `✨ Авто-распознано ${modelsCount} типов карточек (${subdecksCount || 1} разд.) · русский перевод найден для ${cardsCount} сл.`
        : `✨ Поля слова и перевода определены автоматически (${cardsCount} сл.)`,
      ankiManualColsSummary: '⚙️ Настроить поля карточек вручную',
      ankiSaveToDecksBtn: '📁 Сохранить в «Мои колоды»',

      // Gemini 3.8 TTS
      ttsDialogTitle: '🎙️ Студия озвучки Gemini 3.8 TTS',
      ttsEnableLabel: 'Произношение слов при взрыве:',
      ttsOn: '🔊 Включено',
      ttsOff: '🔇 Выключено',
      ttsModelLabel: 'Языковая аудио-модель Gemini 3.8:',
      ttsModelFlashDesc: 'Максимальное студийное HD качество и живая дикция носителя',
      ttsModelLiteDesc: 'Сверхбыстрый отклик для скоростной печати',
      ttsVoiceLabel: 'Студийный голос:',
      ttsTestBtn: (sample) => `▶️ Прослушать голос («${sample}»)`,
      ttsTestingBtn: '⏳ Генерация аудио Gemini 3.8...',
      ttsApiKeySummary: '🔑 Настройка ключа GEMINI_API_KEY (Vercel / Браузер)',
      ttsApiKeyHint: 'На Vercel добавьте переменную <code>GEMINI_API_KEY</code> в настройках проекта — и все слова будут озвучиваться через серверный кэш <code>/api/tts</code>. Либо вставьте свой ключ ниже:',
      ttsStatusReadyServer: (model, voice) => `✨ Активен: ${model} · голос ${voice} (сервер Vercel)`,
      ttsStatusReadyLocal: (model, voice) => `✨ Активен: ${model} · голос ${voice} (локальный ключ API)`,
      ttsStatusFallback: '🔊 Активен встроенный системный голос браузера. Добавьте GEMINI_API_KEY для Gemini 3.8 TTS!',
      ttsStatusMuted: '🔇 Озвучка слов выключена'
    },

    en: {
      nativeFilterLabel: 'Interface / Trans:',
      targetFilterLabel: '🎯 I am learning:',
      titleTagline: (langName) => `Shoot ${langName} words letter by letter, learn translations on impact & unlock weapons!`,
      titleArsenalLabel: '⚔️ Arsenal Progression:',
      learnedPill: (done, nextGoal, nextWeapon) =>
        nextGoal ? `📖 Learned: ${done} / ${nextGoal} for ${nextWeapon}` : `📖 Learned: ${done} words (All weapons unlocked!)`,
      lockedWeaponHint: (icon, name, needMore, totalNeed) =>
        `🔒 Learn ${needMore} more words to unlock ${icon} ${name} (${totalNeed} needed)`,
      unlockedWeaponBanner: (icon, name) => `🎉 WEAPON UNLOCKED: ${icon} ${name}!`,
      lockTagShort: (n) => `🔒 ${n} w.`,

      originOfficial: '🏛️ OFFICIAL',
      originUserAnki: '👤 MY DECK · ANKI',
      originUserCustom: '👤 MY CUSTOM DECK',
      allCoursesBtn: 'All Courses',
      coursesHudBtn: 'Courses',
      launchLessonBtn: (num, title, count) => `🚀 Start Game · Lesson ${num}: ${title} (${count})`,
      launchBossBtn: (title) => `👹 Fight Boss! ${title}`,
      titleVoiceLink: '🎙️ AI Voice',
      titleDictLink: (n) => `Dictionary (${n})`,
      titleCustomLink: 'Anki / Custom',
      ranks: ['CADET', 'GALAXY PILOT', 'LINGO NAVIGATOR', 'LEXICON COMMANDER'],
      rankLine: (rank, learned, best) => `${rank} · 📖 ${learned} W. · BEST: ${best}`,
      overlayWeaponTitle: '⚔️ Ship Weapon:',
      backToMenuBtn: '🏠 Main Menu',
      weaponBanner: (icon, name) => `${icon} Weapon: ${name}`,
      speedBanner: (label) => `Word descent speed: ${label}`,
      gravitySurgeBanner: '🌀 GRAVITY WAVE: WORDS BLASTED TO THE TOP!',

      pause: 'Pause',
      score: 'Score',
      combo: 'Combo',
      learnedHud: 'Learned',
      shield: 'Shield',
      badgeMode: '🏷️ Badge',
      articleMode: '🏷️ Type Article',
      customBtn: 'Anki',
      wordsCount: (n) => `${n} words`,
      wordsShort: (n) => `${n} w.`,
      sidebarKills: 'Recent words:',
      killFeedEmpty: 'Shoot falling words!<br><br>Click <strong>☆</strong> ("Repeat again") next to unfamiliar words so the game mixes them into upcoming rounds more often.',
      pinTooltip: 'Repeat again (boost frequency in upcoming rounds)',
      pinAddedBanner: (w) => `⭐ "${w}" pinned for extra review!`,
      pinRemovedBanner: (w) => `☆ "${w}" unpinned`,
      drillPinnedBtn: (n) => `⭐ Practice Pinned (${n})`,
      pinnedRoundTitle: '⭐ Pinned Words Drill',

      // Z-LINGO 2.0: Home Dashboard & Space Language Academy
      homeBrandSub: 'Play · Learn · Remember',
      navHome: 'Home',
      navPlay: 'Play',
      navCourses: 'Courses',
      navDecks: 'My Decks',
      navStats: 'Stats',
      navLeaderboard: 'Leaderboard',
      navAdmin: 'Admin',
      streakDays: (n) => `${n}d`,
      heroTitleTop: 'Learn Foreign Languages',
      heroTitleAccent: 'Through Space Action!',
      launchFreeBtn: 'Start Playing Free',
      perkPlay: 'Game & Practice',
      perkMemory: 'Active Recall',
      perkAnki: 'Your Anki Decks',
      step1: 'Choose language & level',
      step2: 'Play built-in courses or upload Anki',
      step3: 'Shoot words, learn & upgrade your arsenal!',
      chooseLangTitle: 'Choose Language',
      quickStartTitle: 'Quick Start',
      quickAnkiBtn: 'Import Anki',
      quickAnkiCardTitle: 'Import Your Anki Deck (.apkg)',
      homeProgressTitle: 'Your Progress',
      metricLearned: 'Words Learned',
      metricDecks: 'Decks',
      metricStreak: 'Best Streak',
      homeTopTitle: 'Top Pilots (Week)',
      seeAllTop: 'All',
      youPilotLabel: 'You (Pilot)',
      featCourses: 'Thematic Built-in Courses',
      featAnki: 'Anki Deck Import (.apkg)',
      featSpeed: (lbl) => `Speed: ${lbl}`,
      featVoice: 'Gemini 3.8 AI Voice',
      promoMonitorBadge: (num, title) => `LESSON ${num} · ${title}`,
      academySub: 'SPACE LANGUAGE ACADEMY',
      nativeLangNames: { ru: 'Russian', en: 'English', he: 'Hebrew' },
      arenaWaveLabel: (lessonNum, waveNum) => `LESSON ${lessonNum} · WAVE ${String(waveNum).padStart(2, '0')}`,
      desktopPromptIdle: '⌨️ Type any word to fire lasers',
      sidebarDecksHeader: 'MY DECKS',
      lessonsDrawerSummary: '📋 Choose Course Lesson ▾',
      studyModeHeader: 'STUDY MODE',
      modeType: 'Type',
      modeListen: 'Listen',
      modeTranslate: 'Translate',
      studyModeBanner: (name) => `🎯 Study Mode: ${name}`,
      sidebarWeaponsHeader: 'ARSENAL',
      sidebarGameSettings: 'Game Settings',
      hitBanner: 'DIRECT HIT!',
      hitReadyBanner: 'TARGET LOCKED',
      hitKnowBtn: 'I Know',
      hitKnownToast: (w) => `✓ "${w}" marked as mastered!`,
      hitRepeatBtn: 'Repeat',
      hitPinnedBtn: 'Pinned ⭐',
      todayCaption: 'LEARNED TODAY',
      todayWordsVal: (n) => `${n} words`,
      gameSettingsTitle: '⚙️ Game Settings',
      settingSpeed: 'Word Descent Speed:',
      settingArticle: 'Type article with word (der/die/el):',
      settingDesktopKbd: 'On-Screen ZType Keyboard on Desktop:',
      kbdShown: '⌨️ Visible',
      kbdHidden: '⌨️ Hidden',
      settingVoiceStudio: 'Gemini 3.8 TTS Voice Studio:',
      openVoiceBtn: '🎙️ Voice Studio',
      settingDictLabel: 'Current Course Dictionary:',
      openDictBtn: '📚 Open Dictionary',
      statsDialogTitle: '📊 Pilot Statistics',
      statTotalLearned: 'Total Words Learned',
      statTodayLearned: 'Learned Today',
      statBestScore: 'High Score',
      statBestStreak: 'Best Daily Streak',
      statLessonsDone: 'Lessons Cleared',
      statAccuracy: 'Typing Accuracy',
      statUnlockedWeapons: 'Weapons Unlocked',
      statPinnedCount: 'Pinned Review Words (⭐)',
      leaderboardDialogTitle: '🏆 Weekly Leaderboard & Achievements',
      achievementsHeading: '🎖️ Pilot Achievements',
      achFirstTen: { title: 'First Ten', desc: 'Learn 10 foreign words' },
      achArsenalHalf: { title: 'Weaponsmith', desc: 'Learn 35 words & unlock Missiles' },
      achTeslaMaster: { title: 'Lightning Lord', desc: 'Learn 50 words & unlock Tesla Coil' },
      achCombo8: { title: 'Sniper x8', desc: 'Reach an x8 combo without missing' },
      achLesson3: { title: 'Course Explorer', desc: 'Complete 3 lessons' },
      achAnkiDeck: { title: 'Custom Commander', desc: 'Import a personal Anki deck' },

      legends: {
        de: ['der (masc.)', 'die (fem.)', 'das (neut.)', 'Verb/Other'],
        en: ['Noun', 'Adjective', 'Verb', 'Adv./Other'],
        es: ['el (masc.)', 'la (fem.)', 'Verbo', 'Adj./Other']
      },

      targetIdle: 'Type or tap letters to shoot incoming words...',
      lessonShort: (num, title) => `L${num}: ${title}`,
      lessonBadgeBoss: '👹 BOSS REVIEW',
      lessonBadgeNum: (num) => `LESSON ${num}`,
      introBadge: (modTitle, num, total) => `${modTitle.toUpperCase()} · LESSON ${num} OF ${total}`,
      wordsInLevelHeader: (n) => `📋 Preview lesson words (${n})`,
      learnedWordsHeader: (n) => `📋 Cleared words (${n})`,
      startLevelBtn: '🚀 Launch Lesson!',
      retryBtn: '🔄 Replay',
      tryAgainBtn: '🚀 Try Again',
      resumeBtn: '▶ Resume Lesson',
      nextLevelBtn: (title) => `Next: ${title} ➔`,
      mistakesBtn: (n) => `🎯 Mistakes (${n})`,
      completeBadge: (maxCombo) => `🎉 LESSON CLEARED! MAX COMBO: x${maxCombo}`,
      completeTitle: (name) => `Great shooting! "${name}" cleared`,
      completeDesc: 'All words destroyed! Take a quick <strong>3-question blitz</strong> or jump into the next short lesson!',
      quizHeader: '🧠 BLITZ: Pick the right translation!',
      quizDoneScore: (c, t) => `${c} / ${t} correct!`,
      quizDoneTitle: (c, t) => `✨ Blitz complete! Score: ${c} of ${t}`,
      gameOverBadge: '💥 SHIP SHIELD BREACHED',
      gameOverTitle: (name) => `Lesson "${name}" incomplete`,
      gameOverDesc: (done, total) => `Words cleared: <strong>${done} of ${total}</strong>. Long compound words auto-slow down, and you can switch speed to 0.25x or 0.5x anytime!`,
      pauseBadge: '⏸ GAME PAUSED',
      pauseDesc: (done, total) => `Progress: <strong>${done} / ${total}</strong> words. Switch weapon, browse courses or resume:`,
      dictTitle: (courseTitle, n) => `📚 Dictionary: ${courseTitle} (${n} words)`,
      dictSearchPlaceholder: 'Search word or translation...',
      dictPinnedFilter: 'Pinned',
      layoutWarning: '⚠️ Switch keyboard layout to Latin characters!',

      catalogTitle: '🗂️ 3-Tier Courses, Modules & Short Lessons',
      tabAll: 'All Courses',
      tabOfficial: '🏛️ Official',
      tabUser: '👤 My Decks / Anki',
      importAnkiBtn: 'Import Anki (.apkg)',
      deleteDeckBtn: '🗑️ Delete',
      emptyUserCourses: 'No personal decks for this language yet. Upload an Anki .apkg file or paste your own words!',
      bossMetaLabel: 'Mixes last 3 lessons + ⭐',
      customTitle: '📦 Import Anki Deck (.apkg) or Custom Words',
      tabImportAnki: '📦 Anki File (.apkg / .tsv)',
      tabImportManual: '✍️ Paste Text List',
      importLangLabel: 'Target language in deck:',
      ankiDropTitle: 'Drop an .apkg file here or click to browse',
      ankiDropSub: 'Supports Anki 2.0 / 2.1 / 23.10+ (.apkg, .colpkg, .tsv, .csv, .txt)',
      sampleApkgBtn: '📥 Download sample .apkg (12 words)',
      ankiDeckNameLabel: 'Personal course title:',
      ankiFrontLabel: 'Target word (falling):',
      ankiBackLabel: 'Translation (on explosion):',
      ankiConfirmBtn: (n) => `🚀 Import (${n} cards) & Play!`,
      ankiParsedOk: (n) => `✓ Parsed ${n} cards`,
      customHint: 'Format: <code>word;translation</code> (one per line). Automatically split into 12-word lessons + Boss Review!',
      customSaveBtn: 'Create Personal Course & Play 🚀',

      decksFiltersTitle: 'Filters',
      decksLangHeader: 'Target language',
      decksSourceHeader: 'Source',
      decksSrcAll: 'All',
      decksSrcOfficial: 'Official',
      decksSrcUser: 'My Decks / Anki',
      decksCategoryHeader: 'Category',
      decksAdminBtn: 'Super Admin',
      decksLevelHeader: 'Level',
      decksLevelAll: 'All',
      decksSidebarProgTitle: 'Your Progress',
      decksOfTotalDecks: (n) => `of ${n} decks`,
      decksInProgressSub: 'currently in progress',
      decksHeroTitleMy: 'My Decks',
      decksHeroTitleCourses: 'Courses & Decks',
      decksHeroSub: 'Your personal courses, official packs & imported Anki decks',
      decksSearchPlaceholder: 'Search by title, description or words...',
      decksImportAnkiBtn: 'Import Anki (.apkg)',
      decksCreateBtn: 'Create Deck',
      decksStatTotal: 'Total decks',
      decksStatLearned: 'Words learned',
      decksStatStreak: 'Current streak',
      decksViewGrid: 'Cards',
      decksViewList: 'List',
      decksReturnBattle: 'Back to Battle',
      decksContinueHeading: 'Continue Learning',
      decksAllHeading: 'All Decks',
      decksContinueBtn: '▶ Continue',
      decksOpenBtn: '📖 Open',
      decksEditBtn: '✏️ Edit',
      decksCreatorBadge: '🏛️ OFFICIAL',
      decksAnkiBadge: 'ANKI',
      decksCustomBadge: 'CUSTOM',
      decksLessonsProgress: (done, total) => `${done} of ${total} lessons`,
      decksMetaWordsLessons: (words, done, total) => `${words} wds · ${done} of ${total} lessons`,
      decksMiniLessonNum: (n) => `Ls. ${n}`,
      decksEmptyFiltered: 'No decks match your filters. Reset filters or import an Anki (.apkg) file!',
      decksBackToAll: '← Back to all decks',
      decksAllSections: (n) => `All sections (${n})`,
      decksLessonsSectionTitle: (n) => `🎯 Deck Lessons (${n})`,
      decksWordsSectionTitle: (n) => `📖 Words & Translations (${n})`,
      decksShowMoreWords: (rem) => `Show more words (${rem} remaining)`,
      decksEditorHeading: '✏️ Edit Personal Deck',
      decksEditorTitleLabel: 'Deck title:',
      decksEditorLevelLabel: 'Level (CEFR):',
      decksEditorAddLabel: 'Append new words (word;translation — one per line):',
      decksEditorSaveBtn: '💾 Save Changes',
      decksEditorCancelBtn: 'Cancel',
      decksBrokenRuWarn: '⚠️ Legacy import missing translations: remove this deck and re-upload your .apkg file to auto-extract translations!',
      decksBrokenRuDeleteBtn: '🗑️ Remove Old',
      ankiAutoMappedBanner: (cardsCount, modelsCount, subdecksCount) => modelsCount > 1
        ? `✨ Auto-detected ${modelsCount} note types (${subdecksCount || 1} sections) · translations extracted for ${cardsCount} words`
        : `✨ Word & translation columns auto-detected (${cardsCount} words)`,
      ankiManualColsSummary: '⚙️ Customize card columns manually',
      ankiSaveToDecksBtn: '📁 Save to My Decks',

      ttsDialogTitle: '🎙️ Gemini 3.8 TTS Voice Studio',
      ttsEnableLabel: 'Pronounce words on explosion:',
      ttsOn: '🔊 Enabled',
      ttsOff: '🔇 Muted',
      ttsModelLabel: 'Gemini 3.8 Audio Model:',
      ttsModelFlashDesc: 'Studio HD quality & natural native intonation',
      ttsModelLiteDesc: 'Ultra-low latency for rapid typing',
      ttsVoiceLabel: 'Studio Voice:',
      ttsTestBtn: (sample) => `▶️ Test Voice ("${sample}")`,
      ttsTestingBtn: '⏳ Generating Gemini 3.8 audio...',
      ttsApiKeySummary: '🔑 Configure GEMINI_API_KEY (Vercel / Browser)',
      ttsApiKeyHint: 'Add <code>GEMINI_API_KEY</code> in Vercel project settings for automatic server-cached TTS via <code>/api/tts</code>, or paste a local browser key below:',
      ttsStatusReadyServer: (model, voice) => `✨ Active: ${model} · voice ${voice} (Vercel server)`,
      ttsStatusReadyLocal: (model, voice) => `✨ Active: ${model} · voice ${voice} (Local API key)`,
      ttsStatusFallback: '🔊 Using built-in browser voice. Add GEMINI_API_KEY for studio Gemini 3.8 TTS!',
      ttsStatusMuted: '🔇 Word pronunciation is muted'
    },

    he: {
      nativeFilterLabel: 'תרגום / ממשק:',
      targetFilterLabel: '🎯 אני לומד:',
      titleTagline: (langName) => `פוצצו מילים ב${langName} אות אחר אות, זכרו את התרגום בפיצוץ ופתחו נשקים חדשים!`,
      titleArsenalLabel: '⚔️ שדרוג נשקים ממילים:',
      learnedPill: (done, nextGoal, nextWeapon) =>
        nextGoal ? `📖 נלמדו: ${done} / ${nextGoal} ל-«${nextWeapon}»` : `📖 נלמדו: ${done} מילים (כל הנשקים פתוחים!)`,
      lockedWeaponHint: (icon, name, needMore, totalNeed) =>
        `🔒 למדו עוד ${needMore} מילים כדי לפתוח את ${icon} ${name} (נדרש ${totalNeed})`,
      unlockedWeaponBanner: (icon, name) => `🎉 נשק חדש נפתח: ${icon} ${name}!`,
      lockTagShort: (n) => `🔒 ${n} מיל׳`,

      originOfficial: '🏛️ רשמי מהאתר',
      originUserAnki: '👤 אישי · ANKI',
      originUserCustom: '👤 קורס אישי',
      allCoursesBtn: 'כל הקורסים',
      coursesHudBtn: 'קורסים',
      launchLessonBtn: (num, title, count) => `🚀 התחל משחק · שלב ${num}: ${title} (${count})`,
      launchBossBtn: (title) => `👹 לקרב בוס! ${title}`,
      titleVoiceLink: '🎙️ קריינות AI',
      titleDictLink: (n) => `מילון (${n})`,
      titleCustomLink: 'Anki / מילים משלך',
      ranks: ['צוער חלל', 'טייס גלקטי', 'נווט שפות', 'מפקד המילון'],
      rankLine: (rank, learned, best) => `${rank} · 📖 ${learned} מיל׳ · שיא: ${best}`,
      overlayWeaponTitle: '⚔️ נשק החללית:',
      backToMenuBtn: '🏠 מסך ראשי',
      weaponBanner: (icon, name) => `${icon} נשק: ${name}`,
      speedBanner: (label) => `מהירות ירידת המילים: ${label}`,
      gravitySurgeBanner: '🌀 גל כבידה: המילים נהדפו לתחילת המסך!',

      pause: 'הפסקה',
      score: 'ניקוד',
      combo: 'רצף',
      learnedHud: 'נלמדו',
      shield: 'מגן',
      badgeMode: '🏷️ תגית',
      articleMode: '🏷️ עם תווית',
      customBtn: 'Anki',
      wordsCount: (n) => `${n} מילים`,
      wordsShort: (n) => `${n} מיל׳`,
      sidebarKills: 'מילים אחרונות:',
      killFeedEmpty: 'פוצצו את המילים המעופפות!<br><br>לחצו על <strong>☆</strong> ליד מילה קשה כדי לשמור אותה ולתרגל אותה בתדירות גבוהה יותר בסיבובים הבאים.',
      pinTooltip: 'חזור שוב (יופיע יותר בסיבובים הבאים)',
      pinAddedBanner: (w) => `⭐ «${w}» נשמר לחזרה!`,
      pinRemovedBanner: (w) => `☆ «${w}» הוסר מרשימת החזרה`,
      drillPinnedBtn: (n) => `⭐ תרגול מסומנות (${n})`,
      pinnedRoundTitle: '⭐ תרגול מילים מסומנות בכוכב',

      // Z-LINGO 2.0: מסך ראשי והאקדמיה החללית
      homeBrandSub: 'שחק · למד · זכור',
      navHome: 'ראשי',
      navPlay: 'שחק',
      navCourses: 'קורסים',
      navDecks: 'החפיסות שלי',
      navStats: 'סטטיסטיקה',
      navLeaderboard: 'דירוג',
      navAdmin: 'אדמין',
      streakDays: (n) => `${n} ימים`,
      heroTitleTop: 'למדו שפות זרות',
      heroTitleAccent: 'בפורמט של משחק חלל!',
      launchFreeBtn: 'התחל משחק בחינם',
      perkPlay: 'משחק ותרגול',
      perkMemory: 'שינון יעיל ומהיר',
      perkAnki: 'חפיסות משלך (Anki)',
      step1: 'בחרו שפה ורמה',
      step2: 'שחקו בקורסים מוכנים או העלו Anki',
      step3: 'ירו במילים, למדו ושדרגו את הנשקייה!',
      chooseLangTitle: 'בחרו שפה',
      quickStartTitle: 'התחלה מהירה',
      quickAnkiBtn: 'ייבוא Anki',
      quickAnkiCardTitle: 'ייבוא חפיסת Anki משלך (.apkg)',
      homeProgressTitle: 'ההתקדמות שלך',
      metricLearned: 'מילים שנלמדו',
      metricDecks: 'חפיסות',
      metricStreak: 'שיא רצף',
      homeTopTitle: 'טייסים מובילים (השבוע)',
      seeAllTop: 'הכל',
      youPilotLabel: 'את/ה (טייס)',
      featCourses: 'קורסים מובנים לפי נושא',
      featAnki: 'ייבוא חפיסות Anki (.apkg)',
      featSpeed: (lbl) => `מהירות: ${lbl}`,
      featVoice: 'קריינות Gemini 3.8 AI',
      promoMonitorBadge: (num, title) => `שלב ${num} · ${title}`,
      academySub: 'האקדמיה החללית לשפות',
      nativeLangNames: { ru: 'רוסית', en: 'אנגלית', he: 'עברית' },
      arenaWaveLabel: (lessonNum, waveNum) => `שלב ${lessonNum} · גל ${String(waveNum).padStart(2, '0')}`,
      desktopPromptIdle: '⌨️ הקלידו מילה באותיות לטיניות כדי לירות',
      sidebarDecksHeader: 'החפיסות שלי',
      lessonsDrawerSummary: '📋 בחר שלב בקורס ▾',
      studyModeHeader: 'מצב למידה',
      modeType: 'הקלדה',
      modeListen: 'שמיעה',
      modeTranslate: 'תרגום',
      studyModeBanner: (name) => `🎯 מצב למידה: ${name}`,
      sidebarWeaponsHeader: 'נשקייה',
      sidebarGameSettings: 'הגדרות משחק',
      hitBanner: 'פגיעה מדויקת!',
      hitReadyBanner: 'מטרה נעולה',
      hitKnowBtn: 'יודע/ת',
      hitKnownToast: (w) => `✓ «${w}» סומן כידוע!`,
      hitRepeatBtn: 'לחזור שוב',
      hitPinnedBtn: 'בחזרה ⭐',
      todayCaption: 'נלמדו היום',
      todayWordsVal: (n) => `${n} מילים`,
      gameSettingsTitle: '⚙️ הגדרות משחק',
      settingSpeed: 'מהירות ירידת המילים:',
      settingArticle: 'הקלדת תווית/יידוע עם המילה:',
      settingDesktopKbd: 'מקלדת מסך ZType במחשב:',
      kbdShown: '⌨️ מוצגת',
      kbdHidden: '⌨️ מוסתרת',
      settingVoiceStudio: 'אולפן קריינות Gemini 3.8 TTS:',
      openVoiceBtn: '🎙️ הגדרת קול',
      settingDictLabel: 'מילון מלא של הקורס:',
      openDictBtn: '📚 פתח מילון',
      statsDialogTitle: '📊 סטטיסטיקה מפורטת',
      statTotalLearned: 'סה״כ מילים שנלמדו',
      statTodayLearned: 'נלמדו היום',
      statBestScore: 'שיא ניקוד',
      statBestStreak: 'שיא רצף ימים',
      statLessonsDone: 'שלבים שהושלמו',
      statAccuracy: 'דיוק הקלדה',
      statUnlockedWeapons: 'נשקים שנפתחו',
      statPinnedCount: 'מילים לחזרה (⭐)',
      leaderboardDialogTitle: '🏆 דירוג שבועי והישגים',
      achievementsHeading: '🎖️ הישגי הטייס',
      achFirstTen: { title: 'עשירייה ראשונה', desc: 'לימוד 10 מילים זרות' },
      achArsenalHalf: { title: 'מומחה נשק', desc: 'לימוד 35 מילים ופתיחת טילים' },
      achTeslaMaster: { title: 'אדון הברקים', desc: 'לימוד 50 מילים ופתיחת טסלה' },
      achCombo8: { title: 'צלף x8', desc: 'הגעה לרצף x8 ללא החטאה' },
      achLesson3: { title: 'כובש קורסים', desc: 'השלמת 3 שלבים במלואם' },
      achAnkiDeck: { title: 'מפקד אישי', desc: 'ייבוא חפיסת Anki משלך' },

      legends: {
        de: ['der (זכר)', 'die (נקבה)', 'das (נייטרלי)', 'פועל/אחר'],
        en: ['Noun (שם עצם)', 'Adj. (תואר)', 'Verb (פועל)', 'אחר'],
        es: ['el (זכר)', 'la (נקבה)', 'Verbo (פועל)', 'תואר/אחר']
      },

      targetIdle: 'הקישו על האותיות כדי לירות במילים...',
      lessonShort: (num, title) => `שלב ${num}: ${title}`,
      lessonBadgeBoss: '👹 שלב בוס',
      lessonBadgeNum: (num) => `שלב ${num}`,
      introBadge: (modTitle, num, total) => `${modTitle} · שלב ${num} מתוך ${total}`,
      wordsInLevelHeader: (n) => `📋 הצג מילים בשלב זה (${n})`,
      learnedWordsHeader: (n) => `📋 מילים שנלמדו (${n})`,
      startLevelBtn: '🚀 לקרב! התחל שלב',
      retryBtn: '🔄 שחק שוב',
      tryAgainBtn: '🚀 נסה שוב',
      resumeBtn: '▶ המשך בשלב',
      nextLevelBtn: (title) => `הבא: ${title} ➔`,
      mistakesBtn: (n) => `🎯 טעויות (${n})`,
      completeBadge: (maxCombo) => `🎉 השלב הושלם! רצף שיא: x${maxCombo}`,
      completeTitle: (name) => `ירייה מעולה! «${name}» הושלם`,
      completeDesc: 'פוצצתם את כל המילים! ענו על <strong>חידון בזק של 3 שאלות</strong> או המשיכו לשלב הקצר הבא!',
      quizHeader: '🧠 חידון בזק: בחרו את התרגום הנכון!',
      quizDoneScore: (c, t) => `${c} / ${t} נכון!`,
      quizDoneTitle: (c, t) => `✨ החידון הסתיים! תוצאה: ${c} מתוך ${t}`,
      gameOverBadge: '💥 מגן החללית נפרץ',
      gameOverTitle: (name) => `השלב «${name}» לא הושלם`,
      gameOverDesc: (done, total) => `מילים שפוצצו: <strong>${done} מתוך ${total}</strong>. מילים ארוכות מאטות אוטומטית, וניתן לבחור מהירות 0.25x או 0.5x!`,
      pauseBadge: '⏸ המשחק בהפסקה',
      pauseDesc: (done, total) => `התקדמות: <strong>${done} / ${total}</strong> מילים. החליפו נשק, בחרו קורס או המשיכו:`,
      dictTitle: (courseTitle, n) => `📚 מילון: ${courseTitle} (${n} מילים)`,
      dictSearchPlaceholder: 'חיפוש מילה או תרגום...',
      dictPinnedFilter: 'מסומנות ב-⭐',
      layoutWarning: '⚠️ החליפו מקלדת לאותיות לטיניות!',

      catalogTitle: '🗂️ קטלוג קורסים, מודולים ושלבים',
      tabAll: 'הכל',
      tabOfficial: '🏛️ רשמי מהאתר',
      tabUser: '👤 אישי / Anki',
      importAnkiBtn: 'ייבוא Anki (.apkg)',
      deleteDeckBtn: '🗑️ מחק',
      emptyUserCourses: 'עדיין אין קורסים אישיים בשפה זו. העלו קובץ Anki (.apkg) או הדביקו רשימת מילים משלכם!',
      bossMetaLabel: 'חזרה על 3 שלבים + ⭐',
      customTitle: '📦 ייבוא חפיסת Anki (.apkg) או מילים משלך',
      tabImportAnki: '📦 קובץ Anki (.apkg / .tsv)',
      tabImportManual: '✍️ הדבקת טקסט',
      importLangLabel: 'שפת הלימוד בחפיסה:',
      ankiDropTitle: 'גררו קובץ .apkg לכאן או לחצו לבחירה',
      ankiDropSub: 'תומך ב-Anki 2.0 / 2.1 / 23.10+ (.apkg, .colpkg, .tsv, .csv, .txt)',
      sampleApkgBtn: '📥 הורד קובץ .apkg לדוגמה (12 מילים)',
      ankiDeckNameLabel: 'שם הקורס האישי:',
      ankiFrontLabel: 'מילה ללימוד (בחלל):',
      ankiBackLabel: 'תרגום (בפיצוץ):',
      ankiConfirmBtn: (n) => `🚀 ייבא (${n} כרטיסים) ושחק!`,
      ankiParsedOk: (n) => `✓ נקראו ${n} כרטיסים`,
      customHint: 'פורמט: <code>מילה;תרגום</code> (כל מילה בשורה חדשה). המשחק יחלק אוטומטית לשלבים קצרים של 12 מילים + שלב בוס!',
      customSaveBtn: 'צור קורס אישי ושחק 🚀',

      decksFiltersTitle: 'מסננים',
      decksLangHeader: 'שפת לימוד',
      decksSourceHeader: 'מקור',
      decksSrcAll: 'הכל',
      decksSrcOfficial: 'מהיוצר',
      decksSrcUser: 'אישי / Anki',
      decksCategoryHeader: 'קטגוריה',
      decksAdminBtn: 'סופר-אדמין',
      decksLevelHeader: 'רמה',
      decksLevelAll: 'הכל',
      decksSidebarProgTitle: 'ההתקדמות שלך',
      decksOfTotalDecks: (n) => `מתוך ${n} חפיסות`,
      decksInProgressSub: 'בתהליך למידה',
      decksHeroTitleMy: 'החפיסות שלי',
      decksHeroTitleCourses: 'קורסים וחפיסות',
      decksHeroSub: 'הקורסים האישיים שלך וחפיסות Anki שיובאו',
      decksSearchPlaceholder: 'חיפוש לפי שם, תיאור או מילים...',
      decksImportAnkiBtn: 'ייבוא Anki (.apkg)',
      decksCreateBtn: 'צור חפיסה',
      decksStatTotal: 'סה״כ חפיסות',
      decksStatLearned: 'מילים שנלמדו',
      decksStatStreak: 'רצף נוכחי',
      decksViewGrid: 'כרטיסים',
      decksViewList: 'רשימה',
      decksReturnBattle: 'חזרה לקרב',
      decksContinueHeading: 'המשך למידה',
      decksAllHeading: 'כל החפיסות',
      decksContinueBtn: '▶ המשך',
      decksOpenBtn: '📖 פתח',
      decksEditBtn: '✏️ ערוך',
      decksCreatorBadge: '🏛️ מהיוצר',
      decksAnkiBadge: 'ANKI',
      decksCustomBadge: 'אישית',
      decksLessonsProgress: (done, total) => `${done} מתוך ${total} שלבים`,
      decksMetaWordsLessons: (words, done, total) => `${words} מ׳ · ${done} מתוך ${total} שלבים`,
      decksMiniLessonNum: (n) => `שלב ${n}`,
      decksEmptyFiltered: 'לא נמצאו חפיסות לפי הסינון שנבחר. אפסו סינון או העלו קובץ Anki (.apkg)!',
      decksBackToAll: '← חזרה לכל החפיסות',
      decksAllSections: (n) => `כל הפרקים (${n})`,
      decksLessonsSectionTitle: (n) => `🎯 שלבי החפיסה (${n})`,
      decksWordsSectionTitle: (n) => `📖 מילים ותרגומים (${n})`,
      decksShowMoreWords: (rem) => `הצג עוד מילים (נותרו ${rem})`,
      decksEditorHeading: '✏️ עריכת חפיסה אישית',
      decksEditorTitleLabel: 'שם החפיסה:',
      decksEditorLevelLabel: 'רמה (CEFR):',
      decksEditorAddLabel: 'הוסף מילים חדשות (מילה;תרגום — כל מילה בשורה חדשה):',
      decksEditorSaveBtn: '💾 שמור שינויים',
      decksEditorCancelBtn: 'ביטול',
      decksBrokenRuWarn: '⚠️ ייבוא ישן ללא תרגומים: מחקו חפיסה זו והעלו מחדש את קובץ ה-.apkg!',
      decksBrokenRuDeleteBtn: '🗑️ מחק ישנה',
      ankiAutoMappedBanner: (cardsCount, modelsCount, subdecksCount) => modelsCount > 1
        ? `✨ זוהו אוטומטית ${modelsCount} סוגי כרטיסים (${subdecksCount || 1} פרקים) · תרגומים חולצו עבור ${cardsCount} מילים`
        : `✨ שדות המילה והתרגום זוהו אוטומטית (${cardsCount} מילים)`,
      ankiManualColsSummary: '⚙️ הגדרת עמודות כרטיס ידנית',
      ankiSaveToDecksBtn: '📁 שמור ב״החפיסות שלי״',

      ttsDialogTitle: '🎙️ אולפן קריינות Gemini 3.8 TTS',
      ttsEnableLabel: 'הגיית מילים בעת פיצוץ:',
      ttsOn: '🔊 מופעל',
      ttsOff: '🔇 מושתק',
      ttsModelLabel: 'מודל קול Gemini 3.8:',
      ttsModelFlashDesc: 'איכות אולפן HD מקסימלית והגייה טבעית',
      ttsModelLiteDesc: 'תגובה מהירה במיוחד להקלדה מהירה',
      ttsVoiceLabel: 'קול אולפן:',
      ttsTestBtn: (sample) => `▶️ בדיקת קול («${sample}»)`,
      ttsTestingBtn: '⏳ מפיק אודיו ב-Gemini 3.8...',
      ttsApiKeySummary: '🔑 הגדרת מפתח GEMINI_API_KEY (ב-Vercel או בדפדפן)',
      ttsApiKeyHint: 'ב-Vercel מומלץ להוסיף משתנה סביבה <code>GEMINI_API_KEY</code> בהגדרות הפרויקט — או להדביק מפתח אישי למטה:',
      ttsStatusReadyServer: (model, voice) => `✨ פעיל: ${model} · קול ${voice} (שרת Vercel)`,
      ttsStatusReadyLocal: (model, voice) => `✨ פעיל: ${model} · קול ${voice} (מפתח מקומי)`,
      ttsStatusFallback: '🔊 פעיל קול מובנה של הדפדפן. הוסיפו GEMINI_API_KEY להפעלת Gemini 3.8 TTS!',
      ttsStatusMuted: '🔇 הקראת המילים כבויה'
    }
  };

  // --- Сохранение прогресса, выученных слов и слов со звёздочкой (localStorage) ---
  const STORAGE_KEY = 'zdeutsch_save_v2';
  const PINNED_STORAGE_KEY = 'zlingo_pinned_words_v1';
  const LEARNED_STORAGE_KEY = 'zlingo_learned_words_v1';
  const DAILY_PROGRESS_KEY = 'zlingo_daily_progress_v1';
  const KEY_STORAGE_NAME = 'zdeutsch_gemini_api_key';

  function getLocalIsoDateString(dateObj = new Date()) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function loadJsonStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function saveJsonStorage(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (_) {}
  }

  function loadSavedSettings() {
    return loadJsonStorage(STORAGE_KEY, {});
  }

  function saveSettingsPatch(patch) {
    const prev = loadSavedSettings();
    saveJsonStorage(STORAGE_KEY, { ...prev, ...patch });
  }

  // Авто-определение языка интерфейса и перевода по navigator.language при первом входе!
  function detectBrowserNativeLanguage() {
    const candidates = Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language || 'en'];
    for (const rawTag of candidates) {
      const tag = String(rawTag || '').toLowerCase();
      if (/^(ru|uk|be|kk)/.test(tag)) return 'ru';
      if (/^(he|iw)/.test(tag)) return 'he';
      if (/^en/.test(tag)) return 'en';
    }
    const primary = String(candidates[0] || '').toLowerCase();
    if (/^(ru|uk|be|kk)/.test(primary)) return 'ru';
    if (/^(he|iw)/.test(primary)) return 'he';
    return 'en';
  }

  function detectDefaultTargetLanguage() {
    const primary = String(navigator.language || '').toLowerCase();
    // Если браузер немецкий — по умолчанию предложим учить английский, иначе немецкий (с 1-клик переключателем над кнопкой старта)
    if (primary.startsWith('de')) return 'en';
    return 'de';
  }

  // ==========================================================================
  // МНОГОСЛОЙНЫЙ СИНТЕЗАТОР ЗВУКА (SoundEngine 2.0 + Фанфара открытия оружия)
  // ==========================================================================
  const SYNTH_SCALE_HZ = [
    293.66, 349.23, 392.00, 440.00, 523.25,
    587.33, 698.46, 783.99, 880.00, 1046.50
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

    _playTactileClick(now, dest, freq = 2100, vol = 0.06) {
      if (!this.noiseBuffer || !dest) return;
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
      } else if (weaponId === 'gravity') {
        this._playTactileClick(now, dest, 1650, 0.06);
        const lift = this.ctx.createOscillator();
        const liftGain = this.ctx.createGain();
        lift.type = 'sine';
        lift.frequency.setValueAtTime(92, now);
        lift.frequency.exponentialRampToValueAtTime(285 + letterStep * 0.9, now + 0.14);
        liftGain.gain.setValueAtTime(0.15, now);
        liftGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        lift.connect(liftGain);
        liftGain.connect(dest);
        lift.start(now);
        lift.stop(now + 0.155);

        [330 + letterStep, 495 + letterStep].forEach(freq => {
          const shimmer = this.ctx.createOscillator();
          const sg = this.ctx.createGain();
          shimmer.type = 'triangle';
          shimmer.frequency.setValueAtTime(freq * 0.78, now);
          shimmer.frequency.exponentialRampToValueAtTime(freq * 1.35, now + 0.13);
          sg.gain.setValueAtTime(0.045, now);
          sg.gain.exponentialRampToValueAtTime(0.001, now + 0.135);
          shimmer.connect(sg);
          sg.connect(dest);
          shimmer.start(now);
          shimmer.stop(now + 0.14);
        });
      }

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

    playUnlockFanfare() {
      if (!this.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((hz, i) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        const t0 = now + i * 0.08;
        osc.frequency.setValueAtTime(hz, t0);
        g.gain.setValueAtTime(0.11, t0);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.36);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(t0);
        osc.stop(t0 + 0.38);
      });
    }

    playStarChime(active = true) {
      if (!this.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(active ? 740 : 520, now);
      osc.frequency.exponentialRampToValueAtTime(active ? 1174.66 : 360, now + 0.11);
      g.gain.setValueAtTime(0.075, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.125);
    }

    playWeaponEquip(weaponId) {
      if (!this.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      this._playTactileClick(now, this.masterGain, 2800, 0.07);
      if (weaponId === 'gravity') {
        this.playGravityWave(1.0);
      } else {
        this.playWeaponShot(weaponId, 3, 2, 0, false);
      }
    }

    playGravityWave(strength = 1.0) {
      if (!this.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const dest = this.masterGain;
      const dur = 0.28 + 0.14 * strength;

      const sub = this.ctx.createOscillator();
      const sg = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(68, now);
      sub.frequency.exponentialRampToValueAtTime(420, now + dur);
      sg.gain.setValueAtTime(0.16 * Math.min(1.1, strength + 0.25), now);
      sg.gain.exponentialRampToValueAtTime(0.001, now + dur + 0.03);
      sub.connect(sg);
      sg.connect(dest);
      sub.start(now);
      sub.stop(now + dur + 0.04);

      if (this.noiseBuffer) {
        const whoosh = this.ctx.createBufferSource();
        whoosh.buffer = this.noiseBuffer;
        const bp = this.ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(340, now);
        bp.frequency.exponentialRampToValueAtTime(2200, now + dur);
        bp.Q.value = 2.4;

        const wg = this.ctx.createGain();
        wg.gain.setValueAtTime(0.11, now);
        wg.gain.exponentialRampToValueAtTime(0.001, now + dur);

        whoosh.connect(bp);
        bp.connect(wg);
        wg.connect(dest);
        whoosh.start(now, Math.random() * 0.4, dur + 0.04);
      }
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
  // МЕНЕДЖЕР ОЗВУЧКИ GEMINI 3.8 TTS (МУЛЬТИЯЗЫЧНЫЙ DE / EN / ES + КЭШ)
  // ==========================================================================
  class GeminiTTSManager {
    constructor(soundEngine) {
      this.soundEngine = soundEngine;
      this.enabled = true;
      this.model = 'gemini-3.8-flash-tts';
      this.voice = 'Kore';
      this.localApiKey = '';
      this.serverAvailable = null;

      this.memoryBufferCache = new Map();
      this.inflightPromises = new Map();
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
      return isHttp && this.serverAvailable !== false;
    }

    _cacheKey(text, lang) {
      return `${this.model}|${this.voice}|${lang || 'de'}|${text.trim()}`;
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

    async _fetchWavArrayBuffer(cleanText, lang = 'de') {
      const meta = TARGET_LANG_META[lang] || TARGET_LANG_META.de;

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
                  style: meta.speechStyle
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

      const isHttp = location.protocol === 'http:' || location.protocol === 'https:';
      if (isHttp && this.serverAvailable !== false) {
        const params = new URLSearchParams({
          text: cleanText,
          voice: this.voice,
          model: this.model,
          lang
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

    async getOrFetchAudioBuffer(text, lang = 'de') {
      const cleanText = String(text || '').trim();
      if (!cleanText) return null;

      const key = this._cacheKey(cleanText, lang);
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
            wavBytes = await this._fetchWavArrayBuffer(cleanText, lang);
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

    prefetch(text, lang = 'de') {
      if (!this.enabled || !this.canAttemptGemini()) return;
      const cleanText = String(text || '').trim();
      if (!cleanText) return;
      const key = this._cacheKey(cleanText, lang);
      if (this.memoryBufferCache.has(key) || this.inflightPromises.has(key)) return;
      if (this.prefetchQueue.some(q => q.text === cleanText && q.lang === lang)) return;

      this.prefetchQueue.push({ text: cleanText, lang });
      this._drainPrefetchQueue();
    }

    _drainPrefetchQueue() {
      while (this.activePrefetches < 2 && this.prefetchQueue.length > 0) {
        const nextItem = this.prefetchQueue.shift();
        this.activePrefetches++;
        this.getOrFetchAudioBuffer(nextItem.text, nextItem.lang).finally(() => {
          this.activePrefetches--;
          this._drainPrefetchQueue();
        });
      }
    }

    async speak(text, lang = 'de', forceSpeak = false) {
      if (!this.enabled && !forceSpeak) return false;
      const cleanText = String(text || '').trim();
      if (!cleanText) return false;

      if (this.canAttemptGemini()) {
        const buffer = await this.getOrFetchAudioBuffer(cleanText, lang);
        if (buffer) {
          this._playDecodedBuffer(buffer);
          return true;
        }
      }

      this._speakBrowserFallback(cleanText, lang);
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

    _speakBrowserFallback(text, lang = 'de') {
      if (!('speechSynthesis' in window)) return;
      try {
        const meta = TARGET_LANG_META[lang] || TARGET_LANG_META.de;
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = meta.bcp47;
        utter.rate = 0.96;
        utter.volume = 0.95;
        const voices = window.speechSynthesis.getVoices();
        const matchedVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(lang));
        if (matchedVoice) utter.voice = matchedVoice;
        window.speechSynthesis.speak(utter);
      } catch (_) {}
    }
  }

  const ttsManager = new GeminiTTSManager(sound);

  // ==========================================================================
  // СОСТОЯНИЕ ИГРЫ, ПРОГРЕСС СЛОВАРЯ И 3-СТУПЕНЧАТАЯ НАВИГАЦИЯ ПО КУРСАМ
  // ==========================================================================
  const initialSave = loadSavedSettings();

  // Восстановление выученных слов (для прокачки оружия)
  const savedLearnedArr = loadJsonStorage(LEARNED_STORAGE_KEY, []);
  const learnedWordsSet = new Set(Array.isArray(savedLearnedArr) ? savedLearnedArr : []);

  // Если у игрока уже были закрытые уровни в старой версии — зачисляем стартовый бонус, чтобы не терялся прогресс
  if (learnedWordsSet.size === 0 && Array.isArray(initialSave.completedLevelIds) && initialSave.completedLevelIds.length > 0) {
    const deAuto = (window.GAME_CATALOG.courses.de || [])[0];
    if (deAuto) {
      const creditLessons = Math.min(initialSave.completedLevelIds.length, 4);
      let credited = 0;
      for (const mod of deAuto.modules) {
        for (const ls of mod.lessons) {
          if (ls.isBoss) continue;
          if (credited < creditLessons) {
            ls.words.forEach(w => learnedWordsSet.add(`de::${w.word.toLowerCase()}`));
            credited++;
          }
        }
      }
      saveJsonStorage(LEARNED_STORAGE_KEY, Array.from(learnedWordsSet));
    }
  }

  // Восстановление слов со звёздочкой ⭐ («Повторить ещё раз»)
  const savedPinnedObj = loadJsonStorage(PINNED_STORAGE_KEY, {});
  const pinnedWordsMap = new Map(Object.entries(savedPinnedObj || {}));

  // Ударная серия дней подряд (🔥 Streak) и счётчик выученных за сегодня слов
  const dailyProgress = (() => {
    const today = getLocalIsoDateString();
    const saved = loadJsonStorage(DAILY_PROGRESS_KEY, {
      lastActiveDate: '',
      streakDays: 1,
      bestStreakDays: 1,
      todayDate: today,
      todayWords: []
    });
    let streak = Math.max(1, Number(saved.streakDays) || 1);
    let bestStreak = Math.max(streak, Number(saved.bestStreakDays) || 1);
    const lastDate = String(saved.lastActiveDate || '');

    if (!lastDate) {
      streak = 1;
    } else if (lastDate !== today) {
      const dPrev = new Date(`${lastDate}T00:00:00`);
      const dNow = new Date(`${today}T00:00:00`);
      const diffDays = Math.round((dNow - dPrev) / 86400000);
      if (diffDays === 1) {
        streak += 1;
      } else if (diffDays > 1) {
        streak = 1;
      }
    }
    bestStreak = Math.max(bestStreak, streak);
    const todayWords = saved.todayDate === today && Array.isArray(saved.todayWords)
      ? saved.todayWords
      : [];

    const normalized = {
      lastActiveDate: today,
      streakDays: streak,
      bestStreakDays: bestStreak,
      todayDate: today,
      todayWords
    };
    saveJsonStorage(DAILY_PROGRESS_KEY, normalized);
    return normalized;
  })();

  const todayLearnedSet = new Set(dailyProgress.todayWords || []);

  function recordTodayWord(wordKey) {
    const today = getLocalIsoDateString();
    if (dailyProgress.todayDate !== today) {
      dailyProgress.todayDate = today;
      dailyProgress.lastActiveDate = today;
      todayLearnedSet.clear();
    }
    if (!todayLearnedSet.has(wordKey)) {
      todayLearnedSet.add(wordKey);
      dailyProgress.todayWords = Array.from(todayLearnedSet);
      saveJsonStorage(DAILY_PROGRESS_KEY, dailyProgress);
    }
  }

  function determineInitialNativeLang() {
    if (initialSave.nativeLang && UI_TEXT[initialSave.nativeLang]) {
      return initialSave.nativeLang;
    }
    if (initialSave.translationLang === 'he') return 'he';
    if (initialSave.translationLang === 'ru') return 'ru';
    return detectBrowserNativeLanguage();
  }

  const initialNativeLang = determineInitialNativeLang();
  const initialTargetLang = (initialSave.targetLang && TARGET_LANG_META[initialSave.targetLang])
    ? initialSave.targetLang
    : detectDefaultTargetLanguage();

  const state = {
    screenMode: 'title', // 'title' | 'play'
    running: false,
    paused: false,
    gameOver: false,
    overlayMode: 'pause', // 'intro' | 'complete' | 'gameover' | 'pause'
    activeQuiz: null,

    // Два независимых языковых фильтра
    targetLang: initialTargetLang, // 'de' | 'en' | 'es'
    nativeLang: initialNativeLang, // 'ru' | 'en' | 'he'
    nativeLangModes: [
      { id: 'ru', short: '🇷🇺 RU' },
      { id: 'en', short: '🇬🇧 EN' },
      { id: 'he', short: '🇮🇱 עברית' }
    ],

    // Режим обучения в Академии ('type' | 'listen' | 'translate') и клавиатура ПК
    studyMode: (initialSave.studyMode === 'listen' || initialSave.studyMode === 'translate')
      ? initialSave.studyMode
      : 'type',
    desktopKbdOpen: Boolean(initialSave.desktopKbdOpen),
    lastSpotlightEntry: null,
    lastSpotlightIsHit: false,
    lastPromoRect: null,

    // Трёхступенчатый выбор курса -> модуля -> урока + полноэкранная страница «Мои колоды» + Студия Супер-Админа
    userCourses: [],
    adminCatalog: (() => {
      try {
        const raw = localStorage.getItem('zlingo_admin_catalog_v1');
        const parsed = raw ? JSON.parse(raw) : null;
        if (parsed && typeof parsed === 'object') {
          return {
            version: 1,
            updatedAt: parsed.updatedAt || '',
            categories: Array.isArray(parsed.categories) ? parsed.categories : [],
            courses: {
              de: (parsed.courses && Array.isArray(parsed.courses.de)) ? parsed.courses.de : [],
              en: (parsed.courses && Array.isArray(parsed.courses.en)) ? parsed.courses.en : [],
              es: (parsed.courses && Array.isArray(parsed.courses.es)) ? parsed.courses.es : []
            },
            courseOverrides: (parsed.courseOverrides && typeof parsed.courseOverrides === 'object')
              ? parsed.courseOverrides
              : {},
            deletedCourseIds: Array.isArray(parsed.deletedCourseIds) ? parsed.deletedCourseIds : []
          };
        }
      } catch (_) {}
      return {
        version: 1,
        updatedAt: '',
        categories: [],
        courses: { de: [], en: [], es: [] },
        courseOverrides: {},
        deletedCourseIds: []
      };
    })(),
    adminOrgLang: initialTargetLang,
    adminAiPreviewResult: null,
    adminTitleManuallyEdited: false,
    catalogSourceFilter: 'all', // 'all' | 'official' | 'user'
    homeSubView: 'home', // 'home' | 'decks' | 'admin'
    decksNavMode: 'decks', // 'decks' | 'courses'
    decksViewMode: 'grid', // 'grid' | 'list'
    decksCategoryFilter: 'all',
    decksLevelFilter: 'all',
    decksSearchQuery: '',
    openedDeckId: '',
    openedDeckEditMode: false,
    openedDeckSubdeckFilter: 'all',
    openedDeckWordQuery: '',
    openedDeckWordsLimit: 120,
    decksOpenedFromPlay: false,
    ankiManualOverride: false,
    activeCourseId: initialSave.activeCourseId || '',
    activeModuleIndex: Number(initialSave.activeModuleIndex) || 0,
    activeLessonIndex: Number(initialSave.activeLessonIndex) || 0,
    completedLessonIds: new Set(Array.isArray(initialSave.completedLessonIds) ? initialSave.completedLessonIds : []),
    activeCustomRoundTitle: '',

    // Арсенал и прогресс прокачки за выученные слова
    weaponId: 'plasma',
    missileAlternateSide: 1,
    weaponBannerText: '',
    weaponBannerColor: '',
    weaponBannerTimer: 0,

    // Скорость и режим ввода артикля
    typeWithArticle: Boolean(initialSave.typeWithArticle),
    speedPresetIndex: (() => {
      const presets = [0.25, 0.5, 0.75, 1.0, 1.35];
      if (typeof initialSave.speedMult === 'number') {
        const idx = presets.findIndex(m => Math.abs(m - initialSave.speedMult) < 0.03);
        if (idx !== -1) return idx;
      }
      return 1; // 0.5x по умолчанию, 0.25x в один клик
    })(),
    speedPresets: [
      { mult: 0.25, label: '🦥 0.25x' },
      { mult: 0.5, label: '🐌 0.5x' },
      { mult: 0.75, label: '🐢 0.75x' },
      { mult: 1.0, label: '🚀 1.0x' },
      { mult: 1.35, label: '⚡ 1.35x' }
    ],

    // Очки и боевые показатели
    score: 0,
    highScore: Number(initialSave.highScore) || 0,
    combo: 1,
    maxCombo: 1,
    shotsFired: 0,
    shotsHit: 0,
    shields: 4,
    maxShields: 4,
    empCharges: 2,

    warpTimer: 0,
    demoWords: [],
    demoSpawnTimer: 0.35,
    demoFireTimer: 0.25,
    demoTargetId: null,

    wordQueue: [],
    currentRoundPool: [],
    totalWordsInLevel: 0,
    wordsDestroyedInLevel: 0,
    spawnTimer: 0,
    mistakeWordsMap: new Map(),
    killHistory: [],
    dictOnlyPinned: false,

    // Состояние диалога импорта Anki .apkg
    importTargetLang: initialTargetLang,
    parsedAnkiData: null,

    activeWords: [],
    lockedWordId: null,
    lastAbsorbedUmlautE: false,
    lastAbsorbedEszettS: false,

    lasers: [],
    missiles: [],
    repulsorWaves: [],
    gravityEquipCooldown: 0,
    particles: [],
    shockwaves: [],
    floatingTranslations: [],
    stars: [],
    nebulae: [],
    layoutWarningTimer: 0,

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

  // Проверяем, открыто ли сохранённое оружие у игрока
  function isWeaponUnlocked(weaponObj) {
    return learnedWordsSet.size >= (weaponObj.unlockWords || 0);
  }

  if (
    initialSave.weaponId &&
    WEAPONS.some(w => w.id === initialSave.weaponId && isWeaponUnlocked(w))
  ) {
    state.weaponId = initialSave.weaponId;
  } else {
    state.weaponId = 'plasma';
  }

  function getNextLockedWeapon() {
    return WEAPONS.find(w => !isWeaponUnlocked(w)) || null;
  }

  function makeWordKey(targetLang, entry) {
    return `${targetLang}::${String(entry.word || entry.raw || '').trim().toLowerCase()}`;
  }

  function isEntryPinned(entry, targetLang = state.targetLang) {
    if (!entry) return false;
    return pinnedWordsMap.has(makeWordKey(targetLang, entry));
  }

  function getPinnedEntriesForTargetLang(targetLang = state.targetLang) {
    const prefix = `${targetLang}::`;
    const list = [];
    for (const [k, val] of pinnedWordsMap.entries()) {
      if (k.startsWith(prefix) && val && val.word) {
        list.push(val);
      }
    }
    return list;
  }

  function togglePinWord(entry, targetLang = state.targetLang) {
    if (!entry) return false;
    const key = makeWordKey(targetLang, entry);
    const nowPinned = !pinnedWordsMap.has(key);
    if (nowPinned) {
      pinnedWordsMap.set(key, entry);
    } else {
      pinnedWordsMap.delete(key);
    }
    saveJsonStorage(PINNED_STORAGE_KEY, Object.fromEntries(pinnedWordsMap.entries()));
    sound.playStarChime(nowPinned);

    const tr = t();
    state.weaponBannerText = nowPinned ? tr.pinAddedBanner(entry.word) : tr.pinRemovedBanner(entry.word);
    state.weaponBannerColor = '#fde047';
    state.weaponBannerTimer = 1.65;

    updatePinnedCountUI();
    rerenderKillFeed();
    refreshHitSpotlightPinState();
    if (!centerOverlay.classList.contains('hidden')) {
      refreshOverlayContent();
    }
    if (dictDialog && dictDialog.open) {
      renderFullDictionary(dictSearchInput.value);
    }
    if (state.homeSubView === 'decks') {
      renderDecksPage();
    }
    return nowPinned;
  }

  function recordWordLearned(entry, targetLang = state.targetLang) {
    if (!entry) return;
    const prevCount = learnedWordsSet.size;
    const key = makeWordKey(targetLang, entry);
    recordTodayWord(key);

    if (learnedWordsSet.has(key)) {
      updateTodayLearnedUI();
      renderHomeDashboardWidgets();
      if (state.homeSubView === 'decks') renderDecksPage();
      return;
    }

    learnedWordsSet.add(key);
    saveJsonStorage(LEARNED_STORAGE_KEY, Array.from(learnedWordsSet));
    const newCount = learnedWordsSet.size;

    // Проверяем, открылась ли новая пушка!
    const newlyUnlocked = WEAPONS.find(w => w.unlockWords > prevCount && w.unlockWords <= newCount);
    if (newlyUnlocked) {
      sound.playUnlockFanfare();
      state.weaponBannerText = t().unlockedWeaponBanner(newlyUnlocked.icon, getWeaponName(newlyUnlocked));
      state.weaponBannerColor = '#fde047';
      state.weaponBannerTimer = 3.2;
    }

    renderWeaponSelectors();
    updateLearnedProgressUI();
    updateTodayLearnedUI();
    updatePilotRankUI();
    renderHomeDashboardWidgets();
    if (state.homeSubView === 'decks') renderDecksPage();
  }

  // --- Хелперы локализации и каталога курсов ---
  function isHebrewUI() {
    return state.nativeLang === 'he';
  }

  function t() {
    return UI_TEXT[state.nativeLang] || UI_TEXT.ru;
  }

  function getLocalizedField(obj, fieldName = 'titles') {
    if (!obj) return '';
    const map = obj[fieldName];
    if (map && typeof map === 'object') {
      return map[state.nativeLang] || map.en || map.ru || map.he || '';
    }
    return '';
  }

  function getCurrentWeapon() {
    return WEAPONS.find(w => w.id === state.weaponId) || WEAPONS[0];
  }

  function getWeaponName(w) {
    return (w.names && (w.names[state.nativeLang] || w.names.en)) || w.id;
  }

  function getWeaponDesc(w) {
    return (w.descs && (w.descs[state.nativeLang] || w.descs.en)) || '';
  }

  function getWordTranslation(entry) {
    if (!entry) return '';
    if (entry.translations && typeof entry.translations === 'object') {
      return entry.translations[state.nativeLang] || entry.translations.en || entry.translations.ru || entry.translations.he || '';
    }
    if (state.nativeLang === 'he') return entry.he || entry.ru || '';
    return entry.ru || entry.he || '';
  }

  function isRtlTranslation(entry) {
    const txt = getWordTranslation(entry);
    return state.nativeLang === 'he' || /[\u0590-\u05FF]/.test(txt);
  }

  function getAllCategories() {
    const baseCats = (window.GAME_CATALOG && Array.isArray(window.GAME_CATALOG.categories))
      ? window.GAME_CATALOG.categories
      : [];
    const adminCats = (state.adminCatalog && Array.isArray(state.adminCatalog.categories))
      ? state.adminCatalog.categories
      : [];
    const byId = new Map();
    for (const c of baseCats) {
      if (c && c.id) byId.set(c.id, c);
    }
    for (const c of adminCats) {
      if (c && c.id) byId.set(c.id, c);
    }
    return Array.from(byId.values());
  }

  function getCategoryById(catId) {
    if (!catId) return null;
    return getAllCategories().find(c => c.id === catId) || null;
  }

  function inferCourseCategory(course) {
    if (!course) return 'base';
    if (course.category) return course.category;
    const cid = String(course.id || '').toLowerCase();
    if (cid.includes('auto')) return 'auto';
    if (cid.includes('business') || cid.includes('existenz')) return 'business';
    if (cid.includes('it')) return 'it';
    if (cid.includes('travel')) return 'travel';
    return 'base';
  }

  function getOfficialCoursesForTargetLang(targetLang = state.targetLang) {
    const baseList = (window.GAME_CATALOG && window.GAME_CATALOG.courses && window.GAME_CATALOG.courses[targetLang]) || [];
    const adminList = (state.adminCatalog && state.adminCatalog.courses && state.adminCatalog.courses[targetLang]) || [];
    const deletedSet = new Set((state.adminCatalog && state.adminCatalog.deletedCourseIds) || []);
    const overrides = (state.adminCatalog && state.adminCatalog.courseOverrides) || {};

    const mergedById = new Map();
    baseList.forEach((c, idx) => {
      if (!c || !c.id || deletedSet.has(c.id)) return;
      mergedById.set(c.id, { ...c, _baseOrder: idx });
    });
    adminList.forEach((c, idx) => {
      if (!c || !c.id || deletedSet.has(c.id)) return;
      mergedById.set(c.id, { ...c, isAdminCreated: true, _baseOrder: baseList.length + idx });
    });

    const resolved = Array.from(mergedById.values()).map(course => {
      const ov = overrides[course.id];
      let out = {
        ...course,
        category: inferCourseCategory(course)
      };
      if (ov && typeof ov === 'object') {
        if (ov.category) out.category = ov.category;
        if (ov.levelTag) out.levelTag = ov.levelTag;
        if (ov.icon) out.icon = ov.icon;
        if (ov.titles && typeof ov.titles === 'object') {
          out.titles = { ...(out.titles || {}), ...ov.titles };
        }
        if (typeof ov.orderIndex === 'number') {
          out._orderIndex = ov.orderIndex;
        }
        let mods = Array.isArray(out.modules) ? out.modules.slice() : [];
        if (Array.isArray(ov.removedModuleIds) && ov.removedModuleIds.length > 0) {
          const remSet = new Set(ov.removedModuleIds);
          mods = mods.filter(m => !remSet.has(m.id));
        }
        if (Array.isArray(ov.appendedModules) && ov.appendedModules.length > 0) {
          const existingIds = new Set(mods.map(m => m.id));
          for (const am of ov.appendedModules) {
            if (am && !existingIds.has(am.id)) {
              mods.push(am);
              existingIds.add(am.id);
            }
          }
        }
        out.modules = mods;
      }
      return out;
    });

    resolved.sort((a, b) => {
      const ao = typeof a._orderIndex === 'number' ? a._orderIndex : a._baseOrder;
      const bo = typeof b._orderIndex === 'number' ? b._orderIndex : b._baseOrder;
      return ao - bo;
    });

    return resolved;
  }

  function getCoursesForTargetLang(targetLang = state.targetLang) {
    const official = getOfficialCoursesForTargetLang(targetLang);
    const personal = state.userCourses.filter(c => c.targetLang === targetLang);
    return [...official, ...personal];
  }

  function ensureValidCourseSelection() {
    const available = getCoursesForTargetLang(state.targetLang);
    if (available.length === 0) return null;

    let course = available.find(c => c.id === state.activeCourseId);
    if (!course) {
      course = available[0];
      state.activeCourseId = course.id;
      state.activeModuleIndex = 0;
      state.activeLessonIndex = 0;
    }

    if (!course.modules || course.modules.length === 0) return course;
    if (state.activeModuleIndex < 0 || state.activeModuleIndex >= course.modules.length) {
      state.activeModuleIndex = 0;
      state.activeLessonIndex = 0;
    }

    const mod = course.modules[state.activeModuleIndex];
    if (!mod.lessons || mod.lessons.length === 0) return course;
    if (state.activeLessonIndex < 0 || state.activeLessonIndex >= mod.lessons.length) {
      state.activeLessonIndex = 0;
    }

    return course;
  }

  function getActiveSelection() {
    const course = ensureValidCourseSelection();
    if (!course) return { course: null, mod: null, lesson: null };
    const mod = course.modules[state.activeModuleIndex] || course.modules[0];
    const lesson = (mod && mod.lessons && mod.lessons[state.activeLessonIndex]) || (mod && mod.lessons && mod.lessons[0]) || null;
    return { course, mod, lesson };
  }

  function getAllWordsInCourse(course) {
    if (!course || !Array.isArray(course.modules)) return [];
    const seen = new Set();
    const out = [];
    for (const mod of course.modules) {
      for (const ls of (mod.lessons || [])) {
        if (ls.isBoss) continue;
        for (const w of (ls.words || [])) {
          const k = w.raw || w.word;
          if (!seen.has(k)) {
            seen.add(k);
            out.push(w);
          }
        }
      }
    }
    return out;
  }

  function getAllWordsInTargetLang(targetLang = state.targetLang) {
    const courses = getCoursesForTargetLang(targetLang);
    const seen = new Set();
    const out = [];
    for (const c of courses) {
      for (const w of getAllWordsInCourse(c)) {
        const k = w.raw || w.word;
        if (!seen.has(k)) {
          seen.add(k);
          out.push(w);
        }
      }
    }
    return out;
  }

  // Сборка слов для урока (для каждого 4-го Босс-урока — умный микс предыдущих 3 уроков + ошибок + ⭐!)
  function resolveLessonBaseWords(course, mod, lesson, lessonIdx) {
    if (!lesson) return [];
    if (!lesson.isBoss) {
      return Array.isArray(lesson.words) ? lesson.words.slice() : [];
    }

    const preceding = (mod.lessons || [])
      .slice(0, lessonIdx)
      .filter(l => !l.isBoss)
      .slice(-3);

    const moduleWords = preceding.flatMap(l => l.words || []);
    if (moduleWords.length === 0) {
      return getAllWordsInCourse(course).slice(0, 12);
    }

    const priority = [];
    const regular = [];
    const added = new Set();

    // 1. Сначала слова из этих 3 уроков, где игрок ошибался или поставил звёздочку ⭐
    for (const w of moduleWords) {
      const k = w.raw || w.word;
      if (added.has(k)) continue;
      if (state.mistakeWordsMap.has(k) || isEntryPinned(w, course.targetLang)) {
        priority.push(w);
        added.add(k);
      } else {
        regular.push(w);
        added.add(k);
      }
    }

    // 2. Плюс до 3 отмеченных ⭐ слов из других модулей этого языка
    for (const pw of getPinnedEntriesForTargetLang(course.targetLang)) {
      const k = pw.raw || pw.word;
      if (!added.has(k) && priority.length < 10) {
        priority.push(pw);
        added.add(k);
      }
    }

    const bossCount = Math.min(14, priority.length + regular.length);
    return [...shuffleArray(priority), ...shuffleArray(regular)].slice(0, bossCount);
  }

  function updateOriginBadgeElement(badgeEl, course, compact = false) {
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

  // --- DOM-элементы ---
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  // Титульный экран
  const arcadeTitleScreen = document.getElementById('arcadeTitleScreen');
  const titleHeaderCard = document.getElementById('titleHeaderCard');
  const titleBottomDock = document.getElementById('titleBottomDock');
  const pilotRankText = document.getElementById('pilotRankText');
  const labelNativeFilter = document.getElementById('labelNativeFilter');
  const labelTargetFilter = document.getElementById('labelTargetFilter');
  const arcadeLogoMain = document.getElementById('arcadeLogoMain');
  const arcadeLogoSub = document.getElementById('arcadeLogoSub');
  const titleTagline = document.getElementById('titleTagline');
  const titleArsenalLabel = document.getElementById('titleArsenalLabel');
  const learnedProgressPill = document.getElementById('learnedProgressPill');
  const titleWeaponDesc = document.getElementById('titleWeaponDesc');
  const titleWeaponRow = document.getElementById('titleWeaponRow');
  const titleCourseOriginBadge = document.getElementById('titleCourseOriginBadge');
  const titleCourseName = document.getElementById('titleCourseName');
  const btnOpenCatalogTitle = document.getElementById('btnOpenCatalogTitle');
  const btnTitleAllCourses = document.getElementById('btnTitleAllCourses');
  const labelOpenCatalogTitle = document.getElementById('labelOpenCatalogTitle');
  const titleStageChips = document.getElementById('titleStageChips');
  const btnArcadeLaunch = document.getElementById('btnArcadeLaunch');
  const labelArcadeLaunch = document.getElementById('labelArcadeLaunch');
  const btnTitleSpeed = document.getElementById('btnTitleSpeed');
  const btnTitleVoice = document.getElementById('btnTitleVoice');
  const btnTitleDict = document.getElementById('btnTitleDict');
  const labelTitleDict = document.getElementById('labelTitleDict');
  const btnTitleCustom = document.getElementById('btnTitleCustom');
  const labelTitleCustom = document.getElementById('labelTitleCustom');

  // Верхний HUD
  const labelPause = document.getElementById('labelPause');
  const labelScore = document.getElementById('labelScore');
  const labelCombo = document.getElementById('labelCombo');
  const labelLearnedHud = document.getElementById('labelLearnedHud');
  const hudLearnedCount = document.getElementById('hudLearnedCount');
  const labelShield = document.getElementById('labelShield');
  const labelCatalogHud = document.getElementById('labelCatalogHud');
  const labelCustomBtn = document.getElementById('labelCustomBtn');

  const sidebarOriginBadge = document.getElementById('sidebarOriginBadge');
  const sidebarLevelsTitle = document.getElementById('sidebarLevelsTitle');
  const btnSidebarCatalog = document.getElementById('btnSidebarCatalog');
  const btnSidebarAnki = document.getElementById('btnSidebarAnki');
  const sidebarKillsTitle = document.getElementById('sidebarKillsTitle');
  const btnDrillPinned = document.getElementById('btnDrillPinned');
  const pinnedCountBadge = document.getElementById('pinnedCountBadge');

  const legendDer = document.getElementById('legendDer');
  const legendDie = document.getElementById('legendDie');
  const legendDas = document.getElementById('legendDas');
  const legendVerb = document.getElementById('legendVerb');

  const hudLevelTitle = document.getElementById('hudLevelTitle');
  const hudProgressBar = document.getElementById('hudProgressBar');
  const hudProgressText = document.getElementById('hudProgressText');
  const hudScore = document.getElementById('hudScore');
  const hudCombo = document.getElementById('hudCombo');
  const hudShields = document.getElementById('hudShields');
  const empCountEl = document.getElementById('empCount');

  const btnWeaponMode = document.getElementById('btnWeaponMode');
  const btnEmp = document.getElementById('btnEmp');
  const btnTargetLangHud = document.getElementById('btnTargetLangHud');
  const btnLangMode = document.getElementById('btnLangMode');
  const btnArticleMode = document.getElementById('btnArticleMode');
  const btnSpeedMode = document.getElementById('btnSpeedMode');
  const btnOpenTtsSettings = document.getElementById('btnOpenTtsSettings');
  const btnOpenCatalogHud = document.getElementById('btnOpenCatalogHud');
  const btnOpenCustom = document.getElementById('btnOpenCustom');
  const btnPause = document.getElementById('btnPause');
  const btnHudHome = document.getElementById('btnHudHome');
  const btnQuickLevels = document.getElementById('btnQuickLevels');
  const btnClearFeed = document.getElementById('btnClearFeed');

  // Экранная клавиатура ZType
  const ztypeKeyboard = document.getElementById('ztypeKeyboard');
  const ztypeKeysContainer = document.getElementById('ztypeKeysContainer');
  const kbdProgressFill = document.getElementById('kbdProgressFill');
  const levelListContainer = document.getElementById('levelListContainer');
  const overlayLevelChips = document.getElementById('overlayLevelChips');
  const totalWordsCounter = document.getElementById('totalWordsCounter');
  const killFeedContainer = document.getElementById('killFeedContainer');
  const bottomTargetPreview = document.getElementById('bottomTargetPreview');

  // Центральный оверлей
  const centerOverlay = document.getElementById('centerOverlay');
  const overlayCard = document.getElementById('overlayCard');
  const overlayOriginBadge = document.getElementById('overlayOriginBadge');
  const overlayBadge = document.getElementById('overlayBadge');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayDesc = document.getElementById('overlayDesc');
  const overlayWeaponTitle = document.getElementById('overlayWeaponTitle');
  const overlayLearnedPill = document.getElementById('overlayLearnedPill');
  const overlayWeaponRow = document.getElementById('overlayWeaponRow');
  const overlayWordsHeader = document.getElementById('overlayWordsHeader');
  const overlayWordsPreview = document.getElementById('overlayWordsPreview');
  const btnStartLevel = document.getElementById('btnStartLevel');
  const btnNextLevel = document.getElementById('btnNextLevel');
  const btnPracticePinned = document.getElementById('btnPracticePinned');
  const btnPracticeMistakes = document.getElementById('btnPracticeMistakes');
  const btnOverlayCatalog = document.getElementById('btnOverlayCatalog');
  const btnBackToTitle = document.getElementById('btnBackToTitle');

  const levelQuizBox = document.getElementById('levelQuizBox');
  const quizHeaderTitle = document.getElementById('quizHeaderTitle');
  const quizScoreText = document.getElementById('quizScoreText');
  const quizQuestionWord = document.getElementById('quizQuestionWord');
  const quizOptionsGrid = document.getElementById('quizOptionsGrid');

  // Диалог 3-ступенчатого каталога курсов
  const courseBrowserDialog = document.getElementById('courseBrowserDialog');
  const catalogDialogBody = document.getElementById('catalogDialogBody');
  const catalogDialogTitle = document.getElementById('catalogDialogTitle');
  const btnCloseCatalog = document.getElementById('btnCloseCatalog');
  const tabSourceAll = document.getElementById('tabSourceAll');
  const tabSourceOfficial = document.getElementById('tabSourceOfficial');
  const tabSourceUser = document.getElementById('tabSourceUser');
  const btnOpenAnkiFromCatalog = document.getElementById('btnOpenAnkiFromCatalog');
  const labelImportFromCatalog = document.getElementById('labelImportFromCatalog');
  const catalogCoursesContainer = document.getElementById('catalogCoursesContainer');

  // Диалог импорта Anki .apkg и своих слов
  const customWordsDialog = document.getElementById('customWordsDialog');
  const customDialogBody = document.getElementById('customDialogBody');
  const customDialogTitle = document.getElementById('customDialogTitle');
  const btnCloseCustom = document.getElementById('btnCloseCustom');
  const tabImportAnki = document.getElementById('tabImportAnki');
  const tabImportManual = document.getElementById('tabImportManual');
  const importTargetLangLabel = document.getElementById('importTargetLangLabel');
  const ankiImportPane = document.getElementById('ankiImportPane');
  const manualImportPane = document.getElementById('manualImportPane');
  const ankiDropzone = document.getElementById('ankiDropzone');
  const ankiDropTitle = document.getElementById('ankiDropTitle');
  const ankiDropSub = document.getElementById('ankiDropSub');
  const ankiFileInput = document.getElementById('ankiFileInput');
  const btnDownloadSampleApkg = document.getElementById('btnDownloadSampleApkg');
  const ankiParseStatus = document.getElementById('ankiParseStatus');
  const ankiPreviewBox = document.getElementById('ankiPreviewBox');
  const ankiAutoMapBanner = document.getElementById('ankiAutoMapBanner');
  const labelAnkiDeckName = document.getElementById('labelAnkiDeckName');
  const ankiDeckTitleInput = document.getElementById('ankiDeckTitleInput');
  const ankiManualColsDetails = document.getElementById('ankiManualColsDetails');
  const ankiManualColsSummary = document.getElementById('ankiManualColsSummary');
  const labelAnkiFront = document.getElementById('labelAnkiFront');
  const labelAnkiBack = document.getElementById('labelAnkiBack');
  const ankiFrontSelect = document.getElementById('ankiFrontSelect');
  const ankiBackSelect = document.getElementById('ankiBackSelect');
  const btnSwapAnkiCols = document.getElementById('btnSwapAnkiCols');
  const ankiSampleCards = document.getElementById('ankiSampleCards');
  const btnConfirmAnkiImport = document.getElementById('btnConfirmAnkiImport');
  const btnSaveAnkiToDecks = document.getElementById('btnSaveAnkiToDecks');
  const manualDeckTitleInput = document.getElementById('manualDeckTitleInput');
  const customDialogHint = document.getElementById('customDialogHint');
  const customWordsInput = document.getElementById('customWordsInput');
  const btnSaveCustomWords = document.getElementById('btnSaveCustomWords');

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

  // Диалог словаря
  const dictDialog = document.getElementById('dictDialog');
  const dictDialogBody = document.getElementById('dictDialogBody');
  const dictDialogTitle = document.getElementById('dictDialogTitle');
  const btnCloseDict = document.getElementById('btnCloseDict');
  const dictSearchInput = document.getElementById('dictSearchInput');
  const btnDictOnlyPinned = document.getElementById('btnDictOnlyPinned');
  const labelDictPinnedFilter = document.getElementById('labelDictPinnedFilter');
  const dictFullList = document.getElementById('dictFullList');

  // --- Z-LINGO 2.0: DOM-элементы Главной панели, страницы «Мои колоды» и Космической Академии ---
  const homeDashboardView = document.getElementById('homeDashboardView');
  const decksPageView = document.getElementById('decksPageView');
  const labelDecksFiltersTitle = document.getElementById('labelDecksFiltersTitle');
  const labelDecksLangHeader = document.getElementById('labelDecksLangHeader');
  const labelDecksSourceHeader = document.getElementById('labelDecksSourceHeader');
  const decksSourceFilterGroup = document.getElementById('decksSourceFilterGroup');
  const labelDecksSrcAll = document.getElementById('labelDecksSrcAll');
  const labelDecksSrcOfficial = document.getElementById('labelDecksSrcOfficial');
  const labelDecksSrcUser = document.getElementById('labelDecksSrcUser');
  const labelDecksCategoryHeader = document.getElementById('labelDecksCategoryHeader');
  const decksCategoryFilterGroup = document.getElementById('decksCategoryFilterGroup');
  const labelDecksLevelHeader = document.getElementById('labelDecksLevelHeader');
  const decksLevelFilterGroup = document.getElementById('decksLevelFilterGroup');
  const btnDecksLevelAll = document.getElementById('btnDecksLevelAll');
  const labelDecksSidebarProgTitle = document.getElementById('labelDecksSidebarProgTitle');
  const decksSidebarStartedNum = document.getElementById('decksSidebarStartedNum');
  const decksSidebarTotalLabel = document.getElementById('decksSidebarTotalLabel');
  const labelDecksInProgressSub = document.getElementById('labelDecksInProgressSub');
  const decksSidebarProgFill = document.getElementById('decksSidebarProgFill');
  const decksSidebarProgPct = document.getElementById('decksSidebarProgPct');
  const decksHeroTitle = document.getElementById('decksHeroTitle');
  const decksHeroSubtitle = document.getElementById('decksHeroSubtitle');
  const decksSearchInput = document.getElementById('decksSearchInput');
  const btnDecksImportAnki = document.getElementById('btnDecksImportAnki');
  const labelDecksImportAnkiBtn = document.getElementById('labelDecksImportAnkiBtn');
  const btnDecksCreateDeck = document.getElementById('btnDecksCreateDeck');
  const labelDecksCreateBtn = document.getElementById('labelDecksCreateBtn');
  const labelDecksStatTotal = document.getElementById('labelDecksStatTotal');
  const decksHeroTotalCount = document.getElementById('decksHeroTotalCount');
  const labelDecksStatLearned = document.getElementById('labelDecksStatLearned');
  const decksHeroLearnedCount = document.getElementById('decksHeroLearnedCount');
  const labelDecksStatStreak = document.getElementById('labelDecksStatStreak');
  const decksHeroStreakCount = document.getElementById('decksHeroStreakCount');
  const btnDecksSubtabCourses = document.getElementById('btnDecksSubtabCourses');
  const labelDecksSubtabCourses = document.getElementById('labelDecksSubtabCourses');
  const btnDecksSubtabMyDecks = document.getElementById('btnDecksSubtabMyDecks');
  const labelDecksSubtabMyDecks = document.getElementById('labelDecksSubtabMyDecks');
  const btnDecksOpenAdmin = document.getElementById('btnDecksOpenAdmin');
  const labelDecksOpenAdmin = document.getElementById('labelDecksOpenAdmin');
  const btnDecksReturnBattle = document.getElementById('btnDecksReturnBattle');
  const labelDecksReturnBattle = document.getElementById('labelDecksReturnBattle');
  const btnDecksViewGrid = document.getElementById('btnDecksViewGrid');
  const labelDecksViewGrid = document.getElementById('labelDecksViewGrid');
  const btnDecksViewList = document.getElementById('btnDecksViewList');
  const labelDecksViewList = document.getElementById('labelDecksViewList');
  const decksOverviewPane = document.getElementById('decksOverviewPane');
  const decksContinueSection = document.getElementById('decksContinueSection');
  const labelDecksContinueHeading = document.getElementById('labelDecksContinueHeading');
  const decksContinueGrid = document.getElementById('decksContinueGrid');
  const labelDecksAllHeading = document.getElementById('labelDecksAllHeading');
  const decksAllCountBadge = document.getElementById('decksAllCountBadge');
  const decksAllGrid = document.getElementById('decksAllGrid');
  const deckDetailPane = document.getElementById('deckDetailPane');

  // --- DOM-элементы Студии Супер-Админа (#adminStudioView) ---
  const adminStudioView = document.getElementById('adminStudioView');
  const btnAdminBackToDecks = document.getElementById('btnAdminBackToDecks');
  const btnAdminExportJson = document.getElementById('btnAdminExportJson');
  const btnAdminImportJson = document.getElementById('btnAdminImportJson');
  const adminImportJsonInput = document.getElementById('adminImportJsonInput');
  const btnAdminSyncCloud = document.getElementById('btnAdminSyncCloud');
  const adminGeminiKeyInput = document.getElementById('adminGeminiKeyInput');
  const adminGithubTokenInput = document.getElementById('adminGithubTokenInput');
  const adminPasswordInput = document.getElementById('adminPasswordInput');
  const btnAdminSaveCreds = document.getElementById('btnAdminSaveCreds');
  const adminStatusBanner = document.getElementById('adminStatusBanner');
  const adminLiveCountBadge = document.getElementById('adminLiveCountBadge');
  const adminSourceLangSelect = document.getElementById('adminSourceLangSelect');
  const adminTransLangSelect = document.getElementById('adminTransLangSelect');
  const adminLevelSelect = document.getElementById('adminLevelSelect');
  const adminCategorySelect = document.getElementById('adminCategorySelect');
  const btnAdminToggleNewCat = document.getElementById('btnAdminToggleNewCat');
  const adminIconInput = document.getElementById('adminIconInput');
  const adminNewCategoryBox = document.getElementById('adminNewCategoryBox');
  const adminNewCatIcon = document.getElementById('adminNewCatIcon');
  const adminNewCatTitleRu = document.getElementById('adminNewCatTitleRu');
  const adminNewCatTitleEn = document.getElementById('adminNewCatTitleEn');
  const btnAdminCreateCategory = document.getElementById('btnAdminCreateCategory');
  const adminPlacementModeSelect = document.getElementById('adminPlacementModeSelect');
  const adminAppendTargetWrap = document.getElementById('adminAppendTargetWrap');
  const adminTargetCourseSelect = document.getElementById('adminTargetCourseSelect');
  const adminCourseTitleInput = document.getElementById('adminCourseTitleInput');
  const adminRawWordsTextarea = document.getElementById('adminRawWordsTextarea');
  const adminAiEnrichUiCheck = document.getElementById('adminAiEnrichUiCheck');
  const adminAiCloneTargetsCheck = document.getElementById('adminAiCloneTargetsCheck');
  const adminLiveParseSummary = document.getElementById('adminLiveParseSummary');
  const adminLivePreviewList = document.getElementById('adminLivePreviewList');
  const btnAdminAiPreview = document.getElementById('btnAdminAiPreview');
  const btnAdminCreateAndPublish = document.getElementById('btnAdminCreateAndPublish');
  const adminOrganizerLangTabs = document.getElementById('adminOrganizerLangTabs');
  const adminCategoriesTree = document.getElementById('adminCategoriesTree');

  const homeBrandLogo = document.getElementById('homeBrandLogo');
  const homeBrandSub = document.getElementById('homeBrandSub');
  const btnNavHome = document.getElementById('btnNavHome');
  const btnNavPlay = document.getElementById('btnNavPlay');
  const btnNavCourses = document.getElementById('btnNavCourses');
  const btnNavDecks = document.getElementById('btnNavDecks');
  const btnNavStats = document.getElementById('btnNavStats');
  const btnNavLeaderboard = document.getElementById('btnNavLeaderboard');
  const btnNavAdmin = document.getElementById('btnNavAdmin');
  const labelNavHome = document.getElementById('labelNavHome');
  const labelNavPlay = document.getElementById('labelNavPlay');
  const labelNavCourses = document.getElementById('labelNavCourses');
  const labelNavDecks = document.getElementById('labelNavDecks');
  const labelNavStats = document.getElementById('labelNavStats');
  const labelNavLeaderboard = document.getElementById('labelNavLeaderboard');
  const labelNavAdmin = document.getElementById('labelNavAdmin');
  const btnHomeStreakChip = document.getElementById('btnHomeStreakChip');
  const homeStreakBadge = document.getElementById('homeStreakBadge');
  const pilotRankPill = document.getElementById('pilotRankPill');
  const homeScoreBadge = document.getElementById('homeScoreBadge');
  const btnHomeSettings = document.getElementById('btnHomeSettings');

  const homeHeroTitleTop = document.getElementById('homeHeroTitleTop');
  const homeHeroTitleAccent = document.getElementById('homeHeroTitleAccent');
  const labelPerkPlay = document.getElementById('labelPerkPlay');
  const labelPerkMemory = document.getElementById('labelPerkMemory');
  const labelPerkAnki = document.getElementById('labelPerkAnki');
  const titleSpaceWindow = document.getElementById('titleSpaceWindow');
  const promoMonitorBadge = document.getElementById('promoMonitorBadge');
  const btnPromoWeaponCycle = document.getElementById('btnPromoWeaponCycle');

  const labelStep1 = document.getElementById('labelStep1');
  const labelStep2 = document.getElementById('labelStep2');
  const labelStep3 = document.getElementById('labelStep3');

  const labelQuickStartTitle = document.getElementById('labelQuickStartTitle');
  const btnQuickStartAnki = document.getElementById('btnQuickStartAnki');
  const labelQuickAnkiBtn = document.getElementById('labelQuickAnkiBtn');
  const homeQuickStartGrid = document.getElementById('homeQuickStartGrid');

  const labelHomeProgressTitle = document.getElementById('labelHomeProgressTitle');
  const btnOpenStatsCard = document.getElementById('btnOpenStatsCard');
  const homeProgressRingCircle = document.getElementById('homeProgressRingCircle');
  const homeProgressPercent = document.getElementById('homeProgressPercent');
  const labelMetricLearned = document.getElementById('labelMetricLearned');
  const labelMetricDecks = document.getElementById('labelMetricDecks');
  const labelMetricStreak = document.getElementById('labelMetricStreak');
  const homeStatLearned = document.getElementById('homeStatLearned');
  const homeStatDecks = document.getElementById('homeStatDecks');
  const homeStatStreak = document.getElementById('homeStatStreak');

  const labelHomeTopTitle = document.getElementById('labelHomeTopTitle');
  const btnOpenLeaderboardCard = document.getElementById('btnOpenLeaderboardCard');
  const labelSeeAllTop = document.getElementById('labelSeeAllTop');
  const homeLeaderboardMiniList = document.getElementById('homeLeaderboardMiniList');

  const labelFeatCourses = document.getElementById('labelFeatCourses');
  const btnFooterAnki = document.getElementById('btnFooterAnki');
  const labelFeatAnki = document.getElementById('labelFeatAnki');
  const labelFeatSettings = document.getElementById('labelFeatSettings');
  const labelFeatVoice = document.getElementById('labelFeatVoice');

  // Боевой экран Академии
  const labelAcademySub = document.getElementById('labelAcademySub');
  const btnHudLangPair = document.getElementById('btnHudLangPair');
  const hudLangPairText = document.getElementById('hudLangPairText');
  const hudRingCircle = document.getElementById('hudRingCircle');
  const btnHudGameSettings = document.getElementById('btnHudGameSettings');

  const battleArenaFrame = document.getElementById('battleArenaFrame');
  const arenaWavePill = document.getElementById('arenaWavePill');
  const desktopTypingPromptBar = document.getElementById('desktopTypingPromptBar');
  const desktopTypingPreview = document.getElementById('desktopTypingPreview');
  const btnToggleDesktopKbd = document.getElementById('btnToggleDesktopKbd');

  const labelSidebarDecksHeader = document.getElementById('labelSidebarDecksHeader');
  const sidebarActiveDeckCard = document.getElementById('sidebarActiveDeckCard');
  const sidebarDeckThumb = document.getElementById('sidebarDeckThumb');
  const sidebarActiveLessonSub = document.getElementById('sidebarActiveLessonSub');
  const sidebarDeckProgFill = document.getElementById('sidebarDeckProgFill');
  const sidebarDeckProgNum = document.getElementById('sidebarDeckProgNum');
  const sidebarLessonsDrawer = document.getElementById('sidebarLessonsDrawer');
  const labelLessonsDrawerSummary = document.getElementById('labelLessonsDrawerSummary');
  const labelSidebarAnkiBtn = document.getElementById('labelSidebarAnkiBtn');

  const labelStudyModeHeader = document.getElementById('labelStudyModeHeader');
  const studyModeGroup = document.getElementById('studyModeGroup');
  const labelModeType = document.getElementById('labelModeType');
  const labelModeListen = document.getElementById('labelModeListen');
  const labelModeTranslate = document.getElementById('labelModeTranslate');

  const labelSidebarWeaponsHeader = document.getElementById('labelSidebarWeaponsHeader');
  const sidebarWeaponRow = document.getElementById('sidebarWeaponRow');
  const btnSidebarGameSettings = document.getElementById('btnSidebarGameSettings');
  const labelSidebarGameSettings = document.getElementById('labelSidebarGameSettings');

  const labelHitBanner = document.getElementById('labelHitBanner');
  const hitSpotlightCard = document.getElementById('hitSpotlightCard');
  const hitWordArticle = document.getElementById('hitWordArticle');
  const hitWordMain = document.getElementById('hitWordMain');
  const btnHitSpeak = document.getElementById('btnHitSpeak');
  const hitVisualBanner = document.getElementById('hitVisualBanner');
  const hitVisualEmoji = document.getElementById('hitVisualEmoji');
  const hitVisualTag = document.getElementById('hitVisualTag');
  const hitWordTranslation = document.getElementById('hitWordTranslation');
  const btnHitKnow = document.getElementById('btnHitKnow');
  const labelHitKnow = document.getElementById('labelHitKnow');
  const btnHitRepeat = document.getElementById('btnHitRepeat');
  const labelHitRepeat = document.getElementById('labelHitRepeat');

  const labelTodayCaption = document.getElementById('labelTodayCaption');
  const todayLearnedCount = document.getElementById('todayLearnedCount');

  // Новые диалоги: Настройки игры, Статистика и Рейтинг
  const gameSettingsDialog = document.getElementById('gameSettingsDialog');
  const gameSettingsDialogTitle = document.getElementById('gameSettingsDialogTitle');
  const gameSettingsDialogBody = document.getElementById('gameSettingsDialogBody');
  const btnCloseGameSettings = document.getElementById('btnCloseGameSettings');
  const labelSettingSpeed = document.getElementById('labelSettingSpeed');
  const settingsSpeedGroup = document.getElementById('settingsSpeedGroup');
  const labelSettingArticle = document.getElementById('labelSettingArticle');
  const btnSettingsToggleArticle = document.getElementById('btnSettingsToggleArticle');
  const labelSettingDesktopKbd = document.getElementById('labelSettingDesktopKbd');
  const btnSettingsToggleKbd = document.getElementById('btnSettingsToggleKbd');
  const labelSettingVoiceStudio = document.getElementById('labelSettingVoiceStudio');
  const btnOpenVoiceFromSettings = document.getElementById('btnOpenVoiceFromSettings');
  const labelSettingDictBtn = document.getElementById('labelSettingDictBtn');
  const btnOpenDictFromSettings = document.getElementById('btnOpenDictFromSettings');

  const statsDialog = document.getElementById('statsDialog');
  const statsDialogTitle = document.getElementById('statsDialogTitle');
  const statsDialogBody = document.getElementById('statsDialogBody');
  const btnCloseStatsDialog = document.getElementById('btnCloseStatsDialog');
  const statsModalGrid = document.getElementById('statsModalGrid');

  const leaderboardDialog = document.getElementById('leaderboardDialog');
  const leaderboardDialogTitle = document.getElementById('leaderboardDialogTitle');
  const leaderboardDialogBody = document.getElementById('leaderboardDialogBody');
  const btnCloseLeaderboardDialog = document.getElementById('btnCloseLeaderboardDialog');
  const leaderboardFullList = document.getElementById('leaderboardFullList');
  const labelAchievementsHeading = document.getElementById('labelAchievementsHeading');
  const achievementsGrid = document.getElementById('achievementsGrid');

  // Применяем сохранённое состояние экранной клавиатуры на ПК
  if (state.desktopKbdOpen) {
    document.body.classList.add('desktop-kbd-open');
  }

  // --- Геометрия игрового поля (рамка промо-монитора на Главной + рамка боевой арены в игре) ---
  function getPlayBounds() {
    if (state.screenMode === 'title') {
      if (titleSpaceWindow) {
        const rect = titleSpaceWindow.getBoundingClientRect();
        if (rect.width > 80 && rect.height > 70) {
          const left = rect.left + 10;
          const right = Math.max(left + 120, rect.right - 10);
          const top = rect.top + 42;
          const bottom = Math.max(top + 66, rect.bottom - 12);
          return {
            left,
            right,
            top,
            bottom,
            centerX: (left + right) / 2,
            clipRect: {
              x: rect.left + 2,
              y: rect.top + 2,
              w: Math.max(40, rect.width - 4),
              h: Math.max(40, rect.height - 4)
            }
          };
        }
      }

      const headerRect = titleHeaderCard ? titleHeaderCard.getBoundingClientRect() : null;
      const dockRect = titleBottomDock ? titleBottomDock.getBoundingClientRect() : null;
      const headerBottom = headerRect && headerRect.height > 0 ? headerRect.bottom : 140;
      const dockTop = dockRect && dockRect.height > 0 ? dockRect.top : (canvas.height - 280);
      const safeTop = Math.max(14, headerBottom + 8);
      const safeBottom = Math.max(safeTop + 60, dockTop - 8);
      return {
        left: 16,
        right: Math.max(280, canvas.width - 16),
        top: safeTop,
        bottom: safeBottom,
        centerX: canvas.width / 2,
        clipRect: null
      };
    }

    const kbdRect = ztypeKeyboard ? ztypeKeyboard.getBoundingClientRect() : { height: 0, top: canvas.height };
    const kbdVisible = kbdRect.height > 20;

    if (battleArenaFrame) {
      const aRect = battleArenaFrame.getBoundingClientRect();
      if (aRect.width > 120 && aRect.height > 120) {
        const left = aRect.left + 12;
        const right = Math.max(left + 180, aRect.right - 12);
        const top = aRect.top + 46;
        const rawBottom = kbdVisible
          ? Math.min(aRect.bottom - 10, kbdRect.top - 8)
          : (aRect.bottom - 54);
        const bottom = Math.max(top + 120, rawBottom);
        return {
          left,
          right,
          top,
          bottom,
          centerX: (left + right) / 2,
          clipRect: {
            x: aRect.left + 2,
            y: aRect.top + 2,
            w: Math.max(60, aRect.width - 4),
            h: Math.max(60, aRect.height - 4)
          }
        };
      }
    }

    const isDesktopWide = window.innerWidth > 960;
    const leftPad = isDesktopWide ? 280 : 8;
    const rightPad = isDesktopWide ? 308 : 8;
    const left = leftPad;
    const right = Math.max(left + 220, canvas.width - rightPad);
    const top = isDesktopWide ? 96 : 64;
    const bottom = Math.max(top + 160, kbdVisible ? kbdRect.top - 8 : canvas.height - 64);

    return {
      left,
      right,
      top,
      bottom,
      centerX: (left + right) / 2,
      clipRect: null
    };
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const bounds = getPlayBounds();
    state.ship.x = bounds.centerX;
    state.ship.targetY = state.screenMode === 'title'
      ? Math.max(bounds.top + 42, bounds.bottom - 24)
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

  // ==========================================================================
  // ДИНАМИЧЕСКАЯ РАСКЛАДКА КЛАВИАТУРЫ ZTYPE И СОПОСТАВЛЕНИЕ БУКВ (DE / EN / ES)
  // ==========================================================================
  const KEYBOARD_LAYOUTS = {
    de: [
      [
        { k: 'q', l: 'Q' }, { k: 'w', l: 'W' }, { k: 'e', l: 'E' }, { k: 'r', l: 'R' }, { k: 't', l: 'T' },
        { k: 'y', l: 'Y' }, { k: 'u', l: 'U', sub: 'ü' }, { k: 'i', l: 'I' }, { k: 'o', l: 'O', sub: 'ö' }, { k: 'p', l: 'P' }
      ],
      [
        { k: 'a', l: 'A', sub: 'ä' }, { k: 's', l: 'S', sub: 'ß' }, { k: 'd', l: 'D' }, { k: 'f', l: 'F' },
        { k: 'g', l: 'G' }, { k: 'h', l: 'H' }, { k: 'j', l: 'J' }, { k: 'k', l: 'K' }, { k: 'l', l: 'L' }
      ],
      [
        { action: 'reset' },
        { k: 'z', l: 'Z' }, { k: 'x', l: 'X' }, { k: 'c', l: 'C' }, { k: 'v', l: 'V' },
        { k: 'b', l: 'B' }, { k: 'n', l: 'N' }, { k: 'm', l: 'M' },
        { action: 'emp' }
      ]
    ],
    en: [
      [
        { k: 'q', l: 'Q' }, { k: 'w', l: 'W' }, { k: 'e', l: 'E' }, { k: 'r', l: 'R' }, { k: 't', l: 'T' },
        { k: 'y', l: 'Y' }, { k: 'u', l: 'U' }, { k: 'i', l: 'I' }, { k: 'o', l: 'O' }, { k: 'p', l: 'P' }
      ],
      [
        { k: 'a', l: 'A' }, { k: 's', l: 'S' }, { k: 'd', l: 'D' }, { k: 'f', l: 'F' },
        { k: 'g', l: 'G' }, { k: 'h', l: 'H' }, { k: 'j', l: 'J' }, { k: 'k', l: 'K' }, { k: 'l', l: 'L' }
      ],
      [
        { action: 'reset' },
        { k: 'z', l: 'Z' }, { k: 'x', l: 'X' }, { k: 'c', l: 'C' }, { k: 'v', l: 'V' },
        { k: 'b', l: 'B' }, { k: 'n', l: 'N' }, { k: 'm', l: 'M' },
        { action: 'emp' }
      ]
    ],
    es: [
      [
        { k: 'q', l: 'Q' }, { k: 'w', l: 'W' }, { k: 'e', l: 'E', sub: 'é' }, { k: 'r', l: 'R' }, { k: 't', l: 'T' },
        { k: 'y', l: 'Y' }, { k: 'u', l: 'U', sub: 'ú' }, { k: 'i', l: 'I', sub: 'í' }, { k: 'o', l: 'O', sub: 'ó' }, { k: 'p', l: 'P' }
      ],
      [
        { k: 'a', l: 'A', sub: 'á' }, { k: 's', l: 'S' }, { k: 'd', l: 'D' }, { k: 'f', l: 'F' },
        { k: 'g', l: 'G' }, { k: 'h', l: 'H' }, { k: 'j', l: 'J' }, { k: 'k', l: 'K' }, { k: 'l', l: 'L' }, { k: 'ñ', l: 'Ñ' }
      ],
      [
        { action: 'reset' },
        { k: 'z', l: 'Z' }, { k: 'x', l: 'X' }, { k: 'c', l: 'C' }, { k: 'v', l: 'V' },
        { k: 'b', l: 'B' }, { k: 'n', l: 'N' }, { k: 'm', l: 'M' },
        { action: 'emp' }
      ]
    ]
  };

  function bindVirtualKeyListeners(btn) {
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

  function renderZtypeKeyboard() {
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

  function getTargetString(wordEntry) {
    if (!wordEntry) return '';
    return state.typeWithArticle ? (wordEntry.withArticle || wordEntry.word) : wordEntry.word;
  }

  function mapTargetCharToBaseKey(ch) {
    if (!ch) return '';
    const low = ch.toLowerCase();
    if (low === 'ñ') {
      return state.targetLang === 'es' ? 'ñ' : 'n';
    }
    if (low === 'ä' || low === 'á' || low === 'à' || low === 'â') return 'a';
    if (low === 'é' || low === 'è' || low === 'ê' || low === 'ë') return 'e';
    if (low === 'í' || low === 'ì' || low === 'î' || low === 'ï') return 'i';
    if (low === 'ö' || low === 'ó' || low === 'ò' || low === 'ô') return 'o';
    if (low === 'ü' || low === 'ú' || low === 'ù' || low === 'û') return 'u';
    if (low === 'ß') return 's';
    return low;
  }

  function charsMatchTargetLang(inputChar, targetChar) {
    if (!inputChar || !targetChar) return { matched: false, umlautSub: false, eszettSub: false };
    const inp = inputChar.toLowerCase();
    const tgt = targetChar.toLowerCase();
    if (inp === tgt) return { matched: true, umlautSub: false, eszettSub: false };

    // Немецкие умлауты и эсцет
    if (tgt === 'ä' && inp === 'a') return { matched: true, umlautSub: true, eszettSub: false };
    if (tgt === 'ö' && inp === 'o') return { matched: true, umlautSub: true, eszettSub: false };
    if (tgt === 'ü' && inp === 'u') return { matched: true, umlautSub: true, eszettSub: false };
    if (tgt === 'ß' && inp === 's') return { matched: true, umlautSub: false, eszettSub: true };

    // Испанские диакритики и ñ (чтобы удобно печатать и с испанской, и со стандартной клавиатуры!)
    if ((tgt === 'á' || tgt === 'à') && (inp === 'a' || inp === 'á')) return { matched: true, umlautSub: false, eszettSub: false };
    if ((tgt === 'é' || tgt === 'è') && (inp === 'e' || inp === 'é')) return { matched: true, umlautSub: false, eszettSub: false };
    if ((tgt === 'í' || tgt === 'ì') && (inp === 'i' || inp === 'í')) return { matched: true, umlautSub: false, eszettSub: false };
    if ((tgt === 'ó' || tgt === 'ò') && (inp === 'o' || inp === 'ó')) return { matched: true, umlautSub: false, eszettSub: false };
    if ((tgt === 'ú' || tgt === 'ù') && (inp === 'u' || inp === 'ú')) return { matched: true, umlautSub: false, eszettSub: false };
    if (tgt === 'ñ' && (inp === 'ñ' || inp === 'n')) return { matched: true, umlautSub: false, eszettSub: false };

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

  // ==========================================================================
  // 1) ФОРМУЛА АВТО-ЗАМЕДЛЕНИЯ ДЛИННЫХ СОСТАВНЫХ СЛОВ (> 14 СИМВОЛОВ)
  //    Например, Kfz-Haftpflichtversicherung (27 букв) падает на ~70% медленнее!
  // ==========================================================================
  function computeWordLengthSpeedFactor(charCount) {
    const len = Math.max(1, charCount);
    if (len <= 7) {
      return 1.04;
    }
    if (len <= 14) {
      // Плавное снижение с 1.00 (8 букв) до 0.74 (14 букв)
      return 1.04 - (len - 7) * 0.043;
    }
    // Для длинных и составных слов (> 14 символов) включается прогрессивное защитное замедление:
    // 18 букв -> 0.52x, 22 буквы -> 0.39x, 27 букв -> 0.30x
    return Math.max(0.27, 0.74 * Math.pow(14 / len, 1.38));
  }

  const CANVAS_WORD_FONT = '"Rubik", "Noto Sans Hebrew", sans-serif';
  const CANVAS_HEADING_FONT = '"Exo 2", "Rubik", "Noto Sans Hebrew", sans-serif';

  function getWordFontPx(textLength) {
    const isMobile = canvas.width < 600;
    if (state.screenMode === 'title') {
      if (isMobile) {
        return textLength >= 17 ? 15 : 18;
      }
      if (textLength >= 18) return 17;
      if (textLength >= 13) return 19.5;
      return 22;
    }
    if (!isMobile) {
      if (textLength >= 23) return 18.5;
      if (textLength >= 18) return 21.5;
      if (textLength >= 13) return 25;
      return 29; // Rubik · 700 · 28–36px для слов в игре (der Motor)
    }
    if (textLength >= 22) return 14.5;
    if (textLength >= 17) return 16.5;
    if (textLength >= 12) return 19;
    return 22;
  }

  function getTopBadgeTextForWord(entry) {
    if (!entry) return '';
    const showArt = !state.typeWithArticle && Boolean(entry.article);
    const showTransHint = state.screenMode === 'play' && state.studyMode === 'translate';
    if (!showArt && !showTransHint) return '';
    if (showTransHint) {
      let shortTr = getWordTranslation(entry) || '';
      if (shortTr.length > 22) shortTr = shortTr.slice(0, 21) + '…';
      return showArt ? `${entry.article} · ${shortTr}` : shortTr;
    }
    return entry.article || '';
  }

  function measureWordCapsule(text, entry) {
    const fontPx = getWordFontPx(text.length);
    ctx.font = `700 ${fontPx}px ${CANVAS_WORD_FONT}`;
    const textW = ctx.measureText(text).width;
    const padX = canvas.width < 520 ? 11 : 15;
    const starExtra = entry && isEntryPinned(entry) ? 16 : 0;
    let boxW = textW + padX * 2 + starExtra + 16; // +16 под правый индикатор цели
    const badgeStr = getTopBadgeTextForWord(entry);
    if (badgeStr) {
      ctx.font = `700 12.5px ${CANVAS_WORD_FONT}`;
      const badgeW = ctx.measureText(badgeStr).width + 20;
      boxW = Math.max(boxW, badgeW);
    }
    const boxH = fontPx + 16 + (badgeStr ? 20 : 0);
    return { boxW, boxH, fontPx };
  }

  // ==========================================================================
  // 4) АНТИ-НАЛОЖЕНИЕ ПЛАШЕК СЛОВ В ПОЛЁТЕ И ПРИ СПАВНЕ
  //    Проверяет габариты по X и Y; если верхнее быстрое слово догоняет нижнее,
  //    временно выравнивает его скорость и мягко разводит плашки по горизонтали!
  // ==========================================================================
  function findSafeSpawnX(boxW, boxH, spawnY, wordList, bounds) {
    const halfW = Math.min((bounds.right - bounds.left) * 0.48, boxW / 2 + 6);
    const minX = bounds.left + halfW;
    const maxX = Math.max(minX + 2, bounds.right - halfW);

    // Генерируем равномерную сетку дорожек + случайное смещение
    const candidates = [];
    const laneCount = 9;
    for (let i = 0; i < laneCount; i++) {
      const frac = laneCount === 1 ? 0.5 : i / (laneCount - 1);
      const jitter = (Math.random() - 0.5) * 28;
      const cx = Math.max(minX, Math.min(maxX, minX + frac * (maxX - minX) + jitter));
      candidates.push(cx);
    }
    const shuffled = shuffleArray(candidates);

    let bestX = shuffled[0] || bounds.centerX;
    let bestClearance = -Infinity;

    for (const candX of shuffled) {
      let minScore = Infinity;
      let hardOverlap = false;

      for (const other of wordList) {
        const otherW = other.boxW || 130;
        const otherH = other.boxH || 48;
        const reqX = (boxW + otherW) * 0.5 + 16;
        const reqY = (boxH + otherH) * 0.5 + 22;
        const dx = Math.abs(other.x - candX);
        const dy = Math.abs(other.y - spawnY);

        if (dy < reqY && dx < reqX) {
          hardOverlap = true;
          minScore = Math.min(minScore, (dx - reqX) + (dy - reqY));
        } else if (dy < reqY + 65) {
          minScore = Math.min(minScore, dx - reqX * 0.65);
        }
      }

      if (!hardOverlap) {
        return { x: candX, clear: true };
      }
      if (minScore > bestClearance) {
        bestClearance = minScore;
        bestX = candX;
      }
    }

    return { x: bestX, clear: wordList.length === 0 };
  }

  function resolveWordCollisions(wordList, bounds, dt, minTopY) {
    if (!wordList || wordList.length < 2) return;

    // Обновляем габариты и сбрасываем временное торможение кадра
    for (const w of wordList) {
      if (!w.boxW || !w.boxH) {
        const m = measureWordCapsule(w.text, w.entry);
        w.boxW = m.boxW;
        w.boxH = m.boxH;
      }
      w.frameVy = w.vy;
    }

    // Сортируем снизу вверх (сначала нижние слова, чтобы верхние подстраивались под нижние)
    const byBottomFirst = wordList.slice().sort((a, b) => b.y - a.y);

    for (let i = 0; i < byBottomFirst.length; i++) {
      const lower = byBottomFirst[i];
      for (let j = i + 1; j < byBottomFirst.length; j++) {
        const upper = byBottomFirst[j]; // upper.y <= lower.y

        const minSepX = (upper.boxW + lower.boxW) * 0.5 + 14;
        const minSepY = (upper.boxH + lower.boxH) * 0.5 + 16;
        const dx = upper.x - lower.x;
        const absDx = Math.abs(dx);
        const dy = lower.y - upper.y;

        // Если верхнее слово догоняет нижнее в одной вертикальной полосе:
        if (absDx < minSepX && dy < minSepY + 30) {
          // 1. Временно выравниваем вертикальную скорость верхнего слова по нижнему!
          if (upper.frameVy > lower.frameVy * 0.92) {
            upper.frameVy = lower.frameVy * 0.92;
          }

          // 2. Мягко разводим слова по горизонтали туда, где больше места до края арены
          let dir = dx === 0 ? ((upper.id % 2 === 0) ? 1 : -1) : Math.sign(dx);
          const upperHalf = upper.boxW * 0.5 + 8;
          if (upper.x + dir * 24 > bounds.right - upperHalf) dir = -1;
          if (upper.x + dir * 24 < bounds.left + upperHalf) dir = 1;

          const overlapRatioX = 1 - absDx / Math.max(1, minSepX);
          const steerSpeed = (38 + 52 * overlapRatioX) * dt;
          upper.x += dir * steerSpeed;
          lower.x -= dir * steerSpeed * 0.35;

          // 3. Если плашки уже зашли в зону пересечения (например, после спавна или грави-волны) — мягко раздвигаем и по Y
          if (dy < minSepY) {
            const pushUp = Math.min((minSepY - dy) * 0.55, 90 * dt + 1.5);
            if (upper.y - pushUp >= minTopY) {
              upper.y -= pushUp;
            } else {
              lower.y += pushUp * 0.5;
            }
          }
        }
      }
    }

    // Применяем горизонтальные границы арены после разведения
    for (const w of wordList) {
      const half = Math.min((bounds.right - bounds.left) * 0.48, (w.boxW || 110) * 0.5 + 4);
      w.x = Math.max(bounds.left + half, Math.min(bounds.right - half, w.x));
    }
  }

  function separateFloatingTranslations(bounds) {
    const list = state.floatingTranslations;
    if (list.length < 2) return;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        const dy = Math.abs(a.y - b.y);
        const dx = Math.abs(a.x - b.x);
        if (dy < 66 && dx < 210) {
          if (a.y <= b.y) {
            a.y = Math.max(bounds.top + 38, b.y - 68);
          } else {
            b.y = Math.max(bounds.top + 38, a.y - 68);
          }
        }
      }
    }
  }

  // --- Ранг пилота, прогресс выученных слов, серия дней и виджеты Главной панели ---
  function updatePilotRankUI() {
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

  function updateTodayLearnedUI() {
    const tr = t();
    if (todayLearnedCount) {
      todayLearnedCount.textContent = tr.todayWordsVal(todayLearnedSet.size);
    }
  }

  function getCourseVisualTheme(course) {
    if (!course) return { cls: 'art-auto', emoji: '🚀', tag: 'Z-LINGO' };
    if (course.source === 'user') {
      return {
        cls: 'art-anki',
        emoji: course.originType === 'anki' ? '🗂️' : '✨',
        tag: course.originType === 'anki' ? 'ANKI' : 'MY DECK'
      };
    }
    const cat = inferCourseCategory(course);
    if (cat === 'auto') return { cls: 'art-auto', emoji: '🚘', tag: 'AUTO' };
    if (cat === 'business') return { cls: 'art-business', emoji: '💼', tag: 'BUSINESS' };
    if (cat === 'it') return { cls: 'art-it', emoji: '💻', tag: 'IT & AI' };
    if (cat === 'travel') return { cls: 'art-travel', emoji: '✈️', tag: 'TRAVEL' };
    if (cat === 'medicine') return { cls: 'art-base', emoji: '🩺', tag: 'MED' };
    return { cls: 'art-base', emoji: '🌍', tag: course.levelTag || 'A1–B2' };
  }

  function countLearnedWordsInCourse(course) {
    if (!course) return { learned: 0, total: 0 };
    const words = getAllWordsInCourse(course);
    let learned = 0;
    const cLang = course.targetLang || state.targetLang;
    for (const w of words) {
      if (learnedWordsSet.has(makeWordKey(cLang, w))) {
        learned++;
      }
    }
    return { learned, total: words.length };
  }

  function renderHomeQuickStartGrid() {
    if (!homeQuickStartGrid) return;
    const tr = t();
    const courses = getCoursesForTargetLang(state.targetLang);
    homeQuickStartGrid.innerHTML = '';

    const displayCourses = courses.slice(0, 4);
    displayCourses.forEach(course => {
      const theme = getCourseVisualTheme(course);
      const { learned, total } = countLearnedWordsInCourse(course);
      const pct = total > 0 ? Math.min(100, Math.round((learned / total) * 100)) : 0;
      const isActive = course.id === state.activeCourseId;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'qs-course-card' + (isActive ? ' active' : '');
      btn.innerHTML = `
        <div class="qs-card-art ${theme.cls}">
          <span class="qs-art-badge">${escapeHtml(theme.tag)}</span>
          <span class="qs-art-emoji">${escapeHtml(course.icon || theme.emoji)}</span>
          <span class="qs-art-play" data-launch-now="1" title="▶">▶</span>
        </div>
        <div class="qs-card-body">
          <div class="qs-card-title">${escapeHtml(getLocalizedField(course, 'titles'))}</div>
          <div class="qs-card-prog-row">
            <div class="qs-prog-bar">
              <div class="qs-prog-fill" style="width:${pct}%;"></div>
            </div>
            <span class="qs-prog-text">${learned} / ${total}</span>
          </div>
        </div>
      `;

      btn.addEventListener('click', (e) => {
        const clickedPlayIcon = e.target && e.target.closest && e.target.closest('[data-launch-now="1"]');
        if (clickedPlayIcon || course.id === state.activeCourseId) {
          if (course.id !== state.activeCourseId) {
            selectCourseLesson(course.id, 0, 0, false);
          }
          launchFromTitleScreen();
        } else {
          selectCourseLesson(course.id, 0, 0, false);
        }
      });

      homeQuickStartGrid.appendChild(btn);
    });

    if (displayCourses.length < 4) {
      const ankiCard = document.createElement('button');
      ankiCard.type = 'button';
      ankiCard.className = 'qs-course-card';
      ankiCard.innerHTML = `
        <div class="qs-card-art art-anki">
          <span class="qs-art-badge">+ .APKG</span>
          <span class="qs-art-emoji">📥</span>
          <span class="qs-art-play">＋</span>
        </div>
        <div class="qs-card-body">
          <div class="qs-card-title">${escapeHtml(tr.quickAnkiCardTitle)}</div>
          <div class="qs-card-prog-row">
            <div class="qs-prog-bar">
              <div class="qs-prog-fill" style="width:0%;"></div>
            </div>
            <span class="qs-prog-text">Anki</span>
          </div>
        </div>
      `;
      ankiCard.addEventListener('click', () => openCustomWordsModal('anki'));
      homeQuickStartGrid.appendChild(ankiCard);
    }
  }

  function getMergedLeaderboardEntries() {
    const tr = t();
    const myBest = Math.max(state.highScore, state.score);
    const baseRivals = [
      { name: 'LeoBerlin', score: 26540, avatar: '🧑‍🚀', isYou: false },
      { name: 'AnnaAT', score: 24980, avatar: '👩‍🚀', isYou: false },
      { name: 'VictorVienna', score: 23410, avatar: '🚀', isYou: false },
      { name: 'MayaTLV', score: 15800, avatar: '⚡', isYou: false },
      { name: 'CarlosMadrid', score: 9450, avatar: '🌟', isYou: false }
    ];
    const youEntry = {
      name: tr.youPilotLabel,
      score: myBest,
      avatar: '🏆',
      isYou: true
    };
    const all = [...baseRivals, youEntry].sort((a, b) => b.score - a.score);
    return all.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }

  function renderHomeDashboardWidgets() {
    const tr = t();
    renderHomeQuickStartGrid();

    // Круговая диаграмма «Твой прогресс»
    const langWords = getAllWordsInTargetLang(state.targetLang);
    let learnedInLang = 0;
    for (const w of langWords) {
      if (learnedWordsSet.has(makeWordKey(state.targetLang, w))) {
        learnedInLang++;
      }
    }
    const pct = langWords.length > 0
      ? Math.min(100, Math.round((learnedInLang / langWords.length) * 100))
      : 0;

    if (homeProgressPercent) homeProgressPercent.textContent = `${pct}%`;
    if (homeProgressRingCircle) {
      const circ = 219.9;
      homeProgressRingCircle.style.strokeDashoffset = (circ * (1 - pct / 100)).toFixed(1);
    }
    if (homeStatLearned) homeStatLearned.textContent = learnedWordsSet.size.toLocaleString();
    if (homeStatDecks) {
      const officialCount = ['de', 'en', 'es'].reduce((acc, lg) => {
        return acc + getOfficialCoursesForTargetLang(lg).length;
      }, 0);
      homeStatDecks.textContent = String(officialCount + state.userCourses.length);
    }
    if (homeStatStreak) {
      homeStatStreak.textContent = tr.streakDays(dailyProgress.bestStreakDays || 1);
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
      topSlice.forEach(row => {
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
        homeLeaderboardMiniList.appendChild(div);
      });
    }
  }

  function refreshHitSpotlightPinState() {
    if (!btnHitRepeat || !labelHitRepeat) return;
    const tr = t();
    const entry = state.lastSpotlightEntry;
    const pinned = entry ? isEntryPinned(entry, state.targetLang) : false;
    btnHitRepeat.classList.toggle('pinned', pinned);
    labelHitRepeat.textContent = pinned ? tr.hitPinnedBtn : tr.hitRepeatBtn;
  }

  function updateHitSpotlightCard(entry, isHitFlash = true) {
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

  function updateLearnedProgressUI() {
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

  function updatePinnedCountUI() {
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

  // --- Разлёт сразу множества слов к началу экрана (Грави-волна) ---
  function scatterWordsToTop(wordList, bounds, strength = 1.0, minTopOffset = 34) {
    state.repulsorWaves.push({
      x: state.ship.x,
      y: state.ship.y - 12,
      radius: 24,
      maxRadius: Math.max(240, (bounds.bottom - bounds.top) * (0.58 + 0.45 * strength)),
      alpha: 0.95,
      color: '#2dd4bf',
      coreColor: '#e0f2fe',
      lineWidth: strength >= 0.85 ? 4.5 : 3.0
    });

    if (!wordList || wordList.length === 0) return;

    const sorted = wordList.slice().sort((a, b) => a.x - b.x);
    const count = sorted.length;
    const padX = Math.min(72, Math.max(44, (bounds.right - bounds.left) * 0.1));
    const spanW = Math.max(100, (bounds.right - bounds.left) - padX * 2);
    const startX = bounds.left + padX;

    sorted.forEach((w, idx) => {
      const slotFrac = count === 1 ? 0.5 : idx / (count - 1);
      const targetX = startX + slotFrac * spanW + (Math.random() - 0.5) * 28;
      let desiredDx = (targetX - w.x) * (0.5 + 0.5 * strength);
      if (Math.abs(desiredDx) < 26) {
        desiredDx = (idx % 2 === 0 ? -1 : 1) * (30 + Math.random() * 28) * strength;
      }
      w.pushVx = desiredDx * 3.0;

      const rowOffset = (idx % 3) * 32;
      const startLineY = bounds.top + minTopOffset + rowOffset + Math.random() * 10;
      const currentDist = Math.max(42, w.y - startLineY);
      const liftDist = strength >= 0.85 ? currentDist : Math.max(58, currentDist * 0.62);

      w.pushVy = Math.min(w.pushVy || 0, -(liftDist * 2.95 + (w.vy || 16) * 0.8));
      w.hitFlash = Math.max(w.hitFlash || 0, 0.85);

      spawnParticles(w.x, w.y + 8, '#2dd4bf', strength >= 0.85 ? 6 : 3, 95);
    });
  }

  // --- Смена и прокачка оружия ---
  function equipWeapon(weaponId, withPreviewShot = true) {
    const found = WEAPONS.find(w => w.id === weaponId);
    if (!found) return;

    // Если пушка ещё закрыта — подсказываем игроку, сколько слов осталось выучить (а на стартовом экране даём разовый демо-выстрел!)
    if (!isWeaponUnlocked(found)) {
      const needMore = Math.max(1, found.unlockWords - learnedWordsSet.size);
      const msg = t().lockedWeaponHint(found.icon, getWeaponName(found), needMore, found.unlockWords);
      if (state.screenMode === 'title' && withPreviewShot) {
        sound.playWeaponEquip(found.id);
        const bounds = getPlayBounds();
        const target = state.demoWords.find(w => w.id === state.demoTargetId) || state.demoWords[0];
        const tx = target ? target.x : state.ship.x;
        const ty = target ? target.y : Math.max(bounds.top + 26, state.ship.y - 90);
        spawnWeaponVisualEffect(found.id, tx, ty, found.color);
      } else {
        sound.playMiss();
      }
      if (titleWeaponDesc) titleWeaponDesc.textContent = msg;
      state.weaponBannerText = msg;
      state.weaponBannerColor = '#fbbf24';
      state.weaponBannerTimer = 2.4;
      return;
    }

    state.weaponId = found.id;
    saveSettingsPatch({ weaponId: found.id });

    renderWeaponSelectors();
    updateHudWeaponBtn();

    if (withPreviewShot) {
      sound.playWeaponEquip(found.id);

      if (state.screenMode === 'play') {
        if (found.id === 'gravity' && state.running && !state.paused && state.gravityEquipCooldown <= 0) {
          const bounds = getPlayBounds();
          const needExtra = Math.min(Math.max(0, 4 - state.activeWords.length), state.wordQueue.length);
          for (let k = 0; k < needExtra; k++) {
            if (spawnNextWord(true)) {
              const spawned = state.activeWords[state.activeWords.length - 1];
              if (spawned) {
                spawned.y = bounds.top + Math.min(180, (bounds.bottom - bounds.top) * (0.32 + k * 0.08));
              }
            }
          }
          scatterWordsToTop(state.activeWords, bounds, 1.0, 34);
          state.spawnTimer = Math.max(state.spawnTimer, 2.8);
          state.gravityEquipCooldown = 5.0;
          state.weaponBannerText = t().gravitySurgeBanner;
          state.weaponBannerColor = found.color;
          state.weaponBannerTimer = 2.0;
        } else {
          state.weaponBannerText = t().weaponBanner(found.icon, getWeaponName(found));
          state.weaponBannerColor = found.color;
          state.weaponBannerTimer = 1.6;
        }
      } else {
        const bounds = getPlayBounds();
        const corridorH = bounds.bottom - bounds.top;
        const langPool = getAllWordsInTargetLang(state.targetLang);
        if (found.id === 'gravity' && corridorH >= 70) {
          while (state.demoWords.length < 5 && langPool.length > 0) {
            const sample = langPool[Math.floor(Math.random() * langPool.length)];
            const meas = measureWordCapsule(sample.word, sample);
            const pos = findSafeSpawnX(meas.boxW, meas.boxH, bounds.top + corridorH * 0.45, state.demoWords, bounds);
            state.demoWords.push({
              id: nextEntityId++,
              entry: sample,
              text: sample.word,
              typedCount: 0,
              boxW: meas.boxW,
              boxH: meas.boxH,
              x: pos.x,
              y: bounds.top + corridorH * (0.34 + Math.random() * 0.25),
              vy: Math.max(9, Math.min(16, corridorH * 0.065)),
              frameVy: 12,
              pushVx: 0,
              pushVy: 0,
              recoilY: 0,
              hitFlash: 0
            });
          }
          scatterWordsToTop(state.demoWords, bounds, 1.0, 26);
        } else {
          const target = state.demoWords.find(w => w.id === state.demoTargetId) || state.demoWords[0];
          const targetX = target ? target.x : state.ship.x;
          const targetY = target ? target.y : Math.max(bounds.top + 26, state.ship.y - 90);
          spawnWeaponVisualEffect(found.id, targetX, targetY, found.color);
        }
      }
    }
  }

  function updateHudWeaponBtn() {
    const w = getCurrentWeapon();
    if (btnWeaponMode) {
      btnWeaponMode.style.borderColor = w.color;
      btnWeaponMode.innerHTML = `${w.icon}<span class="hide-mobile" id="hudWeaponLabel"> ${escapeHtml(getWeaponName(w))}</span>`;
    }
    if (btnPromoWeaponCycle) {
      btnPromoWeaponCycle.textContent = w.icon;
      btnPromoWeaponCycle.style.borderColor = w.color;
      btnPromoWeaponCycle.title = `${getWeaponName(w)} — ${getWeaponDesc(w)}`;
    }
    if (titleWeaponDesc) {
      titleWeaponDesc.textContent = getWeaponDesc(w);
    }
  }

  function renderWeaponSelectors() {
    const current = getCurrentWeapon();
    const tr = t();
    [titleWeaponRow, overlayWeaponRow, sidebarWeaponRow].forEach(container => {
      if (!container) return;
      container.innerHTML = '';
      WEAPONS.forEach(w => {
        const unlocked = isWeaponUnlocked(w);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'weapon-pill-btn' +
          (w.id === current.id ? ' active' : '') +
          (!unlocked ? ' locked' : '');
        btn.style.setProperty('--w-color', w.color);

        const needMore = Math.max(0, w.unlockWords - learnedWordsSet.size);
        btn.title = unlocked
          ? `${getWeaponName(w)} — ${getWeaponDesc(w)}`
          : tr.lockedWeaponHint(w.icon, getWeaponName(w), needMore, w.unlockWords);

        btn.innerHTML = `
          <span class="weapon-pill-icon">${unlocked ? w.icon : '🔒'}</span>
          <span class="weapon-pill-name">${escapeHtml(getWeaponName(w))}</span>
          ${!unlocked ? `<span class="weapon-lock-tag">${escapeHtml(tr.lockTagShort(w.unlockWords))}</span>` : ''}
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
    } else if (weaponId === 'gravity') {
      state.lasers.push({
        kind: 'gravity',
        x1: noseX,
        y1: noseY,
        x2: targetX,
        y2: targetY,
        color: '#2dd4bf',
        coreColor: '#ccfbf1',
        width: 4.6,
        alpha: 0.95,
        decay: 6.0
      });
      state.shockwaves.push({
        x: targetX,
        y: targetY,
        radius: 5,
        maxRadius: 34,
        color: '#2dd4bf',
        alpha: 0.9
      });
      spawnParticles(targetX, targetY, '#5eead4', 9, 130);
    }
  }

  // --- Переключение между титульным экраном и боем ---
  function launchFromTitleScreen() {
    if (state.screenMode !== 'title') return;
    sound.init();
    sound.playWarpLaunch();

    state.decksOpenedFromPlay = false;
    state.homeSubView = 'home';
    if (homeDashboardView) homeDashboardView.classList.remove('hidden');
    if (decksPageView) decksPageView.classList.add('hidden');
    if (adminStudioView) adminStudioView.classList.add('hidden');
    if (btnNavHome) btnNavHome.classList.add('active');
    if (btnNavCourses) btnNavCourses.classList.remove('active');
    if (btnNavDecks) btnNavDecks.classList.remove('active');
    if (btnNavAdmin) btnNavAdmin.classList.remove('active');

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
    state.decksOpenedFromPlay = false;
    state.activeWords = [];
    state.lockedWordId = null;
    state.activeQuiz = null;
    state.lasers = [];
    state.missiles = [];
    state.repulsorWaves = [];
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

    switchHomeSubView('home');
    resizeCanvas();
    updatePilotRankUI();
    renderLevelSidebar();
    applyStaticUILocalization();
    requestAnimationFrame(() => {
      resizeCanvas();
      seedTitleDemoWords();
    });
  }

  // Мгновенный запуск промо-боя на стартовом экране: сразу спавнит слова в центре космоса, чтобы корабль стрелял с первой секунды!
  function seedTitleDemoWords() {
    if (state.screenMode !== 'title' || state.homeSubView !== 'home') return;
    const bounds = getPlayBounds();
    const corridorH = bounds.bottom - bounds.top;
    if (corridorH < 64) return;

    const { course } = getActiveSelection();
    const courseWords = course ? getAllWordsInCourse(course) : [];
    const demoPool = courseWords.length >= 4 ? courseWords : getAllWordsInTargetLang(state.targetLang);
    if (demoPool.length === 0) return;

    state.demoWords = [];
    state.demoTargetId = null;

    const desiredCount = canvas.width > 640 ? 3 : 2;
    const laneFracs = desiredCount === 3 ? [0.24, 0.74, 0.48] : [0.3, 0.72];
    const yFracs = desiredCount === 3 ? [0.22, 0.34, 0.14] : [0.24, 0.36];
    const usedRaw = new Set();

    for (let i = 0; i < desiredCount; i++) {
      let sample = null;
      for (let tries = 0; tries < 10; tries++) {
        const cand = demoPool[Math.floor(Math.random() * demoPool.length)];
        if (cand && !usedRaw.has(cand.raw)) {
          sample = cand;
          usedRaw.add(cand.raw);
          break;
        }
      }
      if (!sample) sample = demoPool[i % demoPool.length];
      if (!sample) continue;

      const meas = measureWordCapsule(sample.word, sample);
      const halfW = Math.min((bounds.right - bounds.left) * 0.42, meas.boxW * 0.5);
      const rawX = bounds.left + (bounds.right - bounds.left) * laneFracs[i];
      const clampedX = Math.max(bounds.left + halfW + 12, Math.min(bounds.right - halfW - 12, rawX));
      const spawnY = Math.min(
        Math.max(bounds.top + 22, bounds.top + corridorH * yFracs[i]),
        Math.max(bounds.top + 26, bounds.bottom - 62)
      );

      state.demoWords.push({
        id: nextEntityId++,
        entry: sample,
        text: sample.word,
        typedCount: i === 1 && sample.word.length > 4 ? 2 : 0,
        boxW: meas.boxW,
        boxH: meas.boxH,
        x: clampedX,
        y: spawnY,
        vy: Math.max(8.5, Math.min(15, corridorH * 0.058)) * computeWordLengthSpeedFactor(sample.word.length),
        frameVy: 11,
        pushVx: 0,
        pushVy: 0,
        recoilY: 0,
        hitFlash: 0
      });
    }

    state.lastPromoRect = { left: bounds.left, top: bounds.top };

    if (state.demoWords.length > 0) {
      const firstTarget = state.demoWords[Math.min(1, state.demoWords.length - 1)];
      state.demoTargetId = firstTarget.id;
      state.ship.x = bounds.centerX;
      state.ship.y = Math.max(bounds.top + 42, bounds.bottom - 22);
      state.ship.targetY = state.ship.y;
      const aimAngle = Math.atan2(firstTarget.y - state.ship.y, firstTarget.x - state.ship.x);
      state.ship.targetAngle = aimAngle;
      state.ship.angle = aimAngle;
      state.demoFireTimer = 0.12;
      state.demoSpawnTimer = 0.9;
    }
  }

  function updateTitleDemo(dt) {
    const bounds = getPlayBounds();
    const corridorH = bounds.bottom - bounds.top;

    // Если пользователь прокрутил дашборд на мобильном — плавно смещаем демо-сцену вместе с окном монитора!
    if (state.lastPromoRect) {
      const dx = bounds.left - state.lastPromoRect.left;
      const dy = bounds.top - state.lastPromoRect.top;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        state.ship.x += dx;
        state.ship.y += dy;
        state.ship.targetY += dy;
        for (const dw of state.demoWords) { dw.x += dx; dw.y += dy; }
        for (const ft of state.floatingTranslations) { ft.x += dx; ft.y += dy; }
        for (const sw of state.shockwaves) { sw.x += dx; sw.y += dy; }
        for (const rw of state.repulsorWaves) { rw.x += dx; rw.y += dy; }
        for (const p of state.particles) { p.x += dx; p.y += dy; }
        for (const l of state.lasers) {
          if (Array.isArray(l.points)) l.points.forEach(pt => { pt.x += dx; pt.y += dy; });
          if (Array.isArray(l.branch)) l.branch.forEach(pt => { pt.x += dx; pt.y += dy; });
          if (typeof l.x1 === 'number') { l.x1 += dx; l.x2 += dx; l.y1 += dy; l.y2 += dy; }
        }
      }
    }
    state.lastPromoRect = { left: bounds.left, top: bounds.top };

    const swayAmp = Math.min(22, Math.max(8, (bounds.right - bounds.left) * 0.08));
    state.ship.targetY = Math.max(bounds.top + 40, bounds.bottom - 22);
    state.ship.x = bounds.centerX + Math.sin(performance.now() * 0.0011) * swayAmp;

    if (corridorH < 64) {
      state.demoWords = [];
      state.demoTargetId = null;
      state.ship.targetAngle = -Math.PI / 2;
      return;
    }

    const spawnY = bounds.top + 22;
    const maxDemoWords = state.weaponId === 'gravity'
      ? (canvas.width > 640 ? 5 : 3)
      : (canvas.width > 640 ? 3 : 2);
    const { course } = getActiveSelection();
    const courseWords = course ? getAllWordsInCourse(course) : [];
    const demoPool = courseWords.length >= 4 ? courseWords : getAllWordsInTargetLang(state.targetLang);

    state.demoSpawnTimer -= dt;
    if (state.demoSpawnTimer <= 0 && state.demoWords.length < maxDemoWords && demoPool.length > 0) {
      const sample = demoPool[Math.floor(Math.random() * demoPool.length)];
      if (sample) {
        const meas = measureWordCapsule(sample.word, sample);
        const pos = findSafeSpawnX(meas.boxW, meas.boxH, spawnY, state.demoWords, bounds);
        if (pos.clear || state.demoWords.length === 0) {
          state.demoWords.push({
            id: nextEntityId++,
            entry: sample,
            text: sample.word,
            typedCount: 0,
            boxW: meas.boxW,
            boxH: meas.boxH,
            x: pos.x,
            y: spawnY,
            vy: Math.max(8.5, Math.min(15, corridorH * 0.058)) * computeWordLengthSpeedFactor(sample.word.length),
            frameVy: 11,
            pushVx: 0,
            pushVy: 0,
            recoilY: 0,
            hitFlash: 0
          });
        }
      }
      state.demoSpawnTimer = state.weaponId === 'gravity' ? 0.75 : 0.95;
    }

    resolveWordCollisions(state.demoWords, bounds, dt, bounds.top + 20);

    for (let i = state.demoWords.length - 1; i >= 0; i--) {
      const dw = state.demoWords[i];
      if (dw.pushVx) {
        dw.x += dw.pushVx * dt;
        dw.pushVx *= Math.exp(-3.0 * dt);
        if (Math.abs(dw.pushVx) < 1) dw.pushVx = 0;
      }
      if (dw.pushVy) {
        dw.y += dw.pushVy * dt;
        dw.pushVy *= Math.exp(-2.8 * dt);
        if (Math.abs(dw.pushVy) < 1) dw.pushVy = 0;
      }

      if (dw.recoilY > 0) {
        dw.y = Math.max(bounds.top + 20, dw.y - dw.recoilY * 5.5 * dt);
        dw.recoilY = Math.max(0, dw.recoilY - 24 * dt);
      } else {
        dw.y += (dw.frameVy ?? dw.vy) * dt;
      }

      if (dw.y < bounds.top + 20) {
        dw.y = bounds.top + 20;
        if (dw.pushVy < 0) dw.pushVy = 0;
      }
      if (dw.hitFlash > 0) dw.hitFlash = Math.max(0, dw.hitFlash - dt * 5);

      if (dw.y > state.ship.y - 32) {
        state.demoWords.splice(i, 1);
        if (state.demoTargetId === dw.id) state.demoTargetId = null;
      }
    }

    let activeDemoTarget = state.demoWords.find(w => w.id === state.demoTargetId);
    if (!activeDemoTarget && state.demoWords.length > 0) {
      // Наводимся на нижнее (ближайшее к кораблю) слово — выглядит как живой автопилот!
      activeDemoTarget = state.demoWords.reduce((best, cur) => (cur.y > best.y ? cur : best), state.demoWords[0]);
      state.demoTargetId = activeDemoTarget.id;
    }

    if (activeDemoTarget) {
      state.ship.targetAngle = Math.atan2(activeDemoTarget.y - state.ship.y, activeDemoTarget.x - state.ship.x);
    } else {
      state.ship.targetAngle = -Math.PI / 2;
    }

    state.demoFireTimer -= dt;
    if (state.demoFireTimer <= 0 && activeDemoTarget) {
      const target = activeDemoTarget;
      if (target.y >= bounds.top + 16) {
        target.typedCount++;
        target.hitFlash = 1.0;
        target.recoilY = 2.2;
        const style = getArticleStyle(target.entry.article, state.targetLang);
        spawnWeaponVisualEffect(state.weaponId, target.x, target.y, style.main);

        if (state.weaponId === 'gravity' && target.typedCount % 2 === 1) {
          scatterWordsToTop(state.demoWords, bounds, 0.72, 24);
        }

        if (target.typedCount >= target.text.length) {
          const idx = state.demoWords.findIndex(w => w.id === target.id);
          if (idx !== -1) state.demoWords.splice(idx, 1);
          state.demoTargetId = null;

          state.shockwaves.push({
            x: target.x,
            y: target.y,
            radius: 6,
            maxRadius: 54,
            color: style.main,
            alpha: 0.92
          });
          spawnParticles(target.x, target.y, style.main, 18, 145);
          state.floatingTranslations.push({
            x: target.x,
            y: Math.min(bounds.bottom - 34, Math.max(bounds.top + 34, target.y)),
            vy: -10,
            entry: target.entry,
            rawDe: target.entry.raw,
            color: style.main,
            life: 0,
            maxLife: 2.7
          });
          separateFloatingTranslations(bounds);
          state.demoFireTimer = 0.5;
        } else {
          state.demoFireTimer = 0.13;
        }
      } else {
        state.demoFireTimer = 0.14;
      }
    }
  }

  // ==========================================================================
  // 5) ПЕРЕКЛЮЧЕНИЕ ФИЛЬТРА 1 («Я учу») И ФИЛЬТРА 2 («Перевод / Интерфейс»)
  // ==========================================================================
  function updateStudyModeButtonsUI() {
    if (!studyModeGroup) return;
    studyModeGroup.querySelectorAll('.study-mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.studyMode === state.studyMode);
    });
  }

  function setNativeLanguage(langId) {
    if (!UI_TEXT[langId]) return;
    state.nativeLang = langId;
    saveSettingsPatch({ nativeLang: langId });
    document.documentElement.lang = langId;

    const modeObj = state.nativeLangModes.find(m => m.id === langId) || state.nativeLangModes[0];
    if (btnLangMode) btnLangMode.textContent = modeObj.short;

    document.querySelectorAll('.native-lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.nativeLang === langId);
    });

    applyStaticUILocalization();
    renderWeaponSelectors();
    updateHudWeaponBtn();
    renderLevelSidebar();
    refreshOverlayContent();
    renderTtsSettingsUI();
    updatePilotRankUI();
    updateLearnedProgressUI();
    updatePinnedCountUI();

    if (state.lastSpotlightEntry) {
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

  function setTargetLanguage(targetLangId) {
    if (!TARGET_LANG_META[targetLangId]) return;
    const changed = state.targetLang !== targetLangId;
    state.targetLang = targetLangId;
    saveSettingsPatch({ targetLang: targetLangId });

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

    applyStaticUILocalization();
    renderLevelSidebar();
    refreshOverlayContent();
    renderTtsSettingsUI();
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

  function applyStaticUILocalization() {
    const tr = t();
    const isHe = isHebrewUI();
    const targetMeta = TARGET_LANG_META[state.targetLang] || TARGET_LANG_META.de;
    const targetLangLocalName = targetMeta.names[state.nativeLang] || targetMeta.names.en;
    const nativeLangLocalName = (tr.nativeLangNames && tr.nativeLangNames[state.nativeLang]) || state.nativeLang.toUpperCase();

    if (arcadeTitleScreen) arcadeTitleScreen.dir = isHe ? 'rtl' : 'ltr';
    if (overlayCard) overlayCard.dir = isHe ? 'rtl' : 'ltr';
    if (ttsDialogBody) ttsDialogBody.dir = isHe ? 'rtl' : 'ltr';
    if (catalogDialogBody) catalogDialogBody.dir = isHe ? 'rtl' : 'ltr';
    if (customDialogBody) customDialogBody.dir = isHe ? 'rtl' : 'ltr';
    if (dictDialogBody) dictDialogBody.dir = isHe ? 'rtl' : 'ltr';
    if (gameSettingsDialogBody) gameSettingsDialogBody.dir = isHe ? 'rtl' : 'ltr';
    if (statsDialogBody) statsDialogBody.dir = isHe ? 'rtl' : 'ltr';
    if (leaderboardDialogBody) leaderboardDialogBody.dir = isHe ? 'rtl' : 'ltr';

    if (labelNativeFilter) labelNativeFilter.textContent = tr.nativeFilterLabel;
    if (labelTargetFilter) labelTargetFilter.textContent = tr.chooseLangTitle;

    document.querySelectorAll('[data-tlang-name]').forEach(span => {
      const code = span.getAttribute('data-tlang-name');
      if (TARGET_LANG_META[code]) {
        span.textContent = TARGET_LANG_META[code].names[state.nativeLang] || TARGET_LANG_META[code].names.en;
      }
    });

    // Z-LINGO 2.0: Навбар Главной страницы
    if (arcadeLogoMain) arcadeLogoMain.textContent = 'Z-LINGO';
    if (homeBrandSub) homeBrandSub.textContent = tr.homeBrandSub;
    if (labelNavHome) labelNavHome.textContent = tr.navHome;
    if (labelNavPlay) labelNavPlay.textContent = tr.navPlay;
    if (labelNavCourses) labelNavCourses.textContent = tr.navCourses;
    if (labelNavDecks) labelNavDecks.textContent = tr.navDecks;
    if (labelNavStats) labelNavStats.textContent = tr.navStats;
    if (labelNavLeaderboard) labelNavLeaderboard.textContent = tr.navLeaderboard;
    if (labelNavAdmin) labelNavAdmin.textContent = tr.navAdmin;

    // Hero-блок и рамка живого промо-боя
    const { course, mod, lesson } = getActiveSelection();
    if (homeHeroTitleTop) homeHeroTitleTop.textContent = tr.heroTitleTop;
    if (homeHeroTitleAccent) homeHeroTitleAccent.textContent = tr.heroTitleAccent;
    if (titleTagline) titleTagline.textContent = tr.titleTagline(targetLangLocalName);
    if (labelPerkPlay) labelPerkPlay.textContent = tr.perkPlay;
    if (labelPerkMemory) labelPerkMemory.textContent = tr.perkMemory;
    if (labelPerkAnki) labelPerkAnki.textContent = tr.perkAnki;
    if (labelArcadeLaunch) labelArcadeLaunch.textContent = tr.launchFreeBtn;

    if (arcadeLogoSub && course) {
      const lNum = state.activeLessonIndex + 1;
      arcadeLogoSub.textContent = `${course.icon || '🚀'} ${getLocalizedField(course, 'titles')} · #${lNum} ▾`;
    }
    if (promoMonitorBadge && course) {
      promoMonitorBadge.textContent = tr.promoMonitorBadge(
        state.activeLessonIndex + 1,
        getLocalizedField(course, 'titles').toUpperCase()
      );
    }

    // Полоса 3 шагов и сетка Быстрого старта / Прогресса / Топа
    if (labelStep1) labelStep1.textContent = tr.step1;
    if (labelStep2) labelStep2.textContent = tr.step2;
    if (labelStep3) labelStep3.textContent = tr.step3;

    if (labelQuickStartTitle) labelQuickStartTitle.textContent = tr.quickStartTitle;
    if (labelQuickAnkiBtn) labelQuickAnkiBtn.textContent = tr.quickAnkiBtn;
    if (labelOpenCatalogTitle) labelOpenCatalogTitle.textContent = tr.allCoursesBtn;
    if (titleArsenalLabel) titleArsenalLabel.textContent = tr.titleArsenalLabel;

    if (labelHomeProgressTitle) labelHomeProgressTitle.textContent = tr.homeProgressTitle;
    if (labelMetricLearned) labelMetricLearned.textContent = tr.metricLearned;
    if (labelMetricDecks) labelMetricDecks.textContent = tr.metricDecks;
    if (labelMetricStreak) labelMetricStreak.textContent = tr.metricStreak;
    if (labelHomeTopTitle) labelHomeTopTitle.textContent = tr.homeTopTitle;
    if (labelSeeAllTop) labelSeeAllTop.textContent = tr.seeAllTop;

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
    if (hudLangPairText) {
      hudLangPairText.textContent = `${targetMeta.flag} ${targetLangLocalName} → ${nativeLangLocalName}`;
    }
    if (labelCatalogHud) labelCatalogHud.textContent = tr.coursesHudBtn;
    if (btnSidebarCatalog) btnSidebarCatalog.textContent = `${tr.seeAllTop} ▾`;
    if (btnOverlayCatalog) btnOverlayCatalog.textContent = `🗂️ ${tr.allCoursesBtn}`;
    if (overlayWeaponTitle) overlayWeaponTitle.textContent = tr.overlayWeaponTitle;
    if (btnBackToTitle) btnBackToTitle.textContent = tr.backToMenuBtn;

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

    if (quizHeaderTitle) quizHeaderTitle.textContent = tr.quizHeader;
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
    if (labelDecksFiltersTitle) labelDecksFiltersTitle.textContent = tr.decksFiltersTitle;
    if (labelDecksLangHeader) labelDecksLangHeader.textContent = tr.decksLangHeader;
    if (labelDecksSourceHeader) labelDecksSourceHeader.textContent = tr.decksSourceHeader;
    if (labelDecksSrcAll) labelDecksSrcAll.textContent = tr.decksSrcAll;
    if (labelDecksSrcOfficial) labelDecksSrcOfficial.textContent = tr.decksSrcOfficial;
    if (labelDecksSrcUser) labelDecksSrcUser.textContent = tr.decksSrcUser;
    if (labelDecksCategoryHeader) labelDecksCategoryHeader.textContent = tr.decksCategoryHeader;
    if (labelDecksLevelHeader) labelDecksLevelHeader.textContent = tr.decksLevelHeader;
    if (btnDecksLevelAll) btnDecksLevelAll.textContent = tr.decksLevelAll;
    if (labelDecksOpenAdmin) labelDecksOpenAdmin.textContent = tr.decksAdminBtn;
    if (labelDecksSidebarProgTitle) labelDecksSidebarProgTitle.textContent = tr.decksSidebarProgTitle;
    if (labelDecksInProgressSub) labelDecksInProgressSub.textContent = tr.decksInProgressSub;
    if (decksHeroTitle) {
      decksHeroTitle.textContent = state.decksNavMode === 'courses' ? tr.decksHeroTitleCourses : tr.decksHeroTitleMy;
    }
    if (decksHeroSubtitle) decksHeroSubtitle.textContent = tr.decksHeroSub;
    if (decksSearchInput) decksSearchInput.placeholder = tr.decksSearchPlaceholder;
    if (labelDecksImportAnkiBtn) labelDecksImportAnkiBtn.textContent = tr.decksImportAnkiBtn;
    if (labelDecksCreateBtn) labelDecksCreateBtn.textContent = tr.decksCreateBtn;
    if (labelDecksStatTotal) labelDecksStatTotal.textContent = tr.decksStatTotal;
    if (labelDecksStatLearned) labelDecksStatLearned.textContent = tr.decksStatLearned;
    if (labelDecksStatStreak) labelDecksStatStreak.textContent = tr.decksStatStreak;
    if (labelDecksSubtabCourses) labelDecksSubtabCourses.textContent = tr.navCourses;
    if (labelDecksSubtabMyDecks) labelDecksSubtabMyDecks.textContent = tr.navDecks;
    if (labelDecksReturnBattle) labelDecksReturnBattle.textContent = tr.decksReturnBattle;
    if (labelDecksViewGrid) labelDecksViewGrid.textContent = tr.decksViewGrid;
    if (labelDecksViewList) labelDecksViewList.textContent = tr.decksViewList;
    if (labelDecksContinueHeading) labelDecksContinueHeading.textContent = tr.decksContinueHeading;
    if (labelDecksAllHeading) labelDecksAllHeading.textContent = tr.decksAllHeading;

    if (btnSpeedMode) btnSpeedMode.textContent = preset.label;
    if (btnTargetLangHud) btnTargetLangHud.textContent = `${targetMeta.flag} ${targetMeta.code}`;

    if (course && hudLevelTitle) {
      hudLevelTitle.textContent = state.activeCustomRoundTitle
        ? state.activeCustomRoundTitle
        : `${course.icon || '🚀'} ${getLocalizedField(course, 'titles')}`;
    }
    if (arenaWavePill) {
      const waveNum = Math.max(1, Math.ceil((state.wordsDestroyedInLevel + 1) / 4));
      arenaWavePill.textContent = tr.arenaWaveLabel(state.activeLessonIndex + 1, waveNum);
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
    }
    refreshHitSpotlightPinState();
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

  function renderTtsSettingsUI() {
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

  // ==========================================================================
  // 6 & 8) 3-СТУПЕНЧАТАЯ СТРУКТУРА КУРСОВ + ЧЁТКАЯ МАРКИРОВКА (САЙТ vs ЛИЧНЫЕ)
  // ==========================================================================
  function getNextLessonPointer() {
    const { course, mod } = getActiveSelection();
    if (!course || !mod) return null;

    if (state.activeLessonIndex + 1 < mod.lessons.length) {
      return {
        courseId: course.id,
        moduleIndex: state.activeModuleIndex,
        lessonIndex: state.activeLessonIndex + 1,
        lesson: mod.lessons[state.activeLessonIndex + 1]
      };
    }
    if (state.activeModuleIndex + 1 < course.modules.length) {
      const nextMod = course.modules[state.activeModuleIndex + 1];
      if (nextMod && nextMod.lessons && nextMod.lessons.length > 0) {
        return {
          courseId: course.id,
          moduleIndex: state.activeModuleIndex + 1,
          lessonIndex: 0,
          lesson: nextMod.lessons[0]
        };
      }
    }
    return null;
  }

  function renderLevelSidebar() {
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
            selectCourseLesson(course.id, mIdx, lIdx, true);
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
            selectCourseLesson(course.id, state.activeModuleIndex, lIdx, false);
          } else {
            selectCourseLesson(course.id, state.activeModuleIndex, lIdx, true);
          }
        });
        chipBox.appendChild(chip);
      });
    });
  }

  function selectCourseLesson(courseId, moduleIndex, lessonIndex, showIntro = true) {
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
    }

    renderLevelSidebar();
    applyStaticUILocalization();
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

  // ==========================================================================
  // ПОЛНОЭКРАННАЯ СТРАНИЦА «МОИ КОЛОДЫ» / «КУРСЫ» (БЕЗ ВСПЛЫВАЮЩИХ ОКОН!)
  // ==========================================================================
  function getDeckArtClass(course) {
    if (!course) return '';
    if (course.source === 'user') return course.originType === 'anki' ? 'art-anki' : 'art-it';
    const cat = inferCourseCategory(course);
    if (cat === 'auto') return 'art-auto';
    if (cat === 'business') return 'art-business';
    if (cat === 'travel') return 'art-travel';
    if (cat === 'it') return 'art-it';
    const id = String(course.id || '').toLowerCase();
    const icon = course.icon || '';
    if (id.includes('food') || icon.includes('🥐') || icon.includes('🍽')) return 'art-food';
    return '';
  }

  function getCourseCategoryBadgeText(course) {
    if (!course || course.source === 'user') return '';
    const catId = inferCourseCategory(course);
    const catObj = getCategoryById(catId);
    if (!catObj) return '';
    const title = getLocalizedField(catObj, 'titles') || catId;
    return `${catObj.icon || '🗂️'} ${title}`.trim();
  }

  function normalizeCefrBucket(levelTag) {
    const raw = String(levelTag || '').toUpperCase().replace(/-/g, '–').trim();
    if (!raw) return 'A2–B1';
    if (raw.includes('A1') && raw.includes('A2')) return 'A1–A2';
    if (raw.includes('A2') && raw.includes('B1')) return 'A2–B1';
    if (raw.includes('B1') && raw.includes('B2')) return 'B1–B2';
    if (raw === 'A1') return 'A1–A2';
    if (raw === 'A2') return 'A2–B1';
    if (raw === 'B1') return 'B1';
    if (raw === 'B2' || raw.includes('C1')) return 'B1–B2';
    return raw;
  }

  function courseMatchesLevelFilter(course, filterVal) {
    if (!filterVal || filterVal === 'all') return true;
    const raw = String(course.levelTag || '').toUpperCase().replace(/-/g, '–');
    const bucket = normalizeCefrBucket(course.levelTag);
    if (bucket === filterVal) return true;
    if (filterVal === 'B1' && raw.includes('B1')) return true;
    if (filterVal === 'A1–A2' && (raw.includes('A1') || raw === 'A2')) return true;
    if (filterVal === 'A2–B1' && (raw.includes('A2') || raw === 'A1–B1')) return true;
    if (filterVal === 'B1–B2' && (raw.includes('B2') || raw.includes('C1'))) return true;
    return false;
  }

  function computeDeckStats(course) {
    const allWords = getAllWordsInCourse(course);
    const totalWords = allWords.length;
    let learnedInCourse = 0;
    for (const w of allWords) {
      if (learnedWordsSet.has(makeWordKey(course.targetLang, w))) {
        learnedInCourse++;
      }
    }

    const flatLessons = [];
    let nextModIdx = 0;
    let nextLessonIdx = 0;
    let foundNext = false;

    (course.modules || []).forEach((mod, mIdx) => {
      (mod.lessons || []).forEach((ls, lIdx) => {
        const isDone = state.completedLessonIds.has(ls.id);
        if (!foundNext && !isDone) {
          nextModIdx = mIdx;
          nextLessonIdx = lIdx;
          foundNext = true;
        }
        flatLessons.push({ mod, ls, mIdx, lIdx, isDone });
      });
    });

    const regularLessons = flatLessons.filter(x => !x.ls.isBoss);
    const trackedLessons = regularLessons.length > 0 ? regularLessons : flatLessons;
    const totalLessons = Math.max(1, trackedLessons.length);
    const doneLessons = trackedLessons.filter(x => x.isDone).length;

    const lessonRatio = doneLessons / totalLessons;
    const wordRatio = totalWords > 0 ? learnedInCourse / totalWords : 0;
    const pct = Math.min(100, Math.round(Math.max(lessonRatio, wordRatio) * 100));
    const isStarted = doneLessons > 0 || learnedInCourse > 0 || course.id === state.activeCourseId;

    return {
      totalWords,
      learnedInCourse,
      totalLessons,
      doneLessons,
      pct,
      isStarted,
      nextModIdx,
      nextLessonIdx,
      previewLessons: trackedLessons.slice(0, 3)
    };
  }

  function switchHomeSubView(subView) {
    state.homeSubView = (subView === 'decks' || subView === 'admin') ? subView : 'home';
    const onHome = state.homeSubView === 'home';
    const onDecks = state.homeSubView === 'decks';
    const onAdmin = state.homeSubView === 'admin';

    if (homeDashboardView) homeDashboardView.classList.toggle('hidden', !onHome);
    if (decksPageView) decksPageView.classList.toggle('hidden', !onDecks);
    if (adminStudioView) adminStudioView.classList.toggle('hidden', !onAdmin);

    if (btnNavHome) btnNavHome.classList.toggle('active', onHome);
    if (btnNavCourses) btnNavCourses.classList.toggle('active', onDecks && state.decksNavMode === 'courses');
    if (btnNavDecks) btnNavDecks.classList.toggle('active', onDecks && state.decksNavMode !== 'courses');
    if (btnNavAdmin) btnNavAdmin.classList.toggle('active', onAdmin);

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
    } else if (state.screenMode === 'title') {
      resizeCanvas();
      requestAnimationFrame(() => {
        resizeCanvas();
        seedTitleDemoWords();
      });
    }
  }

  function openAdminStudio(focusCourseLang = '') {
    if (courseBrowserDialog && courseBrowserDialog.open) {
      courseBrowserDialog.close();
    }
    if (state.screenMode === 'play') {
      state.paused = true;
      state.decksOpenedFromPlay = true;
      state.screenMode = 'title';
      centerOverlay.classList.add('hidden');
      if (arcadeTitleScreen) arcadeTitleScreen.hidden = false;
      document.body.classList.remove('mode-play');
      document.body.classList.add('mode-title');
    }
    if (focusCourseLang && TARGET_LANG_META[focusCourseLang]) {
      state.adminOrgLang = focusCourseLang;
    } else {
      state.adminOrgLang = state.targetLang;
    }
    switchHomeSubView('admin');
  }

  function openDecksPage(opts = {}) {
    if (courseBrowserDialog && courseBrowserDialog.open) {
      courseBrowserDialog.close();
    }

    if (state.screenMode === 'play') {
      state.paused = true;
      state.decksOpenedFromPlay = true;
      state.screenMode = 'title';
      centerOverlay.classList.add('hidden');
      if (arcadeTitleScreen) arcadeTitleScreen.hidden = false;
      document.body.classList.remove('mode-play');
      document.body.classList.add('mode-title');
    }

    if (opts.sourceFilter) {
      state.catalogSourceFilter = opts.sourceFilter;
    }
    if (opts.navMode) {
      state.decksNavMode = opts.navMode;
    }
    if (typeof opts.openCourseId === 'string') {
      state.openedDeckId = opts.openCourseId;
    } else {
      state.openedDeckId = '';
    }
    state.openedDeckEditMode = Boolean(opts.editMode);
    state.openedDeckSubdeckFilter = 'all';
    state.openedDeckWordQuery = '';
    state.openedDeckWordsLimit = 120;

    switchHomeSubView('decks');
  }

  function resumeBattleFromDecksPage() {
    if (!state.decksOpenedFromPlay) {
      launchFromTitleScreen();
      return;
    }
    state.decksOpenedFromPlay = false;
    state.homeSubView = 'home';
    if (homeDashboardView) homeDashboardView.classList.remove('hidden');
    if (decksPageView) decksPageView.classList.add('hidden');
    if (adminStudioView) adminStudioView.classList.add('hidden');
    if (btnNavHome) btnNavHome.classList.add('active');
    if (btnNavCourses) btnNavCourses.classList.remove('active');
    if (btnNavDecks) btnNavDecks.classList.remove('active');
    if (btnNavAdmin) btnNavAdmin.classList.remove('active');

    state.screenMode = 'play';
    if (arcadeTitleScreen) arcadeTitleScreen.hidden = true;
    document.body.classList.remove('mode-title');
    document.body.classList.add('mode-play');
    resizeCanvas();

    if (state.running && !state.gameOver) {
      state.paused = false;
      centerOverlay.classList.add('hidden');
    } else {
      showLevelIntroOverlay();
    }
  }

  function launchDeckLessonFromPage(courseId, modIdx = 0, lessonIdx = 0) {
    state.decksOpenedFromPlay = false;
    selectCourseLesson(courseId, modIdx, lessonIdx, false);
    if (state.screenMode === 'title') {
      launchFromTitleScreen();
    } else {
      startLevelNow();
    }
  }

  async function removeUserDeckById(courseId) {
    if (!window.AnkiImporter) return;
    await window.AnkiImporter.deleteUserCourse(courseId);
    state.userCourses = state.userCourses.filter(x => x.id !== courseId);
    if (state.activeCourseId === courseId) {
      state.activeCourseId = '';
      ensureValidCourseSelection();
    }
    if (state.openedDeckId === courseId) {
      state.openedDeckId = '';
      state.openedDeckEditMode = false;
    }
    renderLevelSidebar();
    applyStaticUILocalization();
    renderDecksPage();
  }

  function renderDeckDetailPane(course, stats) {
    if (!deckDetailPane || !course) return;
    const tr = t();
    const isUser = course.source === 'user';
    const artCls = getDeckArtClass(course);
    const originBadgeCls = !isUser ? 'creator' : 'anki';
    const originText = !isUser
      ? tr.decksCreatorBadge
      : (course.originType === 'anki' ? tr.decksAnkiBadge : tr.decksCustomBadge);
    const iconChar = course.icon || (isUser ? '📦' : '📚');
    const cTitle = getLocalizedField(course, 'titles');
    const cDesc = getLocalizedField(course, 'descriptions');
    const health = isUser && window.AnkiImporter && window.AnkiImporter.inspectDeckTranslationHealth
      ? window.AnkiImporter.inspectDeckTranslationHealth(course)
      : null;

    deckDetailPane.innerHTML = '';

    // 1. Верхняя полоса с возвратом ко всем колодам и быстрыми действиями
    const topbar = document.createElement('div');
    topbar.className = 'deck-detail-topbar';

    const backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.className = 'deck-back-btn';
    backBtn.textContent = tr.decksBackToAll;
    backBtn.addEventListener('click', () => {
      state.openedDeckId = '';
      state.openedDeckEditMode = false;
      renderDecksPage();
    });
    topbar.appendChild(backBtn);

    const actionsWrap = document.createElement('div');
    actionsWrap.className = 'deck-detail-actions';

    const playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'deck-btn-primary';
    playBtn.textContent = tr.decksContinueBtn;
    playBtn.addEventListener('click', () => {
      launchDeckLessonFromPage(course.id, stats.nextModIdx, stats.nextLessonIdx);
    });
    actionsWrap.appendChild(playBtn);

    if (isUser) {
      const editToggleBtn = document.createElement('button');
      editToggleBtn.type = 'button';
      editToggleBtn.className = 'deck-btn-secondary';
      editToggleBtn.textContent = tr.decksEditBtn;
      editToggleBtn.addEventListener('click', () => {
        state.openedDeckEditMode = !state.openedDeckEditMode;
        renderDeckDetailPane(course, stats);
      });
      actionsWrap.appendChild(editToggleBtn);

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'deck-delete-danger-btn';
      delBtn.textContent = tr.deleteDeckBtn;
      delBtn.addEventListener('click', () => removeUserDeckById(course.id));
      actionsWrap.appendChild(delBtn);
    } else {
      const manageAdminBtn = document.createElement('button');
      manageAdminBtn.type = 'button';
      manageAdminBtn.className = 'deck-btn-secondary';
      manageAdminBtn.textContent = `👑 ${tr.decksAdminBtn}`;
      manageAdminBtn.addEventListener('click', () => {
        openAdminStudio(course.targetLang || state.targetLang);
      });
      actionsWrap.appendChild(manageAdminBtn);
    }

    topbar.appendChild(actionsWrap);
    deckDetailPane.appendChild(topbar);

    // 2. Шапка колоды и прогресс
    const catBadgeText = getCourseCategoryBadgeText(course);
    const heroRow = document.createElement('div');
    heroRow.className = 'deck-detail-hero';
    heroRow.innerHTML = `
      <div class="deck-detail-title-wrap">
        <div class="deck-icon-tile ${artCls}">${escapeHtml(iconChar)}</div>
        <div>
          <div class="deck-badges-inline">
            <span class="deck-tag-badge ${originBadgeCls}">${escapeHtml(originText)}</span>
            ${catBadgeText ? `<span class="deck-tag-badge category">${escapeHtml(catBadgeText)}</span>` : ''}
            <span class="deck-tag-badge cefr">${escapeHtml(course.levelTag || 'A2–B1')}</span>
            <span class="deck-tag-badge cefr">${escapeHtml(tr.wordsCount(stats.totalWords))}</span>
          </div>
          <h2 class="deck-detail-title">${escapeHtml(cTitle)}</h2>
          <p class="deck-detail-desc">${escapeHtml(cDesc)}</p>
        </div>
      </div>
      <div style="min-width: 220px; flex: 0 1 280px;">
        <div class="decks-prog-bar-row">
          <div class="decks-prog-track">
            <div class="decks-prog-fill" style="width: ${stats.pct}%;"></div>
          </div>
          <span class="decks-prog-pct">${stats.pct}%</span>
        </div>
        <div class="deck-lessons-count-sub" style="margin-top: 5px;">
          ${escapeHtml(tr.decksLessonsProgress(stats.doneLessons, stats.totalLessons))}
        </div>
      </div>
    `;
    deckDetailPane.appendChild(heroRow);

    if (health && health.brokenRu && state.nativeLang === 'ru') {
      const warnEl = document.createElement('div');
      warnEl.className = 'deck-broken-ru-alert';
      warnEl.innerHTML = `<span>${escapeHtml(tr.decksBrokenRuWarn)}</span>`;
      const fixDelBtn = document.createElement('button');
      fixDelBtn.type = 'button';
      fixDelBtn.textContent = tr.decksBrokenRuDeleteBtn;
      fixDelBtn.addEventListener('click', () => removeUserDeckById(course.id));
      warnEl.appendChild(fixDelBtn);
      deckDetailPane.appendChild(warnEl);
    }

    // 3. Встроенный редактор колоды (для личных и Anki-колод)
    if (isUser && state.openedDeckEditMode) {
      const editorBox = document.createElement('div');
      editorBox.className = 'deck-inline-editor';
      editorBox.innerHTML = `
        <div style="font-weight: 800; color: #6ee7b7; font-size: 0.95rem;">${escapeHtml(tr.decksEditorHeading)}</div>
        <div class="deck-editor-grid">
          <div class="anki-field-col">
            <label>${escapeHtml(tr.decksEditorTitleLabel)}</label>
            <input type="text" class="dict-search-input" id="inlineEditDeckTitle" value="${escapeHtml(cTitle)}" />
          </div>
          <div class="anki-field-col">
            <label>${escapeHtml(tr.decksEditorLevelLabel)}</label>
            <select class="dict-search-input" id="inlineEditDeckLevel">
              ${['A1–A2', 'A2–B1', 'B1', 'B1–B2', 'C1'].map(lv =>
                `<option value="${lv}"${(course.levelTag || 'A2–B1') === lv ? ' selected' : ''}>${lv}</option>`
              ).join('')}
            </select>
          </div>
        </div>
        <div class="anki-field-col">
          <label>${escapeHtml(tr.decksEditorAddLabel)}</label>
          <textarea class="custom-words-textarea" id="inlineEditAppendWords" rows="4" placeholder="der Bahnhof;вокзал&#10;abfahren;отправляться"></textarea>
        </div>
        <div class="deck-card-actions" style="justify-content: flex-start;">
          <button type="button" class="deck-btn-primary" style="flex: 0 0 auto;" id="btnInlineSaveDeck">${escapeHtml(tr.decksEditorSaveBtn)}</button>
          <button type="button" class="deck-btn-secondary" style="flex: 0 0 auto;" id="btnInlineCancelDeck">${escapeHtml(tr.decksEditorCancelBtn)}</button>
        </div>
      `;
      deckDetailPane.appendChild(editorBox);

      const saveBtn = editorBox.querySelector('#btnInlineSaveDeck');
      const cancelBtn = editorBox.querySelector('#btnInlineCancelDeck');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          state.openedDeckEditMode = false;
          renderDeckDetailPane(course, stats);
        });
      }
      if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
          const titleInp = editorBox.querySelector('#inlineEditDeckTitle');
          const levelSel = editorBox.querySelector('#inlineEditDeckLevel');
          const appendArea = editorBox.querySelector('#inlineEditAppendWords');
          const existingWords = getAllWordsInCourse(course);
          const addedWords = [];
          if (appendArea && appendArea.value.trim()) {
            if (window.AnkiImporter && window.AnkiImporter.parseAdminTextbookBlock) {
              const parsedBlock = window.AnkiImporter.parseAdminTextbookBlock(
                appendArea.value,
                course.targetLang,
                state.nativeLang
              );
              addedWords.push(...(parsedBlock.words || []));
            } else {
              for (const line of appendArea.value.split(/\r?\n/)) {
                const trimmed = line.trim();
                if (!trimmed || (!trimmed.includes(';') && !trimmed.includes('\t'))) continue;
                const delim = trimmed.includes(';') ? ';' : '\t';
                const parts = trimmed.split(delim).map(s => s.trim());
                if (parts.length >= 2 && parts[0] && parts[1]) {
                  const wEntry = window.AnkiImporter.normalizeCardToWordEntry(parts[0], parts[1], course.targetLang, parts[2] || '');
                  if (wEntry) addedWords.push(wEntry);
                }
              }
            }
          }
          const combined = [...existingWords, ...addedWords];
          if (combined.length === 0) return;

          const rebuilt = window.AnkiImporter.buildUserCourse({
            id: course.id,
            title: (titleInp && titleInp.value.trim()) || cTitle,
            targetLang: course.targetLang,
            originType: course.originType || 'custom',
            levelTag: (levelSel && levelSel.value) || course.levelTag || 'A2–B1',
            createdAt: course.createdAt,
            words: combined,
            lessonSize: 12
          });
          await window.AnkiImporter.saveUserCourse(rebuilt);
          state.userCourses = state.userCourses.map(c => c.id === course.id ? rebuilt : c);
          state.openedDeckEditMode = false;
          renderLevelSidebar();
          applyStaticUILocalization();
          renderDecksPage();
        });
      }
    }

    // 4. Фильтр разделов / подколод (особенно удобно для Anki с 10 подколодами!)
    const modules = course.modules || [];
    if (modules.length > 1) {
      const pillsRow = document.createElement('div');
      pillsRow.className = 'deck-subdeck-pills';

      const allPill = document.createElement('button');
      allPill.type = 'button';
      allPill.className = 'decks-level-pill' + (state.openedDeckSubdeckFilter === 'all' ? ' active' : '');
      allPill.textContent = tr.decksAllSections(modules.length);
      allPill.addEventListener('click', () => {
        state.openedDeckSubdeckFilter = 'all';
        state.openedDeckWordsLimit = 120;
        renderDeckDetailPane(course, stats);
      });
      pillsRow.appendChild(allPill);

      modules.forEach((mod, mIdx) => {
        const p = document.createElement('button');
        p.type = 'button';
        const key = String(mIdx);
        p.className = 'decks-level-pill' + (state.openedDeckSubdeckFilter === key ? ' active' : '');
        p.textContent = getLocalizedField(mod, 'titles');
        p.addEventListener('click', () => {
          state.openedDeckSubdeckFilter = key;
          state.openedDeckWordsLimit = 120;
          renderDeckDetailPane(course, stats);
        });
        pillsRow.appendChild(p);
      });

      deckDetailPane.appendChild(pillsRow);
    }

    // 5. Все уроки выбранного раздела (клик сразу запускает урок!)
    const visibleModules = state.openedDeckSubdeckFilter === 'all'
      ? modules.map((m, idx) => ({ mod: m, mIdx: idx }))
      : modules
        .map((m, idx) => ({ mod: m, mIdx: idx }))
        .filter(item => String(item.mIdx) === state.openedDeckSubdeckFilter);

    const allVisibleLessons = [];
    visibleModules.forEach(({ mod, mIdx }) => {
      (mod.lessons || []).forEach((ls, lIdx) => {
        allVisibleLessons.push({ mod, mIdx, ls, lIdx });
      });
    });

    const lessonsHeading = document.createElement('h3');
    lessonsHeading.className = 'decks-section-heading';
    lessonsHeading.style.fontSize = '1.02rem';
    lessonsHeading.textContent = tr.decksLessonsSectionTitle(allVisibleLessons.length);
    deckDetailPane.appendChild(lessonsHeading);

    const lessonsGrid = document.createElement('div');
    lessonsGrid.className = 'deck-detail-lessons-grid';
    allVisibleLessons.forEach(({ mod, mIdx, ls, lIdx }) => {
      const isDone = state.completedLessonIds.has(ls.id);
      const lTitle = getLocalizedField(ls, 'titles');
      const resolvedCount = ls.isBoss ? 14 : (ls.words || []).length;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'deck-mini-lesson' + (isDone ? ' done' : '');
      btn.innerHTML = `
        <div class="deck-mini-top">
          <span>${escapeHtml(ls.isBoss ? lTitle : `${tr.decksMiniLessonNum(lIdx + 1)} · ${tr.wordsShort(resolvedCount)}`)}</span>
          ${isDone ? '<span class="deck-mini-check">✓</span>' : ''}
        </div>
        <div class="deck-mini-sub">${escapeHtml(ls.isBoss ? tr.bossMetaLabel : `${getLocalizedField(mod, 'titles')} — ${lTitle}`)}</div>
      `;
      btn.addEventListener('click', () => {
        launchDeckLessonFromPage(course.id, mIdx, lIdx);
      });
      lessonsGrid.appendChild(btn);
    });
    deckDetailPane.appendChild(lessonsGrid);

    // 6. Список слов и переводов с живым поиском, озвучкой и звёздочкой ⭐
    const wordsBox = document.createElement('div');
    wordsBox.className = 'deck-detail-words-box';

    const sectionWords = [];
    const seenRaw = new Set();
    visibleModules.forEach(({ mod }) => {
      (mod.lessons || []).forEach(ls => {
        if (ls.isBoss) return;
        (ls.words || []).forEach(w => {
          const k = w.raw || w.word;
          if (!seenRaw.has(k)) {
            seenRaw.add(k);
            sectionWords.push(w);
          }
        });
      });
    });

    const q = (state.openedDeckWordQuery || '').trim().toLowerCase();
    const filteredWords = q
      ? sectionWords.filter(w => {
          const trMap = w.translations || {};
          return (
            String(w.raw || '').toLowerCase().includes(q) ||
            String(w.word || '').toLowerCase().includes(q) ||
            String(trMap.ru || '').toLowerCase().includes(q) ||
            String(trMap.en || '').toLowerCase().includes(q) ||
            String(trMap.he || '').toLowerCase().includes(q)
          );
        })
      : sectionWords;

    const wordsTopBar = document.createElement('div');
    wordsTopBar.className = 'deck-detail-topbar';
    wordsTopBar.style.borderBottom = 'none';
    wordsTopBar.style.paddingBottom = '0';

    const wTitle = document.createElement('h3');
    wTitle.className = 'decks-section-heading';
    wTitle.style.fontSize = '1.02rem';
    wTitle.textContent = tr.decksWordsSectionTitle(filteredWords.length);
    wordsTopBar.appendChild(wTitle);

    const wSearch = document.createElement('input');
    wSearch.type = 'search';
    wSearch.className = 'dict-search-input';
    wSearch.style.maxWidth = '320px';
    wSearch.placeholder = tr.dictSearchPlaceholder;
    wSearch.value = state.openedDeckWordQuery;
    wSearch.addEventListener('input', () => {
      state.openedDeckWordQuery = wSearch.value;
      state.openedDeckWordsLimit = 120;
      renderDeckDetailPane(course, stats);
      const nextInput = deckDetailPane.querySelector('.deck-detail-words-box input[type="search"]');
      if (nextInput) {
        nextInput.focus();
        const len = nextInput.value.length;
        nextInput.setSelectionRange(len, len);
      }
    });
    wordsTopBar.appendChild(wSearch);
    wordsBox.appendChild(wordsTopBar);

    const wordsGrid = document.createElement('div');
    wordsGrid.className = 'deck-words-list-grid';
    const visibleSlice = filteredWords.slice(0, state.openedDeckWordsLimit);

    visibleSlice.forEach(item => {
      const wCard = document.createElement('div');
      wCard.className = 'deck-word-item';
      const pinned = isEntryPinned(item, course.targetLang);
      const transStr = getWordTranslation(item);
      const rtlAttr = isRtlTranslation(item) ? ' dir="rtl"' : ' dir="ltr"';

      wCard.innerHTML = `
        <div class="deck-word-item-main">
          <div class="deck-word-foreign" dir="ltr">${escapeHtml(item.raw)}</div>
          <div class="deck-word-trans"${rtlAttr}>${escapeHtml(transStr)}</div>
        </div>
        <div class="deck-word-item-btns">
          <button type="button" class="hud-btn btn-speak-w" title="TTS">🔊</button>
          <button type="button" class="pin-star-btn${pinned ? ' pinned' : ''}" title="${escapeHtml(tr.pinTooltip)}">${pinned ? '⭐' : '☆'}</button>
          ${isUser && state.openedDeckEditMode ? '<button type="button" class="hud-btn btn-del-w" title="Удалить слово">✕</button>' : ''}
        </div>
      `;

      const speakBtn = wCard.querySelector('.btn-speak-w');
      if (speakBtn) {
        speakBtn.addEventListener('click', () => {
          sound.init();
          ttsManager.speak(item.withArticle || item.word, course.targetLang, true);
        });
      }
      const starBtn = wCard.querySelector('.pin-star-btn');
      if (starBtn) {
        starBtn.addEventListener('click', () => {
          togglePinWord(item, course.targetLang);
        });
      }
      const delWordBtn = wCard.querySelector('.btn-del-w');
      if (delWordBtn) {
        delWordBtn.addEventListener('click', async () => {
          const remaining = getAllWordsInCourse(course).filter(x => (x.raw || x.word) !== (item.raw || item.word));
          if (remaining.length === 0) return;
          const rebuilt = window.AnkiImporter.buildUserCourse({
            id: course.id,
            title: cTitle,
            targetLang: course.targetLang,
            originType: course.originType || 'custom',
            levelTag: course.levelTag || 'A2–B1',
            createdAt: course.createdAt,
            words: remaining,
            lessonSize: 12
          });
          await window.AnkiImporter.saveUserCourse(rebuilt);
          state.userCourses = state.userCourses.map(c => c.id === course.id ? rebuilt : c);
          renderLevelSidebar();
          renderDecksPage();
        });
      }

      wordsGrid.appendChild(wCard);
    });

    wordsBox.appendChild(wordsGrid);

    if (filteredWords.length > visibleSlice.length) {
      const moreBtn = document.createElement('button');
      moreBtn.type = 'button';
      moreBtn.className = 'deck-btn-secondary';
      moreBtn.style.alignSelf = 'center';
      moreBtn.textContent = tr.decksShowMoreWords(filteredWords.length - visibleSlice.length);
      moreBtn.addEventListener('click', () => {
        state.openedDeckWordsLimit += 150;
        renderDeckDetailPane(course, stats);
      });
      wordsBox.appendChild(moreBtn);
    }

    deckDetailPane.appendChild(wordsBox);
  }

  function renderDecksPage() {
    if (!decksPageView) return;
    const tr = t();
    const allForLang = getCoursesForTargetLang(state.targetLang);
    const statsById = new Map();
    let startedCount = 0;

    allForLang.forEach(c => {
      const st = computeDeckStats(c);
      statsById.set(c.id, st);
      if (st.isStarted) startedCount++;
    });

    // 1. Синхронизация шапки, подвкладок и боковых фильтров
    if (decksHeroTitle) {
      decksHeroTitle.textContent = state.decksNavMode === 'courses' ? tr.decksHeroTitleCourses : tr.decksHeroTitleMy;
    }
    if (btnNavCourses && state.homeSubView === 'decks') {
      btnNavCourses.classList.toggle('active', state.decksNavMode === 'courses');
    }
    if (btnNavDecks && state.homeSubView === 'decks') {
      btnNavDecks.classList.toggle('active', state.decksNavMode !== 'courses');
    }
    if (btnDecksSubtabCourses) {
      btnDecksSubtabCourses.classList.toggle('active', state.decksNavMode === 'courses');
    }
    if (btnDecksSubtabMyDecks) {
      btnDecksSubtabMyDecks.classList.toggle('active', state.decksNavMode !== 'courses');
    }
    if (btnDecksReturnBattle) {
      btnDecksReturnBattle.classList.toggle('hidden', !state.decksOpenedFromPlay);
    }
    if (btnDecksViewGrid) {
      btnDecksViewGrid.classList.toggle('active', state.decksViewMode !== 'list');
    }
    if (btnDecksViewList) {
      btnDecksViewList.classList.toggle('active', state.decksViewMode === 'list');
    }
    if (decksAllGrid) {
      decksAllGrid.classList.toggle('list-mode', state.decksViewMode === 'list');
    }

    if (decksSourceFilterGroup) {
      decksSourceFilterGroup.querySelectorAll('.decks-source-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sourceFilter === state.catalogSourceFilter);
      });
    }
    if (decksCategoryFilterGroup) {
      const usedCatIds = new Set();
      allForLang.forEach(c => {
        if (c.source !== 'user') usedCatIds.add(inferCourseCategory(c));
      });
      const allCats = getAllCategories().filter(cat =>
        usedCatIds.has(cat.id) || cat.id === 'auto' || cat.id === 'business'
      );
      if (state.decksCategoryFilter !== 'all' && !allCats.some(c => c.id === state.decksCategoryFilter)) {
        state.decksCategoryFilter = 'all';
      }
      decksCategoryFilterGroup.innerHTML = '';
      const allCatBtn = document.createElement('button');
      allCatBtn.type = 'button';
      allCatBtn.className = 'decks-level-pill' + (state.decksCategoryFilter === 'all' ? ' active' : '');
      allCatBtn.dataset.categoryFilter = 'all';
      allCatBtn.textContent = tr.decksLevelAll;
      decksCategoryFilterGroup.appendChild(allCatBtn);

      allCats.forEach(cat => {
        const cBtn = document.createElement('button');
        cBtn.type = 'button';
        cBtn.className = 'decks-level-pill' + (state.decksCategoryFilter === cat.id ? ' active' : '');
        cBtn.dataset.categoryFilter = cat.id;
        const cLabel = getLocalizedField(cat, 'titles') || cat.id;
        cBtn.textContent = `${cat.icon || '🗂️'} ${cLabel}`;
        decksCategoryFilterGroup.appendChild(cBtn);
      });
    }
    if (decksLevelFilterGroup) {
      decksLevelFilterGroup.querySelectorAll('.decks-level-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.levelFilter === state.decksLevelFilter);
      });
    }

    // 2. Карточка прогресса в левом сайдбаре и 3 метрики в Hero-баннере
    const totalDecksCount = allForLang.length;
    const sidebarPct = totalDecksCount > 0 ? Math.round((startedCount / totalDecksCount) * 100) : 0;
    if (decksSidebarStartedNum) decksSidebarStartedNum.textContent = String(startedCount);
    if (decksSidebarTotalLabel) decksSidebarTotalLabel.textContent = tr.decksOfTotalDecks(totalDecksCount);
    if (decksSidebarProgFill) decksSidebarProgFill.style.width = `${sidebarPct}%`;
    if (decksSidebarProgPct) decksSidebarProgPct.textContent = `${sidebarPct}%`;

    if (decksHeroTotalCount) decksHeroTotalCount.textContent = String(totalDecksCount);
    if (decksHeroLearnedCount) decksHeroLearnedCount.textContent = learnedWordsSet.size.toLocaleString();
    if (decksHeroStreakCount) decksHeroStreakCount.textContent = tr.streakDays(dailyProgress.streakDays || 1);

    // 3. Если открыта конкретная колода — показываем встроенную страницу деталей вместо обзора
    if (state.openedDeckId) {
      const openedCourse = allForLang.find(c => c.id === state.openedDeckId);
      if (openedCourse) {
        if (decksOverviewPane) decksOverviewPane.classList.add('hidden');
        if (deckDetailPane) deckDetailPane.classList.remove('hidden');
        renderDeckDetailPane(openedCourse, statsById.get(openedCourse.id) || computeDeckStats(openedCourse));
        return;
      }
      state.openedDeckId = '';
      state.openedDeckEditMode = false;
    }

    if (decksOverviewPane) decksOverviewPane.classList.remove('hidden');
    if (deckDetailPane) deckDetailPane.classList.add('hidden');

    // 4. Полоса «▶ Продолжить обучение» (до 3 колод: активная + пользовательские Anki + начатые)
    if (decksContinueGrid && decksContinueSection) {
      const prioritized = allForLang.slice().sort((a, b) => {
        const aActive = a.id === state.activeCourseId ? 1 : 0;
        const bActive = b.id === state.activeCourseId ? 1 : 0;
        if (aActive !== bActive) return bActive - aActive;
        const aUser = a.source === 'user' ? 1 : 0;
        const bUser = b.source === 'user' ? 1 : 0;
        if (aUser !== bUser) return bUser - aUser;
        const stA = statsById.get(a.id);
        const stB = statsById.get(b.id);
        return (stB ? stB.pct : 0) - (stA ? stA.pct : 0);
      }).slice(0, 3);

      decksContinueSection.classList.toggle('hidden', prioritized.length === 0);
      decksContinueGrid.innerHTML = '';

      prioritized.forEach(course => {
        const st = statsById.get(course.id) || computeDeckStats(course);
        const isUser = course.source === 'user';
        const artCls = getDeckArtClass(course);
        const badgeCls = !isUser ? 'creator' : 'anki';
        const badgeText = !isUser
          ? tr.decksCreatorBadge
          : (course.originType === 'anki' ? tr.decksAnkiBadge : tr.decksCustomBadge);
        const iconChar = course.icon || (isUser ? '📦' : '📚');
        const titleStr = getLocalizedField(course, 'titles');
        const catBadgeText = getCourseCategoryBadgeText(course);

        const contCard = document.createElement('div');
        contCard.className = 'deck-continue-card' + (course.id === state.activeCourseId ? ' is-active' : '');
        contCard.innerHTML = `
          <div class="deck-icon-tile ${artCls}">${escapeHtml(iconChar)}</div>
          <div class="deck-cont-body">
            <div class="deck-badges-inline">
              <span class="deck-tag-badge ${badgeCls}">${escapeHtml(badgeText)}</span>
              ${catBadgeText ? `<span class="deck-tag-badge category">${escapeHtml(catBadgeText)}</span>` : ''}
              <span class="deck-tag-badge cefr">${escapeHtml(course.levelTag || 'A2–B1')}</span>
            </div>
            <div class="deck-cont-title" title="${escapeHtml(titleStr)}">${escapeHtml(titleStr)}</div>
            <div class="deck-cont-meta">${escapeHtml(tr.decksMetaWordsLessons(st.totalWords.toLocaleString(), st.doneLessons, st.totalLessons))}</div>
            <div class="decks-prog-bar-row">
              <div class="decks-prog-track">
                <div class="decks-prog-fill" style="width: ${st.pct}%;"></div>
              </div>
              <span class="decks-prog-pct">${st.pct}%</span>
            </div>
          </div>
          <button type="button" class="deck-cont-btn">${escapeHtml(tr.decksContinueBtn)}</button>
        `;

        const btn = contCard.querySelector('.deck-cont-btn');
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            launchDeckLessonFromPage(course.id, st.nextModIdx, st.nextLessonIdx);
          });
        }
        contCard.addEventListener('click', () => {
          state.openedDeckId = course.id;
          state.openedDeckEditMode = false;
          state.openedDeckSubdeckFilter = 'all';
          state.openedDeckWordQuery = '';
          state.openedDeckWordsLimit = 120;
          renderDecksPage();
        });
        decksContinueGrid.appendChild(contCard);
      });
    }

    // 5. Сетка «📚 Все колоды (N)» с учётом фильтров источника, категории, уровня CEFR и строки поиска
    const searchQ = (state.decksSearchQuery || '').trim().toLowerCase();
    const filteredDecks = allForLang.filter(course => {
      if (state.catalogSourceFilter === 'official' && course.source === 'user') return false;
      if (state.catalogSourceFilter === 'user' && course.source !== 'user') return false;
      if (state.decksCategoryFilter && state.decksCategoryFilter !== 'all') {
        if (course.source === 'user') return false;
        if (inferCourseCategory(course) !== state.decksCategoryFilter) return false;
      }
      if (!courseMatchesLevelFilter(course, state.decksLevelFilter)) return false;

      if (!searchQ) return true;
      const tStr = getLocalizedField(course, 'titles').toLowerCase();
      const dStr = getLocalizedField(course, 'descriptions').toLowerCase();
      if (tStr.includes(searchQ) || dStr.includes(searchQ)) return true;

      const words = getAllWordsInCourse(course);
      for (const w of words) {
        if (
          String(w.raw || '').toLowerCase().includes(searchQ) ||
          String((w.translations && w.translations.ru) || '').toLowerCase().includes(searchQ) ||
          String((w.translations && w.translations.en) || '').toLowerCase().includes(searchQ)
        ) {
          return true;
        }
      }
      return false;
    });

    // Сортируем так, чтобы личные/Anki и активная колода были сразу на виду в первом ряду (как на макете!)
    const orderedDecks = filteredDecks.slice().sort((a, b) => {
      const aFirst = a.id === state.activeCourseId ? 2 : (a.source === 'user' ? 1 : 0);
      const bFirst = b.id === state.activeCourseId ? 2 : (b.source === 'user' ? 1 : 0);
      if (aFirst !== bFirst) return bFirst - aFirst;
      return 0;
    });

    if (decksAllCountBadge) {
      decksAllCountBadge.textContent = `(${orderedDecks.length})`;
    }
    if (!decksAllGrid) return;
    decksAllGrid.innerHTML = '';

    if (orderedDecks.length === 0) {
      const emptyBox = document.createElement('div');
      emptyBox.className = 'kill-feed-empty';
      emptyBox.style.gridColumn = '1 / -1';
      emptyBox.style.padding = '28px';
      emptyBox.textContent = state.catalogSourceFilter === 'user' && !searchQ && state.decksLevelFilter === 'all'
        ? tr.emptyUserCourses
        : tr.decksEmptyFiltered;
      decksAllGrid.appendChild(emptyBox);
      return;
    }

    orderedDecks.forEach(course => {
      const st = statsById.get(course.id) || computeDeckStats(course);
      const isUser = course.source === 'user';
      const artCls = getDeckArtClass(course);
      const badgeCls = !isUser ? 'creator' : 'anki';
      const badgeText = !isUser
        ? tr.decksCreatorBadge
        : (course.originType === 'anki' ? tr.decksAnkiBadge : tr.decksCustomBadge);
      const iconChar = course.icon || (isUser ? '📦' : '📚');
      const titleStr = getLocalizedField(course, 'titles');
      const descStr = getLocalizedField(course, 'descriptions');
      const catBadgeText = getCourseCategoryBadgeText(course);
      const health = isUser && window.AnkiImporter && window.AnkiImporter.inspectDeckTranslationHealth
        ? window.AnkiImporter.inspectDeckTranslationHealth(course)
        : null;

      const card = document.createElement('article');
      card.className = 'deck-full-card' + (course.id === state.activeCourseId ? ' is-active' : '');

      const topDiv = document.createElement('div');
      topDiv.className = 'deck-card-top';
      topDiv.innerHTML = `
        <div class="deck-icon-tile ${artCls}">${escapeHtml(iconChar)}</div>
        <div class="deck-card-head-info">
          <div class="deck-card-top-bar">
            <div class="deck-badges-inline">
              <span class="deck-tag-badge ${badgeCls}">${escapeHtml(badgeText)}</span>
              ${catBadgeText ? `<span class="deck-tag-badge category">${escapeHtml(catBadgeText)}</span>` : ''}
              <span class="deck-tag-badge cefr">${escapeHtml(course.levelTag || 'A2–B1')}</span>
            </div>
            <button type="button" class="deck-more-btn" aria-label="More">•••</button>
          </div>
          <h3 class="deck-card-title">${escapeHtml(titleStr)}</h3>
          <p class="deck-card-desc">${escapeHtml(descStr)}</p>
        </div>
      `;
      const moreBtn = topDiv.querySelector('.deck-more-btn');
      if (moreBtn) {
        moreBtn.addEventListener('click', () => {
          state.openedDeckId = course.id;
          state.openedDeckEditMode = isUser;
          state.openedDeckSubdeckFilter = 'all';
          state.openedDeckWordQuery = '';
          state.openedDeckWordsLimit = 120;
          renderDecksPage();
        });
      }
      card.appendChild(topDiv);

      if (health && health.brokenRu && state.nativeLang === 'ru') {
        const warnRow = document.createElement('div');
        warnRow.className = 'deck-broken-ru-alert';
        warnRow.innerHTML = `<span>${escapeHtml(tr.decksBrokenRuWarn)}</span>`;
        const quickDel = document.createElement('button');
        quickDel.type = 'button';
        quickDel.textContent = tr.decksBrokenRuDeleteBtn;
        quickDel.addEventListener('click', () => removeUserDeckById(course.id));
        warnRow.appendChild(quickDel);
        card.appendChild(warnRow);
      }

      // 3 мини-плитки первых уроков колоды
      if (st.previewLessons.length > 0) {
        const previewRow = document.createElement('div');
        previewRow.className = 'deck-lessons-preview-row';
        st.previewLessons.forEach((pItem, idx) => {
          const miniBtn = document.createElement('button');
          miniBtn.type = 'button';
          miniBtn.className = 'deck-mini-lesson' + (pItem.isDone ? ' done' : '');
          const cleanLessonName = getLocalizedField(pItem.ls, 'titles');
          miniBtn.innerHTML = `
            <div class="deck-mini-top">
              <span>${escapeHtml(tr.decksMiniLessonNum(idx + 1))}</span>
              ${pItem.isDone ? '<span class="deck-mini-check">✓</span>' : ''}
            </div>
            <div class="deck-mini-sub">${escapeHtml(cleanLessonName)}</div>
          `;
          miniBtn.addEventListener('click', () => {
            launchDeckLessonFromPage(course.id, pItem.mIdx, pItem.lIdx);
          });
          previewRow.appendChild(miniBtn);
        });
        card.appendChild(previewRow);
      }

      // Полоса прогресса + счётчик уроков
      const progBlock = document.createElement('div');
      progBlock.className = 'deck-progress-block';
      progBlock.innerHTML = `
        <div class="decks-prog-bar-row">
          <div class="decks-prog-track">
            <div class="decks-prog-fill" style="width: ${st.pct}%;"></div>
          </div>
          <span class="decks-prog-pct">${st.pct}%</span>
        </div>
        <div class="deck-lessons-count-sub">${escapeHtml(tr.decksLessonsProgress(st.doneLessons, st.totalLessons))}</div>
      `;
      card.appendChild(progBlock);

      // Кнопки карточки: [▶ Продолжить] [📖 Открыть] + [✏️ Редактировать] для личных/Anki
      const actRow = document.createElement('div');
      actRow.className = 'deck-card-actions';

      const contBtn = document.createElement('button');
      contBtn.type = 'button';
      contBtn.className = 'deck-btn-primary';
      contBtn.textContent = tr.decksContinueBtn;
      contBtn.addEventListener('click', () => {
        launchDeckLessonFromPage(course.id, st.nextModIdx, st.nextLessonIdx);
      });
      actRow.appendChild(contBtn);

      const openBtn = document.createElement('button');
      openBtn.type = 'button';
      openBtn.className = 'deck-btn-secondary';
      openBtn.textContent = tr.decksOpenBtn;
      openBtn.addEventListener('click', () => {
        state.openedDeckId = course.id;
        state.openedDeckEditMode = false;
        state.openedDeckSubdeckFilter = 'all';
        state.openedDeckWordQuery = '';
        state.openedDeckWordsLimit = 120;
        renderDecksPage();
        if (arcadeTitleScreen) arcadeTitleScreen.scrollTo({ top: 0, behavior: 'smooth' });
      });
      actRow.appendChild(openBtn);

      if (isUser) {
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'deck-btn-secondary';
        editBtn.textContent = tr.decksEditBtn;
        editBtn.addEventListener('click', () => {
          state.openedDeckId = course.id;
          state.openedDeckEditMode = true;
          state.openedDeckSubdeckFilter = 'all';
          state.openedDeckWordQuery = '';
          state.openedDeckWordsLimit = 120;
          renderDecksPage();
          if (arcadeTitleScreen) arcadeTitleScreen.scrollTo({ top: 0, behavior: 'smooth' });
        });
        actRow.appendChild(editBtn);
      }

      card.appendChild(actRow);
      decksAllGrid.appendChild(card);
    });
  }

  function renderCourseBrowserModal() {
    renderDecksPage();
  }

  function openCourseCatalogModal(initialFilter = 'all', navMode = 'decks') {
    openDecksPage({
      sourceFilter: initialFilter,
      navMode
    });
  }

  // ==========================================================================
  // РЕНДЕР ОВЕРЛЕЯ, СПИСКА СЛОВ И ПРАВОЙ КОЛОНКИ СО ЗВЁЗДОЧКОЙ ⭐
  // ==========================================================================
  function refreshOverlayContent() {
    const { course, mod, lesson } = getActiveSelection();
    if (!course || !mod || !lesson) return;
    const tr = t();

    updateOriginBadgeElement(overlayOriginBadge, course);
    const lTitle = state.activeCustomRoundTitle || getLocalizedField(lesson, 'titles');
    const lDesc = getLocalizedField(lesson, 'descriptions');
    const previewWords = state.currentRoundPool.length > 0 && state.overlayMode !== 'intro'
      ? state.currentRoundPool
      : resolveLessonBaseWords(course, mod, lesson, state.activeLessonIndex);

    btnPracticeMistakes.textContent = tr.mistakesBtn(state.mistakeWordsMap.size);
    btnPracticeMistakes.style.display = state.mistakeWordsMap.size > 0 ? 'inline-flex' : 'none';
    updatePinnedCountUI();

    if (state.overlayMode === 'intro') {
      overlayBadge.textContent = tr.introBadge(
        getLocalizedField(mod, 'titles'),
        state.activeLessonIndex + 1,
        mod.lessons.length
      );
      overlayTitle.textContent = lTitle;
      overlayDesc.innerHTML = escapeHtml(lDesc);
      overlayWordsHeader.textContent = tr.wordsInLevelHeader(previewWords.length);
      btnStartLevel.textContent = tr.startLevelBtn;
      btnStartLevel.style.display = 'inline-flex';
      btnNextLevel.style.display = 'none';
    } else if (state.overlayMode === 'complete') {
      overlayBadge.textContent = tr.completeBadge(state.maxCombo);
      overlayTitle.textContent = tr.completeTitle(lTitle);
      overlayDesc.innerHTML = tr.completeDesc;
      overlayWordsHeader.textContent = tr.learnedWordsHeader(previewWords.length);
      btnStartLevel.textContent = tr.retryBtn;
      btnStartLevel.style.display = 'inline-flex';

      const nextPtr = getNextLessonPointer();
      if (nextPtr) {
        btnNextLevel.style.display = 'inline-flex';
        btnNextLevel.textContent = tr.nextLevelBtn(getLocalizedField(nextPtr.lesson, 'titles'));
      } else {
        btnNextLevel.style.display = 'none';
      }
    } else if (state.overlayMode === 'gameover') {
      overlayBadge.textContent = tr.gameOverBadge;
      overlayTitle.textContent = tr.gameOverTitle(lTitle);
      overlayDesc.innerHTML = tr.gameOverDesc(state.wordsDestroyedInLevel, state.totalWordsInLevel);
      overlayWordsHeader.textContent = tr.wordsInLevelHeader(previewWords.length);
      btnStartLevel.textContent = tr.tryAgainBtn;
      btnStartLevel.style.display = 'inline-flex';
      btnNextLevel.style.display = 'none';
    } else if (state.overlayMode === 'pause') {
      overlayBadge.textContent = tr.pauseBadge;
      overlayTitle.textContent = lTitle;
      overlayDesc.innerHTML = tr.pauseDesc(state.wordsDestroyedInLevel, state.totalWordsInLevel);
      overlayWordsHeader.textContent = tr.wordsInLevelHeader(previewWords.length);
      btnStartLevel.textContent = tr.resumeBtn;
      btnStartLevel.style.display = 'inline-flex';
      btnNextLevel.style.display = 'none';
    }

    renderWordsPreviewList(previewWords, overlayWordsPreview);
  }

  function renderWordsPreviewList(wordsArray, container) {
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

  function showLevelIntroOverlay() {
    state.overlayMode = 'intro';
    state.activeQuiz = null;
    levelQuizBox.style.display = 'none';
    delete btnStartLevel.dataset.resumeMode;
    refreshOverlayContent();
    centerOverlay.classList.remove('hidden');
  }

  // Подмешивание отмеченных ⭐ слов в следующие раунды, чтобы незнакомые слова чаще закреплялись!
  function buildRoundWordPool(basePool, isCustomPool = false) {
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

  function startLevelNow(customWordPool = null, customTitle = '') {
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
    applyStaticUILocalization();
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
  function spawnNextWord(forceSpawn = false) {
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
      id: nextEntityId++,
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

  function hitWordLetter(wordObj) {
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

  function explodeWord(wordObj, byPlayer = true) {
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

  // --- Правая колонка «Взорванные слова» + кнопка ⭐ «Повторить ещё раз» ---
  function rerenderKillFeed() {
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

  function updateKeyboardNextHint() {
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

  // --- Обработка ввода с физической и экранной клавиатуры ---
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
          renderDecksPage();
        } else if (state.decksOpenedFromPlay) {
          resumeBattleFromDecksPage();
        } else {
          switchHomeSubView('home');
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
    flashVirtualKey(mapTargetCharToBaseKey(char));
    processTypedChar(char);
  });

  function flashVirtualKey(baseKey) {
    if (!baseKey) return;
    const btn = document.querySelector(`.zkey[data-key="${CSS.escape(baseKey)}"]`);
    if (!btn) return;
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 110);
  }

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

  function isBridgeSeparator(ch) {
    return ch === '-' || ch === ' ' || ch === "'" || ch === '/' ||
      ch === '.' || ch === ',' || ch === '!' || ch === '?' || ch === '(' || ch === ')';
  }

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

  function triggerEmpWave() {
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

  function updateBottomTargetUI() {
    const locked = state.activeWords.find(w => w.id === state.lockedWordId);
    if (!locked) {
      bottomTargetPreview.innerHTML = `<span style="color: var(--text-muted);">${escapeHtml(t().targetIdle)}</span>`;
      if (desktopTypingPreview) {
        desktopTypingPreview.innerHTML = `<span style="color: #cbd5e1;">${escapeHtml(t().desktopPromptIdle)}</span>`;
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

  function updateHudStats() {
    hudScore.textContent = state.score.toLocaleString();
    if (homeScoreBadge) {
      homeScoreBadge.textContent = Math.max(state.highScore, state.score).toLocaleString();
    }
    if (hudCombo) hudCombo.textContent = `x${state.combo}`;
    if (hudLearnedCount) hudLearnedCount.textContent = String(learnedWordsSet.size);

    hudShields.textContent = '❤️'.repeat(Math.max(0, state.shields)) +
      '🖤'.repeat(Math.max(0, state.maxShields - state.shields));

    empCountEl.textContent = String(state.empCharges);
    const kbdEmpBadge = document.getElementById('kbdEmpCount');
    const kbdEmpBtn = document.getElementById('btnKbdEmp');
    if (kbdEmpBadge) kbdEmpBadge.textContent = String(state.empCharges);
    btnEmp.disabled = state.empCharges <= 0;
    if (kbdEmpBtn) kbdEmpBtn.style.opacity = state.empCharges <= 0 ? '0.42' : '1';

    const pct = state.totalWordsInLevel > 0
      ? Math.min(100, Math.round((state.wordsDestroyedInLevel / state.totalWordsInLevel) * 100))
      : 0;
    hudProgressBar.style.width = `${pct}%`;
    if (kbdProgressFill) kbdProgressFill.style.width = `${pct}%`;
    hudProgressText.textContent = `${state.wordsDestroyedInLevel} / ${state.totalWordsInLevel}`;

    if (hudRingCircle) {
      const ringCirc = 65.97;
      hudRingCircle.style.strokeDashoffset = (ringCirc * (1 - pct / 100)).toFixed(2);
    }
    if (sidebarDeckProgFill) sidebarDeckProgFill.style.width = `${pct}%`;
    if (sidebarDeckProgNum) {
      sidebarDeckProgNum.textContent = `${state.wordsDestroyedInLevel} / ${state.totalWordsInLevel}`;
    }
    if (arenaWavePill) {
      const waveNum = Math.max(1, Math.ceil((state.wordsDestroyedInLevel + 1) / 4));
      arenaWavePill.textContent = t().arenaWaveLabel(state.activeLessonIndex + 1, waveNum);
    }
  }

  function completeLevel() {
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
  function startPostLevelQuiz(levelWords) {
    const langWords = getAllWordsInTargetLang(state.targetLang);
    if (!levelWords || levelWords.length < 3 || langWords.length < 4) {
      state.activeQuiz = null;
      levelQuizBox.style.display = 'none';
      return;
    }

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

  // ==========================================================================
  // ГЛАВНЫЙ ИГРОВОЙ ЦИКЛ И ОТРИСОВКА ХОЛСТА CANVAS
  // ==========================================================================
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

  function render(now = 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bounds = getPlayBounds();
    const starClipBottom = state.screenMode === 'title' ? canvas.height : bounds.bottom;

    for (const neb of state.nebulae) {
      const grad = ctx.createRadialGradient(neb.x, neb.y, 10, neb.x, neb.y, neb.radius);
      grad.addColorStop(0, neb.color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(neb.x, neb.y, neb.radius, 0, Math.PI * 2);
      ctx.fill();
    }

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

    // На полноэкранной странице «Мои колоды» рендерим только звёздное небо и туманности на фоне
    if (state.screenMode === 'title' && state.homeSubView !== 'home') {
      return;
    }

    const hasClip = Boolean(bounds.clipRect);
    if (hasClip) {
      ctx.save();
      roundRect(ctx, bounds.clipRect.x, bounds.clipRect.y, bounds.clipRect.w, bounds.clipRect.h, 16);
      ctx.clip();
    }

    if (state.screenMode === 'play') {
      ctx.save();
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.045)';
      ctx.lineWidth = 1;
      const gridSize = canvas.width < 520 ? 44 : 60;
      const gridTop = bounds.clipRect ? bounds.clipRect.y : 0;
      const gridBottom = bounds.clipRect ? bounds.clipRect.y + bounds.clipRect.h : bounds.bottom;
      for (let x = bounds.left; x <= bounds.right; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, gridTop);
        ctx.lineTo(x, gridBottom);
        ctx.stroke();
      }
      for (let y = gridTop; y <= gridBottom; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(bounds.left, y);
        ctx.lineTo(bounds.right, y);
        ctx.stroke();
      }
      ctx.restore();
    }

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

    for (const rw of state.repulsorWaves) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, rw.alpha);
      ctx.strokeStyle = rw.color || '#2dd4bf';
      ctx.shadowColor = rw.color || '#2dd4bf';
      ctx.shadowBlur = 18;
      ctx.lineWidth = rw.lineWidth || 3.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(rw.x, rw.y + rw.radius * 0.28, rw.radius, -Math.PI * 0.82, -Math.PI * 0.18);
      ctx.stroke();

      ctx.strokeStyle = rw.coreColor || '#e0f2fe';
      ctx.lineWidth = Math.max(1.2, (rw.lineWidth || 3.5) * 0.42);
      ctx.beginPath();
      ctx.arc(rw.x, rw.y + rw.radius * 0.28, rw.radius, -Math.PI * 0.79, -Math.PI * 0.21);
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

    drawPlayerShip(now);

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

    for (const ft of state.floatingTranslations) {
      drawFloatingTranslation(ft, bounds);
    }

    if (state.weaponBannerTimer > 0 && state.weaponBannerText) {
      drawWeaponBanner(bounds);
    }
    if (state.layoutWarningTimer > 0) {
      drawLayoutWarning(bounds);
    }

    if (hasClip) {
      ctx.restore();
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

    const isTitle = state.screenMode === 'title';
    const flameLen = (isTitle ? 26 : 23) + Math.sin(now * 0.03) * 4 + Math.random() * 4;
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
    } else if (weapon.id === 'gravity') {
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(17, 9);
      ctx.lineTo(8, 12);
      ctx.lineTo(0, 8);
      ctx.lineTo(-8, 12);
      ctx.lineTo(-17, 9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#5eead4';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(0, -10, 12, -Math.PI * 0.85, -Math.PI * 0.15);
      ctx.stroke();

      ctx.fillStyle = '#ccfbf1';
      ctx.beginPath();
      ctx.arc(0, -17, 3.4, 0, Math.PI * 2);
      ctx.fill();
    } else {
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
    const style = getArticleStyle(w.entry.article, state.targetLang);
    const remainText = w.text.slice(w.typedCount);
    const typedText = w.text.slice(0, w.typedCount);
    const pinned = isEntryPinned(w.entry);

    const fontPx = getWordFontPx(w.text.length);
    ctx.font = `700 ${fontPx}px ${CANVAS_WORD_FONT}`;
    const typedW = ctx.measureText(typedText).width;
    const remainW = ctx.measureText(remainText).width;
    const totalW = typedW + remainW;

    const padX = canvas.width < 520 ? 11 : 15;
    const starPrefixW = pinned ? 18 : 0;
    const innerContentW = totalW + starPrefixW;
    const boxW = innerContentW + padX * 2;
    const capsuleH = fontPx + 16;
    const badgeStr = getTopBadgeTextForWord(w.entry);
    const hasTopBadge = Boolean(badgeStr);
    let badgeBoxW = 0;
    if (hasTopBadge) {
      ctx.font = `700 12.5px ${CANVAS_WORD_FONT}`;
      const maxBadgeW = Math.max(96, (bounds.right - bounds.left) - 24);
      badgeBoxW = Math.min(maxBadgeW, ctx.measureText(badgeStr).width + 18);
    }
    const effectiveHalfW = Math.max(boxW + 16, badgeBoxW + 8) / 2;
    w.boxW = effectiveHalfW * 2;
    w.boxH = capsuleH + (hasTopBadge ? 20 : 0);

    const clampedDrawX = Math.max(bounds.left + effectiveHalfW + 2, Math.min(bounds.right - effectiveHalfW - 2, w.x));
    w.x = clampedDrawX;

    ctx.save();
    ctx.translate(clampedDrawX, w.y);

    ctx.fillStyle = isLocked ? '#fb923c' : style.main;
    ctx.shadowColor = isLocked ? '#fb923c' : style.main;
    ctx.shadowBlur = isLocked ? 12 : 6;

    ctx.beginPath();
    ctx.arc(boxW / 2 + 7, -capsuleH / 2 + 5, isLocked ? 4.5 : 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = isLocked ? 'rgba(251, 146, 60, 0.9)' : style.glow;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(boxW / 2 + 7, -capsuleH / 2 + 5, isLocked ? 9.5 : 7, 0, Math.PI * 2);
    ctx.stroke();

    const boxX = -boxW / 2;
    const boxY = -capsuleH / 2;

    if (hasTopBadge) {
      ctx.shadowBlur = 0;
      ctx.font = `700 12.5px ${CANVAS_WORD_FONT}`;
      ctx.fillStyle = 'rgba(7, 13, 26, 0.96)';
      ctx.strokeStyle = style.main;
      ctx.lineWidth = 1.3;
      roundRect(ctx, -badgeBoxW / 2, boxY - 19, badgeBoxW, 18, 6);
      ctx.fill();
      ctx.stroke();

      ctx.direction = (state.studyMode === 'translate' && isRtlTranslation(w.entry) && (!w.entry.article || state.typeWithArticle))
        ? 'rtl'
        : 'ltr';
      ctx.fillStyle = state.studyMode === 'translate' ? '#fde047' : style.main;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeStr, 0, boxY - 10, badgeBoxW - 10);
    }

    ctx.shadowBlur = isLocked ? 12 : 0;
    ctx.fillStyle = isLocked
      ? 'rgba(30, 16, 8, 0.97)'
      : 'rgba(6, 11, 23, 0.96)';
    ctx.strokeStyle = isLocked
      ? '#fb923c'
      : (w.hitFlash > 0 ? '#ffffff' : (pinned ? '#fde047' : style.main));
    ctx.lineWidth = isLocked ? 2.2 : 1.5;

    roundRect(ctx, boxX, boxY, boxW, capsuleH, 9);
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.direction = 'ltr';
    const contentLeftX = -innerContentW / 2;

    if (pinned) {
      ctx.font = `700 13.5px ${CANVAS_WORD_FONT}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fde047';
      ctx.fillText('⭐', contentLeftX, 0.5);
    }

    ctx.font = `700 ${fontPx}px ${CANVAS_WORD_FONT}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const startTextX = contentLeftX + starPrefixW;

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

    const isMobile = canvas.width < 600;
    const isPromoBox = state.screenMode === 'title';
    const cleanWord = (ft.entry && (ft.entry.withArticle || ft.entry.word)) || ft.rawDe;
    let deFontPx = (isMobile || isPromoBox) ? (isMobile ? 16 : 17.5) : 22;
    let ruFontPx = (isMobile || isPromoBox) ? (isMobile ? 18.5 : 20) : 25;

    ctx.font = `700 ${deFontPx}px ${CANVAS_WORD_FONT}`;
    let deW = ctx.measureText(cleanWord).width;

    const translatedStr = getWordTranslation(ft.entry);
    const transText = `💥 ${translatedStr}`;
    ctx.font = `700 ${ruFontPx}px ${CANVAS_WORD_FONT}`;
    let transW = ctx.measureText(transText).width;

    const maxAllowedW = (bounds.right - bounds.left) - 16;
    if (deW + 28 > maxAllowedW && deFontPx > 12) {
      deFontPx = Math.max(12, Math.floor(deFontPx * (maxAllowedW - 28) / deW));
      ctx.font = `700 ${deFontPx}px ${CANVAS_WORD_FONT}`;
      deW = ctx.measureText(cleanWord).width;
    }
    if (transW + 28 > maxAllowedW && ruFontPx > 12.5) {
      ruFontPx = Math.max(12.5, Math.floor(ruFontPx * (maxAllowedW - 28) / transW));
      ctx.font = `700 ${ruFontPx}px ${CANVAS_WORD_FONT}`;
      transW = ctx.measureText(transText).width;
    }

    const cardW = Math.min(maxAllowedW, Math.max(deW, transW) + 32);
    const cardH = (isMobile || isPromoBox) ? (isMobile ? 58 : 64) : 74;
    const yTopOffset = (isMobile || isPromoBox) ? -12 : -14.5;
    const yBotOffset = (isMobile || isPromoBox) ? 13 : 15;

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
    ctx.font = `700 ${deFontPx}px ${CANVAS_WORD_FONT}`;
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(cleanWord, 0, yTopOffset);

    ctx.direction = isRtlTranslation(ft.entry) ? 'rtl' : 'ltr';
    ctx.font = `700 ${ruFontPx}px ${CANVAS_WORD_FONT}`;
    ctx.fillStyle = '#fde047';
    ctx.fillText(transText, 0, yBotOffset);

    ctx.restore();
  }

  function drawWeaponBanner(bounds) {
    const w = getCurrentWeapon();
    const borderCol = state.weaponBannerColor || w.color;
    const bannerFont = isHebrewUI()
      ? CANVAS_WORD_FONT
      : (state.nativeLang === 'en' ? '"Orbitron", "Exo 2", "Rubik", sans-serif' : CANVAS_HEADING_FONT);
    ctx.save();
    ctx.globalAlpha = Math.min(1, state.weaponBannerTimer * 1.4);
    ctx.font = `${isHebrewUI() ? 700 : 800} 14px ${bannerFont}`;
    const maxW = Math.max(200, (bounds.right - bounds.left) - 20);
    const textW = Math.min(maxW, ctx.measureText(state.weaponBannerText).width + 30);
    ctx.translate(bounds.centerX, state.ship.y - 56);
    ctx.fillStyle = 'rgba(7, 13, 26, 0.97)';
    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 1.9;
    roundRect(ctx, -textW / 2, -17, textW, 34, 999);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.weaponBannerText, 0, 0, textW - 18);
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

    ctx.font = `700 14.5px ${CANVAS_WORD_FONT}`;
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

  // ==========================================================================
  // 7) МОДАЛЬНОЕ ОКНО ИМПОРТА ANKI (.APKG) И СОБЫТИЯ ИНТЕРФЕЙСА
  // ==========================================================================
  function switchImportTab(tabId) {
    const isAnki = tabId === 'anki';
    if (tabImportAnki) tabImportAnki.classList.toggle('active', isAnki);
    if (tabImportManual) tabImportManual.classList.toggle('active', !isAnki);
    if (ankiImportPane) ankiImportPane.classList.toggle('hidden', !isAnki);
    if (manualImportPane) manualImportPane.classList.toggle('hidden', isAnki);
  }

  function setImportTargetLang(langCode) {
    if (!TARGET_LANG_META[langCode]) return;
    state.importTargetLang = langCode;
    document.querySelectorAll('.import-tlang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.importLang === langCode);
    });
    if (state.parsedAnkiData) {
      renderAnkiPreviewCards();
    }
  }

  function extractAnkiWordsForCurrentPreview(data) {
    if (!data || !window.AnkiImporter) return [];
    const frontIdx = Number(ankiFrontSelect ? ankiFrontSelect.value : 0) || 0;
    const backIdx = Number(ankiBackSelect ? ankiBackSelect.value : 1) || 1;
    const manualOverride = state.ankiManualOverride ? { frontIdx, backIdx } : null;
    if (window.AnkiImporter.extractNormalizedWordsFromParsedDeck) {
      return window.AnkiImporter.extractNormalizedWordsFromParsedDeck(data, state.importTargetLang, manualOverride);
    }
    return (data.rows || [])
      .map(r => window.AnkiImporter.normalizeCardToWordEntry(r[frontIdx], r[backIdx], state.importTargetLang, r[2] || ''))
      .filter(Boolean);
  }

  function renderAnkiPreviewCards() {
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

  async function handleAnkiFileSelected(file) {
    if (!file) return;
    ankiParseStatus.classList.remove('error');
    ankiParseStatus.textContent = '⏳ ...';
    ankiPreviewBox.classList.add('hidden');
    state.ankiManualOverride = false;

    try {
      const parsed = await window.AnkiImporter.parseUploadedDeckFile(file);
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

  function openCustomWordsModal(defaultTab = 'anki') {
    if (state.running && !state.paused) state.paused = true;
    setImportTargetLang(state.targetLang);
    switchImportTab(defaultTab);
    customWordsDialog.showModal();
  }

  // --- Кнопки и обработчики событий ---
  if (btnArcadeLaunch) {
    btnArcadeLaunch.addEventListener('click', launchFromTitleScreen);
  }
  if (btnBackToTitle) {
    btnBackToTitle.addEventListener('click', returnToTitleScreen);
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

  function launchPinnedWordsDrill() {
    sound.init();
    const pinned = getPinnedEntriesForTargetLang(state.targetLang);
    if (pinned.length === 0) return;
    startLevelNow(pinned, t().pinnedRoundTitle);
  }

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

  // Переключение Фильтра 2 (Перевод / Интерфейс)
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
      const order = ['de', 'en', 'es'];
      const next = order[(order.indexOf(state.targetLang) + 1) % order.length];
      setTargetLanguage(next);
      if (state.screenMode === 'play') {
        showLevelIntroOverlay();
      }
      btnTargetLangHud.blur();
    });
  }

  function toggleArticleTypingMode() {
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
      renderGameSettingsModal();
    }
  }

  if (btnArticleMode) {
    btnArticleMode.addEventListener('click', () => {
      toggleArticleTypingMode();
      btnArticleMode.blur();
    });
  }

  function applySpeedPresetByIndex(newIndex) {
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
      renderGameSettingsModal();
    }
  }

  function cycleSpeedPreset() {
    applySpeedPresetByIndex((state.speedPresetIndex + 1) % state.speedPresets.length);
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

  // Открытие полноэкранной страницы «Курсы» / «Мои колоды» (без всплывающей модалки!)
  [btnOpenCatalogTitle, btnTitleAllCourses, arcadeLogoSub, btnOpenCatalogHud, btnSidebarCatalog, btnOverlayCatalog, btnNavCourses].forEach(el => {
    if (!el) return;
    el.addEventListener('click', () => {
      openDecksPage({ sourceFilter: 'all', navMode: 'courses' });
      el.blur();
    });
  });

  if (btnNavDecks) {
    btnNavDecks.addEventListener('click', () => {
      openDecksPage({ sourceFilter: 'all', navMode: 'decks' });
      btnNavDecks.blur();
    });
  }

  if (btnDecksSubtabCourses) {
    btnDecksSubtabCourses.addEventListener('click', () => {
      state.decksNavMode = 'courses';
      state.catalogSourceFilter = 'official';
      state.openedDeckId = '';
      renderDecksPage();
    });
  }

  if (btnDecksSubtabMyDecks) {
    btnDecksSubtabMyDecks.addEventListener('click', () => {
      state.decksNavMode = 'decks';
      state.catalogSourceFilter = 'all';
      state.openedDeckId = '';
      renderDecksPage();
    });
  }

  if (btnDecksReturnBattle) {
    btnDecksReturnBattle.addEventListener('click', () => {
      resumeBattleFromDecksPage();
      btnDecksReturnBattle.blur();
    });
  }

  if (btnDecksViewGrid) {
    btnDecksViewGrid.addEventListener('click', () => {
      state.decksViewMode = 'grid';
      renderDecksPage();
    });
  }

  if (btnDecksViewList) {
    btnDecksViewList.addEventListener('click', () => {
      state.decksViewMode = 'list';
      renderDecksPage();
    });
  }

  if (decksSourceFilterGroup) {
    decksSourceFilterGroup.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest && e.target.closest('.decks-source-btn');
      if (!btn || !btn.dataset.sourceFilter) return;
      state.catalogSourceFilter = btn.dataset.sourceFilter;
      state.openedDeckId = '';
      renderDecksPage();
    });
  }

  if (decksCategoryFilterGroup) {
    decksCategoryFilterGroup.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest && e.target.closest('.decks-level-pill');
      if (!btn || !btn.dataset.categoryFilter) return;
      state.decksCategoryFilter = btn.dataset.categoryFilter;
      state.openedDeckId = '';
      renderDecksPage();
    });
  }

  if (decksLevelFilterGroup) {
    decksLevelFilterGroup.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest && e.target.closest('.decks-level-pill');
      if (!btn || !btn.dataset.levelFilter) return;
      state.decksLevelFilter = btn.dataset.levelFilter;
      state.openedDeckId = '';
      renderDecksPage();
    });
  }

  if (decksSearchInput) {
    decksSearchInput.addEventListener('input', () => {
      state.decksSearchQuery = decksSearchInput.value || '';
      if (state.openedDeckId) {
        state.openedDeckId = '';
      }
      renderDecksPage();
    });
  }

  if (btnDecksCreateDeck) {
    btnDecksCreateDeck.addEventListener('click', () => {
      openCustomWordsModal('manual');
      btnDecksCreateDeck.blur();
    });
  }

  document.querySelectorAll('.source-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.catalogSourceFilter = btn.dataset.sourceFilter || 'all';
      renderDecksPage();
    });
  });

  function resumePlayIfAllDialogsClosed() {
    const anyOpen = (
      (courseBrowserDialog && courseBrowserDialog.open) ||
      (customWordsDialog && customWordsDialog.open) ||
      (ttsSettingsDialog && ttsSettingsDialog.open) ||
      (dictDialog && dictDialog.open) ||
      (gameSettingsDialog && gameSettingsDialog.open) ||
      (statsDialog && statsDialog.open) ||
      (leaderboardDialog && leaderboardDialog.open)
    );
    if (!anyOpen && state.screenMode === 'play' && state.running && centerOverlay.classList.contains('hidden')) {
      state.paused = false;
    }
  }

  if (btnCloseCatalog) {
    btnCloseCatalog.addEventListener('click', () => {
      courseBrowserDialog.close();
      resumePlayIfAllDialogsClosed();
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
      const blob = window.AnkiImporter.generateSampleApkgBlob(state.importTargetLang);
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

  async function finalizeAndLaunchUserCourse(userCourse, openOnDecksPage = false) {
    await window.AnkiImporter.saveUserCourse(userCourse);
    state.userCourses = [userCourse, ...state.userCourses.filter(c => c.id !== userCourse.id)];
    customWordsDialog.close();

    if (state.targetLang !== userCourse.targetLang) {
      setTargetLanguage(userCourse.targetLang);
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

  async function buildAndImportCurrentAnkiDeck(openOnDecksPage = false) {
    const data = state.parsedAnkiData;
    if (!data) return;
    const words = extractAnkiWordsForCurrentPreview(data);
    if (words.length === 0) return;

    const deckTitle = (ankiDeckTitleInput && ankiDeckTitleInput.value.trim()) || data.deckName || 'Anki Deck';
    const userCourse = window.AnkiImporter.buildUserCourse({
      title: deckTitle,
      targetLang: state.importTargetLang,
      originType: 'anki',
      levelTag: data.levelTag || undefined,
      words,
      lessonSize: 12
    });

    await finalizeAndLaunchUserCourse(userCourse, openOnDecksPage);
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
      if (window.AnkiImporter && window.AnkiImporter.parseAdminTextbookBlock) {
        const block = window.AnkiImporter.parseAdminTextbookBlock(
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
            const entry = window.AnkiImporter.normalizeCardToWordEntry(
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

      const userCourse = window.AnkiImporter.buildUserCourse({
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

  // --- Студия Gemini 3.8 TTS ---
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

  btnPause.addEventListener('click', () => {
    togglePause();
    btnPause.blur();
  });

  if (btnQuickLevels) {
    btnQuickLevels.addEventListener('click', () => {
      openCourseCatalogModal('all');
    });
  }

  if (btnClearFeed) {
    btnClearFeed.addEventListener('click', () => {
      state.killHistory = [];
      rerenderKillFeed();
    });
  }

  // --- Словарь курса + фильтр слов со звёздочкой ⭐ ---
  function renderFullDictionary(filterQuery = '') {
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

  function openDictionaryModal() {
    if (state.running && !state.paused) state.paused = true;
    renderFullDictionary(dictSearchInput.value);
    dictDialog.showModal();
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
    resumePlayIfAllDialogsClosed();
  });

  dictSearchInput.addEventListener('input', () => {
    renderFullDictionary(dictSearchInput.value);
  });

  // ==========================================================================
  // 8) Z-LINGO 2.0: НОВЫЕ БЛОКИ (НАВИГАЦИЯ, РЕЖИМ ОБУЧЕНИЯ, ПОПАДАНИЕ, МОДАЛКИ)
  // ==========================================================================
  function setStudyMode(modeId) {
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

  if (studyModeGroup) {
    studyModeGroup.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest && e.target.closest('.study-mode-btn');
      if (!btn || !btn.dataset.studyMode) return;
      sound.init();
      setStudyMode(btn.dataset.studyMode);
      btn.blur();
    });
  }

  function toggleDesktopKeyboard(forceState) {
    state.desktopKbdOpen = typeof forceState === 'boolean' ? forceState : !state.desktopKbdOpen;
    saveSettingsPatch({ desktopKbdOpen: state.desktopKbdOpen });
    document.body.classList.toggle('desktop-kbd-open', state.desktopKbdOpen);
    if (btnToggleDesktopKbd) {
      btnToggleDesktopKbd.classList.toggle('active', state.desktopKbdOpen);
    }
    resizeCanvas();
    requestAnimationFrame(() => resizeCanvas());
    if (gameSettingsDialog && gameSettingsDialog.open) {
      renderGameSettingsModal();
    }
  }

  if (btnToggleDesktopKbd) {
    btnToggleDesktopKbd.classList.toggle('active', state.desktopKbdOpen);
    btnToggleDesktopKbd.addEventListener('click', () => {
      toggleDesktopKeyboard();
      btnToggleDesktopKbd.blur();
    });
  }

  // Навигация верхней шапки на Главной (возвращает с «Моих колод» обратно на Главную!)
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

  // Циклическая кнопка испытания оружия прямо в промо-окне на Главной
  if (btnPromoWeaponCycle) {
    btnPromoWeaponCycle.addEventListener('click', () => {
      sound.init();
      const curIdx = WEAPONS.findIndex(w => w.id === state.weaponId);
      const nextW = WEAPONS[(curIdx + 1) % WEAPONS.length];
      equipWeapon(nextW.id, true);
      btnPromoWeaponCycle.blur();
    });
  }

  // Кнопка языковой пары в верхнем HUD Академии
  if (btnHudLangPair) {
    btnHudLangPair.addEventListener('click', (e) => {
      sound.init();
      if (e.shiftKey) {
        const order = ['de', 'en', 'es'];
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

  // Кликабельная активная карточка колоды в левом сайдбаре
  if (sidebarActiveDeckCard) {
    sidebarActiveDeckCard.addEventListener('click', () => {
      openCourseCatalogModal('all');
    });
    sidebarActiveDeckCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCourseCatalogModal('all');
      }
    });
  }

  // Карточка «🎯 ПОПАДАНИЕ!» справа: 🔊 Озвучить, ✓ Знаю, ↻ Повторить
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

  // --- Модальное окно 1: Гибкие настройки игры ---
  function renderGameSettingsModal() {
    if (!gameSettingsDialog) return;
    const tr = t();
    if (gameSettingsDialogTitle) gameSettingsDialogTitle.textContent = tr.gameSettingsTitle;
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

  function openGameSettingsModal() {
    if (!gameSettingsDialog) return;
    if (state.running && !state.paused) state.paused = true;
    renderGameSettingsModal();
    gameSettingsDialog.showModal();
  }

  [btnHomeSettings, btnHudGameSettings, btnSidebarGameSettings].forEach(el => {
    if (!el) return;
    el.addEventListener('click', () => {
      openGameSettingsModal();
      el.blur();
    });
  });

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
      resumePlayIfAllDialogsClosed();
    });
  }

  // --- Модальное окно 2: Подробная статистика пилота ---
  function renderStatsModal() {
    if (!statsDialog || !statsModalGrid) return;
    const tr = t();
    if (statsDialogTitle) statsDialogTitle.textContent = tr.statsDialogTitle;

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

  function openStatsModal() {
    if (!statsDialog) return;
    if (state.running && !state.paused) state.paused = true;
    renderStatsModal();
    statsDialog.showModal();
  }

  [btnNavStats, btnOpenStatsCard, btnHomeStreakChip].forEach(el => {
    if (!el) return;
    el.addEventListener('click', () => {
      openStatsModal();
      el.blur();
    });
  });

  if (btnCloseStatsDialog) {
    btnCloseStatsDialog.addEventListener('click', () => {
      statsDialog.close();
      resumePlayIfAllDialogsClosed();
    });
  }

  // --- Модальное окно 3: Рейтинг недели и достижения ---
  function renderLeaderboardModal() {
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

  function openLeaderboardModal() {
    if (!leaderboardDialog) return;
    if (state.running && !state.paused) state.paused = true;
    renderLeaderboardModal();
    leaderboardDialog.showModal();
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
      resumePlayIfAllDialogsClosed();
    });
  }

  // Если любое модальное окно закрыто клавишей Esc или кликом по фону — возобновляем полёт
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

  // ==========================================================================
  // 9) СТУДИЯ СУПЕР-АДМИНА (#adminStudioView): СОЗДАНИЕ УРОКОВ, AI-ПЕРЕВОД И КАТЕГОРИИ
  // ==========================================================================
  const ADMIN_CATALOG_LS_KEY = 'zlingo_admin_catalog_v1';
  const ADMIN_GH_TOKEN_LS_KEY = 'zlingo_admin_gh_token';
  const ADMIN_PASSWORD_LS_KEY = 'zlingo_admin_password';

  function normalizeAdminCatalogObject(rawObj) {
    const obj = (rawObj && typeof rawObj === 'object') ? rawObj : {};
    return {
      version: 1,
      updatedAt: typeof obj.updatedAt === 'string' ? obj.updatedAt : '',
      categories: Array.isArray(obj.categories) ? obj.categories : [],
      courses: {
        de: (obj.courses && Array.isArray(obj.courses.de)) ? obj.courses.de : [],
        en: (obj.courses && Array.isArray(obj.courses.en)) ? obj.courses.en : [],
        es: (obj.courses && Array.isArray(obj.courses.es)) ? obj.courses.es : []
      },
      courseOverrides: (obj.courseOverrides && typeof obj.courseOverrides === 'object')
        ? obj.courseOverrides
        : {},
      deletedCourseIds: Array.isArray(obj.deletedCourseIds) ? obj.deletedCourseIds : []
    };
  }

  function saveAdminCatalogLocal() {
    state.adminCatalog.updatedAt = new Date().toISOString();
    saveJsonStorage(ADMIN_CATALOG_LS_KEY, state.adminCatalog);
  }

  function getStoredAdminCreds() {
    let ghToken = '';
    let adminPass = '';
    try {
      ghToken = localStorage.getItem(ADMIN_GH_TOKEN_LS_KEY) || '';
      adminPass = localStorage.getItem(ADMIN_PASSWORD_LS_KEY) || '';
    } catch (_) {}
    const geminiKey = (adminGeminiKeyInput && adminGeminiKeyInput.value.trim()) || ttsManager.localApiKey || '';
    return {
      geminiKey,
      ghToken: (adminGithubTokenInput && adminGithubTokenInput.value.trim()) || ghToken,
      adminPass: (adminPasswordInput && adminPasswordInput.value.trim()) || adminPass
    };
  }

  function showAdminStatus(message, isError = false) {
    if (!adminStatusBanner) return;
    adminStatusBanner.textContent = message;
    adminStatusBanner.classList.remove('hidden');
    adminStatusBanner.style.borderColor = isError ? 'rgba(248, 113, 113, 0.55)' : 'rgba(52, 211, 153, 0.45)';
    adminStatusBanner.style.background = isError ? 'rgba(127, 29, 29, 0.32)' : 'rgba(6, 78, 59, 0.32)';
    adminStatusBanner.style.color = isError ? '#fecaca' : '#a7f3d0';
  }

  async function fetchAndMergeCloudAdminCatalog() {
    if (location.protocol !== 'http:' && location.protocol !== 'https:') return;
    try {
      const res = await fetch(`./admin-catalog.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) return;
      const cloudRaw = await res.json();
      const cloud = normalizeAdminCatalogObject(cloudRaw);
      const local = normalizeAdminCatalogObject(state.adminCatalog);

      const cloudTime = Date.parse(cloud.updatedAt || '') || 0;
      const localTime = Date.parse(local.updatedAt || '') || 0;
      const cloudNewer = cloudTime >= localTime;

      const catMap = new Map();
      (cloudNewer ? local.categories : cloud.categories).forEach(c => { if (c && c.id) catMap.set(c.id, c); });
      (cloudNewer ? cloud.categories : local.categories).forEach(c => { if (c && c.id) catMap.set(c.id, c); });

      const mergedCourses = { de: [], en: [], es: [] };
      const delSet = new Set(cloudNewer ? cloud.deletedCourseIds : local.deletedCourseIds);

      ['de', 'en', 'es'].forEach(lg => {
        const cMap = new Map();
        const olderList = cloudNewer ? local.courses[lg] : cloud.courses[lg];
        const newerList = cloudNewer ? cloud.courses[lg] : local.courses[lg];
        olderList.forEach(c => { if (c && c.id && !delSet.has(c.id)) cMap.set(c.id, c); });
        newerList.forEach(c => { if (c && c.id && !delSet.has(c.id)) cMap.set(c.id, c); });
        mergedCourses[lg] = Array.from(cMap.values());
      });

      const mergedOverrides = cloudNewer
        ? { ...local.courseOverrides, ...cloud.courseOverrides }
        : { ...cloud.courseOverrides, ...local.courseOverrides };

      state.adminCatalog = {
        version: 1,
        updatedAt: cloudNewer ? (cloud.updatedAt || local.updatedAt) : (local.updatedAt || cloud.updatedAt),
        categories: Array.from(catMap.values()),
        courses: mergedCourses,
        courseOverrides: mergedOverrides,
        deletedCourseIds: Array.from(delSet)
      };

      saveJsonStorage(ADMIN_CATALOG_LS_KEY, state.adminCatalog);
      ensureValidCourseSelection();
      renderLevelSidebar();
      renderHomeDashboardWidgets();
      if (state.homeSubView === 'decks') renderDecksPage();
      if (state.homeSubView === 'admin') renderAdminStudio();
    } catch (_) {
      // Тихий фоллбэк при локальном запуске без сервера
    }
  }

  async function publishAdminCatalogToCloud(commitMessage = 'chore(catalog): update courses via Super Admin Studio') {
    saveAdminCatalogLocal();
    const creds = getStoredAdminCreds();

    if (location.protocol !== 'http:' && location.protocol !== 'https:') {
      showAdminStatus(
        '💾 Сохранено локально в браузере! (Для авто-публикации на хостинг откройте сайт на Vercel или скачайте admin-catalog.json).',
        false
      );
      return false;
    }

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (creds.ghToken) headers['x-github-token'] = creds.ghToken;
      if (creds.adminPass) headers['x-admin-password'] = creds.adminPass;

      const res = await fetch('/api/admin-publish', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          catalog: state.adminCatalog,
          commitMessage
        })
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data && data.ok) {
        showAdminStatus(
          `🌍 Опубликовано на хостинг (${data.repo || 'GitHub'} · коммит ${data.commitSha || 'main'})! Vercel автоматически обновляет игру для всех игроков.`,
          false
        );
        return true;
      }

      if (res.status === 503 && data && data.localSavedOnly) {
        showAdminStatus(
          `💾 Изменения уже работают у вас в браузере! Чтобы опубликовать их для всех игроков в 1 клик, откройте «🔑 Настройка глобальной публикации» выше и укажите GitHub Token (или нажмите «📥 Скачать JSON»).`,
          false
        );
        return false;
      }

      showAdminStatus(
        `⚠️ Сохранено локально, но публикация на GitHub вернула ответ: ${(data && data.message) || res.statusText || res.status}`,
        true
      );
      return false;
    } catch (err) {
      showAdminStatus(
        `💾 Сохранено локально в браузере! Облачный эндпоинт сейчас недоступен (${err && err.message ? err.message : 'offline'}) — вы также можете нажать «📥 Скачать JSON».`,
        false
      );
      return false;
    }
  }

  function ensureCourseOverrideRecord(courseId) {
    if (!state.adminCatalog.courseOverrides || typeof state.adminCatalog.courseOverrides !== 'object') {
      state.adminCatalog.courseOverrides = {};
    }
    if (!state.adminCatalog.courseOverrides[courseId]) {
      state.adminCatalog.courseOverrides[courseId] = {};
    }
    return state.adminCatalog.courseOverrides[courseId];
  }

  function findMutableAdminCourse(courseId, langHint = '') {
    const langs = langHint ? [langHint, 'de', 'en', 'es'] : ['de', 'en', 'es'];
    for (const lg of langs) {
      const arr = state.adminCatalog.courses && state.adminCatalog.courses[lg];
      if (!Array.isArray(arr)) continue;
      const hit = arr.find(c => c && c.id === courseId);
      if (hit) return hit;
    }
    return null;
  }

  function populateAdminCategorySelect(preferredCatId = '') {
    if (!adminCategorySelect) return;
    const prevVal = preferredCatId || adminCategorySelect.value || 'business';
    const cats = getAllCategories();
    adminCategorySelect.innerHTML = '';
    cats.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      const title = (cat.titles && (cat.titles.ru || cat.titles.en)) || cat.id;
      opt.textContent = `${cat.icon || '🗂️'} ${title}`;
      adminCategorySelect.appendChild(opt);
    });
    if (cats.some(c => c.id === prevVal)) {
      adminCategorySelect.value = prevVal;
    } else if (cats.some(c => c.id === 'business')) {
      adminCategorySelect.value = 'business';
    } else if (cats.length > 0) {
      adminCategorySelect.value = cats[0].id;
    }
  }

  function populateAdminTargetCourseSelect() {
    if (!adminTargetCourseSelect) return;
    const srcLang = (adminSourceLangSelect && adminSourceLangSelect.value) || 'de';
    const prevCourseId = adminTargetCourseSelect.value;
    const courses = getOfficialCoursesForTargetLang(srcLang);
    adminTargetCourseSelect.innerHTML = '';
    courses.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      const catObj = getCategoryById(inferCourseCategory(c));
      const catTag = catObj ? `[${(catObj.titles && catObj.titles.ru) || catObj.id}] ` : '';
      opt.textContent = `${c.icon || '📚'} ${catTag}${(c.titles && c.titles.ru) || c.id} (${c.levelTag || 'B1'})`;
      adminTargetCourseSelect.appendChild(opt);
    });
    if (courses.some(c => c.id === prevCourseId)) {
      adminTargetCourseSelect.value = prevCourseId;
    }
  }

  function getAdminParsedDraft() {
    const rawText = (adminRawWordsTextarea && adminRawWordsTextarea.value) || '';
    const srcLang = (adminSourceLangSelect && adminSourceLangSelect.value) || 'de';
    const transLang = (adminTransLangSelect && adminTransLangSelect.value) || 'ru';
    if (!window.AnkiImporter || !window.AnkiImporter.parseAdminTextbookBlock) {
      return { detectedTitle: '', words: [], skippedCount: 0, sectionCount: 0 };
    }
    const parsed = window.AnkiImporter.parseAdminTextbookBlock(rawText, srcLang, transLang);

    // Если есть кешированный AI-перевод для этих же слов — накладываем { ru, en, he }
    const aiCache = state.adminAiPreviewResult;
    if (aiCache && aiCache.targetLang === srcLang && Array.isArray(aiCache.byWordKey)) {
      const mapByRaw = new Map(aiCache.byWordKey);
      parsed.words.forEach(w => {
        const hit = mapByRaw.get(w.raw);
        if (hit) {
          w.translations = {
            ru: hit.ru || (w.translations && w.translations.ru) || '',
            en: hit.en || (w.translations && w.translations.en) || '',
            he: hit.he || (w.translations && w.translations.he) || ''
          };
        }
      });
    }
    return parsed;
  }

  function renderAdminLivePreview() {
    if (!adminLivePreviewList || !adminLiveParseSummary) return;
    const parsed = getAdminParsedDraft();
    const count = parsed.words.length;

    if (adminLiveCountBadge) {
      adminLiveCountBadge.textContent = `${count} сл.`;
    }

    if (parsed.detectedTitle && adminCourseTitleInput && !state.adminTitleManuallyEdited) {
      adminCourseTitleInput.value = parsed.detectedTitle;
    }

    if (count === 0) {
      adminLiveParseSummary.textContent = 'Вставьте список слов выше — парсер мгновенно покажет разбивку на уроки (по 12 слов + Босс-уроки).';
      adminLivePreviewList.innerHTML = '';
      return;
    }

    const lessonCount = Math.ceil(count / 12);
    const modCount = Math.ceil(lessonCount / 3);
    const bossCount = count >= 12 ? modCount : 0;
    const aiBadge = state.adminAiPreviewResult ? ' · ✨ AI-перевод (RU/EN/HE) готов' : '';
    const skipNote = parsed.skippedCount > 0 ? ` · пропущено строк: ${parsed.skippedCount}` : '';
    adminLiveParseSummary.textContent =
      `✓ Распознано ${count} сл. → ${modCount} мод. (${lessonCount} ур. по ≤12 сл.${bossCount ? ` + ${bossCount} 👹 Босс` : ''})${aiBadge}${skipNote}`;

    adminLivePreviewList.innerHTML = '';
    parsed.words.slice(0, 80).forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'admin-preview-row';
      const trMap = item.translations || {};
      const ruTxt = trMap.ru || '—';
      const enTxt = trMap.en && trMap.en !== trMap.ru ? ` · EN: ${trMap.en}` : '';
      const heTxt = trMap.he && trMap.he !== trMap.ru ? ` · HE: ${trMap.he}` : '';
      row.innerHTML = `
        <div class="admin-prev-left" dir="ltr">
          <span class="admin-prev-art">${escapeHtml(item.article || 'Wort')}</span>
          <strong style="color:#f8fafc;">${escapeHtml(item.word)}</strong>
          ${item.raw !== item.word ? `<span style="color:#64748b; font-size:0.74rem;">(${escapeHtml(item.raw)})</span>` : ''}
        </div>
        <div class="admin-prev-trans">${idx + 1}. 🇷🇺 ${escapeHtml(ruTxt)}${escapeHtml(enTxt)}${escapeHtml(heTxt)}</div>
      `;
      adminLivePreviewList.appendChild(row);
    });
  }

  async function enrichWordsViaGeminiApi(words, targetLang, inputTransLang, courseTitle, levelTag) {
    const creds = getStoredAdminCreds();
    const headers = { 'Content-Type': 'application/json' };
    if (creds.geminiKey) headers['x-gemini-api-key'] = creds.geminiKey;

    const batchSize = 45;
    let mergedCourseTitles = null;
    let mergedCourseDescs = null;
    const byWordKey = [];
    const enrichedWords = words.map(w => ({
      ...w,
      translations: { ...(w.translations || {}) }
    }));

    for (let offset = 0; offset < enrichedWords.length; offset += batchSize) {
      const slice = enrichedWords.slice(offset, offset + batchSize);
      const payloadItems = slice.map((w, localIdx) => ({
        idx: localIdx,
        front: w.raw || w.withArticle || w.word,
        trans: (w.translations && w.translations[inputTransLang]) || (w.translations && w.translations.ru) || ''
      }));

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          mode: 'enrich_ui_langs',
          targetLang,
          inputTransLang,
          courseTitle,
          levelTag,
          items: payloadItems
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data || !data.ok || !data.result) {
        const msg = (data && data.message) || (data && data.error) || `HTTP ${res.status}`;
        const err = new Error(msg);
        err.code = (data && data.error) || '';
        throw err;
      }

      if (!mergedCourseTitles && data.result.courseTitles) {
        mergedCourseTitles = data.result.courseTitles;
      }
      if (!mergedCourseDescs && data.result.courseDescs) {
        mergedCourseDescs = data.result.courseDescs;
      }

      const transArr = Array.isArray(data.result.translations) ? data.result.translations : [];
      transArr.forEach(tRow => {
        const targetItem = slice[tRow.idx];
        if (!targetItem) return;
        const authorVal = (targetItem.translations && targetItem.translations[inputTransLang]) || '';
        targetItem.translations = {
          ru: (inputTransLang === 'ru' && authorVal) ? authorVal : (tRow.ru || authorVal),
          en: (inputTransLang === 'en' && authorVal) ? authorVal : (tRow.en || authorVal),
          he: (inputTransLang === 'he' && authorVal) ? authorVal : (tRow.he || authorVal)
        };
      });
    }

    enrichedWords.forEach(w => {
      byWordKey.push([w.raw, { ...w.translations }]);
    });

    return {
      courseTitles: mergedCourseTitles,
      courseDescs: mergedCourseDescs,
      words: enrichedWords,
      byWordKey
    };
  }

  async function cloneCourseToTargetLangViaGemini(words, fromLang, toLang, courseTitle, levelTag, category, icon) {
    const creds = getStoredAdminCreds();
    const headers = { 'Content-Type': 'application/json' };
    if (creds.geminiKey) headers['x-gemini-api-key'] = creds.geminiKey;

    const batchSize = 45;
    let cloneTitles = null;
    let cloneDescs = null;
    const clonedEntries = [];

    for (let offset = 0; offset < words.length; offset += batchSize) {
      const slice = words.slice(offset, offset + batchSize);
      const payloadItems = slice.map((w, localIdx) => ({
        idx: localIdx,
        front: w.raw || w.withArticle || w.word,
        ru: (w.translations && w.translations.ru) || '',
        en: (w.translations && w.translations.en) || ''
      }));

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          mode: 'clone_target_course',
          fromLang,
          toLang,
          courseTitle,
          levelTag,
          items: payloadItems
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data || !data.ok || !data.result) {
        throw new Error((data && data.message) || `Clone ${toLang} HTTP ${res.status}`);
      }

      if (!cloneTitles && data.result.courseTitles) cloneTitles = data.result.courseTitles;
      if (!cloneDescs && data.result.courseDescs) cloneDescs = data.result.courseDescs;

      const itemsOut = Array.isArray(data.result.items) ? data.result.items : [];
      itemsOut.forEach(row => {
        if (!row || !row.front) return;
        const parsedOne = window.AnkiImporter.parseAdminTextbookBlock(
          `${row.front};${row.ru || row.en || ''}`,
          toLang,
          'ru'
        );
        const wObj = parsedOne.words && parsedOne.words[0];
        if (wObj) {
          wObj.translations = {
            ru: row.ru || wObj.translations.ru || '',
            en: row.en || wObj.translations.en || '',
            he: row.he || wObj.translations.he || ''
          };
          clonedEntries.push(wObj);
        }
      });
    }

    if (clonedEntries.length === 0) return null;

    return window.AnkiImporter.buildOfficialAdminCourse({
      targetLang: toLang,
      category,
      icon,
      levelTag,
      titles: cloneTitles,
      descriptions: cloneDescs,
      fallbackTitle: courseTitle,
      words: clonedEntries,
      lessonSize: 12
    });
  }

  function moveModuleBetweenOfficialCourses(langCode, fromCourseId, moduleId, toCourseId) {
    if (!fromCourseId || !toCourseId || fromCourseId === toCourseId) return;
    const allCourses = getOfficialCoursesForTargetLang(langCode);
    const fromCourse = allCourses.find(c => c.id === fromCourseId);
    const toCourse = allCourses.find(c => c.id === toCourseId);
    if (!fromCourse || !toCourse) return;

    const modObj = (fromCourse.modules || []).find(m => m.id === moduleId);
    if (!modObj) return;

    const clonedMod = JSON.parse(JSON.stringify(modObj));
    const newModId = `${toCourseId}-mv-${Date.now().toString(36).slice(-4)}`;
    clonedMod.id = newModId;
    clonedMod.lessons = (clonedMod.lessons || []).map((ls, idx) => ({
      ...ls,
      id: ls.isBoss ? `${newModId}-boss` : `${newModId}-l${idx + 1}`
    }));

    // 1. Убираем модуль из исходного курса
    const mutableFrom = findMutableAdminCourse(fromCourseId, langCode);
    if (mutableFrom && Array.isArray(mutableFrom.modules)) {
      mutableFrom.modules = mutableFrom.modules.filter(m => m.id !== moduleId);
    } else {
      const ovFrom = ensureCourseOverrideRecord(fromCourseId);
      if (Array.isArray(ovFrom.appendedModules)) {
        ovFrom.appendedModules = ovFrom.appendedModules.filter(m => m.id !== moduleId);
      }
      const rem = new Set(Array.isArray(ovFrom.removedModuleIds) ? ovFrom.removedModuleIds : []);
      rem.add(moduleId);
      ovFrom.removedModuleIds = Array.from(rem);
    }

    // 2. Добавляем модуль в целевой курс
    const mutableTo = findMutableAdminCourse(toCourseId, langCode);
    if (mutableTo) {
      mutableTo.modules = [...(mutableTo.modules || []), clonedMod];
    } else {
      const ovTo = ensureCourseOverrideRecord(toCourseId);
      ovTo.appendedModules = [...(Array.isArray(ovTo.appendedModules) ? ovTo.appendedModules : []), clonedMod];
    }

    saveAdminCatalogLocal();
    ensureValidCourseSelection();
    renderLevelSidebar();
    renderHomeDashboardWidgets();
    renderAdminStudio();
    showAdminStatus(
      `✅ Модуль «${(modObj.titles && modObj.titles.ru) || moduleId}» перенесён в курс «${(toCourse.titles && toCourse.titles.ru) || toCourseId}»! Нажмите «🌍 Опубликовать изменения на хостинг», чтобы обновить у всех игроков.`,
      false
    );
  }

  function renderAdminCategoriesTree() {
    if (!adminCategoriesTree) return;
    const orgLang = state.adminOrgLang || state.targetLang || 'de';

    if (adminOrganizerLangTabs) {
      adminOrganizerLangTabs.querySelectorAll('[data-admin-org-lang]').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-admin-org-lang') === orgLang);
      });
    }

    const cats = getAllCategories();
    const courses = getOfficialCoursesForTargetLang(orgLang);
    const levelOptions = ['A1', 'A1–A2', 'A2', 'A2–B1', 'B1', 'B1–B2', 'B2', 'C1'];

    adminCategoriesTree.innerHTML = '';

    cats.forEach(cat => {
      const inCat = courses.filter(c => inferCourseCategory(c) === cat.id);
      const groupEl = document.createElement('div');
      groupEl.className = 'admin-cat-group';

      const catTitle = (cat.titles && (cat.titles.ru || cat.titles.en)) || cat.id;
      const headEl = document.createElement('div');
      headEl.className = 'admin-cat-group-head';
      headEl.innerHTML = `
        <span class="admin-cat-group-title">${escapeHtml(cat.icon || '🗂️')} ${escapeHtml(catTitle)}</span>
        <span class="deck-tag-badge cefr">${inCat.length} курс.</span>
      `;
      groupEl.appendChild(headEl);

      if (inCat.length === 0) {
        const emptyHint = document.createElement('div');
        emptyHint.style.fontSize = '0.78rem';
        emptyHint.style.color = '#64748b';
        emptyHint.style.padding = '4px 2px';
        emptyHint.textContent = 'Пока нет курсов в этой категории — перенесите сюда курс ниже или создайте новый слева.';
        groupEl.appendChild(emptyHint);
      }

      inCat.forEach((course) => {
        const globalIdx = courses.findIndex(x => x.id === course.id);
        const wordsTotal = getAllWordsInCourse(course).length;
        const modList = course.modules || [];
        const regularLessonCount = modList.reduce(
          (acc, m) => acc + (m.lessons || []).filter(ls => !ls.isBoss).length,
          0
        );

        const rowCard = document.createElement('div');
        rowCard.className = 'admin-course-org-row';

        const topRow = document.createElement('div');
        topRow.className = 'admin-course-org-top';
        topRow.innerHTML = `
          <div>
            <div class="admin-course-org-name">
              ${escapeHtml(course.icon || '📚')} ${escapeHtml((course.titles && course.titles.ru) || course.id)}
              ${course.isAdminCreated ? '<span class="deck-tag-badge creator" style="margin-left:6px;">ADMIN</span>' : ''}
            </div>
            <div class="admin-course-org-meta">
              ${wordsTotal} сл. · ${modList.length} мод. · ${regularLessonCount} ур. · ID: <code>${escapeHtml(course.id)}</code>
            </div>
          </div>
          <div style="display:flex; gap:5px; align-items:center;">
            <button type="button" class="hud-btn btn-org-up" title="Поднять выше" ${globalIdx <= 0 ? 'disabled' : ''}>↑</button>
            <button type="button" class="hud-btn btn-org-down" title="Опустить ниже" ${globalIdx >= courses.length - 1 ? 'disabled' : ''}>↓</button>
            <button type="button" class="hud-btn active btn-org-play" title="Запустить курс">▶</button>
            <button type="button" class="hud-btn btn-org-del" title="Удалить / скрыть курс" style="color:#fca5a5;">🗑️</button>
          </div>
        `;
        rowCard.appendChild(topRow);

        // Контролы смены Категории и Уровня CEFR
        const controlsRow = document.createElement('div');
        controlsRow.className = 'admin-course-org-controls';

        const catSelect = document.createElement('select');
        catSelect.title = 'Категория курса';
        cats.forEach(cOpt => {
          const o = document.createElement('option');
          o.value = cOpt.id;
          o.textContent = `🗂️ ${(cOpt.titles && cOpt.titles.ru) || cOpt.id}`;
          if (cOpt.id === inferCourseCategory(course)) o.selected = true;
          catSelect.appendChild(o);
        });
        catSelect.addEventListener('change', () => {
          const newCat = catSelect.value;
          const mutable = findMutableAdminCourse(course.id, orgLang);
          if (mutable) mutable.category = newCat;
          const ov = ensureCourseOverrideRecord(course.id);
          ov.category = newCat;
          saveAdminCatalogLocal();
          renderHomeDashboardWidgets();
          renderAdminStudio();
          showAdminStatus(`✅ Курс «${(course.titles && course.titles.ru) || course.id}» перемещён в категорию «${newCat}».`, false);
        });
        controlsRow.appendChild(catSelect);

        const lvlSelect = document.createElement('select');
        lvlSelect.title = 'Уровень CEFR';
        const curLvl = course.levelTag || 'B1';
        const allLvls = levelOptions.includes(curLvl) ? levelOptions : [curLvl, ...levelOptions];
        allLvls.forEach(lv => {
          const o = document.createElement('option');
          o.value = lv;
          o.textContent = `📊 ${lv}`;
          if (lv === curLvl) o.selected = true;
          lvlSelect.appendChild(o);
        });
        lvlSelect.addEventListener('change', () => {
          const newLvl = lvlSelect.value;
          const mutable = findMutableAdminCourse(course.id, orgLang);
          if (mutable) mutable.levelTag = newLvl;
          const ov = ensureCourseOverrideRecord(course.id);
          ov.levelTag = newLvl;
          saveAdminCatalogLocal();
          renderHomeDashboardWidgets();
          renderAdminStudio();
          showAdminStatus(`✅ Уровень курса «${(course.titles && course.titles.ru) || course.id}» изменён на ${newLvl}.`, false);
        });
        controlsRow.appendChild(lvlSelect);

        rowCard.appendChild(controlsRow);

        // Раскрывающийся список модулей и уроков с возможностью переноса модуля в другой курс
        if (modList.length > 0) {
          const detailsEl = document.createElement('details');
          detailsEl.style.marginTop = '4px';
          const summaryEl = document.createElement('summary');
          summaryEl.style.cursor = 'pointer';
          summaryEl.style.fontSize = '0.78rem';
          summaryEl.style.color = '#7dd3fc';
          summaryEl.style.fontWeight = '600';
          summaryEl.textContent = `📖 Уроки внутри курса (${modList.length} мод. / ${regularLessonCount} ур.)`;
          detailsEl.appendChild(summaryEl);

          const modsWrap = document.createElement('div');
          modsWrap.style.display = 'flex';
          modsWrap.style.flexDirection = 'column';
          modsWrap.style.gap = '6px';
          modsWrap.style.marginTop = '6px';

          modList.forEach((mObj, mIdx) => {
            const mBox = document.createElement('div');
            mBox.style.padding = '7px 9px';
            mBox.style.borderRadius = '8px';
            mBox.style.background = 'rgba(2, 6, 23, 0.52)';
            mBox.style.border = '1px solid rgba(148, 163, 184, 0.14)';

            const lessonNames = (mObj.lessons || [])
              .map((ls, lIdx) => ls.isBoss ? '👹 Босс' : `${lIdx + 1}. ${(ls.titles && ls.titles.ru) || ls.id} (${(ls.words || []).length})`)
              .join(' · ');

            mBox.innerHTML = `
              <div style="font-size:0.8rem; font-weight:700; color:#e2e8f0;">
                ${escapeHtml((mObj.titles && mObj.titles.ru) || `Модуль ${mIdx + 1}`)}
              </div>
              <div style="font-size:0.74rem; color:#94a3b8; margin:3px 0 6px;">
                ${escapeHtml(lessonNames)}
              </div>
            `;

            const otherCourses = courses.filter(c => c.id !== course.id);
            if (otherCourses.length > 0) {
              const moveSelect = document.createElement('select');
              moveSelect.style.width = '100%';
              moveSelect.style.padding = '4px 8px';
              moveSelect.style.borderRadius = '7px';
              moveSelect.style.background = 'rgba(15, 23, 42, 0.9)';
              moveSelect.style.color = '#cbd5e1';
              moveSelect.style.border = '1px solid rgba(56, 189, 248, 0.25)';
              moveSelect.style.fontSize = '0.75rem';

              const placeholderOpt = document.createElement('option');
              placeholderOpt.value = '';
              placeholderOpt.textContent = '↪ Перенести эти уроки в другой курс...';
              moveSelect.appendChild(placeholderOpt);

              otherCourses.forEach(oc => {
                const opt = document.createElement('option');
                opt.value = oc.id;
                opt.textContent = `→ ${oc.icon || '📚'} ${(oc.titles && oc.titles.ru) || oc.id}`;
                moveSelect.appendChild(opt);
              });

              moveSelect.addEventListener('change', () => {
                if (moveSelect.value) {
                  moveModuleBetweenOfficialCourses(orgLang, course.id, mObj.id, moveSelect.value);
                }
              });
              mBox.appendChild(moveSelect);
            }

            modsWrap.appendChild(mBox);
          });

          detailsEl.appendChild(modsWrap);
          rowCard.appendChild(detailsEl);
        }

        // Кнопки ↑ / ↓ / ▶ / 🗑️
        const upBtn = topRow.querySelector('.btn-org-up');
        if (upBtn) {
          upBtn.addEventListener('click', () => {
            if (globalIdx <= 0) return;
            courses.forEach((cItem, i) => {
              ensureCourseOverrideRecord(cItem.id).orderIndex = i;
            });
            const prevCourse = courses[globalIdx - 1];
            ensureCourseOverrideRecord(course.id).orderIndex = globalIdx - 1;
            ensureCourseOverrideRecord(prevCourse.id).orderIndex = globalIdx;
            saveAdminCatalogLocal();
            renderHomeDashboardWidgets();
            renderAdminStudio();
          });
        }

        const downBtn = topRow.querySelector('.btn-org-down');
        if (downBtn) {
          downBtn.addEventListener('click', () => {
            if (globalIdx >= courses.length - 1) return;
            courses.forEach((cItem, i) => {
              ensureCourseOverrideRecord(cItem.id).orderIndex = i;
            });
            const nextCourse = courses[globalIdx + 1];
            ensureCourseOverrideRecord(course.id).orderIndex = globalIdx + 1;
            ensureCourseOverrideRecord(nextCourse.id).orderIndex = globalIdx;
            saveAdminCatalogLocal();
            renderHomeDashboardWidgets();
            renderAdminStudio();
          });
        }

        const playBtn = topRow.querySelector('.btn-org-play');
        if (playBtn) {
          playBtn.addEventListener('click', () => {
            if (state.targetLang !== orgLang) {
              setTargetLanguage(orgLang);
            }
            launchDeckLessonFromPage(course.id, 0, 0);
          });
        }

        const delBtn = topRow.querySelector('.btn-org-del');
        if (delBtn) {
          delBtn.addEventListener('click', () => {
            const titleLabel = (course.titles && course.titles.ru) || course.id;
            if (!window.confirm(`Удалить / скрыть курс «${titleLabel}» из каталога?`)) return;
            if (Array.isArray(state.adminCatalog.courses[orgLang])) {
              state.adminCatalog.courses[orgLang] = state.adminCatalog.courses[orgLang].filter(c => c.id !== course.id);
            }
            if (!course.isAdminCreated) {
              const delSet = new Set(state.adminCatalog.deletedCourseIds || []);
              delSet.add(course.id);
              state.adminCatalog.deletedCourseIds = Array.from(delSet);
            }
            saveAdminCatalogLocal();
            ensureValidCourseSelection();
            renderLevelSidebar();
            renderHomeDashboardWidgets();
            renderAdminStudio();
            showAdminStatus(`🗑️ Курс «${titleLabel}» удалён из активного каталога.`, false);
          });
        }

        groupEl.appendChild(rowCard);
      });

      adminCategoriesTree.appendChild(groupEl);
    });

    if (Array.isArray(state.adminCatalog.deletedCourseIds) && state.adminCatalog.deletedCourseIds.length > 0) {
      const restoreBtn = document.createElement('button');
      restoreBtn.type = 'button';
      restoreBtn.className = 'deck-btn-secondary';
      restoreBtn.style.alignSelf = 'flex-start';
      restoreBtn.textContent = `↺ Восстановить скрытые базовые курсы (${state.adminCatalog.deletedCourseIds.length})`;
      restoreBtn.addEventListener('click', () => {
        state.adminCatalog.deletedCourseIds = [];
        saveAdminCatalogLocal();
        renderHomeDashboardWidgets();
        renderAdminStudio();
        showAdminStatus('✅ Все базовые курсы восстановлены!', false);
      });
      adminCategoriesTree.appendChild(restoreBtn);
    }
  }

  function renderAdminStudio() {
    if (!adminStudioView) return;

    // Подгружаем сохранённые ключи в поля (если пользователь сейчас не печатает в них)
    const creds = getStoredAdminCreds();
    if (adminGeminiKeyInput && document.activeElement !== adminGeminiKeyInput) {
      adminGeminiKeyInput.value = ttsManager.localApiKey || '';
    }
    if (adminGithubTokenInput && document.activeElement !== adminGithubTokenInput) {
      adminGithubTokenInput.value = creds.ghToken;
    }
    if (adminPasswordInput && document.activeElement !== adminPasswordInput) {
      adminPasswordInput.value = creds.adminPass;
    }

    populateAdminCategorySelect();
    populateAdminTargetCourseSelect();

    const isAppend = adminPlacementModeSelect && adminPlacementModeSelect.value === 'append_course';
    if (adminAppendTargetWrap) {
      adminAppendTargetWrap.classList.toggle('hidden', !isAppend);
    }

    renderAdminLivePreview();
    renderAdminCategoriesTree();
  }

  // Обработчики навигации и кнопок Студии Супер-Админа
  [btnNavAdmin, btnDecksOpenAdmin].forEach(el => {
    if (!el) return;
    el.addEventListener('click', () => {
      openAdminStudio();
      el.blur();
    });
  });

  if (btnAdminBackToDecks) {
    btnAdminBackToDecks.addEventListener('click', () => {
      openDecksPage({ sourceFilter: 'official', navMode: 'courses' });
    });
  }

  if (btnAdminSaveCreds) {
    btnAdminSaveCreds.addEventListener('click', () => {
      const gemKey = (adminGeminiKeyInput && adminGeminiKeyInput.value.trim()) || '';
      const ghTok = (adminGithubTokenInput && adminGithubTokenInput.value.trim()) || '';
      const admPass = (adminPasswordInput && adminPasswordInput.value.trim()) || '';
      ttsManager.setLocalApiKey(gemKey);
      try {
        if (ghTok) localStorage.setItem(ADMIN_GH_TOKEN_LS_KEY, ghTok);
        else localStorage.removeItem(ADMIN_GH_TOKEN_LS_KEY);
        if (admPass) localStorage.setItem(ADMIN_PASSWORD_LS_KEY, admPass);
        else localStorage.removeItem(ADMIN_PASSWORD_LS_KEY);
      } catch (_) {}
      showAdminStatus('🔑 Ключи сохранены локально в вашем браузере (Gemini 3.8 AI + публикация на GitHub/Vercel).', false);
    });
  }

  if (btnAdminToggleNewCat && adminNewCategoryBox) {
    btnAdminToggleNewCat.addEventListener('click', () => {
      adminNewCategoryBox.classList.toggle('hidden');
      if (!adminNewCategoryBox.classList.contains('hidden') && adminNewCatTitleRu) {
        adminNewCatTitleRu.focus();
      }
    });
  }

  if (btnAdminCreateCategory) {
    btnAdminCreateCategory.addEventListener('click', () => {
      const ruTitle = (adminNewCatTitleRu && adminNewCatTitleRu.value.trim()) || '';
      if (!ruTitle) return;
      const enTitle = (adminNewCatTitleEn && adminNewCatTitleEn.value.trim()) || ruTitle;
      const iconChar = (adminNewCatIcon && adminNewCatIcon.value.trim()) || '📁';
      const catId = ruTitle
        .toLowerCase()
        .replace(/[^a-z0-9а-яё]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 24) || `cat-${Date.now().toString(36).slice(-4)}`;

      const existing = state.adminCatalog.categories || [];
      state.adminCatalog.categories = [
        ...existing.filter(c => c.id !== catId),
        {
          id: catId,
          icon: iconChar,
          titles: { ru: ruTitle, en: enTitle, he: enTitle }
        }
      ];
      saveAdminCatalogLocal();
      if (adminNewCatTitleRu) adminNewCatTitleRu.value = '';
      if (adminNewCatTitleEn) adminNewCatTitleEn.value = '';
      if (adminNewCategoryBox) adminNewCategoryBox.classList.add('hidden');
      if (adminIconInput) adminIconInput.value = iconChar;
      populateAdminCategorySelect(catId);
      renderAdminCategoriesTree();
      showAdminStatus(`🗂️ Создана новая категория «${iconChar} ${ruTitle}»!`, false);
    });
  }

  if (adminCategorySelect) {
    adminCategorySelect.addEventListener('change', () => {
      const catObj = getCategoryById(adminCategorySelect.value);
      if (catObj && catObj.icon && adminIconInput) {
        adminIconInput.value = catObj.icon;
      }
    });
  }

  if (adminPlacementModeSelect) {
    adminPlacementModeSelect.addEventListener('change', () => {
      const isAppend = adminPlacementModeSelect.value === 'append_course';
      if (adminAppendTargetWrap) {
        adminAppendTargetWrap.classList.toggle('hidden', !isAppend);
      }
      populateAdminTargetCourseSelect();
    });
  }

  if (adminCourseTitleInput) {
    adminCourseTitleInput.addEventListener('input', () => {
      state.adminTitleManuallyEdited = Boolean(adminCourseTitleInput.value.trim());
    });
  }

  [adminRawWordsTextarea, adminSourceLangSelect, adminTransLangSelect].forEach(el => {
    if (!el) return;
    const evName = el.tagName === 'TEXTAREA' ? 'input' : 'change';
    el.addEventListener(evName, () => {
      state.adminAiPreviewResult = null;
      if (el === adminSourceLangSelect) {
        populateAdminTargetCourseSelect();
      }
      renderAdminLivePreview();
    });
  });

  if (adminOrganizerLangTabs) {
    adminOrganizerLangTabs.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest && e.target.closest('[data-admin-org-lang]');
      if (!btn) return;
      const lg = btn.getAttribute('data-admin-org-lang');
      if (lg && TARGET_LANG_META[lg]) {
        state.adminOrgLang = lg;
        renderAdminCategoriesTree();
      }
    });
  }

  if (btnAdminAiPreview) {
    btnAdminAiPreview.addEventListener('click', async () => {
      const parsed = getAdminParsedDraft();
      if (parsed.words.length === 0) {
        showAdminStatus('⚠️ Сначала вставьте список слов в текстовое поле.', true);
        return;
      }
      const srcLang = (adminSourceLangSelect && adminSourceLangSelect.value) || 'de';
      const transLang = (adminTransLangSelect && adminTransLangSelect.value) || 'ru';
      const levelTag = (adminLevelSelect && adminLevelSelect.value) || 'B1';
      const courseTitle = (adminCourseTitleInput && adminCourseTitleInput.value.trim()) || parsed.detectedTitle || 'Новый курс';

      const prevText = btnAdminAiPreview.textContent;
      btnAdminAiPreview.disabled = true;
      btnAdminAiPreview.textContent = '⏳ Gemini 3.8 AI переводит...';
      showAdminStatus(`🤖 Переводим ${parsed.words.length} сл. на RU / EN / עברית через Gemini 3.8 Flash...`, false);

      try {
        const aiOut = await enrichWordsViaGeminiApi(parsed.words, srcLang, transLang, courseTitle, levelTag);
        state.adminAiPreviewResult = {
          targetLang: srcLang,
          courseTitles: aiOut.courseTitles,
          courseDescs: aiOut.courseDescs,
          byWordKey: aiOut.byWordKey
        };
        if (aiOut.courseTitles && aiOut.courseTitles.ru && adminCourseTitleInput && !state.adminTitleManuallyEdited) {
          adminCourseTitleInput.value = aiOut.courseTitles.ru;
        }
        renderAdminLivePreview();
        showAdminStatus(`✨ Готово! Переведены все ${parsed.words.length} карточек на русский, английский и иврит.`, false);
      } catch (err) {
        showAdminStatus(`⚠️ Не удалось выполнить AI-перевод: ${err && err.message ? err.message : 'ошибка'}. Проверьте ключ Gemini в блоке «🔑 Настройка».`, true);
      } finally {
        btnAdminAiPreview.disabled = false;
        btnAdminAiPreview.textContent = prevText;
      }
    });
  }

  if (btnAdminCreateAndPublish) {
    btnAdminCreateAndPublish.addEventListener('click', async () => {
      let parsed = getAdminParsedDraft();
      if (parsed.words.length === 0) {
        showAdminStatus('⚠️ Вставьте список слов (например, Start, der (-s);старт, начало) перед созданием уроков.', true);
        return;
      }

      const srcLang = (adminSourceLangSelect && adminSourceLangSelect.value) || 'de';
      const transLang = (adminTransLangSelect && adminTransLangSelect.value) || 'ru';
      const levelTag = (adminLevelSelect && adminLevelSelect.value) || 'B1';
      const category = (adminCategorySelect && adminCategorySelect.value) || 'business';
      const icon = (adminIconInput && adminIconInput.value.trim()) || '💼';
      const placementMode = (adminPlacementModeSelect && adminPlacementModeSelect.value) || 'new_course';
      const rawTitle = (adminCourseTitleInput && adminCourseTitleInput.value.trim()) || parsed.detectedTitle || 'Новый курс';

      const prevBtnLabel = btnAdminCreateAndPublish.textContent;
      btnAdminCreateAndPublish.disabled = true;
      btnAdminCreateAndPublish.textContent = '⏳ Собираем уроки и переводим...';

      let wordsToUse = parsed.words;
      let aiTitles = state.adminAiPreviewResult ? state.adminAiPreviewResult.courseTitles : null;
      let aiDescs = state.adminAiPreviewResult ? state.adminAiPreviewResult.courseDescs : null;

      try {
        if (adminAiEnrichUiCheck && adminAiEnrichUiCheck.checked && !state.adminAiPreviewResult) {
          try {
            showAdminStatus(`🤖 Авто-перевод ${wordsToUse.length} сл. (RU / EN / עברית) через Gemini 3.8 AI...`, false);
            const aiRes = await enrichWordsViaGeminiApi(wordsToUse, srcLang, transLang, rawTitle, levelTag);
            wordsToUse = aiRes.words;
            aiTitles = aiRes.courseTitles;
            aiDescs = aiRes.courseDescs;
          } catch (_) {
            // Продолжаем с авторским переводом без блокировки создания курса!
          }
        }

        if (placementMode === 'append_course') {
          const targetCourseId = adminTargetCourseSelect && adminTargetCourseSelect.value;
          if (!targetCourseId) {
            showAdminStatus('⚠️ Выберите существующий курс для добавления уроков.', true);
            return;
          }
          const tempCourse = window.AnkiImporter.buildOfficialAdminCourse({
            id: `${targetCourseId}-add-${Date.now().toString(36).slice(-4)}`,
            targetLang: srcLang,
            category,
            icon,
            levelTag,
            titles: aiTitles || { ru: rawTitle, en: rawTitle, he: rawTitle },
            descriptions: aiDescs,
            fallbackTitle: rawTitle,
            words: wordsToUse,
            lessonSize: 12
          });

          const mutableTarget = findMutableAdminCourse(targetCourseId, srcLang);
          if (mutableTarget) {
            mutableTarget.modules = [...(mutableTarget.modules || []), ...(tempCourse.modules || [])];
          } else {
            const ov = ensureCourseOverrideRecord(targetCourseId);
            ov.appendedModules = [...(Array.isArray(ov.appendedModules) ? ov.appendedModules : []), ...(tempCourse.modules || [])];
          }

          saveAdminCatalogLocal();
          await publishAdminCatalogToCloud(`feat(catalog): append ${wordsToUse.length} words (${rawTitle}) to ${targetCourseId}`);
        } else {
          const newCourse = window.AnkiImporter.buildOfficialAdminCourse({
            targetLang: srcLang,
            category,
            icon,
            levelTag,
            titles: aiTitles ? { ...aiTitles, ru: adminCourseTitleInput.value.trim() || aiTitles.ru } : null,
            descriptions: aiDescs,
            fallbackTitle: rawTitle,
            words: wordsToUse,
            lessonSize: 12
          });

          if (!Array.isArray(state.adminCatalog.courses[srcLang])) {
            state.adminCatalog.courses[srcLang] = [];
          }
          state.adminCatalog.courses[srcLang].push(newCourse);

          // Опциональное клонирование курса на другие изучаемые языки (EN / ES / DE)
          if (adminAiCloneTargetsCheck && adminAiCloneTargetsCheck.checked) {
            const otherLangs = ['de', 'en', 'es'].filter(lg => lg !== srcLang);
            for (const toLg of otherLangs) {
              try {
                showAdminStatus(`🌐 Генерируем версию курса для языка ${toLg.toUpperCase()} через Gemini 3.8 AI...`, false);
                const cloned = await cloneCourseToTargetLangViaGemini(
                  wordsToUse,
                  srcLang,
                  toLg,
                  rawTitle,
                  levelTag,
                  category,
                  icon
                );
                if (cloned) {
                  state.adminCatalog.courses[toLg].push(cloned);
                }
              } catch (_) {}
            }
          }

          state.adminOrgLang = srcLang;
          saveAdminCatalogLocal();
          if (state.targetLang === srcLang) {
            selectCourseLesson(newCourse.id, 0, 0, false);
          }
          await publishAdminCatalogToCloud(`feat(catalog): add ${srcLang.toUpperCase()} ${levelTag} course "${rawTitle}" (${wordsToUse.length} words)`);
        }

        // Очищаем черновик после успешного создания
        if (adminRawWordsTextarea) adminRawWordsTextarea.value = '';
        if (adminCourseTitleInput) adminCourseTitleInput.value = '';
        state.adminTitleManuallyEdited = false;
        state.adminAiPreviewResult = null;

        ensureValidCourseSelection();
        renderLevelSidebar();
        renderHomeDashboardWidgets();
        renderAdminStudio();
      } finally {
        btnAdminCreateAndPublish.disabled = false;
        btnAdminCreateAndPublish.textContent = prevBtnLabel;
      }
    });
  }

  if (btnAdminSyncCloud) {
    btnAdminSyncCloud.addEventListener('click', async () => {
      btnAdminSyncCloud.disabled = true;
      try {
        await publishAdminCatalogToCloud('chore(catalog): sync categories & courses from Super Admin Studio');
      } finally {
        btnAdminSyncCloud.disabled = false;
      }
    });
  }

  if (btnAdminExportJson) {
    btnAdminExportJson.addEventListener('click', () => {
      saveAdminCatalogLocal();
      const blob = new Blob([JSON.stringify(state.adminCatalog, null, 2) + '\n'], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'admin-catalog.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      showAdminStatus('📥 Файл admin-catalog.json скачан.', false);
    });
  }

  if (btnAdminImportJson && adminImportJsonInput) {
    btnAdminImportJson.addEventListener('click', () => {
      adminImportJsonInput.click();
    });
    adminImportJsonInput.addEventListener('change', async () => {
      const f = adminImportJsonInput.files && adminImportJsonInput.files[0];
      if (!f) return;
      try {
        const text = await f.text();
        const parsed = JSON.parse(text);
        state.adminCatalog = normalizeAdminCatalogObject(parsed);
        saveAdminCatalogLocal();
        ensureValidCourseSelection();
        renderLevelSidebar();
        renderHomeDashboardWidgets();
        renderAdminStudio();
        showAdminStatus('📤 Файл admin-catalog.json успешно загружен и применён!', false);
      } catch (err) {
        showAdminStatus(`⚠️ Ошибка чтения JSON: ${err && err.message ? err.message : 'некорректный файл'}`, true);
      } finally {
        adminImportJsonInput.value = '';
      }
    });
  }

  // --- Инициализация приложения ---
  async function initGame() {
    if (window.AnkiImporter) {
      state.userCourses = await window.AnkiImporter.loadUserCourses();
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
})();
