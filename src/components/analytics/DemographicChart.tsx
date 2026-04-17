'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DemographicData } from '@/types/analytics/eventAnalytics';

interface DemographicChartProps {
  data: DemographicData[];
  loading?: boolean;
  type?: 'age' | 'gender';
}

const GENDER_COLORS = ['#84cc16', '#3b82f6', '#a855f7'];
const AGE_COLORS = ['#84cc16', '#a3e635', '#65a30d', '#4d7c0f', '#3f6212'];

export const DemographicChart = ({ data, loading, type = 'age' }: DemographicChartProps) => {
  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (type === 'gender') {
    const genderData = [
      { name: 'Male', value: data.reduce((sum, d) => sum + d.male, 0), color: GENDER_COLORS[0] },
      { name: 'Female', value: data.reduce((sum, d) => sum + d.female, 0), color: GENDER_COLORS[1] },
      { name: 'Other', value: data.reduce((sum, d) => sum + d.other, 0), color: GENDER_COLORS[2] },
    ].filter(d => d.value > 0);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={genderData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            dataKey="value"
          >
            {genderData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  // Age group chart
  const ageData = data.map(item => ({
    name: item.ageGroup,
    value: item.total,
    color: AGE_COLORS[Math.floor(Math.random() * AGE_COLORS.length)],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={ageData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          dataKey="value"
        >
          {ageData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};