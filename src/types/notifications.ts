export type NotificationType = 
  | 'payment' 
  | 'event' 
  | 'dsa' 
  | 'system' 
  | 'reminder' 
  | 'connection' 
  | 'message';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: {
    eventId?: string;
    transactionId?: string;
    requestId?: string;
    connectionId?: string;
    conversationId?: string;
    amount?: number;
    currency?: string;
    image?: string;
    actionUrl?: string;
    buttonText?: string;
  };
  sender?: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  hasMore: boolean;
  unreadCount: number;
  page: number;
  limit: number;
}

export const NOTIFICATION_TYPE_CONFIG: Record<NotificationType, { label: string; icon: string; color: string }> = {
  payment: { label: 'Payments', icon: '💰', color: 'text-green-500' },
  event: { label: 'Events', icon: '🎫', color: 'text-purple-500' },
  dsa: { label: 'DSA', icon: '📋', color: 'text-blue-500' },
  system: { label: 'System', icon: '⚙️', color: 'text-gray-500' },
  reminder: { label: 'Reminders', icon: '⏰', color: 'text-yellow-500' },
  connection: { label: 'Connections', icon: '🤝', color: 'text-indigo-500' },
  message: { label: 'Messages', icon: '💬', color: 'text-teal-500' },
};