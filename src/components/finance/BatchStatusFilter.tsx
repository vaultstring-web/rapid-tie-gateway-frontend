'use client';

import { BatchStatus, BATCH_STATUS_CONFIG } from '@/types/finance/batches';
import { useTheme } from '@/context/ThemeContext';

interface BatchStatusFilterProps {
  selectedStatus: BatchStatus;
  onStatusChange: (status: BatchStatus) => void;
  counts: Record<BatchStatus, number>;
}

export const BatchStatusFilter = ({ selectedStatus, onStatusChange, counts }: BatchStatusFilterProps) => {
  const { theme } = useTheme();

  const filters: { value: BatchStatus; label: string; icon: string }[] = [
    { value: 'all', label: 'All Batches', icon: '📊' },
    { value: 'pending', label: 'Pending', icon: BATCH_STATUS_CONFIG.pending.icon },
    { value: 'processing', label: 'Processing', icon: BATCH_STATUS_CONFIG.processing.icon },
    { value: 'completed', label: 'Completed', icon: BATCH_STATUS_CONFIG.completed.icon },
    { value: 'partial', label: 'Partial', icon: BATCH_STATUS_CONFIG.partial.icon },
    { value: 'failed', label: 'Failed', icon: BATCH_STATUS_CONFIG.failed.icon },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onStatusChange(filter.value)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            selectedStatus === filter.value
              ? 'bg-[#84cc16] text-white shadow-md'
              : 'border hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          style={{
            borderColor: selectedStatus === filter.value ? undefined : 'var(--border-color)',
            backgroundColor: selectedStatus === filter.value ? undefined : 'var(--bg-secondary)',
            color: selectedStatus === filter.value ? undefined : 'var(--text-primary)',
          }}
        >
          <span>{filter.icon}</span>
          <span>{filter.label}</span>
          <span className={`ml-1 text-xs ${
            selectedStatus === filter.value ? 'text-white/80' : 'text-[var(--text-secondary)]'
          }`}>
            ({counts[filter.value]})
          </span>
        </button>
      ))}
    </div>
  );
};