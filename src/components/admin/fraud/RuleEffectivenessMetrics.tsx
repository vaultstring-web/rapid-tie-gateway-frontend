'use client';

import { TrendingUp, Target, AlertCircle, Clock, Shield } from 'lucide-react';
import { RuleMetrics } from '@/types/admin/fraud';
import { useTheme } from '@/context/ThemeContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RuleEffectivenessMetricsProps {
  metrics: RuleMetrics;
  historicalData?: { date: string; accuracy: number }[];
  loading?: boolean;
}

export const RuleEffectivenessMetrics = ({ metrics, historicalData, loading }: RuleEffectivenessMetricsProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getAccuracyColor = (rate: number) => {
    if (rate >= 80) return 'text-green-500';
    if (rate >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const cards = [
    { title: 'Total Triggers', value: metrics.totalTriggers.toLocaleString(), icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { title: 'Accuracy Rate', value: `${metrics.accuracyRate}%`, icon: Target, color: getAccuracyColor(metrics.accuracyRate), bg: 'bg-purple-100 dark:bg-purple-900/20' },
    { title: 'False Positive Rate', value: `${metrics.falsePositiveRate}%`, icon: TrendingUp, color: metrics.falsePositiveRate < 10 ? 'text-green-500' : 'text-red-500', bg: 'bg-orange-100 dark:bg-orange-900/20' },
    { title: 'Avg Response', value: `${metrics.avgResponseTime}ms`, icon: Clock, color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/20' },
  ];

  const mockHistoricalData = historicalData || [
    { date: 'Week 1', accuracy: 65 },
    { date: 'Week 2', accuracy: 72 },
    { date: 'Week 3', accuracy: 78 },
    { date: 'Week 4', accuracy: 82 },
    { date: 'Week 5', accuracy: 85 },
    { date: 'Week 6', accuracy: 84 },
    { date: 'Week 7', accuracy: 87 },
    { date: 'Week 8', accuracy: 89 },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-xl p-4 border transition-all hover:shadow-md"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">{card.title}</span>
                <div className={`${card.bg} p-2 rounded-lg`}>
                  <Icon size={16} className={card.color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Accuracy Trend Chart */}
      <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-[#84cc16]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Accuracy Trend</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockHistoricalData}>
              <defs>
                <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="date" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
              <YAxis tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                }}
              />
              <Area type="monotone" dataKey="accuracy" name="Accuracy (%)" stroke="#84cc16" strokeWidth={2} fill="url(#accuracyGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-center text-[var(--text-secondary)] mt-4">
          Rule accuracy has improved by 24% over the last 8 weeks
        </p>
      </div>
    </div>
  );
};