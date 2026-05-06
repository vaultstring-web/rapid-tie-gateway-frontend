'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Ticket,
  DollarSign,
  Download,
  RefreshCw,
  Calendar,
  Eye,
  CheckCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Types
interface SalesMetrics {
  totalRevenue: number;
  totalTicketsSold: number;
  totalAttendees: number;
  averageTicketPrice: number;
  revenueChange: number;
  ticketsSoldChange: number;
  capacityPercentage: number;
  conversionRate: number;
}

interface RevenueData {
  date: string;
  revenue: number;
  tickets: number;
}

interface SalesByTier {
  tierId: string;
  tierName: string;
  sold: number;
  quantity: number;
  revenue: number;
  price: number;
  percentage: number;
}

interface AudienceBreakdown {
  role: string;
  count: number;
  percentage: number;
  color: string;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  tierName: string;
  quantity: number;
  amount: number;
  status: 'completed' | 'pending' | 'refunded';
  purchasedAt: string;
}

// Mock data
const getMockMetrics = (): SalesMetrics => ({
  totalRevenue: 12500000,
  totalTicketsSold: 1250,
  totalAttendees: 1180,
  averageTicketPrice: 10000,
  revenueChange: 12.5,
  ticketsSoldChange: 8.3,
  capacityPercentage: 78,
  conversionRate: 24.8,
});

const getMockRevenueData = (): RevenueData[] => {
  const now = new Date();
  const data: RevenueData[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Math.floor(Math.random() * 500000) + 100000,
      tickets: Math.floor(Math.random() * 100) + 20,
    });
  }
  return data;
};

const getMockSalesByTier = (): SalesByTier[] => [
  { tierId: '1', tierName: 'VIP', sold: 150, quantity: 200, revenue: 7500000, price: 50000, percentage: 75 },
  { tierId: '2', tierName: 'General Admission', sold: 800, quantity: 1000, revenue: 4000000, price: 5000, percentage: 80 },
  { tierId: '3', tierName: 'Early Bird', sold: 200, quantity: 250, revenue: 1000000, price: 5000, percentage: 80 },
  { tierId: '4', tierName: 'Group Ticket', sold: 100, quantity: 150, revenue: 0, price: 0, percentage: 0 },
];

const getMockAudienceBreakdown = (): AudienceBreakdown[] => [
  { role: 'MERCHANT', count: 450, percentage: 36, color: '#10b981' },
  { role: 'ORGANIZER', count: 120, percentage: 9.6, color: '#3b82f6' },
  { role: 'EMPLOYEE', count: 300, percentage: 24, color: '#8b5cf6' },
  { role: 'APPROVER', count: 80, percentage: 6.4, color: '#f59e0b' },
  { role: 'FINANCE_OFFICER', count: 50, percentage: 4, color: '#06b6d4' },
  { role: 'ADMIN', count: 10, percentage: 0.8, color: '#ef4444' },
  { role: 'PUBLIC', count: 240, percentage: 19.2, color: '#6b7280' },
];

const getMockRecentOrders = (): RecentOrder[] => [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    tierName: 'VIP',
    quantity: 2,
    amount: 300000,
    status: 'completed',
    purchasedAt: new Date().toISOString(),
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    tierName: 'General Admission',
    quantity: 4,
    amount: 180000,
    status: 'completed',
    purchasedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    tierName: 'Early Bird',
    quantity: 2,
    amount: 50000,
    status: 'completed',
    purchasedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '4',
    orderNumber: 'ORD-004',
    customerName: 'Sarah Williams',
    customerEmail: 'sarah@example.com',
    tierName: 'VIP',
    quantity: 1,
    amount: 150000,
    status: 'pending',
    purchasedAt: new Date(Date.now() - 10800000).toISOString(),
  },
];

// Helper Icons (using the imported Eye from lucide-react, no duplicate)
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
  { name: 'Sales', href: (id: string) => `/organizer/event-management/events/${id}/sales`, icon: 'BarChart3' },
  { name: 'Messaging', href: (id: string) => `/organizer/events/${id}/communications`, icon: 'MessageSquare' },
  { name: 'QR Codes', href: (id: string) => `/organizer/events/${id}/qrcodes`, icon: 'QrCode' },
];

