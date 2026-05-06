'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Ticket,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  MessageSquare,
  QrCode,
  UserCheck,
  BarChart3,
  Save,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock event data
const getMockEvent = (id: string) => ({
  id,
  name: 'Malawi Fintech Expo 2026',
  description: 'The largest fintech conference in Malawi featuring industry leaders and innovators. Join us for two days of networking, learning, and innovation. This event brings together fintech experts, entrepreneurs, investors, and policymakers to discuss the future of financial technology in Africa.',
  shortDescription: 'Annual fintech conference',
  category: 'conference',
  type: 'public',
  startDate: new Date(Date.now() + 7 * 86400000).toISOString(),
  endDate: new Date(Date.now() + 8 * 86400000).toISOString(),
  venue: 'Bingu International Convention Centre',
  city: 'Lilongwe',
  address: 'Convention Drive, Lilongwe',
  capacity: 1000,
  status: 'published',
  ticketTiers: [
    { id: 't1', name: 'VIP', price: 150000, sold: 45, quantity: 100, description: 'Full access including backstage passes' },
    { id: 't2', name: 'Standard', price: 45000, sold: 320, quantity: 500, description: 'Standard access to all sessions' },
    { id: 't3', name: 'Student', price: 25000, sold: 120, quantity: 200, description: 'Student discount with valid ID' },
  ],
  stats: {
    totalViews: 2450,
    totalAttendees: 485,
    checkIns: 320,
    conversionRate: 24.8,
  },
  organizer: {
    name: 'VaultString Events',
    email: 'events@vaultstring.com',
    phone: '+265 999 123 456',
  },
  tags: ['fintech', 'conference', 'networking', 'technology'],
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
});

