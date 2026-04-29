'use client';

import { Users, UserPlus, TrendingUp, UserCheck } from 'lucide-react';
import { UserStats } from '@/types/admin';
import { useTheme } from '@/context/ThemeContext';

interface ActiveUsersProps {
  stats: UserStats;
  loading?: boolean;
}

export const ActiveUsers = ({ stats, loading }: ActiveUsersProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    { title: 'Total Users', value: stats.total.toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20', change: '+8.2%' },
    { title: 'Active Users', value: stats.active.toLocaleString(), icon: UserCheck, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20', change: '+5.4%' },
    { title: 'New Today', value: stats.newToday.toLocaleString(), icon: UserPlus, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20', change: '+12' },
    { title: 'Growth Rate', value: '+12.5%', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20', change: 'vs last month' },
  ];

  const roleColors: Record<string, string> = {
    MERCHANT: '#10b981',
    ORGANIZER: '#3b82f6',
    EMPLOYEE: '#8b5cf6',
    APPROVER: '#f59e0b',
    FINANCE_OFFICER: '#06b6d4',
    ADMIN: '#ef4444',
    COMPLIANCE: '#6b7280',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <p className="text-xs text-green-500 mt-1">{card.change}</p>
            </div>
          );
        })}
      </div>

      {/* Users by Role */}
      <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Users by Role</h3>
        <div className="space-y-3">
          {Object.entries(stats.byRole).map(([role, count]) => (
            <div key={role}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--text-primary)]">{role}</span>
                <span className="text-[var(--text-secondary)]">{count.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(count / stats.total) * 100}%`, backgroundColor: roleColors[role] || '#84cc16' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};