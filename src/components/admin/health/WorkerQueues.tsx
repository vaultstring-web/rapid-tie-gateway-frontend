'use client';

import { Activity, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { WorkerQueueStatus } from '@/types/admin/health';
import { useTheme } from '@/context/ThemeContext';

interface WorkerQueuesProps {
  queues: WorkerQueueStatus[];
  loading?: boolean;
}

export const WorkerQueues = ({ queues, loading }: WorkerQueuesProps) => {
  const { theme } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'busy':
        return 'text-blue-500';
      case 'degraded':
        return 'text-yellow-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'busy':
        return <Activity size={16} className="text-blue-500" />;
      case 'degraded':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'down':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Activity size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-3" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
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
    <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Activity size={20} className="text-[#84cc16]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Worker Queues</h3>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-500">{totalActive}</p>
          <p className="text-xs text-[var(--text-secondary)]">Active Jobs</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-500">{totalWaiting}</p>
          <p className="text-xs text-[var(--text-secondary)]">Waiting</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-500">{totalFailed}</p>
          <p className="text-xs text-[var(--text-secondary)]">Failed</p>
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-4">
        {queues.map((queue) => (
          <div key={queue.queueName} className="border-b last:border-0 pb-3 last:pb-0" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(queue.status)}
                <span className="text-sm font-semibold text-[var(--text-primary)]">{queue.queueName}</span>
              </div>
              <span className={`text-xs font-medium ${getStatusColor(queue.status)}`}>
                {queue.processingRate} jobs/sec
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div>
                <p className="font-semibold text-[var(--text-primary)]">{queue.active}</p>
                <p className="text-[var(--text-secondary)]">Active</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">{queue.waiting}</p>
                <p className="text-[var(--text-secondary)]">Waiting</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">{queue.completed}</p>
                <p className="text-[var(--text-secondary)]">Completed</p>
              </div>
              <div>
                <p className="font-semibold text-red-500">{queue.failed}</p>
                <p className="text-[var(--text-secondary)]">Failed</p>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text-secondary)]">Queue Depth</span>
                <span className="text-[var(--text-primary)]">{queue.waiting} / {queue.active + queue.waiting}</span>
              </div>
              <div className="h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#84cc16] rounded-full transition-all"
                  style={{ width: `${(queue.waiting / (queue.active + queue.waiting)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};