import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'lecturer') return '/lecturer/dashboard';
    if (user?.role === 'representative') return '/representative/dashboard';
    return '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl font-bold mb-4">Welcome to HallSync</h1>
          <p className="text-xl text-primary-100">
            Faculty of Technology - University of Sri Jayewardenepura
          </p>
          <p className="text-lg text-primary-200 mt-2">
            Streamlined Hall Booking Management System
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="card text-center">
            <div className="text-primary-600 text-4xl mb-4">🏛️</div>
            <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
            <p className="text-gray-600">
              Book halls quickly and efficiently with our streamlined system
            </p>
          </div>

          <div className="card text-center">
            <div className="text-primary-600 text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold mb-2">Timetable Integration</h3>
            <p className="text-gray-600">
              Automated conflict detection with semester timetables
            </p>
          </div>

          <div className="card text-center">
            <div className="text-primary-600 text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">Multi-Role Access</h3>
            <p className="text-gray-600">
              Admin, Lecturer, and Representative role management
            </p>
          </div>
        </div>

        <div className="text-center">
          {isAuthenticated ? (
            <Link
              to={getDashboardLink()}
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-block bg-primary-800 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-primary-900 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
