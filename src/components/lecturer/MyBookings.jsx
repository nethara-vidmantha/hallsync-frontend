import React, { useState, useEffect } from "react";
import { bookingAPI } from "../../services/api";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      await bookingAPI.cancelBooking(bookingId);
      toast.success("Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    if (filter === "upcoming") {
      return (
        new Date(booking.date) >= new Date() && booking.status === "active"
      );
    }
    if (filter === "past") {
      return new Date(booking.date) < new Date() || booking.status !== "active";
    }
    return true;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

      <div className="card mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === "all"
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            All Bookings
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === "upcoming"
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("past")}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === "past"
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Past
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.map((booking) => (
          <div key={booking._id} className="card">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {booking.hall?.name}
              </h3>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  booking.status === "active"
                    ? "bg-green-100 text-green-800"
                    : booking.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {booking.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>
                <span className="font-medium">Building:</span>{" "}
                {booking.hall?.building}
              </p>
              <p>
                <span className="font-medium">Floor:</span>{" "}
                {booking.hall?.floor && booking.hall?.floor !== "N/A"
                  ? booking.hall.floor
                  : "—"}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(booking.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Time:</span> {booking.startTime} -{" "}
                {booking.endTime}
              </p>
              <p>
                <span className="font-medium">Purpose:</span> {booking.purpose}
              </p>
            </div>

            {booking.status === "active" &&
              new Date(booking.date) >= new Date() && (
                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="w-full btn-danger flex items-center justify-center space-x-2"
                >
                  <FaTimes />
                  <span>Cancel Booking</span>
                </button>
              )}
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">No bookings found</p>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
