import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuth, children }) => {
  if (!isAuth) {
    // User not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }
  // User authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
