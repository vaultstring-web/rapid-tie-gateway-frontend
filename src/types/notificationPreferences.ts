export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';

export type EmailFrequency = 'instant' | 'daily' | 'weekly' | 'never';

export interface QuietHours {
  enabled: boolean;
  start: string; // Format: "21:00"
  end: string;   // Format: "08:00"
  timezone: string;
}

export interface NotificationPreference {
  id: string;
  category: NotificationCategory;
  enabled: boolean;
  channels: NotificationChannel[];
}

export type NotificationCategory = 
  | 'payment_received'
  | 'payment_sent'
  | 'event_reminder'
  | 'event_update'
  | 'event_cancellation'
  | 'new_event'
  | 'dsa_request_status'
  | 'dsa_approved'
  | 'dsa_disbursed'
  | 'connection_request'
  | 'connection_accepted'
  | 'new_message'
  | 'system_announcement'
  | 'security_alert'
  | 'marketing_promotion'
  | 'feature_update';

export interface NotificationPreferencesState {
  preferences: Record<NotificationCategory, NotificationPreference>;
  emailFrequency: EmailFrequency;
  quietHours: QuietHours;
  digestTime: string;
}

export const CATEGORY_CONFIG: Record<NotificationCategory, { label: string; description: string; icon: string; defaultEnabled: boolean }> = {
  payment_received: { 
    label: 'Payment Received', 
    description: 'When you receive a payment from customers', 
    icon: '💰', 
    defaultEnabled: true 
  },
  payment_sent: { 
    label: 'Payment Sent', 
    description: 'When you send a payment or disbursement', 
    icon: '💸', 
    defaultEnabled: true 
  },
  event_reminder: { 
    label: 'Event Reminders', 
    description: '24h and 1h before events you\'re attending', 
    icon: '⏰', 
    defaultEnabled: true 
  },
  event_update: { 
    label: 'Event Updates', 
    description: 'Changes to event details, venue, or schedule', 
    icon: '📅', 
    defaultEnabled: true 
  },
  event_cancellation: { 
    label: 'Event Cancellations', 
    description: 'When an event you\'re attending is cancelled', 
    icon: '🚫', 
    defaultEnabled: true 
  },
  new_event: { 
    label: 'New Events', 
    description: 'Recommended events based on your interests', 
    icon: '🎉', 
    defaultEnabled: false 
  },
  dsa_request_status: { 
    label: 'DSA Request Status', 
    description: 'Updates on your DSA request approvals', 
    icon: '📋', 
    defaultEnabled: true 
  },
  dsa_approved: { 
    label: 'DSA Approved', 
    description: 'When your DSA request is approved', 
    icon: '✅', 
    defaultEnabled: true 
  },
  dsa_disbursed: { 
    label: 'DSA Disbursed', 
    description: 'When your DSA payment is processed', 
    icon: '💵', 
    defaultEnabled: true 
  },
  connection_request: { 
    label: 'Connection Requests', 
    description: 'When someone wants to connect with you', 
    icon: '🤝', 
    defaultEnabled: true 
  },
  connection_accepted: { 
    label: 'Connection Accepted', 
    description: 'When someone accepts your connection request', 
    icon: '✅', 
    defaultEnabled: true 
  },
  new_message: { 
    label: 'New Messages', 
    description: 'When you receive a direct message', 
    icon: '💬', 
    defaultEnabled: true 
  },
  system_announcement: { 
    label: 'System Announcements', 
    description: 'Important platform updates and maintenance', 
    icon: '📢', 
    defaultEnabled: true 
  },
  security_alert: { 
    label: 'Security Alerts', 
    description: 'Login alerts and security notifications', 
    icon: '🔒', 
    defaultEnabled: true 
  },
  marketing_promotion: { 
    label: 'Marketing & Promotions', 
    description: 'Special offers and promotions', 
    icon: '🎁', 
    defaultEnabled: false 
  },
  feature_update: { 
    label: 'Feature Updates', 
    description: 'New features and improvements', 
    icon: '✨', 
    defaultEnabled: true 
  },
};