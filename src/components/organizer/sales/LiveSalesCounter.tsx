'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Ticket, DollarSign, Users, Target } from 'lucide-react';
import { SalesMetrics } from '@/types/organizer/salesDashboard';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface LiveSalesCounterProps {
  metrics: SalesMetrics;
  loading?: boolean;
}

const MetricCard = ({ title, value, change, icon: Icon, color, bgColor }: any) => (
  <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{title}</span>
      <div className={`p-2 rounded-lg ${bgColor}`}>
        <Icon size={16} className={color} />
      </div>
    </div>
    <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
    {change !== undefined && (
      <p className={`text-xs mt-1 flex items-center gap-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        <TrendingUp size={10} className={change >= 0 ? '' : 'rotate-180'} />
        {Math.abs(change)}% from yesterday
      </p>
    )}
  </div>
);

export const LiveSalesCounter = ({ metrics, loading }: LiveSalesCounterProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      change: metrics.revenueChange,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Tickets Sold',
      value: metrics.totalTicketsSold.toLocaleString(),
      change: metrics.ticketsSoldChange,
      icon: Ticket,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Attendees',
      value: metrics.totalAttendees.toLocaleString(),
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Avg. Ticket Price',
      value: formatCurrency(metrics.averageTicketPrice),
      icon: Ticket,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'Capacity Filled',
      value: `${metrics.capacityPercentage}%`,
      icon: Target,
      color: 'text-primary-green-500',
      bgColor: 'bg-primary-green-100 dark:bg-primary-green-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <MetricCard key={index} {...card} />
      ))}
    </div>
  );
};