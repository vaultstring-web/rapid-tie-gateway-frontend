'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Users, 
  Eye, 
  Ticket, 
  TrendingUp, 
  MoreVertical,
  Calendar,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Globe
} from 'lucide-react';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

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

export default function OrganizerDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase mb-2">Organizer Dashboard</h1>
          <p className="text-[var(--text-secondary)] text-sm font-medium">Manage your events and track performance in real-time.</p>
        </div>
        <button 
          onClick={() => router.push('/organizer/events/create')}
          className="bg-[#84cc16] text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-lg shadow-lime-500/30 hover:brightness-110 hover:scale-[1.02] transition-all"
        >
          <Plus size={18} strokeWidth={3} />
          Create New Event
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_METRICS.map((kpi) => (
          <div key={kpi.label} className="bg-[var(--bg-secondary)]/40 border border-[var(--border-color)] p-6 rounded-[20px] flex items-start justify-between group hover:border-[#84cc16]/50 transition-all">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2">{kpi.label}</p>
              <h3 className="text-2xl font-black">{kpi.value}</h3>
              <div className={`flex items-center gap-1 text-[10px] font-black mt-3 ${kpi.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {kpi.change > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(kpi.change)}%
                <span className="text-[var(--text-secondary)] opacity-60 ml-1">vs last month</span>
              </div>
            </div>
            <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color} shadow-sm group-hover:scale-110 transition-transform`}>
              <kpi.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-[var(--bg-secondary)]/40 border border-[var(--border-color)] p-6 rounded-[20px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest">Sales & Traffic Overview</h3>
            <select className="text-[10px] font-black uppercase tracking-widest bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg px-3 py-1.5 outline-none cursor-pointer hover:border-[#84cc16]">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--text-secondary)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--text-secondary)' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                    cursor={{ fill: 'var(--bg-primary)', opacity: 0.4 }}
                  />
                  <Bar dataKey="sales" fill="#84cc16" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Events Near You Map Placeholder */}
        <div className="bg-[var(--bg-secondary)]/40 border border-[var(--border-color)] p-6 rounded-[20px] flex flex-col">
          <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
            <Globe size={16} className="text-[#84cc16]" /> Events Near You
          </h3>
          <div className="flex-1 bg-[var(--bg-primary)] border-2 border-dashed border-[var(--border-color)] rounded-xl flex items-center justify-center text-center p-6 relative overflow-hidden group">
             <div className="relative z-10">
                <MapPin size={32} className="mx-auto text-[var(--text-secondary)] mb-3 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Map View: Malawi</p>
             </div>
             <div className="absolute inset-0 bg-[#84cc16]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <button className="w-full mt-6 py-3 border border-[var(--border-color)] rounded-xl text-[10px] font-black uppercase tracking-widest text-[#84cc16] hover:bg-[#84cc16] hover:text-white transition-all">
            Expand Location Insights
          </button>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black uppercase tracking-tight">Your Upcoming Events</h3>
          <Link href="/organizer/events" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#84cc16] hover:underline">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {MOCK_EVENTS.map((event) => (
            <div key={event.id} className="bg-[var(--bg-secondary)]/40 border border-[var(--border-color)] rounded-[20px] overflow-hidden group flex flex-col hover:border-[#84cc16] transition-all">
              <div className="relative h-44">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:bg-[#84cc16] transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                    event.status === 'published' ? 'bg-[#84cc16] text-white' : 'bg-gray-500 text-white'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h4 className="font-black text-base mb-3 group-hover:text-[#84cc16] transition-colors line-clamp-1 uppercase tracking-tight">
                  {event.title}
                </h4>
                <div className="space-y-2 mb-6 text-[11px] font-bold text-[var(--text-secondary)] uppercase">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#84cc16]" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#84cc16]" />
                    {event.location}
                  </div>
                </div>
                
                <div className="mt-auto flex items-center justify-between pt-5 border-t border-[var(--border-color)]">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-lg border-2 border-[var(--bg-secondary)] bg-[var(--bg-primary)] overflow-hidden">
                        <img src={`https://picsum.photos/seed/${event.id}${i}/32/32`} alt="user" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-lg border-2 border-[var(--bg-secondary)] bg-[var(--bg-primary)] flex items-center justify-center text-[9px] font-black text-[var(--text-secondary)]">
                      +12
                    </div>
                  </div>
                  <Link 
                    href={`/organizer/events/${event.id}`}
                    className="text-[10px] font-black uppercase tracking-widest text-[#84cc16] hover:brightness-125"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAB - Forced Green */}
      <button 
        onClick={() => router.push('/organizer/events/create')}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#84cc16] text-white rounded-2xl shadow-[0_10px_30px_rgba(132,204,22,0.4)] flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all"
      >
        <Plus size={32} strokeWidth={3} />
      </button>

    </div>
  );
}