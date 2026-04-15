// shared.js — Study 02 ID Management & Export Logic

const STUDY = (() => {
  const KEY_PID   = 's02_pid';
  const KEY_DATA  = 's02_data';
  const GAS_ENDPOINT = 'YOUR_DEPLOYED_APPS_SCRIPT_URL'; // Paste your URL here

  // ── 1. Participant ID Logic (8-Digit Numerical) ──────────────────────────
  
  /** Returns the stored 8-digit ID */
  function getPID() { return localStorage.getItem(KEY_PID) || ''; }

  /**
   * Enforces format: [4 phone digits][DD][MM]
   * Ensures exactly 8 numerical digits only.
   */
  function setCode(raw) {
    const code = raw.replace(/[-\s]/g, ''); // Remove hyphens/spaces
    
    // Validate: Must be exactly 8 digits
    if (!/^\d{8}$/.test(code)) {
      return { ok: false, msg: 'Code must be exactly 8 digits.' };
    }

    // Validate: DD (01-31) and MM (01-12)
    const dd = parseInt(code.slice(4, 6), 10);
    const mm = parseInt(code.slice(6, 8), 10);
    
    if (dd < 1 || dd > 31) return { ok: false, msg: 'Invalid Day (DD).' };
    if (mm < 1 || mm > 12) return { ok: false, msg: 'Invalid Month (MM).' };

    localStorage.setItem(KEY_PID, code);
    return { ok: true, code };
  }

  // ── 2. Data Export & Storage Logic ────────────────────────────────────────

  /** Saves individual scale/form data to local storage */
  function saveData(key, value) {
    const d = JSON.parse(localStorage.getItem(KEY_DATA) || '{}');
    d[key] = value;
    localStorage.setItem(KEY_DATA, JSON.stringify(d));
  }

  /** Builds the final payload for T1/Baseline */
  function buildExport(phase = 1) {
    const allData = JSON.parse(localStorage.getItem(KEY_DATA) || '{}');
    return {
      study: 'study_02',
      phase: phase,
      participantId: getPID(), // Uses the 8-digit numerical code
      exportedAt: new Date().toISOString(),
      data: allData
    };
  }

  /**
   * Google Sheets Submission
   * Fire-and-forget POST to Apps Script.
   */
  function submitToSheets(payload) {
    if (!GAS_ENDPOINT) return console.warn('No GAS_ENDPOINT set.');

    fetch(GAS_ENDPOINT, {
      method:  'POST',
      mode:    'no-cors', // Prevents CORS issues with Google Apps Script
      headers: { 'Content-Type': 'text/plain' },
      body:    JSON.stringify(payload)
    })
    .then(() => console.log('[Export] Dispatched to Sheets for ID:', payload.participantId))
    .catch(err => console.error('[Export] Network error:', err));
  }

  /** Triggers a local JSON file download as a backup */
  function downloadJSON(obj, filename) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  }

  return {
    getPID, setCode, 
    saveData, buildExport, 
    submitToSheets, downloadJSON
  };
})();