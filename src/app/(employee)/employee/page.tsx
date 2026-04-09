"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Plus, 
  Wallet,
  Eye
} from 'lucide-react';

const formatMWK = (amt: number) => `MWK ${amt.toLocaleString()}`;

const KPICard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {trend && <p className="text-xs font-medium text-lime-600 mt-2 flex items-center gap-1"><TrendingUp size={12} /> {trend}</p>}
    </div>
    <div className={`p-3 rounded-xl ${color} text-white shadow-sm`}><Icon size={24} /></div>
  </div>
);

export default function EmployeeDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, total: 0 });

  useEffect(() => {
    const savedRequests = localStorage.getItem('dsa_requests');
    if (savedRequests) {
      const allRequests = JSON.parse(savedRequests);
      setRequests(allRequests);
      setStats({
        pending: allRequests.filter((r: any) => r.status === 'Pending').length,
        approved: allRequests.filter((r: any) => r.status === 'Approved').length,
        total: allRequests.reduce((sum: number, r: any) => sum + r.amount, 0)
      });
    }
  }, []);

  const pendingRequests = requests.filter(r => r.status === 'Pending');

  const upcomingTrips = [
    { destination: 'Blantyre', date: 'Apr 12, 2024', purpose: 'MOH Stakeholder Meeting' },
    { destination: 'Mangochi', date: 'Apr 15, 2024', purpose: 'Field Monitoring' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Moni, Leticia</h1>
          <p className="text-slate-500 mt-1">Track your DSA requests and upcoming travel.</p>
        </div>
        <Link href="/employee/dsa/request" className="bg-lime-500 hover:bg-lime-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-lime-500/20 transition-all">
          <Plus size={20} />
          <span>New Request</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total DSA Paid" value={formatMWK(stats.total || 450000)} icon={Wallet} color="bg-lime-500" trend="+8% from last month" />
        <KPICard title="Pending" value={stats.pending.toString()} icon={Clock} color="bg-amber-500" />
        <KPICard title="Approved (MTD)" value={stats.approved.toString() || "5"} icon={CheckCircle2} color="bg-emerald-500" />
        <KPICard title="Days in Field" value="14" icon={Calendar} color="bg-sky-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Requests Section */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Pending Requests</h2>
            <Link href="/employee/dsa/requests" className="text-sm font-semibold text-lime-600 flex items-center gap-1">View all →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {pendingRequests.length > 0 ? (
              pendingRequests.slice(0, 3).map((req) => (
                <Link key={req.id} href={`/employee/dsa/requests/${req.id}`} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-lime-600 transition-colors">{req.purpose}</h4>
                      <p className="text-sm text-slate-500 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1"><MapPin size={14} /> {req.destination}</span>
                        <span className="flex items-center gap-1"><Calendar size={14} /> {req.startDate}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">{formatMWK(req.amount)}</p>
                    <span className="text-[10px] font-bold uppercase px-2 py-1 bg-amber-50 text-amber-600 rounded-md mt-1 inline-block">Pending</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>No pending requests</p>
                <Link href="/employee/dsa/request" className="text-lime-600 text-sm mt-2 inline-block">Create your first request →</Link>
              </div>
            )}
          </div>
        </section>

        {/* Upcoming Travel */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <h2 className="text-lg font-bold text-slate-800">Upcoming Travel</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {upcomingTrips.map((trip, idx) => (
              <div key={idx} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-lime-50 rounded-xl flex items-center justify-center text-lime-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{trip.destination}</h4>
                    <p className="text-sm text-slate-500">{trip.purpose}</p>
                    <p className="text-xs text-slate-400 mt-1">{trip.date}</p>
                  </div>
                </div>
                <Link href="/employee/dsa/request" className="text-sm text-lime-600 hover:underline">Plan Trip →</Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
