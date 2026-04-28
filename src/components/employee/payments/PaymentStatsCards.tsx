'use client';

import { DollarSign, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { PaymentStats } from '@/types/employee/payments';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface PaymentStatsCardsProps {
  stats: PaymentStats;
  loading?: boolean;
}

export const PaymentStatsCards = ({ stats, loading }: PaymentStatsCardsProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Payments',
      value: stats.totalPayments.toLocaleString(),
      icon: DollarSign,
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Total Amount',
      value: formatCurrency(stats.totalAmount),
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Average Payment',
      value: formatCurrency(stats.averageAmount),
      icon: Clock,
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Success Rate',
      value: `${Math.round((stats.completedPayments / stats.totalPayments) * 100)}%`,
      icon: CheckCircle,
      color: 'text-orange-500',
      bg: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            {card.title === 'Success Rate' && (
              <p className="text-xs text-green-500 mt-1">{stats.completedPayments} successful</p>
            )}
          </div>
        );
      })}
    </div>
  );
}; 