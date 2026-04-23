'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { EVENT_CATEGORY_COLORS, EVENT_ROLE_COLORS } from '@/types/events/eventCalendar';
import { useTheme } from '@/context/ThemeContext';

interface CalendarFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoles: string[];
  selectedCategories: string[];
  onRoleToggle: (role: string) => void;
  onCategoryToggle: (category: string) => void;
  onApply: () => void;
  onReset: () => void;
}

const ROLES = [
  { value: 'public', label: 'Public Events', color: EVENT_ROLE_COLORS.public },
  { value: 'merchant', label: 'Merchant Events', color: EVENT_ROLE_COLORS.merchant },
  { value: 'dsa-relevant', label: 'DSA-Relevant', color: EVENT_ROLE_COLORS['dsa-relevant'] },
];

const CATEGORIES = [
  { value: 'concert', label: 'Concert', color: EVENT_CATEGORY_COLORS.concert },
  { value: 'conference', label: 'Conference', color: EVENT_CATEGORY_COLORS.conference },
  { value: 'workshop', label: 'Workshop', color: EVENT_CATEGORY_COLORS.workshop },
  { value: 'sports', label: 'Sports', color: EVENT_CATEGORY_COLORS.sports },
  { value: 'festival', label: 'Festival', color: EVENT_CATEGORY_COLORS.festival },
  { value: 'corporate', label: 'Corporate', color: EVENT_CATEGORY_COLORS.corporate },
  { value: 'education', label: 'Education', color: EVENT_CATEGORY_COLORS.education },
];

export const CalendarFilterPanel = ({
  isOpen,
  onClose,
  selectedRoles,
  selectedCategories,
  onRoleToggle,
  onCategoryToggle,
  onApply,
  onReset,
}: CalendarFilterPanelProps) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      
      <div
        className="fixed right-0 top-0 h-full w-80 z-50 shadow-xl transition-transform duration-300 overflow-y-auto"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="sticky top-0 p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Filter Events</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Role Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              Event Type
            </label>
            <div className="space-y-2">
              {ROLES.map((role) => (
                <button
                  key={role.value}
                  onClick={() => onRoleToggle(role.value)}
                  className="w-full flex items-center justify-between p-2 rounded-lg border transition-colors"
                  style={{
                    borderColor: selectedRoles.includes(role.value) ? role.color : 'var(--border-color)',
                    backgroundColor: selectedRoles.includes(role.value) ? `${role.color}10` : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{role.label}</span>
                  </div>
                  {selectedRoles.includes(role.value) && <Check size={16} style={{ color: role.color }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => onCategoryToggle(cat.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategories.includes(cat.value)
                      ? 'text-white'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: selectedCategories.includes(cat.value) ? cat.color : `${cat.color}20`,
                    color: selectedCategories.includes(cat.value) ? 'white' : cat.color,
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 p-4 border-t flex gap-3" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <button
            onClick={onReset}
            className="flex-1 px-4 py-2 rounded-lg border text-sm font-medium"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          >
            Reset
          </button>
          <button
            onClick={onApply}
            className="flex-1 px-4 py-2 rounded-lg bg-primary-green-500 text-white text-sm font-medium hover:bg-primary-green-600"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};