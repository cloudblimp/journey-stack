import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const TripContext = createContext();

export function TripProvider({ children }) {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load trips from Firestore when user is authenticated
  useEffect(() => {
    if (!currentUser) {
      setAllTrips([]);
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
        setAllTrips(loadedTrips.length > 0 ? loadedTrips : []);
        setLoading(false);
      }, (error) => {
        console.error('Error loading trips:', error);
        setAllTrips([]);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up trips listener:', error);
      setAllTrips([]);
      setLoading(false);
    }
  }, [currentUser]);

  // Get active (non-archived) trips
  const trips = allTrips.filter(trip => !trip.isArchived);
  
  // Get archived trips
  const archivedTrips = allTrips.filter(trip => trip.isArchived);

  const addTrip = (newTrip) => {
    setAllTrips(prev => {
      // Remove duplicate if it exists, then add new trip
      const filtered = prev.filter(t => t.id !== newTrip.id);
      return [newTrip, ...filtered];
    });
  };

  return (
    <TripContext.Provider value={{ 
      selectedTrip, 
      setSelectedTrip, 
      trips,
      allTrips,
      setAllTrips,
      archivedTrips,
      addTrip, 
      loading 
    }}>
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