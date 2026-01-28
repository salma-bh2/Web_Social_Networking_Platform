const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const FollowSchema = new Schema(
  {
    followerId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    followingId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: ["PENDING", "ACCEPTED"], default: "PENDING", index: true },
  },
  { timestamps: true }
);

// Empêche doublons: même follower -> même following
FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

module.exports = mongoose.model("Follow", FollowSchema);
