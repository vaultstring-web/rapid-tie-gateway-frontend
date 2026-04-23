'use client';

import { Database, Server, Clock, Users, GitBranch, CheckCircle, XCircle } from 'lucide-react';
import { DatabaseStatus as DatabaseStatusType, STATUS_COLORS } from '@/types/admin/health';
import { formatUptime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface DatabaseStatusProps {
  data: DatabaseStatusType;
  loading?: boolean;
}

export const DatabaseStatus = ({ data, loading }: DatabaseStatusProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="rounded-xl p-5 border animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  const statusColor = STATUS_COLORS[data.status];
  const isPrimary = data.replication.role === 'primary';

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
          <Database size={20} className="text-[#84cc16]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Database Status</h3>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
          {data.status.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-[var(--text-secondary)]">Version</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{data.version}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-secondary)]">Uptime</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{formatUptime(data.uptime)}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-secondary)]">Connections</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{data.connections} / {data.maxConnections}</p>
          <div className="w-full h-1 bg-[var(--border-color)] rounded-full mt-1">
            <div className="h-full bg-[#84cc16] rounded-full" style={{ width: `${(data.connections / data.maxConnections) * 100}%` }} />
          </div>
        </div>
        <div>
          <p className="text-xs text-[var(--text-secondary)]">Latency</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{data.latency}ms</p>
        </div>
      </div>

      {/* Replication Info */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2 mb-3">
          <GitBranch size={16} className="text-[#84cc16]" />
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">Replication</h4>
          <span className="text-xs text-[var(--text-secondary)]">Role: {isPrimary ? 'Primary' : 'Replica'}</span>
        </div>
        
        {data.replication.enabled ? (
          <div className="space-y-2">
            {data.replication.replicas.map((replica) => (
              <div key={replica.name} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'var(--hover-bg)' }}>
                <div className="flex items-center gap-2">
                  <Server size={14} className="text-[var(--text-secondary)]" />
                  <span className="text-sm text-[var(--text-primary)]">{replica.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {replica.status === 'synced' ? (
                    <CheckCircle size={14} className="text-green-500" />
                  ) : replica.status === 'syncing' ? (
                    <div className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <XCircle size={14} className="text-red-500" />
                  )}
                  <span className={`text-xs ${replica.status === 'synced' ? 'text-green-500' : replica.status === 'syncing' ? 'text-yellow-500' : 'text-red-500'}`}>
                    {replica.status}
                  </span>
                  {replica.lag > 0 && (
                    <span className="text-xs text-[var(--text-secondary)]">{replica.lag}s lag</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--text-secondary)]">Replication not configured</p>
        )}
      </div>
    </div>
  );
};