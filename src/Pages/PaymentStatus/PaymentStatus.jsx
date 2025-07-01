import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const PaymentStatus = () => {
  const [status, setStatus] = useState("checking");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const fetchStatus = async (orderIdToCheck) => {
    if (!orderIdToCheck) {
      console.warn("⚠️ No orderId found for status check.");
      setStatus("missing_order");
      return;
    }

    try {
      setLoading(true);
      console.log(
        "📤 Sending request to:",
        `${BASE_URL}/payment/status/${orderIdToCheck}`
      );

      const res = await axios.get(
        `${BASE_URL}/payment/status/${orderIdToCheck}`
      );
      console.log("📥 Response received:", res.data);

      if (res.data.success && res.data.paymentStatus?.status === "SUCCESS") {
        console.log("✅ Payment verified as successful.");
        setStatus("success");
      } else {
        console.log(
          "❌ Payment not successful. Status:",
          res.data.paymentStatus?.status
        );
        setStatus("failed");
      }
    } catch (err) {
      console.error("🚨 Error verifying payment status:", err.message || err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlOrderId = params.get("orderId");
    const storedOrderId = localStorage.getItem("lastOrderId");

    const resolvedOrderId = urlOrderId || storedOrderId;

    console.log("🌐 URL:", window.location.href);
    console.log("🧾 URL orderId:", urlOrderId);
    console.log("📦 Stored orderId:", storedOrderId);
    console.log("✅ Resolved orderId:", resolvedOrderId);

    if (resolvedOrderId) {
      setOrderId(resolvedOrderId);
      fetchStatus(resolvedOrderId);
    } else {
      console.warn("⚠️ No orderId found in URL or localStorage.");
      setStatus("missing_order");
    }
  }, []);

  const handleRetry = () => {
    console.log("🔁 Retry clicked. Current orderId:", orderId);
    if (orderId) fetchStatus(orderId);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🧾 Payment Status</h2>

      {loading || status === "checking" ? (
        <p style={styles.text}>🔄 Verifying your payment...</p>
      ) : status === "success" ? (
        <p style={{ ...styles.text, color: "green" }}>✅ Payment Successful!</p>
      ) : status === "failed" ? (
        <p style={{ ...styles.text, color: "red" }}>❌ Payment Failed</p>
      ) : status === "error" ? (
        <p style={{ ...styles.text, color: "orange" }}>
          ⚠️ Something went wrong while verifying payment.
        </p>
      ) : status === "missing_order" ? (
        <p style={styles.text}>⚠️ Order ID missing in URL or local storage.</p>
      ) : null}

      <button
        onClick={handleRetry}
        style={{
          ...styles.button,
          opacity: loading || status === "missing_order" ? 0.5 : 1,
          cursor:
            loading || status === "missing_order" ? "not-allowed" : "pointer",
        }}
        disabled={loading || status === "missing_order"}
      >
        🔁 Retry
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    textAlign: "center",
    fontFamily: "sans-serif",
    background: "#f0f2f5",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  text: {
    fontSize: "1.1rem",
    marginBottom: "1rem",
  },
  button: {
    padding: "12px 24px",
    fontSize: "1rem",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    transition: "0.3s",
  },
};

export default PaymentStatus;
