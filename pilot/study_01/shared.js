// shared.js

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwebPcV340Qj0PMG9Ox94RuTxMROCZ95BmwbDDeqIZ94WXhcrQY5319vA3zSlFSlIA-/exec";

function submitToSheets(data) {
  return fetch(APPS_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(res => {
    if (res.status !== "ok") {
      console.error("Submission error:", res);
    }
    return res;
  })
  .catch(err => {
    console.error("Network error:", err);
  });
}