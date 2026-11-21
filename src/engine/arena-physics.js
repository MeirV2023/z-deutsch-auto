// Геометрия арены, авто-замедление длинных слов и анти-коллизии капсул (SRP)
import { shuffleArray } from '../core/utils.js';
import { CANVAS_WORD_FONT } from '../config/constants.js';
import { getWordTranslation, isEntryPinned, state } from '../state/store.js';
import {
  battleArenaFrame,
  canvas,
  ctx,
  titleBottomDock,
  titleHeaderCard,
  titleSpaceWindow,
  ztypeKeyboard
} from '../ui/dom.js';

export function getPlayBounds() {
  if (state.screenMode === 'title') {
    if (titleSpaceWindow) {
      const rect = titleSpaceWindow.getBoundingClientRect();
      if (rect.width > 80 && rect.height > 70) {
        const left = rect.left + 10;
        const right = Math.max(left + 120, rect.right - 10);
        const top = rect.top + (window.innerWidth > 768 ? 94 : 56);
        const bottom = Math.max(top + 66, rect.bottom - (window.innerWidth > 768 ? 16 : 12));
        return {
          left,
          right,
          top,
          bottom,
          centerX: (left + right) / 2,
          clipRect: {
            x: rect.left + 2,
            y: rect.top + 2,
            w: Math.max(40, rect.width - 4),
            h: Math.max(40, rect.height - 4)
          }
        };
      }
    }

    const headerRect = titleHeaderCard ? titleHeaderCard.getBoundingClientRect() : null;
    const dockRect = titleBottomDock ? titleBottomDock.getBoundingClientRect() : null;
    const headerBottom = headerRect && headerRect.height > 0 ? headerRect.bottom : 140;
    const dockTop = dockRect && dockRect.height > 0 ? dockRect.top : (canvas.height - 280);
    const safeTop = Math.max(14, headerBottom + 8);
    const safeBottom = Math.max(safeTop + 60, dockTop - 8);
    return {
      left: 16,
      right: Math.max(280, canvas.width - 16),
      top: safeTop,
      bottom: safeBottom,
      centerX: canvas.width / 2,
      clipRect: null
    };
  }

  const kbdRect = ztypeKeyboard ? ztypeKeyboard.getBoundingClientRect() : { height: 0, top: canvas.height };
  const kbdVisible = kbdRect.height > 20;

  if (battleArenaFrame) {
    const aRect = battleArenaFrame.getBoundingClientRect();
    if (aRect.width > 120 && aRect.height > 120) {
      const left = aRect.left + 12;
      const right = Math.max(left + 180, aRect.right - 12);
      const top = window.innerWidth <= 768 ? (aRect.top + 20) : (aRect.top + 46);
      const rawBottom = kbdVisible
        ? Math.min(aRect.bottom - 10, kbdRect.top - 8)
        : (aRect.bottom - 54);
      const bottom = Math.max(top + 120, rawBottom);
      return {
        left,
        right,
        top,
        bottom,
        centerX: (left + right) / 2,
        clipRect: {
          x: aRect.left + 2,
          y: aRect.top + 2,
          w: Math.max(60, aRect.width - 4),
          h: Math.max(60, aRect.height - 4)
        }
      };
    }
  }

  const isDesktopWide = window.innerWidth > 960;
  const leftPad = isDesktopWide ? 280 : 8;
  const rightPad = isDesktopWide ? 308 : 8;
  const left = leftPad;
  const right = Math.max(left + 220, canvas.width - rightPad);
  const top = isDesktopWide ? 96 : 64;
  const bottom = Math.max(top + 160, kbdVisible ? kbdRect.top - 8 : canvas.height - 64);

  return {
    left,
    right,
    top,
    bottom,
    centerX: (left + right) / 2,
    clipRect: null
  };
}

export function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const bounds = getPlayBounds();
  state.ship.x = bounds.centerX;
  state.ship.targetY = state.screenMode === 'title'
    ? Math.max(bounds.top + 42, bounds.bottom - 24)
    : bounds.bottom - 24;
  if (!state.ship.y) state.ship.y = state.ship.targetY;
  initStars();
  initNebulae();
}

