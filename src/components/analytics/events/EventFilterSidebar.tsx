'use client';

import { useState } from 'react';
import { SlidersHorizontal, X, Calendar as CalendarIcon, MapPin, DollarSign } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { EVENT_CATEGORIES, EVENT_TYPES, MALAWI_CITIES, EventFilter } from '@/types/events/universalEvent';
import { useTheme } from '@/context/ThemeContext';

interface EventFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: EventFilter;
  onFilterChange: (filters: EventFilter) => void;
  onApply: () => void;
  onReset: () => void;
}

export const EventFilterSidebar = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onApply,
  onReset,
}: EventFilterSidebarProps) => {
  const { theme } = useTheme();
  const [localFilters, setLocalFilters] = useState<EventFilter>(filters);

  const handleChange = (key: keyof EventFilter, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onApply();
  };

  const handleReset = () => {
    setLocalFilters({});
    onFilterChange({});
    onReset();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className="fixed right-0 top-0 h-full w-80 z-50 shadow-xl transition-transform duration-300 overflow-y-auto"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        {/* Header */}
        <div className="sticky top-0 p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} style={{ color: 'var(--text-primary)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Filters</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={18} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 space-y-6">
          {/* Event Type */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              Event Type
            </label>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleChange('type', localFilters.type === type.value ? undefined : type.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    localFilters.type === type.value
                      ? 'bg-primary-green-500 text-white'
                      : 'border hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  style={{
                    borderColor: localFilters.type === type.value ? undefined : 'var(--border-color)',
                    color: localFilters.type === type.value ? undefined : 'var(--text-secondary)',
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {EVENT_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleChange('category', localFilters.category === cat.value ? undefined : cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    localFilters.category === cat.value
                      ? 'bg-primary-green-500 text-white'
                      : 'border hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  style={{
                    borderColor: localFilters.category === cat.value ? undefined : 'var(--border-color)',
                    color: localFilters.category === cat.value ? undefined : 'var(--text-secondary)',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              Date Range
            </label>
            <div className="space-y-2">
              <div className="relative">
                <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                <DatePicker
                  selected={localFilters.startDate}
                  onChange={(date) => handleChange('startDate', date)}
                  placeholderText="Start Date"
                  className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-green-500"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div className="relative">
                <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                <DatePicker
                  selected={localFilters.endDate}
                  onChange={(date) => handleChange('endDate', date)}
                  placeholderText="End Date"
                  className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-green-500"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* City */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              City
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <select
                value={localFilters.city || ''}
                onChange={(e) => handleChange('city', e.target.value || undefined)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-green-500 appearance-none"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="">All Cities</option>
                {MALAWI_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              Price Range (MWK)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="number"
                  placeholder="Min"
                  value={localFilters.minPrice || ''}
                  onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-green-500"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="number"
                  placeholder="Max"
                  value={localFilters.maxPrice || ''}
                  onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-green-500"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 p-4 border-t flex gap-3" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
            style={{
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 rounded-lg bg-primary-green-500 text-white text-sm font-medium hover:bg-primary-green-600 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};