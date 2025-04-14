import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';

function Homepage() {
  const [userData, setUserData] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [randomBooks, setRandomBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Fetch on mount
  useEffect(() => {
    fetchUserData();
    fetchRandomBooks();
  }, []);

  useEffect(() => {
    if (userData?.department) {
      fetchRecommendedBooks(userData.department);
    }
  }, [userData]);

  // Autoplay slider
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [recommendedBooks, currentIndex]);

  const fetchUserData = async () => {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    if (user) {
      setUserData(user);
    }
  };

  const fetchRecommendedBooks = async (department) => {
    try {
      const response = await axios.get('http://localhost:8000/api/books/');
      const filtered = response.data.filter(book => book.department === department);
      setRecommendedBooks(filtered);
    } catch (error) {
      console.error('Error fetching recommended books:', error);
    }
  };

  const fetchRandomBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/random-books/');
      
      setRandomBooks(response.data);
    } catch (error) {
      console.error('Error fetching random books:', error);
    }
  };

  const handleBookClick = (id) => {
    navigate(`/book/${id}`);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? recommendedBooks.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === recommendedBooks.length - 1 ? 0 : prev + 1
    );
  };

  const currentBook = recommendedBooks[currentIndex];

  return (
    <div className="homepage-container">
      <button
  onClick={() => navigate("/dashboard")}
  className="back-button">Dashboard
</button>
      {/* USER INFO */}
      {userData && (
        <div className="user-info">
          <h2>👋 Welcome, {userData.name}!</h2>
          <p>Email: {userData.email}</p>
          <p>Department: {userData.department}</p>
        </div>
        
      )}

      {/* SLIDER */}
      <h2 className="slider-title">Books Recommended for {userData?.department}</h2>
      {currentBook && (
        <div className="carousel-container">
          <button onClick={handlePrev} className="carousel-btn">⬅️</button>
          <div className="book-card large" onClick={() => handleBookClick(currentBook.id)}>
            <h3>{currentBook.title}</h3>
            <p><strong>Author:</strong> {currentBook.author}</p>
            <p><strong>Department:</strong> {currentBook.department}</p>
          </div>
          <button onClick={handleNext} className="carousel-btn">➡️</button>
        </div>
      )}

      {/* RANDOM BOOKS */}
      
      <h2 className="random-title">Books Suggestion</h2>
      <div className="random-books-grid">
        {randomBooks.length > 0 ? (
          randomBooks.map((book) => (
            <div key={book.id} className="book-card" onClick={() => handleBookClick(book.id)}>
              <h4>{book.title}</h4>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Department:</strong> {book.department}</p>
            </div>
          ))
        ) : (
          <p className="empty-review">No books found in your department.</p>
        )}
      </div>
    </div>
  );
}

export default Homepage;
