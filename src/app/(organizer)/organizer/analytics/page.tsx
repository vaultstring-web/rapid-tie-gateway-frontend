'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Ticket,
  Users,
  Eye,
  DollarSign,
  Download,
  Filter,
  ChevronDown,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

// Mock Data
const REVENUE_DATA = [
  { month: 'Jan', revenue: 1250000, tickets: 280, events: 2 },
  { month: 'Feb', revenue: 1580000, tickets: 345, events: 3 },
  { month: 'Mar', revenue: 2100000, tickets: 420, events: 4 },
  { month: 'Apr', revenue: 1850000, tickets: 390, events: 3 },
  { month: 'May', revenue: 2450000, tickets: 510, events: 5 },
  { month: 'Jun', revenue: 2980000, tickets: 620, events: 6 },
];

const EVENT_CATEGORY_DATA = [
  { name: 'Conferences', value: 45, color: '#84cc16' },
  { name: 'Workshops', value: 25, color: '#3b82f6' },
  { name: 'Festivals', value: 15, color: '#f59e0b' },
  { name: 'Sports', value: 10, color: '#ef4444' },
  { name: 'Other', value: 5, color: '#8b5cf6' },
];

const ROLE_BREAKDOWN = [
  { role: 'Merchants', percentage: 42, color: '#84cc16' },
  { role: 'Public', percentage: 28, color: '#3b82f6' },
  { role: 'Employees', percentage: 18, color: '#f59e0b' },
  { role: 'Organizers', percentage: 8, color: '#8b5cf6' },
  { role: 'Others', percentage: 4, color: '#ef4444' },
];

const TOP_EVENTS = [
  { id: '1', name: 'Malawi Fintech Expo', revenue: 2450000, tickets: 520, conversion: 68 },
  { id: '2', name: 'Tech Innovation Summit', revenue: 1890000, tickets: 410, conversion: 72 },
  { id: '3', name: 'Music Festival Malawi', revenue: 1560000, tickets: 890, conversion: 45 },
  { id: '4', name: 'Developer Workshop', revenue: 890000, tickets: 320, conversion: 58 },
  { id: '5', name: 'Art Exhibition', revenue: 450000, tickets: 180, conversion: 42 },
];

const MONTHLY_TRENDS = [
  { month: 'Jan', revenue: 1250000, target: 1000000 },
  { month: 'Feb', revenue: 1580000, target: 1200000 },
  { month: 'Mar', revenue: 2100000, target: 1800000 },
  { month: 'Apr', revenue: 1850000, target: 2000000 },
  { month: 'May', revenue: 2450000, target: 2200000 },
  { month: 'Jun', revenue: 2980000, target: 2500000 },
];

const METRICS = {
  totalRevenue: 12210000,
  revenueChange: 18.5,
  totalTickets: 2565,
  ticketsChange: 12.3,
  totalEvents: 23,
  eventsChange: 4,
  totalAttendees: 21450,
  attendeesChange: 15.2,
  avgTicketPrice: 4750,
  avgTicketChange: -2.1,
  conversionRate: 24.8,
  conversionChange: 3.2,
};

