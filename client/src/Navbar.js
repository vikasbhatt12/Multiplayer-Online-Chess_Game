// File: src/components/Navbar.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h2>Chess Game
      </h2>
      {isLoggedIn ? (
        <button onClick={handleLogout} className="nav-button">Logout</button>
      ) : (
        <div className="buttonStyle">
        <button onClick={() => navigate('/login')} className="nav-button">Login</button>
        <button onClick={() => navigate('/signup')} className="nav-button">Signup</button>

        </div>
      )}
    </nav>
  );
};

export default Navbar;
