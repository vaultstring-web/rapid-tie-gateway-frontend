export interface Attendee {
  id: string;
  ticketNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'MERCHANT' | 'ORGANIZER' | 'EMPLOYEE' | 'APPROVER' | 'FINANCE_OFFICER' | 'ADMIN' | 'PUBLIC';
  tierName: string;
  ticketPrice: number;
  status: 'checked_in' | 'not_checked_in' | 'refunded' | 'cancelled';
  checkedInAt?: string;
  checkedInBy?: string;
  purchaseDate: string;
  specialRequests?: string;
  dietaryRestrictions?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface AttendeeFilters {
  search: string;
  role: string;
  tierId: string;
  status: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AttendeeStats {
  total: number;
  checkedIn: number;
  notCheckedIn: number;
  refunded: number;
  cancelled: number;
  byRole: {
    role: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  byTier: {
    tierName: string;
    count: number;
    percentage: number;
  }[];
}

export const ROLE_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
  MERCHANT: { label: 'Merchant', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', icon: '🛍️' },
  ORGANIZER: { label: 'Organizer', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30', icon: '🎫' },
  EMPLOYEE: { label: 'Employee', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30', icon: '👔' },
  APPROVER: { label: 'Approver', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30', icon: '✅' },
  FINANCE_OFFICER: { label: 'Finance', color: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30', icon: '💰' },
  ADMIN: { label: 'Admin', color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-100 dark:bg-rose-900/30', icon: '⚙️' },
  PUBLIC: { label: 'Public', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-800', icon: '🌍' },
};

export const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  checked_in: { label: 'Checked In', color: 'text-green-600 dark:text-green-400', icon: '✅' },
  not_checked_in: { label: 'Not Checked In', color: 'text-yellow-600 dark:text-yellow-400', icon: '⏳' },
  refunded: { label: 'Refunded', color: 'text-red-600 dark:text-red-400', icon: '💰' },
  cancelled: { label: 'Cancelled', color: 'text-gray-500 dark:text-gray-400', icon: '❌' },
};

export const TICKET_TIERS = [
  { id: 'vip', name: 'VIP', color: '#8b5cf6' },
  { id: 'general', name: 'General Admission', color: '#3b82f6' },
  { id: 'early_bird', name: 'Early Bird', color: '#10b981' },
  { id: 'group', name: 'Group Ticket', color: '#f59e0b' },
];