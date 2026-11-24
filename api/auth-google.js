/**
 * Vercel Serverless Function: Voluntary Google (Gmail) ID-Token Sign-In & Sign-Out
 * POST   /api/auth-google  { credential, marketingOptIn }
 * DELETE /api/auth-google  (sign out -> clears HttpOnly cookie)
 */

const { handleOptionsCors, setNoStore, getJsonBody } = require('./_lib/http');
const {
  clearSessionCookie,
  createSessionToken,
  getGoogleClientId,
  setSessionCookie,
  supabaseRequest
} = require('./_lib/auth-session');

const ALLOWED_ISSUERS = new Set(['accounts.google.com', 'https://accounts.google.com']);

module.exports = async function handler(req, res) {
  setNoStore(res);

  if (handleOptionsCors(req, res, 'POST, DELETE, OPTIONS', 'Content-Type')) {
    return;
  }

  if (req.method === 'DELETE') {
    clearSessionCookie(req, res);
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const googleClientId = getGoogleClientId();
  if (!googleClientId) {
    return res.status(503).json({
      error: 'GOOGLE_AUTH_NOT_CONFIGURED',
      message: 'GOOGLE_CLIENT_ID is not configured on the server.'
    });
  }

  const body = getJsonBody(req);
  const credential = body && typeof body.credential === 'string' ? body.credential.trim() : '';
  const requestedOptIn = Boolean(body && body.marketingOptIn);

  if (!credential) {
    return res.status(400).json({ error: 'MISSING_GOOGLE_CREDENTIAL' });
  }

  try {
    const verifyResp = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );
    if (!verifyResp.ok) {
      return res.status(401).json({ error: 'INVALID_GOOGLE_TOKEN' });
    }

    const tokenInfo = await verifyResp.json();
    const aud = String(tokenInfo.aud || '');
    const iss = String(tokenInfo.iss || '');
    const expSec = Number(tokenInfo.exp || 0);
    const emailVerified = tokenInfo.email_verified === true || tokenInfo.email_verified === 'true';

    if (
      aud !== googleClientId ||
      !ALLOWED_ISSUERS.has(iss) ||
      !emailVerified ||
      !tokenInfo.sub ||
      !tokenInfo.email ||
      (expSec && Math.floor(Date.now() / 1000) > expSec)
    ) {
      return res.status(401).json({ error: 'GOOGLE_TOKEN_CLAIMS_INVALID' });
    }

    const sub = String(tokenInfo.sub);
    const email = String(tokenInfo.email).toLowerCase();
    const name = String(tokenInfo.name || tokenInfo.given_name || email.split('@')[0]);
    const picture = String(tokenInfo.picture || '');
    const nowIso = new Date().toISOString();

    let finalMarketingOptIn = requestedOptIn;
    let cloudSnapshot = null;

    // Fetch existing Supabase row to preserve prior opt-in & load cloud snapshot
    const existingRes = await supabaseRequest(
      `vocanova_users?google_sub=eq.${encodeURIComponent(sub)}&select=marketing_opt_in,marketing_opt_in_at,fsrs_json,progress_json,anki_decks_json,updated_at`,
      { method: 'GET' }
    );

    if (!existingRes.notConfigured && existingRes.ok && Array.isArray(existingRes.data) && existingRes.data.length > 0) {
      const existingRow = existingRes.data[0];
      if (!requestedOptIn && existingRow.marketing_opt_in) {
        finalMarketingOptIn = true;
      }
      cloudSnapshot = {
        fsrsCards: existingRow.fsrs_json || {},
        progress: existingRow.progress_json || {},
        ankiDecks: Array.isArray(existingRow.anki_decks_json) ? existingRow.anki_decks_json : [],
        updatedAt: existingRow.updated_at || nowIso
      };
    }

    // Upsert user in Supabase EU table (if configured)
    const upsertBody = {
      google_sub: sub,
      email,
      display_name: name,
      avatar_url: picture,
      marketing_opt_in: finalMarketingOptIn,
      last_login_at: nowIso,
      updated_at: nowIso
    };
    if (finalMarketingOptIn) {
      upsertBody.marketing_opt_in_at = nowIso;
    }

    const upsertRes = await supabaseRequest(
      'vocanova_users?on_conflict=google_sub',
      {
        method: 'POST',
        prefer: 'resolution=merge-duplicates,return=representation',
        body: upsertBody
      }
    );

    if (!upsertRes.notConfigured && !upsertRes.ok) {
      return res.status(502).json({
        error: 'CLOUD_DB_UPSERT_FAILED',
        details: upsertRes.data
      });
    }

    const sessionUser = {
      sub,
      email,
      name,
      picture,
      marketingOptIn: finalMarketingOptIn,
      cloudSynced: !upsertRes.notConfigured
    };

    const token = createSessionToken(sessionUser);
    if (token) {
      setSessionCookie(req, res, token);
    }

    return res.status(200).json({
      ok: true,
      user: sessionUser,
      cloudSnapshot
    });
  } catch (err) {
    return res.status(500).json({
      error: 'GOOGLE_AUTH_SERVER_ERROR',
      message: err && err.message ? err.message : 'Unexpected server error'
    });
  }
};
