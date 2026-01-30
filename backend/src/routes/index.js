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
router.use("/", followsRoutes); // contient /users/:id/follow et /follow-requests...
router.use("/users", usersRoutes); // contient /users/me/privacy
router.use("/", threadsRoutes);
router.use("/", reactionsRoutes);
router.use("/", feedRoutes);
router.use("/", notificationsRoutes);
router.use("/", uploadsRoutes);
router.use("/", settingsRoutes);
router.use("/", followsExtraRoutes);


module.exports = router;
