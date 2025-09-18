import React from "react";
import { useAuth } from "../auth/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  return (
    <div className="container" style={{ alignItems: "flex-start", gap: 16 }}>
      <h2 style={{ margin: 0 }}>Profile</h2>
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--card-border)",
          borderRadius: 12,
          padding: 16,
          width: "100%",
          maxWidth: 640,
        }}
      >
        <div>
          <strong>Name:</strong> {user?.name || "(no name)"}
        </div>
        <div>
          <strong>Email:</strong> {user?.email}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <a
          href="/"
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid var(--card-border)",
            background: "var(--card)",
            color: "var(--text)",
            textDecoration: "none",
          }}
        >
          Home
        </a>
        <button
          onClick={logout}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "none",
            background: "tomato",
            color: "#fff",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
