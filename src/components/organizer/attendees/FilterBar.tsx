'use client';

import { Search, Filter, X } from 'lucide-react';
import { AttendeeFilters, ROLE_CONFIG, TICKET_TIERS, STATUS_CONFIG } from '@/types/organizer/attendees';

interface FilterBarProps {
  filters: AttendeeFilters;
  onFilterChange: (filters: Partial<AttendeeFilters>) => void;
  onReset: () => void;
}

export const FilterBar = ({ filters, onFilterChange, onReset }: FilterBarProps) => {
  const hasActiveFilters = filters.search || (filters.role && filters.role !== 'all') || (filters.status && filters.status !== 'all') || (filters.tierId && filters.tierId !== 'all');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search by name, email, or ticket number..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          />
        </div>

        {/* Role Filter */}
        <select
          value={filters.role || 'all'}
          onChange={(e) => onFilterChange({ role: e.target.value === 'all' ? undefined : e.target.value })}
          className="px-3 py-2 rounded-lg border bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
        >
          <option value="all">All Roles</option>
          {Object.entries(ROLE_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.icon} {config.label}</option>
          ))}
        </select>

        {/* Ticket Tier Filter */}
        <select
          value={filters.tierId || 'all'}
          onChange={(e) => onFilterChange({ tierId: e.target.value === 'all' ? undefined : e.target.value })}
          className="px-3 py-2 rounded-lg border bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
        >
          <option value="all">All Tiers</option>
          {TICKET_TIERS.map(tier => (
            <option key={tier.id} value={tier.id}>{tier.name}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filters.status || 'all'}
          onChange={(e) => onFilterChange({ status: e.target.value === 'all' ? undefined : e.target.value })}
          className="px-3 py-2 rounded-lg border bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
        >
          <option value="all">All Status</option>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.icon} {config.label}</option>
          ))}
        </select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
          >
            <X size={14} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};