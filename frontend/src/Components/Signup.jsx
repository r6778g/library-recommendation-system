import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // List of departments
  const departments = [
    'Department of Business',
    'Department of Biology',
    'Department of Computer Science'
  ];

  const validateInputs = () => {
    const { username, email, password, phone, department } = formData;
    if (!username || !email || !password || !phone || !department) {
      setError('Please fill in all fields.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (phone.length < 10 || !/^\d+$/.test(phone)) {
      setError('Please enter a valid phone number.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs before submitting
    if (!validateInputs()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
   // In your handleSubmit function in Signup.jsx
try {
  const response = await axios.post('http://127.0.0.1:8000/api/signup/', formData,
  {
      headers: { "Content-Type": "application/json" },
  });
  // Rest of your code
  // Save user details
  localStorage.setItem('user', JSON.stringify(response.data.user));

      console.log("Signup successful:", response.data);
      // Redirect to login page after successful signup
      navigate('/Dashboard');
    } catch (error) {
      if (error.response) {
        // Handle specific error messages from the backend
        if (error.response.data.error === "Email already exists") {
          setError("Email is already registered. Please use a different email.");
        } else {
          setError(error.response.data.error || "Signup failed. Please try again.");
        }
        console.error("Signup error:", error.response.data);
      } else {
        setError("Network error. Please check your connection and try again.");
        console.error("Signup error:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form" noValidate>
        <h2>Signup Page</h2>
        {error && <div className="error-message" role="alert">{error}</div>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className={`signup-input ${error && !formData.username ? 'error' : ''}`}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={`signup-input ${error && !formData.email ? 'error' : ''}`}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={`signup-input ${error && !formData.password ? 'error' : ''}`}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className={`signup-input ${error && !formData.phone ? 'error' : ''}`}
          required
        />
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className={`signup-input ${error && !formData.department ? 'error' : ''}`}
          required
        >
          <option value="">Select Department</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className={`signup-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
      <div className="login-link">
        <a href="/Login">Already have an account? Login</a>
      </div>
    </div>
  );
};

export default Signup;

