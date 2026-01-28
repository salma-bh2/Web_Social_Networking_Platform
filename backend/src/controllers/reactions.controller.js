const ReactionsService = require("../services/reactions.service");

async function toggleLike(req, res) {
  const data = await ReactionsService.toggleLike({
    userId: req.user.id,
    targetType: req.body.targetType,
    targetId: req.body.targetId,
  });

  return res.status(200).json(data);
}

module.exports = { toggleLike };
