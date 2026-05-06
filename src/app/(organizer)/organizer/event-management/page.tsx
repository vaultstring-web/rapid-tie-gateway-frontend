'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  MapPin,
  Users,
  Ticket,
  Eye,
  MoreVertical,
  Search,
  Filter,
  Plus,
  Copy,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  BarChart3,
  MessageSquare,
  QrCode,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const MOCK_EVENTS = [
  {
    id: 'evt_001',
    name: 'Malawi Fintech Expo 2026',
    description: 'The largest fintech conference in Malawi featuring industry leaders and innovators.',
    shortDescription: 'Annual fintech conference',
    category: 'conference',
    startDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 8 * 86400000).toISOString(),
    venue: 'Bingu International Convention Centre',
    city: 'Lilongwe',
    imageUrl: 'https://picsum.photos/seed/fintech1/400/200',
    status: 'published',
    ticketTiers: [
      { id: 't1', name: 'VIP', price: 150000, sold: 45, quantity: 100 },
      { id: 't2', name: 'Standard', price: 45000, sold: 320, quantity: 500 },
    ],
    visibilityMetrics: { total: 2450 },
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'evt_002',
    name: 'Tech Innovation Summit',
    description: 'Bringing together tech entrepreneurs and investors.',
    shortDescription: 'Tech summit',
    category: 'conference',
    startDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 15 * 86400000).toISOString(),
    venue: 'Sunbird Mount Soche',
    city: 'Blantyre',
    imageUrl: 'https://picsum.photos/seed/tech1/400/200',
    status: 'published',
    ticketTiers: [
      { id: 't1', name: 'VIP', price: 85000, sold: 78, quantity: 150 },
      { id: 't2', name: 'Regular', price: 35000, sold: 210, quantity: 400 },
    ],
    visibilityMetrics: { total: 1820 },
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    id: 'evt_003',
    name: 'Developer Workshop Series',
    description: 'Hands-on workshops for software developers.',
    shortDescription: 'Developer workshop',
    category: 'workshop',
    startDate: new Date(Date.now() + 21 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 22 * 86400000).toISOString(),
    venue: 'Virtual',
    city: 'Online',
    imageUrl: 'https://picsum.photos/seed/dev1/400/200',
    status: 'draft',
    ticketTiers: [
      { id: 't1', name: 'Early Bird', price: 15000, sold: 45, quantity: 100 },
      { id: 't2', name: 'Regular', price: 25000, sold: 0, quantity: 200 },
    ],
    visibilityMetrics: { total: 340 },
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'evt_004',
    name: 'Music Festival Malawi',
    description: 'Annual music festival featuring local and international artists.',
    shortDescription: 'Music festival',
    category: 'festival',
    startDate: new Date(Date.now() + 35 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 37 * 86400000).toISOString(),
    venue: 'BICC Grounds',
    city: 'Lilongwe',
    imageUrl: 'https://picsum.photos/seed/music1/400/200',
    status: 'published',
    ticketTiers: [
      { id: 't1', name: 'VIP', price: 120000, sold: 120, quantity: 200 },
      { id: 't2', name: 'General', price: 35000, sold: 450, quantity: 1000 },
    ],
    visibilityMetrics: { total: 5600 },
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
];

