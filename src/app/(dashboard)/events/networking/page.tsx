'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, MessageCircle, Calendar, Search, Filter } from 'lucide-react';
import { NetworkingSuggestions } from '@/components/networking/NetworkingSuggestions';
import { ConnectionRequests } from '@/components/networking/ConnectionRequests';
import { MessagingInterface } from '@/components/networking/MessagingInterface';
import { eventNetworkingService } from '@/services/events/eventNetworking.service';
import { SuggestedConnection, ConnectionRequest, Conversation, Attendee, EventAttendeeList } from '@/types/events/eventNetworking';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

export default function EventNetworkingPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'suggestions' | 'requests' | 'attendees'>('suggestions');
  const [suggestions, setSuggestions] = useState<SuggestedConnection[]>([]);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [events, setEvents] = useState<EventAttendeeList[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventAttendeeList | null>(null);
  const [showMessaging, setShowMessaging] = useState(false);
  const [loading, setLoading] = useState({
    suggestions: true,
    requests: true,
    attendees: true,
  });
  const [currentUser, setCurrentUser] = useState<Attendee | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await Promise.all([
      loadSuggestions(),
      loadRequests(),
      loadUpcomingEvents(),
      loadConversations(),
      loadCurrentUser(),
    ]);
  };

  const loadSuggestions = async () => {
    setLoading(prev => ({ ...prev, suggestions: true }));
    try {
      const data = await eventNetworkingService.getSuggestions();
      setSuggestions(data);
    } catch (error) {
      toast.error('Failed to load suggestions');
    } finally {
      setLoading(prev => ({ ...prev, suggestions: false }));
    }
  };

  const loadRequests = async () => {
    setLoading(prev => ({ ...prev, requests: true }));
    try {
      const data = await eventNetworkingService.getPendingRequests();
      setRequests(data);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(prev => ({ ...prev, requests: false }));
    }
  };

  const loadUpcomingEvents = async () => {
    setLoading(prev => ({ ...prev, attendees: true }));
    try {
      const data = await eventNetworkingService.getUpcomingEvents();
      setEvents(data);
      if (data.length > 0) setSelectedEvent(data[0]);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(prev => ({ ...prev, attendees: false }));
    }
  };

  const loadConversations = async () => {
    try {
      const data = await eventNetworkingService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadCurrentUser = async () => {
    try {
      // Get current user from auth service
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    } catch (error) {
      console.error('Failed to load current user:', error);
    }
  };

  const handleConnect = async (userId: string) => {
    try {
      await eventNetworkingService.sendConnectionRequest(userId);
      toast.success('Connection request sent');
      await loadSuggestions();
      await loadRequests();
    } catch (error) {
      toast.error('Failed to send request');
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await eventNetworkingService.acceptConnectionRequest(requestId);
      toast.success('Connection accepted');
      await loadRequests();
      await loadSuggestions();
    } catch (error) {
      toast.error('Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await eventNetworkingService.rejectConnectionRequest(requestId);
      toast.success('Connection declined');
      await loadRequests();
    } catch (error) {
      toast.error('Failed to decline request');
    }
  };

  const handleSendMessage = async (conversationId: string, content: string) => {
    try {
      await eventNetworkingService.sendMessage(conversationId, content);
      await loadConversations();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const tabs = [
    { id: 'suggestions', label: 'Suggestions', icon: UserPlus, count: suggestions.length },
    { id: 'requests', label: 'Requests', icon: Users, count: requests.length },
    { id: 'attendees', label: 'Attendees', icon: Calendar, count: events.length },
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Event Networking
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Connect with attendees, build your network
            </p>
          </div>
          <button
            onClick={() => setShowMessaging(!showMessaging)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-green-500 text-white hover:bg-primary-green-600 transition-colors"
          >
            <MessageCircle size={18} />
            Messages ({conversations.filter(c => c.unreadCount > 0).length})
          </button>
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
                {tab.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary-green-500 text-white">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'suggestions' && (
          <NetworkingSuggestions
            suggestions={suggestions}
            onConnect={handleConnect}
            loading={loading.suggestions}
          />
        )}

        {activeTab === 'requests' && (
          <ConnectionRequests
            requests={requests}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
            loading={loading.requests}
          />
        )}

        {activeTab === 'attendees' && (
          <div className="space-y-6">
            {/* Event Selector */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {events.map((event) => (
                <button
                  key={event.eventId}
                  onClick={() => setSelectedEvent(event)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    selectedEvent?.eventId === event.eventId
                      ? 'bg-primary-green-500 text-white'
                      : 'border hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  style={{
                    borderColor: 'var(--border-color)',
                    color: selectedEvent?.eventId === event.eventId ? undefined : 'var(--text-primary)',
                  }}
                >
                  {event.eventName}
                  <span className="ml-2 text-xs opacity-70">
                    ({event.totalCount})
                  </span>
                </button>
              ))}
            </div>

            {/* Attendee List */}
            {selectedEvent && (
              <div className="space-y-3">
                {selectedEvent.attendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="rounded-xl p-4 border flex justify-between items-center"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="flex gap-3 items-center">
                      <Image
                        src={attendee.avatar || '/images/default-avatar.png'}
                        alt={attendee.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {attendee.name}
                        </h4>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {attendee.title} at {attendee.company}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {attendee.interests.slice(0, 3).map((interest, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-full text-xs"
                              style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-secondary)' }}
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {!attendee.isConnected && attendee.id !== currentUser?.id && (
                      <button
                        onClick={() => handleConnect(attendee.id)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-green-500 text-white hover:bg-primary-green-600 transition-colors"
                      >
                        Connect
                      </button>
                    )}
                    {attendee.isConnected && (
                      <span className="text-sm text-green-500">✓ Connected</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Messaging Interface */}
      {showMessaging && currentUser && (
        <MessagingInterface
          conversations={conversations}
          currentUser={currentUser}
          onSendMessage={handleSendMessage}
          onSelectConversation={() => {}}
          onClose={() => setShowMessaging(false)}
        />
      )}
    </div>
  );
}