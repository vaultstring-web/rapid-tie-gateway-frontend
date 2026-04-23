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
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

// Mock data for development
const MOCK_EVENTS = [
  {
    id: '1',
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
      { id: 't3', name: 'Student', price: 25000, sold: 120, quantity: 200 },
    ],
    visibilityMetrics: {
      total: 2450,
      MERCHANT: 850,
      ORGANIZER: 120,
      EMPLOYEE: 450,
      PUBLIC: 1030,
    },
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: '2',
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
    visibilityMetrics: {
      total: 1820,
      MERCHANT: 620,
      ORGANIZER: 95,
      EMPLOYEE: 380,
      PUBLIC: 725,
    },
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    id: '3',
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
    visibilityMetrics: {
      total: 340,
      MERCHANT: 120,
      ORGANIZER: 45,
      EMPLOYEE: 95,
      PUBLIC: 80,
    },
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: '4',
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
    visibilityMetrics: {
      total: 5600,
      MERCHANT: 2100,
      ORGANIZER: 280,
      EMPLOYEE: 980,
      PUBLIC: 2240,
    },
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
];

const STATUS_CONFIG = {
  published: { label: 'Published', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle },
  draft: { label: 'Draft', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: Clock },
  cancelled: { label: 'Cancelled', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
  completed: { label: 'Completed', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: CheckCircle },
};

export default function MyEventsPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [filteredEvents, setFilteredEvents] = useState(MOCK_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

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
    }
  };

  const handleDelete = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      setEvents(events.filter((e) => e.id !== eventId));
      setMenuOpen(null);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Events</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage all your events in one place
          </p>
        </div>
        <Link
          href="/organizer/events/create"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-all"
        >
          <Plus size={18} />
          Create Event
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
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

        {/* Status Filter */}
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

        {/* Category Filter */}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => {
            const status = STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG];
            const StatusIcon = status?.icon || Clock;
            const totalTickets = getTotalTickets(event);
            const soldTickets = getSoldTickets(event);
            const salesPercentage = getSalesPercentage(event);
            const totalRevenue = getTotalRevenue(event);

            return (
              <div
                key={event.id}
                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Image */}
                <div className="relative h-48">
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${status?.bg} ${status?.color}`}
                    >
                      <StatusIcon size={12} />
                      {status?.label}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === event.id ? null : event.id)}
                        className="p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {menuOpen === event.id && (
                        <div className="absolute right-0 top-8 w-36 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-lg z-10 overflow-hidden">
                          <button
                            onClick={() => router.push(`/organizer/events/${event.id}`)}
                            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-[var(--hover-bg)] text-[var(--text-primary)]"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDuplicate(event.id)}
                            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-[var(--hover-bg)] text-[var(--text-primary)]"
                          >
                            <Copy size={14} />
                            Duplicate
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
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  {/* Title - Navigates to Event Management Panel */}
                  <Link href={`/organizer/events/${event.id}`}>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] hover:text-[#84cc16] transition-colors line-clamp-1 cursor-pointer">
                      {event.name}
                    </h2>
                  </Link>

                  {/* Date & Location */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <Calendar size={14} />
                      <span>{formatDate(event.startDate)}</span>
                      {event.endDate && (
                        <>
                          <span>-</span>
                          <span>{formatDate(event.endDate)}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <MapPin size={14} />
                      <span>
                        {event.venue}, {event.city}
                      </span>
                    </div>
                  </div>

                  {/* Ticket Stats */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                        <Ticket size={14} />
                        Tickets Sold
                      </span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {soldTickets.toLocaleString()} / {totalTickets.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#84cc16] rounded-full transition-all"
                        style={{ width: `${salesPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                        <Eye size={14} />
                        Total Views
                      </span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {event.visibilityMetrics.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Revenue */}
                  <div className="flex justify-between items-center pt-2 border-t border-[var(--border-color)]">
                    <span className="text-sm text-[var(--text-secondary)]">Total Revenue</span>
                    <span className="text-xl font-bold text-[#84cc16]">
                      {formatCurrency(totalRevenue)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    {/* Manage Event Button - Navigates to Event Management Panel */}
                    <Link
                      href={`/organizer/events/${event.id}`}
                      className="flex-1 text-center px-4 py-2 rounded-lg bg-[#84cc16]/10 text-[#84cc16] font-medium hover:bg-[#84cc16] hover:text-white transition-all"
                    >
                      Manage Event
                    </Link>
                    
                    {/* View Button - Opens public event page in new tab */}
                    <Link
                      href={`/events/${event.id}`}
                      target="_blank"
                      className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[#84cc16] hover:text-[#84cc16] transition-all"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}