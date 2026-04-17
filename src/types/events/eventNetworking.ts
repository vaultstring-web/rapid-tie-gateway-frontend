export interface Attendee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'MERCHANT' | 'ORGANIZER' | 'EMPLOYEE' | 'APPROVER' | 'FINANCE_OFFICER' | 'ADMIN';
  company: string;
  title: string;
  bio: string;
  interests: string[];
  isConnected: boolean;
  connectionStatus?: 'pending' | 'accepted' | 'rejected';
}

export interface SuggestedConnection {
  attendee: Attendee;
  mutualEvents: MutualEvent[];
  mutualInterests: number;
  matchScore: number;
  suggestedReason: string;
}

export interface MutualEvent {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventImage: string;
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: Attendee;
  toUser: Attendee;
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
  sender?: Attendee;
  receiver?: Attendee;
}

export interface Conversation {
  id: string;
  participants: Attendee[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface EventAttendeeList {
  eventId: string;
  eventName: string;
  eventDate: string;
  attendees: Attendee[];
  totalCount: number;
}

export const ROLE_BADGE_COLORS: Record<string, string> = {
  MERCHANT: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  ORGANIZER: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  EMPLOYEE: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  APPROVER: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  FINANCE_OFFICER: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
  ADMIN: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
};