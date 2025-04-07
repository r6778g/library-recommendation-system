import React from 'react';
import { Link } from 'react-router-dom'; // ✅ Needed for routing
import './Header.css'; // ✅ Make sure this file exists in the same folder

const Header = () => {
  return (
    <header className="main-header">
      <h1 className="logo">📚 Book Dashboard</h1>
      <nav>
        <Link to="/homepage">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login">Logout</Link>
      </nav>
    </header>
  );
};

export default Header;
