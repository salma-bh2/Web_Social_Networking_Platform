// backend/src/config/database.js

const mongoose = require("mongoose");

let isConnected = false;

async function connectDB(mongoUri = process.env.MONGO_URI) {
  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables.");
  }

  if (isConnected) return mongoose.connection;

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,

    maxPoolSize: 10,
    autoIndex: process.env.NODE_ENV !== "production",
  });

  isConnected = true;
  return mongoose.connection;
}


async function disconnectDB() {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}

function registerDbEvents() {
  const conn = mongoose.connection;

  conn.on("connected", () => {
    console.log("[DB] MongoDB connected");
  });

  conn.on("error", (err) => {
    console.error("[DB] MongoDB connection error:", err);
  });

  conn.on("disconnected", () => {
    console.warn("[DB] MongoDB disconnected");
  });
}

function registerGracefulShutdown({ server } = {}) {
  const shutdown = async (signal) => {
    try {
      console.log(`[SYS] Received ${signal}. Shutting down...`);
      if (server && typeof server.close === "function") {
        await new Promise((resolve) => server.close(resolve));
      }

      await disconnectDB();
      console.log("[SYS] Shutdown complete.");
      process.exit(0);
    } catch (err) {
      console.error("[SYS] Shutdown error:", err);
      process.exit(1);
    }
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

module.exports = {
  connectDB,
  disconnectDB,
  registerDbEvents,
  registerGracefulShutdown,
};
