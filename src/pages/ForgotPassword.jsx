import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authAPI } from "../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("request");
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Please enter your registered email");
      return;
    }

    setLoading(true);
    try {
      await authAPI.forgotPassword({ email: formData.email });
      toast.success("OTP sent to your email");
      setStep("reset");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.code || !formData.newPassword) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword({
        email: formData.email,
        code: formData.code,
        newPassword: formData.newPassword,
      });
      toast.success("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
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
        className="absolute -left-10 top-16 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute right-0 bottom-10 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl"
        aria-hidden
      />

      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card max-w-md w-full mx-4 shadow-primary-500/15">
        <div className="text-center mb-6 space-y-2">
          <p className="pill mx-auto w-fit">Account recovery</p>
          <h1 className="text-3xl font-bold text-slate-900">
            Forgot your password?
          </h1>
          <p className="text-slate-600">
            {step === "request"
              ? "We will send a one-time passcode to your email."
              : "Enter the OTP we emailed you and choose a new password."}
          </p>
        </div>

        {step === "request" ? (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Registered email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                OTP code
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                maxLength={6}
                required
                className="input-field tracking-[0.3em] text-center"
                placeholder="6-digit code"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                New password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                minLength={6}
                required
                className="input-field"
                placeholder="Enter a strong password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-slate-600">
          <Link
            to="/login"
            className="text-primary-600 font-semibold hover:text-primary-700"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
