// Полноэкранная страница «О проекте» (#aboutPageView) с доступными вкладками (SRP)
import { actions } from '../core/events.js';
import { escapeHtml } from '../core/utils.js';
import { ALL_LANG_CODES } from '../config/constants.js';
import { ABOUT_CONTACTS, ABOUT_CONTENT, ABOUT_TABS } from '../data/about-content.js';
import { ABOUT_LINKS } from '../data/about-fsrs-legal.js';
import {
  getAllWordsInTargetLang,
  getOfficialCoursesForTargetLang
} from '../domain/catalog-service.js';
import { getFsrsSummaryForTargetLang } from '../domain/fsrs-service.js';
import { sound } from '../services/sound-engine.js';
import { isRtlUI, state } from '../state/store.js';
import { aboutPageView, arcadeTitleScreen, centerOverlay } from './dom.js';

let _aboutBound = false;

function getAboutContent() {
  return ABOUT_CONTENT[state.nativeLang] || ABOUT_CONTENT.ru;
}

function renderStoryTab(content) {
  const s = content.story;
  const paragraphsHtml = s.paragraphs
    .map(p => `<p class="about-story-para">${escapeHtml(p)}</p>`)
    .join('');

  const pillarsHtml = s.pillars
    .map(
      item => `
        <article class="about-pillar-card tone-${escapeHtml(item.tone)}">
          <div class="about-pillar-head">
            <span class="about-pillar-icon" aria-hidden="true">${escapeHtml(item.icon)}</span>
            <h3 class="about-pillar-title">${escapeHtml(item.title)}</h3>
          </div>
          <p class="about-pillar-text">${escapeHtml(item.text)}</p>
        </article>
      `
    )
    .join('');

  return `
    <div class="about-story-grid">
      <article class="bento-card about-story-card">
        <div class="about-story-badge">${escapeHtml(s.badge)}</div>
        <h2 class="about-section-title">${escapeHtml(s.title)}</h2>
        <div class="about-story-body">
          ${paragraphsHtml}
        </div>
        <blockquote class="about-vibe-quote">
          <span class="about-quote-spark" aria-hidden="true">✦</span>
          <span>${escapeHtml(s.quote)}</span>
        </blockquote>
        <div class="about-cta-row">
          <button type="button" class="about-btn-primary" data-about-action="play">
            <span aria-hidden="true">▶</span>
            <span>${escapeHtml(s.ctaPlay)}</span>
          </button>
          <button type="button" class="about-btn-secondary" data-about-action="anki">
            <span aria-hidden="true">📦</span>
            <span>${escapeHtml(s.ctaAnki)}</span>
          </button>
          <button type="button" class="about-btn-ghost" data-about-action="goto-contact">
            <span>✉️ ${escapeHtml(s.ctaContact)}</span>
            <span class="dir-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </article>

      <aside class="about-pillars-col" aria-label="${escapeHtml(s.pillarsTitle)}">
        <h3 class="about-pillars-heading">${escapeHtml(s.pillarsTitle)}</h3>
        <div class="about-pillars-stack">
          ${pillarsHtml}
        </div>
      </aside>
    </div>
  `;
}

function renderGuideTab(content) {
  const g = content.guide;
  const cardsHtml = g.cards
    .map(
      card => `
        <article class="bento-card about-guide-card tone-${escapeHtml(card.tone)}">
          <div class="about-guide-icon-box" aria-hidden="true">${escapeHtml(card.icon)}</div>
          <h3 class="about-guide-title">${escapeHtml(card.title)}</h3>
          <p class="about-guide-text">${escapeHtml(card.text)}</p>
        </article>
      `
    )
    .join('');

  return `
    <div class="about-tab-stack">
      <header class="about-tab-intro">
        <h2 class="about-section-title">${escapeHtml(g.title)}</h2>
        <p class="about-section-sub">${escapeHtml(g.subtitle)}</p>
      </header>

      <div class="about-guide-grid">
        ${cardsHtml}
      </div>

      <div class="about-bottom-bar">
        <button type="button" class="about-btn-primary" data-about-action="decks">
          <span aria-hidden="true">🗂️</span>
          <span>${escapeHtml(g.ctaDecks)}</span>
        </button>
        <button type="button" class="about-btn-secondary" data-about-action="tts">
          <span aria-hidden="true">🎙️</span>
          <span>${escapeHtml(g.ctaTts)}</span>
        </button>
      </div>
    </div>
  `;
}

