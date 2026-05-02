export interface DepartmentBudget {
  id: string;
  department: string;
  allocated: number;
  spent: number;
  committed: number;
  remaining: number;
  percentageUsed: number;
  status: 'healthy' | 'warning' | 'critical';
  color: string;
  eventBudgets: EventBudget[];
  monthlySpending: MonthlySpending[];
}

export interface EventBudget {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  allocated: number;
  spent: number;
  committed: number;
  remaining: number;
  percentageUsed: number;
  status: 'healthy' | 'warning' | 'critical';
}

export interface MonthlySpending {
  month: string;
  actual: number;
  budgeted: number;
  variance: number;
}

export interface BudgetSummary {
  totalAllocated: number;
  totalSpent: number;
  totalCommitted: number;
  totalRemaining: number;
  overallUtilization: number;
  departmentsAtRisk: number;
  eventsAtRisk: number;
}

export const DEPARTMENT_BUDGETS: DepartmentBudget[] = [
  {
    id: '1',
    department: 'Finance',
    allocated: 2500000,
    spent: 1850000,
    committed: 320000,
    remaining: 330000,
    percentageUsed: 74,
    status: 'healthy',
    color: '#84cc16',
    eventBudgets: [
      {
        id: 'e1',
        eventId: 'evt-1',
        eventName: 'Fintech Conference 2026',
        eventDate: '2026-06-15',
        allocated: 500000,
        spent: 350000,
        committed: 100000,
        remaining: 50000,
        percentageUsed: 70,
        status: 'healthy',
      },
    ],
    monthlySpending: [
      { month: 'Jan', actual: 310000, budgeted: 300000, variance: 10000 },
      { month: 'Feb', actual: 290000, budgeted: 300000, variance: -10000 },
      { month: 'Mar', actual: 350000, budgeted: 350000, variance: 0 },
      { month: 'Apr', actual: 380000, budgeted: 350000, variance: 30000 },
      { month: 'May', actual: 320000, budgeted: 350000, variance: -30000 },
      { month: 'Jun', actual: 200000, budgeted: 350000, variance: -150000 },
    ],
  },
  {
    id: '2',
    department: 'Operations',
    allocated: 1800000,
    spent: 1560000,
    committed: 180000,
    remaining: 60000,
    percentageUsed: 87,
    status: 'warning',
    color: '#f59e0b',
    eventBudgets: [
      {
        id: 'e2',
        eventId: 'evt-2',
        eventName: 'Operations Summit',
        eventDate: '2026-07-20',
        allocated: 300000,
        spent: 280000,
        committed: 20000,
        remaining: 0,
        percentageUsed: 100,
        status: 'critical',
      },
    ],
    monthlySpending: [
      { month: 'Jan', actual: 280000, budgeted: 250000, variance: 30000 },
      { month: 'Feb', actual: 260000, budgeted: 250000, variance: 10000 },
      { month: 'Mar', actual: 310000, budgeted: 300000, variance: 10000 },
      { month: 'Apr', actual: 290000, budgeted: 300000, variance: -10000 },
      { month: 'May', actual: 270000, budgeted: 300000, variance: -30000 },
      { month: 'Jun', actual: 150000, budgeted: 250000, variance: -100000 },
    ],
  },
  {
    id: '3',
    department: 'Field Operations',
    allocated: 3200000,
    spent: 2450000,
    committed: 450000,
    remaining: 300000,
    percentageUsed: 77,
    status: 'healthy',
    color: '#84cc16',
    eventBudgets: [
      {
        id: 'e3',
        eventId: 'evt-3',
        eventName: 'Field Staff Training',
        eventDate: '2026-08-10',
        allocated: 400000,
        spent: 250000,
        committed: 100000,
        remaining: 50000,
        percentageUsed: 63,
        status: 'healthy',
      },
    ],
    monthlySpending: [
      { month: 'Jan', actual: 400000, budgeted: 420000, variance: -20000 },
      { month: 'Feb', actual: 410000, budgeted: 420000, variance: -10000 },
      { month: 'Mar', actual: 430000, budgeted: 420000, variance: 10000 },
      { month: 'Apr', actual: 420000, budgeted: 420000, variance: 0 },
      { month: 'May', actual: 400000, budgeted: 420000, variance: -20000 },
      { month: 'Jun', actual: 390000, budgeted: 420000, variance: -30000 },
    ],
  },
  {
    id: '4',
    department: 'HR',
    allocated: 1200000,
    spent: 890000,
    committed: 110000,
    remaining: 200000,
    percentageUsed: 74,
    status: 'healthy',
    color: '#84cc16',
    eventBudgets: [
      {
        id: 'e4',
        eventId: 'evt-4',
        eventName: 'HR Leadership Summit',
        eventDate: '2026-09-05',
        allocated: 200000,
        spent: 150000,
        committed: 30000,
        remaining: 20000,
        percentageUsed: 75,
        status: 'warning',
      },
    ],
    monthlySpending: [
      { month: 'Jan', actual: 150000, budgeted: 140000, variance: 10000 },
      { month: 'Feb', actual: 145000, budgeted: 140000, variance: 5000 },
      { month: 'Mar', actual: 155000, budgeted: 160000, variance: -5000 },
      { month: 'Apr', actual: 160000, budgeted: 160000, variance: 0 },
      { month: 'May', actual: 150000, budgeted: 160000, variance: -10000 },
      { month: 'Jun', actual: 130000, budgeted: 160000, variance: -30000 },
    ],
  },
  {
    id: '5',
    department: 'IT',
    allocated: 1500000,
    spent: 920000,
    committed: 280000,
    remaining: 300000,
    percentageUsed: 61,
    status: 'healthy',
    color: '#84cc16',
    eventBudgets: [
      {
        id: 'e5',
        eventId: 'evt-5',
        eventName: 'Tech Conference',
        eventDate: '2026-10-12',
        allocated: 250000,
        spent: 150000,
        committed: 50000,
        remaining: 50000,
        percentageUsed: 60,
        status: 'healthy',
      },
    ],
    monthlySpending: [
      { month: 'Jan', actual: 150000, budgeted: 160000, variance: -10000 },
      { month: 'Feb', actual: 155000, budgeted: 160000, variance: -5000 },
      { month: 'Mar', actual: 160000, budgeted: 160000, variance: 0 },
      { month: 'Apr', actual: 140000, budgeted: 160000, variance: -20000 },
      { month: 'May', actual: 165000, budgeted: 160000, variance: 5000 },
      { month: 'Jun', actual: 150000, budgeted: 160000, variance: -10000 },
    ],
  },
  {
    id: '6',
    department: 'Sales',
    allocated: 800000,
    spent: 650000,
    committed: 50000,
    remaining: 100000,
    percentageUsed: 81,
    status: 'warning',
    color: '#f59e0b',
    eventBudgets: [
      {
        id: 'e6',
        eventId: 'evt-6',
        eventName: 'Sales Kickoff',
        eventDate: '2026-11-01',
        allocated: 150000,
        spent: 120000,
        committed: 20000,
        remaining: 10000,
        percentageUsed: 87,
        status: 'warning',
      },
    ],
    monthlySpending: [
      { month: 'Jan', actual: 110000, budgeted: 100000, variance: 10000 },
      { month: 'Feb', actual: 105000, budgeted: 100000, variance: 5000 },
      { month: 'Mar', actual: 115000, budgeted: 110000, variance: 5000 },
      { month: 'Apr', actual: 110000, budgeted: 110000, variance: 0 },
      { month: 'May', actual: 105000, budgeted: 110000, variance: -5000 },
      { month: 'Jun', actual: 105000, budgeted: 110000, variance: -5000 },
    ],
  },
  {
    id: '7',
    department: 'Marketing',
    allocated: 1000000,
    spent: 780000,
    committed: 120000,
    remaining: 100000,
    percentageUsed: 78,
    status: 'healthy',
    color: '#84cc16',
    eventBudgets: [
      {
        id: 'e7',
        eventId: 'evt-7',
        eventName: 'Marketing Conference',
        eventDate: '2026-12-03',
        allocated: 200000,
        spent: 160000,
        committed: 30000,
        remaining: 10000,
        percentageUsed: 80,
        status: 'warning',
      },
    ],
    monthlySpending: [
      { month: 'Jan', actual: 130000, budgeted: 120000, variance: 10000 },
      { month: 'Feb', actual: 125000, budgeted: 120000, variance: 5000 },
      { month: 'Mar', actual: 135000, budgeted: 140000, variance: -5000 },
      { month: 'Apr', actual: 130000, budgeted: 140000, variance: -10000 },
      { month: 'May', actual: 140000, budgeted: 140000, variance: 0 },
      { month: 'Jun', actual: 120000, budgeted: 140000, variance: -20000 },
    ],
  },
  {
    id: '8',
    department: 'Administration',
    allocated: 600000,
    spent: 450000,
    committed: 80000,
    remaining: 70000,
    percentageUsed: 75,
    status: 'healthy',
    color: '#84cc16',
    eventBudgets: [],
    monthlySpending: [
      { month: 'Jan', actual: 75000, budgeted: 70000, variance: 5000 },
      { month: 'Feb', actual: 70000, budgeted: 70000, variance: 0 },
      { month: 'Mar', actual: 80000, budgeted: 80000, variance: 0 },
      { month: 'Apr', actual: 75000, budgeted: 80000, variance: -5000 },
      { month: 'May', actual: 80000, budgeted: 80000, variance: 0 },
      { month: 'Jun', actual: 70000, budgeted: 80000, variance: -10000 },
    ],
  },
];