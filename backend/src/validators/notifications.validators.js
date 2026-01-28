const { z } = require("zod");

const notificationIdParamsSchema = z.object({
  notificationId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
});

const notificationsQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : 20))
    .refine((n) => Number.isFinite(n) && n >= 1 && n <= 50, "limit must be 1..50"),
  cursor: z.string().optional(), // "<createdAtISO>|<objectId>"
});

module.exports = { notificationIdParamsSchema, notificationsQuerySchema };
