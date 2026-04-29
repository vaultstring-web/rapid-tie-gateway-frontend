export interface MessageRecipient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'MERCHANT' | 'ORGANIZER' | 'EMPLOYEE' | 'APPROVER' | 'FINANCE_OFFICER' | 'ADMIN' | 'PUBLIC';
  ticketTier?: string;
  hasAttended: boolean;
  checkedIn?: boolean;
}

export interface RecipientFilter {
  roles?: string[];
  ticketTiers?: string[];
  attendanceStatus?: 'all' | 'attended' | 'not_attended';
  checkInStatus?: 'all' | 'checked_in' | 'not_checked_in';
  customSegment?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  preview: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledMessage {
  id: string;
  eventId: string;
  subject: string;
  content: string;
  recipientCount: number;
  scheduledFor: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  sentAt?: string;
  createdAt: string;
}

export interface SendHistory {
  id: string;
  subject: string;
  recipientCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  sentAt: string;
  status: 'success' | 'partial' | 'failed';
}

export interface SendMessageRequest {
  eventId: string;
  subject: string;
  content: string;
  recipients: RecipientFilter;
  scheduledFor?: string;
  isTest?: boolean;
}

export interface SendMessageResponse {
  success: boolean;
  messageId: string;
  recipientCount: number;
  scheduledFor?: string;
}

export interface RecipientCountResponse {
  total: number;
  byRole: Record<string, number>;
  byTicketTier: Record<string, number>;
}

export const ROLES = [
  { value: 'MERCHANT', label: 'Merchants', icon: '🛍️', color: '#10b981' },
  { value: 'ORGANIZER', label: 'Organizers', icon: '🎫', color: '#3b82f6' },
  { value: 'EMPLOYEE', label: 'Employees', icon: '👔', color: '#8b5cf6' },
  { value: 'APPROVER', label: 'Approvers', icon: '✅', color: '#f59e0b' },
  { value: 'FINANCE_OFFICER', label: 'Finance', icon: '💰', color: '#06b6d4' },
  { value: 'ADMIN', label: 'Admins', icon: '⚙️', color: '#ef4444' },
  { value: 'PUBLIC', label: 'General Public', icon: '🌍', color: '#6b7280' },
];