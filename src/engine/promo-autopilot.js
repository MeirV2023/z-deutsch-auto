// Демонстрационный промо-бой на автопилоте на Главной и переходы в боевой режим (SRP)
import { actions } from '../core/events.js';
import { allocateEntityId } from '../core/utils.js';
import { getArticleStyle } from '../config/constants.js';
import { sound } from '../services/sound-engine.js';
import { state } from '../state/store.js';
import { getActiveSelection, getAllWordsInCourse, getAllWordsInTargetLang } from '../domain/catalog-service.js';
import {
  aboutPageView,
  adminStudioView,
  arcadeTitleScreen,
  btnNavAbout,
  btnNavAdmin,
  btnNavDecks,
  btnNavHome,
  canvas,
  centerOverlay,
  decksPageView,
  homeDashboardView
} from '../ui/dom.js';
import {
  computeWordLengthSpeedFactor,
  findSafeSpawnX,
  getPlayBounds,
  measureWordCapsule,
  resizeCanvas,
  resolveWordCollisions,
  scatterWordsToTop,
  separateFloatingTranslations,
  spawnParticles
} from './arena-physics.js';
import { spawnWeaponVisualEffect } from './weapon-vfx.js';
import { renderLevelSidebar, updatePilotRankUI, updatePromoTargetPill } from '../ui/hud-widgets.js';

export function launchFromTitleScreen() {
  if (state.screenMode !== 'title') return;
  sound.init();
  sound.playWarpLaunch();

  state.decksOpenedFromPlay = false;
  state.homeSubView = 'home';
  if (homeDashboardView) homeDashboardView.classList.remove('hidden');
  if (decksPageView) decksPageView.classList.add('hidden');
  if (adminStudioView) adminStudioView.classList.add('hidden');
  if (aboutPageView) aboutPageView.classList.add('hidden');
  if (btnNavHome) btnNavHome.classList.add('active');
  if (btnNavDecks) btnNavDecks.classList.remove('active');
  if (btnNavAdmin) btnNavAdmin.classList.remove('active');
  if (btnNavAbout) btnNavAbout.classList.remove('active');

  state.screenMode = 'play';
  state.warpTimer = 0.65;
  state.demoWords = [];
  state.demoTargetId = null;

  if (arcadeTitleScreen) arcadeTitleScreen.hidden = true;
  document.body.classList.remove('mode-title');
  document.body.classList.add('mode-play');

  actions.startLevelNow();
}

export function returnToTitleScreen() {
  state.running = false;
  state.paused = false;
  state.gameOver = false;
  state.decksOpenedFromPlay = false;
  state.activeWords = [];
  state.lockedWordId = null;
  state.activeQuiz = null;
  state.lasers = [];
  state.missiles = [];
  state.repulsorWaves = [];
  state.shockwaves = [];
  state.floatingTranslations = [];
  state.demoWords = [];
  state.demoTargetId = null;
  state.screenMode = 'title';
  state.warpTimer = 0.35;

  centerOverlay.classList.add('hidden');
  if (arcadeTitleScreen) arcadeTitleScreen.hidden = false;
  document.body.classList.remove('mode-play');
  document.body.classList.add('mode-title');

  actions.switchHomeSubView('home');
  resizeCanvas();
  updatePilotRankUI();
  renderLevelSidebar();
  actions.applyStaticUILocalization();
  requestAnimationFrame(() => {
    resizeCanvas();
    seedTitleDemoWords();
  });
}

