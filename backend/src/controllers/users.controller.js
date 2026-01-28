const UsersService = require("../services/users.service");


async function getProfile(req, res) {
  const viewerId = req.user.id;
  const userId = req.params.userId;

  const data = await UsersService.getUserProfile({ viewerId, userId });
  return res.status(200).json(data);
}

async function updateMe(req, res) {
  const userId = req.user.id;
  const { username, bio } = req.body;

  const user = await UsersService.updateMe({ userId, username, bio });
  return res.status(200).json({ user });
}



async function updatePrivacy(req, res) {
  const userId = req.user.id;
  const { isPrivate } = req.body;

  const user = await UsersService.updatePrivacy({ userId, isPrivate });
  return res.status(200).json({ user });
}



async function uploadAvatar(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const avatarUrl = `/uploads/${req.file.filename}`;
  const user = await UsersService.updateAvatar({ userId: req.user.id, avatarUrl });
  return res.status(200).json({ user });
}


module.exports = {
  updatePrivacy,
  uploadAvatar,
  getProfile,
  updateMe,
};
