import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaCheck } from 'react-icons/fa';

const VerifyReps = () => {
  const [pendingReps, setPendingReps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingReps();
  }, []);

  const fetchPendingReps = async () => {
    try {
      const response = await adminAPI.getAllUsers({ 
        role: 'representative', 
        isVerified: false 
      });
      setPendingReps(response.data);
    } catch (error) {
      toast.error('Failed to fetch pending representatives');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    try {
      await adminAPI.verifyRepresentative(userId);
      toast.success('Representative verified successfully');
      fetchPendingReps();
    } catch (error) {
      toast.error('Failed to verify representative');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Verify Representatives</h1>

      <div className="card">
        {pendingReps.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No pending representative verifications
          </p>
        ) : (
          <div className="space-y-4">
            {pendingReps.map((rep) => (
              <div
                key={rep._id}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-semibold text-lg">{rep.name}</h3>
                  <p className="text-gray-600">{rep.email}</p>
                  <p className="text-sm text-gray-500">Department: {rep.department}</p>
                </div>
                <button
                  onClick={() => handleVerify(rep._id)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FaCheck />
                  <span>Verify</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyReps;
