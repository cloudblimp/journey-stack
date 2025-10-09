import { Link } from 'react-router-dom';

export default function TripCard({ trip }) {
  return (
    <Link to={`/trips/${trip._id}`} style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', display: 'block', color: 'inherit', textDecoration: 'none' }}>
      {trip.coverImageURL ? (
        <img src={trip.coverImageURL} alt={trip.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: 140, background: '#f5f5f5' }} />
      )}
      <div style={{ padding: 12 }}>
        <div style={{ fontWeight: 600 }}>{trip.title}</div>
        <div style={{ color: '#6b7280', fontSize: 12 }}>
          {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : '—'}
          {trip.endDate ? ` → ${new Date(trip.endDate).toLocaleDateString()}` : ''}
        </div>
      </div>
    </Link>
  );
}


