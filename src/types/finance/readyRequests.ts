export interface ReadyRequest {
  id: string;
  requestNumber: string;
  employeeName: string;
  employeeId: string;
  department: string;
  destination: string;
  purpose: string;
  startDate: string;
  endDate: string;
  duration: number;
  amount: number;
  perDiemRate: number;
  accommodationRate?: number;
  totalAmount: number;
  approvedAt: string;
  approvedBy: string;
  hasEventAttendance: boolean;
  eventDetails?: {
    id: string;
    name: string;
    date: string;
    location: string;
  };
  recipientDetails: {
    name: string;
    phone: string;
    accountNumber?: string;
    provider?: 'airtel' | 'mpamba' | 'bank';
    isValid: boolean;
    validationError?: string;
  };
  status: 'pending' | 'validated' | 'failed';
  selected: boolean;
}

export interface EventGroup {
  eventId: string;
  eventName: string;
  eventDate: string;
  requests: ReadyRequest[];
  totalAmount: number;
  requestCount: number;
}

export interface ValidationSummary {
  totalRequests: number;
  validRequests: number;
  invalidRequests: number;
  totalAmount: number;
  validAmount: number;
  invalidAmount: number;
}

export const PAYMENT_PROVIDERS = {
  airtel: { label: 'Airtel Money', icon: '📱', color: '#ff6600' },
  mpamba: { label: 'TNM Mpamba', icon: '📱', color: '#00a651' },
  bank: { label: 'Bank Transfer', icon: '🏦', color: '#3b82f6' },
};