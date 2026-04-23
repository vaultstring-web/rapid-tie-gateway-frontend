export const PAYMENT_METHODS = {
  AIRTEL_MONEY: 'airtel_money',
  TNM_MPAMBA: 'tnm_mpamba',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
} as const

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  DISPUTED: 'disputed',
} as const

export const EVENT_TYPES = {
  CONCERT: 'concert',
  CONFERENCE: 'conference',
  WORKSHOP: 'workshop',
  SPORTS: 'sports',
  FESTIVAL: 'festival',
  CORPORATE: 'corporate',
  EDUCATION: 'education',
} as const

export const TICKET_TIERS = {
  VIP: 'vip',
  GENERAL: 'general',
  EARLY_BIRD: 'early_bird',
  GROUP: 'group',
  STUDENT: 'student',
} as const

export const DSA_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAID: 'paid',
  CANCELLED: 'cancelled',
} as const

export const USER_ROLES = {
  PUBLIC: 'public',
  MERCHANT: 'merchant',
  ORGANIZER: 'organizer',
  EMPLOYEE: 'employee',
  APPROVER: 'approver',
  FINANCE: 'finance',
  ADMIN: 'admin',
  COMPLIANCE: 'compliance',
} as const

export const NOTIFICATION_TYPES = {
  PAYMENT: 'payment',
  EVENT: 'event',
  DSA: 'dsa',
  SYSTEM: 'system',
  REMINDER: 'reminder',
} as const