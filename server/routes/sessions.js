import { Router } from "express";
import Session from "../models/Session.js";

const router = Router();

// GET /api/sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find({}).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// POST /api/sessions
router.post("/", async (req, res) => {
  try {
    const { subject, duration } = req.body;
    if (!subject || typeof duration !== "number") {
      return res
        .status(400)
        .json({ error: "subject and duration are required" });
    }
    const created = await Session.create({ subject, duration });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: "Failed to create session" });
  }
});

export default router;
