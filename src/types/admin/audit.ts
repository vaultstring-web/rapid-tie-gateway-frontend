export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  userRole: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure' | 'warning';
  details?: string;
  hash: string;
  previousHash: string;
}

export interface AuditFilter {
  search: string;
  action: string;
  entity: string;
  userId: string;
  status: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AuditStats {
  total: number;
  byAction: Record<string, number>;
  byEntity: Record<string, number>;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export const EVENT_ACTIONS = [
  { value: 'login', label: 'Login', category: 'authentication', icon: '🔐' },
  { value: 'logout', label: 'Logout', category: 'authentication', icon: '🚪' },
  { value: 'login_failed', label: 'Login Failed', category: 'authentication', icon: '❌' },
  { value: 'password_change', label: 'Password Change', category: 'authentication', icon: '🔑' },
  { value: '2fa_enable', label: '2FA Enabled', category: 'security', icon: '🔒' },
  { value: '2fa_disable', label: '2FA Disabled', category: 'security', icon: '🔓' },
  { value: 'user_create', label: 'User Created', category: 'user_management', icon: '👤' },
  { value: 'user_update', label: 'User Updated', category: 'user_management', icon: '✏️' },
  { value: 'user_delete', label: 'User Deleted', category: 'user_management', icon: '🗑️' },
  { value: 'role_change', label: 'Role Changed', category: 'user_management', icon: '🔄' },
  { value: 'merchant_approve', label: 'Merchant Approved', category: 'merchant', icon: '✅' },
  { value: 'merchant_suspend', label: 'Merchant Suspended', category: 'merchant', icon: '⛔' },
  { value: 'event_create', label: 'Event Created', category: 'event', icon: '📅' },
  { value: 'event_update', label: 'Event Updated', category: 'event', icon: '✏️' },
  { value: 'event_delete', label: 'Event Deleted', category: 'event', icon: '🗑️' },
  { value: 'ticket_purchase', label: 'Ticket Purchase', category: 'payment', icon: '🎫' },
  { value: 'payment_process', label: 'Payment Processed', category: 'payment', icon: '💰' },
  { value: 'refund_process', label: 'Refund Processed', category: 'payment', icon: '↩️' },
  { value: 'dsa_request', label: 'DSA Request', category: 'dsa', icon: '📋' },
  { value: 'dsa_approve', label: 'DSA Approved', category: 'dsa', icon: '✓' },
  { value: 'dsa_disburse', label: 'DSA Disbursed', category: 'dsa', icon: '💵' },
  { value: 'settings_change', label: 'Settings Changed', category: 'settings', icon: '⚙️' },
  { value: 'api_key_create', label: 'API Key Created', category: 'api', icon: '🔑' },
  { value: 'api_key_revoke', label: 'API Key Revoked', category: 'api', icon: '🚫' },
];

export const ACTION_CATEGORIES = [
  { value: 'authentication', label: 'Authentication', icon: '🔐' },
  { value: 'security', label: 'Security', icon: '🛡️' },
  { value: 'user_management', label: 'User Management', icon: '👥' },
  { value: 'merchant', label: 'Merchant', icon: '🏪' },
  { value: 'event', label: 'Event', icon: '📅' },
  { value: 'payment', label: 'Payment', icon: '💰' },
  { value: 'dsa', label: 'DSA', icon: '📋' },
  { value: 'settings', label: 'Settings', icon: '⚙️' },
  { value: 'api', label: 'API', icon: '🔌' },
];