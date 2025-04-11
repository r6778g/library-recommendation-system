import './Dashboard.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [token, setToken] = useState('');
  const [profile, setProfile] = useState(null); // profile data
  const [showProfile, setShowProfile] = useState(false); // toggle view
  const navigate = useNavigate();

  // On mount: get token and fetch books
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
    fetchBooks();
  }, []);

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/books/');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // Fetch user profile (only when button is clicked)
  const fetchProfile = () => {
    navigate('/Profile');
  };
  

  // Extract unique departments for dropdown
  const departments = ['All', ...new Set(books.map(book => book.department))];

  // Filtered books by search & department
  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      departmentFilter === 'All' || book.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  // Navigate to book detail
  const handleBookClick = (id) => {
    navigate(`/book/${id}`);
  };

  // Navigate to home page
  const handleHomeClick = () => {
    navigate('/HomePage');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">📚 Book Dashboard</h1>

        <div className="header-controls">
          <button className="home-button" onClick={handleHomeClick}>🏠 Home</button>
          <button className="profile-button" onClick={fetchProfile}>👤 Check Profile</button>

          <input
            type="text"
            placeholder="🔎 Search by Title or Author"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />

          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="department-select"
          >
            {departments.map(dep => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Cards Section */}
      <div className="cards-container">
        {filteredBooks.length === 0 ? (
          <div className="null-container">
            <p>No books found 😔</p>
          </div>
        ) : (
          filteredBooks.map(book => (
            <div
              className="book-card"
              key={book.id}
              onClick={() => handleBookClick(book.id)}
              style={{ cursor: "pointer" }}
            >
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Department:</strong> {book.department}</p>
            </div>
          ))
        )}
      </div>

      {/* Profile Section */}
      {showProfile && profile && (
        <div className="profile-container" style={{ marginTop: "30px" }}>
          <h2>👤 Your Profile</h2>
          <div className="profile-info">
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
