const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20, // 20 attempts / 15min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many auth attempts, please try again later." },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 registrations/hour/IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many registrations, please try again later." },
});

const uploadsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 60, // uploads are heavier
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many upload requests, please slow down." },
});

const writeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 120, // basic anti-spam
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please slow down." },
});

module.exports = { authLimiter, registerLimiter, uploadsLimiter, writeLimiter };
