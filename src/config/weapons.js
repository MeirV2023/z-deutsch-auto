// Реестр арсенала космического оружия Z-LINGO (OCP: добавление новой пушки декларативно)

// --- Арсенал из 6 видов оружия с прокачкой за выученные слова ---
export const WEAPONS = [
  {
    id: 'plasma',
    key: '1',
    icon: '⚡',
    unlockWords: 0,
    color: '#22d3ee',
    secondaryColor: '#34d399',
    recoilBoost: 1.0,
    names: {
      ru: 'Плазма', en: 'Plasma', de: 'Plasma', es: 'Plasma',
      uk: 'Плазма', tr: 'Plazma', he: 'פלזמה', ar: 'بلازما'
    },
    descs: {
      ru: 'Сдвоенные плазменные импульсы с нарастающей комбо-гармоникой',
      en: 'Twin plasma pulses with rising combo harmonics',
      de: 'Zwillings-Plasmaimpulse mit steigender Kombo-Harmonik',
      es: 'Pulsos dobles de plasma con armónicos de combo crecientes',
      uk: 'Подвійні плазмові імпульси зі зростаючою комбо-гармонікою',
      tr: 'Artan kombo harmonikli ikiz plazma atışları',
      he: 'צמד פולסי פלזמה מהירים עם הרמוניית קומבו מתגברת',
      ar: 'نبضات بلازما مزدوجة مع تناغم كومبو متصاعد'
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
    names: {
      ru: 'Грави-волна', en: 'Gravity Wave', de: 'Gravitationswelle', es: 'Onda Gravitatoria',
      uk: 'Граві-хвиля', tr: 'Çekim Dalgası', he: 'גל כבידה', ar: 'موجة الجاذبية'
    },
    descs: {
      ru: 'Антигравитация: сразу много слов разлетаются высоко к самому началу экрана!',
      en: 'Anti-gravity surge: blasts multiple words all the way back to the top!',
      de: 'Antigravitation: schleudert mehrere Wörter sofort nach oben zurück!',
      es: 'Antigravedad: ¡impulsa varias palabras de vuelta a lo alto de la pantalla!',
      uk: 'Антигравітація: одразу багато слів відлітають високо до самого верху екрана!',
      tr: 'Yerçekimi dalgası: birden fazla kelimeyi ekranın en üstüne fırlatır!',
      he: 'אנטי-כבידה: הודף בבת אחת מילים רבות חזרה למעלה לתחילת המסך!',
      ar: 'دفع مضاد للجاذبية: يقذف عدة كلمات للأعلى نحو بداية الشاشة!'
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
    names: {
      ru: 'Рельсотрон', en: 'Railgun', de: 'Railgun', es: 'Cañón de Riel',
      uk: 'Рейкотрон', tr: 'Raylı Top', he: 'תותח מסילה', ar: 'مدفع كهرومغناطيسي'
    },
    descs: {
      ru: 'Мощный гиперлуч с басовым ударом, кольцами волны и сильной отдачей',
      en: 'Hyper-velocity beam with sonic shockwaves and heavy recoil',
      de: 'Hyperstrahl mit Schalldruckwellen und starkem Rückstoß',
      es: 'Rayo hiperveloz con ondas de choque sónicas y gran retroceso',
      uk: 'Потужний гіперпромінь із басовим ударом, хвилями та сильною віддачею',
      tr: 'Ses şok dalgalı ve güçlü geri tepmeli yüksek hızlı ışın',
      he: 'קרן על-קולית עוצמתית עם הדף חזק וטבעות הדף',
      ar: 'شعاع فائق السرعة مع موجات صدمة صوتية وارتداد قوي'
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
    names: {
      ru: 'Ракеты', en: 'Missiles', de: 'Raketen', es: 'Misiles',
      uk: 'Ракети', tr: 'Füzeler', he: 'טילים', ar: 'صواريخ'
    },
    descs: {
      ru: 'Самонаводящийся рой микро-ракет с дымным шлейфом и микро-взрывом',
      en: 'Homing micro-missile swarm with fiery smoke trails',
      de: 'Zielsuchender Mikroraketen-Schwarm mit feuriger Rauchspur',
      es: 'Enjambre de micromisiles guiados con estela de fuego',
      uk: 'Самонавідний рій мікроракет із димним шлейфом та мікровибухом',
      tr: 'Ateşli duman izli güdümlü mikro füze sürüsü',
      he: 'נחיל טילי מיקרו מתבייתים עם שובל אש ופיצוץ ממוקד',
      ar: 'سرب صواريخ دقيقة موجهة مع ذيل دخاني وانفجار مركز'
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
    names: {
      ru: 'Тесла', en: 'Tesla Coil', de: 'Tesla-Spule', es: 'Bobina Tesla',
      uk: 'Тесла', tr: 'Tesla Bobini', he: 'טסלה', ar: 'ملف تسلا'
    },
    descs: {
      ru: 'Ветвящаяся дуга молнии с электрическим треском (открывается за 50 слов!)',
      en: 'Branching high-voltage lightning arc (unlocks at 50 learned words!)',
      de: 'Verzweigter Hochspannungs-Blitzbogen (ab 50 gelernten Wörtern!)',
      es: 'Arco eléctrico de alto voltaje (¡se desbloquea con 50 palabras!)',
      uk: 'Розгалужена дуга блискавки з електричним розрядом (від 50 слів!)',
      tr: 'Dallanan yüksek voltajlı şimşek arkı (50 kelimede açılır!)',
      he: 'קשת ברק מתפצלת עם פריקה חשמלית (נפתח ב-50 מילים!)',
      ar: 'قوس برق عالي الجهد متفرع (يُفتح عند 50 كلمة!)'
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
    names: {
      ru: 'Неон-Синт', en: 'Neon Synth', de: 'Neon-Synth', es: 'Neón Synth',
      uk: 'Неон-Синт', tr: 'Neon Synth', he: 'סינת׳ווייב', ar: 'نيون سينث'
    },
    descs: {
      ru: 'Призма-лазер: каждая буква играет мелодичную ноту в стиле Synthwave!',
      en: 'Prism laser: every typed letter plays a melodic Synthwave note!',
      de: 'Prismalaser: Jeder Buchstabe spielt eine melodische Synthwave-Note!',
      es: 'Láser prisma: ¡cada letra tocada suena como una nota Synthwave!',
      uk: 'Призма-лазер: кожна літера грає мелодійну ноту в стилі Synthwave!',
      tr: 'Prizma lazeri: yazılan her harf melodik bir Synthwave notası çalar!',
      he: 'לייזר פריזמה מנגן: כל אות מפיקה צליל סינת׳ווייב מלודי!',
      ar: 'ليزر موشوري: كل حرف تكتبه يعزف نغمة موسيقية متناغمة!'
    }
  }
];

export function getWeaponById(weaponId) {
  return WEAPONS.find(w => w.id === weaponId) || WEAPONS[0];
}
