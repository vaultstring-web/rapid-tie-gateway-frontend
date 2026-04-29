export interface MonthlyTrend {
  month: string;
  approved: number;
  rejected: number;
  pending: number;
  total: number;
  approvalRate: number;
}

export interface WorkloadData {
  name: string;
  value: number;
  color: string;
}

export interface DepartmentPerformance {
  department: string;
  totalRequests: number;
  approved: number;
  rejected: number;
  approvalRate: number;
  avgResponseTime: number;
  totalAmount: number;
}

export interface TopApprover {
  id: string;
  name: string;
  role: string;
  approvals: number;
  rejections: number;
  approvalRate: number;
  avgResponseTime: number;
  totalAmount: number;
}

export interface AnalyticsSummary {
  totalRequests: number;
  totalApproved: number;
  totalRejected: number;
  overallApprovalRate: number;
  avgResponseTime: number;
  totalAmountApproved: number;
  pendingRequests: number;
  thisMonthApproved: number;
  thisMonthRejected: number;
  lastMonthApproved: number;
  lastMonthRejected: number;
  monthOverMonthGrowth: number;
}

export interface PeakHoursData {
  hour: string;
  requests: number;
  approvals: number;
}