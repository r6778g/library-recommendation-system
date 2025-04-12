import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const BorrowPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { bookId } = location.state || {}; // Get bookId from state
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const userId = user?.id || null;

    const [borrowMessage, setBorrowMessage] = useState(""); // Message to display after borrowing

    useEffect(() => {
        if (!bookId || !userId) {
            navigate("/login"); // Redirect to login if no bookId or userId
        }
    }, [bookId, userId, navigate]);

    // Handle borrowing the book
    const handleBorrowBook = async () => {
        try {
            const response = await axios.post("http://localhost:8000/api/borrow/", {
                user: userId,
                book: bookId,
            });
            setBorrowMessage("✅ Book borrowed successfully!");
        } catch (error) {
            console.error("Error borrowing book:", error.response?.data || error.message);
            setBorrowMessage("❌ Failed to borrow the book. Please try again.");
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-indigo-700">Borrow Book</h1>
            {borrowMessage && <p className="mt-2 text-sm text-green-700">{borrowMessage}</p>}
            
            <button
                onClick={handleBorrowBook}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md mt-4"
            >
                📚 Borrow Book
            </button>
        </div>
    );
};

export default BorrowPage;
