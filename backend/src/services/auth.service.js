// backend/src/services/auth.service.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

function toPublicUser(userDoc) {
  return {
    id: userDoc._id.toString(),
    username: userDoc.username,
    email: userDoc.email,
    bio: userDoc.bio,
    avatarUrl: userDoc.avatarUrl,
    isPrivate: userDoc.isPrivate,
    createdAt: userDoc.createdAt,
    updatedAt: userDoc.updatedAt
  };
}

function signToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err = new Error("JWT_SECRET is missing");
    err.status = 500;
    throw err;
  }

  return jwt.sign(
    { sub: userId.toString() },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

async function register({ username, email, password }) {
  const normalizedEmail = email.toLowerCase();

  const existing = await User.findOne({
    $or: [{ email: normalizedEmail }, { username }]
  });

  if (existing) {
    const err = new Error("Email or username already in use");
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email: normalizedEmail,
    passwordHash
  });

  const token = signToken(user._id);
  return { token, user: toPublicUser(user) };
}

async function login({ email, password }) {
  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const token = signToken(user._id);
  return { token, user: toPublicUser(user) };
}

async function getMe(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return toPublicUser(user);
}

module.exports = { register, login, getMe };
