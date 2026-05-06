'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  Mail,
  CheckCircle,
  XCircle,
  UserCheck,
  Phone,
  Calendar as CalendarIcon,
  MoreVertical,
  Eye,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Types
interface Attendee {
  id: string;
  ticketNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'MERCHANT' | 'ORGANIZER' | 'EMPLOYEE' | 'APPROVER' | 'FINANCE_OFFICER' | 'ADMIN' | 'PUBLIC';
  tierName: string;
  ticketPrice: number;
  status: 'checked_in' | 'not_checked_in' | 'refunded' | 'cancelled';
  checkedInAt?: string;
  checkedInBy?: string;
  purchaseDate: string;
  specialRequests?: string;
}

// Mock data
const getMockAttendees = (): Attendee[] => {
  const roles = ['MERCHANT', 'ORGANIZER', 'EMPLOYEE', 'APPROVER', 'FINANCE_OFFICER', 'ADMIN', 'PUBLIC'];
  const tiers = ['VIP', 'General Admission', 'Early Bird', 'Group Ticket'];
  const statuses = ['checked_in', 'not_checked_in', 'refunded', 'cancelled'];
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'James', 'Mary', 'Robert', 'Patricia'];
  const lastNames = ['Smith', 'Doe', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez'];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: `attendee-${i + 1}`,
    ticketNumber: `TKT-${String(i + 1).padStart(4, '0')}`,
    firstName: firstNames[i % firstNames.length],
    lastName: lastNames[i % lastNames.length],
    email: `attendee${i + 1}@example.com`,
    phone: `+265 999 ${String(i + 100).padStart(3, '0')}`,
    role: roles[i % roles.length] as any,
    tierName: tiers[i % tiers.length],
    ticketPrice: [150000, 45000, 25000, 35000][i % 4],
    status: statuses[i % statuses.length] as any,
    checkedInAt: i % 4 === 0 ? new Date().toISOString() : undefined,
    checkedInBy: i % 4 === 0 ? 'Staff Member' : undefined,
    purchaseDate: new Date(Date.now() - i * 86400000).toISOString(),
    specialRequests: i % 5 === 0 ? 'Vegetarian meal requested' : undefined,
  }));
};

