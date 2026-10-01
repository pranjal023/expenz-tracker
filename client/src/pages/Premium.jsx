import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Premium() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpgrade() {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/payment/create-order");
      const { paymentSessionId, orderId } = res.data;

      
      localStorage.setItem("pendingOrderId", orderId);

      const cashfree = new window.Cashfree({ mode: "sandbox" }); 
      cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self", 
      });
    } catch (err) {
      setError("Failed to start payment. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Premium Membership</h1>

      {user?.isPremium ? (
        <div>
          <p>✅ You're a Premium member!</p>
          <p>You have access to PDF report downloads on your Dashboard.</p>
        </div>
      ) : (
        <div>
          <p>You're currently on the Free plan.</p>
          <ul>
            <li>Free: Unlimited expense tracking, charts, category filters</li>
            <li>Premium (₹199 one-time): Everything in Free + downloadable PDF reports</li>
          </ul>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button onClick={handleUpgrade} disabled={loading}>
            {loading ? "Redirecting to payment..." : "Upgrade to Premium — ₹199"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Premium;