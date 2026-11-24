/**
 * Vercel Serverless Function: Cloud Sync & GDPR Erasure for Signed-In Users
 * GET    /api/user-sync  -> fetch cloud FSRS-5, progress & Anki decks
 * POST   /api/user-sync  -> save cloud snapshot & marketingOptIn preference
 * DELETE /api/user-sync  -> GDPR Art. 17 complete account & data deletion
 */

const { handleOptionsCors, setNoStore, getJsonBody } = require('./_lib/http');
const {
  clearSessionCookie,
  createSessionToken,
  getSessionFromRequest,
  setSessionCookie,
  supabaseRequest
} = require('./_lib/auth-session');

const MAX_SYNC_BYTES = 4 * 1024 * 1024;

module.exports = async function handler(req, res) {
  setNoStore(res);

  if (handleOptionsCors(req, res, 'GET, POST, DELETE, OPTIONS', 'Content-Type')) {
    return;
  }

  const session = getSessionFromRequest(req);
  if (!session) {
    return res.status(401).json({ error: 'AUTH_SESSION_REQUIRED' });
  }

  const subFilter = `google_sub=eq.${encodeURIComponent(session.sub)}`;

  if (req.method === 'DELETE') {
    const delRes = await supabaseRequest(`vocanova_users?${subFilter}`, { method: 'DELETE' });
    clearSessionCookie(req, res);
    if (!delRes.notConfigured && !delRes.ok) {
      return res.status(502).json({ error: 'ACCOUNT_DELETE_FAILED' });
    }
    return res.status(200).json({ ok: true, deleted: true });
  }

  if (req.method === 'GET') {
    const getRes = await supabaseRequest(
      `vocanova_users?${subFilter}&select=email,display_name,avatar_url,marketing_opt_in,fsrs_json,progress_json,anki_decks_json,updated_at`,
      { method: 'GET' }
    );
    if (getRes.notConfigured) {
      return res.status(200).json({ ok: true, cloudDbConfigured: false, snapshot: null });
    }
    if (!getRes.ok) {
      return res.status(502).json({ error: 'CLOUD_READ_FAILED' });
    }
    const row = Array.isArray(getRes.data) && getRes.data[0] ? getRes.data[0] : null;
    return res.status(200).json({
      ok: true,
      cloudDbConfigured: true,
      snapshot: row
        ? {
            marketingOptIn: Boolean(row.marketing_opt_in),
            fsrsCards: row.fsrs_json || {},
            progress: row.progress_json || {},
            ankiDecks: Array.isArray(row.anki_decks_json) ? row.anki_decks_json : [],
            updatedAt: row.updated_at || ''
          }
        : null
    });
  }

  if (req.method === 'POST') {
    const body = getJsonBody(req);
    const serializedLen = Buffer.byteLength(JSON.stringify(body), 'utf-8');
    if (serializedLen > MAX_SYNC_BYTES) {
      return res.status(413).json({ error: 'SYNC_PAYLOAD_TOO_LARGE' });
    }

    const nowIso = new Date().toISOString();
    const patch = { updated_at: nowIso };

    if (typeof body.marketingOptIn === 'boolean') {
      patch.marketing_opt_in = body.marketingOptIn;
      patch.marketing_opt_in_at = body.marketingOptIn ? nowIso : null;
    }
    if (body.fsrsCards && typeof body.fsrsCards === 'object' && !Array.isArray(body.fsrsCards)) {
      patch.fsrs_json = body.fsrsCards;
    }
    if (body.progress && typeof body.progress === 'object') {
      patch.progress_json = body.progress;
      const settings = body.progress.settings || {};
      if (typeof settings.nativeLang === 'string') patch.native_lang = settings.nativeLang.slice(0, 8);
      if (typeof settings.targetLang === 'string') patch.target_lang = settings.targetLang.slice(0, 8);
      if (Number.isFinite(Number(settings.highScore))) {
        patch.high_score = Math.max(0, Math.round(Number(settings.highScore)));
      }
      if (Array.isArray(body.progress.learnedWords)) {
        patch.learned_count = body.progress.learnedWords.length;
      }
      if (body.progress.dailyProgress && Number.isFinite(Number(body.progress.dailyProgress.streakDays))) {
        patch.streak_days = Math.max(1, Math.round(Number(body.progress.dailyProgress.streakDays)));
      }
    }
    if (Array.isArray(body.ankiDecks)) {
      patch.anki_decks_json = body.ankiDecks;
    }

    const updRes = await supabaseRequest(`vocanova_users?${subFilter}`, {
      method: 'PATCH',
      prefer: 'return=representation',
      body: patch
    });

    if (typeof body.marketingOptIn === 'boolean') {
      const nextToken = createSessionToken({
        ...session,
        marketingOptIn: body.marketingOptIn
      });
      if (nextToken) setSessionCookie(req, res, nextToken);
    }

    if (updRes.notConfigured) {
      return res.status(200).json({ ok: true, cloudDbConfigured: false, updatedAt: nowIso });
    }
    if (!updRes.ok) {
      return res.status(502).json({ error: 'CLOUD_WRITE_FAILED' });
    }
    return res.status(200).json({ ok: true, cloudDbConfigured: true, updatedAt: nowIso });
  }

  return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
};