export function initStars() {
  const count = Math.floor((canvas.width * canvas.height) / 9500);
  state.stars = [];
  for (let i = 0; i < count; i++) {
    state.stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.9 + 0.4,
      speed: Math.random() * 24 + 7,
      alpha: Math.random() * 0.7 + 0.2,
      twinklePhase: Math.random() * Math.PI * 2
    });
  }
}

export function initNebulae() {
  const palette = [
    'rgba(34, 211, 238, 0.08)',
    'rgba(139, 92, 246, 0.085)',
    'rgba(16, 185, 129, 0.07)'
  ];
  state.nebulae = palette.map((color, idx) => ({
    x: canvas.width * (0.22 + idx * 0.28),
    y: canvas.height * (0.28 + (idx % 2) * 0.22),
    radius: Math.max(canvas.width, canvas.height) * (0.28 + idx * 0.05),
    vx: (idx % 2 === 0 ? 1 : -1) * (4 + idx * 1.5),
    vy: (idx === 1 ? -1 : 1) * 2.5,
    color
  }));
}

export function getTargetString(wordEntry) {
  if (!wordEntry) return '';
  return state.typeWithArticle ? (wordEntry.withArticle || wordEntry.word) : wordEntry.word;
}

export function mapTargetCharToBaseKey(ch) {
  if (!ch) return '';
  const low = ch.toLowerCase();
  if (low === 'ñ') {
    return state.targetLang === 'es' ? 'ñ' : 'n';
  }
  if (low === 'ä' || low === 'á' || low === 'à' || low === 'â') return 'a';
  if (low === 'é' || low === 'è' || low === 'ê' || low === 'ë') return 'e';
  if (low === 'í' || low === 'ì' || low === 'î' || low === 'ï') return 'i';
  if (low === 'ö' || low === 'ó' || low === 'ò' || low === 'ô') return 'o';
  if (low === 'ü' || low === 'ú' || low === 'ù' || low === 'û') return 'u';
  if (low === 'ß') return 's';
  return low;
}

export function charsMatchTargetLang(inputChar, targetChar) {
  if (!inputChar || !targetChar) return { matched: false, umlautSub: false, eszettSub: false };
  const inp = inputChar.toLowerCase();
  const tgt = targetChar.toLowerCase();
  if (inp === tgt) return { matched: true, umlautSub: false, eszettSub: false };

  // Немецкие умлауты и эсцет
  if (tgt === 'ä' && inp === 'a') return { matched: true, umlautSub: true, eszettSub: false };
  if (tgt === 'ö' && inp === 'o') return { matched: true, umlautSub: true, eszettSub: false };
  if (tgt === 'ü' && inp === 'u') return { matched: true, umlautSub: true, eszettSub: false };
  if (tgt === 'ß' && inp === 's') return { matched: true, umlautSub: false, eszettSub: true };

  // Испанские диакритики и ñ (чтобы удобно печатать и с испанской, и со стандартной клавиатуры!)
  if ((tgt === 'á' || tgt === 'à') && (inp === 'a' || inp === 'á')) return { matched: true, umlautSub: false, eszettSub: false };
  if ((tgt === 'é' || tgt === 'è') && (inp === 'e' || inp === 'é')) return { matched: true, umlautSub: false, eszettSub: false };
  if ((tgt === 'í' || tgt === 'ì') && (inp === 'i' || inp === 'í')) return { matched: true, umlautSub: false, eszettSub: false };
  if ((tgt === 'ó' || tgt === 'ò') && (inp === 'o' || inp === 'ó')) return { matched: true, umlautSub: false, eszettSub: false };
  if ((tgt === 'ú' || tgt === 'ù') && (inp === 'u' || inp === 'ú')) return { matched: true, umlautSub: false, eszettSub: false };
  if (tgt === 'ñ' && (inp === 'ñ' || inp === 'n')) return { matched: true, umlautSub: false, eszettSub: false };

  return { matched: false, umlautSub: false, eszettSub: false };
}

