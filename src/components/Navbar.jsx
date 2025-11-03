import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx'; // Import our auth hook

export default function Navbar() {
  const { currentUser } = useAuth(); // Get the current user from context

  const handleLogout = () => {
    // We will implement this in the next step
    alert('Logout logic is not implemented yet.');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo / App Name */}
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center text-2xl font-bold text-blue-600">
              {/* You can add an icon here later */}
              TravelDiary
            </Link>
          </div>
          
          {/* Links */}
          <div className="flex items-center">
            {currentUser ? (
              // --- User is Logged IN ---
              <>
                <span className="text-gray-700 mr-4 text-sm hidden sm:inline">
                  {currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Log Out
                </button>
              </>
            ) : (
              // --- User is Logged OUT ---
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="ml-4 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


