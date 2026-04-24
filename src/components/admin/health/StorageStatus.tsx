'use client';

import { HardDrive, Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { StorageStatus } from '@/types/admin/health';
import { formatBytes } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface StorageStatusProps {
  storage: StorageStatus;
  loading?: boolean;
}

export const StorageStatus = ({ storage, loading }: StorageStatusProps) => {
  const { theme } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'warning':
        return <AlertTriangle size={14} className="text-yellow-500" />;
      case 'critical':
        return <AlertTriangle size={14} className="text-red-500" />;
      default:
        return <HardDrive size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl p-5 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
        <div className="space-y-4">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-center gap-2 mb-4">
        <HardDrive size={20} className="text-[#84cc16]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Storage Status</h3>
      </div>

      {/* Disk Storage */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-3 text-[var(--text-primary)]">Disk Storage</h4>
        {storage.disk.map((disk) => (
          <div key={disk.name} className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <HardDrive size={14} className="text-[var(--text-secondary)]" />
                <span className="text-sm font-medium text-[var(--text-primary)]">{disk.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(disk.status)}
                <span className={`text-xs ${getStatusColor(disk.status)}`}>
                  {disk.usagePercent}% used
                </span>
              </div>
            </div>
            <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden mb-1">
              <div
                className={`h-full rounded-full transition-all ${
                  disk.usagePercent > 90 ? 'bg-red-500' :
                  disk.usagePercent > 75 ? 'bg-yellow-500' : 'bg-[#84cc16]'
                }`}
                style={{ width: `${disk.usagePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[var(--text-secondary)]">
              <span>Used: {formatBytes(disk.used)}</span>
              <span>Free: {formatBytes(disk.free)}</span>
              <span>Total: {formatBytes(disk.total)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Database Storage */}
      <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <h4 className="text-sm font-semibold mb-3 text-[var(--text-primary)]">Database Storage</h4>
        {storage.database.map((db) => (
          <div key={db.name} className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Database size={14} className="text-[var(--text-secondary)]" />
                <span className="text-sm font-medium text-[var(--text-primary)]">{db.name}</span>
              </div>
              <span className="text-xs text-[var(--text-secondary)]">{db.usagePercent}% used</span>
            </div>
            <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-[#84cc16] rounded-full transition-all"
                style={{ width: `${db.usagePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[var(--text-secondary)]">
              <span>Used: {formatBytes(db.used)}</span>
              <span>Free: {formatBytes(db.free)}</span>
              <span>Total: {formatBytes(db.total)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t text-xs text-[var(--text-secondary)]">
        <div className="flex items-center justify-between">
          <span>⚠️ Warning at 75%</span>
          <span>🔴 Critical at 90%</span>
        </div>
      </div>
    </div>
  );
};