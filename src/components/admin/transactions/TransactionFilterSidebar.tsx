'use client';

import { X, Calendar, DollarSign, Search, Filter } from 'lucide-react';
import { TransactionFilter, PAYMENT_METHODS, TRANSACTION_TYPES, TRANSACTION_STATUS_CONFIG } from '@/types/admin/transactions';
import { useTheme } from '@/context/ThemeContext';

interface TransactionFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TransactionFilter;
  onFilterChange: (filters: Partial<TransactionFilter>) => void;
  onApply: () => void;
  onReset: () => void;
}

export const TransactionFilterSidebar = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onApply,
  onReset,
}: TransactionFilterSidebarProps) => {
  const { theme } = useTheme();
  const statuses = Object.entries(TRANSACTION_STATUS_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  const hasActiveFilters = filters.search || filters.status || filters.type || filters.paymentMethod || filters.minAmount || filters.maxAmount || filters.dateFrom || filters.dateTo || filters.isAnomaly;

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
            <Filter size={18} style={{ color: 'var(--text-primary)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Filters</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 space-y-6">
          {/* Search */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              Search
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => onFilterChange({ search: e.target.value })}
                placeholder="Transaction ID, Reference, Customer..."
                className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="">All Status</option>
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              Transaction Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => onFilterChange({ type: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="">All Types</option>
              {TRANSACTION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              Payment Method
            </label>
            <select
              value={filters.paymentMethod}
              onChange={(e) => onFilterChange({ paymentMethod: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="">All Methods</option>
              {PAYMENT_METHODS.map((method) => (
                <option key={method.value} value={method.value}>{method.label}</option>
              ))}
            </select>
          </div>

          {/* Amount Range */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              Amount Range (MWK)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minAmount || ''}
                  onChange={(e) => onFilterChange({ minAmount: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
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
                  value={filters.maxAmount || ''}
                  onChange={(e) => onFilterChange({ maxAmount: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              Date Range
            </label>
            <div className="space-y-2">
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => onFilterChange({ dateFrom: e.target.value || undefined })}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => onFilterChange({ dateTo: e.target.value || undefined })}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Anomaly Only */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isAnomaly}
                onChange={(e) => onFilterChange({ isAnomaly: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
              />
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Show anomalies only</span>
            </label>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 p-4 border-t flex gap-3" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <button
            onClick={onReset}
            className="flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
            style={{
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
          >
            Reset
          </button>
          <button
            onClick={onApply}
            className="flex-1 px-4 py-2 rounded-lg bg-[#84cc16] text-white text-sm font-medium hover:brightness-110 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};