import express from "express";
import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";



import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cookieParser()); //middleware
app.use(cors());

app.use(express.static("frontend/dist"));



app.use("/api/user", userRoutes);
app.use("/api", eventRoutes)


export default app;
