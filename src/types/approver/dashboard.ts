export interface PendingRequest {
  id: string;
  requestNumber: string;
  employeeName: string;
  employeeId: string;
  department: string;
  destination: string;
  duration: number;
  amount: number;
  submittedAt: string;
  urgency: 'high' | 'medium' | 'low';
  daysPending: number;
  travelDate: string;
}

export interface UrgencyCount {
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  approvalRate: number;
  avatar?: string;
}

export interface Decision {
  id: string;
  requestNumber: string;
  employeeName: string;
  destination: string;
  amount: number;
  decision: 'approved' | 'rejected';
  decidedAt: string;
  comments?: string;
}

export interface RegionEvent {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  requestCount: number;
  pendingCount: number;
}

export interface DashboardStats {
  urgencyCounts: UrgencyCount;
  approvalRate: number;
  totalDecisions: number;
  averageResponseTime: number; // in hours
}

export interface DashboardData {
  stats: DashboardStats;
  pendingRequests: PendingRequest[];
  teamMembers: TeamMember[];
  recentDecisions: Decision[];
  regionEvents: RegionEvent[];
}