'use client';

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Download, Filter } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface CalendarToolbarProps {
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
  onView: (view: string) => void;
  onExport: () => void;
  onFilterClick: () => void;
  label: string;
  view: string;
}

export const CalendarToolbar = ({
  onNavigate,
  onView,
  onExport,
  onFilterClick,
  label,
  view,
}: CalendarToolbarProps) => {
  const { theme } = useTheme();

  const views = ['month', 'week', 'day', 'agenda'];

  return (
    <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate('PREV')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => onNavigate('TODAY')}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        >
          Today
        </button>
        <button
          onClick={() => onNavigate('NEXT')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ChevronRight size={20} />
        </button>
        <div className="ml-4">
          <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* View Selector */}
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
          {views.map((v) => (
            <button
              key={v}
              onClick={() => onView(v)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors capitalize ${
                view === v
                  ? 'bg-primary-green-500 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{
                backgroundColor: view === v ? undefined : 'var(--bg-secondary)',
                color: view === v ? undefined : 'var(--text-primary)',
              }}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border"
          style={{
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
          title="Export Calendar"
        >
          <Download size={18} />
        </button>

        {/* Filter Button */}
        <button
          onClick={onFilterClick}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border"
          style={{
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
          title="Filter Events"
        >
          <Filter size={18} />
        </button>
      </div>
    </div>
  );
};