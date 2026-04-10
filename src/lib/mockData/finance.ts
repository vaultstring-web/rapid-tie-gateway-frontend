// src/lib/mockData/finance.ts
import { Budget, Batch, Disbursement, SpendingTrend } from '@/types';

export const MOCK_DISBURSEMENTS: Disbursement[] = [
  {
    id: 'DIS-001',
    recipient: 'Alex Johnson',
    amount: 1250,
    type: 'Travel',
    status: 'Ready',
    validationStatus: 'Valid',
    event: 'Marketing Summit'
  },
  {
    id: 'DIS-002',
    recipient: 'Sarah Miller',
    amount: 3400,
    type: 'Equipment',
    status: 'Ready',
    validationStatus: 'Valid',
    event: 'Equipment Purchase'
  },
  {
    id: 'DIS-003',
    recipient: 'Michael Chen',
    amount: 800,
    type: 'Event',
    status: 'Ready',
    validationStatus: 'Valid',
    event: 'Tech Conference'
  },
  {
    id: 'DIS-004',
    recipient: 'Emma Wilson',
    amount: 2500,
    type: 'Travel',
    status: 'Ready',
    validationStatus: 'Pending',
    event: 'Client Meeting'
  },
  {
    id: 'DIS-005',
    recipient: 'James Brown',
    amount: 1500,
    type: 'Training',
    status: 'Ready',
    validationStatus: 'Valid',
    event: 'Team Training'
  },
  {
    id: 'DIS-006',
    recipient: 'Lisa Anderson',
    amount: 4200,
    type: 'Marketing',
    status: 'Ready',
    validationStatus: 'Valid',
    event: 'Marketing Summit'
  },
  {
    id: 'DIS-007',
    recipient: 'Robert Taylor',
    amount: 950,
    type: 'Travel',
    status: 'Ready',
    validationStatus: 'Invalid',
    event: 'Conference'
  }
];

export const MOCK_BATCHES: Batch[] = [
  {
    id: 'BATCH-001',
    name: 'April Travel Disbursements',
    status: 'Completed',
    totalAmount: 12500,
    itemCount: 15,
    successCount: 14,
    failureCount: 1,
    progress: 100,
    createdAt: '2024-04-15T10:30:00Z'
  },
  {
    id: 'BATCH-002',
    name: 'Marketing Event Payments',
    status: 'Processing',
    totalAmount: 8750,
    itemCount: 8,
    successCount: 5,
    failureCount: 0,
    progress: 62,
    createdAt: '2024-04-16T09:15:00Z'
  },
  {
    id: 'BATCH-003',
    name: 'Equipment Purchases',
    status: 'Failed',
    totalAmount: 15000,
    itemCount: 12,
    successCount: 8,
    failureCount: 4,
    progress: 45,
    createdAt: '2024-04-14T14:20:00Z'
  },
  {
    id: 'BATCH-004',
    name: 'Q2 Training Reimbursements',
    status: 'Processing',
    totalAmount: 6300,
    itemCount: 7,
    successCount: 3,
    failureCount: 1,
    progress: 42,
    createdAt: '2024-04-16T11:00:00Z'
  },
  {
    id: 'BATCH-005',
    name: 'Client Entertainment',
    status: 'Completed',
    totalAmount: 3400,
    itemCount: 5,
    successCount: 5,
    failureCount: 0,
    progress: 100,
    createdAt: '2024-04-13T08:45:00Z'
  }
];

export const MOCK_BUDGETS: Budget[] = [
  {
    id: 'BUD-001',
    department: 'Marketing',
    total: 150000,
    spent: 98000,
    committed: 25000,
    events: [
      { name: 'Digital Summit 2024', budget: 50000, spent: 32000 },
      { name: 'Brand Campaign', budget: 40000, spent: 28000 },
      { name: 'Social Media Ads', budget: 35000, spent: 25000 }
    ]
  },
  {
    id: 'BUD-002',
    department: 'Sales',
    total: 200000,
    spent: 145000,
    committed: 30000,
    events: [
      { name: 'Annual Sales Kickoff', budget: 80000, spent: 65000 },
      { name: 'Client Dinners', budget: 50000, spent: 35000 },
      { name: 'Sales Training', budget: 45000, spent: 30000 }
    ]
  },
  {
    id: 'BUD-003',
    department: 'Engineering',
    total: 180000,
    spent: 112000,
    committed: 45000,
    events: [
      { name: 'Dev Summit', budget: 60000, spent: 42000 },
      { name: 'Hackathon', budget: 40000, spent: 25000 },
      { name: 'Tools & Software', budget: 50000, spent: 35000 }
    ]
  },
  {
    id: 'BUD-004',
    department: 'Product',
    total: 120000,
    spent: 68000,
    committed: 28000,
    events: [
      { name: 'Product Launch', budget: 60000, spent: 38000 },
      { name: 'User Research', budget: 35000, spent: 18000 },
      { name: 'Beta Testing', budget: 25000, spent: 12000 }
    ]
  }
];

export const MOCK_SPENDING_TRENDS: SpendingTrend[] = [
  { month: 'Jan', total: 45000, event: 12000 },
  { month: 'Feb', total: 52000, event: 15000 },
  { month: 'Mar', total: 58000, event: 18000 },
  { month: 'Apr', total: 62000, event: 22000 },
  { month: 'May', total: 68000, event: 25000 },
  { month: 'Jun', total: 72000, event: 28000 }
];