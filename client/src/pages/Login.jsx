import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      if (!res.ok)
        throw new Error(
          (data && data.error) || `Login failed (HTTP ${res.status})`
        );
      if (!data || !data.token) throw new Error("Unexpected server response");
      login(data);
      navigate("/app");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ alignItems: "stretch", maxWidth: 420 }}>
      <h2>Login</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid var(--card-border)",
            background: "var(--card)",
            color: "var(--text)",
          }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid var(--card-border)",
            background: "var(--card)",
            color: "var(--text)",
          }}
        />
        {error && <div style={{ color: "tomato" }}>{error}</div>}
        <button
          type="submit"
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "none",
            background: "var(--accent)",
            color: "#111",
            fontWeight: 600,
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
