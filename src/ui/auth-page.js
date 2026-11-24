// ============================================================================
// Контроллер полноэкранной страницы добровольной регистрации Google (Gmail)
// Отображает преимущества регистрации, GDPR opt-in и личный кабинет (SRP)
// ============================================================================

import { actions } from '../core/events.js';
import { escapeHtml } from '../core/utils.js';
import { AUTH_CONTENT } from '../data/auth-content.js';
import { getFsrsSummaryForTargetLang } from '../domain/fsrs-service.js';
import {
  deleteAuthAccount,
  exportUserDataJson,
  getAuthRuntimeConfig,
  mountGoogleSignInButton,
  signOutAuthUser,
  syncAuthCloudNow,
  updateAuthMarketingOptIn
} from '../services/auth-service.js';
import { sound } from '../services/sound-engine.js';
import { learnedWordsSet, state, t } from '../state/store.js';
import {
  arcadeTitleScreen,
  authPageView,
  btnAnkiSyncAuthHint,
  btnNavAuth,
  centerOverlay,
  labelAnkiSyncAuthHint,
  labelNavAuth,
  labelSettingsAuthBtn,
  navAuthAvatar
} from './dom.js';

let _authBound = false;
let _deleteConfirmOpen = false;
let _authStatusNotice = null; // { tone: 'info' | 'error' | 'ok', title: string, text: string }

function getAuthContent() {
  return AUTH_CONTENT[state.nativeLang] || AUTH_CONTENT.ru;
}

function getGoogleSvgIcon() {
  return `
    <svg class="home-auth-g-svg" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"/>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"/>
      <path fill="#FBBC05" d="M5.84 14.09a6.97 6.97 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84Z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/>
    </svg>
  `;
}

export function updateAuthNavButton() {
  const tr = t();
  const curUser = state.authUser;

  if (btnNavAuth && labelNavAuth) {
    btnNavAuth.classList.toggle('is-signed-in', Boolean(curUser));
    btnNavAuth.classList.toggle('active', state.homeSubView === 'auth');
    if (curUser) {
      const firstName = String(curUser.name || curUser.email || '').trim().split(/\s+/)[0] || (tr.navAuthAccount || 'Account');
      labelNavAuth.textContent = firstName;
      if (navAuthAvatar) {
        if (curUser.picture) {
          navAuthAvatar.innerHTML = `<img class="home-auth-avatar-img" src="${escapeHtml(curUser.picture)}" alt="" referrerpolicy="no-referrer" />`;
        } else {
          navAuthAvatar.textContent = firstName.charAt(0).toUpperCase();
        }
      }
    } else {
      labelNavAuth.textContent = tr.navAuthSignIn || 'Войти';
      if (navAuthAvatar) {
        navAuthAvatar.innerHTML = getGoogleSvgIcon();
      }
    }
  }

  if (labelSettingsAuthBtn) {
    labelSettingsAuthBtn.textContent = curUser
      ? `${curUser.name || curUser.email}`
      : (tr.settingsAuthBtn || 'Войти через Google');
  }

  if (btnAnkiSyncAuthHint) {
    btnAnkiSyncAuthHint.classList.toggle('hidden', Boolean(curUser));
    if (labelAnkiSyncAuthHint && tr.ankiAuthSyncHint) {
      labelAnkiSyncAuthHint.textContent = tr.ankiAuthSyncHint;
    }
  }
}

export function openAuthPage() {
  _deleteConfirmOpen = false;
  if (state.screenMode === 'play') {
    state.paused = true;
    state.decksOpenedFromPlay = true;
    state.screenMode = 'title';
    if (centerOverlay) centerOverlay.classList.add('hidden');
    if (arcadeTitleScreen) arcadeTitleScreen.hidden = false;
    document.body.classList.remove('mode-play');
    document.body.classList.add('mode-title');
  }
  actions.switchHomeSubView('auth');
}

function renderStatusNoticeHtml() {
  if (!_authStatusNotice) return '';
  return `
    <div class="auth-status-notice tone-${escapeHtml(_authStatusNotice.tone || 'info')}" id="authStatusNotice" role="status">
      <strong>${escapeHtml(_authStatusNotice.title || '')}</strong>
      <p>${escapeHtml(_authStatusNotice.text || '')}</p>
    </div>
  `;
}

