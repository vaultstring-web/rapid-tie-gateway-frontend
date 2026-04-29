'use client';

import { Loader2, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { PaymentStatus as PaymentStatusType } from '@/types/events/checkout';
import { useTheme } from '@/context/ThemeContext';

interface PaymentStatusProps {
  status: PaymentStatusType;
}

export const PaymentStatus = ({ status }: PaymentStatusProps) => {
  const { theme } = useTheme();

  if (status.state === 'idle') return null;

  const getIcon = () => {
    switch (status.state) {
      case 'processing':
        return <Loader2 size={32} className="animate-spin text-primary-green-500" />;
      case 'success':
        return <CheckCircle size={32} className="text-green-500" />;
      case 'error':
        return <XCircle size={32} className="text-red-500" />;
      default:
        return <CreditCard size={32} className="text-primary-green-500" />;
    }
  };

  const getTitle = () => {
    switch (status.state) {
      case 'processing':
        return 'Processing Payment';
      case 'success':
        return 'Payment Successful!';
      case 'error':
        return 'Payment Failed';
      default:
        return '';
    }
  };

  const getBgColor = () => {
    switch (status.state) {
      case 'processing':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return '';
    }
  };

  return (
    <div className={`rounded-xl p-6 text-center border ${getBgColor()}`}>
      <div className="flex flex-col items-center gap-3">
        {getIcon()}
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {getTitle()}
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {status.message}
        </p>
        {status.transactionId && (
          <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
            Transaction ID: {status.transactionId}
          </p>
        )}
      </div>
    </div>
  );
};