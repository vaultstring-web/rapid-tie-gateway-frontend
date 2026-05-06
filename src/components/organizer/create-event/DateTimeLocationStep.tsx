'use client';

import { Calendar, Clock, MapPin, Building2, Globe } from 'lucide-react';
import { CreateEventFormData, MALAWI_CITIES, TIMEZONES } from '@/types/organizer/createEvent';
import { useTheme } from '@/context/ThemeContext';

interface DateTimeLocationStepProps {
  formData: CreateEventFormData;
  onChange: (data: Partial<CreateEventFormData>) => void;
  errors: Record<string, string>;
}

export const DateTimeLocationStep = ({ formData, onChange, errors }: DateTimeLocationStepProps) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-5">
      {/* Virtual Event Toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isVirtual}
            onChange={(e) => onChange({ isVirtual: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
          />
          <span className="text-sm font-medium text-[var(--text-primary)]">This is a virtual event</span>
        </label>
      </div>

      {/* Date/Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
            Start Date & Time <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => onChange({ startDate: e.target.value })}
              className={`w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] ${
                errors.startDate ? 'border-red-500' : 'border-[var(--border-color)]'
              }`}
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
            End Date & Time <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => onChange({ endDate: e.target.value })}
              className={`w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] ${
                errors.endDate ? 'border-red-500' : 'border-[var(--border-color)]'
              }`}
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
        </div>
      </div>

      {/* Timezone */}
      <div>
        <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Timezone</label>
        <div className="relative">
          <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <select
            value={formData.timezone}
            onChange={(e) => onChange({ timezone: e.target.value })}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
            style={{
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
            }}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Virtual Link */}
      {formData.isVirtual && (
        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
            Virtual Event Link <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={formData.virtualLink || ''}
            onChange={(e) => onChange({ virtualLink: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
            style={{
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
            }}
            placeholder="https://meet.google.com/..."
          />
        </div>
      )}

      {/* Location (only for physical events) */}
      {!formData.isVirtual && (
        <>
          <div>
            <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
              Venue Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => onChange({ venue: e.target.value })}
                className={`w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] ${
                  errors.venue ? 'border-red-500' : 'border-[var(--border-color)]'
                }`}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                }}
                placeholder="e.g., Bingu International Convention Centre"
              />
            </div>
            {errors.venue && <p className="text-xs text-red-500 mt-1">{errors.venue}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <select
                  value={formData.city}
                  onChange={(e) => onChange({ city: e.target.value })}
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] ${
                    errors.city ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="">Select city</option>
                  {MALAWI_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
                Full Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => onChange({ address: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                }}
                placeholder="Street address, building, floor"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};