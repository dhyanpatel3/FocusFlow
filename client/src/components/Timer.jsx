import React from "react";

function format(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export default function Timer({ seconds, accent, mode, isBreak }) {
  const label =
    mode === "Pomodoro" ? (isBreak ? "Break" : "Focus") : "Stopwatch";
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: 80,
          fontWeight: 800,
          letterSpacing: 1,
          marginBottom: 8,
        }}
      >
        {format(seconds)}
      </div>
      <div style={{ opacity: 0.8, color: accent }}>{label}</div>
    </div>
  );
}
