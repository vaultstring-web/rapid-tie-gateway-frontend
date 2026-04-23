'use client';

import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, MapPin, DollarSign, ChevronDown, SlidersHorizontal } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { EventFilters, EVENT_CATEGORIES, EVENT_TYPES, MALAWI_CITIES, SORT_OPTIONS } from '@/types/events/eventDiscovery';
import { useTheme } from '@/context/ThemeContext';

interface EventFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: EventFilters;
  onFilterChange: (filters: EventFilters) => void;
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
  const [localFilters, setLocalFilters] = useState<EventFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key: keyof EventFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    const current = localFilters.category || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    handleChange('category', updated.length ? updated : undefined);
  };

  const handleTypeToggle = (type: string) => {
    handleChange('type', localFilters.type === type ? undefined : type);
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
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />
      
      <div
        className="fixed right-0 top-0 h-full w-96 z-50 shadow-xl transition-transform duration-300 overflow-y-auto"
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
          {/* Sort By */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              Sort By
            </label>
            <select
              value={localFilters.sortBy || 'date'}
              onChange={(e) => handleChange('sortBy', e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-green-500"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Event Type */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              Event Type
            </label>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleTypeToggle(type.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    localFilters.type === type.value
                      ? 'bg-primary-green-500 text-white'
                      : 'border hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  style={{
                    borderColor: localFilters.type === type.value ? undefined : 'var(--border-color)',
                    color: localFilters.type === type.value ? undefined : 'var(--text-primary)',
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category - Multiple Select */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              Category (Select multiple)
            </label>
            <div className="flex flex-wrap gap-2">
              {EVENT_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryToggle(cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    localFilters.category?.includes(cat.value)
                      ? cat.color.split(' ')[0] + ' text-white'
                      : 'border hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  style={{
                    backgroundColor: localFilters.category?.includes(cat.value) 
                      ? cat.value === 'concert' ? '#8b5cf6' 
                        : cat.value === 'conference' ? '#3b82f6' 
                        : cat.value === 'workshop' ? '#10b981' 
                        : cat.value === 'training' ? '#eab308' 
                        : cat.value === 'sports' ? '#f59e0b' 
                        : cat.value === 'festival' ? '#ec4899' 
                        : '#6b7280' 
                      : undefined,
                    borderColor: 'var(--border-color)',
                    color: localFilters.category?.includes(cat.value) ? 'white' : 'var(--text-primary)',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {localFilters.category && localFilters.category.length > 0 && (
              <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                {localFilters.category.length} category(s) selected
              </p>
            )}
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

          {/* Active Filters Summary */}
          {(localFilters.type || (localFilters.category && localFilters.category.length > 0) || localFilters.city || localFilters.minPrice || localFilters.maxPrice || localFilters.startDate || localFilters.endDate) && (
            <div className="pt-2">
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Active Filters:</p>
              <div className="flex flex-wrap gap-1">
                {localFilters.type && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary-green-500/20 text-primary-green-500">
                    Type: {EVENT_TYPES.find(t => t.value === localFilters.type)?.label}
                  </span>
                )}
                {localFilters.city && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary-green-500/20 text-primary-green-500">
                    City: {localFilters.city}
                  </span>
                )}
                {(localFilters.minPrice || localFilters.maxPrice) && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary-green-500/20 text-primary-green-500">
                    Price: {localFilters.minPrice || '0'} - {localFilters.maxPrice || '∞'}
                  </span>
                )}
              </div>
            </div>
          )}
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