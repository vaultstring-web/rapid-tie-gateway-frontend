'use client';

import React from 'react';
import { Eye, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';

interface FlaggedTransaction {
  id: string;
  reference: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  ruleName: string;
  riskScore: number;
  reason: string;
  status: string;
  flaggedAt: string;
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

interface FlaggedTransactionsTableProps {
  transactions: FlaggedTransaction[];
  loading?: boolean;
  onReview?: (transaction: FlaggedTransaction) => void;
}

export const FlaggedTransactionsTable = ({ 
  transactions, 
  loading, 
  onReview 
}: FlaggedTransactionsTableProps) => {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: Clock };
      case 'reviewed':
        return { label: 'Reviewed', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: Eye };
      case 'approved':
        return { label: 'Approved', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle };
      case 'blocked':
        return { label: 'Blocked', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle };
      default:
        return { label: status, color: 'text-gray-600', bg: 'bg-gray-100', icon: AlertTriangle };
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse bg-gray-100 dark:bg-gray-800">
            <div className="flex gap-3">
              <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32" />
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-48" />
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
        <CheckCircle size={48} className="mx-auto mb-4 opacity-50 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Flagged Transactions</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">All transactions are currently clean</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Transaction</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Rule</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Risk</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Flagged At</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.map((tx) => {
            const statusConfig = getStatusConfig(tx.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <React.Fragment key={tx.id}>
                <tr 
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(expandedId === tx.id ? null : tx.id)}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-mono font-medium text-gray-900 dark:text-white">{tx.reference}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(tx.amount)}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.customerName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{tx.customerEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{tx.ruleName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{tx.reason}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{tx.riskScore}%</span>
                      <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
                        <div className={`h-full rounded-full ${getRiskColor(tx.riskScore)}`} style={{ width: `${tx.riskScore}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{formatDateTime(tx.flaggedAt)}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <StatusIcon size={14} className={statusConfig.color} />
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReview?.(tx);
                      }}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Eye size={16} className="text-gray-500 dark:text-gray-400" />
                    </button>
                  </td>
                </tr>
                {expandedId === tx.id && tx.notes && (
                  <tr className="bg-gray-50 dark:bg-gray-800/30">
                    <td colSpan={7} className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <MessageSquare size={14} className="text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Review Notes</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{tx.notes}</p>
                          {tx.reviewedBy && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              Reviewed by: {tx.reviewedBy} at {formatDateTime(tx.reviewedAt!)}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Helper component
const MessageSquare = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);