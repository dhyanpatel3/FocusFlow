import React from "react";

export default function TimerControls({
  isActive,
  mode,
  onStartStopwatch,
  onStartPomodoro,
  onStartBreak,
  onPause,
  onReset,
  onCustom,
}) {
  const btn = {
    padding: "10px 16px",
    borderRadius: 10,
    border: "1px solid #333",
    background: "#22243a",
    color: "#EAEAEA",
    cursor: "pointer",
    transition: "transform 120ms ease",
  };

  const accent = {
    ...btn,
    background: "#00F5D4",
    color: "#111",
    border: "none",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        <button style={btn} onClick={onStartStopwatch}>
          Stopwatch
        </button>
        <button style={btn} onClick={onStartPomodoro}>
          Pomodoro
        </button>
        <button style={btn} onClick={onStartBreak}>
          Break
        </button>
      </div>

      <div style={{ width: 16 }} />

      {!isActive ? (
        <button
          style={accent}
          onClick={() =>
            mode === "Pomodoro" ? onStartPomodoro() : onStartStopwatch()
          }
        >
          Start
        </button>
      ) : (
        <button style={btn} onClick={onPause}>
          Pause
        </button>
      )}
      <button style={btn} onClick={onReset}>
        Reset
      </button>

      <div style={{ width: 16 }} />
      <div style={{ display: "flex", gap: 8 }}>
        <button style={btn} onClick={() => onCustom(60 * 60)}>
          1 Hour
        </button>
        <button style={btn} onClick={() => onCustom(2 * 60 * 60)}>
          2 Hours
        </button>
        <button style={btn} onClick={() => onCustom(45 * 60)}>
          45 min
        </button>
      </div>
    </div>
  );
}
