export interface CheckinRecord {
  id: string;
  ticketId: string;
  attendeeName: string;
  attendeeEmail: string;
  ticketNumber: string;
  tierName: string;
  role: string;
  checkedInAt: string;
  checkedInBy: string;
  method: 'qr' | 'manual' | 'offline';
  synced: boolean;
}

export interface CheckinStats {
  total: number;
  checkedIn: number;
  notCheckedIn: number;
  percentage: number;
  byRole: {
    role: string;
    total: number;
    checkedIn: number;
    percentage: number;
    color: string;
  }[];
  lastCheckin: CheckinRecord | null;
}

export interface OfflineQueueItem {
  id: string;
  ticketId: string;
  attendeeName: string;
  timestamp: string;
  retryCount: number;
}

export const ROLE_CHECKIN_COLORS: Record<string, string> = {
  MERCHANT: '#10b981',
  ORGANIZER: '#3b82f6',
  EMPLOYEE: '#8b5cf6',
  APPROVER: '#f59e0b',
  FINANCE_OFFICER: '#06b6d4',
  ADMIN: '#ef4444',
  PUBLIC: '#6b7280',
};