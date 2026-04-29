'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar as CalendarIcon, 
  Filter, 
  Download, 
  List, 
  Grid3X3,
  Clock,
  User,
  MapPin,
  DollarSign
} from 'lucide-react';
import { ApproverCalendarView } from '@/components/approver/ApproverCalendarView';
import { CalendarEvent } from '@/types/approver/calendar';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for approver calendar
const getMockCalendarEvents = (): CalendarEvent[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return [
    {
      id: '1',
      title: 'DSA Approval Deadline',
      type: 'deadline',
      start: new Date(today),
      end: new Date(today),
      requestId: 'req-1',
      requestNumber: 'DSA-2024-001',
      employeeName: 'John Doe',
      destination: 'Lilongwe',
      amount: 135000,
      urgency: 'high',
      description: 'Travel authorization expires today',
    },
    {
      id: '2',
      title: 'Team Review Meeting',
      type: 'meeting',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 10, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 11, 0),
      description: 'Weekly approval team meeting',
    },
    {
      id: '3',
      title: 'Request Review',
      type: 'review',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 15, 30),
      requestId: 'req-2',
      requestNumber: 'DSA-2024-002',
      employeeName: 'Jane Smith',
      destination: 'Blantyre',
      amount: 80000,
      urgency: 'medium',
    },
    {
      id: '4',
      title: 'Approval Due',
      type: 'approval',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 9, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 17, 0),
      requestId: 'req-3',
      requestNumber: 'DSA-2024-003',
      employeeName: 'Mike Johnson',
      destination: 'Mzuzu',
      amount: 152000,
      urgency: 'high',
    },
    {
      id: '5',
      title: 'Training Session',
      type: 'meeting',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 13, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 16, 0),
      description: 'New approval system training',
    },
    {
      id: '6',
      title: 'Quarterly Review',
      type: 'meeting',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 9, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 12, 0),
      description: 'Q2 performance review',
    },
    {
      id: '7',
      title: 'DSA Deadline',
      type: 'deadline',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
      requestId: 'req-4',
      requestNumber: 'DSA-2024-004',
      employeeName: 'Sarah Williams',
      destination: 'Lilongwe',
      amount: 225000,
      urgency: 'medium',
    },
  ];
};

export default function ApproverCalendarPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const mockEvents = getMockCalendarEvents();
      setEvents(mockEvents);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load calendar events:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (event.requestId) {
      router.push(`/approver/requests/${event.requestId}`);
    }
  };

  const handleExport = () => {
    toast.info('Exporting calendar... (demo)');
  };

  const groupedEvents = events.reduce((acc, event) => {
    const dateKey = event.start.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  const sortedDates = Object.keys(groupedEvents).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const getEventTypeStyles = (type: string) => {
    const config: Record<string, { bg: string; text: string; border: string }> = {
      deadline: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800' },
      meeting: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
      review: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-800' },
      approval: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-800' },
    };
    return config[type] || config.meeting;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Calendar</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Track deadlines, meetings, and approval schedules
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
            <button
              onClick={() => setView('calendar')}
              className={`p-2 transition-colors ${view === 'calendar' ? 'bg-[#84cc16] text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              style={{ backgroundColor: view === 'calendar' ? undefined : 'var(--bg-secondary)' }}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 transition-colors ${view === 'list' ? 'bg-[#84cc16] text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              style={{ backgroundColor: view === 'list' ? undefined : 'var(--bg-secondary)' }}
            >
              <List size={16} />
            </button>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Demo Mode Notice */}
      {useMockData && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ℹ️ Demo Mode - Using sample data. Connect to backend for live calendar data.
          </p>
        </div>
      )}

      {/* Calendar View */}
      {view === 'calendar' ? (
        <ApproverCalendarView
          events={events}
          onEventClick={handleEventClick}
          loading={loading}
        />
      ) : (
        /* List View */
        <div className="space-y-6">
          {sortedDates.map((dateKey) => (
            <div key={dateKey} className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
              <div className="px-5 py-3 border-b bg-[var(--bg-primary)]" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-2">
                  <CalendarIcon size={16} className="text-[#84cc16]" />
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    {new Date(dateKey).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h3>
                </div>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                {groupedEvents[dateKey].map((event) => {
                  const styles = getEventTypeStyles(event.type);
                  return (
                    <div
                      key={event.id}
                      className="p-4 hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${styles.bg.replace('bg-', 'bg-')}`} />
                        <div className="flex-1">
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-[var(--text-primary)]">{event.title}</h4>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${styles.bg} ${styles.text}`}>
                                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                </span>
                                {event.urgency === 'high' && (
                                  <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                                    Urgent
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-3 mt-1 text-sm text-[var(--text-secondary)]">
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  {event.end && ` - ${event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                </span>
                                {event.employeeName && (
                                  <span className="flex items-center gap-1">
                                    <User size={12} />
                                    {event.employeeName}
                                  </span>
                                )}
                                {event.destination && (
                                  <span className="flex items-center gap-1">
                                    <MapPin size={12} />
                                    {event.destination}
                                  </span>
                                )}
                                {event.amount && (
                                  <span className="flex items-center gap-1">
                                    <DollarSign size={12} />
                                    {formatCurrency(event.amount)}
                                  </span>
                                )}
                              </div>
                            </div>
                            {event.requestNumber && (
                              <span className="text-xs font-mono text-[var(--text-secondary)]">
                                {event.requestNumber}
                              </span>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-sm text-[var(--text-secondary)] mt-2">{event.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function for formatting currency in list view
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-MW', { style: 'currency', currency: 'MWK', minimumFractionDigits: 0 }).format(amount);
}