const { z } = require("zod");

const createReplySchema = z.object({
  content: z.string().trim().min(1).max(2000),
});

module.exports = { createReplySchema };
