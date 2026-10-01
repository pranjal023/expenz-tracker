import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Profile() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const res = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setMessage(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  }

  return (
    <div className="container">
      <h1>Profile</h1>

      <div className="side-panel" style={{ marginBottom: 20 }}>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Plan:</strong> {user?.isPremium ? "Premium" : "Free"}</p>
      </div>

      <h2>Change Password</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}

export default Profile;