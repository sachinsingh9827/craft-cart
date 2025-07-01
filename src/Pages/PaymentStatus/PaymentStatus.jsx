import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://craft-cart-backend.vercel.app"; // ✅ Your backend URL

const PaymentStatus = () => {
  const [status, setStatus] = useState("checking");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const fetchStatus = async (orderIdToCheck) => {
    if (!orderIdToCheck) {
      setStatus("missing_order");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/payment/verify/${orderIdToCheck}`
      );

      const paymentStatus = res?.data?.paymentStatus?.status;

      if (res.data.success) {
        switch (paymentStatus) {
          case "SUCCESS":
            setStatus("success");
            break;
          case "FAILED":
            setStatus("failed");
            break;
          case "PENDING":
            setStatus("pending");
            break;
          default:
            setStatus("unknown");
        }
      } else {
        setStatus("failed");
      }
    } catch (err) {
      console.error("Error verifying payment status:", err);
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
    setOrderId(resolvedOrderId);

    if (resolvedOrderId) {
      fetchStatus(resolvedOrderId);
    } else {
      setStatus("missing_order");
    }
  }, []);

  // 🔁 Auto-retry if payment is pending
  useEffect(() => {
    if (status === "pending" && orderId) {
      const interval = setInterval(() => {
        fetchStatus(orderId);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [status, orderId]);

  const handleRetry = () => {
    if (orderId) fetchStatus(orderId);
  };

  const renderStatusMessage = () => {
    switch (status) {
      case "checking":
        return "🔄 Verifying your payment...";
      case "success":
        return "✅ Payment Successful!";
      case "failed":
        return "❌ Payment Failed";
      case "pending":
        return "⏳ Payment is still pending... please wait.";
      case "error":
        return "⚠️ Something went wrong while verifying payment.";
      case "missing_order":
        return "⚠️ Order ID missing in URL or local storage.";
      case "unknown":
        return "❓ Unknown payment status received.";
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "green";
      case "failed":
        return "red";
      case "pending":
        return "orange";
      case "error":
        return "#ff9900";
      default:
        return "#333";
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🧾 Payment Status</h2>
      <p style={{ ...styles.text, color: getStatusColor(status) }}>
        {renderStatusMessage()}
      </p>
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
    marginBottom: "1.5rem",
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
