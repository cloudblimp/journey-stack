import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx'; // Import our auth hook

// Import Pages
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

// Import Components
import Navbar from './components/Navbar.jsx';

/**
 * A protected route component.
 * If the user is logged in (currentUser exists), it renders the requested component.
 * If not, it redirects them to the /login page.
 */
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) {
    // User not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }
  return children; // User is logged in, render the component
}

/**
 * The main App component that sets up all the routes.
 */
export default function App() {
  const { loading } = useAuth();

  // Show a loading spinner or message while Firebase is checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  // Auth state is loaded, render the app
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* The Navbar will show on every page */}
      <main>
        <Routes>
          {/* Protected Routes:
            These routes can only be accessed if the user is logged in.
          */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Public Routes:
            These routes are accessible to everyone.
          */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Catch-all Route:
            If no other route matches, redirect to the dashboard (which will
            then redirect to /login if the user is not authenticated).
          */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

