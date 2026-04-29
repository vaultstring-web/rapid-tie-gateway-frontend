export interface ApprovedRequest {
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
  approvedAmount: number;
  approvedAt: string;
  approvedBy: string;
  approverRole: string;
  urgency: 'high' | 'medium' | 'low';
  hasEventAttendance: boolean;
  eventName?: string;
  paymentStatus: 'paid' | 'pending' | 'processing';
  paymentDate?: string;
  paymentReference?: string;
  notes?: string;
}

export interface ApprovedRequestFilters {
  department: string;
  destination: string;
  dateFrom: string;
  dateTo: string;
  minAmount: number;
  maxAmount: number;
  paymentStatus: string;
}

export const URGENCY_CONFIG = {
  high: { label: 'High', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
  medium: { label: 'Medium', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  low: { label: 'Low', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
};

export const PAYMENT_STATUS_CONFIG = {
  paid: { label: 'Paid', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: '✅' },
  pending: { label: 'Pending', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: '⏳' },
  processing: { label: 'Processing', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: '🔄' },
};

export const DEPARTMENTS = [
  'Finance', 'Operations', 'HR', 'IT', 'Sales', 'Marketing', 'Field Operations', 'Administration'
];

export const DESTINATIONS = [
  'Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Mangochi', 'Karonga', 'Salima', 'Kasungu', 'Dedza'
];