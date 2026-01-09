import React, { useState, useEffect } from "react";
import { representativeAPI } from "../../services/api";
import { toast } from "react-toastify";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCancel = async (requestId) => {
    if (!window.confirm("Cancel this booking request?")) return;

    try {
      await representativeAPI.cancelBookingRequest(requestId);
      toast.success("Booking request cancelled");
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel request");
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await representativeAPI.getMyRequests();
      setRequests(response.data);
    } catch (error) {
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((request) => {
    if (filter === "all") return true;
    return request.status === filter;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        My Booking Requests
      </h1>

      <div className="card mb-6">
        <div className="flex flex-wrap gap-3">
          {["all", "pending", "approved", "rejected", "cancelled"].map(
            (value) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === value
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.map((request) => (
          <div key={request._id} className="card">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {request.hall?.name}
              </h3>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  request.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : request.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : request.status === "cancelled"
                    ? "bg-gray-200 text-gray-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {request.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>
                <span className="font-medium">Lecturer:</span>{" "}
                {request.lecturer?.name}
              </p>
              <p>
                <span className="font-medium">Building:</span>{" "}
                {request.hall?.building}
              </p>
              <p>
                <span className="font-medium">Floor:</span>{" "}
                {request.hall?.floor && request.hall?.floor !== "N/A"
                  ? request.hall.floor
                  : "—"}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(request.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Time:</span> {request.startTime} -{" "}
                {request.endTime}
              </p>
              <p>
                <span className="font-medium">Purpose:</span> {request.purpose}
              </p>
              <p>
                <span className="font-medium">Requested:</span>{" "}
                {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>

            {request.responseMessage && (
              <div
                className={`mt-4 p-3 rounded-lg ${
                  request.status === "approved"
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Response:
                </p>
                <p className="text-sm text-gray-600">
                  {request.responseMessage}
                </p>
              </div>
            )}

            {request.status === "pending" && (
              <button
                onClick={() => handleCancel(request._id)}
                className="w-full btn-danger mt-4"
              >
                Cancel Request
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">No requests found</p>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
