import React from "react";

const Profile = () => {
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  if (!user) {
    return <p className="p-6 text-red-600">⚠️ No user data found. Please log in.</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">👤 Profile</h1>

      <div className="space-y-2 text-gray-800">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>ID:</strong> {user.id}</p>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
};

export default Profile;
