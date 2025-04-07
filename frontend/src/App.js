import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Dashboard from './Components/Dashboard';
import BookRatingPage from "./Components/BookRatingPage"; 
import HomePage from './Components/HomePage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book/:id" element={<BookRatingPage />} /> 
        <Route path="/homepage" element={<HomePage />} />
        
       
      </Routes>
    </Router>
  );
};

export default App;
