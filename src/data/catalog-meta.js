// Метаданные поддерживаемых языков и базовых категорий каталога VOCANOVA (8 двусторонних языков)

export const TARGET_LANGUAGES = [
  {
    id: 'de', flag: '🇩🇪', code: 'DE', dir: 'ltr',
    names: {
      ru: 'Немецкий', en: 'German', de: 'Deutsch', es: 'Alemán',
      uk: 'Німецька', tr: 'Almanca', he: 'גרמנית', ar: 'الألمانية'
    }
  },
  {
    id: 'en', flag: '🇬🇧', code: 'EN', dir: 'ltr',
    names: {
      ru: 'Английский', en: 'English', de: 'Englisch', es: 'Inglés',
      uk: 'Англійська', tr: 'İngilizce', he: 'אנגלית', ar: 'الإنجليزية'
    }
  },
  {
    id: 'es', flag: '🇪🇸', code: 'ES', dir: 'ltr',
    names: {
      ru: 'Испанский', en: 'Spanish', de: 'Spanisch', es: 'Español',
      uk: 'Іспанська', tr: 'İspanyolca', he: 'ספרדית', ar: 'الإسبانية'
    }
  },
  {
    id: 'ru', flag: '🇷🇺', code: 'RU', dir: 'ltr',
    names: {
      ru: 'Русский', en: 'Russian', de: 'Russisch', es: 'Ruso',
      uk: 'Російська', tr: 'Rusça', he: 'רוסית', ar: 'الروسية'
    }
  },
  {
    id: 'uk', flag: '🇺🇦', code: 'UK', dir: 'ltr',
    names: {
      ru: 'Украинский', en: 'Ukrainian', de: 'Ukrainisch', es: 'Ucraniano',
      uk: 'Українська', tr: 'Ukraynaca', he: 'אוקראינית', ar: 'الأوكرانية'
    }
  },
  {
    id: 'tr', flag: '🇹🇷', code: 'TR', dir: 'ltr',
    names: {
      ru: 'Турецкий', en: 'Turkish', de: 'Türkisch', es: 'Turco',
      uk: 'Турецька', tr: 'Türkçe', he: 'טורקית', ar: 'التركية'
    }
  },
  {
    id: 'he', flag: '🇮🇱', code: 'HE', dir: 'rtl',
    names: {
      ru: 'Иврит', en: 'Hebrew', de: 'Hebräisch', es: 'Hebreo',
      uk: 'Іврит', tr: 'İbranice', he: 'עברית', ar: 'العبرية'
    }
  },
  {
    id: 'ar', flag: '🇸🇦', code: 'AR', dir: 'rtl',
    names: {
      ru: 'Арабский', en: 'Arabic', de: 'Arabisch', es: 'Árabe',
      uk: 'Арабська', tr: 'Arapça', he: 'ערבית', ar: 'العربية'
    }
  }
];

export const NATIVE_LANGUAGES = [
  { id: 'ru', flag: '🇷🇺', code: 'RU', label: '🇷🇺 Русский', short: '🇷🇺 RU', dir: 'ltr' },
  { id: 'en', flag: '🇬🇧', code: 'EN', label: '🇬🇧 English', short: '🇬🇧 EN', dir: 'ltr' },
  { id: 'de', flag: '🇩🇪', code: 'DE', label: '🇩🇪 Deutsch', short: '🇩🇪 DE', dir: 'ltr' },
  { id: 'es', flag: '🇪🇸', code: 'ES', label: '🇪🇸 Español', short: '🇪🇸 ES', dir: 'ltr' },
  { id: 'uk', flag: '🇺🇦', code: 'UK', label: '🇺🇦 Українська', short: '🇺🇦 UK', dir: 'ltr' },
  { id: 'tr', flag: '🇹🇷', code: 'TR', label: '🇹🇷 Türkçe', short: '🇹🇷 TR', dir: 'ltr' },
  { id: 'he', flag: '🇮🇱', code: 'HE', label: '🇮🇱 עברית', short: '🇮🇱 עברית', dir: 'rtl' },
  { id: 'ar', flag: '🇸🇦', code: 'AR', label: '🇸🇦 العربية', short: '🇸🇦 العربية', dir: 'rtl' }
];

