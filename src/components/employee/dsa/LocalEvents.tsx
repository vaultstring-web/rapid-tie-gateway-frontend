'use client';

import { Calendar, MapPin, Users, Sparkles, Navigation } from 'lucide-react';
import { LocalEvent } from '@/types/employee/dsaDetails';
import { formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';

interface LocalEventsProps {
  events: LocalEvent[];
  destination: string;
  loading?: boolean;
}

export const LocalEvents = ({ events, destination, loading }: LocalEventsProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex gap-3">
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <Sparkles size={32} className="mx-auto mb-3 opacity-50 text-[var(--text-secondary)]" />
        <p className="text-sm text-[var(--text-secondary)]">No events found near {destination}</p>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Check back closer to your travel dates</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <Link
          key={event.id}
          href={`/events/${event.id}`}
          className="block rounded-xl p-4 border transition-all hover:shadow-md hover:border-[#84cc16]"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex gap-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
              {event.imageUrl ? (
                <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Calendar size={24} className="text-[var(--text-secondary)]" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[#84cc16]">
                    {event.name}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-2">
                    {event.description}
                  </p>
                </div>
                {event.relevanceScore >= 80 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 whitespace-nowrap">
                    Recommended
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-[var(--text-secondary)]">
                <div className="flex items-center gap-1">
                  <Calendar size={10} />
                  <span>{formatDate(event.startDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={10} />
                  <span>{event.venue}, {event.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={10} />
                  <span className="capitalize">{event.category}</span>
                </div>
                {event.distance && (
                  <div className="flex items-center gap-1">
                    <Navigation size={10} />
                    <span>{event.distance} km away</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};