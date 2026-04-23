'use client';

import { Workflow, CheckCircle, AlertTriangle, XCircle, Zap } from 'lucide-react';
import { WorkerQueue, STATUS_COLORS } from '@/types/admin/health';
import { useTheme } from '@/context/ThemeContext';

interface WorkerQueuesProps {
  queues: WorkerQueue[];
  loading?: boolean;
}

export const WorkerQueues = ({ queues, loading }: WorkerQueuesProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="rounded-xl p-5 border animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const getQueueStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'busy':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      default:
        return <XCircle size={16} className="text-red-500" />;
    }
  };

  const totalActive = queues.reduce((sum, q) => sum + q.active, 0);
  const totalWaiting = queues.reduce((sum, q) => sum + q.waiting, 0);
  const totalFailed = queues.reduce((sum, q) => sum + q.failed, 0);

  return (
    <div
      className="rounded-xl p-5 border"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Workflow size={20} className="text-[#84cc16]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Worker Queues</h3>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Active: {totalActive}
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            Waiting: {totalWaiting}
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            Failed: {totalFailed}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {queues.map((queue) => (
          <div
            key={queue.name}
            className="rounded-lg p-3 border"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getQueueStatusIcon(queue.status)}
                <span className="font-medium text-[var(--text-primary)]">{queue.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <Zap size={12} />
                {queue.processingRate}/s
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Active</p>
                <p className="text-sm font-semibold text-blue-500">{queue.active}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Waiting</p>
                <p className="text-sm font-semibold text-yellow-500">{queue.waiting}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Completed</p>
                <p className="text-sm font-semibold text-green-500">{queue.completed.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Failed</p>
                <p className="text-sm font-semibold text-red-500">{queue.failed}</p>
              </div>
            </div>

            {/* Queue Progress Bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text-secondary)]">Queue Depth</span>
                <span className="text-[var(--text-primary)]">{queue.waiting} jobs</span>
              </div>
              <div className="h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${Math.min((queue.waiting / (queue.active + queue.waiting)) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {queues.length === 0 && (
        <div className="text-center py-8">
          <Workflow size={32} className="mx-auto mb-2 opacity-50 text-[var(--text-secondary)]" />
          <p className="text-sm text-[var(--text-secondary)]">No worker queues configured</p>
        </div>
      )}
    </div>
  );
};