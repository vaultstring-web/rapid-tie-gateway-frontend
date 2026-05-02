'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EventSpending } from '@/types/finance/dashboard';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface EventSpendingTrendProps {
  data: EventSpending[];
  loading?: boolean;
}

export const EventSpendingTrend = ({ data, loading }: EventSpendingTrendProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#84cc16] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="rounded-lg p-3 shadow-lg border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">{label}</p>
          {payload.map((p: any, idx: number) => (
            <p key={idx} className="text-xs" style={{ color: p.color }}>
              {p.name}: {formatCurrency(p.value)}
            </p>
          ))}
          <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-xs font-medium text-[var(--text-primary)]">
              Event Share: {((payload[1]?.value / payload[0]?.value) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="eventGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
        <XAxis dataKey="month" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
        <YAxis tickFormatter={(v) => `K${(v / 1000).toFixed(0)}k`} tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area type="monotone" dataKey="total" name="Total Spending" stroke="#84cc16" strokeWidth={2} fill="url(#totalGradient)" />
        <Area type="monotone" dataKey="eventSpending" name="Event Spending" stroke="#8b5cf6" strokeWidth={2} fill="url(#eventGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};