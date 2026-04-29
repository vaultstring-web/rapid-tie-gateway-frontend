export interface ApproverProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: string;
  department: string;
  employeeId: string;
  joinDate: string;
  bio?: string;
}

export interface NotificationSettings {
  email: {
    newRequest: boolean;
    reminder: boolean;
    approvalUpdate: boolean;
    teamActivity: boolean;
    weeklyDigest: boolean;
  };
  push: {
    newRequest: boolean;
    reminder: boolean;
    approvalUpdate: boolean;
  };
  emailFrequency: 'instant' | 'daily' | 'weekly';
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  sessions: {
    id: string;
    device: string;
    location: string;
    lastActive: string;
    current: boolean;
  }[];
  loginHistory: {
    id: string;
    timestamp: string;
    ip: string;
    device: string;
    location: string;
    successful: boolean;
  }[];
}

export interface ApprovalLimits {
  maxAmount: number;
  requiresSecondApproval: number;
  autoApproveUnder: number;
  delegatedTo?: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  }[];
  defaultDepartment: string;
  restrictedDestinations: string[];
}

export interface DelegationRequest {
  delegateId: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export const DEPARTMENTS = [
  'Finance', 'Operations', 'HR', 'IT', 'Sales', 'Marketing', 'Field Operations', 'Administration'
];

export const DESTINATIONS = [
  'Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Mangochi', 'Karonga', 'Salima', 'Kasungu', 'Dedza'
];