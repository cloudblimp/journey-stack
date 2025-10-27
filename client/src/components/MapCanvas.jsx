import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.375rem' // rounded
};

const defaultCenter = {
  lat: 20.5937, // Default center (India)
  lng: 78.9629
};

export default function MapCanvas({ height = 300, onLocationSelect, initialLocation }) {
  const [marker, setMarker] = useState(initialLocation || null);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const handleMapClick = useCallback((event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    setMarker(newLocation);
    if (onLocationSelect) {
      onLocationSelect(newLocation);
    }
  }, [onLocationSelect]);

  if (!isLoaded) {
    return (
      <div className="w-full border border-dashed border-sky-300 bg-indigo-50 rounded flex items-center justify-center" style={{ height }}>
        Loading map...
      </div>
    );
  }

  return (
    <div className="w-full border border-sky-300 bg-indigo-50 rounded overflow-hidden" style={{ height }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={marker || defaultCenter}
        zoom={marker ? 10 : 4}
        onClick={handleMapClick}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControlOptions: { position: 7 }, // Position control on the left side
        }}
      >
        {marker && (
          <Marker
            position={marker}
            draggable={true}
            onDragEnd={(e) => handleMapClick(e)}
          />
        )}
      </GoogleMap>
    </div>
  );
}


