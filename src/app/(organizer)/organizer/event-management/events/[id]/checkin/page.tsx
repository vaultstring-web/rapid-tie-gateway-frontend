'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Camera,
  FileText,
  Users,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Search,
  QrCode,
} from 'lucide-react';
import { formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Types
interface CheckinRecord {
  id: string;
  ticketId: string;
  attendeeName: string;
  attendeeEmail: string;
  ticketNumber: string;
  tierName: string;
  role: string;
  checkedInAt: string;
  checkedInBy: string;
  method: 'qr' | 'manual' | 'offline';
  synced: boolean;
}

interface CheckinStats {
  total: number;
  checkedIn: number;
  notCheckedIn: number;
  percentage: number;
  byRole: {
    role: string;
    total: number;
    checkedIn: number;
    percentage: number;
    color: string;
  }[];
}

// Mock data
const getMockStats = (): CheckinStats => {
  const total = 1250;
  const checkedIn = 678;
  return {
    total,
    checkedIn,
    notCheckedIn: total - checkedIn,
    percentage: Math.round((checkedIn / total) * 100),
    byRole: [
      { role: 'MERCHANT', total: 450, checkedIn: 245, percentage: 54, color: '#10b981' },
      { role: 'ORGANIZER', total: 120, checkedIn: 89, percentage: 74, color: '#3b82f6' },
      { role: 'EMPLOYEE', total: 300, checkedIn: 156, percentage: 52, color: '#8b5cf6' },
      { role: 'APPROVER', total: 80, checkedIn: 45, percentage: 56, color: '#f59e0b' },
      { role: 'FINANCE_OFFICER', total: 50, checkedIn: 32, percentage: 64, color: '#06b6d4' },
      { role: 'ADMIN', total: 10, checkedIn: 8, percentage: 80, color: '#ef4444' },
      { role: 'PUBLIC', total: 240, checkedIn: 103, percentage: 43, color: '#6b7280' },
    ],
  };
};

const getMockRecentCheckins = (): CheckinRecord[] => {
  return [
    {
      id: '1',
      ticketId: 'tkt-001',
      attendeeName: 'John Doe',
      attendeeEmail: 'john@example.com',
      ticketNumber: 'TKT-0001',
      tierName: 'VIP',
      role: 'MERCHANT',
      checkedInAt: new Date().toISOString(),
      checkedInBy: 'Scanner',
      method: 'qr',
      synced: true,
    },
    {
      id: '2',
      ticketId: 'tkt-002',
      attendeeName: 'Jane Smith',
      attendeeEmail: 'jane@example.com',
      ticketNumber: 'TKT-0002',
      tierName: 'General Admission',
      role: 'PUBLIC',
      checkedInAt: new Date(Date.now() - 60000).toISOString(),
      checkedInBy: 'Manual Entry',
      method: 'manual',
      synced: true,
    },
    {
      id: '3',
      ticketId: 'tkt-003',
      attendeeName: 'Michael Johnson',
      attendeeEmail: 'michael@example.com',
      ticketNumber: 'TKT-0003',
      tierName: 'VIP',
      role: 'ORGANIZER',
      checkedInAt: new Date(Date.now() - 120000).toISOString(),
      checkedInBy: 'QR Scanner',
      method: 'qr',
      synced: true,
    },
    {
      id: '4',
      ticketId: 'tkt-004',
      attendeeName: 'Sarah Williams',
      attendeeEmail: 'sarah@example.com',
      ticketNumber: 'TKT-0004',
      tierName: 'General Admission',
      role: 'EMPLOYEE',
      checkedInAt: new Date(Date.now() - 180000).toISOString(),
      checkedInBy: 'Scanner',
      method: 'qr',
      synced: true,
    },
  ];
};

// Helper Icons
const CheckCircleIcon = ({ size, className }: { size: number; className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

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
  { name: 'Check-in', href: (id: string) => `/organizer/event-management/events/${id}/checkin`, icon: 'CheckCircle' },
  { name: 'Sales', href: (id: string) => `/organizer/events/${id}/sales`, icon: 'BarChart3' },
  { name: 'Messaging', href: (id: string) => `/organizer/events/${id}/communications`, icon: 'MessageSquare' },
  { name: 'QR Codes', href: (id: string) => `/organizer/events/${id}/qrcodes`, icon: 'QrCode' },
];

// Scanner View Component
const ScannerView = ({ onScan, scanning }: { onScan: (data: string) => void; scanning: boolean }) => {
  const { theme } = useTheme();
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);

  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setHasCamera(videoDevices.length > 0);
      } catch (err) {
        setHasCamera(false);
      }
    };
    checkCamera();
  }, []);

  const handleMockScan = () => {
    if (scanning) {
      onScan('TKT-0001');
    }
  };

  if (!hasCamera) {
    return (
      <div className="rounded-xl p-8 text-center border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <Camera size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-secondary)' }} />
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Camera Not Available</h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Please ensure you have a camera connected and permissions granted
        </p>
        <button
          onClick={handleMockScan}
          className="mt-4 px-4 py-2 rounded-lg bg-[#84cc16] text-white hover:brightness-110"
        >
          Demo: Simulate QR Scan
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <div className="relative bg-black aspect-video flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-[#84cc16] rounded-lg m-8 pointer-events-none" />
        <div className="text-center">
          <QrCode size={64} className="mx-auto text-white opacity-50 mb-4" />
          <p className="text-white text-sm">Position QR code within the frame</p>
          <button
            onClick={handleMockScan}
            className="mt-4 px-4 py-2 rounded-lg bg-[#84cc16] text-white hover:brightness-110"
          >
            Demo: Simulate Scan
          </button>
        </div>
      </div>
      <div className="p-4 text-center">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Camera ready. Position ticket QR code to scan.
        </p>
      </div>
    </div>
  );
};

