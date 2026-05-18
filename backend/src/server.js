import dotenv from 'dotenv';
dotenv.config();
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { seedDatabase } from "./config/seed.js";

const port = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    try {
      await seedDatabase();
    } catch (seedErr) {
      console.warn("Seeding failed:", seedErr.message);
    }

    app.listen(port, () => {
      console.log(`Doctor backend running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start backend:", err.message);
    process.exit(1);
  }
};

startServer();
