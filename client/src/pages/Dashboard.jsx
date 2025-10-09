import { useEffect, useState } from 'react';
import { tripsApi } from '../api';
import TripCard from '../components/TripCard.jsx';

export default function Dashboard() {
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
      setError(err?.response?.data?.message || 'Failed to create trip');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Plan a New Adventure</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="Trip title, e.g., 'Summer in Italy'"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 md:col-span-1">
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="md:col-span-1">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300 ease-in-out font-semibold shadow-md"
            >
              Create Trip
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Trips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trips.map((t) => (
            <TripCard key={t._id} trip={t} />
          ))}
        </div>
      </div>
    </div>
  );
}