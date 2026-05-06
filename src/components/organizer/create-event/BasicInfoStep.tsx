'use client';

import { CreateEventFormData, EVENT_CATEGORIES } from '@/types/organizer/createEvent';
import { useTheme } from '@/context/ThemeContext';

interface BasicInfoStepProps {
  formData: CreateEventFormData;
  onChange: (data: Partial<CreateEventFormData>) => void;
  errors: Record<string, string>;
}

export const BasicInfoStep = ({ formData, onChange, errors }: BasicInfoStepProps) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-5">
      {/* Event Name */}
      <div>
        <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
          Event Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] ${
            errors.name ? 'border-red-500' : 'border-[var(--border-color)]'
          }`}
          style={{
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
          }}
          placeholder="e.g., Malawi Fintech Expo 2026"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* Short Description */}
      <div>
        <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
          Short Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.shortDescription}
          onChange={(e) => onChange({ shortDescription: e.target.value })}
          rows={2}
          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] ${
            errors.shortDescription ? 'border-red-500' : 'border-[var(--border-color)]'
          }`}
          style={{
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
          }}
          placeholder="Brief summary of the event (max 160 characters)"
          maxLength={160}
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-[var(--text-secondary)]">{formData.shortDescription.length}/160</span>
        </div>
        {errors.shortDescription && <p className="text-xs text-red-500 mt-1">{errors.shortDescription}</p>}
      </div>

      {/* Full Description */}
      <div>
        <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
          Full Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={6}
          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] ${
            errors.description ? 'border-red-500' : 'border-[var(--border-color)]'
          }`}
          style={{
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
          }}
          placeholder="Detailed description of your event..."
        />
        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
      </div>

      {/* Category & Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => onChange({ category: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] ${
              errors.category ? 'border-red-500' : 'border-[var(--border-color)]'
            }`}
            style={{
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="">Select category</option>
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
            Event Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.type}
            onChange={(e) => onChange({ type: e.target.value as any })}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] ${
              errors.type ? 'border-red-500' : 'border-[var(--border-color)]'
            }`}
            style={{
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="public">🌍 Public Event</option>
            <option value="merchant">🛍️ Merchant Event</option>
            <option value="dsa-relevant">📋 DSA-Relevant</option>
          </select>
          {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Tags</label>
        <input
          type="text"
          value={formData.tags.join(', ')}
          onChange={(e) => onChange({ tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
          className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          style={{
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
          }}
          placeholder="e.g., fintech, networking, conference (comma separated)"
        />
        <p className="text-xs text-[var(--text-secondary)] mt-1">Tags help users discover your event</p>
      </div>
    </div>
  );
};