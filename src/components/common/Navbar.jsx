import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-white/70 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-indigo-600 text-white grid place-items-center font-bold shadow-lg shadow-primary-500/35">
              HS
            </span>
            <div className="leading-tight">
              <p className="text-lg font-bold text-slate-900">HallSync</p>
              <p className="text-xs text-slate-500">Faculty of Technology</p>
            </div>
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/80 border border-white/70 shadow-sm">
                <FaUserCircle className="text-2xl text-primary-600" />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-primary-600 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white shadow-md shadow-slate-900/25 hover:translate-y-[-1px] transition-all"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
