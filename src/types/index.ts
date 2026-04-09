export interface Request {
  id: string;
  requester: string;
  team: string;
  region: string;
  type: string;
  amount: number;
  urgency: 'High' | 'Medium' | 'Low';
  status: string;
  date: string;
  deadline: string;
  description: string;
  hasEventAttendance: boolean;
  eventDetails: EventDetails | null;
  dsaCalculation: DSACalculation | null;
}

export interface EventDetails {
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  attendees: number;
}

export interface DSACalculation {
  baseRate: number;
  days: number;
  multiplier: number;
  total: number;
}

export interface Decision {
  id: string;
  requestId: string;
  action: 'Approved' | 'Rejected';
  reason: string;
  approver: string;
  date: string;
}

export interface TeamSummary {
  name: string;
  pending: number;
  approved: number;
  avgTime: string;
}
