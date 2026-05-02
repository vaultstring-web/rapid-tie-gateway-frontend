export interface DepartmentBudget {
  department: string;
  allocated: number;
  spent: number;
  committed: number;
  remaining: number;
  percentageUsed: number;
  color: string;
}

export interface EventSpending {
  month: string;
  eventSpending: number;
  regularSpending: number;
  total: number;
}

export interface PendingDisbursement {
  id: string;
  batchNumber: string;
  department: string;
  amount: number;
  recipientCount: number;
  submittedAt: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'processing' | 'approved';
}

export interface ReconciliationStatus {
  id: string;
  period: string;
  totalTransactions: number;
  matchedCount: number;
  unmatchedCount: number;
  amountMatched: number;
  amountUnmatched: number;
  status: 'completed' | 'pending' | 'in_progress';
  lastUpdated: string;
}

export interface RecentBatch {
  id: string;
  batchNumber: string;
  department: string;
  totalAmount: number;
  recipientCount: number;
  status: 'completed' | 'processing' | 'pending' | 'failed';
  createdAt: string;
  processedBy: string;
}

export interface FinanceSummary {
  totalBudget: number;
  totalSpent: number;
  totalCommitted: number;
  remainingBudget: number;
  budgetUtilization: number;
  pendingDisbursements: number;
  pendingAmount: number;
  completedDisbursements: number;
  completedAmount: number;
  reconciliationRate: number;
}

export const DEPARTMENT_COLORS = {
  'Finance': '#84cc16',
  'Operations': '#3b82f6',
  'HR': '#8b5cf6',
  'IT': '#06b6d4',
  'Sales': '#f59e0b',
  'Marketing': '#ec4899',
  'Field Operations': '#ef4444',
  'Administration': '#6b7280',
};