const STATUS_CONFIG = {
  published: { label: 'Published', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle },
  draft: { label: 'Draft', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: Clock },
  cancelled: { label: 'Cancelled', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
  completed: { label: 'Completed', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: CheckCircle },
};

// Event Management Modules Navigation
const EVENT_MODULES = [
  { name: 'Event Details', href: (id: string) => `/organizer/event-management/events/${id}`, icon: Calendar, description: 'Edit event information' },
  { name: 'Ticket Tiers', href: (id: string) => `/organizer/events/${id}/tiers`, icon: Ticket, description: 'Manage ticket types and pricing' },
  { name: 'Attendees', href: (id: string) => `/organizer/events/${id}/attendees`, icon: Users, description: 'View and manage attendees' },
  { name: 'Check-in', href: (id: string) => `/organizer/events/${id}/checkin`, icon: UserCheck, description: 'Scan tickets and check-in attendees' },
  { name: 'Sales', href: (id: string) => `/organizer/events/${id}/sales`, icon: BarChart3, description: 'View sales analytics' },
  { name: 'Messaging', href: (id: string) => `/organizer/events/${id}/communications`, icon: MessageSquare, description: 'Send bulk messages' },
  { name: 'QR Codes', href: (id: string) => `/organizer/events/${id}/qrcodes`, icon: QrCode, description: 'Manage QR codes' },
];

export default function EventDetailsPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockEvent = getMockEvent(eventId);
      setEvent(mockEvent);
      setFormData(mockEvent);
    } catch (error) {
      toast.error('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setEvent(formData);
      setEditing(false);
      toast.success('Event updated successfully');
    } catch (error) {
      toast.error('Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const status = event ? STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG] : null;
  const StatusIcon = status?.icon || Clock;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#84cc16] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Event not found</h2>
        <Link href="/organizer/event-management" className="text-[#84cc16] hover:underline mt-2 inline-block">
          ← Back to Event Management
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/organizer/event-management"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Event Details</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              View and manage your event information
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {!editing ? (
            <>
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Edit size={16} />
                Edit Event
              </button>
              <button
                onClick={() => router.push(`/organizer/events/${eventId}/tiers`)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white hover:brightness-110 transition-colors"
              >
                <Ticket size={16} />
                Manage Tickets
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white hover:brightness-110 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* Event Management Modules Navigation */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Event Management</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
          {EVENT_MODULES.map((module) => {
            const Icon = module.icon;
            const isActive = module.name === 'Event Details';
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
                <Icon size={16} />
                <span className="text-sm font-medium">{module.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Event Content */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
        {/* Status Banner */}
        <div className={`px-6 py-3 border-b border-[var(--border-color)] flex items-center justify-between ${status?.bg}`}>
          <div className="flex items-center gap-2">
            <StatusIcon size={16} className={status?.color} />
            <span className={`text-sm font-medium ${status?.color}`}>
              Status: {status?.label}
            </span>
          </div>
          <span className="text-xs text-[var(--text-secondary)]">
            Created: {formatDate(event.createdAt)}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!editing ? (
            // View Mode
            <>
              {/* Basic Info */}
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">{event.name}</h2>
                <p className="text-sm text-[var(--text-secondary)]">{event.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-[#84cc16]" />
                    <span className="text-[var(--text-primary)]">Start Date:</span>
                    <span className="text-[var(--text-secondary)]">{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-[#84cc16]" />
                    <span className="text-[var(--text-primary)]">End Date:</span>
                    <span className="text-[var(--text-secondary)]">{formatDate(event.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-[#84cc16]" />
                    <span className="text-[var(--text-primary)]">Venue:</span>
                    <span className="text-[var(--text-secondary)]">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-[#84cc16]" />
                    <span className="text-[var(--text-primary)]">Location:</span>
                    <span className="text-[var(--text-secondary)]">{event.city}, {event.address}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Ticket size={16} className="text-[#84cc16]" />
                    <span className="text-[var(--text-primary)]">Category:</span>
                    <span className="text-[var(--text-secondary)] capitalize">{event.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={16} className="text-[#84cc16]" />
                    <span className="text-[var(--text-primary)]">Capacity:</span>
                    <span className="text-[var(--text-secondary)]">{event.capacity.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Tag size={16} className="text-[#84cc16]" />
                    <span className="text-[var(--text-primary)]">Tags:</span>
                    <span className="text-[var(--text-secondary)]">{event.tags.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Ticket Tiers Summary */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Ticket Tiers</h3>
                <div className="space-y-2">
                  {event.ticketTiers.map((tier: any) => (
                    <div key={tier.id} className="flex justify-between items-center p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]">
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{tier.name}</p>
                        <p className="text-sm text-[var(--text-secondary)]">{tier.description}</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">{tier.sold} / {tier.quantity} sold</p>
                      </div>
                      <p className="text-lg font-bold text-[#84cc16]">{formatCurrency(tier.price)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Event Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-center">
                    <Eye size={18} className="mx-auto mb-1 text-[#84cc16]" />
                    <p className="text-2xl font-bold text-[var(--text-primary)]">{event.stats.totalViews.toLocaleString()}</p>
                    <p className="text-xs text-[var(--text-secondary)]">Total Views</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-center">
                    <Users size={18} className="mx-auto mb-1 text-[#84cc16]" />
                    <p className="text-2xl font-bold text-[var(--text-primary)]">{event.stats.totalAttendees.toLocaleString()}</p>
                    <p className="text-xs text-[var(--text-secondary)]">Attendees</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-center">
                    <UserCheck size={18} className="mx-auto mb-1 text-[#84cc16]" />
                    <p className="text-2xl font-bold text-[var(--text-primary)]">{event.stats.checkIns.toLocaleString()}</p>
                    <p className="text-xs text-[var(--text-secondary)]">Checked In</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-center">
                    <TrendingUp size={18} className="mx-auto mb-1 text-[#84cc16]" />
                    <p className="text-2xl font-bold text-[var(--text-primary)]">{event.stats.conversionRate}%</p>
                    <p className="text-xs text-[var(--text-secondary)]">Conversion Rate</p>
                  </div>
                </div>
              </div>

              {/* Organizer Info */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Organizer</h3>
                <div className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]">
                  <p className="font-medium text-[var(--text-primary)]">{event.organizer.name}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{event.organizer.email}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{event.organizer.phone}</p>
                </div>
              </div>
            </>
          ) : (
            // Edit Mode
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Event Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Full Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16] resize-y"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Start Date</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate.slice(0, 16)}
                    onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value).toISOString() })}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">End Date</label>
                  <input
                    type="datetime-local"
                    value={formData.endDate.slice(0, 16)}
                    onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value).toISOString() })}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Venue</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                >
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="concert">Concert</option>
                  <option value="festival">Festival</option>
                  <option value="sports">Sports</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component for Tag icon
const Tag = ({ size, className }: { size: number; className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2H2v10l9.17 9.17a2 2 0 0 0 2.83 0l7-7a2 2 0 0 0 0-2.83L12 2z" />
    <circle cx="7" cy="7" r="2" />
  </svg>
);