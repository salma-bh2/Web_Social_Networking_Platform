const Follow = require("../models/Follow.model");
const User = require("../models/User.model");

async function canViewFollowLists({ viewerId, targetId }) {
  if (viewerId.toString() === targetId.toString()) return true;

  const targetUser = await User.findById(targetId).select("_id isPrivate");
  if (!targetUser) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  if (!targetUser.isPrivate) return true;

  const rel = await Follow.findOne({
    followerId: viewerId,
    followingId: targetId,
    status: "ACCEPTED",
  }).select("_id");

  return !!rel;
}

async function listFollowers({ viewerId, userId, limit }) {
  const ok = await canViewFollowLists({ viewerId, targetId: userId });
  if (!ok) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }

  const follows = await Follow.find({ followingId: userId, status: "ACCEPTED" })
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit)
    .select("followerId createdAt");

  const followerIds = follows.map((f) => f.followerId);

  const users = await User.find({ _id: { $in: followerIds } })
    .select("_id username avatarUrl");

  const map = new Map(users.map((u) => [u._id.toString(), u]));

  return {
    userId: userId.toString(),
    count: follows.length,
    items: follows
      .map((f) => {
        const u = map.get(f.followerId.toString());
        if (!u) return null;
        return {
          id: u._id.toString(),
          username: u.username,
          avatarUrl: u.avatarUrl,
          followedAt: f.createdAt,
        };
      })
      .filter(Boolean),
  };
}

async function listFollowing({ viewerId, userId, limit }) {
  const ok = await canViewFollowLists({ viewerId, targetId: userId });
  if (!ok) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }

  const follows = await Follow.find({ followerId: userId, status: "ACCEPTED" })
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit)
    .select("followingId createdAt");

  const followingIds = follows.map((f) => f.followingId);

  const users = await User.find({ _id: { $in: followingIds } })
    .select("_id username avatarUrl");

  const map = new Map(users.map((u) => [u._id.toString(), u]));

  return {
    userId: userId.toString(),
    count: follows.length,
    items: follows
      .map((f) => {
        const u = map.get(f.followingId.toString());
        if (!u) return null;
        return {
          id: u._id.toString(),
          username: u.username,
          avatarUrl: u.avatarUrl,
          followedAt: f.createdAt,
        };
      })
      .filter(Boolean),
  };
}


async function unfollowOrCancel({ followerId, targetUserId }) {
  const doc = await Follow.findOne({
    followerId,
    followingId: targetUserId,
  }).select("_id status");

  if (!doc) {
    const err = new Error("Follow relationship not found");
    err.status = 404;
    throw err;
  }

  await Follow.findOneAndDelete({ _id: doc._id });

  return {
    message: doc.status === "PENDING" ? "Follow request cancelled" : "Unfollowed",
  };
}


module.exports = { listFollowers, listFollowing, unfollowOrCancel };
