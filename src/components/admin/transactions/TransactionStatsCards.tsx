'use client';

import { DollarSign, Activity, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { TransactionStats } from '@/types/admin/transactions';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface TransactionStatsCardsProps {
  stats: TransactionStats;
  loading?: boolean;
}

export const TransactionStatsCards = ({ stats, loading }: TransactionStatsCardsProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    { title: 'Total Transactions', value: stats.total.toLocaleString(), icon: Activity, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { title: 'Total Volume', value: formatCurrency(stats.totalVolume), icon: DollarSign, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
    { title: 'Pending', value: stats.pending.toLocaleString(), icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { title: 'Completed', value: stats.completed.toLocaleString(), icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
    { title: 'Failed', value: stats.failed.toLocaleString(), icon: XCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' },
    { title: 'Anomalies', value: stats.anomalyCount.toLocaleString(), icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="rounded-xl p-4 border transition-all hover:shadow-md"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--text-secondary)]">{card.title}</span>
              <div className={`${card.bg} p-2 rounded-lg`}>
                <Icon size={16} className={card.color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
};