function renderRoadmapTab(content) {
  const r = content.roadmap;
  const stagesHtml = r.stages
    .map(stage => {
      const itemsHtml = stage.items
        .map(li => `<li>${escapeHtml(li)}</li>`)
        .join('');
      return `
        <article class="bento-card about-roadmap-card tone-${escapeHtml(stage.tone)}">
          <div class="about-roadmap-top">
            <span class="about-status-badge status-${escapeHtml(stage.tone)}">${escapeHtml(stage.status)}</span>
          </div>
          <h3 class="about-roadmap-title">${escapeHtml(stage.title)}</h3>
          <ul class="about-roadmap-list">
            ${itemsHtml}
          </ul>
        </article>
      `;
    })
    .join('');

  return `
    <div class="about-tab-stack">
      <header class="about-tab-intro">
        <h2 class="about-section-title">${escapeHtml(r.title)}</h2>
        <p class="about-section-sub">${escapeHtml(r.subtitle)}</p>
      </header>

      <div class="about-roadmap-grid">
        ${stagesHtml}
      </div>

      <div class="bento-card about-roadmap-callout">
        <div class="about-callout-copy">
          <h3 class="about-callout-title">${escapeHtml(r.calloutTitle)}</h3>
          <p class="about-callout-text">${escapeHtml(r.calloutText)}</p>
        </div>
        <button type="button" class="about-btn-primary" data-about-action="goto-contact">
          <span>✉️ ${escapeHtml(r.calloutBtn)}</span>
          <span class="dir-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  `;
}

function renderContactTab(content) {
  const c = content.contact;
  const topicsHtml = c.topics
    .map(
      topic => `
        <article class="about-collab-card">
          <div class="about-collab-icon" aria-hidden="true">${escapeHtml(topic.icon)}</div>
          <div class="about-collab-copy">
            <h4 class="about-collab-title">${escapeHtml(topic.title)}</h4>
            <p class="about-collab-text">${escapeHtml(topic.text)}</p>
          </div>
        </article>
      `
    )
    .join('');

  return `
    <div class="about-tab-stack">
      <header class="about-tab-intro">
        <h2 class="about-section-title">${escapeHtml(c.title)}</h2>
        <p class="about-section-sub">${escapeHtml(c.subtitle)}</p>
      </header>

      <div class="about-contact-grid">
        <article class="bento-card about-contact-card is-telegram">
          <div class="about-contact-top">
            <span class="about-contact-orb orb-telegram" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20.6 4.4L3.8 11c-1.1.45-1.1 1.1-.2 1.38l4.3 1.35 1.66 5.05c.2.55.1.77.72.77.47 0 .68-.22.95-.48l2.28-2.22 4.74 3.5c.87.48 1.5.23 1.72-.81L22 5.75c.31-1.26-.48-1.83-1.4-1.35Z" fill="currentColor"/>
              </svg>
            </span>
            <div>
              <h3 class="about-contact-name">${escapeHtml(c.telegramTitle)}</h3>
              <p class="about-contact-role">${escapeHtml(c.telegramRole)}</p>
            </div>
          </div>

          <div class="about-contact-handle" dir="ltr">${escapeHtml(ABOUT_CONTACTS.telegramHandle)}</div>

          <div class="about-contact-actions">
            <a
              class="about-btn-primary"
              href="${escapeHtml(ABOUT_CONTACTS.telegramUrl)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>✈️ ${escapeHtml(c.telegramBtn)}</span>
            </a>
            <button
              type="button"
              class="about-copy-btn"
              data-copy-text="${escapeHtml(ABOUT_CONTACTS.telegramHandle)}"
            >
              <span class="about-copy-label">${escapeHtml(content.copyBtnLabel)}</span>
            </button>
          </div>
        </article>

        <article class="bento-card about-contact-card is-email">
          <div class="about-contact-top">
            <span class="about-contact-orb orb-email" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2.5" />
                <path d="M4 7l8 6 8-6" />
              </svg>
            </span>
            <div>
              <h3 class="about-contact-name">${escapeHtml(c.emailTitle)}</h3>
              <p class="about-contact-role">${escapeHtml(c.emailRole)}</p>
            </div>
          </div>

          <div class="about-contact-handle" dir="ltr">${escapeHtml(ABOUT_CONTACTS.email)}</div>

          <div class="about-contact-actions">
            <a
              class="about-btn-secondary"
              href="mailto:${escapeHtml(ABOUT_CONTACTS.email)}"
            >
              <span>✉️ ${escapeHtml(c.emailBtn)}</span>
            </a>
            <button
              type="button"
              class="about-copy-btn"
              data-copy-text="${escapeHtml(ABOUT_CONTACTS.email)}"
            >
              <span class="about-copy-label">${escapeHtml(content.copyBtnLabel)}</span>
            </button>
          </div>
        </article>
      </div>

      <section class="about-collab-section">
        <h3 class="about-collab-heading">${escapeHtml(c.topicsTitle)}</h3>
        <div class="about-collab-grid">
          ${topicsHtml}
        </div>
      </section>
    </div>
  `;
}

