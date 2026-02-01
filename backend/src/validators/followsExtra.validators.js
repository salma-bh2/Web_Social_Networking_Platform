// backend/src/validators/followsExtra.validators.js
const { z } = require("zod");

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const userIdParamsSchema = z.object({
  userId: objectIdSchema,
});

const listQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : 50))
    .refine((n) => Number.isFinite(n) && n >= 1 && n <= 100, "limit must be 1..100"),
});

module.exports = { userIdParamsSchema, listQuerySchema };
