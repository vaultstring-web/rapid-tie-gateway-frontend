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
  {
    id: 'REQ-2024-002',
    requester: 'Jane Smith',
    team: 'Marketing',
    region: 'Europe',
    type: 'Event',
    amount: 5000,
    urgency: 'Medium',
    status: 'Pending',
    date: '2024-01-16',
    deadline: '2024-01-25',
    description: 'Marketing conference in London. Booth setup and promotional materials.',
    hasEventAttendance: true,
    eventDetails: {
      name: 'Digital Marketing Summit 2024',
      location: 'London, UK',
      startDate: '2024-02-10',
      endDate: '2024-02-12',
      attendees: 250
    },
    dsaCalculation: null
  },
  {
    id: 'REQ-2024-003',
    requester: 'Mike Johnson',
    team: 'Engineering',
    region: 'Asia Pacific',
    type: 'Equipment',
    amount: 3200,
    urgency: 'Low',
    status: 'Pending',
    date: '2024-01-14',
    deadline: '2024-01-30',
    description: 'New laptops for development team. 4 units needed for new hires.',
    hasEventAttendance: false,
    eventDetails: null,
    dsaCalculation: null
  },
  {
    id: 'REQ-2024-004',
    requester: 'Sarah Williams',
    team: 'Sales',
    region: 'Global',
    type: 'Travel',
    amount: 2800,
    urgency: 'High',
    status: 'Pending',
    date: '2024-01-17',
    deadline: '2024-01-19',
    description: 'Urgent client visit to Tokyo. Last minute flight and accommodation needed.',
    hasEventAttendance: false,
    eventDetails: null,
    dsaCalculation: {
      baseRate: 200,
      days: 4,
      multiplier: 1.5,
      total: 1200
    }
  },
];

export const MOCK_DECISIONS: Decision[] = [
  {
    id: '1',
    requestId: 'REQ-2024-005',
    action: 'Approved',
    reason: 'Valid business justification provided. Within budget limits.',
    approver: 'Leticia Kanthiti',
    date: '2024-01-10'
  },
  {
    id: '2',
    requestId: 'REQ-2024-006',
    action: 'Rejected',
    reason: 'Insufficient documentation. Please resubmit with proper receipts.',
    approver: 'Leticia Kanthiti',
    date: '2024-01-09'
  },
  {
    id: '3',
    requestId: 'REQ-2024-007',
    action: 'Approved',
    reason: 'Meets all policy requirements. Good value for money.',
    approver: 'Leticia Kanthiti',
    date: '2024-01-08'
  },
];

export const MOCK_TEAM_SUMMARY: TeamSummary[] = [
  { name: 'Sales', pending: 8, approved: 42, avgTime: '2.3 days' },
  { name: 'Marketing', pending: 5, approved: 28, avgTime: '1.8 days' },
  { name: 'Engineering', pending: 12, approved: 35, avgTime: '3.1 days' },
  { name: 'Product', pending: 3, approved: 15, avgTime: '1.5 days' },
];
