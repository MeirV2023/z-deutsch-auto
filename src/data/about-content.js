// Контент страницы «О проекте» (#aboutPageView) на 8 языках интерфейса (SRP)

export const ABOUT_CONTACTS = {
  email: 'alefweb7@gmail.com',
  telegramHandle: '@Stanislavm770',
  telegramUrl: 'https://t.me/Stanislavm770'
};

export const ABOUT_TABS = ['story', 'guide', 'roadmap', 'contact'];

export const ABOUT_CONTENT = {
  ru: {
    kicker: 'VOCANOVA · INDIE LOG',
    heroTitle: 'О проекте VOCANOVA',
    heroSubtitle: 'История создания, правила космической арены, планы развития и прямая связь с автором.',
    metricsLabels: {
      languages: 'Языков',
      courses: 'Курсов',
      words: 'Слов + Anki'
    },
    tabs: [
      { id: 'story', icon: '✨', label: 'О проекте' },
      { id: 'guide', icon: '🎮', label: 'Как это работает' },
      { id: 'roadmap', icon: '🗺️', label: 'Планы развития' },
      { id: 'contact', icon: '✉️', label: 'Контакты' }
    ],
    copiedLabel: 'Скопировано!',
    copyBtnLabel: 'Копировать',
    story: {
      badge: 'ИЗ ПЕРВЫХ УСТ · СОЗДАТЕЛЬ ПРОЕКТА',
      title: 'Сделано для себя — с надеждой, что зайдёт и вам',
      paragraphs: [
        'Привет! Я сам сейчас учу немецкий язык и уже много лет каждый день пользуюсь Anki. Интервальное повторение — реально рабочая штука, но иногда хочется не просто молча кликать карточки, а включить космический драйв и учить слова в формате живой аркады.',
        'Так и родилась VOCANOVA. Сначала я делал её просто для себя — чтобы было по кайфу повторять лексику, слышать живое произношение и сразу видеть артикли der / die / das в бою. Но чем дальше шёл проект, тем сильнее хотелось поделиться им с другими: вдруг такой формат зайдёт и языковому сообществу!',
        'На первых этапах я вообще не планирую никакой монетизации. Главная цель сейчас — сделать по-настоящему полезный, удобный и живой продукт без лишнего шума и платных стен. А дальше посмотрим: если проект найдёт достойный отклик и соберёт живое комьюнити, будем развивать его вместе и уже потом открыто посоветуемся с вами, как лучше и честнее выстроить его поддержку.'
      ],
      quote: 'Сначала — реальная польза, кайф от процесса и отклик сообщества. Всё остальное обсудим вместе с вами позже.',
      ctaPlay: 'Начать игру',
      ctaAnki: 'Загрузить Anki (.apkg)',
      ctaContact: 'Написать автору',
      pillarsTitle: 'Вайб и принципы проекта',
      pillars: [
        {
          icon: '🇩🇪',
          tone: 'cyan',
          title: 'Из личной практики',
          text: 'Всё рождалось прямо во время собственного изучения немецкого — каждая фича проверяется на реальной учёбе.'
        },
        {
          icon: '🗂️',
          tone: 'amber',
          title: 'Anki в ДНК',
          text: 'Многолетний опыт с Anki подсказал главный мост: можно закинуть свою колоду .apkg и сразу тренировать её в игре.'
        },
        {
          icon: '💚',
          tone: 'emerald',
          title: 'Сначала польза',
          text: 'Никакой монетизации на старте — только чистый фокус на том, чтобы запоминание слов приносило удовольствие.'
        },
        {
          icon: '🛰️',
          tone: 'violet',
          title: 'Вместе с сообществом',
          text: 'Фидбек игроков решает: куда развивать режимы, какие курсы добавлять и как проекту жить дальше.'
        }
      ]
    },
    guide: {
      title: 'Что уже умеет космическая арена',
      subtitle: 'Вся механика заточена на быстрое узнавание слов, визуальную память и удовольствие от прогресса.',
      cards: [
        {
          icon: '🎯',
          tone: 'cyan',
          title: '3 режима тренировки',
          text: 'Печатайте слово на скорость, включайте режим «Слушать» на восприятие речи на слух или тренируйте обратный перевод.'
        },
        {
          icon: '📦',
          tone: 'amber',
          title: 'Родной импорт Anki (.apkg)',
          text: 'Загружайте .apkg, .colpkg, .tsv или .csv прямо в браузере — личные колоды сохраняются локально в IndexedDB.'
        },
        {
          icon: '🎨',
          tone: 'emerald',
          title: 'Цвета артиклей и 8 языков',
          text: 'Мужской, женский и средний род подсвечены цветом прямо в полёте, а интерфейс и переводы работают в обе стороны для 8 языков.'
        },
        {
          icon: '🎙️',
          tone: 'violet',
          title: 'Озвучка Gemini 3.8 TTS + Синтез',
          text: 'При каждом точном выстреле слово озвучивается вслух, а процедурный Web Audio звук добавляет аркадной отдачи.'
        },
        {
          icon: '⭐',
          tone: 'rose',
          title: 'Закладки и мини-блиц',
          text: 'Отмечайте сложные слова звёздочкой, чтобы они чаще возвращались в следующих волнах, и закрепляйте урок коротким блиц-тестом.'
        },
        {
          icon: '🚀',
          tone: 'sky',
          title: 'Арсенал и мобильная клавиатура',
          text: 'Изученные слова открывают 6 видов космического оружия, а на телефоне всегда под рукой встроенная клавиатура ZType.'
        }
      ],
      ctaDecks: 'Открыть колоды',
      ctaTts: 'Студия озвучки'
    },
    roadmap: {
      title: 'Куда летим дальше',
      subtitle: 'Живой план развития: от уже работающей базы до идей, которые подскажет сообщество.',
      stages: [
        {
          status: 'LIVE',
          tone: 'emerald',
          title: 'Этап 1 · Базовая арена и Anki',
          items: [
            '12 готовых тем B1 (~15 слов в каждом уроке) и босс-раунды',
            '8 языков интерфейса и переводов в обе стороны + RTL (иврит, арабский)',
            'Прямой импорт колод Anki (.apkg / .colpkg / .tsv) прямо в браузер',
            'Озвучка Gemini 3.8 TTS, 6 видов оружия и мобильная клавиатура ZType'
          ]
        },
        {
          status: 'NEXT',
          tone: 'cyan',
          title: 'Этап 2 · Глубина обучения и колоды',
          items: [
            'Расширение официальных подборок от A1 до B2 под реальные жизненные сценарии',
            'Более умное интервальное повторение внутри миссий на базе ваших ошибок и звёздочек',
            'Обмен пользовательскими колодами и тематическими подборками между игроками',
            'Новые игровые испытания на реакцию, восприятие на слух и артикли'
          ]
        },
        {
          status: 'COMMUNITY',
          tone: 'violet',
          title: 'Этап 3 · Развитие и диалог с вами',
          items: [
            'Сбор отзывов: что помогает запоминать лучше, а что мешает в потоке',
            'Приоритет тех функций и языков, за которые голосуют активные игроки',
            'Никаких скрытых пейволлов на старте — открытый фокус на качестве продукта',
            'Честное обсуждение с сообществом дальнейшей модели поддержки проекта'
          ]
        }
      ],
      calloutTitle: 'Есть идея, чего не хватает именно вам?',
      calloutText: 'Напишите пару строк — проект развивается вживую и открыт к предложениям тех, кто сам учит языки.',
      calloutBtn: 'Перейти в контакты'
    },
    contact: {
      title: 'Контакты и сотрудничество',
      subtitle: 'По вопросам сотрудничества, коллабораций, идей для новых колод и просто поболтать о проекте — пишите сюда!',
      telegramTitle: 'Telegram',
      telegramRole: 'Самый быстрый способ связи',
      telegramBtn: 'Открыть Telegram',
      emailTitle: 'Email',
      emailRole: 'Для предложений и партнёрства',
      emailBtn: 'Написать на почту',
      topicsTitle: 'О чём можно написать',
      topics: [
        {
          icon: '🤝',
          title: 'Сотрудничество и партнёрства',
          text: 'Совместные проекты, языковые школы, авторы курсов и образовательные инициативы.'
        },
        {
          icon: '💡',
          title: 'Идеи и фидбек по игре',
          text: 'Что улучшить в механике стрельбы, подсказках, звуке или мобильной версии.'
        },
        {
          icon: '📚',
          title: 'Новые колоды и языки',
          text: 'Какие темы, уровни CEFR или языковые пары стоит добавить следующими.'
        },
        {
          icon: '🛠️',
          title: 'Помощь с развитием',
          text: 'Дизайн, тестирование, контент или просто честное мнение о том, куда двигаться дальше.'
        }
      ]
    }
  },
  en: {
    kicker: 'VOCANOVA · INDIE LOG',
    heroTitle: 'About VOCANOVA',
    heroSubtitle: 'How the project started, how the space arena works, future roadmap, and direct contacts.',
    metricsLabels: {
      languages: 'Languages',
      courses: 'Courses',
      words: 'Words + Anki'
    },
    tabs: [
      { id: 'story', icon: '✨', label: 'About' },
      { id: 'guide', icon: '🎮', label: 'How it works' },
      { id: 'roadmap', icon: '🗺️', label: 'Roadmap' },
      { id: 'contact', icon: '✉️', label: 'Contacts' }
    ],
    copiedLabel: 'Copied!',
    copyBtnLabel: 'Copy',
    story: {
      badge: 'FOUNDER NOTE · BEHIND THE PROJECT',
      title: 'Built for my own German study — and hopefully fun for the community too',
      paragraphs: [
        'Hey! I am currently learning German myself and have been an everyday Anki user for many years. Spaced repetition works wonders, yet sometimes you crave a real arcade flow instead of silently tapping flashcards.',
        'That is how VOCANOVA began. I started building it for myself to make vocabulary practice playful, hear natural pronunciation on every hit, and keep der / die / das article colors right in front of my eyes. Along the way, I realized other language learners might enjoy this format just as much.',
        'I am not planning any monetization during the early stages. Right now, the single goal is to build a genuinely useful, smooth product. If the project gets a warm response from the community, I will keep expanding and polishing it — and later consult with the community on the fairest way to sustain it.'
      ],
      quote: 'First comes real usefulness, fun in learning, and community feedback. Everything else we will figure out together.',
      ctaPlay: 'Start playing',
      ctaAnki: 'Import Anki (.apkg)',
      ctaContact: 'Contact creator',
      pillarsTitle: 'Project Vibe & Principles',
      pillars: [
        {
          icon: '🇩🇪',
          tone: 'cyan',
          title: 'Born from real study',
          text: 'Every feature is shaped while actually studying German vocabulary day to day.'
        },
        {
          icon: '🗂️',
          tone: 'amber',
          title: 'Anki DNA',
          text: 'Years of using Anki inspired native browser import for .apkg decks with instant gameplay.'
        },
        {
          icon: '💚',
          tone: 'emerald',
          title: 'Usefulness first',
          text: 'No monetization or paywalls at the start — pure focus on making practice enjoyable.'
        },
        {
          icon: '🛰️',
          tone: 'violet',
          title: 'Community driven',
          text: 'Growth, new features, and future sustainability will be shaped openly with players.'
        }
      ]
    },
    guide: {
      title: 'What the Space Arena Already Does',
      subtitle: 'Designed for fast word recognition, visual memory, and rewarding arcade momentum.',
      cards: [
        {
          icon: '🎯',
          tone: 'cyan',
          title: '3 Study Modes',
          text: 'Switch between Typing speed runs, Listening comprehension, and Translate-mode drills.'
        },
        {
          icon: '📦',
          tone: 'amber',
          title: 'Native Anki (.apkg) Import',
          text: 'Drop .apkg, .colpkg, .tsv, or .csv files straight into the browser — stored locally in IndexedDB.'
        },
        {
          icon: '🎨',
          tone: 'emerald',
          title: 'Article Colors & 8 Languages',
          text: 'Color-coded genders and parts of speech in flight, plus full bidirectional support across 8 languages.'
        },
        {
          icon: '🎙️',
          tone: 'violet',
          title: 'Gemini 3.8 TTS + WebAudio',
          text: 'Words are spoken aloud on every blast alongside crisp procedural sci-fi sound effects.'
        },
        {
          icon: '⭐',
          tone: 'rose',
          title: 'Starred Review & Blitz Quiz',
          text: 'Pin tricky words so they reappear more often and lock in memory with a quick post-lesson quiz.'
        },
        {
          icon: '🚀',
          tone: 'sky',
          title: '6 Weapons & Mobile ZType',
          text: 'Unlock plasma, railguns, gravity waves, and missiles as you learn, with a built-in touch keyboard.'
        }
      ],
      ctaDecks: 'Browse decks',
      ctaTts: 'Voice studio'
    },
    roadmap: {
      title: 'Where We Are Heading',
      subtitle: 'A living roadmap from today’s playable core to features shaped by player feedback.',
      stages: [
        {
          status: 'LIVE',
          tone: 'emerald',
          title: 'Phase 1 · Core Arena & Anki Bridge',
          items: [
            '12 curated B1 themed courses (~15-word lessons) and boss waves',
            '8 bidirectional languages including RTL support (Hebrew & Arabic)',
            'Zero-backend Anki .apkg / .colpkg / .tsv parsing right in the browser',
            'Gemini 3.8 TTS audio, 6 unlockable weapons, and mobile ZType keyboard'
          ]
        },
        {
          status: 'NEXT',
          tone: 'cyan',
          title: 'Phase 2 · Deeper Learning & Sharing',
          items: [
            'Expanding official A1 to B2 decks for practical everyday scenarios',
            'Smarter spaced-repetition scheduling inside waves based on pins and misses',
            'Easy sharing of custom decks and themed packs with other learners',
            'Additional challenge modes for listening speed and article mastery'
          ]
        },
        {
          status: 'COMMUNITY',
          tone: 'violet',
          title: 'Phase 3 · Open Community Direction',
          items: [
            'Collecting honest player feedback on what helps words stick fastest',
            'Prioritizing new languages, UX tweaks, and modes requested by the community',
            'No early paywalls — keeping focus on building something genuinely helpful',
            'Consulting the community later on fair, transparent ways to sustain the project'
          ]
        }
      ],
      calloutTitle: 'Have an idea or feature request?',
      calloutText: 'Send a quick message — this project is evolving live with learners like you.',
      calloutBtn: 'Go to contacts'
    },
    contact: {
      title: 'Contacts & Collaboration',
      subtitle: 'For collaboration, partnerships, ideas, feedback, or deck suggestions — reach out directly here!',
      telegramTitle: 'Telegram',
      telegramRole: 'Fastest way to chat directly',
      telegramBtn: 'Open Telegram',
      emailTitle: 'Email',
      emailRole: 'For proposals & collaborations',
      emailBtn: 'Send Email',
      topicsTitle: 'Great reasons to reach out',
      topics: [
        {
          icon: '🤝',
          title: 'Collaborations & Partnerships',
          text: 'Joint language projects, creators, educators, and EdTech experiments.'
        },
        {
          icon: '💡',
          title: 'Gameplay & Learning Feedback',
          text: 'Thoughts on pacing, Anki import edge cases, audio, or mobile ergonomics.'
        },
        {
          icon: '📚',
          title: 'New Decks & Languages',
          text: 'Suggestions for CEFR topics, curated vocabulary packs, or new target languages.'
        },
        {
          icon: '🛠️',
          title: 'Building Together',
          text: 'Design ideas, testing, localization polish, or honest community perspective.'
        }
      ]
    }
  },
  de: {
    kicker: 'VOCANOVA · INDIE LOG',
    heroTitle: 'Über VOCANOVA',
    heroSubtitle: 'Die Geschichte hinter dem Projekt, Spielmechanik, Roadmap und direkter Kontakt zum Entwickler.',
    metricsLabels: {
      languages: 'Sprachen',
      courses: 'Kurse',
      words: 'Wörter + Anki'
    },
    tabs: [
      { id: 'story', icon: '✨', label: 'Über das Projekt' },
      { id: 'guide', icon: '🎮', label: 'So funktioniert es' },
      { id: 'roadmap', icon: '🗺️', label: 'Roadmap' },
      { id: 'contact', icon: '✉️', label: 'Kontakt' }
    ],
    copiedLabel: 'Kopiert!',
    copyBtnLabel: 'Kopieren',
    story: {
      badge: 'PERSÖNLICHE NOTIZ · VOM ENTWICKLER',
      title: 'Für das eigene Deutschlernen gebaut — hoffentlich auch ein Gewinn für euch',
      paragraphs: [
        'Hallo! Ich lerne selbst gerade Deutsch und nutze schon seit vielen Jahren täglich Anki. Spaced Repetition funktioniert großartig, aber manchmal wünscht man sich statt leisem Kartenklicken echte Spielenergie.',
        'Genau daraus ist VOCANOVA entstanden: erst nur für mich, um Vokabeln im Arcade-Format zu trainieren, direkt die Aussprache zu hören und Artikel-Farben (der / die / das) spielerisch im Blick zu behalten. Mit der Zeit wuchs der Wunsch, diese Idee mit der Community zu teilen.',
        'In den ersten Phasen plane ich keinerlei Monetarisierung. Das einzige Ziel ist ein wirklich nützliches und angenehmes Produkt. Wenn das Projekt in der Community auf gute Resonanz stößt, entwickle ich es weiter — und berate mich später offen mit euch über eine faire Unterstützung.'
      ],
      quote: 'Erst echter Nutzen, Freude am Lernen und ehrliches Feedback. Alles Weitere entscheiden wir gemeinsam mit der Community.',
      ctaPlay: 'Spiel starten',
      ctaAnki: 'Anki (.apkg) laden',
      ctaContact: 'Autor schreiben',
      pillarsTitle: 'Vibe & Grundprinzipien',
      pillars: [
        {
          icon: '🇩🇪',
          tone: 'cyan',
          title: 'Aus eigener Praxis',
          text: 'Direkt während des eigenen Deutschlernens entstanden — jede Funktion wird im Alltag getestet.'
        },
        {
          icon: '🗂️',
          tone: 'amber',
          title: 'Anki in der DNA',
          text: 'Langjährige Anki-Erfahrung führte zum direkten .apkg-Import im Browser ohne Umwege.'
        },
        {
          icon: '💚',
          tone: 'emerald',
          title: 'Nutzen zuerst',
          text: 'Keine Monetarisierung zum Start — voller Fokus auf Motivation und echtes Lernen.'
        },
        {
          icon: '🛰️',
          tone: 'violet',
          title: 'Mit der Community',
          text: 'Feedback entscheidet, welche Decks, Modi und Verbesserungen als Nächstes kommen.'
        }
      ]
    },
    guide: {
      title: 'Was die Weltraum-Arena schon bietet',
      subtitle: 'Gebaut für schnelle Worterkennung, visuelles Gedächtnis und flüssigen Spielrhythmus.',
      cards: [
        {
          icon: '🎯',
          tone: 'cyan',
          title: '3 Lernmodi',
          text: 'Tippen auf Tempo, Hörverständnis im Modus «Zuhören» oder aktives Übersetzen.'
        },
        {
          icon: '📦',
          tone: 'amber',
          title: 'Nativer Anki-Import',
          text: 'Einfach .apkg, .colpkg, .tsv oder .csv im Browser öffnen — lokal in IndexedDB gespeichert.'
        },
        {
          icon: '🎨',
          tone: 'emerald',
          title: 'Artikelfarben & 8 Sprachen',
          text: 'Farblich markierte Artikel beim Fliegen sowie bidirektionale Kurse in 8 Sprachen.'
        },
        {
          icon: '🎙️',
          tone: 'violet',
          title: 'Gemini 3.8 TTS + Sound',
          text: 'Jeder Treffer spricht das Wort klar aus, begleitet von prozeduralem Arcade-Audio.'
        },
        {
          icon: '⭐',
          tone: 'rose',
          title: 'Merkliste & Blitz-Quiz',
          text: 'Schwierige Wörter mit Stern markieren und am Rundenende mit einem Mini-Quiz festigen.'
        },
        {
          icon: '🚀',
          tone: 'sky',
          title: '6 Waffen & Touch-Tastatur',
          text: 'Gelernte Wörter schalten neue Waffen frei; mobil steht jederzeit die ZType-Tastatur bereit.'
        }
      ],
      ctaDecks: 'Decks öffnen',
      ctaTts: 'Stimmen-Studio'
    },
    roadmap: {
      title: 'Wohin die Reise geht',
      subtitle: 'Vom spielbaren Kern zu neuen Ideen, die gemeinsam mit den Lernenden wachsen.',
      stages: [
        {
          status: 'LIVE',
          tone: 'emerald',
          title: 'Phase 1 · Arena & Anki-Brücke',
          items: [
            '12 B1-Themenkurse (~15 Wörter pro Lektion) inklusive Boss-Wellen',
            '8 Sprachen in beide Richtungen inklusive RTL (Hebräisch & Arabisch)',
            'Direkter Browser-Import für .apkg / .colpkg / .tsv ohne Server-Upload',
            'Gemini 3.8 TTS, 6 freischaltbare Waffen und mobile ZType-Tastatur'
          ]
        },
        {
          status: 'NEXT',
          tone: 'cyan',
          title: 'Phase 2 · Mehr Tiefe & Decks',
          items: [
            'Ausbau der offiziellen Decks von A1 bis B2 für Alltag und Beruf',
            'Feinere Anki-ähnliche Wiederholungsintervalle für Fehler und Favoriten',
            'Einfaches Teilen eigener Decks und Themenlisten in der Community',
            'Zusätzliche Spielmodi für Hörtempo und sichere Artikelwahl'
          ]
        },
        {
          status: 'COMMUNITY',
          tone: 'violet',
          title: 'Phase 3 · Gemeinsame Weiterentwicklung',
          items: [
            'Offenes Sammeln von Feedback aus dem echten Lernalltag',
            'Priorisierung neuer Sprachen und Features nach Wunsch der Spieler',
            'Keine frühen Paywalls — erst ein rundes, hilfreiches Produkt schaffen',
            'Spätere gemeinsame Abstimmung über ein faires Unterstützungsmodell'
          ]
        }
      ],
      calloutTitle: 'Eine Idee oder ein Wunsch für das Spiel?',
      calloutText: 'Schreib mir gerne direkt — das Projekt wächst aktiv mit dem Feedback der Nutzer.',
      calloutBtn: 'Zum Kontakt'
    },
    contact: {
      title: 'Kontakt & Zusammenarbeit',
      subtitle: 'Bei Fragen zu Kooperationen, Ideen, Feedback oder neuen Wortdecks — schreib gerne direkt hier!',
      telegramTitle: 'Telegram',
      telegramRole: 'Der schnellste direkte Draht',
      telegramBtn: 'Telegram öffnen',
      emailTitle: 'E-Mail',
      emailRole: 'Für Kooperationen & Feedback',
      emailBtn: 'E-Mail senden',
      topicsTitle: 'Wozu du schreiben kannst',
      topics: [
        {
          icon: '🤝',
          title: 'Kooperation & Partnerschaft',
          text: 'Gemeinsame Projekte, Sprachschulen, Content-Creator und Lerninitiativen.'
        },
        {
          icon: '💡',
          title: 'Feedback zum Gameplay',
          text: 'Vorschläge zu Tempo, Anki-Karten-Mapping, Audio oder mobiler Steuerung.'
        },
        {
          icon: '📚',
          title: 'Neue Decks & Sprachen',
          text: 'Welche CEFR-Stufen, Themenbereiche oder Sprachpaare als Nächstes fehlen.'
        },
        {
          icon: '🛠️',
          title: 'Mitgestalten',
          text: 'Design-Impulse, Tests, Übersetzungen oder ehrliche Einschätzungen.'
        }
      ]
    }
  },
  es: {
    kicker: 'VOCANOVA · INDIE LOG',
    heroTitle: 'Sobre VOCANOVA',
    heroSubtitle: 'La historia del proyecto, cómo funciona la arena espacial, hoja de ruta y contacto directo.',
    metricsLabels: {
      languages: 'Idiomas',
      courses: 'Cursos',
      words: 'Palabras + Anki'
    },
    tabs: [
      { id: 'story', icon: '✨', label: 'Proyecto' },
      { id: 'guide', icon: '🎮', label: 'Cómo funciona' },
      { id: 'roadmap', icon: '🗺️', label: 'Planes' },
      { id: 'contact', icon: '✉️', label: 'Contacto' }
    ],
    copiedLabel: 'Copiado',
    copyBtnLabel: 'Copiar',
    story: {
      badge: 'NOTA DEL CREADOR · DETRÁS DE VOCANOVA',
      title: 'Creado para mi propio estudio — esperando que también inspire a la comunidad',
      paragraphs: [
        '¡Hola! Ahora mismo estoy estudiando alemán y llevo muchos años usando Anki. La repetición espaciada funciona de maravilla, pero a veces apetece practicar vocabulario con ritmo de videojuego y no solo tocando tarjetas en silencio.',
        'Así nació VOCANOVA. Empecé haciéndolo para mí, para repasar palabras en formato arcade, escuchar la pronunciación al instante y visualizar colores de artículos (der / die / das) en plena acción. Poco a poco quise abrirlo a la comunidad por si a más personas les ayuda.',
        'En las primeras etapas no planeo ninguna monetización. El objetivo principal es construir un producto realmente útil y disfrutable. Si recibe buena respuesta de la comunidad, seguiré mejorándolo y más adelante consultaré con ustedes cuál es la mejor forma de sostenerlo.'
      ],
      quote: 'Primero la utilidad real, el disfrute al aprender y la voz de la comunidad. Lo demás lo decidiremos juntos más adelante.',
      ctaPlay: 'Empezar a jugar',
      ctaAnki: 'Importar Anki (.apkg)',
      ctaContact: 'Escribir al autor',
      pillarsTitle: 'Estilo y Principios',
      pillars: [
        {
          icon: '🇩🇪',
          tone: 'cyan',
          title: 'Nacido estudiando alemán',
          text: 'Cada función nace de necesidades reales al memorizar vocabulario día a día.'
        },
        {
          icon: '🗂️',
          tone: 'amber',
          title: 'ADN de Anki',
          text: 'Años usando Anki inspiraron la importación directa de archivos .apkg en el navegador.'
        },
        {
          icon: '💚',
          tone: 'emerald',
          title: 'Utilidad ante todo',
          text: 'Cero monetización al principio: foco total en crear una herramienta útil y divertida.'
        },
        {
          icon: '🛰️',
          tone: 'violet',
          title: 'Junto a la comunidad',
          text: 'Tu opinión guía las nuevas funciones, mazos y decisiones futuras del proyecto.'
        }
      ]
    },
    guide: {
      title: 'Lo que ya hace la arena espacial',
      subtitle: 'Diseñada para acelerar el reconocimiento visual, la escucha y la retención.',
      cards: [
        {
          icon: '🎯',
          tone: 'cyan',
          title: '3 modos de práctica',
          text: 'Elige entre escribir a toda velocidad, entrenar el oído o responder por traducción.'
        },
        {
          icon: '📦',
          tone: 'amber',
          title: 'Importación Anki nativa',
          text: 'Carga archivos .apkg, .colpkg, .tsv o .csv directo en tu navegador con IndexedDB.'
        },
        {
          icon: '🎨',
          tone: 'emerald',
          title: 'Artículos con color y 8 idiomas',
          text: 'Colores visuales para género gramatical y soporte bidireccional en 8 idiomas.'
        },
        {
          icon: '🎙️',
          tone: 'violet',
          title: 'Voz Gemini 3.8 TTS + Audio',
          text: 'Escucha cada palabra al destruirla acompañada de efectos Web Audio sintetizados.'
        },
        {
          icon: '⭐',
          tone: 'rose',
          title: 'Favoritas y mini test',
          text: 'Marca palabras difíciles con estrella para repasarlas más seguido y cierra cada lección con quiz.'
        },
        {
          icon: '🚀',
          tone: 'sky',
          title: '6 armas y teclado ZType',
          text: 'Desbloquea armamento espacial al aprender palabras y juega cómodo desde el móvil.'
        }
      ],
      ctaDecks: 'Ver mazos',
      ctaTts: 'Estudio de voz'
    },
    roadmap: {
      title: 'Próximos pasos en órbita',
      subtitle: 'Una ruta abierta que evoluciona según lo que más sirva a quienes aprenden idiomas.',
      stages: [
        {
          status: 'LIVE',
          tone: 'emerald',
          title: 'Etapa 1 · Base jugable y Anki',
          items: [
            '12 temas B1 (~15 palabras por lección) con rondas jefe',
            '8 idiomas en ambas direcciones incluyendo RTL (hebreo y árabe)',
            'Soporte local para mazos .apkg / .colpkg / .tsv en el navegador',
            'Voz Gemini 3.8 TTS, 6 armas desbloqueables y teclado táctil ZType'
          ]
        },
        {
          status: 'NEXT',
          tone: 'cyan',
          title: 'Etapa 2 · Más cursos y repaso inteligente',
          items: [
            'Nuevas colecciones oficiales desde nivel A1 hasta B2',
            'Repaso espaciado más fino dentro de las misiones según errores y estrellas',
            'Compartir mazos y listas temáticas entre jugadores de la comunidad',
            'Nuevos desafíos centrados en escucha rápida y artículos'
          ]
        },
        {
          status: 'COMMUNITY',
          tone: 'violet',
          title: 'Etapa 3 · Futuro junto a la comunidad',
          items: [
            'Escuchar qué mecánicas ayudan más a recordar vocabulario real',
            'Priorizar idiomas y mejoras pedidas directamente por los usuarios',
            'Mantener el acceso abierto en los primeros pasos sin muros de pago',
            'Consultar con la comunidad más adelante el modelo más justo de apoyo'
          ]
        }
      ],
      calloutTitle: '¿Tienes una sugerencia o idea?',
      calloutText: 'Escríbeme con confianza — el proyecto crece con las ideas de quienes practican cada día.',
      calloutBtn: 'Ir a contactos'
    },
    contact: {
      title: 'Contacto y Colaboración',
      subtitle: 'Para propuestas de colaboración, ideas, comentarios o nuevos mazos — ¡escríbeme por aquí!',
      telegramTitle: 'Telegram',
      telegramRole: 'Contacto directo y rápido',
      telegramBtn: 'Abrir Telegram',
      emailTitle: 'Correo electrónico',
      emailRole: 'Para colaboraciones y consultas',
      emailBtn: 'Enviar correo',
      topicsTitle: 'Temas sobre los que puedes escribir',
      topics: [
        {
          icon: '🤝',
          title: 'Colaboraciones y alianzas',
          text: 'Proyectos conjuntos, escuelas de idiomas, creadores e iniciativas educativas.'
        },
        {
          icon: '💡',
          title: 'Ideas y feedback',
          text: 'Sugerencias sobre jugabilidad, importación de Anki, sonido o versión móvil.'
        },
        {
          icon: '📚',
          title: 'Nuevos mazos e idiomas',
          text: 'Temáticas útiles, niveles CEFR o combinaciones de idiomas que te gustaría ver.'
        },
        {
          icon: '🛠️',
          title: 'Aportar al proyecto',
          text: 'Diseño, pruebas, traducciones o cualquier comentario honesto para mejorar.'
        }
      ]
    }
  },
  uk: {
    kicker: 'VOCANOVA · INDIE LOG',
    heroTitle: 'Про проєкт VOCANOVA',
    heroSubtitle: 'Історія створення, як працює космічна арена, плани розвитку та прямий звʼязок із автором.',
    metricsLabels: {
      languages: 'Мов',
      courses: 'Курсів',
      words: 'Слів + Anki'
    },
    tabs: [
      { id: 'story', icon: '✨', label: 'Про проєкт' },
      { id: 'guide', icon: '🎮', label: 'Як це працює' },
      { id: 'roadmap', icon: '🗺️', label: 'Плани розвитку' },
      { id: 'contact', icon: '✉️', label: 'Контакти' }
    ],
    copiedLabel: 'Скопійовано!',
    copyBtnLabel: 'Копіювати',
    story: {
      badge: 'ВІД АВТОРА · ІСТОРІЯ ПРОЄКТУ',
      title: 'Зроблено для себе — з надією, що відгукнеться спільноті',
      paragraphs: [
        'Привіт! Я сам зараз вивчаю німецьку мову і вже багато років щодня користуюсь Anki. Інтервальне повторення справді працює, але іноді хочеться не просто мовчки гортати картки, а вчити слова з ігровим драйвом.',
        'Так народилася VOCANOVA. Спершу робив її просто для себе — щоб із задоволенням повторювати лексику, одразу чути вимову й бачити артиклі der / die / das прямо в бою. А далі захотілося поділитися проєктом з іншими — раптом такий формат сподобається й вам!',
        'На перших етапах я не планую жодної монетизації. Головна мета зараз — зробити справді корисний і живий продукт. А якщо проєкт знайде гідний відгук у спільноти, буду активно його розвивати та вже пізніше відкрито пораджуся з вами, як найкраще його підтримувати.'
      ],
      quote: 'Спершу — реальна користь, кайф від навчання та відгук спільноти. Усе інше вирішимо разом згодом.',
      ctaPlay: 'Почати гру',
      ctaAnki: 'Завантажити Anki (.apkg)',
      ctaContact: 'Написати автору',
      pillarsTitle: 'Вайб та принципи',
      pillars: [
        {
          icon: '🇩🇪',
          tone: 'cyan',
          title: 'Із власного досвіду',
          text: 'Усе створювалося під час реального вивчення німецької — кожна деталь перевіряється на практиці.'
        },
        {
          icon: '🗂️',
          tone: 'amber',
          title: 'Anki у ДНК',
          text: 'Багаторічний досвід із Anki підказав головне: завантажуй свій .apkg і одразу тренуй його у грі.'
        },
        {
          icon: '💚',
          tone: 'emerald',
          title: 'Спершу користь',
          text: 'Жодної монетизації на старті — лише фокус на тому, щоб навчання приносило задоволення.'
        },
        {
          icon: '🛰️',
          tone: 'violet',
          title: 'Разом зі спільнотою',
          text: 'Ваш відгук визначає, куди рухати режими, курси й подальший розвиток проєкту.'
        }
      ]
    },
    guide: {
      title: 'Що вже вміє космічна арена',
      subtitle: 'Механіка створена для швидкого впізнавання слів, візуальної памʼяті та відчуття прогресу.',
      cards: [
        {
          icon: '🎯',
          tone: 'cyan',
          title: '3 режими тренування',
          text: 'Друкуйте слова на швидкість, тренуйте сприйняття на слух або проходьте зворотний переклад.'
        },
        {
          icon: '📦',
          tone: 'amber',
          title: 'Прямий імпорт Anki (.apkg)',
          text: 'Відкривайте .apkg, .colpkg, .tsv чи .csv просто в браузері — колоди зберігаються локально в IndexedDB.'
        },
        {
          icon: '🎨',
          tone: 'emerald',
          title: 'Кольори артиклів і 8 мов',
          text: 'Підсвічування родів просто в польоті та двосторонній переклад для 8 мов світу.'
        },
        {
          icon: '🎙️',
          tone: 'violet',
          title: 'Озвучка Gemini 3.8 TTS + Звук',
          text: 'Кожне збите слово озвучується вголос у поєднанні з живим синтезованим Web Audio.'
        },
        {
          icon: '⭐',
          tone: 'rose',
          title: 'Зірочки та швидкий бліц',
          text: 'Позначайте складні слова для частішого повтору й закріплюйте урок міні-тестом.'
        },
        {
          icon: '🚀',
          tone: 'sky',
          title: '6 видів зброї та мобільна ZType',
          text: 'Вивчені слова відкривають новий арсенал корабля, а на телефоні зручно друкувати на вбудованій клавіатурі.'
        }
      ],
      ctaDecks: 'Відкрити колоди',
      ctaTts: 'Студія озвучки'
    },
    roadmap: {
      title: 'Куди летимо далі',
      subtitle: 'Жива дорожня карта: від готового ядра до функцій, які підкаже спільнота.',
      stages: [
        {
          status: 'LIVE',
          tone: 'emerald',
          title: 'Етап 1 · Базова арена та Anki',
          items: [
            '12 готових тем B1 (~15 слів у кожному уроці) і бос-раунди',
            '8 мов в обидва боки включно з RTL (іврит та арабська)',
            'Прямий розбір Anki .apkg / .colpkg / .tsv безпосередньо у браузері',
            'Озвучка Gemini 3.8 TTS, 6 гармат і мобільна клавіатура ZType'
          ]
        },
        {
          status: 'NEXT',
          tone: 'cyan',
          title: 'Етап 2 · Глибина навчання',
          items: [
            'Розширення офіційних курсів від A1 до B2 для живих життєвих ситуацій',
            'Розумніше інтервальне повторення всередині хвиль на основі помилок і зірочок',
            'Обмін власними колодами й добірками між гравцями',
            'Додаткові ігрові випробування на слух, швидкість і артиклі'
          ]
        },
        {
          status: 'COMMUNITY',
          tone: 'violet',
          title: 'Етап 3 · Розвиток зі спільнотою',
          items: [
            'Збір живих відгуків: що реально допомагає запамʼятовувати швидше',
            'Пріоритет мов і фіч, які найчастіше просять активні гравці',
            'Жодних пейволів на старті — фокус тільки на користі продукту',
            'Спільне обговорення чесної моделі підтримки проєкту в майбутньому'
          ]
        }
      ],
      calloutTitle: 'Маєте ідею або побажання?',
      calloutText: 'Напишіть пару рядків — проєкт росте в діалозі з тими, хто вчить мови.',
      calloutBtn: 'Перейти в контакти'
    },
    contact: {
      title: 'Контакти та співпраця',
      subtitle: 'Щодо співпраці, ідей, пропозицій або нових колод — пишіть прямо сюди!',
      telegramTitle: 'Telegram',
      telegramRole: 'Найшвидший спосіб звʼязку',
      telegramBtn: 'Відкрити Telegram',
      emailTitle: 'Email',
      emailRole: 'Для співпраці та пропозицій',
      emailBtn: 'Написати листа',
      topicsTitle: 'Про що можна написати',
      topics: [
        {
          icon: '🤝',
          title: 'Співпраця та партнерство',
          text: 'Спільні проєкти, мовні школи, автори курсів та освітні ініціативи.'
        },
        {
          icon: '💡',
          title: 'Ідеї та відгуки про гру',
          text: 'Що покращити в динаміці, імпорті Anki, звуці чи мобільному інтерфейсі.'
        },
        {
          icon: '📚',
          title: 'Нові колоди й мови',
          text: 'Які теми, рівні CEFR або мовні пари варто додати наступними.'
        },
        {
          icon: '🛠️',
          title: 'Допомога з розвитком',
          text: 'Дизайн, тестування, переклади або просто чесна думка про проєкт.'
        }
      ]
    }
  },
  tr: {
    kicker: 'VOCANOVA · INDIE LOG',
    heroTitle: 'VOCANOVA Hakkında',
    heroSubtitle: 'Projenin hikayesi, uzay arenasının işleyişi, yol haritası ve doğrudan iletişim.',
    metricsLabels: {
      languages: 'Dil',
      courses: 'Kurs',
      words: 'Kelime + Anki'
    },
    tabs: [
      { id: 'story', icon: '✨', label: 'Proje' },
      { id: 'guide', icon: '🎮', label: 'Nasıl Çalışır' },
      { id: 'roadmap', icon: '🗺️', label: 'Yol Haritası' },
      { id: 'contact', icon: '✉️', label: 'İletişim' }
    ],
    copiedLabel: 'Kopyalandı!',
    copyBtnLabel: 'Kopyala',
    story: {
      badge: 'GELİŞTİRİCİ NOTU · HİKAYEMİZ',
      title: 'Kendi Almanca pratiğim için yaptım — umarım topluluğun da hoşuna gider',
      paragraphs: [
        'Merhaba! Şu an kendim Almanca öğreniyorum ve yıllardır aktif bir Anki kullanıcısıyım. Aralıklı tekrar gerçekten harika çalışıyor ama bazen sessizce kart geçmek yerine oyunun enerjisiyle kelime çalışmak istiyor insan.',
        'VOCANOVA tam da böyle doğdu. Başta sadece kendim için — kelimeleri oyun formatında tekrar etmek, telaffuzu anında duymak ve der / die / das artikellerini uçarken görmek için geliştirdim. Zamanla bunu dil öğrenen toplulukla da paylaşmak istedim.',
        'İlk aşamalarda hiçbir şekilde gelir/monetizasyon planlamıyorum. Şu anki tek hedefim gerçekten faydalı ve keyifli bir ürün ortaya koymak. Topluluktan güzel bir geri dönüş alırsa projeyi büyütmeye devam edeceğim — daha sonra nasıl sürdürüleceğini de yine topluluğa danışarak birlikte belirleyeceğiz.'
      ],
      quote: 'Önce gerçek fayda, öğrenme keyfi ve topluluk geri bildirimi. Geri kalanını zamanı gelince birlikte konuşuruz.',
      ctaPlay: 'Oyuna başla',
      ctaAnki: 'Anki (.apkg) yükle',
      ctaContact: 'Yazara ulaş',
      pillarsTitle: 'Proje Ruhu ve İlkeler',
      pillars: [
        {
          icon: '🇩🇪',
          tone: 'cyan',
          title: 'Gerçek pratikten doğdu',
          text: 'Almanca çalışırken ortaya çıkan gerçek ihtiyaçlarla her özellik bizzat test edildi.'
        },
        {
          icon: '🗂️',
          tone: 'amber',
          title: 'Özünde Anki var',
          text: 'Yılların Anki alışkanlığı sayesinde kendi .apkg destelerini doğrudan tarayıcıda oynayabilirsin.'
        },
        {
          icon: '💚',
          tone: 'emerald',
          title: 'Önce fayda',
          text: 'Başlangıçta ödeme duvarı veya monetizasyon yok; tek odak gerçekten işe yarayan bir deneyim.'
        },
        {
          icon: '🛰️',
          tone: 'violet',
          title: 'Toplulukla birlikte',
          text: 'Yeni modlar, diller ve gelecekteki adımlar oyuncuların geri bildirimleriyle şekillenecek.'
        }
      ]
    },
    guide: {
      title: 'Uzay Arenası Neler Sunuyor',
      subtitle: 'Hızlı kelime tanıma, görsel hafıza ve akıcı oyun temposu için tasarlandı.',
      cards: [
        {
          icon: '🎯',
          tone: 'cyan',
          title: '3 Çalışma Modu',
          text: 'Yazma hızı, Dinleme pratiği ve Çeviri odaklı modlar arasında tek tıkla geçiş yap.'
        },
        {
          icon: '📦',
          tone: 'amber',
          title: 'Doğrudan Anki İçe Aktarma',
          text: '.apkg, .colpkg, .tsv veya .csv destelerini tarayıcıya bırak; IndexedDB ile yerel saklansın.'
        },
        {
          icon: '🎨',
          tone: 'emerald',
          title: 'Artikel Renkleri ve 8 Dil',
          text: 'Uçuş sırasında renkli artikel ipuçları ve 8 dil arasında çift yönlü öğrenme desteği.'
        },
        {
          icon: '🎙️',
          tone: 'violet',
          title: 'Gemini 3.8 TTS + WebAudio',
          text: 'Her vurulan kelime seslendirilir ve sentezlenmiş arcade efektleriyle desteklenir.'
        },
        {
          icon: '⭐',
          tone: 'rose',
          title: 'Yıldızlı Tekrar ve Mini Quiz',
          text: 'Zor kelimeleri yıldızlayarak daha sık gör ve ders sonunda kısa testle pekiştir.'
        },
        {
          icon: '🚀',
          tone: 'sky',
          title: '6 Silah ve Mobil ZType Klavye',
          text: 'Öğrendikçe yeni uzay silahları aç; telefonda yerleşik dokunmatik klavyeyle rahatça oyna.'
        }
      ],
      ctaDecks: 'Desteleri aç',
      ctaTts: 'Ses stüdyosu'
    },
    roadmap: {
      title: 'Sıradaki Adımlar',
      subtitle: 'Çalışan çekirdekten topluluğun yön vereceği yeni özelliklere açık yol haritası.',
      stages: [
        {
          status: 'LIVE',
          tone: 'emerald',
          title: 'Aşama 1 · Çekirdek Arena ve Anki',
          items: [
            '12 B1 temalı kurs (~15 kelimelik dersler) ve boss turları',
            'RTL desteğiyle (İbranice ve Arapça) çift yönlü 8 dil',
            'Tarayıcı içinde sunucusuz .apkg / .colpkg / .tsv ayrıştırma',
            'Gemini 3.8 TTS seslendirme, 6 silah ve mobil ZType klavyesi'
          ]
        },
        {
          status: 'NEXT',
          tone: 'cyan',
          title: 'Aşama 2 · Daha Derin Öğrenme',
          items: [
            'Günlük yaşam için A1’den B2’ye genişletilmiş resmi kelime paketleri',
            'Hatalara ve yıldızlara göre dalgalar içinde daha akıllı aralıklı tekrar',
            'Topluluk içinde özel desteleri ve temalı listeleri paylaşma',
            'Dinleme hızı ve artikel refleksi için yeni meydan okuma modları'
          ]
        },
        {
          status: 'COMMUNITY',
          tone: 'violet',
          title: 'Aşama 3 · Toplulukla Büyüme',
          items: [
            'Kelime ezberlemeyi en çok hızlandıran detaylar için kullanıcı yorumları',
            'Aktif oyuncuların en çok istediği diller ve iyileştirmelere öncelik',
            'Başlangıçta reklamsız ve engelsiz saf öğrenme deneyimi',
            'İleride en adil destek modelini toplulukla açıkça tartışma'
          ]
        }
      ],
      calloutTitle: 'Aklında bir fikir veya öneri mi var?',
      calloutText: 'Kısa bir mesaj yaz — proje bizzat dil öğrenenlerin katkısıyla gelişiyor.',
      calloutBtn: 'İletişime geç'
    },
    contact: {
      title: 'İletişim ve İş Birliği',
      subtitle: 'İş birliği, ortaklık, fikirler veya yeni deste önerileri için doğrudan buradan yazabilirsiniz!',
      telegramTitle: 'Telegram',
      telegramRole: 'En hızlı doğrudan iletişim',
      telegramBtn: 'Telegram’ı Aç',
      emailTitle: 'E-posta',
      emailRole: 'İş birliği ve öneriler için',
      emailBtn: 'E-posta Gönder',
      topicsTitle: 'Neler için yazabilirsin',
      topics: [
        {
          icon: '🤝',
          title: 'İş Birliği ve Ortaklıklar',
          text: 'Ortak projeler, dil okulları, içerik üreticileri ve eğitim girişimleri.'
        },
        {
          icon: '💡',
          title: 'Oyun ve Geri Bildirim',
          text: 'Oyun akışı, Anki uyumluluğu, sesler veya mobil deneyim üzerine fikirler.'
        },
        {
          icon: '📚',
          title: 'Yeni Desteler ve Diller',
          text: 'Eklenmesini istediğin CEFR seviyeleri, temalar veya dil çiftleri.'
        },
        {
          icon: '🛠️',
          title: 'Gelişime Katkı',
          text: 'Tasarım, test, çeviri veya projenin geleceği hakkında samimi görüşlerin.'
        }
      ]
    }
  },
  he: {
    kicker: 'VOCANOVA · INDIE LOG',
    heroTitle: 'על הפרויקט VOCANOVA',
    heroSubtitle: 'הסיפור מאחורי המשחק, איך הזירה עובדת, תוכניות להמשך ויצירת קשר ישירה.',
    metricsLabels: {
      languages: 'שפות',
      courses: 'קורסים',
      words: 'מילים + Anki'
    },
    tabs: [
      { id: 'story', icon: '✨', label: 'על הפרויקט' },
      { id: 'guide', icon: '🎮', label: 'איך זה עובד' },
      { id: 'roadmap', icon: '🗺️', label: 'תוכניות פיתוח' },
      { id: 'contact', icon: '✉️', label: 'יצירת קשר' }
    ],
    copiedLabel: 'הועתק!',
    copyBtnLabel: 'העתקה',
    story: {
      badge: 'מהיוצר · מאחורי הפרויקט',
      title: 'נבנה ללימוד הגרמנית שלי — בתקווה שידליק גם את הקהילה',
      paragraphs: [
        'היי! אני לומד עכשיו גרמנית בעצמי וכבר הרבה שנים משתמש ב-Anki על בסיס יומי. שיטת החזרות המרווחות עובדת מעולה, אבל לפעמים בא לך לא רק ללחוץ על כרטיסיות בשקט, אלא להכניס קצב של משחק ארקייד חי.',
        'כך נולד VOCANOVA. בהתחלה בניתי אותו פשוט לעצמי — כדי שיהיה כיף לשנן מילים, לשמוע הגייה טבעית ולראות ישר את צבעי ה-der / die / das תוך כדי קרב בחלל. עם הזמן רציתי לשתף את זה עם לומדי שפות נוספים.',
        'בשלבים הראשונים אני לא מתכנן שום מונטיזציה. המטרה היחידה כרגע היא ליצור מוצר שימושי, נעים ומועיל באמת. אם הפרויקט יקבל תגובה יפה מהקהילה, אמשיך לפתח ולשפר אותו — ובהמשך נתייעץ יחד אתכם מה הדרך הכי נכונה לתמוך בו.'
      ],
      quote: 'קודם כול תועלת אמיתית, הנאה מהלמידה ותגובה מהקהילה. את השאר נחליט יחד בהמשך.',
      ctaPlay: 'התחל לשחק',
      ctaAnki: 'ייבוא Anki (.apkg)',
      ctaContact: 'כתוב ליוצר',
      pillarsTitle: 'הווייב והעקרונות',
      pillars: [
        {
          icon: '🇩🇪',
          tone: 'cyan',
          title: 'מתוך למידה אמיתית',
          text: 'הכול נולד תוך כדי לימוד גרמנית בפועל — כל פיצ׳ר נבדק בזמן אמת.'
        },
        {
          icon: '🗂️',
          tone: 'amber',
          title: 'Anki ב-DNA',
          text: 'שנים של שימוש ב-Anki הולידו ייבוא ישיר של קובצי .apkg בדפדפן בלי סיבוכים.'
        },
        {
          icon: '💚',
          tone: 'emerald',
          title: 'קודם כול ערך',
          text: 'אין מונטיזציה בהתחלה — מיקוד מלא במוצר שימושי שכיף לחזור אליו.'
        },
        {
          icon: '🛰️',
          tone: 'violet',
          title: 'יחד עם הקהילה',
          text: 'המשוב שלכם קובע אילו מצבים, שפות וכלים יתווספו בהמשך.'
        }
      ]
    },
    guide: {
      title: 'מה הזירה כבר יודעת לעשות',
      subtitle: 'בנוי לזיהוי מהיר של מילים, זיכרון חזותי והתקדמות מהנה.',
      cards: [
        {
          icon: '🎯',
          tone: 'cyan',
          title: '3 מצבי תרגול',
          text: 'הקלדה מהירה, תרגול שמיעה או מצב תרגום ישיר בזמן טיסה.'
        },
        {
          icon: '📦',
          tone: 'amber',
          title: 'ייבוא Anki מקומי',
          text: 'טענו קובצי .apkg, .colpkg, .tsv או .csv ישירות בדפדפן עם שמירה ב-IndexedDB.'
        },
        {
          icon: '🎨',
          tone: 'emerald',
          title: 'צבעי יידוע ו-8 שפות',
          text: 'זיהוי צבעוני של מין דקדוקי באוויר ותמיכה דו-כיוונית מלאה ב-8 שפות.'
        },
        {
          icon: '🎙️',
          tone: 'violet',
          title: 'קול Gemini 3.8 TTS + סאונד',
          text: 'כל פגיעה משמיעה את המילה בקול ברור לצד אפקטי אודיו חיים.'
        },
        {
          icon: '⭐',
          tone: 'rose',
          title: 'מועדפים ומבחן בזק',
          text: 'סמנו מילים מאתגרות בכוכב לחזרה תכופה יותר וסכמו שיעור בבוחן קצר.'
        },
        {
          icon: '🚀',
          tone: 'sky',
          title: '6 כלי נשק ומקלדת מובייל',
          text: 'פתחו כלי נשק חדשים ככל שתלמדו, ותרגלו בנוחות בנייד עם מקלדת ZType.'
        }
      ],
      ctaDecks: 'פתיחת חפיסות',
      ctaTts: 'אולפן קול'
    },
    roadmap: {
      title: 'לאן ממשיכים מכאן',
      subtitle: 'מפת דרכים פתוחה שגדלה לפי הצרכים האמיתיים של לומדי שפות.',
      stages: [
        {
          status: 'LIVE',
          tone: 'emerald',
          title: 'שלב 1 · ליבת המשחק ו-Anki',
          items: [
            '12 קורסים נושאיים ברמת B1 (~15 מילים לשיעור) ושלבי בוס',
            '8 שפות דו-כיווניות כולל תמיכה מלאה בימין-לשמאל (עברית וערבית)',
            'פענוח קובצי .apkg / .colpkg / .tsv ישירות בדפדפן',
            'קריינות Gemini 3.8 TTS, 6 כלי נשק ומקלדת מגע ZType'
          ]
        },
        {
          status: 'NEXT',
          tone: 'cyan',
          title: 'שלב 2 · העמקה ושיתוף',
          items: [
            'הרחבת קורסים רשמיים מ-A1 ועד B2 למצבי חיים אמיתיים',
            'תזמון חזרות מרווחות חכם יותר בתוך הגלים לפי טעויות וכוכבים',
            'שיתוף חפיסות ורשימות נושאיות בין שחקנים בקהילה',
            'אתגרים חדשים למהירות שמיעה ושליטה ביידוע'
          ]
        },
        {
          status: 'COMMUNITY',
          tone: 'violet',
          title: 'שלב 3 · שיח פתוח עם הקהילה',
          items: [
            'איסוף משוב אמיתי על מה שעוזר לזכור מילים מהר יותר',
            'תיעדוף שפות ופיצ׳רים לפי בקשות הקהילה הפעילה',
            'בלי חומות תשלום בהתחלה — פוקוס נטו על ערך ללומדים',
            'התייעצות שקופה בהמשך על הדרך ההוגנת ביותר לתמוך בפרויקט'
          ]
        }
      ],
      calloutTitle: 'יש לך רעיון או הצעה לשיפור?',
      calloutText: 'אפשר לשלוח הודעה קצרה — הפרויקט מתפתח יחד עם הלומדים.',
      calloutBtn: 'מעבר ליצירת קשר'
    },
    contact: {
      title: 'יצירת קשר ושיתופי פעולה',
      subtitle: 'לשאלות על שיתוף פעולה, רעיונות, משוב או הצעות לחפיסות חדשות — כתבו לכאן!',
      telegramTitle: 'Telegram',
      telegramRole: 'הדרך המהירה ביותר לדבר ישירות',
      telegramBtn: 'פתח בטלגרם',
      emailTitle: 'אימייל',
      emailRole: 'להצעות שיתוף פעולה ופניות',
      emailBtn: 'שליחת מייל',
      topicsTitle: 'על מה אפשר לכתוב',
      topics: [
        {
          icon: '🤝',
          title: 'שיתופי פעולה ושותפויות',
          text: 'מיזמים משותפים, בתי ספר לשפות, יוצרי תוכן ויוזמות חינוכיות.'
        },
        {
          icon: '💡',
          title: 'רעיונות ומשוב על המשחק',
          text: 'הצעות לשיפור מכניקת הירי, ייבוא Anki, סאונד או חוויית מובייל.'
        },
        {
          icon: '📚',
          title: 'חפיסות ושפות חדשות',
          text: 'אילו נושאים, רמות CEFR או צמדי שפות כדאי להוסיף בהמשך.'
        },
        {
          icon: '🛠️',
          title: 'עזרה בפיתוח',
          text: 'עיצוב, בדיקות, תרגומים או דעה כנה על הכיוון הבא.'
        }
      ]
    }
  },
  ar: {
    kicker: 'VOCANOVA · INDIE LOG',
    heroTitle: 'عن مشروع VOCANOVA',
    heroSubtitle: 'قصة البداية، طريقة عمل الساحة الفضائية، خطة التطوير والتواصل المباشر مع المطوّر.',
    metricsLabels: {
      languages: 'لغات',
      courses: 'دورات',
      words: 'كلمة + Anki'
    },
    tabs: [
      { id: 'story', icon: '✨', label: 'عن المشروع' },
      { id: 'guide', icon: '🎮', label: 'كيف يعمل' },
      { id: 'roadmap', icon: '🗺️', label: 'خطة التطوير' },
      { id: 'contact', icon: '✉️', label: 'التواصل' }
    ],
    copiedLabel: 'تم النسخ!',
    copyBtnLabel: 'نسخ',
    story: {
      badge: 'رسالة المؤسس · خلف الكواليس',
      title: 'صُنع لتعلّمي الشخصي — وآمل أن يلهم المجتمع أيضاً',
      paragraphs: [
        'أهلاً! أنا حالياً أتعلم اللغة الألمانية بنفسي وأستخدم Anki منذ سنوات طويلة بشكل يومي. التكرار المتباعد فعال جداً، لكن أحياناً ترغب في حفظ المفردات بروح لعبة حماسية بدلاً من النقر الصامت على البطاقات.',
        'من هنا وُلدت VOCANOVA. في البداية طورتها لنفسي فقط لأستمتع بمراجعة الكلمات، وسماع النطق، وملاحظة ألوان أدوات التعريف (der / die / das) أثناء اللعب. ومع تطورها أحببت مشاركتها لعلّها تعجب مجتمع متعلمي اللغات.',
        'لا أخطط لأي تحقيق دخل أو اشتراكات في المراحل الأولى. هدفي الآن هو بناء منتج مفيد وممتع بحق. وإذا لاقى المشروع صدى طيباً من المجتمع سأواصل تطويره، ولاحقاً سأستشيركم حول أفضل وأعدل طريقة لدعمه واستمراره.'
      ],
      quote: 'أولاً الفائدة الحقيقية ومتعة التعلّم وتفاعل المجتمع، وكل ما عدا ذلك سنقرره معكم لاحقاً.',
      ctaPlay: 'ابدأ اللعب',
      ctaAnki: 'استيراد Anki (.apkg)',
      ctaContact: 'راسل المطوّر',
      pillarsTitle: 'روح المشروع ومبادئه',
      pillars: [
        {
          icon: '🇩🇪',
          tone: 'cyan',
          title: 'من تجربة شخصية',
          text: 'كل ميزة وُلدت أثناء دراستي الفعلية للغة الألمانية وتُختبر يومياً.'
        },
        {
          icon: '🗂️',
          tone: 'amber',
          title: 'روح Anki',
          text: 'سنوات استخدام Anki قادت لدعم استيراد ملفات .apkg مباشرة داخل المتصفح.'
        },
        {
          icon: '💚',
          tone: 'emerald',
          title: 'الفائدة أولاً',
          text: 'دون أي حواجز دفع في البداية — تركيز كامل على جودة التعلّم والمتعة.'
        },
        {
          icon: '🛰️',
          tone: 'violet',
          title: 'مع المجتمع',
          text: 'ملاحظات اللاعبين توجّه الدورات الجديدة والأوضاع والخطوات القادمة.'
        }
      ]
    },
    guide: {
      title: 'ما الذي تقدمه الساحة الفضائية الآن',
      subtitle: 'مصممة لتسريع التعرّف على الكلمات، الذاكرة البصرية، وزخم اللعب.',
      cards: [
        {
          icon: '🎯',
          tone: 'cyan',
          title: '3 أوضاع تدريب',
          text: 'تدرّب بالكتابة السريعة أو الاستماع الصوتي أو وضع الترجمة الفورية.'
        },
        {
          icon: '📦',
          tone: 'amber',
          title: 'استيراد Anki مباشر',
          text: 'اسحب ملفات .apkg أو .colpkg أو .tsv أو .csv وتُحفظ محلياً في IndexedDB.'
        },
        {
          icon: '🎨',
          tone: 'emerald',
          title: 'ألوان الأدوات و8 لغات',
          text: 'تمييز لوني لجنس الكلمات أثناء الطيران مع دعم ثنائي الاتجاه لثماني لغات.'
        },
        {
          icon: '🎙️',
          tone: 'violet',
          title: 'نطق Gemini 3.8 TTS + صوتيات',
          text: 'يتم نطق كل كلمة عند إصابتها مع مؤثرات Web Audio الفورية.'
        },
        {
          icon: '⭐',
          tone: 'rose',
          title: 'المفضلة واختبار سريع',
          text: 'ضع نجمة على الكلمات الصعبة لتظهر أكثر، واختم كل درس باختبار قصير.'
        },
        {
          icon: '🚀',
          tone: 'sky',
          title: '6 أسلحة ولوحة ZType',
          text: 'افتح أسلحة فضائية جديدة مع تقدمك، والعب بسهولة على الهاتف بلوحة ZType.'
        }
      ],
      ctaDecks: 'تصفح المجموعات',
      ctaTts: 'استوديو الصوت'
    },
    roadmap: {
      title: 'إلى أين نتجه لاحقاً',
      subtitle: 'خارطة طريق حية تنمو انطلاقاً من الأساس الحالي واقتراحات المتعلمين.',
      stages: [
        {
          status: 'LIVE',
          tone: 'emerald',
          title: 'المرحلة 1 · الساحة الأساسية وAnki',
          items: [
            '12 دورة B1 موضوعية (~15 كلمة لكل درس) مع جولات الزعماء',
            '8 لغات بالاتجاهين مع دعم كامل للكتابة من اليمين لليسار',
            'استيراد ملفات .apkg / .colpkg / .tsv داخل المتصفح مباشرة',
            'نطق Gemini 3.8 TTS و6 أسلحة ولوحة لمس ZType'
          ]
        },
        {
          status: 'NEXT',
          tone: 'cyan',
          title: 'المرحلة 2 · تعميق التعلّم والمشاركة',
          items: [
            'توسيع الدورات الرسمية من مستوى A1 إلى B2 لمواقف الحياة اليومية',
            'جدولة تكرار متباعد أذكى داخل الموجات حسب الأخطاء والنجوم',
            'مشاركة المجموعات الخاصة والقوائم الموضوعية بين اللاعبين',
            'تحديات إضافية لسرعة السمع وإتقان أدوات التعريف'
          ]
        },
        {
          status: 'COMMUNITY',
          tone: 'violet',
          title: 'المرحلة 3 · التطوير مع المجتمع',
          items: [
            'جمع آراء المتعلمين حول أكثر ما يساعد على ترسيخ المفردات',
            'إعطاء الأولوية للغات والميزات التي يطلبها المجتمع',
            'الحفاظ على الوصول المفتوح دون حواجز دفع في البدايات',
            'استشارة المجتمع لاحقاً حول أنسب نموذج عادل لاستدامة المشروع'
          ]
        }
      ],
      calloutTitle: 'هل لديك فكرة أو اقتراح؟',
      calloutText: 'أرسل رسالة قصيرة — المشروع يتطور بحوار مفتوح مع متعلمي اللغات.',
      calloutBtn: 'الانتقال إلى التواصل'
    },
    contact: {
      title: 'التواصل والتعاون',
      subtitle: 'لاستفسارات التعاون والشراكات أو الأفكار واقتراحات المجموعات — راسلني هنا مباشرة!',
      telegramTitle: 'Telegram',
      telegramRole: 'أسرع وسيلة للتواصل المباشر',
      telegramBtn: 'فتح Telegram',
      emailTitle: 'البريد الإلكتروني',
      emailRole: 'للتعاون والمقترحات',
      emailBtn: 'إرسال بريد',
      topicsTitle: 'يمكنك التواصل بخصوص',
      topics: [
        {
          icon: '🤝',
          title: 'التعاون والشراكات',
          text: 'مشاريع مشتركة، معاهد لغات، صناع محتوى ومبادرات تعليمية.'
        },
        {
          icon: '💡',
          title: 'الأفكار والملاحظات',
          text: 'تحسين أسلوب اللعب، توافق ملفات Anki، الصوت أو تجربة الجوال.'
        },
        {
          icon: '📚',
          title: 'مجموعات ولغات جديدة',
          text: 'الموضوعات أو مستويات CEFR أو الأزواج اللغوية التي تود إضافتها.'
        },
        {
          icon: '🛠️',
          title: 'المساهمة في التطوير',
          text: 'التصميم، الاختبار، الترجمة أو رأيك الصادق حول الخطوة القادمة.'
        }
      ]
    }
  }
};