function renderGuestAuthView(c) {
  const benefitsHtml = c.benefits
    .map(
      b => `
        <article class="bento-card auth-benefit-card tone-${escapeHtml(b.tone)}">
          <div class="about-guide-icon-box" aria-hidden="true">${escapeHtml(b.icon)}</div>
          <h3 class="about-guide-title">${escapeHtml(b.title)}</h3>
          <p class="about-guide-text">${escapeHtml(b.text)}</p>
        </article>
      `
    )
    .join('');

  const compareRowsHtml = c.compareRows
    .map(
      row => `
        <tr>
          <td>${escapeHtml(row.feat)}</td>
          <td>${escapeHtml(row.guest)}</td>
          <td><strong class="auth-compare-acc">${escapeHtml(row.acc)}</strong></td>
        </tr>
      `
    )
    .join('');

  const rtCfg = getAuthRuntimeConfig();
  const hasGoogle = rtCfg.googleConfigured && rtCfg.googleClientId;

  return `
    <header class="bento-card auth-hero-card">
      <div class="about-story-badge">${escapeHtml(c.badge)}</div>
      <h1 class="about-hero-title">${escapeHtml(c.heroTitle)}</h1>
      <p class="about-hero-sub">${escapeHtml(c.heroSubtitle)}</p>
    </header>

    <div class="auth-main-grid">
      <section class="bento-card auth-signin-card">
        <h2 class="about-section-title">${escapeHtml(c.cardTitle)}</h2>
        <p class="about-section-sub">${escapeHtml(c.cardSubtitle)}</p>

        <label class="auth-gdpr-optin" for="chkAuthMarketingOptIn">
          <input type="checkbox" id="chkAuthMarketingOptIn" />
          <span>${escapeHtml(c.marketingOptInLabel)}</span>
        </label>

        <div class="auth-google-slot" id="authGoogleButtonSlot">
          ${hasGoogle ? '<div class="auth-google-loading">Google Sign-In...</div>' : `
            <button type="button" class="auth-google-btn" id="btnAuthGoogleFallback" data-auth-action="google-fallback-click">
              ${getGoogleSvgIcon()}
              <span>${escapeHtml(c.googleBtnLabel)}</span>
            </button>
          `}
        </div>

        ${renderStatusNoticeHtml()}

        <p class="auth-legal-hint">
          ${escapeHtml(c.legalHintPrefix)}
          <a href="privacy.html" target="_blank" rel="noopener">${escapeHtml(c.legalPrivacy)}</a> ·
          <a href="terms.html" target="_blank" rel="noopener">${escapeHtml(c.legalTerms)}</a>
        </p>

        <div class="auth-guest-actions">
          <button type="button" class="about-btn-ghost" data-auth-action="continue-guest">
            <span>${escapeHtml(c.continueGuestBtn)}</span>
          </button>
          <button type="button" class="about-btn-secondary" data-auth-action="export-json">
            <span>${escapeHtml(c.guestBackupBtn)}</span>
          </button>
        </div>
      </section>

      <section class="auth-benefits-col" aria-label="${escapeHtml(c.benefitsHeading)}">
        <h2 class="about-pillars-heading">${escapeHtml(c.benefitsHeading)}</h2>
        <div class="auth-benefits-grid">
          ${benefitsHtml}
        </div>
      </section>
    </div>

    <section class="bento-card about-legal-table-card">
      <h2 class="about-roadmap-title">${escapeHtml(c.compareTitle)}</h2>
      <div class="about-legal-table-wrap">
        <table class="about-legal-table auth-compare-table">
          <thead>
            <tr>
              ${c.compareCols.map(col => `<th>${escapeHtml(col)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${compareRowsHtml}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderSignedInAuthView(c) {
  const u = state.authUser;
  const fsrs = getFsrsSummaryForTargetLang(state.targetLang);
  const deckCount = Array.isArray(state.userCourses) ? state.userCourses.length : 0;
  const syncedText = u.lastSyncedAt
    ? `${c.syncedAtLabel} ${new Date(u.lastSyncedAt).toLocaleString()}`
    : c.neverSyncedLabel;

  const avatarHtml = u.picture
    ? `<img class="auth-profile-avatar-img" src="${escapeHtml(u.picture)}" alt="" referrerpolicy="no-referrer" />`
    : `<span class="auth-profile-initial">${escapeHtml(String(u.name || u.email || 'U').charAt(0).toUpperCase())}</span>`;

  return `
    <article class="bento-card auth-signedin-card">
      <div class="auth-signedin-head">
        <div class="auth-profile-orb">${avatarHtml}</div>
        <div class="auth-profile-copy">
          <span class="about-story-badge">${escapeHtml(c.signedInBadge)}</span>
          <h1 class="about-hero-title">${escapeHtml(u.name || u.email)}</h1>
          <p class="auth-profile-email" dir="ltr">${escapeHtml(u.email)}</p>
          <p class="auth-sync-stamp">${escapeHtml(syncedText)}</p>
        </div>
      </div>

      <div class="about-fsrs-live-metrics">
        <div class="about-fsrs-metric">
          <strong>${learnedWordsSet.size}</strong>
          <span>${escapeHtml(c.statWords)}</span>
        </div>
        <div class="about-fsrs-metric is-due">
          <strong>${fsrs.totalTrackedAllLangs}</strong>
          <span>${escapeHtml(c.statFsrs)}</span>
        </div>
        <div class="about-fsrs-metric">
          <strong>${deckCount}</strong>
          <span>${escapeHtml(c.statDecks)}</span>
        </div>
      </div>

      ${renderStatusNoticeHtml()}

      <label class="auth-gdpr-optin" for="chkAuthSignedInMarketing">
        <input type="checkbox" id="chkAuthSignedInMarketing" ${u.marketingOptIn ? 'checked' : ''} />
        <div>
          <strong>${escapeHtml(c.marketingToggleTitle)}</strong>
          <div class="auth-optin-sub">${escapeHtml(c.marketingToggleDesc)}</div>
        </div>
      </label>

      <div class="about-cta-row">
        <button type="button" class="about-btn-primary" id="btnAuthSyncNow" data-auth-action="sync-now">
          <span>${escapeHtml(c.syncNowBtn)}</span>
        </button>
        <button type="button" class="about-btn-secondary" data-auth-action="export-json">
          <span>${escapeHtml(c.exportDataBtn)}</span>
        </button>
        <button type="button" class="about-btn-ghost" data-auth-action="sign-out">
          <span>${escapeHtml(c.signOutBtn)}</span>
        </button>
        <button type="button" class="about-btn-ghost" data-auth-action="back-game">
          <span>${escapeHtml(c.backToGameBtn)}</span>
        </button>
      </div>

      <div class="auth-danger-zone">
        ${_deleteConfirmOpen
          ? `
            <p class="auth-danger-text">${escapeHtml(c.deleteConfirmText)}</p>
            <div class="about-cta-row">
              <button type="button" class="auth-danger-btn" data-auth-action="delete-confirm">${escapeHtml(c.deleteConfirmYes)}</button>
              <button type="button" class="about-btn-ghost" data-auth-action="delete-cancel">${escapeHtml(c.deleteConfirmCancel)}</button>
            </div>
          `
          : `
            <button type="button" class="auth-danger-outline-btn" data-auth-action="delete-ask">
              <span>${escapeHtml(c.deleteAccountBtn)}</span>
            </button>
          `}
      </div>
    </article>
  `;
}

export function renderAuthPage() {
  updateAuthNavButton();
  if (!authPageView) return;
  const c = getAuthContent();

  authPageView.innerHTML = state.authUser
    ? renderSignedInAuthView(c)
    : renderGuestAuthView(c);

  if (!state.authUser) {
    const slotEl = document.getElementById('authGoogleButtonSlot');
    const rtCfg = getAuthRuntimeConfig();
    if (slotEl && rtCfg.googleConfigured && rtCfg.googleClientId) {
      mountGoogleSignInButton(slotEl, {
        getMarketingOptIn: () => {
          const chk = document.getElementById('chkAuthMarketingOptIn');
          return Boolean(chk && chk.checked);
        },
        onSuccess: () => {
          _authStatusNotice = null;
          renderAuthPage();
        },
        onError: () => {
          const cur = getAuthContent();
          _authStatusNotice = { tone: 'error', title: 'Google OAuth', text: cur.errorGeneric };
          renderAuthPage();
        }
      });
    }
  }
}

export function bindAuthPageEvents() {
  if (_authBound || !authPageView) return;
  _authBound = true;

  authPageView.addEventListener('click', async (e) => {
    const btn = e.target && e.target.closest && e.target.closest('[data-auth-action]');
    if (!btn) return;
    sound.init();
    const act = btn.getAttribute('data-auth-action');
    const c = getAuthContent();

    if (act === 'continue-guest' || act === 'back-game') {
      _authStatusNotice = null;
      actions.switchHomeSubView('home');
    } else if (act === 'export-json') {
      exportUserDataJson();
    } else if (act === 'google-fallback-click') {
      _authStatusNotice = {
        tone: 'info',
        title: c.setupNoticeTitle,
        text: c.setupNoticeBody
      };
      renderAuthPage();
    } else if (act === 'sync-now') {
      btn.disabled = true;
      btn.textContent = c.syncingBtn;
      const res = await syncAuthCloudNow();
      if (!res.ok) {
        _authStatusNotice = {
          tone: 'info',
          title: c.setupNoticeTitle,
          text: c.setupNoticeBody
        };
      }
      renderAuthPage();
    } else if (act === 'sign-out') {
      _authStatusNotice = null;
      _deleteConfirmOpen = false;
      await signOutAuthUser();
      renderAuthPage();
    } else if (act === 'delete-ask') {
      _deleteConfirmOpen = true;
      renderAuthPage();
    } else if (act === 'delete-cancel') {
      _deleteConfirmOpen = false;
      renderAuthPage();
    } else if (act === 'delete-confirm') {
      _deleteConfirmOpen = false;
      await deleteAuthAccount();
      renderAuthPage();
    }
  });

  authPageView.addEventListener('change', (e) => {
    const chk = e.target;
    if (chk && chk.id === 'chkAuthSignedInMarketing') {
      updateAuthMarketingOptIn(Boolean(chk.checked));
    }
  });
}
