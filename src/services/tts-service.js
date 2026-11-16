// Сервис студийной озвучки Gemini 3.8 TTS + кэш IndexedDB + системный синтез речи (SRP / DIP)
import { bus } from '../core/events.js';
import { KEY_STORAGE_NAME, loadSavedSettings, saveSettingsPatch } from '../core/storage.js';
import { GEMINI_VOICES, TARGET_LANG_META } from '../config/constants.js';
import { sound } from './sound-engine.js';

export class GeminiTTSManager {
  constructor(soundEngine) {
    this.soundEngine = soundEngine;
    this.enabled = true;
    this.model = 'gemini-3.8-flash-tts';
    this.voice = 'Kore';
    this.localApiKey = '';
    this.serverAvailable = null;

    this.memoryBufferCache = new Map();
    this.inflightPromises = new Map();
    this.prefetchQueue = [];
    this.activePrefetches = 0;
    this.currentSource = null;
    this.dbPromise = null;

    this._loadConfig();
  }

  _loadConfig() {
    const saved = loadSavedSettings();
    if (typeof saved.ttsEnabled === 'boolean') this.enabled = saved.ttsEnabled;
    if (saved.ttsModel === 'gemini-3.8-flash-tts' || saved.ttsModel === 'gemini-3.8-flash-lite-tts') {
      this.model = saved.ttsModel;
    }
    if (saved.ttsVoice && GEMINI_VOICES.some(v => v.id === saved.ttsVoice)) {
      this.voice = saved.ttsVoice;
    }
    try {
      this.localApiKey = (localStorage.getItem(KEY_STORAGE_NAME) || '').trim();
    } catch (_) {
      this.localApiKey = '';
    }
  }

  saveConfig() {
    saveSettingsPatch({
      ttsEnabled: this.enabled,
      ttsModel: this.model,
      ttsVoice: this.voice
    });
  }

  setLocalApiKey(keyStr) {
    this.localApiKey = (keyStr || '').trim();
    try {
      if (this.localApiKey) {
        localStorage.setItem(KEY_STORAGE_NAME, this.localApiKey);
      } else {
        localStorage.removeItem(KEY_STORAGE_NAME);
      }
    } catch (_) {}
  }

  canAttemptGemini() {
    if (this.localApiKey) return true;
    const isHttp = location.protocol === 'http:' || location.protocol === 'https:';
    return isHttp && this.serverAvailable !== false;
  }

  _cacheKey(text, lang) {
    return `${this.model}|${this.voice}|${lang || 'de'}|${text.trim()}`;
  }

  _openDb() {
    if (this.dbPromise) return this.dbPromise;
    if (!('indexedDB' in window)) return Promise.resolve(null);

    this.dbPromise = new Promise((resolve) => {
      try {
        const req = indexedDB.open('zdeutsch_gemini_tts_v1', 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains('wavs')) {
            db.createObjectStore('wavs');
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch (_) {
        resolve(null);
      }
    });
    return this.dbPromise;
  }

  async _readFromIdb(key) {
    const db = await this._openDb();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction('wavs', 'readonly');
        const req = tx.objectStore('wavs').get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (_) {
        resolve(null);
      }
    });
  }

  async _writeToIdb(key, arrayBuffer) {
    const db = await this._openDb();
    if (!db) return;
    try {
      const tx = db.transaction('wavs', 'readwrite');
      tx.objectStore('wavs').put(arrayBuffer, key);
    } catch (_) {}
  }

  _extractBase64Audio(data) {
    if (!data || typeof data !== 'object') return null;
    if (Array.isArray(data.steps)) {
      for (let i = data.steps.length - 1; i >= 0; i--) {
        const step = data.steps[i];
        if (step && step.type === 'model_output' && Array.isArray(step.content)) {
          for (let j = step.content.length - 1; j >= 0; j--) {
            const part = step.content[j];
            if (part && part.type === 'audio' && part.data) {
              return part.data;
            }
          }
        }
      }
    }
    if (data.output_audio && data.output_audio.data) return data.output_audio.data;
    return null;
  }

  _base64ToArrayBuffer(b64) {
    const binary = atob(b64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async _fetchWavArrayBuffer(cleanText, lang = 'de') {
    const meta = TARGET_LANG_META[lang] || TARGET_LANG_META.de;

    if (this.localApiKey) {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
        method: 'POST',
        headers: {
          'x-goog-api-key': this.localApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          store: false,
          input: [{
            type: 'user_input',
            content: [{
              type: 'text',
              text: cleanText,
              annotations: [{
                type: 'speech_metadata',
                style: meta.speechStyle
              }]
            }]
          }],
          response_format: { type: 'audio' },
          generation_config: {
            speech_config: [{ voice: this.voice }]
          }
        })
      });

      if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
      const json = await res.json();
      const b64 = this._extractBase64Audio(json);
      if (!b64) throw new Error('No audio data in Gemini response');
      return this._base64ToArrayBuffer(b64);
    }

