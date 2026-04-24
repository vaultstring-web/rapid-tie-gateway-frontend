'use client';

import React, { useState } from 'react';
import { Eye, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { AuditLog, EVENT_ACTIONS } from '@/types/admin/audit';
import { formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface AuditLogTableProps {
  logs: AuditLog[];
  loading?: boolean;
  onViewDetails?: (log: AuditLog) => void;
}

export const AuditLogTable = ({ logs, loading, onViewDetails }: AuditLogTableProps) => {
  const { theme } = useTheme();
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const getActionIcon = (action: string) => {
    const actionConfig = EVENT_ACTIONS.find(a => a.value === action);
    return actionConfig?.icon || '📋';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'failure':
        return <XCircle size={14} className="text-red-500" />;
      case 'warning':
        return <AlertCircle size={14} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'failure':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex gap-3">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Audit Logs</h3>
        <p className="text-sm text-[var(--text-secondary)]">No logs match your filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Timestamp</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">User</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Action</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Entity</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">IP Address</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Status</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
          {logs.map((log) => (
            <React.Fragment key={log.id}>
              <tr className="hover:bg-[var(--hover-bg)] transition-colors cursor-pointer" onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}>
                <td className="px-4 py-3">
                  <span className="text-sm text-[var(--text-primary)]">{formatDateTime(log.timestamp)}</span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{log.userEmail}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{log.userRole}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getActionIcon(log.action)}</span>
                    <span className="text-sm text-[var(--text-primary)] capitalize">
                      {EVENT_ACTIONS.find(a => a.value === log.action)?.label || log.action}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm text-[var(--text-primary)] capitalize">{log.entity}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-mono">{log.entityId}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-mono text-[var(--text-primary)]">{log.ipAddress}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {getStatusIcon(log.status)}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails?.(log);
                    }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Eye size={16} className="text-[var(--text-secondary)]" />
                  </button>
                </td>
              </tr>
              {expandedLog === log.id && (
                <tr className="bg-[var(--bg-primary)]">
                  <td colSpan={7} className="px-4 py-3">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[var(--text-primary)]">Changes:</p>
                      {log.changes && log.changes.length > 0 ? (
                        <div className="space-y-1">
                          {log.changes.map((change, idx) => (
                            <div key={idx} className="text-sm">
                              <span className="text-[var(--text-secondary)]">{change.field}:</span>{' '}
                              <span className="text-red-500 line-through">{String(change.oldValue)}</span>
                              {' → '}
                              <span className="text-green-500">{String(change.newValue)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-[var(--text-secondary)]">No changes recorded</p>
                      )}
                      {log.details && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-[var(--text-primary)]">Details:</p>
                          <p className="text-sm text-[var(--text-secondary)]">{log.details}</p>
                        </div>
                      )}
                      <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                        <p className="text-xs text-[var(--text-secondary)]">
                          <span className="font-medium">User Agent:</span> {log.userAgent}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                          <span className="font-medium">Hash:</span> <code className="font-mono">{log.hash.substring(0, 16)}...</code>
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Helper component
const FileText = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);