import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true, trim: true },
    duration: { type: Number, required: true }, // seconds
    type: {
      type: String,
      enum: ["Stopwatch", "Pomodoro", "Break"],
      default: "Stopwatch",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export default mongoose.model("Session", SessionSchema);
