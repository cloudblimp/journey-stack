import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTrip } from '../contexts/TripContext.jsx';
import { useTrips } from '../hooks/useTrips';
import TripList from '../components/TripList';
import NewTripModal from '../components/NewTripModal';
import { useNavigate } from 'react-router-dom';

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
