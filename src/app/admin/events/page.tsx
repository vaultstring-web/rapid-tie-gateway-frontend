'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Filter } from 'lucide-react';
import { EventStatsCards } from '@/components/admin/events/EventStatsCards';
import { EventsTable } from '@/components/admin/events/EventsTable';
import { EventFilterBar } from '@/components/admin/events/EventFilterBar';
import { EventDetailModal } from '@/components/admin/events/EventDetailModal';
import { adminEventsService } from '@/services/admin/events.service';
import { AdminEvent, EventFilter, EventStats } from '@/types/admin/events';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const getMockEvents = (): AdminEvent[] => {
  const categories = ['concert', 'conference', 'workshop', 'festival'];
  const statuses = ['pending', 'approved', 'published', 'completed', 'cancelled'];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: `event-${i + 1}`,
    name: [`Malawi Fintech Expo`, `Tech Innovation Summit`, `Music Festival`, `Developer Workshop`, `Art Exhibition`][i % 5],
    description: 'This is a description of the event...',
    shortDescription: 'Short description',
    category: categories[i % categories.length] as any,
    type: 'public',
    status: statuses[i % statuses.length] as any,
    startDate: new Date(Date.now() + i * 86400000).toISOString(),
    endDate: new Date(Date.now() + (i + 1) * 86400000).toISOString(),
    venue: ['BICC', 'Sunbird Mount Soche', 'Chichiri Mall'][i % 3],
    city: ['Lilongwe', 'Blantyre', 'Mzuzu'][i % 3],
    country: 'Malawi',
    organizerId: `org-${(i % 5) + 1}`,
    organizerName: [`John Doe`, `Jane Smith`, `Mike Banda`, `Sarah Chilima`, `Peter Mwale`][i % 5],
    organizerEmail: `organizer${(i % 5) + 1}@example.com`,
    organizerPhone: '+265 999 123 456',
    images: [],
    ticketTiers: [
      { id: 't1', name: 'VIP', price: 150000, quantity: 100, sold: Math.floor(Math.random() * 100) },
      { id: 't2', name: 'Standard', price: 45000, quantity: 500, sold: Math.floor(Math.random() * 500) },
    ],
    totalTickets: 600,
    totalSold: Math.floor(Math.random() * 600),
    totalRevenue: Math.floor(Math.random() * 50000000),
    totalViews: Math.floor(Math.random() * 10000),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

const getMockStats = (): EventStats => {
  const events = getMockEvents();
  return {
    total: events.length,
    pending: events.filter(e => e.status === 'pending').length,
    approved: events.filter(e => e.status === 'approved').length,
    published: events.filter(e => e.status === 'published').length,
    completed: events.filter(e => e.status === 'completed').length,
    cancelled: events.filter(e => e.status === 'cancelled').length,
    totalRevenue: events.reduce((sum, e) => sum + e.totalRevenue, 0),
    totalTickets: events.reduce((sum, e) => sum + e.totalSold, 0),
    totalAttendees: events.reduce((sum, e) => sum + e.totalSold, 0),
    averageTicketPrice: 50000,
  };
};

const getMockOrganizers = () => {
  return [
    { id: 'org-1', name: 'John Doe' },
    { id: 'org-2', name: 'Jane Smith' },
    { id: 'org-3', name: 'Mike Banda' },
    { id: 'org-4', name: 'Sarah Chilima' },
    { id: 'org-5', name: 'Peter Mwale' },
  ];
};

export default function AdminEventsPage() {
  const { theme } = useTheme();
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);
  const [filters, setFilters] = useState<EventFilter>({
    search: '',
    status: '',
    category: '',
    organizerId: '',
  });
  const [useMockData, setUseMockData] = useState(true);
  const organizers = getMockOrganizers();

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      let mockEvents = getMockEvents();
      const mockStats = getMockStats();
      
      // Apply filters
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        mockEvents = mockEvents.filter(e =>
          e.name.toLowerCase().includes(searchLower) ||
          e.venue.toLowerCase().includes(searchLower) ||
          e.organizerName.toLowerCase().includes(searchLower)
        );
      }
      if (filters.status) {
        mockEvents = mockEvents.filter(e => e.status === filters.status);
      }
      if (filters.category) {
        mockEvents = mockEvents.filter(e => e.category === filters.category);
      }
      if (filters.organizerId) {
        mockEvents = mockEvents.filter(e => e.organizerId === filters.organizerId);
      }
      
      setEvents(mockEvents);
      setStats(mockStats);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId: string) => {
    if (useMockData) {
      setEvents(prev => prev.map(e =>
        e.id === eventId ? { ...e, status: 'approved' } : e
      ));
      toast.success('Event approved (demo)');
      return;
    }
    try {
      await adminEventsService.approveEvent(eventId);
      toast.success('Event approved');
      loadData();
    } catch (error) {
      toast.error('Failed to approve event');
    }
  };

  const handleReject = async (eventId: string) => {
    if (useMockData) {
      setEvents(prev => prev.map(e =>
        e.id === eventId ? { ...e, status: 'rejected' } : e
      ));
      toast.success('Event rejected (demo)');
      return;
    }
    try {
      await adminEventsService.rejectEvent(eventId, 'Rejected by admin');
      toast.success('Event rejected');
      loadData();
    } catch (error) {
      toast.error('Failed to reject event');
    }
  };

  const handlePublish = async (eventId: string) => {
    if (useMockData) {
      setEvents(prev => prev.map(e =>
        e.id === eventId ? { ...e, status: 'published' } : e
      ));
      toast.success('Event published (demo)');
      return;
    }
    try {
      await adminEventsService.publishEvent(eventId);
      toast.success('Event published');
      loadData();
    } catch (error) {
      toast.error('Failed to publish event');
    }
  };

  const handleCancel = async (eventId: string) => {
    if (useMockData) {
      setEvents(prev => prev.map(e =>
        e.id === eventId ? { ...e, status: 'cancelled' } : e
      ));
      toast.success('Event cancelled (demo)');
      return;
    }
    try {
      await adminEventsService.cancelEvent(eventId, 'Cancelled by admin');
      toast.success('Event cancelled');
      loadData();
    } catch (error) {
      toast.error('Failed to cancel event');
    }
  };

  const handleDelete = async (eventId: string) => {
    if (useMockData) {
      setEvents(prev => prev.filter(e => e.id !== eventId));
      toast.success('Event deleted (demo)');
      return;
    }
    try {
      await adminEventsService.deleteEvent(eventId);
      toast.success('Event deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const handleFilterChange = (newFilters: Partial<EventFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: '',
      category: '',
      organizerId: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Event Management</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage all events across the platform
          </p>
        </div>
        <button
          onClick={() => { loadData(); toast.success('Data refreshed'); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Demo Mode Notice */}
      {useMockData && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ℹ️ Demo Mode - Using sample event data. Connect to backend for live event management.
          </p>
        </div>
      )}

      {/* Stats Cards */}
      {stats && <EventStatsCards stats={stats} loading={loading} />}

      {/* Filters */}
      <EventFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        organizers={organizers}
      />

      {/* Events Table */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-color)]">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Events</h2>
            <p className="text-sm text-[var(--text-secondary)]">{events.length} events</p>
          </div>
        </div>
        <div className="p-4">
          <EventsTable
            events={events}
            loading={loading}
            onApprove={handleApprove}
            onReject={handleReject}
            onPublish={handlePublish}
            onCancel={handleCancel}
            onDelete={handleDelete}
            onViewDetails={setSelectedEvent}
          />
        </div>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}