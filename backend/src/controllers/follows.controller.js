const FollowsService = require("../services/follows.service");

async function followUser(req, res) {
  const followerId = req.user.id;
  const targetUserId = req.params.userId;

  const data = await FollowsService.requestFollow({ followerId, targetUserId });
  return res.status(200).json(data);
}

async function unfollowUser(req, res) {
  const followerId = req.user.id;
  const targetUserId = req.params.userId;

  const data = await FollowsService.unfollow({ followerId, targetUserId });
  return res.status(200).json(data);
}

async function getMyRequests(req, res) {
  const userId = req.user.id;
  const data = await FollowsService.listMyFollowRequests({ userId });
  return res.status(200).json({ requests: data });
}

async function accept(req, res) {
  const userId = req.user.id;
  const requestId = req.params.requestId;

  const data = await FollowsService.acceptRequest({ userId, requestId });
  return res.status(200).json(data);
}

async function reject(req, res) {
  const userId = req.user.id;
  const requestId = req.params.requestId;

  const data = await FollowsService.rejectRequest({ userId, requestId });
  return res.status(200).json(data);
}

module.exports = {
    followUser,
    unfollowUser,
    getMyRequests,  
    accept,
    reject
};