// Manual Entry Form Component
const ManualEntryForm = ({ onSubmit, loading }: { onSubmit: (ticketNumber: string) => Promise<void>; loading: boolean }) => {
  const { theme } = useTheme();
  const [ticketNumber, setTicketNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketNumber.trim()) {
      setError('Please enter a ticket number');
      return;
    }
    setError(null);
    try {
      await onSubmit(ticketNumber.trim());
      setTicketNumber('');
    } catch (err) {
      setError('Ticket not found or already checked in');
    }
  };

  return (
    <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
        <FileText size={18} />
        Manual Check-in
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Ticket Number</label>
          <input
            type="text"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            placeholder="Enter ticket number (e.g., TKT-1234)"
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            disabled={loading}
            autoFocus
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <UserCheck size={16} />
              Check In
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// Check-in Progress Chart Component
const CheckinProgressChart = ({ stats }: { stats: CheckinStats }) => {
  const { theme } = useTheme();

  const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
      MERCHANT: '#10b981',
      ORGANIZER: '#3b82f6',
      EMPLOYEE: '#8b5cf6',
      APPROVER: '#f59e0b',
      FINANCE_OFFICER: '#06b6d4',
      ADMIN: '#ef4444',
      PUBLIC: '#6b7280',
    };
    return colors[role] || '#6b7280';
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-3xl font-bold text-[#84cc16]">{stats.percentage}%</div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {stats.checkedIn} / {stats.total} checked in
        </p>
      </div>
      <div className="space-y-3">
        {stats.byRole.map((role) => (
          <div key={role.role}>
            <div className="flex justify-between text-sm mb-1">
              <span style={{ color: 'var(--text-primary)' }}>{role.role}</span>
              <span style={{ color: 'var(--text-secondary)' }}>
                {role.checkedIn} / {role.total} ({role.percentage}%)
              </span>
            </div>
            <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${role.percentage}%`, backgroundColor: getRoleColor(role.role) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Recent Check-ins Feed Component
const RecentCheckinsFeed = ({ checkins, loading }: { checkins: CheckinRecord[]; loading: boolean }) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (checkins.length === 0) {
    return (
      <div className="text-center py-8">
        <UserCheck size={32} className="mx-auto mb-3 opacity-50" style={{ color: 'var(--text-secondary)' }} />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No check-ins yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {checkins.map((checkin) => (
        <div
          key={checkin.id}
          className="rounded-xl p-4 border transition-all hover:shadow-md"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
              <CheckCircleIcon size={20} className="text-green-500" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {checkin.attendeeName}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {checkin.ticketNumber} • {checkin.tierName}
                  </p>
                </div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(checkin.checkedInAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  {checkin.method === 'qr' ? 'QR Scan' : checkin.method === 'manual' ? 'Manual Entry' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function CheckinManagementPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [stats, setStats] = useState<CheckinStats | null>(null);
  const [recentCheckins, setRecentCheckins] = useState<CheckinRecord[]>([]);
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [activeTab, setActiveTab] = useState<'scanner' | 'manual'>('scanner');

  useEffect(() => {
    loadData();
    
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
    
    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setStats(getMockStats());
      setRecentCheckins(getMockRecentCheckins());
    } catch (error) {
      toast.error('Failed to load check-in data');
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = async (qrData: string) => {
    if (processing) return;
    setProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockCheckin: CheckinRecord = {
        id: Date.now().toString(),
        ticketId: 'mock-ticket',
        attendeeName: 'Demo Attendee',
        attendeeEmail: 'demo@example.com',
        ticketNumber: qrData,
        tierName: 'VIP',
        role: 'PUBLIC',
        checkedInAt: new Date().toISOString(),
        checkedInBy: 'Scanner',
        method: 'qr',
        synced: isOnline,
      };
      toast.success(`${mockCheckin.attendeeName} checked in!`);
      setRecentCheckins(prev => [mockCheckin, ...prev.slice(0, 19)]);
      if (stats) {
        setStats(prev => ({
          ...prev!,
          checkedIn: prev!.checkedIn + 1,
          percentage: Math.round(((prev!.checkedIn + 1) / prev!.total) * 100),
          byRole: prev!.byRole.map(role =>
            role.role === mockCheckin.role
              ? { ...role, checkedIn: role.checkedIn + 1, percentage: Math.round(((role.checkedIn + 1) / role.total) * 100) }
              : role
          ),
        }));
      }
    } catch (error) {
      toast.error('Failed to check in');
    } finally {
      setProcessing(false);
    }
  };

  const handleManualCheckin = async (ticketNumber: string) => {
    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockCheckin: CheckinRecord = {
        id: Date.now().toString(),
        ticketId: 'mock-ticket',
        attendeeName: 'Manual Attendee',
        attendeeEmail: 'manual@example.com',
        ticketNumber,
        tierName: 'General Admission',
        role: 'PUBLIC',
        checkedInAt: new Date().toISOString(),
        checkedInBy: 'Manual Entry',
        method: 'manual',
        synced: isOnline,
      };
      toast.success(`${mockCheckin.attendeeName} checked in!`);
      setRecentCheckins(prev => [mockCheckin, ...prev.slice(0, 19)]);
      if (stats) {
        setStats(prev => ({
          ...prev!,
          checkedIn: prev!.checkedIn + 1,
          percentage: Math.round(((prev!.checkedIn + 1) / prev!.total) * 100),
          byRole: prev!.byRole.map(role =>
            role.role === mockCheckin.role
              ? { ...role, checkedIn: role.checkedIn + 1, percentage: Math.round(((role.checkedIn + 1) / role.total) * 100) }
              : role
          ),
        }));
      }
    } catch (error) {
      toast.error('Ticket not found or already checked in');
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  const getIconForModule = (iconName: string) => {
    switch (iconName) {
      case 'Details': return Eye;
      case 'Ticket': return TicketIcon;
      case 'Users': return UsersIcon;
      case 'CheckCircle': return CheckCircleIcon;
      case 'BarChart3': return DollarSignIcon;
      case 'MessageSquare': return MessageSquareIcon;
      case 'QrCode': return QrCodeIcon;
      default: return Eye;
    }
  };

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
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Check-in Management</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Scan tickets or manually check in attendees
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${isOnline ? 'border-green-500' : 'border-yellow-500'}`}>
            {isOnline ? (
              <>
                <Wifi size={16} className="text-green-500" />
                <span className="text-sm text-green-500">Online</span>
              </>
            ) : (
              <>
                <WifiOff size={16} className="text-yellow-500" />
                <span className="text-sm text-yellow-500">Offline Mode</span>
              </>
            )}
          </div>
          <button
            onClick={() => loadData()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Event Management Modules Navigation */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Event Management</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
          {EVENT_MODULES.map((module) => {
            const isActive = module.name === 'Check-in';
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

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Scanner & Manual Entry */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                activeTab === 'scanner'
                  ? 'border-b-2 border-[#84cc16] text-[#84cc16]'
                  : 'hover:text-[#84cc16]'
              }`}
              style={{ color: activeTab === 'scanner' ? undefined : 'var(--text-secondary)' }}
            >
              <Camera size={16} />
              QR Scanner
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                activeTab === 'manual'
                  ? 'border-b-2 border-[#84cc16] text-[#84cc16]'
                  : 'hover:text-[#84cc16]'
              }`}
              style={{ color: activeTab === 'manual' ? undefined : 'var(--text-secondary)' }}
            >
              <FileText size={16} />
              Manual Entry
            </button>
          </div>

          {activeTab === 'scanner' ? (
            <ScannerView onScan={handleQRScan} scanning={!processing} />
          ) : (
            <ManualEntryForm onSubmit={handleManualCheckin} loading={processing} />
          )}
        </div>

        {/* Right Column - Stats & Recent Check-ins */}
        <div className="space-y-6">
          {/* Check-in Progress */}
          <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Users size={18} />
              Check-in Progress
            </h2>
            {stats && <CheckinProgressChart stats={stats} />}
          </div>

          {/* Recent Check-ins Feed */}
          <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Recent Check-ins
            </h2>
            <RecentCheckinsFeed checkins={recentCheckins} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Eye icon component
const Eye = ({ size, className }: { size: number; className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);