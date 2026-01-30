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
app.use(helmet({ crossOriginResourcePolicy: false }));

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: false, // JWT in Authorization header -> no cookies needed
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);  

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
// if behind a reverse proxy in production (render/heroku/nginx)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
// Global rate limiter (anti-brute-force + general protection)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 300, // adjust as needed
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

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

// CORS error handler
app.use((err, req, res, next) => {
  if (err && err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS blocked for this origin" });
  }
  return next(err);
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
