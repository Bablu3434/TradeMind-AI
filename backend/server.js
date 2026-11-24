const connectDB = require("../database/db");
const express = require("express");
const cors = require("cors");
require("dotenv").config({
    path: __dirname + "/.env"
});

const app = express();

app.use(cors());
app.use(express.json());

// Temporary storage (MongoDB will be connected next)
let colorResults = [];

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "TradeMind AI Server Running Successfully!",
        status: "Active"
    });
});

// API health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "TradeMind AI API Connected"
    });
});

// Save color trading historical result
app.post("/api/color/results", (req, res) => {
    const { platform, color, number } = req.body;

    const validColors = ["Red", "Green", "Violet"];

    if (!platform || !validColors.includes(color)) {
        return res.status(400).json({
            success: false,
            message: "Invalid platform or color"
        });
    }

    if (
        number !== null &&
        number !== undefined &&
        (!Number.isInteger(number) || number < 0 || number > 9)
    ) {
        return res.status(400).json({
            success: false,
            message: "Number must be between 0 and 9"
        });
    }

    const record = {
        id: Date.now().toString(),
        platform,
        color,
        number: number ?? null,
        createdAt: new Date()
    };

    colorResults.push(record);

    res.status(201).json({
        success: true,
        message: "Historical result saved",
        data: record
    });
});

// Get historical results
app.get("/api/color/results", (req, res) => {
    res.json({
        success: true,
        total: colorResults.length,
        data: colorResults
    });
});

// Analyze historical frequency
app.get("/api/color/analysis", (req, res) => {
    const counts = {
        Red: 0,
        Green: 0,
        Violet: 0
    };

    colorResults.forEach(item => {
        counts[item.color]++;
    });

    const total = colorResults.length;

    const percentages = {};

    for (const color in counts) {
        percentages[color] = total
            ? Number(((counts[color] / total) * 100).toFixed(2))
            : 0;
    }

    res.json({
        success: true,
        total,
        counts,
        percentages,
        note: "Historical frequency is not a guarantee of future outcomes."
    });
});

// Stock analysis endpoint (market API not connected yet)
app.post("/api/stock/analyze", (req, res) => {
    const { symbol, market } = req.body;

    if (!symbol || !market) {
        return res.status(400).json({
            success: false,
            message: "Stock symbol and market are required"
        });
    }

    res.json({
        success: true,
        symbol,
        market,
        status: "Waiting for live market data provider",
        signal: null,
        message: "No trading signal generated. Connect a verified market data API first."
    });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`TradeMind AI running on port ${PORT}`);
    });
});