'use client';

import { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import { GeographicData } from '@/types/analytics/eventAnalytics';

// Malawi GeoJSON URL
const MALAWI_GEOJSON = 'https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries/MWI.geo.json';

interface GeographicHeatMapProps {
  data: GeographicData[];
  loading?: boolean;
}

const getHeatColor = (revenue: number, maxRevenue: number) => {
  const intensity = revenue / maxRevenue;
  if (intensity < 0.2) return '#a3e635';
  if (intensity < 0.4) return '#84cc16';
  if (intensity < 0.6) return '#65a30d';
  if (intensity < 0.8) return '#4d7c0f';
  return '#3f6212';
};

export const GeographicHeatMap = ({ data, loading }: GeographicHeatMapProps) => {
  const [tooltipContent, setTooltipContent] = useState<GeographicData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  return (
    <div className="relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 8000,
          center: [34.5, -13.5],
        }}
        width={800}
        height={600}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup>
          <Geographies geography={MALAWI_GEOJSON}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#e5e7eb"
                  stroke="#ffffff"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#9ca3af', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>
          
          {data.map((location) => (
            <Marker
              key={location.city}
              coordinates={[location.longitude, location.latitude]}
              onMouseEnter={(e) => {
                setTooltipContent(location);
                setTooltipPosition({ x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => setTooltipContent(null)}
            >
              <circle
                r={Math.sqrt(location.revenue / maxRevenue) * 20 + 5}
                fill={getHeatColor(location.revenue, maxRevenue)}
                fillOpacity={0.7}
                stroke="#ffffff"
                strokeWidth={1}
                className="cursor-pointer transition-all hover:fill-opacity-90"
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltipContent && (
        <div
          className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700 z-10 pointer-events-none"
          style={{ left: tooltipPosition.x + 10, top: tooltipPosition.y + 10 }}
        >
          <p className="font-semibold text-gray-900 dark:text-white">{tooltipContent.city}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Events: {tooltipContent.events}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tickets: {tooltipContent.tickets.toLocaleString()}
          </p>
          <p className="text-sm font-medium text-primary-green-600">
            Revenue: MWK {tooltipContent.revenue.toLocaleString()}
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Revenue Intensity</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#a3e635' }} />
            <span className="text-xs text-gray-600 dark:text-gray-400">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#84cc16' }} />
            <span className="text-xs text-gray-600 dark:text-gray-400">Medium-Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#65a30d' }} />
            <span className="text-xs text-gray-600 dark:text-gray-400">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#4d7c0f' }} />
            <span className="text-xs text-gray-600 dark:text-gray-400">Medium-High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3f6212' }} />
            <span className="text-xs text-gray-600 dark:text-gray-400">High</span>
          </div>
        </div>
      </div>
    </div>
  );
};