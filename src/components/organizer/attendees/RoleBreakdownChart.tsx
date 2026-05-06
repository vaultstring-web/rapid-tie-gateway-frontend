'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AttendeeStats } from '@/types/organizer/attendees';
import { useTheme } from '@/context/ThemeContext';

interface RoleBreakdownChartProps {
  stats: AttendeeStats;
  loading?: boolean;
}

export const RoleBreakdownChart = ({ stats, loading }: RoleBreakdownChartProps) => {
  const { theme } = useTheme();

  if (loading) {
    return <div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#84cc16] border-t-transparent rounded-full animate-spin" /></div>;
  }

  const data = stats.byRole.map(role => ({ name: role.role, value: role.count, percentage: role.percentage, color: role.color }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[var(--bg-secondary)] rounded-lg p-3 shadow-lg border border-[var(--border-color)]">
          <p className="text-sm font-semibold text-[var(--text-primary)]">{data.name}</p>
          <p className="text-sm text-[var(--text-secondary)]">Count: {data.value}</p>
          <p className="text-sm text-[var(--text-secondary)]">Percentage: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" labelLine={false}>
          {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(value) => <span className="text-sm text-[var(--text-secondary)]">{value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
};