// Мгновенный запуск промо-боя на стартовом экране: сразу спавнит слова в центре космоса, чтобы корабль стрелял с первой секунды!
export function seedTitleDemoWords() {
  if (state.screenMode !== 'title' || state.homeSubView !== 'home') return;
  const bounds = getPlayBounds();
  const corridorH = bounds.bottom - bounds.top;
  if (corridorH < 64) return;

  const { course } = getActiveSelection();
  const courseWords = course ? getAllWordsInCourse(course) : [];
  const rawPool = courseWords.length >= 4 ? courseWords : getAllWordsInTargetLang(state.targetLang);
  if (rawPool.length === 0) return;

  const isDesktopPromo = window.innerWidth > 768;
  const shortPool = isDesktopPromo ? rawPool.filter(w => w.word && w.word.length <= 13) : rawPool;
  const demoPool = shortPool.length >= 6 ? shortPool : rawPool;

  state.demoWords = [];
  state.demoTargetId = null;

  const promoSpan = bounds.right - bounds.left;
  const desiredCount = promoSpan >= 315 ? 3 : 2;
  const laneFracs = desiredCount === 3
    ? (isDesktopPromo ? [0.18, 0.50, 0.82] : [0.22, 0.78, 0.5])
    : [0.3, 0.72];
  const yFracs = desiredCount === 3
    ? (isDesktopPromo ? [0.38, 0.22, 0.34] : [0.24, 0.34, 0.18])
    : [0.24, 0.36];
  const usedRaw = new Set();

  for (let i = 0; i < desiredCount; i++) {
    let sample = null;
    for (let tries = 0; tries < 10; tries++) {
      const cand = demoPool[Math.floor(Math.random() * demoPool.length)];
      if (cand && !usedRaw.has(cand.raw)) {
        sample = cand;
        usedRaw.add(cand.raw);
        break;
      }
    }
    if (!sample) sample = demoPool[i % demoPool.length];
    if (!sample) continue;

    const meas = measureWordCapsule(sample.word, sample);
    const halfW = Math.min((bounds.right - bounds.left) * 0.42, meas.boxW * 0.5);
    const rawX = bounds.left + (bounds.right - bounds.left) * laneFracs[i];
    const clampedX = Math.max(bounds.left + halfW + 10, Math.min(bounds.right - halfW - 10, rawX));
    const minCenterY = bounds.top + meas.boxH * 0.5 + 4;
    const spawnY = Math.min(
      Math.max(minCenterY, bounds.top + corridorH * yFracs[i]),
      Math.max(minCenterY + 4, bounds.bottom - 58)
    );

    state.demoWords.push({
      id: allocateEntityId(),
      entry: sample,
      text: sample.word,
      typedCount: i === 1 && sample.word.length > 4 ? 2 : 0,
      boxW: meas.boxW,
      boxH: meas.boxH,
      x: clampedX,
      y: spawnY,
      vy: Math.max(8.5, Math.min(15, corridorH * 0.058)) * computeWordLengthSpeedFactor(sample.word.length),
      frameVy: 11,
      pushVx: 0,
      pushVy: 0,
      recoilY: 0,
      hitFlash: 0
    });
  }

  state.lastPromoRect = { left: bounds.left, top: bounds.top };

  if (state.demoWords.length > 0) {
    const firstTarget = state.demoWords[Math.min(1, state.demoWords.length - 1)];
    state.demoTargetId = firstTarget.id;
    state.ship.x = bounds.centerX;
    state.ship.y = Math.max(bounds.top + 42, bounds.bottom - 22);
    state.ship.targetY = state.ship.y;
    const aimAngle = Math.atan2(firstTarget.y - state.ship.y, firstTarget.x - state.ship.x);
    state.ship.targetAngle = aimAngle;
    state.ship.angle = aimAngle;
    state.demoFireTimer = 0.12;
    state.demoSpawnTimer = 0.9;
  }
  updatePromoTargetPill();
}

