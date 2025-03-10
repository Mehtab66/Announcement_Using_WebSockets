import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useStore from "../Store/Store";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    userToken,
    announcements,
    getAnnouncements,
    userInformation,
    checkAuth,
    isLoadingAuth,
    socket,
  } = useStore();
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const announcementsPerPage = 9;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      navigate("/");
    } else if (isAuthenticated && !isLoadingAuth) {
      getAnnouncements();
    }
  }, [isAuthenticated, isLoadingAuth, navigate, getAnnouncements]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3000/announcement/makeAnnouncement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${userToken}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Announcement Made Successfully");
        setFormData({ title: "", description: "" });
        getAnnouncements();
      } else {
        toast.error(data.message || "Failed to make announcement");
      }
    } catch (error) {
      console.error("Error submitting announcement:", error);
      toast.error("An error occurred while making the announcement");
    }
  };

  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement =
    indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = announcements.slice(
    indexOfFirstAnnouncement,
    indexOfLastAnnouncement
  );
  const totalPages = Math.ceil(announcements.length / announcementsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-lg fixed h-full p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-indigo-600">Admin Portal</h2>
          <p className="text-sm text-gray-500">Manage Society Announcements</p>
        </div>
        <form onSubmit={onSubmitHandle} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Announcement Title
            </label>
            <input
              type="text"
              name="title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter title"
              value={formData.title}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Enter details..."
              value={formData.description}
              onChange={handleFormChange}
              rows="5"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition duration-300"
          >
            Publish Announcement
          </button>
        </form>
        <div className="absolute bottom-6">
          <p className="text-sm text-gray-600">
            Logged in as:{" "}
            <span className="font-medium">
              {userInformation?.name || "Admin"}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Status:{" "}
            {socket?.connected ? (
              <span className="text-green-600">Online</span>
            ) : (
              <span className="text-red-600">Offline</span>
            )}
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8">
        <header className="bg-white shadow-md p-6 rounded-lg mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor society updates
          </p>
          <div className="mt-4">
            <p className="text-gray-700">
              <span className="font-medium">Username:</span>{" "}
              {userInformation?.name || "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Number:</span>{" "}
              {userInformation?.number || "N/A"}
            </p>
          </div>
        </header>

        <section>
          {announcements.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg">
                No announcements available yet
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Create one to get started
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentAnnouncements.map((announcement) => (
                <div
                  key={announcement.id || announcement._id || Math.random()} // Use a stable key if possible
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-200"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {announcement.title || "Untitled"}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {announcement.description ||
                      announcement.content ||
                      "No description"}
                  </p>
                  <div className="border-t pt-3">
                    {userInformation?.name === announcement.admin?.name ? (
                      <p className="text-sm text-indigo-600 font-medium">
                        Made By You
                      </p>
                    ) : (
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">By:</span>{" "}
                        {announcement.admin?.name || "Unknown"}
                      </p>
                    )}
                    {userInformation?.number !== announcement.admin?.number && (
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Contact:</span>{" "}
                        {announcement.admin?.number || "N/A"}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(announcement.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {announcements.length > announcementsPerPage && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition duration-300`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
