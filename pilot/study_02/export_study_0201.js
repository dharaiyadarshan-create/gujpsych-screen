// export_study_0201.js — Export Phase 1 (Baseline / T1) data

/**
 * 1. Builds the T1 payload (scales + sociodemo).
 * 2. Downloads a local JSON backup immediately.
 * 3. Submits fire-and-forget to Google Sheets via Apps Script.
 *
 * Called from sociodem_study_0201.js before navigating to result01.
 */
function runExport01() {
  const payload  = STUDY.buildExport(1);
  const pid      = STUDY.getPID();
  const filename = `study02_T1_${pid}_${Date.now()}.json`;

  STUDY.downloadJSON(payload, filename);   // local backup first
  STUDY.submitToSheets(payload);           // then send to Google Sheets

  console.log('[Export 01] Baseline data exported:', filename);
}
