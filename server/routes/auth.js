import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = Router();

function sign(user) {
  const payload = { sub: user._id.toString() };
  const secret = process.env.JWT_SECRET || "devsecret";
  const expiresIn = "7d";
  return jwt.sign(payload, secret, { expiresIn });
}

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email and password are required" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "email already in use" });
    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name, email, passwordHash });
    const token = sign(user);
    res
      .status(201)
      .json({
        token,
        user: { _id: user._id, name: user.name, email: user.email },
      });
  } catch (e) {
    res.status(500).json({ error: "Failed to signup" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email and password are required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "invalid credentials" });
    const ok = await user.validatePassword(password);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });
    const token = sign(user);
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to login" });
  }
});

// GET /api/auth/me
router.get("/me", auth, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
