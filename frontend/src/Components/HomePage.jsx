import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; // ✅ Add this


function Homepage() {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendedBooks();
  }, []);

  const fetchRecommendedBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/recommended-books/');
      setRecommendedBooks(response.data);
    } catch (error) {
      console.error('Error fetching recommended books:', error);
    }
  };

  const handleBookClick = (id) => {
    navigate(`/book/${id}`);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? recommendedBooks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === recommendedBooks.length - 1 ? 0 : prev + 1));
  };

  const currentBook = recommendedBooks[currentIndex];

  return (
    <div className="homepage-container">
      <Header />

      <h2 className="slider-title">📌 Recommended for Your Department</h2>
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
    </div>
  );
}

export default Homepage;
