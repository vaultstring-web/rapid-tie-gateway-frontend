'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DepartmentPerformance } from '@/types/approver/analytics';
import { useTheme } from '@/context/ThemeContext';

interface DepartmentPerformanceChartProps {
  data: DepartmentPerformance[];
  loading?: boolean;
}

export const DepartmentPerformanceChart = ({ data, loading }: DepartmentPerformanceChartProps) => {
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
          <p className="text-xs text-[var(--text-secondary)]">Approved: {item.approved}</p>
          <p className="text-xs text-[var(--text-secondary)]">Rejected: {item.rejected}</p>
          <p className="text-xs text-[var(--text-secondary)]">Approval Rate: {item.approvalRate}%</p>
          <p className="text-xs text-[var(--text-secondary)]">Avg Response: {item.avgResponseTime} hrs</p>
        </div>
      );
    }
    return null;
  };

  const chartData = data.map(item => ({
    name: item.department,
    approvalRate: item.approvalRate,
  }));

  const getBarColor = (rate: number) => {
    if (rate >= 80) return '#84cc16';
    if (rate >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
        <XAxis type="number" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
        <YAxis type="category" dataKey="name" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} width={100} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="approvalRate" name="Approval Rate">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.approvalRate)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};