// Metric Card Component
const MetricCard = ({ title, value, change, icon: Icon, prefix = '', suffix = '' }: any) => (
  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5 transition-all hover:border-[#84cc16]/50">
    <div className="flex justify-between items-start mb-3">
      <div className="p-2 rounded-lg bg-[#84cc16]/10">
        <Icon size={20} className="text-[#84cc16]" />
      </div>
      <div className={`flex items-center gap-1 text-xs font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {Math.abs(change)}%
      </div>
    </div>
    <p className="text-sm text-[var(--text-secondary)]">{title}</p>
    <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
      {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
    </p>
  </div>
);

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">{label}</p>
        {payload.map((p: any, idx: number) => (
          <p key={idx} className="text-xs" style={{ color: p.color }}>
            {p.name}: {p.name === 'Revenue' ? formatCurrency(p.value) : p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function OrganizerAnalyticsPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dateRange, setDateRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExport = (format: string) => {
    alert(`Exporting analytics as ${format}...`);
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Analytics Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Track your event performance and audience insights
          </p>
        </div>
        <div className="flex gap-3">
          {/* Date Range Selector */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-4 pr-8 py-2 rounded-lg border bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[#84cc16] appearance-none cursor-pointer"
            >
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="ytd">Year to Date</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
          </div>

          {/* Export Button */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm hover:border-[#84cc16] transition-all"
            >
              <Download size={16} />
              Export
            </button>
            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-36 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-lg z-20 overflow-hidden">
                  <button onClick={() => handleExport('PDF')} className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--hover-bg)] text-[var(--text-primary)]">Export as PDF</button>
                  <button onClick={() => handleExport('CSV')} className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--hover-bg)] text-[var(--text-primary)]">Export as CSV</button>
                  <button onClick={() => handleExport('Excel')} className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--hover-bg)] text-[var(--text-primary)]">Export as Excel</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard title="Total Revenue" value={METRICS.totalRevenue} change={METRICS.revenueChange} icon={DollarSign} prefix="MWK " />
        <MetricCard title="Tickets Sold" value={METRICS.totalTickets} change={METRICS.ticketsChange} icon={Ticket} />
        <MetricCard title="Total Events" value={METRICS.totalEvents} change={METRICS.eventsChange} icon={Calendar} />
        <MetricCard title="Total Attendees" value={METRICS.totalAttendees} change={METRICS.attendeesChange} icon={Users} />
        <MetricCard title="Avg. Ticket Price" value={METRICS.avgTicketPrice} change={METRICS.avgTicketChange} icon={Ticket} prefix="MWK " />
        <MetricCard title="Conversion Rate" value={`${METRICS.conversionRate}%`} change={METRICS.conversionChange} icon={TrendingUp} />
      </div>

      {/* Chart Tabs */}
      <div className="flex gap-2 border-b border-[var(--border-color)]">
        {[
          { id: 'revenue', label: 'Revenue & Tickets', icon: BarChart3 },
          { id: 'target', label: 'Revenue vs Target', icon: Activity },
          { id: 'categories', label: 'Categories', icon: PieChart },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedMetric(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                selectedMetric === tab.id
                  ? 'border-b-2 border-[#84cc16] text-[#84cc16]'
                  : 'text-[var(--text-secondary)] hover:text-[#84cc16]'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Chart Area */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
        {selectedMetric === 'revenue' && (
          <>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Revenue & Ticket Trends</h3>
            <div className="h-96">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA}>
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
                    <XAxis dataKey="month" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
                    <YAxis yAxisId="left" tickFormatter={(v) => `K${(v / 1000).toFixed(0)}k`} tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#84cc16" strokeWidth={2} fill="url(#revenueGradient)" />
                    <Area yAxisId="right" type="monotone" dataKey="tickets" name="Tickets Sold" stroke="#3b82f6" strokeWidth={2} fill="url(#ticketsGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}

        {selectedMetric === 'target' && (
          <>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Revenue vs Target</h3>
            <div className="h-96">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MONTHLY_TRENDS}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="month" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `K${(v / 1000).toFixed(0)}k`} tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="revenue" name="Actual Revenue" fill="#84cc16" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" name="Target" fill={theme === 'dark' ? '#4b5563' : '#9ca3af'} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}

        {selectedMetric === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Events by Category</h3>
              <div className="h-80">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={EVENT_CATEGORY_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {EVENT_CATEGORY_DATA.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Audience by Role</h3>
              <div className="space-y-4">
                {ROLE_BREAKDOWN.map((role) => (
                  <div key={role.role}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[var(--text-primary)]">{role.role}</span>
                      <span className="text-[var(--text-secondary)]">{role.percentage}%</span>
                    </div>
                    <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${role.percentage}%`, backgroundColor: role.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Events Table */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border-color)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Top Performing Events</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-primary)]/50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Event Name</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Revenue</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Tickets Sold</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Conversion</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {TOP_EVENTS.map((event) => (
                <tr key={event.id} className="hover:bg-[var(--hover-bg)] transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-[var(--text-primary)]">{event.name}</td>
                  <td className="px-5 py-3 text-sm text-right font-semibold text-[#84cc16]">{formatCurrency(event.revenue)}</td>
                  <td className="px-5 py-3 text-sm text-right text-[var(--text-primary)]">{event.tickets.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm text-right">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#84cc16]/10 text-[#84cc16]">
                      {event.conversion}%
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="text-sm text-[#84cc16] hover:underline">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Key Insights</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#84cc16] mt-2" />
              <p className="text-sm text-[var(--text-secondary)]">Revenue increased by <span className="text-[#84cc16] font-semibold">18.5%</span> compared to previous period</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#84cc16] mt-2" />
              <p className="text-sm text-[var(--text-secondary)]">Ticket sales up by <span className="text-[#84cc16] font-semibold">12.3%</span> with 2,565 total tickets sold</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#84cc16] mt-2" />
              <p className="text-sm text-[var(--text-secondary)]">Merchants represent <span className="text-[#84cc16] font-semibold">42%</span> of your audience</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#84cc16] mt-2" />
              <p className="text-sm text-[var(--text-secondary)]">Conferences are your <span className="text-[#84cc16] font-semibold">most popular</span> event category</p>
            </li>
          </ul>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Recommendations</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#84cc16] mt-2" />
              <p className="text-sm text-[var(--text-secondary)]">Consider adding more <span className="text-[#84cc16] font-semibold">conference events</span> to boost revenue</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#84cc16] mt-2" />
              <p className="text-sm text-[var(--text-secondary)]">Target <span className="text-[#84cc16] font-semibold">merchant audience</span> with specialized events</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#84cc16] mt-2" />
              <p className="text-sm text-[var(--text-secondary)]">Early bird tickets could improve <span className="text-[#84cc16] font-semibold">conversion rates</span></p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#84cc16] mt-2" />
              <p className="text-sm text-[var(--text-secondary)]">Promote events to <span className="text-[#84cc16] font-semibold">employees</span> segment for better engagement</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}