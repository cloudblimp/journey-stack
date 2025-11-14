import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTrip } from '../contexts/TripContext';
import TripLocationMap from '../components/TripLocationMap';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function MapView() {
  const { currentUser } = useAuth();
  const { trips } = useTrip();
  const navigate = useNavigate();

  // Get all trips with locations
  const tripsWithLocations = trips.filter(trip => trip.locations && trip.locations.length > 0);
  
  // Aggregate all locations from all trips
  const allLocations = tripsWithLocations.reduce((acc, trip) => {
    return [...acc, ...trip.locations];
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Travel Map</h1>
            <p className="text-gray-600 mt-2">
              All your trip destinations visualized on one map
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            <FaArrowLeft className="mr-2" /> Back to Trips
          </button>
        </div>

        {/* Empty State */}
        {tripsWithLocations.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">
              No trips with location stops found.
            </p>
            <p className="text-gray-500">
              Create a trip and add location stops with coordinates to see them on the map.
            </p>
          </div>
        )}

        {/* Map */}
        {tripsWithLocations.length > 0 && (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-600">Trips with Locations</p>
                <p className="text-2xl font-bold text-gray-900">{tripsWithLocations.length}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-600">Total Location Stops</p>
                <p className="text-2xl font-bold text-gray-900">{allLocations.length}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-600">All Trips</p>
                <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
              </div>
            </div>

            {/* Global Map */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">All Your Trip Destinations</h2>
              <TripLocationMap locations={allLocations} />
            </div>

            {/* Per-trip breakdown */}
            {tripsWithLocations.length > 1 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-6">Trip Breakdown</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {tripsWithLocations.map(trip => (
                    <div key={trip.id} className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-2">{trip.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{trip.locations.length} location stops</p>
                      <TripLocationMap locations={trip.locations} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
