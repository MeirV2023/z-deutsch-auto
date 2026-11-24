// Уникальные тематические векторные иконки-иллюстрации (40 официальных курсов A1–B2 + Anki / личные колоды)
import { inferCourseCategory } from '../domain/catalog-service.js';

const PALETTES = {
  // === A1 ===
  'begruessung-kennenlernen': ['#0369a1', '#0f172a', '#38bdf8'],
  'zahlen-zeit-kalender': ['#312e81', '#0f172a', '#fbbf24'],
  'familie-freunde-menschen': ['#881337', '#1f1635', '#fb7185'],
  'essen-trinken-einkaufen': ['#78350f', '#1c1412', '#fbbf24'],
  'wohnen-zimmer-moebel': ['#065f46', '#0a1f1c', '#34d399'],
  'alltag-freizeit-hobbys': ['#581c87', '#13112b', '#e879f9'],
  'stadt-wege-reisen-a1': ['#1d4ed8', '#0c1938', '#60a5fa'],
  'koerper-gesundheit-wetter': ['#0e7490', '#132036', '#fb7185'],
  // === A2 ===
  'alltag-familie': ['#047857', '#082622', '#6ee7b7'],
  'schule-beruf': ['#3730a3', '#0f172a', '#fcd34d'],
  'medien-kino': ['#6d28d9', '#111827', '#38bdf8'],
  'ereignisse-gefuehle': ['#be185d', '#1e132d', '#fbbf24'],
  'stadt-behoerden': ['#1e40af', '#0f172a', '#38bdf8'],
  'beruf-bahnhof': ['#9a3412', '#171726', '#fb923c'],
  'verkehr-routen': ['#0284c7', '#0a1c36', '#7dd3fc'],
  'lernen-pruefungen': ['#0f766e', '#091f24', '#34d399'],
  'sport-reisen': ['#15803d', '#0b221a', '#a3e635'],
  'wohnen-nachbarn': ['#115e59', '#141e2e', '#fbbf24'],
  'lebensphasen-ausflug': ['#4c1d95', '#11132b', '#f59e0b'],
  'kultur-festivals': ['#9f1239', '#1a1128', '#f472b6'],
  // === B1 ===
  'ein-neuer-start': ['#1e3a8a', '#090d1f', '#38bdf8'],
  'bewerbung-firma': ['#b45309', '#1c1917', '#fde047'],
  'arbeitswelt': ['#334155', '#0f172a', '#fb923c'],
  'familie': ['#9d174d', '#1b1128', '#fda4af'],
  'digitale-welt': ['#0e7490', '#091326', '#22d3ee'],
  'gesundheit': ['#881337', '#131626', '#34d399'],
  'reisen-verkehr': ['#1d4ed8', '#091a38', '#93c5fd'],
  'natur-umwelt': ['#166534', '#062016', '#4ade80'],
  'politik-gesellschaft': ['#4338ca', '#11132c', '#a78bfa'],
  'damals-heute': ['#78350f', '#191418', '#fcd34d'],
  'wuensche': ['#4c1d95', '#090a24', '#fde047'],
  'wie-wird-es-sein': ['#5b21b6', '#0d0c24', '#67e8f9'],
  // === B2 ===
  'kommunikation-argumentation': ['#6d28d9', '#0f142c', '#38bdf8'],
  'wirtschaft-finanzen-markt': ['#065f46', '#081b1a', '#fbbf24'],
  'wissenschaft-forschung-ki': ['#0369a1', '#091124', '#a78bfa'],
  'kultur-kunst-medienkritik': ['#9d174d', '#191126', '#fb923c'],
  'recht-staat-demokratie': ['#1e3a8a', '#0c1328', '#fbbf24'],
  'psychologie-beziehungen-ethik': ['#701a75', '#150d26', '#f472b6'],
  'karriere-fuehrung-management': ['#92400e', '#171824', '#fde047'],
  'klima-nachhaltigkeit-global': ['#047857', '#082026', '#38bdf8'],
  // === Fallback / User ===
  'anki': ['#581c87', '#16112d', '#fde047'],
  'user-deck': ['#0f766e', '#0d192c', '#38bdf8'],
  'auto': ['#b91c1c', '#1a1126', '#60a5fa'],
  'business': ['#b45309', '#1e1612', '#fbbf24'],
  'finance': ['#065f46', '#0b1e19', '#fbbf24'],
  'food': ['#9a3412', '#1c1420', '#fda4af'],
  'it': ['#0e7490', '#0b1428', '#38bdf8'],
  'travel': ['#1d4ed8', '#0c1c36', '#7dd3fc'],
  'medicine': ['#9f1239', '#0f172a', '#34d399'],
  'nature': ['#15803d', '#072219', '#4ade80'],
  'society': ['#4338ca', '#12132e', '#a78bfa'],
  'base': ['#0f766e', '#0a1f24', '#4ade80']
};

