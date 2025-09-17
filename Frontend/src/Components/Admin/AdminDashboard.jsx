import React, { useState } from "react";
import Sidebar from "./Sidebar";
import UserManagement from "./UserManagement";

import Logs from "./Logs";

function AdminDashboard() {
  const [activePage, setActivePage] = useState("users");

  const renderPage = () => {
    switch (activePage) {
      case "users":
        return <UserManagement />;
      
      case "logs":
        return <Logs />;
      default:
        return <h2>Welcome, Admin!</h2>;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar setActivePage={setActivePage} />
      <div style={{ flex: 1, padding: "2rem" }}>
        {renderPage()}
      </div>
    </div>
  );
}

export default AdminDashboard;
