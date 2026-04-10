/**
 * Code.gs — Google Apps Script Web App for Study 02
 *
 * ─── SETUP INSTRUCTIONS ────────────────────────────────────────────────────
 *
 *  1. Create a new Google Spreadsheet.
 *     Copy its ID from the URL (the long string between /d/ and /edit).
 *     Paste it as the value of SHEET_ID below.
 *
 *  2. In the Spreadsheet, open:  Extensions → Apps Script
 *     Paste the entire contents of this file into the editor. Save (Ctrl+S).
 *
 *  3. Deploy as a Web App:
 *     Click  Deploy → New deployment
 *     • Type              : Web App
 *     • Execute as        : Me  (your Google account)
 *     • Who has access    : Anyone
 *     Click Deploy → Authorize the app when prompted.
 *
 *  4. Copy the Web App URL  (ends with  /exec)
 *     Open  shared.js  in your study folder and paste it as the value of
 *     GAS_ENDPOINT at the top of the file.
 *
 *  5. EVERY TIME you edit this file, you must deploy a NEW VERSION:
 *     Deploy → Manage deployments → pencil icon → "New version" → Deploy
 *     (Editing without a new version does NOT update the live endpoint.)
 *
 *  6. Test: open your study's index_study_02.html in a browser and complete
 *     a test run. Three sheet tabs will be created automatically:
 *       T1_Data, T2_Data, T3_Data, Submission_Log
 *
 * ────────────────────────────────────────────────────────────────────────────
 */

// ── Configuration ──────────────────────────────────────────────────────────

/** Paste your Google Spreadsheet ID here */
const SHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

/** Sheet tab names — must match the phase numbers in the study */
const TAB = {
  1:   'T1_Data',
  2:   'T2_Data',
  3:   'T3_Data',
  log: 'Submission_Log'
};


// ── Entry points ───────────────────────────────────────────────────────────

/**
 * Receives POST requests from the HTML study pages.
 * Content-Type: text/plain  →  body is in e.postData.contents
 * Always returns HTTP 200 with a JSON body.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // prevent concurrent writes corrupting the header row

  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Empty request body');
    }

    const payload = JSON.parse(e.postData.contents);
    validatePayload(payload);

    const ss = SpreadsheetApp.openById(SHEET_ID);
    writeData(ss, payload);
    writeLog(ss, payload, 'OK');

    return jsonResponse({ status: 'ok', participantId: payload.participantId });

  } catch (err) {
    try {
      const ss = SpreadsheetApp.openById(SHEET_ID);
      writeLog(ss, null, 'ERROR: ' + err.message);
    } catch (_) { /* logging failure is non-fatal */ }

    return jsonResponse({ status: 'error', message: err.message });

  } finally {
    lock.releaseLock();
  }
}

/** Simple test endpoint — visit the /exec URL in a browser to confirm it runs */
function doGet() {
  return ContentService
    .createTextOutput('Study 02 Apps Script endpoint is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}


// ── Sheet writing ──────────────────────────────────────────────────────────

function writeData(ss, payload) {
  const tabName = TAB[payload.phase];
  if (!tabName) throw new Error('Unknown phase: ' + payload.phase);

  let sheet = ss.getSheetByName(tabName);
  if (!sheet) sheet = ss.insertSheet(tabName);

  const flat = flattenPayload(payload);

  // ── Header management ────────────────────────────────────────────────────
  // Read existing headers (row 1). Add any new columns from this submission.
  let headers = [];
  if (sheet.getLastRow() > 0) {
    headers = sheet.getRange(1, 1, 1, sheet.getLastColumn())
                   .getValues()[0]
                   .filter(String); // remove trailing empty cells
  }

  const newKeys = Object.keys(flat).filter(k => !headers.includes(k));
  if (newKeys.length > 0) {
    const updatedHeaders = [...headers, ...newKeys];
    sheet.getRange(1, 1, 1, updatedHeaders.length).setValues([updatedHeaders]);
    headers = updatedHeaders;
  }

  // ── Data row (aligned to current headers) ────────────────────────────────
  const row = headers.map(h => (flat[h] !== undefined ? flat[h] : ''));
  sheet.appendRow(row);
}


// ── Logging ────────────────────────────────────────────────────────────────

function writeLog(ss, payload, status) {
  let sheet = ss.getSheetByName(TAB.log);
  if (!sheet) {
    sheet = ss.insertSheet(TAB.log);
    sheet.appendRow(['timestamp', 'participantId', 'phase', 'study', 'status']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  }
  sheet.appendRow([
    new Date().toISOString(),
    payload ? payload.participantId : 'UNKNOWN',
    payload ? String(payload.phase) : '',
    payload ? payload.study         : '',
    status
  ]);
}


// ── Payload flattening ─────────────────────────────────────────────────────

/**
 * Converts a buildExport / buildFullExport payload into a flat key→value map.
 *
 * Input:
 *   { study, phase, participantId, exportedAt,
 *     data: { t1_atspph: { q1:'2', q2:'3' }, sociodemo: { age:'25' }, ... } }
 *
 * Output:
 *   { participantId:'78231402', phase:1, study:'study_02', exportedAt:'...',
 *     't1_atspph.q1':'2', 't1_atspph.q2':'3', 'sociodemo.age':'25', ... }
 *
 * buildFullExport uses `allData` instead of `data` — both are handled.
 */
function flattenPayload(payload) {
  const flat = {
    participantId: payload.participantId || '',
    exportedAt:    payload.exportedAt    || new Date().toISOString(),
    study:         payload.study         || 'study_02',
    phase:         payload.phase         || ''
  };

  const dataSource = payload.data || payload.allData || {};

  for (const [scaleKey, scaleObj] of Object.entries(dataSource)) {
    if (scaleObj !== null && typeof scaleObj === 'object' && !Array.isArray(scaleObj)) {
      for (const [itemKey, itemVal] of Object.entries(scaleObj)) {
        // Skip internal metadata keys
        if (itemKey === '_savedAt') continue;
        flat[scaleKey + '.' + itemKey] = stringify(itemVal);
      }
    } else {
      flat[scaleKey] = stringify(scaleObj);
    }
  }

  return flat;
}

function stringify(v) {
  if (v === null || v === undefined) return '';
  if (Array.isArray(v)) return v.join('; ');
  return String(v);
}


// ── Validation ─────────────────────────────────────────────────────────────

function validatePayload(p) {
  if (!p.participantId)
    throw new Error('Missing participantId');
  if (![1, 2, 3].includes(Number(p.phase)))
    throw new Error('Invalid phase value: ' + p.phase);
}


// ── Response helper ────────────────────────────────────────────────────────

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
