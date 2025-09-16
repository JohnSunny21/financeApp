import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Form.css";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); 

  const { login } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null); 
    try {
      // The login service call returns the response data.
      const response = await authService.login(username, password);

      if (response.data.jwt) {
        // Call the context's login function with the new token.
        login(response.data.jwt);
        console.log("Login successful, context updated.");

        // Redirect to the dashboard page, which we'll create soon
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Invalid username or password.";
      setError(errorMessage);
      console.error("Login error: ", err.response);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-card">
        <h2> Login </h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="form-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
