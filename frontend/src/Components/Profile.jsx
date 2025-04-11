import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState({
    email: '',
    username: '',
  });

  const token = localStorage.getItem('token'); // Auth token

  useEffect(() => {
    axios.get('http://localhost:8000/api/profile/', {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => setUser(res.data))
    .catch(err => console.error('Error fetching user:', err));
  }, []);

  return (
    <div className="profile-container">
      <h2>👤 User Profile</h2>

      <div className="profile-info">
        <label>Username:</label>
        <p>{user.username}</p>

        <label>Email:</label>
        <p>{user.email}</p>
      </div>
    </div>
  );
}

export default Profile;
