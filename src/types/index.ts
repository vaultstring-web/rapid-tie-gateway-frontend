// src/types/index.ts

export interface Disbursement {
  id: string;
  recipient: string;
  amount: number;
  type: string;
  status: 'Ready' | 'Pending' | 'Completed' | 'Failed';
  validationStatus: 'Valid' | 'Invalid' | 'Pending';
  event?: string;
}

export interface Budget {
  id: string;
  department: string;
  total: number;
  spent: number;
  committed: number;
  events: EventBudget[];
}

export interface EventBudget {
  name: string;
  budget: number;
  spent: number;
}

export interface Batch {
  id: string;
  name: string;
  status: 'Completed' | 'Processing' | 'Failed';
  totalAmount: number;
  itemCount: number;
  successCount: number;
  failureCount: number;
  progress: number;
  createdAt: string;
}

export interface SpendingTrend {
  month: string;
  total: number;
  event: number;
}

// Existing types from your app
export interface Request {
  id: string;
  requester: string;
  team: string;
  region: string;
  type: string;
  amount: number;
  urgency: string;
  status: string;
  date: string;
  deadline: string;
  description: string;
  hasEventAttendance: boolean;
  eventDetails: {
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    attendees: number;
  } | null;
  dsaCalculation: {
    baseRate: number;
    days: number;
    multiplier: number;
    total: number;
  } | null;
}

export interface TeamSummary {
  name: string;
  pending: number;
  approved: number;
  avgTime: string;
}

export interface Decision {
  id: string;
  requestId: string;
  action: string;
  reason: string;
  approver: string;
  date: string;
}