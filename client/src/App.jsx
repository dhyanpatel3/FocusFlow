import React, { useEffect, useState } from "react";
import Timer from "./components/Timer";
import TimerControls from "./components/TimerControls";
import SessionLogger from "./components/SessionLogger";
import StudyHistory from "./components/StudyHistory";

const DARK_BG = "#1A1A2E";
const TEXT = "#EAEAEA";
const ACCENT = "#00F5D4";

export default function App() {
  const [time, setTime] = useState(0); // seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("Stopwatch"); // or 'Pomodoro'
  const [isBreak, setIsBreak] = useState(false);
  const [target, setTarget] = useState(null); // epoch ms for countdown
  const [showLogger, setShowLogger] = useState(false);
  const [lastDuration, setLastDuration] = useState(0);
  const [sessions, setSessions] = useState([]);

  // Soft notification sound
  const ding = React.useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(660, ctx.currentTime);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.55);
    } catch {}
  }, []);

  // Tick
  useEffect(() => {
    let id;
    if (isActive) {
      id = setInterval(() => {
        if (mode === "Stopwatch") {
          setTime((t) => t + 1);
        } else {
          if (!target) return;
          const remaining = Math.max(
            0,
            Math.floor((target - Date.now()) / 1000)
          );
          setTime(remaining);
          if (remaining <= 0) {
            // phase end
            ding();
            if (!isBreak) {
              // focus finished: log session and auto-start 5-min break
              setShowLogger(true);
              setLastDuration(25 * 60);
              // auto start break timer
              const breakDur = 5 * 60;
              setIsBreak(true);
              setMode("Pomodoro");
              setTarget(Date.now() + breakDur * 1000);
              setTime(breakDur);
              setIsActive(true);
            } else {
              // break finished: stop, do not log
              setIsActive(false);
              setIsBreak(false);
              setMode("Pomodoro");
              setTarget(null);
              setTime(0);
            }
          }
        }
      }, 1000);
    }
    return () => id && clearInterval(id);
  }, [isActive, mode, target, isBreak]);

  useEffect(() => {
    // initial fetch sessions
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((data) => setSessions(data))
      .catch(() => {});
  }, []);

  const startStopwatch = () => {
    setMode("Stopwatch");
    setIsBreak(false);
    setIsActive(true);
  };

  const startPomodoro = () => {
    setMode("Pomodoro");
    setIsBreak(false);
    setTarget(Date.now() + 25 * 60 * 1000);
    setTime(25 * 60);
    setIsActive(true);
  };

  const startBreak = () => {
    setMode("Pomodoro");
    setIsBreak(true);
    setTarget(Date.now() + 5 * 60 * 1000);
    setTime(5 * 60);
    setIsActive(true);
  };

  const pause = () => setIsActive(false);

  const reset = () => {
    setIsActive(false);
    if (mode === "Stopwatch") setLastDuration(time);
    setTime(0);
    setTarget(null);
    setShowLogger(true);
    ding();
  };

  const saveSession = async (subject) => {
    const duration =
      lastDuration ||
      (mode === "Stopwatch" ? time : isBreak ? 5 * 60 : 25 * 60);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, duration }),
      });
      const created = await res.json();
      setSessions((prev) => [created, ...prev]);
    } catch (e) {
      // ignore for now
    }
    setShowLogger(false);
    setLastDuration(0);
  };

  const setCustomTimer = (seconds) => {
    setMode("Pomodoro");
    setIsBreak(false);
    setTarget(Date.now() + seconds * 1000);
    setTime(seconds);
    setIsActive(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: DARK_BG,
        color: TEXT,
        fontFamily:
          "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 16px",
        }}
      >
        <h1 style={{ margin: 0, fontWeight: 800 }}>FocusFlow</h1>

        <Timer seconds={time} accent={ACCENT} mode={mode} isBreak={isBreak} />

        <TimerControls
          isActive={isActive}
          mode={mode}
          onStartStopwatch={startStopwatch}
          onStartPomodoro={startPomodoro}
          onStartBreak={startBreak}
          onPause={pause}
          onReset={reset}
          onCustom={setCustomTimer}
        />

        <StudyHistory sessions={sessions} />
      </div>

      {showLogger && (
        <SessionLogger
          onSave={saveSession}
          onCancel={() => setShowLogger(false)}
        />
      )}
    </div>
  );
}
