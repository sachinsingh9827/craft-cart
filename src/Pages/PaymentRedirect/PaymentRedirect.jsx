import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const PaymentRedirect = () => {
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const transactionId = query.get("transactionId");

    const verifyPayment = async () => {
      try {
        const res = await axios.post(
          "https://craft-cart-backend.vercel.app/api/payment/verify",
          {
            transactionId,
          }
        );

        if (res.data.success) {
          setPaymentStatus("Payment verified successfully!");
        } else {
          setPaymentStatus("Payment verification failed.");
        }
      } catch (err) {
        setPaymentStatus("Error verifying payment: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (transactionId) {
      verifyPayment();
    } else {
      setLoading(false);
      setPaymentStatus("No transaction ID provided.");
    }
  }, [location]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        {loading ? (
          <h1 className="text-2xl font-bold mb-4">Processing Payment...</h1>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">{paymentStatus}</h1>
            <p className="mt-4">
              If you are not redirected automatically, click the button below.
            </p>
            <a
              href="/shop"
              className="mt-6 inline-block bg-[#004080] text-white px-4 py-2 rounded hover:bg-[#003366]"
            >
              Go to Shop
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentRedirect;
