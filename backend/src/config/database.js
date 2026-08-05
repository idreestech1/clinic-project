import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

// Global cache for server‑less environments (Vercel)
if (!global.__mongoCache) {
  global.__mongoCache = { conn: null, promise: null };
}
const cache = global.__mongoCache;

// Apply mongoose settings before any connection attempt
mongoose.set("bufferCommands", false);
mongoose.set("strictQuery", true);

/**
 * Connect to MongoDB using a cached connection. Subsequent Vercel function
 * invocations reuse the same connection, avoiding repeated handshakes and
 * preventing buffering timeouts.
 */
export const connectDatabase = async () => {
  // Return an existing connection if we already have one
  if (cache.conn) {
    return cache.conn;
  }

  // If a connection attempt is already in progress, reuse the promise
  if (!cache.promise) {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MongoDB connection URI is missing! Please set MONGODB_URI or MONGO_URI in .env.");
      throw new Error("MongoDB connection URI is missing.");
    }

    const opts = {
      // Give Vercel more time for cold‑start connections
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 60000,
    };

    cache.promise = mongoose.connect(mongoUri, opts).then((m) => {
      console.log("MongoDB connected (cached)");
      return m;
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    // Reset promise so a later retry can attempt reconnection
    cache.promise = null;
    console.error("Error connecting to MongoDB:", err.message);
    throw err;
  }

  return cache.conn;
};

/** Middleware that guarantees a DB connection before handling each request */
export const databaseMiddleware = async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (err) {
    console.error("Database Middleware Error:", err.message);
    res.status(500).json({
      message: "Database connection failed.",
      error: err.message,
    });
  }
};
