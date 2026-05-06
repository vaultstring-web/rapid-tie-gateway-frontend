// Event Management Types
export interface Event {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  type: 'public' | 'merchant' | 'dsa-relevant';
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  startDate: string;
  endDate: string;
  venue: string;
  city: string;
  address: string;
  imageUrl: string;
  capacity: number;
  ticketTiers: TicketTier[];
  visibilityMetrics: VisibilityMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface TicketTier {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold: number;
  maxPerPerson: number;
  benefits: string[];
  isActive: boolean;
  earlyBirdPeriods?: EarlyBirdPeriod[];
  roleBasedPrices?: RoleBasedPrice[];
}

export interface EarlyBirdPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  enabled: boolean;
}

export interface RoleBasedPrice {
  role: 'MERCHANT' | 'ORGANIZER' | 'EMPLOYEE' | 'APPROVER' | 'FINANCE_OFFICER' | 'ADMIN' | 'PUBLIC';
  price: number;
  enabled: boolean;
}

export interface Attendee {
  id: string;
  ticketNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  tierName: string;
  ticketPrice: number;
  status: 'checked_in' | 'not_checked_in' | 'refunded' | 'cancelled';
  checkedInAt?: string;
  purchaseDate: string;
}

export interface CheckinStats {
  total: number;
  checkedIn: number;
  percentage: number;
  byRole: {
    role: string;
    total: number;
    checkedIn: number;
    percentage: number;
    color: string;
  }[];
}

export interface CheckinRecord {
  id: string;
  attendeeName: string;
  ticketNumber: string;
  tierName: string;
  checkedInAt: string;
  method: 'qr' | 'manual';
}

export interface SalesMetrics {
  totalRevenue: number;
  totalTicketsSold: number;
  totalAttendees: number;
  averageTicketPrice: number;
  revenueChange: number;
  ticketsSoldChange: number;
  capacityPercentage: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  tickets: number;
}

export interface SalesByTier {
  tierName: string;
  sold: number;
  revenue: number;
  percentage: number;
  color: string;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  tierName: string;
  amount: number;
  status: 'completed' | 'pending' | 'refunded';
  purchasedAt: string;
}

export interface MessageRecipient {
  id: string;
  name: string;
  email: string;
  role: string;
  ticketTier: string;
}

export interface SendMessageRequest {
  subject: string;
  content: string;
  recipientType: 'all' | 'checked_in' | 'not_checked_in' | 'vip' | 'custom';
  customRecipients?: string[];
  scheduledFor?: Date;
}

export interface VisibilityMetrics {
  total: number;
  MERCHANT: number;
  ORGANIZER: number;
  EMPLOYEE: number;
  APPROVER: number;
  FINANCE_OFFICER: number;
  ADMIN: number;
  PUBLIC: number;
}

export interface DashboardStats {
  totalEvents: number;
  publishedEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  totalViews: number;
  conversionRate: number;
  upcomingEventsCount: number;
}

export const ROLE_LABELS: Record<string, string> = {
  MERCHANT: 'Merchant',
  ORGANIZER: 'Organizer',
  EMPLOYEE: 'Employee',
  APPROVER: 'Approver',
  FINANCE_OFFICER: 'Finance',
  ADMIN: 'Admin',
  PUBLIC: 'Public',
};

export const ROLE_COLORS: Record<string, string> = {
  MERCHANT: '#10b981',
  ORGANIZER: '#3b82f6',
  EMPLOYEE: '#8b5cf6',
  APPROVER: '#f59e0b',
  FINANCE_OFFICER: '#06b6d4',
  ADMIN: '#ef4444',
  PUBLIC: '#6b7280',
};

export const STATUS_CONFIG = {
  published: { label: 'Published', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
  draft: { label: 'Draft', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
  completed: { label: 'Completed', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
};