'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CheckinStats, ROLE_CHECKIN_COLORS } from '@/types/organizer/checkin';
import { useTheme } from '@/context/ThemeContext';

interface CheckinStatsChartProps {
  stats: CheckinStats;
  loading?: boolean;
}

export const CheckinStatsChart = ({ stats, loading }: CheckinStatsChartProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chartData = stats.byRole.map(role => ({
    name: role.role,
    value: role.checkedIn,
    total: role.total,
    percentage: role.percentage,
    color: ROLE_CHECKIN_COLORS[role.role] || '#6b7280',
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className="rounded-lg p-3 shadow-lg border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {data.name}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Checked In: <span className="font-medium">{data.value}</span>
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Total: <span className="font-medium">{data.total}</span>
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Rate: <span className="font-medium text-green-500">{data.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-3xl font-bold text-primary-green-500">{stats.percentage}%</p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {stats.checkedIn} / {stats.total} checked in
        </p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};