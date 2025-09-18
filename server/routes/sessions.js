import { Router } from "express";
import Session from "../models/Session.js";
import auth from "../middleware/auth.js";

const router = Router();

// GET /api/sessions
router.get("/", auth, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(sessions);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// POST /api/sessions
router.post("/", auth, async (req, res) => {
  try {
    const { subject, duration, type } = req.body;
    if (!subject || typeof duration !== "number") {
      return res
        .status(400)
        .json({ error: "subject and duration are required" });
    }
    const created = await Session.create({
      subject,
      duration,
      type,
      userId: req.user._id,
    });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: "Failed to create session" });
  }
});

export default router;
