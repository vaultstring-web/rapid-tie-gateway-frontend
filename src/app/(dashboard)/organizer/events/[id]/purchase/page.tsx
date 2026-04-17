'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Minus, 
  Plus, 
  Info, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data to replace the imports from constants
const MOCK_TIERS = [
  { id: 't1', eventId: '1', name: 'Developer Pass', price: 25000, capacity: 100, soldCount: 85 },
  { id: 't2', eventId: '1', name: 'SME / Startup', price: 45000, capacity: 50, soldCount: 42 },
  { id: 't3', eventId: '1', name: 'Corporate', price: 120000, capacity: 30, soldCount: 10 },
];

export default function TicketPurchase() {
  const { id } = useParams();
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // In a real app, you would fetch these based on the ID
  const tiers = MOCK_TIERS.filter(t => t.eventId === id);

  const updateQuantity = (tierId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [tierId]: Math.max(0, (prev[tierId] || 0) + delta)
    }));
  };

  const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalPrice = tiers.reduce((acc, tier) => acc + (quantities[tier.id] || 0) * tier.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] w-fit transition-colors font-bold text-sm uppercase tracking-widest"
        >
          <ChevronLeft size={18} strokeWidth={3} />
          Back to Event
        </button>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">Select Tickets</h1>
          <p className="text-[var(--text-secondary)] font-medium">Choose your entry tier for Event #{id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Tier Selection */}
        <div className="lg:col-span-2 space-y-6">
          {tiers.map((tier) => {
            const isSelected = (quantities[tier.id] || 0) > 0;
            const remaining = tier.capacity - tier.soldCount;

            return (
              <motion.div 
                key={tier.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-8 rounded-[32px] border-4 transition-all bg-[var(--bg-secondary)] ${
                  isSelected 
                    ? 'border-[#84cc16] shadow-xl shadow-lime-500/10' 
                    : 'border-[var(--border-color)]'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-[var(--text-primary)]">
                      {tier.name}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest leading-relaxed max-w-md">
                      Full access to all technical sessions, networking lounges, and digital resources.
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-3xl font-black text-[var(--text-primary)]">
                      MK {tier.price.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest">
                      Per Individual
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-[var(--border-color)] gap-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-500 rounded-full font-black text-[10px] uppercase tracking-widest border border-orange-500/20">
                    <AlertTriangle size={14} strokeWidth={3} />
                    Only {remaining} spots left
                  </div>
                  
                  <div className="flex items-center gap-6 bg-[var(--bg-primary)] p-2 rounded-2xl border border-[var(--border-color)]">
                    <button 
                      onClick={() => updateQuantity(tier.id, -1)}
                      disabled={!quantities[tier.id]}
                      className="w-12 h-12 rounded-xl border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-red-500 hover:text-white disabled:opacity-20 transition-all"
                    >
                      <Minus size={20} strokeWidth={3} />
                    </button>
                    <span className="text-2xl font-black w-8 text-center tabular-nums">
                      {quantities[tier.id] || 0}
                    </span>
                    <button 
                      onClick={() => updateQuantity(tier.id, 1)}
                      disabled={totalTickets >= 10}
                      className="w-12 h-12 rounded-xl border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[#84cc16] hover:text-white transition-all"
                    >
                      <Plus size={20} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Info Card */}
          <div className="p-8 bg-blue-500/5 rounded-[32px] border border-blue-500/20 flex gap-5">
            <Info className="text-blue-500 shrink-0" size={28} />
            <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-[0.15em] leading-loose">
              <p className="text-blue-500 text-xs mb-2">Registration Policy</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Bulk purchase limit: 10 tickets per transaction.</li>
                <li>Role-based discounts are calculated at the final checkout step.</li>
                <li>Instant ticket delivery to registered email upon payment confirmation.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Order Summary Sticky Rail */}
        <div className="lg:sticky lg:top-8 h-fit">
          <div className="p-8 bg-[var(--bg-secondary)] border-4 border-[var(--border-color)] rounded-[40px] shadow-2xl space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              Reservation Summary
            </h3>
            
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {tiers.filter(t => (quantities[t.id] || 0) > 0).map(t => (
                  <motion.div 
                    key={t.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest"
                  >
                    <span className="text-[var(--text-secondary)]">{t.name} x {quantities[t.id]}</span>
                    <span className="text-[var(--text-primary)]">MK {(t.price * (quantities[t.id] || 0)).toLocaleString()}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {totalTickets === 0 && (
                <div className="py-10 text-center space-y-3 opacity-30">
                  <div className="w-12 h-12 bg-[var(--bg-primary)] rounded-full flex items-center justify-center mx-auto">
                    <Plus size={20} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Select at least one ticket</p>
                </div>
              )}
              
              <div className="pt-6 border-t-2 border-[var(--border-color)] flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest">Grand Total</span>
                <span className="text-3xl font-black text-[#84cc16] tabular-nums">
                  MK {totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
            
            <button 
              disabled={totalTickets === 0}
              onClick={() => router.push(`/checkout/event/${id}`)}
              className="w-full py-5 bg-[#84cc16] text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-lime-500/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              Confirm & Pay
              <ArrowRight size={20} strokeWidth={3} />
            </button>
            
            <div className="flex items-center justify-center gap-2 text-[8px] text-[var(--text-secondary)] font-black uppercase tracking-widest">
              <ShieldCheck size={14} className="text-emerald-500" />
              Encrypted by VaultString Malawi
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}