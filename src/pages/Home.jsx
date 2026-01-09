import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const getDashboardLink = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "lecturer") return "/lecturer/dashboard";
    if (user?.role === "representative") return "/representative/dashboard";
    return "/login";
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-indigo-50"
        aria-hidden
      />
      <div
        className="absolute -top-10 -right-10 w-80 h-80 rounded-full bg-gradient-to-br from-primary-200/60 via-primary-100/40 to-white blur-3xl"
        aria-hidden
      />
      <div
        className="absolute top-1/3 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-200/60 via-white to-primary-100/50 blur-3xl"
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="pill">Hall bookings reimagined</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Orchestrate campus halls with clarity and confidence.
            </h1>
            <p className="text-lg text-slate-600">
              HallSync keeps bookings, timetables, and role permissions in one
              elegant workspace for the Faculty of Technology at the University
              of Sri Jayewardenepura.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {isAuthenticated ? (
                <Link to={getDashboardLink()} className="btn-primary px-6 py-3">
                  Go to dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn-primary px-6 py-3">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-secondary px-6 py-3 border-primary-200 hover:border-primary-300"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Real-time availability
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-primary-500" />
                Role-based controls
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card shadow-primary-500/15">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-500">Live overview</p>
                  <p className="text-2xl font-bold text-slate-900">
                    HallSync Control
                  </p>
                </div>
                <span className="pill">Secure • 24/7</span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-primary-50 p-4 border border-primary-100">
                  <p className="text-sm text-primary-700">Availability</p>
                  <p className="text-2xl font-bold text-primary-900">99%</p>
                  <p className="text-xs text-primary-600 mt-1">
                    Conflict-free scheduling
                  </p>
                </div>
                <div className="rounded-xl bg-indigo-50 p-4 border border-indigo-100">
                  <p className="text-sm text-indigo-700">Requests</p>
                  <p className="text-2xl font-bold text-indigo-900">4.2k</p>
                  <p className="text-xs text-indigo-600 mt-1">
                    Managed seamlessly
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100">
                  <p className="text-sm text-emerald-700">Approvals</p>
                  <p className="text-2xl font-bold text-emerald-900">2.8k</p>
                  <p className="text-xs text-emerald-600 mt-1">
                    Admin-reviewed
                  </p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  title: "Frictionless booking",
                  desc: "Submit and track hall requests with instant feedback and status updates.",
                },
                {
                  title: "Timetable aware",
                  desc: "Built-in conflict detection that respects semester timetables and events.",
                },
                {
                  title: "Built for teams",
                  desc: "Admins, lecturers, and reps get tailored experiences that stay in sync.",
                },
              ].map((item) => (
                <div key={item.title} className="card h-full">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
