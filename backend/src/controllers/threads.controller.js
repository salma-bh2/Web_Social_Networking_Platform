// src/controllers/threads.controller.js
const ThreadsService = require("../services/threads.service");

async function create(req, res) {
  const data = await ThreadsService.createThread({
    authorId: req.user.id,
    ...req.body,
  });
  return res.status(201).json({ thread: data });
}

async function getOne(req, res) {
  const data = await ThreadsService.getThreadWithReplies({
    userId: req.user.id,
    threadId: req.params.threadId,
  });
  return res.status(200).json(data);
}

async function reply(req, res) {
  const data = await ThreadsService.createReply({
    userId: req.user.id,
    threadId: req.params.threadId,
    content: req.body.content,
  });
  return res.status(201).json({ reply: data });
}

async function remove(req, res) {
  const data = await ThreadsService.deleteThread({
    userId: req.user.id,
    threadId: req.params.threadId,
  });
  return res.status(200).json(data);
}

async function removeReply(req, res) {
  const data = await ThreadsService.deleteReply({
    userId: req.user.id,
    replyId: req.params.replyId,
  });
  return res.status(200).json(data);
}


module.exports = {
    create,
    getOne,
    reply,
    remove,
    removeReply
};
