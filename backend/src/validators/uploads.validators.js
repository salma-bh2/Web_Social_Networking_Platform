const { z } = require("zod");

const avatarUploadQuerySchema = z.object({}).optional();

const filenameParamsSchema = z.object({
  filename: z.string().min(1).max(255),
});


module.exports = {
  avatarUploadQuerySchema,
  filenameParamsSchema
};
