'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/context/ThemeContext';

interface ApprovalRateChartProps {
  approvalRate: number;
  totalDecisions?: number;
  loading?: boolean;
}

export const ApprovalRateChart = ({ approvalRate, totalDecisions, loading }: ApprovalRateChartProps) => {
  const { theme } = useTheme();

  const data = [
    { name: 'Approved', value: approvalRate, color: '#84cc16' },
    { name: 'Rejected', value: 100 - approvalRate, color: theme === 'dark' ? '#4b5563' : '#e5e7eb' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="rounded-lg p-2 shadow-lg border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {payload[0].name}: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#84cc16] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="relative inline-block">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-3xl font-bold text-[#84cc16]">{approvalRate}%</p>
          <p className="text-xs text-[var(--text-secondary)]">Approval Rate</p>
        </div>
      </div>
      {totalDecisions !== undefined && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#84cc16]" />
            <span className="text-xs text-[var(--text-secondary)]">{Math.round(approvalRate * totalDecisions / 100)} Approved</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
            <span className="text-xs text-[var(--text-secondary)]">{Math.round((100 - approvalRate) * totalDecisions / 100)} Rejected</span>
          </div>
        </div>
      )}
    </div>
  );
};