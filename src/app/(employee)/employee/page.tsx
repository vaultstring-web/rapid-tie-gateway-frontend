'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Plus,
  Eye,
  Download,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const mockStats = {
  totalRequests: 12,
  pendingRequests: 3,
  approvedRequests: 8,
  rejectedRequests: 1,
  totalDisbursed: 1250000,
  averageProcessingTime: 2.5,
};

const mockRecentRequests = [
  {
    id: 'req-1',
    destination: 'Lilongwe',
    purpose: 'Conference Attendance',
    startDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 10 * 86400000).toISOString(),
    amount: 135000,
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'req-2',
    destination: 'Blantyre',
    purpose: 'Field Visit',
    startDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 16 * 86400000).toISOString(),
    amount: 90000,
    status: 'approved',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'req-3',
    destination: 'Mzuzu',
    purpose: 'Training Workshop',
    startDate: new Date(Date.now() + 21 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 24 * 86400000).toISOString(),
    amount: 180000,
    status: 'approved',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

const mockUpcomingEvents = [
  {
    id: 'event-1',
    name: 'Tech Conference Malawi',
    date: new Date(Date.now() + 10 * 86400000).toISOString(),
    venue: 'BICC, Lilongwe',
    category: 'conference',
  },
  {
    id: 'event-2',
    name: 'Professional Development Workshop',
    date: new Date(Date.now() + 20 * 86400000).toISOString(),
    venue: 'Virtual',
    category: 'workshop',
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'pending':
      return { label: 'Pending', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: Clock };
    case 'approved':
      return { label: 'Approved', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle };
    case 'rejected':
      return { label: 'Rejected', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle };
    default:
      return { label: status, color: 'text-gray-600', bg: 'bg-gray-100', icon: AlertCircle };
  }
};

export default function EmployeeDashboardPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [stats, setStats] = useState(mockStats);
  const [recentRequests, setRecentRequests] = useState(mockRecentRequests);
  const [upcomingEvents, setUpcomingEvents] = useState(mockUpcomingEvents);
  const [loading, setLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Using mock data for now
      setStats(mockStats);
      setRecentRequests(mockRecentRequests);
      setUpcomingEvents(mockUpcomingEvents);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const kpiCards = [
    {
      title: 'Total Requests',
      value: stats.totalRequests,
      icon: FileText,
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Pending',
      value: stats.pendingRequests,
      icon: Clock,
      color: 'text-yellow-500',
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      title: 'Approved',
      value: stats.approvedRequests,
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Total Disbursed',
      value: formatCurrency(stats.totalDisbursed),
      icon: DollarSign,
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Employee Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage your DSA requests and track disbursements
          </p>
        </div>
        <Link
          href="/employee/dsa/request"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-all"
        >
          <Plus size={18} />
          New DSA Request
        </Link>
      </div>

      {/* Demo Mode Notice */}
      {useMockData && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ℹ️ Demo Mode - Using sample data. Connect to backend for live data.
          </p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-xl p-4 border transition-all hover:shadow-md"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">{card.title}</span>
                <div className={`${card.bg} p-2 rounded-lg`}>
                  <Icon size={16} className={card.color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Requests and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent DSA Requests */}
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border-color)] flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent DSA Requests</h2>
            <Link href="/employee/dsa/requests" className="text-sm text-[#84cc16] hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-[var(--border-color)]">
            {recentRequests.map((request) => {
              const statusConfig = getStatusConfig(request.status);
              const StatusIcon = statusConfig.icon;
              return (
                <div key={request.id} className="p-4 hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
                  onClick={() => router.push(`/employee/dsa/requests/${request.id}`)}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{request.destination}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{request.purpose}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <StatusIcon size={12} className={statusConfig.color} />
                      <span className={`text-xs ${statusConfig.color}`}>{statusConfig.label}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span>{formatDate(request.startDate)} - {formatDate(request.endDate)}</span>
                    <span className="font-semibold text-[#84cc16]">{formatCurrency(request.amount)}</span>
                  </div>
                </div>
              );
            })}
            {recentRequests.length === 0 && (
              <div className="p-8 text-center text-[var(--text-secondary)]">
                No DSA requests found
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border-color)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Upcoming Events</h2>
          </div>
          <div className="divide-y divide-[var(--border-color)]">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-4 hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
                onClick={() => router.push(`/events/${event.id}`)}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{event.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{event.venue}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                    {event.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <Calendar size={12} />
                  <span>{formatDate(event.date)}</span>
                </div>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <div className="p-8 text-center text-[var(--text-secondary)]">
                No upcoming events
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-5">
        <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => router.push('/employee/dsa/request')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--border-color)] hover:border-[#84cc16] transition-all group"
          >
            <Plus size={24} className="text-[#84cc16]" />
            <span className="text-sm text-[var(--text-primary)]">New Request</span>
          </button>
          <button
            onClick={() => router.push('/employee/dsa/requests')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--border-color)] hover:border-[#84cc16] transition-all group"
          >
            <Eye size={24} className="text-[#84cc16]" />
            <span className="text-sm text-[var(--text-primary)]">View Requests</span>
          </button>
          <button
            onClick={() => router.push('/employee/payments')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--border-color)] hover:border-[#84cc16] transition-all group"
          >
            <DollarSign size={24} className="text-[#84cc16]" />
            <span className="text-sm text-[var(--text-primary)]">Payment History</span>
          </button>
          <button
            onClick={() => router.push('/events')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--border-color)] hover:border-[#84cc16] transition-all group"
          >
            <Calendar size={24} className="text-[#84cc16]" />
            <span className="text-sm text-[var(--text-primary)]">Discover Events</span>
          </button>
        </div>
      </div>
    </div>
  );
}