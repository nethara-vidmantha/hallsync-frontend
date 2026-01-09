import React, { useState, useEffect } from 'react';
import { bookingAPI, lecturerAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaBook, FaEnvelope, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LecturerDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingRequests: 0,
    upcomingBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, requestsRes] = await Promise.all([
        bookingAPI.getMyBookings(),
        lecturerAPI.getBookingRequests()
      ]);

      const bookings = bookingsRes.data;
      const requests = requestsRes.data;

      const now = new Date();
      const upcoming = bookings.filter(b => new Date(b.date) > now && b.status === 'active');

      setStats({
        totalBookings: bookings.filter(b => b.status === 'active').length,
        pendingRequests: requests.filter(r => r.status === 'pending').length,
        upcomingBookings: upcoming.length
      });

      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Active Bookings',
      value: stats.totalBookings,
      icon: FaBook,
      color: 'bg-blue-500',
      link: '/lecturer/bookings'
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: FaEnvelope,
      color: 'bg-yellow-500',
      link: '/lecturer/requests'
    },
    {
      title: 'Upcoming Bookings',
      value: stats.upcomingBookings,
      icon: FaClock,
      color: 'bg-green-500',
      link: '/lecturer/bookings'
    }
  ];

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Lecturer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <Link key={index} to={card.link} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.color} p-4 rounded-lg text-white`}>
                <card.icon className="text-2xl" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
          {recentBookings.length === 0 ? (
            <p className="text-gray-600">No bookings yet</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="border-l-4 border-primary-500 pl-4 py-2">
                  <p className="font-semibold">{booking.hall?.name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.date).toLocaleDateString()} | {booking.startTime} - {booking.endTime}
                  </p>
                  <p className="text-xs text-gray-500">{booking.purpose}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/lecturer/book-hall" className="block btn-primary text-center">
              Book a Hall
            </Link>
            <Link to="/lecturer/halls" className="block btn-secondary text-center">
              View Available Halls
            </Link>
            <Link to="/lecturer/timetable" className="block btn-secondary text-center">
              View Timetables
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;
