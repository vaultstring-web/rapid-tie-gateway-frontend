'use client';

import { useState } from 'react';
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { FilterOptions, DEPARTMENTS, DESTINATIONS } from '@/types/approver/pending';
import { useTheme } from '@/context/ThemeContext';

interface ApprovalFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onApply: () => void;
  onReset: () => void;
}

export const ApprovalFilterSidebar = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onApply,
  onReset,
}: ApprovalFilterSidebarProps) => {
  const { theme } = useTheme();
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [showAmountRange, setShowAmountRange] = useState(true);

  const handleChange = (key: keyof FilterOptions, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onApply();
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      department: '',
      destination: '',
      urgency: '',
      dateRange: '',
      minAmount: 0,
      maxAmount: 0,
      hasEvent: false,
    };
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
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
        <div
          className="sticky top-0 p-4 border-b flex justify-between items-center"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} style={{ color: 'var(--text-primary)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Filters
            </h3>
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
          {/* Department Filter */}
          <div>
            <label
              className="text-sm font-medium mb-2 block"
              style={{ color: 'var(--text-primary)' }}
            >
              Department
            </label>
            <select
              value={localFilters.department}
              onChange={(e) => handleChange('department', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Filter */}
          <div>
            <label
              className="text-sm font-medium mb-2 block"
              style={{ color: 'var(--text-primary)' }}
            >
              Destination
            </label>
            <select
              value={localFilters.destination}
              onChange={(e) => handleChange('destination', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="">All Destinations</option>
              {DESTINATIONS.map((dest) => (
                <option key={dest} value={dest}>
                  {dest}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <label
              className="text-sm font-medium mb-2 block"
              style={{ color: 'var(--text-primary)' }}
            >
              Urgency Level
            </label>
            <div className="flex gap-2">
              {['high', 'medium', 'low'].map((urgency) => (
                <button
                  key={urgency}
                  onClick={() =>
                    handleChange('urgency', localFilters.urgency === urgency ? '' : urgency)
                  }
                  className={`flex-1 px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                    localFilters.urgency === urgency
                      ? urgency === 'high'
                        ? 'bg-red-500 text-white'
                        : urgency === 'medium'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-green-500 text-white'
                      : 'border hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  {urgency}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label
              className="text-sm font-medium mb-2 block"
              style={{ color: 'var(--text-primary)' }}
            >
              Date Range
            </label>
            <select
              value={localFilters.dateRange}
              onChange={(e) => handleChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="overdue">Overdue Only</option>
            </select>
          </div>

          {/* Amount Range */}
          <div>
            <button
              onClick={() => setShowAmountRange(!showAmountRange)}
              className="flex items-center justify-between w-full text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              <span>Amount Range (MWK)</span>
              {showAmountRange ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {showAmountRange && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--text-secondary)]">Min</label>
                  <input
                    type="number"
                    value={localFilters.minAmount || ''}
                    onChange={(e) => handleChange('minAmount', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-secondary)]">Max</label>
                  <input
                    type="number"
                    value={localFilters.maxAmount || ''}
                    onChange={(e) => handleChange('maxAmount', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="Any"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Event Attendance Filter */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.hasEvent}
                onChange={(e) => handleChange('hasEvent', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
              />
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                Show only requests with event attendance
              </span>
            </label>
          </div>

          {/* Active Filters Summary */}
          {(localFilters.department ||
            localFilters.destination ||
            localFilters.urgency ||
            localFilters.dateRange ||
            localFilters.minAmount > 0 ||
            localFilters.maxAmount > 0 ||
            localFilters.hasEvent) && (
            <div className="pt-2">
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Active Filters:
              </p>
              <div className="flex flex-wrap gap-1">
                {localFilters.department && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary-green-500/20 text-primary-green-500">
                    Dept: {localFilters.department}
                  </span>
                )}
                {localFilters.destination && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary-green-500/20 text-primary-green-500">
                    Dest: {localFilters.destination}
                  </span>
                )}
                {localFilters.urgency && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary-green-500/20 text-primary-green-500">
                    Urgency: {localFilters.urgency}
                  </span>
                )}
                {(localFilters.minAmount > 0 || localFilters.maxAmount > 0) && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary-green-500/20 text-primary-green-500">
                    Amount: {localFilters.minAmount || 0} - {localFilters.maxAmount || '∞'}
                  </span>
                )}
                {localFilters.hasEvent && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary-green-500/20 text-primary-green-500">
                    Has Event
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div
          className="sticky bottom-0 p-4 border-t flex gap-3"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}
        >
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 rounded-lg bg-[#84cc16] text-white text-sm font-medium hover:brightness-110 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};