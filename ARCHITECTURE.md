# 🏗️ Архитектура проекта Z-LINGO (SOLID & ES Modules)

Проект построен на **нативных ES-модулях браузера (`<script type="module">`)** без тяжёлых сборщиков и внешних зависимостей, что обеспечивает мгновенный деплой на Vercel, параллельную загрузку по HTTP/2 (`modulepreload`) и строгую изоляцию ответственности.

---

## 🧭 Карта директорий

```text
├── index.html                  # Разметка экранов и подключение модулей + стилей
├── admin-catalog.json          # Облачный каталог курсов Супер-Админа (синхронизируется через GitHub API)
├── start-local.bat             # Быстрый локальный запуск (http://localhost:8080)
├── scripts/
│   └── verify_project.py       # Статический линкер ESM, проверка DOM ID, CSS, i18n и отсутствия циклов (< 1 сек)
├── styles/                     # Модульные таблицы стилей (строгий порядок каскада 01..08)
│   ├── 01-base.css             # Переменные (:root), шрифты (Orbitron, Exo 2, Rubik, Noto Sans Hebrew), сброс
│   ├── 02-hud-gameplay.css     # Верхний HUD, боковые панели, клавиатура ZType, оверлеи паузы/победы
│   ├── 03-dialogs-catalog.css  # Модальные окна (<dialog>), студия TTS, импорт Anki, бейджи оружия
│   ├── 04-home-dashboard.css   # Главная панель Z-LINGO 2.0 (Hero, промо-бой, Bento Grid)
│   ├── 05-battle-academy.css   # 3-колоночная боевая арена Space Language Academy (mode-play)
│   ├── 06-decks-page.css       # Полноэкранная страница «Мои колоды» / «Курсы» (#decksPageView)
│   ├── 07-admin-studio.css     # Студия Супер-Админа (#adminStudioView)
│   └── 08-mobile.css           # Адаптация под смартфоны (<= 768px), горизонтальные колоды, нижний док
├── src/
│   ├── main.js                 # Composition Root: связывание EventBus, команд и запуск цикла 60 FPS
│   ├── core/                   # Чистая инфраструктура (0 зависимостей от домена и DOM)
│   │   ├── events.js           # Шина событий EventBus (Pub/Sub) + реестр команд (actions)
│   │   ├── storage.js          # Безопасный JSON-адаптер localStorage и авто-определение локали
│   │   └── utils.js            # Чистые утилиты (escapeHtml, shuffleArray, roundRect, allocateEntityId)
│   ├── config/                 # Декларативная конфигурация (OCP)
│   │   ├── constants.js        # Цвета артиклей, языковые метаданные, голоса Gemini, раскладки ZType
│   │   └── weapons.js          # Реестр оружия (Плазма, Грави-волна, Рельсотрон, Ракеты, Тесла, Неон-Синт)
│   ├── i18n/                   # Мультиязычные словари интерфейса (RU / EN / HE)
│   │   ├── ru.js
│   │   ├── en.js
│   │   ├── he.js
│   │   └── index.js
│   ├── data/                   # Встроенный каталог официальных курсов по языкам
│   │   ├── catalog-meta.js     # Языки и базовые категории
│   │   ├── courses-de.js       # Курсы немецкого языка (DE)
│   │   ├── courses-en.js       # Курсы английского языка (EN)
│   │   ├── courses-es.js       # Курсы испанского языка (ES)
│   │   └── index.js            # Сборка GAME_CATALOG
│   ├── anki/                   # Подсистема импорта Anki (.apkg / SQLite / Zstd) и личных колод
│   │   ├── text-utils.js       # Очистка HTML/Cloze-полей и определение уровня CEFR
│   │   ├── binary-sqlite.js    # Распаковка ZIP/Zstd, sql.js + автономный Pure-JS парсер SQLite3 B-tree
│   │   ├── field-mapper.js     # Эвристическое распознавание полей Note Models и нормализация слов
│   │   ├── course-builder.js   # Сборка модулей/босс-уроков и парсер учебников Супер-Админа
│   │   ├── user-decks-repo.js  # Хранилище личных колод в IndexedDB (+ резерв в localStorage)
│   │   └── index.js            # Единый фасад AnkiImporter
│   ├── services/               # Аудио- и речевые сервисы
│   │   ├── sound-engine.js     # Процедурный синтезатор Web Audio API 2.0 (0 зависимостей от DOM)
│   │   └── tts-service.js      # Gemini 3.8 TTS + кэш WAV в IndexedDB + браузерный fallback
│   ├── state/
│   │   └── store.js            # Реактивный стор прогресса (выученные слова, ⭐, избранные колоды, серия дней)
│   ├── domain/
│   │   └── catalog-service.js  # Бизнес-логика каталога, слияние с Супер-Админом, статистика и CEFR-фильтры
│   ├── engine/                 # Игровой движок и 2D-рендеринг
│   │   ├── arena-physics.js    # Геометрия поля, авто-замедление длинных слов, анти-коллизии капсул
│   │   ├── weapon-vfx.js       # Экипировка пушек и спецэффекты выстрелов / молний / частиц
│   │   ├── canvas-renderer.js  # Отрисовка корабля, капсул слов, переводов и баннеров на Canvas
│   │   ├── promo-autopilot.js  # Живой промо-бой корабля на Главной и переходы между экранами
│   │   └── gameplay.js         # Боевой цикл 60 FPS, ввод с клавиатуры, ЭМИ и блиц-тест из 3 вопросов
│   └── ui/                     # Независимые контроллеры интерфейса
│       ├── dom.js              # Единый реестр DOM-элементов
│       ├── hud-widgets.js      # Виджеты Главной, карточка «Попадание!», сайдбар уроков, лента взрывов
│       ├── decks-page.js       # Страница «Мои колоды» (ПК сетка/список + мобильные карточки + редактор)
│       ├── modals.js           # Модальные окна (<dialog>): Anki, TTS, Словарь, Профиль, Статистика, Рейтинг
│       ├── admin-studio.js     # Студия Супер-Админа (AI-перевод Gemini + публикация в GitHub)
│       └── navigation-i18n.js  # Навигация экранов, мобильный нижний док и локализация DOM
└── api/                        # Серверные функции Vercel
    ├── _lib/
    │   ├── http.js             # Общие CORS-заголовки, валидация и чтение ключей
    │   └── gemini.js           # Клиент Gemini Interactions API (текст + аудио)
    ├── tts.js                  # Прокси и CDN-кэш озвучки Gemini 3.8 TTS
    ├── translate.js            # AI-обогащение и клонирование курсов для Супер-Админа
    └── admin-publish.js        # Авто-коммит admin-catalog.json в GitHub
```

