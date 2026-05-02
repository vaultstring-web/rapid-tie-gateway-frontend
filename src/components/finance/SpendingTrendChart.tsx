'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MonthlySpending } from '@/types/finance/budgets';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface SpendingTrendChartProps {
  data: MonthlySpending[];
  departmentName: string;
  loading?: boolean;
}

export const SpendingTrendChart = ({ data, departmentName, loading }: SpendingTrendChartProps) => {
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
              Variance: {payload[0].payload.variance > 0 ? '+' : ''}{formatCurrency(payload[0].payload.variance)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const chartData = data.map(item => ({
    month: item.month,
    actual: item.actual,
    budgeted: item.budgeted,
  }));

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[var(--text-primary)]">{departmentName} - Monthly Spending</p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
          <XAxis dataKey="month" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
          <YAxis tickFormatter={(v) => `K${(v / 1000).toFixed(0)}k`} tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="actual" name="Actual Spending" stroke="#84cc16" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="budgeted" name="Budgeted" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};