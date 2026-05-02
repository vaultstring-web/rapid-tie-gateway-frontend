export interface Batch {
  id: string;
  batchNumber: string;
  department: string;
  totalAmount: number;
  totalRecipients: number;
  successfulCount: number;
  failedCount: number;
  pendingCount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'partial';
  progress: number;
  createdAt: string;
  completedAt?: string;
  processedBy: string;
  failureReason?: string;
  items: BatchItem[];
}

export interface BatchItem {
  id: string;
  recipientName: string;
  recipientPhone: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  errorMessage?: string;
  retryCount: number;
  processedAt?: string;
}

export interface BatchSummary {
  totalBatches: number;
  totalAmount: number;
  totalRecipients: number;
  successRate: number;
  pendingBatches: number;
  processingBatches: number;
  completedBatches: number;
  failedBatches: number;
}

export type BatchStatus = 'all' | 'pending' | 'processing' | 'completed' | 'failed' | 'partial';

export const BATCH_STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: '⏳' },
  processing: { label: 'Processing', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: '🔄' },
  completed: { label: 'Completed', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: '✅' },
  failed: { label: 'Failed', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: '❌' },
  partial: { label: 'Partial', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', icon: '⚠️' },
};