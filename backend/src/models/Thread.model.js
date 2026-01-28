const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const ThreadSchema = new Schema(
  {
    authorId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    content: { type: String, required: true, trim: true, maxlength: 2000 },
    mediaUrls: [{ type: String }],
    visibility: { type: String, enum: ["PUBLIC", "FOLLOWERS"], default: "PUBLIC", index: true },
  },
  { timestamps: true }
);

ThreadSchema.index({ createdAt: -1 });
ThreadSchema.index({ authorId: 1, createdAt: -1 });

module.exports = mongoose.model("Thread", ThreadSchema);
