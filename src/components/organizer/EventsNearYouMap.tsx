'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';
import { NearbyEvent } from '@/types/organizer/dashboard';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

interface EventsNearYouMapProps {
  events: NearbyEvent[];
  userLocation?: { lat: number; lng: number };
  onLocationSelect?: (lat: number, lng: number) => void;
}

const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
};

export const EventsNearYouMap = ({ events, userLocation, onLocationSelect }: EventsNearYouMapProps) => {
  const { theme } = useTheme();
  const [mapCenter, setMapCenter] = useState<[number, number]>([-13.9833, 33.7833]); // Lilongwe coordinates
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation]);

  const getUserLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          onLocationSelect?.(latitude, longitude);
          setGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setGettingLocation(false);
        }
      );
    } else {
      console.error('Geolocation not supported');
      setGettingLocation(false);
    }
  };

  const getMapTileLayer = () => {
    if (theme === 'dark') {
      return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }
    return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  };

  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-primary-green-500" />
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            Events Near You
          </h3>
        </div>
        <button
          onClick={getUserLocation}
          disabled={gettingLocation}
          className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Navigation size={14} />
          {gettingLocation ? 'Locating...' : 'Use my location'}
        </button>
      </div>

      <div className="h-80 relative">
        <MapContainer
          center={mapCenter}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <MapUpdater center={mapCenter} />
          <TileLayer
            url={getMapTileLayer()}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {events.map((event) => (
            <Marker
              key={event.id}
              position={[event.latitude, event.longitude]}
            >
              <Popup>
                <div className="max-w-xs">
                  <img
                    src={event.imageUrl || '/images/event-placeholder.jpg'}
                    alt={event.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <h4 className="font-semibold text-gray-900 dark:text-white">{event.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.venue}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {event.distance ? `${event.distance.toFixed(1)} km away` : ''}
                  </p>
                  <Link
                    href={`/events/${event.id}`}
                    className="inline-block mt-2 text-xs text-primary-green-500 hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="p-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
          {events.length} events found near you
        </p>
      </div>
    </div>
  );
};