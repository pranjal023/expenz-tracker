import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("checking"); 
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function verify() {
      const orderId = searchParams.get("order_id") || localStorage.getItem("pendingOrderId");

      if (!orderId) {
        setStatus("failed");
        return;
      }

      try {
        const res = await api.get(`/payment/verify/${orderId}`);
        if (res.data.success) {
          setStatus("success");
          await refreshUser(); 
        } else {
          setStatus("failed");
        }
      } catch (err) {
        setStatus("failed");
      } finally {
        localStorage.removeItem("pendingOrderId");
      }
    }
    verify();
  }, [searchParams]);

  return (
    <div>
      {status === "checking" && <p>Verifying your payment...</p>}
      {status === "success" && (
        <div>
          <h2>🎉 Payment Successful!</h2>
          <p>You're now a Premium member.</p>
          <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
        </div>
      )}
      {status === "failed" && (
        <div>
          <h2>Payment Failed or Cancelled</h2>
          <button onClick={() => navigate("/premium")}>Try Again</button>
        </div>
      )}
    </div>
  );
}

export default PaymentStatus;