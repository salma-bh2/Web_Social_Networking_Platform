// src/validators/replies.validators.js
const { z } = require("zod");

const createReplySchema = z.object({
  content: z.string().trim().min(1).max(2000),
});

const replyIdParamsSchema = z.object({
  replyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
});

module.exports = { createReplySchema, replyIdParamsSchema };