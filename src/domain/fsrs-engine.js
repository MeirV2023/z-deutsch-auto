// ============================================================================
// FSRS-5 (Free Spaced Repetition Scheduler — open-spaced-repetition/fsrs4anki)
// Pure stateless DSR memory model with ZERO imports (SRP / DIP).
// Models Difficulty (D), Stability (S), and Retrievability (R) on a power-law
// forgetting curve: R(t, S) = (1 + (19/81) * t / S)^(-0.5), where R(S, S) = 0.9.
// ============================================================================

export const FSRS_VERSION = 'FSRS-5';
export const FSRS_DEFAULT_RETENTION = 0.9;
export const FSRS_DECAY = -0.5;
export const FSRS_FACTOR = 19 / 81;
export const FSRS_MAX_INTERVAL = 36500;
export const DAY_MS = 86400000;

export const FSRS_DEFAULT_W = Object.freeze([
  0.40255, 1.18385, 3.173, 15.69105,
  7.1949, 0.5345, 1.4604, 0.0046,
  1.54575, 0.1192, 1.01925, 1.9395,
  0.11, 0.29605, 2.2698, 0.2315,
  2.9898, 0.51655, 0.6621
]);

export const FSRS_RATING = Object.freeze({
  Again: 1,
  Hard: 2,
  Good: 3,
  Easy: 4
});

export const FSRS_STATE = Object.freeze({
  New: 0,
  Learning: 1,
  Review: 2,
  Relearning: 3
});

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function round3(val) {
  return Math.round(val * 1000) / 1000;
}

/**
 * Create a fresh blank FSRS card record.
 */
export function createEmptyFsrsCard(nowMs = Date.now()) {
  return {
    due: nowMs,
    stability: 0,
    difficulty: 0,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    state: FSRS_STATE.New,
    lastReview: 0
  };
}

/**
 * Initial Stability S_0(G) in days for first-time rating G (1..4).
 */
export function initStability(rating, w = FSRS_DEFAULT_W) {
  const idx = clamp(Math.round(rating) - 1, 0, 3);
  return Math.max(0.01, w[idx]);
}

/**
 * Initial Difficulty D_0(G) clamped to [1, 10].
 */
export function initDifficulty(rating, w = FSRS_DEFAULT_W) {
  const g = clamp(Math.round(rating), 1, 4);
  return clamp(w[4] - Math.exp(w[5] * (g - 1)) + 1, 1, 10);
}

/**
 * Next Difficulty using FSRS-5 linear damping and mean reversion toward D_0(Easy).
 */
export function nextDifficulty(d, rating, w = FSRS_DEFAULT_W) {
  const g = clamp(Math.round(rating), 1, 4);
  const deltaD = -w[6] * (g - 3);
  const dPrime = d + deltaD * ((10 - d) / 9);
  const targetMean = initDifficulty(FSRS_RATING.Easy, w);
  return clamp(w[7] * targetMean + (1 - w[7]) * dPrime, 1, 10);
}

/**
 * Power-law forgetting curve: R(t, S) = (1 + (19/81) * t / S)^(-0.5).
 */
export function computeRetrievability(elapsedDays, stability) {
  if (!Number.isFinite(stability) || stability <= 0) return 0;
  if (!Number.isFinite(elapsedDays) || elapsedDays <= 0) return 1;
  return Math.pow(1 + (FSRS_FACTOR * elapsedDays) / stability, FSRS_DECAY);
}

/**
 * Current Retrievability [0..1] for a persisted card at timestamp nowMs.
 */
export function getCardRetrievability(card, nowMs = Date.now()) {
  if (!card || !card.lastReview || !card.stability) return 0;
  const elapsedDays = Math.max(0, (nowMs - card.lastReview) / DAY_MS);
  return computeRetrievability(elapsedDays, card.stability);
}

/**
 * FSRS-5 short-term stability update when reviewed again within < 1 day (w[17..18]).
 */
export function shortTermStability(s, rating, w = FSRS_DEFAULT_W) {
  const g = clamp(Math.round(rating), 1, 4);
  const nextS = s * Math.exp(w[17] * (g - 3 + w[18]));
  if (g >= FSRS_RATING.Good) {
    return Math.max(s, nextS, 0.01);
  }
  return Math.max(0.01, nextS);
}

/**
 * Stability after successful recall (Hard=2, Good=3, Easy=4) after >= 1 day.
 */
