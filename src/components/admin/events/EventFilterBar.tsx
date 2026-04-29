'use client';

import { Search, Filter, X, Calendar } from 'lucide-react';
import { EventFilter, EVENT_STATUS_CONFIG, EVENT_CATEGORIES } from '@/types/admin/events';
import { useTheme } from '@/context/ThemeContext';

interface EventFilterBarProps {
  filters: EventFilter;
  onFilterChange: (filters: Partial<EventFilter>) => void;
  onReset: () => void;
  organizers: { id: string; name: string }[];
}

export const EventFilterBar = ({ filters, onFilterChange, onReset, organizers }: EventFilterBarProps) => {
  const { theme } = useTheme();

  const statuses = [
    { value: '', label: 'All Status' },
    ...Object.entries(EVENT_STATUS_CONFIG).map(([value, config]) => ({
      value,
      label: config.label,
    })),
  ];

  const categories = [
    { value: '', label: 'All Categories' },
    ...EVENT_CATEGORIES.map(cat => ({ value: cat.value, label: cat.label })),
  ];

  const hasActiveFilters = filters.search || filters.status || filters.category || filters.organizerId || filters.dateFrom || filters.dateTo || filters.minRevenue || filters.maxRevenue;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              placeholder="Search by event name, venue, or organizer..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] min-w-[140px]"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] min-w-[140px]"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>

        {/* Organizer Filter */}
        <select
          value={filters.organizerId}
          onChange={(e) => onFilterChange({ organizerId: e.target.value })}
          className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] min-w-[160px]"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="">All Organizers</option>
          {organizers.map((org) => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>

        {/* Date From */}
        <div className="relative">
          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => onFilterChange({ dateFrom: e.target.value || undefined })}
            className="pl-9 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            placeholder="From"
          />
        </div>

        {/* Date To */}
        <div className="relative">
          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => onFilterChange({ dateTo: e.target.value || undefined })}
            className="pl-9 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            placeholder="To"
          />
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <X size={14} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};