'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import {
  ArrowLeft,
  Download,
  Mail,
  Smartphone,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  Ticket,
  Eye,
  QrCode as QrCodeIcon,
  Users,
  DollarSign,
  MessageSquare,
  CheckCircle as CheckCircleIcon,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Types
interface Ticket {
  id: string;
  ticketNumber: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone?: string;
  ticketTier: string;
  price: number;
  status: 'active' | 'used' | 'expired' | 'refunded';
  qrCode: string;
  checkedInAt?: string;
  checkedInBy?: string;
  deliveryStatus: 'pending' | 'sent' | 'failed' | 'delivered';
  deliveryMethod: 'email' | 'sms';
  role?: string;
}

interface EventInfo {
  id: string;
  name: string;
  date: string;
  venue: string;
  city: string;
  totalTickets: number;
  ticketsSold: number;
  ticketsUsed: number;
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

const QrCodeIconHelper = ({ size, className }: { size: number; className: string }) => (
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
  { name: 'QR Codes', href: (id: string) => `/organizer/event-management/events/${id}/qrcodes`, icon: 'QrCode' },
];

// Mock data
const getMockEventInfo = (): EventInfo => ({
  id: '1',
  name: 'Malawi Fintech Expo 2026',
  date: new Date(Date.now() + 7 * 86400000).toISOString(),
  venue: 'Bingu International Convention Centre',
  city: 'Lilongwe',
  totalTickets: 1250,
  ticketsSold: 1180,
  ticketsUsed: 450,
});

const getMockTickets = (): Ticket[] => {
  const roles = ['MERCHANT', 'ORGANIZER', 'EMPLOYEE', 'APPROVER', 'FINANCE_OFFICER', 'ADMIN', 'PUBLIC'];
  const tiers = ['VIP', 'General Admission', 'Early Bird', 'Group Ticket'];
  const statuses = ['active', 'used', 'expired', 'refunded'];
  
  return Array.from({ length: 12 }, (_, i) => ({
    id: `ticket-${i + 1}`,
    ticketNumber: `TKT-${String(i + 1).padStart(4, '0')}`,
    attendeeName: `${['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa'][i % 6]} ${['Smith', 'Doe', 'Johnson', 'Williams'][i % 4]}`,
    attendeeEmail: `attendee${i + 1}@example.com`,
    attendeePhone: `+265 999 ${String(i + 100).padStart(3, '0')}`,
    ticketTier: tiers[i % tiers.length],
    price: [150000, 45000, 25000, 35000][i % 4],
    status: statuses[i % statuses.length] as any,
    qrCode: `https://rapidtie.com/ticket/${Date.now()}-${i}`,
    checkedInAt: i % 4 === 0 ? new Date().toISOString() : undefined,
    checkedInBy: i % 4 === 0 ? 'Scanner' : undefined,
    deliveryStatus: i % 3 === 0 ? 'delivered' : i % 3 === 1 ? 'sent' : 'pending',
    deliveryMethod: i % 2 === 0 ? 'email' : 'sms',
    role: roles[i % roles.length],
  }));
};

// QR Code Grid Component
const QRCodeGrid = ({ tickets, onRegenerate, onResend, loading }: any) => {
  const { theme } = useTheme();
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon size={14} className="text-green-500" />;
      case 'used': return <Clock size={14} className="text-blue-500" />;
      case 'expired': return <Clock size={14} className="text-red-500" />;
      default: return <Clock size={14} className="text-yellow-500" />;
    }
  };

  const getDeliveryIcon = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'sent': return <CheckCircleIcon size={12} className="text-green-500" />;
      case 'failed': return <XCircle size={12} className="text-red-500" />;
      default: return <Clock size={12} className="text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tickets.map((ticket: Ticket) => (
        <div
          key={ticket.id}
          className="rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Ticket Header */}
          <div className="p-3 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">{ticket.ticketNumber}</span>
              <div className="flex items-center gap-1">
                {getStatusIcon(ticket.status)}
                <span className="text-xs capitalize text-[var(--text-secondary)]">{ticket.status}</span>
              </div>
            </div>
            <button
              onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Eye size={14} className="text-[var(--text-secondary)]" />
            </button>
          </div>

          {/* QR Code */}
          <div className="p-4 flex justify-center">
            <div className="relative">
              <div className="p-3 bg-white rounded-lg">
                <QRCode value={ticket.qrCode} size={120} />
              </div>
            </div>
          </div>

          {/* Ticket Info */}
          <div className="px-4 pb-2 space-y-1 text-center">
            <p className="text-sm font-semibold text-[var(--text-primary)]">{ticket.attendeeName}</p>
            <p className="text-xs text-[var(--text-secondary)]">{ticket.attendeeEmail}</p>
            <div className="flex justify-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full text-xs bg-[var(--hover-bg)] text-[var(--text-secondary)]">
                {ticket.ticketTier}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium text-[#84cc16]">
                {formatCurrency(ticket.price)}
              </span>
            </div>
          </div>

          {/* Expanded Details */}
          {expandedTicket === ticket.id && (
            <div className="mt-2 p-4 border-t space-y-3" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-secondary)]">Delivery:</span>
                <div className="flex items-center gap-2">
                  {getDeliveryIcon(ticket.deliveryStatus)}
                  <span className="text-xs capitalize text-[var(--text-secondary)]">{ticket.deliveryStatus}</span>
                </div>
              </div>
              {ticket.checkedInAt && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)]">Checked in:</span>
                  <span className="text-xs text-[var(--text-secondary)]">{new Date(ticket.checkedInAt).toLocaleString()}</span>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => onRegenerate(ticket.id)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <RefreshCw size={12} />
                  Regenerate
                </button>
                <button
                  onClick={() => onResend(ticket.id, 'email')}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <Mail size={12} />
                  Email
                </button>
                <button
                  onClick={() => onResend(ticket.id, 'sms')}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <Smartphone size={12} />
                  SMS
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Role QR Generator Component
const RoleQRGenerator = ({ eventId, eventName, onGenerate }: any) => {
  const { theme } = useTheme();
  const [selectedRole, setSelectedRole] = useState('MERCHANT');
  const [generatedQR, setGeneratedQR] = useState<{ qrCode: string; dataUrl: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: 'MERCHANT', label: 'Merchants', color: '#10b981' },
    { value: 'ORGANIZER', label: 'Organizers', color: '#3b82f6' },
    { value: 'EMPLOYEE', label: 'Employees', color: '#8b5cf6' },
    { value: 'APPROVER', label: 'Approvers', color: '#f59e0b' },
    { value: 'FINANCE_OFFICER', label: 'Finance', color: '#06b6d4' },
    { value: 'ADMIN', label: 'Admins', color: '#ef4444' },
    { value: 'PUBLIC', label: 'General Public', color: '#6b7280' },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const qrData = {
        qrCode: `https://rapidtie.com/event/${eventId}/role/${selectedRole}`,
        dataUrl: '',
      };
      setGeneratedQR(qrData);
      onGenerate(selectedRole, qrData);
      toast.success(`${roles.find(r => r.value === selectedRole)?.label} QR code generated`);
    } catch (error) {
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const selectedRoleConfig = roles.find(r => r.value === selectedRole);

  return (
    <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-center gap-2 mb-4">
        <QrCodeIconHelper size={20} className="text-[#84cc16]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Role-Specific QR Codes</h3>
      </div>
      <p className="text-sm mb-4 text-[var(--text-secondary)]">
        Generate special QR codes for different attendee roles
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
        {roles.map((role) => (
          <button
            key={role.value}
            onClick={() => setSelectedRole(role.value)}
            className={`p-2 rounded-lg text-center transition-all ${
              selectedRole === role.value
                ? 'ring-2 ring-[#84cc16]'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{ backgroundColor: `${role.color}20`, borderColor: role.color, borderWidth: 1 }}
          >
            <div className="text-sm font-medium" style={{ color: role.color }}>{role.label}</div>
          </button>
        ))}
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-colors disabled:opacity-50 mb-4"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating...
          </div>
        ) : (
          `Generate ${selectedRoleConfig?.label} QR Code`
        )}
      </button>

      {generatedQR && selectedRoleConfig && (
        <div className="mt-4 p-4 rounded-lg text-center border" style={{ borderColor: 'var(--border-color)' }}>
          <div className="inline-block p-3 bg-white rounded-lg mb-3">
            <QRCode value={generatedQR.qrCode} size={100} />
          </div>
          <p className="text-sm font-medium mb-2 text-[var(--text-primary)]">{selectedRoleConfig.label} QR Code</p>
          <button className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm border" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
            <Download size={14} />
            Download PNG
          </button>
        </div>
      )}
    </div>
  );
};

export default function QRCodeManagementPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [resendingBulk, setResendingBulk] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [selectedRoleFilter, selectedStatusFilter, tickets]);

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setEventInfo(getMockEventInfo());
      const mockTickets = getMockTickets();
      setTickets(mockTickets);
      setFilteredTickets(mockTickets);
    } catch (error) {
      toast.error('Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = [...tickets];
    if (selectedRoleFilter !== 'all') {
      filtered = filtered.filter(t => t.role === selectedRoleFilter);
    }
    if (selectedStatusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === selectedStatusFilter);
    }
    setFilteredTickets(filtered);
    setSelectedTickets([]);
  };

  const handleRegenerateQR = async (ticketId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('QR code regenerated');
    await loadData();
  };

  const handleResendTicket = async (ticketId: string, method: 'email' | 'sms') => {
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success(`Ticket resent via ${method.toUpperCase()}`);
  };

  const handleBulkResend = async (method: 'email' | 'sms') => {
    if (selectedTickets.length === 0) {
      toast.error('No tickets selected');
      return;
    }
    setResendingBulk(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(`${selectedTickets.length} tickets resent via ${method.toUpperCase()}`);
    setSelectedTickets([]);
    setResendingBulk(false);
  };

  const handleDownloadPDF = async () => {
    if (selectedTickets.length === 0) {
      toast.error('No tickets selected');
      return;
    }
    setExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('PDF downloaded');
    setExporting(false);
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map(t => t.id));
    }
  };

  const stats = [
    { label: 'Total Tickets', value: eventInfo?.totalTickets || 0, icon: Ticket, color: 'text-blue-500' },
    { label: 'Sold', value: eventInfo?.ticketsSold || 0, icon: CheckCircleIcon, color: 'text-green-500' },
    { label: 'Used', value: eventInfo?.ticketsUsed || 0, icon: Clock, color: 'text-yellow-500' },
    { label: 'Remaining', value: (eventInfo?.totalTickets || 0) - (eventInfo?.ticketsSold || 0), icon: Ticket, color: 'text-purple-500' },
  ];

  const getIconForModule = (iconName: string) => {
    switch (iconName) {
      case 'Details': return Eye;
      case 'Ticket': return TicketIcon;
      case 'Users': return UsersIcon;
      case 'CheckCircle': return CheckCircleIcon;
      case 'BarChart3': return DollarSignIcon;
      case 'MessageSquare': return MessageSquareIcon;
      case 'QrCode': return QrCodeIconHelper;
      default: return Eye;
    }
  };

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
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">QR Code Management</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {eventInfo?.name} - {eventInfo && new Date(eventInfo.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Event Management Modules Navigation */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Event Management</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
          {EVENT_MODULES.map((module) => {
            const isActive = module.name === 'QR Codes';
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">{stat.label}</span>
                <Icon size={18} className={stat.color} />
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Role QR Generator */}
      <RoleQRGenerator
        eventId={eventId}
        eventName={eventInfo?.name || 'Event'}
        onGenerate={(role: string, qrData: any) => {
          console.log(`Generated ${role} QR code`, qrData);
        }}
      />

      {/* Filters and Bulk Actions */}
      <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-[var(--text-secondary)]" />
              <span className="text-sm text-[var(--text-primary)]">Filter:</span>
            </div>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="all">All Roles</option>
              <option value="MERCHANT">Merchant</option>
              <option value="ORGANIZER">Organizer</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="APPROVER">Approver</option>
              <option value="FINANCE_OFFICER">Finance</option>
              <option value="ADMIN">Admin</option>
              <option value="PUBLIC">Public</option>
            </select>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="used">Used</option>
              <option value="expired">Expired</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSelectAll} className="px-3 py-1.5 rounded-lg text-sm border" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
              {selectedTickets.length === filteredTickets.length ? 'Deselect All' : 'Select All'}
            </button>
            <button
              onClick={() => handleBulkResend('email')}
              disabled={selectedTickets.length === 0 || resendingBulk}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {resendingBulk ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Mail size={14} />}
              Resend Email
            </button>
            <button
              onClick={() => handleBulkResend('sms')}
              disabled={selectedTickets.length === 0 || resendingBulk}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
            >
              {resendingBulk ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Smartphone size={14} />}
              Resend SMS
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={selectedTickets.length === 0 || exporting}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-[#84cc16] text-white hover:brightness-110 disabled:opacity-50"
            >
              {exporting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Download size={14} />}
              Download PDF
            </button>
          </div>
        </div>
        {selectedTickets.length > 0 && (
          <p className="text-xs mt-3 text-[var(--text-secondary)]">{selectedTickets.length} ticket(s) selected</p>
        )}
      </div>

      {/* QR Code Grid */}
      <QRCodeGrid
        tickets={filteredTickets}
        eventName={eventInfo?.name || 'Event'}
        onRegenerateQR={handleRegenerateQR}
        onResendTicket={handleResendTicket}
        loading={loading}
      />
    </div>
  );
}

// Helper XCircle component
const XCircle = ({ size, className }: { size: number; className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);