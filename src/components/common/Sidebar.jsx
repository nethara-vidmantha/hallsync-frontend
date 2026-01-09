import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaDoorOpen,
  FaBook,
  FaClipboardList,
  FaEnvelope,
} from "react-icons/fa";

const Sidebar = () => {
  const { user, isAdmin, isLecturer, isRepresentative } = useAuth();

  const adminLinks = [
    { to: "/admin/dashboard", icon: FaHome, label: "Dashboard" },
    { to: "/admin/users", icon: FaUsers, label: "Manage Users" },
    { to: "/admin/timetable", icon: FaCalendarAlt, label: "Manage Timetables" },
    { to: "/admin/halls", icon: FaDoorOpen, label: "Manage Halls" },
    { to: "/admin/bookings", icon: FaBook, label: "All Bookings" },
  ];

  const lecturerLinks = [
    { to: "/lecturer/dashboard", icon: FaHome, label: "Dashboard" },
    { to: "/lecturer/book-hall", icon: FaBook, label: "Book Hall" },
    { to: "/lecturer/bookings", icon: FaClipboardList, label: "My Bookings" },
    { to: "/lecturer/requests", icon: FaEnvelope, label: "Booking Requests" },
    { to: "/lecturer/halls", icon: FaDoorOpen, label: "View Halls" },
    { to: "/lecturer/timetable", icon: FaCalendarAlt, label: "Timetables" },
  ];

  const representativeLinks = [
    { to: "/representative/dashboard", icon: FaHome, label: "Dashboard" },
    {
      to: "/representative/request",
      icon: FaEnvelope,
      label: "Request Booking",
    },
    {
      to: "/representative/requests",
      icon: FaClipboardList,
      label: "My Requests",
    },
    { to: "/representative/halls", icon: FaDoorOpen, label: "View Halls" },
  ];

  let links = [];
  if (isAdmin) links = adminLinks;
  else if (isLecturer) links = lecturerLinks;
  else if (isRepresentative) links = representativeLinks;

  return (
    <aside className="w-64 min-h-screen bg-white/80 backdrop-blur-xl border-r border-white/70 shadow-xl shadow-primary-500/10 relative">
      <div
        className="absolute inset-x-4 top-6 h-36 rounded-3xl bg-gradient-to-br from-primary-200/80 via-primary-100/60 to-white blur-3xl opacity-70"
        aria-hidden
      />
      <div className="relative p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Navigation
          </h2>
          {user && <span className="pill">{user.role}</span>}
        </div>
        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150 ${
                  isActive
                    ? "bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/30 border-transparent"
                    : "text-slate-700 border-slate-100 hover:border-primary-100 hover:bg-white"
                }`
              }
            >
              <span
                className={`h-10 w-10 grid place-items-center rounded-xl border ${
                  link.to === "/admin/dashboard" ||
                  link.to === "/lecturer/dashboard" ||
                  link.to === "/representative/dashboard"
                    ? "border-primary-200/50 bg-primary-50 text-primary-600"
                    : "border-slate-100 bg-slate-50 text-slate-500"
                } group-hover:border-primary-200 group-hover:text-primary-600`}
              >
                <link.icon className="text-lg" />
              </span>
              <span className="font-semibold tracking-tight">{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
