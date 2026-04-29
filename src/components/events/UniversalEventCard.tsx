'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Users, Heart, Share2, TrendingUp, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface UniversalEventCardProps {
  event: {
    id: string;
    name: string;
    description: string;
    shortDescription: string;
    startDate: string;
    endDate: string;
    venue: string;
    city: string;
    imageUrl?: string;
    ticketPrice: { min: number; max: number };
    attendees: number;
    capacity: number;
    isTrending: boolean;
    isSaved: boolean;
    type: 'public' | 'merchant' | 'dsa-relevant';
    category: string;
    roleSpecificBadges?: string[];
  };
  onSaveToggle?: (eventId: string, saved: boolean) => void;
}

export const UniversalEventCard = ({ event, onSaveToggle }: UniversalEventCardProps) => {
  const { theme } = useTheme();
  const [isSaved, setIsSaved] = useState(event.isSaved);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSaveToggle?.(event.id, !isSaved);
  };

  const getTypeBadge = () => {
    const badges = {
      public: { label: 'Public Event', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
      merchant: { label: 'Merchant Event', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
      'dsa-relevant': { label: 'DSA Relevant', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
    };
    return badges[event.type];
  };

  const getCategoryColor = () => {
    const colors: Record<string, string> = {
      concert: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      conference: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      workshop: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      sports: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
      festival: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
      corporate: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      education: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    };
    return colors[event.category] || colors.corporate;
  };

  const typeBadge = getTypeBadge();
  const categoryColor = getCategoryColor();
  const attendanceRate = (event.attendees / event.capacity) * 100;
  const isAlmostFull = attendanceRate > 85;
  const isStartingSoon = new Date(event.startDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div
      className="group rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        borderWidth: 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/events/${event.id}`}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={event.imageUrl || '/images/event-placeholder.jpg'}
            alt={event.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${typeBadge.color}`}>
              {typeBadge.label}
            </span>
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${categoryColor}`}>
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </span>
            {event.isTrending && (
              <span className="px-2 py-1 rounded-lg text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-1">
                <TrendingUp size={12} />
                Trending
              </span>
            )}
            {isStartingSoon && (
              <span className="px-2 py-1 rounded-lg text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 flex items-center gap-1">
                <Clock size={12} />
                Soon
              </span>
            )}
          </div>

          <button
            onClick={handleSave}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
              isHovered ? 'opacity-100' : 'opacity-0 md:opacity-100'
            } ${isSaved ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400 hover:text-red-500'}`}
          >
            <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>

          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            <span className="text-white text-sm font-bold">
              From {formatCurrency(event.ticketPrice.min)}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <h3 className="text-lg font-semibold line-clamp-1" style={{ color: 'var(--text-primary)' }}>
            {event.name}
          </h3>
          
          <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
            {event.shortDescription}
          </p>

          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <Calendar size={14} />
            <span>{formatDate(event.startDate)}</span>
            {event.endDate && (
              <>
                <span>-</span>
                <span>{formatDate(event.endDate)}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <MapPin size={14} />
            <span>{event.venue}, {event.city}</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span className="flex items-center gap-1">
                <Users size={12} />
                {event.attendees.toLocaleString()} attendees
              </span>
              <span>{Math.round(attendanceRate)}% filled</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isAlmostFull ? 'bg-orange-500' : 'bg-primary-green-500'
                }`}
                style={{ width: `${attendanceRate}%` }}
              />
            </div>
          </div>

          {event.roleSpecificBadges && event.roleSpecificBadges.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {event.roleSpecificBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                  style={{
                    backgroundColor: 'var(--hover-bg)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};