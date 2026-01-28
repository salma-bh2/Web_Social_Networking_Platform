const User = require("../models/User.model");
const Follow = require("../models/Follow.model");
const Thread = require("../models/Thread.model");


function toPublicUser(userDoc) {
  return {
    id: userDoc._id.toString(),
    username: userDoc.username,
    email: userDoc.email,
    bio: userDoc.bio,
    avatarUrl: userDoc.avatarUrl,
    isPrivate: userDoc.isPrivate,
    createdAt: userDoc.createdAt,
    updatedAt: userDoc.updatedAt,
  };
}



async function canViewPrivateProfile({ viewerId, targetId }) {
  if (viewerId.toString() === targetId.toString()) return true;

  const rel = await Follow.findOne({
    followerId: viewerId,
    followingId: targetId,
    status: "ACCEPTED",
  }).select("_id");

  return !!rel;
}



async function getCounts({ targetId }) {
  const [threadsCount, followersCount, followingCount] = await Promise.all([
    Thread.countDocuments({ authorId: targetId }),
    Follow.countDocuments({ followingId: targetId, status: "ACCEPTED" }),
    Follow.countDocuments({ followerId: targetId, status: "ACCEPTED" }),
  ]);

  return { threadsCount, followersCount, followingCount };
}

/**
 * Returns:
 * - full profile if public OR viewer allowed
 * - limited profile if private and viewer not allowed
 */
async function getUserProfile({ viewerId, userId }) {
  const user = await User.findById(userId).select("_id username email bio avatarUrl isPrivate createdAt updatedAt");
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  if (!user.isPrivate) {
    const counts = await getCounts({ targetId: user._id });
    return { profile: { ...toPublicUser(user), ...counts }, access: "FULL" };
  }

  const allowed = await canViewPrivateProfile({ viewerId, targetId: user._id });

  if (!allowed) {
    // Profil “limité” (tu peux ajuster selon ton cahier de charge)
    return {
      profile: {
        id: user._id.toString(),
        username: user.username,
        avatarUrl: user.avatarUrl,
        isPrivate: true,
      },
      access: "LIMITED",
    };
  }

  const counts = await getCounts({ targetId: user._id });
  return { profile: { ...toPublicUser(user), ...counts }, access: "FULL" };
}




async function updateMe({ userId, username, bio }) {
  const patch = {};
  if (typeof username === "string") patch.username = username;
  if (typeof bio === "string") patch.bio = bio;

  if (patch.username) {
    const conflict = await User.findOne({ username: patch.username, _id: { $ne: userId } }).select("_id");
    if (conflict) {
      const err = new Error("Username already in use");
      err.status = 409;
      throw err;
    }
  }

  const user = await User.findByIdAndUpdate(userId, patch, { new: true })
    .select("_id username email bio avatarUrl isPrivate createdAt updatedAt");

  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  return toPublicUser(user);
}




async function updatePrivacy({ userId, isPrivate }) {
  const user = await User.findByIdAndUpdate(
    userId,
    { isPrivate },
    { new: true }
  );

  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  return toPublicUser(user);
}



async function updateAvatar({ userId, avatarUrl }) {
  const user = await User.findByIdAndUpdate(
    userId,
    { avatarUrl },
    { new: true }
  );

  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  return toPublicUser(user);
}


module.exports = {
  updatePrivacy,
  updateAvatar,
  updateMe,
  getUserProfile,
  toPublicUser,
};
