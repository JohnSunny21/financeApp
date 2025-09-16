import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // 1. Check if the auth state is still loading.
  if (loading) {
    // You can return a loading spinner or a blank page here.
    return <Spinner />;
  }

  // 2. Once loading is false, then check for authentication.
  if (!isAuthenticated) {
    // If  the user is not authenticated , redirect them to the /login page
    return <Navigate to="/login" replace />;
  }

  // 3. If authenticated and not loading, render the child.
  return children;
};

export default ProtectedRoute;
