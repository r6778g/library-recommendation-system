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
    fetchRecommendedBooks();
    fetchRandomBooks();
  }, []);

  // Autoplay slider
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [recommendedBooks, currentIndex]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchRecommendedBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/recommended-books/');
      setRecommendedBooks(response.data);
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
      {/* USER INFO */}
      {userData && (
        <div className="user-info">
          <h2>👋 Welcome, {userData.name}!</h2>
          <p>Email: {userData.email}</p>
          <p>Department: {userData.department}</p>
        </div>
      )}

      {/* SLIDER */}
      <h2 className="slider-title">Recommendation System</h2>
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
      <h2 className="random-title">Books Suggetion</h2>
      <div className="random-books-grid">
        {randomBooks.map((book) => (
          <div key={book.id} className="book-card" onClick={() => handleBookClick(book.id)}>
            <h4>{book.title}</h4>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Department:</strong> {book.department}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Homepage;

