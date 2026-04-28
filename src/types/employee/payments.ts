export interface Payment {
  id: string;
  transactionId: string;
  reference: string;
  requestId?: string;
  requestNumber?: string;
  amount: number;
  currency: string;
  type: 'dsa' | 'salary' | 'reimbursement' | 'bonus';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: 'bank_transfer' | 'airtel_money' | 'tnm_mpamba' | 'cash';
  recipientName: string;
  recipientAccount?: string;
  recipientPhone?: string;
  destination?: string;
  purpose?: string;
  notes?: string;
  processedAt: string;
  completedAt?: string;
  createdAt: string;
}

export interface PaymentFilter {
  search: string;
  type: string;
  status: string;
  paymentMethod: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  averageAmount: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  lastPaymentDate?: string;
}

export const PAYMENT_TYPES = [
  { value: 'dsa', label: 'DSA Disbursement', icon: '✈️', color: 'text-blue-500' },
  { value: 'salary', label: 'Salary', icon: '💰', color: 'text-green-500' },
  { value: 'reimbursement', label: 'Reimbursement', icon: '🔄', color: 'text-purple-500' },
  { value: 'bonus', label: 'Bonus', icon: '🎉', color: 'text-yellow-500' },
];

export const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦', color: 'text-blue-500' },
  { value: 'airtel_money', label: 'Airtel Money', icon: '📱', color: '#ff6600' },
  { value: 'tnm_mpamba', label: 'TNM Mpamba', icon: '📱', color: '#00a651' },
  { value: 'cash', label: 'Cash', icon: '💵', color: 'text-green-500' },
];

export const PAYMENT_STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: '⏳' },
  processing: { label: 'Processing', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: '🔄' },
  completed: { label: 'Completed', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: '✅' },
  failed: { label: 'Failed', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: '❌' },
};