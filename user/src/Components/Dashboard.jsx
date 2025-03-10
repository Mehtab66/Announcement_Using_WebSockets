import React, { useState, useEffect } from "react";
import useStore from "../Store/Store";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    getAnnouncements,
    announcements,
    socket,
    userInformation,
    Logout,
  } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      getAnnouncements();
    }
  }, [isAuthenticated, navigate, getAnnouncements]);

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed h-full p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-indigo-600">Society Hub</h2>
          <p className="text-sm text-gray-500">Community Announcements</p>
        </div>
        <nav className="space-y-4">
          <a href="#" className="flex items-center text-indigo-600 font-medium">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </a>
          <p className="text-sm text-gray-600">
            Status:{" "}
            {socket?.connected ? (
              <span className="text-green-600">Online</span>
            ) : (
              <span className="text-red-600">Offline</span>
            )}
          </p>
        </nav>
        <div className="absolute bottom-6">
          <p className="text-sm text-gray-600">
            Logged in as:{" "}
            <span className="font-medium">
              {userInformation?.name || "User"}
            </span>
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Announcements
            </h1>
            <p className="text-sm text-gray-500">
              Stay updated with announcements
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <button
            onClick={Logout}
            className="bg-red-500 text-white rounded-xl p-4"
          >
            Logout
          </button>
        </header>

        {/* Announcements Section */}
        <main className="p-6">
          {filteredAnnouncements.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg">No announcements found</p>
              <p className="text-sm text-gray-400 mt-2">
                Check back later for updates
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement.id || announcement._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {announcement.title || "Untitled"}
                    </h3>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      {announcement.date ||
                        new Date(announcement.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {announcement.content ||
                      announcement.description ||
                      "No content"}
                  </p>
                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">By:</span>{" "}
                      {announcement.admin?.name || "Admin"}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Contact:</span>{" "}
                      {announcement.admin?.number || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
