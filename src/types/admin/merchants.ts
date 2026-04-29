export interface Merchant {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  registrationNumber?: string;
  taxId?: string;
  businessType: string;
  website?: string;
  logo?: string;
  address: string;
  city: string;
  country: string;
  eventsSponsored: number;
  totalRevenue: number;
  totalTransactions: number;
  joinedAt: string;
  lastActive: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface MerchantFilter {
  search: string;
  status: string;
  dateFrom?: string;
  dateTo?: string;
  minRevenue?: number;
  maxRevenue?: number;
}

export interface MerchantResponse {
  merchants: Merchant[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface MerchantStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  totalRevenue: number;
  totalEvents: number;
}

export const MERCHANT_STATUS_CONFIG = {
  active: { label: 'Active', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: '✅' },
  pending: { label: 'Pending', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: '⏳' },
  suspended: { label: 'Suspended', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: '🚫' },
  rejected: { label: 'Rejected', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800', icon: '❌' },
};

export const BUSINESS_TYPES = [
  { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'limited_liability', label: 'Limited Liability Company' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'non_profit', label: 'Non-Profit' },
];