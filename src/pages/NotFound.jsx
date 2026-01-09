import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
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
        className="absolute right-0 bottom-10 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl"
        aria-hidden
      />

      <div className="card text-center max-w-lg w-full mx-4">
        <p className="pill mx-auto w-fit mb-3">Navigation error</p>
        <h1 className="text-6xl font-bold text-primary-600 mb-3">404</h1>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          Page not found
        </h2>
        <p className="text-slate-600 mb-8">
          The page you are looking for doesn't exist or may have been moved.
        </p>
        <Link to="/" className="btn-primary px-6 py-3">
          Go home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
