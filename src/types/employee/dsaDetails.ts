export interface DsaRequestDetail {
  id: string;
  requestNumber: string;
  destination: string;
  purpose: string;
  startDate: string;
  endDate: string;
  duration: number;
  perDiemRate: number;
  accommodationRate: number;
  totalAmount: number;
  currency: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'paid' | 'cancelled';
  travelAuthRef?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  paidAt?: string;
  employee: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    grade: string;
    department: string;
  };
}

export interface ApprovalStep {
  id: string;
  level: number;
  approverName: string;
  approverAvatar?: string;
  approverRole: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  approvedAt?: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  createdAt: string;
  isApprover: boolean;
}

export interface LocalEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  city: string;
  category: string;
  imageUrl?: string;
  distance?: number;
  relevanceScore: number;
}