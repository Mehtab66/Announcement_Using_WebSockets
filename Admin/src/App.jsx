import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import AdminLogin from "./Components/Login";
import AdminDashboard from "./Components/Dashboard";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;
