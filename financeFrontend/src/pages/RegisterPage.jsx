import React, { useState } from "react";
import "../styles/Form.css";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); 
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // 

    try {
      // Call the register function from authService
      await authService.register(username, email, password);
      // If successful, navigate to the login page
      navigate("/login");
    } catch (err) {
      // If the API returns an error, set the error state
      const errorMessage =
        err.response?.date?.message ||
        "Registratoin failed. Please try again. ";
      setError(errorMessage);
      console.error("Registration error: ", err.response);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-card">
        <h2> Register</h2>
        {/* Display error message if it exists */}
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
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password: </label>
          <input
            type="text"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="form-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
