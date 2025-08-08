import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const navLinkClasses =
    "inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300";
  const mobileLinkClasses =
    "block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800";

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Desktop Links */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <i className="bi bi-book text-primary-600 text-3xl mr-2"></i>
              <span className="font-serif text-xl font-bold text-gray-800">
                LibraryRec
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink to="/" className={navLinkClasses}>
                Home
              </NavLink>
              <NavLink to="/books" className={navLinkClasses}>
                Books
              </NavLink>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden sm:flex sm:items-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 mr-4"
                >
                  <i className="bi bi-person-circle mr-1"></i>
                  {currentUser?.name || "Profile"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <i className="bi bi-box-arrow-right mr-1"></i>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-primary-600 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Toggle menu</span>
              {isMenuOpen ? (
                <i className="bi bi-x text-2xl"></i>
              ) : (
                <i className="bi bi-list text-2xl"></i>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <NavLink
              to="/"
              className={mobileLinkClasses}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/books"
              className={mobileLinkClasses}
              onClick={() => setIsMenuOpen(false)}
            >
              Books
            </NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  className={mobileLinkClasses}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="bi bi-person-circle mr-1"></i>
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className={`${mobileLinkClasses} w-full text-left`}
                >
                  <i className="bi bi-box-arrow-right mr-1"></i>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={mobileLinkClasses}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={mobileLinkClasses}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
