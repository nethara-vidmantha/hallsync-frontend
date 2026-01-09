import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { DEPARTMENTS } from "../utils/constants";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "lecturer",
    department: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (
      formData.role === "lecturer" &&
      !formData.email.endsWith("@gmail.com")
    ) {
      toast.error("Lecturers must use @gmail.com email");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      const user = await register(registrationData);

      if (user.role === "representative" && !user.isVerified) {
        toast.success(
          "Registration successful! Please wait for admin approval."
        );
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      if (user.role === "lecturer" && !user.isVerified) {
        toast.success("Registration successful! We sent an OTP to your email.");
        localStorage.setItem("pendingLecturerEmail", registrationData.email);
        navigate("/verify-otp", { state: { email: registrationData.email } });
        return;
      }

      toast.success("Registration successful!");
      if (user.role === "lecturer") {
        navigate("/lecturer/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-indigo-50"
        aria-hidden
      />
      <div
        className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-primary-200/40 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute right-10 bottom-10 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl"
        aria-hidden
      />

      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card max-w-3xl w-full mx-4 shadow-primary-500/15">
        <div className="text-center mb-8 space-y-2">
          <p className="pill mx-auto w-fit">Create your HallSync account</p>
          <h1 className="text-3xl font-bold text-slate-900">
            Join the Faculty workspace
          </h1>
          <p className="text-slate-600">
            Book, approve, and manage campus halls with ease.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address *
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
              {formData.role === "lecturer" && (
                <p className="text-xs text-slate-500 mt-1">
                  Must use @gmail.com email
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Re-enter password"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="lecturer">Lecturer</option>
                <option value="representative">Representative</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {formData.role === "representative" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
              <p className="text-sm">
                <strong>Note:</strong> Representative accounts require admin
                approval before access is granted.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 font-semibold hover:text-primary-700"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
