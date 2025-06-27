import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const userRoles = user.role || [];

  const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>
        <h2>Unauthorized: You don't have permission to view this page.</h2>
      </div>
    );
  }

  return children;
};

export default RoleProtectedRoute;
