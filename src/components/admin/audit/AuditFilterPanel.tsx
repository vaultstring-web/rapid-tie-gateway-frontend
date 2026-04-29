'use client';

import { useState } from 'react';
import { X, Search, Calendar, Filter, ChevronDown } from 'lucide-react';
import { AuditFilter, EVENT_ACTIONS, ACTION_CATEGORIES } from '@/types/admin/audit';
import { useTheme } from '@/context/ThemeContext';

interface AuditFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AuditFilter;
  onFilterChange: (filters: Partial<AuditFilter>) => void;
  onApply: () => void;
  onReset: () => void;
}

export const AuditFilterPanel = ({ isOpen, onClose, filters, onFilterChange, onApply, onReset }: AuditFilterPanelProps) => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filteredActions = selectedCategory
    ? EVENT_ACTIONS.filter(a => a.category === selectedCategory)
    : EVENT_ACTIONS;

  const hasActiveFilters = filters.search || filters.action || filters.entity || filters.userId || filters.status || filters.dateFrom || filters.dateTo;

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
                placeholder="Search by user, entity, action..."
                className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          {/* Event Actions Filter Preset */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              Event Actions
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {ACTION_CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(selectedCategory === category.value ? '' : category.value)}
                  className={`px-2 py-1 rounded-lg text-xs transition-all ${
                    selectedCategory === category.value
                      ? 'bg-[#84cc16] text-white'
                      : 'border hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  style={{ borderColor: 'var(--border-color)', color: selectedCategory === category.value ? undefined : 'var(--text-primary)' }}
                >
                  {category.icon} {category.label}
                </button>
              ))}
            </div>
            <select
              value={filters.action}
              onChange={(e) => onFilterChange({ action: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="">All Actions</option>
              {filteredActions.map((action) => (
                <option key={action.value} value={action.value}>
                  {action.icon} {action.label}
                </option>
              ))}
            </select>
          </div>

          {/* Entity */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              Entity Type
            </label>
            <input
              type="text"
              value={filters.entity}
              onChange={(e) => onFilterChange({ entity: e.target.value })}
              placeholder="e.g., user, merchant, event"
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* User ID */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              User ID / Email
            </label>
            <input
              type="text"
              value={filters.userId}
              onChange={(e) => onFilterChange({ userId: e.target.value })}
              placeholder="User email or ID"
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
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
              <option value="success">Success</option>
              <option value="failure">Failure</option>
              <option value="warning">Warning</option>
            </select>
          </div>

          {/* Advanced Search Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 text-sm text-[#84cc16] hover:underline"
          >
            <ChevronDown size={14} className={showAdvanced ? 'rotate-180' : ''} />
            Advanced Search
          </button>

          {/* Advanced Search Panel */}
          {showAdvanced && (
            <div className="space-y-4 pl-4 border-l-2 border-[#84cc16]">
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                  Date From
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="datetime-local"
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
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                  Date To
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="datetime-local"
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
          )}
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