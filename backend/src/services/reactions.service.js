const Reaction = require("../models/Reaction.model");
const Thread = require("../models/Thread.model");
const Reply = require("../models/Reply.model");
const Follow = require("../models/Follow.model");
const NotificationsService = require("./notifications.service");


async function canReact({ userId, targetType, targetId }) {
  if (targetType === "THREAD") {
    const thread = await Thread.findById(targetId).select("_id authorId visibility");
    if (!thread) {
      const err = new Error("Thread not found");
      err.status = 404;
      throw err;
    }

    if (thread.visibility === "PUBLIC") return true;
    if (thread.authorId.toString() === userId.toString()) return true;

    const rel = await Follow.findOne({
      followerId: userId,
      followingId: thread.authorId,
      status: "ACCEPTED",
    }).select("_id");

    if (!rel) {
      const err = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    return true;
  }

  // REPLY: inherit thread visibility
  const reply = await Reply.findById(targetId).select("_id threadId");
  if (!reply) {
    const err = new Error("Reply not found");
    err.status = 404;
    throw err;
  }

  const thread = await Thread.findById(reply.threadId).select("_id authorId visibility");
  if (!thread) {
    const err = new Error("Thread not found");
    err.status = 404;
    throw err;
  }

  if (thread.visibility === "PUBLIC") return true;
  if (thread.authorId.toString() === userId.toString()) return true;

  const rel = await Follow.findOne({
    followerId: userId,
    followingId: thread.authorId,
    status: "ACCEPTED",
  }).select("_id");

  if (!rel) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }
  return true;
}

async function toggleLike({ userId, targetType, targetId }) {
  await canReact({ userId, targetType, targetId });

  const existing = await Reaction.findOne({
    userId,
    targetType,
    targetId,
    type: "LIKE",
  });

  if (existing) {
    await Reaction.deleteOne({ _id: existing._id });
    return { liked: false };
  }

  await Reaction.create({
    userId,
    targetType,
    targetId,
    type: "LIKE",
  });


  if (targetType === "THREAD") {
    const thread = await Thread.findById(targetId).select("_id authorId");
    await NotificationsService.createOnce({
      userId: thread.authorId,
      actorId: userId,
      type: "LIKE_THREAD",
      entityType: "THREAD",
      entityId: thread._id,
      meta: {},
    });
  } else {
    const reply = await Reply.findById(targetId).select("_id authorId threadId");
    await NotificationsService.createOnce({
      userId: reply.authorId,
      actorId: userId,
      type: "LIKE_REPLY",
      entityType: "REPLY",
      entityId: reply._id,
      meta: { threadId: reply.threadId.toString() },
    });
  }


  return { liked: true };
}

module.exports = { toggleLike };
