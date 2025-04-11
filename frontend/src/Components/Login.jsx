import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';  // <-- Added Link
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', formData);


      // Save token
      localStorage.setItem('token', response.data.token);

      // Redirect to dashboard
      navigate('/Dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid Credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <button type="submit">Login</button>

      {/* Signup link */}
      <div className="signup-link">
        <p>Don't have an account?</p>
        <Link to="/Signup">
          <button type="button">Signup</button>
        </Link>
      </div>
    </form>
  );
};

export default Login;