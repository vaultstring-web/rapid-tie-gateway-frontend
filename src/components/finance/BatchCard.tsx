'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  Eye,
  Download,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { Batch, BATCH_STATUS_CONFIG } from '@/types/finance/batches';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface BatchCardProps {
  batch: Batch;
  onViewDetails: (batchId: string) => void;
  onRetryFailed: (batchId: string) => void;
  onDownloadReport: (batchId: string) => void;
}

export const BatchCard = ({ batch, onViewDetails, onRetryFailed, onDownloadReport }: BatchCardProps) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const statusConfig = BATCH_STATUS_CONFIG[batch.status];

  const getProgressColor = () => {
    if (batch.progress >= 80) return 'bg-green-500';
    if (batch.progress >= 50) return 'bg-yellow-500';
    if (batch.progress >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div
      className="rounded-xl border transition-all hover:shadow-md"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                {batch.batchNumber}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                {statusConfig.icon} {statusConfig.label}
              </span>
              {batch.status === 'partial' && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                  ⚠️ Partial Success
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
              {batch.department} • Created {formatDateTime(batch.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-[#84cc16]">{formatCurrency(batch.totalAmount)}</p>
            <p className="text-xs text-[var(--text-secondary)]">{batch.totalRecipients} recipients</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--text-secondary)]">Progress</span>
            <span className="font-medium text-[var(--text-primary)]">{batch.progress}%</span>
          </div>
          <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${batch.progress}%` }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle size={14} className="text-green-500" />
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {batch.successfulCount}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">Successful</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center justify-center gap-1">
              <XCircle size={14} className="text-red-500" />
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                {batch.failedCount}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">Failed</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center justify-center gap-1">
              <Clock size={14} className="text-blue-500" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {batch.pendingCount}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">Pending</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onViewDetails(batch.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <Eye size={14} />
            View Details
          </button>
          {(batch.status === 'failed' || batch.status === 'partial') && (
            <button
              onClick={() => onRetryFailed(batch.id)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
            >
              <RefreshCw size={14} />
              Retry Failed
            </button>
          )}
          {batch.status === 'completed' && (
            <button
              onClick={() => onDownloadReport(batch.id)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <Download size={14} />
              Report
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Expanded Details - Failed Items */}
        {expanded && batch.items.filter(i => i.status === 'failed').length > 0 && (
          <div className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">Failed Transactions</p>
            <div className="space-y-2">
              {batch.items.filter(i => i.status === 'failed').map((item) => (
                <div key={item.id} className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{item.recipientName}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{item.recipientPhone}</p>
                    </div>
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                      {formatCurrency(item.amount)}
                    </p>
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {item.errorMessage || 'Payment failed'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};