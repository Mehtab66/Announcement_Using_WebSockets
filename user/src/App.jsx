import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./Components/SignUp";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<Signup />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
    </>
  );
}

export default App;
