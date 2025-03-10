// components/Login.js
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useStore from "../Store/Store";
const Login = () => {
  const { setUserToken } = useStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", formData);
    const handleLogin = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.status === 200) {
          toast.success("Login Successful");
          navigate("/dashboard");
          setUserToken(data.token);
        } else {
          toast.error(data.message);
        }
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    handleLogin();
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md ">
      <h2 className="text-2xl font-bold text-center mb-6">User Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </form>
      <p className="text-center mt-4">
        Need an account?{" "}
        <a href="/signup" className="text-blue-500 hover:underline">
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default Login;
