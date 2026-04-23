export interface TicketTier {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  sold: number;
  maxPerPerson: number;
  benefits: string[];
  isAvailable: boolean;
}

export interface AttendeeInfo {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialRequests?: string;
}

export interface PurchaseFormData {
  tierId: string;
  quantity: number;
  attendees: AttendeeInfo[];
  paymentMethod: string;
  promoCode?: string;
  agreeToTerms: boolean;
}

export interface OrderSummary {
  subtotal: number;
  discount: number;
  fees: number;
  total: number;
  savings?: number;
}

export interface RoleBasedPrice {
  role: string;
  price: number;
  originalPrice: number;
  discount: number;
}

export const PAYMENT_METHODS = [
  { value: 'airtel_money', label: 'Airtel Money', icon: '📱', color: '#ff6600' },
  { value: 'tnm_mpamba', label: 'TNM Mpamba', icon: '📱', color: '#00a651' },
  { value: 'card', label: 'Credit/Debit Card', icon: '💳', color: '#3b82f6' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦', color: '#6b7280' },
];