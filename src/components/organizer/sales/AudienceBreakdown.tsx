'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AudienceBreakdown, ROLE_LABELS, ROLE_COLORS } from '@/types/organizer/salesDashboard';
import { useTheme } from '@/context/ThemeContext';

interface AudienceBreakdownProps {
  data: AudienceBreakdown[];
  loading?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-lg p-3 shadow-lg border"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {payload[0].name}
        </p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Count: <span className="font-medium">{payload[0].value.toLocaleString()}</span>
        </p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Percentage: <span className="font-medium">{payload[0].payload.percentage}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export const AudienceBreakdown = ({ data, loading }: AudienceBreakdownProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: ROLE_LABELS[item.role] || item.role,
    value: item.count,
    percentage: item.percentage,
    color: ROLE_COLORS[item.role] || '#6b7280',
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
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
  );
};