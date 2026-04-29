'use client';

import { CheckCircle, XCircle, UserPlus, AlertTriangle, X } from 'lucide-react';
import { BulkAction } from '@/types/rejected.ts/pending';
import { useTheme } from '@/context/ThemeContext';

interface BulkActionBarProps {
  selectedCount: number;
  onApprove: () => void;
  onReject: () => void;
  onAssign: () => void;
  onEscalate: () => void;
  onClear: () => void;
}

export const BulkActionBar = ({
  selectedCount,
  onApprove,
  onReject,
  onAssign,
  onEscalate,
  onClear,
}: BulkActionBarProps) => {
  const { theme } = useTheme();

  if (selectedCount === 0) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 rounded-xl shadow-2xl border animate-slide-up"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center gap-4 px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#84cc16]/20 flex items-center justify-center">
            <span className="text-xs font-bold text-[#84cc16]">{selectedCount}</span>
          </div>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            request{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>

        <div className="h-8 w-px bg-[var(--border-color)]" />

        <div className="flex gap-2">
          <button
            onClick={onApprove}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
          >
            <CheckCircle size={14} />
            Approve All
          </button>
          <button
            onClick={onReject}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            <XCircle size={14} />
            Reject All
          </button>
          <button
            onClick={onAssign}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <UserPlus size={14} />
            Assign
          </button>
          <button
            onClick={onEscalate}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <AlertTriangle size={14} />
            Escalate
          </button>
        </div>

        <div className="h-8 w-px bg-[var(--border-color)]" />

        <button
          onClick={onClear}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Clear selection"
        >
          <X size={16} className="text-[var(--text-secondary)]" />
        </button>
      </div>
    </div>
  );
};
