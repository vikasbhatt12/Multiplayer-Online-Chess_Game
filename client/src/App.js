import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Navbar from './Navbar';
import Guest from './Guest';
import Signup from "./Signup";
import Home from "./Home";
import "./styles.css"; // Add any global styles here
import './App.css'; // Import the CSS file
import Dashboard from "./Dashboard";
import PrivateRoute from "./PrivateRoute";

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login setUsername={setUsername} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<Signup setUsername={setUsername} setIsLoggedIn={setIsLoggedIn} />}/>
        <Route path="/guest" element={<Guest/>} />
        <Route path="/home" element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <Home username={username}/>
          </PrivateRoute>
        }/>

      </Routes>
    </Router>
  );
}
