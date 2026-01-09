import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loading from "./Loading";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (!user.isVerified && user.role !== "admin") {
    if (user.role === "lecturer") {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="card max-w-md text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verify Your Email
            </h2>
            <p className="text-gray-600 mb-4">
              We sent an OTP to your university email. Please verify to
              continue.
            </p>
            <Link
              to="/verify-otp"
              className="inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Go to Verification
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="card max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Account Pending Verification
          </h2>
          <p className="text-gray-600">
            Your account is awaiting admin approval. You will be able to access
            the system once verified.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