const KNOWN_SLUGS = new Set(Object.keys(PALETTES));

export function getCourseArtKey(course) {
  if (!course) return 'base';
  if (course.source === 'user') {
    return course.originType === 'anki' ? 'anki' : 'user-deck';
  }
  const cid = String(course.id || '').toLowerCase();
  // Format: "{lang}-{level}-{slug}" e.g. "de-a2-schule-beruf", "tr-b1-ein-neuer-start"
  const m = cid.match(/^[a-z]{2}-(?:a1|a2|b1|b2|c1)-(.+)$/);
  if (m && KNOWN_SLUGS.has(m[1])) return m[1];
  for (const slug of KNOWN_SLUGS) {
    if (cid.endsWith('-' + slug)) return slug;
  }
  const cat = inferCourseCategory(course);
  return KNOWN_SLUGS.has(cat) ? cat : 'base';
}

function getMotifMarkup(key, c3) {
  switch (key) {
    // ======================== A1 (8 уникальных) ========================
    case 'begruessung-kennenlernen':
      return `
        <path d="M24 38c0-9 8-16 18-16h26c10 0 18 7 18 16v14c0 9-8 16-18 16H50l-14 11 3-11h-1c-8 0-14-7-14-16V38Z" fill="#0ea5e9" stroke="#bae6fd" stroke-width="2.5"/>
        <circle cx="44" cy="45" r="3.5" fill="#fff"/>
        <circle cx="56" cy="45" r="3.5" fill="#fff"/>
        <circle cx="68" cy="45" r="3.5" fill="#fff"/>
        <path d="M64 64h26c7 0 12 5 12 11v9c0 6-5 11-12 11h-4l3 9-11-9H64c-7 0-12-5-12-11v-9c0-6 5-11 12-11Z" fill="#34d399" stroke="#a7f3d0" stroke-width="2"/>
        <path d="M68 78h18M73 84h10" stroke="#064e3b" stroke-width="2.8" stroke-linecap="round"/>`;
    case 'zahlen-zeit-kalender':
      return `
        <rect x="24" y="22" width="54" height="58" rx="10" fill="#1e293b" stroke="#93c5fd" stroke-width="2.2"/>
        <rect x="24" y="22" width="54" height="16" rx="8" fill="#6366f1"/>
        <rect x="35" y="16" width="6" height="12" rx="3" fill="#e0e7ff"/>
        <rect x="61" y="16" width="6" height="12" rx="3" fill="#e0e7ff"/>
        <text x="51" y="66" text-anchor="middle" fill="#e0e7ff" font-family="sans-serif" font-weight="900" font-size="24">12</text>
        <circle cx="80" cy="78" r="21" fill="#0f172a" stroke="#fbbf24" stroke-width="3.2"/>
        <path d="M80 65v13l9 6" stroke="#fde047" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'familie-freunde-menschen':
      return `
        <circle cx="43" cy="40" r="10" fill="#fda4af"/>
        <path d="M25 84c2-15 10-23 18-23s16 8 18 23Z" fill="#f43f5e"/>
        <circle cx="77" cy="43" r="9.5" fill="#fed7aa"/>
        <path d="M60 84c2-14 9-21 17-21s15 7 17 21Z" fill="#fb923c"/>
        <circle cx="60" cy="60" r="7.5" fill="#fde68a"/>
        <path d="M48 92c1.5-10 6-15 12-15s10.5 5 12 15Z" fill="#38bdf8"/>
        <path d="M60 22c3-4.5 9.5-3.5 9.5 2 0 4.5-9.5 11-9.5 11s-9.5-6.5-9.5-11c0-5.5 6.5-6.5 9.5-2Z" fill="#fb7185"/>`;
    case 'essen-trinken-einkaufen':
      return `
        <path d="M22 62c4-14 16-22 28-20 8 1 13 6 14 13-11-3-24 2-32 13l-10-6Z" fill="#f59e0b" stroke="#fde68a" stroke-width="2"/>
        <path d="M35 44c5 6 7 11 7 17M47 43c3 6 4 10 3 15" stroke="#92400e" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M56 58h36v19c0 10-8 18-18 18s-18-8-18-18V58Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
        <path d="M92 63h5a6 6 0 0 1 0 12h-5" stroke="#e2e8f0" stroke-width="3.5"/>
        <path d="M66 47c0-5 4-7 2-11M78 47c0-5 4-7 2-11" stroke="#fde68a" stroke-width="2.5" stroke-linecap="round"/>`;
    case 'wohnen-zimmer-moebel':
      return `
        <path d="M60 20 20 52h11v40h58V52h11L60 20Z" fill="#0f766e" stroke="#6ee7b7" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M20 52 60 20l40 32" stroke="#a7f3d0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="49" y="62" width="22" height="30" rx="3" fill="#042f2e" stroke="#34d399" stroke-width="2"/>
        <rect x="34" y="54" width="12" height="12" rx="2" fill="#fde047"/>
        <rect x="74" y="54" width="12" height="12" rx="2" fill="#fde047"/>
        <circle cx="65" cy="77" r="2.2" fill="#fbbf24"/>`;
    case 'alltag-freizeit-hobbys':
      return `
        <path d="M78 22 44 56c-8-2-17 3-20 11-4 10 3 21 14 23 11 2 22-6 23-17l1-4 28-28-6-6 9-9-7-7-8 9Z" fill="#c084fc" stroke="#f5d0fe" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="41" cy="73" r="6" fill="#1e1b4b" stroke="#fde047" stroke-width="2"/>
        <path d="M84 62v22a6 6 0 1 1-4-5.6V62l16-4v18a6 6 0 1 1-4-5.6V60l-8 2Z" fill="#fde047"/>`;
    case 'stadt-wege-reisen-a1':
      return `
        <path d="M20 88c22-26 24-4 44-22s16-24 36-30" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" fill="none" stroke-dasharray="6 7"/>
        <path d="M52 24c-11 0-20 9-20 20 0 15 20 34 20 34s20-19 20-34c0-11-9-20-20-20Z" fill="#f43f5e" stroke="#fecdd3" stroke-width="2.2"/>
        <circle cx="52" cy="44" r="7.5" fill="#fff"/>
        <circle cx="88" cy="82" r="14" fill="#0f172a" stroke="#fbbf24" stroke-width="2.2"/>
        <path d="M88 73l4 9-9-4 5-5Zm0 18-4-9 9 4-5 5Z" fill="#fbbf24"/>`;
    case 'koerper-gesundheit-wetter':
      return `
        <circle cx="40" cy="40" r="14" fill="#fbbf24"/>
        <path d="M40 19v5M40 56v5M19 40h5M56 40h5M25 25l4 4M51 51l4 4" stroke="#fde047" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M46 56c0-7 6-12 13-12 5 0 9 3 11 7 7 0 12 5 12 11s-5 11-12 11H48c-7 0-12-4-12-10 0-5 4-9 10-7Z" fill="#e0f2fe" stroke="#bae6fd" stroke-width="1.6"/>
        <rect x="69" y="72" width="10" height="26" rx="3" fill="#fb7185"/>
        <rect x="61" y="80" width="26" height="10" rx="3" fill="#fb7185"/>`;

    // ======================== A2 (12 уникальных) ========================
    case 'alltag-familie':
      return `
        <path d="M60 22 22 52h11v39h54V52h11L60 22Z" fill="#047857" stroke="#a7f3d0" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M60 52c4-5.5 11-4.5 11 2 0 6-11 14-11 14S49 60 49 54c0-6.5 7-7.5 11-2Z" fill="#fb7185"/>
        <rect x="36" y="72" width="48" height="19" rx="3" fill="#064e3b"/>
        <circle cx="88" cy="30" r="9" fill="#fde047" fill-opacity="0.7"/>`;
    case 'schule-beruf':
      return `
        <path d="M60 24 18 44l42 20 42-20-42-20Z" fill="#6366f1" stroke="#c7d2fe" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M34 52v19c0 8 11.6 14 26 14s26-6 26-14V52L60 64 34 52Z" fill="#4338ca" stroke="#a5b4fc" stroke-width="1.8"/>
        <path d="M94 48v24" stroke="#fbbf24" stroke-width="3.2" stroke-linecap="round"/>
        <circle cx="94" cy="75" r="4.5" fill="#fde047"/>
        <rect x="30" y="88" width="60" height="10" rx="5" fill="#fde68a" stroke="#f59e0b" stroke-width="1.6"/>`;
    case 'medien-kino':
      return `
        <path d="M22 40h76l-5-14-71 7v7Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.6"/>
        <path d="M32 31l10 8M52 29l10 10M72 27l10 12" stroke="#0f172a" stroke-width="5"/>
        <rect x="22" y="42" width="76" height="52" rx="8" fill="#1e293b" stroke="#67e8f9" stroke-width="2.2"/>
        <circle cx="60" cy="68" r="16" fill="#0284c7" fill-opacity="0.35" stroke="#38bdf8" stroke-width="2"/>
        <path d="M55 59l15 9-15 9V59Z" fill="#fde047"/>`;
    case 'ereignisse-gefuehle':
      return `
        <rect x="26" y="50" width="68" height="44" rx="8" fill="#ec4899" stroke="#fbcfe8" stroke-width="2"/>
        <rect x="22" y="40" width="76" height="14" rx="5" fill="#f43f5e" stroke="#fecdd3" stroke-width="1.8"/>
        <rect x="55" y="40" width="10" height="54" fill="#fde047"/>
        <path d="M60 40c-9-14-24-11-18 0h18Zm0 0c9-14 24-11 18 0H60Z" fill="#fbbf24"/>
        <circle cx="30" cy="24" r="4" fill="#38bdf8"/>
        <circle cx="90" cy="22" r="4.5" fill="#fde047"/>
        <circle cx="78" cy="28" r="3" fill="#4ade80"/>`;
    case 'stadt-behoerden':
      return `
        <path d="M60 20 22 42h76L60 20Z" fill="#38bdf8" stroke="#bae6fd" stroke-width="2"/>
        <rect x="30" y="46" width="10" height="36" rx="2" fill="#93c5fd"/>
        <rect x="55" y="46" width="10" height="36" rx="2" fill="#93c5fd"/>
        <rect x="80" y="46" width="10" height="36" rx="2" fill="#93c5fd"/>
        <rect x="20" y="84" width="80" height="12" rx="4" fill="#1d4ed8" stroke="#60a5fa" stroke-width="1.5"/>`;
    case 'beruf-bahnhof':
      return `
        <path d="M27 33c0-5 5-9 10-9h8l5 15-8 6c4 10 12 18 22 22l6-8 15 5v8c0 5-4 10-9 10-27 0-49-22-49-49Z" fill="#fb923c" stroke="#fed7aa" stroke-width="2.2" stroke-linejoin="round"/>
        <circle cx="80" cy="38" r="18" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
        <path d="M80 27v11l8 5" stroke="#7dd3fc" stroke-width="2.8" stroke-linecap="round"/>`;
    case 'verkehr-routen':
      return `
        <rect x="32" y="20" width="56" height="58" rx="16" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2.4"/>
        <rect x="39" y="28" width="42" height="20" rx="6" fill="#0f172a" stroke="#60a5fa" stroke-width="1.6"/>
        <circle cx="43" cy="64" r="5" fill="#fde047"/>
        <circle cx="77" cy="64" r="5" fill="#fde047"/>
        <path d="M38 78 24 98M82 78l14 20M31 89h58" stroke="#7dd3fc" stroke-width="3.5" stroke-linecap="round"/>`;
    case 'lernen-pruefungen':
      return `
        <rect x="24" y="20" width="56" height="76" rx="8" fill="#f8fafc" stroke="#99f6e4" stroke-width="2"/>
        <path d="M36 38h32M36 52h24M36 66h28" stroke="#64748b" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="76" cy="76" r="19" fill="#10b981" stroke="#d1fae5" stroke-width="2.4"/>
        <path d="M67 76l6 6 12-13" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'sport-reisen':
      return `
        <circle cx="60" cy="60" r="34" fill="#f8fafc" stroke="#a3e635" stroke-width="3"/>
        <polygon points="60,42 75,53 69,71 51,71 45,53" fill="#0f172a"/>
        <path d="M60 42V26M75 53l16-6M69 71l11 14M51 71 40 85M45 53 29 47" stroke="#0f172a" stroke-width="3.2" stroke-linecap="round"/>`;
    case 'wohnen-nachbarn':
      return `
        <ellipse cx="60" cy="73" rx="20" ry="17" fill="#fbbf24" stroke="#fef08a" stroke-width="2"/>
        <ellipse cx="33" cy="52" rx="7.5" ry="10.5" transform="rotate(-18 33 52)" fill="#fbbf24"/>
        <ellipse cx="50" cy="36" rx="7" ry="10.5" transform="rotate(-6 50 36)" fill="#fde047"/>
        <ellipse cx="70" cy="36" rx="7" ry="10.5" transform="rotate(6 70 36)" fill="#fde047"/>
        <ellipse cx="87" cy="52" rx="7.5" ry="10.5" transform="rotate(18 87 52)" fill="#fbbf24"/>
        <path d="M51 74c3 5 15 5 18 0" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>`;
    case 'lebensphasen-ausflug':
      return `
        <circle cx="60" cy="60" r="35" fill="#1e1b4b" stroke="#fbbf24" stroke-width="3.2"/>
        <circle cx="60" cy="60" r="27" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="4 4"/>
        <polygon points="60,28 69,60 60,55 51,60" fill="#fb7185"/>
        <polygon points="60,92 69,60 60,65 51,60" fill="#e2e8f0"/>
        <circle cx="60" cy="60" r="4.5" fill="#fde047"/>`;
    case 'kultur-festivals':
      return `
        <path d="M22 30c10-5 24-5 34 0v26c0 14-8 24-17 24s-17-10-17-24V30Z" fill="#ec4899" stroke="#fbcfe8" stroke-width="2"/>
        <path d="M31 45c3 3 6 3 9 0M42 45c3 3 6 3 9 0" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M32 61c4 5 10 5 14 0" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M62 40c10-5 24-5 34 0v26c0 14-8 24-17 24s-17-10-17-24V40Z" fill="#6366f1" stroke="#c7d2fe" stroke-width="2"/>
        <circle cx="72" cy="54" r="3" fill="#fff"/>
        <circle cx="86" cy="54" r="3" fill="#fff"/>
        <path d="M72 72c4-4 10-4 14 0" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/>`;

    // ======================== B1 (12 уникальных) ========================
    case 'ein-neuer-start':
      return `
        <path d="M60 16c14 14 18 32 16 52H44c-2-20 2-38 16-52Z" fill="#f8fafc" stroke="#7dd3fc" stroke-width="2.2"/>
        <path d="M44 54 28 70l16 4V54Zm32 0 16 16-16 4V54Z" fill="#38bdf8"/>
        <circle cx="60" cy="44" r="8" fill="#0ea5e9" stroke="#bae6fd" stroke-width="2"/>
        <path d="M51 70h18l-4 22-5-7-5 7-4-22Z" fill="#f59e0b"/>
        <path d="M56 70h8l-4 15-4-15Z" fill="#fde047"/>`;
    case 'bewerbung-firma':
      return `
        <rect x="26" y="18" width="58" height="78" rx="8" fill="#fefce8" stroke="#fcd34d" stroke-width="2.2"/>
        <circle cx="44" cy="39" r="9" fill="#f59e0b"/>
        <path d="M58 35h18M58 43h14M36 58h38M36 69h38M36 80h26" stroke="#78350f" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M74 72 95 51l7 7-21 21-10 3 3-10Z" fill="#38bdf8" stroke="#0f172a" stroke-width="2"/>`;
    case 'arbeitswelt':
      return `
        <path d="M48 26l4 7 8-1 2 8 7 3-2 8 5 6-5 6 2 8-7 3-2 8-8-1-4 7-7-3-7 3-4-7-8 1-2-8-7-3 2-8-5-6 5-6-2-8 7-3 2-8 8 1 4-7 7 3 7-3Z" fill="#64748b" stroke="#cbd5e1" stroke-width="1.8"/>
        <circle cx="48" cy="56" r="11" fill="#0f172a" stroke="#fb923c" stroke-width="3"/>
        <circle cx="82" cy="80" r="16" fill="#f59e0b" stroke="#fde68a" stroke-width="2.5"/>
        <circle cx="82" cy="80" r="6" fill="#0f172a"/>`;
    case 'familie':
      return `
        <circle cx="47" cy="63" r="21" stroke="#fbbf24" stroke-width="6.5" fill="none"/>
        <circle cx="73" cy="63" r="21" stroke="#fda4af" stroke-width="6.5" fill="none"/>
        <path d="M60 22c5-7 14-5 14 3 0 8-14 17-14 17S46 33 46 25c0-8 9-10 14-3Z" fill="#f43f5e" stroke="#fecdd3" stroke-width="1.8"/>`;
    case 'digitale-welt':
      return `
        <circle cx="60" cy="62" r="30" fill="#0284c7" fill-opacity="0.24" stroke="#38bdf8" stroke-width="2.5"/>
        <ellipse cx="60" cy="62" rx="14" ry="30" stroke="#7dd3fc" stroke-width="2"/>
        <path d="M31 53h58M31 71h58" stroke="#7dd3fc" stroke-width="2"/>
        <path d="M40 28c11-8 29-8 40 0M47 36c7-5 19-5 26 0" stroke="#22d3ee" stroke-width="3" stroke-linecap="round"/>
        <circle cx="60" cy="62" r="5" fill="#fde047"/>`;
    case 'gesundheit':
      return `
        <path d="M22 60h18l9-22 12 40 11-28 8 10h18" stroke="#34d399" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M60 24c6-8 17-6 17 4 0 11-17 22-17 22S43 39 43 28c0-10 11-12 17-4Z" fill="#fb7185" fill-opacity="0.88" stroke="#fecdd3" stroke-width="1.8"/>`;
    case 'reisen-verkehr':
      return `
        <path d="M24 88c14-18 36-30 62-38" stroke="#93c5fd" stroke-width="2.5" stroke-dasharray="5 5"/>
        <path d="M24 64l66-32-18 38-13-7-12 13-2-17-21 5Z" fill="#f8fafc" stroke="#38bdf8" stroke-width="2.2" stroke-linejoin="round"/>
        <circle cx="32" cy="86" r="5" fill="#fde047"/>`;
    case 'natur-umwelt':
      return `
        <path d="M16 94 46 44l20 26 16-20 22 44H16Z" fill="#15803d" stroke="#86efac" stroke-width="2"/>
        <path d="M46 44 37 58h18L46 44Z" fill="#e2e8f0"/>
        <circle cx="86" cy="30" r="11" fill="#fde047"/>
        <path d="M26 30c6-7 17-7 23 0" stroke="#4ade80" stroke-width="3" stroke-linecap="round"/>`;
    case 'politik-gesellschaft':
      return `
        <path d="M60 22c-16 0-28 12-28 28h56c0-16-12-28-28-28Z" fill="#818cf8" stroke="#e0e7ff" stroke-width="2"/>
        <path d="M60 12v10" stroke="#fde047" stroke-width="3.2" stroke-linecap="round"/>
        <rect x="26" y="52" width="68" height="36" rx="4" fill="#312e81" stroke="#a5b4fc" stroke-width="2"/>
        <path d="M38 64v14M52 64v14M68 64v14M82 64v14" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
        <rect x="20" y="88" width="80" height="8" rx="3" fill="#a78bfa"/>`;
    case 'damals-heute':
      return `
        <rect x="34" y="20" width="52" height="8" rx="4" fill="#fbbf24"/>
        <rect x="34" y="92" width="52" height="8" rx="4" fill="#fbbf24"/>
        <path d="M40 28c0 19 20 25 20 32s-20 13-20 32h40c0-19-20-25-20-32s20-13 20-32H40Z" fill="#0f172a" stroke="#fde68a" stroke-width="2.4"/>
        <path d="M46 86h28c-3-10-10-16-14-18-4 2-11 8-14 18Z" fill="#f59e0b"/>
        <path d="M47 36h26c-3 8-9 13-13 15-4-2-10-7-13-15Z" fill="#fde047" fill-opacity="0.75"/>`;
    case 'wuensche':
      return `
        <path d="M22 86c16-24 38-42 66-54" stroke="#fde047" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="2 7"/>
        <polygon points="82,22 87,35 101,35 90,43 94,56 82,48 70,56 74,43 63,35 77,35" fill="#fde047" stroke="#fef9c3" stroke-width="1.5"/>
        <circle cx="34" cy="34" r="3.5" fill="#38bdf8"/>
        <circle cx="44" cy="84" r="3" fill="#e879f9"/>`;
    case 'wie-wird-es-sein':
      return `
        <circle cx="60" cy="54" r="28" fill="#6366f1" fill-opacity="0.35" stroke="#67e8f9" stroke-width="2.6"/>
        <ellipse cx="60" cy="54" rx="42" ry="12" transform="rotate(-16 60 54)" stroke="#e879f9" stroke-width="3" fill="none"/>
        <circle cx="51" cy="45" r="7" fill="#a5f3fc" fill-opacity="0.65"/>
        <path d="M40 88h40l-6 10H46l-6-10Z" fill="#f59e0b"/>`;

    // ======================== B2 (8 уникальных) ========================
    case 'kommunikation-argumentation':
      return `
        <rect x="47" y="20" width="26" height="42" rx="13" fill="#38bdf8" stroke="#e0f2fe" stroke-width="2.2"/>
        <path d="M35 48v5c0 14 11 25 25 25s25-11 25-25v-5" stroke="#a78bfa" stroke-width="4" stroke-linecap="round"/>
        <path d="M60 78v16M45 94h30" stroke="#c4b5fd" stroke-width="4" stroke-linecap="round"/>
        <path d="M24 34c-4 6-4 16 0 22M96 34c4 6 4 16 0 22" stroke="#fde047" stroke-width="3" stroke-linecap="round"/>`;
    case 'wirtschaft-finanzen-markt':
      return `
        <rect x="24" y="64" width="12" height="28" rx="3" fill="#34d399"/>
        <rect x="44" y="48" width="12" height="44" rx="3" fill="#10b981"/>
        <rect x="64" y="54" width="12" height="38" rx="3" fill="#38bdf8"/>
        <rect x="84" y="30" width="12" height="62" rx="3" fill="#fbbf24"/>
        <path d="M22 50l26-18 18 10 28-22" stroke="#fde047" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M84 20h10v10" stroke="#fde047" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'wissenschaft-forschung-ki':
      return `
        <ellipse cx="60" cy="60" rx="38" ry="15" transform="rotate(30 60 60)" stroke="#38bdf8" stroke-width="2.8" fill="none"/>
        <ellipse cx="60" cy="60" rx="38" ry="15" transform="rotate(-30 60 60)" stroke="#a78bfa" stroke-width="2.8" fill="none"/>
        <ellipse cx="60" cy="60" rx="38" ry="15" transform="rotate(90 60 60)" stroke="#22d3ee" stroke-width="2.8" fill="none"/>
        <circle cx="60" cy="60" r="10" fill="#fde047" stroke="#fff" stroke-width="2"/>
        <circle cx="92" cy="42" r="4" fill="#38bdf8"/>
        <circle cx="28" cy="78" r="4" fill="#e879f9"/>`;
    case 'kultur-kunst-medienkritik':
      return `
        <path d="M60 22c-22 0-38 15-38 35 0 18 14 33 32 33 6 0 10-3 10-8 0-4-3-7-3-11 0-6 5-10 12-10h7c11 0 18-8 18-17 0-13-16-22-38-22Z" fill="#fde68a" stroke="#f59e0b" stroke-width="2.2"/>
        <circle cx="42" cy="44" r="5.5" fill="#f43f5e"/>
        <circle cx="58" cy="35" r="5.5" fill="#38bdf8"/>
        <circle cx="76" cy="41" r="5.5" fill="#a855f7"/>
        <circle cx="39" cy="63" r="5.5" fill="#10b981"/>
        <circle cx="76" cy="72" r="6" fill="#1f1126"/>`;
    case 'recht-staat-demokratie':
      return `
        <path d="M60 24v64M38 90h44" stroke="#fbbf24" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M26 38h68" stroke="#fde047" stroke-width="4" stroke-linecap="round"/>
        <path d="M26 38 16 62h20L26 38Zm68 0L84 62h20L94 38Z" stroke="#93c5fd" stroke-width="2" fill="none"/>
        <path d="M14 62c0 8 24 8 24 0H14Zm68 0c0 8 24 8 24 0H82Z" fill="#38bdf8"/>
        <circle cx="60" cy="24" r="5" fill="#fde047"/>`;
    case 'psychologie-beziehungen-ethik':
      return `
        <path d="M58 26c-14 0-24 10-24 23 0 5 2 9 5 12-3 4-4 10-1 15 4 7 12 10 20 8V26Z" fill="#f472b6" stroke="#fbcfe8" stroke-width="2"/>
        <path d="M62 26c14 0 24 10 24 23 0 5-2 9-5 12 3 4 4 10 1 15-4 7-12 10-20 8V26Z" fill="#a78bfa" stroke="#ddd6fe" stroke-width="2"/>
        <path d="M44 46c6 0 8 6 4 10M76 46c-6 0-8 6-4 10M60 36v38" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>`;
    case 'karriere-fuehrung-management':
      return `
        <path d="M26 80 34 38l18 16L60 28l8 26 18-16 8 42H26Z" fill="#fbbf24" stroke="#fef9c3" stroke-width="2.2" stroke-linejoin="round"/>
        <rect x="26" y="84" width="68" height="10" rx="4" fill="#f59e0b"/>
        <circle cx="34" cy="34" r="4" fill="#38bdf8"/>
        <circle cx="60" cy="24" r="5" fill="#fef08a"/>
        <circle cx="86" cy="34" r="4" fill="#38bdf8"/>`;
    case 'klima-nachhaltigkeit-global':
      return `
        <circle cx="60" cy="60" r="33" fill="#0284c7" stroke="#6ee7b7" stroke-width="2.5"/>
        <path d="M42 40c8-5 16-2 19 6 2 6-5 11-2 18 3 6 12 7 14 14 2 6-7 12-16 11-9-1-16-10-19-20-3-10-2-24 4-29Z" fill="#22c55e"/>
        <path d="M74 36c9 4 15 13 15 22-6 3-13-2-16-8-3-6-3-11 1-14Z" fill="#4ade80"/>
        <path d="M28 60c-4-18 14-35 32-35" stroke="#fde047" stroke-width="2.6" stroke-linecap="round" fill="none"/>`;

    // ======================== User / Fallback ========================
    case 'anki':
      return `
        <rect x="30" y="24" width="54" height="66" rx="10" transform="rotate(-8 57 57)" fill="#1e293b" stroke="#38bdf8" stroke-width="2.2"/>
        <rect x="36" y="26" width="54" height="66" rx="10" fill="#0f172a" stroke="#c084fc" stroke-width="2.4"/>
        <path d="M63 41l5 10.5 11.5 1.7-8.3 8.1 2 11.5-10.2-5.4-10.2 5.4 2-11.5-8.3-8.1 11.5-1.7L63 41Z" fill="#fde047"/>`;
    case 'user-deck':
      return `
        <rect x="28" y="20" width="60" height="76" rx="9" fill="#0f766e" stroke="#67e8f9" stroke-width="2.2"/>
        <path d="M42 42h32M42 56h26M42 70h20" stroke="#e2e8f0" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="80" cy="76" r="14" fill="#38bdf8" stroke="#e0f2fe" stroke-width="2"/>
        <path d="M74 76h12M80 70v12" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>`;
    default:
      return `
        <circle cx="60" cy="60" r="28" fill="${c3}" fill-opacity="0.24" stroke="${c3}" stroke-width="2.6"/>
        <path d="M60 36v48M36 60h48" stroke="#f8fafc" stroke-width="3" stroke-linecap="round"/>`;
  }
}

export function renderCourseArtworkSvg(course, variant = 'tile') {
  const key = getCourseArtKey(course);
  const [c1, c2, c3] = PALETTES[key] || PALETTES.base;
  const uid = `${key}_${variant}`.replace(/[^a-z0-9_]/gi, '_');

  let cls = 'deck-tile-svg deck-unique-art-svg';
  if (variant === 'mission') cls = 'mission-art-svg';
  else if (variant === 'card') cls = 'qs-svg-icon qs-unique-art-svg';
  else if (variant === 'mini') cls = 'home-theme-mini-svg';

  return `<svg class="${cls}" viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <defs>
      <radialGradient id="da_bg_${uid}" cx="30%" cy="24%" r="82%">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="100%" stop-color="${c2}" />
      </radialGradient>
    </defs>
    <rect width="120" height="120" rx="22" fill="url(#da_bg_${uid})" />
    <circle cx="24" cy="22" r="2.2" fill="#ffffff" fill-opacity="0.35" />
    <circle cx="98" cy="26" r="1.8" fill="${c3}" fill-opacity="0.6" />
    <circle cx="94" cy="96" r="2.2" fill="#ffffff" fill-opacity="0.28" />
    ${getMotifMarkup(key, c3)}
  </svg>`;
}
