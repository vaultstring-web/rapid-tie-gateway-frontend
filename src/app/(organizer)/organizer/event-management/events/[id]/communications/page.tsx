'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Send,
  Mail,
  Smartphone,
  Users,
  Clock,
  Calendar as CalendarIcon,
  TrendingUp,
  History,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Types
interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  preview: string;
  createdAt: string;
}

interface ScheduledMessage {
  id: string;
  subject: string;
  recipientCount: number;
  scheduledFor: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
}

interface SendHistory {
  id: string;
  subject: string;
  recipientCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  sentAt: string;
  status: 'success' | 'partial' | 'failed';
}

// Helper Icons
const TicketIcon = ({ size, className }: { size: number; className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
  </svg>
);

const UsersIcon = ({ size, className }: { size: number; className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const DollarSignIcon = ({ size, className }: { size: number; className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const MessageSquareIcon = ({ size, className }: { size: number; className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const QrCodeIcon = ({ size, className }: { size: number; className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <line x1="3" y1="21" x2="21" y2="21" />
    <line x1="21" y1="3" x2="21" y2="15" />
  </svg>
);

// Event Management Modules Navigation
const EVENT_MODULES = [
  { name: 'Event Details', href: (id: string) => `/organizer/event-management/events/${id}`, icon: 'Details' },
  { name: 'Ticket Tiers', href: (id: string) => `/organizer/event-management/events/${id}/tiers`, icon: 'Ticket' },
  { name: 'Attendees', href: (id: string) => `/organizer/event-management/events/${id}/attendees`, icon: 'Users' },
  { name: 'Check-in', href: (id: string) => `/organizer/event-management/events/${id}/checkin`, icon: 'CheckCircle' },
  { name: 'Sales', href: (id: string) => `/organizer/event-management/events/${id}/sales`, icon: 'BarChart3' },
  { name: 'Messaging', href: (id: string) => `/organizer/event-management/events/${id}/communications`, icon: 'MessageSquare' },
  { name: 'QR Codes', href: (id: string) => `/organizer/events/${id}/qrcodes`, icon: 'QrCode' },
];

// Mock data
const getMockTemplates = (): MessageTemplate[] => [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to [Event Name]!',
    content: 'Dear attendee,\n\nThank you for registering for [Event Name]. We look forward to seeing you!\n\nBest regards,\nThe Team',
    preview: 'Welcome email template for new registrants',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Event Reminder',
    subject: 'Reminder: [Event Name] starts tomorrow!',
    content: 'Dear attendee,\n\nThis is a friendly reminder that [Event Name] starts tomorrow at [Venue].\n\nSee you there!\n\nThe Team',
    preview: '24-hour reminder before event starts',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Thank You',
    subject: 'Thank you for attending [Event Name]',
    content: 'Dear attendee,\n\nThank you for attending [Event Name]. We hope you enjoyed the event!\n\nPlease share your feedback.\n\nBest regards,\nThe Team',
    preview: 'Post-event thank you message',
    createdAt: new Date().toISOString(),
  },
];

const getMockScheduledMessages = (): ScheduledMessage[] => [
  {
    id: '1',
    subject: 'Event Reminder - 24 hours to go',
    recipientCount: 1250,
    scheduledFor: new Date(Date.now() + 86400000).toISOString(),
    status: 'pending',
  },
  {
    id: '2',
    subject: 'Special Announcement: Keynote Speaker',
    recipientCount: 1250,
    scheduledFor: new Date(Date.now() + 172800000).toISOString(),
    status: 'pending',
  },
];

const getMockSendHistory = (): SendHistory[] => [
  {
    id: '1',
    subject: 'Welcome to Malawi Fintech Expo',
    recipientCount: 1250,
    deliveredCount: 1245,
    openedCount: 980,
    clickedCount: 450,
    sentAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'success',
  },
  {
    id: '2',
    subject: 'Early Bird Registration Now Open',
    recipientCount: 1200,
    deliveredCount: 1198,
    openedCount: 890,
    clickedCount: 320,
    sentAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'success',
  },
  {
    id: '3',
    subject: 'Limited Time Offer: 20% Discount',
    recipientCount: 1150,
    deliveredCount: 1145,
    openedCount: 750,
    clickedCount: 210,
    sentAt: new Date(Date.now() - 259200000).toISOString(),
    status: 'success',
  },
];

// Message Composer Component
const MessageComposer = ({ onSend }: { onSend: (subject: string, content: string, scheduleDate?: Date) => Promise<void> }) => {
  const { theme } = useTheme();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [isScheduled, setIsScheduled] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [recipientCount, setRecipientCount] = useState(1250);

  const handleSend = async () => {
    if (!subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }
    if (!content.trim()) {
      toast.error('Please enter message content');
      return;
    }

    setSending(true);
    try {
      const scheduledDateTime = isScheduled && scheduleDate
        ? new Date(`${scheduleDate.toISOString().split('T')[0]}T${scheduleTime}`)
        : undefined;
      
      await onSend(subject, content, scheduledDateTime);
      setSubject('');
      setContent('');
      setIsScheduled(false);
      setScheduleDate(null);
      toast.success(isScheduled ? 'Message scheduled successfully' : 'Message sent successfully');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Recipient Info */}
      <div className="p-4 rounded-lg bg-[#84cc16]/10 border border-[#84cc16]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#84cc16]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">Recipients</span>
          </div>
          <span className="text-lg font-bold text-[#84cc16]">{recipientCount.toLocaleString()} attendees</span>
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter message subject"
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Message Content */}
      <div>
        <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
          Message Content <span className="text-red-500">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          placeholder="Write your message here..."
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] resize-y"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Schedule Options */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isScheduled}
            onChange={(e) => setIsScheduled(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
          />
          <span className="text-sm text-[var(--text-primary)]">Schedule for later</span>
        </label>
        
        {isScheduled && (
          <div className="flex gap-3">
            <div className="relative">
              <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="date"
                value={scheduleDate ? scheduleDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setScheduleDate(new Date(e.target.value))}
                className="pl-9 pr-3 py-1.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <div className="relative">
              <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Preview Button & Send Button */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={() => setShowPreview(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Eye size={16} />
          Preview
        </button>
        <button
          onClick={handleSend}
          disabled={sending}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-colors disabled:opacity-50"
        >
          {sending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={16} />
          )}
          {isScheduled ? 'Schedule Message' : 'Send Now'}
        </button>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowPreview(false)}>
          <div
            className="rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              borderWidth: 1,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Message Preview</h3>
              <button onClick={() => setShowPreview(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X size={18} className="text-[var(--text-secondary)]" />
              </button>
            </div>
            <div className="border rounded-lg p-4 mb-4" style={{ borderColor: 'var(--border-color)' }}>
              <p className="text-sm font-medium mb-2 text-[var(--text-primary)]">Subject: {subject || '(No subject)'}</p>
              <div className="whitespace-pre-wrap text-sm" style={{ color: 'var(--text-primary)' }}>
                {content || '(No content)'}
              </div>
            </div>
            <button
              onClick={() => setShowPreview(false)}
              className="w-full py-2 rounded-lg bg-[#84cc16] text-white font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Send History Component
const SendHistoryList = ({ history, loading }: { history: SendHistory[]; loading: boolean }) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <Mail size={32} className="mx-auto mb-3 opacity-50 text-[var(--text-secondary)]" />
        <p className="text-sm text-[var(--text-secondary)]">No messages sent yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <div
          key={item.id}
          className="rounded-xl p-4 border cursor-pointer hover:shadow-md transition-all"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={14} className="text-green-500" />
                <h3 className="font-medium text-[var(--text-primary)]">{item.subject}</h3>
              </div>
              <div className="flex flex-wrap gap-4 text-xs mt-2 text-[var(--text-secondary)]">
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {item.recipientCount.toLocaleString()} recipients
                </span>
                <span className="flex items-center gap-1">
                  <Mail size={12} />
                  {item.deliveredCount.toLocaleString()} delivered
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {item.openedCount.toLocaleString()} opened
                </span>
                <span className="flex items-center gap-1">
                  <MousePointer size={12} />
                  {item.clickedCount.toLocaleString()} clicks
                </span>
              </div>
              <p className="text-xs mt-2 text-[var(--text-secondary)]">
                Sent: {formatDate(item.sentAt)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper component for MousePointer
const MousePointer = ({ size, className }: { size: number; className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
    <path d="M13 13l6 6" />
  </svg>
);

// Scheduled Messages Component
const ScheduledMessagesList = ({ messages, loading, onCancel }: { messages: ScheduledMessage[]; loading: boolean; onCancel: (id: string) => void }) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock size={32} className="mx-auto mb-3 opacity-50 text-[var(--text-secondary)]" />
        <p className="text-sm text-[var(--text-secondary)]">No scheduled messages</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="rounded-xl p-4 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-[var(--text-primary)]">{msg.subject}</h3>
              <p className="text-sm mt-1 text-[var(--text-secondary)]">
                To: {msg.recipientCount.toLocaleString()} recipients
              </p>
              <p className="text-xs mt-2 flex items-center gap-1 text-[var(--text-secondary)]">
                <CalendarIcon size={12} />
                Scheduled for: {new Date(msg.scheduledFor).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => onCancel(msg.id)}
              className="px-3 py-1.5 rounded-lg text-sm text-red-500 border border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function CommunicationsPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [activeTab, setActiveTab] = useState<'compose' | 'history' | 'scheduled'>('compose');
  const [templates] = useState<MessageTemplate[]>(getMockTemplates());
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>(getMockScheduledMessages());
  const [sendHistory, setSendHistory] = useState<SendHistory[]>(getMockSendHistory());
  const [loading, setLoading] = useState({ history: false, scheduled: false });

  const handleSendMessage = async (subject: string, content: string, scheduledFor?: Date) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (scheduledFor) {
      const newScheduled: ScheduledMessage = {
        id: Date.now().toString(),
        subject,
        recipientCount: 1250,
        scheduledFor: scheduledFor.toISOString(),
        status: 'pending',
      };
      setScheduledMessages(prev => [...prev, newScheduled]);
    } else {
      const newHistory: SendHistory = {
        id: Date.now().toString(),
        subject,
        recipientCount: 1250,
        deliveredCount: 1248,
        openedCount: 0,
        clickedCount: 0,
        sentAt: new Date().toISOString(),
        status: 'success',
      };
      setSendHistory(prev => [newHistory, ...prev]);
    }
  };

  const handleCancelScheduled = async (messageId: string) => {
    setScheduledMessages(prev => prev.filter(m => m.id !== messageId));
    toast.success('Scheduled message cancelled');
  };

  const getIconForModule = (iconName: string) => {
    switch (iconName) {
      case 'Details': return Eye;
      case 'Ticket': return TicketIcon;
      case 'Users': return UsersIcon;
      case 'CheckCircle': return CheckCircle;
      case 'BarChart3': return DollarSignIcon;
      case 'MessageSquare': return MessageSquareIcon;
      case 'QrCode': return QrCodeIcon;
      default: return Eye;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Bulk Messaging</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Send messages to attendees and track performance
          </p>
        </div>
      </div>

      {/* Event Management Modules Navigation */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Event Management</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
          {EVENT_MODULES.map((module) => {
            const isActive = module.name === 'Messaging';
            const IconComponent = getIconForModule(module.icon);
            return (
              <Link
                key={module.name}
                href={module.href(eventId)}
                className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#84cc16] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[#84cc16] hover:bg-[var(--bg-primary)]'
                }`}
              >
                <IconComponent size={16} />
                <span className="text-sm font-medium">{module.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--border-color)]">
        <button
          onClick={() => setActiveTab('compose')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'compose'
              ? 'border-b-2 border-[#84cc16] text-[#84cc16]'
              : 'text-[var(--text-secondary)] hover:text-[#84cc16]'
          }`}
        >
          <Send size={16} />
          Compose
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'history'
              ? 'border-b-2 border-[#84cc16] text-[#84cc16]'
              : 'text-[var(--text-secondary)] hover:text-[#84cc16]'
          }`}
        >
          <History size={16} />
          History
          {sendHistory.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-[#84cc16] text-white">
              {sendHistory.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('scheduled')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'scheduled'
              ? 'border-b-2 border-[#84cc16] text-[#84cc16]'
              : 'text-[var(--text-secondary)] hover:text-[#84cc16]'
          }`}
        >
          <Clock size={16} />
          Scheduled
          {scheduledMessages.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-[#84cc16] text-white">
              {scheduledMessages.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-6">
        {activeTab === 'compose' && (
          <MessageComposer onSend={handleSendMessage} />
        )}

        {activeTab === 'history' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-[#84cc16]" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Message History</h2>
            </div>
            <SendHistoryList history={sendHistory} loading={loading.history} />
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Scheduled Messages</h2>
            <ScheduledMessagesList
              messages={scheduledMessages}
              loading={loading.scheduled}
              onCancel={handleCancelScheduled}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function for X icon (used in modal)
const X = ({ size, className }: { size: number; className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);