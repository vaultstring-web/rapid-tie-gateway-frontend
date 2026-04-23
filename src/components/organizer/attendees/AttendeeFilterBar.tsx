'use client';

import { Search, Filter, X } from 'lucide-react';
import { AttendeeFilters, ROLE_BADGE_CONFIG } from '@/types/organizer/attendeeList';
import { useTheme } from '@/context/ThemeContext';

interface AttendeeFilterBarProps {
  filters: AttendeeFilters;
  onFilterChange: (filters: Partial<AttendeeFilters>) => void;
  onReset: () => void;
  tiers: { id: string; name: string }[];
}

export const AttendeeFilterBar = ({ filters, onFilterChange, onReset, tiers }: AttendeeFilterBarProps) => {
  const { theme } = useTheme();

  const roles = Object.entries(ROLE_BADGE_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  const statuses = [
    { value: '', label: 'All Status' },
    { value: 'checked_in', label: 'Checked In' },
    { value: 'not_checked_in', label: 'Not Checked In' },
    { value: 'refunded', label: 'Refunded' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const hasActiveFilters = filters.search || filters.role || filters.tierId || filters.status || filters.dateFrom || filters.dateTo;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              placeholder="Search by name, email, or ticket number..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        {/* Role Filter */}
        <select
          value={filters.role}
          onChange={(e) => onFilterChange({ role: e.target.value })}
          className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role.value} value={role.value}>{role.label}</option>
          ))}
        </select>

        {/* Ticket Tier Filter */}
        <select
          value={filters.tierId}
          onChange={(e) => onFilterChange({ tierId: e.target.value })}
          className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="">All Tiers</option>
          {tiers.map((tier) => (
            <option key={tier.id} value={tier.id}>{tier.name}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
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

        {/* Date Range */}
        <input
          type="date"
          value={filters.dateFrom || ''}
          onChange={(e) => onFilterChange({ dateFrom: e.target.value || undefined })}
          className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
          placeholder="From"
        />
        <input
          type="date"
          value={filters.dateTo || ''}
          onChange={(e) => onFilterChange({ dateTo: e.target.value || undefined })}
          className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
          placeholder="To"
        />

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