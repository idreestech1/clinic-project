import mongoose from "mongoose";

// Disable command buffering so queries fail fast if not connected
mongoose.set("bufferCommands", false);
// Set buffer timeout to 30 s (adjust as needed)
mongoose.set("bufferTimeoutMS", 30000);

let isConnected = false;

export const connectDatabase = async () => {
  // Global cache for serverless environments
  if (global.__mongooseCache && global.__mongooseCache.conn) {
    // Connection already established
    return global.__mongooseCache.conn;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing. Add it to backend/.env.");
  }

  // Robust connection options
  const options = { serverSelectionTimeoutMS: 30000, // 30 s timeout for server selection
    socketTimeoutMS: 45000,
  };

  // Initialize cache object if not present
  if (!global.__mongooseCache) {
    global.__mongooseCache = { conn: null, promise: null };
  }

  // If a connection promise is already in progress, await it
  if (!global.__mongooseCache.promise) {
    global.__mongooseCache.promise = mongoose.connect(mongoUri, options).then((mongooseInstance) => {
      mongooseInstance.set("strictQuery", true);
      console.log("MongoDB connected (cached)");
      // Attach event listeners once
      mongooseInstance.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
      });
      mongooseInstance.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected");
        global.__mongooseCache.conn = null;
      });
      mongooseInstance.connection.once("open", () => {
        console.info("MongoDB connection is open");
      });
      return mongooseInstance;
    });
  }

  // Await the cached promise and store the resolved connection
  global.__mongooseCache.conn = await global.__mongooseCache.promise;
  return global.__mongooseCache.conn;
};

export const databaseMiddleware = async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
};
