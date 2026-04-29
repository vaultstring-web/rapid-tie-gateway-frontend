export interface CalendarEvent {
  id: string;
  title: string;
  type: 'deadline' | 'meeting' | 'review' | 'approval';
  start: Date;
  end: Date;
  requestId?: string;
  requestNumber?: string;
  employeeName?: string;
  destination?: string;
  amount?: number;
  urgency: 'high' | 'medium' | 'low';
  description?: string;
}

export interface CalendarDay {
  date: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const EVENT_TYPE_CONFIG = {
  deadline: { label: 'Deadline', color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400', icon: '⏰' },
  meeting: { label: 'Meeting', color: 'bg-blue-500', textColor: 'text-blue-600 dark:text-blue-400', icon: '👥' },
  review: { label: 'Review', color: 'bg-yellow-500', textColor: 'text-yellow-600 dark:text-yellow-400', icon: '📋' },
  approval: { label: 'Approval', color: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400', icon: '✅' },
};