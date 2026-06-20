import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

// cors (keep early)
app.use(
  cors({
    origin: "https://assignment-5iki3u20h-ratnesh-pals-projects.vercel.app",
    credentials: true,
  })
);

// routes
app.use("/api/user", userRoutes);
app.use("/api", eventRoutes);

// ✅ 404 handler MUST be LAST
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;