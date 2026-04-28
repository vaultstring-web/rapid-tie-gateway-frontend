'use client';

import { useState } from 'react';
import { Eye, Download } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

// Types
interface Payment {
  id: string;
  reference: string;
  requestNumber?: string;
  type: string;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  processedAt: string;
  completedAt?: string;
  destination?: string;
  purpose?: string;
  recipientAccount?: string;
  recipientPhone?: string;
  notes?: string;
}

interface PaymentsTableProps {
  payments: Payment[];
  loading?: boolean;
  onViewDetails?: (payment: Payment) => void;
  onDownloadReceipt?: (paymentId: string) => void;
}

// Constants
const PAYMENT_TYPES = [
  { value: 'dsa', label: 'DSA Payment', icon: '💰' },
  { value: 'salary', label: 'Salary', icon: '💵' },
  { value: 'reimbursement', label: 'Reimbursement', icon: '🔄' },
  { value: 'bonus', label: 'Bonus', icon: '🎁' },
];

const PAYMENT_METHODS = [
  { value: 'airtel_money', label: 'Airtel Money', icon: '📱' },
  { value: 'tnm_mpamba', label: 'TNM Mpamba', icon: '📱' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
  { value: 'cash', label: 'Cash', icon: '💵' },
];

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-600 dark:text-yellow-400', icon: '⏳' },
  processing: { label: 'Processing', color: 'text-blue-600 dark:text-blue-400', icon: '🔄' },
  completed: { label: 'Completed', color: 'text-green-600 dark:text-green-400', icon: '✅' },
  failed: { label: 'Failed', color: 'text-red-600 dark:text-red-400', icon: '❌' },
  refunded: { label: 'Refunded', color: 'text-gray-600 dark:text-gray-400', icon: '💰' },
};

export function PaymentsTable({ payments, loading, onViewDetails, onDownloadReceipt }: PaymentsTableProps) {
  const { theme } = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getTypeConfig = (type: string) => {
    return PAYMENT_TYPES.find(t => t.value === type) || PAYMENT_TYPES[0];
  };

  const getMethodConfig = (method: string) => {
    return PAYMENT_METHODS.find(m => m.value === method) || PAYMENT_METHODS[0];
  };

  const getStatusConfig = (status: string) => {
    return PAYMENT_STATUS_CONFIG[status] || PAYMENT_STATUS_CONFIG.pending;
  };

  // Loading state
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

  // Empty state
  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]"
        >
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Payments Found</h3>
        <p className="text-sm text-[var(--text-secondary)]">No payment history available</p>
      </div>
    );
  }

  // Main render
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Reference</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Type</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Date</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Method</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Status</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
          {payments.map((payment) => {
            const typeConfig = getTypeConfig(payment.type);
            const methodConfig = getMethodConfig(payment.paymentMethod);
            const statusConfig = getStatusConfig(payment.status);
            const isExpanded = expandedId === payment.id;
            
            return (
              <>
                <tr 
                  key={payment.id}
                  className="hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : payment.id)}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-mono font-medium text-[var(--text-primary)]">{payment.reference}</p>
                      {payment.requestNumber && (
                        <p className="text-xs text-[var(--text-secondary)]">DSA: {payment.requestNumber}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-lg">{typeConfig.icon}</span>
                      <span className="text-sm text-[var(--text-primary)]">{typeConfig.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[var(--text-primary)]">{formatDateTime(payment.processedAt)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-semibold text-[#84cc16]">{formatCurrency(payment.amount)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-lg">{methodConfig.icon}</span>
                      <span className="text-sm text-[var(--text-primary)]">{methodConfig.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span>{statusConfig.icon}</span>
                      <span className={`text-xs ${statusConfig.color}`}>{statusConfig.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails?.(payment);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} className="text-[var(--text-secondary)]" />
                      </button>
                      {payment.status === 'completed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownloadReceipt?.(payment.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          title="Download Receipt"
                        >
                          <Download size={16} className="text-[var(--text-secondary)]" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {isExpanded && (
                  <tr key={`${payment.id}-expanded`} className="bg-[var(--bg-primary)]">
                    <td colSpan={7} className="px-4 py-3">
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {payment.destination && (
                            <div>
                              <span className="text-[var(--text-secondary)]">Destination:</span>
                              <span className="ml-2 text-[var(--text-primary)]">{payment.destination}</span>
                            </div>
                          )}
                          {payment.purpose && (
                            <div>
                              <span className="text-[var(--text-secondary)]">Purpose:</span>
                              <span className="ml-2 text-[var(--text-primary)]">{payment.purpose}</span>
                            </div>
                          )}
                          {payment.recipientAccount && (
                            <div>
                              <span className="text-[var(--text-secondary)]">Account:</span>
                              <span className="ml-2 text-[var(--text-primary)]">{payment.recipientAccount}</span>
                            </div>
                          )}
                          {payment.recipientPhone && (
                            <div>
                              <span className="text-[var(--text-secondary)]">Phone:</span>
                              <span className="ml-2 text-[var(--text-primary)]">{payment.recipientPhone}</span>
                            </div>
                          )}
                          {payment.completedAt && (
                            <div>
                              <span className="text-[var(--text-secondary)]">Completed:</span>
                              <span className="ml-2 text-[var(--text-primary)]">{formatDateTime(payment.completedAt)}</span>
                            </div>
                          )}
                          {payment.notes && (
                            <div className="col-span-2">
                              <span className="text-[var(--text-secondary)]">Notes:</span>
                              <span className="ml-2 text-[var(--text-primary)]">{payment.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}