const express = require("express");
const router = express.Router();


const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middlewares/auth.middleware");
const validateBody = require("../middlewares/validate.middleware");
const validateParams = require("../middlewares/validateParams.middleware");


const ThreadsController = require("../controllers/threads.controller");
const { createThreadSchema, threadIdParamsSchema } = require("../validators/threads.validators");
const { createReplySchema } = require("../validators/replies.validators");

// create Threads
router.post(
  "/threads",
  authMiddleware,
  validateBody(createThreadSchema),
  asyncHandler(ThreadsController.create)
);

// get thread with replies
router.get(
  "/threads/:threadId",
  authMiddleware,
  validateParams(threadIdParamsSchema),
  asyncHandler(ThreadsController.getOne)
);

// create Replies on threads
router.post(
  "/threads/:threadId/replies",
  authMiddleware,
  validateParams(threadIdParamsSchema),
  validateBody(createReplySchema),
  asyncHandler(ThreadsController.reply)
);

// delete thread
router.delete(
  "/threads/:threadId",
  authMiddleware,
  validateParams(threadIdParamsSchema),
  asyncHandler(ThreadsController.remove)
);

module.exports = router;
