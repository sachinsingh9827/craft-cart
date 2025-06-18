import React, { useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const BASE_URL = "https://craft-cart-backend.vercel.app/api";

const PaymentRedirect = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const transactionId = query.get("transactionId");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axios.post(`${BASE_URL}/payment/verify`, {
          transactionId,
        });
        if (res.data.success) {
          toast.success("Payment verified successfully!");
        } else {
          toast.error("Payment verification failed.");
        }
      } catch (err) {
        toast.error("Error verifying payment: " + err.message);
      }
    };

    if (transactionId) {
      verifyPayment();
    }
  }, [transactionId]);

  return (
    <div className="text-center p-6">
      <h1 className="text-xl font-bold">Payment Redirect</h1>
      <p>Please wait while we verify your payment...</p>
    </div>
  );
};

export default PaymentRedirect;
