import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const PaymentStatus = () => {
  const [status, setStatus] = useState("checking");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // 🔍 Fetch payment status from backend
  const fetchStatus = async (orderIdToCheck) => {
    if (!orderIdToCheck) {
      console.warn("⚠️ No orderId found for status check.");
      setStatus("missing_order");
      return;
    }

    try {
      setLoading(true);
      console.log(
        "📤 [Request] Verifying payment for orderId:",
        orderIdToCheck
      );
      console.log(
        "📤 [Endpoint]:",
        `${BASE_URL}/payment/status/${orderIdToCheck}`
      );

      const res = await axios.get(
        `${BASE_URL}/payment/status/${orderIdToCheck}`
      );

      console.log("📥 [Response] Full response object:", res);
      console.log("📥 [Response.data]:", res.data);
      console.log("📥 [Payment Status]:", res.data?.paymentStatus?.status);

      if (res.data.success && res.data.paymentStatus?.status === "SUCCESS") {
        console.log("✅ Payment verified: SUCCESS");
        setStatus("success");
      } else {
        console.warn("❌ Payment verification returned non-success status");
        setStatus("failed");
      }
    } catch (err) {
      console.error("🚨 [Error] While verifying payment status:");
      console.error(err.response?.data || err.message || err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Extract orderId and initiate status check
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlOrderId = params.get("orderId");
    const storedOrderId = localStorage.getItem("lastOrderId");

    const resolvedOrderId = urlOrderId || storedOrderId;

    console.log("🌐 [Page URL]:", window.location.href);
    console.log("🧾 [URL orderId]:", urlOrderId);
    console.log("📦 [LocalStorage orderId]:", storedOrderId);
    console.log("🔍 [Resolved orderId]:", resolvedOrderId);

    if (resolvedOrderId) {
      setOrderId(resolvedOrderId);
      fetchStatus(resolvedOrderId);
    } else {
      console.warn("⚠️ No orderId found in URL or localStorage.");
      setStatus("missing_order");
    }
  }, []);

  // 🔁 Retry manually
  const handleRetry = () => {
    console.log("🔁 Retry clicked. Retrying for orderId:", orderId);
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
