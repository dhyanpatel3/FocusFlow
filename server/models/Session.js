import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true, trim: true },
    duration: { type: Number, required: true }, // seconds
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export default mongoose.model("Session", SessionSchema);
