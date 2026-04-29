export interface EventImage {
  id: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
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
  isAvailable: boolean;
  saleStartDate?: string;
  saleEndDate?: string;
}

export interface AttendeeByRole {
  role: 'MERCHANT' | 'ORGANIZER' | 'EMPLOYEE' | 'APPROVER' | 'FINANCE_OFFICER' | 'ADMIN' | 'PUBLIC';
  count: number;
  percentage: number;
  color: string;
  icon: string;
}

export interface EventDetails {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  type: 'public' | 'merchant' | 'dsa-relevant';
  startDate: string;
  endDate: string;
  venue: string;
  city: string;
  country: string;
  address: string;
  images: EventImage[];
  ticketTiers: TicketTier[];
  attendeesByRole: AttendeeByRole[];
  totalAttendees: number;
  capacity: number;
  organizer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    bio: string;
  };
  isSaved: boolean;
  isTrending: boolean;
  tags: string[];
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

export const ROLE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  MERCHANT: { label: 'Merchants', color: '#10b981', icon: '🛍️' },
  ORGANIZER: { label: 'Organizers', color: '#3b82f6', icon: '🎫' },
  EMPLOYEE: { label: 'Employees', color: '#8b5cf6', icon: '👔' },
  APPROVER: { label: 'Approvers', color: '#f59e0b', icon: '✅' },
  FINANCE_OFFICER: { label: 'Finance', color: '#06b6d4', icon: '💰' },
  ADMIN: { label: 'Admins', color: '#ef4444', icon: '⚙️' },
  PUBLIC: { label: 'General Public', color: '#6b7280', icon: '🌍' },
};