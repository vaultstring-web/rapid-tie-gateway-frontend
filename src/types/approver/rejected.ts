export interface RejectedRequest {
  id: string;
  requestNumber: string;
  employeeName: string;
  employeeId: string;
  employeeAvatar?: string;
  department: string;
  destination: string;
  purpose: string;
  startDate: string;
  endDate: string;
  duration: number;
  amount: number;
  rejectedAt: string;
  rejectedBy: string;
  approverRole: string;
  rejectionReason: string;
  rejectionCategory: 'invalid_request' | 'missing_info' | 'policy_violation' | 'budget_constraint' | 'other';
  urgency: 'high' | 'medium' | 'low';
  hasEventAttendance: boolean;
  eventName?: string;
  canResubmit: boolean;
  resubmitDeadline?: string;
  notes?: string;
}

export interface RejectedRequestFilters {
  department: string;
  destination: string;
  rejectionCategory: string;
  dateFrom: string;
  dateTo: string;
  minAmount: number;
  maxAmount: number;
}

export const REJECTION_CATEGORIES = {
  invalid_request: { label: 'Invalid Request', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
  missing_info: { label: 'Missing Information', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  policy_violation: { label: 'Policy Violation', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  budget_constraint: { label: 'Budget Constraint', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  other: { label: 'Other', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800' },
};

export const URGENCY_CONFIG = {
  high: { label: 'High', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
  medium: { label: 'Medium', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  low: { label: 'Low', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
};

export const DEPARTMENTS = [
  'Finance', 'Operations', 'HR', 'IT', 'Sales', 'Marketing', 'Field Operations', 'Administration'
];

export const DESTINATIONS = [
  'Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Mangochi', 'Karonga', 'Salima', 'Kasungu', 'Dedza'
];