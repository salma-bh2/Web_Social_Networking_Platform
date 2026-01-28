// backend/src/controllers/auth.controller.js
const AuthService = require("../services/auth.service");

async function register(req, res) {
  const data = await AuthService.register(req.body);
  return res.status(201).json(data);
}

async function login(req, res) {
  const data = await AuthService.login(req.body);
  return res.status(200).json(data);
}

async function me(req, res) {
  const user = await AuthService.getMe(req.user.id);
  return res.status(200).json({ user });
}

module.exports = { register, login, me };
