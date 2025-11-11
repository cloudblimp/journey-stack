import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const TripContext = createContext();

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

export function TripProvider({ children }) {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [trips, setTrips] = useState(SAMPLE_TRIPS);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load trips from Firestore when user is authenticated
  useEffect(() => {
    if (!currentUser) {
      setTrips(SAMPLE_TRIPS);
      setLoading(false);
      return;
    }

    try {
      const tripsRef = collection(db, 'trips');
      const q = query(tripsRef, where('userId', '==', currentUser.uid));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedTrips = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        
        // When user is logged in, always use Firestore trips (empty or not)
        setTrips(loadedTrips.length > 0 ? loadedTrips : []);
        setLoading(false);
      }, (error) => {
        console.error('Error loading trips:', error);
        setTrips(SAMPLE_TRIPS);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up trips listener:', error);
      setTrips(SAMPLE_TRIPS);
      setLoading(false);
    }
  }, [currentUser]);

  const addTrip = (newTrip) => {
    setTrips(prev => {
      // Remove duplicate if it exists, then add new trip
      const filtered = prev.filter(t => t.id !== newTrip.id);
      return [newTrip, ...filtered];
    });
  };

  return (
    <TripContext.Provider value={{ selectedTrip, setSelectedTrip, trips, setTrips, addTrip, loading }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within TripProvider');
  }
  return context;
}