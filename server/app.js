import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import sessionsRouter from "./routes/sessions.js";
import authRouter from "./routes/auth.js";

dotenv.config();

export const app = express();
// CORS for local dev and when running the app directly (not via serverless wrapper)
const corsOrigins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // non-browser or same-origin
      if (corsOrigins.includes("*")) return callback(null, true);
      if (corsOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/sessions", sessionsRouter);
app.use("/api/auth", authRouter);

const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
const ENV_MONGODB_URI = process.env.MONGODB_URI;
const LOCAL_FALLBACK = "mongodb://localhost:27017/focusflow";
const MONGODB_URI = isProd
  ? ENV_MONGODB_URI // in prod, require explicit URI
  : ENV_MONGODB_URI || LOCAL_FALLBACK; // in dev, allow local fallback

let dbPromise = null;
export async function ensureDb() {
  if (mongoose.connection.readyState >= 1) return;
  if (!dbPromise) {
    if (!MONGODB_URI) {
      // Fail fast in production when no URI is provided
      const err = new Error("MONGODB_URI_MISSING");
      // throw to be caught by serverless handler
      throw err;
    }
    const connectOpts = { serverSelectionTimeoutMS: 8000 };
    dbPromise = mongoose.connect(MONGODB_URI, connectOpts).then(() => {
      console.log("MongoDB connected");
    });
  }
  await dbPromise;
}

export default app;
