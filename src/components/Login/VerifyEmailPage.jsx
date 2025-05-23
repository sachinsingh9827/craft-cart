import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/user/auth/verify-email?token=${token}`
        );

        if (response.data.status) {
          setStatus("success");
          setMessage(response.data.message || "Email verified successfully!");
          setTimeout(() => {
            navigate("/login");
          }, 4000);
        } else {
          setStatus("error");
          setMessage(response.data.message || "Verification failed.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "An error occurred during email verification."
        );
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-montserrat">
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-md text-center">
        {status === "verifying" && (
          <p className="text-blue-600">Verifying...</p>
        )}
        {status === "success" && (
          <>
            <h2 className="text-green-600 font-bold text-2xl mb-4">Success!</h2>
            <p>{message}</p>
            <p className="mt-6 text-sm text-gray-600">
              Redirecting to login page...
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <h2 className="text-red-600 font-bold text-2xl mb-4">Error</h2>
            <p>{message}</p>
            <button
              onClick={() => navigate("/signup")}
              className="mt-6 px-6 py-2 bg-yellow-400 rounded font-semibold hover:bg-yellow-300"
            >
              Back to Signup
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
