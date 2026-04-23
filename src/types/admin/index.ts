export interface SystemStatus {
  database: {
    status: 'healthy' | 'degraded' | 'down';
    latency: number;
    connections: number;
  };
  redis: {
    status: 'healthy' | 'degraded' | 'down';
    memory: number;
    hitRate: number;
  };
  api: {
    status: 'healthy' | 'degraded' | 'down';
    uptime: number;
    responseTime: number;
  };
  websocket: {
    status: 'healthy' | 'degraded' | 'down';
    connections: number;
  };
}

export interface EventPlatformMetrics {
  totalEvents: number;
  activeEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  averageAttendance: number;
  conversionRate: number;
  eventsByStatus: {
    draft: number;
    published: number;
    completed: number;
    cancelled: number;
  };
}

export interface TransactionVolume {
  date: string;
  count: number;
  amount: number;
}

export interface UserStats {
  total: number;
  active: number;
  newToday: number;
  byRole: {
    MERCHANT: number;
    ORGANIZER: number;
    EMPLOYEE: number;
    APPROVER: number;
    FINANCE_OFFICER: number;
    ADMIN: number;
    COMPLIANCE: number;
  };
}

export interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  source: string;
  resolved: boolean;
}

export interface AdminDashboardData {
  systemStatus: SystemStatus;
  eventMetrics: EventPlatformMetrics;
  transactionHistory: TransactionVolume[];
  userStats: UserStats;
  recentErrors: ErrorLog[];
  lastUpdated: string;
}