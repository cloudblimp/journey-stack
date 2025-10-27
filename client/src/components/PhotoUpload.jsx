import { useState, useRef } from 'react';
import { uploadPhotos, deletePhoto } from '../services/mediaService';

export default function PhotoUpload({ onUpload, maxPhotos = 10 }) {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > maxPhotos) {
      alert(`You can only upload up to ${maxPhotos} photos`);
      return;
    }

    setUploading(true);
    try {
      const uploadedPhotos = await uploadPhotos(files);
      const newPhotos = uploadedPhotos.map(photo => ({
        id: photo._id,
        url: photo.url,
        preview: URL.createObjectURL(files.find(f => f.name === photo.filename))
      }));

      setPhotos(prev => [...prev, ...newPhotos]);
      if (onUpload) {
        onUpload([...photos, ...newPhotos]);
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Failed to upload some photos. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async (photoToRemove) => {
    try {
      await deletePhoto(photoToRemove.id);
      setPhotos(photos.filter(photo => photo.id !== photoToRemove.id));
      if (photoToRemove.preview) {
        URL.revokeObjectURL(photoToRemove.preview);
      }
      if (onUpload) {
        onUpload(photos.filter(photo => photo.id !== photoToRemove.id));
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map(photo => (
          <div
            key={photo.id}
            className="relative group aspect-square rounded-lg overflow-hidden bg-stone-100"
          >
            <img
              src={photo.preview || photo.url}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => removePhoto(photo)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
            aria-label="Remove photo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
        
        {photos.length < maxPhotos && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 hover:text-stone-500 hover:border-stone-400 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {uploading ? 'Uploading...' : 'Add Photo'}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        disabled={uploading || photos.length >= maxPhotos}
      />
      
      <p className="text-sm text-stone-500">
        {photos.length} of {maxPhotos} photos added
      </p>

      {uploading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-stone-500"></div>
        </div>
      )}
    </div>
  );
}