export interface EventAnalyticsFilter {
  startDate: Date;
  endDate: Date;
  role?: 'MERCHANT' | 'ORGANIZER' | 'EMPLOYEE' | 'APPROVER' | 'FINANCE_OFFICER' | 'ADMIN' | 'PUBLIC';
  eventId?: string;
  region?: string;
  category?: string;
}

export interface RevenueData {
  date: string;
  revenue: number;
  transactions: number;
  averageTicket: number;
}

export interface ConversionFunnelData {
  stage: 'VIEW' | 'CLICK' | 'ADD_TO_CART' | 'CHECKOUT' | 'PURCHASE';
  count: number;
  conversionRate: number;
  dropOffRate: number;
}

export interface DemographicData {
  ageGroup: string;
  male: number;
  female: number;
  other: number;
  total: number;
}

export interface GeographicData {
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  events: number;
  tickets: number;
  revenue: number;
}

export interface TopEventData {
  id: string;
  name: string;
  ticketsSold: number;
  revenue: number;
  conversionRate: number;
  category: string;
}

export interface RoleAnalyticsData {
  role: string;
  views: number;
  purchases: number;
  revenue: number;
  conversionRate: number;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  metric: string;
}

export interface EventAnalyticsSummary {
  totalRevenue: number;
  totalTickets: number;
  totalEvents: number;
  averageTicketPrice: number;
  overallConversionRate: number;
  uniqueVisitors: number;
  returningVisitors: number;
}