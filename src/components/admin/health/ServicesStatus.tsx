'use client';

import { Server, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { ServiceStatus, STATUS_COLORS } from '@/types/admin/health';
import { formatUptime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface ServicesStatusProps {
  services: ServiceStatus[];
  loading?: boolean;
}

export const ServicesStatus = ({ services, loading }: ServicesStatusProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="rounded-xl p-5 border animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'degraded':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      default:
        return <XCircle size={16} className="text-red-500" />;
    }
  };

  return (
    <div
      className="rounded-xl p-5 border"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Server size={20} className="text-[#84cc16]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Services Status</h3>
      </div>

      <div className="space-y-2">
        {services.map((service) => {
          const statusColor = STATUS_COLORS[service.status];
          return (
            <div
              key={service.name}
              className="flex items-center justify-between p-3 rounded-lg border"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(service.status)}
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{service.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">v{service.version}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-medium ${statusColor.text}`}>{service.status.toUpperCase()}</p>
                <p className="text-xs text-[var(--text-secondary)]">{formatUptime(service.uptime)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};