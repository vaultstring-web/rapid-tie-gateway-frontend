"use client";

import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  TooltipProps
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Download, TrendingUp, Zap } from 'lucide-react';

/* 1. DATA GENERATOR & TYPES */
interface DataPoint {
  date: string;
  day: string;
  sales: number;
  transactions: number;
  event?: string;
  timestamp: number;
}

const generateData = (): DataPoint[] => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const data: DataPoint[] = [];
  
  for (let i = 89; i >= 0; i--) {
    const d = new Date(); // Using the built-in Date class
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Simulate a spike 4 days ago
    const isSpike = i === 4; 
    
    data.push({
      date: dateStr,
      day: days[d.getDay()],
      sales: isSpike ? 850000 : 200000 + Math.random() * 300000,
      transactions: isSpike ? 52 : Math.floor(15 + Math.random() * 15),
      event: isSpike ? "Pay Day Spike" : undefined,
      timestamp: d.getTime()
    });
  }
  return data;
};

const ALL_DATA = generateData();

/* 2. TYPE-SAFE TOOLTIP */
const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload as DataPoint;
  return (
    <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
      <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">
        {new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
      </p>
      <p className="text-sm font-bold text-gray-900">K{data.sales.toLocaleString()}</p>
      <div className="mt-1 text-[10px] font-medium text-gray-500">{data.transactions} Transactions</div>
      {data.event && (
        <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
          <Zap size={10} /> {data.event}
        </div>
      )}
    </div>
  );
};

export default function Analytics() {
  const [range, setRange] = useState<string>('7d');
  const [isExporting, setIsExporting] = useState(false);

  // Requirement: Logic for highlighting "Today" (Tuesday)
  const todayISO = new Date().toISOString().split('T')[0];

  const filteredData = useMemo(() => {
    const count = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    return ALL_DATA.slice(-count).sort((a, b) => a.timestamp - b.timestamp);
  }, [range]);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 150);
  };

  const formatDateTick = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-8 p-6 bg-[#fcfcfc] min-h-screen">
      <div id="analytics-report" className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics</h1>
            <p className="text-gray-500 font-medium">Malawian Kwacha (MWK) performance metrics.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              {['7d', '30d', '90d'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all ${
                    range === r ? 'bg-[#84cc16] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-[#3b5a65] rounded-xl text-xs font-black text-white hover:bg-black transition-colors uppercase tracking-widest">
              <Download size={14} /> {isExporting ? 'Preparing...' : 'Export PDF'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* Sales Chart */}
            <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest mb-8 text-center">Revenue Performance</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#84cc16" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                      tickFormatter={formatDateTick}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      tickFormatter={(val: number) => `K${(val/1000).toLocaleString()}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#84cc16" 
                      strokeWidth={4} 
                      fill="url(#colorSales)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Transaction Volume Bar Chart (Fixed X-Axis) */}
            <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest mb-8 text-center">Daily Transaction Volume</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                      tickFormatter={formatDateTick}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
                    <Bar dataKey="transactions" radius={[6, 6, 0, 0]}>
                      {filteredData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          // Highlights Today if in 7d view, otherwise highlights events
                          fill={entry.date === todayISO && range === '7d' ? '#84cc16' : '#3b5a65'} 
                          fillOpacity={entry.date === todayISO || range !== '7d' ? 1 : 0.6}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-[#3b5a65] text-white p-10 rounded-[2.5rem] shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[#84cc16] rounded-xl"><TrendingUp size={20} /></div>
                <h3 className="font-black text-xs uppercase tracking-[0.2em]">Insights</h3>
              </div>
              <p className="text-sm text-gray-300 mb-8 leading-relaxed font-medium">
                Volume is currently <span className="text-[#84cc16] font-black">up 84%</span> compared to the previous cycle.
              </p>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth ROI</span>
                  <span className="text-3xl font-black tracking-tighter">4.2x</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#84cc16] h-full w-[84%] shadow-[0_0_15px_rgba(132,204,22,0.6)]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}