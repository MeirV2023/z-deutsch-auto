/**
 * Vercel Serverless Function: Public Runtime Auth Configuration & Session Check
 * GET /api/auth-config
 */

const { handleOptionsCors, setNoStore } = require('./_lib/http');
const {
  getGoogleClientId,
  getSupabaseConfig,
  getSessionFromRequest
} = require('./_lib/auth-session');

module.exports = async function handler(req, res) {
  setNoStore(res);

  if (handleOptionsCors(req, res, 'GET, OPTIONS', 'Content-Type')) {
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const googleClientId = getGoogleClientId();
  const supabase = getSupabaseConfig();
  const session = getSessionFromRequest(req);

  return res.status(200).json({
    ok: true,
    googleConfigured: Boolean(googleClientId),
    googleClientId,
    cloudDbConfigured: supabase.configured,
    sessionUser: session
      ? {
          sub: session.sub,
          email: session.email,
          name: session.name,
          picture: session.picture,
          marketingOptIn: Boolean(session.marketingOptIn)
        }
      : null
  });
};
