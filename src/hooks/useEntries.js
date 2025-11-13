import { useState, useCallback } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export function useEntries() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const createEntry = useCallback(async (tripId, entryData) => {
    const { title, dateTime, location, story, type, photoFile } = entryData;

    if (!currentUser) {
      throw new Error('User must be authenticated to create an entry');
    }

    if (!title || !dateTime) {
      throw new Error('Title and date are required');
    }

    setLoading(true);
    setError(null);

    try {
      let photoUrl = null;

      // Upload photo if provided
      if (photoFile) {
        try {
          console.log('Starting photo upload...', { fileName: photoFile.name, size: photoFile.size });
          const fileName = `${Date.now()}-${photoFile.name}`;
          const photoRef = ref(storage, `entry-photos/${currentUser.uid}/${tripId}/${fileName}`);

          console.log('Uploading to path:', `entry-photos/${currentUser.uid}/${tripId}/${fileName}`);
          const uploadResult = await uploadBytes(photoRef, photoFile);
          console.log('Upload successful:', uploadResult);

          photoUrl = await getDownloadURL(photoRef);
          console.log('Download URL obtained:', photoUrl);
        } catch (uploadError) {
          console.error('Photo upload failed:', uploadError);
          console.error('Error details:', {
            code: uploadError.code,
            message: uploadError.message
          });
          throw uploadError;
        }
      }

      // Create entry document
      const entryDataDoc = {
        title,
        dateTime: new Date(dateTime).toISOString(),
        location,
        story,
        type: type || 'Activity',
        photoUrl,
        tripId,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'entries'), entryDataDoc);
      return { id: docRef.id, ...entryDataDoc };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  return {
    createEntry,
    loading,
    error
  };
}