export const BASE_CATEGORIES = [
  {
    id: 'business',
    icon: '💼',
    titles: {
      ru: 'Бизнес и карьера', en: 'Business & Career', de: 'Beruf & Karriere', es: 'Negocios y Carrera',
      uk: 'Бізнес і кар’єра', tr: 'İş ve Kariyer', he: 'עסקים וקריירה', ar: 'الأعمال والمهنة'
    },
    descriptions: {
      ru: 'Старт дела, резюме, собеседование, рабочая среда и финансы',
      en: 'Starting a business, job applications, workplace & management',
      de: 'Existenzgründung, Bewerbung, Firma und Arbeitswelt',
      es: 'Emprendimiento, currículum, empresa y mundo laboral',
      uk: 'Започаткування справи, резюме, співбесіда й робоче середовище',
      tr: 'İş kurma, iş başvurusu, şirket ve çalışma hayatı',
      he: 'הקמת עסק, קורות חיים, ראיון עבודה וסביבת עבודה',
      ar: 'بدء عمل، التقديم للوظائف، الشركة وبيئة العمل'
    }
  },
  {
    id: 'base',
    icon: '🌱',
    titles: {
      ru: 'Общество и жизнь', en: 'Daily Life & Culture', de: 'Alltag & Leben', es: 'Vida Cotidiana',
      uk: 'Життя та побут', tr: 'Günlük Yaşam', he: 'חיי יומיום', ar: 'الحياة اليومية'
    },
    descriptions: {
      ru: 'Семья, совместная жизнь, история и потребительские права',
      en: 'Family, everyday life, history, plans & consumer rights',
      de: 'Familie, Alltag, Vergangenheit, Wünsche & Konsum',
      es: 'Familia, vida diaria, pasado, deseos y consumo',
      uk: 'Сім’я, побут, минуле й сучасність, бажання та договори',
      tr: 'Aile, günlük yaşam, geçmiş, dilekler ve tüketici hakları',
      he: 'משפחה, חיי יומיום, עבר והווה, משאלות וצרכנות',
      ar: 'الأسرة، الحياة اليومية، الماضي والحاضر، الأمنيات والاستهلاك'
    }
  },
  {
    id: 'it',
    icon: '💻',
    titles: {
      ru: 'Цифровой мир', en: 'Digital World', de: 'Digitale Welt', es: 'Mundo Digital',
      uk: 'Цифровий світ', tr: 'Dijital Dünya', he: 'העולם הדיגיטלי', ar: 'العالم الرقمي'
    },
    descriptions: {
      ru: 'Интернет, медиа, соцсети, онлайн-покупки и цифровая жизнь',
      en: 'Internet, media, social networks, e-commerce & online life',
      de: 'Internet, Medien, soziale Netzwerke und Online-Shopping',
      es: 'Internet, medios, redes sociales y compras en línea',
      uk: 'Інтернет, медіа, соцмережі та онлайн-покупки',
      tr: 'İnternet, medya, sosyal ağlar ve çevrimiçi alışveriş',
      he: 'אינטרנט, מדיה, רשתות חברתיות וקניות אונליין',
      ar: 'الإنترنت، الإعلام، الشبكات الاجتماعية والتسوق عبر الإنترنت'
    }
  },
  {
    id: 'medicine',
    icon: '🩺',
    titles: {
      ru: 'Медицина и здоровье', en: 'Health & Medicine', de: 'Gesundheit & Medizin', es: 'Salud y Medicina',
      uk: 'Медицина та здоров’я', tr: 'Sağlık ve Tıp', he: 'בריאות ורפואה', ar: 'الصحة والطب'
    },
    descriptions: {
      ru: 'Здоровье, визит к врачу, больница, симптомы и лечение',
      en: 'Health, doctor visits, hospital care, symptoms & recovery',
      de: 'Gesundheit, Arztbesuch, Krankenhaus, Symptome und Heilung',
      es: 'Salud, consulta médica, hospital, síntomas y recuperación',
      uk: 'Здоров’я, візит до лікаря, лікарня, симптоми та лікування',
      tr: 'Sağlık, doktor ziyareti, hastane, belirtiler ve tedavi',
      he: 'בריאות, ביקור אצל רופא, בית חולים, תסמינים וטיפול',
      ar: 'الصحة، زيارة الطبيب، المستشفى، الأعراض والعلاج'
    }
  },
  {
    id: 'travel',
    icon: '✈️',
    titles: {
      ru: 'Путешествия и транспорт', en: 'Travel & Transport', de: 'Reisen & Verkehr', es: 'Viajes y Transporte',
      uk: 'Подорожі та транспорт', tr: 'Seyahat ve Ulaşım', he: 'נסיעות ותחבורה', ar: 'السفر والنقل'
    },
    descriptions: {
      ru: 'Отпуск, маршруты, транспорт, дороги и ситуации в пути',
      en: 'Vacations, routes, public transit, road traffic & incidents',
      de: 'Urlaub, Routen, Bahn- und Straßenverkehr sowie Pannen',
      es: 'Vacaciones, rutas, transporte, carreteras e incidentes',
      uk: 'Відпустка, маршрути, транспорт, дороги й ситуації в дорозі',
      tr: 'Tatil, güzergâhlar, ulaşım, trafik ve yol durumları',
      he: 'חופשה, מסלולים, תחבורה ציבורית, תנועה ומקרי דרך',
      ar: 'العطلات، المسارات، المواصلات، حركة المرور وحوادث الطريق'
    }
  },
  {
    id: 'nature',
    icon: '🌿',
    titles: {
      ru: 'Природа и экология', en: 'Nature & Environment', de: 'Natur & Umwelt', es: 'Naturaleza y Ecología',
      uk: 'Природа та екологія', tr: 'Doğa ve Çevre', he: 'טבע וסביבה', ar: 'الطبيعة والبيئة'
    },
    descriptions: {
      ru: 'Пейзажи, климат, энергетика, сортировка мусора и защита среды',
      en: 'Landscapes, climate, renewable energy, recycling & ecology',
      de: 'Landschaften, Klimawandel, Energie, Mülltrennung & Umweltschutz',
      es: 'Paisajes, clima, energía renovable, reciclaje y ecología',
      uk: 'Природа, клімат, енергетика, сортування сміття й екологія',
      tr: 'Doğa, iklim, yenilenebilir enerji, geri dönüşüm ve çevre',
      he: 'נופים, אקלים, אנרגיה מתחדשת, מיחזור והגנת הסביבה',
      ar: 'الطبيعة، المناخ، الطاقة المتجددة، إعادة التدوير وحماية البيئة'
    }
  },
  {
    id: 'society',
    icon: '🏛️',
    titles: {
      ru: 'Политика и будущее', en: 'Society & Future', de: 'Politik & Zukunft', es: 'Sociedad y Futuro',
      uk: 'Суспільство та майбутнє', tr: 'Toplum ve Gelecek', he: 'חברה ועתיד', ar: 'المجتمع والمستقبل'
    },
    descriptions: {
      ru: 'Государство, выборы, интеграция, прогнозы и будущее',
      en: 'Government, elections, integration, trends & future outlook',
      de: 'Politik, Wahlen, Gesellschaft, Wandel und Zukunft',
      es: 'Política, elecciones, integración, sociedad y futuro',
      uk: 'Держава, вибори, інтеграція, суспільні зміни та майбутнє',
      tr: 'Siyaset, seçimler, entegrasyon, toplum ve gelecek',
      he: 'מדינה, בחירות, אינטגרציה, חברה ומבט לעתיד',
      ar: 'السياسة، الانتخابات، الاندماج، المجتمع وتطلعات المستقبل'
    }
  },
  {
    id: 'auto',
    icon: '🚗',
    titles: {
      ru: 'Авто и дорога', en: 'Auto & Road', de: 'Auto & Straße', es: 'Auto y Carretera',
      uk: 'Авто і дорога', tr: 'Otomobil ve Yol', he: 'רכב ודרכים', ar: 'السيارة والطريق'
    },
    descriptions: {
      ru: 'Автомобиль, устройство, автобан, ПДД и страховка',
      en: 'Cars, controls, highway rules & insurance',
      de: 'Fahrzeug, Cockpit, Autobahn und Versicherung',
      es: 'Automóvil, autopista, normas de tráfico y seguro',
      uk: 'Автомобіль, траса, правила дорожнього руху й страхування',
      tr: 'Araç, otoyol, trafik kuralları ve sigorta',
      he: 'רכב, כביש מהיר, כללי תנועה וביטוח',
      ar: 'السيارة، الطريق السريع، قواعد المرور والتأمين'
    }
  },
  {
    id: 'finance',
    icon: '🪙',
    titles: {
      ru: 'Финансы', en: 'Finance', de: 'Finanzen', es: 'Finanzas',
      uk: 'Фінанси', tr: 'Finans', he: 'פיננסים', ar: 'المالية'
    },
    descriptions: {
      ru: 'Деньги, банки, счета, бюджет и покупки',
      en: 'Money, banking, accounts, budgeting & shopping',
      de: 'Geld, Banken, Konten, Budget und Einkauf',
      es: 'Dinero, banca, cuentas, presupuesto y compras',
      uk: 'Гроші, банки, рахунки, бюджет і покупки',
      tr: 'Para, bankacılık, hesaplar, bütçe ve alışveriş',
      he: 'כסף, בנקאות, חשבונות, תקציב וקניות',
      ar: 'المال، البنوك، الحسابات، الميزانية والتسوق'
    }
  },
  {
    id: 'food',
    icon: '👨‍🍳',
    titles: {
      ru: 'Кухня', en: 'Food & Kitchen', de: 'Essen & Küche', es: 'Cocina y Comida',
      uk: 'Кухня та їжа', tr: 'Mutfak ve Yemek', he: 'מטבח ואוכל', ar: 'المطبخ والطعام'
    },
    descriptions: {
      ru: 'Еда, блюда, рецепты, продукты и заказ в ресторане',
      en: 'Meals, dishes, recipes, groceries & restaurants',
      de: 'Essen, Gerichte, Rezepte und Restaurant',
      es: 'Comidas, platos, recetas y restaurante',
      uk: 'Їжа, страви, рецепти, продукти та ресторан',
      tr: 'Yemekler, tarifler, market ve restoran',
      he: 'אוכל, מנות, מתכונים, מצרכים ומסעדה',
      ar: 'الأطعمة، الأطباق، الوصفات والمطاعم'
    }
  }
];