function renderFsrsTab(content) {
  const f = content.fsrs;
  if (!f) return '';
  const summary = getFsrsSummaryForTargetLang(state.targetLang);

  const dsrHtml = f.dsrCards
    .map(
      card => `
        <article class="bento-card about-fsrs-dsr-card tone-${escapeHtml(card.tone)}">
          <div class="about-fsrs-code-badge tone-${escapeHtml(card.tone)}" dir="ltr">${escapeHtml(card.code)}</div>
          <h4 class="about-pillar-title">${escapeHtml(card.title)}</h4>
          <p class="about-pillar-text">${escapeHtml(card.text)}</p>
        </article>
      `
    )
    .join('');

  const ratingsHtml = f.ratings
    .map(
      r => `
        <div class="about-fsrs-rating-row tone-${escapeHtml(r.tone)}">
          <span class="about-fsrs-rating-pill tone-${escapeHtml(r.tone)}" dir="ltr">${escapeHtml(r.badge)}</span>
          <span class="about-fsrs-rating-trigger">${escapeHtml(r.trigger)}</span>
          <span class="about-fsrs-rating-effect">${escapeHtml(r.effect)}</span>
        </div>
      `
    )
    .join('');

  return `
    <div class="about-tab-stack">
      <article class="bento-card about-fsrs-hero">
        <div class="about-story-badge">${escapeHtml(f.badge)}</div>
        <h2 class="about-section-title">${escapeHtml(f.title)}</h2>
        <p class="about-story-para">${escapeHtml(f.intro)}</p>

        <div class="about-fsrs-formula-box">
          <div class="about-fsrs-formula-label">${escapeHtml(f.formulaLabel)}</div>
          <code class="about-fsrs-formula-code" dir="ltr">R(t, S) = (1 + (19 / 81) · t / S)^(-0.5)</code>
          <div class="about-fsrs-formula-cap">${escapeHtml(f.formulaCaption)}</div>
        </div>
      </article>

      <section class="about-fsrs-section">
        <h3 class="about-pillars-heading">${escapeHtml(f.dsrTitle)}</h3>
        <div class="about-fsrs-dsr-grid">
          ${dsrHtml}
        </div>
      </section>

      <article class="bento-card about-fsrs-ratings-card">
        <h3 class="about-section-title">${escapeHtml(f.howTitle)}</h3>
        <p class="about-section-sub">${escapeHtml(f.howSubtitle)}</p>
        <div class="about-fsrs-ratings-list">
          ${ratingsHtml}
        </div>
      </article>

      <article class="bento-card about-fsrs-live-card">
        <h3 class="about-roadmap-title">${escapeHtml(f.liveTitle)}</h3>
        <div class="about-fsrs-live-metrics">
          <div class="about-fsrs-metric">
            <strong>${summary.tracked}</strong>
            <span>${escapeHtml(f.liveTracked)}</span>
          </div>
          <div class="about-fsrs-metric is-due">
            <strong>${summary.dueNow}</strong>
            <span>${escapeHtml(f.liveDue)}</span>
          </div>
          <div class="about-fsrs-metric">
            <strong>${summary.mastered}</strong>
            <span>${escapeHtml(f.liveMastered)}</span>
          </div>
          <div class="about-fsrs-metric">
            <strong>${summary.avgRetentionPct}%</strong>
            <span>${escapeHtml(f.liveRetention)}</span>
          </div>
        </div>
        <div class="about-cta-row">
          <button type="button" class="about-btn-primary" data-about-action="fsrs-drill">
            <span>${escapeHtml(summary.dueNow > 0 ? f.ctaReviewDue : f.ctaStartPlaying)}</span>
          </button>
          <a
            class="about-btn-ghost"
            href="${escapeHtml(ABOUT_LINKS.fsrsRepo)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>${escapeHtml(f.ctaRepo)}</span>
          </a>
        </div>
      </article>
    </div>
  `;
}

