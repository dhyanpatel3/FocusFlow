import React from "react";

function fmtDuration(sec) {
  const m = Math.round(sec / 60);
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"}`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  if (rm === 0) return `${h} hour${h === 1 ? "" : "s"}`;
  return `${h}h ${rm}m`;
}

export default function StudyHistory({ sessions }) {
  return (
    <div style={{ width: "100%", maxWidth: 900 }}>
      <h2 style={{ margin: "16px 0 8px" }}>Study History</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 12,
        }}
      >
        {sessions?.map((s) => (
          <div
            key={s._id || s.id || Math.random()}
            style={{
              background: "#151726",
              border: "1px solid #2a2e4a",
              padding: 14,
              borderRadius: 12,
            }}
          >
            <div style={{ fontWeight: 600 }}>{s.subject}</div>
            <div style={{ opacity: 0.85 }}>{fmtDuration(s.duration)}</div>
            <div style={{ opacity: 0.6, fontSize: 12 }}>
              {new Date(s.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
