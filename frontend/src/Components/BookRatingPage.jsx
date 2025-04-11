import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewForm from "./ReviewForm";

const BookRatingPage = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [borrowMessage, setBorrowMessage] = useState("");

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

    const handleBorrowBook = async () => {
        if (!userId) {
            setBorrowMessage("⚠️ Please log in to borrow this book.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/api/borrow/", {
                user: userId,
                book: id,
            });

            setBorrowMessage("✅ Book borrowed successfully!");
        } catch (error) {
            console.error("Error borrowing book:", error);
            setBorrowMessage("❌ Failed to borrow book. Try again.");
        }
    };

    return book ? (
        <div className="p-6 max-w-3xl mx-auto">
            {/* Book Info */}
            <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
                <h1 className="text-3xl font-bold text-indigo-700">{book.title}</h1>
                <p className="text-lg text-gray-600 mb-1">by {book.author}</p>
                <p className="text-sm mb-1"><strong>Department:</strong> {book.department}</p>
                <p className="text-sm mb-3">
                    <strong>Average Rating:</strong>{" "}
                    <span className="text-yellow-500 font-medium">{book.average_rating} ⭐</span>
                </p>

                <button
                    onClick={handleBorrowBook}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md"
                >
                    📚 Borrow Book
                </button>

                {borrowMessage && <p className="mt-2 text-sm text-green-700">{borrowMessage}</p>}
            </div>

            {/* Reviews */}
            <h2 className="text-xl font-semibold mb-4">Reviews:</h2>
            <div className="space-y-4 mb-6">
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className="bg-white shadow-md rounded-xl p-4 border">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                                {review.created_at && (
                                    <span className="text-sm text-gray-500">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No reviews yet.</p>
                )}
            </div>

            {/* Review Form */}
            <ReviewForm bookId={id} userId={userId} fetchBookReviews={fetchBookReviews} />
        </div>
    ) : (
        <p className="p-6 text-gray-600">Loading...</p>
    );
};

export default BookRatingPage;
