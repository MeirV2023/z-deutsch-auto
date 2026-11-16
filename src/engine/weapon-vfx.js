// Смена и прокачка оружия, визуальные спецэффекты выстрелов и частиц (SRP / OCP)
import { actions } from '../core/events.js';
import { saveSettingsPatch } from '../core/storage.js';
import { allocateEntityId, escapeHtml } from '../core/utils.js';
import { WEAPONS } from '../config/weapons.js';
import { sound } from '../services/sound-engine.js';
import {
  getCurrentWeapon,
  getWeaponDesc,
  getWeaponName,
  isWeaponUnlocked,
  learnedWordsSet,
  state,
  t
} from '../state/store.js';
import { getAllWordsInTargetLang } from '../domain/catalog-service.js';
import {
  btnPromoWeaponCycle,
  btnWeaponMode,
  overlayWeaponRow,
  settingsWeaponRow,
  sidebarWeaponRow,
  titleWeaponDesc,
  titleWeaponRow
} from '../ui/dom.js';
import {
  findSafeSpawnX,
  getPlayBounds,
  measureWordCapsule,
  scatterWordsToTop,
  spawnParticles
} from './arena-physics.js';

export function equipWeapon(weaponId, withPreviewShot = true) {
  const found = WEAPONS.find(w => w.id === weaponId);
  if (!found) return;

  // Если пушка ещё закрыта — подсказываем игроку, сколько слов осталось выучить (а на стартовом экране даём разовый демо-выстрел!)
  if (!isWeaponUnlocked(found)) {
    const needMore = Math.max(1, found.unlockWords - learnedWordsSet.size);
    const msg = t().lockedWeaponHint(found.icon, getWeaponName(found), needMore, found.unlockWords);
    if (state.screenMode === 'title' && withPreviewShot) {
      sound.playWeaponEquip(found.id);
      const bounds = getPlayBounds();
      const target = state.demoWords.find(w => w.id === state.demoTargetId) || state.demoWords[0];
      const tx = target ? target.x : state.ship.x;
      const ty = target ? target.y : Math.max(bounds.top + 26, state.ship.y - 90);
      spawnWeaponVisualEffect(found.id, tx, ty, found.color);
    } else {
      sound.playMiss();
    }
    if (titleWeaponDesc) titleWeaponDesc.textContent = msg;
    state.weaponBannerText = msg;
    state.weaponBannerColor = '#fbbf24';
    state.weaponBannerTimer = 2.4;
    return;
  }

  state.weaponId = found.id;
  saveSettingsPatch({ weaponId: found.id });

  renderWeaponSelectors();
  updateHudWeaponBtn();

  if (withPreviewShot) {
    sound.playWeaponEquip(found.id);

    if (state.screenMode === 'play') {
      if (found.id === 'gravity' && state.running && !state.paused && state.gravityEquipCooldown <= 0) {
        const bounds = getPlayBounds();
        const needExtra = Math.min(Math.max(0, 4 - state.activeWords.length), state.wordQueue.length);
        for (let k = 0; k < needExtra; k++) {
          if (actions.spawnNextWord(true)) {
            const spawned = state.activeWords[state.activeWords.length - 1];
            if (spawned) {
              spawned.y = bounds.top + Math.min(180, (bounds.bottom - bounds.top) * (0.32 + k * 0.08));
            }
          }
        }
        scatterWordsToTop(state.activeWords, bounds, 1.0, 34);
        state.spawnTimer = Math.max(state.spawnTimer, 2.8);
        state.gravityEquipCooldown = 5.0;
        state.weaponBannerText = t().gravitySurgeBanner;
        state.weaponBannerColor = found.color;
        state.weaponBannerTimer = 2.0;
      } else {
        state.weaponBannerText = t().weaponBanner(found.icon, getWeaponName(found));
        state.weaponBannerColor = found.color;
        state.weaponBannerTimer = 1.6;
      }
    } else {
      const bounds = getPlayBounds();
      const corridorH = bounds.bottom - bounds.top;
      const langPool = getAllWordsInTargetLang(state.targetLang);
      if (found.id === 'gravity' && corridorH >= 70) {
        while (state.demoWords.length < 5 && langPool.length > 0) {
          const sample = langPool[Math.floor(Math.random() * langPool.length)];
          const meas = measureWordCapsule(sample.word, sample);
          const pos = findSafeSpawnX(meas.boxW, meas.boxH, bounds.top + corridorH * 0.45, state.demoWords, bounds);
          state.demoWords.push({
            id: allocateEntityId(),
            entry: sample,
            text: sample.word,
            typedCount: 0,
            boxW: meas.boxW,
            boxH: meas.boxH,
            x: pos.x,
            y: bounds.top + corridorH * (0.34 + Math.random() * 0.25),
            vy: Math.max(9, Math.min(16, corridorH * 0.065)),
            frameVy: 12,
            pushVx: 0,
            pushVy: 0,
            recoilY: 0,
            hitFlash: 0
          });
        }
        scatterWordsToTop(state.demoWords, bounds, 1.0, 26);
      } else {
        const target = state.demoWords.find(w => w.id === state.demoTargetId) || state.demoWords[0];
        const targetX = target ? target.x : state.ship.x;
        const targetY = target ? target.y : Math.max(bounds.top + 26, state.ship.y - 90);
        spawnWeaponVisualEffect(found.id, targetX, targetY, found.color);
      }
    }
  }
}

