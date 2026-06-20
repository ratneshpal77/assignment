import express from "express";
import app from "./src/app.js";
import connectDB from "./src/db/db.js";
import dotenv from "dotenv";

dotenv.config();
connectDB();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
