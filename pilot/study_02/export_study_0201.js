// export_study_0201.js 

function runExport01() {
  // 1. Ensure the 8-digit ID is valid before exporting
  const pid = STUDY.getPID(); 
  
  if (!pid || pid.length !== 8) {
    console.error('[Export 01] Error: Invalid or missing Participant ID.');
    return; // Stop export if ID is corrupted
  }

  // 2. Build the payload including Socio-demo and Scales
  const payload = STUDY.buildExport(1);
  
  // 3. Tweak: Force the 8-digit ID into the payload root for easy Sheet mapping
  payload.participantID = pid;
  payload.phase = "Baseline_T1";
  payload.submittedAt = new Date().toISOString();

  const filename = `study02_T1_${pid}_${Date.now()}.json`;

  // 4. Execution
  STUDY.downloadJSON(payload, filename); 
  STUDY.submitToSheets(payload); 

  console.log('[Export 01] 8-digit ID mapped and exported:', pid);
}