// KPI Card Component
const KPICard = ({ title, value, change, icon: Icon, prefix = '' }: any) => (
  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-[var(--text-secondary)]">{title}</span>
      <div className="p-2 rounded-lg bg-[#84cc16]/10">
        <Icon size={16} className="text-[#84cc16]" />
      </div>
    </div>
    <p className="text-2xl font-bold text-[var(--text-primary)]">
      {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
    </p>
    {change !== undefined && (
      <p className={`text-xs mt-1 flex items-center gap-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        <TrendingUp size={10} className={change >= 0 ? '' : 'rotate-180'} />
        {Math.abs(change)}% from yesterday
      </p>
    )}
  </div>
);

export default function SalesPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [metrics, setMetrics] = useState<SalesMetrics | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [salesByTier, setSalesByTier] = useState<SalesByTier[]>([]);
  const [audienceBreakdown, setAudienceBreakdown] = useState<AudienceBreakdown[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('7days');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setMetrics(getMockMetrics());
      setRevenueData(getMockRevenueData());
      setSalesByTier(getMockSalesByTier());
      setAudienceBreakdown(getMockAudienceBreakdown());
      setRecentOrders(getMockRecentOrders());
    } catch (error) {
      toast.error('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    toast.success('Data refreshed');
  };

  const handleExport = () => {
    toast.info('Export feature coming soon');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg p-3 shadow-lg border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{label}</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Revenue: <span className="text-green-500 font-medium">{formatCurrency(payload[0].value)}</span>
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Tickets: <span className="text-blue-500 font-medium">{payload[1].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getIconForModule = (iconName: string) => {
    switch (iconName) {
      case 'Details': return Eye;
      case 'Ticket': return TicketIcon;
      case 'Users': return UsersIcon;
      case 'CheckCircle': return CheckCircle;
      case 'BarChart3': return DollarSignIcon;
      case 'MessageSquare': return MessageSquareIcon;
      case 'QrCode': return QrCodeIcon;
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
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Sales Analytics</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Track your event sales and revenue performance
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Event Management Modules Navigation */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Event Management</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
          {EVENT_MODULES.map((module) => {
            const isActive = module.name === 'Sales';
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

      {/* KPI Cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Total Revenue" value={formatCurrency(metrics.totalRevenue)} change={metrics.revenueChange} icon={DollarSign} prefix="MWK " />
          <KPICard title="Tickets Sold" value={metrics.totalTicketsSold} change={metrics.ticketsSoldChange} icon={TicketIcon} />
          <KPICard title="Avg. Ticket Price" value={formatCurrency(metrics.averageTicketPrice)} icon={TicketIcon} prefix="MWK " />
          <KPICard title="Conversion Rate" value={`${metrics.conversionRate}%`} icon={TrendingUp} />
        </div>
      )}

      {/* KPI Cards Row 2 */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard title="Total Attendees" value={metrics.totalAttendees} icon={UsersIcon} />
          <KPICard title="Capacity Filled" value={`${metrics.capacityPercentage}%`} icon={Calendar} />
          <KPICard title="Total Orders" value={recentOrders.length} icon={CheckCircle} />
        </div>
      )}

      {/* Revenue Chart */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-5">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <TrendingUp size={18} />
          Revenue & Ticket Trends
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ticketsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="date" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
              <YAxis yAxisId="left" tickFormatter={(v) => `K${(v / 1000).toFixed(0)}k`} tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#84cc16" strokeWidth={2} fill="url(#revenueGradient)" />
              <Area yAxisId="right" type="monotone" dataKey="tickets" name="Tickets" stroke="#3b82f6" strokeWidth={2} fill="url(#ticketsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales by Tier & Audience Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales by Tier */}
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <TicketIcon size={18} />
            Sales by Ticket Tier
          </h2>
          <div className="space-y-4">
            {salesByTier.map((tier) => (
              <div key={tier.tierId}>
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <span className="text-sm font-medium text-[var(--text-primary)]">{tier.tierName}</span>
                    <p className="text-xs text-[var(--text-secondary)]">{tier.sold} / {tier.quantity} sold</p>
                  </div>
                  <span className="text-sm font-semibold text-[#84cc16]">{formatCurrency(tier.revenue)}</span>
                </div>
                <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#84cc16] transition-all"
                    style={{ width: `${tier.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Breakdown by Role */}
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <UsersIcon size={18} />
            Audience by Role
          </h2>
          <div className="space-y-3">
            {audienceBreakdown.map((role) => (
              <div key={role.role}>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'var(--text-primary)' }}>{role.role}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{role.count} ({role.percentage}%)</span>
                </div>
                <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${role.percentage}%`, backgroundColor: role.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border-color)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-primary)]/50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Order #</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Ticket Type</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Qty</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[var(--hover-bg)] transition-colors">
                  <td className="px-5 py-3 text-sm font-mono text-[var(--text-primary)]">{order.orderNumber}</td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{order.customerName}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{order.customerEmail}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-[var(--text-primary)]">{order.tierName}</td>
                  <td className="px-5 py-3 text-sm text-[var(--text-primary)]">{order.quantity}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-[#84cc16]">{formatCurrency(order.amount)}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-[var(--text-secondary)]">
                    {formatDate(order.purchasedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}