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
    <div style={{ maxWidth: 1040, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 12 }}>Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleCreate} style={{ display: 'grid', gap: 8, margin: '12px 0 24px' }}>
        <input placeholder="Trip title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <button type="submit">Create Trip</button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {trips.map((t) => (
          <TripCard key={t._id} trip={t} />
        ))}
      </div>
    </div>
  );
}


