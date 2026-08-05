import mongoose from "mongoose";

// Disable command buffering so queries fail fast if not connected
mongoose.set("bufferCommands", false);
// Set buffer timeout to 30 s (adjust as needed)
mongoose.set("bufferTimeoutMS", 30000);

let isConnected = false;

export const connectDatabase = async () => {
  // Reuse existing connection if already connected
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return;
  }
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing. Add it to backend/.env.");
  }

  // Use robust connection options
  const options = { serverSelectionTimeoutMS: 30000, // 30 s timeout for server selection
    socketTimeoutMS: 45000,
  };

  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri, options);
  console.log("MongoDB connected");
  isConnected = true;

  // Log connection events for debugging
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
    isConnected = false;
  });
  mongoose.connection.once("open", () => {
    console.info("MongoDB connection is open");
  });
};

export const databaseMiddleware = async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
};
