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
}

export interface AttendeeFilters {
  search: string;
  role: string;
  tierId: string;
  status: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AttendeeResponse {
  attendees: Attendee[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ExportOptions {
  format: 'csv' | 'excel';
  includeFields: string[];
}

export const ROLE_BADGE_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  MERCHANT: { label: 'Merchant', color: 'text-emerald-700 dark:text-emerald-300', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  ORGANIZER: { label: 'Organizer', color: 'text-blue-700 dark:text-blue-300', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  EMPLOYEE: { label: 'Employee', color: 'text-purple-700 dark:text-purple-300', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  APPROVER: { label: 'Approver', color: 'text-amber-700 dark:text-amber-300', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  FINANCE_OFFICER: { label: 'Finance', color: 'text-cyan-700 dark:text-cyan-300', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30' },
  ADMIN: { label: 'Admin', color: 'text-rose-700 dark:text-rose-300', bgColor: 'bg-rose-100 dark:bg-rose-900/30' },
  PUBLIC: { label: 'Public', color: 'text-gray-700 dark:text-gray-300', bgColor: 'bg-gray-100 dark:bg-gray-800' },
};

export const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  checked_in: { label: 'Checked In', color: 'text-green-600 dark:text-green-400', icon: '✅' },
  not_checked_in: { label: 'Not Checked In', color: 'text-yellow-600 dark:text-yellow-400', icon: '⏳' },
  refunded: { label: 'Refunded', color: 'text-red-600 dark:text-red-400', icon: '💰' },
  cancelled: { label: 'Cancelled', color: 'text-gray-500 dark:text-gray-400', icon: '❌' },
};