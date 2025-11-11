import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTrip } from '../contexts/TripContext.jsx';
import { useTrips } from '../hooks/useTrips';
import TripList from '../components/TripList';
import NewTripModal from '../components/NewTripModal';
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
  const { setSelectedTrip, trips, addTrip } = useTrip();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createTrip, loading, error } = useTrips();

  const handleCreateTrip = () => {
    setIsModalOpen(true);
  };

  const handleTripSelect = (tripId) => {
    // Find the trip and set it in context
    const selected = trips.find(t => t.id === tripId);
    if (selected) {
      setSelectedTrip(selected);
    }
    navigate(`/trip/${tripId}`);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleTripCreation = async (tripData) => {
    try {
      const newTrip = await createTrip(tripData);
      addTrip(newTrip);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create trip:', err);
      // Error will be displayed in the modal via the error prop
    }
  };

  return (
    <div className="w-full">
      <TripList trips={trips} onCreateTrip={handleCreateTrip} onTripSelect={handleTripSelect} />
      <NewTripModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onCreateTrip={handleTripCreation}
        isLoading={loading}
        error={error}
      />
    </div>
  );
}
