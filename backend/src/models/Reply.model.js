const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const ReplySchema = new Schema(
  {
    threadId: { type: Types.ObjectId, ref: "Thread", required: true, index: true },
    authorId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    content: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

ReplySchema.index({ threadId: 1, createdAt: 1 });

module.exports = mongoose.model("Reply", ReplySchema);
