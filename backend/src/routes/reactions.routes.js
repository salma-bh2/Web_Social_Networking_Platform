const express = require("express");
const router = express.Router();


const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middlewares/auth.middleware");
const validateBody = require("../middlewares/validate.middleware");


const ReactionsController = require("../controllers/reactions.controller");
const { createReactionSchema } = require("../validators/reactions.validators");

// toggle like
router.post(
  "/reactions/toggle-like",
  authMiddleware,
  validateBody(createReactionSchema),
  asyncHandler(ReactionsController.toggleLike)
);

module.exports = router;
