'use client';

import { Calendar, Ticket, DollarSign, Users, TrendingUp, PieChart } from 'lucide-react';
import { EventPlatformMetrics } from '@/types/admin';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Simple format currency function to avoid import issues
const formatCurrency = (amount: number): string => {
  return `MWK ${amount.toLocaleString()}`;
};

interface EventPlatformHealthProps {
  metrics: EventPlatformMetrics;
  loading?: boolean;
}

export const EventPlatformHealth = ({ metrics, loading }: EventPlatformHealthProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statusData = [
    { name: 'Published', value: metrics.eventsByStatus.published, color: '#84cc16' },
    { name: 'Draft', value: metrics.eventsByStatus.draft, color: '#f59e0b' },
    { name: 'Completed', value: metrics.eventsByStatus.completed, color: '#3b82f6' },
    { name: 'Cancelled', value: metrics.eventsByStatus.cancelled, color: '#ef4444' },
  ];

  const cards = [
    { title: 'Total Events', value: metrics.totalEvents, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { title: 'Active Events', value: metrics.activeEvents, icon: Calendar, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
    { title: 'Tickets Sold', value: metrics.totalTicketsSold.toLocaleString(), icon: Ticket, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' },
    { title: 'Total Revenue', value: formatCurrency(metrics.totalRevenue), icon: DollarSign, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { title: 'Avg Attendance', value: `${metrics.averageAttendance}%`, icon: Users, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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

      {/* Events by Status Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Events by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                  }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Platform Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--text-primary)]">Conversion Rate</span>
                <span className="text-[#84cc16] font-semibold">{metrics.conversionRate}%</span>
              </div>
              <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
                <div className="h-full bg-[#84cc16] rounded-full" style={{ width: `${metrics.conversionRate}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--text-primary)]">Revenue Target</span>
                <span className="text-[var(--text-secondary)]">68%</span>
              </div>
              <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '68%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--text-primary)]">User Growth</span>
                <span className="text-green-500">+12.5%</span>
              </div>
              <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};