export function getHorizontalPan(x) {
  const bounds = getPlayBounds();
  const halfSpan = Math.max(120, (bounds.right - bounds.left) / 2);
  return Math.max(-0.65, Math.min(0.65, (x - bounds.centerX) / halfSpan));
}


export function computeWordLengthSpeedFactor(charCount) {
  const len = Math.max(1, charCount);
  if (len <= 7) {
    return 1.04;
  }
  if (len <= 14) {
    // Плавное снижение с 1.00 (8 букв) до 0.74 (14 букв)
    return 1.04 - (len - 7) * 0.043;
  }
  // Для длинных и составных слов (> 14 символов) включается прогрессивное защитное замедление:
  // 18 букв -> 0.52x, 22 буквы -> 0.39x, 27 букв -> 0.30x
  return Math.max(0.27, 0.74 * Math.pow(14 / len, 1.38));
}

export function getWordFontPx(textLength) {
  const isMobile = canvas.width < 600;
  if (state.screenMode === 'title') {
    if (isMobile) {
      return textLength >= 15 ? 14 : 16;
    }
    if (textLength >= 16) return 14;
    if (textLength >= 12) return 15.5;
    return 17;
  }
  if (!isMobile) {
    if (textLength >= 23) return 18.5;
    if (textLength >= 18) return 21.5;
    if (textLength >= 13) return 25;
    return 29; // Rubik · 700 · 28–36px для слов в игре (der Motor)
  }
  if (textLength >= 22) return 14.5;
  if (textLength >= 17) return 16.5;
  if (textLength >= 12) return 19;
  return 22;
}

export function getTopBadgeTextForWord(entry) {
  if (!entry) return '';
  const showArt = !state.typeWithArticle && Boolean(entry.article);
  const showTransHint = state.screenMode === 'play' && state.studyMode === 'translate';
  if (!showArt && !showTransHint) return '';
  if (showTransHint) {
    let shortTr = getWordTranslation(entry) || '';
    if (shortTr.length > 22) shortTr = shortTr.slice(0, 21) + '…';
    return showArt ? `${entry.article} · ${shortTr}` : shortTr;
  }
  return entry.article || '';
}

export function measureWordCapsule(text, entry) {
  const fontPx = getWordFontPx(text.length);
  if (state.screenMode === 'title' && canvas.width > 768) {
    const artRaw = (entry && entry.article) || '';
    const hasRealArt = Boolean(artRaw) && !['Verb', 'Noun', 'Adj.', 'Adv.'].includes(artRaw) && !state.typeWithArticle;
    const artPrefix = hasRealArt ? `${artRaw} ` : '';
    const displayTop = `${artPrefix}${text}`;
    ctx.font = `700 ${fontPx}px ${CANVAS_WORD_FONT}`;
    const topW = ctx.measureText(displayTop).width;
    let transStr = entry ? getWordTranslation(entry) : '';
    if (transStr.length > 18) transStr = transStr.slice(0, 17) + '…';
    ctx.font = `500 11px ${CANVAS_WORD_FONT}`;
    const subW = transStr ? ctx.measureText(transStr).width : 0;
    const boxW = Math.max(96, Math.max(topW, subW) + 28);
    const boxH = fontPx + 30;
    return { boxW, boxH, fontPx };
  }
  ctx.font = `700 ${fontPx}px ${CANVAS_WORD_FONT}`;
  const textW = ctx.measureText(text).width;
  const padX = canvas.width < 520 ? 11 : 15;
  const starExtra = entry && isEntryPinned(entry) ? 16 : 0;
  let boxW = textW + padX * 2 + starExtra + 16; // +16 под правый индикатор цели
  const badgeStr = getTopBadgeTextForWord(entry);
  if (badgeStr) {
    ctx.font = `700 12.5px ${CANVAS_WORD_FONT}`;
    const badgeW = ctx.measureText(badgeStr).width + 20;
    boxW = Math.max(boxW, badgeW);
  }
  const boxH = fontPx + 16 + (badgeStr ? 20 : 0);
  return { boxW, boxH, fontPx };
}

