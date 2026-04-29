'use client';

import { Activity, Pause, Play, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { JobQueue } from '@/types/admin/jobs';
import { useTheme } from '@/context/ThemeContext';

interface QueuesListProps {
  queues: JobQueue[];
  loading?: boolean;
  onPause?: (queueName: string) => void;
  onResume?: (queueName: string) => void;
}

export const QueuesList = ({ queues, loading, onPause, onResume }: QueuesListProps) => {
  const { theme } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'busy':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
      case 'degraded':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
      case 'down':
        return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex gap-4">
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const totalActive = queues.reduce((sum, q) => sum + q.active, 0);
  const totalWaiting = queues.reduce((sum, q) => sum + q.waiting, 0);
  const totalFailed = queues.reduce((sum, q) => sum + q.failed, 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl p-4 border text-center" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <Activity size={20} className="mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold text-[var(--text-primary)]">{totalActive}</p>
          <p className="text-xs text-[var(--text-secondary)]">Active Jobs</p>
        </div>
        <div className="rounded-xl p-4 border text-center" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <Clock size={20} className="mx-auto mb-2 text-yellow-500" />
          <p className="text-2xl font-bold text-[var(--text-primary)]">{totalWaiting}</p>
          <p className="text-xs text-[var(--text-secondary)]">Waiting</p>
        </div>
        <div className="rounded-xl p-4 border text-center" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <AlertCircle size={20} className="mx-auto mb-2 text-red-500" />
          <p className="text-2xl font-bold text-[var(--text-primary)]">{totalFailed}</p>
          <p className="text-xs text-[var(--text-secondary)]">Failed</p>
        </div>
      </div>

      {/* Queues List */}
      <div className="space-y-3">
        {queues.map((queue) => (
          <div
            key={queue.name}
            className="rounded-xl p-4 border transition-all hover:shadow-md"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${queue.status === 'healthy' ? 'bg-green-500' : queue.status === 'busy' ? 'bg-blue-500' : queue.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <h3 className="text-lg font-semibold text-[var(--text-primary)] capitalize">{queue.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(queue.status)}`}>
                  {queue.status}
                </span>
                {queue.paused && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600">
                    Paused
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {!queue.paused ? (
                  <button
                    onClick={() => onPause?.(queue.name)}
                    className="p-1.5 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors"
                    title="Pause Queue"
                  >
                    <Pause size={16} className="text-yellow-500" />
                  </button>
                ) : (
                  <button
                    onClick={() => onResume?.(queue.name)}
                    className="p-1.5 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
                    title="Resume Queue"
                  >
                    <Play size={16} className="text-green-500" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-500">{queue.active}</p>
                <p className="text-xs text-[var(--text-secondary)]">Active</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-500">{queue.waiting}</p>
                <p className="text-xs text-[var(--text-secondary)]">Waiting</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">{queue.completed.toLocaleString()}</p>
                <p className="text-xs text-[var(--text-secondary)]">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">{queue.failed}</p>
                <p className="text-xs text-[var(--text-secondary)]">Failed</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Processing Rate</span>
                <span className="text-[var(--text-primary)] font-medium">{queue.processingRate} jobs/sec</span>
              </div>
              {queue.delayed > 0 && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-[var(--text-secondary)]">Delayed Jobs</span>
                  <span className="text-[var(--text-primary)] font-medium">{queue.delayed}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};