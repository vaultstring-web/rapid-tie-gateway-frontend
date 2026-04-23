'use client';

import { HardDrive, Database, FolderArchive, FileText, AlertTriangle } from 'lucide-react';
import { StorageStatus as StorageStatusType, STORAGE_COLORS } from '@/types/admin/health';
import { formatBytes } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface StorageStatusProps {
  storage: StorageStatusType[];
  loading?: boolean;
}

export const StorageStatus = ({ storage, loading }: StorageStatusProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="rounded-xl p-5 border animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const getStorageIcon = (type: string) => {
    switch (type) {
      case 'database':
        return <Database size={18} />;
      case 'uploads':
        return <FolderArchive size={18} />;
      case 'logs':
        return <FileText size={18} />;
      default:
        return <HardDrive size={18} />;
    }
  };

  const getStatusColor = (percentage: number): string => {
    if (percentage < 70) return STORAGE_COLORS.healthy;
    if (percentage < 85) return STORAGE_COLORS.warning;
    return STORAGE_COLORS.critical;
  };

  const totalUsed = storage.reduce((sum, s) => sum + s.used, 0);
  const totalCapacity = storage.reduce((sum, s) => sum + s.total, 0);
  const overallPercentage = (totalUsed / totalCapacity) * 100;

  return (
    <div
      className="rounded-xl p-5 border"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HardDrive size={20} className="text-[#84cc16]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Storage Usage</h3>
        </div>
        <div className={`text-xs font-medium px-2 py-1 rounded-full ${
          overallPercentage < 70 ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
          overallPercentage < 85 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
          'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
        }`}>
          {overallPercentage.toFixed(1)}% Used
        </div>
      </div>

      {/* Overall Storage Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[var(--text-secondary)]">Overall Storage</span>
          <span className="text-[var(--text-primary)]">{formatBytes(totalUsed)} / {formatBytes(totalCapacity)}</span>
        </div>
        <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${overallPercentage}%`, backgroundColor: getStatusColor(overallPercentage) }}
          />
        </div>
      </div>

      {/* Individual Storage Items */}
      <div className="space-y-3">
        {storage.map((item) => {
          const percentage = (item.used / item.total) * 100;
          const statusColor = getStatusColor(percentage);
          const Icon = getStorageIcon(item.type);
          
          return (
            <div key={item.type}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon size={14} className="text-[var(--text-secondary)]" />
                  <span className="text-sm font-medium text-[var(--text-primary)] capitalize">{item.type}</span>
                </div>
                <span className="text-xs text-[var(--text-secondary)]">{formatBytes(item.used)} / {formatBytes(item.total)}</span>
              </div>
              <div className="h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${percentage}%`, backgroundColor: statusColor }}
                />
              </div>
              {item.status === 'critical' && (
                <div className="flex items-center gap-1 mt-1 text-red-500">
                  <AlertTriangle size={10} />
                  <span className="text-[10px]">Critical: Low disk space</span>
                </div>
              )}
              {item.status === 'warning' && (
                <div className="flex items-center gap-1 mt-1 text-yellow-500">
                  <AlertTriangle size={10} />
                  <span className="text-[10px]">Warning: Approaching limit</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};