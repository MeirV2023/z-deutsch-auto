// Единый трёхступенчатый каталог курсов Z-LINGO (Немецкий / Английский / Испанский)
// Слова привязаны к изучаемому языку (targetLang), а переводы хранятся внутри каждого слова объектом translations: { ru, en, he }.
// Каждый урок содержит 10–13 слов (~1.5 мин), а каждый 4-й урок — динамический Босс-урок (Повторение)!

window.GAME_CATALOG = {
  "targetLanguages": [
    {
      "id": "de",
      "flag": "🇩🇪",
      "code": "DE",
      "names": {
        "ru": "Немецкий",
        "en": "German",
        "he": "גרמנית"
      }
    },
    {
      "id": "en",
      "flag": "🇬🇧",
      "code": "EN",
      "names": {
        "ru": "Английский",
        "en": "English",
        "he": "אנגלית"
      }
    },
    {
      "id": "es",
      "flag": "🇪🇸",
      "code": "ES",
      "names": {
        "ru": "Испанский",
        "en": "Spanish",
        "he": "ספרדית"
      }
    }
  ],
  "nativeLanguages": [
    {
      "id": "ru",
      "flag": "🇷🇺",
      "code": "RU",
      "label": "🇷🇺 Русский",
      "short": "🇷🇺 RU",
      "dir": "ltr"
    },
    {
      "id": "en",
      "flag": "🇬🇧",
      "code": "EN",
      "label": "🇬🇧 English",
      "short": "🇬🇧 EN",
      "dir": "ltr"
    },
    {
      "id": "he",
      "flag": "🇮🇱",
      "code": "HE",
      "label": "🇮🇱 עברית",
      "short": "🇮🇱 עברית",
      "dir": "rtl"
    }
  ],
  "courses": {
    "de": [
      {
        "id": "de-auto",
        "targetLang": "de",
        "source": "official",
        "icon": "🚗",
        "levelTag": "A2–B1",
        "titles": {
          "ru": "Авто и дорога (AUTO)",
          "en": "Auto & Road (AUTO)",
          "he": "רכב ודרך (AUTO)"
        },
        "descriptions": {
          "ru": "Полный курс автомобильной лексики (73 слова): кузов, салон, автобан, ДТП и страховка.",
          "en": "Complete 73-word German automotive & highway course: car parts, cabin, traffic & insurance.",
          "he": "קורס מלא של 73 מילים בנושא רכב, אוטובאן, תאונות וביטוח."
        },
        "modules": [
          {
            "id": "de-auto-m1",
            "titles": {
              "ru": "Модуль 1: Кузов, салон и поездка",
              "en": "Module 1: Exterior, Cabin & Trip",
              "he": "מודול 1: מרכב, תא נוסעים ונסיעה"
            },
            "lessons": [
              {
                "id": "de-auto-m1-l1",
                "speedMultiplier": 0.9,
                "spawnIntervalMs": 2800,
                "titles": {
                  "ru": "Кузов и свет",
                  "en": "Body & Lights",
                  "he": "מרכב ותאורה"
                },
                "descriptions": {
                  "ru": "Двигатель, багажник, фары, зеркала и шины (12 слов).",
                  "en": "Engine, trunk, headlights, mirrors & tires (12 words).",
                  "he": "מנוע, תא מטען, פנסים, מראות וצמיגים (12 מילים)."
                },
                "words": [
                  {
                    "raw": "das Fahrzeug, -e",
                    "word": "Fahrzeug",
                    "withArticle": "das Fahrzeug",
                    "article": "das",
                    "plural": "-e",
                    "translations": {
                      "ru": "транспортное средство",
                      "en": "vehicle",
                      "he": "כלי רכב"
                    }
                  },
                  {
                    "raw": "der Motor, -en",
                    "word": "Motor",
                    "withArticle": "der Motor",
                    "article": "der",
                    "plural": "-en",
                    "translations": {
                      "ru": "двигатель",
                      "en": "engine, motor",
                      "he": "מנוע"
                    }
                  },
                  {
                    "raw": "die Motorhaube, -n",
                    "word": "Motorhaube",
                    "withArticle": "die Motorhaube",
                    "article": "die",
                    "plural": "-n",
                    "translations": {
                      "ru": "капот",
                      "en": "hood / bonnet",
                      "he": "מכסה מנוע"
                    }
                  },
                  {
                    "raw": "der Kofferraum, ¨-e",
                    "word": "Kofferraum",
                    "withArticle": "der Kofferraum",
                    "article": "der",
                    "plural": "¨-e",
                    "translations": {
                      "ru": "багажник",
                      "en": "car trunk / boot",
                      "he": "תא מטען (בגאז׳)"
                    }
                  },
                  {
                    "raw": "die Windschutzscheibe, -n",
                    "word": "Windschutzscheibe",
                    "withArticle": "die Windschutzscheibe",
                    "article": "die",
                    "plural": "-n",
                    "translations": {
                      "ru": "лобовое стекло",
                      "en": "windshield / windscreen",
                      "he": "שמשה קדמית"
                    }
                  },
                  {
                    "raw": "der Scheibenwischer, -",
                    "word": "Scheibenwischer",
                    "withArticle": "der Scheibenwischer",
                    "article": "der",
                    "plural": "-",
                    "translations": {
                      "ru": "стеклоочиститель (дворник)",
                      "en": "windshield wiper",
                      "he": "מגב שמשות (וישר)"
                    }
                  },
                  {
                    "raw": "der Scheinwerfer, -",
                    "word": "Scheinwerfer",
                    "withArticle": "der Scheinwerfer",
                    "article": "der",
                    "plural": "-",
                    "translations": {
                      "ru": "фара",
                      "en": "headlight",
                      "he": "פנס קדמי"
                    }
                  },
                  {
                    "raw": "der Blinker, -",
                    "word": "Blinker",
                    "withArticle": "der Blinker",
                    "article": "der",
                    "plural": "-",
                    "translations": {
                      "ru": "указатель поворота",
                      "en": "turn signal / indicator",
                      "he": "פנס איתות (ווינקר)"
                    }
                  },
                  {
                    "raw": "der Seitenspiegel, -",
                    "word": "Seitenspiegel",
                    "withArticle": "der Seitenspiegel",
                    "article": "der",
                    "plural": "-",
                    "translations": {
                      "ru": "боковое зеркало",
                      "en": "side mirror",
                      "he": "מראת צד"
                    }
                  },
                  {
                    "raw": "der Reifen, -",
                    "word": "Reifen",
                    "withArticle": "der Reifen",
                    "article": "der",
                    "plural": "-",
                    "translations": {
                      "ru": "шина",
                      "en": "tire / tyre",
                      "he": "צמיג"
                    }
                  },
                  {
                    "raw": "der Tank, -s",
                    "word": "Tank",
                    "withArticle": "der Tank",
                    "article": "der",
                    "plural": "-s",
                    "translations": {
                      "ru": "бак",
                      "en": "fuel tank",
                      "he": "מכל דלק"
                    }
                  },
                  {
                    "raw": "tanken",
                    "word": "tanken",
                    "withArticle": "tanken",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "заправляться",
                      "en": "to refuel / fill up",
                      "he": "לתדלק"
                    }
                  }
                ]
              },
              {
                "id": "de-auto-m1-l2",
                "speedMultiplier": 0.94,
                "spawnIntervalMs": 2700,
                "titles": {
                  "ru": "Салон и управление",
                  "en": "Cabin & Controls",
                  "he": "תא נהג והיגוי"
                },
                "descriptions": {
                  "ru": "Руль, педали, ремень безопасности и аптечка (12 слов).",
                  "en": "Steering wheel, pedals, seatbelt & first-aid kit (12 words).",
                  "he": "הגה, דוושות, חגורת בטיחות וערכת עזרה ראשונה (12 מילים)."
                },
                "words": [
                  {
                    "raw": "das Lenkrad, ¨-er",
                    "word": "Lenkrad",
                    "withArticle": "das Lenkrad",
                    "article": "das",
                    "plural": "¨-er",
                    "translations": {
                      "ru": "руль",
                      "en": "steering wheel",
                      "he": "הגה"
                    }
                  },
                  {
                    "raw": "das Gaspedal, -e",
                    "word": "Gaspedal",
                    "withArticle": "das Gaspedal",
                    "article": "das",
                    "plural": "-e",
                    "translations": {
                      "ru": "педаль газа",
                      "en": "accelerator / gas pedal",
                      "he": "דוושת גז"
                    }
                  },
                  {
                    "raw": "die Bremse, -n",
                    "word": "Bremse",
                    "withArticle": "die Bremse",
                    "article": "die",
                    "plural": "-n",
                    "translations": {
                      "ru": "тормоз",
                      "en": "brake",
                      "he": "בלם (ברקס)"
                    }
                  },
                  {
                    "raw": "die Kupplung, -en",
                    "word": "Kupplung",
                    "withArticle": "die Kupplung",
                    "article": "die",
                    "plural": "-en",
                    "translations": {
                      "ru": "сцепление",
                      "en": "clutch",
                      "he": "מצמד (קלאץ׳)"
                    }
                  },
                  {
                    "raw": "der Schalthebel, -",
                    "word": "Schalthebel",
                    "withArticle": "der Schalthebel",
                    "article": "der",
                    "plural": "-",
                    "translations": {
                      "ru": "рычаг переключения передач",
                      "en": "gearshift / gear lever",
                      "he": "ידית הילוכים"
                    }
                  },
                  {
                    "raw": "der Sicherheitsgurt, -e",
                    "word": "Sicherheitsgurt",
                    "withArticle": "der Sicherheitsgurt",
                    "article": "der",
                    "plural": "-e",
                    "translations": {
                      "ru": "ремень безопасности",
                      "en": "seatbelt",
                      "he": "חגורת בטיחות"
                    }
                  },
                  {
                    "raw": "der Kindersitz, -e",
                    "word": "Kindersitz",
                    "withArticle": "der Kindersitz",
                    "article": "der",
                    "plural": "-e",
                    "translations": {
                      "ru": "детское кресло",
                      "en": "child car seat",
                      "he": "מושב בטיחות לילדים"
                    }
                  },
                  {
                    "raw": "das Panndreieck, -e",
                    "word": "Panndreieck",
                    "withArticle": "das Panndreieck",
                    "article": "das",
                    "plural": "-e",
                    "translations": {
                      "ru": "аварийный знак (треугольник)",
                      "en": "warning triangle",
                      "he": "משולש אזהרה"
                    }
                  },
                  {
                    "raw": "der Erste-Hilfe-Koffer, -",
                    "word": "Erste-Hilfe-Koffer",
                    "withArticle": "der Erste-Hilfe-Koffer",
                    "article": "der",
                    "plural": "-",
                    "translations": {
                      "ru": "аптечка первой помощи",
                      "en": "first-aid kit",
                      "he": "ערכת עזרה ראשונה"
                    }
                  },
                  {
                    "raw": "der Wagenheber, -",
                    "word": "Wagenheber",
                    "withArticle": "der Wagenheber",
                    "article": "der",
                    "plural": "-",
                    "translations": {
                      "ru": "домкрат",
                      "en": "car jack",
                      "he": "מגבה (ג׳ק לרכב)"
                    }
                  },
                  {
                    "raw": "der Ölstand, Sg.",
                    "word": "Ölstand",
                    "withArticle": "der Ölstand",
                    "article": "der",
                    "plural": "Sg.",
                    "translations": {
                      "ru": "уровень масла",
                      "en": "oil level",
                      "he": "מפלס שמן"
                    }
                  },
                  {
                    "raw": "das Benzin, Sg.",
                    "word": "Benzin",
                    "withArticle": "das Benzin",
                    "article": "das",
                    "plural": "Sg.",
                    "translations": {
                      "ru": "бензин",
                      "en": "gasoline / petrol",
                      "he": "בנזין"
                    }
                  }
                ]
              },
              {
                "id": "de-auto-m1-l3",
                "speedMultiplier": 0.96,
                "spawnIntervalMs": 2650,
                "titles": {
                  "ru": "Отпуск и автопутешествие",
                  "en": "Vacation & Road Trip",
                  "he": "חופשה ונסיעות"
                },
                "descriptions": {
                  "ru": "Планирование поездки, зоны отдыха и очереди на трассе (12 слов).",
                  "en": "Trip planning, highway rest stops & holiday queues (12 words).",
                  "he": "תכנון חופשה, תחנות התרעננות ותורים בכביש (12 מילים)."
                },
                "words": [
                  {
                    "raw": "der Diesel, Sg.",
                    "word": "Diesel",
                    "withArticle": "der Diesel",
                    "article": "der",
                    "plural": "Sg.",
                    "translations": {
                      "ru": "дизель",
                      "en": "diesel fuel",
                      "he": "סולר (דיזל)"
                    }
                  },
                  {
                    "raw": "der Strandurlaub, -e",
                    "word": "Strandurlaub",
                    "withArticle": "der Strandurlaub",
                    "article": "der",
                    "plural": "-e",
                    "translations": {
                      "ru": "пляжный отпуск",
                      "en": "beach vacation",
                      "he": "חופשת חוף"
                    }
                  },
                  {
                    "raw": "der Freizeitpark, -s",
                    "word": "Freizeitpark",
                    "withArticle": "der Freizeitpark",
                    "article": "der",
                    "plural": "-s",
                    "translations": {
                      "ru": "парк развлечений",
                      "en": "amusement / theme park",
                      "he": "פארק שעשועים"
                    }
                  },
                  {
                    "raw": "die Urlaubsplanung, -en",
                    "word": "Urlaubsplanung",
                    "withArticle": "die Urlaubsplanung",
                    "article": "die",
                    "plural": "-en",
                    "translations": {
                      "ru": "планирование отпуска",
                      "en": "vacation planning",
                      "he": "תכנון חופשה"
                    }
                  },
                  {
                    "raw": "die Gruppenreise, -n",
                    "word": "Gruppenreise",
                    "withArticle": "die Gruppenreise",
                    "article": "die",
                    "plural": "-n",
                    "translations": {
                      "ru": "групповая поездка",
                      "en": "group trip / tour",
                      "he": "טיול קבוצתי"
                    }
                  },
                  {
                    "raw": "die Städtereise, -n",
                    "word": "Städtereise",
                    "withArticle": "die Städtereise",
                    "article": "die",
                    "plural": "-n",
                    "translations": {
                      "ru": "поездка по городам",
                      "en": "city break / city tour",
                      "he": "טיול ערים"
                    }
                  },
                  {
                    "raw": "die Kreuzfahrt, -en",
                    "word": "Kreuzfahrt",
                    "withArticle": "die Kreuzfahrt",
                    "article": "die",
                    "plural": "-en",
                    "translations": {
                      "ru": "круиз",
                      "en": "cruise",
                      "he": "שיט תענוגות (קרוז)"
                    }
                  },
                  {
                    "raw": "die Abwechslung, -en",
                    "word": "Abwechslung",
                    "withArticle": "die Abwechslung",
                    "article": "die",
                    "plural": "-en",
                    "translations": {
                      "ru": "разнообразие, смена впечатлений",
                      "en": "variety, change of scenery",
                      "he": "גיוון, שינוי אווירה"
                    }
                  },
                  {
                    "raw": "der Ferienbeginn, Sg.",
                    "word": "Ferienbeginn",
                    "withArticle": "der Ferienbeginn",
                    "article": "der",
                    "plural": "Sg.",
                    "translations": {
                      "ru": "начало каникул / отпуска",
                      "en": "start of holidays",
                      "he": "תחילת החופשה"
                    }
                  },
                  {
                    "raw": "die Raststätte, -n",
                    "word": "Raststätte",
                    "withArticle": "die Raststätte",
                    "article": "die",
                    "plural": "-n",
                    "translations": {
                      "ru": "придорожный ресторан / зона отдыха",
                      "en": "highway rest stop / service area",
                      "he": "תחנת רענון (בכביש מהיר)"
                    }
                  },
                  {
                    "raw": "die Warteschlange, -n",
                    "word": "Warteschlange",
                    "withArticle": "die Warteschlange",
                    "article": "die",
                    "plural": "-n",
                    "translations": {
                      "ru": "очередь",
                      "en": "queue, waiting line",
                      "he": "תור"
                    }
                  },
                  {
                    "raw": "etw. ist überfüllt / überfüllt sein",
                    "word": "überfüllt",
                    "withArticle": "überfüllt sein",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "что-то переполнено / быть переполненным",
                      "en": "to be overcrowded",
                      "he": "צפוף מאוד / עמוס לעייפה"
                    }
                  }
                ]
              },
              {
                "id": "de-auto-m1-boss",
                "isBoss": true,
                "speedMultiplier": 1.04,
                "spawnIntervalMs": 2500,
                "titles": {
                  "ru": "👹 Босс-урок: Устройство авто",
                  "en": "👹 Boss Review: Car & Trip",
                  "he": "👹 שלב בוס: סיכום רכב ונסיעה"
                },
                "descriptions": {
                  "ru": "Авто-микс из предыдущих 3 уроков с упором на ваши ошибки и слова со звёздочкой ⭐!",
                  "en": "Dynamic boss mix from the last 3 lessons, prioritizing your mistakes & ⭐ pinned words!",
                  "he": "מיקס בוס מ-3 השלבים הקודמים עם דגש על טעויות ומילים מסומנות ב-⭐!"
                },
                "words": []
              }
            ]
          },
          {
            "id": "de-auto-m2",
            "titles": {
              "ru": "Модуль 2: Автобан, ДТП и страховка",
              "en": "Module 2: Autobahn, Accidents & Insurance",
              "he": "מודול 2: אוטובאן, תאונות וביטוח"
            },
            "lessons": [
              {
                "id": "de-auto-m2-l1",
                "speedMultiplier": 0.96,
                "spawnIntervalMs": 2650,
                "titles": {
                  "ru": "Автобан и объезд",
                  "en": "Highway & Detours",
                  "he": "אוטובאן ומעקפים"
                },
                "descriptions": {
                  "ru": "Полосы движения, съезды, дорожные работы и пробки (12 слов).",
                  "en": "Lanes, highway exits, roadworks & traffic jams (12 words).",
                  "he": "נתיבים, יציאות, עבודות בכביש ופקקים (12 מילים)."
                },
                "words": [
                  {
                    "raw": "die Fahrbahn, -en",
                    "word": "Fahrbahn",
                    "withArticle": "die Fahrbahn",
                    "article": "die",
                    "plural": "-en",
                    "translations": {
                      "ru": "проезжая часть",
                      "en": "roadway / carriageway",
                      "he": "מסלול נסיעה (כביש)"
                    }
                  },
                  {
                    "raw": "der Fahrstreifen, -",
                    "word": "Fahrstreifen",
                    "withArticle": "der Fahrstreifen",
                    "article": "der",
                    "plural": "-",
                    "translations": {
                      "ru": "полоса движения",
                      "en": "traffic lane",
                      "he": "נתיב נסיעה"
                    }
                  },
                  {
                    "raw": "die Ausfahrt, -en",
                    "word": "Ausfahrt",
                    "withArticle": "die Ausfahrt",
                    "article": "die",
                    "plural": "-en",
                    "translations": {
                      "ru": "съезд (с автобана)",
                      "en": "highway exit",
                      "he": "יציאה (מכביש מהיר)"
                    }
                  },
                  {
                    "raw": "Bauarbeiten, Pl.",
                    "word": "Bauarbeiten",
                    "withArticle": "Bauarbeiten",
                    "article": "Pl.",
                    "plural": "Pl.",
                    "translations": {
                      "ru": "строительные работы",
                      "en": "roadworks / construction work",
                      "he": "עבודות בכביש / בנייה"
                    }
                  },
                  {
                    "raw": "sperren",
                    "word": "sperren",
                    "withArticle": "sperren",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "перекрывать, закрывать",
                      "en": "to block / close off",
                      "he": "לחסום, לסגור"
                    }
                  },
                  {
                    "raw": "die Umleitung, -en",
                    "word": "Umleitung",
                    "withArticle": "die Umleitung",
                    "article": "die",
                    "plural": "-en",
                    "translations": {
                      "ru": "объезд",
                      "en": "detour / diversion",
                      "he": "מעקף (דרך חלופית)"
                    }
                  },
                  {
                    "raw": "umleiten",
                    "word": "umleiten",
                    "withArticle": "umleiten",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "направлять в объезд",
                      "en": "to divert / redirect traffic",
                      "he": "להפנות למעקף"
                    }
                  },
                  {
                    "raw": "ausschildern",
                    "word": "ausschildern",
                    "withArticle": "ausschildern",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "обозначать указателями",
                      "en": "to signpost",
                      "he": "לשלט (להציב שלטי הכוונה)"
                    }
                  },
                  {
                    "raw": "der Gegenstand, ¨-e",
                    "word": "Gegenstand",
                    "withArticle": "der Gegenstand",
                    "article": "der",
                    "plural": "¨-e",
                    "translations": {
                      "ru": "предмет",
                      "en": "object, item on road",
                      "he": "חפץ, עצם"
                    }
                  },
                  {
                    "raw": "der/die Geisterfahrer/in, -/nen",
                    "word": "Geisterfahrer",
                    "withArticle": "der Geisterfahrer",
                    "article": "der/die",
                    "plural": "-/nen",
                    "translations": {
                      "ru": "водитель, едущий против движения",
                      "en": "wrong-way driver",
                      "he": "נהג הנוסע נגד כיוון התנועה"
                    }
                  },
                  {
                    "raw": "das Verkehrschaos, Sg.",
                    "word": "Verkehrschaos",
                    "withArticle": "das Verkehrschaos",
                    "article": "das",
                    "plural": "Sg.",
                    "translations": {
                      "ru": "транспортный хаос",
                      "en": "traffic chaos / gridlock",
                      "he": "כאוס תחבורתי (פקקי ענק)"
                    }
                  },
                  {
                    "raw": "vorsichtig",
                    "word": "vorsichtig",
                    "withArticle": "vorsichtig",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "осторожный",
                      "en": "careful, cautious",
                      "he": "זהיר"
                    }
                  }
                ]
              },
              {
                "id": "de-auto-m2-l2",
                "speedMultiplier": 1.0,
                "spawnIntervalMs": 2600,
                "titles": {
                  "ru": "Поломки и ДТП",
                  "en": "Breakdowns & Accidents",
                  "he": "תקלות ותאונות"
                },
                "descriptions": {
                  "ru": "Свидетели, эвакуатор, ущерб и виновники аварии (13 слов).",
                  "en": "Witnesses, towing, damage & accident reports (13 words).",
                  "he": "עדים, גרירה, נזק ודיווחי תאונה (13 מילים)."
                },
                "words": [
                  {
                    "raw": "der Bahnverkehr, Sg.",
                    "word": "Bahnverkehr",
                    "withArticle": "der Bahnverkehr",
                    "article": "der",
                    "plural": "Sg.",
                    "translations": {
                      "ru": "железнодорожное движение",
                      "en": "rail traffic",
                      "he": "תנועת רכבות"
                    }
                  },
                  {
                    "raw": "der Schienenersatzverkehr, Sg.",
                    "word": "Schienenersatzverkehr",
                    "withArticle": "der Schienenersatzverkehr",
                    "article": "der",
                    "plural": "Sg.",
                    "translations": {
                      "ru": "замена рельсового транспорта",
                      "en": "rail replacement bus service",
                      "he": "שירות אוטובוסים חלופי לרכבת"
                    }
                  },
                  {
                    "raw": "die Durchsage, -n",
                    "word": "Durchsage",
                    "withArticle": "die Durchsage",
                    "article": "die",
                    "plural": "-n",
                    "translations": {
                      "ru": "объявление (по громкой связи)",
                      "en": "announcement (over PA / radio)",
                      "he": "הודעה (בכריזה)"
                    }
                  },
                  {
                    "raw": "die Demonstration, -en",
                    "word": "Demonstration",
                    "withArticle": "die Demonstration",
                    "article": "die",
                    "plural": "-en",
                    "translations": {
                      "ru": "демонстрация, митинг",
                      "en": "demonstration, rally",
                      "he": "הפגנה"
                    }
                  },
                  {
                    "raw": "streiken",
                    "word": "streiken",
                    "withArticle": "streiken",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "бастовать",
                      "en": "to go on strike",
                      "he": "לשבות"
                    }
                  },
                  {
                    "raw": "die Zeitungsmeldung, -en",
                    "word": "Zeitungsmeldung",
                    "withArticle": "die Zeitungsmeldung",
                    "article": "die",
                    "plural": "-en",
                    "translations": {
                      "ru": "газетное сообщение",
                      "en": "newspaper report",
                      "he": "ידיעה בעיתון"
                    }
                  },
                  {
                    "raw": "der/die Zeuge/Zeugin, -n/-nen",
                    "word": "Zeuge",
                    "withArticle": "der Zeuge",
                    "article": "der/die",
                    "plural": "-n/-nen",
                    "translations": {
                      "ru": "свидетель / свидетельница",
                      "en": "witness",
                      "he": "עד / עדה"
                    }
                  },
                  {
                    "raw": "befragen",
                    "word": "befragen",
                    "withArticle": "befragen",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "опрашивать",
                      "en": "to question, interview",
                      "he": "לתשאל, לחקור"
                    }
                  },
                  {
                    "raw": "abschleppen",
                    "word": "abschleppen",
                    "withArticle": "abschleppen",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "буксировать",
                      "en": "to tow away",
                      "he": "לגרור (רכב)"
                    }
                  },
                  {
                    "raw": "der-/das-/dieselbe, dieselben",
                    "word": "dieselbe",
                    "withArticle": "dieselbe",
                    "article": "Pron.",
                    "plural": "dieselben",
                    "translations": {
                      "ru": "тот же / та же / то же, те же",
                      "en": "the same",
                      "he": "אותו הדבר / אותם הדברים"
                    }
                  },
                  {
                    "raw": "außerdem",
                    "word": "außerdem",
                    "withArticle": "außerdem",
                    "article": "Adv.",
                    "plural": "",
                    "translations": {
                      "ru": "кроме того",
                      "en": "besides, in addition",
                      "he": "חוץ מזה, בנוסף לכך"
                    }
                  },
                  {
                    "raw": "das Unwetter, -",
                    "word": "Unwetter",
                    "withArticle": "das Unwetter",
                    "article": "das",
                    "plural": "-",
                    "translations": {
                      "ru": "непогода, шторм",
                      "en": "severe storm / bad weather",
                      "he": "מזג אוויר סוער, סופה"
                    }
                  }
                ]
              },
              {
                "id": "de-auto-m2-l3",
                "speedMultiplier": 1.0,
                "spawnIntervalMs": 2600,
                "titles": {
                  "ru": "Страховка и закон",
                  "en": "Insurance & Law",
                  "he": "ביטוח וחוק"
                },
                "descriptions": {
                  "ru": "ОСАГО, КАСКО, налог и документы (авто-замедление для длинных слов!).",
                  "en": "Liability & comprehensive insurance, vehicle tax & documents.",
                  "he": "ביטוח חובה ומקיף, מס רכב ומסמכים."
                },
                "words": [
                  {
                    "raw": "Fahrzeugpapiere, Pl.",
                    "word": "Fahrzeugpapiere",
                    "withArticle": "Fahrzeugpapiere",
                    "article": "Pl.",
                    "plural": "Pl.",
                    "translations": {
                      "ru": "документы на автомобиль",
                      "en": "vehicle registration documents",
                      "he": "מסמכי רכב (רישיון רכב)"
                    }
                  },
                  {
                    "raw": "das Gesetz, -e",
                    "word": "Gesetz",
                    "withArticle": "das Gesetz",
                    "article": "das",
                    "plural": "-e",
                    "translations": {
                      "ru": "закон",
                      "en": "law, act",
                      "he": "חוק"
                    }
                  },
                  {
                    "raw": "gesetzlich vorgeschrieben",
                    "word": "gesetzlich vorgeschrieben",
                    "withArticle": "gesetzlich vorgeschrieben",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "установленный законом",
                      "en": "legally required / mandatory by law",
                      "he": "קבוע בחוק (חובה על פי חוק)"
                    }
                  },
                  {
                    "raw": "die Kfz-Steuer, -n",
                    "word": "Kfz-Steuer",
                    "withArticle": "die Kfz-Steuer",
                    "article": "die",
                    "plural": "-n",
                    "translations": {
                      "ru": "налог на транспортное средство",
                      "en": "motor vehicle tax",
                      "he": "מס רכב (אגרת רישוי)"
                    }
                  },
                  {
                    "raw": "die Kfz-Haftpflichtversicherung, -en",
                    "word": "Kfz-Haftpflichtversicherung",
                    "withArticle": "die Kfz-Haftpflichtversicherung",
                    "article": "die",
                    "plural": "-en",
                    "translations": {
                      "ru": "обязательное страхование автогражданской ответственности (ОСАГО)",
                      "en": "mandatory car liability insurance",
                      "he": "ביטוח חובה וצד ג׳ לרכב"
                    }
                  },
                  {
                    "raw": "die Teilkaskoversicherung, -en",
                    "word": "Teilkaskoversicherung",
                    "withArticle": "die Teilkaskoversicherung",
                    "article": "die",
                    "plural": "-en",
                    "translations": {
                      "ru": "частичное каско",
                      "en": "partial comprehensive car insurance",
                      "he": "ביטוח מקיף חלקי"
                    }
                  },
                  {
                    "raw": "die Vollkaskoversicherung, -en",
                    "word": "Vollkaskoversicherung",
                    "withArticle": "die Vollkaskoversicherung",
                    "article": "die",
                    "plural": "-en",
                    "translations": {
                      "ru": "полное каско",
                      "en": "full comprehensive car insurance",
                      "he": "ביטוח מקיף מלא"
                    }
                  },
                  {
                    "raw": "das Unfallopfer, -",
                    "word": "Unfallopfer",
                    "withArticle": "das Unfallopfer",
                    "article": "das",
                    "plural": "-",
                    "translations": {
                      "ru": "жертва аварии",
                      "en": "accident victim",
                      "he": "נפגע תאונה"
                    }
                  },
                  {
                    "raw": "der/die Verletzte, -n",
                    "word": "Verletzte",
                    "withArticle": "der Verletzte",
                    "article": "der/die",
                    "plural": "-n",
                    "translations": {
                      "ru": "пострадавший / пострадавшая",
                      "en": "injured person",
                      "he": "פצוע / פצועה"
                    }
                  },
                  {
                    "raw": "der Personenschaden, ¨-",
                    "word": "Personenschaden",
                    "withArticle": "der Personenschaden",
                    "article": "der",
                    "plural": "¨-",
                    "translations": {
                      "ru": "ущерб здоровью / телесные повреждения",
                      "en": "personal injury",
                      "he": "נזקי גוף"
                    }
                  },
                  {
                    "raw": "verursachen",
                    "word": "verursachen",
                    "withArticle": "verursachen",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "вызывать, причинять",
                      "en": "to cause",
                      "he": "לגרום ל-"
                    }
                  },
                  {
                    "raw": "der Diebstahl, Sg.",
                    "word": "Diebstahl",
                    "withArticle": "der Diebstahl",
                    "article": "der",
                    "plural": "Sg.",
                    "translations": {
                      "ru": "кража",
                      "en": "theft",
                      "he": "גניבה"
                    }
                  },
                  {
                    "raw": "der Brand, ¨-e",
                    "word": "Brand",
                    "withArticle": "der Brand",
                    "article": "der",
                    "plural": "¨-e",
                    "translations": {
                      "ru": "пожар",
                      "en": "fire",
                      "he": "שריפה"
                    }
                  }
                ]
              },
              {
                "id": "de-auto-m2-boss",
                "isBoss": true,
                "speedMultiplier": 1.04,
                "spawnIntervalMs": 2500,
                "titles": {
                  "ru": "👹 Босс-урок: Экзамен Автобана",
                  "en": "👹 Boss Review: Autobahn Exam",
                  "he": "👹 שלב בוס: מבחן אוטובאן"
                },
                "descriptions": {
                  "ru": "Финальная проверка по автобану, ДТП и страховке (с приоритетом сложных и ⭐ слов)!",
                  "en": "Final boss review covering highway rules, incidents & car insurance!",
                  "he": "סיכום בוס של חוקי דרך, תאונות וביטוח רכב!"
                },
                "words": []
              }
            ]
          }
        ]
      },
      {
        "id": "de-base",
        "targetLang": "de",
        "source": "official",
        "icon": "🌱",
        "levelTag": "A1–A2",
        "titles": {
          "ru": "Базовый курс (A1 → A2)",
          "en": "Core German (A1 → A2)",
          "he": "קורס בסיסי בגרמנית (A1 → A2)"
        },
        "descriptions": {
          "ru": "Самые нужные слова для жизни в Германии: дом, город, покупки, время и общение.",
          "en": "Essential everyday German vocabulary: home, city, shopping, work & daily life.",
          "he": "אוצר המילים החיוני ביותר לחיי היומיום בגרמנית: בית, עיר, קניות ותקשורת."
        },
        "modules": [
          {
            "id": "de-base-m1",
            "titles": {
              "ru": "Модуль 1: Дом, город и покупки",
              "en": "Module 1: Home, City & Shopping",
              "he": "מודול 1: בית, עיר וקניות"
            },
            "lessons": [
              {
                "id": "de-base-m1-l1",
                "speedMultiplier": 0.86,
                "spawnIntervalMs": 2850,
                "titles": {
                  "ru": "Дом и утро",
                  "en": "Home & Morning",
                  "he": "בית ובוקר"
                },
                "descriptions": {
                  "ru": "Квартира, ключи, завтрак и начало дня (11 слов).",
                  "en": "Apartment, keys, breakfast & starting the day (11 words).",
                  "he": "דירה, מפתחות, ארוחת בוקר והתחלת היום (11 מילים)."
                },
                "words": [
                  {
                    "raw": "die Wohnung, -en",
                    "word": "Wohnung",
                    "withArticle": "die Wohnung",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "квартира",
                      "en": "apartment",
                      "he": "דירה"
                    }
                  },
                  {
                    "raw": "der Schlüssel, -",
                    "word": "Schlüssel",
                    "withArticle": "der Schlüssel",
                    "article": "der",
                    "plural": "",
                    "translations": {
                      "ru": "ключ",
                      "en": "key",
                      "he": "מפתח"
                    }
                  },
                  {
                    "raw": "das Frühstück, -e",
                    "word": "Frühstück",
                    "withArticle": "das Frühstück",
                    "article": "das",
                    "plural": "",
                    "translations": {
                      "ru": "завтрак",
                      "en": "breakfast",
                      "he": "ארוחת בוקר"
                    }
                  },
                  {
                    "raw": "der Kühlschrank, ¨-e",
                    "word": "Kühlschrank",
                    "withArticle": "der Kühlschrank",
                    "article": "der",
                    "plural": "",
                    "translations": {
                      "ru": "холодильник",
                      "en": "refrigerator",
                      "he": "מקרר"
                    }
                  },
                  {
                    "raw": "das Fenster, -",
                    "word": "Fenster",
                    "withArticle": "das Fenster",
                    "article": "das",
                    "plural": "",
                    "translations": {
                      "ru": "окно",
                      "en": "window",
                      "he": "חלון"
                    }
                  },
                  {
                    "raw": "die Treppe, -n",
                    "word": "Treppe",
                    "withArticle": "die Treppe",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "лестница",
                      "en": "stairs",
                      "he": "מדרגות"
                    }
                  },
                  {
                    "raw": "aufwachen",
                    "word": "aufwachen",
                    "withArticle": "aufwachen",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "просыпаться",
                      "en": "to wake up",
                      "he": "להתעורר"
                    }
                  },
                  {
                    "raw": "kochen",
                    "word": "kochen",
                    "withArticle": "kochen",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "готовить еду",
                      "en": "to cook",
                      "he": "לבשל"
                    }
                  },
                  {
                    "raw": "aufräumen",
                    "word": "aufräumen",
                    "withArticle": "aufräumen",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "убирать, наводить порядок",
                      "en": "to tidy up",
                      "he": "לסדר / לנקות"
                    }
                  },
                  {
                    "raw": "gemütlich",
                    "word": "gemütlich",
                    "withArticle": "gemütlich",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "уютный",
                      "en": "cozy, comfortable",
                      "he": "נעים / ביתי"
                    }
                  },
                  {
                    "raw": "der Nachbar, -n",
                    "word": "Nachbar",
                    "withArticle": "der Nachbar",
                    "article": "der",
                    "plural": "",
                    "translations": {
                      "ru": "сосед",
                      "en": "neighbor",
                      "he": "שכן"
                    }
                  }
                ]
              },
              {
                "id": "de-base-m1-l2",
                "speedMultiplier": 0.9,
                "spawnIntervalMs": 2750,
                "titles": {
                  "ru": "В городе и транспорте",
                  "en": "City & Transit",
                  "he": "בעיר ובתחבורה"
                },
                "descriptions": {
                  "ru": "Вокзал, пересадка, расписание и ориентирование (11 слов).",
                  "en": "Train station, transfers, timetable & getting around (11 words).",
                  "he": "תחנת רכבת, החלפה, לוח זמנים והתמצאות (11 מילים)."
                },
                "words": [
                  {
                    "raw": "der Bahnhof, ¨-e",
                    "word": "Bahnhof",
                    "withArticle": "der Bahnhof",
                    "article": "der",
                    "plural": "",
                    "translations": {
                      "ru": "вокзал",
                      "en": "train station",
                      "he": "תחנת רכבת"
                    }
                  },
                  {
                    "raw": "die Haltestelle, -n",
                    "word": "Haltestelle",
                    "withArticle": "die Haltestelle",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "остановка",
                      "en": "bus / tram stop",
                      "he": "תחנת אוטובוס"
                    }
                  },
                  {
                    "raw": "die Fahrkarte, -n",
                    "word": "Fahrkarte",
                    "withArticle": "die Fahrkarte",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "билет на проезд",
                      "en": "transit ticket",
                      "he": "כרטיס נסיעה"
                    }
                  },
                  {
                    "raw": "umsteigen",
                    "word": "umsteigen",
                    "withArticle": "umsteigen",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "делать пересадку",
                      "en": "to transfer / change trains",
                      "he": "להחליף קו"
                    }
                  },
                  {
                    "raw": "die Verspätung, -en",
                    "word": "Verspätung",
                    "withArticle": "die Verspätung",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "опоздание, задержка",
                      "en": "delay",
                      "he": "איחור / עיכוב"
                    }
                  },
                  {
                    "raw": "das Rathaus, ¨-er",
                    "word": "Rathaus",
                    "withArticle": "das Rathaus",
                    "article": "das",
                    "plural": "",
                    "translations": {
                      "ru": "ратуша, мэрия",
                      "en": "town hall",
                      "he": "עירייה"
                    }
                  },
                  {
                    "raw": "die Kreuzung, -en",
                    "word": "Kreuzung",
                    "withArticle": "die Kreuzung",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "перекрёсток",
                      "en": "intersection / crossroads",
                      "he": "צומת"
                    }
                  },
                  {
                    "raw": "geradeaus",
                    "word": "geradeaus",
                    "withArticle": "geradeaus",
                    "article": "Adv.",
                    "plural": "",
                    "translations": {
                      "ru": "прямо",
                      "en": "straight ahead",
                      "he": "ישר"
                    }
                  },
                  {
                    "raw": "erreichen",
                    "word": "erreichen",
                    "withArticle": "erreichen",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "добираться, достигать",
                      "en": "to reach",
                      "he": "להגיע / להשיג"
                    }
                  },
                  {
                    "raw": "pünktlich",
                    "word": "pünktlich",
                    "withArticle": "pünktlich",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "пунктуальный, вовремя",
                      "en": "punctual, on time",
                      "he": "דייקן / בזמן"
                    }
                  },
                  {
                    "raw": "der Ausgang, ¨-e",
                    "word": "Ausgang",
                    "withArticle": "der Ausgang",
                    "article": "der",
                    "plural": "",
                    "translations": {
                      "ru": "выход",
                      "en": "exit",
                      "he": "יציאה"
                    }
                  }
                ]
              },
              {
                "id": "de-base-m1-l3",
                "speedMultiplier": 0.92,
                "spawnIntervalMs": 2700,
                "titles": {
                  "ru": "Покупки и кафе",
                  "en": "Shopping & Café",
                  "he": "קניות ובית קפה"
                },
                "descriptions": {
                  "ru": "Счёт, скидка, наличные, заказ и примерочная (11 слов).",
                  "en": "Bill, discount, receipt, ordering & payment (11 words).",
                  "he": "חשבון, הנחה, קבלה, הזמנה ותשלום (11 מילים)."
                },
                "words": [
                  {
                    "raw": "die Rechnung, -en",
                    "word": "Rechnung",
                    "withArticle": "die Rechnung",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "счёт (на оплату)",
                      "en": "bill, invoice",
                      "he": "חשבון / חשבונית"
                    }
                  },
                  {
                    "raw": "das Angebot, -e",
                    "word": "Angebot",
                    "withArticle": "das Angebot",
                    "article": "das",
                    "plural": "",
                    "translations": {
                      "ru": "спецпредложение, скидка",
                      "en": "special offer",
                      "he": "מבצע / הצעה"
                    }
                  },
                  {
                    "raw": "der Kassenbon, -s",
                    "word": "Kassenbon",
                    "withArticle": "der Kassenbon",
                    "article": "der",
                    "plural": "",
                    "translations": {
                      "ru": "кассовый чек",
                      "en": "receipt",
                      "he": "קבלה"
                    }
                  },
                  {
                    "raw": "das Bargeld, Sg.",
                    "word": "Bargeld",
                    "withArticle": "das Bargeld",
                    "article": "das",
                    "plural": "",
                    "translations": {
                      "ru": "наличные деньги",
                      "en": "cash",
                      "he": "מזומן"
                    }
                  },
                  {
                    "raw": "bestellen",
                    "word": "bestellen",
                    "withArticle": "bestellen",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "заказывать",
                      "en": "to order",
                      "he": "להזמין"
                    }
                  },
                  {
                    "raw": "empfehlen",
                    "word": "empfehlen",
                    "withArticle": "empfehlen",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "рекомендовать",
                      "en": "to recommend",
                      "he": "להמליץ"
                    }
                  },
                  {
                    "raw": "probieren",
                    "word": "probieren",
                    "withArticle": "probieren",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "пробовать",
                      "en": "to try / taste",
                      "he": "לטעום / לנסות"
                    }
                  },
                  {
                    "raw": "preiswert",
                    "word": "preiswert",
                    "withArticle": "preiswert",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "выгодный по цене",
                      "en": "good value, affordable",
                      "he": "משתלם"
                    }
                  },
                  {
                    "raw": "die Bäckerei, -en",
                    "word": "Bäckerei",
                    "withArticle": "die Bäckerei",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "пекарня, булочная",
                      "en": "bakery",
                      "he": "מאפייה"
                    }
                  },
                  {
                    "raw": "das Trinkgeld, -er",
                    "word": "Trinkgeld",
                    "withArticle": "das Trinkgeld",
                    "article": "das",
                    "plural": "",
                    "translations": {
                      "ru": "чаевые",
                      "en": "tip / gratuity",
                      "he": "טיפ / תשר"
                    }
                  },
                  {
                    "raw": "geöffnet",
                    "word": "geöffnet",
                    "withArticle": "geöffnet",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "открыто",
                      "en": "open",
                      "he": "פתוח"
                    }
                  }
                ]
              },
              {
                "id": "de-base-m1-boss",
                "isBoss": true,
                "speedMultiplier": 1.04,
                "spawnIntervalMs": 2500,
                "titles": {
                  "ru": "👹 Босс-урок: Базовый A1–A2",
                  "en": "👹 Boss Review: Everyday A1–A2",
                  "he": "👹 שלב בוס: חזרה יומיומית A1–A2"
                },
                "descriptions": {
                  "ru": "Проверка всех 3 базовых уроков: дом, город и покупки!",
                  "en": "Review mix across Home, City & Shopping!",
                  "he": "סיכום של בית, עיר וקניות!"
                },
                "words": []
              }
            ]
          }
        ]
      },
      {
        "id": "de-it",
        "targetLang": "de",
        "source": "official",
        "icon": "💻",
        "levelTag": "B1–B2",
        "titles": {
          "ru": "IT и разработка",
          "en": "IT & Software Dev",
          "he": "הייטק ופיתוח תוכנה"
        },
        "descriptions": {
          "ru": "Немецкий для разработчиков: код, базы данных, облако, безопасность и релизы.",
          "en": "German for software engineers: APIs, databases, cloud deployment & security.",
          "he": "גרמנית למפתחים והייטק: ממשקים, מסדי נתונים, ענן ואבטחת מידע."
        },
        "modules": [
          {
            "id": "de-it-m1",
            "titles": {
              "ru": "Модуль 1: Архитектура, код и деплой",
              "en": "Module 1: Code, Cloud & Security",
              "he": "מודול 1: קוד, ענן ואבטחה"
            },
            "lessons": [
              {
                "id": "de-it-m1-l1",
                "speedMultiplier": 0.94,
                "spawnIntervalMs": 2700,
                "titles": {
                  "ru": "Код и базы данных",
                  "en": "Code & Databases",
                  "he": "קוד ומסדי נתונים"
                },
                "descriptions": {
                  "ru": "Интерфейсы, запросы и отладка (10 слов).",
                  "en": "Interfaces, queries & debugging (10 words).",
                  "he": "ממשקים, שאילתות וניפוי שגיאות (10 מילים)."
                },
                "words": [
                  {
                    "raw": "die Schnittstelle, -n",
                    "word": "Schnittstelle",
                    "withArticle": "die Schnittstelle",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "интерфейс (API)",
                      "en": "interface (API)",
                      "he": "ממשק (API)"
                    }
                  },
                  {
                    "raw": "die Datenbank, -en",
                    "word": "Datenbank",
                    "withArticle": "die Datenbank",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "база данных",
                      "en": "database",
                      "he": "מסד נתונים"
                    }
                  },
                  {
                    "raw": "der Quellcode, -s",
                    "word": "Quellcode",
                    "withArticle": "der Quellcode",
                    "article": "der",
                    "plural": "",
                    "translations": {
                      "ru": "исходный код",
                      "en": "source code",
                      "he": "קוד מקור"
                    }
                  },
                  {
                    "raw": "die Abfrage, -n",
                    "word": "Abfrage",
                    "withArticle": "die Abfrage",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "запрос (query)",
                      "en": "query",
                      "he": "שאילתה"
                    }
                  },
                  {
                    "raw": "entwickeln",
                    "word": "entwickeln",
                    "withArticle": "entwickeln",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "разрабатывать",
                      "en": "to develop",
                      "he": "לפתח"
                    }
                  },
                  {
                    "raw": "beheben",
                    "word": "beheben",
                    "withArticle": "beheben",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "исправлять (баг)",
                      "en": "to fix / resolve",
                      "he": "לתקן (באג)"
                    }
                  },
                  {
                    "raw": "speichern",
                    "word": "speichern",
                    "withArticle": "speichern",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "сохранять",
                      "en": "to save / store",
                      "he": "לשמור"
                    }
                  },
                  {
                    "raw": "die Fehlermeldung, -en",
                    "word": "Fehlermeldung",
                    "withArticle": "die Fehlermeldung",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "сообщение об ошибке",
                      "en": "error message",
                      "he": "הודעת שגיאה"
                    }
                  },
                  {
                    "raw": "die Anwendung, -en",
                    "word": "Anwendung",
                    "withArticle": "die Anwendung",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "приложение",
                      "en": "application",
                      "he": "יישום / אפליקציה"
                    }
                  },
                  {
                    "raw": "zuverlässig",
                    "word": "zuverlässig",
                    "withArticle": "zuverlässig",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "надёжный",
                      "en": "reliable",
                      "he": "אמין"
                    }
                  }
                ]
              },
              {
                "id": "de-it-m1-l2",
                "speedMultiplier": 0.96,
                "spawnIntervalMs": 2650,
                "titles": {
                  "ru": "Серверы и релиз",
                  "en": "Servers & Deployment",
                  "he": "שרתים ופריסה"
                },
                "descriptions": {
                  "ru": "Сборка, нагрузка, обновление и облако (10 слов).",
                  "en": "Build, load, updates & cloud servers (10 words).",
                  "he": "בנייה, עומס, עדכונים ושרתי ענן (10 מילים)."
                },
                "words": [
                  {
                    "raw": "bereitstellen",
                    "word": "bereitstellen",
                    "withArticle": "bereitstellen",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "развёртывать (деплоить)",
                      "en": "to deploy / provision",
                      "he": "לפרוס (Deploy)"
                    }
                  },
                  {
                    "raw": "aktualisieren",
                    "word": "aktualisieren",
                    "withArticle": "aktualisieren",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "обновлять",
                      "en": "to update",
                      "he": "לעדכן"
                    }
                  },
                  {
                    "raw": "die Auslastung, -en",
                    "word": "Auslastung",
                    "withArticle": "die Auslastung",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "нагрузка (системы)",
                      "en": "system load / utilization",
                      "he": "עומס מערכת"
                    }
                  },
                  {
                    "raw": "das Netzwerk, -e",
                    "word": "Netzwerk",
                    "withArticle": "das Netzwerk",
                    "article": "das",
                    "plural": "",
                    "translations": {
                      "ru": "сеть",
                      "en": "network",
                      "he": "רשת"
                    }
                  },
                  {
                    "raw": "die Umgebung, -en",
                    "word": "Umgebung",
                    "withArticle": "die Umgebung",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "окружение, среда",
                      "en": "environment",
                      "he": "סביבת עבודה"
                    }
                  },
                  {
                    "raw": "skalierbar",
                    "word": "skalierbar",
                    "withArticle": "skalierbar",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "масштабируемый",
                      "en": "scalable",
                      "he": "ניתן להרחבה"
                    }
                  },
                  {
                    "raw": "überwachen",
                    "word": "überwachen",
                    "withArticle": "überwachen",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "мониторить",
                      "en": "to monitor",
                      "he": "לנטר"
                    }
                  },
                  {
                    "raw": "die Sicherung, -en",
                    "word": "Sicherung",
                    "withArticle": "die Sicherung",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "резервная копия (бэкап)",
                      "en": "backup",
                      "he": "גיבוי"
                    }
                  },
                  {
                    "raw": "wiederherstellen",
                    "word": "wiederherstellen",
                    "withArticle": "wiederherstellen",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "восстанавливать",
                      "en": "to restore / recover",
                      "he": "לשחזר"
                    }
                  },
                  {
                    "raw": "die Leistung, -en",
                    "word": "Leistung",
                    "withArticle": "die Leistung",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "производительность",
                      "en": "performance",
                      "he": "ביצועים"
                    }
                  }
                ]
              },
              {
                "id": "de-it-m1-l3",
                "speedMultiplier": 0.98,
                "spawnIntervalMs": 2600,
                "titles": {
                  "ru": "Безопасность и команда",
                  "en": "Security & Agile Team",
                  "he": "אבטחה וצוות פיתוח"
                },
                "descriptions": {
                  "ru": "Шифрование, доступ, права и ревью (10 слов).",
                  "en": "Encryption, permissions, requirements & review (10 words).",
                  "he": "הצפנה, הרשאות, דרישות וסקירת קוד (10 מילים)."
                },
                "words": [
                  {
                    "raw": "verschlüsseln",
                    "word": "verschlüsseln",
                    "withArticle": "verschlüsseln",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "шифровать",
                      "en": "to encrypt",
                      "he": "להצפין"
                    }
                  },
                  {
                    "raw": "der Zugriff, -e",
                    "word": "Zugriff",
                    "withArticle": "der Zugriff",
                    "article": "der",
                    "plural": "",
                    "translations": {
                      "ru": "доступ",
                      "en": "access",
                      "he": "גישה"
                    }
                  },
                  {
                    "raw": "die Berechtigung, -en",
                    "word": "Berechtigung",
                    "withArticle": "die Berechtigung",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "разрешение, право доступа",
                      "en": "permission / authorization",
                      "he": "הרשאה"
                    }
                  },
                  {
                    "raw": "die Anforderung, -en",
                    "word": "Anforderung",
                    "withArticle": "die Anforderung",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "требование",
                      "en": "requirement",
                      "he": "דרישה"
                    }
                  },
                  {
                    "raw": "überprüfen",
                    "word": "überprüfen",
                    "withArticle": "überprüfen",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "проверять (код-ревью)",
                      "en": "to review / verify",
                      "he": "לבדוק / לסקור"
                    }
                  },
                  {
                    "raw": "die Besprechung, -en",
                    "word": "Besprechung",
                    "withArticle": "die Besprechung",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "совещание, митинг",
                      "en": "meeting",
                      "he": "פגישה / ישיבה"
                    }
                  },
                  {
                    "raw": "die Lösung, -en",
                    "word": "Lösung",
                    "withArticle": "die Lösung",
                    "article": "die",
                    "plural": "",
                    "translations": {
                      "ru": "решение",
                      "en": "solution",
                      "he": "פתרון"
                    }
                  },
                  {
                    "raw": "das Passwort, ¨-er",
                    "word": "Passwort",
                    "withArticle": "das Passwort",
                    "article": "das",
                    "plural": "",
                    "translations": {
                      "ru": "пароль",
                      "en": "password",
                      "he": "סיסמה"
                    }
                  },
                  {
                    "raw": "verhindern",
                    "word": "verhindern",
                    "withArticle": "verhindern",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "предотвращать",
                      "en": "to prevent",
                      "he": "למנוע"
                    }
                  },
                  {
                    "raw": "erfolgreich",
                    "word": "erfolgreich",
                    "withArticle": "erfolgreich",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "успешный",
                      "en": "successful",
                      "he": "מוצלח"
                    }
                  }
                ]
              },
              {
                "id": "de-it-m1-boss",
                "isBoss": true,
                "speedMultiplier": 1.04,
                "spawnIntervalMs": 2500,
                "titles": {
                  "ru": "👹 Босс-урок: Релиз в продакшен",
                  "en": "👹 Boss Review: Production Release",
                  "he": "👹 שלב בוס: עלייה לפרודקשן"
                },
                "descriptions": {
                  "ru": "Проверка всей немецкой IT-лексики модуля!",
                  "en": "Boss sprint across German IT, Cloud & Security vocabulary!",
                  "he": "סיכום אוצר מילים טכנולוגי בגרמנית!"
                },
                "words": []
              }
            ]
          }
        ]
      }
    ],
    "en": [
      {
        "id": "en-base",
        "targetLang": "en",
        "source": "official",
        "icon": "🌱",
        "levelTag": "A2–B1",
        "titles": {
          "ru": "Базовый курс (A2 → B1)",
          "en": "Core English (A2 → B1)",
          "he": "אנגלית שימושית (A2 → B1)"
        },
        "descriptions": {
          "ru": "Живой современный английский для общения, путешествий и работы.",
          "en": "High-frequency everyday English words for travel, work & fluent conversation.",
          "he": "אוצר מילים מרכזי באנגלית לשיחה שוטפת, נסיעות ועבודה."
        },
        "modules": [
          {
            "id": "en-base-m1",
            "titles": {
              "ru": "Модуль 1: Повседневная жизнь и поездки",
              "en": "Module 1: Daily Life & Travel",
              "he": "מודול 1: חיי יומיום ונסיעות"
            },
            "lessons": [
              {
                "id": "en-base-m1-l1",
                "speedMultiplier": 0.88,
                "spawnIntervalMs": 2800,
                "titles": {
                  "ru": "Путешествия и аэропорт",
                  "en": "Travel & Airport",
                  "he": "נסיעות ושדה תעופה"
                },
                "descriptions": {
                  "ru": "Рейс, багаж, маршрут и бронь (12 слов).",
                  "en": "Flights, luggage, itinerary & booking (12 words).",
                  "he": "טיסה, כבודה, מסלול והזמנה (12 מילים)."
                },
                "words": [
                  {
                    "raw": "departure",
                    "word": "departure",
                    "withArticle": "departure",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "вылет, отправление",
                      "en": "act of leaving on a journey",
                      "he": "המראה / יציאה"
                    }
                  },
                  {
                    "raw": "arrival",
                    "word": "arrival",
                    "withArticle": "arrival",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "прибытие, прилёт",
                      "en": "reaching a destination",
                      "he": "נחיתה / הגעה"
                    }
                  },
                  {
                    "raw": "luggage",
                    "word": "luggage",
                    "withArticle": "luggage",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "багаж",
                      "en": "suitcases and bags",
                      "he": "מזוודות / כבודה"
                    }
                  },
                  {
                    "raw": "boarding",
                    "word": "boarding",
                    "withArticle": "boarding",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "посадка на рейс",
                      "en": "getting onto a plane or ship",
                      "he": "עלייה למטוס"
                    }
                  },
                  {
                    "raw": "destination",
                    "word": "destination",
                    "withArticle": "destination",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "пункт назначения",
                      "en": "place to which someone is going",
                      "he": "יעד"
                    }
                  },
                  {
                    "raw": "itinerary",
                    "word": "itinerary",
                    "withArticle": "itinerary",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "маршрут поездки",
                      "en": "planned route or journey",
                      "he": "מסלול טיול"
                    }
                  },
                  {
                    "raw": "accommodation",
                    "word": "accommodation",
                    "withArticle": "accommodation",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "жильё, размещение",
                      "en": "place to stay or live",
                      "he": "לינה / מגורים"
                    }
                  },
                  {
                    "raw": "delay",
                    "word": "delay",
                    "withArticle": "delay",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "задержка рейса",
                      "en": "period of waiting / lateness",
                      "he": "עיכוב / איחור"
                    }
                  },
                  {
                    "raw": "customs",
                    "word": "customs",
                    "withArticle": "customs",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "таможня",
                      "en": "border baggage inspection",
                      "he": "מכס"
                    }
                  },
                  {
                    "raw": "explore",
                    "word": "explore",
                    "withArticle": "explore",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "исследовать",
                      "en": "travel through to learn about",
                      "he": "לחקור / לטייל"
                    }
                  },
                  {
                    "raw": "convenient",
                    "word": "convenient",
                    "withArticle": "convenient",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "удобный",
                      "en": "fitting in well with needs",
                      "he": "נוח / זמין"
                    }
                  },
                  {
                    "raw": "memorable",
                    "word": "memorable",
                    "withArticle": "memorable",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "незабываемый",
                      "en": "worth remembering",
                      "he": "בלתי נשכח"
                    }
                  }
                ]
              },
              {
                "id": "en-base-m1-l2",
                "speedMultiplier": 0.92,
                "spawnIntervalMs": 2700,
                "titles": {
                  "ru": "Общение и решения",
                  "en": "Communication & Choices",
                  "he": "תקשורת והחלטות"
                },
                "descriptions": {
                  "ru": "Полезные глаголы и прилагательные уровня B1 (12 слов).",
                  "en": "Essential B1 verbs & adjectives for daily talk (12 words).",
                  "he": "פעלים ותארים חיוניים לשיחה יומיומית (12 מילים)."
                },
                "words": [
                  {
                    "raw": "suggest",
                    "word": "suggest",
                    "withArticle": "suggest",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "предлагать (идею)",
                      "en": "put forward for consideration",
                      "he": "להציע"
                    }
                  },
                  {
                    "raw": "decide",
                    "word": "decide",
                    "withArticle": "decide",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "решать, принимать решение",
                      "en": "make a choice",
                      "he": "להחליט"
                    }
                  },
                  {
                    "raw": "improve",
                    "word": "improve",
                    "withArticle": "improve",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "улучшать",
                      "en": "make or become better",
                      "he": "לשפר"
                    }
                  },
                  {
                    "raw": "explain",
                    "word": "explain",
                    "withArticle": "explain",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "объяснять",
                      "en": "make clear to someone",
                      "he": "להסביר"
                    }
                  },
                  {
                    "raw": "confirm",
                    "word": "confirm",
                    "withArticle": "confirm",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "подтверждать",
                      "en": "establish correctness",
                      "he": "לאשר"
                    }
                  },
                  {
                    "raw": "schedule",
                    "word": "schedule",
                    "withArticle": "schedule",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "расписание, график",
                      "en": "plan for carrying out tasks",
                      "he": "לוח זמנים"
                    }
                  },
                  {
                    "raw": "opportunity",
                    "word": "opportunity",
                    "withArticle": "opportunity",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "возможность, шанс",
                      "en": "favorable chance",
                      "he": "הזדמנות"
                    }
                  },
                  {
                    "raw": "experience",
                    "word": "experience",
                    "withArticle": "experience",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "опыт, впечатление",
                      "en": "practical contact & skill",
                      "he": "ניסיון / חוויה"
                    }
                  },
                  {
                    "raw": "urgent",
                    "word": "urgent",
                    "withArticle": "urgent",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "срочный",
                      "en": "requiring immediate action",
                      "he": "דחוף"
                    }
                  },
                  {
                    "raw": "available",
                    "word": "available",
                    "withArticle": "available",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "доступный, свободный",
                      "en": "ready for use",
                      "he": "זמין / פנוי"
                    }
                  },
                  {
                    "raw": "essential",
                    "word": "essential",
                    "withArticle": "essential",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "необходимый, ключевой",
                      "en": "absolutely necessary",
                      "he": "חיוני"
                    }
                  },
                  {
                    "raw": "fluent",
                    "word": "fluent",
                    "withArticle": "fluent",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "свободный (о речи)",
                      "en": "able to speak smoothly",
                      "he": "שוטף (בשפה)"
                    }
                  }
                ]
              },
              {
                "id": "en-base-m1-l3",
                "speedMultiplier": 0.95,
                "spawnIntervalMs": 2650,
                "titles": {
                  "ru": "Работа и привычки",
                  "en": "Work & Habits",
                  "he": "עבודה והרגלים"
                },
                "descriptions": {
                  "ru": "Цели, сроки, команда и результат (12 слов).",
                  "en": "Goals, deadlines, teamwork & achievement (12 words).",
                  "he": "יעדים, לוחות זמנים, עבודת צוות והישגים (12 מילים)."
                },
                "words": [
                  {
                    "raw": "achieve",
                    "word": "achieve",
                    "withArticle": "achieve",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "достигать, добиваться",
                      "en": "successfully reach a goal",
                      "he": "להשיג"
                    }
                  },
                  {
                    "raw": "deadline",
                    "word": "deadline",
                    "withArticle": "deadline",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "крайний срок (дедлайн)",
                      "en": "latest time for completion",
                      "he": "מועד אחרון"
                    }
                  },
                  {
                    "raw": "colleague",
                    "word": "colleague",
                    "withArticle": "colleague",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "коллега",
                      "en": "person you work with",
                      "he": "עמית לעבודה"
                    }
                  },
                  {
                    "raw": "feedback",
                    "word": "feedback",
                    "withArticle": "feedback",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "обратная связь, отзыв",
                      "en": "helpful response or review",
                      "he": "משוב"
                    }
                  },
                  {
                    "raw": "focus",
                    "word": "focus",
                    "withArticle": "focus",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "фокусироваться",
                      "en": "concentrate attention",
                      "he": "להתמקד"
                    }
                  },
                  {
                    "raw": "habit",
                    "word": "habit",
                    "withArticle": "habit",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "привычка",
                      "en": "regular practice",
                      "he": "הרגל"
                    }
                  },
                  {
                    "raw": "prepare",
                    "word": "prepare",
                    "withArticle": "prepare",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "готовиться, подготавливать",
                      "en": "make ready",
                      "he": "להכין / להתכונן"
                    }
                  },
                  {
                    "raw": "solve",
                    "word": "solve",
                    "withArticle": "solve",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "решать (проблему)",
                      "en": "find an answer to",
                      "he": "לפתור"
                    }
                  },
                  {
                    "raw": "progress",
                    "word": "progress",
                    "withArticle": "progress",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "прогресс, продвижение",
                      "en": "forward movement",
                      "he": "התקדמות"
                    }
                  },
                  {
                    "raw": "reliable",
                    "word": "reliable",
                    "withArticle": "reliable",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "надёжный",
                      "en": "consistently trustworthy",
                      "he": "אמין"
                    }
                  },
                  {
                    "raw": "flexible",
                    "word": "flexible",
                    "withArticle": "flexible",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "гибкий",
                      "en": "easily adaptable",
                      "he": "גמיש"
                    }
                  },
                  {
                    "raw": "confident",
                    "word": "confident",
                    "withArticle": "confident",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "уверенный в себе",
                      "en": "self-assured",
                      "he": "בטוח בעצמו"
                    }
                  }
                ]
              },
              {
                "id": "en-base-m1-boss",
                "isBoss": true,
                "speedMultiplier": 1.04,
                "spawnIntervalMs": 2500,
                "titles": {
                  "ru": "👹 Босс-урок: Core English B1",
                  "en": "👹 Boss Review: Core English B1",
                  "he": "👹 שלב בוס: סיכום אנגלית B1"
                },
                "descriptions": {
                  "ru": "Супер-повторение слов из 3 уроков с акцентом на ошибки и ⭐!",
                  "en": "Dynamic boss review of all 3 English lessons!",
                  "he": "סיכום בוס של 3 השלבים האחרונים באנגלית!"
                },
                "words": []
              }
            ]
          }
        ]
      },
      {
        "id": "en-it",
        "targetLang": "en",
        "source": "official",
        "icon": "💻",
        "levelTag": "B1–B2",
        "titles": {
          "ru": "IT, Cloud и AI",
          "en": "IT, Cloud & AI",
          "he": "הייטק, ענן ו-AI"
        },
        "descriptions": {
          "ru": "Английский для разработчиков, продактов и DevOps: код, архитектура и продакшен.",
          "en": "Engineering vocabulary for modern software teams, APIs, cloud & incidents.",
          "he": "אנגלית טכנית למפתחים, ארכיטקטורת תוכנה, ענן ובינה מלאכותית."
        },
        "modules": [
          {
            "id": "en-it-m1",
            "titles": {
              "ru": "Модуль 1: Разработка и инфраструктура",
              "en": "Module 1: Engineering & Cloud",
              "he": "מודול 1: הנדסת תוכנה וענן"
            },
            "lessons": [
              {
                "id": "en-it-m1-l1",
                "speedMultiplier": 0.94,
                "spawnIntervalMs": 2700,
                "titles": {
                  "ru": "Код и ревью",
                  "en": "Code & Review",
                  "he": "קוד וסקירה"
                },
                "descriptions": {
                  "ru": "Рефакторинг, зависимости и ветки (11 слов).",
                  "en": "Refactoring, dependencies & pull requests (11 words).",
                  "he": "שכתוב קוד, תלויות ובדיקות (11 מילים)."
                },
                "words": [
                  {
                    "raw": "repository",
                    "word": "repository",
                    "withArticle": "repository",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "репозиторий кода",
                      "en": "central code storage",
                      "he": "מאגר קוד"
                    }
                  },
                  {
                    "raw": "refactor",
                    "word": "refactor",
                    "withArticle": "refactor",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "рефакторить (улучшать код)",
                      "en": "restructure code cleanly",
                      "he": "לשפר מבנה קוד"
                    }
                  },
                  {
                    "raw": "dependency",
                    "word": "dependency",
                    "withArticle": "dependency",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "зависимость, пакет",
                      "en": "external required module",
                      "he": "תלות תוכנה"
                    }
                  },
                  {
                    "raw": "variable",
                    "word": "variable",
                    "withArticle": "variable",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "переменная",
                      "en": "named storage value",
                      "he": "משתנה"
                    }
                  },
                  {
                    "raw": "compile",
                    "word": "compile",
                    "withArticle": "compile",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "компилировать",
                      "en": "translate source to machine code",
                      "he": "לקמפל / להדר"
                    }
                  },
                  {
                    "raw": "maintain",
                    "word": "maintain",
                    "withArticle": "maintain",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "поддерживать (проект)",
                      "en": "keep software running well",
                      "he": "לתחזק"
                    }
                  },
                  {
                    "raw": "deprecated",
                    "word": "deprecated",
                    "withArticle": "deprecated",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "устаревший (не рекомендуемый)",
                      "en": "marked for future removal",
                      "he": "מיושן / לא מומלץ"
                    }
                  },
                  {
                    "raw": "immutable",
                    "word": "immutable",
                    "withArticle": "immutable",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "неизменяемый",
                      "en": "unable to be mutated",
                      "he": "בלתי ניתן לשינוי"
                    }
                  },
                  {
                    "raw": "validate",
                    "word": "validate",
                    "withArticle": "validate",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "проверять корректность",
                      "en": "check data validity",
                      "he": "לאמת תקינות"
                    }
                  },
                  {
                    "raw": "merge",
                    "word": "merge",
                    "withArticle": "merge",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "сливать ветки (мёрджить)",
                      "en": "combine code branches",
                      "he": "למזג"
                    }
                  },
                  {
                    "raw": "snippet",
                    "word": "snippet",
                    "withArticle": "snippet",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "фрагмент кода",
                      "en": "short reusable piece of code",
                      "he": "קטע קוד"
                    }
                  }
                ]
              },
              {
                "id": "en-it-m1-l2",
                "speedMultiplier": 0.96,
                "spawnIntervalMs": 2650,
                "titles": {
                  "ru": "Облако и производительность",
                  "en": "Cloud & Performance",
                  "he": "ענן וביצועים"
                },
                "descriptions": {
                  "ru": "Задержка, пропускная способность и отказоустойчивость (11 слов).",
                  "en": "Latency, throughput, scaling & resilience (11 words).",
                  "he": "זמן השהיה, תפוקה, סקיילביליות ושרידות (11 מילים)."
                },
                "words": [
                  {
                    "raw": "latency",
                    "word": "latency",
                    "withArticle": "latency",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "задержка отклика",
                      "en": "network or processing delay",
                      "he": "זמן השהיה (Latency)"
                    }
                  },
                  {
                    "raw": "throughput",
                    "word": "throughput",
                    "withArticle": "throughput",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "пропускная способность",
                      "en": "rate of processed requests",
                      "he": "תפוקה"
                    }
                  },
                  {
                    "raw": "scalable",
                    "word": "scalable",
                    "withArticle": "scalable",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "масштабируемый",
                      "en": "able to handle growing load",
                      "he": "ניתן להרחבה"
                    }
                  },
                  {
                    "raw": "deployment",
                    "word": "deployment",
                    "withArticle": "deployment",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "выкатка, развёртывание",
                      "en": "releasing software live",
                      "he": "פריסה לשרת"
                    }
                  },
                  {
                    "raw": "resilient",
                    "word": "resilient",
                    "withArticle": "resilient",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "отказоустойчивый",
                      "en": "recovering quickly from failures",
                      "he": "עמיד לתקלות"
                    }
                  },
                  {
                    "raw": "outage",
                    "word": "outage",
                    "withArticle": "outage",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "сбой, простой сервиса",
                      "en": "period of system downtime",
                      "he": "השבתת מערכת"
                    }
                  },
                  {
                    "raw": "rollback",
                    "word": "rollback",
                    "withArticle": "rollback",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "откат версии",
                      "en": "reverting to prior release",
                      "he": "חזרה לגרסה קודמת"
                    }
                  },
                  {
                    "raw": "queue",
                    "word": "queue",
                    "withArticle": "queue",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "очередь задач",
                      "en": "ordered list of jobs",
                      "he": "תור משימות"
                    }
                  },
                  {
                    "raw": "concurrency",
                    "word": "concurrency",
                    "withArticle": "concurrency",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "параллелизм, конкурентность",
                      "en": "executing tasks simultaneously",
                      "he": "מקביליות"
                    }
                  },
                  {
                    "raw": "cache",
                    "word": "cache",
                    "withArticle": "cache",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "кэш (быстрая память)",
                      "en": "fast temporary data store",
                      "he": "מטמון (Cache)"
                    }
                  },
                  {
                    "raw": "threshold",
                    "word": "threshold",
                    "withArticle": "threshold",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "пороговое значение",
                      "en": "limit that triggers action",
                      "he": "סף / גבול"
                    }
                  }
                ]
              },
              {
                "id": "en-it-m1-l3",
                "speedMultiplier": 0.98,
                "spawnIntervalMs": 2600,
                "titles": {
                  "ru": "Безопасность и AI",
                  "en": "Security & AI",
                  "he": "אבטחת מידע ו-AI"
                },
                "descriptions": {
                  "ru": "Токены, шифрование, инференс и уязвимости (11 слов).",
                  "en": "Encryption, credentials, inference & vulnerabilities (11 words).",
                  "he": "הצפנה, הרשאות, הסקה ופגיעויות (11 מילים)."
                },
                "words": [
                  {
                    "raw": "encryption",
                    "word": "encryption",
                    "withArticle": "encryption",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "шифрование",
                      "en": "encoding data securely",
                      "he": "הצפנה"
                    }
                  },
                  {
                    "raw": "credentials",
                    "word": "credentials",
                    "withArticle": "credentials",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "учётные данные (ключи/пароли)",
                      "en": "login keys or tokens",
                      "he": "פרטי הזדהות"
                    }
                  },
                  {
                    "raw": "vulnerability",
                    "word": "vulnerability",
                    "withArticle": "vulnerability",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "уязвимость",
                      "en": "security weakness",
                      "he": "חולשת אבטחה"
                    }
                  },
                  {
                    "raw": "authentication",
                    "word": "authentication",
                    "withArticle": "authentication",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "аутентификация (проверка входа)",
                      "en": "verifying identity",
                      "he": "אימות זהות"
                    }
                  },
                  {
                    "raw": "permission",
                    "word": "permission",
                    "withArticle": "permission",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "разрешение, право доступа",
                      "en": "access authorization",
                      "he": "הרשאה"
                    }
                  },
                  {
                    "raw": "inference",
                    "word": "inference",
                    "withArticle": "inference",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "инференс (вывод AI-модели)",
                      "en": "running a trained AI model",
                      "he": "הסקה (של מודל AI)"
                    }
                  },
                  {
                    "raw": "embedding",
                    "word": "embedding",
                    "withArticle": "embedding",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "векторное представление",
                      "en": "numerical vector representation",
                      "he": "שיכון וקטורי"
                    }
                  },
                  {
                    "raw": "accuracy",
                    "word": "accuracy",
                    "withArticle": "accuracy",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "точность",
                      "en": "correctness of predictions",
                      "he": "דיוק"
                    }
                  },
                  {
                    "raw": "mitigate",
                    "word": "mitigate",
                    "withArticle": "mitigate",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "смягчать, снижать риск",
                      "en": "reduce severity of a risk",
                      "he": "לצמצם סיכון"
                    }
                  },
                  {
                    "raw": "audit",
                    "word": "audit",
                    "withArticle": "audit",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "аудит, проверка безопасности",
                      "en": "systematic security inspection",
                      "he": "ביקורת אבטחה"
                    }
                  },
                  {
                    "raw": "payload",
                    "word": "payload",
                    "withArticle": "payload",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "полезные данные запроса",
                      "en": "transmitted request data",
                      "he": "תוכן המנה (Payload)"
                    }
                  }
                ]
              },
              {
                "id": "en-it-m1-boss",
                "isBoss": true,
                "speedMultiplier": 1.04,
                "spawnIntervalMs": 2500,
                "titles": {
                  "ru": "👹 Босс-урок: Senior Tech Check",
                  "en": "👹 Boss Review: Tech Lead Sprint",
                  "he": "👹 שלב בוס: ספרינט הייטק"
                },
                "descriptions": {
                  "ru": "Босс-раунд по английской инженерной лексике!",
                  "en": "Boss challenge mixing Code, Cloud & Security terms!",
                  "he": "שלב בוס המסכם את מונחי הפיתוח, הענן והאבטחה!"
                },
                "words": []
              }
            ]
          }
        ]
      },
      {
        "id": "en-auto",
        "targetLang": "en",
        "source": "official",
        "icon": "🚗",
        "levelTag": "A2–B1",
        "titles": {
          "ru": "Авто и дорога (EN)",
          "en": "Auto & Driving",
          "he": "רכב ונהיגה (EN)"
        },
        "descriptions": {
          "ru": "Аренда авто за границей, детали машины, трасса и страховка на английском.",
          "en": "Car rental abroad, vehicle parts, highway rules & insurance in English.",
          "he": "השכרת רכב בחו״ל, חלקי הרכב, כביש מהיר וביטוח באנגלית."
        },
        "modules": [
          {
            "id": "en-auto-m1",
            "titles": {
              "ru": "Модуль 1: Машина, трасса и аренда",
              "en": "Module 1: Car, Highway & Rental",
              "he": "מודול 1: רכב, כביש מהיר והשכרה"
            },
            "lessons": [
              {
                "id": "en-auto-m1-l1",
                "speedMultiplier": 0.9,
                "spawnIntervalMs": 2750,
                "titles": {
                  "ru": "Устройство авто",
                  "en": "Car Parts",
                  "he": "חלקי הרכב"
                },
                "descriptions": {
                  "ru": "Лобовое стекло, фары, багажник и тормоза (11 слов).",
                  "en": "Windshield, headlights, trunk & brakes (11 words).",
                  "he": "שמשה, פנסים, תא מטען ובלמים (11 מילים)."
                },
                "words": [
                  {
                    "raw": "windshield",
                    "word": "windshield",
                    "withArticle": "windshield",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "лобовое стекло",
                      "en": "front car window",
                      "he": "שמשה קדמית"
                    }
                  },
                  {
                    "raw": "headlight",
                    "word": "headlight",
                    "withArticle": "headlight",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "передняя фара",
                      "en": "front lamp of a vehicle",
                      "he": "פנס קדמי"
                    }
                  },
                  {
                    "raw": "steering",
                    "word": "steering",
                    "withArticle": "steering",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "рулевое управление",
                      "en": "wheel & mechanism guiding a car",
                      "he": "היגוי"
                    }
                  },
                  {
                    "raw": "seatbelt",
                    "word": "seatbelt",
                    "withArticle": "seatbelt",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "ремень безопасности",
                      "en": "safety strap in a vehicle",
                      "he": "חגורת בטיחות"
                    }
                  },
                  {
                    "raw": "clutch",
                    "word": "clutch",
                    "withArticle": "clutch",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "педаль сцепления",
                      "en": "gear engagement pedal",
                      "he": "מצמד (קלאץ׳)"
                    }
                  },
                  {
                    "raw": "brake",
                    "word": "brake",
                    "withArticle": "brake",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "тормоз",
                      "en": "device for slowing a vehicle",
                      "he": "בלם"
                    }
                  },
                  {
                    "raw": "dashboard",
                    "word": "dashboard",
                    "withArticle": "dashboard",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "приборная панель",
                      "en": "instrument panel in cabin",
                      "he": "לוח מחוונים"
                    }
                  },
                  {
                    "raw": "bumper",
                    "word": "bumper",
                    "withArticle": "bumper",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "бампер",
                      "en": "impact bar on front/rear",
                      "he": "פגוש"
                    }
                  },
                  {
                    "raw": "wiper",
                    "word": "wiper",
                    "withArticle": "wiper",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "дворник (стеклоочиститель)",
                      "en": "blade clearing rain from glass",
                      "he": "מגב"
                    }
                  },
                  {
                    "raw": "engine",
                    "word": "engine",
                    "withArticle": "engine",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "двигатель",
                      "en": "motor powering the vehicle",
                      "he": "מנוע"
                    }
                  },
                  {
                    "raw": "tire",
                    "word": "tire",
                    "withArticle": "tire",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "автомобильная шина",
                      "en": "rubber wheel covering",
                      "he": "צמיג"
                    }
                  }
                ]
              },
              {
                "id": "en-auto-m1-l2",
                "speedMultiplier": 0.93,
                "spawnIntervalMs": 2700,
                "titles": {
                  "ru": "Трасса и движение",
                  "en": "Highway & Traffic",
                  "he": "כביש מהיר ותנועה"
                },
                "descriptions": {
                  "ru": "Полосы, обгон, развязка и объезд (11 слов).",
                  "en": "Lanes, overtaking, detour & junctions (11 words).",
                  "he": "נתיבים, עקיפה, מעקף ומחלפים (11 מילים)."
                },
                "words": [
                  {
                    "raw": "highway",
                    "word": "highway",
                    "withArticle": "highway",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "скоростное шоссе",
                      "en": "main multi-lane road",
                      "he": "כביש מהיר"
                    }
                  },
                  {
                    "raw": "lane",
                    "word": "lane",
                    "withArticle": "lane",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "полоса движения",
                      "en": "division of a road",
                      "he": "נתיב"
                    }
                  },
                  {
                    "raw": "detour",
                    "word": "detour",
                    "withArticle": "detour",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "маршрут объезда",
                      "en": "alternative route around roadworks",
                      "he": "מעקף"
                    }
                  },
                  {
                    "raw": "roundabout",
                    "word": "roundabout",
                    "withArticle": "roundabout",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "круговой перекрёсток",
                      "en": "circular traffic junction",
                      "he": "כיכר תנועה"
                    }
                  },
                  {
                    "raw": "overtake",
                    "word": "overtake",
                    "withArticle": "overtake",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "обгонять",
                      "en": "pass a slower vehicle",
                      "he": "לעקוף"
                    }
                  },
                  {
                    "raw": "pedestrian",
                    "word": "pedestrian",
                    "withArticle": "pedestrian",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "пешеход",
                      "en": "person walking near a road",
                      "he": "הולך רגל"
                    }
                  },
                  {
                    "raw": "congestion",
                    "word": "congestion",
                    "withArticle": "congestion",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "затор, пробка",
                      "en": "heavy traffic crowding",
                      "he": "עומס תנועה / פקק"
                    }
                  },
                  {
                    "raw": "intersection",
                    "word": "intersection",
                    "withArticle": "intersection",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "перекрёсток",
                      "en": "point where roads cross",
                      "he": "צומת"
                    }
                  },
                  {
                    "raw": "refuel",
                    "word": "refuel",
                    "withArticle": "refuel",
                    "article": "Verb",
                    "plural": "",
                    "translations": {
                      "ru": "заправляться топливом",
                      "en": "supply vehicle with fuel",
                      "he": "לתדלק"
                    }
                  },
                  {
                    "raw": "speeding",
                    "word": "speeding",
                    "withArticle": "speeding",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "превышение скорости",
                      "en": "driving above speed limit",
                      "he": "נהיגה במהירות מופרזת"
                    }
                  },
                  {
                    "raw": "signpost",
                    "word": "signpost",
                    "withArticle": "signpost",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "дорожный указатель",
                      "en": "directional road sign",
                      "he": "שלט הכוונה"
                    }
                  }
                ]
              },
              {
                "id": "en-auto-m1-l3",
                "speedMultiplier": 0.95,
                "spawnIntervalMs": 2650,
                "titles": {
                  "ru": "Аренда и страховка",
                  "en": "Rental & Insurance",
                  "he": "השכרה וביטוח"
                },
                "descriptions": {
                  "ru": "Франшиза, покрытие, эвакуатор и залог (11 слов).",
                  "en": "Coverage, deductible, deposit & roadside help (11 words).",
                  "he": "כיסוי ביטוחי, השתתפות עצמית, פיקדון וגרירה (11 מילים)."
                },
                "words": [
                  {
                    "raw": "insurance",
                    "word": "insurance",
                    "withArticle": "insurance",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "страховка",
                      "en": "financial protection policy",
                      "he": "ביטוח"
                    }
                  },
                  {
                    "raw": "coverage",
                    "word": "coverage",
                    "withArticle": "coverage",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "страховое покрытие",
                      "en": "risks protected by policy",
                      "he": "כיסוי ביטוחי"
                    }
                  },
                  {
                    "raw": "deductible",
                    "word": "deductible",
                    "withArticle": "deductible",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "франшиза (в страховке)",
                      "en": "out-of-pocket claim amount",
                      "he": "השתתפות עצמית"
                    }
                  },
                  {
                    "raw": "deposit",
                    "word": "deposit",
                    "withArticle": "deposit",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "возвратный залог",
                      "en": "security sum held on card",
                      "he": "פיקדון"
                    }
                  },
                  {
                    "raw": "license",
                    "word": "license",
                    "withArticle": "license",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "водительские права",
                      "en": "official permit to drive",
                      "he": "רישיון נהיגה"
                    }
                  },
                  {
                    "raw": "breakdown",
                    "word": "breakdown",
                    "withArticle": "breakdown",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "поломка в пути",
                      "en": "mechanical vehicle failure",
                      "he": "תקלה ברכב"
                    }
                  },
                  {
                    "raw": "collision",
                    "word": "collision",
                    "withArticle": "collision",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "столкновение, ДТП",
                      "en": "crash between vehicles",
                      "he": "התנגשות / תאונה"
                    }
                  },
                  {
                    "raw": "damage",
                    "word": "damage",
                    "withArticle": "damage",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "повреждение, ущерб",
                      "en": "physical harm to vehicle",
                      "he": "נזק"
                    }
                  },
                  {
                    "raw": "witness",
                    "word": "witness",
                    "withArticle": "witness",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "свидетель",
                      "en": "person who saw an incident",
                      "he": "עד"
                    }
                  },
                  {
                    "raw": "liability",
                    "word": "liability",
                    "withArticle": "liability",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "гражданская ответственность",
                      "en": "legal responsibility",
                      "he": "אחריות חוקית (צד ג׳)"
                    }
                  },
                  {
                    "raw": "mileage",
                    "word": "mileage",
                    "withArticle": "mileage",
                    "article": "Noun",
                    "plural": "",
                    "translations": {
                      "ru": "пробег (лимит километров)",
                      "en": "total distance traveled",
                      "he": "קילומטראז׳"
                    }
                  }
                ]
              },
              {
                "id": "en-auto-m1-boss",
                "isBoss": true,
                "speedMultiplier": 1.04,
                "spawnIntervalMs": 2500,
                "titles": {
                  "ru": "👹 Босс-урок: Road Trip Exam",
                  "en": "👹 Boss Review: Road Trip Exam",
                  "he": "👹 שלב בוס: מבחן נהיגה באנגלית"
                },
                "descriptions": {
                  "ru": "Проверка всех автомобильных слов на английском!",
                  "en": "Boss challenge across Car Parts, Highway & Rental!",
                  "he": "שלב בוס המסכם רכב, כביש והשכרה באנגלית!"
                },
                "words": []
              }
            ]
          }
        ]
      }
    ],
    "es": [
      {
        "id": "es-base",
        "targetLang": "es",
        "source": "official",
        "icon": "🌱",
        "levelTag": "A1–A2",
        "titles": {
          "ru": "Базовый испанский (A1 → A2)",
          "en": "Core Spanish (A1 → A2)",
          "he": "ספרדית בסיסית (A1 → A2)"
        },
        "descriptions": {
          "ru": "Самые нужные испанские слова для путешествий, кафе, города и живого общения.",
          "en": "Essential Spanish vocabulary for travel, cafés, city life & daily conversation.",
          "he": "אוצר מילים חיוני בספרדית לטיולים, מסעדות, עיר ושיחה יומיומית."
        },
        "modules": [
          {
            "id": "es-base-m1",
            "titles": {
              "ru": "Модуль 1: Город, кафе и путешествия",
              "en": "Module 1: City, Café & Travel",
              "he": "מודול 1: עיר, קפה וטיולים"
            },
            "lessons": [
              {
                "id": "es-base-m1-l1",
                "speedMultiplier": 0.88,
                "spawnIntervalMs": 2800,
                "titles": {
                  "ru": "Жизнь и общение",
                  "en": "Daily Life & Greeting",
                  "he": "יומיום והיכרות"
                },
                "descriptions": {
                  "ru": "Утро, дом, друзья и базовые глаголы (11 слов, включая ñ и ударения).",
                  "en": "Morning, home, friends & core verbs (11 words).",
                  "he": "בוקר, בית, חברים ופעלים בסיסיים (11 מילים)."
                },
                "words": [
                  {
                    "raw": "la mañana",
                    "word": "mañana",
                    "withArticle": "la mañana",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "утро / завтра",
                      "en": "morning / tomorrow",
                      "he": "בוקר / מחר"
                    }
                  },
                  {
                    "raw": "el compañero",
                    "word": "compañero",
                    "withArticle": "el compañero",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "товарищ, напарник",
                      "en": "companion, colleague",
                      "he": "חבר / שותף"
                    }
                  },
                  {
                    "raw": "la habitación",
                    "word": "habitación",
                    "withArticle": "la habitación",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "комната, номер в отеле",
                      "en": "room / hotel room",
                      "he": "חדר"
                    }
                  },
                  {
                    "raw": "la llave",
                    "word": "llave",
                    "withArticle": "la llave",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "ключ",
                      "en": "key",
                      "he": "מפתח"
                    }
                  },
                  {
                    "raw": "desayunar",
                    "word": "desayunar",
                    "withArticle": "desayunar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "завтракать",
                      "en": "to have breakfast",
                      "he": "לאכול ארוחת בוקר"
                    }
                  },
                  {
                    "raw": "preguntar",
                    "word": "preguntar",
                    "withArticle": "preguntar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "спрашивать",
                      "en": "to ask",
                      "he": "לשאול"
                    }
                  },
                  {
                    "raw": "recordar",
                    "word": "recordar",
                    "withArticle": "recordar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "помнить, вспоминать",
                      "en": "to remember",
                      "he": "לזכור"
                    }
                  },
                  {
                    "raw": "tranquilo",
                    "word": "tranquilo",
                    "withArticle": "tranquilo",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "спокойный, тихий",
                      "en": "calm, quiet",
                      "he": "רגוע / שקט"
                    }
                  },
                  {
                    "raw": "pequeño",
                    "word": "pequeño",
                    "withArticle": "pequeño",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "маленький",
                      "en": "small, little",
                      "he": "קטן"
                    }
                  },
                  {
                    "raw": "rápido",
                    "word": "rápido",
                    "withArticle": "rápido",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "быстрый",
                      "en": "fast, quick",
                      "he": "מהיר"
                    }
                  },
                  {
                    "raw": "siempre",
                    "word": "siempre",
                    "withArticle": "siempre",
                    "article": "Adv.",
                    "plural": "",
                    "translations": {
                      "ru": "всегда",
                      "en": "always",
                      "he": "תמיד"
                    }
                  }
                ]
              },
              {
                "id": "es-base-m1-l2",
                "speedMultiplier": 0.92,
                "spawnIntervalMs": 2720,
                "titles": {
                  "ru": "Город и вокзал",
                  "en": "City & Station",
                  "he": "עיר ותחנה"
                },
                "descriptions": {
                  "ru": "Поезд, билет, улица и площадь (11 слов).",
                  "en": "Station, ticket, square & directions (11 words).",
                  "he": "תחנה, כרטיס, כיכר והכוונה (11 מילים)."
                },
                "words": [
                  {
                    "raw": "la estación",
                    "word": "estación",
                    "withArticle": "la estación",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "станция, вокзал",
                      "en": "station",
                      "he": "תחנה"
                    }
                  },
                  {
                    "raw": "el billete",
                    "word": "billete",
                    "withArticle": "el billete",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "билет",
                      "en": "ticket",
                      "he": "כרטיס"
                    }
                  },
                  {
                    "raw": "la calle",
                    "word": "calle",
                    "withArticle": "la calle",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "улица",
                      "en": "street",
                      "he": "רחוב"
                    }
                  },
                  {
                    "raw": "la esquina",
                    "word": "esquina",
                    "withArticle": "la esquina",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "угол улицы",
                      "en": "street corner",
                      "he": "פינת רחוב"
                    }
                  },
                  {
                    "raw": "el puente",
                    "word": "puente",
                    "withArticle": "el puente",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "мост",
                      "en": "bridge",
                      "he": "גשר"
                    }
                  },
                  {
                    "raw": "el equipaje",
                    "word": "equipaje",
                    "withArticle": "el equipaje",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "багаж",
                      "en": "luggage",
                      "he": "מזוודות / כבודה"
                    }
                  },
                  {
                    "raw": "llegar",
                    "word": "llegar",
                    "withArticle": "llegar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "прибывать, приходить",
                      "en": "to arrive",
                      "he": "להגיע"
                    }
                  },
                  {
                    "raw": "cruzar",
                    "word": "cruzar",
                    "withArticle": "cruzar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "переходить, пересекать",
                      "en": "to cross",
                      "he": "לחצות"
                    }
                  },
                  {
                    "raw": "buscar",
                    "word": "buscar",
                    "withArticle": "buscar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "искать",
                      "en": "to look for",
                      "he": "לחפש"
                    }
                  },
                  {
                    "raw": "cerca",
                    "word": "cerca",
                    "withArticle": "cerca",
                    "article": "Adv.",
                    "plural": "",
                    "translations": {
                      "ru": "рядом, близко",
                      "en": "near, close",
                      "he": "קרוב"
                    }
                  },
                  {
                    "raw": "lejos",
                    "word": "lejos",
                    "withArticle": "lejos",
                    "article": "Adv.",
                    "plural": "",
                    "translations": {
                      "ru": "далеко",
                      "en": "far away",
                      "he": "רחוק"
                    }
                  }
                ]
              },
              {
                "id": "es-base-m1-l3",
                "speedMultiplier": 0.94,
                "spawnIntervalMs": 2680,
                "titles": {
                  "ru": "Ресторан и покупки",
                  "en": "Restaurant & Market",
                  "he": "מסעדה וקניות"
                },
                "descriptions": {
                  "ru": "Счёт, заказ, рынок и чаевые (11 слов).",
                  "en": "Bill, menu, ordering & market shopping (11 words).",
                  "he": "חשבון, הזמנה, שוק וטיפ (11 מילים)."
                },
                "words": [
                  {
                    "raw": "la cuenta",
                    "word": "cuenta",
                    "withArticle": "la cuenta",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "счёт (в ресторане)",
                      "en": "bill / check",
                      "he": "חשבון"
                    }
                  },
                  {
                    "raw": "la propina",
                    "word": "propina",
                    "withArticle": "la propina",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "чаевые",
                      "en": "tip",
                      "he": "טיפ / תשר"
                    }
                  },
                  {
                    "raw": "el mercado",
                    "word": "mercado",
                    "withArticle": "el mercado",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "рынок",
                      "en": "market",
                      "he": "שוק"
                    }
                  },
                  {
                    "raw": "la panadería",
                    "word": "panadería",
                    "withArticle": "la panadería",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "пекарня, булочная",
                      "en": "bakery",
                      "he": "מאפייה"
                    }
                  },
                  {
                    "raw": "el efectivo",
                    "word": "efectivo",
                    "withArticle": "el efectivo",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "наличные",
                      "en": "cash",
                      "he": "מזומן"
                    }
                  },
                  {
                    "raw": "la tarjeta",
                    "word": "tarjeta",
                    "withArticle": "la tarjeta",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "банковская карта",
                      "en": "card",
                      "he": "כרטיס אשראי"
                    }
                  },
                  {
                    "raw": "pedir",
                    "word": "pedir",
                    "withArticle": "pedir",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "заказывать, просить",
                      "en": "to order / ask for",
                      "he": "להזמין / לבקש"
                    }
                  },
                  {
                    "raw": "pagar",
                    "word": "pagar",
                    "withArticle": "pagar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "платить",
                      "en": "to pay",
                      "he": "לשלם"
                    }
                  },
                  {
                    "raw": "probar",
                    "word": "probar",
                    "withArticle": "probar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "пробовать",
                      "en": "to try / taste",
                      "he": "לטעום / לנסות"
                    }
                  },
                  {
                    "raw": "delicioso",
                    "word": "delicioso",
                    "withArticle": "delicioso",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "очень вкусный",
                      "en": "delicious",
                      "he": "טעים מאוד"
                    }
                  },
                  {
                    "raw": "barato",
                    "word": "barato",
                    "withArticle": "barato",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "недорогой, дешёвый",
                      "en": "inexpensive, cheap",
                      "he": "זול"
                    }
                  }
                ]
              },
              {
                "id": "es-base-m1-boss",
                "isBoss": true,
                "speedMultiplier": 1.04,
                "spawnIntervalMs": 2500,
                "titles": {
                  "ru": "👹 Босс-урок: Español A1–A2",
                  "en": "👹 Boss Review: Español A1–A2",
                  "he": "👹 שלב בוס: סיכום ספרדית A1–A2"
                },
                "descriptions": {
                  "ru": "Босс-повторение испанских слов модуля (ñ, ударения и базовые глаголы)!",
                  "en": "Boss review mixing all 3 Spanish everyday lessons!",
                  "he": "שלב בוס המסכם את שלושת השלבים בספרדית!"
                },
                "words": []
              }
            ]
          }
        ]
      },
      {
        "id": "es-auto",
        "targetLang": "es",
        "source": "official",
        "icon": "🚗",
        "levelTag": "A2–B1",
        "titles": {
          "ru": "Авто и дорога (ES)",
          "en": "Auto y Carretera",
          "he": "רכב ודרך בספרדית"
        },
        "descriptions": {
          "ru": "Вождение в Испании и Латинской Америке: детали машины, трасса, заправка и страховка.",
          "en": "Driving in Spain & Latin America: car parts, highway signs & insurance.",
          "he": "נהיגה בספרד ובאמריקה הלטינית: חלקי רכב, כביש מהיר וביטוח."
        },
        "modules": [
          {
            "id": "es-auto-m1",
            "titles": {
              "ru": "Модуль 1: Автомобиль и автострада",
              "en": "Module 1: Coche y Autopista",
              "he": "מודול 1: רכב וכביש מהיר"
            },
            "lessons": [
              {
                "id": "es-auto-m1-l1",
                "speedMultiplier": 0.92,
                "spawnIntervalMs": 2750,
                "titles": {
                  "ru": "Детали машины",
                  "en": "Car Parts",
                  "he": "חלקי הרכב"
                },
                "descriptions": {
                  "ru": "Руль, багажник, тормоза, шины и зеркала (11 слов).",
                  "en": "Steering wheel, trunk, brakes & tires (11 words).",
                  "he": "הגה, תא מטען, בלמים וצמיגים (11 מילים)."
                },
                "words": [
                  {
                    "raw": "el volante",
                    "word": "volante",
                    "withArticle": "el volante",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "руль",
                      "en": "steering wheel",
                      "he": "הגה"
                    }
                  },
                  {
                    "raw": "el maletero",
                    "word": "maletero",
                    "withArticle": "el maletero",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "багажник",
                      "en": "car trunk",
                      "he": "תא מטען"
                    }
                  },
                  {
                    "raw": "el freno",
                    "word": "freno",
                    "withArticle": "el freno",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "тормоз",
                      "en": "brake",
                      "he": "בלם"
                    }
                  },
                  {
                    "raw": "el neumático",
                    "word": "neumático",
                    "withArticle": "el neumático",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "шина, покрышка",
                      "en": "tire",
                      "he": "צמיג"
                    }
                  },
                  {
                    "raw": "el parabrisas",
                    "word": "parabrisas",
                    "withArticle": "el parabrisas",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "лобовое стекло",
                      "en": "windshield",
                      "he": "שמשה קדמית"
                    }
                  },
                  {
                    "raw": "el cinturón",
                    "word": "cinturón",
                    "withArticle": "el cinturón",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "ремень безопасности",
                      "en": "seatbelt",
                      "he": "חגורת בטיחות"
                    }
                  },
                  {
                    "raw": "el retrovisor",
                    "word": "retrovisor",
                    "withArticle": "el retrovisor",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "зеркало заднего вида",
                      "en": "rearview mirror",
                      "he": "מראת צד / פנים"
                    }
                  },
                  {
                    "raw": "el motor",
                    "word": "motor",
                    "withArticle": "el motor",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "двигатель",
                      "en": "engine",
                      "he": "מנוע"
                    }
                  },
                  {
                    "raw": "el embrague",
                    "word": "embrague",
                    "withArticle": "el embrague",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "сцепление",
                      "en": "clutch",
                      "he": "מצמד"
                    }
                  },
                  {
                    "raw": "el depósito",
                    "word": "depósito",
                    "withArticle": "el depósito",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "топливный бак",
                      "en": "fuel tank",
                      "he": "מכל דלק"
                    }
                  },
                  {
                    "raw": "repostar",
                    "word": "repostar",
                    "withArticle": "repostar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "заправляться",
                      "en": "to refuel",
                      "he": "לתדלק"
                    }
                  }
                ]
              },
              {
                "id": "es-auto-m1-l2",
                "speedMultiplier": 0.94,
                "spawnIntervalMs": 2700,
                "titles": {
                  "ru": "Автострада и знаки",
                  "en": "Highway & Signs",
                  "he": "כביש מהיר ותמרורים"
                },
                "descriptions": {
                  "ru": "Шоссе, полоса, съезд, платная дорога и пробка (11 слов).",
                  "en": "Highway, lane, exit, toll & traffic jam (11 words).",
                  "he": "כביש מהיר, נתיב, יציאה, כביש אגרה ופקק (11 מילים)."
                },
                "words": [
                  {
                    "raw": "la autopista",
                    "word": "autopista",
                    "withArticle": "la autopista",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "автомагистраль",
                      "en": "highway / motorway",
                      "he": "כביש מהיר"
                    }
                  },
                  {
                    "raw": "el carril",
                    "word": "carril",
                    "withArticle": "el carril",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "полоса движения",
                      "en": "traffic lane",
                      "he": "נתיב"
                    }
                  },
                  {
                    "raw": "la salida",
                    "word": "salida",
                    "withArticle": "la salida",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "съезд, выход",
                      "en": "exit",
                      "he": "יציאה"
                    }
                  },
                  {
                    "raw": "el peaje",
                    "word": "peaje",
                    "withArticle": "el peaje",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "платный участок (оплата проезда)",
                      "en": "road toll",
                      "he": "כביש אגרה"
                    }
                  },
                  {
                    "raw": "el atasco",
                    "word": "atasco",
                    "withArticle": "el atasco",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "пробка, затор",
                      "en": "traffic jam",
                      "he": "פקק תנועה"
                    }
                  },
                  {
                    "raw": "la señal",
                    "word": "señal",
                    "withArticle": "la señal",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "дорожный знак",
                      "en": "road sign",
                      "he": "תמרור"
                    }
                  },
                  {
                    "raw": "el desvío",
                    "word": "desvío",
                    "withArticle": "el desvío",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "объезд",
                      "en": "detour",
                      "he": "מעקף"
                    }
                  },
                  {
                    "raw": "adelantar",
                    "word": "adelantar",
                    "withArticle": "adelantar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "обгонять",
                      "en": "to overtake",
                      "he": "לעקוף"
                    }
                  },
                  {
                    "raw": "aparcar",
                    "word": "aparcar",
                    "withArticle": "aparcar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "парковаться",
                      "en": "to park",
                      "he": "לחנות"
                    }
                  },
                  {
                    "raw": "conducir",
                    "word": "conducir",
                    "withArticle": "conducir",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "водить машину",
                      "en": "to drive",
                      "he": "לנהוג"
                    }
                  },
                  {
                    "raw": "despacio",
                    "word": "despacio",
                    "withArticle": "despacio",
                    "article": "Adv.",
                    "plural": "",
                    "translations": {
                      "ru": "медленно",
                      "en": "slowly",
                      "he": "לאט"
                    }
                  }
                ]
              },
              {
                "id": "es-auto-m1-l3",
                "speedMultiplier": 0.96,
                "spawnIntervalMs": 2650,
                "titles": {
                  "ru": "Поломка и страховка",
                  "en": "Breakdown & Insurance",
                  "he": "תקלה וביטוח"
                },
                "descriptions": {
                  "ru": "Авария, эвакуатор, страховка и права (10 слов).",
                  "en": "Breakdown, tow truck, insurance & license (10 words).",
                  "he": "תקלה, גרר, ביטוח ורישיון (10 מילים)."
                },
                "words": [
                  {
                    "raw": "el seguro",
                    "word": "seguro",
                    "withArticle": "el seguro",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "страховка",
                      "en": "insurance",
                      "he": "ביטוח"
                    }
                  },
                  {
                    "raw": "la avería",
                    "word": "avería",
                    "withArticle": "la avería",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "поломка, неисправность",
                      "en": "breakdown",
                      "he": "תקלה"
                    }
                  },
                  {
                    "raw": "la grúa",
                    "word": "grúa",
                    "withArticle": "la grúa",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "эвакуатор",
                      "en": "tow truck",
                      "he": "משאית גרר"
                    }
                  },
                  {
                    "raw": "el permiso",
                    "word": "permiso",
                    "withArticle": "el permiso",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "водительское удостоверение",
                      "en": "driver's permit",
                      "he": "רישיון"
                    }
                  },
                  {
                    "raw": "la multa",
                    "word": "multa",
                    "withArticle": "la multa",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "штраф",
                      "en": "fine / ticket",
                      "he": "קנס"
                    }
                  },
                  {
                    "raw": "el daño",
                    "word": "daño",
                    "withArticle": "el daño",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "ущерб, повреждение",
                      "en": "damage",
                      "he": "נזק"
                    }
                  },
                  {
                    "raw": "el testigo",
                    "word": "testigo",
                    "withArticle": "el testigo",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "свидетель",
                      "en": "witness",
                      "he": "עד"
                    }
                  },
                  {
                    "raw": "alquilar",
                    "word": "alquilar",
                    "withArticle": "alquilar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "арендовать",
                      "en": "to rent",
                      "he": "לשכור"
                    }
                  },
                  {
                    "raw": "reparar",
                    "word": "reparar",
                    "withArticle": "reparar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "чинить, ремонтировать",
                      "en": "to repair",
                      "he": "לתקן"
                    }
                  },
                  {
                    "raw": "obligatorio",
                    "word": "obligatorio",
                    "withArticle": "obligatorio",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "обязательный",
                      "en": "mandatory",
                      "he": "חובה"
                    }
                  }
                ]
              },
              {
                "id": "es-auto-m1-boss",
                "isBoss": true,
                "speedMultiplier": 1.04,
                "spawnIntervalMs": 2500,
                "titles": {
                  "ru": "👹 Босс-урок: Autopista Boss",
                  "en": "👹 Boss Review: Autopista Boss",
                  "he": "👹 שלב בוס: מבחן כביש בספרדית"
                },
                "descriptions": {
                  "ru": "Проверка всех автомобильных слов на испанском языке!",
                  "en": "Boss review across Spanish car & highway lessons!",
                  "he": "שלב בוס המסכם נהיגה ורכב בספרדית!"
                },
                "words": []
              }
            ]
          }
        ]
      },
      {
        "id": "es-it",
        "targetLang": "es",
        "source": "official",
        "icon": "💻",
        "levelTag": "B1",
        "titles": {
          "ru": "IT и разработка (ES)",
          "en": "IT y Desarrollo",
          "he": "הייטק ופיתוח בספרדית"
        },
        "descriptions": {
          "ru": "Испанская лексика для работы в международных IT-командах: код, серверы и данные.",
          "en": "Spanish tech vocabulary for software teams: code, cloud & security.",
          "he": "אוצר מילים טכנולוגי בספרדית לצוותי פיתוח וענן."
        },
        "modules": [
          {
            "id": "es-it-m1",
            "titles": {
              "ru": "Модуль 1: Код, облако и данные",
              "en": "Module 1: Código, Nube y Datos",
              "he": "מודול 1: קוד, ענן ונתונים"
            },
            "lessons": [
              {
                "id": "es-it-m1-l1",
                "speedMultiplier": 0.94,
                "spawnIntervalMs": 2700,
                "titles": {
                  "ru": "Разработка ПО",
                  "en": "Software Dev",
                  "he": "פיתוח תוכנה"
                },
                "descriptions": {
                  "ru": "Код, ошибки, функции и тестирование (10 слов).",
                  "en": "Code, functions, bugs & testing (10 words).",
                  "he": "קוד, פונקציות, שגיאות ובדיקות (10 מילים)."
                },
                "words": [
                  {
                    "raw": "el código",
                    "word": "código",
                    "withArticle": "el código",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "код",
                      "en": "code",
                      "he": "קוד"
                    }
                  },
                  {
                    "raw": "la función",
                    "word": "función",
                    "withArticle": "la función",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "функция",
                      "en": "function",
                      "he": "פונקציה"
                    }
                  },
                  {
                    "raw": "la aplicación",
                    "word": "aplicación",
                    "withArticle": "la aplicación",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "приложение",
                      "en": "application",
                      "he": "אפליקציה"
                    }
                  },
                  {
                    "raw": "el desarrollo",
                    "word": "desarrollo",
                    "withArticle": "el desarrollo",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "разработка",
                      "en": "development",
                      "he": "פיתוח"
                    }
                  },
                  {
                    "raw": "la prueba",
                    "word": "prueba",
                    "withArticle": "la prueba",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "тест, проверка",
                      "en": "test",
                      "he": "בדיקה (Test)"
                    }
                  },
                  {
                    "raw": "programar",
                    "word": "programar",
                    "withArticle": "programar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "программировать",
                      "en": "to program",
                      "he": "לתכנת"
                    }
                  },
                  {
                    "raw": "corregir",
                    "word": "corregir",
                    "withArticle": "corregir",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "исправлять",
                      "en": "to fix / correct",
                      "he": "לתקן"
                    }
                  },
                  {
                    "raw": "guardar",
                    "word": "guardar",
                    "withArticle": "guardar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "сохранять",
                      "en": "to save",
                      "he": "לשמור"
                    }
                  },
                  {
                    "raw": "ejecutar",
                    "word": "ejecutar",
                    "withArticle": "ejecutar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "запускать, выполнять",
                      "en": "to execute / run",
                      "he": "להריץ"
                    }
                  },
                  {
                    "raw": "estable",
                    "word": "estable",
                    "withArticle": "estable",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "стабильный",
                      "en": "stable",
                      "he": "יציב"
                    }
                  }
                ]
              },
              {
                "id": "es-it-m1-l2",
                "speedMultiplier": 0.96,
                "spawnIntervalMs": 2650,
                "titles": {
                  "ru": "Серверы и сеть",
                  "en": "Servers & Cloud",
                  "he": "שרתים וענן"
                },
                "descriptions": {
                  "ru": "Сервер, облако, обновление и производительность (10 слов).",
                  "en": "Server, cloud, performance & backups (10 words).",
                  "he": "שרת, ענן, ביצועים וגיבוי (10 מילים)."
                },
                "words": [
                  {
                    "raw": "el servidor",
                    "word": "servidor",
                    "withArticle": "el servidor",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "сервер",
                      "en": "server",
                      "he": "שרת"
                    }
                  },
                  {
                    "raw": "la nube",
                    "word": "nube",
                    "withArticle": "la nube",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "облако",
                      "en": "cloud",
                      "he": "ענן"
                    }
                  },
                  {
                    "raw": "el rendimiento",
                    "word": "rendimiento",
                    "withArticle": "el rendimiento",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "производительность",
                      "en": "performance",
                      "he": "ביצועים"
                    }
                  },
                  {
                    "raw": "el respaldo",
                    "word": "respaldo",
                    "withArticle": "el respaldo",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "резервная копия",
                      "en": "backup",
                      "he": "גיבוי"
                    }
                  },
                  {
                    "raw": "la red",
                    "word": "red",
                    "withArticle": "la red",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "сеть",
                      "en": "network",
                      "he": "רשת"
                    }
                  },
                  {
                    "raw": "desplegar",
                    "word": "desplegar",
                    "withArticle": "desplegar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "деплоить, развёртывать",
                      "en": "to deploy",
                      "he": "לפרוס"
                    }
                  },
                  {
                    "raw": "actualizar",
                    "word": "actualizar",
                    "withArticle": "actualizar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "обновлять",
                      "en": "to update",
                      "he": "לעדכן"
                    }
                  },
                  {
                    "raw": "conectar",
                    "word": "conectar",
                    "withArticle": "conectar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "подключать",
                      "en": "to connect",
                      "he": "לחבר"
                    }
                  },
                  {
                    "raw": "escalable",
                    "word": "escalable",
                    "withArticle": "escalable",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "масштабируемый",
                      "en": "scalable",
                      "he": "ניתן להרחבה"
                    }
                  },
                  {
                    "raw": "disponible",
                    "word": "disponible",
                    "withArticle": "disponible",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "доступный",
                      "en": "available",
                      "he": "זמין"
                    }
                  }
                ]
              },
              {
                "id": "es-it-m1-l3",
                "speedMultiplier": 0.98,
                "spawnIntervalMs": 2600,
                "titles": {
                  "ru": "Безопасность данных",
                  "en": "Data Security",
                  "he": "אבטחת נתונים"
                },
                "descriptions": {
                  "ru": "Пароль, шифрование, доступ и пользователь (10 слов).",
                  "en": "Password, encryption, access & user (10 words).",
                  "he": "סיסמה, הצפנה, גישה ומשתמש (10 מילים)."
                },
                "words": [
                  {
                    "raw": "la contraseña",
                    "word": "contraseña",
                    "withArticle": "la contraseña",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "пароль",
                      "en": "password",
                      "he": "סיסמה"
                    }
                  },
                  {
                    "raw": "la seguridad",
                    "word": "seguridad",
                    "withArticle": "la seguridad",
                    "article": "la",
                    "plural": "",
                    "translations": {
                      "ru": "безопасность",
                      "en": "security",
                      "he": "אבטחה"
                    }
                  },
                  {
                    "raw": "el usuario",
                    "word": "usuario",
                    "withArticle": "el usuario",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "пользователь",
                      "en": "user",
                      "he": "משתמש"
                    }
                  },
                  {
                    "raw": "el acceso",
                    "word": "acceso",
                    "withArticle": "el acceso",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "доступ",
                      "en": "access",
                      "he": "גישה"
                    }
                  },
                  {
                    "raw": "el permiso",
                    "word": "permiso",
                    "withArticle": "el permiso",
                    "article": "el",
                    "plural": "",
                    "translations": {
                      "ru": "разрешение",
                      "en": "permission",
                      "he": "הרשאה"
                    }
                  },
                  {
                    "raw": "cifrar",
                    "word": "cifrar",
                    "withArticle": "cifrar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "шифровать",
                      "en": "to encrypt",
                      "he": "להצפין"
                    }
                  },
                  {
                    "raw": "proteger",
                    "word": "proteger",
                    "withArticle": "proteger",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "защищать",
                      "en": "to protect",
                      "he": "להגן"
                    }
                  },
                  {
                    "raw": "verificar",
                    "word": "verificar",
                    "withArticle": "verificar",
                    "article": "Verbo",
                    "plural": "",
                    "translations": {
                      "ru": "проверять, верифицировать",
                      "en": "to verify",
                      "he": "לאמת"
                    }
                  },
                  {
                    "raw": "privado",
                    "word": "privado",
                    "withArticle": "privado",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "приватный, закрытый",
                      "en": "private",
                      "he": "פרטי"
                    }
                  },
                  {
                    "raw": "confiable",
                    "word": "confiable",
                    "withArticle": "confiable",
                    "article": "Adj.",
                    "plural": "",
                    "translations": {
                      "ru": "надёжный",
                      "en": "trustworthy, reliable",
                      "he": "אמין"
                    }
                  }
                ]
              },
              {
                "id": "es-it-m1-boss",
                "isBoss": true,
                "speedMultiplier": 1.04,
                "spawnIntervalMs": 2500,
                "titles": {
                  "ru": "👹 Босс-урок: Lanzamiento Tech",
                  "en": "👹 Boss Review: Tech Launch",
                  "he": "👹 שלב בוס: השקה טכנולוגית"
                },
                "descriptions": {
                  "ru": "Босс-повторение испанской IT-лексики!",
                  "en": "Boss review across Spanish Software, Cloud & Security!",
                  "he": "סיכום בוס של מונחי ההייטק בספרדית!"
                },
                "words": []
              }
            ]
          }
        ]
      }
    ]
  }
};
