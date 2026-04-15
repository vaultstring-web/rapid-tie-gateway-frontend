'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Clock, AlertCircle, CheckCircle, XCircle, MapPin, Users, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { MOCK_REQUESTS, MOCK_DECISIONS, MOCK_TEAM_SUMMARY } from '@/mock/mockData';
import { cn } from '@/lib/utils';

const CHART_DATA = [
  { name: 'Approved', value: 75, color: '#84cc16' },
  { name: 'Rejected', value: 15, color: '#ef4444' },
  { name: 'Pending', value: 10, color: '#f59e0b' },
];

export default function ApproverDashboard() {
  const pendingRequests = MOCK_REQUESTS.filter(r => r.status === 'Pending');
  const highUrgencyCount = pendingRequests.filter(r => r.urgency === 'High').length;
  const mediumUrgencyCount = pendingRequests.filter(r => r.urgency === 'Medium').length;
  const lowUrgencyCount = pendingRequests.filter(r => r.urgency === 'Low').length;

  return (
    <div className="space-y-8 animate-slide-up">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, Leticia. You have {pendingRequests.length} pending requests to review.</p>
      </header>

      {/* Urgency Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* High Urgency - Red */}
        <motion.div 
          whileHover={{ y: -5 }} 
          className="rounded-xl bg-white shadow-sm border border-gray-100 p-6"
          style={{ borderLeftWidth: '4px', borderLeftColor: '#ef4444' }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">High Urgency</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{highUrgencyCount}</h3>
            </div>
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#fee2e2' }}>
              <AlertCircle className="w-6 h-6" style={{ color: '#ef4444' }} />
            </div>
          </div>
          <p className="text-xs mt-4 font-medium flex items-center" style={{ color: '#dc2626' }}>
            Requires immediate attention
          </p>
        </motion.div>

        {/* Medium Urgency - Orange */}
        <motion.div 
          whileHover={{ y: -5 }} 
          className="rounded-xl bg-white shadow-sm border border-gray-100 p-6"
          style={{ borderLeftWidth: '4px', borderLeftColor: '#f97316' }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Medium Urgency</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{mediumUrgencyCount}</h3>
            </div>
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#ffedd5' }}>
              <Clock className="w-6 h-6" style={{ color: '#f97316' }} />
            </div>
          </div>
          <p className="text-xs mt-4 font-medium flex items-center" style={{ color: '#ea580c' }}>
            Due within 48 hours
          </p>
        </motion.div>

        {/* Low Urgency - Blue */}
        <motion.div 
          whileHover={{ y: -5 }} 
          className="rounded-xl bg-white shadow-sm border border-gray-100 p-6"
          style={{ borderLeftWidth: '4px', borderLeftColor: '#3b82f6' }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Low Urgency</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{lowUrgencyCount}</h3>
            </div>
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#dbeafe' }}>
              <Clock className="w-6 h-6" style={{ color: '#3b82f6' }} />
            </div>
          </div>
          <p className="text-xs mt-4 font-medium flex items-center" style={{ color: '#2563eb' }}>
            Standard processing time
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map View */}
        <div className="lg:col-span-2 rounded-xl bg-white shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#84cc16]" />
              Events in Request Regions
            </h3>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Live View</span>
          </div>
          <div className="relative aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 800 400" className="absolute inset-0 w-full h-full opacity-20">
              <path d="M150,100 Q200,50 300,100 T500,150 T700,100" fill="none" stroke="#84cc16" strokeWidth="2" />
              <circle cx="200" cy="150" r="40" fill="#84cc16" opacity="0.1" />
              <circle cx="500" cy="250" r="60" fill="#84cc16" opacity="0.1" />
            </svg>
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 w-full">
              {['North America', 'Europe', 'Asia Pacific', 'Global'].map((region) => (
                <div key={region} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase">{region}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {MOCK_REQUESTS.filter(r => r.region === region).length}
                  </p>
                  <div className="w-full bg-gray-100 h-1 rounded-full mt-2">
                    <div 
                      className="bg-[#84cc16] h-1 rounded-full" 
                      style={{ width: `${(MOCK_REQUESTS.filter(r => r.region === region).length / MOCK_REQUESTS.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Approval Rate</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CHART_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CHART_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {CHART_DATA.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Summary Table */}
        <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 pb-0">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#84cc16]" />
              Team Summary
            </h3>
          </div>
          <div className="overflow-x-auto p-6 pt-4">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Team</th>
                  <th className="pb-3 text-xs font-semibold text-gray-400 uppercase text-center">Pending</th>
                  <th className="pb-3 text-xs font-semibold text-gray-400 uppercase text-center">Approved</th>
                  <th className="pb-3 text-xs font-semibold text-gray-400 uppercase text-right">Avg. Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_TEAM_SUMMARY.map((team) => (
                  <tr key={team.name} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-medium text-gray-900">{team.name}</td>
                    <td className="py-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#ffedd5', color: '#ea580c' }}>{team.pending}</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>{team.approved}</span>
                    </td>
                    <td className="py-4 text-right text-gray-500 text-sm">{team.avgTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Decisions Feed */}
        <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Decisions</h3>
            <Link href="/approver/pending" className="text-sm font-medium text-[#84cc16] hover:underline">View All</Link>
          </div>
          <div className="space-y-6">
            {MOCK_DECISIONS.map((decision) => (
              <div key={decision.id} className="flex gap-4">
                <div className={cn(
                  "mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  decision.action === 'Approved' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                )}>
                  {decision.action === 'Approved' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-gray-900">
                      {decision.action} Request {decision.requestId}
                    </h4>
                    <span className="text-xs text-gray-400">{new Date(decision.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 italic">"{decision.reason}"</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-2 h-2 text-gray-500" />
                    </div>
                    <span className="text-[10px] font-medium text-gray-400">Approver: {decision.approver}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/approver/pending" className="w-full mt-8 inline-flex items-center justify-center gap-2 bg-[#84cc16] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#75b314] transition-colors">
            Go to Approval Queue
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}