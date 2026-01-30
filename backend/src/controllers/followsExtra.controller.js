const FollowsExtraService = require("../services/followsExtra.service");

async function followers(req, res) {
  const viewerId = req.user.id;
  const userId = req.params.userId;
  const limit = req.query.limit;

  const data = await FollowsExtraService.listFollowers({ viewerId, userId, limit });
  return res.status(200).json(data);
}

async function following(req, res) {
  const viewerId = req.user.id;
  const userId = req.params.userId;
  const limit = req.query.limit;

  const data = await FollowsExtraService.listFollowing({ viewerId, userId, limit });
  return res.status(200).json(data);
}


async function unfollow(req, res) {
  const followerId = req.user.id;
  const targetUserId = req.params.userId;

  const data = await FollowsExtraService.unfollowOrCancel({ followerId, targetUserId });
  return res.status(200).json(data);
}


module.exports = { followers, following, unfollow };
