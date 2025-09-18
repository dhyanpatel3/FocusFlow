import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import sessionsRouter from "./routes/sessions.js";
import authRouter from "./routes/auth.js";

dotenv.config();

export const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/sessions", sessionsRouter);
app.use("/api/auth", authRouter);

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/focusflow";

let dbPromise = null;
export async function ensureDb() {
  if (mongoose.connection.readyState >= 1) return;
  if (!dbPromise) {
    dbPromise = mongoose.connect(MONGODB_URI).then(() => {
      console.log("MongoDB connected");
    });
  }
  await dbPromise;
}

export default app;
