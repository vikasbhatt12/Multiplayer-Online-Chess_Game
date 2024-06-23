import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "./socket";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "./Firebase";
import "./Login.css";

function Login({ setIsLoggedIn, setUsername }) {
  const navigate = useNavigate();
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async(e) => {
    e.preventDefault();
    // Implement login logic here
    // On successful login:
    try{
      if (usernameInput && emailInput &&  password) {
        
        setUsername(usernameInput);
        socket.emit("username", usernameInput);
        await signInWithEmailAndPassword(auth, emailInput, password);
        console.log("user Logged in successfully");
        setIsLoggedIn(true);
        navigate(`/home`);
      }

    }
    catch(error){
      console.log(error.message);
      setErrorMessage("Invalid username or password. Please try again.");

    }
   
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}

export default Login;
