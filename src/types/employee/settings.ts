export interface EmployeeProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  department: string;
  position: string;
  joinDate: string;
  avatar?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface NotificationPreferences {
  email: {
    paymentReceived: boolean;
    dsaApproved: boolean;
    dsaDisbursed: boolean;
    systemUpdates: boolean;
  };
  push: {
    paymentReceived: boolean;
    dsaApproved: boolean;
    dsaDisbursed: boolean;
  };
  sms: {
    paymentReceived: boolean;
    dsaDisbursed: boolean;
  };
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
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}