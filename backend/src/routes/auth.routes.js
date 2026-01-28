// backend/src/routes/auth.routes.js
const express = require("express");
const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const validateBody = require("../middlewares/validate.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const AuthController = require("../controllers/auth.controller");
const { registerSchema, loginSchema } = require("../validators/auth.validators");

router.post("/register", validateBody(registerSchema), asyncHandler(AuthController.register));
router.post("/login", validateBody(loginSchema), asyncHandler(AuthController.login));
router.get("/me", authMiddleware, asyncHandler(AuthController.me));

module.exports = router;
