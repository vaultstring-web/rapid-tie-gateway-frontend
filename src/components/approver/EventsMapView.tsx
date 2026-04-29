'use client';

import { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { RegionEvent } from '@/types/rejected.ts/dashboard';
import { useTheme } from '@/context/ThemeContext';

// Simple map visualization using div-based representation
// For production, consider using react-leaflet or @react-google-maps/api

interface EventsMapViewProps {
  events: RegionEvent[];
  loading?: boolean;
}

const REGION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Lilongwe: { lat: -13.9833, lng: 33.7833 },
  Blantyre: { lat: -15.7861, lng: 35.0058 },
  Mzuzu: { lat: -11.4656, lng: 34.0207 },
  Zomba: { lat: -15.3767, lng: 35.3356 },
  Mangochi: { lat: -14.4783, lng: 35.2645 },
  Karonga: { lat: -9.9333, lng: 33.9333 },
  Salima: { lat: -13.7804, lng: 34.4587 },
  Kasungu: { lat: -13.0333, lng: 33.4833 },
  Dedza: { lat: -14.3333, lng: 34.3333 },
};

export const EventsMapView = ({ events, loading }: EventsMapViewProps) => {
  const { theme } = useTheme();
  const [tooltipEvent, setTooltipEvent] = useState<RegionEvent | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const getEventCountColor = (count: number) => {
    if (count >= 10) return 'bg-red-500';
    if (count >= 5) return 'bg-orange-500';
    if (count >= 1) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getMarkerSize = (count: number) => {
    const base = 32;
    const size = base + Math.min(count, 20);
    return `${size}px`;
  };

  if (loading) {
    return (
      <div className="h-96 rounded-xl animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#84cc16] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="rounded-xl overflow-hidden border relative"
        style={{
          backgroundColor: theme === 'dark' ? '#1a1a2e' : '#e8f4f8',
          borderColor: 'var(--border-color)',
          height: '400px',
        }}
      >
        {/* Map Header */}
        <div className="absolute top-3 left-3 z-10 bg-[var(--bg-secondary)] rounded-lg px-3 py-1.5 shadow-md border border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#84cc16]" />
            <span className="text-xs font-medium text-[var(--text-primary)]">
              Malawi - Request Heatmap
            </span>
          </div>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-3 right-3 z-10 bg-[var(--bg-secondary)] rounded-lg px-3 py-2 shadow-md border border-[var(--border-color)]">
          <p className="text-xs font-medium mb-2 text-[var(--text-primary)]">Request Density</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <span className="text-xs text-[var(--text-secondary)]">10+ requests</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500" />
              <span className="text-xs text-[var(--text-secondary)]">5-9 requests</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500" />
              <span className="text-xs text-[var(--text-secondary)]">1-4 requests</span>
            </div>
          </div>
        </div>

        {/* Map Grid Background */}
        <div className="absolute inset-0">
          {/* Simple grid lines for visual effect */}
          <svg width="100%" height="100%" className="absolute">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke={theme === 'dark' ? '#2a2a3e' : '#cbd5e1'}
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Region Labels and Markers */}
        <div className="relative h-full">
          {events.map((event) => {
            const coords = REGION_COORDINATES[event.region];
            if (!coords) return null;

            // Convert lat/lng to percentage position (approximate for Malawi)
            const left = ((coords.lng + 34) / 3) * 100;
            const top = ((coords.lat + 17) / 6) * 100;

            return (
              <div
                key={event.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${left}%`, top: `${top}%` }}
                onMouseEnter={(e) => {
                  setTooltipEvent(event);
                  setTooltipPosition({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setTooltipEvent(null)}
              >
                <div
                  className={`${getEventCountColor(event.requestCount)} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transition-transform hover:scale-110`}
                  style={{
                    width: getMarkerSize(event.requestCount),
                    height: getMarkerSize(event.requestCount),
                  }}
                >
                  {event.requestCount}
                </div>
                <div className="text-[10px] font-medium text-center mt-1 text-[var(--text-primary)] whitespace-nowrap">
                  {event.region}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tooltip */}
      {tooltipEvent && (
        <div
          className="fixed z-20 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 shadow-lg pointer-events-none"
          style={{ left: tooltipPosition.x + 15, top: tooltipPosition.y + 15 }}
        >
          <p className="font-semibold text-sm text-[var(--text-primary)]">{tooltipEvent.region}</p>
          <p className="text-xs text-[var(--text-secondary)]">
            Requests: {tooltipEvent.requestCount}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            Pending: {tooltipEvent.pendingCount}
          </p>
        </div>
      )}
    </div>
  );
};
