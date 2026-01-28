const express = require("express");
const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middlewares/auth.middleware");
const validateBody = require("../middlewares/validate.middleware");
const validateParams = require("../middlewares/validateParams.middleware");


const UsersController = require("../controllers/users.controller");
const { userIdParamsSchema, updateMeSchema, updatePrivacySchema } = require("../validators/users.validators");
const { upload } = require("../config/multer");



router.get( // GET http://localhost:4000/users/:userId
  "/:userId",
  authMiddleware,
  validateParams(userIdParamsSchema),
  asyncHandler(UsersController.getProfile)
);



// Edit me: PATCH http://localhost:4000/users/me
router.patch(
  "/me",
  authMiddleware,
  validateBody(updateMeSchema),
  asyncHandler(UsersController.updateMe)
);



router.patch( // PATCH http://localhost:4000/users/me/privacy
  "/me/privacy",
  authMiddleware,
  validateBody(updatePrivacySchema),
  asyncHandler(UsersController.updatePrivacy)
);


router.post( // POST http://localhost:4000/users/me/avatar
  "/me/avatar",
  authMiddleware,
  upload.single("avatar"),
  asyncHandler(UsersController.uploadAvatar)
);

module.exports = router;
