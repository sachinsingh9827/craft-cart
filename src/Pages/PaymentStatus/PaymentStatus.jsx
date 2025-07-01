import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const PaymentStatus = () => {
  const [status, setStatus] = useState("checking"); // checking, success, failed, error, missing_order
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const url = new URLSearchParams(window.location.search);
      const orderId = url.get("orderId");

      if (!orderId) {
        setStatus("missing_order");
        return;
      }

      setLoading(true);

      const res = await axios.get(`${BASE_URL}/payment/status/${orderId}`);

      if (res.data.success && res.data.paymentStatus?.status === "SUCCESS") {
        setStatus("success");
      } else {
        setStatus("failed");
      }
    } catch (err) {
      console.error("Payment status check failed:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Payment Status</h2>

      {loading || status === "checking" ? (
        <p style={styles.text}>🔄 Verifying your payment...</p>
      ) : status === "success" ? (
        <p style={{ ...styles.text, color: "green" }}>✅ Payment Successful!</p>
      ) : status === "failed" ? (
        <p style={{ ...styles.text, color: "red" }}>❌ Payment Failed</p>
      ) : status === "error" ? (
        <p style={{ ...styles.text, color: "orange" }}>
          ⚠️ Something went wrong while checking payment.
        </p>
      ) : status === "missing_order" ? (
        <p style={styles.text}>⚠️ Order ID missing in URL.</p>
      ) : null}

      <button
        onClick={fetchStatus}
        style={styles.button}
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
    background: "#f9f9f9",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "1.8rem",
    marginBottom: "1rem",
  },
  text: {
    fontSize: "1.1rem",
    marginBottom: "1rem",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default PaymentStatus;
