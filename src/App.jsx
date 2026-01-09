import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';

// Common Components
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loading from './components/common/Loading';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Admin Components
import AdminDashboard from './components/admin/Dashboard';
import ManageUsers from './components/admin/ManageUsers';
import ManageTimetable from './components/admin/ManageTimetable';
import VerifyReps from './components/admin/VerifyReps';

// Lecturer Components
import LecturerDashboard from './components/lecturer/Dashboard';
import BookHall from './components/lecturer/BookHall';
import MyBookings from './components/lecturer/MyBookings';
import ViewHalls from './components/lecturer/ViewHalls';
import BookingRequests from './components/lecturer/BookingRequests';

// Representative Components
import RepresentativeDashboard from './components/representative/Dashboard';
import RequestBooking from './components/representative/RequestBooking';
import MyRequests from './components/representative/MyRequests';
import RepViewHalls from './components/representative/ViewHalls';

// Layout Component
const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return children;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

// Main App Component
function AppContent() {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Register />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <ManageUsers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/timetable"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <ManageTimetable />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/verify-reps"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <VerifyReps />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/halls"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <ViewHalls />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <MyBookings />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Lecturer Routes */}
        <Route
          path="/lecturer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['lecturer']}>
              <Layout>
                <LecturerDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer/book-hall"
          element={
            <ProtectedRoute allowedRoles={['lecturer']}>
              <Layout>
                <BookHall />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer/bookings"
          element={
            <ProtectedRoute allowedRoles={['lecturer']}>
              <Layout>
                <MyBookings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer/halls"
          element={
            <ProtectedRoute allowedRoles={['lecturer']}>
              <Layout>
                <ViewHalls />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer/requests"
          element={
            <ProtectedRoute allowedRoles={['lecturer']}>
              <Layout>
                <BookingRequests />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer/timetable"
          element={
            <ProtectedRoute allowedRoles={['lecturer']}>
              <Layout>
                <ManageTimetable />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Representative Routes */}
        <Route
          path="/representative/dashboard"
          element={
            <ProtectedRoute allowedRoles={['representative']}>
              <Layout>
                <RepresentativeDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/representative/request"
          element={
            <ProtectedRoute allowedRoles={['representative']}>
              <Layout>
                <RequestBooking />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/representative/requests"
          element={
            <ProtectedRoute allowedRoles={['representative']}>
              <Layout>
                <MyRequests />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/representative/halls"
          element={
            <ProtectedRoute allowedRoles={['representative']}>
              <Layout>
                <RepViewHalls />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
