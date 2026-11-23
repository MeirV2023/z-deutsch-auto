/**
 * Vercel Serverless Function: Gemini 3.8 TTS Proxy & Edge Cache
 * Models: gemini-3.8-flash-tts, gemini-3.8-flash-lite-tts
 */

const {
  handleOptionsCors,
  setNoStore,
  resolveGeminiApiKey,
  getJsonBody
} = require('./_lib/http');
const {
  extractAudioFromInteraction,
  postGeminiInteraction
} = require('./_lib/gemini');

const ALLOWED_MODELS = new Set([
  'gemini-3.8-flash-tts',
  'gemini-3.8-flash-lite-tts'
]);

const LANG_SPEECH_STYLE = {
  de: 'clear, natural Standard German pronunciation, crisp diction, warm studio voice',
  en: 'clear, natural Standard English pronunciation, crisp diction, warm studio voice',
  es: 'clear, natural Standard Spanish pronunciation, crisp diction, warm studio voice',
  ru: 'clear, natural Standard Russian pronunciation, crisp diction, warm studio voice',
  uk: 'clear, natural Standard Ukrainian pronunciation, crisp diction, warm studio voice',
  tr: 'clear, natural Standard Turkish pronunciation, crisp diction, warm studio voice',
  he: 'clear, natural Modern Israeli Hebrew pronunciation, crisp diction, warm studio voice',
  ar: 'clear, natural Modern Standard Arabic pronunciation, crisp diction, warm studio voice'
};

const ALLOWED_VOICES = new Set([
  'Kore', 'Puck', 'Charon', 'Zephyr', 'Aoede', 'Fenrir', 'Leda', 'Orus',
  'Callirrhoe', 'Autonoe', 'Enceladus', 'Iapetus', 'Umbriel', 'Algieba',
  'Despina', 'Erinome', 'Algenib', 'Rasalgethi', 'Laomedeia', 'Achernar',
  'Alnilam', 'Schedar', 'Gacrux', 'Pulcherrima', 'Achird', 'Zubenelgenubi',
  'Vindemiatrix', 'Sadachbia', 'Sadaltager', 'Sulafat'
]);

module.exports = async function handler(req, res) {
  if (handleOptionsCors(req, res, 'GET, POST, OPTIONS', 'Content-Type, x-gemini-api-key')) {
    return;
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    setNoStore(res);
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const query = req.query || {};
  const body = req.method === 'POST' ? getJsonBody(req) : {};

  const rawText = String(body.text || query.text || '').trim();
  if (!rawText || rawText.length > 220) {
    setNoStore(res);
    return res.status(400).json({ error: 'INVALID_TEXT' });
  }

  const requestedModel = String(body.model || query.model || 'gemini-3.8-flash-tts').trim();
  const model = ALLOWED_MODELS.has(requestedModel) ? requestedModel : 'gemini-3.8-flash-tts';

  const requestedVoice = String(body.voice || query.voice || 'Kore').trim();
  const voice = ALLOWED_VOICES.has(requestedVoice) ? requestedVoice : 'Kore';

  const requestedLang = String(body.lang || query.lang || 'de').trim().toLowerCase().slice(0, 2);
  const speechStyle = LANG_SPEECH_STYLE[requestedLang] || LANG_SPEECH_STYLE.de;

  const { apiKey, headerKey, serverKey } = resolveGeminiApiKey(req);
  if (!apiKey) {
    setNoStore(res);
    return res.status(503).json({
      error: 'MISSING_API_KEY',
      message: 'Set GEMINI_API_KEY in Vercel Environment Variables or enter a key in Voice Settings.'
    });
  }

  try {
    const upstreamRes = await postGeminiInteraction(apiKey, {
      model,
      store: false,
      input: [{
        type: 'user_input',
        content: [{
          type: 'text',
          text: rawText,
          annotations: [{
            type: 'speech_metadata',
            style: speechStyle
          }]
        }]
      }],
      response_format: { type: 'audio' },
      generation_config: {
        speech_config: [{ voice }]
      }
    });

    if (!upstreamRes.ok) {
      const errText = await upstreamRes.text();
      setNoStore(res);
      return res.status(upstreamRes.status).json({
        error: 'GEMINI_UPSTREAM_ERROR',
        status: upstreamRes.status,
        detail: errText.slice(0, 400)
      });
    }

    const data = await upstreamRes.json();
    const audio = extractAudioFromInteraction(data);

    if (!audio || !audio.base64) {
      setNoStore(res);
      return res.status(502).json({ error: 'EMPTY_AUDIO_RESPONSE' });
    }

    const audioBuffer = Buffer.from(audio.base64, 'base64');

    if (req.method === 'GET' && !headerKey && serverKey) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400, immutable');
    } else {
      res.setHeader('Cache-Control', 'private, max-age=86400');
    }

    res.setHeader('Content-Type', audio.mimeType || 'audio/wav');
    res.setHeader('Content-Length', String(audioBuffer.length));
    return res.status(200).send(audioBuffer);
  } catch (err) {
    setNoStore(res);
    return res.status(500).json({
      error: 'INTERNAL_TTS_ERROR',
      message: err && err.message ? err.message : 'Unknown error'
    });
  }
};