---

## 🧩 Принципы SOLID в проекте

1. **SRP (Single Responsibility):** каждый файл отвечает ровно за одну задачу (например, `sound-engine.js` занимается только синтезом Web Audio, `field-mapper.js` — только разбором полей Anki, `08-mobile.css` — только мобильной адаптацией `<= 768px`).
2. **OCP (Open/Closed):** добавление нового оружия в `src/config/weapons.js`, нового курса в `src/data/courses-*.js` или нового языка в `src/i18n/` не требует переписывания ядра игры; новые UI-виджеты подписываются на события `bus.on('learned:updated' | 'pins:changed' | 'favorites:changed')`.
3. **LSP (Liskov Substitution):** официальные курсы, курсы Супер-Админа, импорты Anki `.apkg` и ручные списки используют единый контракт `Course -> Module -> Lesson -> WordEntry`.
4. **ISP (Interface Segregation):** модули импортируют из `src/ui/dom.js` и `src/state/store.js` только те элементы и селекторы, которые им действительно нужны.
5. **DIP (Dependency Inversion):** граф ES-модулей строго ацикличен (`0` циклических зависимостей). Нижние слои (`services`, `state`, `engine`) никогда не импортируют верхние UI-экраны напрямую, а общаются через `bus` и медиатор `actions` из `src/core/events.js`.

---

## 🛠️ Быстрая проверка целостности перед коммитом

Запустите статический верификатор (проверяет баланс HTML/CSS/JS, все `import`/`export`, отсутствие циклов, совпадение всех 433 `id` с `index.html` и 100% синхронность ключей локализации RU/EN/HE):

```powershell
python scripts/verify_project.py
```
