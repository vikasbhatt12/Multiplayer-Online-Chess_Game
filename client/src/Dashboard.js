
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file

const Dashboard = () => {
  const navigate = useNavigate();



  return (
    <div className="home-container">
      <h1>Welcome to Chess Game</h1>
      <p>Play chess with your friends online!</p>
      <button onClick={() => navigate('/login')} className="get-started-button">Login</button>
      <button onClick={() => navigate('/signup')} className="get-started-button">Signup</button>
      <button onClick={() => navigate('/guest')} className="get-started-button">Play as Guest</button>

    </div>
  );
};

export default Dashboard;
