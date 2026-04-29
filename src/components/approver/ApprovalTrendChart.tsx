'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MonthlyTrend } from '@/types/approver/analytics';
import { useTheme } from '@/context/ThemeContext';

interface ApprovalTrendChartProps {
  data: MonthlyTrend[];
  loading?: boolean;
}

export const ApprovalTrendChart = ({ data, loading }: ApprovalTrendChartProps) => {
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
              {p.name}: {p.name === 'Approval Rate' ? `${p.value}%` : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartData = data.map(item => ({
    month: item.month,
    approved: item.approved,
    rejected: item.rejected,
    approvalRate: item.approvalRate,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="approvedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="rejectedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
        <XAxis dataKey="month" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
        <YAxis yAxisId="left" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area yAxisId="left" type="monotone" dataKey="approved" name="Approved" stroke="#84cc16" strokeWidth={2} fill="url(#approvedGradient)" />
        <Area yAxisId="left" type="monotone" dataKey="rejected" name="Rejected" stroke="#ef4444" strokeWidth={2} fill="url(#rejectedGradient)" />
        <Area yAxisId="right" type="monotone" dataKey="approvalRate" name="Approval Rate (%)" stroke="#3b82f6" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
};