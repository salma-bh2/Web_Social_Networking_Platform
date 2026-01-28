const { z } = require("zod");

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const userIdParamsSchema = z.object({
  userId: objectIdSchema,
});

const updatePrivacySchema = z.object({
  isPrivate: z.boolean(),
});

const updateMeSchema = z.object({
  username: z.string().trim().min(3).max(30).optional(),
  bio: z.string().trim().max(300).optional(),
});

module.exports = { userIdParamsSchema, updatePrivacySchema, updateMeSchema };
