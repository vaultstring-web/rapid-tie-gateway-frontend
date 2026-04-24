'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Database, Activity, Clock, HardDrive, Users, Zap } from 'lucide-react';
import { RedisStatus } from '@/types/admin/health';
import { formatBytes, formatDuration } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface RedisStatusCardProps {
  status: RedisStatus;
  loading?: boolean;
}

export const RedisStatusCard = ({ status, loading }: RedisStatusCardProps) => {
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

  // Fix for Recharts height issue - add wrapper div with fixed height
  if (loading) {
    return (
      <div className="rounded-xl p-5 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  const memoryData = [
    { name: 'Used', value: status.memory.used, color: '#84cc16' },
    { name: 'Peak', value: status.memory.peak, color: '#f59e0b' },
    { name: 'Max', value: status.memory.max, color: '#3b82f6' },
  ];

  const metrics = [
    { label: 'Version', value: status.version, icon: Database },
    { label: 'Keys', value: status.keys.toLocaleString(), icon: HardDrive },
    { label: 'Connected Clients', value: status.connectedClients, icon: Users },
    { label: 'Uptime', value: formatDuration(status.uptime), icon: Clock },
  ];

  return (
    <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database size={20} className="text-[#84cc16]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Redis Cache</h3>
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

      {/* Memory Usage Chart - Fixed height wrapper */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-3 text-[var(--text-primary)]">Memory Usage</h4>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={memoryData} layout="vertical">
              <XAxis type="number" tickFormatter={(v) => formatBytes(v)} tick={{ fontSize: 10, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }} width={50} />
              <Tooltip
                formatter={(value: number) => formatBytes(value)}
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {memoryData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hit Rate */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[var(--text-secondary)]">Hit Rate</span>
          <span className="text-[var(--text-primary)] font-medium">{status.hitRate}%</span>
        </div>
        <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#84cc16] rounded-full transition-all"
            style={{ width: `${status.hitRate}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-2 text-[var(--text-secondary)]">
          <span>Hits: {status.hits.toLocaleString()}</span>
          <span>Misses: {status.misses.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};