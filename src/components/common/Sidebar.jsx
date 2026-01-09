import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaHome, FaUsers, FaCalendarAlt, FaDoorOpen, 
  FaBook, FaClipboardList, FaEnvelope 
} from 'react-icons/fa';

const Sidebar = () => {
  const { user, isAdmin, isLecturer, isRepresentative } = useAuth();

  const adminLinks = [
    { to: '/admin/dashboard', icon: FaHome, label: 'Dashboard' },
    { to: '/admin/users', icon: FaUsers, label: 'Manage Users' },
    { to: '/admin/timetable', icon: FaCalendarAlt, label: 'Manage Timetables' },
    { to: '/admin/halls', icon: FaDoorOpen, label: 'Manage Halls' },
    { to: '/admin/bookings', icon: FaBook, label: 'All Bookings' },
  ];

  const lecturerLinks = [
    { to: '/lecturer/dashboard', icon: FaHome, label: 'Dashboard' },
    { to: '/lecturer/book-hall', icon: FaBook, label: 'Book Hall' },
    { to: '/lecturer/bookings', icon: FaClipboardList, label: 'My Bookings' },
    { to: '/lecturer/requests', icon: FaEnvelope, label: 'Booking Requests' },
    { to: '/lecturer/halls', icon: FaDoorOpen, label: 'View Halls' },
    { to: '/lecturer/timetable', icon: FaCalendarAlt, label: 'Timetables' },
  ];

  const representativeLinks = [
    { to: '/representative/dashboard', icon: FaHome, label: 'Dashboard' },
    { to: '/representative/request', icon: FaEnvelope, label: 'Request Booking' },
    { to: '/representative/requests', icon: FaClipboardList, label: 'My Requests' },
    { to: '/representative/halls', icon: FaDoorOpen, label: 'View Halls' },
  ];

  let links = [];
  if (isAdmin) links = adminLinks;
  else if (isLecturer) links = lecturerLinks;
  else if (isRepresentative) links = representativeLinks;

  return (
    <aside className="bg-white w-64 min-h-screen shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Navigation</h2>
        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <link.icon className="text-xl" />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
