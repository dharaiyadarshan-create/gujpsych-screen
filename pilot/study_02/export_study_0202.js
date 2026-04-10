// export_study_0202.js — Export Phase 2 (Follow-up 1 / T2) data

/**
 * 1. Builds the T2 payload (scales only, no sociodemo).
 * 2. Downloads a local JSON backup immediately.
 * 3. Submits fire-and-forget to Google Sheets via Apps Script.
 *
 * Called from WHO5WBI.html (last T2 scale) before navigating to result02.
 */
function runExport02() {
  const payload  = STUDY.buildExport(2);
  const pid      = STUDY.getPID();
  const filename = `study02_T2_${pid}_${Date.now()}.json`;

  STUDY.downloadJSON(payload, filename);   // local backup first
  STUDY.submitToSheets(payload);           // then send to Google Sheets

  console.log('[Export 02] Follow-up 1 data exported:', filename);
}
