import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useStore from "../Store/Store";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userToken, announcements, getAnnouncements } =
    useStore();
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const announcementsPerPage = 6;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      getAnnouncements();
    }
  }, [isAuthenticated, navigate, getAnnouncements]);

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

  // Pagination Logic
  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement =
    indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = announcements.slice(
    indexOfFirstAnnouncement,
    indexOfLastAnnouncement
  );
  const totalPages = Math.ceil(announcements.length / announcementsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white shadow-lg p-6 fixed h-screen overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Create Announcement
        </h2>
        <form onSubmit={onSubmitHandle} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Announcement Title"
              value={formData.title}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Details here..."
              value={formData.description}
              onChange={handleFormChange}
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition duration-200"
          >
            Publish
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 p-8">
        {/* Header */}
        <header className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage and view all announcements
          </p>
        </header>

        {/* Announcements Grid */}
        <section>
          {announcements.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 text-lg">
                No announcements available yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentAnnouncements.map((announcement, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition duration-300 border border-gray-100"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-600 mb-3 line-clamp-3">
                    {announcement.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(announcement.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {announcements.length > announcementsPerPage && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition duration-200`}
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
