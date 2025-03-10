import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useStore from "../Store/Store"; // Adjust path as needed
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userToken, announcements, getAnnouncements } =
    useStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // Fetch announcements on mount if authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      getAnnouncements(); // Fetch announcements when component mounts
    }
  }, [isAuthenticated, navigate, getAnnouncements]);

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle submit
  const onSubmitHandle = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);

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
        getAnnouncements(); // Refresh announcements after submission
      } else {
        toast.error(data.message || "Failed to make announcement");
      }
    } catch (error) {
      console.error("Error submitting announcement:", error);
      toast.error("An error occurred while making the announcement");
    }
  };

  return (
    <>
      <div className="bg-gray-500 text-white py-10">
        <h1 className="text-2xl text-center font-bold">Admin Dashboard</h1>
      </div>
      <div>
        <h1 className="text-center text-xl pt-5 font-bold">
          Make An Announcement
        </h1>
      </div>
      <div className="flex justify-center">
        <form
          onSubmit={onSubmitHandle}
          className="bg-white p-8 w-96 shadow-md rounded-md"
        >
          <div className="flex flex-col space-y-4">
            <label className="text-lg font-bold">Title</label>
            <input
              type="text"
              name="title"
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Title"
              value={formData.title}
              onChange={handleFormChange}
            />
            <label className="text-lg font-bold">Description</label>
            <textarea
              name="description"
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description"
              value={formData.description}
              onChange={handleFormChange}
              rows="4"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <div>
        <h1 className="text-center text-xl pt-5 font-bold">
          All Announcements
        </h1>
      </div>
      <div className="flex flex-col items-center">
        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements available.</p>
        ) : (
          announcements.map((announcement, index) => (
            <div
              key={index}
              className="bg-white p-4 w-96 shadow-md rounded-md my-4"
            >
              <h1 className="text-xl font-bold">{announcement.title}</h1>
              <p>{announcement.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(announcement.timestamp).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Dashboard;
