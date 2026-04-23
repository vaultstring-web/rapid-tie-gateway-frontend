'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { RevenueData } from '@/types/organizer/salesDashboard';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface RevenueChartProps {
  data: RevenueData[];
  loading?: boolean;
}

export const RevenueChart = ({ data, loading }: RevenueChartProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
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
          <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            {label}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Revenue: <span className="text-green-500 font-medium">{formatCurrency(payload[0].value)}</span>
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Tickets: <span className="text-blue-500 font-medium">{payload[1].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="ticketsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
          tickLine={false}
          axisLine={{ stroke: theme === 'dark' ? '#374151' : '#e5e7eb' }}
        />
        <YAxis
          yAxisId="left"
          tickFormatter={(value) => formatCurrency(value).replace('MWK', 'K')}
          tick={{ fontSize: 12, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
          tickLine={false}
          axisLine={{ stroke: theme === 'dark' ? '#374151' : '#e5e7eb' }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 12, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
          tickLine={false}
          axisLine={{ stroke: theme === 'dark' ? '#374151' : '#e5e7eb' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#84cc16"
          strokeWidth={2}
          fill="url(#revenueGradient)"
        />
        <Area
          yAxisId="right"
          type="monotone"
          dataKey="tickets"
          name="Tickets Sold"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#ticketsGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};