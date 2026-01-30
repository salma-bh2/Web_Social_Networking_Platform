const express = require("express");
const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middlewares/auth.middleware");
const validateParams = require("../middlewares/validateParams.middleware");
// si tu n'as pas ce fichier, dis-le
const validateQuery = require("../middlewares/validateQuery.middleware");

const FollowsExtraController = require("../controllers/followsExtra.controller");
const { userIdParamsSchema, listQuerySchema } = require("../validators/followsExtra.validators");

router.get(
  "/users/:userId/followers",
  authMiddleware,
  validateParams(userIdParamsSchema),
  validateQuery(listQuerySchema),
  asyncHandler(FollowsExtraController.followers)
);

router.get(
  "/users/:userId/following",
  authMiddleware,
  validateParams(userIdParamsSchema),
  validateQuery(listQuerySchema),
  asyncHandler(FollowsExtraController.following)
);

module.exports = router;
