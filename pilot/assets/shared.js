/*
  GujPsych-Screen (ગુજસાઇક-સ્ક્રીન)
  shared.js — Common utilities for all pages
*/
// ── GUJARATI NUMERALS ──────────────────────────────────────────
function toGu(n) {
  const d = ['૦','૧','૨','૩','૪','૫','૬','૭','૮','૯'];
  return String(n).split('').map(c => d[+c] ?? c).join('');
}

// ── SCREEN NAVIGATION ──────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── SESSION TOKEN ──────────────────────────────────────────────
// Generated once per browser session. Anonymous — no user identity.
// Stored in sessionStorage so it persists across page navigations
// within the same tab but resets when the browser/tab is closed.

const GPS_TOKEN_KEY    = 'gps_token';
const GPS_SD_DONE_KEY  = 'gps_sd_done';   // 'true' once sociodem submitted

function getToken() {
  let token = sessionStorage.getItem(GPS_TOKEN_KEY);
  if (!token) {
    token = 'gps_' + Math.random().toString(36).slice(2, 10)
                   + Math.random().toString(36).slice(2, 6);
    sessionStorage.setItem(GPS_TOKEN_KEY, token);
  }
  return token;
}

function isSocioDemDone() {
  return sessionStorage.getItem(GPS_SD_DONE_KEY) === 'true';
}

function markSocioDemDone() {
  sessionStorage.setItem(GPS_SD_DONE_KEY, 'true');
}

// ── AFTER SCALE COMPLETE ───────────────────────────────────────
// Call this from any scale page once scale data has been submitted.
// Redirects to sociodem.html (first time) or results page (subsequent).
// Pass the scale name so sociodem.html knows where to return.
// Results page URL is passed so sociodem can redirect back correctly.

function afterScaleSubmit(scalePage) {
  if (isSocioDemDone()) {
    renderResults();
    // Already have sociodem for this session — go straight to results
    showScreen('screen-results');
  } else {
    // First scale this session — collect sociodem first
    // Encode the calling page so sociodem.html can redirect back
    const returnTo = encodeURIComponent('../scales_folder/' + scalePage + '?results=1');
window.location.href = '../sociodem/sociodem.html?return=' + returnTo;
  }
}

// ── GOOGLE SHEETS SUBMIT ───────────────────────────────────────
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyh-ZFpxvP73ChVkInh8ovIOtFgMVjh7yIOrhSyoERD2Oqv7Iq8RaR7louq_9UbIAF2/exec';

function submitToSheets(payload) {
  if (APPS_SCRIPT_URL.includes('YOUR_')) {
    console.log('submitToSheets (dev mode — no URL set):', payload);
    return;
  }
  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(() => {});
}

// ── LOAD SHARED COMPONENTS ─────────────────────────────────────
function loadComponents() {
  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');

  // Detect if we are inside a subfolder (e.g. scales_folder/, sociodem/)
  const inSubfolder = window.location.pathname.split('/').length > 2 &&
                      !window.location.pathname.endsWith('/') &&
                      window.location.pathname.split('/').slice(-2)[0] !== '';
  const base = inSubfolder ? '../layout/' : 'layout/';

  if (headerEl) {
    fetch(base + 'header.html')
      .then(r => r.text())
      .then(html => { headerEl.innerHTML = html; })
      .catch(() => {
        headerEl.innerHTML = `
          <header class="site-header">
            <div class="logo" onclick="window.location='index.html'">
              <div class="logo-mark">ગુ</div>
              <div class="logo-text">
                <span class="logo-en">GujPsych-Screen</span>
                <span class="logo-gu">ગુજસાઇક-સ્ક્રીન</span>
              </div>
            </div>
            <div class="header-right">
              <span class="badge">અનામી</span>
              <span class="badge">સ્વૈચ્છિક</span>
            </div>
          </header>`;
      });
  }

  if (footerEl) {
    fetch(base + 'footer.html')
      .then(r => r.text())
      .then(html => { footerEl.innerHTML = html; })
      .catch(() => {
        footerEl.innerHTML = `
          <footer class="site-footer">
            <div class="footer-inner">
              <p style="font-size:0.78rem;color:var(--text-muted);text-align:center;">
                GujPsych-Screen · સ્વૈચ્છિક · અનામી · iCall: <strong>9152987821</strong>
              </p>
            </div>
          </footer>`;
      });
  }
}

// Auto-load components when DOM is ready
document.addEventListener('DOMContentLoaded', loadComponents);
