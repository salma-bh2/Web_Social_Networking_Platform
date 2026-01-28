// backend/src/models/User.model.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    isPrivate: { type: Boolean, default: false },
    settings: {
      notificationsPrefs: {
        followRequest: { type: Boolean, default: true },
        followAccepted: { type: Boolean, default: true },
        reply: { type: Boolean, default: true },
        likeThread: { type: Boolean, default: true },
        likeReply: { type: Boolean, default: true },
      },
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
