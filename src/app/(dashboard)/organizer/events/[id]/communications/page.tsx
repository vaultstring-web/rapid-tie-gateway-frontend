'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MessageSquare, History, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
import { MessageComposer } from '@/components/organizer/communications/MessageComposer';
import { RecipientSelector } from '@/components/organizer/communications/RecipientSelector';
import { SendHistory } from '@/components/organizer/communications/SendHistory';
import { bulkMessagingService } from '@/services/events/bulkMessaging.service';
import { RecipientFilter, SendHistory as SendHistoryType, ScheduledMessage } from '@/types/events/bulkMessaging';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

export default function BulkMessagingPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [activeTab, setActiveTab] = useState<'compose' | 'history' | 'scheduled'>('compose');
  const [recipientFilter, setRecipientFilter] = useState<RecipientFilter>({});
  const [sendHistory, setSendHistory] = useState<SendHistoryType[]>([]);
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const [loading, setLoading] = useState({
    history: true,
    scheduled: true,
  });

  const loadHistory = useCallback(async () => {
    try {
      const history = await bulkMessagingService.getSendHistory(eventId, 20);
      setSendHistory(history);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(prev => ({ ...prev, history: false }));
    }
  }, [eventId]);

  const loadScheduled = useCallback(async () => {
    try {
      const scheduled = await bulkMessagingService.getScheduledMessages(eventId);
      setScheduledMessages(scheduled);
    } catch (error) {
      console.error('Failed to load scheduled messages:', error);
    } finally {
      setLoading(prev => ({ ...prev, scheduled: false }));
    }
  }, [eventId]);

  useEffect(() => {
    loadHistory();
    loadScheduled();
  }, [loadHistory, loadScheduled]);

  const handleSendMessage = async (subject: string, content: string, scheduledFor?: Date) => {
    await bulkMessagingService.sendMessage(eventId, {
      eventId,
      subject,
      content,
      recipients: recipientFilter,
      scheduledFor: scheduledFor?.toISOString(),
    });
    await loadHistory();
    await loadScheduled();
  };

  const handleCancelScheduled = async (messageId: string) => {
    try {
      await bulkMessagingService.cancelScheduledMessage(eventId, messageId);
      await loadScheduled();
      toast.success('Scheduled message cancelled');
    } catch (error) {
      toast.error('Failed to cancel message');
    }
  };

  const tabs = [
    { id: 'compose', label: 'Compose', icon: MessageSquare },
    { id: 'history', label: 'History', icon: History, badge: sendHistory.length },
    { id: 'scheduled', label: 'Scheduled', icon: CalendarIcon, badge: scheduledMessages.length },
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm mb-2 inline-flex items-center gap-1 hover:text-primary-green-500 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            ← Back to Event
          </button>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Bulk Messaging
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Send messages to attendees, manage templates, and track performance
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all
                  ${activeTab === tab.id
                    ? 'border-b-2 border-primary-green-500 text-primary-green-500'
                    : 'hover:text-primary-green-500'
                  }
                `}
                style={{ color: activeTab === tab.id ? undefined : 'var(--text-secondary)' }}
              >
                <Icon size={16} />
                {tab.label}
                {tab.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary-green-500 text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Compose Tab */}
        {activeTab === 'compose' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MessageComposer
                eventId={eventId}
                onSend={handleSendMessage}
                templates={[]}
                loading={false}
              />
            </div>
            <div>
              <RecipientSelector
                eventId={eventId}
                onFilterChange={setRecipientFilter}
                loading={false}
              />
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-primary-green-500" />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Message History
              </h2>
            </div>
            <SendHistory
              history={sendHistory}
              loading={loading.history}
              onViewStats={(messageId) => {
                // Navigate to message stats or show modal
                console.log('View stats for:', messageId);
              }}
            />
          </div>
        )}

        {/* Scheduled Tab */}
        {activeTab === 'scheduled' && (
          <div
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Scheduled Messages
            </h2>
            {loading.scheduled ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : scheduledMessages.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon size={32} className="mx-auto mb-3 opacity-50" style={{ color: 'var(--text-secondary)' }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  No scheduled messages
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {scheduledMessages.map((msg) => (
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
                        <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {msg.subject}
                        </h3>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                          To: {msg.recipientCount.toLocaleString()} recipients
                        </p>
                        <p className="text-xs mt-2 flex items-center gap-1">
                          <CalendarIcon size={12} />
                          Scheduled for: {new Date(msg.scheduledFor).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCancelScheduled(msg.id)}
                        className="px-3 py-1.5 rounded-lg text-sm text-red-500 border border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}