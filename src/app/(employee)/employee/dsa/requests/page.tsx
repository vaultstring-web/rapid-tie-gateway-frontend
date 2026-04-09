"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Eye, Calendar, MapPin, Clock, AlertCircle, ArrowLeft, CreditCard } from 'lucide-react';

interface DSARequest {
  id: string;
  purpose: string;
  destination: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: string;
  createdAt: string;
  notes?: string;
}

interface Payment {
  id: string;
  reference: string;
  amount: number;
  date: string;
  status: string;
}

const formatMWK = (amt: number) => `MWK ${amt.toLocaleString()}`;

export default function MyRequests() {
  const [requests, setRequests] = useState<DSARequest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load requests from localStorage
    const savedRequests = localStorage.getItem('dsa_requests');
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    }
    
    // Mock payments data
    setPayments([
      { id: 'p1', reference: 'DSA-LLW-001', amount: 45000, date: 'Mar 28, 2024', status: 'Paid' },
      { id: 'p2', reference: 'DSA-BT-092', amount: 95000, date: 'Mar 20, 2024', status: 'Paid' },
      { id: 'p3', reference: 'DSA-MZU-045', amount: 120000, date: 'Mar 15, 2024', status: 'Paid' },
    ]);
    
    setLoading(false);
  }, []);

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.purpose.toLowerCase().includes(search.toLowerCase()) ||
                         req.destination.toLowerCase().includes(search.toLowerCase()) ||
                         req.id.includes(search);
    const matchesStatus = statusFilter === 'all' || req.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusStyles = (status: string) => {
    switch(status.toLowerCase()) {
      case 'approved': return { bg: 'bg-emerald-50', text: 'text-emerald-600' };
      case 'pending': return { bg: 'bg-amber-50', text: 'text-amber-600' };
      case 'rejected': return { bg: 'bg-red-50', text: 'text-red-600' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-600' };
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/employee" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My DSA Requests</h1>
          <p className="text-slate-500 text-sm">View and manage all your travel allowance requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Requests List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by purpose, destination or ID..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="relative">
                <select
                  className="pl-4 pr-10 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 appearance-none bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => {
                const statusStyles = getStatusStyles(req.status);
                return (
                  <Link
                    key={req.id}
                    href={`/employee/dsa/requests/${req.id}`}
                    className="block bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-all hover:border-lime-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">Request #{req.id.slice(-6)}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${statusStyles.bg} ${statusStyles.text}`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-slate-700 font-medium mb-2">{req.purpose}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><MapPin size={14} />{req.destination}</span>
                          <span className="flex items-center gap-1"><Calendar size={14} />{req.startDate} - {req.endDate}</span>
                          <span className="flex items-center gap-1"><Clock size={14} />{req.startDate}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-slate-900">{formatMWK(req.amount)}</p>
                        <p className="text-xs text-slate-400 mt-1">Submitted: {new Date(req.createdAt).toLocaleDateString()}</p>
                        <Eye size={16} className="text-slate-400 hover:text-lime-600 mt-2 ml-auto" />
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                <p className="text-slate-500">No requests found</p>
                <Link href="/employee/dsa/request" className="text-lime-600 text-sm mt-2 inline-block">Create your first request →</Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Recent Payments */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={20} className="text-emerald-500" />
              <h2 className="text-lg font-bold text-slate-800">Recent Payments</h2>
            </div>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-800">{payment.reference}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{payment.date}</span>
                    <span className="text-sm font-bold text-emerald-600">{formatMWK(payment.amount)}</span>
                  </div>
                  <span className="inline-block mt-2 text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
            <Link 
              href="/employee/dsa/payments" 
              className="block text-center mt-4 text-sm text-lime-600 hover:text-lime-700 font-medium"
            >
              View All Payments →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
