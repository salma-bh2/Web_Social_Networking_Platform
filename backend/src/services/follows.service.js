const Follow = require("../models/Follow.model");
const User = require("../models/User.model");
const NotificationsService = require("./notifications.service");


async function requestFollow({ followerId, targetUserId }) {
  if (followerId.toString() === targetUserId.toString()) {
    const err = new Error("You cannot follow yourself");
    err.status = 400;
    throw err;
  }

  const target = await User.findById(targetUserId).select("isPrivate");
  if (!target) {
    const err = new Error("Target user not found");
    err.status = 404;
    throw err;
  }

  const status = target.isPrivate ? "PENDING" : "ACCEPTED";

  // Upsert logique : si déjà existant, on renvoie l'état
  const existing = await Follow.findOne({ followerId, followingId: targetUserId });
  if (existing) {
    return {
      followId: existing._id.toString(),
      status: existing.status,
      message:
        existing.status === "PENDING"
          ? "Follow request already pending"
          : "Already following",
    };
  }

  const follow = await Follow.create({
    followerId,
    followingId: targetUserId,
    status,
  });

  await NotificationsService.createOnce({
    userId: targetUserId,
    actorId: followerId,
    type: "FOLLOW_REQUEST",
    entityType: "FOLLOW",
    entityId: follow._id,
    meta: { status: follow.status },
  });


  return {
    followId: follow._id.toString(),
    status: follow.status,
    message: status === "PENDING" ? "Follow request sent" : "Followed",
  };
}

async function unfollow({ followerId, targetUserId }) {
  const result = await Follow.deleteOne({ followerId, followingId: targetUserId });
  if (result.deletedCount === 0) {
    const err = new Error("Not following this user");
    err.status = 404;
    throw err;
  }
  return { message: "Unfollowed" };
}

async function listMyFollowRequests({ userId }) {
  // demandes reçues = where I am the "followingId"
  const requests = await Follow.find({ followingId: userId, status: "PENDING" })
    .sort({ createdAt: -1 })
    .select("_id followerId status createdAt");

  return requests.map((r) => ({
    requestId: r._id.toString(),
    followerId: r.followerId.toString(),
    status: r.status,
    createdAt: r.createdAt,
  }));
}

async function acceptRequest({ userId, requestId }) {
  const reqDoc = await Follow.findOne({ _id: requestId, followingId: userId, status: "PENDING" });
  if (!reqDoc) {
    const err = new Error("Follow request not found");
    err.status = 404;
    throw err;
  }

  reqDoc.status = "ACCEPTED";
  await reqDoc.save();

  await NotificationsService.createOnce({
    userId: reqDoc.followerId,
    actorId: reqDoc.followingId,
    type: "FOLLOW_ACCEPTED",
    entityType: "FOLLOW",
    entityId: reqDoc._id,
    meta: {},
});


  return { message: "Follow request accepted" };
}

async function rejectRequest({ userId, requestId }) {
  const result = await Follow.deleteOne({ _id: requestId, followingId: userId, status: "PENDING" });
  if (result.deletedCount === 0) {
    const err = new Error("Follow request not found");
    err.status = 404;
    throw err;
  }
  return { message: "Follow request rejected" };
}

module.exports = {
  requestFollow,
  unfollow,
  listMyFollowRequests,
  acceptRequest,
  rejectRequest,
};
