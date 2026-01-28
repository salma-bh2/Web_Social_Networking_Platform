const express = require("express");
const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middlewares/auth.middleware");
const { upload } = require("../config/multer");
const validateParams = require("../middlewares/validateParams.middleware");

const UploadsController = require("../controllers/uploads.controller");
const { filenameParamsSchema } = require("../validators/uploads.validators");


// Thread media upload: POST http://localhost:4000/uploads/thread-media
router.post(
  "/uploads/thread-media",
  authMiddleware,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    return res.status(201).json({ url: `/uploads/${req.file.filename}` });
  })
);


// DELETE file: DELETE http://localhost:4000/uploads/:filename
router.delete(
  "/uploads/:filename",
  authMiddleware,
  validateParams(filenameParamsSchema),
  asyncHandler(UploadsController.remove)
);


module.exports = router;
