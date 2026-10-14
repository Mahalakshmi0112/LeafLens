import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading your account…</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location }} />;
};

export default ProtectedRoute;
