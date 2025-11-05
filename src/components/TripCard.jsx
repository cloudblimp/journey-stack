import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';

export default function TripCard({ trip }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Link
      to={`/trip/${trip.id}`}
      className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative h-48 w-full">
        <img
          src={trip.coverImage || 'https://via.placeholder.com/800x480'}
          alt={trip.title}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {trip.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {trip.description}
        </p>
        <div className="flex items-center text-gray-500 text-sm">
          <FaCalendarAlt className="h-4 w-4 mr-2" />
          <span>
            {formatDate(trip.startDate)}{trip.endDate ? ` - ${formatDate(trip.endDate)}` : ''}
          </span>
        </div>
      </div>
    </Link>
  );
}

