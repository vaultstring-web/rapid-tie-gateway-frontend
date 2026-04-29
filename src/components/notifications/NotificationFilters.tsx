'use client';

import { Bell, DollarSign, Calendar, FileText, Users, MessageCircle, AlertCircle, Settings } from 'lucide-react';
import { NotificationType, NOTIFICATION_TYPE_CONFIG } from '@/types/notifications';
import { useTheme } from '@/context/ThemeContext';

interface NotificationFiltersProps {
  selectedType: NotificationType | 'all';
  onTypeChange: (type: NotificationType | 'all') => void;
  counts: Record<NotificationType | 'all', number>;
}

const FILTERS: { id: NotificationType | 'all'; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All', icon: <Bell size={16} /> },
  { id: 'payment', label: 'Payments', icon: <DollarSign size={16} /> },
  { id: 'event', label: 'Events', icon: <Calendar size={16} /> },
  { id: 'dsa', label: 'DSA', icon: <FileText size={16} /> },
  { id: 'connection', label: 'Connections', icon: <Users size={16} /> },
  { id: 'message', label: 'Messages', icon: <MessageCircle size={16} /> },
  { id: 'system', label: 'System', icon: <Settings size={16} /> },
  { id: 'reminder', label: 'Reminders', icon: <AlertCircle size={16} /> },
];

export const NotificationFilters = ({ selectedType, onTypeChange, counts }: NotificationFiltersProps) => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const isSelected = selectedType === filter.id;
        const count = counts[filter.id];
        
        return (
          <button
            key={filter.id}
            onClick={() => onTypeChange(filter.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${isSelected 
                ? 'bg-primary-green-500 text-white shadow-md' 
                : 'border hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
            style={{
              backgroundColor: isSelected ? undefined : 'var(--bg-secondary)',
              borderColor: isSelected ? undefined : 'var(--border-color)',
              color: isSelected ? undefined : 'var(--text-primary)',
            }}
          >
            {filter.icon}
            {filter.label}
            {count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                isSelected 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};