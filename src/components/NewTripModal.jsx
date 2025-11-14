import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { Dialog, Transition } from '@headlessui/react';
import { FaTimes, FaSpinner, FaMapPin, FaCloudUploadAlt } from 'react-icons/fa';

// Zod validation schema
const tripSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  destination: z.string().min(2, 'Destination must be at least 2 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  description: z.string().optional()
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start <= end;
}, {
  message: 'End date must be on or after start date',
  path: ['endDate']
});

export default function NewTripModal({ isOpen, onClose, onCreateTrip, isLoading, error }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [locations, setLocations] = useState([]);
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
  const [geocodingError, setGeocodingError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(tripSchema)
  });

  // Handle dropzone
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      toast.success('Image selected');
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false)
  });

  const resetForm = () => {
    reset();
    setPreviewUrl(null);
    setCoverImageFile(null);
    setLocationInput('');
    setLocations([]);
    setGeocodingError(null);
    setIsDragActive(false);
  };

  const handleGetCoordinates = async () => {
    if (!locationInput.trim()) {
      toast.error('Please enter a location');
      return;
    }

    setIsGeocodingLoading(true);
    setGeocodingError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationInput)}&format=json&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newLocation = {
          id: Date.now(),
          name: display_name,
          lat: parseFloat(lat),
          lng: parseFloat(lon)
        };

        setLocations([...locations, newLocation]);
        setLocationInput('');
        toast.success(`Location "${display_name.split(',')[0]}" added`);
      } else {
        setGeocodingError('Location not found. Please try a different search.');
        toast.error('Location not found');
      }
    } catch (err) {
      const message = 'Error geocoding location';
      setGeocodingError(message);
      toast.error(message);
      console.error(err);
    } finally {
      setIsGeocodingLoading(false);
    }
  };

  const handleRemoveLocation = (id) => {
    setLocations(locations.filter(loc => loc.id !== id));
    toast.success('Location removed');
  };

  const onFormSubmit = async (data) => {
    try {
      await onCreateTrip({
        ...data,
        coverImageFile,
        locations
      });
      resetForm();
      toast.success('Trip created successfully! 🎉');
    } catch (err) {
      toast.error(err.message || 'Failed to create trip');
    }
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-40" onClose={handleCloseModal}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm sm:max-w-lg transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all mx-4 sm:mx-0">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    Plan a New Trip
                  </Dialog.Title>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onFormSubmit)} className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trip Title *
                    </label>
                    <input
                      {...register('title')}
                      type="text"
                      placeholder="e.g., European Summer Adventure"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Destination */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destination *
                    </label>
                    <input
                      {...register('destination')}
                      type="text"
                      placeholder="e.g., Paris, France"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.destination ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.destination && (
                      <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
                    )}
                  </div>

                  {/* Dates Row */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Start Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date *
                      </label>
                      <input
                        {...register('startDate')}
                        type="date"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.startDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.startDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                      )}
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date *
                      </label>
                      <input
                        {...register('endDate')}
                        type="date"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.endDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.endDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register('description')}
                      placeholder="Share details about your trip..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  </div>

                  {/* Cover Image with Dropzone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Image
                    </label>
                    <div
                      {...getRootProps()}
                      className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all min-h-[200px] active:scale-95 ${
                        isDragActive
                          ? 'border-blue-500 bg-blue-50 scale-105'
                          : previewUrl
                          ? 'border-gray-300'
                          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 active:border-blue-600 active:bg-blue-100'
                      }`}
                    >
                      <input {...getInputProps()} />
                      {!previewUrl ? (
                        <div className="space-y-2">
                          <FaCloudUploadAlt className="h-10 w-10 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-gray-600 font-medium">
                              {isDragActive ? 'Drop your image here' : 'Drag & drop or click to select'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto rounded-md" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewUrl(null);
                              setCoverImageFile(null);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 active:bg-red-700 active:scale-90 transition-all duration-75 shadow-lg hover:shadow-xl min-h-[32px] min-w-[32px] flex items-center justify-center"
                          >
                            <FaTimes className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Locations */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trip Location (Optional)
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={locationInput}
                          onChange={(e) => setLocationInput(e.target.value)}
                          placeholder="Search for a location..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          onKeyPress={(e) => e.key === 'Enter' && handleGetCoordinates()}
                        />
                        <button
                          type="button"
                          onClick={handleGetCoordinates}
                          disabled={isGeocodingLoading}
                          className="px-3 py-2 sm:px-4 sm:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 active:scale-95 disabled:opacity-50 transition-all duration-75 flex items-center gap-2 font-medium min-h-[44px]"
                        >
                          {isGeocodingLoading ? <FaSpinner className="animate-spin" /> : <FaMapPin />}
                          Add
                        </button>
                      </div>

                      {geocodingError && (
                        <p className="text-sm text-red-600">{geocodingError}</p>
                      )}

                      {/* Locations List */}
                      {locations.length > 0 && (
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {locations.map((loc) => (
                            <div key={loc.id} className="flex items-center justify-between bg-green-50 border border-green-200 p-2 sm:p-3 rounded-md hover:bg-green-100 active:bg-green-200 transition-all duration-75 min-h-[44px]">
                              <span className="text-sm text-gray-700 truncate font-medium">{loc.name}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveLocation(loc.id)}
                                className="text-red-500 hover:text-red-700 active:text-red-900 active:scale-90 transition-all duration-75 flex-shrink-0 p-1 rounded hover:bg-red-50 active:bg-red-100"
                              >
                                <FaTimes className="h-5 w-5 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="rounded-md bg-red-50 p-3 border border-red-200">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={isLoading}
                      className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 active:bg-gray-200 active:scale-95 disabled:opacity-50 transition-all duration-75 min-h-[44px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 active:scale-95 disabled:opacity-50 flex items-center gap-2 transition-all duration-75 min-h-[44px]"
                    >
                      {isLoading ? (
                        <>
                          <FaSpinner className="animate-spin h-4 w-4" />
                          Creating...
                        </>
                      ) : (
                        'Create Trip'
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
