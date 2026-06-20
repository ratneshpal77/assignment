import express from "express";
import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "https://assignment-sigma-rosy.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// IMPORTANT for preflight requests
app.options("*", cors());

app.use("/api/user", userRoutes);
app.use("/api", eventRoutes);

export default app;