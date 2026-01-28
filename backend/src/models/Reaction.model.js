const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const ReactionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    targetType: { type: String, enum: ["THREAD", "REPLY"], required: true, index: true },
    targetId: { type: Types.ObjectId, required: true, index: true },
    type: { type: String, enum: ["LIKE"], default: "LIKE" },
  },
  { timestamps: true }
);

ReactionSchema.index({ targetType: 1, targetId: 1 });
ReactionSchema.index({ userId: 1, targetType: 1, targetId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Reaction", ReactionSchema);
