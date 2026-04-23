'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Calendar, ChevronDown, ChevronUp, 
  AlertTriangle, MapPin, DollarSign, User, MoreVertical,
  CheckSquare, Square, ArrowRight, Info
} from 'lucide-react';
import Link from 'next/link';
import { MOCK_REQUESTS } from '@/mock/mockData';
import { cn } from '@/lib/utils';

// Format currency to Malawian Kwacha (MWK)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-MW', {
    style: 'currency',
    currency: 'MWK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function PendingApprovals() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterUrgency, setFilterUrgency] = useState<string[]>([]);

  const toggleUrgencyFilter = (urgency: string) => {
    setFilterUrgency(prev => 
      prev.includes(urgency) ? prev.filter(u => u !== urgency) : [...prev, urgency]
    );
  };

  const filteredRequests = MOCK_REQUESTS.filter(req => {
    const matchesSearch = req.requester.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         req.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || req.type === filterType;
    const matchesUrgency = filterUrgency.length === 0 || filterUrgency.includes(req.urgency);
    return matchesSearch && matchesType && matchesUrgency;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredRequests.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRequests.map(r => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="text-gray-500 mt-1">Manage and review incoming requests from all departments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Export CSV
          </button>
          <button 
            className="inline-flex items-center gap-2 bg-[#84cc16] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#75b314] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedIds.length === 0}
          >
            Bulk Approve ({selectedIds.length})
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Search Request</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#84cc16] focus:border-transparent" 
                    placeholder="ID or Requester..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Request Type</label>
                <select 
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#84cc16] focus:border-transparent"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Travel">Travel</option>
                  <option value="Event">Event</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Urgency</label>
                <div className="space-y-2">
                  {['High', 'Medium', 'Low'].map(u => (
                    <label key={u} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={filterUrgency.includes(u)}
                        onChange={() => toggleUrgencyFilter(u)}
                        className="rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]" 
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">{u}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-4 bg-[#3b5a65] text-white border-none">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-[#84cc16]" />
              <h4 className="text-sm font-bold">Pro Tip</h4>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Use bulk selection to approve multiple low-risk requests at once to save time.
            </p>
          </div>
        </aside>

        {/* Main Queue */}
        <div className="flex-grow space-y-4">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg">
            <div className="flex items-center gap-3">
              <button onClick={toggleSelectAll} className="text-[#3b5a65]">
                {selectedIds.length === filteredRequests.length ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
              </button>
              <span className="text-sm font-medium text-gray-600">Select All</span>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Showing {filteredRequests.length} Requests
            </span>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No requests found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div key={req.id} className={cn(
                "rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 border-l-4",
                req.urgency === 'High' ? "border-red-500" : req.urgency === 'Medium' ? "border-orange-500" : "border-blue-500"
              )}>
                <div className="p-4 flex items-center gap-4">
                  <button onClick={() => toggleSelect(req.id)} className="text-gray-400 hover:text-[#3b5a65]">
                    {selectedIds.includes(req.id) ? <CheckSquare className="w-5 h-5 text-[#84cc16]" /> : <Square className="w-5 h-5" />}
                  </button>
                  
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{req.requester}</h4>
                        <p className="text-xs text-gray-500">{req.id} • {req.team}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-400 uppercase">Type</span>
                      <span className="text-sm font-medium text-gray-900">{req.type}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-400 uppercase">Amount</span>
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(req.amount)}</span>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      {req.hasEventAttendance && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                          <Calendar className="w-3 h-3" />
                          Event
                        </span>
                      )}
                      <button 
                        onClick={() => toggleExpand(req.id)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        {expandedId === req.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === req.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-100 bg-gray-50 p-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">Description</h5>
                            <p className="text-sm text-gray-700 leading-relaxed">{req.description}</p>
                          </div>
                          <div className="flex gap-6">
                            <div>
                              <h5 className="text-xs font-bold text-gray-400 uppercase mb-1">Region</h5>
                              <div className="flex items-center gap-1 text-sm text-gray-700">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {req.region}
                              </div>
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-gray-400 uppercase mb-1">Deadline</h5>
                              <div className={cn(
                                "flex items-center gap-1 text-sm font-medium",
                                req.urgency === 'High' ? "text-red-600" : "text-gray-700"
                              )}>
                                <AlertTriangle className={cn("w-4 h-4", req.urgency === 'High' ? "text-red-500" : "text-gray-400")} />
                                {new Date(req.deadline).toLocaleDateString()}
                                {req.urgency === 'High' && <span className="ml-1 text-[10px] uppercase font-bold">(Urgent)</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-between items-end">
                          <div className="text-right">
                            <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">Urgency Level</h5>
                            <span className={cn(
                              "px-3 py-1 rounded-full text-xs font-bold border",
                              getUrgencyColor(req.urgency)
                            )}>
                              {req.urgency}
                            </span>
                          </div>
                          <div className="flex gap-3 mt-6">
                            <Link href={`/approver/requests/${req.id}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                              View Details
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                            <button className="bg-[#84cc16] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#75b314] transition-colors">Approve Now</button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}