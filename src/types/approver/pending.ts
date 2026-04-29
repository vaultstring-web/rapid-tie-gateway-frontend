export interface PendingRequest {
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
  perDiemRate: number;
  accommodationRate?: number;
  submittedAt: string;
  daysPending: number;
  urgency: 'high' | 'medium' | 'low';
  deadline: string;
  hasEventAttendance: boolean;
  eventDetails?: {
    id: string;
    name: string;
    date: string;
    location: string;
  };
  travelAuthorizationRef?: string;
  attachments?: string[];
  comments?: string;
}

export interface FilterOptions {
  department: string;
  destination: string;
  urgency: string;
  dateRange: string;
  minAmount: number;
  maxAmount: number;
  hasEvent: boolean;
}

export interface BulkAction {
  type: 'approve' | 'reject' | 'assign' | 'escalate';
  selectedIds: string[];
}

export const URGENCY_CONFIG = {
  high: { label: 'High', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-200 dark:border-red-800' },
  medium: { label: 'Medium', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-200 dark:border-yellow-800' },
  low: { label: 'Low', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-200 dark:border-green-800' },
};

export const DEPARTMENTS = [
  'Finance', 'Operations', 'HR', 'IT', 'Sales', 'Marketing', 'Field Operations', 'Administration'
];

export const DESTINATIONS = [
  'Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Mangochi', 'Karonga', 'Salima', 'Kasungu', 'Dedza'
];