/**
 * GujPsych-Screen — Google Apps Script Receiver
 * Paste this into script.google.com → New Project
 *
 * SETUP:
 * 1. Paste your full Google Sheet URL OR just the Sheet ID below
 * 2. Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 3. Copy the Web App URL into shared.js APPS_SCRIPT_URL
 */

// Paste either the full URL or just the ID — both work
const SHEET_ID_OR_URL = 'YOUR_GOOGLE_SHEET_URL_OR_ID_HERE';

// Extracts ID from full URL if needed — do not edit this
function getSheetId() {
  const s = SHEET_ID_OR_URL;
  const match = s.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : s;
}

function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    const ss    = SpreadsheetApp.openById(getSheetId());
    const type  = data.type || 'scale';

    if (type === 'scale') {
      writeScale(ss, data);
    } else if (type === 'sociodemographic') {
      writeSocioDem(ss, data);
    }

    return ok();

  } catch(err) {
    return error(err.message);
  }
}

// ── SCALE DATA ────────────────────────────────────────────────
function writeScale(ss, d) {
  const sheet = getOrCreateSheet(ss, 'scale_data');

  // Write header row if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'timestamp', 'token', 'scale', 'score', 'band',
      'item_1','item_2','item_3','item_4','item_5',
      'item_6','item_7','item_8','item_9',
      'functional_impairment'
    ]);
  }

  sheet.appendRow([
    new Date(),
    d.token                || '',
    d.scale                || '',
    d.score                ?? '',
    d.band                 || '',
    ...(d.items            || new Array(9).fill('')),
    d.functional_impairment || ''
  ]);
}

// ── SOCIODEM DATA ─────────────────────────────────────────────
function writeSocioDem(ss, d) {
  const sheet = getOrCreateSheet(ss, 'sociodem_data');
  const sd    = d.sociodemographic || {};

  // Write header row if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'timestamp', 'token',
      'age', 'gender', 'marital_status', 'marriage_duration',
      'religion', 'residence', 'family_type', 'birth_order',
      'education', 'occupation', 'income',
      'physical_illness', 'substance_use', 'mental_health_treatment'
    ]);
  }

  sheet.appendRow([
    new Date(),
    d.token                        || '',
    sd.age                         || '',
    sd.gender                      || '',
    sd.marital_status              || '',
    sd.marriage_duration           || '',
    sd.religion                    || '',
    sd.residence                   || '',
    sd.family_type                 || '',
    sd.birth_order                 || '',
    sd.education                   || '',
    sd.occupation                  || '',
    sd.income                      || '',
    sd.physical_illness            || '',
    sd.substance_use               || '',
    sd.mental_health_treatment     || ''
  ]);
}

// ── HELPERS ───────────────────────────────────────────────────
function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}

function ok() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function error(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'error', message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── TEST FUNCTION (run manually to verify sheet access) ───────
function testSheetAccess() {
  const ss = SpreadsheetApp.openById(getSheetId());
  Logger.log('Sheet name: ' + ss.getName());
  Logger.log('Tabs: ' + ss.getSheets().map(s => s.getName()).join(', '));
}