const express = require("express");
const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middlewares/auth.middleware");
const validateBody = require("../middlewares/validate.middleware");

const SettingsController = require("../controllers/settings.controller");
const { updateSettingsSchema } = require("../validators/settings.validators");

router.get(      // GET http://localhost:4000/api/settings/me
  "/settings/me",
  authMiddleware,
  asyncHandler(SettingsController.getMe)
);

router.patch(      // PATCH http://localhost:4000/api/settings/me   
  "/settings/me",
  authMiddleware,
  validateBody(updateSettingsSchema),
  asyncHandler(SettingsController.updateMe)
);

module.exports = router;
