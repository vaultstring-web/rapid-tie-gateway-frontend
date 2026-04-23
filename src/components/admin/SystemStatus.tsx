'use client';

import { Database, Cpu, Globe, Wifi, Activity, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { SystemStatus } from '@/types/admin';
import { useTheme } from '@/context/ThemeContext';

interface SystemStatusProps {
  status: SystemStatus;
  loading?: boolean;
}

export const SystemStatusIndicators = ({ status, loading }: SystemStatusProps) => {
  const { theme } = useTheme();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'degraded':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'down':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Activity size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'degraded':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'down':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  const items = [
    {
      title: 'Database',
      icon: Database,
      status: status.database.status,
      details: `${status.database.latency}ms • ${status.database.connections} connections`,
    },
    {
      title: 'Redis Cache',
      icon: Cpu,
      status: status.redis.status,
      details: `${Math.round(status.redis.memory / 1024 / 1024)}MB • ${status.redis.hitRate}% hit rate`,
    },
    {
      title: 'API Server',
      icon: Globe,
      status: status.api.status,
      details: `${Math.round(status.api.uptime / 3600)}h uptime • ${status.api.responseTime}ms`,
    },
    {
      title: 'WebSocket',
      icon: Wifi,
      status: status.websocket.status,
      details: `${status.websocket.connections} active connections`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        const statusColor = getStatusColor(item.status);
        return (
          <div
            key={item.title}
            className={`rounded-xl p-4 border-l-4 ${statusColor}`}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon size={18} className="text-[var(--text-secondary)]" />
                <span className="text-sm font-medium text-[var(--text-primary)]">{item.title}</span>
              </div>
              {getStatusIcon(item.status)}
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)] capitalize">{item.status}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">{item.details}</p>
          </div>
        );
      })}
    </div>
  );
};