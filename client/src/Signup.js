import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "./socket";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from "./Firebase";

function Signup ({ setIsLoggedIn, setUsername }){
  const navigate = useNavigate();
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  

  const handleSignup = async (e) => {
    e.preventDefault();
    try{
      if (usernameInput && emailInput && password) {
        await createUserWithEmailAndPassword(auth, emailInput, password);
        const user = auth.currentUser;
        console.log(user);
        console.log("user registered successfully");
        setUsername(usernameInput);
        socket.emit("username", usernameInput);
        setIsLoggedIn(true);
        navigate(`/home`);
      } else {
        alert('Please enter both username and password');
      }

    }
    catch (error){
      console.log(error.message);

    }
    
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
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
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/">Login</a>
      </p>
    </div>
  );
}

export default Signup;
