'use client';

import { useState } from 'react';
import { Eye, RefreshCw, Trash2, RotateCcw, AlertCircle } from 'lucide-react';
import { FailedJob } from '@/types/admin/jobs';
import { formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface FailedJobsTableProps {
  jobs: FailedJob[];
  loading?: boolean;
  onRetry?: (jobId: string) => void;
  onRetryAll?: () => void;
  onDelete?: (jobId: string) => void;
  onDeleteAll?: () => void;
  onViewDetails?: (job: FailedJob) => void;
}

export const FailedJobsTable = ({
  jobs,
  loading,
  onRetry,
  onRetryAll,
  onDelete,
  onDeleteAll,
  onViewDetails,
}: FailedJobsTableProps) => {
  const { theme } = useTheme();
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex gap-4">
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Failed Jobs</h3>
        <p className="text-sm text-[var(--text-secondary)]">All jobs are processing normally</p>
      </div>
    );
  }

  return (
    <div>
      {/* Batch Actions */}
      {jobs.length > 0 && (
        <div className="flex gap-2 mb-4 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={onRetryAll}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500 text-white text-sm hover:bg-green-600 transition-colors"
          >
            <RotateCcw size={14} />
            Retry All
          </button>
          <button
            onClick={onDeleteAll}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition-colors"
          >
            <Trash2 size={14} />
            Delete All
          </button>
        </div>
      )}

      {/* Jobs Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Job Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Queue</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Failed At</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Reason</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Attempts</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-[var(--hover-bg)] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={14} className="text-red-500" />
                    <span className="text-sm font-mono text-[var(--text-primary)]">{job.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {job.queue}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-[var(--text-primary)]">{formatDateTime(job.failedAt)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-[var(--text-secondary)] line-clamp-1">{job.failedReason}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-sm font-medium ${job.attempts >= job.maxAttempts ? 'text-red-500' : 'text-[var(--text-primary)]'}`}>
                    {job.attempts} / {job.maxAttempts}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onViewDetails?.(job)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} className="text-[var(--text-secondary)]" />
                    </button>
                    {job.retryAvailable && (
                      <button
                        onClick={() => onRetry?.(job.id)}
                        className="p-1.5 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
                        title="Retry"
                      >
                        <RotateCcw size={16} className="text-green-500" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete?.(job.id)}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper component
const CheckCircle = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);