export function updateHudWeaponBtn() {
  const w = getCurrentWeapon();
  if (btnWeaponMode) {
    btnWeaponMode.style.borderColor = w.color;
    btnWeaponMode.innerHTML = `${w.icon}<span class="hide-mobile" id="hudWeaponLabel"> ${escapeHtml(getWeaponName(w))}</span>`;
  }
  if (btnPromoWeaponCycle) {
    btnPromoWeaponCycle.textContent = w.icon;
    btnPromoWeaponCycle.style.borderColor = w.color;
    btnPromoWeaponCycle.title = `${getWeaponName(w)} — ${getWeaponDesc(w)}`;
  }
  if (titleWeaponDesc) {
    titleWeaponDesc.textContent = getWeaponDesc(w);
  }
}

export function renderWeaponSelectors() {
  const current = getCurrentWeapon();
  const tr = t();
  [titleWeaponRow, overlayWeaponRow, sidebarWeaponRow, settingsWeaponRow].forEach(container => {
    if (!container) return;
    container.innerHTML = '';
    WEAPONS.forEach(w => {
      const unlocked = isWeaponUnlocked(w);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'weapon-pill-btn' +
        (w.id === current.id ? ' active' : '') +
        (!unlocked ? ' locked' : '');
      btn.style.setProperty('--w-color', w.color);

      const needMore = Math.max(0, w.unlockWords - learnedWordsSet.size);
      btn.title = unlocked
        ? `${getWeaponName(w)} — ${getWeaponDesc(w)}`
        : tr.lockedWeaponHint(w.icon, getWeaponName(w), needMore, w.unlockWords);

      btn.innerHTML = `
        <span class="weapon-pill-icon">${unlocked ? w.icon : '🔒'}</span>
        <span class="weapon-pill-name">${escapeHtml(getWeaponName(w))}</span>
        ${!unlocked ? `<span class="weapon-lock-tag">${escapeHtml(tr.lockTagShort(w.unlockWords))}</span>` : ''}
      `;
      btn.addEventListener('click', () => {
        equipWeapon(w.id, true);
        btn.blur();
      });
      container.appendChild(btn);
    });
  });
}

// --- Визуальные эффекты выстрелов каждого вида оружия ---
export function buildLightningPoints(x1, y1, x2, y2, segments = 8, jitter = 15) {
  const pts = [{ x: x1, y: y1 }];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;

  for (let i = 1; i < segments; i++) {
    const frac = i / segments;
    const offset = (Math.random() * 2 - 1) * jitter * Math.sin(frac * Math.PI);
    pts.push({
      x: x1 + dx * frac + nx * offset,
      y: y1 + dy * frac + ny * offset
    });
  }
  pts.push({ x: x2, y: y2 });
  return pts;
}

