// ============================================================================
// Сервис добровольной авторизации через Google (Gmail) и облачной синхронизации
// Лениво загружает Google Identity Services ТОЛЬКО при открытии страницы аккаунта
// и взаимодействует с /api/auth-config, /api/auth-google и /api/user-sync (SRP)
// ============================================================================

import { bus } from '../core/events.js';
import {
  AUTH_PROFILE_KEY,
  COOKIE_CONSENT_KEY,
  getLocalIsoDateString,
  loadJsonStorage,
  loadSavedSettings,
  saveJsonStorage
} from '../core/storage.js';
import { AnkiImporter } from '../anki/index.js';
import {
  getAllFsrsCardsObject,
  mergeFsrsCardsFromCloud
} from '../domain/fsrs-service.js';
import {
  dailyProgress,
  learnedWordsSet,
  mergeLocalProgressFromCloud,
  pinnedWordsMap,
  state
} from '../state/store.js';

const MAX_SYNC_PAYLOAD_BYTES = 3200000;

let _runtimeConfig = {
  loaded: false,
  googleConfigured: false,
  googleClientId: '',
  cloudDbConfigured: false,
  sessionUser: null,
  staticLocalFallback: false
};
let _gsiScriptPromise = null;
let _syncDebounceTimer = null;
let _gisInitializedClientId = '';

export function getAuthRuntimeConfig() {
  return _runtimeConfig;
}

function saveAuthProfileLocal(profileObj) {
  state.authUser = profileObj || null;
  if (profileObj) {
    saveJsonStorage(AUTH_PROFILE_KEY, profileObj);
  } else {
    try {
      localStorage.removeItem(AUTH_PROFILE_KEY);
    } catch (_) {}
  }
}

export async function fetchAuthRuntimeConfig() {
  try {
    const resp = await fetch('/api/auth-config', {
      method: 'GET',
      credentials: 'same-origin'
    });
    if (!resp.ok) {
      _runtimeConfig = {
        ..._runtimeConfig,
        loaded: true,
        staticLocalFallback: true
      };
      return _runtimeConfig;
    }
    const data = await resp.json();
    _runtimeConfig = {
      loaded: true,
      googleConfigured: Boolean(data && data.googleConfigured),
      googleClientId: (data && data.googleClientId) || '',
      cloudDbConfigured: Boolean(data && data.cloudDbConfigured),
      sessionUser: (data && data.sessionUser) || null,
      staticLocalFallback: false
    };

    if (_runtimeConfig.sessionUser) {
      const mergedProfile = {
        ...(state.authUser || {}),
        ..._runtimeConfig.sessionUser
      };
      saveAuthProfileLocal(mergedProfile);
    }
  } catch (_) {
    _runtimeConfig = {
      ..._runtimeConfig,
      loaded: true,
      staticLocalFallback: true
    };
  }
  return _runtimeConfig;
}

export function loadGoogleIdentityScript() {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.google && window.google.accounts && window.google.accounts.id) {
    return Promise.resolve(true);
  }
  if (_gsiScriptPromise) return _gsiScriptPromise;

  _gsiScriptPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[data-vocanova-gsi="1"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(Boolean(window.google && window.google.accounts)));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.vocanovaGsi = '1';
    script.onload = () => resolve(Boolean(window.google && window.google.accounts));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return _gsiScriptPromise;
}

export async function mountGoogleSignInButton(containerEl, { getMarketingOptIn, onSuccess, onError } = {}) {
  if (!containerEl) return false;
  const cfg = _runtimeConfig.loaded ? _runtimeConfig : await fetchAuthRuntimeConfig();
  if (!cfg.googleConfigured || !cfg.googleClientId) return false;

  const ready = await loadGoogleIdentityScript();
  if (!ready || !window.google || !window.google.accounts || !window.google.accounts.id) {
    if (onError) onError('GOOGLE_GSI_LOAD_FAILED');
    return false;
  }

  try {
    if (_gisInitializedClientId !== cfg.googleClientId || !window._vocanovaGsiCallbackSet) {
      window.google.accounts.id.initialize({
        client_id: cfg.googleClientId,
        callback: async (response) => {
          try {
            const optIn = typeof getMarketingOptIn === 'function' ? Boolean(getMarketingOptIn()) : false;
            const res = await completeGoogleSignIn(response && response.credential, optIn);
            if (res && res.ok) {
              if (onSuccess) onSuccess(res.user);
            } else if (onError) {
              onError((res && res.error) || 'GOOGLE_LOGIN_FAILED');
            }
          } catch (err) {
            if (onError) onError((err && err.message) || 'GOOGLE_LOGIN_FAILED');
          }
        },
        auto_select: false
      });
      _gisInitializedClientId = cfg.googleClientId;
      window._vocanovaGsiCallbackSet = true;
    }

    containerEl.innerHTML = '';
    window.google.accounts.id.renderButton(containerEl, {
      theme: 'filled_blue',
      size: 'large',
      type: 'standard',
      shape: 'pill',
      text: 'continue_with',
      logo_alignment: 'left',
      width: Math.min(340, Math.max(240, containerEl.clientWidth || 320))
    });
    return true;
  } catch (err) {
    if (onError) onError((err && err.message) || 'GOOGLE_BUTTON_RENDER_FAILED');
    return false;
  }
}

