'use client';

import React from 'react';
import { Plus, GripVertical, Edit2, Trash2, Users, Tag } from 'lucide-react';

export default function TicketTiers() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-black tracking-tight uppercase">Ticket Tiers</h1>
          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Malawi Fintech Expo 2026</p>
        </div>
        <button className="bg-[var(--accent)] text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Plus size={14} /> Create Tier
        </button>
      </div>

      <div className="space-y-3">
        {[
          { name: 'Early Bird', price: '25,000', sold: 150, cap: 150, color: 'text-emerald-500' },
          { name: 'General Admission', price: '45,000', sold: 320, cap: 500, color: 'text-[var(--accent)]' },
          { name: 'VIP Excellence', price: '120,000', sold: 45, cap: 50, color: 'text-amber-500' },
        ].map((tier, i) => (
          <div key={i} className="group bg-[var(--bg-secondary)]/40 border border-[var(--border-color)] rounded-[15px] p-4 flex items-center gap-4 hover:border-[var(--accent)] transition-all">
            <GripVertical className="text-[var(--border-color)] group-hover:text-[var(--text-secondary)] cursor-grab" size={20} />
            
            <div className="flex-1 grid grid-cols-4 gap-4 items-center">
              <div>
                <h4 className="text-xs font-black uppercase truncate">{tier.name}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <Tag size={10} className="text-[var(--text-secondary)]" />
                  <span className={`text-[10px] font-black ${tier.color}`}>MK {tier.price}</span>
                </div>
              </div>

              <div className="col-span-2 space-y-1.5">
                <div className="flex justify-between text-[8px] font-black uppercase text-[var(--text-secondary)]">
                  <span>Capacity</span>
                  <span>{tier.sold} / {tier.cap} Sold</span>
                </div>
                <div className="h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-[var(--accent)] rounded-full ${tier.sold === tier.cap ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : ''}`} 
                    style={{ width: `${(tier.sold / tier.cap) * 100}%` }} 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button className="p-2 hover:bg-[var(--bg-primary)] rounded-lg text-[var(--text-secondary)] transition-colors"><Edit2 size={14} /></button>
                <button className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}