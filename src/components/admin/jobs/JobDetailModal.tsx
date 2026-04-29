'use client';

import { X, Copy, Check } from 'lucide-react';
import { FailedJob } from '@/types/admin/jobs';
import { formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface JobDetailModalProps {
  job: FailedJob | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JobDetailModal = ({ job, isOpen, onClose }: JobDetailModalProps) => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !job) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          borderWidth: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Job Details</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">Job ID</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-sm font-mono text-[var(--text-primary)]">{job.id}</code>
                <button
                  onClick={() => copyToClipboard(job.id)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-[var(--text-secondary)]" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">Job Name</label>
              <p className="text-sm font-mono text-[var(--text-primary)] mt-1">{job.name}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">Queue</label>
              <p className="text-sm text-[var(--text-primary)] mt-1 capitalize">{job.queue}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">Failed At</label>
              <p className="text-sm text-[var(--text-primary)] mt-1">{formatDateTime(job.failedAt)}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">Attempts</label>
              <p className="text-sm text-[var(--text-primary)] mt-1">{job.attempts} / {job.maxAttempts}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">Retry Available</label>
              <p className="text-sm mt-1">{job.retryAvailable ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {/* Failed Reason */}
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)]">Failed Reason</label>
            <div className="mt-1 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300">{job.failedReason}</p>
            </div>
          </div>

          {/* Stack Trace */}
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)]">Stack Trace</label>
            <div className="mt-1">
              <pre className="p-4 rounded-lg overflow-x-auto text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]">
                {job.stackTrace || 'No stack trace available'}
              </pre>
              <button
                onClick={() => copyToClipboard(job.stackTrace || '')}
                className="mt-2 text-xs text-[#84cc16] hover:underline"
              >
                Copy Stack Trace
              </button>
            </div>
          </div>

          {/* Job Data */}
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)]">Job Data</label>
            <pre className="mt-1 p-4 rounded-lg overflow-x-auto text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]">
              {JSON.stringify(job.data, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 border-t flex justify-end gap-3" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};