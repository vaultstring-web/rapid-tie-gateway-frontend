// src/lib/mockData/requests.ts
import { Request, TeamSummary, Decision } from '@/types';

export const MOCK_REQUESTS: Request[] = [
  {
    id: 'REQ-2024-001',
    requester: 'John Doe',
    team: 'Sales',
    region: 'North America',
    type: 'Travel',
    amount: 1250,
    urgency: 'High',
    status: 'Pending',
    date: '2024-01-15',
    deadline: '2024-01-20',
    description: 'Business trip to New York for client meeting. Need to discuss annual contract renewal.',
    hasEventAttendance: false,
    eventDetails: null,
    dsaCalculation: {
      baseRate: 150,
      days: 5,
      multiplier: 1.2,
      total: 900
    }
  },
  // ... rest of your mock requests
];

export const MOCK_DECISIONS: Decision[] = [
  // ... your decisions
];

export const MOCK_TEAM_SUMMARY: TeamSummary[] = [
  // ... your team summary
];