'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { DepartmentBudget, DEPARTMENT_COLORS } from '@/types/finance/dashboard';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface BudgetUtilizationChartProps {
  data: DepartmentBudget[];
  loading?: boolean;
}

export const BudgetUtilizationChart = ({ data, loading }: BudgetUtilizationChartProps) => {
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
      const item = payload[0].payload;
      return (
        <div
          className="rounded-lg p-3 shadow-lg border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">{label}</p>
          <p className="text-xs text-[var(--text-secondary)]">
            Allocated: <span className="text-[#84cc16] font-medium">{formatCurrency(item.allocated)}</span>
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            Spent: <span className="text-red-500 font-medium">{formatCurrency(item.spent)}</span>
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            Committed: <span className="text-yellow-500 font-medium">{formatCurrency(item.committed)}</span>
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            Remaining: <span className="text-green-500 font-medium">{formatCurrency(item.remaining)}</span>
          </p>
          <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-xs font-medium text-[var(--text-primary)]">
              Utilization: {item.percentageUsed}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (percentage: number) => {
    if (percentage >= 90) return '#ef4444';
    if (percentage >= 75) return '#f59e0b';
    return '#84cc16';
  };

  const chartData = data.map(item => ({
    name: item.department,
    spent: item.spent,
    allocated: item.allocated,
    percentage: item.percentageUsed,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
        <XAxis dataKey="name" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
        <YAxis tickFormatter={(v) => `K${(v / 1000).toFixed(0)}k`} tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="spent" name="Spent" fill="#ef4444" radius={[4, 4, 0, 0]} />
        <Bar dataKey="allocated" name="Allocated" fill="#84cc16" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};