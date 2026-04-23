'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Users,
  Eye,
  Ticket,
  TrendingUp,
  Calendar,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  MoreVertical,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock Data
const MOCK_METRICS = [
  { label: 'Total Sales', value: 'MK 1,245,000', change: 12.5, icon: Ticket, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Active Events', value: '12', change: 2, icon: Calendar, color: 'text-lime-500', bg: 'bg-lime-500/10' },
  { label: 'Total Views', value: '45.2k', change: -3.1, icon: Eye, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'Avg. Interest', value: '84%', change: 5.4, icon: Users, color: 'text-orange-400', bg: 'bg-orange-400/10' },
];

const CHART_DATA = [
  { name: 'Mon', sales: 4000, views: 2400 },
  { name: 'Tue', sales: 3000, views: 1398 },
  { name: 'Wed', sales: 2000, views: 9800 },
  { name: 'Thu', sales: 2780, views: 3908 },
  { name: 'Fri', sales: 1890, views: 4800 },
  { name: 'Sat', sales: 2390, views: 3800 },
  { name: 'Sun', sales: 3490, views: 4300 },
];

const MOCK_EVENTS = [
  { id: '1', title: 'Malawi Fintech Expo', date: 'Dec 12, 2025', location: 'BICC, Lilongwe', status: 'published', image: 'https://picsum.photos/seed/1/800/400' },
  { id: '2', title: 'Tech Innovation Summit', date: 'Jan 05, 2026', location: 'Sunbird Mount Soche', status: 'published', image: 'https://picsum.photos/seed/2/800/400' },
  { id: '3', title: 'Developer Workshop', date: 'Feb 20, 2026', location: 'Virtual', status: 'draft', image: 'https://picsum.photos/seed/3/800/400' },
];

export default function OrganizerDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Organizer Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage your events and track performance in real-time.
          </p>
        </div>
        <button
          onClick={() => router.push('/organizer/events/create')}
          className="bg-[#84cc16] text-white px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg hover:brightness-110 transition-all"
        >
          <Plus size={18} />
          Create Event
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_METRICS.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-5 rounded-xl transition-all hover:border-[#84cc16]/50"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  {kpi.label}
                </p>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">{kpi.value}</h3>
                <div className={`flex items-center gap-1 text-xs mt-2 ${kpi.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {kpi.change > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(kpi.change)}%
                  <span className="text-[var(--text-secondary)] ml-1">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] p-5 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Sales & Traffic Overview</h3>
            <select className="text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg px-3 py-1.5">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                    }}
                  />
                  <Bar dataKey="sales" fill="#84cc16" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-5 rounded-xl">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Globe size={16} className="text-[#84cc16]" />
            Events Near You
          </h3>
          <div className="bg-[var(--bg-primary)] border-2 border-dashed border-[var(--border-color)] rounded-xl flex items-center justify-center h-48">
            <div className="text-center">
              <MapPin size={32} className="mx-auto text-[var(--text-secondary)] mb-2 opacity-50" />
              <p className="text-xs text-[var(--text-secondary)]">Map View: Malawi</p>
            </div>
          </div>
          <button className="w-full mt-4 py-2 border border-[var(--border-color)] rounded-lg text-xs font-medium text-[#84cc16] hover:bg-[#84cc16] hover:text-white transition-all">
            Expand Location Insights
          </button>
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Your Upcoming Events</h2>
          <Link href="/organizer/events" className="text-xs text-[#84cc16] hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_EVENTS.map((event) => (
            <div
              key={event.id}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden hover:border-[#84cc16] transition-all"
            >
              <div className="relative h-40">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <button className="p-1.5 bg-black/50 rounded-lg text-white">
                    <MoreVertical size={14} />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                    event.status === 'published' ? 'bg-[#84cc16] text-white' : 'bg-gray-500 text-white'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{event.title}</h3>
                <div className="space-y-1 text-xs text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-[#84cc16]" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={12} className="text-[#84cc16]" />
                    {event.location}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-[var(--bg-primary)] border-2 border-[var(--bg-secondary)] overflow-hidden">
                        <img src={`https://picsum.photos/seed/${event.id}${i}/28/28`} alt="" />
                      </div>
                    ))}
                    <div className="w-7 h-7 rounded-full bg-[var(--bg-primary)] border-2 border-[var(--bg-secondary)] flex items-center justify-center text-[10px] font-medium text-[var(--text-secondary)]">
                      +12
                    </div>
                  </div>
                  <Link href={`/organizer/events/${event.id}`} className="text-xs font-medium text-[#84cc16] hover:underline">
                    Manage
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAB for mobile */}
      <button
        onClick={() => router.push('/organizer/events/create')}
        className="fixed bottom-6 right-6 md:hidden w-14 h-14 rounded-full bg-[#84cc16] text-white shadow-lg flex items-center justify-center z-50"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}