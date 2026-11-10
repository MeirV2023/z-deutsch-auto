/**
 * Vercel Serverless Function: Gemini 3.8 TTS Proxy & Edge Cache
 * Models supported:
 *  - gemini-3.8-flash-tts (flagship studio quality, expressive German diction)
 *  - gemini-3.8-flash-lite-tts (ultra-fast, low-latency single-speaker TTS)
 *
 * Uses the official Gemini Interactions API:
 *   POST https://generativelanguage.googleapis.com/v1beta/interactions
 *
 * Returns complete WAV audio (audio/wav, 24kHz, 16-bit mono PCM with RIFF header).
 */

const ALLOWED_MODELS = new Set([
  'gemini-3.8-flash-tts',
  'gemini-3.8-flash-lite-tts'
]);

const ALLOWED_VOICES = new Set([
  'Kore',
  'Puck',
  'Charon',
  'Zephyr',
  'Aoede',
  'Fenrir',
  'Leda',
  'Orus',
  'Callirrhoe',
  'Autonoe',
  'Enceladus',
  'Iapetus',
  'Umbriel',
  'Algieba',
  'Despina',
  'Erinome',
  'Algenib',
  'Rasalgethi',
  'Laomedeia',
  'Achernar',
  'Alnilam',
  'Schedar',
  'Gacrux',
  'Pulcherrima',
  'Achird',
  'Zubenelgenubi',
  'Vindemiatrix',
  'Sadachbia',
  'Sadaltager',
  'Sulafat'
]);

function extractAudioFromInteraction(data) {
  if (!data || typeof data !== 'object') return null;

  // 1. Standard Interactions REST format: steps[] -> model_output -> content[] -> audio
  if (Array.isArray(data.steps)) {
    for (let i = data.steps.length - 1; i >= 0; i--) {
      const step = data.steps[i];
      if (step && step.type === 'model_output' && Array.isArray(step.content)) {
        for (let j = step.content.length - 1; j >= 0; j--) {
          const part = step.content[j];
          if (part && part.type === 'audio' && part.data) {
            return {
              base64: part.data,
              mimeType: part.mime_type || 'audio/wav'
            };
          }
        }
      }
    }
  }

  // 2. Fallback check if convenience fields exist
  if (data.output_audio && data.output_audio.data) {
    return {
      base64: data.output_audio.data,
      mimeType: data.output_audio.mime_type || 'audio/wav'
    };
  }

  if (Array.isArray(data.outputs)) {
    for (let i = data.outputs.length - 1; i >= 0; i--) {
      const out = data.outputs[i];
      if (out && out.type === 'audio' && out.data) {
        return {
          base64: out.data,
          mimeType: out.mime_type || 'audio/wav'
        };
      }
    }
  }

  return null;
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-api-key');
    return res.status(204).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const query = req.query || {};
  const body = (req.method === 'POST' && req.body && typeof req.body === 'object') ? req.body : {};

  const rawText = String(body.text || query.text || '').trim();
  if (!rawText || rawText.length > 220) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(400).json({ error: 'INVALID_TEXT' });
  }

  const requestedModel = String(body.model || query.model || 'gemini-3.8-flash-tts').trim();
  const model = ALLOWED_MODELS.has(requestedModel) ? requestedModel : 'gemini-3.8-flash-tts';

  const requestedVoice = String(body.voice || query.voice || 'Kore').trim();
  const voice = ALLOWED_VOICES.has(requestedVoice) ? requestedVoice : 'Kore';

  const headerKey = req.headers['x-gemini-api-key']
    ? String(req.headers['x-gemini-api-key']).trim()
    : '';
  const serverKey = process.env.GEMINI_API_KEY ? String(process.env.GEMINI_API_KEY).trim() : '';
  const apiKey = headerKey || serverKey;

  if (!apiKey) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({
      error: 'MISSING_API_KEY',
      message: 'Set GEMINI_API_KEY in Vercel Environment Variables or enter a key in Voice Settings.'
    });
  }

  try {
    const upstreamRes = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        store: false,
        input: [{
          type: 'user_input',
          content: [{
            type: 'text',
            text: rawText,
            annotations: [{
              type: 'speech_metadata',
              style: 'clear, natural Standard German pronunciation, crisp diction, warm studio voice'
            }]
          }]
        }],
        response_format: {
          type: 'audio'
        },
        generation_config: {
          speech_config: [
            { voice }
          ]
        }
      })
    });

    if (!upstreamRes.ok) {
      const errText = await upstreamRes.text();
      res.setHeader('Cache-Control', 'no-store');
      return res.status(upstreamRes.status).json({
        error: 'GEMINI_UPSTREAM_ERROR',
        status: upstreamRes.status,
        detail: errText.slice(0, 400)
      });
    }

    const data = await upstreamRes.json();
    const audio = extractAudioFromInteraction(data);

    if (!audio || !audio.base64) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(502).json({ error: 'EMPTY_AUDIO_RESPONSE' });
    }

    const audioBuffer = Buffer.from(audio.base64, 'base64');

    // Only cache globally on Vercel CDN when using the server-configured GEMINI_API_KEY via GET
    if (req.method === 'GET' && !headerKey && serverKey) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400, immutable');
    } else {
      res.setHeader('Cache-Control', 'private, max-age=86400');
    }

    res.setHeader('Content-Type', audio.mimeType || 'audio/wav');
    res.setHeader('Content-Length', String(audioBuffer.length));
    return res.status(200).send(audioBuffer);
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(500).json({
      error: 'INTERNAL_TTS_ERROR',
      message: err && err.message ? err.message : 'Unknown error'
    });
  }
};
