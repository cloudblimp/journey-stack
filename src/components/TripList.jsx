import React from 'react';
import { FaPlus } from 'react-icons/fa';
import TripCard from './TripCard';

export default function TripList({ trips = [], onCreateTrip, onTripSelect }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Travel Journeys</h1>
          <p className="mt-2 text-gray-600">Document your adventures around the world</p>
        </div>
        <button
          onClick={onCreateTrip}
          className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          <FaPlus className="h-4 w-4 mr-2" />
          New Trip
        </button>
      </div>

      {/* Trip Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} onTripSelect={onTripSelect} />
        ))}
      </div>

      {/* Empty State */}
      {trips.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trips yet</h3>
          <p className="text-gray-600">Create your first trip to start documenting your adventures!</p>
        </div>
      )}
    </div>
  );
}