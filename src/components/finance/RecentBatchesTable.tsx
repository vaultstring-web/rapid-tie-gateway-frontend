'use client';

import { Eye, Download, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import { RecentBatch } from '@/types/finance/dashboard';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface RecentBatchesTableProps {
  batches: RecentBatch[];
  loading?: boolean;
  onViewDetails: (batchId: string) => void;
  onDownloadReport: (batchId: string) => void;
}

export function RecentBatchesTable({ batches, loading, onViewDetails, onDownloadReport }: RecentBatchesTableProps) {
  const { theme } = useTheme();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'processing':
        return <RefreshCw size={14} className="text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock size={14} className="text-yellow-500" />;
      case 'failed':
        return <XCircle size={14} className="text-red-500" />;
      default:
        return <Clock size={14} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'processing':
        return 'text-blue-600 dark:text-blue-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-xl p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-[var(--text-secondary)]">No batches found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Batch #</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Department</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Amount</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Recipients</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Created</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
          {batches.map((batch) => (
            <tr key={batch.id} className="hover:bg-[var(--hover-bg)] transition-colors">
              <td className="px-4 py-3">
                <span className="text-sm font-mono font-medium text-[var(--text-primary)]">{batch.batchNumber}</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-[var(--text-primary)]">{batch.department}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-sm font-semibold text-[#84cc16]">{formatCurrency(batch.totalAmount)}</span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-sm text-[var(--text-primary)]">{batch.recipientCount.toLocaleString()}</span>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  {getStatusIcon(batch.status)}
                  <span className={`text-xs font-medium capitalize ${getStatusColor(batch.status)}`}>
                    {batch.status}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-[var(--text-secondary)]">{formatDateTime(batch.createdAt)}</span>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onViewDetails(batch.id)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="View Details"
                  >
                    <Eye size={16} className="text-[var(--text-secondary)]" />
                  </button>
                  {batch.status === 'completed' && (
                    <button
                      onClick={() => onDownloadReport(batch.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Download Report"
                    >
                      <Download size={16} className="text-[var(--text-secondary)]" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}