import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./Components/Login/AdminLogin";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import ChangePassword from "./Components/ChangePassword/ChangePassword";

function TeacherDashboard() {
  return <h2>Teacher Dashboard</h2>;
}
function StudentDashboard() {
  return <h2>Student Dashboard</h2>;
}

function App() {
  return (
    // 👇 add basename so routes work under /OfflineLMS/
    <Router basename="/OfflineLMS">
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Optional: fallback for unknown routes */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