// ==========================================================================
// 4) АНТИ-НАЛОЖЕНИЕ ПЛАШЕК СЛОВ В ПОЛЁТЕ И ПРИ СПАВНЕ
//    Проверяет габариты по X и Y; если верхнее быстрое слово догоняет нижнее,
//    временно выравнивает его скорость и мягко разводит плашки по горизонтали!
// ==========================================================================
export function findSafeSpawnX(boxW, boxH, spawnY, wordList, bounds) {
  const halfW = Math.min((bounds.right - bounds.left) * 0.48, boxW / 2 + 6);
  const minX = bounds.left + halfW;
  const maxX = Math.max(minX + 2, bounds.right - halfW);

  // Генерируем равномерную сетку дорожек + случайное смещение
  const candidates = [];
  const laneCount = 9;
  for (let i = 0; i < laneCount; i++) {
    const frac = laneCount === 1 ? 0.5 : i / (laneCount - 1);
    const jitter = (Math.random() - 0.5) * 28;
    const cx = Math.max(minX, Math.min(maxX, minX + frac * (maxX - minX) + jitter));
    candidates.push(cx);
  }
  const shuffled = shuffleArray(candidates);

  let bestX = shuffled[0] || bounds.centerX;
  let bestClearance = -Infinity;

  for (const candX of shuffled) {
    let minScore = Infinity;
    let hardOverlap = false;

    for (const other of wordList) {
      const otherW = other.boxW || 130;
      const otherH = other.boxH || 48;
      const reqX = (boxW + otherW) * 0.5 + 16;
      const reqY = (boxH + otherH) * 0.5 + 22;
      const dx = Math.abs(other.x - candX);
      const dy = Math.abs(other.y - spawnY);

      if (dy < reqY && dx < reqX) {
        hardOverlap = true;
        minScore = Math.min(minScore, (dx - reqX) + (dy - reqY));
      } else if (dy < reqY + 65) {
        minScore = Math.min(minScore, dx - reqX * 0.65);
      }
    }

    if (!hardOverlap) {
      return { x: candX, clear: true };
    }
    if (minScore > bestClearance) {
      bestClearance = minScore;
      bestX = candX;
    }
  }

  return { x: bestX, clear: wordList.length === 0 };
}

export function resolveWordCollisions(wordList, bounds, dt, minTopY) {
  if (!wordList || wordList.length < 2) return;

  // Обновляем габариты и сбрасываем временное торможение кадра
  for (const w of wordList) {
    if (!w.boxW || !w.boxH) {
      const m = measureWordCapsule(w.text, w.entry);
      w.boxW = m.boxW;
      w.boxH = m.boxH;
    }
    w.frameVy = w.vy;
  }

  // Сортируем снизу вверх (сначала нижние слова, чтобы верхние подстраивались под нижние)
  const byBottomFirst = wordList.slice().sort((a, b) => b.y - a.y);

  for (let i = 0; i < byBottomFirst.length; i++) {
    const lower = byBottomFirst[i];
    for (let j = i + 1; j < byBottomFirst.length; j++) {
      const upper = byBottomFirst[j]; // upper.y <= lower.y

      const minSepX = (upper.boxW + lower.boxW) * 0.5 + 14;
      const minSepY = (upper.boxH + lower.boxH) * 0.5 + 16;
      const dx = upper.x - lower.x;
      const absDx = Math.abs(dx);
      const dy = lower.y - upper.y;

      // Если верхнее слово догоняет нижнее в одной вертикальной полосе:
      if (absDx < minSepX && dy < minSepY + 30) {
        // 1. Временно выравниваем вертикальную скорость верхнего слова по нижнему!
        if (upper.frameVy > lower.frameVy * 0.92) {
          upper.frameVy = lower.frameVy * 0.92;
        }

        // 2. Мягко разводим слова по горизонтали туда, где больше места до края арены
        let dir = dx === 0 ? ((upper.id % 2 === 0) ? 1 : -1) : Math.sign(dx);
        const upperHalf = upper.boxW * 0.5 + 8;
        if (upper.x + dir * 24 > bounds.right - upperHalf) dir = -1;
        if (upper.x + dir * 24 < bounds.left + upperHalf) dir = 1;

        const overlapRatioX = 1 - absDx / Math.max(1, minSepX);
        const steerSpeed = (38 + 52 * overlapRatioX) * dt;
        upper.x += dir * steerSpeed;
        lower.x -= dir * steerSpeed * 0.35;

        // 3. Если плашки уже зашли в зону пересечения (например, после спавна или грави-волны) — мягко раздвигаем и по Y
        if (dy < minSepY) {
          const pushUp = Math.min((minSepY - dy) * 0.55, 90 * dt + 1.5);
          if (upper.y - pushUp >= minTopY) {
            upper.y -= pushUp;
          } else {
            lower.y += pushUp * 0.5;
          }
        }
      }
    }
  }

  // Применяем горизонтальные границы арены после разведения
  for (const w of wordList) {
    const half = Math.min((bounds.right - bounds.left) * 0.48, (w.boxW || 110) * 0.5 + 4);
    w.x = Math.max(bounds.left + half, Math.min(bounds.right - half, w.x));
  }
}

