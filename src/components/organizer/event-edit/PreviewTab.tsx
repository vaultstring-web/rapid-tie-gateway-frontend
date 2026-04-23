'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Ticket, Users, Eye, Heart, Share2 } from 'lucide-react';
import { EventFormData } from '@/types/organizer/eventEdit';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface PreviewTabProps {
  formData: EventFormData;
  eventId?: string;
}

export const PreviewTab = ({ formData, eventId }: PreviewTabProps) => {
  const { theme } = useTheme();
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');

  const previewContent = (
    <div className="space-y-6">
      {/* Header Image */}
      {formData.images.length > 0 && (
        <div className="relative h-64 rounded-xl overflow-hidden">
          <Image
            src={formData.images.find(i => i.isPrimary)?.url || formData.images[0]?.url || '/images/event-placeholder.jpg'}
            alt={formData.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Title and Actions */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {formData.name || 'Event Title'}
          </h1>
          <div className="flex flex-wrap gap-4 mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formData.startDate ? formatDate(formData.startDate) : 'Date TBD'}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{formData.venue || 'Venue TBD'}, {formData.city || 'City TBD'}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
            <Heart size={16} />
          </button>
          <button className="p-2 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Description */}
      <div
        className="rounded-xl p-5 border"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          About This Event
        </h2>
        <p className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {formData.description || 'No description provided yet.'}
        </p>
      </div>

      {/* Tickets */}
      <div
        className="rounded-xl p-5 border sticky top-24"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Tickets
        </h2>
        <div className="space-y-4">
          {formData.ticketTiers.length === 0 ? (
            <p className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
              No ticket tiers added yet
            </p>
          ) : (
            formData.ticketTiers.map((tier, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {tier.name}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {tier.description}
                    </p>
                  </div>
                  <span className="text-xl font-bold text-primary-green-500">
                    {formatCurrency(tier.price)}
                  </span>
                </div>
                <button className="w-full mt-3 py-2 rounded-lg bg-primary-green-500 text-white font-medium hover:bg-primary-green-600 transition-colors">
                  Select
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Device Toggle */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setDeviceView('desktop')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            deviceView === 'desktop'
              ? 'bg-primary-green-500 text-white'
              : 'border hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          style={{ borderColor: 'var(--border-color)' }}
        >
          Desktop
        </button>
        <button
          onClick={() => setDeviceView('mobile')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            deviceView === 'mobile'
              ? 'bg-primary-green-500 text-white'
              : 'border hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          style={{ borderColor: 'var(--border-color)' }}
        >
          Mobile
        </button>
      </div>

      {/* Preview Content */}
      <div
        className={deviceView === 'mobile' ? 'max-w-md mx-auto' : ''}
      >
        {previewContent}
      </div>

      {/* Preview Note */}
      <div
        className="rounded-lg p-4 text-center text-sm"
        style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-secondary)' }}
      >
        👁️ This is a preview of how your event will appear to attendees.
        {eventId && (
          <Link
            href={`/events/${eventId}`}
            target="_blank"
            className="block mt-2 text-primary-green-500 hover:underline"
          >
            View live page →
          </Link>
        )}
      </div>
    </div>
  );
};