export function nextRecallStability(d, s, r, rating, w = FSRS_DEFAULT_W) {
  const hardPenalty = rating === FSRS_RATING.Hard ? w[15] : 1;
  const easyBonus = rating === FSRS_RATING.Easy ? w[16] : 1;
  const growth = Math.exp(w[8]) *
    (11 - d) *
    Math.pow(s, -w[9]) *
    (Math.exp(w[10] * (1 - r)) - 1) *
    hardPenalty *
    easyBonus;
  return Math.max(0.01, s * (1 + growth));
}

/**
 * Post-lapse stability after forgetting (Again=1).
 */
export function nextForgetStability(d, s, r, w = FSRS_DEFAULT_W) {
  const raw = w[11] *
    Math.pow(d, -w[12]) *
    (Math.pow(s + 1, w[13]) - 1) *
    Math.exp(w[14] * (1 - r));
  return Math.max(0.01, Math.min(s, raw));
}

/**
 * Optimal next interval in days for target retention R (default 0.90).
 */
export function nextIntervalDays(stability, requestRetention = FSRS_DEFAULT_RETENTION) {
  const reqR = clamp(requestRetention, 0.7, 0.99);
  const raw = (stability / FSRS_FACTOR) * (Math.pow(reqR, 1 / FSRS_DECAY) - 1);
  return clamp(Math.round(raw), 1, FSRS_MAX_INTERVAL);
}

/**
 * Apply an FSRS-5 review (rating 1..4) and return the updated card + schedule metrics.
 */
export function reviewFsrsCard(prevCard, rating, nowMs = Date.now(), opts = {}) {
  const w = opts.weights || FSRS_DEFAULT_W;
  const requestRetention = opts.requestRetention || FSRS_DEFAULT_RETENTION;
  const g = clamp(Math.round(rating), 1, 4);
  const base = prevCard && typeof prevCard === 'object'
    ? { ...createEmptyFsrsCard(nowMs), ...prevCard }
    : createEmptyFsrsCard(nowMs);

  const isFirstReview = !base.reps || base.state === FSRS_STATE.New;
  const elapsedDays = base.lastReview > 0
    ? Math.max(0, (nowMs - base.lastReview) / DAY_MS)
    : 0;

  let newS;
  let newD;
  let retrievability = isFirstReview ? 0 : computeRetrievability(elapsedDays, base.stability);

  if (isFirstReview) {
    newS = initStability(g, w);
    newD = initDifficulty(g, w);
  } else {
    newD = nextDifficulty(base.difficulty || initDifficulty(FSRS_RATING.Good, w), g, w);
    if (elapsedDays < 1) {
      newS = shortTermStability(Math.max(0.01, base.stability), g, w);
    } else if (g === FSRS_RATING.Again) {
      newS = nextForgetStability(newD, Math.max(0.01, base.stability), retrievability, w);
    } else {
      newS = nextRecallStability(newD, Math.max(0.01, base.stability), retrievability, g, w);
    }
  }

  let nextState;
  let scheduledDays = 0;
  let dueMs;

  if (g === FSRS_RATING.Again) {
    nextState = isFirstReview ? FSRS_STATE.Learning : FSRS_STATE.Relearning;
    scheduledDays = 0;
    dueMs = nowMs;
  } else if (isFirstReview && g === FSRS_RATING.Hard) {
    nextState = FSRS_STATE.Learning;
    scheduledDays = 0;
    dueMs = nowMs + 12 * 3600 * 1000;
  } else {
    nextState = FSRS_STATE.Review;
    scheduledDays = nextIntervalDays(newS, requestRetention);
    if (isFirstReview && g === FSRS_RATING.Easy) {
      scheduledDays = Math.max(4, scheduledDays);
    }
    dueMs = nowMs + scheduledDays * DAY_MS;
  }

  const card = {
    due: dueMs,
    stability: round3(newS),
    difficulty: round3(newD),
    elapsedDays: round3(elapsedDays),
    scheduledDays,
    reps: (base.reps || 0) + 1,
    lapses: (base.lapses || 0) + (g === FSRS_RATING.Again && !isFirstReview ? 1 : 0),
    state: nextState,
    lastReview: nowMs
  };

  return {
    card,
    rating: g,
    retrievability: round3(retrievability),
    nextIntervalDays: scheduledDays
  };
}
