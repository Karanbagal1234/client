import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, retailer, loading } = useAuth();

  if (loading) {
    console.log('loading');
    return <div>Loading...</div>;}

  const isAuthenticated = user || retailer;
  const role = user ? "customer" : retailer ? "retailer" : null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; // Redirect to a default page
  }

  return <Outlet />;
};

export default ProtectedRoute;
