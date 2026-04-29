export interface RoleBasedPrice {
  role: 'MERCHANT' | 'ORGANIZER' | 'EMPLOYEE' | 'APPROVER' | 'FINANCE_OFFICER' | 'ADMIN' | 'PUBLIC';
  price: number;
  enabled: boolean;
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

export interface TicketTier {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  quantity: number;
  sold: number;
  maxPerPerson: number;
  roleBasedPrices: RoleBasedPrice[];
  earlyBirdPeriods: EarlyBirdPeriod[];
  benefits: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface TicketTierFormData {
  name: string;
  description: string;
  basePrice: number;
  quantity: number;
  maxPerPerson: number;
  roleBasedPrices: RoleBasedPrice[];
  earlyBirdPeriods: EarlyBirdPeriod[];
  benefits: string[];
  isActive: boolean;
}

export const ROLES = [
  { value: 'MERCHANT', label: '🛍️ Merchants', color: '#10b981' },
  { value: 'ORGANIZER', label: '🎫 Organizers', color: '#3b82f6' },
  { value: 'EMPLOYEE', label: '👔 Employees', color: '#8b5cf6' },
  { value: 'APPROVER', label: '✅ Approvers', color: '#f59e0b' },
  { value: 'FINANCE_OFFICER', label: '💰 Finance', color: '#06b6d4' },
  { value: 'ADMIN', label: '⚙️ Admins', color: '#ef4444' },
  { value: 'PUBLIC', label: '🌍 General Public', color: '#6b7280' },
];