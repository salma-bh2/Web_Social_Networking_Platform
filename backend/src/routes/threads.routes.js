//src/routes/threads.routes.js
const express = require("express");
const router = express.Router();


const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middlewares/auth.middleware");
const validateBody = require("../middlewares/validate.middleware");
const validateParams = require("../middlewares/validateParams.middleware");


const ThreadsController = require("../controllers/threads.controller");
const { createThreadSchema, threadIdParamsSchema } = require("../validators/threads.validators");
const { createReplySchema, replyIdParamsSchema } = require("../validators/replies.validators");

// create Threads
router.post( // POST http://localhost:4000/api/threads
  "/threads",
  authMiddleware,
  validateBody(createThreadSchema),
  asyncHandler(ThreadsController.create)
);

// get thread with replies
router.get( // GET http://localhost:4000/api/threads/:threadId
  "/threads/:threadId",
  authMiddleware,
  validateParams(threadIdParamsSchema),
  asyncHandler(ThreadsController.getOne)
);

// create Replies on threads
router.post( // POST http://localhost:4000/api/threads/:threadId/replies
  "/threads/:threadId/replies",
  authMiddleware,
  validateParams(threadIdParamsSchema),
  validateBody(createReplySchema),
  asyncHandler(ThreadsController.reply)
);

// delete thread
router.delete( // DELETE http://localhost:4000/api/threads/:threadId
  "/threads/:threadId",
  authMiddleware,
  validateParams(threadIdParamsSchema),
  asyncHandler(ThreadsController.remove)
);

// delete reply
router.delete( // DELETE http://localhost:4000/api/replies/:replyId
  "/replies/:replyId",
  authMiddleware,
  validateParams(replyIdParamsSchema),
  asyncHandler(ThreadsController.removeReply)
);


module.exports = router;
