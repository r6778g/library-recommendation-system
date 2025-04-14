import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './BookRatingPage.css';

const BookRatingPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [borrowMessage, setBorrowMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const navigate = useNavigate();
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const userId = user?.id || null;

  const fetchBookDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/books/${id}/`);
      setBook(response.data);
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  }, [id]);



  const fetchBookReviews = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/reviews/book/${id}/`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching book reviews:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchBookDetails();
    fetchBookReviews();
  }, [fetchBookDetails, fetchBookReviews]);

  const handleBorrowBook = () => {
    if (!userId) {
      setBorrowMessage("⚠️ Please log in to borrow this book.");
      return;
    }
    navigate('/borrow');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("Please log in to submit a review.");
      return;
    }
    try {
      await axios.post("http://localhost:8000/api/reviews/", {
        user: userId,
        book: id,
        rating,
        comment
      });
      setComment("");
      setRating(5);
      fetchBookReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!book) return <p className="rating-page">Loading...</p>;

  return (
    <div className="rating-page">
         <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ⬅️ Back to Dashboard
      </button>
      </div>
      <h1 className="rating-header">Book Details & Reviews</h1>

      {/* Book Info */}
      <div className="book-details">
        <h2>{book.title}</h2>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Department:</strong> {book.department}</p>
        <p>
          <strong>Average Rating:</strong>{" "}
          <span className="text-yellow-500">{book.average_rating} ⭐</span>
        </p>
       
      </div>

      {/* Reviews */}
      <div className="review-section">
        <h2 className="rating-header">User Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>
                    ★
                  </span>
                ))}
              </div>
              <small className="text-gray-500">
                {review.created_at ? new Date(review.created_at).toLocaleDateString() : ""}
              </small>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="empty-review">No reviews yet.</p>
        )}
      </div>

      {/* Review Form */}
      <form className="rating-form" onSubmit={handleSubmitReview}>
        <h3>Submit a Review</h3>

        <label htmlFor="rating">Rating </label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          required
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>

        <label htmlFor="comment">Comment</label>
        <textarea
          id="comment"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review here..."
          required
        ></textarea>
         <div><button type="submit" className="submit-button">Submit Review</button></div>
        
      </form>
    </div>
  );
};

export default BookRatingPage;
