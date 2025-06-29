import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import Razorpay from "razorpay";
import path from "path";
dotenv.config();

export const instance = new Razorpay({
  key_id: process.env.Razorpay_Key,
  key_secret: process.env.Razorpay_Secret,
});
const app = express();
const port = process.env.PORT;

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend Vite URL
    credentials: true,
  })
);

import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";

app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
  connectDb();
});
