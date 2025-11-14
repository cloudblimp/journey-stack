import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { FaSuitcase, FaMap, FaUser, FaCog, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    toast.promise(
      logout(),
      {
        loading: 'Logging out...',
        success: 'Logged out successfully! 👋',
        error: (err) => err?.message || 'Logout failed'
      }
    ).then(() => {
      navigate('/login');
    }).catch((err) => {
      console.error('Logout error', err);
    }).finally(() => {
      setLoading(false);
    });
  };

  // Get user's first initial for avatar
  const userInitial = currentUser?.email?.[0]?.toUpperCase() || '?';

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          {/* Logo / App Name */}
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-lg sm:text-2xl font-bold text-gray-900">
                journeyStack
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          {currentUser && (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                to="/"
                className={`hidden sm:flex items-center space-x-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium min-h-[44px] transition-all duration-75 active:scale-95 ${
                  isActive('/') 
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-700 hover:text-blue-600 active:text-blue-700'
                }`}
              >
                <FaSuitcase className="h-4 w-4" />
                <span className="hidden sm:inline">My Trips</span>
              </Link>
              
              <Link
                to="/map"
                className={`hidden sm:flex items-center space-x-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium min-h-[44px] transition-all duration-75 active:scale-95 ${
                  isActive('/map')
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-700 hover:text-blue-600 active:text-blue-700'
                }`}
              >
                <FaMap className="h-4 w-4" />
                <span className="hidden sm:inline">Map View</span>
              </Link>

              {/* User Menu with Headless UI */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="h-10 w-10 sm:h-8 sm:w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium hover:bg-blue-700 active:bg-blue-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-75">
                    {userInitial}
                  </Menu.Button>
                </div>

                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none py-1 z-10">
                    {/* User Email Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Signed in as</p>
                      <p className="text-sm text-gray-900 font-medium truncate mt-1">{currentUser?.email}</p>
                    </div>

                    {/* My Profile */}
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`flex items-center space-x-3 px-4 py-3 text-sm min-h-[48px] ${
                            active ? 'bg-gray-100' : ''
                          } hover:bg-gray-50 active:bg-gray-200 active:scale-95 transition-all duration-75`}
                        >
                          <FaUser className="h-4 w-4 text-gray-600" />
                          <span>My Profile</span>
                        </Link>
                      )}
                    </Menu.Item>

                    {/* Account Settings */}
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/account"
                          className={`flex items-center space-x-3 px-4 py-3 text-sm min-h-[48px] ${
                            active ? 'bg-gray-100' : ''
                          } hover:bg-gray-50 active:bg-gray-200 active:scale-95 transition-all duration-75`}
                        >
                          <FaCog className="h-4 w-4 text-gray-600" />
                          <span>Account Settings</span>
                        </Link>
                      )}
                    </Menu.Item>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-1"></div>

                    {/* Logout */}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          disabled={loading}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-sm text-left min-h-[48px] ${
                            active ? 'bg-red-50' : ''
                          } text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100 active:scale-95 disabled:opacity-50 transition-all duration-75`}
                        >
                          <FaSignOutAlt className="h-4 w-4" />
                          <span>{loading ? 'Logging out...' : 'Logout'}</span>
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          )}

          {/* Login/Signup for non-authenticated users */}
          {!currentUser && (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium min-h-[44px] transition-all duration-75 active:scale-95 active:text-blue-700"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-700 active:bg-blue-800 active:scale-95 min-h-[44px] transition-all duration-75"
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


