// Главная кампания "Auto" — все 73 слова из списка пользователя с переводом на русский (ru) и иврит (he),
// разбитые на 6 тематических подуровней + полный режим "Auto"

window.AUTO_CAMPAIGN = {
  id: 'auto-main',
  title: 'AUTO — Немецкий словарный шутер',
  subtitle: 'Главный курс: Автомобиль, Дорога, Путешествия и Страхование (73 слова · RU / עברית)',
  levels: [
    {
      id: 'level-1',
      number: 1,
      name: 'Отпуск и путешествия',
      deName: 'Urlaub & Reise',
      description: 'Планирование поездки, виды отдыха, придорожные зоны и очереди в начале каникул.',
      speedMultiplier: 0.85,
      spawnIntervalMs: 2900,
      words: [
        {
          raw: 'der Strandurlaub, -e',
          word: 'Strandurlaub',
          withArticle: 'der Strandurlaub',
          article: 'der',
          plural: '-e',
          ru: 'пляжный отпуск',
          he: 'חופשת חוף'
        },
        {
          raw: 'der Freizeitpark, -s',
          word: 'Freizeitpark',
          withArticle: 'der Freizeitpark',
          article: 'der',
          plural: '-s',
          ru: 'парк развлечений',
          he: 'פארק שעשועים'
        },
        {
          raw: 'die Urlaubsplanung, -en',
          word: 'Urlaubsplanung',
          withArticle: 'die Urlaubsplanung',
          article: 'die',
          plural: '-en',
          ru: 'планирование отпуска',
          he: 'תכנון חופשה'
        },
        {
          raw: 'die Gruppenreise, -n',
          word: 'Gruppenreise',
          withArticle: 'die Gruppenreise',
          article: 'die',
          plural: '-n',
          ru: 'групповая поездка',
          he: 'טיול קבוצתי'
        },
        {
          raw: 'die Städtereise, -n',
          word: 'Städtereise',
          withArticle: 'die Städtereise',
          article: 'die',
          plural: '-n',
          ru: 'поездка по городам',
          he: 'טיול ערים'
        },
        {
          raw: 'die Kreuzfahrt, -en',
          word: 'Kreuzfahrt',
          withArticle: 'die Kreuzfahrt',
          article: 'die',
          plural: '-en',
          ru: 'круиз',
          he: 'שיט תענוגות (קרוז)'
        },
        {
          raw: 'die Abwechslung, -en',
          word: 'Abwechslung',
          withArticle: 'die Abwechslung',
          article: 'die',
          plural: '-en',
          ru: 'разнообразие, смена впечатлений',
          he: 'גיוון, שינוי אווירה'
        },
        {
          raw: 'der Ferienbeginn, Sg.',
          word: 'Ferienbeginn',
          withArticle: 'der Ferienbeginn',
          article: 'der',
          plural: 'Sg.',
          ru: 'начало каникул / отпуска',
          he: 'תחילת החופשה'
        },
        {
          raw: 'die Raststätte, -n',
          word: 'Raststätte',
          withArticle: 'die Raststätte',
          article: 'die',
          plural: '-n',
          ru: 'придорожный ресторан / зона отдыха',
          he: 'תחנת רענון (בכביש מהיר)'
        },
        {
          raw: 'die Warteschlange, -n',
          word: 'Warteschlange',
          withArticle: 'die Warteschlange',
          article: 'die',
          plural: '-n',
          ru: 'очередь',
          he: 'תור'
        }
      ]
    },
    {
      id: 'level-2',
      number: 2,
      name: 'Кузов и детали авто',
      deName: 'Auto: Außen & Licht',
      description: 'Основные части автомобиля снаружи: двигатель, капот, багажник, стёкла, фары и шины.',
      speedMultiplier: 0.92,
      spawnIntervalMs: 2750,
      words: [
        {
          raw: 'das Fahrzeug, -e',
          word: 'Fahrzeug',
          withArticle: 'das Fahrzeug',
          article: 'das',
          plural: '-e',
          ru: 'транспортное средство',
          he: 'כלי רכב'
        },
        {
          raw: 'der Motor, -en',
          word: 'Motor',
          withArticle: 'der Motor',
          article: 'der',
          plural: '-en',
          ru: 'двигатель',
          he: 'מנוע'
        },
        {
          raw: 'die Motorhaube, -n',
          word: 'Motorhaube',
          withArticle: 'die Motorhaube',
          article: 'die',
          plural: '-n',
          ru: 'капот',
          he: 'מכסה מנוע'
        },
        {
          raw: 'der Kofferraum, ¨-e',
          word: 'Kofferraum',
          withArticle: 'der Kofferraum',
          article: 'der',
          plural: '¨-e',
          ru: 'багажник',
          he: 'תא מטען (בגאז׳)'
        },
        {
          raw: 'die Windschutzscheibe, -n',
          word: 'Windschutzscheibe',
          withArticle: 'die Windschutzscheibe',
          article: 'die',
          plural: '-n',
          ru: 'лобовое стекло',
          he: 'שמשה קדמית'
        },
        {
          raw: 'der Scheibenwischer, -',
          word: 'Scheibenwischer',
          withArticle: 'der Scheibenwischer',
          article: 'der',
          plural: '-',
          ru: 'стеклоочиститель (дворник)',
          he: 'מגב שמשות (וישר)'
        },
        {
          raw: 'der Scheinwerfer, -',
          word: 'Scheinwerfer',
          withArticle: 'der Scheinwerfer',
          article: 'der',
          plural: '-',
          ru: 'фара',
          he: 'פנס קדמי'
        },
        {
          raw: 'der Blinker, -',
          word: 'Blinker',
          withArticle: 'der Blinker',
          article: 'der',
          plural: '-',
          ru: 'указатель поворота',
          he: 'פנס איתות (ווינקר)'
        },
        {
          raw: 'der Seitenspiegel, -',
          word: 'Seitenspiegel',
          withArticle: 'der Seitenspiegel',
          article: 'der',
          plural: '-',
          ru: 'боковое зеркало',
          he: 'מראת צד'
        },
        {
          raw: 'der Reifen, -',
          word: 'Reifen',
          withArticle: 'der Reifen',
          article: 'der',
          plural: '-',
          ru: 'шина',
          he: 'צמיג'
        },
        {
          raw: 'der Tank, -s',
          word: 'Tank',
          withArticle: 'der Tank',
          article: 'der',
          plural: '-s',
          ru: 'бак',
          he: 'מכל דלק'
        },
        {
          raw: 'tanken',
          word: 'tanken',
          withArticle: 'tanken',
          article: 'Verb',
          plural: '',
          ru: 'заправляться',
          he: 'לתדלק'
        }
      ]
    },
    {
      id: 'level-3',
      number: 3,
      name: 'Салон, управление и безопасность',
      deName: 'Steuerung & Sicherheit',
      description: 'Руль, педали, коробка передач, ремни, аптечка, топливо и обязательное оснащение.',
      speedMultiplier: 0.98,
      spawnIntervalMs: 2650,
      words: [
        {
          raw: 'das Lenkrad, ¨-er',
          word: 'Lenkrad',
          withArticle: 'das Lenkrad',
          article: 'das',
          plural: '¨-er',
          ru: 'руль',
          he: 'הגה'
        },
        {
          raw: 'das Gaspedal, -e',
          word: 'Gaspedal',
          withArticle: 'das Gaspedal',
          article: 'das',
          plural: '-e',
          ru: 'педаль газа',
          he: 'דוושת גז'
        },
        {
          raw: 'die Bremse, -n',
          word: 'Bremse',
          withArticle: 'die Bremse',
          article: 'die',
          plural: '-n',
          ru: 'тормоз',
          he: 'בלם (ברקס)'
        },
        {
          raw: 'die Kupplung, -en',
          word: 'Kupplung',
          withArticle: 'die Kupplung',
          article: 'die',
          plural: '-en',
          ru: 'сцепление',
          he: 'מצמד (קלאץ׳)'
        },
        {
          raw: 'der Schalthebel, -',
          word: 'Schalthebel',
          withArticle: 'der Schalthebel',
          article: 'der',
          plural: '-',
          ru: 'рычаг переключения передач',
          he: 'ידית הילוכים'
        },
        {
          raw: 'der Sicherheitsgurt, -e',
          word: 'Sicherheitsgurt',
          withArticle: 'der Sicherheitsgurt',
          article: 'der',
          plural: '-e',
          ru: 'ремень безопасности',
          he: 'חגורת בטיחות'
        },
        {
          raw: 'der Kindersitz, -e',
          word: 'Kindersitz',
          withArticle: 'der Kindersitz',
          article: 'der',
          plural: '-e',
          ru: 'детское кресло',
          he: 'מושב בטיחות לילדים'
        },
        {
          raw: 'das Panndreieck, -e',
          word: 'Panndreieck',
          withArticle: 'das Panndreieck',
          article: 'das',
          plural: '-e',
          ru: 'аварийный знак (треугольник)',
          he: 'משולש אזהרה'
        },
        {
          raw: 'der Erste-Hilfe-Koffer, -',
          word: 'Erste-Hilfe-Koffer',
          withArticle: 'der Erste-Hilfe-Koffer',
          article: 'der',
          plural: '-',
          ru: 'аптечка первой помощи',
          he: 'ערכת עזרה ראשונה'
        },
        {
          raw: 'der Wagenheber, -',
          word: 'Wagenheber',
          withArticle: 'der Wagenheber',
          article: 'der',
          plural: '-',
          ru: 'домкрат',
          he: 'מגבה (ג׳ק לרכב)'
        },
        {
          raw: 'der Ölstand, Sg.',
          word: 'Ölstand',
          withArticle: 'der Ölstand',
          article: 'der',
          plural: 'Sg.',
          ru: 'уровень масла',
          he: 'מפלס שמן'
        },
        {
          raw: 'das Benzin, Sg.',
          word: 'Benzin',
          withArticle: 'das Benzin',
          article: 'das',
          plural: 'Sg.',
          ru: 'бензин',
          he: 'בנזין'
        },
        {
          raw: 'der Diesel, Sg.',
          word: 'Diesel',
          withArticle: 'der Diesel',
          article: 'der',
          plural: 'Sg.',
          ru: 'дизель',
          he: 'סולר (דיזל)'
        }
      ]
    },
    {
      id: 'level-4',
      number: 4,
      name: 'Автобан, полосы и объезд',
      deName: 'Autobahn & Baustelle',
      description: 'Дорожное полотно, съезды, строительные работы, перекрытия и ситуация на трассе.',
      speedMultiplier: 1.04,
      spawnIntervalMs: 2550,
      words: [
        {
          raw: 'die Fahrbahn, -en',
          word: 'Fahrbahn',
          withArticle: 'die Fahrbahn',
          article: 'die',
          plural: '-en',
          ru: 'проезжая часть',
          he: 'מסלול נסיעה (כביש)'
        },
        {
          raw: 'der Fahrstreifen, -',
          word: 'Fahrstreifen',
          withArticle: 'der Fahrstreifen',
          article: 'der',
          plural: '-',
          ru: 'полоса движения',
          he: 'נתיב נסיעה'
        },
        {
          raw: 'die Ausfahrt, -en',
          word: 'Ausfahrt',
          withArticle: 'die Ausfahrt',
          article: 'die',
          plural: '-en',
          ru: 'съезд (с автобана)',
          he: 'יציאה (מכביש מהיר)'
        },
        {
          raw: 'Bauarbeiten, Pl.',
          word: 'Bauarbeiten',
          withArticle: 'Bauarbeiten',
          article: 'Pl.',
          plural: 'Pl.',
          ru: 'строительные работы',
          he: 'עבודות בכביש / בנייה'
        },
        {
          raw: 'sperren',
          word: 'sperren',
          withArticle: 'sperren',
          article: 'Verb',
          plural: '',
          ru: 'перекрывать, закрывать',
          he: 'לחסום, לסגור'
        },
        {
          raw: 'die Umleitung, -en',
          word: 'Umleitung',
          withArticle: 'die Umleitung',
          article: 'die',
          plural: '-en',
          ru: 'объезд',
          he: 'מעקף (דרך חלופית)'
        },
        {
          raw: 'umleiten',
          word: 'umleiten',
          withArticle: 'umleiten',
          article: 'Verb',
          plural: '',
          ru: 'направлять в объезд',
          he: 'להפנות למעקף'
        },
        {
          raw: 'ausschildern',
          word: 'ausschildern',
          withArticle: 'ausschildern',
          article: 'Verb',
          plural: '',
          ru: 'обозначать указателями',
          he: 'לשלט (להציב שלטי הכוונה)'
        },
        {
          raw: 'der Gegenstand, ¨-e',
          word: 'Gegenstand',
          withArticle: 'der Gegenstand',
          article: 'der',
          plural: '¨-e',
          ru: 'предмет',
          he: 'חפץ, עצם'
        },
        {
          raw: 'der/die Geisterfahrer/in, -/nen',
          word: 'Geisterfahrer',
          withArticle: 'der Geisterfahrer',
          article: 'der/die',
          plural: '-/nen',
          ru: 'водитель, едущий против движения',
          he: 'נהג הנוסע נגד כיוון התנועה'
        },
        {
          raw: 'das Verkehrschaos, Sg.',
          word: 'Verkehrschaos',
          withArticle: 'das Verkehrschaos',
          article: 'das',
          plural: 'Sg.',
          ru: 'транспортный хаос',
          he: 'כאוס תחבורתי (פקקי ענק)'
        },
        {
          raw: 'etw. ist überfüllt / überfüllt sein',
          word: 'überfüllt',
          withArticle: 'überfüllt sein',
          article: 'Adj.',
          plural: '',
          ru: 'что-то переполнено / быть переполненным',
          he: 'צפוף מאוד / עמוס לעייפה'
        },
        {
          raw: 'vorsichtig',
          word: 'vorsichtig',
          withArticle: 'vorsichtig',
          article: 'Adj.',
          plural: '',
          ru: 'осторожный',
          he: 'זהיר'
        }
      ]
    },
    {
      id: 'level-5',
      number: 5,
      name: 'Поезда, сбои и происшествия',
      deName: 'Bahn, Streik & Meldungen',
      description: 'Железная дорога, замена поездов, объявления, забастовки, свидетели и буксировка.',
      speedMultiplier: 1.08,
      spawnIntervalMs: 2500,
      words: [
        {
          raw: 'der Bahnverkehr, Sg.',
          word: 'Bahnverkehr',
          withArticle: 'der Bahnverkehr',
          article: 'der',
          plural: 'Sg.',
          ru: 'железнодорожное движение',
          he: 'תנועת רכבות'
        },
        {
          raw: 'der Schienenersatzverkehr, Sg.',
          word: 'Schienenersatzverkehr',
          withArticle: 'der Schienenersatzverkehr',
          article: 'der',
          plural: 'Sg.',
          ru: 'замена рельсового транспорта',
          he: 'שירות אוטובוסים חלופי לרכבת'
        },
        {
          raw: 'die Durchsage, -n',
          word: 'Durchsage',
          withArticle: 'die Durchsage',
          article: 'die',
          plural: '-n',
          ru: 'объявление (по громкой связи)',
          he: 'הודעה (בכריזה)'
        },
        {
          raw: 'die Demonstration, -en',
          word: 'Demonstration',
          withArticle: 'die Demonstration',
          article: 'die',
          plural: '-en',
          ru: 'демонстрация, митинг',
          he: 'הפגנה'
        },
        {
          raw: 'streiken',
          word: 'streiken',
          withArticle: 'streiken',
          article: 'Verb',
          plural: '',
          ru: 'бастовать',
          he: 'לשבות'
        },
        {
          raw: 'die Zeitungsmeldung, -en',
          word: 'Zeitungsmeldung',
          withArticle: 'die Zeitungsmeldung',
          article: 'die',
          plural: '-en',
          ru: 'газетное сообщение',
          he: 'ידיעה בעיתון'
        },
        {
          raw: 'der/die Zeuge/Zeugin, -n/-nen',
          word: 'Zeuge',
          withArticle: 'der Zeuge',
          article: 'der/die',
          plural: '-n/-nen',
          ru: 'свидетель / свидетельница',
          he: 'עד / עדה'
        },
        {
          raw: 'befragen',
          word: 'befragen',
          withArticle: 'befragen',
          article: 'Verb',
          plural: '',
          ru: 'опрашивать',
          he: 'לתשאל, לחקור'
        },
        {
          raw: 'abschleppen',
          word: 'abschleppen',
          withArticle: 'abschleppen',
          article: 'Verb',
          plural: '',
          ru: 'буксировать',
          he: 'לגרור (רכב)'
        },
        {
          raw: 'der-/das-/dieselbe, dieselben',
          word: 'dieselbe',
          withArticle: 'dieselbe',
          article: 'Pron.',
          plural: 'dieselben',
          ru: 'тот же / та же / то же, те же',
          he: 'אותו הדבר / אותם הדברים'
        },
        {
          raw: 'außerdem',
          word: 'außerdem',
          withArticle: 'außerdem',
          article: 'Adv.',
          plural: '',
          ru: 'кроме того',
          he: 'חוץ מזה, בנוסף לכך'
        },
        {
          raw: 'das Unwetter, -',
          word: 'Unwetter',
          withArticle: 'das Unwetter',
          article: 'das',
          plural: '-',
          ru: 'непогода, шторм',
          he: 'מזג אוויר סוער, סופה'
        }
      ]
    },
    {
      id: 'level-6',
      number: 6,
      name: 'Страховка, закон и ДТП',
      deName: 'Versicherung, Gesetz & Unfall',
      description: 'Документы, налог, ОСАГО, каско, ущерб, пострадавшие и страховые случаи.',
      speedMultiplier: 1.12,
      spawnIntervalMs: 2450,
      words: [
        {
          raw: 'Fahrzeugpapiere, Pl.',
          word: 'Fahrzeugpapiere',
          withArticle: 'Fahrzeugpapiere',
          article: 'Pl.',
          plural: 'Pl.',
          ru: 'документы на автомобиль',
          he: 'מסמכי רכב (רישיון רכב)'
        },
        {
          raw: 'das Gesetz, -e',
          word: 'Gesetz',
          withArticle: 'das Gesetz',
          article: 'das',
          plural: '-e',
          ru: 'закон',
          he: 'חוק'
        },
        {
          raw: 'gesetzlich vorgeschrieben',
          word: 'gesetzlich vorgeschrieben',
          withArticle: 'gesetzlich vorgeschrieben',
          article: 'Adj.',
          plural: '',
          ru: 'установленный законом',
          he: 'קבוע בחוק (חובה על פי חוק)'
        },
        {
          raw: 'die Kfz-Steuer, -n',
          word: 'Kfz-Steuer',
          withArticle: 'die Kfz-Steuer',
          article: 'die',
          plural: '-n',
          ru: 'налог на транспортное средство',
          he: 'מס רכב (אגרת רישוי)'
        },
        {
          raw: 'die Kfz-Haftpflichtversicherung, -en',
          word: 'Kfz-Haftpflichtversicherung',
          withArticle: 'die Kfz-Haftpflichtversicherung',
          article: 'die',
          plural: '-en',
          ru: 'обязательное страхование автогражданской ответственности (ОСАГО)',
          he: 'ביטוח חובה וצד ג׳ לרכב'
        },
        {
          raw: 'die Teilkaskoversicherung, -en',
          word: 'Teilkaskoversicherung',
          withArticle: 'die Teilkaskoversicherung',
          article: 'die',
          plural: '-en',
          ru: 'частичное каско',
          he: 'ביטוח מקיף חלקי'
        },
        {
          raw: 'die Vollkaskoversicherung, -en',
          word: 'Vollkaskoversicherung',
          withArticle: 'die Vollkaskoversicherung',
          article: 'die',
          plural: '-en',
          ru: 'полное каско',
          he: 'ביטוח מקיף מלא'
        },
        {
          raw: 'das Unfallopfer, -',
          word: 'Unfallopfer',
          withArticle: 'das Unfallopfer',
          article: 'das',
          plural: '-',
          ru: 'жертва аварии',
          he: 'נפגע תאונה'
        },
        {
          raw: 'der/die Verletzte, -n',
          word: 'Verletzte',
          withArticle: 'der Verletzte',
          article: 'der/die',
          plural: '-n',
          ru: 'пострадавший / пострадавшая',
          he: 'פצוע / פצועה'
        },
        {
          raw: 'der Personenschaden, ¨-',
          word: 'Personenschaden',
          withArticle: 'der Personenschaden',
          article: 'der',
          plural: '¨-',
          ru: 'ущерб здоровью / телесные повреждения',
          he: 'נזקי גוף'
        },
        {
          raw: 'verursachen',
          word: 'verursachen',
          withArticle: 'verursachen',
          article: 'Verb',
          plural: '',
          ru: 'вызывать, причинять',
          he: 'לגרום ל-'
        },
        {
          raw: 'der Diebstahl, Sg.',
          word: 'Diebstahl',
          withArticle: 'der Diebstahl',
          article: 'der',
          plural: 'Sg.',
          ru: 'кража',
          he: 'גניבה'
        },
        {
          raw: 'der Brand, ¨-e',
          word: 'Brand',
          withArticle: 'der Brand',
          article: 'der',
          plural: '¨-e',
          ru: 'пожар',
          he: 'שריפה'
        }
      ]
    }
  ]
};
