'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { JobHistory } from '@/types/admin/jobs';
import { formatDateTime, formatDuration } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface JobHistoryTimelineProps {
  jobs: JobHistory[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const JobHistoryTimeline = ({ jobs, loading, onLoadMore, hasMore }: JobHistoryTimelineProps) => {
  const { theme } = useTheme();
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      case 'retried':
        return <RotateCcw size={16} className="text-blue-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex gap-3">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
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
        <Clock size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Job History</h3>
        <p className="text-sm text-[var(--text-secondary)]">Jobs will appear here as they run</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--border-color)]" />
        
        {jobs.map((job) => (
          <div key={job.id} className="relative pl-10">
            {/* Timeline dot */}
            <div className="absolute left-2 top-1 w-5 h-5 rounded-full bg-[var(--bg-secondary)] border-2 flex items-center justify-center"
              style={{ borderColor: job.status === 'completed' ? '#10b981' : job.status === 'failed' ? '#ef4444' : '#3b82f6' }}>
              <div className="w-2 h-2 rounded-full"
                style={{ backgroundColor: job.status === 'completed' ? '#10b981' : job.status === 'failed' ? '#ef4444' : '#3b82f6' }} />
            </div>

            {/* Job card */}
            <div
              className="rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
              onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  {getStatusIcon(job.status)}
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{job.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{formatDateTime(job.startedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--text-secondary)]">Duration: {formatDuration(job.duration)}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    job.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                    job.status === 'failed' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  }`}>
                    {job.status}
                  </span>
                  {expandedJob === job.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* Expanded details */}
              {expandedJob === job.id && (
                <div className="mt-4 pt-4 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-[var(--text-secondary)]">Queue:</span>
                      <span className="ml-2 text-[var(--text-primary)] capitalize">{job.queue}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)]">Attempts:</span>
                      <span className="ml-2 text-[var(--text-primary)]">{job.attempts}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)]">Started:</span>
                      <span className="ml-2 text-[var(--text-primary)]">{formatDateTime(job.startedAt)}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)]">Completed:</span>
                      <span className="ml-2 text-[var(--text-primary)]">{formatDateTime(job.completedAt)}</span>
                    </div>
                  </div>
                  {job.status === 'failed' && (
                    <div className="mt-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <p className="text-xs text-red-700 dark:text-red-300">Job failed unexpectedly</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};