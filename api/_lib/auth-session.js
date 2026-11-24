/**
 * Shared Signed Session & Supabase REST Utilities for VOCANOVA Auth API (SRP)
 * Uses built-in Node `crypto` + global `fetch` (zero npm dependencies).
 */

const crypto = require('crypto');

const SESSION_COOKIE_NAME = 'vocanova_session';
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days

function getGoogleClientId() {
  return process.env.GOOGLE_CLIENT_ID ? String(process.env.GOOGLE_CLIENT_ID).trim() : '';
}

function getSupabaseConfig() {
  const rawUrl = process.env.SUPABASE_URL ? String(process.env.SUPABASE_URL).trim() : '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? String(process.env.SUPABASE_SERVICE_ROLE_KEY).trim()
    : '';
  return {
    configured: Boolean(rawUrl && serviceKey),
    url: rawUrl.replace(/\/+$/, ''),
    serviceKey
  };
}

function getSessionSecret() {
  const explicit = process.env.AUTH_SESSION_SECRET ? String(process.env.AUTH_SESSION_SECRET).trim() : '';
  if (explicit) return explicit;
  const fallbackSeed = `${getGoogleClientId()}::${getSupabaseConfig().serviceKey}`;
  if (!fallbackSeed || fallbackSeed === '::') return '';
  return crypto.createHash('sha256').update(fallbackSeed).digest('hex');
}

function toBase64Url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function fromBase64Url(str) {
  const padded = String(str || '').replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (padded.length % 4)) % 4;
  return Buffer.from(padded + '='.repeat(padLen), 'base64');
}

function signPayload(payloadB64, secret) {
  return toBase64Url(crypto.createHmac('sha256', secret).update(payloadB64).digest());
}

function createSessionToken(userObj) {
  const secret = getSessionSecret();
  if (!secret || !userObj || !userObj.sub || !userObj.email) return '';
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC;
  const payload = {
    sub: String(userObj.sub),
    email: String(userObj.email),
    name: String(userObj.name || ''),
    picture: String(userObj.picture || ''),
    marketingOptIn: Boolean(userObj.marketingOptIn),
    exp
  };
  const payloadB64 = toBase64Url(JSON.stringify(payload));
  const sig = signPayload(payloadB64, secret);
  return `${payloadB64}.${sig}`;
}

function verifySessionToken(token) {
  const secret = getSessionSecret();
  if (!secret || !token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  const expectedSig = signPayload(payloadB64, secret);
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }
  try {
    const parsed = JSON.parse(fromBase64Url(payloadB64).toString('utf-8'));
    if (!parsed || !parsed.sub || !parsed.email) return null;
    if (parsed.exp && Math.floor(Date.now() / 1000) > Number(parsed.exp)) return null;
    return parsed;
  } catch (_) {
    return null;
  }
}

function parseCookies(req) {
  const out = Object.create(null);
  const header = req && req.headers ? req.headers.cookie : '';
  if (!header || typeof header !== 'string') return out;
  for (const part of header.split(';')) {
    const eqIdx = part.indexOf('=');
    if (eqIdx === -1) continue;
    const k = part.slice(0, eqIdx).trim();
    const v = part.slice(eqIdx + 1).trim();
    if (k) {
      try {
        out[k] = decodeURIComponent(v);
      } catch (_) {
        out[k] = v;
      }
    }
  }
  return out;
}

function getSessionFromRequest(req) {
  const cookies = parseCookies(req);
  const token = cookies[SESSION_COOKIE_NAME];
  return verifySessionToken(token);
}

function isHttpsRequest(req) {
  const proto = req && req.headers ? String(req.headers['x-forwarded-proto'] || '') : '';
  return proto.toLowerCase().includes('https');
}

function setSessionCookie(req, res, token) {
  const securePart = isHttpsRequest(req) ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SEC}${securePart}`
  );
}

function clearSessionCookie(req, res) {
  const securePart = isHttpsRequest(req) ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${securePart}`
  );
}

async function supabaseRequest(path, { method = 'GET', body, prefer = '' } = {}) {
  const cfg = getSupabaseConfig();
  if (!cfg.configured) {
    return { ok: false, notConfigured: true, status: 503, data: null };
  }
  const headers = {
    apikey: cfg.serviceKey,
    Authorization: `Bearer ${cfg.serviceKey}`,
    'Content-Type': 'application/json'
  };
  if (prefer) {
    headers.Prefer = prefer;
  }

  const resp = await fetch(`${cfg.url}/rest/v1/${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  let data = null;
  const text = await resp.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (_) {
      data = text;
    }
  }
  return { ok: resp.ok, status: resp.status, data };
}

module.exports = {
  SESSION_COOKIE_NAME,
  createSessionToken,
  verifySessionToken,
  parseCookies,
  getSessionFromRequest,
  setSessionCookie,
  clearSessionCookie,
  getGoogleClientId,
  getSupabaseConfig,
  supabaseRequest
};
