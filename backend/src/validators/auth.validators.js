// backend/src/validators/auth.validators.js
const { z } = require("zod");

const registerSchema = z.object({
  username: z.string().trim().min(3).max(30),
  email: z.string().trim().email(),
  password: z.string().min(8).max(72)
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(72)
});

module.exports = { registerSchema, loginSchema };