async function mergeCloudSnapshotIntoLocal(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return;
  if (snapshot.fsrsCards) {
    mergeFsrsCardsFromCloud(snapshot.fsrsCards);
  }
  if (snapshot.progress) {
    mergeLocalProgressFromCloud(snapshot.progress);
  }
  if (Array.isArray(snapshot.ankiDecks) && snapshot.ankiDecks.length > 0 && AnkiImporter) {
    const existingIds = new Set((state.userCourses || []).map(c => c.id));
    let importedAny = false;
    for (const remoteDeck of snapshot.ankiDecks) {
      if (remoteDeck && remoteDeck.id && !existingIds.has(remoteDeck.id)) {
        try {
          await AnkiImporter.saveUserCourse(remoteDeck);
          importedAny = true;
        } catch (_) {}
      }
    }
    if (importedAny) {
      state.userCourses = await AnkiImporter.loadUserCourses();
    }
  }
}

export function buildLocalCloudSnapshot() {
  const settings = loadSavedSettings();
  const fsrsCards = getAllFsrsCardsObject();
  const progress = {
    settings,
    learnedWords: Array.from(learnedWordsSet),
    pinnedWords: Object.fromEntries(pinnedWordsMap.entries()),
    dailyProgress
  };

  let userDecks = Array.isArray(state.userCourses) ? state.userCourses.slice() : [];
  let payload = { fsrsCards, progress, ankiDecks: userDecks };
  // Guard JSON payload size well below Vercel 4.5MB body cap
  while (userDecks.length > 0 && JSON.stringify(payload).length > MAX_SYNC_PAYLOAD_BYTES) {
    userDecks = userDecks.slice(0, userDecks.length - 1);
    payload = { fsrsCards, progress, ankiDecks: userDecks };
  }
  return payload;
}

export async function completeGoogleSignIn(credential, marketingOptIn = false) {
  if (!credential) return { ok: false, error: 'MISSING_CREDENTIAL' };

  const resp = await fetch('/api/auth-google', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential, marketingOptIn: Boolean(marketingOptIn) })
  });

  const data = await resp.json().catch(() => ({}));
  if (!resp.ok || !data.ok || !data.user) {
    return { ok: false, error: data.error || 'AUTH_FAILED', message: data.message || '' };
  }

  const profile = {
    ...data.user,
    lastSyncedAt: ''
  };
  saveAuthProfileLocal(profile);

  if (data.cloudSnapshot) {
    await mergeCloudSnapshotIntoLocal(data.cloudSnapshot);
  }

  await syncAuthCloudNow({ silent: true, marketingOptIn: profile.marketingOptIn });
  bus.emit('auth:changed', { user: state.authUser });
  return { ok: true, user: state.authUser };
}

export async function syncAuthCloudNow({ silent = false, marketingOptIn } = {}) {
  if (!state.authUser) return { ok: false, error: 'NOT_SIGNED_IN' };

  const snapshot = buildLocalCloudSnapshot();
  const body = { ...snapshot };
  if (typeof marketingOptIn === 'boolean') {
    body.marketingOptIn = marketingOptIn;
  }

  try {
    const resp = await fetch('/api/user-sync', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (resp.status === 401) {
      return { ok: false, error: 'SESSION_EXPIRED' };
    }
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data.ok) {
      return { ok: false, error: data.error || 'SYNC_FAILED' };
    }

    const updatedProfile = {
      ...state.authUser,
      lastSyncedAt: data.updatedAt || new Date().toISOString(),
      ...(typeof marketingOptIn === 'boolean' ? { marketingOptIn } : {})
    };
    saveAuthProfileLocal(updatedProfile);
    if (!silent) {
      bus.emit('auth:changed', { user: state.authUser, synced: true });
    }
    return { ok: true, updatedAt: updatedProfile.lastSyncedAt };
  } catch (err) {
    return { ok: false, error: (err && err.message) || 'NETWORK_ERROR' };
  }
}

export function scheduleAuthCloudSync() {
  if (!state.authUser || !_runtimeConfig.cloudDbConfigured) return;
  if (_syncDebounceTimer) clearTimeout(_syncDebounceTimer);
  _syncDebounceTimer = setTimeout(() => {
    syncAuthCloudNow({ silent: true });
  }, 12000);
}

export async function updateAuthMarketingOptIn(enabled) {
  const nextVal = Boolean(enabled);
  if (state.authUser) {
    saveAuthProfileLocal({ ...state.authUser, marketingOptIn: nextVal });
    await syncAuthCloudNow({ silent: false, marketingOptIn: nextVal });
  }
  bus.emit('auth:changed', { user: state.authUser });
  return nextVal;
}

export async function signOutAuthUser() {
  try {
    await fetch('/api/auth-google', {
      method: 'DELETE',
      credentials: 'same-origin'
    });
  } catch (_) {}
  saveAuthProfileLocal(null);
  bus.emit('auth:changed', { user: null });
}

export async function deleteAuthAccount() {
  try {
    await fetch('/api/user-sync', {
      method: 'DELETE',
      credentials: 'same-origin'
    });
  } catch (_) {}
  saveAuthProfileLocal(null);
  bus.emit('auth:changed', { user: null, deleted: true });
}

export function exportUserDataJson() {
  const snapshot = buildLocalCloudSnapshot();
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    app: 'VOCANOVA',
    authProfile: state.authUser || null,
    cookieConsent: loadJsonStorage(COOKIE_CONSENT_KEY, null),
    ...snapshot
  };
  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vocanova-backup-${getLocalIsoDateString()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
