'use client';

import { CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { ReconciliationStatus } from '@/types/finance/dashboard';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface ReconciliationStatusCardProps {
  status: ReconciliationStatus[];
  loading?: boolean;
  onRefresh?: () => void;
}

export const ReconciliationStatusCard = ({ status, loading, onRefresh }: ReconciliationStatusCardProps) => {
  const { theme } = useTheme();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'in_progress':
        return <RefreshCw size={16} className="text-blue-500" />;
      default:
        return <AlertTriangle size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'in_progress':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {status.map((item) => (
        <div
          key={item.id}
          className="rounded-xl p-4 border transition-all hover:shadow-md"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[var(--text-primary)]">{item.period}</h3>
                <div className="flex items-center gap-1">
                  {getStatusIcon(item.status)}
                  <span className={`text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Last updated: {new Date(item.lastUpdated).toLocaleString()}
              </p>
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Refresh"
              >
                <RefreshCw size={14} className="text-[var(--text-secondary)]" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <p className="text-xs text-[var(--text-secondary)]">Matched</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {item.matchedCount.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {formatCurrency(item.amountMatched)}
              </p>
            </div>
            <div className="text-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
              <p className="text-xs text-[var(--text-secondary)]">Unmatched</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                {item.unmatchedCount.toLocaleString()}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                {formatCurrency(item.amountUnmatched)}
              </p>
            </div>
          </div>

          <div className="w-full bg-[var(--border-color)] rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full"
              style={{ width: `${(item.matchedCount / item.totalTransactions) * 100}%` }}
            />
          </div>
          <p className="text-xs text-[var(--text-secondary)] text-center mt-2">
            {((item.matchedCount / item.totalTransactions) * 100).toFixed(1)}% matched
          </p>
        </div>
      ))}
    </div>
  );
};