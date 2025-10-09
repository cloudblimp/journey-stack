import { useEffect, useState } from 'react';
import { tripsApi } from '../../services/api';

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
    <div style={{ maxWidth: 720, margin: '24px auto' }}>
      <h2>Your Trips</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleCreate} style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
        <input placeholder="Trip title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <button type="submit">Add Trip</button>
      </form>

      <ul>
        {trips.map((t) => (
          <li key={t._id}>
            <strong>{t.title}</strong>
            {t.startDate ? ` — ${new Date(t.startDate).toLocaleDateString()}` : ''}
            {t.endDate ? ` to ${new Date(t.endDate).toLocaleDateString()}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}


