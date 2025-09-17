import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ChangePassword.css";
import backgroundImg from "../../Assets/Background.png";

function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null); // { text, type }
  const navigate = useNavigate();
  const location = useLocation();

  // userId passed from login redirect
  const userId = location.state?.userId;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(null);

    if (!newPassword || !confirmPassword) {
      setMessage({ text: "Both fields are required.", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "error" });
      return;
    }

    try {
      const res = await fetch("http://localhost:8001/OfflineLMS/api/change_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, new_password: newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({
          text: "Password changed successfully! Please log in again.",
          type: "success",
        });
        setTimeout(() => navigate("/"), 1500); // redirect to login
      } else {
        setMessage({ text: "Error: " + data.error, type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Server error: " + err.message, type: "error" });
    }
  };

  return (
    <div
      className="canvas-login-page change-password-page"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="canvas-login-box change-password-box">
        <h1 className="canvas-logo">OFFLEARN</h1>
        <h2 className="change-password-title">Update Your Password</h2>

        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" className="canvas-login-btn">
            Save New Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
