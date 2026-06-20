import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ MUST BE FIRST
app.use(
  cors({
    origin: "https://assignment-5iki3u20h-ratnesh-pals-projects.vercel.app",
    credentials: true,
  })
);

// ✅ handle preflight
app.options("*", cors());

app.use("/api/user", userRoutes);
app.use("/api", eventRoutes);

export default app;