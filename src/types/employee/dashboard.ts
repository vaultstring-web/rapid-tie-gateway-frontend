export interface EmployeeStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  paidAmount: number;
  pendingAmount: number;
}

export interface DSARequest {
  id: string;
  destination: string;
  purpose: string;
  startDate: string;
  endDate: string;
  duration: number;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  submittedAt: string;
  approvedAt?: string;
  paidAt?: string;
  travelAuthRef?: string;
}

export interface RecentPayment {
  id: string;
  requestId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  reference: string;
  status: 'completed' | 'processing' | 'failed';
}

export interface DestinationEvent {
  id: string;
  name: string;
  city: string;
  startDate: string;
  imageUrl: string;
  ticketPrice: number;
  distance?: number;
}

export const DSA_STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: '⏳' },
  approved: { label: 'Approved', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: '✅' },
  rejected: { label: 'Rejected', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: '❌' },
  paid: { label: 'Paid', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: '💰' },
};

export const PAYMENT_STATUS_CONFIG = {
  completed: { label: 'Completed', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
  processing: { label: 'Processing', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  failed: { label: 'Failed', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
};