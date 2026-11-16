// Процедурный синтезатор звука Web Audio API 2.0 (SRP — 0 зависимостей от DOM)
import { SYNTH_SCALE_HZ } from '../config/constants.js';

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.noiseBuffer = null;
    this.sfxEnabled = true;
    this.synthNoteCursor = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.88;
        this.masterGain.connect(this.ctx.destination);
        this._buildNoiseBuffer();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  _buildNoiseBuffer() {
    if (!this.ctx) return;
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * 1.0;
    const buffer = this.ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
  }

  _createPanDest(pan = 0) {
    if (!this.ctx || !this.masterGain) return null;
    if (typeof this.ctx.createStereoPanner === 'function') {
      const panner = this.ctx.createStereoPanner();
      panner.pan.value = Math.max(-0.7, Math.min(0.7, pan));
      panner.connect(this.masterGain);
      return panner;
    }
    return this.masterGain;
  }

  _playTactileClick(now, dest, freq = 2100, vol = 0.06) {
    if (!this.noiseBuffer || !dest) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq, now);
    filter.Q.value = 2.4;

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.016);

    src.connect(filter);
    filter.connect(g);
    g.connect(dest);
    src.start(now, Math.random() * 0.4, 0.02);
  }

  playWeaponShot(weaponId = 'plasma', pitchIndex = 0, combo = 1, pan = 0, isFinalLetter = false) {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const dest = this._createPanDest(pan);
    if (!dest) return;

    const comboBoost = Math.min(180, (combo - 1) * 18);
    const letterStep = Math.min(280, pitchIndex * 24);

    if (weaponId === 'plasma') {
      this._playTactileClick(now, dest, 2400, 0.055);
      const base = 520 + letterStep + comboBoost * 0.5;
      [-7, 7].forEach(detuneCents => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.detune.value = detuneCents;
        osc.frequency.setValueAtTime(base, now);
        osc.frequency.exponentialRampToValueAtTime(145, now + 0.095);

        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(3400, now);
        lp.frequency.exponentialRampToValueAtTime(650, now + 0.095);

        g.gain.setValueAtTime(0.068, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

        osc.connect(lp);
        lp.connect(g);
        g.connect(dest);
        osc.start(now);
        osc.stop(now + 0.1);
      });

      const ping = this.ctx.createOscillator();
      const pg = this.ctx.createGain();
      ping.type = 'sine';
      ping.frequency.setValueAtTime(880 + letterStep * 1.4, now);
      pg.gain.setValueAtTime(0.032, now);
      pg.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
      ping.connect(pg);
      pg.connect(dest);
      ping.start(now);
      ping.stop(now + 0.07);
    } else if (weaponId === 'railgun') {
      this._playTactileClick(now, dest, 1750, 0.09);
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(155, now);
      sub.frequency.exponentialRampToValueAtTime(36, now + 0.14);
      subGain.gain.setValueAtTime(0.2, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.145);
      sub.connect(subGain);
      subGain.connect(dest);
      sub.start(now);
      sub.stop(now + 0.15);

      const rail = this.ctx.createOscillator();
      const railGain = this.ctx.createGain();
      rail.type = 'triangle';
      rail.frequency.setValueAtTime(1420 + letterStep, now);
      rail.frequency.exponentialRampToValueAtTime(390, now + 0.11);
      railGain.gain.setValueAtTime(0.075, now);
      railGain.gain.exponentialRampToValueAtTime(0.001, now + 0.115);
      rail.connect(railGain);
      railGain.connect(dest);
      rail.start(now);
      rail.stop(now + 0.12);
    } else if (weaponId === 'tesla') {
      if (this.noiseBuffer) {
        const nz = this.ctx.createBufferSource();
        nz.buffer = this.noiseBuffer;
        const bp = this.ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(3100, now);
        bp.frequency.exponentialRampToValueAtTime(900, now + 0.09);
        bp.Q.value = 4.2;

        const ng = this.ctx.createGain();
        ng.gain.setValueAtTime(0.14, now);
        ng.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

        nz.connect(bp);
        bp.connect(ng);
        ng.connect(dest);
        nz.start(now, Math.random() * 0.5, 0.1);
      }

      const zap = this.ctx.createOscillator();
      const zg = this.ctx.createGain();
      zap.type = 'sawtooth';
      zap.frequency.setValueAtTime(1150 + letterStep * 1.2, now);
      zap.frequency.setValueAtTime(680, now + 0.025);
      zap.frequency.exponentialRampToValueAtTime(190, now + 0.085);
      zg.gain.setValueAtTime(0.065, now);
      zg.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      zap.connect(zg);
      zg.connect(dest);
      zap.start(now);
      zap.stop(now + 0.095);
    } else if (weaponId === 'missiles') {
      this._playTactileClick(now, dest, 1900, 0.05);
      if (this.noiseBuffer) {
        const whoosh = this.ctx.createBufferSource();
        whoosh.buffer = this.noiseBuffer;
        const bp = this.ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(600, now);
        bp.frequency.exponentialRampToValueAtTime(2400, now + 0.085);
        bp.Q.value = 2.8;

        const wg = this.ctx.createGain();
        wg.gain.setValueAtTime(0.11, now);
        wg.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

        whoosh.connect(bp);
        bp.connect(wg);
        wg.connect(dest);
        whoosh.start(now, Math.random() * 0.4, 0.1);
      }

      const popTime = now + 0.065;
      const pop = this.ctx.createOscillator();
      const pg = this.ctx.createGain();
      pop.type = 'triangle';
      pop.frequency.setValueAtTime(260 + letterStep * 0.7, popTime);
      pop.frequency.exponentialRampToValueAtTime(62, popTime + 0.075);
      pg.gain.setValueAtTime(0.12, popTime);
      pg.gain.exponentialRampToValueAtTime(0.001, popTime + 0.08);
      pop.connect(pg);
      pg.connect(dest);
      pop.start(popTime);
      pop.stop(popTime + 0.085);
    } else if (weaponId === 'synth') {
      this._playTactileClick(now, dest, 1450, 0.055);
      const noteHz = SYNTH_SCALE_HZ[(this.synthNoteCursor++) % SYNTH_SCALE_HZ.length];
      [-6, 6].forEach(detune => {
        const lead = this.ctx.createOscillator();
        const lg = this.ctx.createGain();
        const filt = this.ctx.createBiquadFilter();

        lead.type = 'sawtooth';
        lead.frequency.setValueAtTime(noteHz, now);
        lead.detune.value = detune;

        filt.type = 'lowpass';
        filt.frequency.setValueAtTime(2600, now);
        filt.frequency.exponentialRampToValueAtTime(750, now + 0.17);

        lg.gain.setValueAtTime(0.052, now);
        lg.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        lead.connect(filt);
        filt.connect(lg);
        lg.connect(dest);
        lead.start(now);
        lead.stop(now + 0.185);
      });
    } else if (weaponId === 'gravity') {
      this._playTactileClick(now, dest, 1650, 0.06);
      const lift = this.ctx.createOscillator();
      const liftGain = this.ctx.createGain();
      lift.type = 'sine';
      lift.frequency.setValueAtTime(92, now);
      lift.frequency.exponentialRampToValueAtTime(285 + letterStep * 0.9, now + 0.14);
      liftGain.gain.setValueAtTime(0.15, now);
      liftGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      lift.connect(liftGain);
      liftGain.connect(dest);
      lift.start(now);
      lift.stop(now + 0.155);

      [330 + letterStep, 495 + letterStep].forEach(freq => {
        const shimmer = this.ctx.createOscillator();
        const sg = this.ctx.createGain();
        shimmer.type = 'triangle';
        shimmer.frequency.setValueAtTime(freq * 0.78, now);
        shimmer.frequency.exponentialRampToValueAtTime(freq * 1.35, now + 0.13);
        sg.gain.setValueAtTime(0.045, now);
        sg.gain.exponentialRampToValueAtTime(0.001, now + 0.135);
        shimmer.connect(sg);
        sg.connect(dest);
        shimmer.start(now);
        shimmer.stop(now + 0.14);
      });
    }

    if (isFinalLetter) {
      const fin = this.ctx.createOscillator();
      const fg = this.ctx.createGain();
      fin.type = 'sine';
      fin.frequency.setValueAtTime(1046.5, now);
      fin.frequency.exponentialRampToValueAtTime(1567.98, now + 0.09);
      fg.gain.setValueAtTime(0.06, now);
      fg.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      fin.connect(fg);
      fg.connect(dest);
      fin.start(now);
      fin.stop(now + 0.105);
    }
  }

  playExplosion(combo = 1, pan = 0) {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const dest = this._createPanDest(pan);
    if (!dest) return;

    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'triangle';
    sub.frequency.setValueAtTime(185, now);
    sub.frequency.exponentialRampToValueAtTime(30, now + 0.38);
    subGain.gain.setValueAtTime(0.24, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.39);
    sub.connect(subGain);
    subGain.connect(dest);
    sub.start(now);
    sub.stop(now + 0.4);

    if (this.noiseBuffer) {
      const boom = this.ctx.createBufferSource();
      boom.buffer = this.noiseBuffer;
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(950, now);
      lp.frequency.exponentialRampToValueAtTime(140, now + 0.32);

      const bg = this.ctx.createGain();
      bg.gain.setValueAtTime(0.14, now);
      bg.gain.exponentialRampToValueAtTime(0.001, now + 0.33);

      boom.connect(lp);
      lp.connect(bg);
      bg.connect(dest);
      boom.start(now, 0, 0.35);
    }

    const semitoneShift = Math.min(7, Math.floor((combo - 1) / 2));
    const mult = Math.pow(2, semitoneShift / 12);
    [523.25 * mult, 659.25 * mult, 783.99 * mult].forEach((freq, idx) => {
      const chime = this.ctx.createOscillator();
      const cGain = this.ctx.createGain();
      chime.type = 'sine';
      const t0 = now + idx * 0.032;
      chime.frequency.setValueAtTime(freq, t0);
      cGain.gain.setValueAtTime(0.05, t0);
      cGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.28);
      chime.connect(cGain);
      cGain.connect(dest);
      chime.start(t0);
      chime.stop(t0 + 0.29);
    });
  }

  playUnlockFanfare() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((hz, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      const t0 = now + i * 0.08;
      osc.frequency.setValueAtTime(hz, t0);
      g.gain.setValueAtTime(0.11, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.36);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t0);
      osc.stop(t0 + 0.38);
    });
  }

  playStarChime(active = true) {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(active ? 740 : 520, now);
    osc.frequency.exponentialRampToValueAtTime(active ? 1174.66 : 360, now + 0.11);
    g.gain.setValueAtTime(0.075, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.125);
  }

  playWeaponEquip(weaponId) {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this._playTactileClick(now, this.masterGain, 2800, 0.07);
    if (weaponId === 'gravity') {
      this.playGravityWave(1.0);
    } else {
      this.playWeaponShot(weaponId, 3, 2, 0, false);
    }
  }

  playGravityWave(strength = 1.0) {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const dest = this.masterGain;
    const dur = 0.28 + 0.14 * strength;

    const sub = this.ctx.createOscillator();
    const sg = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(68, now);
    sub.frequency.exponentialRampToValueAtTime(420, now + dur);
    sg.gain.setValueAtTime(0.16 * Math.min(1.1, strength + 0.25), now);
    sg.gain.exponentialRampToValueAtTime(0.001, now + dur + 0.03);
    sub.connect(sg);
    sg.connect(dest);
    sub.start(now);
    sub.stop(now + dur + 0.04);

    if (this.noiseBuffer) {
      const whoosh = this.ctx.createBufferSource();
      whoosh.buffer = this.noiseBuffer;
      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(340, now);
      bp.frequency.exponentialRampToValueAtTime(2200, now + dur);
      bp.Q.value = 2.4;

      const wg = this.ctx.createGain();
      wg.gain.setValueAtTime(0.11, now);
      wg.gain.exponentialRampToValueAtTime(0.001, now + dur);

      whoosh.connect(bp);
      bp.connect(wg);
      wg.connect(dest);
      whoosh.start(now, Math.random() * 0.4, dur + 0.04);
    }
  }

  playWarpLaunch() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const dest = this.masterGain;

    const sweep = this.ctx.createOscillator();
    const sg = this.ctx.createGain();
    sweep.type = 'sawtooth';
    sweep.frequency.setValueAtTime(95, now);
    sweep.frequency.exponentialRampToValueAtTime(620, now + 0.42);

    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(400, now);
    lp.frequency.exponentialRampToValueAtTime(3200, now + 0.42);

    sg.gain.setValueAtTime(0.14, now);
    sg.gain.exponentialRampToValueAtTime(0.001, now + 0.46);

    sweep.connect(lp);
    lp.connect(sg);
    sg.connect(dest);
    sweep.start(now);
    sweep.stop(now + 0.48);
  }

  playMiss() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.setValueAtTime(96, now + 0.045);

    gain.gain.setValueAtTime(0.065, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playShieldHit() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(125, now);
    osc.frequency.linearRampToValueAtTime(42, now + 0.4);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.43);
  }
}

export const sound = new SoundEngine();
