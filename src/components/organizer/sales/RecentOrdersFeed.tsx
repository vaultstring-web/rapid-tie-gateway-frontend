'use client';

import { useState } from 'react';
import { RefreshCw, ExternalLink, CheckCircle, Clock, XCircle } from 'lucide-react';
import { RecentOrder } from '@/types/organizer/salesDashboard';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface RecentOrdersFeedProps {
  orders: RecentOrder[];
  loading?: boolean;
  onRefresh?: () => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle size={14} className="text-green-500" />;
    case 'pending':
      return <Clock size={14} className="text-yellow-500" />;
    case 'refunded':
      return <XCircle size={14} className="text-red-500" />;
    default:
      return null;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'pending':
      return 'Pending';
    case 'refunded':
      return 'Refunded';
    default:
      return status;
  }
};

export const RecentOrdersFeed = ({ orders, loading, onRefresh }: RecentOrdersFeedProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              </div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          Recent Transactions
        </h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <RefreshCw size={14} />
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No recent orders</p>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="rounded-xl p-4 border transition-all hover:shadow-md"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {order.customerName}
                  </p>
                  <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                    #{order.orderNumber}
                  </p>
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {order.tierName} x {order.quantity}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {formatDate(order.purchasedAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary-green-500">
                  {formatCurrency(order.amount)}
                </p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  {getStatusIcon(order.status)}
                  <span className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};