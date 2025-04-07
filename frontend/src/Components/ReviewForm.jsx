import React, { useState } from "react";
import axios from "axios";

const ReviewForm = ({ bookId, fetchBookReviews }) => {
    const [ratingValue, setRatingValue] = useState(5);
    const [commentText, setCommentText] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const reviewData = {
            book: bookId,
            rating: ratingValue,
            comment: commentText,
        };

        try {
            const response = await axios.post("http://localhost:8000/api/reviews/", reviewData, {
                headers: { "Content-Type": "application/json" },
            });
            console.log("Response:", response.data);
            alert("Review added successfully!");
            fetchBookReviews(); // Refresh the review list
        } catch (error) {
            console.error("Error adding review:", error.response?.data);
            alert("Failed to submit review.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded">
            <label className="block font-bold">Rating (1-5):</label>
            <input
                type="number"
                value={ratingValue}
                onChange={(e) => setRatingValue(Number(e.target.value))}
                min="1"
                max="5"
                className="border p-2 w-full"
            />

            <label className="block font-bold mt-2">Comment:</label>
            <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="border p-2 w-full"
                rows="3"
            />

            <button type="submit" className="mt-3 bg-blue-500 text-white p-2 rounded">
                Submit Review
            </button>
        </form>
    );
};

export default ReviewForm;
