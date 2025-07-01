import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://craft-cart-backend.vercel.app"; // ✅ Your backend URL

const PaymentStatus = () => {
  const [status, setStatus] = useState("checking");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();

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
            localStorage.removeItem("lastOrderId");
            break;
          case "FAILED":
            setStatus("failed");
            localStorage.removeItem("lastOrderId");
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

  const handleGoHome = () => {
    navigate("/");
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

      {status === "checking" || loading ? (
        <p style={{ ...styles.text, fontSize: "1.2rem" }}>
          🔄 Please wait... checking payment status
        </p>
      ) : (
        <>
          <p style={{ ...styles.text, color: getStatusColor(status) }}>
            {renderStatusMessage()}
          </p>

          <div style={styles.buttonGroup}>
            <button
              onClick={handleRetry}
              style={{
                ...styles.button,
                opacity: loading || status === "missing_order" ? 0.5 : 1,
                cursor:
                  loading || status === "missing_order"
                    ? "not-allowed"
                    : "pointer",
              }}
              disabled={loading || status === "missing_order"}
            >
              🔁 Retry
            </button>

            {(status === "success" ||
              status === "failed" ||
              status === "error") && (
              <button onClick={handleGoHome} style={styles.secondaryButton}>
                🏠 Go to Home
              </button>
            )}
          </div>
        </>
      )}
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
    fontSize: "1.2rem",
    marginBottom: "1.5rem",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
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
  secondaryButton: {
    padding: "12px 24px",
    fontSize: "1rem",
    backgroundColor: "#555",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    transition: "0.3s",
  },
};

export default PaymentStatus;