export function updateTitleDemo(dt) {
  const bounds = getPlayBounds();
  const corridorH = bounds.bottom - bounds.top;

  // Если пользователь прокрутил дашборд на мобильном — плавно смещаем демо-сцену вместе с окном монитора!
  if (state.lastPromoRect) {
    const dx = bounds.left - state.lastPromoRect.left;
    const dy = bounds.top - state.lastPromoRect.top;
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      state.ship.x += dx;
      state.ship.y += dy;
      state.ship.targetY += dy;
      for (const dw of state.demoWords) { dw.x += dx; dw.y += dy; }
      for (const ft of state.floatingTranslations) { ft.x += dx; ft.y += dy; }
      for (const sw of state.shockwaves) { sw.x += dx; sw.y += dy; }
      for (const rw of state.repulsorWaves) { rw.x += dx; rw.y += dy; }
      for (const p of state.particles) { p.x += dx; p.y += dy; }
      for (const l of state.lasers) {
        if (Array.isArray(l.points)) l.points.forEach(pt => { pt.x += dx; pt.y += dy; });
        if (Array.isArray(l.branch)) l.branch.forEach(pt => { pt.x += dx; pt.y += dy; });
        if (typeof l.x1 === 'number') { l.x1 += dx; l.x2 += dx; l.y1 += dy; l.y2 += dy; }
      }
    }
  }
  state.lastPromoRect = { left: bounds.left, top: bounds.top };

  const swayAmp = Math.min(22, Math.max(8, (bounds.right - bounds.left) * 0.08));
  state.ship.targetY = Math.max(bounds.top + 40, bounds.bottom - 22);
  state.ship.x = bounds.centerX + Math.sin(performance.now() * 0.0011) * swayAmp;

  if (corridorH < 64) {
    state.demoWords = [];
    state.demoTargetId = null;
    state.ship.targetAngle = -Math.PI / 2;
    return;
  }

  const promoSpan = bounds.right - bounds.left;
  const isDesktopPromo = window.innerWidth > 768;
  const maxDemoWords = state.weaponId === 'gravity'
    ? (canvas.width > 640 ? 5 : 3)
    : (promoSpan >= 315 ? 3 : 2);
  const { course } = getActiveSelection();
  const courseWords = course ? getAllWordsInCourse(course) : [];
  const rawPool = courseWords.length >= 4 ? courseWords : getAllWordsInTargetLang(state.targetLang);
  const shortPool = isDesktopPromo ? rawPool.filter(w => w.word && w.word.length <= 13) : rawPool;
  const demoPool = shortPool.length >= 6 ? shortPool : rawPool;

  state.demoSpawnTimer -= dt;
  if (state.demoSpawnTimer <= 0 && state.demoWords.length < maxDemoWords && demoPool.length > 0) {
    const sample = demoPool[Math.floor(Math.random() * demoPool.length)];
    if (sample) {
      const meas = measureWordCapsule(sample.word, sample);
      const spawnY = bounds.top + meas.boxH * 0.5 + 6;
      const pos = findSafeSpawnX(meas.boxW, meas.boxH, spawnY, state.demoWords, bounds);
      if (pos.clear || state.demoWords.length === 0) {
        state.demoWords.push({
          id: allocateEntityId(),
          entry: sample,
          text: sample.word,
          typedCount: 0,
          boxW: meas.boxW,
          boxH: meas.boxH,
          x: pos.x,
          y: spawnY,
          vy: Math.max(8.5, Math.min(15, corridorH * 0.058)) * computeWordLengthSpeedFactor(sample.word.length),
          frameVy: 11,
          pushVx: 0,
          pushVy: 0,
          recoilY: 0,
          hitFlash: 0
        });
      }
    }
    state.demoSpawnTimer = state.weaponId === 'gravity' ? 0.75 : 0.95;
  }

  resolveWordCollisions(state.demoWords, bounds, dt, bounds.top + 30);

  for (let i = state.demoWords.length - 1; i >= 0; i--) {
    const dw = state.demoWords[i];
    const minCenterY = bounds.top + (dw.boxH ? dw.boxH * 0.5 + 4 : 26);
    if (dw.pushVx) {
      dw.x += dw.pushVx * dt;
      dw.pushVx *= Math.exp(-3.0 * dt);
      if (Math.abs(dw.pushVx) < 1) dw.pushVx = 0;
    }
    if (dw.pushVy) {
      dw.y += dw.pushVy * dt;
      dw.pushVy *= Math.exp(-2.8 * dt);
      if (Math.abs(dw.pushVy) < 1) dw.pushVy = 0;
    }

    if (dw.recoilY > 0) {
      dw.y = Math.max(minCenterY, dw.y - dw.recoilY * 5.5 * dt);
      dw.recoilY = Math.max(0, dw.recoilY - 24 * dt);
    } else {
      dw.y += (dw.frameVy ?? dw.vy) * dt;
    }

    if (dw.y < minCenterY) {
      dw.y = minCenterY;
      if (dw.pushVy < 0) dw.pushVy = 0;
    }
    if (dw.hitFlash > 0) dw.hitFlash = Math.max(0, dw.hitFlash - dt * 5);

    if (dw.y > state.ship.y - 32) {
      state.demoWords.splice(i, 1);
      if (state.demoTargetId === dw.id) state.demoTargetId = null;
    }
  }

  const prevDemoTargetId = state.demoTargetId;
  let activeDemoTarget = state.demoWords.find(w => w.id === state.demoTargetId);
  if (!activeDemoTarget && state.demoWords.length > 0) {
    // Наводимся на нижнее (ближайшее к кораблю) слово — выглядит как живой автопилот!
    activeDemoTarget = state.demoWords.reduce((best, cur) => (cur.y > best.y ? cur : best), state.demoWords[0]);
    state.demoTargetId = activeDemoTarget.id;
  }
  if (state.demoTargetId !== prevDemoTargetId) {
    updatePromoTargetPill();
  }

  if (activeDemoTarget) {
    state.ship.targetAngle = Math.atan2(activeDemoTarget.y - state.ship.y, activeDemoTarget.x - state.ship.x);
  } else {
    state.ship.targetAngle = -Math.PI / 2;
  }

  state.demoFireTimer -= dt;
  if (state.demoFireTimer <= 0 && activeDemoTarget) {
    const target = activeDemoTarget;
    if (target.y >= bounds.top + 16) {
      target.typedCount++;
      target.hitFlash = 1.0;
      target.recoilY = 2.2;
      const style = getArticleStyle(target.entry.article, state.targetLang);
      spawnWeaponVisualEffect(state.weaponId, target.x, target.y, style.main);

      if (state.weaponId === 'gravity' && target.typedCount % 2 === 1) {
        scatterWordsToTop(state.demoWords, bounds, 0.72, 24);
      }

      if (target.typedCount >= target.text.length) {
        const idx = state.demoWords.findIndex(w => w.id === target.id);
        if (idx !== -1) state.demoWords.splice(idx, 1);
        state.demoTargetId = null;
        updatePromoTargetPill();

        state.shockwaves.push({
          x: target.x,
          y: target.y,
          radius: 6,
          maxRadius: 54,
          color: style.main,
          alpha: 0.92
        });
        spawnParticles(target.x, target.y, style.main, 18, 145);
        state.floatingTranslations.push({
          x: target.x,
          y: Math.min(bounds.bottom - 34, Math.max(bounds.top + 34, target.y)),
          vy: -10,
          entry: target.entry,
          rawDe: target.entry.raw,
          color: style.main,
          life: 0,
          maxLife: window.innerWidth > 768 ? 1.85 : 2.5
        });
        separateFloatingTranslations(bounds);
        state.demoFireTimer = 0.5;
      } else {
        state.demoFireTimer = 0.13;
      }
    } else {
      state.demoFireTimer = 0.14;
    }
  }
}
