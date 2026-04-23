'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Calendar, MapPin, DollarSign, Heart, Clock, Users, Cloud, Droplets, Wind } from 'lucide-react';
import { CalendarEvent, WEATHER_ICONS } from '@/types/events/eventCalendar';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface EventModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveToggle?: (eventId: string, saved: boolean) => void;
}

export const EventModal = ({ event, isOpen, onClose, onSaveToggle }: EventModalProps) => {
  const { theme } = useTheme();
  const [isSaved, setIsSaved] = useState(event?.isSaved || false);

  useEffect(() => {
    setIsSaved(event?.isSaved || false);
  }, [event]);

  if (!isOpen || !event) return null;

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSaveToggle?.(event.id, !isSaved);
  };

  const getRoleColor = () => {
    const colors = {
      public: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
      merchant: 'text-green-500 bg-green-100 dark:bg-green-900/30',
      'dsa-relevant': 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
    };
    return colors[event.role];
  };

  const getCategoryColor = () => {
    const colors: Record<string, string> = {
      concert: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
      conference: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
      workshop: 'text-green-500 bg-green-100 dark:bg-green-900/30',
      sports: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
      festival: 'text-pink-500 bg-pink-100 dark:bg-pink-900/30',
      corporate: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
      education: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
    };
    return colors[event.category] || colors.corporate;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-slide-up"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          borderWidth: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X size={20} style={{ color: 'var(--text-secondary)' }} />
        </button>

        {/* Image Section */}
        <div className="relative h-64 overflow-hidden rounded-t-2xl">
          <Image
            src={event.imageUrl || '/images/event-placeholder.jpg'}
            alt={event.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor()}`}>
              {event.role.toUpperCase()}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor()}`}>
              {event.category.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {event.title}
          </h2>

          {/* Date & Time */}
          <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{formatDate(event.start)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>
                {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <MapPin size={16} />
            <span>{event.venue}, {event.city}</span>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {event.description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--hover-bg)' }}>
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-primary-green-500" />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Ticket Price
              </span>
            </div>
            <span className="text-lg font-bold text-primary-green-500">
              {formatCurrency(event.ticketPrice.min)} - {formatCurrency(event.ticketPrice.max)}
            </span>
          </div>

          {/* Weather Forecast */}
          {event.weather && (
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--hover-bg)' }}>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Cloud size={16} />
                Weather Forecast
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="text-center">
                  <div className="text-2xl">{WEATHER_ICONS[event.weather.condition]}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {event.weather.temperature}°C
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Droplets size={14} />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {event.weather.humidity}%
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Wind size={14} />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {event.weather.windSpeed} km/h
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Rain: {event.weather.precipitation}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Link
              href={`/events/${event.id}`}
              className="flex-1 text-center px-4 py-2 rounded-lg bg-primary-green-500 text-white font-medium hover:bg-primary-green-600 transition-colors"
            >
              View Details
            </Link>
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                isSaved
                  ? 'bg-red-500 text-white border-red-500'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{
                borderColor: 'var(--border-color)',
                color: isSaved ? undefined : 'var(--text-primary)',
              }}
            >
              <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};