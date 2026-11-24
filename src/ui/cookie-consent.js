// ============================================================================
// Контроллер согласия с Cookies и локальным хранилищем (ЕС / GDPR / ePrivacy)
// Управляет баннером при первом входе и модальным окном #cookiePrefsDialog.
// ============================================================================

import { actions } from '../core/events.js';
import {
  COOKIE_CONSENT_KEY,
  loadJsonStorage,
  saveJsonStorage
} from '../core/storage.js';
import { t } from '../state/store.js';
import {
  btnCloseCookiePrefs,
  btnCookieAcceptAll,
  btnCookieCustomize,
  btnCookieEssential,
  btnSaveCookiePrefs,
  chkCookieAnalytics,
  chkCookieFunctional,
  cookieBannerText,
  cookieBannerTitle,
  cookieCatAlwaysOn,
  cookieCatAnalyticsDesc,
  cookieCatAnalyticsTitle,
  cookieCatEssentialDesc,
  cookieCatEssentialTitle,
  cookieCatFuncDesc,
  cookieCatFuncTitle,
  cookieConsentBanner,
  cookiePrefsDialog,
  cookiePrefsIntro,
  cookiePrefsTitle,
  linkPrefsCookies,
  linkPrefsPrivacy,
  linkPrefsTerms
} from './dom.js';

const CONSENT_VERSION = 1;

export function getCookieConsentState() {
  const saved = loadJsonStorage(COOKIE_CONSENT_KEY, null);
  if (!saved || typeof saved !== 'object' || saved.version !== CONSENT_VERSION) {
    return null;
  }
  return {
    version: CONSENT_VERSION,
    essential: true,
    functional: saved.functional !== false,
    analytics: Boolean(saved.analytics),
    choice: typeof saved.choice === 'string' ? saved.choice : 'essential',
    updatedAt: typeof saved.updatedAt === 'string' ? saved.updatedAt : ''
  };
}

function saveCookieConsentChoice({ functional, analytics, choice }) {
  const payload = {
    version: CONSENT_VERSION,
    essential: true,
    functional: Boolean(functional),
    analytics: Boolean(analytics),
    choice: choice || 'custom',
    updatedAt: new Date().toISOString()
  };
  saveJsonStorage(COOKIE_CONSENT_KEY, payload);
  if (cookieConsentBanner) {
    cookieConsentBanner.classList.add('hidden');
  }
  return payload;
}

export function applyCookieConsentLocalization() {
  const tr = t();
  if (cookieBannerTitle && tr.cookieBannerTitle) cookieBannerTitle.textContent = tr.cookieBannerTitle;
  if (cookieBannerText && tr.cookieBannerText) cookieBannerText.textContent = tr.cookieBannerText;
  if (btnCookieEssential && tr.cookieBtnEssential) btnCookieEssential.textContent = tr.cookieBtnEssential;
  if (btnCookieAcceptAll && tr.cookieBtnAcceptAll) btnCookieAcceptAll.textContent = tr.cookieBtnAcceptAll;
  if (btnCookieCustomize && tr.cookieBtnCustomize) btnCookieCustomize.textContent = tr.cookieBtnCustomize;

  if (cookiePrefsTitle && tr.cookiePrefsTitle) cookiePrefsTitle.textContent = tr.cookiePrefsTitle;
  if (cookiePrefsIntro && tr.cookiePrefsIntro) cookiePrefsIntro.textContent = tr.cookiePrefsIntro;
  if (cookieCatEssentialTitle && tr.cookieCatEssentialTitle) cookieCatEssentialTitle.textContent = tr.cookieCatEssentialTitle;
  if (cookieCatAlwaysOn && tr.cookieCatAlwaysOn) cookieCatAlwaysOn.textContent = tr.cookieCatAlwaysOn;
  if (cookieCatEssentialDesc && tr.cookieCatEssentialDesc) cookieCatEssentialDesc.textContent = tr.cookieCatEssentialDesc;
  if (cookieCatFuncTitle && tr.cookieCatFuncTitle) cookieCatFuncTitle.textContent = tr.cookieCatFuncTitle;
  if (cookieCatFuncDesc && tr.cookieCatFuncDesc) cookieCatFuncDesc.textContent = tr.cookieCatFuncDesc;
  if (cookieCatAnalyticsTitle && tr.cookieCatAnalyticsTitle) cookieCatAnalyticsTitle.textContent = tr.cookieCatAnalyticsTitle;
  if (cookieCatAnalyticsDesc && tr.cookieCatAnalyticsDesc) cookieCatAnalyticsDesc.textContent = tr.cookieCatAnalyticsDesc;
  if (btnSaveCookiePrefs && tr.cookieBtnSavePrefs) btnSaveCookiePrefs.textContent = tr.cookieBtnSavePrefs;

  if (linkPrefsPrivacy && tr.footerPrivacy) linkPrefsPrivacy.textContent = tr.footerPrivacy;
  if (linkPrefsCookies && tr.footerCookies) linkPrefsCookies.textContent = tr.footerCookies;
  if (linkPrefsTerms && tr.footerTerms) linkPrefsTerms.textContent = tr.footerTerms;
}

export function openCookiePrefsModal() {
  if (!cookiePrefsDialog) return;
  applyCookieConsentLocalization();
  const saved = getCookieConsentState();
  if (chkCookieFunctional) {
    chkCookieFunctional.checked = saved ? saved.functional : true;
  }
  if (chkCookieAnalytics) {
    chkCookieAnalytics.checked = saved ? saved.analytics : false;
  }
  cookiePrefsDialog.showModal();
}

export function initCookieConsent() {
  applyCookieConsentLocalization();
  const existing = getCookieConsentState();
  if (cookieConsentBanner) {
    cookieConsentBanner.classList.toggle('hidden', Boolean(existing));
  }

  if (btnCookieEssential) {
    btnCookieEssential.addEventListener('click', () => {
      saveCookieConsentChoice({ functional: false, analytics: false, choice: 'essential' });
    });
  }

  if (btnCookieAcceptAll) {
    btnCookieAcceptAll.addEventListener('click', () => {
      saveCookieConsentChoice({ functional: true, analytics: true, choice: 'all' });
    });
  }

  if (btnCookieCustomize) {
    btnCookieCustomize.addEventListener('click', () => {
      openCookiePrefsModal();
    });
  }

  if (btnSaveCookiePrefs) {
    btnSaveCookiePrefs.addEventListener('click', () => {
      const functional = chkCookieFunctional ? chkCookieFunctional.checked : true;
      const analytics = chkCookieAnalytics ? chkCookieAnalytics.checked : false;
      saveCookieConsentChoice({
        functional,
        analytics,
        choice: functional && analytics ? 'all' : (functional ? 'functional' : 'essential')
      });
      if (cookiePrefsDialog && cookiePrefsDialog.open) {
        cookiePrefsDialog.close();
      }
      actions.resumePlayIfAllDialogsClosed();
    });
  }

  if (btnCloseCookiePrefs && cookiePrefsDialog) {
    btnCloseCookiePrefs.addEventListener('click', () => {
      cookiePrefsDialog.close();
      actions.resumePlayIfAllDialogsClosed();
    });
    cookiePrefsDialog.addEventListener('close', () => {
      actions.resumePlayIfAllDialogsClosed();
    });
  }
}
