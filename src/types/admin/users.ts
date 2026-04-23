export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: 'MERCHANT' | 'ORGANIZER' | 'EMPLOYEE' | 'APPROVER' | 'FINANCE_OFFICER' | 'ADMIN' | 'COMPLIANCE' | 'PUBLIC';
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  eventsAttended: number;
  eventsAttendedList: {
    id: string;
    name: string;
    date: string;
  }[];
  merchant?: {
    id: string;
    businessName: string;
  };
  organizer?: {
    id: string;
    organizationName: string;
  };
  employee?: {
    id: string;
    organizationId: string;
    organizationName: string;
  };
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  byRole: Record<string, number>;
  newToday: number;
  newThisWeek: number;
  newThisMonth: number;
}

export interface UserFilter {
  search: string;
  role: string;
  status: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface UserResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export const USER_ROLES = [
  { value: 'MERCHANT', label: 'Merchant', color: '#10b981', icon: '🛍️' },
  { value: 'ORGANIZER', label: 'Organizer', color: '#3b82f6', icon: '🎫' },
  { value: 'EMPLOYEE', label: 'Employee', color: '#8b5cf6', icon: '👔' },
  { value: 'APPROVER', label: 'Approver', color: '#f59e0b', icon: '✅' },
  { value: 'FINANCE_OFFICER', label: 'Finance Officer', color: '#06b6d4', icon: '💰' },
  { value: 'ADMIN', label: 'Administrator', color: '#ef4444', icon: '⚙️' },
  { value: 'COMPLIANCE', label: 'Compliance', color: '#6b7280', icon: '📋' },
  { value: 'PUBLIC', label: 'Public User', color: '#6b7280', icon: '🌍' },
];

export const USER_STATUS_CONFIG = {
  active: { label: 'Active', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: '✅' },
  inactive: { label: 'Inactive', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800', icon: '⭕' },
  suspended: { label: 'Suspended', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: '🚫' },
};