import React, { useState, useEffect } from 'react';
import { timetableAPI, hallAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { DEPARTMENTS, DAYS_OF_WEEK, TIME_SLOTS } from '../../utils/constants';
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';

const ManageTimetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [halls, setHalls] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    academicYear: 1,
    semester: 1,
    department: '',
    course: '',
    entries: []
  });

  useEffect(() => {
    fetchTimetables();
    fetchHalls();
  }, []);

  const fetchTimetables = async () => {
    try {
      const response = await timetableAPI.getAllTimetables();
      setTimetables(response.data);
    } catch (error) {
      toast.error('Failed to fetch timetables');
    }
  };

  const fetchHalls = async () => {
    try {
      const response = await hallAPI.getAllHalls();
      setHalls(response.data);
    } catch (error) {
      toast.error('Failed to fetch halls');
    }
  };

  const addEntry = () => {
    setFormData({
      ...formData,
      entries: [
        ...formData.entries,
        {
          subject: '',
          hall: '',
          dayOfWeek: 'Monday',
          startTime: '08:00',
          endTime: '09:00',
          lecturer: ''
        }
      ]
    });
  };

  const removeEntry = (index) => {
    const newEntries = formData.entries.filter((_, i) => i !== index);
    setFormData({ ...formData, entries: newEntries });
  };

  const updateEntry = (index, field, value) => {
    const newEntries = [...formData.entries];
    newEntries[index][field] = value;
    setFormData({ ...formData, entries: newEntries });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.entries.length === 0) {
      toast.error('Please add at least one timetable entry');
      return;
    }

    try {
      await timetableAPI.createTimetable(formData);
      toast.success('Timetable created successfully');
      setShowForm(false);
      setFormData({
        academicYear: 1,
        semester: 1,
        department: '',
        course: '',
        entries: []
      });
      fetchTimetables();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create timetable');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this timetable?')) return;

    try {
      await timetableAPI.deleteTimetable(id);
      toast.success('Timetable deleted successfully');
      fetchTimetables();
    } catch (error) {
      toast.error('Failed to delete timetable');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Timetables</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus />
          <span>Create Timetable</span>
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Timetable</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year
                </label>
                <select
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: parseInt(e.target.value) })}
                  className="input-field"
                  required
                >
                  <option value={1}>Year 1</option>
                  <option value={2}>Year 2</option>
                  <option value={3}>Year 3</option>
                  <option value={4}>Year 4</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                  className="input-field"
                  required
                >
                  <option value={1}>Semester 1</option>
                  <option value={2}>Semester 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course (Optional)
                </label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Software Engineering"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Timetable Entries</h3>
                <button
                  type="button"
                  onClick={addEntry}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <FaPlus />
                  <span>Add Entry</span>
                </button>
              </div>

              {formData.entries.map((entry, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={entry.subject}
                        onChange={(e) => updateEntry(index, 'subject', e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hall
                      </label>
                      <select
                        value={entry.hall}
                        onChange={(e) => updateEntry(index, 'hall', e.target.value)}
                        className="input-field"
                        required
                      >
                        <option value="">Select Hall</option>
                        {halls.map((hall) => (
                          <option key={hall._id} value={hall._id}>
                            {hall.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Day
                      </label>
                      <select
                        value={entry.dayOfWeek}
                        onChange={(e) => updateEntry(index, 'dayOfWeek', e.target.value)}
                        className="input-field"
                        required
                      >
                        {DAYS_OF_WEEK.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                      </label>
                      <select
                        value={entry.startTime}
                        onChange={(e) => updateEntry(index, 'startTime', e.target.value)}
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
                        End Time
                      </label>
                      <select
                        value={entry.endTime}
                        onChange={(e) => updateEntry(index, 'endTime', e.target.value)}
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

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeEntry(index)}
                        className="btn-danger w-full"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex items-center space-x-2">
                <FaSave />
                <span>Save Timetable</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Existing Timetables</h2>
        <div className="space-y-4">
          {timetables.map((timetable) => (
            <div key={timetable._id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    Year {timetable.academicYear} - Semester {timetable.semester}
                  </h3>
                  <p className="text-gray-600">
                    Department: {timetable.department}
                    {timetable.course && ` - ${timetable.course}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {timetable.entries.length} entries
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(timetable._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageTimetable;
