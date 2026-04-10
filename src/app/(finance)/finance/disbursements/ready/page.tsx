'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, ChevronDown, ChevronUp, Calendar, User, Layers, Search, Filter } from 'lucide-react';
import { MOCK_DISBURSEMENTS } from '@/lib/mockData';
import { Disbursement } from '@/types/index';
import { cn } from '@/lib/utils';

export default function ReadyDisbursements() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedEvents, setExpandedEvents] = useState<string[]>([]);

  const readyDisbursements = MOCK_DISBURSEMENTS.filter((d: Disbursement) => d.status === 'Ready');
  
  // Group by event - add explicit type
  const groupedDisbursements: Record<string, Disbursement[]> = readyDisbursements.reduce((acc: Record<string, Disbursement[]>, d: Disbursement) => {
    const key = d.event || 'General Expenses';
    if (!acc[key]) acc[key] = [];
    acc[key].push(d);
    return acc;
  }, {});

  const toggleSelect = (id: string) => {
    setSelectedIds((prev: string[]) => 
      prev.includes(id) ? prev.filter((i: string) => i !== id) : [...prev, id]
    );
  };

  const toggleEvent = (event: string) => {
    setExpandedEvents((prev: string[]) => 
      prev.includes(event) ? prev.filter((e: string) => e !== event) : [...prev, event]
    );
  };

  const selectedTotal = readyDisbursements
    .filter((d: Disbursement) => selectedIds.includes(d.id))
    .reduce((sum: number, d: Disbursement) => sum + d.amount, 0);

  // Format currency function
  const formatCurrency = (amount: number) => {
    return `MK ${amount.toLocaleString()}`;
  };

  // Convert groupedDisbursements to array for mapping
  const groupedEntries = Object.entries(groupedDisbursements);

  return (
    <div className="space-y-8 animate-slide-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ready for Payment</h1>
          <p className="text-gray-500 mt-1">Review and batch approved requests for disbursement.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selected Total</p>
            <p className="text-2xl font-bold text-[#84cc16]">{formatCurrency(selectedTotal)}</p>
          </div>
          <button 
            className="btn-primary gap-2 disabled:opacity-50"
            disabled={selectedIds.length === 0}
          >
            <Layers className="w-5 h-5" />
            Create Batch ({selectedIds.length})
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="card p-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Recipient Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" className="input pl-10 text-sm" placeholder="Search..." />
                </div>
              </div>
              <div>
                <label className="label">Validation Status</label>
                <div className="space-y-2">
                  {['Valid', 'Invalid', 'Pending'].map((s: string) => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]" defaultChecked={s === 'Valid'} />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main List */}
        <div className="lg:col-span-3 space-y-4">
          {groupedEntries.map(([event, items]) => {
            const eventTotal = items.reduce((sum: number, i: Disbursement) => sum + i.amount, 0);
            return (
              <div key={event} className="card p-0 overflow-hidden">
                <button 
                  onClick={() => toggleEvent(event)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Calendar className="w-5 h-5 text-[#3b5a65]" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-bold text-gray-900">{event}</h3>
                      <p className="text-xs text-gray-500">{items.length} Pending Disbursements</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(eventTotal)}
                    </span>
                    {expandedEvents.includes(event) ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedEvents.includes(event) && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="divide-y divide-gray-100">
                        {items.map((item: Disbursement) => (
                          <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                            <input 
                              type="checkbox" 
                              className="w-5 h-5 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16] cursor-pointer"
                              checked={selectedIds.includes(item.id)}
                              onChange={() => toggleSelect(item.id)}
                            />
                            <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                  <User className="w-4 h-4 text-gray-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-900">{item.recipient}</p>
                                  <p className="text-[10px] text-gray-400">{item.id}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Type</p>
                                <p className="text-xs font-medium text-gray-700">{item.type}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Amount</p>
                                <p className="text-sm font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                              </div>
                              <div className="flex justify-end">
                                <div className={cn(
                                  "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                                  item.validationStatus === 'Valid' ? "bg-green-50 text-green-600" :
                                  item.validationStatus === 'Invalid' ? "bg-red-50 text-red-600" :
                                  "bg-amber-50 text-amber-600"
                                )}>
                                  {item.validationStatus === 'Valid' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                  {item.validationStatus}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}