import React, { useEffect, useState } from "react";
import Timer from "./components/Timer";
import TimerControls from "./components/TimerControls";
import SessionLogger from "./components/SessionLogger";
import StudyHistory from "./components/StudyHistory";
import { useAuth } from "./auth/AuthContext";
import { API_BASE } from "./lib/api";

const ACCENT = "#00F5D4";

export default function App() {
  const { token, user, logout } = useAuth();
  const [time, setTime] = useState(0); // seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("Stopwatch"); // or 'Pomodoro'
  const [isBreak, setIsBreak] = useState(false);
  const [target, setTarget] = useState(null); // epoch ms for countdown
  const [showLogger, setShowLogger] = useState(false);
  const [lastDuration, setLastDuration] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [clockOnly, setClockOnly] = useState(false); // fullscreen clock-only mode
  const [elapsedThisSession, setElapsedThisSession] = useState(0); // seconds actually elapsed in current session

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
          setElapsedThisSession((e) => e + 1);
        } else {
          if (!target) return;
          const remaining = Math.max(
            0,
            Math.floor((target - Date.now()) / 1000)
          );
          setTime(remaining);
          setElapsedThisSession((e) => e + 1);
          if (remaining <= 0) {
            // phase end
            ding();
            if (!isBreak) {
              // focus finished: log session and auto-start 5-min break
              setShowLogger(true);
              setLastDuration(elapsedThisSession || 25 * 60);
              // auto start break timer
              const breakDur = 5 * 60;
              setIsBreak(true);
              setMode("Pomodoro");
              setTarget(Date.now() + breakDur * 1000);
              setTime(breakDur);
              setIsActive(true);
              setElapsedThisSession(0);
            } else {
              // break finished: stop, do not log
              setIsActive(false);
              setIsBreak(false);
              setMode("Pomodoro");
              setTarget(null);
              setTime(0);
              setElapsedThisSession(0);
            }
          }
        }
      }, 1000);
    }
    return () => id && clearInterval(id);
  }, [isActive, mode, target, isBreak]);

  useEffect(() => {
    if (!token) {
      setSessions([]);
      return;
    }
    fetch(`${API_BASE}/sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setSessions(data))
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    document.body.classList.toggle("theme-light", theme === "light");
  }, [theme]);

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
    if (mode === "Stopwatch") setLastDuration(elapsedThisSession || time);
    setTime(0);
    setTarget(null);
    setShowLogger(true);
    ding();
    setElapsedThisSession(0);
  };

  const saveSession = async (subject) => {
    const duration =
      lastDuration ||
      elapsedThisSession ||
      (mode === "Stopwatch" ? time : isBreak ? 5 * 60 : 25 * 60);
    try {
      const res = await fetch(`${API_BASE}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          duration,
          type: isBreak ? "Break" : mode,
        }),
      });
      const created = await res.json();
      setSessions((prev) => [created, ...prev]);
    } catch (e) {
      // ignore for now
    }
    setShowLogger(false);
    setLastDuration(0);
  };

  // Keep clockOnly state in sync if user exits fullscreen via ESC
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) setClockOnly(false);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const setCustomTimer = (seconds) => {
    setMode("Pomodoro");
    setIsBreak(false);
    setTarget(Date.now() + seconds * 1000);
    setTime(seconds);
    setIsActive(true);
    setElapsedThisSession(0);
  };

  const newSession = () => {
    // Stop current, clear trackers and let user choose new mode
    setIsActive(false);
    setIsBreak(false);
    setMode("Stopwatch");
    setTime(0);
    setTarget(null);
    setElapsedThisSession(0);
  };

  const onTimerClick = async () => {
    try {
      if (!clockOnly) {
        await document.documentElement.requestFullscreen();
        setClockOnly(true);
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
        setClockOnly(false);
      } else {
        setClockOnly(false);
      }
    } catch {}
  };

  if (clockOnly) {
    return (
      <div
        onClick={onTimerClick}
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--bg)",
          color: "var(--text)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          cursor: "zoom-out",
        }}
      >
        <div style={{ transform: "scale(2.2)", transformOrigin: "center" }}>
          <Timer seconds={time} accent={ACCENT} mode={mode} isBreak={isBreak} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily:
          "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      }}
    >
      <div className="container">
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <h1 style={{ margin: 0, fontWeight: 800 }}>FocusFlow</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <a
              href="/profile"
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid var(--card-border)",
                background: "var(--card)",
                color: "var(--text)",
                textDecoration: "none",
              }}
            >
              {user?.name || "Profile"}
            </a>
            <button
              onClick={newSession}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid var(--card-border)",
                background: "var(--card)",
                color: "var(--text)",
                cursor: "pointer",
              }}
            >
              New Session
            </button>
            <button
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid var(--card-border)",
                background: "var(--card)",
                color: "var(--text)",
                cursor: "pointer",
              }}
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>

        <div onClick={onTimerClick} style={{ cursor: "zoom-in" }}>
          <Timer seconds={time} accent={ACCENT} mode={mode} isBreak={isBreak} />
        </div>

        <TimerControls
          isActive={isActive}
          mode={mode}
          onStartStopwatch={startStopwatch}
          onStartPomodoro={startPomodoro}
          onStartBreak={startBreak}
          onPause={pause}
          onReset={reset}
          onCustom={setCustomTimer}
          onOpenLogger={() => setShowLogger(true)}
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
