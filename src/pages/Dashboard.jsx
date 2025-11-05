import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import TripList from '../components/TripList';
import { useNavigate } from 'react-router-dom';

const SAMPLE_TRIPS = [
  {
    id: 'bali-1',
    title: 'Bali Adventure',
    description: 'Two weeks exploring the beautiful island of Bali',
    startDate: '2025-01-15',
    endDate: '2025-01-29',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60'
  },
  {
    id: 'swiss-1',
    title: 'Swiss Alps Hiking',
    description: 'Mountain hiking adventure through Switzerland',
    startDate: '2025-02-10',
    endDate: '2025-02-20',
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=60'
  },
  {
    id: 'tokyo-1',
    title: 'Tokyo City Break',
    description: "Urban exploration in Japan's vibrant capital",
    startDate: '2025-03-05',
    endDate: '2025-03-12',
    coverImage: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=60'
  }
];

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleCreateTrip = () => {
    // For now navigate to a placeholder route or open modal
    navigate('/trip/new');
  };

  const handleTripSelect = (tripId) => {
    navigate(`/trip/${tripId}`);
  };

  return (
    <div className="w-full">
      <TripList trips={SAMPLE_TRIPS} onCreateTrip={handleCreateTrip} onTripSelect={handleTripSelect} />
    </div>
  );
}
