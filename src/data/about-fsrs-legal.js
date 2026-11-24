// ============================================================================
// Контент вкладок «🧠 FSRS-5» и «🛡️ Приватность & Cookies» для «О проекте»
// Полная локализация на 8 языков (ru, en, de, es, uk, tr, he, ar) (SRP)
// ============================================================================

export const ABOUT_LINKS = {
  fsrsRepo: 'https://github.com/open-spaced-repetition/fsrs4anki',
  privacy: 'privacy.html',
  cookies: 'cookies.html',
  terms: 'terms.html'
};

export const ABOUT_FSRS_LEGAL = {
  ru: {
    fsrsTabLabel: 'Алгоритм FSRS-5',
    legalTabLabel: 'Приватность и Cookies',
    fsrs: {
      badge: 'OPEN-SOURCE · FSRS4ANKI / FSRS-5',
      title: 'Научное интервальное повторение прямо во время космического боя',
      intro: 'В VOCANOVA встроен современный алгоритм FSRS-5 (Free Spaced Repetition Scheduler) с открытым исходным кодом. В отличие от классического SM-2 с жёсткими шагами, FSRS-5 моделирует реальную кривую забывания для каждого слова — и оценивает ваш ответ автоматически по тому, как точно вы сбили слово в игре.',
      formulaLabel: 'Кривая забывания FSRS-5 (целевое удержание R = 90%)',
      formulaCaption: 't — дней с прошлого повтора · S — стабильность памяти (дней до падения R до 90%) · D — сложность слова [1..10].',
      dsrTitle: 'Модель памяти DSR (Difficulty · Stability · Retrievability)',
      dsrCards: [
        { code: 'D', tone: 'rose', title: 'Difficulty (Сложность 1–10)', text: 'Персональный коэффициент трудности слова. Увеличивается при опечатках и прорывах к щиту, снижается при чистых сериях попаданий.' },
        { code: 'S', tone: 'emerald', title: 'Stability (Стабильность)', text: 'Интервал в днях, через который вероятность вспомнить слово снизится с 100% до 90%. Растёт нелинейно при каждом успешном повторе.' },
        { code: 'R', tone: 'cyan', title: 'Retrievability (Доступность)', text: 'Живая вероятность того, что вы помните слово прямо сейчас. Как только R падает до ~90%, слово возвращается в очередь боя.' }
      ],
      howTitle: 'Как шутер автоматически ставит оценки (без скучных кнопок)',
      howSubtitle: 'Вам не нужно вручную нажимать «Сложно / Хорошо / Легко» после каждой карточки — боевой движок делает это сам:',
      ratings: [
        { badge: '4 · EASY', tone: 'emerald', trigger: '0 ошибок при наборе + комбо ≥ x5 (или «✓ Знаю»)', effect: 'Максимальный буст стабильности S; сразу долгий интервал (от 4+ дней и дальше).' },
        { badge: '3 · GOOD', tone: 'cyan', trigger: '0 ошибок при сбитии слова (или верный ответ в блиц-опросе)', effect: 'Стандартный расчёт оптимального интервала на границе 90% забывания.' },
        { badge: '2 · HARD', tone: 'amber', trigger: '1–2 опечатки при наборе слова в полёте', effect: 'Повышает сложность D и заметно сокращает следующий интервал до повтора.' },
        { badge: '1 · AGAIN', tone: 'rose', trigger: '≥ 3 опечаток, прорыв слова к щиту, ошибка в блице или ⭐ «Повторить»', effect: 'Переводит карту в режим немедленного доучивания и приоритетно подмешивает в следующие волны.' }
      ],
      liveTitle: 'Ваша память FSRS-5 прямо сейчас (для выбранного языка)',
      liveTracked: 'Слов в FSRS',
      liveDue: 'К повтору сейчас',
      liveMastered: 'В долгой памяти (S ≥ 21д)',
      liveRetention: 'Средняя память R',
      ctaReviewDue: '🧠 Запустить FSRS-повтор',
      ctaStartPlaying: '▶ Играть и обучать FSRS',
      ctaRepo: 'GitHub: fsrs4anki ↗'
    },
    legal: {
      badge: 'EU / GDPR · DSGVO · ePRIVACY',
      title: 'Как VOCANOVA защищает ваши данные и что требуется по законам ЕС',
      subtitle: 'Прозрачная архитектура «сначала браузер» (Local-First) + полное раскрытие для будущей синхронизации через Google и серверных запросов.',
      cards: [
        { icon: '💾', tone: 'emerald', title: 'Прогресс, FSRS и Anki — локально', text: 'Весь прогресс, статистика FSRS-5 (zlingo_fsrs_cards_v1) и импортированные колоды .apkg хранятся только в вашем браузере (localStorage и IndexedDB) и никогда не отправляются на наш сервер.' },
        { icon: '☁️', tone: 'cyan', title: 'Сервер Vercel и запросы TTS / Перевода', text: 'Сайт размещён на Vercel (кратковременные технические HTTP-логи безопасности по ст. 6(1)(f) GDPR). При нажатии на озвучку или перевод на прокси /api/tts и /api/translate уходит только текст слова.' },
        { icon: '🔐', tone: 'amber', title: 'Почта и будущий вход через Google (OAuth)', text: 'Сейчас регистрация не обязательна. При подключении опционального входа через Google почта используется строго для облачной синхронизации колод и прогресса (ст. 6(1)(b)), а рассылки — только по отдельной галочке согласия (ст. 6(1)(a)).' },
        { icon: '⚖️', tone: 'violet', title: 'Права пользователей ЕС (ст. 15–22 GDPR)', text: 'Вы вправе запросить доступ, экспорт, исправление или полное удаление данных (ст. 17 GDPR) через alefweb7@gmail.com, а также в любой момент сбросить localStorage и настройки cookies прямо в браузере.' }
      ],
      storageTitle: 'Реестр ключей хранения в браузере',
      storageColumns: ['Ключ / Хранилище', 'Назначение', 'Категория'],
      storageRows: [
        { key: 'zdeutsch_save_v2', purpose: 'Выбранные языки, активный курс/урок, скорость, оружие и рекорд', category: 'Необходимое' },
        { key: 'zlingo_fsrs_cards_v1', purpose: 'Память FSRS-5 по словам (D, S, интервал и время следующего повтора)', category: 'Необходимое' },
        { key: 'zlingo_learned_words_v1 / pinned / daily', purpose: 'Изученные слова, ⭐ закладки, дневная цель и серия дней', category: 'Необходимое' },
        { key: 'zlingo_cookie_consent_v1', purpose: 'Ваш выбор настроек приватности и согласия с баннером cookies', category: 'Необходимое' },
        { key: 'IndexedDB (Anki Decks)', purpose: 'Ваши загруженные колоды .apkg / .colpkg — только на вашем устройстве', category: 'Необходимое' },
        { key: 'zdeutsch_gemini_api_key', purpose: 'Необязательный личный ключ Gemini API для TTS (если введён пользователем)', category: 'Функциональное' }
      ],
      ctaCookiePrefs: '⚙️ Настроить cookies',
      ctaPrivacyDoc: 'Политика конфиденциальности (GDPR) ↗',
      ctaCookiesDoc: 'Политика Cookies & Storage ↗',
      ctaTermsDoc: 'Условия и Impressum ↗'
    }
  },
  en: {
    fsrsTabLabel: 'FSRS-5 Algorithm',
    legalTabLabel: 'Privacy & Cookies',
    fsrs: {
      badge: 'OPEN-SOURCE · FSRS4ANKI / FSRS-5',
      title: 'Scientific Spaced Repetition Powered Inside Every Arcade Battle',
      intro: 'VOCANOVA integrates the open-source FSRS-5 (Free Spaced Repetition Scheduler) algorithm. Unlike rigid SM-2 multipliers, FSRS-5 models your real forgetting curve per word—and grades each word automatically based on typing accuracy and gameplay outcomes.',
      formulaLabel: 'FSRS-5 Power-Law Forgetting Curve (Target Retention R = 90%)',
      formulaCaption: 't = days since last review · S = memory stability (days until recall drops to 90%) · D = word difficulty [1..10].',
      dsrTitle: 'The DSR Memory Model (Difficulty · Stability · Retrievability)',
      dsrCards: [
        { code: 'D', tone: 'rose', title: 'Difficulty (1–10)', text: 'Tracks how hard a word is for you personally. Rises after typos or shield hits, and decays smoothly on clean streaks.' },
        { code: 'S', tone: 'emerald', title: 'Stability (Days)', text: 'How many days it takes for recall probability to decay from 100% down to 90%. Grows faster when recalled near the optimal boundary.' },
        { code: 'R', tone: 'cyan', title: 'Retrievability (%)', text: 'Real-time estimated chance you recall the word right now. Once R approaches 90%, the word returns to your due battle queue.' }
      ],
      howTitle: 'Zero Boring Self-Grading: Automatic Shooter Scoring',
      howSubtitle: 'No tedious 4-button flashcard clicking after every word—your typing telemetry sets the FSRS-5 rating automatically:',
      ratings: [
        { badge: '4 · EASY', tone: 'emerald', trigger: '0 typos + combo ≥ x5 (or clicking "✓ Know" in Spotlight)', effect: 'Maximum stability boost; rapidly expands interval (4+ days onward).' },
        { badge: '3 · GOOD', tone: 'cyan', trigger: '0 typos on word kill (or correct answer in post-lesson blitz)', effect: 'Standard optimal FSRS-5 schedule calibrated to ~90% retention.' },
        { badge: '2 · HARD', tone: 'amber', trigger: '1–2 typos while typing the falling word', effect: 'Increases Difficulty D and keeps the next review interval tighter.' },
        { badge: '1 · AGAIN', tone: 'rose', trigger: '≥ 3 typos, word hits ship shield, quiz miss, or "↻ Repeat"', effect: 'Flags immediate relearning and prioritizes the word in upcoming waves & drills.' }
      ],
      liveTitle: 'Your Live FSRS-5 Memory State (Current Target Language)',
      liveTracked: 'Tracked Words',
      liveDue: 'Due Now',
      liveMastered: 'Long-Term (S ≥ 21d)',
      liveRetention: 'Avg Retention R',
      ctaReviewDue: '🧠 Start FSRS Due Review',
      ctaStartPlaying: '▶ Play to Train FSRS',
      ctaRepo: 'GitHub: fsrs4anki ↗'
    },
    legal: {
      badge: 'EU / GDPR · DSGVO · ePRIVACY',
      title: 'How VOCANOVA Protects Your Privacy & Complies With EU Law',
      subtitle: 'Transparent Local-First browser architecture plus full GDPR clarity on server proxies and optional future Google Sign-In.',
      cards: [
        { icon: '💾', tone: 'emerald', title: 'Progress, FSRS & Anki Stay Local', text: 'Your progress, FSRS-5 memory records (zlingo_fsrs_cards_v1), and imported .apkg decks are stored solely inside your browser (localStorage & IndexedDB)—never uploaded behind your back.' },
        { icon: '☁️', tone: 'cyan', title: 'Vercel Hosting & TTS / Translation', text: 'Hosted on Vercel (standard short-lived security logs under GDPR Art. 6(1)(f)). Audio or translation calls to /api/tts and /api/translate send only the word text when triggered.' },
        { icon: '🔐', tone: 'amber', title: 'Email & Future Google Sign-In', text: 'No account is required today. If optional Google Sign-In is added for cross-device sync, email is used strictly for account/sync (Art. 6(1)(b)); newsletters require a separate unchecked opt-in (Art. 6(1)(a)).' },
        { icon: '⚖️', tone: 'violet', title: 'Your EU / GDPR Rights (Art. 15–22)', text: 'You have the right to access, export, rectify, or erase data (Art. 17) via alefweb7@gmail.com, and you can wipe browser storage or adjust cookie settings anytime.' }
      ],
      storageTitle: 'Browser Storage & Cookie Inventory',
      storageColumns: ['Storage Key', 'Purpose', 'Category'],
      storageRows: [
        { key: 'zdeutsch_save_v2', purpose: 'Language pair, active course/lesson, speed, weapon & high score', category: 'Essential' },
        { key: 'zlingo_fsrs_cards_v1', purpose: 'Per-word FSRS-5 memory data (Difficulty, Stability & next due timestamp)', category: 'Essential' },
        { key: 'zlingo_learned_words_v1 / pinned / daily', purpose: 'Learned vocabulary, ⭐ bookmarks, daily goal & streak counter', category: 'Essential' },
        { key: 'zlingo_cookie_consent_v1', purpose: 'Stores your GDPR privacy banner / preference modal decision', category: 'Essential' },
        { key: 'IndexedDB (Anki Decks)', purpose: 'Your imported .apkg / .colpkg / custom decks kept offline on device', category: 'Essential' },
        { key: 'zdeutsch_gemini_api_key', purpose: 'Optional user-supplied Gemini API key for studio TTS playback', category: 'Functional' }
      ],
      ctaCookiePrefs: '⚙️ Cookie Settings',
      ctaPrivacyDoc: 'Privacy Policy (GDPR) ↗',
      ctaCookiesDoc: 'Cookie & Storage Policy ↗',
      ctaTermsDoc: 'Terms & Impressum ↗'
    }
  },
  de: {
    fsrsTabLabel: 'FSRS-5 Algorithmus',
    legalTabLabel: 'Datenschutz & Cookies',
    fsrs: {
      badge: 'OPEN-SOURCE · FSRS4ANKI / FSRS-5',
      title: 'Wissenschaftliche Spaced Repetition direkt im Arcade-Gefecht',
      intro: 'VOCANOVA nutzt den Open-Source-Algorithmus FSRS-5 (Free Spaced Repetition Scheduler). Statt starrer SM-2-Faktoren berechnet FSRS-5 für jedes Wort eine individuelle Vergessenskurve – vollautomatisch anhand deiner Tippgenauigkeit im Spiel.',
      formulaLabel: 'FSRS-5 Vergessenskurve (Ziel-Retention R = 90%)',
      formulaCaption: 't = Tage seit letzter Wiederholung · S = Stabilität in Tagen (bis R auf 90% sinkt) · D = Schwierigkeit [1..10].',
      dsrTitle: 'Das DSR-Gedächtnismodell (Difficulty · Stability · Retrievability)',
      dsrCards: [
        { code: 'D', tone: 'rose', title: 'Difficulty (Schwierigkeit 1–10)', text: 'Misst die persönliche Wort-Schwierigkeit. Steigt bei Tippfehlern oder Schildtreffern und sinkt bei sauberen Serien.' },
        { code: 'S', tone: 'emerald', title: 'Stability (Stabilität)', text: 'Tage, bis die Erinnerungs-Wahrscheinlichkeit von 100% auf 90% fällt. Wächst bei erfolgreichem Abruf überproportional.' },
        { code: 'R', tone: 'cyan', title: 'Retrievability (Abrufbarkeit)', text: 'Geschätzte Chance, dass du das Wort genau jetzt weißt. Fällt R Richtung 90%, landet das Wort wieder in deiner Welle.' }
      ],
      howTitle: 'Automatische Bewertung ohne langweilige Lernkarten-Klicks',
      howSubtitle: 'Deine Tipp-Leistung bestimmt im Hintergrund automatisch das FSRS-5-Rating:',
      ratings: [
        { badge: '4 · EASY', tone: 'emerald', trigger: '0 Tippfehler + Kombo ≥ x5 (oder „✓ Gewusst“)', effect: 'Maximaler Stabilitäts-Schub und sofort langes Intervall (4+ Tage).' },
        { badge: '3 · GOOD', tone: 'cyan', trigger: '0 Tippfehler beim Abschuss oder richtiges Blitzquiz', effect: 'Optimaler Standard-Abstand an der 90%-Erinnerungsgrenze.' },
        { badge: '2 · HARD', tone: 'amber', trigger: '1–2 Tippfehler während des Gefechts', effect: 'Erhöht Schwierigkeit D und verkürzt den nächsten Abstand.' },
        { badge: '1 · AGAIN', tone: 'rose', trigger: '≥ 3 Fehler, Schildtreffer, Quiz-Fehler oder „↻ Wiederholen“', effect: 'Sofortige Relearning-Markierung für die nächsten Wellen & Drills.' }
      ],
      liveTitle: 'Dein aktueller FSRS-5 Status (gewählte Zielsprache)',
      liveTracked: 'Erfasste Wörter',
      liveDue: 'Jetzt fällig',
      liveMastered: 'Langzeit (S ≥ 21T)',
      liveRetention: 'Ø Abrufrate R',
      ctaReviewDue: '🧠 Fällige FSRS-Wörter üben',
      ctaStartPlaying: '▶ Spielen & FSRS trainieren',
      ctaRepo: 'GitHub: fsrs4anki ↗'
    },
    legal: {
      badge: 'EU / DSGVO · TDDDG § 25 · ePRIVACY',
      title: 'Datenschutz, Cookies & EU-Konformität bei VOCANOVA',
      subtitle: 'Transparente Local-First-Architektur im Browser plus klare Infos zu Server-Proxys, E-Mail & optionalem Google-Login.',
      cards: [
        { icon: '💾', tone: 'emerald', title: 'Fortschritt, FSRS & Anki bleiben lokal', text: 'Fortschritt, FSRS-5-Daten (zlingo_fsrs_cards_v1) und importierte .apkg-Decks verbleiben ausschließlich in deinem Browser (localStorage & IndexedDB).' },
        { icon: '☁️', tone: 'cyan', title: 'Vercel-Hosting & Gemini TTS / Übersetzer', text: 'Betrieb über Vercel (kurzzeitige Server-Logs nach Art. 6 Abs. 1 lit. f DSGVO). Bei Audio/Übersetzung wird über /api/tts nur das jeweilige Wort übertragen.' },
        { icon: '🔐', tone: 'amber', title: 'E-Mail & künftiger Google-Login', text: 'Aktuell ist keine Anmeldung nötig. Bei optionalem Google Sign-In dient die E-Mail nur dem Cloud-Sync (Art. 6 Abs. 1 lit. b); Newsletter erfolgen nur nach separater Opt-in-Einwilligung (lit. a).' },
        { icon: '⚖️', tone: 'violet', title: 'Deine DSGVO-Rechte (Art. 15–22)', text: 'Recht auf Auskunft, Export, Berichtigung und Löschung (Art. 17 DSGVO) über alefweb7@gmail.com sowie Beschwerderecht bei einer EU-Aufsichtsbehörde.' }
      ],
      storageTitle: 'Verwendete Speicher-Schlüssel im Browser',
      storageColumns: ['Schlüssel / Speicher', 'Zweck', 'Kategorie'],
      storageRows: [
        { key: 'zdeutsch_save_v2', purpose: 'Sprachpaar, aktueller Kurs, Geschwindigkeit, Waffe & Highscore', category: 'Notwendig' },
        { key: 'zlingo_fsrs_cards_v1', purpose: 'FSRS-5 Gedächtnismodell (D, S & nächster Wiederholungszeitpunkt)', category: 'Notwendig' },
        { key: 'zlingo_learned_words_v1 / pinned / daily', purpose: 'Gelernte Wörter, ⭐ Lesezeichen, Tagesziel & Streak', category: 'Notwendig' },
        { key: 'zlingo_cookie_consent_v1', purpose: 'Speichert deine Auswahl im Cookie- & Datenschutz-Banner', category: 'Notwendig' },
        { key: 'IndexedDB (Anki Decks)', purpose: 'Importierte .apkg / .colpkg-Decks offline auf deinem Gerät', category: 'Notwendig' },
        { key: 'zdeutsch_gemini_api_key', purpose: 'Optionaler eigener Gemini-API-Key für TTS (falls eingetragen)', category: 'Funktional' }
      ],
      ctaCookiePrefs: '⚙️ Cookie-Einstellungen',
      ctaPrivacyDoc: 'Datenschutzerklärung ↗',
      ctaCookiesDoc: 'Cookie-Richtlinie ↗',
      ctaTermsDoc: 'Nutzung & Impressum ↗'
    }
  },
  es: {
    fsrsTabLabel: 'Algoritmo FSRS-5',
    legalTabLabel: 'Privacidad y Cookies',
    fsrs: {
      badge: 'OPEN-SOURCE · FSRS4ANKI / FSRS-5',
      title: 'Repetición espaciada científica integrada en cada combate espacial',
      intro: 'VOCANOVA incorpora el algoritmo abierto FSRS-5 (Free Spaced Repetition Scheduler). En lugar de multiplicadores fijos tipo SM-2, FSRS-5 calcula la curva real de olvido de cada palabra y evalúa tu respuesta automáticamente según tu precisión al escribir.',
      formulaLabel: 'Curva de olvido FSRS-5 (retención objetivo R = 90%)',
      formulaCaption: 't = días desde el último repaso · S = estabilidad en días · D = dificultad [1..10].',
      dsrTitle: 'Modelo de memoria DSR (Dificultad · Estabilidad · Recuperabilidad)',
      dsrCards: [
        { code: 'D', tone: 'rose', title: 'Difficulty (Dificultad 1–10)', text: 'Mide qué tan difícil te resulta la palabra. Sube con errores o impactos y baja con rachas limpias.' },
        { code: 'S', tone: 'emerald', title: 'Stability (Estabilidad)', text: 'Días que tarda la probabilidad de recuerdo en bajar del 100% al 90%. Crece con cada acierto espaciado.' },
        { code: 'R', tone: 'cyan', title: 'Retrievability (Recuperabilidad)', text: 'Probabilidad estimada de recordar la palabra ahora mismo. Cuando R baja hacia 90%, vuelve a tu cola.' }
      ],
      howTitle: 'Evaluación automática en el shooter (sin pulsar botones)',
      howSubtitle: 'Tu escritura y reflejos asignan la calificación FSRS-5 automáticamente:',
      ratings: [
        { badge: '4 · EASY', tone: 'emerald', trigger: '0 errores + combo ≥ x5 (o botón «✓ La sé»)', effect: 'Máximo impulso de estabilidad S e intervalo largo desde el inicio.' },
        { badge: '3 · GOOD', tone: 'cyan', trigger: '0 errores al destruir palabra o acierto en el mini test', effect: 'Programa el siguiente repaso justo antes de que R caiga bajo 90%.' },
        { badge: '2 · HARD', tone: 'amber', trigger: '1–2 errores de escritura durante la caída', effect: 'Aumenta la dificultad D y acorta el siguiente intervalo.' },
        { badge: '1 · AGAIN', tone: 'rose', trigger: '≥ 3 errores, golpe al escudo, fallo en test o «↻ Repetir»', effect: 'Marca reaprendizaje inmediato y la prioriza en las siguientes oleadas.' }
      ],
      liveTitle: 'Tu estado FSRS-5 en vivo (idioma actual)',
      liveTracked: 'Palabras en FSRS',
      liveDue: 'Pendientes ahora',
      liveMastered: 'Largo plazo (S ≥ 21d)',
      liveRetention: 'Retención media R',
      ctaReviewDue: '🧠 Iniciar repaso FSRS',
      ctaStartPlaying: '▶ Jugar para entrenar FSRS',
      ctaRepo: 'GitHub: fsrs4anki ↗'
    },
    legal: {
      badge: 'UE / RGPD · LSSI · ePRIVACY',
      title: 'Protección de datos, Cookies y cumplimiento europeo (RGPD)',
      subtitle: 'Arquitectura local-first en tu navegador y total transparencia sobre servidor, correo y futuro acceso con Google.',
      cards: [
        { icon: '💾', tone: 'emerald', title: 'Progreso, FSRS y Anki siempre locales', text: 'Tu progreso, curva FSRS-5 (zlingo_fsrs_cards_v1) y mazos .apkg permanecen en localStorage e IndexedDB de tu navegador.' },
        { icon: '☁️', tone: 'cyan', title: 'Vercel y API de voz / traducción', text: 'Alojado en Vercel (registros técnicos Art. 6(1)(f) RGPD). Al usar audio o traducción solo se envía el texto de la palabra a /api/tts.' },
        { icon: '🔐', tone: 'amber', title: 'Correo y futuro acceso con Google', text: 'Hoy no necesitas cuenta. Si activamos acceso opcional con Google para sincronizar mazos, el email se usará para la sincronización (Art. 6(1)(b)); boletines solo con opt-in separado (Art. 6(1)(a)).' },
        { icon: '⚖️', tone: 'violet', title: 'Derechos RGPD (Art. 15–22)', text: 'Puedes solicitar acceso, exportación o supresión (Art. 17) escribiendo a alefweb7@gmail.com o borrar cookies/almacenamiento cuando quieras.' }
      ],
      storageTitle: 'Inventario de almacenamiento local',
      storageColumns: ['Clave / Almacén', 'Finalidad', 'Categoría'],
      storageRows: [
        { key: 'zdeutsch_save_v2', purpose: 'Idiomas, curso activo, velocidad, arma y puntuación máxima', category: 'Esencial' },
        { key: 'zlingo_fsrs_cards_v1', purpose: 'Memoria FSRS-5 por palabra (D, S y próxima fecha de repaso)', category: 'Esencial' },
        { key: 'zlingo_learned_words_v1 / pinned / daily', purpose: 'Palabras aprendidas, ⭐ favoritas, meta diaria y racha', category: 'Esencial' },
        { key: 'zlingo_cookie_consent_v1', purpose: 'Guarda tu decisión en el banner y panel de privacidad', category: 'Esencial' },
        { key: 'IndexedDB (Mazos Anki)', purpose: 'Tus archivos .apkg / .colpkg guardados sin conexión en el navegador', category: 'Esencial' },
        { key: 'zdeutsch_gemini_api_key', purpose: 'Clave API opcional de Gemini introducida por el usuario para TTS', category: 'Funcional' }
      ],
      ctaCookiePrefs: '⚙️ Ajustar cookies',
      ctaPrivacyDoc: 'Política de privacidad ↗',
      ctaCookiesDoc: 'Política de Cookies ↗',
      ctaTermsDoc: 'Términos e Impressum ↗'
    }
  },
  uk: {
    fsrsTabLabel: 'Алгоритм FSRS-5',
    legalTabLabel: 'Приватність і Cookies',
    fsrs: {
      badge: 'OPEN-SOURCE · FSRS4ANKI / FSRS-5',
      title: 'Наукове інтервальне повторення просто під час космічного бою',
      intro: 'У VOCANOVA вбудовано відкритий алгоритм FSRS-5 (Free Spaced Repetition Scheduler). На відміну від жорстких кроків SM-2, FSRS-5 будує індивідуальну криву забування для кожного слова — і оцінює вашу відповідь автоматично за точністю набору.',
      formulaLabel: 'Крива забування FSRS-5 (цільове утримання R = 90%)',
      formulaCaption: 't — днів від минулого повтору · S — стабільність пам’яті у днях · D — складність [1..10].',
      dsrTitle: 'Модель пам’яті DSR (Difficulty · Stability · Retrievability)',
      dsrCards: [
        { code: 'D', tone: 'rose', title: 'Difficulty (Складність 1–10)', text: 'Персональний рівень трудності слова. Зростає при помилках і знижується при чистих серіях пострілів.' },
        { code: 'S', tone: 'emerald', title: 'Stability (Стабільність)', text: 'Інтервал у днях, через який імовірність згадати слово впаде зі 100% до 90%. Швидко зростає при успішних повторах.' },
        { code: 'R', tone: 'cyan', title: 'Retrievability (Доступність)', text: 'Оцінка ймовірності згадати слово саме зараз. Коли R падає до ~90%, слово повертається в чергу повтору.' }
      ],
      howTitle: 'Шутер сам виставляє оцінку FSRS (без зайвих кліків)',
      howSubtitle: 'Вам не потрібно щоразу натискати кнопки «Складно / Добре» — бойова телеметрія робить це сама:',
      ratings: [
        { badge: '4 · EASY', tone: 'emerald', trigger: '0 помилок + комбо ≥ x5 (або кнопка «✓ Знаю»)', effect: 'Максимальний приріст стабільності S і довгий інтервал (від 4+ днів).' },
        { badge: '3 · GOOD', tone: 'cyan', trigger: '0 помилок при збитті слова або правильна відповідь у бліці', effect: 'Оптимальний розрахунок наступного повтору на межі 90% пам’яті.' },
        { badge: '2 · HARD', tone: 'amber', trigger: '1–2 хибні літери під час набору слова в польоті', effect: 'Підвищує складність D і скорочує інтервал до наступного повтору.' },
        { badge: '1 · AGAIN', tone: 'rose', trigger: '≥ 3 помилки, удар у щит, хиба у бліці або ⭐ «Повторити»', effect: 'Позначає негайне доучування та пріоритетно підмішує слово в нові хвилі.' }
      ],
      liveTitle: 'Ваша пам’ять FSRS-5 зараз (для обраної мови)',
      liveTracked: 'Слів у FSRS',
      liveDue: 'До повтору зараз',
      liveMastered: 'У довгій пам’яті (S ≥ 21д)',
      liveRetention: 'Середня пам’ять R',
      ctaReviewDue: '🧠 Запустити FSRS-повтор',
      ctaStartPlaying: '▶ Грати та тренувати FSRS',
      ctaRepo: 'GitHub: fsrs4anki ↗'
    },
    legal: {
      badge: 'ЄС / GDPR · ePRIVACY',
      title: 'Як VOCANOVA захищає ваші дані згідно із законодавством ЄС',
      subtitle: 'Локальна архітектура Local-First у браузері та прозорі правила для серверних запитів і майбутнього входу через Google.',
      cards: [
        { icon: '💾', tone: 'emerald', title: 'Прогрес, FSRS і Anki — лише локально', text: 'Прогрес, статистика FSRS-5 (zlingo_fsrs_cards_v1) та імпортовані колоди .apkg зберігаються лише у вашому браузері (localStorage і IndexedDB).' },
        { icon: '☁️', tone: 'cyan', title: 'Хостинг Vercel і запити TTS / Перекладу', text: 'Сайт працює на Vercel (технічні HTTP-логи за ст. 6(1)(f) GDPR). При натисканні озвучення або перекладу на /api/tts передається лише текст слова.' },
        { icon: '🔐', tone: 'amber', title: 'Пошта та майбутній вхід через Google', text: 'Зараз реєстрація не потрібна. Якщо з’явиться добровільний вхід через Google для хмарної синхронізації, email використовуватиметься лише для акаунта (ст. 6(1)(b)), а розсилки — лише за окремою згодою (ст. 6(1)(a)).' },
        { icon: '⚖️', tone: 'violet', title: 'Права користувачів ЄС (ст. 15–22 GDPR)', text: 'Ви можете запросити доступ, експорт або видалення даних (ст. 17) через alefweb7@gmail.com і будь-коли змінити налаштування cookies.' }
      ],
      storageTitle: 'Реєстр ключів зберігання у браузері',
      storageColumns: ['Ключ / Сховище', 'Призначення', 'Категорія'],
      storageRows: [
        { key: 'zdeutsch_save_v2', purpose: 'Мови, активний курс/урок, швидкість, зброя і рекорд', category: 'Необхідне' },
        { key: 'zlingo_fsrs_cards_v1', purpose: 'Пам’ять FSRS-5 для слів (D, S і час наступного повтору)', category: 'Необхідне' },
        { key: 'zlingo_learned_words_v1 / pinned / daily', purpose: 'Вивчені слова, ⭐ закладки, денна ціль і серія днів', category: 'Необхідне' },
        { key: 'zlingo_cookie_consent_v1', purpose: 'Зберігає ваш вибір у банері приватності й налаштувань cookies', category: 'Необхідне' },
        { key: 'IndexedDB (Колоди Anki)', purpose: 'Завантажені вами колоди .apkg / .colpkg лише на вашому пристрої', category: 'Необхідне' },
        { key: 'zdeutsch_gemini_api_key', purpose: 'Необов’язковий особистий ключ Gemini API для озвучення', category: 'Функціональне' }
      ],
      ctaCookiePrefs: '⚙️ Налаштувати cookies',
      ctaPrivacyDoc: 'Політика конфіденційності ↗',
      ctaCookiesDoc: 'Політика Cookies ↗',
      ctaTermsDoc: 'Умови та Impressum ↗'
    }
  },
  tr: {
    fsrsTabLabel: 'FSRS-5 Algoritması',
    legalTabLabel: 'Gizlilik ve Çerezler',
    fsrs: {
      badge: 'AÇIK KAYNAK · FSRS4ANKI / FSRS-5',
      title: 'Her Uzay Savaşının İçine Yerleşik Bilimsel Aralıklı Tekrarlama',
      intro: 'VOCANOVA açık kaynaklı FSRS-5 (Free Spaced Repetition Scheduler) algoritmasını kullanır. Sabit SM-2 çarpanları yerine FSRS-5 her kelime için gerçek unutma eğrisini modeller ve yazma doğruluğuna göre kartı otomatik puanlar.',
      formulaLabel: 'FSRS-5 Unutma Eğrisi (Hedef Hatırlama R = %90)',
      formulaCaption: 't = son tekrardan geçen gün · S = bellek kararlılığı (gün) · D = zorluk [1..10].',
      dsrTitle: 'DSR Bellek Modeli (Zorluk · Kararlılık · Hatırlama)',
      dsrCards: [
        { code: 'D', tone: 'rose', title: 'Difficulty (Zorluk 1–10)', text: 'Kelimenin kişisel zorluk puanı. Yazım hatalarında artar, hatasız kombolarda azalır.' },
        { code: 'S', tone: 'emerald', title: 'Stability (Kararlılık)', text: 'Hatırlama olasılığının %100’den %90’a düşmesi için geçen gün sayısı.' },
        { code: 'R', tone: 'cyan', title: 'Retrievability (Hatırlanabilirlik)', text: 'Kelimeyi şu anda hatırlama olasılığın. R %90’a indiğinde kelime tekrar kuyruğuna girer.' }
      ],
      howTitle: 'Sıkıcı Buton Yok: Oyun İçi Otomatik Puanlama',
      howSubtitle: 'Yazma performansın FSRS-5 derecesini arka planda otomatik belirler:',
      ratings: [
        { badge: '4 · EASY', tone: 'emerald', trigger: '0 hata + kombo ≥ x5 (veya «✓ Biliyorum»)', effect: 'En yüksek kararlılık artışı ve hızlı uzun aralık (4+ gün).' },
        { badge: '3 · GOOD', tone: 'cyan', trigger: '0 hata ile kelime vuruşu veya doğru blitz yanıtı', effect: '%90 hatırlama sınırında en uygun tekrar aralığını planlar.' },
        { badge: '2 · HARD', tone: 'amber', trigger: 'Yazarken 1–2 tuş hatası', effect: 'Zorluk D puanını artırır ve sonraki aralığı kısaltır.' },
        { badge: '1 · AGAIN', tone: 'rose', trigger: '≥ 3 hata, kalkan darbesi, blitz hatası veya «↻ Tekrar»', effect: 'Anında yeniden öğrenme kuyruğuna alır ve sıradaki dalgalara ekler.' }
      ],
      liveTitle: 'Anlık FSRS-5 Bellek Durumun (Seçili Dil)',
      liveTracked: 'FSRS Kelimeleri',
      liveDue: 'Zamanı Gelen',
      liveMastered: 'Uzun Süreli (S ≥ 21g)',
      liveRetention: 'Ort. Hatırlama R',
      ctaReviewDue: '🧠 FSRS Tekrarını Başlat',
      ctaStartPlaying: '▶ Oynayarak FSRS Eğit',
      ctaRepo: 'GitHub: fsrs4anki ↗'
    },
    legal: {
      badge: 'AB / GDPR · ePRIVACY',
      title: 'VOCANOVA Gizliliği ve AB Mevzuatına Uyum',
      subtitle: 'Tarayıcı öncelikli yerel mimari ile sunucu ve gelecekteki isteğe bağlı Google girişi hakkında şeffaf bilgilendirme.',
      cards: [
        { icon: '💾', tone: 'emerald', title: 'İlerleme, FSRS ve Anki Yerel Kalır', text: 'Tüm ilerleme, FSRS-5 belleği (zlingo_fsrs_cards_v1) ve .apkg destelerin yalnızca tarayıcında (localStorage & IndexedDB) tutulur.' },
        { icon: '☁️', tone: 'cyan', title: 'Vercel Barındırma ve TTS / Çeviri', text: 'Vercel üzerinde barındırılır (GDPR Madde 6(1)(f) güvenlik kayıtları). Ses veya çeviri istendiğinde yalnızca ilgili kelime metni gönderilir.' },
        { icon: '🔐', tone: 'amber', title: 'E-posta ve Gelecekte Google Girişi', text: 'Şu an kayıt gerekmez. İsteğe bağlı Google ile Giriş eklendiğinde e-posta yalnızca bulut senkronizasyonu (Madde 6(1)(b)), bültenler ise ayrı açık onay (Madde 6(1)(a)) ile işlenir.' },
        { icon: '⚖️', tone: 'violet', title: 'AB / GDPR Hakların (Madde 15–22)', text: 'alefweb7@gmail.com üzerinden erişim, dışa aktarma veya silme (Madde 17) talep edebilir, tarayıcı ayarlarından çerez tercihini istediğin an güncelleyebilirsin.' }
      ],
      storageTitle: 'Tarayıcı Depolama Anahtarları',
      storageColumns: ['Anahtar / Alan', 'Amaç', 'Kategori'],
      storageRows: [
        { key: 'zdeutsch_save_v2', purpose: 'Dil çifti, aktif kurs/ders, hız, silah ve en yüksek skor', category: 'Zorunlu' },
        { key: 'zlingo_fsrs_cards_v1', purpose: 'Kelime bazlı FSRS-5 belleği (D, S ve sonraki tekrar zamanı)', category: 'Zorunlu' },
        { key: 'zlingo_learned_words_v1 / pinned / daily', purpose: 'Öğrenilen kelimeler, ⭐ yer imleri, günlük hedef ve seri', category: 'Zorunlu' },
        { key: 'zlingo_cookie_consent_v1', purpose: 'Çerez ve gizlilik tercihini saklar', category: 'Zorunlu' },
        { key: 'IndexedDB (Anki Desteleri)', purpose: 'Yüklenen .apkg / .colpkg desteleri cihazında çevrimdışı saklanır', category: 'Zorunlu' },
        { key: 'zdeutsch_gemini_api_key', purpose: 'İsteğe bağlı kullanıcı Gemini TTS API anahtarı', category: 'İşlevsel' }
      ],
      ctaCookiePrefs: '⚙️ Çerez Ayarları',
      ctaPrivacyDoc: 'Gizlilik Politikası ↗',
      ctaCookiesDoc: 'Çerez Politikası ↗',
      ctaTermsDoc: 'Koşullar ve Impressum ↗'
    }
  },
  he: {
    fsrsTabLabel: 'אלגוריתם FSRS-5',
    legalTabLabel: 'פרטיות ועוגיות',
    fsrs: {
      badge: 'קוד פתוח · FSRS4ANKI / FSRS-5',
      title: 'חזרה מרווחת מדעית בזמן אמת בתוך הקרב בחלל',
      intro: 'ב-VOCANOVA משולב אלגוריתם הקוד הפתוח FSRS-5 (Free Spaced Repetition Scheduler). במקום מכפילים קבועים של SM-2, האלגוריתם ממדל את עקומת השכחה האמיתית של כל מילה ומדרג אוטומטית לפי הדיוק בהקלדה.',
      formulaLabel: 'עקומת השכחה FSRS-5 (שימור מטרה R = 90%)',
      formulaCaption: 't = ימים מהחזרה האחרונה · S = יציבות בימים · D = קושי [1..10].',
      dsrTitle: 'מודל הזיכרון DSR (קושי · יציבות · זמינות שליפה)',
      dsrCards: [
        { code: 'D', tone: 'rose', title: 'Difficulty (קושי 1–10)', text: 'מדד קושי אישי למילה. עולה בשגיאות הקלדה ויורד ברצפי פגיעות נקיים.' },
        { code: 'S', tone: 'emerald', title: 'Stability (יציבות בימים)', text: 'כמה ימים לוקח לסיכוי השליפה לרדת מ-100% ל-90%. גדל בכל חזרה מוצלחת.' },
        { code: 'R', tone: 'cyan', title: 'Retrievability (סיכוי שליפה)', text: 'ההסתברות המוערכת שתזכרו את המילה עכשיו. כש-R יורד ל-90%, המילה חוזרת לתור.' }
      ],
      howTitle: 'דירוג אוטומטי בקרב — בלי ללחוץ על כפתורים אחרי כל כרטיס',
      howSubtitle: 'ביצועי ההקלדה במשחק מתרגמים ישירות לדירוג FSRS-5:',
      ratings: [
        { badge: '4 · EASY', tone: 'emerald', trigger: '0 שגיאות + קומבו ≥ x5 (או «✓ יודע»)', effect: 'זינוק מקסימלי ביציבות S ומרווח ארוך (4+ ימים ומעלה).' },
        { badge: '3 · GOOD', tone: 'cyan', trigger: '0 שגיאות בפיצוץ מילה או תשובה נכונה בבזק', effect: 'מתזמן חזרה אופטימלית קרוב לסף 90% זיכרון.' },
        { badge: '2 · HARD', tone: 'amber', trigger: '1–2 שגיאות הקלדה בזמן נפילת המילה', effect: 'מעלה את הקושי D ומקצר את המרווח לחזרה הבאה.' },
        { badge: '1 · AGAIN', tone: 'rose', trigger: '≥ 3 שגיאות, פגיעה במגן, טעות בבזק או ⭐ «חזור»', effect: 'מסמן למידה מחדש מידית ומשלב את המילה בגלים הבאים.' }
      ],
      liveTitle: 'מצב הזיכרון FSRS-5 שלך עכשיו (לשפה הנבחרת)',
      liveTracked: 'מילים במעקב FSRS',
      liveDue: 'ממתינות לחזרה',
      liveMastered: 'טווח ארוך (S ≥ 21י׳)',
      liveRetention: 'ממוצע שימור R',
      ctaReviewDue: '🧠 הפעל חזרת FSRS',
      ctaStartPlaying: '▶ שחק ואמן את FSRS',
      ctaRepo: 'GitHub: fsrs4anki ↗'
    },
    legal: {
      badge: 'EU / GDPR · DSGVO · ePRIVACY',
      title: 'כיצד VOCANOVA מגנה על פרטיותכם לפי חוקי האיחוד האירופי',
      subtitle: 'אדריכלות Local-First מקומית בדפדפן ושקיפות מלאה לגבי שרת, מייל והתחברות עתידית עם Google.',
      cards: [
        { icon: '💾', tone: 'emerald', title: 'ההתקדמות, FSRS ו-Anki נשמרים מקומית', text: 'ההתקדמות, מצב FSRS-5 (zlingo_fsrs_cards_v1) וחפיסות .apkg נשמרים רק בדפדפן שלכם (localStorage ו-IndexedDB).' },
        { icon: '☁️', tone: 'cyan', title: 'שרת Vercel וקריאות קול/תרגום', text: 'האתר מתארח ב-Vercel (לוגים טכניים לפי סעיף 6(1)(f) GDPR). בהשמעת קול או תרגום נשלח רק טקסט המילה ל-/api/tts.' },
        { icon: '🔐', tone: 'amber', title: 'אימייל והתחברות Google בעתיד', text: 'כיום אין חובת הרשמה. אם תוצע התחברות עם Google לסנכרון ענן, האימייל ישמש לסנכרון בלבד (6(1)(b)), ודיוור רק בהסכמה מפורשת (6(1)(a)).' },
        { icon: '⚖️', tone: 'violet', title: 'זכויות GDPR באיחוד האירופי (15–22)', text: 'ניתן לבקש גישה, ייצוא או מחיקה (סעיף 17) דרך alefweb7@gmail.com או לנקות נתוני דפדפן בכל רגע.' }
      ],
      storageTitle: 'פירוט מפתחות האחסון בדפדפן',
      storageColumns: ['מפתח / אחסון', 'מטרה', 'קטגוריה'],
      storageRows: [
        { key: 'zdeutsch_save_v2', purpose: 'צמד שפות, קורס פעיל, מהירות, נשק ושיא ניקוד', category: 'הכרחי' },
        { key: 'zlingo_fsrs_cards_v1', purpose: 'זיכרון FSRS-5 לכל מילה (D, S ומועד החזרה הבא)', category: 'הכרחי' },
        { key: 'zlingo_learned_words_v1 / pinned / daily', purpose: 'מילים שנלמדו, סימניות ⭐, יעד יומי ורצף ימים', category: 'הכרחי' },
        { key: 'zlingo_cookie_consent_v1', purpose: 'שומר את בחירתכם בהגדרות הפרטיות והעוגיות', category: 'הכרחי' },
        { key: 'IndexedDB (חפיסות Anki)', purpose: 'חפיסות .apkg / .colpkg שיובאו אופליין במכשירכם', category: 'הכרחי' },
        { key: 'zdeutsch_gemini_api_key', purpose: 'מפתח Gemini API אישי אופציונלי לקריינות TTS', category: 'פונקציונלי' }
      ],
      ctaCookiePrefs: '⚙️ הגדרות עוגיות',
      ctaPrivacyDoc: 'מדיניות פרטיות ↗',
      ctaCookiesDoc: 'מדיניות עוגיות ↗',
      ctaTermsDoc: 'תנאים ו-Impressum ↗'
    }
  },
  ar: {
    fsrsTabLabel: 'خوارزمية FSRS-5',
    legalTabLabel: 'الخصوصية و Cookies',
    fsrs: {
      badge: 'مفتوح المصدر · FSRS4ANKI / FSRS-5',
      title: 'التكرار المتباعد العلمي مدمج مباشرة في كل معركة فضائية',
      intro: 'تدمج VOCANOVA خوارزمية FSRS-5 مفتوحة المصدر (Free Spaced Repetition Scheduler). على عكس مضاعفات SM-2 الثابتة، تبني FSRS-5 منحنى نسيان حقيقياً لكل كلمة وتقيّم إجابتك تلقائياً وفق دقة الكتابة في اللعبة.',
      formulaLabel: 'منحنى النسيان FSRS-5 (نسبة الاستبقاء المستهدفة R = 90%)',
      formulaCaption: 't = عدد الأيام منذ المراجعة · S = ثبات الذاكرة بالأيام · D = الصعوبة [1..10].',
      dsrTitle: 'نموذج الذاكرة DSR (الصعوبة · الثبات · القابلية للاسترجاع)',
      dsrCards: [
        { code: 'D', tone: 'rose', title: 'Difficulty (الصعوبة 1–10)', text: 'معامل صعوبة الكلمة بالنسبة لك. يرتفع مع الأخطاء وينخفض مع سلاسل الإصابة النظيفة.' },
        { code: 'S', tone: 'emerald', title: 'Stability (الثبات بالأيام)', text: 'عدد الأيام حتى تنخفض احتمالية تذكر الكلمة من 100% إلى 90%. ينمو مع كل مراجعة ناجحة.' },
        { code: 'R', tone: 'cyan', title: 'Retrievability (الاسترجاع %)', text: 'الاحتمالية التقديرية لتذكرك الكلمة الآن. عندما تقترب R من 90% تعود الكلمة للمراجعة.' }
      ],
      howTitle: 'تقييم تلقائي في اللعب بدون ضغط أزرار ممل',
      howSubtitle: 'أداؤك أثناء التصويب يحدد تقييم FSRS-5 تلقائياً في الخلفية:',
      ratings: [
        { badge: '4 · EASY', tone: 'emerald', trigger: '0 أخطاء + تتابع ≥ x5 (أو زر «✓ أعرفها»)', effect: 'أعلى دفعة للثبات S وفترة طويلة فوراً (4+ أيام فأكثر).' },
        { badge: '3 · GOOD', tone: 'cyan', trigger: '0 أخطاء عند تدمير الكلمة أو إجابة صحيحة بالاختبار', effect: 'جدولة مثالية لموعد المراجعة التالي عند عتبة 90%.' },
        { badge: '2 · HARD', tone: 'amber', trigger: 'خطأ أو خطآن مطبعيان أثناء الكتابة', effect: 'يرفع الصعوبة D ويقصر فترة التكرار التالية.' },
        { badge: '1 · AGAIN', tone: 'rose', trigger: '≥ 3 أخطاء أو اصطدام بالدرع أو ⭐ «تكرار»', effect: 'يفعّل إعادة التعلم فوراً ويعطي الكلمة أولوية في الموجات القادمة.' }
      ],
      liveTitle: 'حالة ذاكرتك FSRS-5 الآن (للغة المحددة)',
      liveTracked: 'كلمات في FSRS',
      liveDue: 'مستحقة الآن',
      liveMastered: 'طويلة المدى (S ≥ 21ي)',
      liveRetention: 'متوسط التذكر R',
      ctaReviewDue: '🧠 ابدأ مراجعة FSRS',
      ctaStartPlaying: '▶ العب لتدريب FSRS',
      ctaRepo: 'GitHub: fsrs4anki ↗'
    },
    legal: {
      badge: 'EU / GDPR · DSGVO · ePRIVACY',
      title: 'كيف تحمي VOCANOVA بياناتك وتتوافق مع قوانين الاتحاد الأوروبي',
      subtitle: 'بنية محلية أولاً داخل المتصفح مع شفافية كاملة لطلبات الصوت والبريد وتسجيل Google الاختياري مستقبلاً.',
      cards: [
        { icon: '💾', tone: 'emerald', title: 'التقدم و FSRS و Anki محلية بالكامل', text: 'التقدم ومنحنى FSRS-5 (zlingo_fsrs_cards_v1) ومجموعات .apkg تُحفظ فقط في متصفحك (localStorage و IndexedDB).' },
        { icon: '☁️', tone: 'cyan', title: 'استضافة Vercel وخدمات النطق/الترجمة', text: 'يستضاف الموقع على Vercel (سجلات أمان تقنية وفق المادة 6(1)(f) GDPR). عند طلب الصوت أو الترجمة يُرسل نص الكلمة فقط إلى /api/tts.' },
        { icon: '🔐', tone: 'amber', title: 'البريد وتسجيل Google المستقبلي', text: 'لا يلزم حساب الآن. عند تفعيل دخول Google الاختياري للمزامنة، يُستخدم البريد للمزامنة فقط (6(1)(b))، والنشرات البريدية بموافقة منفصلة فقط (6(1)(a)).' },
        { icon: '⚖️', tone: 'violet', title: 'حقوقك وفق GDPR (المواد 15–22)', text: 'يحق لك طلب الوصول أو التصدير أو الحذف (المادة 17) عبر alefweb7@gmail.com أو تعديل إعدادات ملفات الارتباط بأي وقت.' }
      ],
      storageTitle: 'سجل مفاتيح التخزين في المتصفح',
      storageColumns: ['المفتاح / التخزين', 'الغرض', 'الفئة'],
      storageRows: [
        { key: 'zdeutsch_save_v2', purpose: 'اللغات، الدورة النشطة، السرعة، السلاح وأعلى نتيجة', category: 'ضروري' },
        { key: 'zlingo_fsrs_cards_v1', purpose: 'حالة ذاكرة FSRS-5 لكل كلمة (D و S وموعد التكرار)', category: 'ضروري' },
        { key: 'zlingo_learned_words_v1 / pinned / daily', purpose: 'الكلمات المتعلمة والمفضلة ⭐ والهدف اليومي والسلسلة', category: 'ضروري' },
        { key: 'zlingo_cookie_consent_v1', purpose: 'يحفظ اختيارك في شريط موافقة الخصوصية وملفات الارتباط', category: 'ضروري' },
        { key: 'IndexedDB (مجموعات Anki)', purpose: 'ملفات .apkg / .colpkg المستوردة بدون اتصال على جهازك', category: 'ضروري' },
        { key: 'zdeutsch_gemini_api_key', purpose: 'مفتاح Gemini API اختياري يضيفه المستخدم للنطق الصوتي', category: 'وظيفي' }
      ],
      ctaCookiePrefs: '⚙️ إعدادات ملفات الارتباط',
      ctaPrivacyDoc: 'سياسة الخصوصية ↗',
      ctaCookiesDoc: 'سياسة ملفات الارتباط ↗',
      ctaTermsDoc: 'الشروط و Impressum ↗'
    }
  }
};
