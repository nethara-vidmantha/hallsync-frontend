import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaBan, FaTrash } from 'react-icons/fa';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({ role: 'all', isVerified: 'all' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const params = {};
      if (filter.role !== 'all') params.role = filter.role;
      if (filter.isVerified !== 'all') params.isVerified = filter.isVerified;

      const response = await adminAPI.getAllUsers(params);
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRep = async (userId) => {
    try {
      await adminAPI.verifyRepresentative(userId);
      toast.success('Representative verified successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify representative');
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      await adminAPI.toggleBlockUser(userId);
      toast.success('User status updated');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;

    try {
      await adminAPI.removeUser(userId);
      toast.success('User removed successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove user');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Users</h1>

      <div className="card mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Role
            </label>
            <select
              value={filter.role}
              onChange={(e) => setFilter({ ...filter, role: e.target.value })}
              className="input-field"
            >
              <option value="all">All Roles</option>
              <option value="lecturer">Lecturers</option>
              <option value="representative">Representatives</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filter.isVerified}
              onChange={(e) => setFilter({ ...filter, isVerified: e.target.value })}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="true">Verified</option>
              <option value="false">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold">Name</th>
              <th className="text-left py-3 px-4 font-semibold">Email</th>
              <th className="text-left py-3 px-4 font-semibold">Role</th>
              <th className="text-left py-3 px-4 font-semibold">Department</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-left py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4 capitalize">{user.role}</td>
                <td className="py-3 px-4">{user.department || '-'}</td>
                <td className="py-3 px-4">
                  <div className="space-y-1">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs ${
                        user.isVerified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {user.isVerified ? 'Verified' : 'Pending'}
                    </span>
                    {user.isBlocked && (
                      <span className="inline-block px-2 py-1 rounded text-xs bg-red-100 text-red-800 ml-2">
                        Blocked
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    {user.role === 'representative' && !user.isVerified && (
                      <button
                        onClick={() => handleVerifyRep(user._id)}
                        className="text-green-600 hover:text-green-800"
                        title="Verify"
                      >
                        <FaCheck />
                      </button>
                    )}
                    {user.role !== 'admin' && (
                      <>
                        <button
                          onClick={() => handleToggleBlock(user._id)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title={user.isBlocked ? 'Unblock' : 'Block'}
                        >
                          <FaBan />
                        </button>
                        <button
                          onClick={() => handleRemoveUser(user._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Remove"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
