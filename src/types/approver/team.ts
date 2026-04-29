export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'on_leave';
  metrics: {
    totalApproved: number;
    totalRejected: number;
    totalPending: number;
    approvalRate: number;
    averageResponseTime: number; // in hours
    totalAmountApproved: number;
  };
  recentDecisions: {
    id: string;
    requestNumber: string;
    employeeName: string;
    amount: number;
    decision: 'approved' | 'rejected';
    decidedAt: string;
  }[];
}

export interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  totalApproved: number;
  totalRejected: number;
  totalPending: number;
  overallApprovalRate: number;
  totalAmountApproved: number;
  averageResponseTime: number;
}

export interface TeamActivity {
  id: string;
  memberName: string;
  action: 'approved' | 'rejected' | 'joined' | 'reviewed';
  requestNumber?: string;
  employeeName?: string;
  amount?: number;
  timestamp: string;
}

export const ROLES = [
  'Finance Manager', 'Senior Approver', 'Approver', 'Trainee Approver', 'Department Head'
];

export const DEPARTMENTS = [
  'Finance', 'Operations', 'HR', 'IT', 'Sales', 'Marketing', 'Field Operations', 'Administration'
];