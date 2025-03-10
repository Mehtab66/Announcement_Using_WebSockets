import React, { useState, useEffect } from "react";
import useStore from "../Store/Store";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getAnnouncements, announcements, socket } =
    useStore();
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect if not authenticated and fetch initial data
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      getAnnouncements();
    }
  }, [isAuthenticated, navigate, getAnnouncements]);

  // Filter announcements based on search term
  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-5 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Announcements Dashboard
        </h1>
        <input
          type="text"
          placeholder="Search announcements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-72 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Socket Connection Status */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Socket Status: {socket?.connected ? "Connected" : "Disconnected"}
        </p>
      </div>

      {/* Announcement Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAnnouncements.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No announcements found</p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id || announcement._id} // Use a unique key
              className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {announcement.title || "Untitled"}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {announcement.date ||
                  new Date(announcement.timestamp).toLocaleDateString()}
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                {announcement.content ||
                  announcement.description ||
                  "No content"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
