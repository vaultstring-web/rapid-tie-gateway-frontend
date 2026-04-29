'use client';

import { Activity, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface OverallStatusHeaderProps {
  status: 'healthy' | 'degraded' | 'critical';
  lastChecked: string;
  loading?: boolean;
}

export const OverallStatusHeader = ({ status, lastChecked, loading }: OverallStatusHeaderProps) => {
  const { theme } = useTheme();

  const getStatusConfig = () => {
    switch (status) {
      case 'healthy':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20', text: 'All Systems Operational' };
      case 'degraded':
        return { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'Partial System Degradation' };
      case 'critical':
        return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20', text: 'Critical System Issues' };
      default:
        return { icon: Activity, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800', text: 'Unknown Status' };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  if (loading) {
    return (
      <div className="rounded-xl p-6 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="flex-1">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 border ${config.bg}`} style={{ borderColor: 'var(--border-color)' }}>
      <div className="flex items-center gap-4 flex-wrap">
        <div className={`p-3 rounded-full ${config.bg}`}>
          <Icon size={32} className={config.color} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">{config.text}</h2>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-[var(--text-secondary)]" />
              <span className="text-sm text-[var(--text-secondary)]">Last checked: {new Date(lastChecked).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};