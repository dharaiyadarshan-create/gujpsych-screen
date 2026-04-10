// shared.js — Study 02 navigation & state management

const STUDY = (() => {
  const KEY_PHASE = 's02_phase';
  const KEY_DATA  = 's02_data';
  const KEY_PID   = 's02_pid';

  // ── Google Apps Script endpoint ──────────────────────────────────────────
  // After deploying Code.gs as a Web App, paste the /exec URL here.
  // Leave empty ('') to disable Google Sheets submission (local JSON only).
  const GAS_ENDPOINT = ''; // e.g. 'https://script.google.com/macros/s/XXXX/exec'

  // Scale order — same for T1 and T2
  const SCALE_FILES = [
    'ATSPPH_SF.html',
    'BEDS.html',
    'GHSQ.html',
    'MHLS.html',
    'WHO5WBI.html'
  ];

  // ── Phase (1 = T1 baseline, 2 = T2 follow-up 1, 3 = T3 follow-up 2)
  function getPhase()  { return parseInt(localStorage.getItem(KEY_PHASE) || '1'); }
  function setPhase(p) { localStorage.setItem(KEY_PHASE, String(p)); }

  // ── Participant code  (last-4-phone + DDMM-birthdate, e.g. "7823-1402")
  function getPID() { return localStorage.getItem(KEY_PID) || ''; }

  /**
   * Validate and store a manually-entered participant code.
   * Format: [4 phone digits][DD][MM]  — hyphen optional, e.g. "78231402" or "7823-1402"
   * Returns { ok: true, code } or { ok: false, msg }
   */
  function setCode(raw) {
    const code = raw.replace(/[-\s]/g, '');
    if (!/^\d{8}$/.test(code))
      return { ok: false, msg: 'Code must be exactly 8 digits (last 4 of phone + DDMM).' };
    const dd = parseInt(code.slice(4, 6), 10);
    const mm = parseInt(code.slice(6, 8), 10);
    if (dd < 1 || dd > 31)
      return { ok: false, msg: 'Day (positions 5–6) must be 01–31.' };
    if (mm < 1 || mm > 12)
      return { ok: false, msg: 'Month (positions 7–8) must be 01–12.' };
    localStorage.setItem(KEY_PID, code);
    return { ok: true, code };
  }

  /** True if a code has already been saved from T1. */
  function hasCode() { return !!localStorage.getItem(KEY_PID); }

  // ── Data storage
  function saveData(key, value) {
    const d = JSON.parse(localStorage.getItem(KEY_DATA) || '{}');
    d[key] = value;
    localStorage.setItem(KEY_DATA, JSON.stringify(d));
  }
  function loadData(key) {
    const d = JSON.parse(localStorage.getItem(KEY_DATA) || '{}');
    return key ? (d[key] ?? null) : d;
  }
  function clearAll() {
    [KEY_PHASE, KEY_DATA, KEY_PID].forEach(k => localStorage.removeItem(k));
  }

  // ── Form data collection
  function collectForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return {};
    const result = {};
    new FormData(form).forEach((v, k) => {
      result[k] = result[k] !== undefined ? [].concat(result[k], v) : v;
    });
    return result;
  }

  // ── Export builders
  function buildExport(phase) {
    const all = loadData();
    const prefix = `t${phase}_`;
    const phaseData = Object.fromEntries(
      Object.entries(all).filter(([k]) => k.startsWith(prefix) || k === 'sociodemo')
    );
    return {
      study: 'study_02',
      phase,
      participantId: getPID(),
      exportedAt: new Date().toISOString(),
      data: phaseData
    };
  }
  function buildFullExport() {
    return {
      study: 'study_02',
      phase: 3,                              // routes to T3_Data tab in Apps Script
      participantId: getPID(),
      exportedAt: new Date().toISOString(),
      allData: loadData()
    };
  }

  // ── Google Sheets submission ───────────────────────────────────────────────
  /**
   * Fire-and-forget POST to the Google Apps Script Web App.
   * Uses Content-Type: text/plain to avoid a CORS preflight OPTIONS request.
   * Response is always opaque (status 0) — success cannot be confirmed client-side.
   * Falls back gracefully when offline; local JSON download is the primary backup.
   */
  function submitToSheets(payload) {
    if (!GAS_ENDPOINT) {
      console.warn('[Study02] GAS_ENDPOINT not set — skipping Sheets submission.');
      return;
    }

    const pendingKey = 's02_pending_p' + payload.phase;
    try {
      localStorage.setItem(pendingKey, JSON.stringify(payload)); // mark as pending
    } catch (_) { /* storage full — non-fatal */ }

    fetch(GAS_ENDPOINT, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body:    JSON.stringify(payload)
    })
    .then(() => {
      localStorage.removeItem(pendingKey); // optimistic: assume dispatched
      console.log('[Study02] Sheets request dispatched for phase', payload.phase);
    })
    .catch(err => {
      console.warn('[Study02] Sheets network error (data saved locally):', err.message);
      // pendingKey stays — retryPending() will retry on next session
    });
  }

  /**
   * Retries any pending Sheets submissions from previous sessions.
   * Call this once on page load (e.g. in index_study_02.html).
   */
  function retryPending() {
    [1, 2, 3].forEach(phase => {
      const key     = 's02_pending_p' + phase;
      const stored  = localStorage.getItem(key);
      if (!stored) return;
      try {
        const payload = JSON.parse(stored);
        console.log('[Study02] Retrying pending phase', phase, 'submission');
        submitToSheets(payload);
      } catch (_) {
        localStorage.removeItem(key); // corrupt — discard
      }
    });
  }
  function downloadJSON(obj, filename) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  }

  // ── Scale routing
  // Returns next page after the given scale.
  //   Phase 1 last scale → sociodem
  //   Phase 2 last scale → '__export02__' (handled inline by WHO5WBI)
  function nextAfterScale(currentFile) {
    const i = SCALE_FILES.indexOf(currentFile);
    if (i === -1) return 'index_study_02.html';
    if (i < SCALE_FILES.length - 1) return SCALE_FILES[i + 1];
    return getPhase() === 1 ? 'sociodem_study_0201.html' : '__export02__';
  }
  function prevBeforeScale(currentFile) {
    const i = SCALE_FILES.indexOf(currentFile);
    if (i <= 0) return getPhase() === 1 ? 'index_study_02.html' : 'Consent0203.html';
    return SCALE_FILES[i - 1];
  }

  function go(url) { window.location.href = url; }

  return {
    getPhase, setPhase,
    getPID, setCode, hasCode,
    saveData, loadData, clearAll,
    collectForm,
    buildExport, buildFullExport, downloadJSON,
    submitToSheets, retryPending,
    nextAfterScale, prevBeforeScale,
    go,
    SCALES: SCALE_FILES
  };
})();
