export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'held' | 'approved';
  type: 'payment' | 'refund' | 'disbursement';
  paymentMethod: 'airtel_money' | 'tnm_mpamba' | 'card' | 'bank_transfer';
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  merchant?: {
    id: string;
    name: string;
  };
  event?: {
    id: string;
    name: string;
    date: string;
  };
  riskScore: number;
  isAnomaly: boolean;
  anomalyReason?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface TransactionFilter {
  search: string;
  status: string;
  type: string;
  paymentMethod: string;
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: string;
  dateTo?: string;
  isAnomaly: boolean;
  eventId?: string;
}

export interface TransactionStats {
  total: number;
  pending: number;
  completed: number;
  failed: number;
  held: number;
  approved: number;
  totalVolume: number;
  averageAmount: number;
  anomalyCount: number;
}

export const TRANSACTION_STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: '⏳' },
  processing: { label: 'Processing', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: '🔄' },
  completed: { label: 'Completed', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: '✅' },
  failed: { label: 'Failed', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: '❌' },
  held: { label: 'Held', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', icon: '⏸️' },
  approved: { label: 'Approved', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: '✓' },
};

export const PAYMENT_METHODS = [
  { value: 'airtel_money', label: 'Airtel Money', icon: '📱', color: '#ff6600' },
  { value: 'tnm_mpamba', label: 'TNM Mpamba', icon: '📱', color: '#00a651' },
  { value: 'card', label: 'Card', icon: '💳', color: '#3b82f6' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦', color: '#6b7280' },
];

export const TRANSACTION_TYPES = [
  { value: 'payment', label: 'Payment', icon: '💰' },
  { value: 'refund', label: 'Refund', icon: '↩️' },
  { value: 'disbursement', label: 'Disbursement', icon: '📤' },
];