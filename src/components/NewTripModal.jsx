import React, { useState } from 'react';
import { FaCloudUploadAlt, FaCheckCircle, FaSpinner, FaTimes } from 'react-icons/fa';

export default function NewTripModal({ isOpen, onClose, onCreateTrip, isLoading, error }) {
  const [tripData, setTripData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
    coverImageFile: null,
    locations: []
  });
  
  const [previewUrl, setPreviewUrl] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [locationInput, setLocationInput] = useState('');
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
  const [geocodingError, setGeocodingError] = useState(null);

  const resetForm = () => {
    setTripData({
      title: '',
      destination: '',
      startDate: '',
      endDate: '',
      description: '',
      coverImageFile: null,
      locations: []
    });
    setPreviewUrl(null);
    setValidationError(null);
    setLocationInput('');
    setGeocodingError(null);
  };

  const validateDates = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      return 'Start date cannot be after end date';
    }
    
    return null;
  };

  const handleGetCoordinates = async () => {
    if (!locationInput.trim()) {
      setGeocodingError('Please enter a location');
      return;
    }

    setIsGeocodingLoading(true);
    setGeocodingError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}`
      );
      const data = await response.json();

      if (!data || data.length === 0) {
        setGeocodingError('Location not found. Please try another search.');
        setIsGeocodingLoading(false);
        return;
      }

      const { lat, lon, display_name } = data[0];
      const newLocation = {
        name: display_name || locationInput,
        lat: parseFloat(lat),
        lng: parseFloat(lon)
      };

      setTripData(prev => ({
        ...prev,
        locations: [...prev.locations, newLocation]
      }));

      setLocationInput('');
      setGeocodingError(null);
    } catch (error) {
      console.error('Geocoding error:', error);
      setGeocodingError('Failed to geocode location. Please try again.');
    } finally {
      setIsGeocodingLoading(false);
    }
  };

  const handleRemoveLocation = (index) => {
    setTripData(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates
    const dateError = validateDates(tripData.startDate, tripData.endDate);
    if (dateError) {
      setValidationError(dateError);
      return;
    }
    
    try {
      await onCreateTrip(tripData);
      resetForm();
      onClose();
    } catch (err) {
      console.error('Error in form submission:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'coverImageFile' && files && files[0]) {
      const file = files[0];
      setTripData(prev => ({
        ...prev,
        coverImageFile: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (name === 'startDate' || name === 'endDate') {
      const newData = { ...tripData, [name]: value };
      
      // Validate dates on change
      const dateError = validateDates(newData.startDate, newData.endDate);
      setValidationError(dateError);
      
      setTripData(newData);
    } else {
      setTripData(prev => ({
        ...prev,
        [name]: value
      }));
      setValidationError(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Create New Trip</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Trip Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={tripData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
              Destination
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={tripData.destination}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={tripData.startDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={tripData.endDate}
                onChange={handleChange}
                required
                min={tripData.startDate}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={tripData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="locationInput" className="block text-sm font-medium text-gray-700">
              Trip Locations (Stops/Waypoints)
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                id="locationInput"
                value={locationInput}
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  setGeocodingError(null);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleGetCoordinates();
                  }
                }}
                placeholder="e.g., Paris, France"
                className="flex-1 rounded-md border border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm px-3 py-2"
              />
              <button
                type="button"
                onClick={handleGetCoordinates}
                disabled={isGeocodingLoading || !locationInput.trim()}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
              >
                {isGeocodingLoading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Getting...
                  </>
                ) : (
                  <>📍 Get Coordinates</>
                )}
              </button>
            </div>

            {geocodingError && (
              <p className="mt-2 text-sm text-red-600">{geocodingError}</p>
            )}

            {tripData.locations.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Added Locations:</h4>
                {tripData.locations.map((loc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3"
                  >
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{loc.name}</p>
                        <p className="text-xs text-gray-500">{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(idx)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cover Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <div className="relative">
                    <img src={previewUrl} alt="Preview" className="mx-auto h-32 w-full object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => {
                        setTripData(prev => ({ ...prev, coverImageFile: null }));
                        setPreviewUrl(null);
                      }}
                      className="absolute top-0 right-0 -mr-2 -mt-2 bg-red-100 rounded-full p-1"
                    >
                      <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="coverImageFile" className="relative cursor-pointer rounded-md font-medium text-gray-900 hover:text-gray-700">
                        <span>Upload a file</span>
                        <input
                          id="coverImageFile"
                          name="coverImageFile"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {(validationError || error) && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{validationError || error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || validationError}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Trip'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}