export function spawnWeaponVisualEffect(weaponId, targetX, targetY, articleColor) {
  const dx = targetX - state.ship.x;
  const dy = targetY - state.ship.y;
  const angle = Math.atan2(dy, dx);
  state.ship.targetAngle = angle;

  const w = WEAPONS.find(item => item.id === weaponId) || WEAPONS[0];
  state.ship.recoil = 6.5 * w.recoilBoost;

  const noseX = state.ship.x + Math.cos(angle) * 20;
  const noseY = state.ship.y + Math.sin(angle) * 20;
  const perpX = -Math.sin(angle);
  const perpY = Math.cos(angle);

  if (weaponId === 'plasma') {
    [-7, 7].forEach(offset => {
      state.lasers.push({
        kind: 'plasma',
        x1: noseX + perpX * offset,
        y1: noseY + perpY * offset,
        x2: targetX + perpX * (offset * 0.45),
        y2: targetY + perpY * (offset * 0.45),
        color: w.color,
        coreColor: '#ecfeff',
        width: 2.8,
        alpha: 1.0,
        decay: 8.0
      });
    });
    spawnParticles(targetX, targetY + 4, w.color, 7, 105);
  } else if (weaponId === 'railgun') {
    state.lasers.push({
      kind: 'railgun',
      x1: noseX,
      y1: noseY,
      x2: targetX,
      y2: targetY,
      color: w.color,
      coreColor: '#ffffff',
      width: 5.5,
      alpha: 1.0,
      decay: 5.2
    });
    [0.35, 0.7, 1.0].forEach(frac => {
      state.shockwaves.push({
        x: noseX + (targetX - noseX) * frac,
        y: noseY + (targetY - noseY) * frac,
        radius: 3,
        maxRadius: frac === 1.0 ? 28 : 16,
        color: w.color,
        alpha: 0.9
      });
    });
    spawnParticles(targetX, targetY, '#fda4af', 10, 145);
  } else if (weaponId === 'tesla') {
    const mainBolt = buildLightningPoints(noseX, noseY, targetX, targetY, 9, 18);
    const midPoint = mainBolt[Math.floor(mainBolt.length / 2)];
    const branchBolt = buildLightningPoints(
      midPoint.x,
      midPoint.y,
      midPoint.x + (Math.random() * 56 - 28),
      midPoint.y - (20 + Math.random() * 30),
      4,
      9
    );
    state.lasers.push({
      kind: 'tesla',
      points: mainBolt,
      branch: branchBolt,
      color: w.color,
      coreColor: '#e0f2fe',
      width: 2.6,
      alpha: 1.0,
      decay: 6.8
    });
    spawnParticles(targetX, targetY, '#c4b5fd', 8, 120);
  } else if (weaponId === 'missiles') {
    state.missileAlternateSide *= -1;
    const curveSign = state.missileAlternateSide;
    const dist = Math.hypot(dx, dy);
    const ctrlX = (noseX + targetX) / 2 + perpX * curveSign * Math.min(95, dist * 0.32);
    const ctrlY = (noseY + targetY) / 2 + perpY * curveSign * 24;

    state.lasers.push({
      kind: 'designator',
      x1: noseX,
      y1: noseY,
      x2: targetX,
      y2: targetY,
      color: 'rgba(251, 146, 60, 0.45)',
      width: 1.2,
      alpha: 0.75,
      decay: 9.0
    });

    state.missiles.push({
      x0: noseX + perpX * curveSign * 9,
      y0: noseY + perpY * curveSign * 9,
      cx: ctrlX,
      cy: ctrlY,
      x2: targetX,
      y2: targetY,
      x: noseX,
      y: noseY,
      progress: 0,
      speed: 7.4,
      color: w.color
    });
  } else if (weaponId === 'synth') {
    const hueColors = ['#e879f9', '#22d3ee', '#fbbf24', '#34d399'];
    const noteColor = hueColors[sound.synthNoteCursor % hueColors.length];
    state.lasers.push({
      kind: 'synth',
      x1: noseX,
      y1: noseY,
      x2: targetX,
      y2: targetY,
      color: noteColor,
      secondaryColor: articleColor || '#22d3ee',
      coreColor: '#ffffff',
      width: 3.8,
      alpha: 1.0,
      decay: 6.2
    });
    state.shockwaves.push({
      x: targetX,
      y: targetY,
      radius: 4,
      maxRadius: 24,
      color: noteColor,
      alpha: 0.85
    });
    spawnParticles(targetX, targetY, noteColor, 8, 115);
  } else if (weaponId === 'gravity') {
    state.lasers.push({
      kind: 'gravity',
      x1: noseX,
      y1: noseY,
      x2: targetX,
      y2: targetY,
      color: '#2dd4bf',
      coreColor: '#ccfbf1',
      width: 4.6,
      alpha: 0.95,
      decay: 6.0
    });
    state.shockwaves.push({
      x: targetX,
      y: targetY,
      radius: 5,
      maxRadius: 34,
      color: '#2dd4bf',
      alpha: 0.9
    });
    spawnParticles(targetX, targetY, '#5eead4', 9, 130);
  }
}
