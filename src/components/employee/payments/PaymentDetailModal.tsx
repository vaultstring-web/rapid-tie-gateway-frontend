'use client';

import { X, Download } from 'lucide-react';
import { Payment, PAYMENT_TYPES, PAYMENT_METHODS, PAYMENT_STATUS_CONFIG } from '@/types/employee/payments';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface PaymentDetailModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
  onDownloadReceipt: (paymentId: string) => void;
}

export const PaymentDetailModal = ({ payment, isOpen, onClose, onDownloadReceipt }: PaymentDetailModalProps) => {
  const { theme } = useTheme();

  if (!isOpen || !payment) return null;

  const typeConfig = PAYMENT_TYPES.find(t => t.value === payment.type);
  const methodConfig = PAYMENT_METHODS.find(m => m.value === payment.paymentMethod);
  const statusConfig = PAYMENT_STATUS_CONFIG[payment.status as keyof typeof PAYMENT_STATUS_CONFIG];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          borderWidth: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{typeConfig?.icon}</span>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Payment Details</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-3xl font-bold text-[#84cc16]">{formatCurrency(payment.amount)}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{payment.reference}</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Type</span>
              <span className="text-sm text-[var(--text-primary)]">{typeConfig?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Status</span>
              <span className={`text-sm ${statusConfig?.color}`}>{statusConfig?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Payment Method</span>
              <span className="text-sm text-[var(--text-primary)]">{methodConfig?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Processed Date</span>
              <span className="text-sm text-[var(--text-primary)]">{formatDateTime(payment.processedAt)}</span>
            </div>
            {payment.completedAt && (
              <div className="flex justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Completed Date</span>
                <span className="text-sm text-[var(--text-primary)]">{formatDateTime(payment.completedAt)}</span>
              </div>
            )}
            {payment.destination && (
              <div className="flex justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Destination</span>
                <span className="text-sm text-[var(--text-primary)]">{payment.destination}</span>
              </div>
            )}
            {payment.purpose && (
              <div className="flex justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Purpose</span>
                <span className="text-sm text-[var(--text-primary)]">{payment.purpose}</span>
              </div>
            )}
            {payment.requestNumber && (
              <div className="flex justify-between">
                <span className="text-sm text-[var(--text-secondary)]">DSA Request</span>
                <span className="text-sm text-[var(--text-primary)]">{payment.requestNumber}</span>
              </div>
            )}
            {payment.recipientAccount && (
              <div className="flex justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Account Number</span>
                <span className="text-sm font-mono text-[var(--text-primary)]">{payment.recipientAccount}</span>
              </div>
            )}
            {payment.recipientPhone && (
              <div className="flex justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Phone Number</span>
                <span className="text-sm text-[var(--text-primary)]">{payment.recipientPhone}</span>
              </div>
            )}
            {payment.notes && (
              <div className="pt-2">
                <span className="text-sm text-[var(--text-secondary)]">Notes</span>
                <p className="text-sm text-[var(--text-primary)] mt-1">{payment.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 p-4 border-t flex gap-3" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          {payment.status === 'completed' && (
            <button
              onClick={() => onDownloadReceipt(payment.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#84cc16] text-[#84cc16] hover:bg-[#84cc16] hover:text-white transition-colors"
            >
              <Download size={16} />
              Download Receipt
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};