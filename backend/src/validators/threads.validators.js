// backend/src/validators/threads.validators.js
const { z } = require("zod");

const createThreadSchema = z.object({
  content: z.string().trim().min(1).max(2000),

  // accepte "/uploads/xxx.jpg" ou une URL complète
  mediaUrls: z
    .array(
      z
        .string()
        .trim()
        .refine(
          (v) =>
            v.startsWith("/uploads/") ||
            /^https?:\/\/.+/i.test(v),
          "mediaUrl must be a '/uploads/...' path or a full http(s) URL"
        )
    )
    .optional()
    .default([]),

  visibility: z.enum(["PUBLIC", "FOLLOWERS"]).optional().default("PUBLIC"),
});


const threadIdParamsSchema = z.object({
  threadId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
});

module.exports = { createThreadSchema, threadIdParamsSchema };
