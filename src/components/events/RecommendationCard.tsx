'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Heart, X, Info, ThumbsDown, CheckCircle } from 'lucide-react';
import { RecommendedEvent, REASON_ICONS } from '@/types/events/eventRecommendation';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface RecommendationCardProps {
  event: RecommendedEvent;
  onSaveToggle?: (eventId: string, saved: boolean) => void;
  onNotInterested?: (eventId: string) => void;
  showMatchBadge?: boolean;
  variant?: 'default' | 'compact';
}

export const RecommendationCard = ({
  event,
  onSaveToggle,
  onNotInterested,
  showMatchBadge = true,
  variant = 'default',
}: RecommendationCardProps) => {
  const { theme } = useTheme();
  const [isSaved, setIsSaved] = useState(event.isSaved);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isNotInterested, setIsNotInterested] = useState(event.isNotInterested);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSaveToggle?.(event.id, !isSaved);
  };

  const handleNotInterested = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNotInterested(true);
    onNotInterested?.(event.id);
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  if (isNotInterested) {
    return (
      <div
        className="rounded-xl p-6 text-center transition-colors"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          borderWidth: 1,
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <ThumbsDown size={32} style={{ color: 'var(--text-secondary)' }} />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            You're not interested in this event
          </p>
          <button
            onClick={() => setIsNotInterested(false)}
            className="text-xs text-primary-green-500 hover:underline"
          >
            Undo
          </button>
        </div>
      </div>
    );
  }

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
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={event.imageUrl || '/images/event-placeholder.jpg'}
            alt={event.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Match Percentage Badge */}
          {showMatchBadge && (
            <div className="absolute top-3 left-3">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm">
                <CheckCircle size={12} className="text-green-400" />
                <span className="text-white text-xs font-medium">
                  {event.matchPercentage}% Match
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                isHovered ? 'opacity-100' : 'opacity-0 md:opacity-100'
              } ${isSaved ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400 hover:text-red-500'}`}
            >
              <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
            </button>

            {/* Not Interested Button */}
            <button
              onClick={handleNotInterested}
              className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                isHovered ? 'opacity-100' : 'opacity-0 md:opacity-100'
              } bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400 hover:text-orange-500`}
            >
              <ThumbsDown size={16} />
            </button>
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            <span className="text-white text-sm font-bold">
              From {formatCurrency(event.ticketPrice.min)}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Title with Tooltip */}
          <div className="relative">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                {event.name}
              </h3>
              <button
                onMouseEnter={() => setShowTooltip('main')}
                onMouseLeave={() => setShowTooltip(null)}
                className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Info size={14} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>

            {/* Tooltip */}
            {showTooltip === 'main' && (
              <div
                className="absolute z-10 top-6 right-0 w-64 p-3 rounded-lg shadow-lg border text-sm"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <p className="font-medium mb-1">Why we recommended this:</p>
                <ul className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  {event.reasons.slice(0, 3).map((reason, idx) => (
                    <li key={idx} className="flex items-center gap-1">
                      <span>{REASON_ICONS[reason.type]}</span>
                      <span>{reason.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
            {event.shortDescription}
          </p>

          {/* Date & Time */}
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <Calendar size={14} />
            <span>{formatDate(event.startDate)}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <MapPin size={14} />
            <span>{event.venue}, {event.city}</span>
          </div>

          {/* Reason Chips */}
          <div className="flex flex-wrap gap-1 pt-1">
            {event.reasons.slice(0, 3).map((reason, idx) => (
              <div
                key={idx}
                className="relative"
                onMouseEnter={() => setShowTooltip(reason.type)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium cursor-help"
                  style={{
                    backgroundColor: 'var(--hover-bg)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span>{REASON_ICONS[reason.type]}</span>
                  <span>{reason.title}</span>
                </span>
                
                {/* Reason Tooltip */}
                {showTooltip === reason.type && (
                  <div
                    className="absolute z-10 bottom-full left-0 mb-2 w-48 p-2 rounded-lg shadow-lg border text-xs"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {reason.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
};