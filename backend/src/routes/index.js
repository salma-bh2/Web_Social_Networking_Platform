// backend/src/routes/index.js
const express = require("express");
const router = express.Router();


const authRoutes = require("./auth.routes");
const followsRoutes = require("./follows.routes");
const usersRoutes = require("./users.routes");
const threadsRoutes = require("./threads.routes");
const reactionsRoutes = require("./reactions.routes");
const feedRoutes = require("./feed.routes");
const notificationsRoutes = require("./notifications.routes");
const uploadsRoutes = require("./uploads.routes");
const settingsRoutes = require("./settings.routes");
const followsExtraRoutes = require("./followsExtra.routes")



router.use("/auth", authRoutes);
router.use("/users", usersRoutes);

router.use("/follows", followsRoutes); 
router.use("/social", followsExtraRoutes);

router.use("/threads", threadsRoutes);
router.use("/reactions", reactionsRoutes);
router.use("/feed", feedRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/uploads", uploadsRoutes);
router.use("/settings", settingsRoutes);


module.exports = router;
