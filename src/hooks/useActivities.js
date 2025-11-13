import { useState, useCallback } from 'react';
import { collection, addDoc, serverTimestamp, onSnapshot, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export function useActivities() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const createActivity = useCallback(async (tripId, activityData) => {
    const { title, dateTime, location, description, type } = activityData;

    if (!currentUser) {
      throw new Error('User must be authenticated to create an activity');
    }

    if (!title || !dateTime) {
      throw new Error('Title and date are required');
    }

    setLoading(true);
    setError(null);

    try {
      // Create activity document in separate 'activities' collection
      const activityDataDoc = {
        title,
        dateTime: new Date(dateTime).toISOString(),
        location: location || '',
        description: description || '',
        type: type || 'Activity',
        tripId,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'activities'), activityDataDoc);
      return { id: docRef.id, ...activityDataDoc };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const deleteActivity = useCallback(async (activityId) => {
    if (!currentUser) {
      throw new Error('User must be authenticated');
    }

    try {
      await deleteDoc(doc(db, 'activities', activityId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [currentUser]);

  const updateActivity = useCallback(async (activityId, updates) => {
    if (!currentUser) {
      throw new Error('User must be authenticated');
    }

    try {
      await updateDoc(doc(db, 'activities', activityId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [currentUser]);

  return {
    createActivity,
    deleteActivity,
    updateActivity,
    loading,
    error
  };
}
