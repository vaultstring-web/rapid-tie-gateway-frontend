'use client';

import { Search, Filter, X, Calendar } from 'lucide-react';
import { MerchantFilter, MERCHANT_STATUS_CONFIG } from '@/types/admin/merchants';
import { useTheme } from '@/context/ThemeContext';

interface MerchantFilterBarProps {
  filters: MerchantFilter;
  onFilterChange: (filters: Partial<MerchantFilter>) => void;
  onReset: () => void;
}

export const MerchantFilterBar = ({ filters, onFilterChange, onReset }: MerchantFilterBarProps) => {
  const { theme } = useTheme();

  const statuses = [
    { value: '', label: 'All Status' },
    ...Object.entries(MERCHANT_STATUS_CONFIG).map(([value, config]) => ({
      value,
      label: config.label,
    })),
  ];

  const hasActiveFilters = filters.search || filters.status || filters.dateFrom || filters.dateTo || filters.minRevenue || filters.maxRevenue;

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
              placeholder="Search by business name, email, or contact..."
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

        {/* Min Revenue */}
        <input
          type="number"
          value={filters.minRevenue || ''}
          onChange={(e) => onFilterChange({ minRevenue: e.target.value ? Number(e.target.value) : undefined })}
          placeholder="Min Revenue"
          className="w-32 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        />

        {/* Max Revenue */}
        <input
          type="number"
          value={filters.maxRevenue || ''}
          onChange={(e) => onFilterChange({ maxRevenue: e.target.value ? Number(e.target.value) : undefined })}
          placeholder="Max Revenue"
          className="w-32 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
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