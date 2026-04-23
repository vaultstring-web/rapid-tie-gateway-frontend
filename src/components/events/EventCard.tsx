'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Users, Heart, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { Event } from '@/types/events/eventDiscovery';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import { EVENT_CATEGORIES } from '@/types/events/eventDiscovery';

interface EventCardProps {
  event: Event;
  viewMode: 'grid' | 'list';
  onSaveToggle: (eventId: string, saved: boolean) => void;
}

export const EventCard = ({ event, viewMode, onSaveToggle }: EventCardProps) => {
  const { theme } = useTheme();
  const [isSaved, setIsSaved] = useState(event.isSaved);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSaveToggle(event.id, !isSaved);
  };

  const categoryConfig = EVENT_CATEGORIES.find(c => c.value === event.category);
  const attendanceRate = (event.attendees / event.capacity) * 100;
  const isAlmostFull = attendanceRate > 85;

  if (viewMode === 'list') {
    return (
      <Link href={`/events/${event.id}`}>
        <div
          className="group rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative sm:w-48 h-48 sm:h-auto overflow-hidden">
              <Image
                src={event.imageUrl || '/images/event-placeholder.jpg'}
                alt={event.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {event.isTrending && (
                <div className="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-medium bg-red-500 text-white flex items-center gap-1">
                  <TrendingUp size={12} />
                  Trending
                </div>
              )}
              {isAlmostFull && (
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg text-xs font-medium bg-orange-500 text-white">
                  Almost Full
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryConfig?.color}`}>
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {event.type.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1 line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                    {event.name}
                  </h3>
                  <p className="text-sm line-clamp-2 mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {event.shortDescription}
                  </p>
                </div>
                <button
                  onClick={handleSave}
                  className={`p-2 rounded-full transition-all ${isHovered ? 'opacity-100' : 'opacity-70'}`}
                >
                  <Heart size={18} fill={isSaved ? '#ef4444' : 'none'} className={isSaved ? 'text-red-500' : 'text-gray-400'} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{formatDate(event.startDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span className="truncate">{event.venue}, {event.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{event.attendees.toLocaleString()} attending</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-primary-green-500">{formatCurrency(event.ticketPrice.min)}</span>
                  {event.ticketPrice.max > event.ticketPrice.min && (
                    <span>- {formatCurrency(event.ticketPrice.max)}</span>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="w-full max-w-[150px]">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
                    <div
                      className={`h-full rounded-full transition-all ${isAlmostFull ? 'bg-orange-500' : 'bg-primary-green-500'}`}
                      style={{ width: `${Math.min(attendanceRate, 100)}%` }}
                    />
                  </div>
                </div>
                <ChevronRight size={16} className="text-primary-green-500" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view
  return (
    <Link href={`/events/${event.id}`}>
      <div
        className="group rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl border"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={event.imageUrl || '/images/event-placeholder.jpg'}
            alt={event.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            {event.isTrending && (
              <span className="px-2 py-1 rounded-lg text-xs font-medium bg-red-500 text-white flex items-center gap-1">
                <TrendingUp size={12} />
                Trending
              </span>
            )}
            {isAlmostFull && (
              <span className="px-2 py-1 rounded-lg text-xs font-medium bg-orange-500 text-white">
                Almost Full
              </span>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all ${
              isHovered ? 'opacity-100' : 'opacity-0 md:opacity-100'
            } ${isSaved ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400'}`}
          >
            <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
          </button>

          {/* Price Tag */}
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
            <span className="text-white text-xs font-medium">
              From {formatCurrency(event.ticketPrice.min)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryConfig?.color}`}>
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </span>
          </div>
          
          <h3 className="text-base font-semibold line-clamp-1" style={{ color: 'var(--text-primary)' }}>
            {event.name}
          </h3>
          
          <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
            {event.shortDescription}
          </p>

          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <Calendar size={12} />
            <span>{formatDate(event.startDate)}</span>
          </div>

          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <MapPin size={12} />
            <span className="truncate">{event.venue}, {event.city}</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <Users size={12} />
              <span>{event.attendees.toLocaleString()}</span>
            </div>
            <div className="w-16 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
              <div
                className={`h-full rounded-full ${isAlmostFull ? 'bg-orange-500' : 'bg-primary-green-500'}`}
                style={{ width: `${Math.min(attendanceRate, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};