"use client";

import React, { useState } from 'react';
import { 
  RotateCcw, 
  Search, 
  Clock, 
  AlertCircle,
  MoreHorizontal,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
// Note: Replace these imports with your actual constants/utils paths
// import { MOCK_REFUNDS } from '@/constants'; 
// import { cn } from '@/lib/utils';

/* --- Mock Data (Integrated for immediate use) --- */
const MOCK_REFUNDS = [
  { id: 'RF-901', transactionId: 'TX-4829', amount: 4500, reason: 'Duplicate Charge', status: 'pending', date: '2024-03-30' },
  { id: 'RF-899', transactionId: 'TX-2210', amount: 12000, reason: 'Customer Request', status: 'completed', date: '2024-03-28' },
  { id: 'RF-898', transactionId: 'TX-1102', amount: 3500, reason: 'Fraudulent', status: 'rejected', date: '2024-03-25' },
];

export default function RefundsPage() {
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Refunds</h1>
        <p className="text-gray-500 text-sm">Manage customer returns and transaction reversals.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content: Pending and History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pending Queue */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="text-orange-500" size={20} />
              Pending Refunds
            </h3>
            <div className="space-y-4">
              {MOCK_REFUNDS.filter(r => r.status === 'pending').map((refund) => (
                <div key={refund.id} className="p-4 border border-orange-100 bg-orange-50/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-orange-500 shadow-sm">
                      <RotateCcw size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Refund for {refund.transactionId}</p>
                      <p className="text-xs text-gray-500">{refund.reason} • {refund.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <span className="font-bold text-gray-900">K{refund.amount.toLocaleString()}</span>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors">Reject</button>
                      <button className="px-4 py-2 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-black transition-all">Approve</button>
                    </div>
                  </div>
                </div>
              ))}
              {MOCK_REFUNDS.filter(r => r.status === 'pending').length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8 italic">No pending refunds at the moment.</p>
              )}
            </div>
          </div>

          {/* History Table */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h3 className="font-bold text-gray-900">Refund History</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search history..." 
                  className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs w-full md:w-64 focus:ring-2 focus:ring-[#84cc16] transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-gray-400 uppercase tracking-widest font-bold border-b border-gray-50">
                    <th className="pb-4 px-2">Refund ID</th>
                    <th className="pb-4">Transaction</th>
                    <th className="pb-4">Amount</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_REFUNDS.filter(r => r.status !== 'pending').map((refund) => (
                    <tr key={refund.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 px-2 text-xs font-mono text-gray-400">{refund.id}</td>
                      <td className="py-4 text-sm font-bold text-gray-900">{refund.transactionId}</td>
                      <td className="py-4 text-sm font-bold text-gray-900">K{refund.amount.toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                          refund.status === 'completed' 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {refund.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-500">{refund.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar: Form & Policy */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">Quick Refund</h3>
            <form className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Transaction ID</label>
                <input type="text" className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#84cc16]" placeholder="tr_..." />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Refund Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">K</span>
                  <input 
                    type="number" 
                    className="w-full pl-8 p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#84cc16]" 
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 italic">Leave empty for full refund.</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Reason</label>
                <select 
                  className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#84cc16] appearance-none cursor-pointer"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">Select a reason</option>
                  <option value="customer_request">Customer Request</option>
                  <option value="duplicate">Duplicate Charge</option>
                  <option value="fraudulent">Fraudulent</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button type="button" className="w-full py-4 bg-[#84cc16] text-white font-bold rounded-2xl hover:bg-[#71af12] shadow-lg shadow-lime-100 transition-all active:scale-95 mt-4">
                Initiate Refund
              </button>
            </form>
          </div>

          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
            <div className="flex gap-3">
              <AlertCircle className="text-blue-500 shrink-0" size={20} />
              <div>
                <h4 className="text-sm font-bold text-blue-900">Refund Policy</h4>
                <p className="text-xs text-blue-700 mt-2 leading-relaxed">
                  Refunds typically take 5-10 business days to appear on the customer's statement. Processing fees are not returned.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}