import React from "react";

function Sidebar({ setActivePage }) {
  return (
    <aside
      style={{
        width: "240px",
        backgroundColor: "#2d3b45",
        color: "#fff",
        padding: "1.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <h2 style={{ fontSize: "1.4rem", margin: 0 }}>Admin Panel</h2>
      <button
        type="button"
        onClick={() => setActivePage("users")}
        style={buttonStyle}
      >
        User Management
      </button>
      <button
        type="button"
        onClick={() => setActivePage("courses")}
        style={buttonStyle}
      >
        Course Management
      </button>
      <button
        type="button"
        onClick={() => setActivePage("logs")}
        style={buttonStyle}
      >
        Logs
      </button>
    </aside>
  );
}

const buttonStyle = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.4)",
  color: "#fff",
  padding: "0.75rem 1rem",
  borderRadius: "6px",
  cursor: "pointer",
  textAlign: "left",
};

export default Sidebar;

