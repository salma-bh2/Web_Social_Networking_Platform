// backend/src/validators/follows.validators.js
const { z } = require("zod");

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const followUserParamsSchema = z.object({
  userId: objectIdSchema,
});

const requestIdParamsSchema = z.object({
  requestId: objectIdSchema,
});

module.exports = {
  followUserParamsSchema,
  requestIdParamsSchema,
};
