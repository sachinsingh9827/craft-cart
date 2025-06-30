import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const PaymentStatus = () => {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const url = new URLSearchParams(window.location.search);
        const orderId = url.get("orderId");

        if (!orderId) {
          setStatus("missing_order");
          return;
        }

        const res = await axios.get(`${BASE_URL}/payment/status/${orderId}`);

        if (res.data.success && res.data.paymentStatus?.status === "SUCCESS") {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        setStatus("error");
        console.error("Payment status check failed:", err);
      }
    };

    fetchStatus();
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Payment Status</h2>
      {status === "checking" && <p>Verifying your payment...</p>}
      {status === "success" && (
        <p style={{ color: "green" }}>✅ Payment Successful!</p>
      )}
      {status === "failed" && <p style={{ color: "red" }}>❌ Payment Failed</p>}
      {status === "error" && <p>⚠️ Something went wrong.</p>}
      {status === "missing_order" && <p>⚠️ Order ID missing in URL.</p>}
    </div>
  );
};

export default PaymentStatus;
