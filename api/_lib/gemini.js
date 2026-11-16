/**
 * Shared Gemini Interactions API Client & Response Extractors (SRP / DIP)
 * Endpoint: POST https://generativelanguage.googleapis.com/v1beta/interactions
 */

const GEMINI_INTERACTIONS_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions';

function extractTextFromInteraction(data) {
  if (!data || typeof data !== 'object') return '';

  if (Array.isArray(data.steps)) {
    for (let i = data.steps.length - 1; i >= 0; i--) {
      const step = data.steps[i];
      if (step && step.type === 'model_output' && Array.isArray(step.content)) {
        for (let j = step.content.length - 1; j >= 0; j--) {
          const part = step.content[j];
          if (part && part.type === 'text' && typeof part.text === 'string' && part.text.trim()) {
            return part.text.trim();
          }
        }
      }
    }
  }

  if (typeof data.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  if (Array.isArray(data.outputs)) {
    for (let i = data.outputs.length - 1; i >= 0; i--) {
      const out = data.outputs[i];
      if (out && out.type === 'text' && typeof out.text === 'string' && out.text.trim()) {
        return out.text.trim();
      }
    }
  }

  return '';
}

function extractAudioFromInteraction(data) {
  if (!data || typeof data !== 'object') return null;

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

async function postGeminiInteraction(apiKey, payload) {
  return fetch(GEMINI_INTERACTIONS_URL, {
    method: 'POST',
    headers: {
      'x-goog-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

module.exports = {
  GEMINI_INTERACTIONS_URL,
  extractTextFromInteraction,
  extractAudioFromInteraction,
  postGeminiInteraction
};
