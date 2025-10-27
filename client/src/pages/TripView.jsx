import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { tripsApi, journalApi } from '../api';
import MapCanvas from '../components/MapCanvas.jsx';
import JournalEditor from '../components/JournalEditor.jsx';
import PackingListEditor from '../components/PackingListEditor.jsx';

export default function TripView() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAll() {
      try {
        const [t, e] = await Promise.all([
          tripsApi.get?.(id) || fetchTrip(id),
          journalApi.list(id),
        ]);
        setTrip(t);
        setEntries(e);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load trip');
      }
    }
    loadAll();
  }, [id]);

  async function fetchTrip(tripId) {
    // fallback using fetch if tripsApi.get not present
    const res = await fetch(`/api/v1/trips/${tripId}`, { headers: { 'x-auth-token': localStorage.getItem('token') || '' } });
    if (!res.ok) throw new Error('Failed to fetch trip');
    return res.json();
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div>
        <h2>{trip ? trip.title : 'Loading trip...'}</h2>
        <MapCanvas height={300} />
        <PackingListEditor tripId={id} />
      </div>
      <div>
        <h3>Journal Timeline</h3>
        <JournalEditor tripId={id} onCreated={async () => {
          const e = await journalApi.list(id);
          setEntries(e);
        }} />
        <ul style={{ display: 'grid', gap: 8 }}>
          {entries.map((e) => (
            <li key={e._id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 600 }}>{e.title}</div>
              <div style={{ color: '#6b7280', fontSize: 12 }}>{e.date ? new Date(e.date).toLocaleString() : ''}</div>
              <div>{e.content}</div>
            </li>
          ))}
        </ul>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}


