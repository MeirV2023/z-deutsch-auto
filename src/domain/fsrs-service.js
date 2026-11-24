// ============================================================================
// Сервис FSRS-5 памяти слов (persistence, due queue & summary metrics — SRP / DIP)
// Хранит DSR-состояния карточек в localStorage под ключом zlingo_fsrs_cards_v1.
// ============================================================================

import { bus } from '../core/events.js';
import {
  FSRS_STORAGE_KEY,
  loadJsonStorage,
  saveJsonStorage
} from '../core/storage.js';
import {
  FSRS_STATE,
  DAY_MS,
  getCardRetrievability,
  reviewFsrsCard
} from './fsrs-engine.js';
import { makeWordKey, state } from '../state/store.js';
import { getAllWordsInTargetLang } from './catalog-service.js';

const rawSavedCards = loadJsonStorage(FSRS_STORAGE_KEY, {});
const fsrsCardsMap = new Map(
  rawSavedCards && typeof rawSavedCards === 'object'
    ? Object.entries(rawSavedCards).filter(([, v]) => v && typeof v === 'object')
    : []
);

function persistFsrsCards() {
  saveJsonStorage(FSRS_STORAGE_KEY, Object.fromEntries(fsrsCardsMap.entries()));
}

/**
 * Record an FSRS-5 review outcome (1=Again, 2=Hard, 3=Good, 4=Easy) for a word entry.
 */
export function recordFsrsReview(entry, targetLang = state.targetLang, rating, nowMs = Date.now()) {
  if (!entry || (!entry.word && !entry.raw)) return null;
  const key = makeWordKey(targetLang, entry);
  const prev = fsrsCardsMap.get(key) || null;
  const result = reviewFsrsCard(prev, rating, nowMs);
  fsrsCardsMap.set(key, result.card);
  persistFsrsCards();
  bus.emit('fsrs:changed', { key, card: result.card, rating: result.rating, targetLang });
  return result;
}

/**
 * Return raw stored FSRS card for an entry or null if unseen.
 */
export function getFsrsCard(entry, targetLang = state.targetLang) {
  if (!entry || (!entry.word && !entry.raw)) return null;
  return fsrsCardsMap.get(makeWordKey(targetLang, entry)) || null;
}

/**
 * Return computed display metrics (R%, stability, difficulty, due status) for an entry.
 */
export function getFsrsCardMetrics(entry, targetLang = state.targetLang, nowMs = Date.now()) {
  const card = getFsrsCard(entry, targetLang);
  if (!card || !card.reps) return null;
  const r = getCardRetrievability(card, nowMs);
  const isDue = card.due <= nowMs;
  const dueInDays = (card.due - nowMs) / DAY_MS;
  return {
    card,
    retrievabilityPct: Math.round(r * 100),
    isDue,
    stabilityDays: Math.round((card.stability || 0) * 10) / 10,
    difficulty: Math.round((card.difficulty || 5) * 10) / 10,
    state: card.state,
    dueInDays
  };
}

/**
 * Resolve up to `limit` catalog entries for `targetLang` that are due for FSRS review now,
 * sorted by lowest retrievability / most overdue first.
 */
export function getFsrsDueEntriesForTargetLang(targetLang = state.targetLang, limit = 15, nowMs = Date.now()) {
  const prefix = `${targetLang}::`;
  const dueCandidates = [];

  for (const [key, card] of fsrsCardsMap.entries()) {
    if (!key.startsWith(prefix) || !card || !card.reps) continue;
    if (card.due <= nowMs) {
      const r = getCardRetrievability(card, nowMs);
      dueCandidates.push({
        key,
        r,
        overdueMs: nowMs - card.due
      });
    }
  }

  if (dueCandidates.length === 0) return [];

  dueCandidates.sort((a, b) => (a.r - b.r) || (b.overdueMs - a.overdueMs));

  const catalogWords = getAllWordsInTargetLang(targetLang);
  const wordByKey = new Map();
  for (const w of catalogWords) {
    const wk = makeWordKey(targetLang, w);
    if (!wordByKey.has(wk)) wordByKey.set(wk, w);
  }

  const out = [];
  for (const item of dueCandidates) {
    const matched = wordByKey.get(item.key);
    if (matched) {
      out.push(matched);
      if (out.length >= limit) break;
    }
  }
  return out;
}

/**
 * Compute aggregate FSRS-5 memory summary for a target language (plus total across all langs).
 */
export function getFsrsSummaryForTargetLang(targetLang = state.targetLang, nowMs = Date.now()) {
  const prefix = `${targetLang}::`;
  let tracked = 0;
  let dueNow = 0;
  let learning = 0;
  let mastered = 0;
  let retentionSum = 0;

  for (const [key, card] of fsrsCardsMap.entries()) {
    if (!key.startsWith(prefix) || !card || !card.reps) continue;
    tracked++;
    if (card.due <= nowMs) {
      dueNow++;
    }
    if (card.state === FSRS_STATE.Learning || card.state === FSRS_STATE.Relearning) {
      learning++;
    }
    if ((card.stability || 0) >= 21) {
      mastered++;
    }
    retentionSum += getCardRetrievability(card, nowMs);
  }

  const avgRetentionPct = tracked > 0 ? Math.round((retentionSum / tracked) * 100) : 100;

  return {
    tracked,
    dueNow,
    learning,
    mastered,
    avgRetentionPct,
    totalTrackedAllLangs: fsrsCardsMap.size
  };
}

/**
 * Return plain JSON-serializable copy of all tracked FSRS cards.
 */
export function getAllFsrsCardsObject() {
  return Object.fromEntries(fsrsCardsMap.entries());
}

/**
 * Merge FSRS cards from cloud backup, preserving whichever record has newer lastReview.
 */
export function mergeFsrsCardsFromCloud(remoteMapObj) {
  if (!remoteMapObj || typeof remoteMapObj !== 'object' || Array.isArray(remoteMapObj)) return 0;
  let mergedCount = 0;
  for (const [key, remoteCard] of Object.entries(remoteMapObj)) {
    if (!key || !remoteCard || typeof remoteCard !== 'object') continue;
    const localCard = fsrsCardsMap.get(key);
    const remoteTs = Number(remoteCard.lastReview) || 0;
    const localTs = localCard ? (Number(localCard.lastReview) || 0) : 0;
    if (!localCard || remoteTs > localTs) {
      fsrsCardsMap.set(key, remoteCard);
      mergedCount++;
    }
  }
  if (mergedCount > 0) {
    persistFsrsCards();
    bus.emit('fsrs:changed', { mergedFromCloud: mergedCount });
  }
  return mergedCount;
}

/**
 * Clear all persisted FSRS cards (e.g., user privacy reset).
 */
export function clearAllFsrsCards() {
  fsrsCardsMap.clear();
  persistFsrsCards();
  bus.emit('fsrs:changed', { cleared: true });
}
