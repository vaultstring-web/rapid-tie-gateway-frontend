'use client';

import { X, Copy, Check } from 'lucide-react';
import { Transaction, TRANSACTION_STATUS_CONFIG, PAYMENT_METHODS } from '@/types/admin/transactions';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionDetailModal = ({ transaction, isOpen, onClose }: TransactionDetailModalProps) => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !transaction) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const statusConfig = TRANSACTION_STATUS_CONFIG[transaction.status as keyof typeof TRANSACTION_STATUS_CONFIG];
  const paymentMethod = PAYMENT_METHODS.find(m => m.value === transaction.paymentMethod);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          borderWidth: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Transaction Details</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono text-[var(--text-primary)]">{transaction.reference}</code>
                <button onClick={() => copyToClipboard(transaction.reference)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-[var(--text-secondary)]" />}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs ${statusConfig?.bg} ${statusConfig?.color}`}>
                  {statusConfig?.icon} {statusConfig?.label}
                </span>
                {transaction.isAnomaly && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                    ⚠️ Anomaly Detected
                  </span>
                )}
              </div>
            </div>
            <p className="text-2xl font-bold text-[#84cc16]">{formatCurrency(transaction.amount)}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">Transaction Type</label>
              <p className="text-sm text-[var(--text-primary)] capitalize mt-1">{transaction.type}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">Payment Method</label>
              <p className="text-sm text-[var(--text-primary)] mt-1">{paymentMethod?.label} {paymentMethod?.icon}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">Created At</label>
              <p className="text-sm text-[var(--text-primary)] mt-1">{formatDateTime(transaction.createdAt)}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">Updated At</label>
              <p className="text-sm text-[var(--text-primary)] mt-1">{formatDateTime(transaction.updatedAt)}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)]">Name</label>
                <p className="text-sm text-[var(--text-primary)] mt-1">{transaction.customer.name}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)]">Email</label>
                <p className="text-sm text-[var(--text-primary)] mt-1">{transaction.customer.email}</p>
              </div>
              {transaction.customer.phone && (
                <div>
                  <label className="text-xs font-medium text-[var(--text-secondary)]">Phone</label>
                  <p className="text-sm text-[var(--text-primary)] mt-1">{transaction.customer.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Merchant/Event Info */}
          {(transaction.merchant || transaction.event) && (
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Related Entities</h3>
              {transaction.merchant && (
                <div className="mb-3">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">Merchant</label>
                  <p className="text-sm text-[var(--text-primary)] mt-1">{transaction.merchant.name}</p>
                </div>
              )}
              {transaction.event && (
                <div>
                  <label className="text-xs font-medium text-[var(--text-secondary)]">Event</label>
                  <p className="text-sm text-[var(--text-primary)] mt-1">{transaction.event.name}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{formatDateTime(transaction.event.date)}</p>
                </div>
              )}
            </div>
          )}

          {/* Anomaly Reason */}
          {transaction.isAnomaly && transaction.anomalyReason && (
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Anomaly Reason</h3>
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-700 dark:text-orange-300">{transaction.anomalyReason}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Additional Metadata</h3>
              <pre className="p-3 rounded-lg text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] overflow-x-auto">
                {JSON.stringify(transaction.metadata, null, 2)}
              </pre>
            </div>
          )}
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