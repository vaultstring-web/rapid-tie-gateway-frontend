"use client";

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Calendar as CalendarIcon,
  Info
} from 'lucide-react';
import Link from 'next/link';

// Inlined mock data to prevent import errors
const MOCK_EVENTS = [
  { id: '1', name: 'Tech Conference 2024' },
  { id: '2', name: 'Networking Brunch' },
  { id: '3', name: 'Product Launch' },
];

export default function CreatePaymentLink() {
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [event, setEvent] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerated(true);
  };

  const handleCopy = () => {
    setCopied(true);
    // Functional clipboard copy
    navigator.clipboard.writeText(`pay.merchant.mw/pl_new_${Math.random().toString(36).substr(2, 5)}`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        {/* Replaced react-router-dom Link with Next.js Link */}
        <Link href="/merchant/payment-links" className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-transparent hover:border-gray-200">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Payment Link</h1>
          <p className="text-gray-500">Set up a new link to start accepting payments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleGenerate} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Link Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#84cc16] font-medium" 
                placeholder="e.g. Early Bird Ticket"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <p className="text-xs text-gray-400 mt-1">This will be shown to your customers.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Amount <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">K</span>
                  <input 
                    type="number" 
                    className="w-full p-3 pl-8 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#84cc16] font-bold" 
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Currency</label>
                <select className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#84cc16] font-medium appearance-none">
                  <option>MWK - Malawian Kwacha</option>
                  <option>USD - US Dollar</option>
                  <option>ZAR - SA Rand</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Associate with Event</label>
              <select 
                className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#84cc16] font-medium appearance-none"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
              >
                <option value="">None</option>
                {MOCK_EVENTS.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea 
                className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#84cc16] font-medium min-h-[100px]" 
                placeholder="Add details about what this payment is for..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Expiry Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="date" className="w-full p-3 pl-10 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#84cc16]" />
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-[#84cc16] text-white rounded-2xl font-bold hover:bg-[#71af12] shadow-lg transition-all active:scale-95 uppercase tracking-widest text-xs">
              Generate Payment Link
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem]">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-tighter text-xs text-gray-400">
              <Info size={16} className="text-[#84cc16]" />
              Customer Preview
            </h3>
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <div className="w-10 h-10 bg-[#84cc16]/10 rounded-xl mb-4 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#84cc16]" />
              </div>
              <h4 className="font-bold text-gray-900">{title || 'Your Link Title'}</h4>
              <p className="text-2xl font-black text-gray-900 mt-2">K{Number(amount).toLocaleString() || '0.00'}</p>
              <div className="w-full bg-gray-900 h-10 rounded-xl mt-6 flex items-center justify-center text-white text-xs font-bold">Pay Now</div>
            </div>
          </div>

          {isGenerated && (
            <div className="p-6 bg-white border-2 border-[#84cc16] rounded-[2rem] animate-in zoom-in-95">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Check size={18} className="text-[#84cc16]" />
                Link Ready!
              </h3>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <code className="text-xs text-gray-600 truncate flex-1 font-mono">pay.mw/pl_new_123</code>
                <button 
                  onClick={handleCopy}
                  className="p-2 text-[#84cc16] hover:bg-lime-50 rounded-lg transition-colors shrink-0"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-widest leading-relaxed">Share this link with your customers to start collecting payments.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}