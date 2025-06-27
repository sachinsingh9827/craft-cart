import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, logout, loading } = useAuth();
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          logout();
          setIsValidToken(false);
        } else {
          setIsValidToken(true);
        }
      } catch (error) {
        logout();
        setIsValidToken(false);
      }
    } else {
      setIsValidToken(false);
    }
  }, [token, logout]);

  if (loading) return null;

  if (!isValidToken) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2 style={{ color: "red" }}>Invalid or expired token</h2>
        <Navigate to="/login" replace />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
