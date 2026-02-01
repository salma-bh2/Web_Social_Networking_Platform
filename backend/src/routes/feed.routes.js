// backend/src/routes/feed.routes.js
const express = require("express");
const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middlewares/auth.middleware");
const validateQuery = require("../middlewares/validateQuery.middleware");

const FeedController = require("../controllers/feed.controller");
const { feedQuerySchema } = require("../validators/feed.validators");

router.get( // GET http://localhost:4000/api/feed
  "/",
  authMiddleware,
  validateQuery(feedQuerySchema),
  asyncHandler(FeedController.get)
);

module.exports = router;
