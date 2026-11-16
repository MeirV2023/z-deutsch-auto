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

export function getWeaponById(weaponId) {
  return WEAPONS.find(w => w.id === weaponId) || WEAPONS[0];
}
