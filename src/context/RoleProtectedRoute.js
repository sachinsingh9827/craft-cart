import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // Redirect to login if user is not authenticated
  if (!user) return <Navigate to="/login" replace />;

  const userRole = user.role;

  // Check if user has any allowed role
  const hasAccess = allowedRoles.includes(userRole);

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
