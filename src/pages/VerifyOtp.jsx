import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, user } = useAuth();
  const initialEmail =
    location.state?.email || localStorage.getItem("pendingLecturerEmail") || "";

  const [formData, setFormData] = useState({
    email: initialEmail,
    code: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.isVerified && user.role === "lecturer") {
      navigate("/lecturer/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.code) {
      toast.error("Email and OTP are required");
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(formData.email, formData.code);
      localStorage.removeItem("pendingLecturerEmail");
      toast.success("Verification successful! Redirecting...");
      setTimeout(
        () => navigate("/lecturer/dashboard", { replace: true }),
        1500
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-indigo-50"
        aria-hidden
      />
      <div
        className="absolute -left-8 top-10 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute right-0 bottom-10 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl"
        aria-hidden
      />

      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card max-w-md w-full mx-4 shadow-primary-500/15">
        <div className="text-center mb-6 space-y-2">
          <p className="pill mx-auto w-fit">Security step</p>
          <h1 className="text-3xl font-bold text-slate-900">
            Verify your email
          </h1>
          <p className="text-slate-600">
            Enter the one-time passcode sent to your university inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="your.email@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              OTP Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="input-field tracking-[0.3em] text-center"
              placeholder="6-digit code"
              maxLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          <p>
            Haven't received the code? Check your spam folder or register again
            to get a new OTP.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
