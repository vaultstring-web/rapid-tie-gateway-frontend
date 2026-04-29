'use client';

import { Search, Filter, X, Calendar, DollarSign } from 'lucide-react';
import { PaymentFilter, PAYMENT_TYPES, PAYMENT_METHODS, PAYMENT_STATUS_CONFIG } from '@/types/employee/payments';
import { useTheme } from '@/context/ThemeContext';

interface PaymentFilterBarProps {
  filters: PaymentFilter;
  onFilterChange: (filters: Partial<PaymentFilter>) => void;
  onReset: () => void;
  onExport: () => void;
}

export const PaymentFilterBar = ({ filters, onFilterChange, onReset, onExport }: PaymentFilterBarProps) => {
  const { theme } = useTheme();

  const statuses = Object.entries(PAYMENT_STATUS_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  const hasActiveFilters = filters.search || filters.type || filters.status || filters.paymentMethod || filters.dateFrom || filters.dateTo || filters.minAmount || filters.maxAmount;

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
              placeholder="Search by reference, DSA number..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        {/* Type Filter */}
        <select
          value={filters.type}
          onChange={(e) => onFilterChange({ type: e.target.value })}
          className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] min-w-[140px]"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="">All Types</option>
          {PAYMENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
          ))}
        </select>

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
          <option value="">All Status</option>
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>

        {/* Payment Method Filter */}
        <select
          value={filters.paymentMethod}
          onChange={(e) => onFilterChange({ paymentMethod: e.target.value })}
          className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] min-w-[150px]"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="">All Methods</option>
          {PAYMENT_METHODS.map((method) => (
            <option key={method.value} value={method.value}>{method.icon} {method.label}</option>
          ))}
        </select>

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

        {/* Export Button */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-colors"
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Advanced Filters - Collapsible */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-4 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => onFilterChange({ dateFrom: e.target.value || undefined })}
              className="pl-9 pr-3 py-1.5 rounded-lg border text-sm"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              placeholder="From"
            />
          </div>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => onFilterChange({ dateTo: e.target.value || undefined })}
              className="pl-9 pr-3 py-1.5 rounded-lg border text-sm"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              placeholder="To"
            />
          </div>
          <div className="relative">
            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="number"
              placeholder="Min Amount"
              value={filters.minAmount || ''}
              onChange={(e) => onFilterChange({ minAmount: e.target.value ? Number(e.target.value) : undefined })}
              className="pl-9 pr-3 py-1.5 rounded-lg border text-sm w-32"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <div className="relative">
            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="number"
              placeholder="Max Amount"
              value={filters.maxAmount || ''}
              onChange={(e) => onFilterChange({ maxAmount: e.target.value ? Number(e.target.value) : undefined })}
              className="pl-9 pr-3 py-1.5 rounded-lg border text-sm w-32"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component
const Download = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);