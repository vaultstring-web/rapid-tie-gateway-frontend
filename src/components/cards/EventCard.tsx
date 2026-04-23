import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/styles/ThemeProvider';
import { formatCurrency, formatDate } from '@/lib/utils/format';

interface EventCardProps {
  event: {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    venue: string;
    imageUrl?: string;
    ticketTiers: Array<{
      name: string;
      price: number;
      available: number;
    }>;
  };
  variant?: 'default' | 'featured' | 'compact';
}

export const EventCard: React.FC<EventCardProps> = ({ event, variant = 'default' }) => {
  const theme = useTheme();

  const lowestPrice = Math.min(...event.ticketTiers.map((t) => t.price));
  const totalAvailable = event.ticketTiers.reduce((sum, t) => sum + t.available, 0);
  const isSoldOut = totalAvailable === 0;

  return (
    <div
      className={`card hover:shadow-lg transition-all ${
        variant === 'featured' ? 'border-2 border-primary-green-500' : ''
      } ${variant === 'compact' ? 'p-4' : 'p-6'}`}
    >
      <div
        className={`relative ${variant === 'compact' ? 'h-32' : 'h-48'} w-full mb-4 rounded-lg overflow-hidden`}
      >
        {event.imageUrl ? (
          <Image src={event.imageUrl} alt={event.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
            <span className="text-neutral-500 text-body-sm">No image</span>
          </div>
        )}
        {variant === 'featured' && (
          <div className="absolute top-2 right-2 bg-primary-green-500 text-white px-3 py-1 rounded-full text-caption font-semibold">
            Featured
          </div>
        )}
        {isSoldOut && (
          <div className="absolute top-2 left-2 bg-semantic-error-main text-white px-3 py-1 rounded-full text-caption font-semibold">
            Sold Out
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <h3
            className={`font-semibold text-neutral-900 line-clamp-1 ${
              variant === 'compact' ? 'text-h6' : 'text-h5'
            }`}
          >
            {event.name}
          </h3>
          <p className="text-body-sm text-neutral-600 line-clamp-2">{event.description}</p>
        </div>

        <div className="flex items-center gap-2 text-body-sm text-neutral-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{formatDate(event.startDate)}</span>
        </div>

        <div className="flex items-center gap-2 text-body-sm text-neutral-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="line-clamp-1">{event.venue}</span>
        </div>

        {variant !== 'compact' && (
          <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
            <div>
              <p className="text-caption text-neutral-600">Starting from</p>
              <p className="text-h5 font-bold text-primary-green-500">
                {formatCurrency(lowestPrice)}
              </p>
            </div>

            <Link href={`/events/${event.id}`} className="btn-primary">
              View Details
            </Link>
          </div>
        )}

        {!isSoldOut && totalAvailable < 20 && variant !== 'compact' && (
          <div className="mt-2">
            <span className="badge badge-warning">Only {totalAvailable} tickets left!</span>
          </div>
        )}
      </div>
    </div>
  );
};
