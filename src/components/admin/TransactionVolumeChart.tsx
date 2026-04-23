'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TransactionVolume } from '@/types/admin';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface TransactionVolumeChartProps {
  data: TransactionVolume[];
  loading?: boolean;
}

export const TransactionVolumeChart = ({ data, loading }: TransactionVolumeChartProps) => {
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
          <p className="text-sm font-semibold mb-2 text-[var(--text-primary)]">{label}</p>
          <p className="text-sm text-[var(--text-secondary)]">
            Transactions: <span className="text-blue-500 font-medium">{payload[0].value}</span>
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            Volume: <span className="text-green-500 font-medium">{formatCurrency(payload[1].value)}</span>
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
          <linearGradient id="countGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="amountGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
        <XAxis dataKey="date" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
        <YAxis yAxisId="left" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
        <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `K${(v / 1000).toFixed(0)}k`} tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area yAxisId="left" type="monotone" dataKey="count" name="Transactions" stroke="#3b82f6" strokeWidth={2} fill="url(#countGradient)" />
        <Area yAxisId="right" type="monotone" dataKey="amount" name="Volume" stroke="#84cc16" strokeWidth={2} fill="url(#amountGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};