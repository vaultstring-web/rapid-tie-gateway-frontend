'use client';

import { Clock, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { UrgencyCount } from '@/types/rejected.ts/dashboard';
import { useTheme } from '@/context/ThemeContext';

interface PendingRequestsCardProps {
  counts: UrgencyCount;
  loading?: boolean;
}

export const PendingRequestsCard = ({ counts, loading }: PendingRequestsCardProps) => {
  const { theme } = useTheme();

  const urgencyItems = [
    {
      label: 'High Urgency',
      count: counts.high,
      color: 'text-red-500',
      bg: 'bg-red-100 dark:bg-red-900/30',
      border: 'border-red-200 dark:border-red-800',
      icon: AlertCircle,
      description: 'Requires immediate attention',
    },
    {
      label: 'Medium Urgency',
      count: counts.medium,
      color: 'text-yellow-500',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: AlertTriangle,
      description: 'Review within 48 hours',
    },
    {
      label: 'Low Urgency',
      count: counts.low,
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/30',
      border: 'border-green-200 dark:border-green-800',
      icon: Clock,
      description: 'Standard processing time',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl p-5 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {urgencyItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={`rounded-xl p-5 border ${item.border} transition-all hover:shadow-md`}
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${item.bg}`}>
                <Icon size={20} className={item.color} />
              </div>
              <span className={`text-3xl font-bold ${item.color}`}>{item.count}</span>
            </div>
            <h3 className="font-semibold text-[var(--text-primary)]">{item.label}</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{item.description}</p>
          </div>
        );
      })}
    </div>
  );
};
