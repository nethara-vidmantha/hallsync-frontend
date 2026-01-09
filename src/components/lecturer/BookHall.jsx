import React, { useState, useEffect } from 'react';
import { bookingAPI, hallAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { BUILDINGS, FLOORS, TIME_SLOTS } from '../../utils/constants';

const BookHall = () => {
  const [halls, setHalls] = useState([]);
  const [filteredHalls, setFilteredHalls] = useState([]);
  const [filters, setFilters] = useState({ building: '', floor: '' });
  const [formData, setFormData] = useState({
    hall: '',
    date: '',
    startTime: '08:00',
    endTime: '09:00',
    purpose: ''
  });
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    fetchHalls();
  }, []);

  useEffect(() => {
    filterHalls();
  }, [filters, halls]);

  useEffect(() => {
    if (formData.date) {
      checkAvailability();
    }
  }, [formData.date, filters]);

  const fetchHalls = async () => {
    try {
      const response = await hallAPI.getAllHalls({ isActive: true });
      setHalls(response.data);
      setFilteredHalls(response.data);
    } catch (error) {
      toast.error('Failed to fetch halls');
    }
  };

  const filterHalls = () => {
    let filtered = halls;
    
    if (filters.building) {
      filtered = filtered.filter(h => h.building === filters.building);
    }
    
    if (filters.floor) {
      filtered = filtered.filter(h => h.floor === filters.floor);
    }
    
    setFilteredHalls(filtered);
  };

  const checkAvailability = async () => {
    try {
      const params = { date: formData.date };
      if (filters.building) params.building = filters.building;
      if (filters.floor) params.floor = filters.floor;

      const response = await bookingAPI.getHallAvailability(params);
      setAvailability(response.data);
    } catch (error) {
      console.error('Failed to check availability');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.startTime >= formData.endTime) {
      toast.error('End time must be after start time');
      return;
    }

    setLoading(true);

    try {
      await bookingAPI.createBooking(formData);
      toast.success('Hall booked successfully!');
      setFormData({
        hall: '',
        date: '',
        startTime: '08:00',
        endTime: '09:00',
        purpose: ''
      });
      checkAvailability();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book hall');
    } finally {
      setLoading(false);
    }
  };

  const getHallAvailability = (hallId) => {
    const hallAvail = availability.find(a => a.hall.id === hallId);
    return hallAvail || null;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Book a Hall</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building
                </label>
                <select
                  value={filters.building}
                  onChange={(e) => setFilters({ ...filters, building: e.target.value, floor: '' })}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Form</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Hall *
                </label>
                <select
                  value={formData.hall}
                  onChange={(e) => setFormData({ ...formData, hall: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Choose a hall</option>
                  {filteredHalls.map((hall) => {
                    const avail = getHallAvailability(hall._id);
                    const isAvailable = avail?.isAvailable;
                    return (
                      <option key={hall._id} value={hall._id}>
                        {hall.name} - {hall.building} ({hall.floor})
                        {formData.date && (isAvailable ? ' ✓ Available' : ' ✗ Occupied')}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <select
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="input-field"
                    required
                  >
                    {TIME_SLOTS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <select
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="input-field"
                    required
                  >
                    {TIME_SLOTS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose *
                </label>
                <textarea
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="input-field"
                  rows="3"
                  required
                  placeholder="Enter the purpose of booking"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'Booking...' : 'Book Hall'}
              </button>
            </form>
          </div>

          {formData.date && formData.hall && (
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Hall Schedule for {new Date(formData.date).toLocaleDateString()}
              </h3>
              {(() => {
                const avail = getHallAvailability(formData.hall);
                if (!avail) return <p className="text-gray-600">Loading schedule...</p>;

                return (
                  <div className="space-y-3">
                    {avail.timetableEntries.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">
                          Scheduled Classes:
                        </h4>
                        {avail.timetableEntries.map((entry, idx) => (
                          <div key={idx} className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                            <p className="font-medium">{entry.subject}</p>
                            <p className="text-sm text-gray-600">
                              {entry.startTime} - {entry.endTime}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {avail.bookings.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">
                          Existing Bookings:
                        </h4>
                        {avail.bookings.map((booking, idx) => (
                          <div key={idx} className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
                            <p className="font-medium">{booking.purpose}</p>
                            <p className="text-sm text-gray-600">
                              {booking.startTime} - {booking.endTime}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {avail.isAvailable && (
                      <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                        <p className="text-green-700 font-medium">
                          ✓ Hall is available all day
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookHall;
