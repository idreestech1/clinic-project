import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB using a global cache so that server‑less functions
 * (e.g., Vercel) reuse the same connection across invocations.
 */
export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI environment variable is missing!");
      throw new Error("MONGODB_URI environment variable is missing.");
    }

    const opts = {
      // Disable command buffering – fail fast if not connected
      bufferCommands: false,
      // Short server selection timeout for rapid failure on network issues
      serverSelectionTimeoutMS: 5000,
      // Socket timeout for long‑running queries
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(mongoUri, opts).then((m) => {
      console.log("MongoDB connected successfully");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset promise so a future retry can attempt reconnection
    cached.promise = null;
    console.error("Error connecting to MongoDB:", err.message);
    throw err;
  }

  return cached.conn;
};

// Keep the original name for backward compatibility
export const connectDatabase = connectDB;

/** Middleware to ensure a DB connection before handling each request */
export const databaseMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database Middleware Error:", err.message);
    res.status(500).json({
      message: "Database connection failed.",
      error: err.message,
    });
  }
};
