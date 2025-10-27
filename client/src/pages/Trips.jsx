import { useEffect, useState } from 'react';
import { tripsApi } from '../api';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  async function loadTrips() {
    try {
      const data = await tripsApi.list();
      setTrips(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load trips');
    }
  }

  useEffect(() => {
    loadTrips();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      await tripsApi.create({ title, startDate: startDate || undefined, endDate: endDate || undefined });
      setTitle('');
      setStartDate('');
      setEndDate('');
      await loadTrips();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create trip (are you logged in?)');
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Your Trips</h2>
        <button 
          onClick={() => document.getElementById('addTripForm').classList.toggle('hidden')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
        >
          + New Trip
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form 
        id="addTripForm" 
        onSubmit={handleCreate} 
        className="hidden bg-white rounded-lg shadow-md p-6 mb-8 space-y-4"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Trip Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter trip title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Create Trip
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trips.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">You haven't created any trips yet.</p>
            <p className="text-gray-500 text-sm mt-2">Click the "New Trip" button to get started!</p>
          </div>
        ) : (
          trips.map((trip) => (
            <div 
              key={trip._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{trip.title}</h3>
              <div className="text-sm text-gray-600">
                {trip.startDate && (
                  <p>
                    <span className="font-medium">Start:</span>{' '}
                    {new Date(trip.startDate).toLocaleDateString()}
                  </p>
                )}
                {trip.endDate && (
                  <p>
                    <span className="font-medium">End:</span>{' '}
                    {new Date(trip.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


