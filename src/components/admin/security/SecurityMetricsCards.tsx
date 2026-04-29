'use client';

import { Shield, AlertTriangle, Users, Globe, TrendingUp, TrendingDown } from 'lucide-react';
import { SecurityMetrics } from '@/types/admin/security';
import { useTheme } from '@/context/ThemeContext';

interface SecurityMetricsCardsProps {
  metrics: SecurityMetrics;
  loading?: boolean;
}

export const SecurityMetricsCards = ({ metrics, loading }: SecurityMetricsCardsProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const cards = [
    {
      title: 'Security Score',
      value: `${metrics.securityScore}%`,
      change: metrics.securityScoreChange,
      icon: Shield,
      color: getScoreColor(metrics.securityScore),
      bg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Failed Logins',
      value: metrics.totalFailedLogins.toLocaleString(),
      change: metrics.failedLoginsChange,
      icon: AlertTriangle,
      color: metrics.failedLoginsChange > 0 ? 'text-red-500' : 'text-green-500',
      bg: 'bg-red-100 dark:bg-red-900/20',
    },
    {
      title: 'Active Sessions',
      value: metrics.activeSessions.toLocaleString(),
      change: metrics.activeSessionsChange,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Blocked IPs',
      value: metrics.blockedIPs.toLocaleString(),
      change: metrics.blockedIPsChange,
      icon: Globe,
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: '2FA Adoption',
      value: `${metrics.twoFactorAdoptionRate}%`,
      change: metrics.twoFactorAdoptionRate,
      icon: Shield,
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
            {card.change !== undefined && (
              <div className={`flex items-center gap-1 text-xs mt-1 ${card.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {card.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(card.change)}% from last week
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};