import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { FaSuitcase, FaMap } from 'react-icons/fa';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      // simple fallback notification
      window.alert('Logged out successfully');
      navigate('/login');
    } catch (err) {
      console.error('Logout error', err);
      window.alert(err?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  // Get user's first initial for avatar
  const userInitial = currentUser?.email?.[0]?.toUpperCase() || '?';

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo / App Name */}
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-gray-900">
                journeyStack
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          {currentUser && (
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') 
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <FaSuitcase className="h-4 w-4" />
                <span>My Trips</span>
              </Link>
              
              <Link
                to="/map"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/map')
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <FaMap className="h-4 w-4" />
                <span>Map View</span>
              </Link>

              {/* User Avatar & Menu */}
              <div className="relative ml-3">
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="h-8 w-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {userInitial}
                </button>
              </div>
            </div>
          )}

          {/* Login/Signup for non-authenticated users */}
          {!currentUser && (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}


