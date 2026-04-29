'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Eye,
  Ticket,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for ticket tiers across events
const MOCK_TICKET_TIERS = [
  {
    id: 'tier-1',
    name: 'VIP Pass',
    description: 'Full access including backstage passes, VIP lounge, and premium seating',
    eventId: 'event-1',
    eventName: 'Malawi Fintech Expo 2026',
    eventDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    eventVenue: 'Bingu International Convention Centre',
    eventCity: 'Lilongwe',
    price: 150000,
    sold: 45,
    quantity: 100,
    maxPerPerson: 4,
    status: 'active',
    benefits: ['Backstage Access', 'VIP Lounge', 'Premium Seating', 'Free Drinks', 'Meet & Greet'],
    roleBasedPrices: [
      { role: 'MERCHANT', price: 135000 },
      { role: 'ORGANIZER', price: 120000 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tier-2',
    name: 'General Admission',
    description: 'Standard entry to the event',
    eventId: 'event-1',
    eventName: 'Malawi Fintech Expo 2026',
    eventDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    eventVenue: 'Bingu International Convention Centre',
    eventCity: 'Lilongwe',
    price: 45000,
    sold: 320,
    quantity: 500,
    maxPerPerson: 10,
    status: 'active',
    benefits: ['Standard Entry', 'Access to All Stages'],
    roleBasedPrices: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tier-3',
    name: 'VIP Experience',
    description: 'Ultimate festival experience with premium amenities',
    eventId: 'event-4',
    eventName: 'Music Festival Malawi',
    eventDate: new Date(Date.now() + 35 * 86400000).toISOString(),
    eventVenue: 'BICC Grounds',
    eventCity: 'Lilongwe',
    price: 120000,
    sold: 120,
    quantity: 200,
    maxPerPerson: 6,
    status: 'active',
    benefits: ['Front Row Viewing', 'Artist Meet & Greet', 'Free Merchandise', 'VIP Parking'],
    roleBasedPrices: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tier-4',
    name: 'Early Bird Special',
    description: 'Limited time offer for early registrants',
    eventId: 'event-2',
    eventName: 'Tech Innovation Summit',
    eventDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    eventVenue: 'Sunbird Mount Soche',
    eventCity: 'Blantyre',
    price: 25000,
    sold: 187,
    quantity: 200,
    maxPerPerson: 4,
    status: 'sold_out',
    benefits: ['Early Entry', 'Exclusive Badge', 'Priority Seating'],
    roleBasedPrices: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tier-5',
    name: 'Standard Pass',
    description: 'Regular conference access',
    eventId: 'event-2',
    eventName: 'Tech Innovation Summit',
    eventDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    eventVenue: 'Sunbird Mount Soche',
    eventCity: 'Blantyre',
    price: 35000,
    sold: 210,
    quantity: 400,
    maxPerPerson: 10,
    status: 'active',
    benefits: ['Conference Access', 'Networking Lunch'],
    roleBasedPrices: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tier-6',
    name: 'Workshop Pass',
    description: 'Hands-on workshop participation',
    eventId: 'event-3',
    eventName: 'Developer Workshop Series',
    eventDate: new Date(Date.now() + 21 * 86400000).toISOString(),
    eventVenue: 'Virtual',
    eventCity: 'Online',
    price: 15000,
    sold: 45,
    quantity: 100,
    maxPerPerson: 3,
    status: 'draft',
    benefits: ['Live Coding Sessions', 'Certificate of Completion', 'Resource Materials'],
    roleBasedPrices: [],
    createdAt: new Date().toISOString(),
  },
];

const STATUS_CONFIG = {
  active: { label: 'Active', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
  sold_out: { label: 'Sold Out', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
  draft: { label: 'Draft', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  inactive: { label: 'Inactive', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800' },
};

export default function TicketTiersPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [tiers, setTiers] = useState(MOCK_TICKET_TIERS);
  const [filteredTiers, setFilteredTiers] = useState(MOCK_TICKET_TIERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Get unique events for filter
  const events = [...new Map(tiers.map(tier => [tier.eventId, { id: tier.eventId, name: tier.eventName }])).values()];

  useEffect(() => {
    filterTiers();
  }, [searchQuery, statusFilter, eventFilter]);

  const filterTiers = () => {
    let filtered = [...tiers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tier) =>
          tier.name.toLowerCase().includes(query) ||
          tier.eventName.toLowerCase().includes(query) ||
          tier.description.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((tier) => tier.status === statusFilter);
    }

    if (eventFilter !== 'all') {
      filtered = filtered.filter((tier) => tier.eventId === eventFilter);
    }

    setFilteredTiers(filtered);
  };

  const handleDuplicate = (tierId: string) => {
    const tier = tiers.find((t) => t.id === tierId);
    if (tier) {
      const newTier = {
        ...tier,
        id: Date.now().toString(),
        name: `${tier.name} (Copy)`,
        status: 'draft',
        sold: 0,
        createdAt: new Date().toISOString(),
      };
      setTiers([newTier, ...tiers]);
      setMenuOpen(null);
      toast.success('Ticket tier duplicated');
    }
  };

  const handleDelete = (tierId: string) => {
    if (confirm('Are you sure you want to delete this ticket tier? This action cannot be undone.')) {
      setTiers(tiers.filter((t) => t.id !== tierId));
      setMenuOpen(null);
      toast.success('Ticket tier deleted');
    }
  };

  const getSalesPercentage = (tier: (typeof MOCK_TICKET_TIERS)[0]) => {
    return (tier.sold / tier.quantity) * 100;
  };

  const totalTiers = filteredTiers.length;
  const totalCapacity = filteredTiers.reduce((sum, t) => sum + t.quantity, 0);
  const totalSold = filteredTiers.reduce((sum, t) => sum + t.sold, 0);
  const totalRevenue = filteredTiers.reduce((sum, t) => sum + t.price * t.sold, 0);
  const averagePrice = totalTiers > 0 ? totalRevenue / totalSold : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Ticket Tiers</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage all ticket types across your events
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
            <Ticket size={18} className="text-[#84cc16]" />
            <span className="text-sm text-[var(--text-secondary)]">Total Tiers</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{totalTiers}</p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-[#84cc16]" />
            <span className="text-sm text-[var(--text-secondary)]">Tickets Sold</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{totalSold.toLocaleString()} / {totalCapacity.toLocaleString()}</p>
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
            <span className="text-sm text-[var(--text-secondary)]">Avg. Ticket Price</span>
          </div>
          <p className="text-2xl font-bold text-[#84cc16]">{formatCurrency(averagePrice)}</p>
        </div>
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
            placeholder="Search by tier name, event name, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          />
        </div>

        {/* Event Filter */}
        <div className="relative min-w-[180px]">
          <Filter
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
          />
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="pl-9 pr-8 py-2 rounded-lg border bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16] appearance-none"
          >
            <option value="all">All Events</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>{event.name}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative min-w-[140px]">
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
            <option value="active">Active</option>
            <option value="sold_out">Sold Out</option>
            <option value="draft">Draft</option>
            <option value="inactive">Inactive</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
        </div>
      </div>

      {/* Ticket Tiers Grid */}
      {filteredTiers.length === 0 ? (
        <div className="text-center py-12">
          <Ticket size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            No ticket tiers found
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {searchQuery || statusFilter !== 'all' || eventFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create an event to start selling tickets'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTiers.map((tier) => {
            const status = STATUS_CONFIG[tier.status as keyof typeof STATUS_CONFIG];
            const salesPercentage = getSalesPercentage(tier);
            const isSoldOut = tier.status === 'sold_out' || tier.sold >= tier.quantity;
            
            return (
              <div
                key={tier.id}
                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="p-5">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    {/* Left side - Tier Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                          {tier.name}
                        </h2>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status?.bg} ${status?.color}`}>
                          {status?.label}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mb-3">
                        {tier.description}
                      </p>
                      
                      {/* Event Info */}
                      <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)] mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{formatDate(tier.eventDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{tier.eventVenue}, {tier.eventCity}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-3">
                        <span className="text-2xl font-bold text-[#84cc16]">
                          {formatCurrency(tier.price)}
                        </span>
                      </div>

                      {/* Benefits */}
                      {tier.benefits.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {tier.benefits.slice(0, 3).map((benefit, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-full text-xs bg-[var(--hover-bg)] text-[var(--text-secondary)]"
                            >
                              ✓ {benefit}
                            </span>
                          ))}
                          {tier.benefits.length > 3 && (
                            <span className="px-2 py-0.5 rounded-full text-xs text-[#84cc16]">
                              +{tier.benefits.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Role-based pricing preview */}
                      {tier.roleBasedPrices.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {tier.roleBasedPrices.map((rp) => (
                            <span
                              key={rp.role}
                              className="px-2 py-0.5 rounded-full text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                            >
                              {rp.role}: {formatCurrency(rp.price)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right side - Stats and Actions */}
                    <div className="min-w-[200px]">
                      {/* Sales Progress */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--text-secondary)]">Sold</span>
                          <span className="text-[var(--text-primary)] font-medium">
                            {tier.sold.toLocaleString()} / {tier.quantity.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isSoldOut ? 'bg-red-500' : 'bg-[#84cc16]'}`}
                            style={{ width: `${salesPercentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-[var(--text-secondary)]">Revenue</span>
                          <span className="text-[#84cc16] font-medium">
                            {formatCurrency(tier.price * tier.sold)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link
                          href={`/organizer/events/${tier.eventId}`}
                          className="flex-1 text-center px-3 py-2 rounded-lg bg-[#84cc16]/10 text-[#84cc16] text-sm font-medium hover:bg-[#84cc16] hover:text-white transition-all"
                        >
                          View Event
                        </Link>
                        <div className="relative">
                          <button
                            onClick={() => setMenuOpen(menuOpen === tier.id ? null : tier.id)}
                            className="p-2 rounded-lg border border-[var(--border-color)] hover:bg-[var(--hover-bg)] transition-colors"
                          >
                            <MoreVertical size={16} className="text-[var(--text-secondary)]" />
                          </button>
                          {menuOpen === tier.id && (
                            <div className="absolute right-0 top-full mt-1 w-36 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-lg z-10 overflow-hidden">
                              <button
                                onClick={() => router.push(`/organizer/events/${tier.eventId}/tiers`)}
                                className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-[var(--hover-bg)] text-[var(--text-primary)]"
                              >
                                <Edit size={14} />
                                Edit Tier
                              </button>
                              <button
                                onClick={() => handleDuplicate(tier.id)}
                                className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-[var(--hover-bg)] text-[var(--text-primary)]"
                              >
                                <Copy size={14} />
                                Duplicate
                              </button>
                              <button
                                onClick={() => handleDelete(tier.id)}
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