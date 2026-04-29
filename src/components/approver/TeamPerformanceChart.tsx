'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TeamMember } from '@/types/approver/team';
import { useTheme } from '@/context/ThemeContext';

interface TeamPerformanceChartProps {
  members: TeamMember[];
  loading?: boolean;
}

export const TeamPerformanceChart = ({ members, loading }: TeamPerformanceChartProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#84cc16] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chartData = members.map(member => ({
    name: member.name.split(' ')[0],
    approvalRate: member.metrics.approvalRate,
    responseTime: member.metrics.averageResponseTime,
    totalApproved: member.metrics.totalApproved,
  }));

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

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
        <XAxis dataKey="name" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
        <YAxis yAxisId="left" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
        <YAxis yAxisId="right" orientation="right" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar yAxisId="left" dataKey="approvalRate" name="Approval Rate" fill="#84cc16" radius={[4, 4, 0, 0]} />
        <Bar yAxisId="right" dataKey="responseTime" name="Response Time (hrs)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};