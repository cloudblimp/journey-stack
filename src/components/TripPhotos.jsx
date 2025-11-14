import React, { useState, useRef } from 'react';
import { FaUpload, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export default function TripPhotos({ tripId, photos = [] }) {
  const { currentUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const fileInputRef = useRef(null);

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of files) {
        // Upload photo to Firebase Storage
        const fileName = `${Date.now()}-${file.name}`;
        const photoRef = ref(storage, `trip-photos/${currentUser.uid}/${tripId}/${fileName}`);
        
        const uploadResult = await uploadBytes(photoRef, file);
        const photoUrl = await getDownloadURL(photoRef);

        // Save photo metadata to Firestore
        await addDoc(collection(db, 'tripPhotos'), {
          tripId,
          userId: currentUser.uid,
          photoUrl,
          fileName,
          uploadedAt: serverTimestamp(),
          caption: ''
        });
      }

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    setIsDeletingId(photoId);
    try {
      await deleteDoc(doc(db, 'tripPhotos', photoId));
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo');
    } finally {
      setIsDeletingId(null);
    }
  };

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const handleCloseModal = () => {
    setSelectedPhotoIndex(null);
  };

  const handleImageError = (photoId) => {
    setImageErrors(prev => ({ ...prev, [photoId]: true }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Trip Photos ({photos.length})</h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center px-3 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm font-medium"
        >
          <FaUpload className="mr-2 h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoUpload}
          disabled={isUploading}
          className="hidden"
        />
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">No photos yet</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Upload your first photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative group rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
              onClick={() => setSelectedPhotoIndex(index)}
            >
              {imageErrors[photo.id] ? (
                <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Image unavailable</span>
                </div>
              ) : (
                <img
                  src={photo.photoUrl}
                  alt="Trip photo"
                  className="w-full h-32 object-cover group-hover:opacity-75 transition-opacity"
                  onError={() => handleImageError(photo.id)}
                />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePhoto(photo.id);
                }}
                disabled={isDeletingId === photo.id}
                className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && photos.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-between p-4"
          onClick={handleCloseModal}
        >
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            className="self-end p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </button>

          {/* Image Container - Takes remaining space */}
          <div
            className="flex-1 flex items-center justify-center w-full max-w-5xl max-h-[calc(100vh-200px)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {imageErrors[photos[selectedPhotoIndex]?.id] ? (
              <div className="text-gray-400 text-lg">Image unavailable</div>
            ) : (
              <img
                src={photos[selectedPhotoIndex].photoUrl}
                alt={`Trip photo ${selectedPhotoIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onError={() => handleImageError(photos[selectedPhotoIndex].id)}
              />
            )}
          </div>

          {/* Navigation and Counter - Fixed at Bottom */}
          <div className="flex items-center justify-center gap-8 mt-4 pb-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handlePrevPhoto}
              disabled={selectedPhotoIndex === 0}
              className="p-3 bg-white/20 hover:bg-white/40 text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <FaChevronLeft className="h-6 w-6" />
            </button>

            <span className="text-white font-medium text-lg min-w-fit">
              {selectedPhotoIndex + 1} / {photos.length}
            </span>

            <button
              onClick={handleNextPhoto}
              disabled={selectedPhotoIndex === photos.length - 1}
              className="p-3 bg-white/20 hover:bg-white/40 text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <FaChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
