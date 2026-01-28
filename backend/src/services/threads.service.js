const Thread = require("../models/Thread.model");
const Reply = require("../models/Reply.model");
const Follow = require("../models/Follow.model");
const NotificationsService = require("./notifications.service");
const StatsService = require("./stats.service");



async function canViewThread({ userId, thread }) {
  // public thread is always viewable
  if (thread.visibility === "PUBLIC") return true;

  // author always can view
  if (thread.authorId.toString() === userId.toString()) return true;

  // followers-only: must have ACCEPTED follow from user -> author
  const rel = await Follow.findOne({
    followerId: userId,
    followingId: thread.authorId,
    status: "ACCEPTED",
  }).select("_id");

  return !!rel;
}

async function createThread({ authorId, content, mediaUrls, visibility }) {
  const thread = await Thread.create({ authorId, content, mediaUrls, visibility });
  return {
    id: thread._id.toString(),
    authorId: thread.authorId.toString(),
    content: thread.content,
    mediaUrls: thread.mediaUrls,
    visibility: thread.visibility,
    createdAt: thread.createdAt,
    updatedAt: thread.updatedAt,
  };
}

async function getThreadWithReplies({ userId, threadId }) {
  const thread = await Thread.findById(threadId);
  if (!thread) {
    const err = new Error("Thread not found");
    err.status = 404;
    throw err;
  }

  const ok = await canViewThread({ userId, thread });
  if (!ok) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }


  const replies = await Reply.find({ threadId: thread._id })
    .sort({ createdAt: 1 })
    .select("_id threadId authorId content createdAt updatedAt");

    const stats = await StatsService.getSingleThreadStats(thread._id);

  return {
    thread: {
      id: thread._id.toString(),
      authorId: thread.authorId.toString(),
      content: thread.content,
      mediaUrls: thread.mediaUrls,
      visibility: thread.visibility,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
      likesCount: stats.likesCount,
      repliesCount: stats.repliesCount,
    },
    replies: replies.map((r) => ({
      id: r._id.toString(),
      threadId: r.threadId.toString(),
      authorId: r.authorId.toString(),
      content: r.content,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    })),
  };
}

async function createReply({ userId, threadId, content }) {
  const thread = await Thread.findById(threadId).select("_id authorId visibility");
  if (!thread) {
    const err = new Error("Thread not found");
    err.status = 404;
    throw err;
  }

  const ok = await canViewThread({ userId, thread });
  if (!ok) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }

  const reply = await Reply.create({ threadId, authorId: userId, content });
  

  await NotificationsService.createOnce({
    userId: thread.authorId,
    actorId: userId,
    type: "REPLY",
    entityType: "THREAD",
    entityId: thread._id,
    meta: { replyId: reply._id.toString() },
  });


  return {
    id: reply._id.toString(),
    threadId: reply.threadId.toString(),
    authorId: reply.authorId.toString(),
    content: reply.content,
    createdAt: reply.createdAt,
    updatedAt: reply.updatedAt,
  };
}

async function deleteThread({ userId, threadId }) {
  const thread = await Thread.findById(threadId).select("_id authorId");
  if (!thread) {
    const err = new Error("Thread not found");
    err.status = 404;
    throw err;
  }

  if (thread.authorId.toString() !== userId.toString()) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }

  await Reply.deleteMany({ threadId: thread._id });
  await Thread.deleteOne({ _id: thread._id });

  return { message: "Thread deleted" };
}

module.exports = {
    createThread,
    getThreadWithReplies,
    createReply,
    deleteThread
};
