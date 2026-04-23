export interface OrganizerEvent {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  startDate: string;
  endDate: string;
  venue: string;
  city: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  ticketTiers: {
    id: string;
    name: string;
    price: number;
    sold: number;
    quantity: number;
  }[];
  visibilityMetrics: {
    MERCHANT: number;
    ORGANIZER: number;
    EMPLOYEE: number;
    APPROVER: number;
    FINANCE_OFFICER: number;
    ADMIN: number;
    PUBLIC: number;
    total: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalEvents: number;
  publishedEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  averageAttendanceRate: number;
  totalViews: number;
  conversionRate: number;
  upcomingEventsCount: number;
}

export interface NearbyEvent {
  id: string;
  name: string;
  venue: string;
  city: string;
  latitude: number;
  longitude: number;
  startDate: string;
  distance: number;
  imageUrl: string;
}

export const EVENT_STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'bg-gray-500', textColor: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-800' },
  published: { label: 'Published', color: 'bg-green-500', textColor: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500', textColor: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  completed: { label: 'Completed', color: 'bg-blue-500', textColor: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
};