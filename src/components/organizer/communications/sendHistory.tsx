'use client';

import { SendHistory as SendHistoryType } from '@/types/events/bulkMessaging';
import { Mail, Users, Eye, MousePointer, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';

interface SendHistoryProps {
  history: SendHistoryType[];
  loading?: boolean;
  onViewStats?: (messageId: string) => void;
}

export const SendHistory = ({ history, loading, onViewStats }: SendHistoryProps) => {
  const { theme } = useTheme();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'partial':
        return <AlertCircle size={14} className="text-yellow-500" />;
      default:
        return <XCircle size={14} className="text-red-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <Mail size={32} className="mx-auto mb-3 opacity-50" style={{ color: 'var(--text-secondary)' }} />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          No messages sent yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <div
          key={item.id}
          className="rounded-xl p-4 border cursor-pointer hover:shadow-md transition-all"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
          onClick={() => onViewStats?.(item.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon(item.status)}
                <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {item.subject}
                </h3>
              </div>
              <div className="flex flex-wrap gap-4 text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {item.recipientCount.toLocaleString()} recipients
                </span>
                <span className="flex items-center gap-1">
                  <Mail size={12} />
                  {item.deliveredCount.toLocaleString()} delivered
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {item.openedCount.toLocaleString()} opened ({Math.round((item.openedCount / item.deliveredCount) * 100)}%)
                </span>
                <span className="flex items-center gap-1">
                  <MousePointer size={12} />
                  {item.clickedCount.toLocaleString()} clicks
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {formatDistanceToNow(new Date(item.sentAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper component for XCircle
const XCircle = ({ size, className }: { size: number; className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);