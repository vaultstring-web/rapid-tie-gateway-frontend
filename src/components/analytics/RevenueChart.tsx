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
import { RevenueData } from '@/types/analytics/eventAnalytics';
import { formatCurrency } from '@/lib/utils/format';

interface RevenueChartProps {
  data: RevenueData[];
  loading?: boolean;
}

export const RevenueChart = ({ data, loading }: RevenueChartProps) => {
  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="transactionsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12, fill: '#6b7280' }}
          tickLine={false}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis 
          yAxisId="left"
          tickFormatter={(value) => formatCurrency(value)}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          tickLine={false}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          tickLine={false}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
          }}
          formatter={(value: any, name: string) => {
            if (name === 'revenue') return [formatCurrency(value), 'Revenue'];
            if (name === 'transactions') return [value, 'Transactions'];
            return [value, name];
          }}
        />
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
          dataKey="transactions"
          name="Transactions"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#transactionsGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};