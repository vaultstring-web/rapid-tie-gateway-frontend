export interface SalesMetrics {
  totalRevenue: number;
  totalTicketsSold: number;
  totalAttendees: number;
  averageTicketPrice: number;
  revenueChange: number;
  ticketsSoldChange: number;
  capacityPercentage: number;
  targetProgress: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  tickets: number;
  refunds: number;
}

export interface SalesByTier {
  tierId: string;
  tierName: string;
  sold: number;
  quantity: number;
  revenue: number;
  price: number;
  percentage: number;
}

export interface AudienceBreakdown {
  role: string;
  count: number;
  percentage: number;
  color: string;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  tierName: string;
  quantity: number;
  amount: number;
  status: 'completed' | 'pending' | 'refunded';
  purchasedAt: string;
}

export interface SalesDashboardData {
  metrics: SalesMetrics;
  revenueHistory: RevenueData[];
  salesByTier: SalesByTier[];
  audienceBreakdown: AudienceBreakdown[];
  recentOrders: RecentOrder[];
  lastUpdated: string;
}

export const ROLE_COLORS: Record<string, string> = {
  MERCHANT: '#10b981',
  ORGANIZER: '#3b82f6',
  EMPLOYEE: '#8b5cf6',
  APPROVER: '#f59e0b',
  FINANCE_OFFICER: '#06b6d4',
  ADMIN: '#ef4444',
  PUBLIC: '#6b7280',
};

export const ROLE_LABELS: Record<string, string> = {
  MERCHANT: 'Merchants',
  ORGANIZER: 'Organizers',
  EMPLOYEE: 'Employees',
  APPROVER: 'Approvers',
  FINANCE_OFFICER: 'Finance',
  ADMIN: 'Admins',
  PUBLIC: 'General Public',
};

export const TIER_COLORS = ['#84cc16', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#ef4444'];