    const isHttp = location.protocol === 'http:' || location.protocol === 'https:';
    if (isHttp && this.serverAvailable !== false) {
      const params = new URLSearchParams({
        text: cleanText,
        voice: this.voice,
        model: this.model,
        lang
      });
      const res = await fetch(`/api/tts?${params.toString()}`, { method: 'GET' });
      if (res.status === 503 || res.status === 404) {
        this.serverAvailable = false;
        bus.emit('tts:status');
        return null;
      }
      if (!res.ok) throw new Error(`Server TTS HTTP ${res.status}`);
      this.serverAvailable = true;
      bus.emit('tts:status');
      return await res.arrayBuffer();
    }

    return null;
  }

  async getOrFetchAudioBuffer(text, lang = 'de') {
    const cleanText = String(text || '').trim();
    if (!cleanText) return null;

    const key = this._cacheKey(cleanText, lang);
    if (this.memoryBufferCache.has(key)) {
      return this.memoryBufferCache.get(key);
    }
    if (this.inflightPromises.has(key)) {
      return this.inflightPromises.get(key);
    }

    const promise = (async () => {
      try {
        const audioCtx = this.soundEngine.init();
        if (!audioCtx) return null;

        let wavBytes = await this._readFromIdb(key);
        if (!wavBytes) {
          if (!this.canAttemptGemini()) return null;
          wavBytes = await this._fetchWavArrayBuffer(cleanText, lang);
          if (!wavBytes) return null;
          this._writeToIdb(key, wavBytes.slice(0));
        }

        const decoded = await audioCtx.decodeAudioData(wavBytes.slice(0));
        this.memoryBufferCache.set(key, decoded);
        return decoded;
      } catch (_) {
        return null;
      } finally {
        this.inflightPromises.delete(key);
      }
    })();

    this.inflightPromises.set(key, promise);
    return promise;
  }

  prefetch(text, lang = 'de') {
    if (!this.enabled || !this.canAttemptGemini()) return;
    const cleanText = String(text || '').trim();
    if (!cleanText) return;
    const key = this._cacheKey(cleanText, lang);
    if (this.memoryBufferCache.has(key) || this.inflightPromises.has(key)) return;
    if (this.prefetchQueue.some(q => q.text === cleanText && q.lang === lang)) return;

    this.prefetchQueue.push({ text: cleanText, lang });
    this._drainPrefetchQueue();
  }

  _drainPrefetchQueue() {
    while (this.activePrefetches < 2 && this.prefetchQueue.length > 0) {
      const nextItem = this.prefetchQueue.shift();
      this.activePrefetches++;
      this.getOrFetchAudioBuffer(nextItem.text, nextItem.lang).finally(() => {
        this.activePrefetches--;
        this._drainPrefetchQueue();
      });
    }
  }

  async speak(text, lang = 'de', forceSpeak = false) {
    if (!this.enabled && !forceSpeak) return false;
    const cleanText = String(text || '').trim();
    if (!cleanText) return false;

    if (this.canAttemptGemini()) {
      const buffer = await this.getOrFetchAudioBuffer(cleanText, lang);
      if (buffer) {
        this._playDecodedBuffer(buffer);
        return true;
      }
    }

    this._speakBrowserFallback(cleanText, lang);
    return false;
  }

  _playDecodedBuffer(audioBuffer) {
    const audioCtx = this.soundEngine.init();
    if (!audioCtx) return;

    if (this.currentSource) {
      try { this.currentSource.stop(); } catch (_) {}
      this.currentSource = null;
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (_) {}
    }

    const src = audioCtx.createBufferSource();
    src.buffer = audioBuffer;
    const gain = audioCtx.createGain();
    gain.gain.value = 1.05;
    src.connect(gain);
    gain.connect(audioCtx.destination);
    src.start(0);
    this.currentSource = src;
  }

  _speakBrowserFallback(text, lang = 'de') {
    if (!('speechSynthesis' in window)) return;
    try {
      const meta = TARGET_LANG_META[lang] || TARGET_LANG_META.de;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = meta.bcp47;
      utter.rate = 0.96;
      utter.volume = 0.95;
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(lang));
      if (matchedVoice) utter.voice = matchedVoice;
      window.speechSynthesis.speak(utter);
    } catch (_) {}
  }
}

export const ttsManager = new GeminiTTSManager(sound);
