import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewForm from "./ReviewForm";  // ✅ Import the form

const BookRatingPage = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const userId = 1; // Change this to the logged-in user ID

    // Fetch book details
    const fetchBookDetails = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/books/${id}/`);
            setBook(response.data);
        } catch (error) {
            console.error("Error fetching book details:", error);
        }
    }, [id]);

    // Fetch book reviews
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

    return book ? (
        <div className="p-6">
            <h1 className="text-2xl font-bold">{book.title}</h1>
            <p className="text-gray-600">{book.author}</p>
            <p><strong>Department:</strong> {book.department}</p>
            <p><strong>Average Rating:</strong> {book.average_rating} ⭐</p>

            <h2 className="mt-4 font-semibold">Reviews:</h2>
            <ul>
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <li key={index} className="border-b p-2">
                            {review.rating} ⭐ - {review.comment}
                        </li>
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )}
            </ul>

            {/* ✅ Add Review Form */}
            <ReviewForm bookId={id} userId={userId} fetchBookReviews={fetchBookReviews} />
        </div>
    ) : (
        <p>Loading...</p>
    );
};

export default BookRatingPage;
