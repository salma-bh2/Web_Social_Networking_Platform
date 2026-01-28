// backend/src/services/feed.service.js
const mongoose = require("mongoose");
const Thread = require("../models/Thread.model");
const Follow = require("../models/Follow.model");
const StatsService = require("./stats.service");


function parseCursor(cursor) {
  // cursor format: "<createdAtISO>|<objectId>"
  const parts = cursor.split("|");
  if (parts.length !== 2) return null;

  const [createdAtStr, idStr] = parts;
  const createdAt = new Date(createdAtStr);

  if (Number.isNaN(createdAt.getTime())) return null;
  if (!/^[0-9a-fA-F]{24}$/.test(idStr)) return null;

  return { createdAt, id: new mongoose.Types.ObjectId(idStr) };
}

function makeCursor(doc) {
  return `${doc.createdAt.toISOString()}|${doc._id.toString()}`;
}

/**
 * Feed rules:
 * - PUBLIC: visible to everyone
 * - FOLLOWERS: visible if author is me, or I follow author with ACCEPTED
 *
 * Pagination:
 * - sort by (createdAt desc, _id desc)
 * - cursor filters by (createdAt, _id) to avoid duplicates when createdAt ties
 */
async function getFeed({ userId, limit, cursor }) {
  const following = await Follow.find({
    followerId: userId,
    status: "ACCEPTED",
  }).select("followingId");

  const allowedAuthors = [new mongoose.Types.ObjectId(userId)];
  for (const f of following) allowedAuthors.add(f.followingId.toString());

  const baseFilter = {
    $or: [
      { visibility: "PUBLIC" },
      { visibility: "FOLLOWERS", authorId: { $in: allowedAuthors } },
    ],
  };

  const c = cursor ? parseCursor(cursor) : null;
  const cursorFilter = c
    ? {
        $or: [
          { createdAt: { $lt: c.createdAt } },
          { createdAt: c.createdAt, _id: { $lt: c.id } },
        ],
      }
    : null;

  const filter = cursorFilter ? { $and: [baseFilter, cursorFilter] } : baseFilter;

  const docs = await Thread.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1) // fetch one extra to know if there's a next page
    .select("_id authorId content mediaUrls visibility createdAt updatedAt");

  const hasNext = docs.length > limit;
  const items = hasNext ? docs.slice(0, limit) : docs;

  const nextCursor = hasNext ? makeCursor(items[items.length - 1]) : null;
  const statsMap = await StatsService.getThreadStats(items.map((t) => t._id.toString()));

  return {
    items: items.map((t) => {
      const s = statsMap[t._id.toString()] || { likesCount: 0, repliesCount: 0 };
      return {
        id: t._id.toString(),
        authorId: t.authorId.toString(),
        content: t.content,
        mediaUrls: t.mediaUrls,
        visibility: t.visibility,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        likesCount: s.likesCount,
        repliesCount: s.repliesCount,
      };
    }),
    nextCursor,
  };
}

module.exports = { getFeed };
