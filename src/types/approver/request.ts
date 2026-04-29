export interface ApprovalRequest {
  id: string;
  requestNumber: string;
  employeeName: string;
  employeeId: string;
  employeeAvatar?: string;
  employeeEmail: string;
  employeePhone: string;
  department: string;
  position: string;
  supervisorName: string;
  destination: string;
  purpose: string;
  startDate: string;
  endDate: string;
  duration: number;
  amount: number;
  perDiemRate: number;
  accommodationRate?: number;
  otherExpenses?: number;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'revision';
  submittedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  urgency: 'high' | 'medium' | 'low';
  deadline: string;
  travelAuthorizationRef?: string;
  hasEventAttendance: boolean;
  eventDetails?: {
    id: string;
    name: string;
    description: string;
    date: string;
    location: string;
    registrationFee?: number;
    isRequired: boolean;
  };
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  comments?: string;
  approvalHistory?: {
    id: string;
    action: 'submitted' | 'approved' | 'rejected' | 'revision';
    by: string;
    role: string;
    timestamp: string;
    comments?: string;
  }[];
  notes?: string;
}

export interface DecisionData {
  action: 'approved' | 'rejected' | 'revision';
  reason: string;
  notes?: string;
}

export const URGENCY_CONFIG = {
  high: { label: 'High', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
  medium: { label: 'Medium', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  low: { label: 'Low', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
};