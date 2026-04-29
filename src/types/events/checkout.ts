export interface OrderDetails {
  id: string;
  orderNumber: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  eventImage: string;
  tierId: string;
  tierName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discount: number;
  fees: number;
  total: number;
  savings?: number;
  promoCode?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export interface BuyerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  confirmEmail: string;
  address?: string;
  city?: string;
  notes?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  enabled: boolean;
  fields?: PaymentField[];
}

export interface PaymentField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'tel' | 'email' | 'password';
  required: boolean;
  placeholder: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  redirectUrl?: string;
}

export interface PaymentStatus {
  state: 'idle' | 'processing' | 'success' | 'error';
  message: string;
  transactionId?: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'airtel_money',
    name: 'Airtel Money',
    icon: '📱',
    description: 'Pay using your Airtel Money wallet',
    color: '#ff6600',
    enabled: true,
    fields: [
      { name: 'phone', label: 'Airtel Money Phone Number', type: 'tel', required: true, placeholder: '0999 123 456' },
    ],
  },
  {
    id: 'tnm_mpamba',
    name: 'TNM Mpamba',
    icon: '📱',
    description: 'Pay using your TNM Mpamba wallet',
    color: '#00a651',
    enabled: true,
    fields: [
      { name: 'phone', label: 'Mpamba Phone Number', type: 'tel', required: true, placeholder: '0888 123 456' },
    ],
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: '💳',
    description: 'Pay with Visa, Mastercard, or American Express',
    color: '#3b82f6',
    enabled: true,
    fields: [
      { name: 'cardNumber', label: 'Card Number', type: 'text', required: true, placeholder: '1234 5678 9012 3456' },
      { name: 'expiry', label: 'Expiry Date', type: 'text', required: true, placeholder: 'MM/YY' },
      { name: 'cvv', label: 'CVV', type: 'password', required: true, placeholder: '123' },
      { name: 'cardName', label: 'Name on Card', type: 'text', required: true, placeholder: 'John Doe' },
    ],
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    icon: '🏦',
    description: 'Pay via bank transfer (manual verification)',
    color: '#6b7280',
    enabled: true,
    fields: [
      { name: 'accountName', label: 'Account Name', type: 'text', required: true, placeholder: 'John Doe' },
      { name: 'reference', label: 'Payment Reference', type: 'text', required: true, placeholder: 'EVT-12345' },
    ],
  },
];