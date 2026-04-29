export interface Ticket {
  id: string;
  ticketNumber: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone?: string;
  ticketTier: string;
  price: number;
  status: 'active' | 'used' | 'expired' | 'refunded';
  qrCode: string;
  qrCodeDataUrl?: string;
  checkedInAt?: string;
  checkedInBy?: string;
  deliveryStatus: 'pending' | 'sent' | 'failed' | 'delivered';
  deliveryMethod: 'email' | 'sms';
  sentAt?: string;
  role?: 'MERCHANT' | 'ORGANIZER' | 'EMPLOYEE' | 'APPROVER' | 'FINANCE_OFFICER' | 'ADMIN' | 'PUBLIC';
}

export interface EventInfo {
  id: string;
  name: string;
  date: string;
  venue: string;
  city: string;
  organizerName: string;
  organizerLogo?: string;
  totalTickets: number;
  ticketsSold: number;
  ticketsUsed: number;
}

export interface RoleSpecificQRConfig {
  role: string;
  label: string;
  color: string;
  discount?: number;
  specialAccess?: string;
}

export const ROLE_QR_CONFIGS: RoleSpecificQRConfig[] = [
  { role: 'MERCHANT', label: 'Merchant Pass', color: '#10b981', discount: 10 },
  { role: 'ORGANIZER', label: 'Organizer Pass', color: '#3b82f6', specialAccess: 'Backstage Access' },
  { role: 'EMPLOYEE', label: 'Staff Pass', color: '#8b5cf6', specialAccess: 'Staff Area' },
  { role: 'APPROVER', label: 'VIP Approver', color: '#f59e0b', discount: 15 },
  { role: 'FINANCE_OFFICER', label: 'Finance Pass', color: '#06b6d4', specialAccess: 'Finance Lounge' },
  { role: 'ADMIN', label: 'Admin Pass', color: '#ef4444', specialAccess: 'All Areas' },
  { role: 'PUBLIC', label: 'General Admission', color: '#6b7280' },
];

export interface BulkResendRequest {
  ticketIds: string[];
  deliveryMethod: 'email' | 'sms';
}

export interface DeliveryStatus {
  ticketId: string;
  status: 'pending' | 'sent' | 'failed';
  message?: string;
  timestamp: string;
}