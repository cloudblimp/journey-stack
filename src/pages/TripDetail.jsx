import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, onSnapshot, query, where, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
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
import TripDetailHeroPlaceholder from '../components/TripDetailHeroPlaceholder.jsx';
import { FaCalendarAlt, FaArrowLeft, FaPlus } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

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
  const [tripLoading, setTripLoading] = useState(true);
  const [trip, setTrip] = useState(null);

  // Load trip from Firestore if not in context
  useEffect(() => {
    if (selectedTrip) {
      setTrip(selectedTrip);
      setTripLoading(false);
      return;
    }

    if (!tripId || !currentUser) {
      setTripLoading(false);
      return;
    }

    // Fetch trip directly from Firestore by document ID
    try {
      const tripRef = doc(db, 'trips', tripId);
      
      const unsubscribe = onSnapshot(tripRef, (snapshot) => {
        if (snapshot.exists()) {
          const tripData = snapshot.data();
          // Verify the trip belongs to the current user
          if (tripData.userId === currentUser.uid) {
            // Add the document ID to the trip data
            setTrip({ id: snapshot.id, ...tripData });
          } else {
            setTrip(null); // Trip doesn't belong to this user
          }
        } else {
          setTrip(null); // Trip doesn't exist
        }
        setTripLoading(false);
      }, (error) => {
        console.error('Error loading trip:', error);
        setTrip(null);
        setTripLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up trip listener:', error);
      setTrip(null);
      setTripLoading(false);
    }
  }, [tripId, currentUser, selectedTrip]);

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

  // Format trip data if loaded
  const formattedTrip = trip ? {
    ...trip,
    startDate: trip.startDate instanceof Date ? trip.startDate : new Date(trip.startDate),
    endDate: trip.endDate instanceof Date ? trip.endDate : new Date(trip.endDate)
  } : null;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const handleNewEntry = () => {
    setIsModalOpen(true);
  };

  const handleEntryModalClose = () => {
    setIsModalOpen(false);
  };

  const handleEntryCreation = async (entryData) => {
    try {
      await createEntry(tripId, entryData);
      // Firestore listener will automatically update entries
      setIsModalOpen(false);
      toast.success('Entry created successfully! 📝');
    } catch (err) {
      console.error('Failed to create entry:', err);
      toast.error(`Failed to create entry: ${err.message}`);
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
      toast.success('Entry deleted successfully! 🗑️');
    } catch (err) {
      console.error('Failed to delete entry:', err);
      toast.error(`Failed to delete entry: ${err.message}`);
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
      toast.success('Entry updated successfully! ✏️');
    } catch (err) {
      console.error('Failed to update entry:', err);
      toast.error(`Failed to update entry: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900">
      {tripLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin inline-block">
              <svg className="w-12 h-12 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="mt-4 text-emerald-200 text-lg">Loading trip details...</p>
          </div>
        </div>
      ) : !formattedTrip ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-400 text-lg">Trip not found</p>
          </div>
        </div>
      ) : (
        <>
      {/* Hero */}
      <div className="relative h-72 w-full overflow-hidden">
        {formattedTrip.coverImage ? (
          <img src={formattedTrip.coverImage} alt={formattedTrip.title} className="w-full h-full object-cover" />
        ) : (
          <TripDetailHeroPlaceholder />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/40" />

        {/* Back button - top left */}
        <div className="absolute top-4 left-4 z-20">
          <Link to="/" className="inline-flex items-center px-4 py-2 bg-emerald-600/90 hover:bg-emerald-700 rounded-lg text-sm font-medium text-white transition-colors shadow-lg">
            <FaArrowLeft className="mr-2" /> Back to Trips
          </Link>
        </div>

        {/* View Itinerary button - top right */}
        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={() => setIsItineraryModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-emerald-600/90 hover:bg-emerald-700 rounded-lg text-sm font-medium text-white transition-colors shadow-lg"
          >
            <FaCalendarAlt className="mr-2" /> View Itinerary
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <h1 className="text-3xl font-bold text-white">{formattedTrip.title}</h1>
          <p className="mt-1 text-emerald-100/90 max-w-3xl">{formattedTrip.description}</p>
          <div className="mt-2 flex items-center text-emerald-100/90">
            <FaCalendarAlt className="mr-2" />
            {formatDate(formattedTrip.startDate)}{formattedTrip.endDate ? ` - ${formatDate(formattedTrip.endDate)}` : ''}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-0">
        {/* Trip Location Map - Full Width */}
        {formattedTrip.locations && formattedTrip.locations.length > 0 && (
          <div className="mb-12 relative z-0">
            <h2 className="text-xl font-semibold text-white mb-4">Trip Stops</h2>
            <TripLocationMap locations={formattedTrip.locations} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-0">
          {/* Journal Entries - Left Side (2 columns) */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Journal Entries ({entries.length})</h2>
              <button 
                onClick={handleNewEntry}
                className="inline-flex items-center px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
              >
                <FaPlus className="mr-2 h-4 w-4" /> New Entry
              </button>
            </div>
            {entriesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={`skeleton-${i}`} className="rounded-lg border border-emerald-500/30 bg-slate-800/50 overflow-hidden shadow-md animate-pulse">
                    <div className="w-full h-48 bg-slate-700/50" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-slate-700 rounded w-3/4" />
                      <div className="h-3 bg-slate-700 rounded w-1/2" />
                      <div className="h-3 bg-slate-700 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {entries.length === 0 ? (
                  <motion.div variants={itemVariants} className="rounded-lg border border-emerald-500/30 bg-slate-800/50 p-4 text-emerald-200/60">
                    No entries yet. Create your first one!
                  </motion.div>
                ) : (
                  entries.map((entry) => (
                    <motion.div 
                      key={entry.id} 
                      variants={itemVariants}
                      onClick={() => handleEntryCardClick(entry)}
                      whileHover={{ y: -4 }}
                      className="rounded-lg border border-emerald-500/30 bg-slate-800/50 overflow-hidden shadow-md hover:shadow-lg hover:border-emerald-500/50 transition-all cursor-pointer"
                    >
                      {entry.photoUrl && (
                        <img src={entry.photoUrl} alt={entry.title} className="w-full h-48 object-cover" />
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-white mb-1">{entry.title}</h3>
                        {entry.location && (
                          <p className="text-sm text-emerald-200/80 mb-2">📍 {entry.location}</p>
                        )}
                        <p className="text-sm text-emerald-200/60 mb-3">
                          {new Date(entry.dateTime).toLocaleString()}
                        </p>
                        <p className="text-sm text-emerald-100 line-clamp-3">{entry.story}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
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
        trip={formattedTrip}
        activities={activities}
      />
        </>
      )}
    </div>
  );
}
