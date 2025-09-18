import React, { useState } from "react";

export default function SessionLogger({ onSave, onCancel }) {
  const [subject, setSubject] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim()) return;
    onSave(subject.trim());
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          background: "#151726",
          border: "1px solid #2a2e4a",
          padding: 20,
          borderRadius: 12,
          width: "min(520px, 92vw)",
        }}
      >
        <h3 style={{ marginTop: 0, color: "#EAEAEA" }}>Log your session</h3>
        <input
          autoFocus
          placeholder="What did you focus on?"
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid #333a",
            background: "#0f1220",
            color: "#EAEAEA",
          }}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            marginTop: 16,
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #333",
              background: "#22243a",
              color: "#EAEAEA",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "none",
              background: "#00F5D4",
              color: "#111",
              fontWeight: 600,
            }}
          >
            Save Session
          </button>
        </div>
      </form>
    </div>
  );
}
