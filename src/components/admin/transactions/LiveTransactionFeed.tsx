'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Eye,
  Ban,
  Check,
  ExternalLink
} from 'lucide-react';
import { Transaction, TRANSACTION_STATUS_CONFIG, PAYMENT_METHODS } from '@/types/admin/transactions';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface LiveTransactionFeedProps {
  transactions: Transaction[];
  loading?: boolean;
  onHold?: (transactionId: string) => void;
  onApprove?: (transactionId: string) => void;
  onViewDetails?: (transaction: Transaction) => void;
  autoScroll?: boolean;
}

export const LiveTransactionFeed = ({
  transactions,
  loading,
  onHold,
  onApprove,
  onViewDetails,
  autoScroll = true,
}: LiveTransactionFeedProps) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (autoScroll && !paused && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transactions, autoScroll, paused]);

  const getStatusIcon = (status: string) => {
    const config = TRANSACTION_STATUS_CONFIG[status as keyof typeof TRANSACTION_STATUS_CONFIG];
    return config?.icon || '📋';
  };

  const getStatusColor = (status: string) => {
    const config = TRANSACTION_STATUS_CONFIG[status as keyof typeof TRANSACTION_STATUS_CONFIG];
    return config?.color || '';
  };

  const getPaymentMethodIcon = (method: string) => {
    const pm = PAYMENT_METHODS.find(m => m.value === method);
    return pm?.icon || '💳';
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading && transactions.length === 0) {
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

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Transactions</h3>
        <p className="text-sm text-[var(--text-secondary)]">No transactions match your filters</p>
      </div>
    );
  }

  return (
    <div>
      {/* Auto-scroll Controls */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-[var(--text-secondary)]">Live Feed</span>
        </div>
        <button
          onClick={() => setPaused(!paused)}
          className="text-xs px-2 py-1 rounded border"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
        >
          {paused ? 'Resume Auto-scroll' : 'Pause Auto-scroll'}
        </button>
      </div>

      {/* Transaction Feed */}
      <div
        ref={containerRef}
        className="space-y-3 max-h-[600px] overflow-y-auto pr-2"
        style={{ scrollBehavior: 'smooth' }}
      >
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`rounded-xl p-4 border transition-all hover:shadow-md ${
              transaction.isAnomaly ? 'border-orange-500/50 bg-orange-50/10 dark:bg-orange-900/10' : ''
            }`}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex flex-wrap gap-4 justify-between">
              {/* Left Section */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-[var(--text-secondary)]">{transaction.reference}</span>
                  {transaction.event && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                      🎫 {transaction.event.name}
                    </span>
                  )}
                  {transaction.isAnomaly && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 flex items-center gap-1">
                      <AlertTriangle size={10} />
                      Anomaly Detected
                    </span>
                  )}
                  <span className="text-xs flex items-center gap-1">
                    <span>{getPaymentMethodIcon(transaction.paymentMethod)}</span>
                    <span className="text-[var(--text-secondary)]">
                      {PAYMENT_METHODS.find(m => m.value === transaction.paymentMethod)?.label}
                    </span>
                  </span>
                </div>

                <div className="mt-2">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {transaction.customer.name}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">{transaction.customer.email}</p>
                </div>

                {transaction.merchant && (
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Merchant: {transaction.merchant.name}
                  </p>
                )}

                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-secondary)]">
                  <span>{formatDateTime(transaction.createdAt)}</span>
                  <span className="capitalize">{transaction.type}</span>
                </div>
              </div>

              {/* Right Section */}
              <div className="text-right">
                <p className="text-xl font-bold text-[#84cc16]">{formatCurrency(transaction.amount)}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span>{getStatusIcon(transaction.status)}</span>
                  <span className={`text-xs font-medium ${getStatusColor(transaction.status)}`}>
                    {TRANSACTION_STATUS_CONFIG[transaction.status as keyof typeof TRANSACTION_STATUS_CONFIG]?.label}
                  </span>
                </div>
                {transaction.riskScore > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-xs text-[var(--text-secondary)]">Risk Score</span>
                      <span className="text-xs font-medium">{transaction.riskScore}%</span>
                    </div>
                    <div className="w-24 h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden mt-0.5">
                      <div
                        className={`h-full rounded-full ${getRiskColor(transaction.riskScore)}`}
                        style={{ width: `${transaction.riskScore}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button
                onClick={() => onViewDetails?.(transaction)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                <Eye size={14} />
                View
              </button>
              {transaction.status === 'pending' && (
                <>
                  <button
                    onClick={() => onHold?.(transaction.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 transition-colors"
                  >
                    <Ban size={14} />
                    Hold
                  </button>
                  <button
                    onClick={() => onApprove?.(transaction.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                  >
                    <Check size={14} />
                    Approve
                  </button>
                </>
              )}
              {transaction.event && (
                <Link
                  href={`/events/${transaction.event.id}`}
                  target="_blank"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-auto"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <ExternalLink size={14} />
                  View Event
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Live Indicator */}
      {!paused && transactions.length > 0 && (
        <div className="text-center mt-4">
          <span className="inline-flex items-center gap-1 text-xs text-green-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live updates
          </span>
        </div>
      )}
    </div>
  );
};