import cors from "cors";
import express from "express";
import appointmentsRouter from "./routes/appointments.routes.js";
import authRouter from "./routes/auth.routes.js";
import contactRouter from "./routes/contact.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import doctorsRouter from "./routes/doctors.routes.js";
import galleryRouter from "./routes/gallery.routes.js";
import patientsRouter from "./routes/patients.routes.js";
import reviewsRouter from "./routes/reviews.routes.js";
import servicesRouter from "./routes/services.routes.js";
import settingsRouter from "./routes/settings.routes.js";
import slotsRouter from "./routes/slots.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
      ) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "doctor-backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/appointments", appointmentsRouter);
app.use("/api/auth", authRouter);
app.use("/api/contact", contactRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/doctors", doctorsRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/patients", patientsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/services", servicesRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/slots", slotsRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;
