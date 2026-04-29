export interface OrganizerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organizationName: string;
  organizationType: 'company' | 'non_profit' | 'individual' | 'government';
  registrationNumber?: string;
  taxId?: string;
  website?: string;
  bio?: string;
  logo?: string;
  coverImage?: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  emailNotifications: {
    eventReminders: boolean;
    ticketSales: boolean;
    attendeeCheckins: boolean;
    newMessages: boolean;
    systemUpdates: boolean;
    marketingEmails: boolean;
  };
  pushNotifications: {
    eventReminders: boolean;
    ticketSales: boolean;
    attendeeCheckins: boolean;
    newMessages: boolean;
  };
  emailFrequency: 'instant' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
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
  loginHistory: {
    id: string;
    timestamp: string;
    ip: string;
    device: string;
    location: string;
    successful: boolean;
  }[];
}

export interface BillingInfo {
  plan: 'free' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'past_due' | 'canceled' | 'trialing';
  nextBillingDate?: string;
  paymentMethod: {
    type: 'card' | 'bank';
    last4: string;
    expiry?: string;
  };
  invoices: {
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    pdf: string;
  }[];
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsed?: string;
  createdAt: string;
  expiresAt?: string;
  permissions: ('read' | 'write' | 'admin')[];
}

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
  avatar?: string;
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
}