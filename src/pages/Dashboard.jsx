import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx'; // Import our auth hook

export default function Dashboard() {
  const { currentUser } = useAuth(); // Get the current user from our context

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Dashboard</h1>
        <p className="text-xl text-gray-700">
          Welcome, <span className="font-semibold text-blue-600">{currentUser?.email}</span>!
        </p>
        <p className="mt-4 text-gray-600">This is your personal dashboard. Your saved trips will appear here soon.</p>
        
        {/* We will add the "Create Trip" form and "Trip List" here in a future step */}
      </div>
    </div>
  );
}
