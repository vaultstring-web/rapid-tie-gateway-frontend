export interface AdminEvent {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: 'concert' | 'conference' | 'workshop' | 'sports' | 'festival' | 'corporate' | 'education';
  type: 'public' | 'merchant' | 'dsa-relevant';
  status: 'pending' | 'approved' | 'rejected' | 'published' | 'cancelled' | 'completed';
  startDate: string;
  endDate: string;
  venue: string;
  city: string;
  country: string;
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  images: string[];
  ticketTiers: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    sold: number;
  }[];
  totalTickets: number;
  totalSold: number;
  totalRevenue: number;
  totalViews: number;
  createdAt: string;
  updatedAt: string;
  approvalNotes?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface EventFilter {
  search: string;
  status: string;
  category: string;
  organizerId: string;
  dateFrom?: string;
  dateTo?: string;
  minRevenue?: number;
  maxRevenue?: number;
}

export interface EventStats {
  total: number;
  pending: number;
  approved: number;
  published: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
  totalTickets: number;
  totalAttendees: number;
  averageTicketPrice: number;
}

export const EVENT_STATUS_CONFIG = {
  pending: { label: 'Pending Approval', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: '⏳' },
  approved: { label: 'Approved', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: '✅' },
  rejected: { label: 'Rejected', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: '❌' },
  published: { label: 'Published', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: '📢' },
  cancelled: { label: 'Cancelled', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800', icon: '🚫' },
  completed: { label: 'Completed', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30', icon: '✓' },
};

export const EVENT_CATEGORIES = [
  { value: 'concert', label: 'Concert', icon: '🎤', color: '#8b5cf6' },
  { value: 'conference', label: 'Conference', icon: '💼', color: '#3b82f6' },
  { value: 'workshop', label: 'Workshop', icon: '🔧', color: '#10b981' },
  { value: 'sports', label: 'Sports', icon: '⚽', color: '#f59e0b' },
  { value: 'festival', label: 'Festival', icon: '🎪', color: '#ec4899' },
  { value: 'corporate', label: 'Corporate', icon: '🏢', color: '#6b7280' },
  { value: 'education', label: 'Education', icon: '📚', color: '#eab308' },
];