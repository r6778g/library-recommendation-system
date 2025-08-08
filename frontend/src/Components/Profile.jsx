import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Load user safely from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        navigate("/login"); // Auto-redirect if no user
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return null; // Avoid flicker before redirect

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg w-[90%] sm:w-full">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ⬅️ Back to Dashboard
      </button>

      {/* Profile Header */}
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">👤 Profile</h1>

      {/* User Info */}
      <div className="space-y-2 text-gray-800">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>ID:</strong> {user.id}</p>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/login");
        }}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        🚪 Logout
      </button>
    </div>
  );
};

export default Profile;
