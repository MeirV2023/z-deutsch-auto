/**
 * Vercel Serverless Function: Super-Admin AI Course & Vocabulary Translator
 * Models: gemini-3.8-flash, gemini-3.5-flash-lite (Structured Output JSON Schema)
 */

const {
  handleOptionsCors,
  setNoStore,
  resolveGeminiApiKey,
  getJsonBody
} = require('./_lib/http');
const {
  extractTextFromInteraction,
  postGeminiInteraction
} = require('./_lib/gemini');

const ALLOWED_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.5-flash-lite'
];

const LANG_NAMES = {
  de: 'German',
  en: 'English',
  es: 'Spanish',
  ru: 'Russian',
  uk: 'Ukrainian',
  tr: 'Turkish',
  he: 'Hebrew',
  ar: 'Arabic'
};

const LOCALIZED_STRINGS_SCHEMA = {
  type: 'object',
  properties: {
    ru: { type: 'string' },
    en: { type: 'string' },
    de: { type: 'string' },
    es: { type: 'string' },
    uk: { type: 'string' },
    tr: { type: 'string' },
    he: { type: 'string' },
    ar: { type: 'string' }
  },
  required: ['ru', 'en', 'de', 'es', 'uk', 'tr', 'he', 'ar']
};

async function callGeminiStructuredJson(apiKey, promptText, jsonSchema) {
  let lastErr = null;

  for (const model of ALLOWED_MODELS) {
    const res = await postGeminiInteraction(apiKey, {
      model,
      store: false,
      input: [{
        type: 'user_input',
        content: [{ type: 'text', text: promptText }]
      }],
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: jsonSchema
      }
    });

    if (res.ok) {
      const data = await res.json();
      const text = extractTextFromInteraction(data);
      if (text) {
        return { parsed: JSON.parse(text), model };
      }
    } else {
      const errBody = await res.text();
      lastErr = { status: res.status, detail: errBody.slice(0, 400) };
      if (res.status === 401 || res.status === 403) break;
    }
  }

  const err = new Error(lastErr ? `Gemini HTTP ${lastErr.status}: ${lastErr.detail}` : 'Empty Gemini response');
  err.status = (lastErr && lastErr.status) || 502;
  throw err;
}

module.exports = async function handler(req, res) {
  setNoStore(res);

  if (handleOptionsCors(req, res, 'POST, OPTIONS', 'Content-Type, x-gemini-api-key')) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const { apiKey } = resolveGeminiApiKey(req);
  if (!apiKey) {
    return res.status(503).json({
      error: 'MISSING_API_KEY',
      message: 'Добавьте GEMINI_API_KEY в настройки Vercel или укажите ключ Gemini в панели Супер-Админа.'
    });
  }

  const body = getJsonBody(req);
  const mode = String(body.mode || 'enrich_ui_langs');
  const rawItems = Array.isArray(body.items) ? body.items.slice(0, 60) : [];

  if (rawItems.length === 0) {
    return res.status(400).json({ error: 'EMPTY_ITEMS' });
  }

  try {
    if (mode === 'clone_target_course') {
      const fromLang = String(body.fromLang || 'de').toLowerCase();
      const toLang = String(body.toLang || 'en').toLowerCase();
      const courseTitle = String(body.courseTitle || 'Course').trim();
      const levelTag = String(body.levelTag || 'B1').trim();

      const articleRule = toLang === 'de'
        ? 'For German nouns include definite article before the noun ("der Plan", "die Branche", "das Ziel"); for reflexive verbs include "sich ". Keep expressions concise (1-4 words).'
        : (toLang === 'es'
          ? 'For Spanish nouns include article ("el plan", "la empresa"); for verbs use infinitive ("invertir"). Keep expressions concise (1-4 words).'
          : 'For English verbs start with "to " ("to invest"); for nouns/adjectives give clean base form ("business plan", "worthwhile"). Keep expressions concise (1-4 words).');

      const promptText = [
        `You are an expert multilingual curriculum designer for a fast-paced arcade language typing game (CEFR level ${levelTag}).`,
        `Convert the following ${LANG_NAMES[fromLang] || fromLang} course "${courseTitle}" into natural ${LANG_NAMES[toLang] || toLang} target vocabulary.`,
        articleRule,
        'Also provide concise, accurate translations in Russian (ru), English (en), German (de), Spanish (es), Ukrainian (uk), Turkish (tr), Hebrew (he, no nikud), and Arabic (ar, no tashkeel).',
        'Input items JSON:',
        JSON.stringify(rawItems)
      ].join('\n');

      const schema = {
        type: 'object',
        properties: {
          courseTitles: LOCALIZED_STRINGS_SCHEMA,
          courseDescs: LOCALIZED_STRINGS_SCHEMA,
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                idx: { type: 'integer' },
                front: { type: 'string' },
                ru: { type: 'string' },
                en: { type: 'string' },
                de: { type: 'string' },
                es: { type: 'string' },
                uk: { type: 'string' },
                tr: { type: 'string' },
                he: { type: 'string' },
                ar: { type: 'string' }
              },
              required: ['idx', 'front', 'ru', 'en', 'de', 'es', 'uk', 'tr', 'he', 'ar']
            }
          }
        },
        required: ['courseTitles', 'courseDescs', 'items']
      };

      const { parsed, model } = await callGeminiStructuredJson(apiKey, promptText, schema);
      return res.status(200).json({ ok: true, model, result: parsed });
    }

    const targetLang = String(body.targetLang || 'de').toLowerCase();
    const inputTransLang = String(body.inputTransLang || 'ru').toLowerCase();
    const courseTitle = String(body.courseTitle || 'Новый курс').trim();
    const levelTag = String(body.levelTag || 'B1').trim();

    const promptText = [
      `You are a precise multilingual lexicographer for a language-learning game (CEFR ${levelTag}).`,
      `Target language being learned: ${LANG_NAMES[targetLang] || targetLang}.`,
      `Author's provided translation language: ${LANG_NAMES[inputTransLang] || inputTransLang}.`,
      `Course title: "${courseTitle}".`,
      'Task:',
      '1) Localize the course title and a 1-sentence course description into ru, en, de, es, uk, tr, he, ar.',
      `2) For each item, keep the author's ${inputTransLang} translation accurate and natural, and translate the exact meaning of the ${LANG_NAMES[targetLang] || targetLang} expression into all UI languages (ru, en, de, es, uk, tr, he without nikud, ar without tashkeel — concise 1-5 words).`,
      'Input items JSON:',
      JSON.stringify(rawItems)
    ].join('\n');

    const schema = {
      type: 'object',
      properties: {
        courseTitles: LOCALIZED_STRINGS_SCHEMA,
        courseDescs: LOCALIZED_STRINGS_SCHEMA,
        translations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              idx: { type: 'integer' },
              ru: { type: 'string' },
              en: { type: 'string' },
              de: { type: 'string' },
              es: { type: 'string' },
              uk: { type: 'string' },
              tr: { type: 'string' },
              he: { type: 'string' },
              ar: { type: 'string' }
            },
            required: ['idx', 'ru', 'en', 'de', 'es', 'uk', 'tr', 'he', 'ar']
          }
        }
      },
      required: ['courseTitles', 'courseDescs', 'translations']
    };

    const { parsed, model } = await callGeminiStructuredJson(apiKey, promptText, schema);
    return res.status(200).json({ ok: true, model, result: parsed });
  } catch (err) {
    return res.status(err.status || 500).json({
      error: 'TRANSLATION_FAILED',
      message: err && err.message ? err.message : 'Ошибка AI-перевода'
    });
  }
};
