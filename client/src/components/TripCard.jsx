import { Link } from 'react-router-dom';

export default function TripCard({ trip }) {
  return (
    <Link
      to={`/trips/${trip._id}`}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 ease-in-out group"
    >
      <div className="h-48 overflow-hidden">
        {trip.coverImageURL ? (
          <img
            src={trip.coverImageURL}
            alt={trip.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-lg">No Image</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors duration-300">
          {trip.title}
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          {trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No start date'}
          {trip.endDate ? ` - ${new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
        </p>
      </div>
    </Link>
  );
}