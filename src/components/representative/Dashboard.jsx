import React, { useState, useEffect } from 'react';
import { representativeAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaEnvelope, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const RepresentativeDashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await representativeAPI.getMyRequests();
      const requests = response.data;

      setStats({
        totalRequests: requests.length,
        pendingRequests: requests.filter(r => r.status === 'pending').length,
        approvedRequests: requests.filter(r => r.status === 'approved').length,
        rejectedRequests: requests.filter(r => r.status === 'rejected').length
      });

      setRecentRequests(requests.slice(0, 5));
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Requests',
      value: stats.totalRequests,
      icon: FaEnvelope,
      color: 'bg-blue-500'
    },
    {
      title: 'Pending',
      value: stats.pendingRequests,
      icon: FaClock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Approved',
      value: stats.approvedRequests,
      icon: FaCheck,
      color: 'bg-green-500'
    },
    {
      title: 'Rejected',
      value: stats.rejectedRequests,
      icon: FaTimes,
      color: 'bg-red-500'
    }
  ];

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Representative Dashboard</h1>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Requests</h2>
          {recentRequests.length === 0 ? (
            <p className="text-gray-600">No requests yet</p>
          ) : (
            <div className="space-y-3">
              {recentRequests.map((request) => (
                <div key={request._id} className="border-l-4 border-primary-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{request.hall?.name}</p>
                      <p className="text-sm text-gray-600">
                        To: {request.lecturer?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(request.date).toLocaleDateString()} | {request.startTime} - {request.endTime}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : request.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/representative/request" className="block btn-primary text-center">
              Request Hall Booking
            </Link>
            <Link to="/representative/halls" className="block btn-secondary text-center">
              View Available Halls
            </Link>
            <Link to="/representative/requests" className="block btn-secondary text-center">
              View All Requests
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepresentativeDashboard;
