'use client';

import { Database, Zap, Users, Activity } from 'lucide-react';
import { RedisStatus, STATUS_COLORS } from '@/types/admin/health';
import { formatBytes, formatUptime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock memory history data
const memoryHistory = [
  { time: '00:00', used: 45 },
  { time: '04:00', used: 52 },
  { time: '08:00', used: 68 },
  { time: '12:00', used: 72 },
  { time: '16:00', used: 65 },
  { time: '20:00', used: 58 },
  { time: 'now', used: 62 },
];

interface RedisStatusProps {
  data: RedisStatus;
  loading?: boolean;
}

export const RedisStatus = ({ data, loading }: RedisStatusProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="rounded-xl p-5 border animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  const statusColor = STATUS_COLORS[data.status];
  const memoryUsedPercent = (data.memory.used / data.memory.max) * 100;
  const memoryPeakPercent = (data.memory.peak / data.memory.max) * 100;

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
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Redis Cache</h3>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
          {data.status.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-[var(--text-secondary)]">Uptime</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{formatUptime(data.uptime)}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-secondary)]">Hit Rate</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{data.hitRate}%</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-secondary)]">Connected Clients</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{data.connectedClients}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-secondary)]">Commands Processed</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{(data.commandsProcessed / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      {/* Memory Usage */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-[var(--text-secondary)]">Memory Usage</span>
          <span className="text-xs text-[var(--text-primary)]">{formatBytes(data.memory.used)} / {formatBytes(data.memory.max)}</span>
        </div>
        <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
          <div className="h-full bg-[#84cc16] rounded-full transition-all" style={{ width: `${memoryUsedPercent}%` }} />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-[var(--text-secondary)]">Peak: {formatBytes(data.memory.peak)}</span>
          <span className="text-[var(--text-secondary)]">Fragmentation: {data.memory.fragmentation}%</span>
        </div>
      </div>

      {/* Memory Chart */}
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-3 text-[var(--text-primary)]">Memory Usage Trend (Last 24h)</h4>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={memoryHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="time" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 10 }} />
              <YAxis tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                }}
              />
              <Area type="monotone" dataKey="used" name="Memory Usage %" stroke="#84cc16" fill="#84cc16" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};