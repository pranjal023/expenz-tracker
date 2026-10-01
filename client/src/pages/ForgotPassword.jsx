import { useState } from "react";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="container">
      <h1>Forgot Password</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your account email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}

export default ForgotPassword;