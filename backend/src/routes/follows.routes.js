const express = require("express");
const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middlewares/auth.middleware");
const validateParams = require("../middlewares/validateParams.middleware");

const FollowsController = require("../controllers/follows.controller");
const {
  followUserParamsSchema,
  requestIdParamsSchema,
} = require("../validators/follows.validators");

// follow user POST http://localhost:4000/api/follows/users/:userId/follow
router.post(
    "/users/:userId/follow",
    authMiddleware,
    validateParams(followUserParamsSchema),
    asyncHandler(FollowsController.followUser)
);

// unfollow user DELETE http://localhost:4000/api/follows/users/:userId/follow
router.delete(
    "/users/:userId/follow",
    authMiddleware,
    validateParams(followUserParamsSchema),
    asyncHandler(FollowsController.unfollowUser)
);

// requests received by me GET http://localhost:4000/api/follows/follow-requests
router.get(
  "/follow-requests",
  authMiddleware,
  asyncHandler(FollowsController.getMyRequests)
);

// requests accept POST http://localhost:4000/api/follows/follow-requests/:requestId/accept
router.post(
  "/follow-requests/:requestId/accept",
  authMiddleware,
  validateParams(requestIdParamsSchema),
  asyncHandler(FollowsController.accept)
);

// requests reject POST http://localhost:4000/api/follows/follow-requests/:requestId/reject
router.post(
  "/follow-requests/:requestId/reject",
  authMiddleware,
  validateParams(requestIdParamsSchema),
  asyncHandler(FollowsController.reject)
);

module.exports = router;
