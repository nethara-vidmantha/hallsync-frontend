import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  verifyOtp: (data) => api.post('/auth/verify-otp', data)
};

// Admin APIs
export const adminAPI = {
  getAllUsers: (params) => api.get('/admin/users', { params }),
  addLecturer: (data) => api.post('/admin/lecturer', data),
  removeUser: (userId) => api.delete(`/admin/user/${userId}`),
  toggleBlockUser: (userId) => api.patch(`/admin/user/${userId}/block`),
  verifyRepresentative: (userId) => api.patch(`/admin/representative/${userId}/verify`),
  addAdmin: (data) => api.post('/admin/admin', data),
  removeAdmin: (userId) => api.delete(`/admin/admin/${userId}`),
  getStats: () => api.get('/admin/stats')
};

// Hall APIs
export const hallAPI = {
  getAllHalls: (params) => api.get('/halls', { params }),
  getHall: (id) => api.get(`/halls/${id}`),
  createHall: (data) => api.post('/halls', data),
  updateHall: (id, data) => api.put(`/halls/${id}`, data),
  deleteHall: (id) => api.delete(`/halls/${id}`),
  initializeHalls: () => api.post('/halls/initialize')
};

// Booking APIs
export const bookingAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getAllBookings: (params) => api.get('/bookings', { params }),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  cancelBooking: (id) => api.patch(`/bookings/${id}/cancel`),
  getHallAvailability: (params) => api.get('/bookings/availability', { params })
};

// Timetable APIs
export const timetableAPI = {
  createTimetable: (data) => api.post('/timetables', data),
  getAllTimetables: (params) => api.get('/timetables', { params }),
  getTimetable: (id) => api.get(`/timetables/${id}`),
  updateTimetable: (id, data) => api.put(`/timetables/${id}`, data),
  deleteTimetable: (id) => api.delete(`/timetables/${id}`),
  toggleStatus: (id) => api.patch(`/timetables/${id}/toggle-status`),
  getSections: (params) => api.get('/timetables/sections', { params })
};

// Representative APIs
export const representativeAPI = {
  createBookingRequest: (data) => api.post('/representative/booking-request', data),
  getMyRequests: () => api.get('/representative/my-requests'),
  getAllLecturers: () => api.get('/representative/lecturers')
};

// Lecturer APIs
export const lecturerAPI = {
  getBookingRequests: () => api.get('/lecturer/booking-requests'),
  approveRequest: (id, data) => api.patch(`/lecturer/booking-requests/${id}/approve`, data),
  rejectRequest: (id, data) => api.patch(`/lecturer/booking-requests/${id}/reject`, data)
};

export default api;
