import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import backgroundImg from "../../Assets/Background.png";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [staySignedIn, setStaySignedIn] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8001/OfflineLMS/api/auth.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
  setError(""); // clear error

  // 🔹 if student/teacher and must change password
  if (
    (data.role === "teacher" || data.role === "student") &&
    data.must_change_password === 1
  ) {
    navigate("/change-password", { state: { userId: data.user_id } });
  } else {
    if (data.role === "admin") navigate("/admin");
    if (data.role === "teacher") navigate("/teacher");
    if (data.role === "student") navigate("/student");
  }
} else {
  setError("Login failed: " + data.error);
}
    } catch (err) {
      setError("Server error: " + err.message);
    }
  };

  return (
    <div
      className="canvas-login-page"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="canvas-login-box">
        <h1 className="canvas-logo">OFFLEARN</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <div className="options">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={staySignedIn}
                onChange={() => setStaySignedIn(!staySignedIn)}
              />
              Stay signed in
            </label>
            <a className="forgot-password" href="#">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="canvas-login-btn">
            Log In
          </button>
        </form>

        <div className="footer-logo">INSTRUCTURE</div>
      </div>
    </div>
  );
}

export default LoginForm;
