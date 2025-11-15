import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTrip } from '../contexts/TripContext.jsx';
import { useTrips } from '../hooks/useTrips';
import TripList from '../components/TripList';
import NewTripModal from '../components/NewTripModal';
import AnimatedDiaryBackground from '../components/AnimatedDiaryBackground';
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
      <div className="w-full relative bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 min-h-screen overflow-hidden">
      {/* Animated background - positioned absolutely, stays behind content */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatedDiaryBackground />
      </div>
      
      {/* Content layer - background scrollable only when modal is closed */}
      <div className={`relative z-10 h-screen overflow-hidden ${isModalOpen ? 'pointer-events-none' : ''}`}>
        {/* TripList with scrolling */}
        <div className="bg-white/90 backdrop-blur-sm h-full overflow-y-auto">
          <TripList trips={trips} onCreateTrip={handleCreateTrip} onTripSelect={handleTripSelect} />
        </div>
      </div>
      
      {/* Modal layer - fixed positioning, always interactive */}
      <div className={`fixed inset-0 z-50 pointer-events-none ${isModalOpen ? 'pointer-events-auto' : ''}`}>
        <NewTripModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onCreateTrip={handleTripCreation}
          isLoading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
