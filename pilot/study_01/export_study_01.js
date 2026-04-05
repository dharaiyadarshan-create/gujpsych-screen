// pilot/export.js
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyAL1vmE7HFAMHLhLwq1iEdlCJ3dzRslI8rxyqSCD7uKbYCr9jxbsPFhPPq9voC03Fjew/exec";

/**
 * Sends Scale data (PHQ-9, GAD-7, ACE-IQ, etc.)
 */
async function uploadScaleData(token, scaleName, score, band, itemsArray, impairment = "") {
    const payload = {
        type: "scale",
        token: token,
        scale: scaleName,
        score: score,
        band: band,
        items: itemsArray, // This handles your 25 items for ACE-IQ
        functional_impairment: impairment
    };

    return sendToGoogle(payload);
}

/**
 * Sends Sociodemographic data
 */
async function uploadSocioDemData(token, socioData) {
    const payload = {
        type: "sociodemographic",
        token: token,
        sociodemographic: socioData
    };

    return sendToGoogle(payload);
}

// Internal helper to handle the Fetch API
async function sendToGoogle(payload) {
    try {
        await fetch(APPS_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        console.log("Data sent to Google successfully.");
    } catch (error) {
        console.error("Export failed:", error);
    }
}