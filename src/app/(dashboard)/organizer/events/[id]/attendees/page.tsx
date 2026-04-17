'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Search, Download, MoreHorizontal, UserCheck, ShieldCheck } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Authentic Malawian Mock Data
const MOCK_ATTENDEES = [
  { id: 1, name: "Chisomo Phiri", email: "c.phiri@vaultstring.mw", role: "Developer", tier: "VIP ACCESS" },
  { id: 2, name: "Lumbani Banda", email: "l.banda@vaultstring.mw", role: "SME", tier: "EARLY BIRD" },
  { id: 3, name: "Kondwani Mwale", email: "k.mwale@vaultstring.mw", role: "Corporate", tier: "EXECUTIVE" },
  { id: 4, name: "Tamtanda Chapi", email: "t.chapi@vaultstring.mw", role: "Student", tier: "GENERAL" },
  { id: 5, name: "Yamiko Kamwendo", email: "y.kamwendo@vaultstring.mw", role: "Developer", tier: "VIP ACCESS" },
  { id: 6, name: "Tiwonge Kumwenda", email: "t.kumwenda@vaultstring.mw", role: "SME", tier: "GENERAL" },
];

export default function AttendeeListPage() {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase mb-2">Attendee List</h1>
          <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
            Managing Event <span className="text-[#84cc16]">#{id}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[#84cc16] transition-colors" size={16} />
            <input 
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl pl-12 pr-4 h-12 w-full md:w-64 text-xs font-bold outline-none focus:border-[#84cc16] transition-all" 
              placeholder="SEARCH ATTENDEES..." 
            />
          </div>
          <button className="bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] h-12 px-6 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-[var(--bg-primary)] transition-all">
            <Download size={16} className="text-[#84cc16]" /> Export
          </button>
        </div>
      </div>

      {/* Responsive Container */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[24px] overflow-hidden shadow-2xl shadow-black/5">
        
        {/* Mobile View (Cards) */}
        <div className="md:hidden divide-y divide-[var(--border-color)]">
          {MOCK_ATTENDEES.map((person) => (
            <div 
              key={person.id} 
              className="p-5 active:bg-black/[0.05] dark:active:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center font-black text-[#84cc16] text-xs">
                  {person.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-xs uppercase tracking-tight">{person.name}</h3>
                  <p className="text-[10px] text-[var(--text-secondary)] font-bold">{person.email}</p>
                </div>
                <button className="text-[var(--text-secondary)]"><MoreHorizontal size={18} /></button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-[#84cc16]/10 text-[#84cc16] rounded border border-[#84cc16]/20">
                  {person.role}
                </span>
                <div className="flex items-center gap-1.5 text-emerald-500 font-black text-[9px] uppercase tracking-widest">
                  <UserCheck size={12} strokeWidth={3} /> Checked In
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View (Table) */}
        <Table className="hidden md:table">
          <TableHeader className="bg-[var(--bg-primary)]/40">
            <TableRow className="border-b border-[var(--border-color)] hover:bg-transparent">
              <TableHead className="text-[10px] font-black uppercase tracking-widest py-5 pl-8">Attendee</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Platform Role</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Ticket Tier</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Status</TableHead>
              <TableHead className="text-right text-[10px] font-black uppercase tracking-widest py-5 pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_ATTENDEES.map((person) => (
              <TableRow 
                key={person.id} 
                className="
                  border-b border-[var(--border-color)] last:border-0 cursor-pointer transition-all duration-200 group
                  /* LIGHT MODE HOVER */
                  hover:bg-black/[0.04]
                  /* DARK MODE HOVER (Subtle white tint creates dark gray lift) */
                  dark:hover:bg-white/[0.03]
                "
              >
                <TableCell className="py-5 pl-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center font-black text-[#84cc16] text-xs transition-colors group-hover:border-[#84cc16]">
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-black text-xs uppercase tracking-tight group-hover:text-[#84cc16] transition-colors">{person.name}</div>
                      <div className="text-[10px] text-[var(--text-secondary)] font-bold">{person.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#84cc16]/10 text-[#84cc16] text-[9px] font-black uppercase tracking-widest border border-[#84cc16]/20">
                    <ShieldCheck size={10} /> {person.role}
                  </div>
                </TableCell>
                <TableCell className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
                  {person.tier}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-emerald-500 font-black text-[9px] uppercase tracking-widest">
                    <UserCheck size={14} strokeWidth={3} /> Checked In
                  </div>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <button className="p-2.5 text-[var(--text-secondary)] hover:text-[#84cc16] hover:bg-[var(--bg-secondary)] rounded-xl transition-all">
                    <MoreHorizontal size={18} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer Pagination */}
      <div className="flex justify-between items-center px-2">
        <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">6 of 1,240 Malawian Residents</p>
        <div className="flex gap-2">
           <button className="px-5 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[9px] font-black uppercase hover:border-[#84cc16] transition-colors">Prev</button>
           <button className="px-5 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[9px] font-black uppercase hover:border-[#84cc16] transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
}