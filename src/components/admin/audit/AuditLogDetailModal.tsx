'use client';

import { X, Copy, Check } from 'lucide-react';
import { AuditLog, EVENT_ACTIONS } from '@/types/admin/audit';
import { formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface AuditLogDetailModalProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogDetailModal = ({ log, isOpen, onClose }: AuditLogDetailModalProps) => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !log) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const actionConfig = EVENT_ACTIONS.find(a => a.value === log.action);

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
            <span className="text-xl">{actionConfig?.icon || '📋'}</span>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Audit Log Details</h2>
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
              <label className="text-xs font-medium text-[var(--text-secondary)]">Log ID</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-sm font-mono text-[var(--text-primary)]">{log.id}</code>
                <button onClick={() => copyToClipboard(log.id)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-[var(--text-secondary)]" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">Timestamp</label>
              <p className="text-sm text-[var(--text-primary)] mt-1">{formatDateTime(log.timestamp)}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">User</label>
              <p className="text-sm text-[var(--text-primary)] mt-1">{log.userEmail}</p>
              <p className="text-xs text-[var(--text-secondary)]">Role: {log.userRole}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">IP Address</label>
              <p className="text-sm font-mono text-[var(--text-primary)] mt-1">{log.ipAddress}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">Action</label>
              <p className="text-sm text-[var(--text-primary)] capitalize mt-1">{actionConfig?.label || log.action}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">Entity</label>
              <p className="text-sm text-[var(--text-primary)] capitalize mt-1">{log.entity}</p>
              <p className="text-xs font-mono text-[var(--text-secondary)]">ID: {log.entityId}</p>
            </div>
          </div>

          {/* Changes */}
          {log.changes && log.changes.length > 0 && (
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Changes</h3>
              <div className="space-y-2">
                {log.changes.map((change, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[var(--bg-primary)]">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{change.field}</p>
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      <span className="text-red-500 line-through">Old: {String(change.oldValue)}</span>
                      <span>→</span>
                      <span className="text-green-500">New: {String(change.newValue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Details */}
          {log.details && (
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Details</h3>
              <p className="text-sm text-[var(--text-secondary)]">{log.details}</p>
            </div>
          )}

          {/* User Agent */}
          <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">User Agent</h3>
            <p className="text-xs text-[var(--text-secondary)] break-all">{log.userAgent}</p>
          </div>

          {/* Integrity Hashes */}
          <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Integrity Hashes</h3>
            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)]">Current Hash</label>
                <p className="text-xs font-mono text-[var(--text-primary)] break-all mt-1">{log.hash}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)]">Previous Hash</label>
                <p className="text-xs font-mono text-[var(--text-primary)] break-all mt-1">{log.previousHash}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 border-t flex justify-end" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
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