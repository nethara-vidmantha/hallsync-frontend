import React, { useState, useEffect } from 'react';
import { lecturerAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from 'react-icons/fa';

const BookingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await lecturerAPI.getBookingRequests();
      setRequests(response.data);
    } catch (error) {
      toast.error('Failed to fetch booking requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await lecturerAPI.approveRequest(requestId, { 
        message: responseMessage[requestId] || 'Request approved' 
      });
      toast.success('Request approved and booking created');
      setResponseMessage({ ...responseMessage, [requestId]: '' });
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    const message = responseMessage[requestId];
    if (!message || message.trim() === '') {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      await lecturerAPI.rejectRequest(requestId, { message });
      toast.success('Request rejected');
      setResponseMessage({ ...responseMessage, [requestId]: '' });
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Booking Requests</h1>

      <div className="card mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'approved' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'rejected' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Rejected
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredRequests.map((request) => (
          <div key={request._id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{request.hall?.name}</h3>
                <p className="text-sm text-gray-600">
                  Requested by: {request.representative?.name} ({request.representative?.department})
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded text-xs font-medium ${
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Building:</span> {request.hall?.building}
                </p>
                <p>
                  <span className="font-medium">Floor:</span> {request.hall?.floor}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(request.date).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Time:</span> {request.startTime} - {request.endTime}
                </p>
                <p>
                  <span className="font-medium">Requested:</span>{' '}
                  {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="font-medium text-sm text-gray-700 mb-1">Purpose:</p>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{request.purpose}</p>
            </div>

            {request.status === 'pending' && (
              <div className="border-t pt-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response Message (Optional for approval, Required for rejection)
                  </label>
                  <textarea
                    value={responseMessage[request._id] || ''}
                    onChange={(e) => setResponseMessage({ 
                      ...responseMessage, 
                      [request._id]: e.target.value 
                    })}
                    className="input-field"
                    rows="2"
                    placeholder="Enter your response message..."
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleApprove(request._id)}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    <FaCheck />
                    <span>Approve & Book</span>
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
                    className="flex-1 btn-danger flex items-center justify-center space-x-2"
                  >
                    <FaTimes />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            )}

            {request.responseMessage && (
              <div className={`mt-4 p-3 rounded-lg ${
                request.status === 'approved' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className="text-sm font-medium text-gray-700 mb-1">Your Response:</p>
                <p className="text-sm text-gray-600">{request.responseMessage}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">No {filter !== 'all' ? filter : ''} requests found</p>
        </div>
      )}
    </div>
  );
};

export default BookingRequests;
