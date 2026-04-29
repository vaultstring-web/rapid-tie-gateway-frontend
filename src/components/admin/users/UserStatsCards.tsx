'use client';

import { Users, UserCheck, UserX, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import { UserStats } from '@/types/admin/users';
import { useTheme } from '@/context/ThemeContext';

interface UserStatsCardsProps {
  stats: UserStats;
  loading?: boolean;
}

export const UserStatsCards = ({ stats, loading }: UserStatsCardsProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
    { title: 'Total Users', value: stats.total.toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { title: 'Active', value: stats.active.toLocaleString(), icon: UserCheck, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
    { title: 'Inactive', value: stats.inactive.toLocaleString(), icon: UserX, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
    { title: 'Suspended', value: stats.suspended.toLocaleString(), icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' },
    { title: 'New Today', value: stats.newToday.toLocaleString(), icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' },
    { title: 'New This Month', value: stats.newThisMonth.toLocaleString(), icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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