const STATUS_CONFIG = {
  published: { label: 'Published', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle },
  draft: { label: 'Draft', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: Clock },
  cancelled: { label: 'Cancelled', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
  completed: { label: 'Completed', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: CheckCircle },
};

// Event Management Modules
const EVENT_MODULES = [
  { name: 'Event Details', href: (id: string) => `/organizer/event-management/events/${id}`, icon: LayoutDashboard, description: 'Edit event information' },
  { name: 'Ticket Tiers', href: (id: string) => `/organizer/event-management/events/${id}/tiers`, icon: Ticket, description: 'Manage ticket types and pricing' },
  { name: 'Attendees', href: (id: string) => `/organizer/event-management/events/${id}/attendees`, icon: Users, description: 'View and manage attendees' },
  { name: 'Check-in', href: (id: string) => `/organizer/event-management/events/${id}/checkin`, icon: CheckCircle, description: 'Scan tickets and check-in attendees' },
  { name: 'Sales', href: (id: string) => `/organizer/event-management/events/${id}/sales`, icon: BarChart3, description: 'View sales analytics' },
  { name: 'Messaging', href: (id: string) => `/organizer/event-management/events/${id}/communications`, icon: MessageSquare, description: 'Send bulk messages' },
  { name: 'QR Codes', href: (id: string) => `/organizer/event-management/events/${id}/qrcodes`, icon: QrCode, description: 'Manage QR codes' },
];

export default function EventManagementPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [filteredEvents, setFilteredEvents] = useState(MOCK_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  useEffect(() => {
    filterEvents();
  }, [searchQuery, statusFilter, categoryFilter]);

  const filterEvents = () => {
    let filtered = [...events];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(query) ||
          event.venue.toLowerCase().includes(query) ||
          event.city.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((event) => event.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((event) => event.category === categoryFilter);
    }

    setFilteredEvents(filtered);
  };

  const handleDuplicate = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      const newEvent = {
        ...event,
        id: Date.now().toString(),
        name: `${event.name} (Copy)`,
        status: 'draft',
        createdAt: new Date().toISOString(),
      };
      setEvents([newEvent, ...events]);
      setMenuOpen(null);
      toast.success('Event duplicated');
    }
  };

  const handleDelete = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      setEvents(events.filter((e) => e.id !== eventId));
      setMenuOpen(null);
      toast.success('Event deleted');
    }
  };

  const getTotalTickets = (event: (typeof MOCK_EVENTS)[0]) => {
    return event.ticketTiers.reduce((sum, t) => sum + t.quantity, 0);
  };

  const getSoldTickets = (event: (typeof MOCK_EVENTS)[0]) => {
    return event.ticketTiers.reduce((sum, t) => sum + t.sold, 0);
  };

  const getTotalRevenue = (event: (typeof MOCK_EVENTS)[0]) => {
    return event.ticketTiers.reduce((sum, t) => sum + t.price * t.sold, 0);
  };

  const getSalesPercentage = (event: (typeof MOCK_EVENTS)[0]) => {
    const total = getTotalTickets(event);
    const sold = getSoldTickets(event);
    return total > 0 ? Math.round((sold / total) * 100) : 0;
  };

  const categories = [...new Set(events.map((e) => e.category))];

  // Calculate summary stats
  const totalEvents = filteredEvents.length;
  const totalRevenue = filteredEvents.reduce((sum, e) => sum + getTotalRevenue(e), 0);
  const totalTicketsSold = filteredEvents.reduce((sum, e) => sum + getSoldTickets(e), 0);
  const totalCapacity = filteredEvents.reduce((sum, e) => sum + getTotalTickets(e), 0);

  const toggleExpand = (eventId: string) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Event Management</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage all your events, track performance, and grow your audience
          </p>
        </div>
        <Link
          href="/organizer/events/create"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-all"
        >
          <Plus size={18} />
          Create New Event
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={18} className="text-[#84cc16]" />
            <span className="text-sm text-[var(--text-secondary)]">Total Events</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{totalEvents}</p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Ticket size={18} className="text-[#84cc16]" />
            <span className="text-sm text-[var(--text-secondary)]">Tickets Sold</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{totalTicketsSold.toLocaleString()} / {totalCapacity.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} className="text-[#84cc16]" />
            <span className="text-sm text-[var(--text-secondary)]">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-[#84cc16]">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-[#84cc16]" />
            <span className="text-sm text-[var(--text-secondary)]">Avg. Fill Rate</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {totalCapacity > 0 ? Math.round((totalTicketsSold / totalCapacity) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
          />
          <input
            type="text"
            placeholder="Search events by name, venue, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          />
        </div>

        <div className="relative">
          <Filter
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2 rounded-lg border bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16] appearance-none"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="relative">
          <Filter
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-9 pr-8 py-2 rounded-lg border bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16] appearance-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            No events found
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first event to get started'}
          </p>
          {!searchQuery && statusFilter === 'all' && categoryFilter === 'all' && (
            <Link
              href="/organizer/events/create"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-[#84cc16] text-white hover:brightness-110 transition-all"
            >
              <Plus size={16} />
              Create Event
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredEvents.map((event) => {
            const status = STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG];
            const StatusIcon = status?.icon || Clock;
            const totalTickets = getTotalTickets(event);
            const soldTickets = getSoldTickets(event);
            const salesPercentage = getSalesPercentage(event);
            const totalRevenue = getTotalRevenue(event);
            const isExpanded = expandedEventId === event.id;

            return (
              <div
                key={event.id}
                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Event Card Header (always visible) */}
                <div className="p-5 cursor-pointer" onClick={() => toggleExpand(event.id)}>
                  <div className="flex gap-5">
                    {/* Image */}
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={event.imageUrl}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)] hover:text-[#84cc16] transition-colors">
                              {event.name}
                            </h2>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${status?.bg} ${status?.color}`}
                            >
                              <StatusIcon size={12} />
                              {status?.label}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                            {event.description}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{formatDate(event.startDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              <span>{event.venue}, {event.city}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpen(menuOpen === event.id ? null : event.id);
                            }}
                            className="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
                          >
                            <MoreVertical size={16} className="text-[var(--text-secondary)]" />
                          </button>
                          {menuOpen === event.id && (
                            <div className="absolute right-4 mt-1 w-44 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-lg z-10 overflow-hidden">
                              <button
                                onClick={() => router.push(`/organizer/events/${event.id}`)}
                                className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-[var(--hover-bg)] text-[var(--text-primary)]"
                              >
                                <Edit size={14} />
                                Edit Event
                              </button>
                              <button
                                onClick={() => handleDuplicate(event.id)}
                                className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-[var(--hover-bg)] text-[var(--text-primary)]"
                              >
                                <Copy size={14} />
                                Duplicate
                              </button>
                              <button
                                onClick={() => router.push(`/events/${event.id}`)}
                                className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-[var(--hover-bg)] text-[var(--text-primary)]"
                              >
                                <Eye size={14} />
                                Preview Event
                              </button>
                              <button
                                onClick={() => handleDelete(event.id)}
                                className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-red-500/10 text-red-500"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-[var(--text-secondary)]">Tickets Sold</p>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            {soldTickets.toLocaleString()} / {totalTickets.toLocaleString()}
                          </p>
                          <div className="mt-1 h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#84cc16] rounded-full transition-all"
                              style={{ width: `${salesPercentage}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-[var(--text-secondary)]">Total Views</p>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            {event.visibilityMetrics.total.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[var(--text-secondary)]">Revenue</p>
                          <p className="text-sm font-semibold text-[#84cc16]">
                            {formatCurrency(totalRevenue)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Expand/Collapse Icon */}
                    <div className="flex items-center">
                      {isExpanded ? (
                        <ChevronDown size={20} className="text-[var(--text-secondary)]" />
                      ) : (
                        <ChevronRight size={20} className="text-[var(--text-secondary)]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Modules Panel */}
                {isExpanded && (
                  <div className="border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
                    <div className="p-5">
                      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                        Event Management Modules
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {EVENT_MODULES.map((module) => {
                          const Icon = module.icon;
                          return (
                            <Link
                              key={module.name}
                              href={module.href(event.id)}
                              className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border-color)] hover:border-[#84cc16] hover:bg-[#84cc16]/5 transition-all group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#84cc16]/10 flex items-center justify-center group-hover:bg-[#84cc16] transition-colors">
                                <Icon size={16} className="text-[#84cc16] group-hover:text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[#84cc16]">
                                  {module.name}
                                </p>
                                <p className="text-[10px] text-[var(--text-secondary)]">
                                  {module.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}