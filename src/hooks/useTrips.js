import { useState, useCallback } from 'react';
import { collection, addDoc, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export function useTrips() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const createTrip = useCallback(async (tripData) => {
    const { title, destination, startDate, endDate, description, coverImageFile, locations } = tripData;
    
    if (!currentUser) {
      throw new Error('User must be authenticated to create a trip');
    }

    if (!title || !startDate || !endDate) {
      throw new Error('Required fields are missing');
    }

    setLoading(true);
    setError(null);

    try {
      let coverImageUrl = null;

      // Upload image if provided
      if (coverImageFile) {
        try {
          console.log('Starting image upload...', { fileName: coverImageFile.name, size: coverImageFile.size });
          const fileName = `${Date.now()}-${coverImageFile.name}`;
          const imageRef = ref(storage, `trip-covers/${currentUser.uid}/${fileName}`);
          
          console.log('Uploading to path:', `trip-covers/${currentUser.uid}/${fileName}`);
          // Upload the file
          const uploadResult = await uploadBytes(imageRef, coverImageFile);
          console.log('Upload successful:', uploadResult);
          
          // Get the download URL
          coverImageUrl = await getDownloadURL(imageRef);
          console.log('Download URL obtained:', coverImageUrl);
        } catch (uploadError) {
          console.error('Upload failed:', uploadError);
          console.error('Error details:', {
            code: uploadError.code,
            message: uploadError.message,
            serverResponse: uploadError.serverResponse
          });
          throw uploadError;
        }
      }

      // Create trip document
      const tripDataDoc = {
        title,
        destination,
        startDate,
        endDate,
        description,
        coverImage: coverImageUrl,
        locations: locations || [],
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'trips'), tripDataDoc);
      return { id: docRef.id, ...tripDataDoc };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  return {
    createTrip,
    loading,
    error
  };
}

/**
 * Delete a trip permanently
 */
export async function deleteTrip(tripId) {
  try {
    const tripRef = doc(db, 'trips', tripId);
    await deleteDoc(tripRef);
    return true;
  } catch (error) {
    console.error('Error deleting trip:', error);
    throw error;
  }
}

/**
 * Archive a trip (marks it as archived but doesn't delete)
 */
export async function archiveTrip(tripId) {
  try {
    const tripRef = doc(db, 'trips', tripId);
    await updateDoc(tripRef, {
      isArchived: true,
      archivedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error archiving trip:', error);
    throw error;
  }
}

/**
 * Unarchive a trip (restores it to active)
 */
export async function unarchiveTrip(tripId) {
  try {
    const tripRef = doc(db, 'trips', tripId);
    await updateDoc(tripRef, {
      isArchived: false,
      archivedAt: null
    });
    return true;
  } catch (error) {
    console.error('Error unarchiving trip:', error);
    throw error;
  }
}