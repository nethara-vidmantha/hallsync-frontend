import React, { useState, useEffect } from 'react';
import { hallAPI, bookingAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { BUILDINGS, FLOORS } from '../../utils/constants';

const ViewHalls = () => {
  const [halls, setHalls] = useState([]);
  const [filters, setFilters] = useState({ building: '', floor: '' });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHalls();
  }, [filters]);

  useEffect(() => {
    if (selectedDate) {
      checkAvailability();
    }
  }, [selectedDate, filters]);

  const fetchHalls = async () => {
    try {
      const params = { isActive: true };
      if (filters.building) params.building = filters.building;
      if (filters.floor) params.floor = filters.floor;

      const response = await hallAPI.getAllHalls(params);
      setHalls(response.data);
    } catch (error) {
      toast.error('Failed to fetch halls');
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    try {
      const params = { date: selectedDate };
      if (filters.building) params.building = filters.building;
      if (filters.floor) params.floor = filters.floor;

      const response = await bookingAPI.getHallAvailability(params);
      setAvailability(response.data);
    } catch (error) {
      console.error('Failed to check availability');
    }
  };

  const getHallStatus = (hallId) => {
    const avail = availability.find(a => a.hall.id === hallId);
    if (!avail) return { status: 'unknown', label: 'Checking...', color: 'bg-gray-100 text-gray-800' };
    
    if (avail.isAvailable) {
      return { status: 'available', label: 'Available', color: 'bg-green-100 text-green-800' };
    } else {
      return { status: 'booked', label: 'Occupied', color: 'bg-red-100 text-red-800' };
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">View Halls</h1>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Building
            </label>
            <select
              value={filters.building}
              onChange={(e) => setFilters({ building: e.target.value, floor: '' })}
              className="input-field"
            >
              <option value="">All Buildings</option>
              {BUILDINGS.map((building) => (
                <option key={building.value} value={building.value}>
                  {building.label}
                </option>
              ))}
            </select>
          </div>

          {filters.building && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Floor
              </label>
              <select
                value={filters.floor}
                onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
                className="input-field"
              >
                <option value="">All Floors</option>
                {FLOORS[filters.building]?.map((floor) => (
                  <option key={floor.value} value={floor.value}>
                    {floor.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ building: '', floor: '' })}
              className="btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {halls.map((hall) => {
          const status = getHallStatus(hall._id);
          const avail = availability.find(a => a.hall.id === hall._id);

          return (
            <div key={hall._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{hall.name}</h3>
                  <p className="text-sm text-gray-600">
                    {hall.building} - {hall.floor}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>
                  <span className="font-medium">Capacity:</span> {hall.capacity} people
                </p>
              </div>

              {avail && !avail.isAvailable && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">Occupied Times:</p>
                  <div className="space-y-2">
                    {avail.timetableEntries.map((entry, idx) => (
                      <div key={idx} className="text-xs bg-blue-50 p-2 rounded">
                        <p className="font-medium">{entry.subject}</p>
                        <p className="text-gray-600">
                          {entry.startTime} - {entry.endTime}
                        </p>
                      </div>
                    ))}
                    {avail.bookings.map((booking, idx) => (
                      <div key={idx} className="text-xs bg-yellow-50 p-2 rounded">
                        <p className="font-medium">{booking.purpose}</p>
                        <p className="text-gray-600">
                          {booking.startTime} - {booking.endTime}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {halls.length === 0 && !loading && (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">No halls found</p>
        </div>
      )}
    </div>
  );
};

export default ViewHalls;
