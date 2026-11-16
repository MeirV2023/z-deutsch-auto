/**
 * Shared HTTP & Security Utilities for Z-LINGO Vercel Serverless Endpoints (SRP)
 */

function handleOptionsCors(req, res, allowedMethods, allowedHeaders) {
  if (req.method !== 'OPTIONS') return false;
  res.setHeader('Access-Control-Allow-Methods', allowedMethods);
  res.setHeader('Access-Control-Allow-Headers', allowedHeaders);
  res.status(204).end();
  return true;
}

function setNoStore(res) {
  res.setHeader('Cache-Control', 'no-store');
}

function getTrimmedHeader(req, headerName) {
  const val = req && req.headers ? req.headers[headerName.toLowerCase()] : '';
  return val ? String(val).trim() : '';
}

function resolveGeminiApiKey(req) {
  const headerKey = getTrimmedHeader(req, 'x-gemini-api-key');
  const serverKey = process.env.GEMINI_API_KEY ? String(process.env.GEMINI_API_KEY).trim() : '';
  return {
    apiKey: headerKey || serverKey,
    headerKey,
    serverKey
  };
}

function getJsonBody(req) {
  return (req && req.body && typeof req.body === 'object') ? req.body : {};
}

module.exports = {
  handleOptionsCors,
  setNoStore,
  getTrimmedHeader,
  resolveGeminiApiKey,
  getJsonBody
};
