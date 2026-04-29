'use client';

import { Database, Activity, Clock, HardDrive, GitBranch, Zap } from 'lucide-react';
import { DatabaseStatus } from '@/types/admin/health';
import { formatBytes, formatDuration } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface DatabaseStatusCardProps {
  status: DatabaseStatus;
  loading?: boolean;
}

export const DatabaseStatusCard = ({ status, loading }: DatabaseStatusCardProps) => {
  const { theme } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
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
      <div className="rounded-xl p-5 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        </div>
      </div>
    );
  }

  const metrics = [
    { label: 'Version', value: status.version, icon: Database },
    { label: 'Connections', value: `${status.connections} / ${status.maxConnections}`, icon: Activity },
    { label: 'Uptime', value: formatDuration(status.uptime), icon: Clock },
    { label: 'Queries/sec', value: status.queriesPerSecond, icon: Zap },
    { label: 'Slow Queries', value: status.slowQueries, icon: HardDrive },
  ];

  return (
    <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database size={20} className="text-[#84cc16]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Database</h3>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(status.status)}`}>
          {status.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="flex items-center gap-2">
              <Icon size={14} className="text-[var(--text-secondary)]" />
              <div>
                <p className="text-xs text-[var(--text-secondary)]">{metric.label}</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Replication Info */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2 mb-3">
          <GitBranch size={14} className="text-[#84cc16]" />
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">Replication</h4>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Role</span>
            <span className="font-medium text-[var(--text-primary)] capitalize">{status.replication.role}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Replication Lag</span>
            <span className="font-medium text-[var(--text-primary)]">{status.replication.lag}ms</span>
          </div>
          {status.replication.replicas.map((replica) => (
            <div key={replica.name} className="flex justify-between items-center text-sm">
              <span className="text-[var(--text-secondary)]">{replica.name}</span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  replica.status === 'healthy' ? 'bg-green-500' :
                  replica.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-[var(--text-primary)]">{replica.lag}ms lag</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cache Hit Ratio */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[var(--text-secondary)]">Cache Hit Ratio</span>
          <span className="text-[var(--text-primary)] font-medium">{status.cacheHitRatio}%</span>
        </div>
        <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#84cc16] rounded-full transition-all"
            style={{ width: `${status.cacheHitRatio}%` }}
          />
        </div>
      </div>
    </div>
  );
};