const ROLE_BADGE_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  MERCHANT: { label: 'Merchant', color: 'text-emerald-700 dark:text-emerald-300', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  ORGANIZER: { label: 'Organizer', color: 'text-blue-700 dark:text-blue-300', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  EMPLOYEE: { label: 'Employee', color: 'text-purple-700 dark:text-purple-300', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  APPROVER: { label: 'Approver', color: 'text-amber-700 dark:text-amber-300', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  FINANCE_OFFICER: { label: 'Finance', color: 'text-cyan-700 dark:text-cyan-300', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30' },
  ADMIN: { label: 'Admin', color: 'text-rose-700 dark:text-rose-300', bgColor: 'bg-rose-100 dark:bg-rose-900/30' },
  PUBLIC: { label: 'Public', color: 'text-gray-700 dark:text-gray-300', bgColor: 'bg-gray-100 dark:bg-gray-800' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  checked_in: { label: 'Checked In', color: 'text-green-600 dark:text-green-400', icon: '✅' },
  not_checked_in: { label: 'Not Checked In', color: 'text-yellow-600 dark:text-yellow-400', icon: '⏳' },
  refunded: { label: 'Refunded', color: 'text-red-600 dark:text-red-400', icon: '💰' },
  cancelled: { label: 'Cancelled', color: 'text-gray-500 dark:text-gray-400', icon: '❌' },
};

// Helper Icons
const TicketIcon = ({ size, className }: { size: number; className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
  </svg>
);

const UsersIcon = ({ size, className }: { size: number; className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeJoin="round" className={className}>
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
  { name: 'Check-in', href: (id: string) => `/organizer/events/${id}/checkin`, icon: 'CheckCircle' },
  { name: 'Sales', href: (id: string) => `/organizer/events/${id}/sales`, icon: 'BarChart3' },
  { name: 'Messaging', href: (id: string) => `/organizer/events/${id}/communications`, icon: 'MessageSquare' },
  { name: 'QR Codes', href: (id: string) => `/organizer/events/${id}/qrcodes`, icon: 'QrCode' },
];

export default function AttendeesPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);

  useEffect(() => {
    loadAttendees();
  }, []);

  useEffect(() => {
    filterAttendees();
  }, [searchQuery, roleFilter, statusFilter, attendees]);

  const loadAttendees = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockData = getMockAttendees();
      setAttendees(mockData);
      setFilteredAttendees(mockData);
    } catch (error) {
      toast.error('Failed to load attendees');
    } finally {
      setLoading(false);
    }
  };

  const filterAttendees = () => {
    let filtered = [...attendees];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.firstName.toLowerCase().includes(query) ||
          a.lastName.toLowerCase().includes(query) ||
          a.email.toLowerCase().includes(query) ||
          a.ticketNumber.toLowerCase().includes(query)
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter((a) => a.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    setFilteredAttendees(filtered);
  };

  const handleCheckIn = (attendeeId: string) => {
    setAttendees(prev =>
      prev.map(a =>
        a.id === attendeeId
          ? { ...a, status: 'checked_in', checkedInAt: new Date().toISOString(), checkedInBy: 'Staff' }
          : a
      )
    );
    toast.success('Attendee checked in');
  };

  const handleBulkCheckIn = () => {
    if (selectedAttendees.length === 0) {
      toast.error('No attendees selected');
      return;
    }
    setAttendees(prev =>
      prev.map(a =>
        selectedAttendees.includes(a.id)
          ? { ...a, status: 'checked_in', checkedInAt: new Date().toISOString(), checkedInBy: 'Staff' }
          : a
      )
    );
    toast.success(`${selectedAttendees.length} attendees checked in`);
    setSelectedAttendees([]);
  };

  const handleSendReminder = (attendeeId: string) => {
    toast.success('Reminder sent');
  };

  const handleExport = () => {
    toast.info('Export feature coming soon');
  };

  const stats = {
    total: attendees.length,
    checkedIn: attendees.filter(a => a.status === 'checked_in').length,
    notCheckedIn: attendees.filter(a => a.status === 'not_checked_in').length,
    refunded: attendees.filter(a => a.status === 'refunded').length,
    cancelled: attendees.filter(a => a.status === 'cancelled').length,
  };

  const roles = [...new Set(attendees.map(a => a.role))];
  const statuses = [...new Set(attendees.map(a => a.status))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#84cc16] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Attendees</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Manage event attendees and check-ins
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {selectedAttendees.length > 0 && (
            <button
              onClick={handleBulkCheckIn}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              <CheckCircle size={16} />
              Check In ({selectedAttendees.length})
            </button>
          )}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Event Management Modules Navigation */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Event Management</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
          {EVENT_MODULES.map((module) => {
            const isActive = module.name === 'Attendees';
            let IconComponent;
            switch (module.icon) {
              case 'Details': IconComponent = Eye; break;
              case 'Ticket': IconComponent = TicketIcon; break;
              case 'Users': IconComponent = UsersIcon; break;
              case 'CheckCircle': IconComponent = CheckCircle; break;
              case 'BarChart3': IconComponent = DollarSignIcon; break;
              case 'MessageSquare': IconComponent = MessageSquareIcon; break;
              case 'QrCode': IconComponent = QrCodeIcon; break;
              default: IconComponent = Eye;
            }
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

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</p>
          <p className="text-xs text-[var(--text-secondary)]">Total</p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-500">{stats.checkedIn}</p>
          <p className="text-xs text-[var(--text-secondary)]">Checked In</p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-yellow-500">{stats.notCheckedIn}</p>
          <p className="text-xs text-[var(--text-secondary)]">Not Checked In</p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-500">{stats.refunded}</p>
          <p className="text-xs text-[var(--text-secondary)]">Refunded</p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-500">{stats.cancelled}</p>
          <p className="text-xs text-[var(--text-secondary)]">Cancelled</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Search by name, email, or ticket number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
        >
          <option value="all">All Roles</option>
          {roles.map(role => (
            <option key={role} value={role}>{ROLE_BADGE_CONFIG[role]?.label || role}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
        >
          <option value="all">All Status</option>
          {statuses.map(status => (
            <option key={status} value={status}>{STATUS_CONFIG[status]?.label || status}</option>
          ))}
        </select>
      </div>

      {/* Attendees Table */}
      {filteredAttendees.length === 0 ? (
        <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
          <UsersIcon size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No attendees found</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'No attendees have registered yet'}
          </p>
        </div>
      ) : (
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-primary)]/50">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedAttendees.length === filteredAttendees.length && filteredAttendees.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAttendees(filteredAttendees.map(a => a.id));
                        } else {
                          setSelectedAttendees([]);
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Ticket #</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Ticket Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Purchase Date</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredAttendees.map((attendee) => {
                  const roleConfig = ROLE_BADGE_CONFIG[attendee.role];
                  const statusConfig = STATUS_CONFIG[attendee.status];
                  const isSelected = selectedAttendees.includes(attendee.id);
                  return (
                    <tr key={attendee.id} className="hover:bg-[var(--hover-bg)] transition-colors group">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAttendees([...selectedAttendees, attendee.id]);
                            } else {
                              setSelectedAttendees(selectedAttendees.filter(id => id !== attendee.id));
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-[var(--text-primary)]">{attendee.ticketNumber}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{attendee.firstName} {attendee.lastName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                            <Mail size={10} />
                            <span className="truncate max-w-[150px]">{attendee.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                            <Phone size={10} />
                            <span>{attendee.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleConfig?.bgColor} ${roleConfig?.color}`}>
                          {roleConfig?.label || attendee.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-[var(--text-primary)]">{attendee.tierName}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{formatCurrency(attendee.ticketPrice)}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-xs ${statusConfig?.color}`}>
                          <span>{statusConfig?.icon}</span>
                          <span>{statusConfig?.label}</span>
                        </span>
                        {attendee.checkedInAt && (
                          <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                            {new Date(attendee.checkedInAt).toLocaleTimeString()}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                        {formatDate(attendee.purchaseDate)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {attendee.status === 'not_checked_in' && (
                            <button
                              onClick={() => handleCheckIn(attendee.id)}
                              className="p-1 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
                              title="Check In"
                            >
                              <UserCheck size={16} className="text-green-500" />
                            </button>
                          )}
                          <button
                            onClick={() => handleSendReminder(attendee.id)}
                            className="p-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                            title="Send Reminder"
                          >
                            <Mail size={16} className="text-blue-500" />
                          </button>
                          {attendee.specialRequests && (
                            <div className="relative group">
                              <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <Eye size={16} className="text-[var(--text-secondary)]" />
                              </button>
                              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-lg z-10">
                                <p className="text-xs text-[var(--text-primary)]">{attendee.specialRequests}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}