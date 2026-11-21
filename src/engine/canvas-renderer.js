// Чистый 2D-рендерер холста: корабль, капсулы слов, лазеры и всплывающий перевод (SRP)
import { roundRect } from '../core/utils.js';
import { CANVAS_HEADING_FONT, CANVAS_WORD_FONT, getArticleStyle } from '../config/constants.js';
import {
  getCurrentWeapon,
  getWordTranslation,
  isEntryPinned,
  isHebrewUI,
  isRtlTranslation,
  state,
  t
} from '../state/store.js';
import { canvas, ctx } from '../ui/dom.js';
import { getPlayBounds, getTopBadgeTextForWord, getWordFontPx } from './arena-physics.js';

export function render(now = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const bounds = getPlayBounds();
  const starClipBottom = state.screenMode === 'title' ? canvas.height : bounds.bottom;

  for (const neb of state.nebulae) {
    const grad = ctx.createRadialGradient(neb.x, neb.y, 10, neb.x, neb.y, neb.radius);
    grad.addColorStop(0, neb.color);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(neb.x, neb.y, neb.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const s of state.stars) {
    if (s.y > starClipBottom) continue;
    const twinkle = 0.78 + 0.22 * Math.sin(now * 0.003 + s.twinklePhase);
    const a = s.alpha * twinkle;

    if (state.warpTimer > 0) {
      ctx.strokeStyle = `rgba(165, 243, 252, ${Math.min(1, a + 0.25)})`;
      ctx.lineWidth = s.size;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - s.speed * 1.15);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    } else {
      ctx.fillStyle = `rgba(226, 232, 240, ${a})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (state.screenMode === 'title' && canvas.width > 768) {
    drawDesktopCosmicBackdrop();
  }

  // На полноэкранной странице «Мои колоды» рендерим только звёздное небо, туманности и горизонт на фоне
  if (state.screenMode === 'title' && state.homeSubView !== 'home') {
    return;
  }

  const hasClip = Boolean(bounds.clipRect);
  if (hasClip) {
    ctx.save();
    const clipRad = (state.screenMode === 'title' && canvas.width > 768) ? 22 : 16;
    roundRect(ctx, bounds.clipRect.x, bounds.clipRect.y, bounds.clipRect.w, bounds.clipRect.h, clipRad);
    ctx.clip();
  }

  if (state.screenMode === 'title') {
    if (canvas.width > 768) {
      drawDesktopPromoAtmosphere(bounds, now);
    } else {
      // Концентрические неоновые радарные дуги за кораблём в окне LIVE LESSON PREVIEW на мобильном
      const arcCx = bounds.centerX;
      const arcCy = bounds.bottom + 26;
      const arcRadii = [58, 104, 152];
      ctx.save();
      ctx.lineCap = 'round';
      arcRadii.forEach((rad, idx) => {
        const alpha = 0.28 - idx * 0.065;
        ctx.strokeStyle = `rgba(45, 212, 191, ${Math.max(0.08, alpha)})`;
        ctx.shadowColor = 'rgba(45, 212, 191, 0.45)';
        ctx.shadowBlur = idx === 0 ? 10 : 6;
        ctx.lineWidth = idx === 0 ? 1.5 : 1.15;
        ctx.beginPath();
        ctx.arc(arcCx, arcCy, rad, -Math.PI * 0.86, -Math.PI * 0.14);
        ctx.stroke();
      });
      ctx.restore();
    }
  } else if (state.screenMode === 'play') {
    ctx.save();
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.045)';
    ctx.lineWidth = 1;
    const gridSize = canvas.width < 520 ? 44 : 60;
    const gridTop = bounds.clipRect ? bounds.clipRect.y : 0;
    const gridBottom = bounds.clipRect ? bounds.clipRect.y + bounds.clipRect.h : bounds.bottom;
    for (let x = bounds.left; x <= bounds.right; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, gridTop);
      ctx.lineTo(x, gridBottom);
      ctx.stroke();
    }
    for (let y = gridTop; y <= gridBottom; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(bounds.left, y);
      ctx.lineTo(bounds.right, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  const lockedWord = state.activeWords.find(w => w.id === state.lockedWordId);
  if (lockedWord && state.running) {
    const w = getCurrentWeapon();
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = w.color;
    ctx.globalAlpha = 0.34;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(state.ship.x, state.ship.y);
    ctx.lineTo(lockedWord.x, lockedWord.y);
    ctx.stroke();
    ctx.restore();
  }

  for (const l of state.lasers) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, l.alpha);

    if (l.kind === 'tesla' && Array.isArray(l.points)) {
      ctx.strokeStyle = l.color;
      ctx.shadowColor = l.color;
      ctx.shadowBlur = 16;
      ctx.lineWidth = l.width || 2.6;
      ctx.beginPath();
      l.points.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();

      ctx.strokeStyle = l.coreColor || '#ffffff';
      ctx.lineWidth = 1.1;
      ctx.stroke();

      if (Array.isArray(l.branch)) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        l.branch.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
      }
    } else {
      ctx.strokeStyle = l.color;
      ctx.shadowColor = l.color;
      ctx.shadowBlur = l.kind === 'railgun' ? 20 : 13;
      ctx.lineWidth = l.width || 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(l.x1, l.y1);
      ctx.lineTo(l.x2, l.y2);
      ctx.stroke();

      if (l.coreColor) {
        ctx.strokeStyle = l.coreColor;
        ctx.lineWidth = Math.max(1, (l.width || 3) * 0.38);
        ctx.beginPath();
        ctx.moveTo(l.x1, l.y1);
        ctx.lineTo(l.x2, l.y2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  for (const m of state.missiles) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = m.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(m.x, m.y, 3.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  for (const sw of state.shockwaves) {
    ctx.save();
    ctx.strokeStyle = sw.color;
    ctx.globalAlpha = Math.max(0, sw.alpha);
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  for (const rw of state.repulsorWaves) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, rw.alpha);
    ctx.strokeStyle = rw.color || '#2dd4bf';
    ctx.shadowColor = rw.color || '#2dd4bf';
    ctx.shadowBlur = 18;
    ctx.lineWidth = rw.lineWidth || 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(rw.x, rw.y + rw.radius * 0.28, rw.radius, -Math.PI * 0.82, -Math.PI * 0.18);
    ctx.stroke();

    ctx.strokeStyle = rw.coreColor || '#e0f2fe';
    ctx.lineWidth = Math.max(1.2, (rw.lineWidth || 3.5) * 0.42);
    ctx.beginPath();
    ctx.arc(rw.x, rw.y + rw.radius * 0.28, rw.radius, -Math.PI * 0.79, -Math.PI * 0.21);
    ctx.stroke();
    ctx.restore();
  }

  for (const p of state.particles) {
    ctx.save();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 7;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawPlayerShip(now);

  if (state.screenMode === 'title') {
    const demoTarget = state.demoWords.find(w => w.id === state.demoTargetId);
    for (const dw of state.demoWords) {
      if (!demoTarget || dw.id !== demoTarget.id) {
        drawWordNode(dw, false, bounds);
      }
    }
    if (demoTarget) {
      drawWordNode(demoTarget, true, bounds);
    }
  } else {
    for (const w of state.activeWords) {
      if (w.id !== state.lockedWordId) {
        drawWordNode(w, false, bounds);
      }
    }
    if (lockedWord) {
      drawWordNode(lockedWord, true, bounds);
    }
  }

  for (const ft of state.floatingTranslations) {
    drawFloatingTranslation(ft, bounds);
  }

  if (state.weaponBannerTimer > 0 && state.weaponBannerText) {
    drawWeaponBanner(bounds);
  }
  if (state.layoutWarningTimer > 0) {
    drawLayoutWarning(bounds);
  }

  if (hasClip) {
    ctx.restore();
  }
}

export function drawPlayerShip(now = 0) {
  const { x, y, angle, recoil } = state.ship;
  const weapon = getCurrentWeapon();
  const primary = weapon.color;
  const secondary = weapon.secondaryColor;

  ctx.save();
  ctx.translate(x - Math.cos(angle) * recoil, y - Math.sin(angle) * recoil);
  ctx.rotate(angle + Math.PI / 2);

  const isTitle = state.screenMode === 'title';
  const flameLen = (isTitle ? 26 : 23) + Math.sin(now * 0.03) * 4 + Math.random() * 4;
  const grad = ctx.createLinearGradient(0, 11, 0, 11 + flameLen);
  grad.addColorStop(0, primary);
  grad.addColorStop(0.45, secondary);
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(-5.5, 12);
  ctx.lineTo(0, 12 + flameLen);
  ctx.lineTo(5.5, 12);
  ctx.closePath();
  ctx.fill();

  ctx.shadowColor = primary;
  ctx.shadowBlur = 15;
  ctx.fillStyle = '#0b1324';
  ctx.strokeStyle = primary;
  ctx.lineWidth = 2;

  if (weapon.id === 'railgun') {
    ctx.beginPath();
    ctx.moveTo(-4, -23);
    ctx.lineTo(-4, -6);
    ctx.moveTo(4, -23);
    ctx.lineTo(4, -6);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(15, 12);
    ctx.lineTo(5, 9);
    ctx.lineTo(0, 14);
    ctx.lineTo(-5, 9);
    ctx.lineTo(-15, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (weapon.id === 'tesla') {
    ctx.beginPath();
    ctx.moveTo(0, -17);
    ctx.lineTo(14, 12);
    ctx.lineTo(0, 8);
    ctx.lineTo(-14, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.arc(0, -19, 3.8, 0, Math.PI * 2);
    ctx.fill();
  } else if (weapon.id === 'missiles') {
    ctx.beginPath();
    ctx.moveTo(0, -17);
    ctx.lineTo(17, 10);
    ctx.lineTo(11, 13);
    ctx.lineTo(5, 9);
    ctx.lineTo(0, 13);
    ctx.lineTo(-5, 9);
    ctx.lineTo(-11, 13);
    ctx.lineTo(-17, 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (weapon.id === 'gravity') {
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(17, 9);
    ctx.lineTo(8, 12);
    ctx.lineTo(0, 8);
    ctx.lineTo(-8, 12);
    ctx.lineTo(-17, 9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#5eead4';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, -10, 12, -Math.PI * 0.85, -Math.PI * 0.15);
    ctx.stroke();

    ctx.fillStyle = '#ccfbf1';
    ctx.beginPath();
    ctx.arc(0, -17, 3.4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, -19);
    ctx.lineTo(15, 12);
    ctx.lineTo(5, 8);
    ctx.lineTo(0, 13);
    ctx.lineTo(-5, 8);
    ctx.lineTo(-15, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (weapon.id === 'plasma') {
      ctx.fillStyle = secondary;
      ctx.beginPath();
      ctx.arc(-11, 5, 2.2, 0, Math.PI * 2);
      ctx.arc(11, 5, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.moveTo(0, -9);
  ctx.lineTo(4, 3);
  ctx.lineTo(-4, 3);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export function drawWordNode(w, isLocked, bounds) {
  if (state.screenMode === 'title' && canvas.width > 768) {
    drawDesktopPromoWordCard(w, isLocked, bounds);
    return;
  }
  const style = getArticleStyle(w.entry.article, state.targetLang);
  const remainText = w.text.slice(w.typedCount);
  const typedText = w.text.slice(0, w.typedCount);
  const pinned = isEntryPinned(w.entry);

  const fontPx = getWordFontPx(w.text.length);
  ctx.font = `700 ${fontPx}px ${CANVAS_WORD_FONT}`;
  const typedW = ctx.measureText(typedText).width;
  const remainW = ctx.measureText(remainText).width;
  const totalW = typedW + remainW;

  const padX = canvas.width < 520 ? 11 : 15;
  const starPrefixW = pinned ? 18 : 0;
  const innerContentW = totalW + starPrefixW;
  const boxW = innerContentW + padX * 2;
  const capsuleH = fontPx + 16;
  const badgeStr = getTopBadgeTextForWord(w.entry);
  const hasTopBadge = Boolean(badgeStr);
  let badgeBoxW = 0;
  if (hasTopBadge) {
    ctx.font = `700 12.5px ${CANVAS_WORD_FONT}`;
    const maxBadgeW = Math.max(96, (bounds.right - bounds.left) - 24);
    badgeBoxW = Math.min(maxBadgeW, ctx.measureText(badgeStr).width + 18);
  }
  const effectiveHalfW = Math.max(boxW + 16, badgeBoxW + 8) / 2;
  w.boxW = effectiveHalfW * 2;
  w.boxH = capsuleH + (hasTopBadge ? 20 : 0);

  const clampedDrawX = Math.max(bounds.left + effectiveHalfW + 2, Math.min(bounds.right - effectiveHalfW - 2, w.x));
  w.x = clampedDrawX;

  ctx.save();
  ctx.translate(clampedDrawX, w.y);

  ctx.fillStyle = isLocked ? '#fb923c' : style.main;
  ctx.shadowColor = isLocked ? '#fb923c' : style.main;
  ctx.shadowBlur = isLocked ? 12 : 6;

  ctx.beginPath();
  ctx.arc(boxW / 2 + 7, -capsuleH / 2 + 5, isLocked ? 4.5 : 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = isLocked ? 'rgba(251, 146, 60, 0.9)' : style.glow;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(boxW / 2 + 7, -capsuleH / 2 + 5, isLocked ? 9.5 : 7, 0, Math.PI * 2);
  ctx.stroke();

  const boxX = -boxW / 2;
  const boxY = -capsuleH / 2;

  if (hasTopBadge) {
    ctx.shadowBlur = 0;
    ctx.font = `700 12.5px ${CANVAS_WORD_FONT}`;
    ctx.fillStyle = 'rgba(7, 13, 26, 0.96)';
    ctx.strokeStyle = style.main;
    ctx.lineWidth = 1.3;
    roundRect(ctx, -badgeBoxW / 2, boxY - 19, badgeBoxW, 18, 6);
    ctx.fill();
    ctx.stroke();

    ctx.direction = (state.studyMode === 'translate' && isRtlTranslation(w.entry) && (!w.entry.article || state.typeWithArticle))
      ? 'rtl'
      : 'ltr';
    ctx.fillStyle = state.studyMode === 'translate' ? '#fde047' : style.main;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeStr, 0, boxY - 10, badgeBoxW - 10);
  }

  ctx.shadowBlur = isLocked ? 12 : 0;
  ctx.fillStyle = isLocked
    ? 'rgba(30, 16, 8, 0.97)'
    : 'rgba(6, 11, 23, 0.96)';
  ctx.strokeStyle = isLocked
    ? '#fb923c'
    : (w.hitFlash > 0 ? '#ffffff' : (pinned ? '#fde047' : style.main));
  ctx.lineWidth = isLocked ? 2.2 : 1.5;

  roundRect(ctx, boxX, boxY, boxW, capsuleH, 9);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.direction = 'ltr';
  const contentLeftX = -innerContentW / 2;

  if (pinned) {
    ctx.font = `700 13.5px ${CANVAS_WORD_FONT}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fde047';
    ctx.fillText('⭐', contentLeftX, 0.5);
  }

  ctx.font = `700 ${fontPx}px ${CANVAS_WORD_FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const startTextX = contentLeftX + starPrefixW;

  if (typedText.length > 0) {
    ctx.fillStyle = '#34d399';
    ctx.fillText(typedText, startTextX, 0.5);
  }

  if (remainText.length > 0) {
    const firstRemain = remainText[0];
    const restRemain = remainText.slice(1);
    const firstRemainW = ctx.measureText(firstRemain).width;

    ctx.fillStyle = isLocked ? '#fde047' : '#38bdf8';
    ctx.fillText(firstRemain, startTextX + typedW, 0.5);

    ctx.fillStyle = '#ffffff';
    ctx.fillText(restRemain, startTextX + typedW + firstRemainW, 0.5);
  }

  ctx.restore();
}

export function drawFloatingTranslation(ft, bounds) {
  ctx.save();

  let alpha = 1.0;
  if (ft.life < 0.16) {
    alpha = ft.life / 0.16;
  } else if (ft.life > ft.maxLife - 0.75) {
    alpha = Math.max(0, (ft.maxLife - ft.life) / 0.75);
  }

  ctx.globalAlpha = alpha;

  const isMobile = canvas.width < 600;
  const isPromoBox = state.screenMode === 'title';
  const cleanWord = (ft.entry && (ft.entry.withArticle || ft.entry.word)) || ft.rawDe;
  let deFontPx = (isMobile || isPromoBox) ? (isMobile ? 16 : 15) : 22;
  let ruFontPx = (isMobile || isPromoBox) ? (isMobile ? 18.5 : 16.5) : 25;

  ctx.font = `700 ${deFontPx}px ${CANVAS_WORD_FONT}`;
  let deW = ctx.measureText(cleanWord).width;

  const translatedStr = getWordTranslation(ft.entry);
  const transText = `💥 ${translatedStr}`;
  ctx.font = `700 ${ruFontPx}px ${CANVAS_WORD_FONT}`;
  let transW = ctx.measureText(transText).width;

  const maxAllowedW = (bounds.right - bounds.left) - 16;
  if (deW + 28 > maxAllowedW && deFontPx > 12) {
    deFontPx = Math.max(12, Math.floor(deFontPx * (maxAllowedW - 28) / deW));
    ctx.font = `700 ${deFontPx}px ${CANVAS_WORD_FONT}`;
    deW = ctx.measureText(cleanWord).width;
  }
  if (transW + 28 > maxAllowedW && ruFontPx > 12.5) {
    ruFontPx = Math.max(12.5, Math.floor(ruFontPx * (maxAllowedW - 28) / transW));
    ctx.font = `700 ${ruFontPx}px ${CANVAS_WORD_FONT}`;
    transW = ctx.measureText(transText).width;
  }

  const cardW = Math.min(maxAllowedW, Math.max(deW, transW) + 32);
  const cardH = (isMobile || isPromoBox) ? (isMobile ? 58 : 52) : 74;
  const yTopOffset = (isMobile || isPromoBox) ? (isMobile ? -12 : -10.5) : -14.5;
  const yBotOffset = (isMobile || isPromoBox) ? (isMobile ? 13 : 11.5) : 15;

  const drawX = Math.max(bounds.left + cardW / 2 + 6, Math.min(bounds.right - cardW / 2 - 6, ft.x));
  const drawY = Math.max(bounds.top + cardH / 2 + 6, Math.min(bounds.bottom - cardH / 2 - 6, ft.y));

  ctx.translate(drawX, drawY);

  ctx.shadowColor = ft.color;
  ctx.shadowBlur = 16;
  ctx.fillStyle = 'rgba(6, 12, 24, 0.97)';
  ctx.strokeStyle = ft.color;
  ctx.lineWidth = 2;

  roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 11);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.direction = 'ltr';
  ctx.font = `700 ${deFontPx}px ${CANVAS_WORD_FONT}`;
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(cleanWord, 0, yTopOffset);

  ctx.direction = isRtlTranslation(ft.entry) ? 'rtl' : 'ltr';
  ctx.font = `700 ${ruFontPx}px ${CANVAS_WORD_FONT}`;
  ctx.fillStyle = '#fde047';
  ctx.fillText(transText, 0, yBotOffset);

  ctx.restore();
}

export function drawWeaponBanner(bounds) {
  const w = getCurrentWeapon();
  const borderCol = state.weaponBannerColor || w.color;
  const bannerFont = isHebrewUI()
    ? CANVAS_WORD_FONT
    : (state.nativeLang === 'en' ? '"Orbitron", "Exo 2", "Rubik", sans-serif' : CANVAS_HEADING_FONT);
  ctx.save();
  ctx.globalAlpha = Math.min(1, state.weaponBannerTimer * 1.4);
  ctx.font = `${isHebrewUI() ? 700 : 800} 14px ${bannerFont}`;
  const maxW = Math.max(200, (bounds.right - bounds.left) - 20);
  const textW = Math.min(maxW, ctx.measureText(state.weaponBannerText).width + 30);
  ctx.translate(bounds.centerX, state.ship.y - 56);
  ctx.fillStyle = 'rgba(7, 13, 26, 0.97)';
  ctx.strokeStyle = borderCol;
  ctx.lineWidth = 1.9;
  roundRect(ctx, -textW / 2, -17, textW, 34, 999);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(state.weaponBannerText, 0, 0, textW - 18);
  ctx.restore();
}

export function drawLayoutWarning(bounds) {
  ctx.save();
  const w = Math.min(390, bounds.right - bounds.left - 20);
  ctx.translate(bounds.centerX, state.ship.y - 60);
  ctx.fillStyle = 'rgba(127, 29, 29, 0.96)';
  ctx.strokeStyle = '#fb7185';
  ctx.lineWidth = 1.8;
  roundRect(ctx, -w / 2, -19, w, 38, 10);
  ctx.fill();
  ctx.stroke();

  ctx.font = `700 14.5px ${CANVAS_WORD_FONT}`;
  ctx.fillStyle = '#ffe4e6';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(t().layoutWarning, 0, 0);
  ctx.restore();
}

function drawDesktopCosmicBackdrop() {
  ctx.save();

  // Космическая фиолетово-пурпурная туманность в правом верхнем углу и лазурная слева
  const nebRight = ctx.createRadialGradient(
    canvas.width * 0.92, canvas.height * 0.14, 10,
    canvas.width * 0.92, canvas.height * 0.14, Math.max(360, canvas.width * 0.34)
  );
  nebRight.addColorStop(0, 'rgba(192, 132, 252, 0.24)');
  nebRight.addColorStop(0.45, 'rgba(139, 92, 246, 0.11)');
  nebRight.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = nebRight;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const nebLeft = ctx.createRadialGradient(
    canvas.width * 0.06, canvas.height * 0.24, 10,
    canvas.width * 0.06, canvas.height * 0.24, Math.max(320, canvas.width * 0.28)
  );
  nebLeft.addColorStop(0, 'rgba(56, 189, 248, 0.18)');
  nebLeft.addColorStop(0.5, 'rgba(37, 99, 235, 0.08)');
  nebLeft.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = nebLeft;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Светящаяся дуга Земли в нижней части космического фона
  const earthR = Math.max(canvas.width * 1.48, 1700);
  const earthCx = canvas.width * 0.5;
  const earthCy = canvas.height + earthR - Math.max(66, canvas.height * 0.092);

  const atmosGlow = ctx.createRadialGradient(
    earthCx, earthCy, earthR - 22,
    earthCx, earthCy, earthR + 115
  );
  atmosGlow.addColorStop(0, 'rgba(56, 189, 248, 0.52)');
  atmosGlow.addColorStop(0.35, 'rgba(14, 165, 233, 0.28)');
  atmosGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = atmosGlow;
  ctx.beginPath();
  ctx.arc(earthCx, earthCy, earthR + 115, Math.PI * 1.25, Math.PI * 1.75);
  ctx.fill();

  const planetGrad = ctx.createLinearGradient(0, canvas.height - 110, 0, canvas.height);
  planetGrad.addColorStop(0, '#0ea5e9');
  planetGrad.addColorStop(0.32, '#1d4ed8');
  planetGrad.addColorStop(1, '#020617');
  ctx.fillStyle = planetGrad;
  ctx.beginPath();
  ctx.arc(earthCx, earthCy, earthR, Math.PI * 1.25, Math.PI * 1.75);
  ctx.fill();

  ctx.strokeStyle = 'rgba(125, 211, 252, 0.85)';
  ctx.shadowColor = 'rgba(56, 189, 248, 0.9)';
  ctx.shadowBlur = 22;
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.arc(earthCx, earthCy, earthR, Math.PI * 1.28, Math.PI * 1.72);
  ctx.stroke();

  ctx.restore();
}

function drawDesktopPromoAtmosphere(bounds, now) {
  ctx.save();

  // Астероиды по краям боевого монитора
  const wSpan = bounds.right - bounds.left;
  const hSpan = bounds.bottom - bounds.top;
  const rocks = [
    { x: bounds.left + 26, y: bounds.top + hSpan * 0.16 + Math.sin(now * 0.001) * 3, r: 13, rot: 0.4 },
    { x: bounds.right - 28, y: bounds.top + hSpan * 0.62 + Math.cos(now * 0.0009) * 3, r: 16, rot: 1.9 },
    { x: bounds.left + wSpan * 0.12, y: bounds.bottom - 52 + Math.sin(now * 0.0007 + 1) * 2, r: 8, rot: 0.9 }
  ];
  rocks.forEach(rk => {
    ctx.save();
    ctx.translate(rk.x, rk.y);
    ctx.rotate(rk.rot);
    ctx.fillStyle = 'rgba(30, 41, 68, 0.72)';
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.32)';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    const sides = 7;
    for (let i = 0; i < sides; i++) {
      const ang = (i / sides) * Math.PI * 2;
      const rad = rk.r * (i % 2 === 0 ? 1 : 0.78);
      if (i === 0) ctx.moveTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
      else ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });

  // Изогнутый горизонт планеты под кораблём внутри окна превью
  const pR = Math.max(320, wSpan * 0.85);
  const pCx = bounds.centerX;
  const pCy = bounds.bottom + pR - 42;

  const rimGlow = ctx.createRadialGradient(pCx, pCy, pR - 14, pCx, pCy, pR + 48);
  rimGlow.addColorStop(0, 'rgba(56, 189, 248, 0.42)');
  rimGlow.addColorStop(0.5, 'rgba(14, 165, 233, 0.16)');
  rimGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = rimGlow;
  ctx.beginPath();
  ctx.arc(pCx, pCy, pR + 48, -Math.PI * 0.85, -Math.PI * 0.15);
  ctx.fill();

  const surfaceGrad = ctx.createLinearGradient(pCx, bounds.bottom - 48, pCx, bounds.bottom + 20);
  surfaceGrad.addColorStop(0, 'rgba(14, 116, 194, 0.52)');
  surfaceGrad.addColorStop(0.55, 'rgba(15, 23, 52, 0.88)');
  surfaceGrad.addColorStop(1, 'rgba(5, 10, 26, 0.96)');
  ctx.fillStyle = surfaceGrad;
  ctx.beginPath();
  ctx.arc(pCx, pCy, pR, -Math.PI * 0.85, -Math.PI * 0.15);
  ctx.fill();

  ctx.strokeStyle = 'rgba(125, 211, 252, 0.78)';
  ctx.shadowColor = 'rgba(56, 189, 248, 0.85)';
  ctx.shadowBlur = 14;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(pCx, pCy, pR, -Math.PI * 0.8, -Math.PI * 0.2);
  ctx.stroke();

  ctx.restore();
}

function drawDesktopPromoWordCard(w, isLocked, bounds) {
  const remainText = w.text.slice(w.typedCount);
  const typedText = w.text.slice(0, w.typedCount);
  const artRaw = (w.entry && w.entry.article) || '';
  const hasRealArt = Boolean(artRaw) && !['Verb', 'Noun', 'Adj.', 'Adv.'].includes(artRaw) && !state.typeWithArticle;
  const artPrefix = hasRealArt ? `${artRaw} ` : '';

  const fontPx = getWordFontPx(w.text.length);
  ctx.font = `700 ${fontPx}px ${CANVAS_WORD_FONT}`;
  const artW = artPrefix ? ctx.measureText(artPrefix).width : 0;
  const typedW = ctx.measureText(typedText).width;
  const remainW = ctx.measureText(remainText).width;
  const topLineW = artW + typedW + remainW;

  let transStr = !isLocked && w.entry ? getWordTranslation(w.entry) : '';
  if (transStr.length > 18) transStr = transStr.slice(0, 17) + '…';
  ctx.font = `500 11px ${CANVAS_WORD_FONT}`;
  const subLineW = transStr ? ctx.measureText(transStr).width : 0;

  const padX = 14;
  const boxW = Math.min((bounds.right - bounds.left) - 16, Math.max(96, Math.max(topLineW, subLineW) + padX * 2));
  const boxH = isLocked ? fontPx + 22 : fontPx + 30;
  w.boxW = boxW;
  w.boxH = boxH;

  const clampedDrawX = Math.max(bounds.left + boxW / 2 + 4, Math.min(bounds.right - boxW / 2 - 4, w.x));
  const clampedDrawY = Math.max(bounds.top + boxH / 2 + 2, w.y);
  w.x = clampedDrawX;
  w.y = clampedDrawY;

  ctx.save();
  ctx.translate(clampedDrawX, clampedDrawY);

  const boxX = -boxW / 2;
  const boxY = -boxH / 2;

  ctx.shadowColor = isLocked ? '#f43f5e' : '#38bdf8';
  ctx.shadowBlur = isLocked ? 20 : 13;

  const bgGrad = ctx.createLinearGradient(0, boxY, 0, boxY + boxH);
  if (isLocked) {
    bgGrad.addColorStop(0, 'rgba(82, 16, 56, 0.90)');
    bgGrad.addColorStop(1, 'rgba(26, 14, 44, 0.94)');
  } else {
    bgGrad.addColorStop(0, 'rgba(14, 38, 74, 0.86)');
    bgGrad.addColorStop(1, 'rgba(8, 20, 44, 0.92)');
  }
  ctx.fillStyle = bgGrad;
  ctx.strokeStyle = isLocked ? '#fb7185' : (w.hitFlash > 0 ? '#ffffff' : '#38bdf8');
  ctx.lineWidth = isLocked ? 2.2 : 1.6;

  roundRect(ctx, boxX, boxY, boxW, boxH, 14);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.direction = 'ltr';
  ctx.textBaseline = 'middle';

  const topY = isLocked ? 0.5 : -6.5;
  const startX = -topLineW / 2;
  ctx.font = `700 ${fontPx}px ${CANVAS_WORD_FONT}`;
  ctx.textAlign = 'left';

  if (artPrefix) {
    ctx.fillStyle = isLocked ? '#fbcfe8' : '#bae6fd';
    ctx.fillText(artPrefix, startX, topY);
  }
  if (typedText.length > 0) {
    ctx.fillStyle = '#34d399';
    ctx.fillText(typedText, startX + artW, topY);
  }
  if (remainText.length > 0) {
    ctx.fillStyle = '#ffffff';
    ctx.fillText(remainText, startX + artW + typedW, topY);
  }

  if (transStr) {
    ctx.direction = isRtlTranslation(w.entry) ? 'rtl' : 'ltr';
    ctx.font = `500 11px ${CANVAS_WORD_FONT}`;
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText(transStr, 0, 11.5, boxW - 14);
  }

  ctx.restore();
}