export function separateFloatingTranslations(bounds) {
  const list = state.floatingTranslations;
  if (list.length < 2) return;
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i];
      const b = list[j];
      const dy = Math.abs(a.y - b.y);
      const dx = Math.abs(a.x - b.x);
      if (dy < 66 && dx < 210) {
        if (a.y <= b.y) {
          a.y = Math.max(bounds.top + 38, b.y - 68);
        } else {
          b.y = Math.max(bounds.top + 38, a.y - 68);
        }
      }
    }
  }
}

export function spawnParticles(x, y, color, count, maxSpeed) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 25 + Math.random() * maxSpeed;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 2.8 + 1.4,
      color,
      alpha: 1.0,
      decay: 0.9 + Math.random() * 0.9
    });
  }
}

export function scatterWordsToTop(wordList, bounds, strength = 1.0, minTopOffset = 34) {
  state.repulsorWaves.push({
    x: state.ship.x,
    y: state.ship.y - 12,
    radius: 24,
    maxRadius: Math.max(240, (bounds.bottom - bounds.top) * (0.58 + 0.45 * strength)),
    alpha: 0.95,
    color: '#2dd4bf',
    coreColor: '#e0f2fe',
    lineWidth: strength >= 0.85 ? 4.5 : 3.0
  });

  if (!wordList || wordList.length === 0) return;

  const sorted = wordList.slice().sort((a, b) => a.x - b.x);
  const count = sorted.length;
  const padX = Math.min(72, Math.max(44, (bounds.right - bounds.left) * 0.1));
  const spanW = Math.max(100, (bounds.right - bounds.left) - padX * 2);
  const startX = bounds.left + padX;

  sorted.forEach((w, idx) => {
    const slotFrac = count === 1 ? 0.5 : idx / (count - 1);
    const targetX = startX + slotFrac * spanW + (Math.random() - 0.5) * 28;
    let desiredDx = (targetX - w.x) * (0.5 + 0.5 * strength);
    if (Math.abs(desiredDx) < 26) {
      desiredDx = (idx % 2 === 0 ? -1 : 1) * (30 + Math.random() * 28) * strength;
    }
    w.pushVx = desiredDx * 3.0;

    const rowOffset = (idx % 3) * 32;
    const startLineY = bounds.top + minTopOffset + rowOffset + Math.random() * 10;
    const currentDist = Math.max(42, w.y - startLineY);
    const liftDist = strength >= 0.85 ? currentDist : Math.max(58, currentDist * 0.62);

    w.pushVy = Math.min(w.pushVy || 0, -(liftDist * 2.95 + (w.vy || 16) * 0.8));
    w.hitFlash = Math.max(w.hitFlash || 0, 0.85);

    spawnParticles(w.x, w.y + 8, '#2dd4bf', strength >= 0.85 ? 6 : 3, 95);
  });
}