function renderLegalTab(content) {
  const l = content.legal;
  if (!l) return '';

  const cardsHtml = l.cards
    .map(
      c => `
        <article class="bento-card about-guide-card tone-${escapeHtml(c.tone)}">
          <div class="about-guide-icon-box" aria-hidden="true">${escapeHtml(c.icon)}</div>
          <h3 class="about-guide-title">${escapeHtml(c.title)}</h3>
          <p class="about-guide-text">${escapeHtml(c.text)}</p>
        </article>
      `
    )
    .join('');

  const rowsHtml = l.storageRows
    .map(
      row => `
        <tr>
          <td><code dir="ltr">${escapeHtml(row.key)}</code></td>
          <td>${escapeHtml(row.purpose)}</td>
          <td><span class="about-legal-cat">${escapeHtml(row.category)}</span></td>
        </tr>
      `
    )
    .join('');

  return `
    <div class="about-tab-stack">
      <header class="about-tab-intro">
        <div class="about-story-badge">${escapeHtml(l.badge)}</div>
        <h2 class="about-section-title">${escapeHtml(l.title)}</h2>
        <p class="about-section-sub">${escapeHtml(l.subtitle)}</p>
      </header>

      <div class="about-legal-grid">
        ${cardsHtml}
      </div>

      <article class="bento-card about-legal-table-card">
        <h3 class="about-roadmap-title">${escapeHtml(l.storageTitle)}</h3>
        <div class="about-legal-table-wrap">
          <table class="about-legal-table">
            <thead>
              <tr>
                ${l.storageColumns.map(col => `<th>${escapeHtml(col)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
        <div class="about-cta-row">
          <button type="button" class="about-btn-primary" data-about-action="open-cookie-prefs">
            <span>${escapeHtml(l.ctaCookiePrefs)}</span>
          </button>
          <a class="about-btn-secondary" href="${escapeHtml(ABOUT_LINKS.privacy)}" target="_blank" rel="noopener">
            <span>${escapeHtml(l.ctaPrivacyDoc)}</span>
          </a>
          <a class="about-btn-ghost" href="${escapeHtml(ABOUT_LINKS.cookies)}" target="_blank" rel="noopener">
            <span>${escapeHtml(l.ctaCookiesDoc)}</span>
          </a>
          <a class="about-btn-ghost" href="${escapeHtml(ABOUT_LINKS.terms)}" target="_blank" rel="noopener">
            <span>${escapeHtml(l.ctaTermsDoc)}</span>
          </a>
        </div>
      </article>
    </div>
  `;
}

function renderAboutTabPanel(activeTab, content) {
  if (activeTab === 'guide') return renderGuideTab(content);
  if (activeTab === 'fsrs') return renderFsrsTab(content);
  if (activeTab === 'roadmap') return renderRoadmapTab(content);
  if (activeTab === 'legal') return renderLegalTab(content);
  if (activeTab === 'contact') return renderContactTab(content);
  return renderStoryTab(content);
}

export function openAboutPage(tabId = '') {
  if (ABOUT_TABS.includes(tabId)) {
    state.aboutActiveTab = tabId;
  }

  if (state.screenMode === 'play') {
    state.paused = true;
    state.decksOpenedFromPlay = true;
    state.screenMode = 'title';
    if (centerOverlay) centerOverlay.classList.add('hidden');
    if (arcadeTitleScreen) arcadeTitleScreen.hidden = false;
    document.body.classList.remove('mode-play');
    document.body.classList.add('mode-title');
  }

  actions.switchHomeSubView('about');
}

export function renderAboutPage() {
  if (!aboutPageView) return;

  const content = getAboutContent();
  const activeTab = ABOUT_TABS.includes(state.aboutActiveTab) ? state.aboutActiveTab : 'story';
  if (state.aboutActiveTab !== activeTab) {
    state.aboutActiveTab = activeTab;
  }

  const langCount = ALL_LANG_CODES.length;
  const coursesCount = getOfficialCoursesForTargetLang(state.targetLang).length;
  const wordsCount = getAllWordsInTargetLang(state.targetLang).length;

  const tabsHtml = content.tabs
    .map(tab => {
      const selected = tab.id === activeTab;
      return `
        <button
          type="button"
          class="about-tab-btn${selected ? ' active' : ''}"
          id="about-tab-${escapeHtml(tab.id)}"
          role="tab"
          aria-selected="${selected ? 'true' : 'false'}"
          aria-controls="about-panel-${escapeHtml(tab.id)}"
          tabindex="${selected ? '0' : '-1'}"
          data-about-tab="${escapeHtml(tab.id)}"
        >
          <span class="about-tab-icon" aria-hidden="true">${escapeHtml(tab.icon)}</span>
          <span>${escapeHtml(tab.label)}</span>
        </button>
      `;
    })
    .join('');

  const panelHtml = renderAboutTabPanel(activeTab, content);

  aboutPageView.innerHTML = `
    <header class="about-hero-card">
      <div class="about-planet-fx" aria-hidden="true"></div>
      <div class="about-hero-copy">
        <span class="about-hero-kicker">${escapeHtml(content.kicker)}</span>
        <h1 class="about-hero-title">${escapeHtml(content.heroTitle)}</h1>
        <p class="about-hero-sub">${escapeHtml(content.heroSubtitle)}</p>
      </div>

      <div class="about-hero-metrics">
        <div class="about-metric-pill">
          <strong class="about-metric-val">${langCount}</strong>
          <span class="about-metric-lbl">${escapeHtml(content.metricsLabels.languages)}</span>
        </div>
        <div class="about-metric-pill">
          <strong class="about-metric-val">${coursesCount}</strong>
          <span class="about-metric-lbl">${escapeHtml(content.metricsLabels.courses)}</span>
        </div>
        <div class="about-metric-pill">
          <strong class="about-metric-val">${wordsCount}+</strong>
          <span class="about-metric-lbl">${escapeHtml(content.metricsLabels.words)}</span>
        </div>
      </div>
    </header>

    <div class="about-tabs-bar" role="tablist" aria-label="${escapeHtml(content.heroTitle)}">
      ${tabsHtml}
    </div>

    <div
      class="about-tab-panel"
      id="about-panel-${escapeHtml(activeTab)}"
      role="tabpanel"
      aria-labelledby="about-tab-${escapeHtml(activeTab)}"
      tabindex="0"
    >
      ${panelHtml}
    </div>
  `;
}

async function copyContactValue(btn, content) {
  const value = btn.getAttribute('data-copy-text') || '';
  if (!value) return;

  let copied = false;
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(value);
      copied = true;
    } catch (_) {
      copied = false;
    }
  }

  if (!copied) {
    const ta = document.createElement('textarea');
    ta.value = value;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    ta.style.pointerEvents = 'none';
    document.body.appendChild(ta);
    ta.select();
    try {
      copied = document.execCommand('copy');
    } catch (_) {
      copied = false;
    }
    document.body.removeChild(ta);
  }

  if (!copied) return;

  const labelEl = btn.querySelector('.about-copy-label');
  btn.classList.add('is-copied');
  if (labelEl) {
    labelEl.textContent = `✓ ${content.copiedLabel}`;
  }

  if (btn._copyTimer) clearTimeout(btn._copyTimer);
  btn._copyTimer = setTimeout(() => {
    btn.classList.remove('is-copied');
    if (labelEl) {
      labelEl.textContent = content.copyBtnLabel;
    }
  }, 2200);
}

function activateTab(tabId, focusTab = false) {
  if (!ABOUT_TABS.includes(tabId)) return;
  if (state.aboutActiveTab === tabId) return;
  const oldTabBar = aboutPageView ? aboutPageView.querySelector('.about-tabs-bar') : null;
  const prevScrollLeft = oldTabBar ? oldTabBar.scrollLeft : 0;
  state.aboutActiveTab = tabId;
  renderAboutPage();
  if (aboutPageView) {
    const newTabBar = aboutPageView.querySelector('.about-tabs-bar');
    if (newTabBar && prevScrollLeft) {
      newTabBar.scrollLeft = prevScrollLeft;
    }
    const nextBtn = aboutPageView.querySelector(`[data-about-tab="${tabId}"]`);
    if (nextBtn) {
      if (focusTab) nextBtn.focus();
      if (typeof nextBtn.scrollIntoView === 'function') {
        nextBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }
}

export function bindAboutPageEvents() {
  if (_aboutBound || !aboutPageView) return;
  _aboutBound = true;

  aboutPageView.addEventListener('click', (e) => {
    const target = e.target;
    if (!target || !target.closest) return;

    const tabBtn = target.closest('[data-about-tab]');
    if (tabBtn) {
      sound.init();
      activateTab(tabBtn.getAttribute('data-about-tab'), false);
      return;
    }

    const actionBtn = target.closest('[data-about-action]');
    if (actionBtn) {
      sound.init();
      const act = actionBtn.getAttribute('data-about-action');
      if (act === 'play') {
        actions.launchFromTitleScreen();
      } else if (act === 'anki') {
        actions.openCustomWordsModal();
      } else if (act === 'decks') {
        actions.openDecksPage({ sourceFilter: 'all', onlyFavorites: false });
      } else if (act === 'tts') {
        actions.openTtsStudioDialog();
      } else if (act === 'fsrs-drill') {
        const started = actions.launchFsrsReviewDrill();
        if (!started) actions.launchFromTitleScreen();
      } else if (act === 'open-cookie-prefs') {
        actions.openCookiePrefsModal();
      } else if (act === 'goto-contact') {
        activateTab('contact', false);
        if (arcadeTitleScreen) {
          arcadeTitleScreen.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      return;
    }

    const copyBtn = target.closest('[data-copy-text]');
    if (copyBtn) {
      sound.init();
      copyContactValue(copyBtn, getAboutContent());
    }
  });

  aboutPageView.addEventListener('keydown', (e) => {
    const tabBtn = e.target && e.target.closest && e.target.closest('[role="tab"]');
    if (!tabBtn) return;

    const currentIdx = ABOUT_TABS.indexOf(tabBtn.getAttribute('data-about-tab'));
    if (currentIdx === -1) return;

    const rtl = isRtlUI();
    let nextIdx = -1;

    if (e.key === 'ArrowRight') {
      nextIdx = rtl
        ? (currentIdx - 1 + ABOUT_TABS.length) % ABOUT_TABS.length
        : (currentIdx + 1) % ABOUT_TABS.length;
    } else if (e.key === 'ArrowLeft') {
      nextIdx = rtl
        ? (currentIdx + 1) % ABOUT_TABS.length
        : (currentIdx - 1 + ABOUT_TABS.length) % ABOUT_TABS.length;
    } else if (e.key === 'Home') {
      nextIdx = 0;
    } else if (e.key === 'End') {
      nextIdx = ABOUT_TABS.length - 1;
    }

    if (nextIdx !== -1) {
      e.preventDefault();
      sound.init();
      activateTab(ABOUT_TABS[nextIdx], true);
    }
  });
}
