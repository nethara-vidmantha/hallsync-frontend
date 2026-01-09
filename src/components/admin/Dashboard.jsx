import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaUsers, FaUserCheck, FaUserClock, FaBook } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalLecturers: 0,
    totalReps: 0,
    pendingReps: 0,
    totalBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Lecturers',
      value: stats.totalLecturers,
      icon: FaUsers,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Representatives',
      value: stats.totalReps,
      icon: FaUserCheck,
      color: 'bg-green-500'
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingReps,
      icon: FaUserClock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Active Bookings',
      value: stats.totalBookings,
      icon: FaBook,
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.color} p-4 rounded-lg text-white`}>
                <card.icon className="text-2xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary">Add Lecturer</button>
          <button className="btn-primary">Manage Timetables</button>
          <button className="btn-primary">View All Bookings</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
