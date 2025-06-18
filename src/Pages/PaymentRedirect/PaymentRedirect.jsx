import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

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
          // Handle successful payment verification
          console.log("Payment verified successfully:", res.data.data);
        } else {
          console.error("Payment verification failed:", res.data.message);
        }
      } catch (err) {
        console.error("Error verifying payment:", err.message);
      }
    };

    if (transactionId) {
      verifyPayment();
    }
  }, [transactionId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Processing Payment...</h1>
        <p className="text-gray-600">
          Please wait while we process your payment.
        </p>
        <p className="mt-4">
          If you are not redirected automatically, click the button below.
        </p>
        <a
          href="/shop"
          className="mt-6 inline-block bg-[#004080] text-white px-4 py-2 rounded hover:bg-[#003366]"
        >
          Go to Shop
        </a>
      </div>
    </div>
  );
};

export default PaymentRedirect;
