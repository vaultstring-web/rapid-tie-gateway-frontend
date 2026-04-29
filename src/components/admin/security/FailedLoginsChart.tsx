'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { FailedLoginData } from '@/types/admin/security';
import { useTheme } from '@/context/ThemeContext';

interface FailedLoginsChartProps {
  data: FailedLoginData[];
  loading?: boolean;
}

export const FailedLoginsChart = ({ data, loading }: FailedLoginsChartProps) => {
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
            Failed Attempts: <span className="text-red-500 font-medium">{payload[0].value}</span>
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            Unique IPs: <span className="text-blue-500 font-medium">{payload[1].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (count: number) => {
    if (count >= 20) return '#ef4444';
    if (count >= 10) return '#f59e0b';
    return '#84cc16';
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
        <XAxis dataKey="hour" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
        <YAxis tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="count" name="Failed Attempts" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.count)} />
          ))}
        </Bar>
        <Bar dataKey="uniqueIPs" name="Unique IPs" radius={[4, 4, 0, 0]} fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};