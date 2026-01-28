const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = process.env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const maxMb = Number(process.env.MAX_FILE_SIZE_MB || 10);
const maxBytes = maxMb * 1024 * 1024;

const allowed = (process.env.ALLOWED_IMAGE_MIME || "image/jpeg,image/png,image/webp")
  .split(",")
  .map((s) => s.trim());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ext || "";
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${safeExt}`);
  },
});

function fileFilter(req, file, cb) {
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Invalid file type"), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxBytes },
});

module.exports = { upload };
