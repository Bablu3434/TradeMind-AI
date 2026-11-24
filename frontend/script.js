
// =====================================
// TradeMind AI - Frontend JavaScript
// =====================================

const API_URL = "http://localhost:5000";

const analysisHistory = [];

// =====================================
// 1. NAVIGATION
// =====================================

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    document.getElementById(pageId).classList.add("active-page");

    document.querySelectorAll(".sidebar nav a").forEach(link => {
        link.classList.toggle(
            "active",
            link.dataset.section === pageId
        );
    });
}

document.querySelectorAll(".sidebar nav a").forEach(link => {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        showPage(this.dataset.section);

    });

});


// =====================================
// 2. STOCK MARKET ANALYSIS API
// =====================================

async function analyzeStock() {

    const symbol = document.getElementById("stockSymbol")
        .value.trim().toUpperCase();

    const market = document.getElementById("stockMarket").value;

    const result = document.getElementById("stockResult");

    if (!symbol) {

        result.textContent = "Please enter a stock symbol.";

        return;
    }

    result.textContent = "Connecting to TradeMind AI...";

    try {

        const response = await fetch(
            `${API_URL}/api/stock/analyze`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    symbol,
                    market
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message || "Stock analysis failed");

        }

        result.innerHTML = `
            <h3>Stock Analysis Request</h3>

            <p>Symbol: ${escapeHTML(data.symbol)}</p>

            <p>Market: ${escapeHTML(data.market)}</p>

            <p>Status: ${escapeHTML(data.status)}</p>

            <p>${escapeHTML(data.message)}</p>

            <p>Trading Signal: Not Available Yet</p>
        `;

        addHistory(`Stock analysis requested: ${symbol}`);

    } catch (error) {

        result.textContent = "Backend Error: " + error.message;

    }

}


// =====================================
// 3. ADD COLOR TRADING RESULT
// =====================================

async function addColorResult() {

    const platform = document.getElementById("platform").value;

    const color = document.getElementById("colorInput").value;

    const numberInput = document.getElementById("colorNumber").value;

    const number = numberInput === ""
        ? null
        : Number(numberInput);

    const result = document.getElementById("colorResult");

    if (
        number !== null &&
        (!Number.isInteger(number) || number < 0 || number > 9)
    ) {

        alert("Number must be between 0 and 9.");

        return;
    }

    result.textContent = "Saving historical result...";

    try {

        const response = await fetch(
            `${API_URL}/api/color/results`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    platform,
                    color,
                    number
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message || "Unable to save result");

        }

        result.textContent =
            "Successfully saved to backend!";

        addHistory(
            `${platform}: ${color}, Number: ${number ?? "Not entered"}`
        );

        document.getElementById("colorNumber").value = "";

    } catch (error) {

        result.textContent = "Backend Error: " + error.message;

    }

}


// =====================================
// 4. COLOR TRADING HISTORY ANALYSIS
// =====================================

async function analyzeColor() {

    const result = document.getElementById("colorResult");

    result.textContent = "Analyzing historical results...";

    try {

        const response = await fetch(
            `${API_URL}/api/color/analysis`
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message || "Analysis failed");

        }

        result.innerHTML = `
            <h3>Historical Color Analysis</h3>

            <p>Total Results: ${data.total}</p>

            <p>
                Red: ${data.counts.Red}
                (${data.percentages.Red}%)
            </p>

            <p>
                Green: ${data.counts.Green}
                (${data.percentages.Green}%)
            </p>

            <p>
                Violet: ${data.counts.Violet}
                (${data.percentages.Violet}%)
            </p>

            <hr>

            <p>
                ${escapeHTML(data.note)}
            </p>
        `;

        addHistory(
            `Color analysis completed: ${data.total} records`
        );

    } catch (error) {

        result.textContent = "Backend Error: " + error.message;

    }

}


// =====================================
// 5. ANALYSIS HISTORY
// =====================================

function addHistory(message) {

    analysisHistory.unshift({

        message,

        time: new Date().toLocaleString()

    });

    renderHistory();

}


function renderHistory() {

    const container = document.getElementById("historyList");

    if (!container) return;

    container.innerHTML = analysisHistory.length

        ? analysisHistory.map(item => `

            <div style="
                padding:12px 0;
                border-bottom:1px solid #34425d;
            ">

                <p>${escapeHTML(item.message)}</p>

                <small>${escapeHTML(item.time)}</small>

            </div>

        `).join("")

        : "No analysis available yet.";

}


// =====================================
// 6. SECURITY - HTML ESCAPING
// =====================================

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, char => ({

        "&": "&amp;",

        "<": "&lt;",

        ">": "&gt;",

        '"': "&quot;",

        "'": "&#39;"

    })[char]);

}


// =====================================
// 7. CONNECTION STATUS
// =====================================

async function checkBackend() {

    try {

        const response = await fetch(
            `${API_URL}/api/health`
        );

        const data = await response.json();

        if (data.success) {

            console.log("TradeMind AI Backend Connected!");

        }

    } catch (error) {

        console.error(
            "Backend connection failed:",
            error.message
        );

    }

}


// =====================================
// APPLICATION START
// =====================================

checkBackend();

console.log("TradeMind AI Frontend Loaded Successfully!");
