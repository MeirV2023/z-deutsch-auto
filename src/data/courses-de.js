// Официальные встроенные курсы Z-LINGO: Немецкий (DE)

export const COURSES_DE = [
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
    ],
    "category": "auto"
  },
  {
    "id": "de-business-existenz",
    "targetLang": "de",
    "category": "business",
    "source": "official",
    "icon": "💼",
    "levelTag": "B1",
    "titles": {
      "ru": "Existenzgründung: Открытие своего дела",
      "en": "Existenzgründung: Starting a Business",
      "he": "Existenzgründung: הקמת עסק עצמאי"
    },
    "descriptions": {
      "ru": "Полный курс B1 по предпринимательству (69 слов и выражений): бизнес-план, кредит, налоговая, WKO, субсидии и управление.",
      "en": "Complete 69-word B1 entrepreneurship course: business plan, loans, tax office, WKO, grants & management.",
      "he": "קורס B1 מלא ליזמות והקמת עסק (69 מילים וביטויים): תוכנית עסקית, אשראי, רשויות המס, סובסידיות וניהול."
    },
    "modules": [
      {
        "id": "de-business-existenz-m1",
        "titles": {
          "ru": "Модуль 1: Старт, управление и бизнес-идея",
          "en": "Module 1: Launch, Leadership & Business Idea",
          "he": "מודול 1: הקמה, ניהול ורעיון עסקי"
        },
        "lessons": [
          {
            "id": "de-business-existenz-m1-l1",
            "speedMultiplier": 0.9,
            "spawnIntervalMs": 2800,
            "titles": {
              "ru": "Старт и ответственность",
              "en": "Launch & Responsibility",
              "he": "התחלה ואחריות"
            },
            "descriptions": {
              "ru": "Открытие дела, владелец, руководство и принятие решений (12 слов).",
              "en": "Starting out, ownership, leadership & decision-making (12 words).",
              "he": "פתיחת עסק, בעלות, ניהול וקבלת החלטות (12 מילים)."
            },
            "words": [
              {
                "raw": "der Start, -s",
                "word": "Start",
                "withArticle": "der Start",
                "article": "der",
                "plural": "-s",
                "translations": {
                  "ru": "старт, начало",
                  "en": "start, launch",
                  "he": "התחלה, הזנקה"
                }
              },
              {
                "raw": "der/die Inhaber/in (-/-nen)",
                "word": "Inhaber",
                "withArticle": "der Inhaber",
                "article": "der/die",
                "plural": "-/-nen",
                "translations": {
                  "ru": "владелец / владелица",
                  "en": "owner, proprietor",
                  "he": "בעלים (של עסק)"
                }
              },
              {
                "raw": "leiten",
                "word": "leiten",
                "withArticle": "leiten",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "руководить, управлять",
                  "en": "to lead, manage",
                  "he": "לנהל, להוביל"
                }
              },
              {
                "raw": "reichen",
                "word": "reichen",
                "withArticle": "reichen",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "хватать, быть достаточным, простираться",
                  "en": "to be enough, suffice",
                  "he": "להספיק"
                }
              },
              {
                "raw": "hart",
                "word": "hart",
                "withArticle": "hart",
                "article": "Adj.",
                "plural": "",
                "translations": {
                  "ru": "жёсткий, трудный, суровый",
                  "en": "hard, tough",
                  "he": "קשה, קשוח"
                }
              },
              {
                "raw": "weiterempfehlen",
                "word": "weiterempfehlen",
                "withArticle": "weiterempfehlen",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "рекомендовать дальше, советовать",
                  "en": "to recommend to others",
                  "he": "להמליץ הלאה"
                }
              },
              {
                "raw": "die Verantwortung (Sg.)",
                "word": "Verantwortung",
                "withArticle": "die Verantwortung",
                "article": "die",
                "plural": "Sg.",
                "translations": {
                  "ru": "ответственность",
                  "en": "responsibility",
                  "he": "אחריות"
                }
              },
              {
                "raw": "Verantwortung tragen",
                "word": "Verantwortung tragen",
                "withArticle": "Verantwortung tragen",
                "article": "Phrase",
                "plural": "",
                "translations": {
                  "ru": "нести ответственность",
                  "en": "to bear responsibility",
                  "he": "לשאת באחריות"
                }
              },
              {
                "raw": "Entscheidungen treffen",
                "word": "Entscheidungen treffen",
                "withArticle": "Entscheidungen treffen",
                "article": "Phrase",
                "plural": "",
                "translations": {
                  "ru": "принимать решения",
                  "en": "to make decisions",
                  "he": "לקבל החלטות"
                }
              },
              {
                "raw": "sich selbstständig machen",
                "word": "selbstständig machen",
                "withArticle": "sich selbstständig machen",
                "article": "sich",
                "plural": "",
                "translations": {
                  "ru": "стать самостоятельным / открыть своё дело",
                  "en": "to become self-employed / start a business",
                  "he": "להפוך לעצמאי / לפתוח עסק"
                }
              },
              {
                "raw": "das Berufsleben (Sg.)",
                "word": "Berufsleben",
                "withArticle": "das Berufsleben",
                "article": "das",
                "plural": "Sg.",
                "translations": {
                  "ru": "профессиональная жизнь",
                  "en": "working life, professional life",
                  "he": "חיים מקצועיים"
                }
              },
              {
                "raw": "der/die Existenzgründer/in (-/-nen)",
                "word": "Existenzgründer",
                "withArticle": "der Existenzgründer",
                "article": "der/die",
                "plural": "-/-nen",
                "translations": {
                  "ru": "основатель собственного дела / предприниматель",
                  "en": "business founder, startup entrepreneur",
                  "he": "מייסד/ת עסק חדש, יזם"
                }
              }
            ]
          },
          {
            "id": "de-business-existenz-m1-l2",
            "speedMultiplier": 0.92,
            "spawnIntervalMs": 2750,
            "titles": {
              "ru": "Бизнес-план, офис и кредит",
              "en": "Business Plan, Office & Loan",
              "he": "תוכנית עסקית, משרד ואשראי"
            },
            "descriptions": {
              "ru": "Помещение, филиал, взятие кредита и трудовое право (12 слов).",
              "en": "Premises, branch office, taking a loan & labor law (12 words).",
              "he": "משרד, סניף, נטילת הלוואה ודיני עבודה (12 מילים)."
            },
            "words": [
              {
                "raw": "die Unternehmensführung (Sg.)",
                "word": "Unternehmensführung",
                "withArticle": "die Unternehmensführung",
                "article": "die",
                "plural": "Sg.",
                "translations": {
                  "ru": "управление предприятием",
                  "en": "corporate management, business leadership",
                  "he": "ניהול חברה / עסק"
                }
              },
              {
                "raw": "Das Geschäft läuft gut.",
                "word": "Das Geschäft läuft gut",
                "withArticle": "Das Geschäft läuft gut",
                "article": "Satz",
                "plural": "",
                "translations": {
                  "ru": "Дела идут хорошо. / Бизнес идёт хорошо.",
                  "en": "Business is going well.",
                  "he": "העסק מתנהל היטב."
                }
              },
              {
                "raw": "die Geschäftsidee, -n",
                "word": "Geschäftsidee",
                "withArticle": "die Geschäftsidee",
                "article": "die",
                "plural": "-n",
                "translations": {
                  "ru": "бизнес-идея",
                  "en": "business idea",
                  "he": "רעיון עסקי"
                }
              },
              {
                "raw": "der Businessplan, -e",
                "word": "Businessplan",
                "withArticle": "der Businessplan",
                "article": "der",
                "plural": "-e",
                "translations": {
                  "ru": "бизнес-план",
                  "en": "business plan",
                  "he": "תוכנית עסקית"
                }
              },
              {
                "raw": "der Geschäftsraum, -e",
                "word": "Geschäftsraum",
                "withArticle": "der Geschäftsraum",
                "article": "der",
                "plural": "-e",
                "translations": {
                  "ru": "торговое / офисное помещение",
                  "en": "business premises, commercial space",
                  "he": "חלל עסקי / משרד"
                }
              },
              {
                "raw": "die Niederlassung, -en",
                "word": "Niederlassung",
                "withArticle": "die Niederlassung",
                "article": "die",
                "plural": "-en",
                "translations": {
                  "ru": "филиал, отделение",
                  "en": "branch office, subsidiary",
                  "he": "סניף, שלוחה"
                }
              },
              {
                "raw": "die Arbeitsstelle, -n",
                "word": "Arbeitsstelle",
                "withArticle": "die Arbeitsstelle",
                "article": "die",
                "plural": "-n",
                "translations": {
                  "ru": "рабочее место",
                  "en": "job, workplace",
                  "he": "מקום עבודה, משרה"
                }
              },
              {
                "raw": "einen Kredit aufnehmen",
                "word": "einen Kredit aufnehmen",
                "withArticle": "einen Kredit aufnehmen",
                "article": "Phrase",
                "plural": "",
                "translations": {
                  "ru": "взять кредит",
                  "en": "to take out a loan",
                  "he": "לקחת הלוואה"
                }
              },
              {
                "raw": "das Arbeitsrecht (Sg.)",
                "word": "Arbeitsrecht",
                "withArticle": "das Arbeitsrecht",
                "article": "das",
                "plural": "Sg.",
                "translations": {
                  "ru": "трудовое право",
                  "en": "labor law, employment law",
                  "he": "דיני עבודה"
                }
              },
              {
                "raw": "schwerfallen",
                "word": "schwerfallen",
                "withArticle": "schwerfallen",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "даваться с трудом",
                  "en": "to be difficult (for someone)",
                  "he": "להיות קשה לביצוע"
                }
              },
              {
                "raw": "schließend",
                "word": "schließend",
                "withArticle": "schließend",
                "article": "Adv.",
                "plural": "",
                "translations": {
                  "ru": "в заключение, наконец",
                  "en": "concluding, finally",
                  "he": "לסיכום, לבסוף"
                }
              },
              {
                "raw": "beschließen",
                "word": "beschließen",
                "withArticle": "beschließen",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "решать, постановлять",
                  "en": "to decide, resolve",
                  "he": "להחליט, לקבוע"
                }
              }
            ]
          },
          {
            "id": "de-business-existenz-m1-l3",
            "speedMultiplier": 0.94,
            "spawnIntervalMs": 2700,
            "titles": {
              "ru": "Развитие и окупаемость",
              "en": "Development & Payoff",
              "he": "פיתוח וכדאיות"
            },
            "descriptions": {
              "ru": "Разработка продукта, конгресс, исполнение мечты и окупаемость (12 слов).",
              "en": "Developing ideas, congresses, fulfilling goals & paying off (12 words).",
              "he": "פיתוח רעיונות, כנסים, הגשמת מטרות וכדאיות (12 מילים)."
            },
            "words": [
              {
                "raw": "der Beginn (Sg.)",
                "word": "Beginn",
                "withArticle": "der Beginn",
                "article": "der",
                "plural": "Sg.",
                "translations": {
                  "ru": "начало",
                  "en": "beginning, start",
                  "he": "התחלה, ראשית"
                }
              },
              {
                "raw": "der Kongress, -e",
                "word": "Kongress",
                "withArticle": "der Kongress",
                "article": "der",
                "plural": "-e",
                "translations": {
                  "ru": "конгресс, съезд",
                  "en": "congress, convention",
                  "he": "קונגרס, כנס"
                }
              },
              {
                "raw": "stolz",
                "word": "stolz",
                "withArticle": "stolz",
                "article": "Adj.",
                "plural": "",
                "translations": {
                  "ru": "гордый",
                  "en": "proud",
                  "he": "גאה"
                }
              },
              {
                "raw": "einen Wunsch erfüllen",
                "word": "einen Wunsch erfüllen",
                "withArticle": "einen Wunsch erfüllen",
                "article": "Phrase",
                "plural": "",
                "translations": {
                  "ru": "исполнить желание",
                  "en": "to fulfill a wish",
                  "he": "להגשים משאלה"
                }
              },
              {
                "raw": "frisch",
                "word": "frisch",
                "withArticle": "frisch",
                "article": "Adj.",
                "plural": "",
                "translations": {
                  "ru": "свежий",
                  "en": "fresh",
                  "he": "טרי, רענן"
                }
              },
              {
                "raw": "kaum",
                "word": "kaum",
                "withArticle": "kaum",
                "article": "Adv.",
                "plural": "",
                "translations": {
                  "ru": "едва, почти не",
                  "en": "hardly, barely",
                  "he": "בקושי, כמעט ולא"
                }
              },
              {
                "raw": "entwickeln",
                "word": "entwickeln",
                "withArticle": "entwickeln",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "развивать, разрабатывать",
                  "en": "to develop, design",
                  "he": "לפתח"
                }
              },
              {
                "raw": "sich lohnen",
                "word": "lohnen",
                "withArticle": "sich lohnen",
                "article": "sich",
                "plural": "",
                "translations": {
                  "ru": "окупаться, стоить того",
                  "en": "to be worth it, pay off",
                  "he": "להשתלם, להיות כדאי"
                }
              },
              {
                "raw": "ziemlich",
                "word": "ziemlich",
                "withArticle": "ziemlich",
                "article": "Adv.",
                "plural": "",
                "translations": {
                  "ru": "довольно, достаточно",
                  "en": "quite, fairly",
                  "he": "די, למדי"
                }
              },
              {
                "raw": "inzwischen",
                "word": "inzwischen",
                "withArticle": "inzwischen",
                "article": "Adv.",
                "plural": "",
                "translations": {
                  "ru": "тем временем, между тем",
                  "en": "meanwhile, in the meantime",
                  "he": "בינתיים"
                }
              },
              {
                "raw": "überraschen",
                "word": "überraschen",
                "withArticle": "überraschen",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "удивлять, поражать",
                  "en": "to surprise, amaze",
                  "he": "להפתיע"
                }
              },
              {
                "raw": "der Senf (Sg.)",
                "word": "Senf",
                "withArticle": "der Senf",
                "article": "der",
                "plural": "Sg.",
                "translations": {
                  "ru": "горчица",
                  "en": "mustard",
                  "he": "חרדל"
                }
              }
            ]
          },
          {
            "id": "de-business-existenz-m1-boss",
            "isBoss": true,
            "speedMultiplier": 1.0,
            "spawnIntervalMs": 2550,
            "titles": {
              "ru": "👹 Босс-урок: Старт бизнеса",
              "en": "👹 Boss Review: Startup Launch",
              "he": "👹 שלב בוס: הקמת העסק"
            },
            "descriptions": {
              "ru": "Проверка первых 36 слов и выражений по открытию своего дела!",
              "en": "Boss review of the first 36 startup & leadership expressions!",
              "he": "חזרת בוס על 36 המילים הראשונות בנושא הקמת עסק!"
            },
            "words": []
          }
        ]
      },
      {
        "id": "de-business-existenz-m2",
        "titles": {
          "ru": "Модуль 2: Госорганы, консалтинг и капитал",
          "en": "Module 2: Authorities, Consulting & Capital",
          "he": "מודול 2: רשויות, ייעוץ והון עצמי"
        },
        "lessons": [
          {
            "id": "de-business-existenz-m2-l1",
            "speedMultiplier": 0.92,
            "spawnIntervalMs": 2750,
            "titles": {
              "ru": "Налоговая, WKO и отрасль",
              "en": "Tax Office, WKO & Sector",
              "he": "רשות המסים, לשכת המסחר והענף"
            },
            "descriptions": {
              "ru": "Регистрация промысла, Finanzamt, WKO, инвестиции и планирование (11 слов).",
              "en": "Trade registration, tax office, WKO, investment & planning (11 words).",
              "he": "רישום עסק, מס הכנסה, לשכת המסחר, השקעות ותכנון (11 מילים)."
            },
            "words": [
              {
                "raw": "das Finanzamt, -er",
                "word": "Finanzamt",
                "withArticle": "das Finanzamt",
                "article": "das",
                "plural": "-er",
                "translations": {
                  "ru": "налоговая инспекция",
                  "en": "tax office, revenue authority",
                  "he": "משרד המס / רשות המסים"
                }
              },
              {
                "raw": "das Gewerbe, -",
                "word": "Gewerbe",
                "withArticle": "das Gewerbe",
                "article": "das",
                "plural": "-",
                "translations": {
                  "ru": "промысел, ремесло, предпринимательская деятельность",
                  "en": "trade, registered business",
                  "he": "עסק רשום, משלח יד"
                }
              },
              {
                "raw": "der Existenzgründerkurs, -e",
                "word": "Existenzgründerkurs",
                "withArticle": "der Existenzgründerkurs",
                "article": "der",
                "plural": "-e",
                "translations": {
                  "ru": "курс для начинающих предпринимателей",
                  "en": "business founder training course",
                  "he": "קורס ליזמים מתחילים"
                }
              },
              {
                "raw": "WKO (Wirtschaftskammer)",
                "word": "WKO",
                "withArticle": "die Wirtschaftskammer",
                "article": "DE",
                "plural": "",
                "translations": {
                  "ru": "Торгово-промышленная палата (Австрия)",
                  "en": "Austrian Chamber of Commerce (WKO)",
                  "he": "לשכת המסחר (אוסטריה)"
                }
              },
              {
                "raw": "investieren",
                "word": "investieren",
                "withArticle": "investieren",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "инвестировать",
                  "en": "to invest",
                  "he": "להשקיע"
                }
              },
              {
                "raw": "einrichten",
                "word": "einrichten",
                "withArticle": "einrichten",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "оборудовать, обустраивать, открывать (дело)",
                  "en": "to set up, furnish, establish",
                  "he": "להקים, לאבזר, לסדר"
                }
              },
              {
                "raw": "die Finanzierung, -en",
                "word": "Finanzierung",
                "withArticle": "die Finanzierung",
                "article": "die",
                "plural": "-en",
                "translations": {
                  "ru": "финансирование",
                  "en": "financing, funding",
                  "he": "מימון"
                }
              },
              {
                "raw": "die Planung, -en",
                "word": "Planung",
                "withArticle": "die Planung",
                "article": "die",
                "plural": "-en",
                "translations": {
                  "ru": "планирование",
                  "en": "planning",
                  "he": "תכנון"
                }
              },
              {
                "raw": "fachlich",
                "word": "fachlich",
                "withArticle": "fachlich",
                "article": "Adj.",
                "plural": "",
                "translations": {
                  "ru": "профессиональный, по специальности",
                  "en": "professional, technical, specialist",
                  "he": "מקצועי, תחומי"
                }
              },
              {
                "raw": "die Branche, -n",
                "word": "Branche",
                "withArticle": "die Branche",
                "article": "die",
                "plural": "-n",
                "translations": {
                  "ru": "отрасль, сфера деятельности",
                  "en": "industry, sector",
                  "he": "ענף, תחום עסקי"
                }
              },
              {
                "raw": "das Ziel, -e",
                "word": "Ziel",
                "withArticle": "das Ziel",
                "article": "das",
                "plural": "-e",
                "translations": {
                  "ru": "цель",
                  "en": "goal, target",
                  "he": "מטרה, יעד"
                }
              }
            ]
          },
          {
            "id": "de-business-existenz-m2-l2",
            "speedMultiplier": 0.94,
            "spawnIntervalMs": 2700,
            "titles": {
              "ru": "Эксперты, обучение и финансы",
              "en": "Experts, Training & Finances",
              "he": "מומחים, הכשרה ופיננסים"
            },
            "descriptions": {
              "ru": "Достижение целей, советы экспертов и повышение квалификации (11 слов).",
              "en": "Reaching goals, expert advice & further training programs (11 words).",
              "he": "השגת יעדים, עצות מומחים והשתלמויות מקצועיות (11 מילים)."
            },
            "words": [
              {
                "raw": "ein Ziel erreichen",
                "word": "ein Ziel erreichen",
                "withArticle": "ein Ziel erreichen",
                "article": "Phrase",
                "plural": "",
                "translations": {
                  "ru": "достичь цели",
                  "en": "to achieve a goal",
                  "he": "להשיג מטרה"
                }
              },
              {
                "raw": "entscheiden",
                "word": "entscheiden",
                "withArticle": "entscheiden",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "решать",
                  "en": "to decide",
                  "he": "להחליט"
                }
              },
              {
                "raw": "der Ratschlag, -e",
                "word": "Ratschlag",
                "withArticle": "der Ratschlag",
                "article": "der",
                "plural": "-e",
                "translations": {
                  "ru": "совет",
                  "en": "piece of advice",
                  "he": "עצה"
                }
              },
              {
                "raw": "sich auskennen",
                "word": "auskennen",
                "withArticle": "sich auskennen",
                "article": "sich",
                "plural": "",
                "translations": {
                  "ru": "разбираться, хорошо ориентироваться",
                  "en": "to know one's way around, be well-versed",
                  "he": "להתמצא היטב, להבין בתחום"
                }
              },
              {
                "raw": "versuchen",
                "word": "versuchen",
                "withArticle": "versuchen",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "пытаться, пробовать",
                  "en": "to try, attempt",
                  "he": "לנסות"
                }
              },
              {
                "raw": "beantworten",
                "word": "beantworten",
                "withArticle": "beantworten",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "отвечать (на вопрос)",
                  "en": "to answer (a question)",
                  "he": "לענות (על שאלה)"
                }
              },
              {
                "raw": "der/die Experte/Expertin (-n/-nen)",
                "word": "Experte",
                "withArticle": "der Experte",
                "article": "der/die",
                "plural": "-n/-nen",
                "translations": {
                  "ru": "эксперт / экспертка",
                  "en": "expert, specialist",
                  "he": "מומחה / מומחית"
                }
              },
              {
                "raw": "das Weiterbildungsangebot, -e",
                "word": "Weiterbildungsangebot",
                "withArticle": "das Weiterbildungsangebot",
                "article": "das",
                "plural": "-e",
                "translations": {
                  "ru": "предложение по повышению квалификации",
                  "en": "further training offer / program",
                  "he": "הצעת הכשרה והשתלמות"
                }
              },
              {
                "raw": "die Finanzen (Pl.)",
                "word": "Finanzen",
                "withArticle": "die Finanzen",
                "article": "die",
                "plural": "Pl.",
                "translations": {
                  "ru": "финансы",
                  "en": "finances",
                  "he": "פיננסים, כספים"
                }
              },
              {
                "raw": "die Anregung, -en",
                "word": "Anregung",
                "withArticle": "die Anregung",
                "article": "die",
                "plural": "-en",
                "translations": {
                  "ru": "стимул, импульс, предложение",
                  "en": "suggestion, inspiration, stimulus",
                  "he": "הצעה, השראה, תמריץ"
                }
              },
              {
                "raw": "der Plan, -e",
                "word": "Plan",
                "withArticle": "der Plan",
                "article": "der",
                "plural": "-e",
                "translations": {
                  "ru": "план",
                  "en": "plan",
                  "he": "תוכנית"
                }
              }
            ]
          },
          {
            "id": "de-business-existenz-m2-l3",
            "speedMultiplier": 0.95,
            "spawnIntervalMs": 2650,
            "titles": {
              "ru": "Субсидии, капитал и документы",
              "en": "Grants, Equity & Documents",
              "he": "מענקים, הון עצמי ומסמכים"
            },
            "descriptions": {
              "ru": "Услуги, программы поддержки, поставщики, капитал и погашение долгов (11 слов).",
              "en": "Services, grant programs, suppliers, equity & repaying debts (11 words).",
              "he": "שירותים, תוכניות תמיכה, ספקים, הון עצמי ופירעון חובות (11 מילים)."
            },
            "words": [
              {
                "raw": "die Dienstleistung, -en",
                "word": "Dienstleistung",
                "withArticle": "die Dienstleistung",
                "article": "die",
                "plural": "-en",
                "translations": {
                  "ru": "услуга",
                  "en": "service",
                  "he": "שירות"
                }
              },
              {
                "raw": "der Geschäftsplan, -e",
                "word": "Geschäftsplan",
                "withArticle": "der Geschäftsplan",
                "article": "der",
                "plural": "-e",
                "translations": {
                  "ru": "бизнес-план",
                  "en": "business plan (operational)",
                  "he": "תוכנית עסקית"
                }
              },
              {
                "raw": "der/die Unternehmer/in (-/-nen)",
                "word": "Unternehmer",
                "withArticle": "der Unternehmer",
                "article": "der/die",
                "plural": "-/-nen",
                "translations": {
                  "ru": "предприниматель / предпринимательница",
                  "en": "entrepreneur, business owner",
                  "he": "יזם / יזמית, בעל עסק"
                }
              },
              {
                "raw": "das Förderprogramm, -e",
                "word": "Förderprogramm",
                "withArticle": "das Förderprogramm",
                "article": "das",
                "plural": "-e",
                "translations": {
                  "ru": "программа поддержки / субсидирования",
                  "en": "grant / funding support program",
                  "he": "תוכנית סיוע ומימון"
                }
              },
              {
                "raw": "der/die Finanzberater/in (-/-nen)",
                "word": "Finanzberater",
                "withArticle": "der Finanzberater",
                "article": "der/die",
                "plural": "-/-nen",
                "translations": {
                  "ru": "финансовый консультант / консультантка",
                  "en": "financial advisor",
                  "he": "יועץ / יועצת פיננסיים"
                }
              },
              {
                "raw": "der Standort, -e",
                "word": "Standort",
                "withArticle": "der Standort",
                "article": "der",
                "plural": "-e",
                "translations": {
                  "ru": "местоположение, площадка",
                  "en": "location, business site",
                  "he": "מיקום, אתר פעילות"
                }
              },
              {
                "raw": "der/die Lieferant/in (-en/-nen)",
                "word": "Lieferant",
                "withArticle": "der Lieferant",
                "article": "der/die",
                "plural": "-en/-nen",
                "translations": {
                  "ru": "поставщик / поставщица",
                  "en": "supplier, vendor",
                  "he": "ספק / ספקית"
                }
              },
              {
                "raw": "das Eigenkapital (Sg.)",
                "word": "Eigenkapital",
                "withArticle": "das Eigenkapital",
                "article": "das",
                "plural": "Sg.",
                "translations": {
                  "ru": "собственный капитал",
                  "en": "equity, own capital",
                  "he": "הון עצמי"
                }
              },
              {
                "raw": "die Schulden (Pl.)",
                "word": "Schulden",
                "withArticle": "die Schulden",
                "article": "die",
                "plural": "Pl.",
                "translations": {
                  "ru": "долги",
                  "en": "debts",
                  "he": "חובות"
                }
              },
              {
                "raw": "zurückzahlen",
                "word": "zurückzahlen",
                "withArticle": "zurückzahlen",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "возвращать (деньги), погашать",
                  "en": "to pay back, repay",
                  "he": "להחזיר הלוואה, לפרוע"
                }
              },
              {
                "raw": "die Unterlagen (Pl.)",
                "word": "Unterlagen",
                "withArticle": "die Unterlagen",
                "article": "die",
                "plural": "Pl.",
                "translations": {
                  "ru": "документы, бумаги",
                  "en": "documents, paperwork",
                  "he": "מסמכים, ניירת"
                }
              }
            ]
          },
          {
            "id": "de-business-existenz-m2-boss",
            "isBoss": true,
            "speedMultiplier": 1.02,
            "spawnIntervalMs": 2500,
            "titles": {
              "ru": "👹 Босс-урок: Экзамен предпринимателя",
              "en": "👹 Boss Review: Entrepreneur Exam",
              "he": "👹 שלב בוס: מבחן היזם"
            },
            "descriptions": {
              "ru": "Финальный экзамен по финансам, госорганам и управлению бизнесом!",
              "en": "Final boss check on business finance, authorities & operations!",
              "he": "מבחן בוס מסכם על פיננסים, רשויות וניהול עסק!"
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
    ],
    "category": "base"
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
    ],
    "category": "it"
  },
  {
    "id": "de-finance",
    "targetLang": "de",
    "category": "finance",
    "source": "official",
    "icon": "🪙",
    "levelTag": "B1",
    "titles": {
      "ru": "Финансы и покупки",
      "en": "Finance & Banking",
      "he": "פיננסים וקניות"
    },
    "descriptions": {
      "ru": "Деньги, банковский счёт, карты, скидки и оплата (20 слов).",
      "en": "Money, bank accounts, cards, discounts & payments (20 words).",
      "he": "כסף, חשבון בנק, כרטיסים, הנחות ותשלומים (20 מילים)."
    },
    "modules": [
      {
        "id": "de-finance-m1",
        "titles": {
          "ru": "Финансы и покупки",
          "en": "Finance & Banking",
          "he": "פיננסים וקניות"
        },
        "lessons": [
          {
            "id": "de-finance-m1-l1",
            "isBoss": false,
            "speedMultiplier": 0.96,
            "spawnIntervalMs": 2700,
            "titles": {
              "ru": "Банк, счёт и перевод",
              "en": "Bank, Account & Transfer",
              "he": "בנק, חשבון והעברה"
            },
            "descriptions": {
              "ru": "Деньги, банковский счёт, карты, скидки и оплата (20 слов).",
              "en": "Money, bank accounts, cards, discounts & payments (20 words).",
              "he": "כסף, חשבון בנק, כרטיסים, הנחות ותשלומים (20 מילים)."
            },
            "words": [
              {
                "raw": "das Konto, Konten",
                "word": "Konto",
                "withArticle": "das Konto",
                "article": "das",
                "plural": "",
                "translations": {
                  "ru": "банковский счёт",
                  "en": "bank account",
                  "he": "חשבון בנק"
                }
              },
              {
                "raw": "die Überweisung, -en",
                "word": "Überweisung",
                "withArticle": "die Überweisung",
                "article": "die",
                "plural": "",
                "translations": {
                  "ru": "банковский перевод",
                  "en": "bank transfer",
                  "he": "העברה בנקאית"
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
                "raw": "die Gebühr, -en",
                "word": "Gebühr",
                "withArticle": "die Gebühr",
                "article": "die",
                "plural": "",
                "translations": {
                  "ru": "комиссия, сбор",
                  "en": "fee, charge",
                  "he": "עמלה"
                }
              },
              {
                "raw": "abheben",
                "word": "abheben",
                "withArticle": "abheben",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "снимать (деньги)",
                  "en": "to withdraw",
                  "he": "למשוך כסף"
                }
              },
              {
                "raw": "überweisen",
                "word": "überweisen",
                "withArticle": "überweisen",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "переводить (деньги)",
                  "en": "to transfer",
                  "he": "להעביר כסף"
                }
              },
              {
                "raw": "sparen",
                "word": "sparen",
                "withArticle": "sparen",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "копить, экономить",
                  "en": "to save money",
                  "he": "לחסוך"
                }
              },
              {
                "raw": "die Zinsen, Pl.",
                "word": "Zinsen",
                "withArticle": "die Zinsen",
                "article": "Pl.",
                "plural": "",
                "translations": {
                  "ru": "проценты (по вкладу/кредиту)",
                  "en": "interest",
                  "he": "ריבית"
                }
              },
              {
                "raw": "der Geldautomat, -en",
                "word": "Geldautomat",
                "withArticle": "der Geldautomat",
                "article": "der",
                "plural": "",
                "translations": {
                  "ru": "банкомат",
                  "en": "ATM",
                  "he": "כספומט"
                }
              },
              {
                "raw": "die Steuer, -n",
                "word": "Steuer",
                "withArticle": "die Steuer",
                "article": "die",
                "plural": "",
                "translations": {
                  "ru": "налог",
                  "en": "tax",
                  "he": "מס"
                }
              }
            ]
          },
          {
            "id": "de-finance-m1-l2",
            "isBoss": false,
            "speedMultiplier": 1.0,
            "spawnIntervalMs": 2600,
            "titles": {
              "ru": "Покупки, чек и бюджет",
              "en": "Shopping, Receipt & Budget",
              "he": "קניות, קבלה ותקציב"
            },
            "descriptions": {
              "ru": "Деньги, банковский счёт, карты, скидки и оплата (20 слов).",
              "en": "Money, bank accounts, cards, discounts & payments (20 words).",
              "he": "כסף, חשבון בנק, כרטיסים, הנחות ותשלומים (20 מילים)."
            },
            "words": [
              {
                "raw": "die Quittung, -en",
                "word": "Quittung",
                "withArticle": "die Quittung",
                "article": "die",
                "plural": "",
                "translations": {
                  "ru": "квитанция, чек",
                  "en": "receipt",
                  "he": "קבלה"
                }
              },
              {
                "raw": "der Rabatt, -e",
                "word": "Rabatt",
                "withArticle": "der Rabatt",
                "article": "der",
                "plural": "",
                "translations": {
                  "ru": "скидка",
                  "en": "discount",
                  "he": "הנחה"
                }
              },
              {
                "raw": "die Rechnung, -en",
                "word": "Rechnung",
                "withArticle": "die Rechnung",
                "article": "die",
                "plural": "",
                "translations": {
                  "ru": "счёт к оплате",
                  "en": "bill, invoice",
                  "he": "חשבון / חשבונית"
                }
              },
              {
                "raw": "ausgeben",
                "word": "ausgeben",
                "withArticle": "ausgeben",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "тратить (деньги)",
                  "en": "to spend",
                  "he": "להוציא כסף"
                }
              },
              {
                "raw": "bezahlen",
                "word": "bezahlen",
                "withArticle": "bezahlen",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "оплачивать",
                  "en": "to pay",
                  "he": "לשלם"
                }
              },
              {
                "raw": "kostenlos",
                "word": "kostenlos",
                "withArticle": "kostenlos",
                "article": "Adj.",
                "plural": "",
                "translations": {
                  "ru": "бесплатный",
                  "en": "free of charge",
                  "he": "חינם"
                }
              },
              {
                "raw": "günstig",
                "word": "günstig",
                "withArticle": "günstig",
                "article": "Adj.",
                "plural": "",
                "translations": {
                  "ru": "выгодный, недорогой",
                  "en": "affordable, good-value",
                  "he": "משתלם / זול"
                }
              },
              {
                "raw": "das Einkommen, -",
                "word": "Einkommen",
                "withArticle": "das Einkommen",
                "article": "das",
                "plural": "",
                "translations": {
                  "ru": "доход",
                  "en": "income",
                  "he": "הכנסה"
                }
              },
              {
                "raw": "die Schulden, Pl.",
                "word": "Schulden",
                "withArticle": "die Schulden",
                "article": "Pl.",
                "plural": "",
                "translations": {
                  "ru": "долги",
                  "en": "debts",
                  "he": "חובות"
                }
              },
              {
                "raw": "umtauschen",
                "word": "umtauschen",
                "withArticle": "umtauschen",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "обменивать (товар/валюту)",
                  "en": "to exchange",
                  "he": "להחליף"
                }
              }
            ]
          },
          {
            "id": "de-finance-m1-boss",
            "isBoss": true,
            "speedMultiplier": 1.05,
            "spawnIntervalMs": 2450,
            "titles": {
              "ru": "👹 Босс-урок: Финансовый контроль",
              "en": "👹 Boss Review: Financial Control",
              "he": "👹 שלב בוס: שליטה פיננסית"
            },
            "descriptions": {
              "ru": "Деньги, банковский счёт, карты, скидки и оплата (20 слов).",
              "en": "Money, bank accounts, cards, discounts & payments (20 words).",
              "he": "כסף, חשבון בנק, כרטיסים, הנחות ותשלומים (20 מילים)."
            },
            "words": []
          }
        ]
      }
    ]
  },
  {
    "id": "de-food",
    "targetLang": "de",
    "category": "food",
    "source": "official",
    "icon": "👨‍🍳",
    "levelTag": "A1–A2",
    "titles": {
      "ru": "Кухня и ресторан",
      "en": "Food & Kitchen",
      "he": "מטבח ומסעדות"
    },
    "descriptions": {
      "ru": "Еда, любимые блюда, рецепты и заказ в кафе (20 слов).",
      "en": "Meals, favorite dishes, recipes & ordering at a cafe (20 words).",
      "he": "אוכל, מנות, מתכונים והזמנה במסעדה (20 מילים)."
    },
    "modules": [
      {
        "id": "de-food-m1",
        "titles": {
          "ru": "Кухня и ресторан",
          "en": "Food & Kitchen",
          "he": "מטבח ומסעדות"
        },
        "lessons": [
          {
            "id": "de-food-m1-l1",
            "isBoss": false,
            "speedMultiplier": 0.96,
            "spawnIntervalMs": 2700,
            "titles": {
              "ru": "Продукты и готовка",
              "en": "Ingredients & Cooking",
              "he": "מצרכים ובישול"
            },
            "descriptions": {
              "ru": "Еда, любимые блюда, рецепты и заказ в кафе (20 слов).",
              "en": "Meals, favorite dishes, recipes & ordering at a cafe (20 words).",
              "he": "אוכל, מנות, מתכונים והזמנה במסעדה (20 מילים)."
            },
            "words": [
              {
                "raw": "das Rezept, -e",
                "word": "Rezept",
                "withArticle": "das Rezept",
                "article": "das",
                "plural": "",
                "translations": {
                  "ru": "рецепт",
                  "en": "recipe",
                  "he": "מתכון"
                }
              },
              {
                "raw": "das Gemüse, Sg.",
                "word": "Gemüse",
                "withArticle": "das Gemüse",
                "article": "das",
                "plural": "",
                "translations": {
                  "ru": "овощи",
                  "en": "vegetables",
                  "he": "ירקות"
                }
              },
              {
                "raw": "das Gewürz, -e",
                "word": "Gewürz",
                "withArticle": "das Gewürz",
                "article": "das",
                "plural": "",
                "translations": {
                  "ru": "специя, приправа",
                  "en": "spice, seasoning",
                  "he": "תבלין"
                }
              },
              {
                "raw": "die Pfanne, -n",
                "word": "Pfanne",
                "withArticle": "die Pfanne",
                "article": "die",
                "plural": "",
                "translations": {
                  "ru": "сковорода",
                  "en": "frying pan",
                  "he": "מחבת"
                }
              },
              {
                "raw": "braten",
                "word": "braten",
                "withArticle": "braten",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "жарить",
                  "en": "to fry, roast",
                  "he": "לטגן / לצלות"
                }
              },
              {
                "raw": "backen",
                "word": "backen",
                "withArticle": "backen",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "печь, запекать",
                  "en": "to bake",
                  "he": "לאפות"
                }
              },
              {
                "raw": "schneiden",
                "word": "schneiden",
                "withArticle": "schneiden",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "резать, нарезать",
                  "en": "to cut, slice",
                  "he": "לחתוך"
                }
              },
              {
                "raw": "lecker",
                "word": "lecker",
                "withArticle": "lecker",
                "article": "Adj.",
                "plural": "",
                "translations": {
                  "ru": "вкусный",
                  "en": "delicious",
                  "he": "טעים"
                }
              },
              {
                "raw": "salzig",
                "word": "salzig",
                "withArticle": "salzig",
                "article": "Adj.",
                "plural": "",
                "translations": {
                  "ru": "солёный",
                  "en": "salty",
                  "he": "מלוח"
                }
              },
              {
                "raw": "die Zutat, -en",
                "word": "Zutat",
                "withArticle": "die Zutat",
                "article": "die",
                "plural": "",
                "translations": {
                  "ru": "ингредиент",
                  "en": "ingredient",
                  "he": "מרכיב"
                }
              }
            ]
          },
          {
            "id": "de-food-m1-l2",
            "isBoss": false,
            "speedMultiplier": 1.0,
            "spawnIntervalMs": 2600,
            "titles": {
              "ru": "В кафе и ресторане",
              "en": "At a Cafe & Restaurant",
              "he": "בבית קפה ובמסעדה"
            },
            "descriptions": {
              "ru": "Еда, любимые блюда, рецепты и заказ в кафе (20 слов).",
              "en": "Meals, favorite dishes, recipes & ordering at a cafe (20 words).",
              "he": "אוכל, מנות, מתכונים והזמנה במסעדה (20 מילים)."
            },
            "words": [
              {
                "raw": "die Speisekarte, -n",
                "word": "Speisekarte",
                "withArticle": "die Speisekarte",
                "article": "die",
                "plural": "",
                "translations": {
                  "ru": "меню",
                  "en": "menu",
                  "he": "תפריט"
                }
              },
              {
                "raw": "das Gericht, -e",
                "word": "Gericht",
                "withArticle": "das Gericht",
                "article": "das",
                "plural": "",
                "translations": {
                  "ru": "блюдо",
                  "en": "dish",
                  "he": "מנה"
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
                "raw": "der Nachtisch, -e",
                "word": "Nachtisch",
                "withArticle": "der Nachtisch",
                "article": "der",
                "plural": "",
                "translations": {
                  "ru": "десерт",
                  "en": "dessert",
                  "he": "קינוח"
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
                  "en": "tip",
                  "he": "טיפ"
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
                "raw": "probieren",
                "word": "probieren",
                "withArticle": "probieren",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "пробовать",
                  "en": "to taste, try",
                  "he": "לטעום"
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
                "raw": "vegetarisch",
                "word": "vegetarisch",
                "withArticle": "vegetarisch",
                "article": "Adj.",
                "plural": "",
                "translations": {
                  "ru": "вегетарианский",
                  "en": "vegetarian",
                  "he": "צמחוני"
                }
              },
              {
                "raw": "das Getränk, -e",
                "word": "Getränk",
                "withArticle": "das Getränk",
                "article": "das",
                "plural": "",
                "translations": {
                  "ru": "напиток",
                  "en": "beverage, drink",
                  "he": "משקה"
                }
              }
            ]
          },
          {
            "id": "de-food-m1-boss",
            "isBoss": true,
            "speedMultiplier": 1.05,
            "spawnIntervalMs": 2450,
            "titles": {
              "ru": "👹 Босс-урок: Шеф-повар",
              "en": "👹 Boss Review: Master Chef",
              "he": "👹 שלב בוס: שף הבית"
            },
            "descriptions": {
              "ru": "Еда, любимые блюда, рецепты и заказ в кафе (20 слов).",
              "en": "Meals, favorite dishes, recipes & ordering at a cafe (20 words).",
              "he": "אוכל, מנות, מתכונים והזמנה במסעדה (20 מילים)."
            },
            "words": []
          }
        ]
      }
    ]
  },
  {
    "id": "de-travel",
    "targetLang": "de",
    "category": "travel",
    "source": "official",
    "icon": "✈️",
    "levelTag": "B2",
    "titles": {
      "ru": "Путешествия и отели",
      "en": "Travel & Hotels",
      "he": "נסיעות ומלונות"
    },
    "descriptions": {
      "ru": "Аэропорт, перелёты, бронь отеля и маршруты (20 слов).",
      "en": "Airports, flights, hotel booking & itineraries (20 words).",
      "he": "שדה תעופה, טיסות, הזמנת מלון ומסלולים (20 מילים)."
    },
    "modules": [
      {
        "id": "de-travel-m1",
        "titles": {
          "ru": "Путешествия и отели",
          "en": "Travel & Hotels",
          "he": "נסיעות ומלונות"
        },
        "lessons": [
          {
            "id": "de-travel-m1-l1",
            "isBoss": false,
            "speedMultiplier": 0.96,
            "spawnIntervalMs": 2700,
            "titles": {
              "ru": "Аэропорт и перелёт",
              "en": "Airport & Flight",
              "he": "שדה תעופה וטיסה"
            },
            "descriptions": {
              "ru": "Аэропорт, перелёты, бронь отеля и маршруты (20 слов).",
              "en": "Airports, flights, hotel booking & itineraries (20 words).",
              "he": "שדה תעופה, טיסות, הזמנת מלון ומסלולים (20 מילים)."
            },
            "words": [
              {
                "raw": "der Abflug, ¨-e",
                "word": "Abflug",
                "withArticle": "der Abflug",
                "article": "der",
                "plural": "",
                "translations": {
                  "ru": "вылет",
                  "en": "departure",
                  "he": "המראה"
                }
              },
              {
                "raw": "die Landung, -en",
                "word": "Landung",
                "withArticle": "die Landung",
                "article": "die",
                "plural": "",
                "translations": {
                  "ru": "посадка, приземление",
                  "en": "landing",
                  "he": "נחיתה"
                }
              },
              {
                "raw": "das Gepäck, Sg.",
                "word": "Gepäck",
                "withArticle": "das Gepäck",
                "article": "das",
                "plural": "",
                "translations": {
                  "ru": "багаж",
                  "en": "luggage",
                  "he": "מזוודות / כבודה"
                }
              },
              {
                "raw": "die Bordkarte, -n",
                "word": "Bordkarte",
                "withArticle": "die Bordkarte",
                "article": "die",
                "plural": "",
                "translations": {
                  "ru": "посадочный талон",
                  "en": "boarding pass",
                  "he": "כרטיס עלייה למטוס"
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
                "raw": "umsteigen",
                "word": "umsteigen",
                "withArticle": "umsteigen",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "делать пересадку",
                  "en": "to transfer, change",
                  "he": "להחליף רכבת/טיסה"
                }
              },
              {
                "raw": "der Zoll, ¨-e",
                "word": "Zoll",
                "withArticle": "der Zoll",
                "article": "der",
                "plural": "",
                "translations": {
                  "ru": "таможня",
                  "en": "customs",
                  "he": "מכס"
                }
              },
              {
                "raw": "der Reisepass, ¨-e",
                "word": "Reisepass",
                "withArticle": "der Reisepass",
                "article": "der",
                "plural": "",
                "translations": {
                  "ru": "загранпаспорт",
                  "en": "passport",
                  "he": "דרכון"
                }
              },
              {
                "raw": "einchecken",
                "word": "einchecken",
                "withArticle": "einchecken",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "регистрироваться на рейс",
                  "en": "to check in",
                  "he": "לעשות צ׳ק-אין"
                }
              },
              {
                "raw": "das Reiseziel, -e",
                "word": "Reiseziel",
                "withArticle": "das Reiseziel",
                "article": "das",
                "plural": "",
                "translations": {
                  "ru": "пункт назначения",
                  "en": "destination",
                  "he": "יעד נסיעה"
                }
              }
            ]
          },
          {
            "id": "de-travel-m1-l2",
            "isBoss": false,
            "speedMultiplier": 1.0,
            "spawnIntervalMs": 2600,
            "titles": {
              "ru": "Отель и экскурсии",
              "en": "Hotel & Sightseeing",
              "he": "מלון וסיורים"
            },
            "descriptions": {
              "ru": "Аэропорт, перелёты, бронь отеля и маршруты (20 слов).",
              "en": "Airports, flights, hotel booking & itineraries (20 words).",
              "he": "שדה תעופה, טיסות, הזמנת מלון ומסלולים (20 מילים)."
            },
            "words": [
              {
                "raw": "die Unterkunft, ¨-e",
                "word": "Unterkunft",
                "withArticle": "die Unterkunft",
                "article": "die",
                "plural": "",
                "translations": {
                  "ru": "жильё, размещение",
                  "en": "accommodation",
                  "he": "לינה / מגורים"
                }
              },
              {
                "raw": "die Buchung, -en",
                "word": "Buchung",
                "withArticle": "die Buchung",
                "article": "die",
                "plural": "",
                "translations": {
                  "ru": "бронирование",
                  "en": "booking, reservation",
                  "he": "הזמנה"
                }
              },
              {
                "raw": "die Sehenswürdigkeit, -en",
                "word": "Sehenswürdigkeit",
                "withArticle": "die Sehenswürdigkeit",
                "article": "die",
                "plural": "",
                "translations": {
                  "ru": "достопримечательность",
                  "en": "sight, attraction",
                  "he": "אטרקציה תיירותית"
                }
              },
              {
                "raw": "der Aufenthalt, -e",
                "word": "Aufenthalt",
                "withArticle": "der Aufenthalt",
                "article": "der",
                "plural": "",
                "translations": {
                  "ru": "пребывание",
                  "en": "stay",
                  "he": "שהות"
                }
              },
              {
                "raw": "stornieren",
                "word": "stornieren",
                "withArticle": "stornieren",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "отменять бронь",
                  "en": "to cancel a booking",
                  "he": "לבטל הזמנה"
                }
              },
              {
                "raw": "übernachten",
                "word": "übernachten",
                "withArticle": "übernachten",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "ночевать",
                  "en": "to stay overnight",
                  "he": "ללון"
                }
              },
              {
                "raw": "erkunden",
                "word": "erkunden",
                "withArticle": "erkunden",
                "article": "Verb",
                "plural": "",
                "translations": {
                  "ru": "исследовать (город)",
                  "en": "to explore",
                  "he": "לחקור / לטייל"
                }
              },
              {
                "raw": "die Rezeption, -en",
                "word": "Rezeption",
                "withArticle": "die Rezeption",
                "article": "die",
                "plural": "",
                "translations": {
                  "ru": "стойка регистрации",
                  "en": "reception desk",
                  "he": "קבלה במלון"
                }
              },
              {
                "raw": "malerisch",
                "word": "malerisch",
                "withArticle": "malerisch",
                "article": "Adj.",
                "plural": "",
                "translations": {
                  "ru": "живописный",
                  "en": "picturesque",
                  "he": "ציורי"
                }
              },
              {
                "raw": "das Erlebnis, -se",
                "word": "Erlebnis",
                "withArticle": "das Erlebnis",
                "article": "das",
                "plural": "",
                "translations": {
                  "ru": "впечатление, приключение",
                  "en": "experience",
                  "he": "חוויה"
                }
              }
            ]
          },
          {
            "id": "de-travel-m1-boss",
            "isBoss": true,
            "speedMultiplier": 1.05,
            "spawnIntervalMs": 2450,
            "titles": {
              "ru": "👹 Босс-урок: Вокруг света",
              "en": "👹 Boss Review: Around the World",
              "he": "👹 שלב בוס: מסביב לעולם"
            },
            "descriptions": {
              "ru": "Аэропорт, перелёты, бронь отеля и маршруты (20 слов).",
              "en": "Airports, flights, hotel booking & itineraries (20 words).",
              "he": "שדה תעופה, טיסות, הזמנת מלון ומסלולים (20 מילים)."
            },
            "words": []
          }
        ]
      }
    ]
  }
];
