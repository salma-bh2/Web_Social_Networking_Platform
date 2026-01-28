// backend/src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
const rateLimit = require("express-rate-limit");
const path = require("path");
const uploadsDir = process.env.UPLOAD_DIR || "uploads";

const app = express();

// Global middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 300, // adjust as needed
    standardHeaders: true,
    legacyHeaders: false,
}));

// Route principale
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API platform social web !'
  });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});


app.use("/api", require("./routes"));
app.use("/uploads", express.static(path.resolve(uploadsDir)));



// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error-handling MW
app.use((err, req, res, next) => {
  console.error("[ERROR]", err);

  const status = err.statusCode || err.status || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error";

  res.status(status).json({ message });
});

module.exports = app;
