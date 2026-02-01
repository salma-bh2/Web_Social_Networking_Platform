// backend/src/validators/reactions.validators.js
const { z } = require("zod");

const createReactionSchema = z.object({
  targetType: z.enum(["THREAD", "REPLY"]),
  targetId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  type: z.enum(["LIKE"]).optional().default("LIKE"),
});

module.exports = { createReactionSchema };
