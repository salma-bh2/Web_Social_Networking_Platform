// backend/src/validators/feed.validators.js
const { z } = require("zod");

const feedQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : 20))
    .refine((n) => Number.isFinite(n) && n >= 1 && n <= 50, "limit must be 1..50"),
  cursor: z.string().optional(), // format: "<createdAtISO>|<objectId>"
});

module.exports = { feedQuerySchema };
