'use client';

import React from 'react';
import { DollarSign, Ticket, TrendingUp, Users, ArrowUpRight } from 'lucide-react';

export default function SalesDashboard() {
  return (
    <div className="space-y-8">
      {/* Live KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', val: 'MK 4.2M', icon: DollarSign, trend: '+12%' },
          { label: 'Tickets Sold', val: '842 / 1200', icon: Ticket, trend: '70.1%' },
          { label: 'Conversion Rate', val: '4.8%', icon: TrendingUp, trend: '+0.4%' },
          { label: 'Active Viewers', val: '124', icon: Users, trend: 'Live' },
        ].map((kpi, i) => (
          <div key={i} className="p-6 bg-[var(--bg-secondary)]/40 border border-[var(--border-color)] rounded-[20px]">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg"><kpi.icon size={18} /></div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${kpi.trend.includes('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[var(--accent)]/10 text-[var(--accent)]'}`}>
                {kpi.trend}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{kpi.label}</p>
            <p className="text-xl font-black text-[var(--text-primary)] mt-1">{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales by Tier Chart Placeholder */}
        <div className="lg:col-span-2 p-8 bg-[var(--bg-secondary)]/20 border border-[var(--border-color)] rounded-[20px] min-h-[300px]">
           <h3 className="text-xs font-black uppercase tracking-widest mb-4">Revenue Chart</h3>
           {/* Chart Area */}
        </div>

        {/* Recent Orders Feed */}
        <div className="p-6 bg-[var(--bg-secondary)]/20 border border-[var(--border-color)] rounded-[20px] space-y-6">
           <h3 className="text-xs font-black uppercase tracking-widest">Recent Orders</h3>
           <div className="space-y-4">
             {[1, 2, 3, 4].map(order => (
               <div key={order} className="flex justify-between items-center pb-4 border-b border-[var(--border-color)] last:border-0 last:pb-0">
                 <div>
                   <p className="text-xs font-black">Jane Phiri</p>
                   <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">VIP Ticket • 2m ago</p>
                 </div>
                 <div className="text-right">
                   <p className="text-xs font-black text-[var(--accent)]">MK 75k</p>
                   <ArrowUpRight size={14} className="ml-auto text-[var(--text-secondary)]" />
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}