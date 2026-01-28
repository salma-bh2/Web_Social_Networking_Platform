const express = require("express");
const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middlewares/auth.middleware");
const validateQuery = require("../middlewares/validateQuery.middleware");
const validateParams = require("../middlewares/validateParams.middleware");

const NotificationsController = require("../controllers/notifications.controller");
const {
  notificationsQuerySchema,
  notificationIdParamsSchema,
} = require("../validators/notifications.validators");

router.get( // GET http://localhost:4000/api/notifications
  "/notifications",
  authMiddleware,
  validateQuery(notificationsQuerySchema),
  asyncHandler(NotificationsController.list)
);

router.patch( // PATCH http://localhost:4000/api/notifications/:notificationId/read
  "/notifications/:notificationId/read",
  authMiddleware,
  validateParams(notificationIdParamsSchema),
  asyncHandler(NotificationsController.markRead)
);

router.patch( // PATCH http://localhost:4000/api/notifications/read-all
  "/notifications/read-all",
  authMiddleware,
  asyncHandler(NotificationsController.markAllRead)
);

module.exports = router;
