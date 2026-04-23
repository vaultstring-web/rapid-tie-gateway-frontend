'use client';

import { Database, Activity, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { SystemHealthData, STATUS_COLORS } from '@/types/admin/health';

interface StatusCardsProps {
  data: SystemHealthData;
  loading?: boolean;
}

export const StatusCards = ({ data, loading }: StatusCardsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'degraded':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      default:
        return <XCircle size={20} className="text-red-500" />;
    }
  };

  const cards = [
    {
      title: 'Overall System',
      value: data.overallStatus.toUpperCase(),
      icon: Activity,
      status: data.overallStatus,
    },
    {
      title: 'Database',
      value: data.database.status.toUpperCase(),
      icon: Database,
      status: data.database.status,
      latency: `${data.database.latency}ms`,
    },
    {
      title: 'Redis Cache',
      value: data.redis.status.toUpperCase(),
      icon: Database,
      status: data.redis.status,
      hitRate: `${data.redis.hitRate}%`,
    },
    {
      title: 'Worker Queues',
      value: data.workerQueues.every(q => q.status === 'healthy') ? 'HEALTHY' : 'DEGRADED',
      icon: Activity,
      status: data.workerQueues.every(q => q.status === 'healthy') ? 'healthy' : 'degraded',
      active: data.workerQueues.reduce((sum, q) => sum + q.active, 0),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const statusColor = STATUS_COLORS[card.status as keyof typeof STATUS_COLORS];
        return (
          <div
            key={card.title}
            className={`rounded-xl p-4 border-l-4 ${statusColor.border}`}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon size={18} className="text-[var(--text-secondary)]" />
                <span className="text-sm font-medium text-[var(--text-primary)]">{card.title}</span>
              </div>
              {getStatusIcon(card.status)}
            </div>
            <p className={`text-2xl font-bold ${statusColor.text}`}>{card.value}</p>
            {card.latency && <p className="text-xs text-[var(--text-secondary)] mt-1">Latency: {card.latency}</p>}
            {card.hitRate && <p className="text-xs text-[var(--text-secondary)] mt-1">Hit Rate: {card.hitRate}</p>}
            {card.active !== undefined && <p className="text-xs text-[var(--text-secondary)] mt-1">Active Jobs: {card.active}</p>}
          </div>
        );
      })}
    </div>
  );
};