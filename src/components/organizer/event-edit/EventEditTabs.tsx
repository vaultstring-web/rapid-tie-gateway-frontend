'use client';

import { FileText, Users, Eye, Settings, History } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export type EditTab = 'basic' | 'tickets' | 'audience' | 'preview' | 'versions';

interface EventEditTabsProps {
  activeTab: EditTab;
  onTabChange: (tab: EditTab) => void;
  eventStatus: string;
  hasUnsavedChanges: boolean;
}

const tabs: { id: EditTab; label: string; icon: React.ReactNode }[] = [
  { id: 'basic', label: 'Basic Info', icon: <FileText size={16} /> },
  { id: 'tickets', label: 'Tickets', icon: <FileText size={16} /> },
  { id: 'audience', label: 'Audience Insights', icon: <Users size={16} /> },
  { id: 'preview', label: 'Preview', icon: <Eye size={16} /> },
  { id: 'versions', label: 'Versions', icon: <History size={16} /> },
];

export const EventEditTabs = ({ activeTab, onTabChange, eventStatus, hasUnsavedChanges }: EventEditTabsProps) => {
  const { theme } = useTheme();

  return (
    <div className="border-b mb-6" style={{ borderColor: 'var(--border-color)' }}>
      <div className="flex flex-wrap gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all relative
                ${isActive 
                  ? 'text-primary-green-500' 
                  : 'hover:text-primary-green-500'
                }
              `}
              style={{ color: isActive ? undefined : 'var(--text-secondary)' }}
            >
              {tab.icon}
              {tab.label}
              {hasUnsavedChanges && tab.id === 'basic' && (
                <span className="w-2 h-2 rounded-full bg-orange-500 absolute -top-0.5 -right-0.5" />
              )}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-green-500" />
              )}
            </button>
          );
        })}
      </div>
      {eventStatus === 'published' && (
        <div className="px-4 py-2 text-xs rounded-t-lg inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
          🔒 This event is live. Changes will be saved as draft until you republish.
        </div>
      )}
    </div>
  );
};