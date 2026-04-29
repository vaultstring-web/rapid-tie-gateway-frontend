export interface SystemSettings {
  siteName: string;
  siteLogo?: string;
  favicon?: string;
  contactEmail: string;
  supportEmail: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export interface SecuritySettings {
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  passwordRequirement: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  twoFactorRequired: boolean;
  allowedIPs: string[];
  blockedIPs: string[];
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpSecure: boolean;
  fromEmail: string;
  fromName: string;
  sendTestEmail: string;
}

export interface NotificationSettings {
  emailNotifications: {
    userRegistration: boolean;
    paymentReceived: boolean;
    eventCreated: boolean;
    fraudAlert: boolean;
    systemAlert: boolean;
  };
  slackWebhook?: string;
  webhookUrl?: string;
}

export interface ApiSettings {
  rateLimit: {
    enabled: boolean;
    windowMs: number;
    maxRequests: number;
  };
  allowedOrigins: string[];
  apiKeys: {
    id: string;
    name: string;
    key: string;
    createdAt: string;
    lastUsed?: string;
    expiresAt?: string;
    permissions: string[];
  }[];
}

export interface MaintenanceSettings {
  mode: 'active' | 'maintenance' | 'degraded';
  message: string;
  allowIPs: string[];
  scheduledAt?: string;
  scheduledEnd?: string;
}

export interface BackupSettings {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  retention: number;
  time: string;
  storage: 'local' | 's3' | 'dropbox';
  lastBackup?: string;
  nextBackup?: string;
}