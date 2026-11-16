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

  // На полноэкранной странице «Мои колоды» рендерим только звёздное небо и туманности на фоне
  if (state.screenMode === 'title' && state.homeSubView !== 'home') {
    return;
  }

  const hasClip = Boolean(bounds.clipRect);
  if (hasClip) {
    ctx.save();
    roundRect(ctx, bounds.clipRect.x, bounds.clipRect.y, bounds.clipRect.w, bounds.clipRect.h, 16);
    ctx.clip();
  }

  if (state.screenMode === 'title') {
    // Концентрические неоновые радарные дуги за кораблём в окне LIVE LESSON PREVIEW
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
  let deFontPx = (isMobile || isPromoBox) ? (isMobile ? 16 : 17.5) : 22;
  let ruFontPx = (isMobile || isPromoBox) ? (isMobile ? 18.5 : 20) : 25;

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
  const cardH = (isMobile || isPromoBox) ? (isMobile ? 58 : 64) : 74;
  const yTopOffset = (isMobile || isPromoBox) ? -12 : -14.5;
  const yBotOffset = (isMobile || isPromoBox) ? 13 : 15;

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
