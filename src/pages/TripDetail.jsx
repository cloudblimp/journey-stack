import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, onSnapshot, query, where, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useTrip } from '../contexts/TripContext.jsx';
import { useEntries } from '../hooks/useEntries.js';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import NewEntryModal from '../components/NewEntryModal.jsx';
import EntryDetailModal from '../components/EntryDetailModal.jsx';
import EditEntryModal from '../components/EditEntryModal.jsx';
import ItineraryModal from '../components/ItineraryModal.jsx';
import TripPhotos from '../components/TripPhotos.jsx';
import TripLocationMap from '../components/TripLocationMap.jsx';
import { FaCalendarAlt, FaArrowLeft, FaPlus } from 'react-icons/fa';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=60';

export default function TripDetail() {
  const { tripId } = useParams();
  const { selectedTrip } = useTrip();
  const { currentUser } = useAuth();
  const { createEntry, loading, error } = useEntries();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tripPhotos, setTripPhotos] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [entriesLoading, setEntriesLoading] = useState(true);

  // Load entries from Firestore when trip changes
  useEffect(() => {
    if (!tripId || !currentUser) {
      setEntries([]);
      setEntriesLoading(false);
      return;
    }

    try {
      const entriesRef = collection(db, 'entries');
      const q = query(
        entriesRef,
        where('tripId', '==', tripId),
        where('userId', '==', currentUser.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedEntries = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        // Sort by newest first
        loadedEntries.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
        setEntries(loadedEntries);
        setEntriesLoading(false);
      }, (error) => {
        console.error('Error loading entries:', error);
        setEntries([]);
        setEntriesLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up entries listener:', error);
      setEntries([]);
      setEntriesLoading(false);
    }
  }, [tripId, currentUser]);

  // Load activities from Firestore when trip changes
  useEffect(() => {
    if (!tripId || !currentUser) {
      setActivities([]);
      return;
    }

    try {
      const activitiesRef = collection(db, 'activities');
      const q = query(
        activitiesRef,
        where('tripId', '==', tripId),
        where('userId', '==', currentUser.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedActivities = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        // Sort by date and time
        loadedActivities.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
        setActivities(loadedActivities);
      }, (error) => {
        console.error('Error loading activities:', error);
        setActivities([]);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up activities listener:', error);
      setActivities([]);
    }
  }, [tripId, currentUser]);

  // Load trip photos from Firestore when trip changes
  useEffect(() => {
    if (!tripId || !currentUser) {
      setTripPhotos([]);
      return;
    }

    try {
      const photosRef = collection(db, 'tripPhotos');
      const q = query(
        photosRef,
        where('tripId', '==', tripId),
        where('userId', '==', currentUser.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedPhotos = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        // Sort by newest first
        loadedPhotos.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        setTripPhotos(loadedPhotos);
      }, (error) => {
        console.error('Error loading trip photos:', error);
        setTripPhotos([]);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up trip photos listener:', error);
      setTripPhotos([]);
    }
  }, [tripId, currentUser]);

  // Use trip from context, fallback to placeholder if not set
  const trip = selectedTrip ? {
    ...selectedTrip,
    startDate: new Date(selectedTrip.startDate),
    endDate: new Date(selectedTrip.endDate)
  } : {
    id: tripId,
    title: 'Loading...',
    description: 'Trip details coming soon...',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-07'),
    coverImage: FALLBACK_IMAGE
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const handleNewEntry = () => {
    setIsModalOpen(true);
  };

  const handleEntryModalClose = () => {
    setIsModalOpen(false);
  };

  const handleEntryCreation = async (entryData) => {
    try {
      await createEntry(trip.id, entryData);
      // Firestore listener will automatically update entries
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create entry:', err);
    }
  };

  const handleEntryCardClick = (entry) => {
    setSelectedEntry(entry);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedEntry(null);
  };

  const handleDeleteEntry = async (entryId) => {
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'entries', entryId));
      setEntries(prev => prev.filter(e => e.id !== entryId));
      setIsDetailModalOpen(false);
      console.log('Entry deleted successfully');
    } catch (err) {
      console.error('Failed to delete entry:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedEntry(null);
  };

  const handleSaveEntry = async (updatedEntry) => {
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'entries', updatedEntry.id), {
        title: updatedEntry.title,
        dateTime: updatedEntry.dateTime,
        location: updatedEntry.location,
        story: updatedEntry.story,
        photoUrl: updatedEntry.photoUrl || '',
        updatedAt: serverTimestamp()
      });
      setIsEditModalOpen(false);
      console.log('Entry updated successfully');
    } catch (err) {
      console.error('Failed to update entry:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-72 w-full overflow-hidden">
        <img src={trip.coverImage || FALLBACK_IMAGE} alt={trip.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />

        {/* Back button - top left */}
        <div className="absolute top-4 left-4 z-20">
          <Link to="/" className="inline-flex items-center px-4 py-2 bg-white/100 hover:bg-white/30 rounded text-sm">
            <FaArrowLeft className="mr-2" /> Back to Trips
          </Link>
        </div>

        {/* View Itinerary button - top right */}
                {/* View Itinerary button - top right */}
        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={() => setIsItineraryModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-white hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-900 transition-colors shadow-md"
          >
            <FaCalendarAlt className="mr-2" /> View Itinerary
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <h1 className="text-3xl font-bold">{trip.title}</h1>
          <p className="mt-1 text-white/90 max-w-3xl">{trip.description}</p>
          <div className="mt-2 flex items-center text-white/90">
            <FaCalendarAlt className="mr-2" />
            {formatDate(trip.startDate)}{trip.endDate ? ` - ${formatDate(trip.endDate)}` : ''}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-0">
        {/* Trip Location Map - Full Width */}
        {trip.locations && trip.locations.length > 0 && (
          <div className="mb-12 relative z-0">
            <h2 className="text-xl font-semibold mb-4">Trip Stops</h2>
            <TripLocationMap locations={trip.locations} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-0">
          {/* Journal Entries - Left Side (2 columns) */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Journal Entries ({entries.length})</h2>
              <button 
                onClick={handleNewEntry}
                className="inline-flex items-center px-3 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
              >
                <FaPlus className="mr-2 h-4 w-4" /> New Entry
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {entries.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-4 text-gray-500">
                  No entries yet. Create your first one!
                </div>
              ) : (
                entries.map((entry) => (
                  <div 
                    key={entry.id} 
                    onClick={() => handleEntryCardClick(entry)}
                    className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    {entry.photoUrl && (
                      <img src={entry.photoUrl} alt={entry.title} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{entry.title}</h3>
                      {entry.location && (
                        <p className="text-sm text-gray-600 mb-2">📍 {entry.location}</p>
                      )}
                      <p className="text-sm text-gray-500 mb-3">
                        {new Date(entry.dateTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-3">{entry.story}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Trip Photos - Right Side (1 column) */}
          <div className="lg:col-span-1">
            <TripPhotos tripId={tripId} photos={tripPhotos} />
          </div>
        </div>
      </div>

      {/* New Entry Modal */}
      <NewEntryModal
        isOpen={isModalOpen}
        onClose={handleEntryModalClose}
        onCreateEntry={handleEntryCreation}
        isLoading={loading}
        error={error}
      />

      {/* Entry Detail Modal */}
      <EntryDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleDetailModalClose}
        entry={selectedEntry}
        onDelete={handleDeleteEntry}
        onEdit={handleEditEntry}
        isDeleting={isDeleting}
      />

      {/* Edit Entry Modal */}
      <EditEntryModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        entry={selectedEntry}
        onSave={handleSaveEntry}
        isLoading={isUpdating}
        error={null}
      />

      {/* Itinerary Modal */}
      <ItineraryModal
        isOpen={isItineraryModalOpen}
        onClose={() => setIsItineraryModalOpen(false)}
        trip={trip}
        activities={activities}
      />
    </div>
  );
}
