'use client';

import { Calendar, Ticket, DollarSign, Users, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { EventStats } from '@/types/admin/events';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface EventStatsCardsProps {
  stats: EventStats;
  loading?: boolean;
}

export const EventStatsCards = ({ stats, loading }: EventStatsCardsProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    { title: 'Total Events', value: stats.total.toLocaleString(), icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { title: 'Pending', value: stats.pending.toLocaleString(), icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { title: 'Published', value: stats.published.toLocaleString(), icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
    { title: 'Completed', value: stats.completed.toLocaleString(), icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' },
    { title: 'Cancelled', value: stats.cancelled.toLocaleString(), icon: XCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' },
    { title: 'Tickets Sold', value: stats.totalTickets.toLocaleString(), icon: Ticket, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20' },
    { title: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
    { title: 'Avg. Ticket', value: formatCurrency(stats.averageTicketPrice), icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/20' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
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