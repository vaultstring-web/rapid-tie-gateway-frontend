'use client';

import { Calendar, MapPin, Tag, Type, Globe, Users as UsersIcon } from 'lucide-react';
import { EventFormData, EVENT_CATEGORIES, MALAWI_CITIES } from '@/types/organizer/eventEdit';
import { useTheme } from '@/context/ThemeContext';

interface BasicInfoTabProps {
  formData: EventFormData;
  onChange: (data: Partial<EventFormData>) => void;
  errors: Record<string, string>;
}

export const BasicInfoTab = ({ formData, onChange, errors }: BasicInfoTabProps) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Event Name */}
      <div>
        <label className="label label-required">Event Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className={`input ${errors.name ? 'input-error' : ''}`}
          placeholder="Enter event name"
        />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>

      {/* Short Description */}
      <div>
        <label className="label label-required">Short Description</label>
        <textarea
          value={formData.shortDescription}
          onChange={(e) => onChange({ shortDescription: e.target.value })}
          className={`input resize-y ${errors.shortDescription ? 'input-error' : ''}`}
          rows={2}
          placeholder="Brief description (max 160 characters)"
          maxLength={160}
        />
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
          {formData.shortDescription.length}/160 characters
        </p>
        {errors.shortDescription && <p className="error-text">{errors.shortDescription}</p>}
      </div>

      {/* Full Description */}
      <div>
        <label className="label label-required">Full Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className={`input resize-y ${errors.description ? 'input-error' : ''}`}
          rows={6}
          placeholder="Detailed description of the event"
        />
        {errors.description && <p className="error-text">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label className="label label-required">Category</label>
          <select
            value={formData.category}
            onChange={(e) => onChange({ category: e.target.value })}
            className={`input ${errors.category ? 'input-error' : ''}`}
          >
            <option value="">Select category</option>
            {EVENT_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          {errors.category && <p className="error-text">{errors.category}</p>}
        </div>

        {/* Event Type */}
        <div>
          <label className="label label-required">Event Type</label>
          <select
            value={formData.type}
            onChange={(e) => onChange({ type: e.target.value as any })}
            className={`input ${errors.type ? 'input-error' : ''}`}
          >
            <option value="public">🌍 Public</option>
            <option value="merchant">🛍️ Merchant</option>
            <option value="dsa-relevant">📋 DSA-Relevant</option>
          </select>
          {errors.type && <p className="error-text">{errors.type}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div>
          <label className="label label-required">Start Date & Time</label>
          <input
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
            className={`input ${errors.startDate ? 'input-error' : ''}`}
          />
          {errors.startDate && <p className="error-text">{errors.startDate}</p>}
        </div>

        {/* End Date */}
        <div>
          <label className="label label-required">End Date & Time</label>
          <input
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
            className={`input ${errors.endDate ? 'input-error' : ''}`}
          />
          {errors.endDate && <p className="error-text">{errors.endDate}</p>}
        </div>
      </div>

      {/* Venue */}
      <div>
        <label className="label label-required">Venue</label>
        <input
          type="text"
          value={formData.venue}
          onChange={(e) => onChange({ venue: e.target.value })}
          className={`input ${errors.venue ? 'input-error' : ''}`}
          placeholder="Venue name"
        />
        {errors.venue && <p className="error-text">{errors.venue}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* City */}
        <div>
          <label className="label label-required">City</label>
          <select
            value={formData.city}
            onChange={(e) => onChange({ city: e.target.value })}
            className={`input ${errors.city ? 'input-error' : ''}`}
          >
            <option value="">Select city</option>
            {MALAWI_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {errors.city && <p className="error-text">{errors.city}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="label">Full Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => onChange({ address: e.target.value })}
            className="input"
            placeholder="Street address"
          />
        </div>
      </div>

      {/* Capacity */}
      <div>
        <label className="label">Total Capacity</label>
        <input
          type="number"
          value={formData.capacity || ''}
          onChange={(e) => onChange({ capacity: parseInt(e.target.value) || 0 })}
          className="input"
          placeholder="Maximum number of attendees"
          min={0}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="label">Tags</label>
        <input
          type="text"
          value={formData.tags.join(', ')}
          onChange={(e) => onChange({ tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
          className="input"
          placeholder="e.g., music, networking, keynote (comma separated)"
        />
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
          Tags help users discover your event
        </p>
      </div>
    </div>
  );
};