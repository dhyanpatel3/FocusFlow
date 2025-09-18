import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Landing() {
  const { isAuthed, user } = useAuth();
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Simple header */}
      <header className="landing-header">
        <div className="landing-header__inner">
          <div className="brand">
            <div className="brand-mark" />
            <span>FocusFlow</span>
          </div>
          <nav className="landing-nav">
            {isAuthed ? (
              <>
                <Link to="/app" className="btn btn-accent">
                  Open App
                </Link>
                <Link to="/profile" className="btn btn-ghost">
                  {user?.name || "Profile"}
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-accent">
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="hero">
        <div className="hero__content">
          <h1 className="hero__title">
            Study smarter. Track time. Stay in flow.
          </h1>
          <p className="hero__subtitle">
            Minimal Pomodoro and stopwatch for deep work. Log sessions, review
            history, and keep momentum with a distraction-free interface.
          </p>
          <div className="hero__ctas">
            {isAuthed ? (
              <>
                <Link to="/app" className="btn btn-accent btn-lg">
                  Open the app
                </Link>
                <Link to="/profile" className="btn btn-outline btn-lg">
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="btn btn-accent btn-lg">
                  Get started
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  I already have an account
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hero__preview">
          <div className="preview-card">
            <div className="preview-timer">
              <div className="preview-time">25:00</div>
              <div className="preview-mode">Pomodoro</div>
            </div>
            <div className="preview-footer">
              Click to enter full-screen focus
            </div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="features">
        <div className="feature">
          <div className="feature-icon">⏱️</div>
          <h3>Pomodoro + Stopwatch</h3>
          <p>
            Switch modes instantly and customize durations to match your flow.
          </p>
        </div>
        <div className="feature">
          <div className="feature-icon">📒</div>
          <h3>Session logging</h3>
          <p>
            Save subjects and durations, then review your study history anytime.
          </p>
        </div>
        <div className="feature">
          <div className="feature-icon">🌙</div>
          <h3>Light/Dark themes</h3>
          <p>
            Clean, modern design that adapts to your environment and preference.
          </p>
        </div>
      </section>

      {/* Bottom content band to use extra space (not a footer) */}
      <section className="landing-bottom">
        <div className="landing-bottom__inner">
          <div className="bottom-pills">
            <span className="pill">No clutter</span>
            <span className="pill">Fast and lightweight</span>
            <span className="pill">Privacy-first</span>
          </div>
          <div className="bottom-cta">
            <div className="bottom-text">Ready to get into flow?</div>
            {isAuthed ? (
              <Link to="/app" className="btn btn-accent">
                Open App
              </Link>
            ) : (
              <Link to="/signup" className="btn btn-accent">
                Create your account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
