'use client';

import { AlertCircle, CheckCircle, XCircle, AlertTriangle, Check } from 'lucide-react';
import { ErrorLog } from '@/types/admin';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';

interface RecentErrorsListProps {
  errors: ErrorLog[];
  loading?: boolean;
  onResolve?: (errorId: string) => void;
}

export const RecentErrorsList = ({ errors, loading, onResolve }: RecentErrorsListProps) => {
  const { theme } = useTheme();

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <XCircle size={16} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      default:
        return <AlertCircle size={16} className="text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (errors.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Errors</h3>
        <p className="text-sm text-[var(--text-secondary)]">All systems are operating normally</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {errors.map((error) => (
        <div
          key={error.id}
          className="rounded-xl p-4 border transition-all hover:shadow-md"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              {getLevelIcon(error.level)}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{error.message}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    error.level === 'error'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      : error.level === 'warning'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  }`}>
                    {error.level.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  {error.source} • {formatDistanceToNow(new Date(error.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
            {!error.resolved && onResolve && (
              <button
                onClick={() => onResolve(error.id)}
                className="p-1.5 rounded-lg text-green-500 hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
                title="Mark as resolved"
              >
                <Check size={14} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};