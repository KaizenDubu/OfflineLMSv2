import React, { useEffect, useState } from "react";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState(""); // ✅ feedback messages

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8001/OfflineLMS/api/users.php");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setMessage("❌ Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create user
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8001/OfflineLMS/api/users.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ User created successfully!");
        fetchUsers();
        setEmail("");
        setPassword("");
        setRole("student");
      } else {
        setMessage("❌ Error: " + data.error);
      }
    } catch (err) {
      console.error("Error creating user:", err);
      setMessage("❌ Failed to create user.");
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:8001/OfflineLMS/api/users.php?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ User deleted successfully!");
        fetchUsers();
      } else {
        setMessage("❌ Error: " + data.error);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setMessage("❌ Failed to delete user.");
    }
  };

  // Update user (email or role)
  const handleUpdate = async (id, field, value) => {
    try {
      const res = await fetch("http://localhost:8001/OfflineLMS/api/users.php", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, [field]: value }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`✅ User ${field} updated successfully!`);
        fetchUsers();
      } else {
        setMessage("❌ Error: " + data.error);
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setMessage("❌ Failed to update user.");
    }
  };

  // Reset password
  const handleResetPassword = async (id) => {
    if (!window.confirm("Reset this user's password?")) return;
    try {
      const res = await fetch("http://localhost:8001/OfflineLMS/api/users.php", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`🔑 New password is: ${data.new_password}`);
        setMessage("✅ Password reset successfully!");
        fetchUsers();
      } else {
        setMessage("❌ Error: " + data.error);
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setMessage("❌ Failed to reset password.");
    }
  };

  return (
    <div>
      <h2>User Management</h2>

      {message && <p style={{ padding: "0.5rem", background: "#eee" }}>{message}</p>}

      {/* Add User Form */}
      <form onSubmit={handleCreate} style={{ marginBottom: "1rem" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Temp Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      {/* Users Table */}
      <table border="1" cellPadding="5" style={{ marginTop: "1rem", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>
                <input
                  type="text"
                  defaultValue={u.email}
                  onBlur={(e) => handleUpdate(u.id, "email", e.target.value)}
                />
              </td>
              <td>
                <select
                  defaultValue={u.role}
                  onChange={(e) => handleUpdate(u.id, "role", e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(u.id)}>Delete</button>{" "}
                <button onClick={() => handleResetPassword(u.id)}>Reset Password</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
