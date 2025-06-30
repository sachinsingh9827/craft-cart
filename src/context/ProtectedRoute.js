import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, logout, loading } = useAuth();
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            logout();
            setIsValidToken(false);
          } else {
            setIsValidToken(true);
          }
        } catch {
          logout();
          setIsValidToken(false);
        }
      } else {
        setIsValidToken(false);
      }
    }
  }, [token, logout, loading]); // include loading

  // Optionally show a loader while checking
  if (loading) return null;

  // Redirect if token is invalid or missing
  if (!isValidToken) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
