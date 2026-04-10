// export_study_0203.js — Export Phase 3 (Follow-up 2 / T3) full data

/**
 * 1. Builds a FULL payload containing all data from all phases.
 * 2. Downloads a local JSON backup immediately.
 * 3. Submits fire-and-forget to Google Sheets via Apps Script → T3_Data tab.
 *
 * buildFullExport() includes phase:3 so Apps Script routes to T3_Data.
 * Called from Consent0204.html before showing the thank-you message.
 */
function runExport03() {
  const payload  = STUDY.buildFullExport();
  const pid      = STUDY.getPID();
  const filename = `study02_T3_FULL_${pid}_${Date.now()}.json`;

  STUDY.downloadJSON(payload, filename);   // local backup first
  STUDY.submitToSheets(payload);           // then send to Google Sheets

  console.log('[Export 03] Full study data exported:', filename);
}
