// backend/src/controllers/feed.controller.js
const FeedService = require("../services/feed.service");

async function get(req, res) {
  const userId = req.user.id;
  const { limit, cursor } = req.query;

  const data = await FeedService.getFeed({ userId, limit, cursor });
  return res.status(200).json(data);
}

module.exports = { get };
