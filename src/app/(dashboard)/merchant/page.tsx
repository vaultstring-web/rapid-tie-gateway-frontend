<<<<<<< HEAD
'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  Users,
  ArrowUpRight,
=======
﻿"use client";

import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Users, 
  ArrowUpRight, 
>>>>>>> approver
  Calendar,
  Plus,
  Send,
  Download,
  ExternalLink,
<<<<<<< HEAD
  Zap,
  Sun,
  Moon,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

// Mock data
const RAW_DATA = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 7800, event: 'Pay Day Spike' },
=======
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  TooltipProps
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { motion } from 'framer-motion';

/* 1. MOCK DATA & TYPES */
interface ChartData {
  name: string;
  revenue: number;
  event?: string;
}

const RAW_DATA: ChartData[] = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 7800, event: "Pay Day Spike" }, // Today's Spike
>>>>>>> approver
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const MOCK_EVENTS = [
<<<<<<< HEAD
  {
    id: '1',
    name: 'Lake of Stars Festival',
    date: '27 Sep, 2026',
    sponsorAmount: 5000000,
    image: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    name: 'Blantyre Fashion Week',
    date: '15 Oct, 2026',
    sponsorAmount: 2500000,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&h=200&fit=crop',
  },
];

const MOCK_TRANSACTIONS = [
  {
    id: 'tx1',
    customer: { name: 'Chifundo Banda', email: 'c.banda@gmail.com' },
    event: 'Standard Ticket',
    amount: 45000,
    status: 'success',
    date: '2026-03-31',
  },
  {
    id: 'tx2',
    customer: { name: 'Tiwonge Phiri', email: 't.phiri@outlook.com' },
    event: 'VIP Pass',
    amount: 120000,
    status: 'pending',
    date: '2026-03-30',
  },
];

// Custom Tooltip Component with dark mode support
const CustomTooltip = ({ active, payload, label }: any) => {
  const { theme } = useTheme();
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  return (
    <div
      className={`p-4 rounded-xl shadow-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
    >
      <p
        className={`text-xs font-black uppercase mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}
      >
        {label}
      </p>
      <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        K{data.revenue?.toLocaleString()}
      </p>
      {data.event && (
        <p className="text-[10px] font-bold text-amber-600 mt-1 flex items-center gap-1">
          <Zap size={10} /> {data.event}
=======
  { id: '1', name: 'Lake of Stars Festival', date: '27 Sep, 2026', sponsorAmount: 5000000, image: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=200&h=200&fit=crop' },
  { id: '2', name: 'Blantyre Fashion Week', date: '15 Oct, 2026', sponsorAmount: 2500000, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&h=200&fit=crop' },
];

const MOCK_TRANSACTIONS = [
  { id: 'tx1', customer: { name: 'Chifundo Banda', email: 'c.banda@gmail.com' }, event: 'Standard Ticket', amount: 45000, status: 'success', date: '2026-03-31' },
  { id: 'tx2', customer: { name: 'Tiwonge Phiri', email: 't.phiri@outlook.com' }, event: 'VIP Pass', amount: 120000, status: 'pending', date: '2026-03-30' },
];

/* 2. CUSTOM TOOLTIP */
const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload as ChartData;
  return (
    <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
      <p className="text-xs font-black text-gray-400 uppercase mb-2">{label}</p>
      <p className="text-lg font-bold text-gray-900">K{data.revenue.toLocaleString()}</p>
      {data.event && (
        <p className="text-[10px] font-bold text-amber-600 mt-1 flex items-center gap-1">
          <Zap size={10}/> {data.event}
>>>>>>> approver
        </p>
      )}
    </div>
  );
};

export default function MerchantDashboard() {
  const [range, setRange] = useState<number>(7);
  const [isExporting, setIsExporting] = useState<boolean>(false);
<<<<<<< HEAD
  const { theme } = useTheme();
  const todayName = 'Tue';

  // Chart colors based on theme
  const chartColors = {
    bar: theme === 'dark' ? '#84cc16' : '#3b5a65',
    barHighlight: '#84cc16',
    grid: theme === 'dark' ? '#2d2d2d' : '#f1f5f9',
    text: theme === 'dark' ? '#94a3b8' : '#94a3b8',
  };
=======

  // Requirement: Today (Tuesday) is Lime Green
  const todayName = "Tue"; 
>>>>>>> approver

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 150);
  };

  return (
<<<<<<< HEAD
    <div
      className="space-y-8 p-6 min-h-screen"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
=======
    <div className="space-y-8 p-6 bg-[#fcfcfc] min-h-screen">
      
      {/* PRINT ENGINE CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
>>>>>>> approver
        @media print {
          body * { visibility: hidden; }
          #main-report, #main-report * { visibility: visible; }
          #main-report { position: absolute; left: 0; top: 0; width: 100% !important; padding: 20px !important; }
          .no-print { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
<<<<<<< HEAD
      `,
        }}
      />

      <div id="main-report" className="space-y-8">
        {/* Header with Theme Toggle */}
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Welcome back, Leticia
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Business performance in Malawian Kwacha (MWK).
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold transition-colors"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
              }}
            >
              <Download size={16} /> Export PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#84cc16] rounded-xl text-sm font-bold text-white shadow-lg shadow-lime-100 dark:shadow-lime-900/30">
=======
      `}} />

      <div id="main-report" className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, Leticia</h1>
            <p className="text-gray-500">Business performance in Malawian Kwacha (MWK).</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-white">
              <Download size={16} /> Export PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#84cc16] rounded-xl text-sm font-bold text-white shadow-lg shadow-lime-100">
>>>>>>> approver
              <Plus size={16} /> Create Link
            </button>
          </div>
        </div>

<<<<<<< HEAD
        {/* KPI Cards with Dark Mode */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: 'Total Revenue',
              value: 'K12,845,000',
              change: '+12.5%',
              icon: DollarSign,
              color: 'text-green-600',
              bg: 'bg-green-50 dark:bg-green-900/20',
            },
            {
              label: 'Total Volume',
              value: '1,240',
              change: '+5.2%',
              icon: ArrowUpRight,
              color: 'text-blue-600',
              bg: 'bg-blue-50 dark:bg-blue-900/20',
            },
            {
              label: 'Active Links',
              value: '12',
              change: '0%',
              icon: Send,
              color: 'text-purple-600',
              bg: 'bg-purple-50 dark:bg-purple-900/20',
            },
            {
              label: 'Avg. Ticket',
              value: 'K10,350',
              change: '-2.1%',
              icon: Users,
              color: 'text-orange-600',
              bg: 'bg-orange-50 dark:bg-orange-900/20',
            },
          ].map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl shadow-sm transition-colors"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                borderWidth: 1,
              }}
            >
              <div className="flex items-start justify-between">
                <div className={`${kpi.bg} ${kpi.color} p-2 rounded-lg`}>
                  <kpi.icon size={20} />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  {kpi.change}
                </span>
              </div>
              <div className="mt-4">
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium">
                  {kpi.label}
                </p>
                <h3 className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                  {kpi.value}
                </h3>
=======
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Revenue', value: 'K12,845,000', change: '+12.5%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Total Volume', value: '1,240', change: '+5.2%', icon: ArrowUpRight, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Active Links', value: '12', change: '0%', icon: Send, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Avg. Ticket', value: 'K10,350', change: '-2.1%', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
              <div className="flex items-start justify-between">
                <div className={`${kpi.bg} ${kpi.color} p-2 rounded-lg`}><kpi.icon size={20} /></div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">{kpi.change}</span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 font-medium">{kpi.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</h3>
>>>>>>> approver
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
<<<<<<< HEAD
          {/* Revenue Chart with Dark Mode */}
          <div
            className="lg:col-span-2 p-8 rounded-[2.5rem] shadow-sm transition-colors"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              borderWidth: 1,
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                Revenue Overview
              </h3>
              <div className="flex gap-2 no-print">
                <button
                  onClick={() => setRange(7)}
                  className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${range === 7 ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-400'}`}
                >
                  7D
                </button>
                <button
                  onClick={() => setRange(30)}
                  className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${range === 30 ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-400'}`}
                >
                  30D
                </button>
=======
          {/* Revenue Chart Section */}
          <div className="lg:col-span-2 p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-gray-900">Revenue Overview</h3>
              <div className="flex gap-2 no-print">
                <button onClick={() => setRange(7)} className={`text-xs font-bold px-3 py-1 rounded-lg ${range === 7 ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}>7D</button>
                <button onClick={() => setRange(30)} className={`text-xs font-bold px-3 py-1 rounded-lg ${range === 30 ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}>30D</button>
>>>>>>> approver
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RAW_DATA.slice(-range)}>
<<<<<<< HEAD
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: chartColors.text, fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: chartColors.text, fontSize: 12 }}
                    tickFormatter={(v: number) => `K${v / 1000}k`}
                  />
                  <Tooltip
                    cursor={{ fill: theme === 'dark' ? '#2a2a2a' : '#f8fafc' }}
                    content={<CustomTooltip />}
                  />
                  {RAW_DATA.map(
                    (d, i) =>
                      d.event && (
                        <ReferenceLine
                          key={i}
                          x={d.name}
                          stroke="#f59e0b"
                          strokeDasharray="3 3"
                          label={{
                            position: 'top',
                            value: d.event,
                            fill: '#d97706',
                            fontSize: 10,
                            fontWeight: 800,
                          }}
                        />
                      )
                  )}
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]} isAnimationActive={!isExporting}>
                    {RAW_DATA.slice(-range).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.name === todayName ? chartColors.barHighlight : chartColors.bar}
                      />
=======
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v: number) => `K${v/1000}k`} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
                  
                  {/* Event Overlay */}
                  {RAW_DATA.map((d, i) => d.event && (
                    <ReferenceLine key={i} x={d.name} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'top', value: d.event, fill: '#d97706', fontSize: 10, fontWeight: 800 }} />
                  ))}

                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]} isAnimationActive={!isExporting}>
                    {RAW_DATA.slice(-range).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === todayName ? '#84cc16' : '#3b5a65'} />
>>>>>>> approver
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

<<<<<<< HEAD
          {/* Events to Sponsor with Dark Mode */}
          <div
            className="p-8 rounded-[2.5rem] shadow-sm transition-colors"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              borderWidth: 1,
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                Events to Sponsor
              </h3>
=======
          {/* EVENTS TO SPONSOR SECTION (Restored) */}
          <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-gray-900">Events to Sponsor</h3>
>>>>>>> approver
              <button className="text-[#84cc16] text-xs font-bold hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              {MOCK_EVENTS.map((event) => (
                <div key={event.id} className="group cursor-pointer">
                  <div className="flex gap-4">
<<<<<<< HEAD
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-16 h-16 rounded-2xl object-cover shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h4
                        className="text-sm font-bold truncate group-hover:text-[#84cc16] transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {event.name}
                      </h4>
                      <p
                        className="text-[10px] flex items-center gap-1 mt-1 font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <Calendar size={12} /> {event.date}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className="text-xs font-black"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          K{(event.sponsorAmount / 1000000).toFixed(1)}M
                        </span>
                        <span className="px-2 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[9px] font-black rounded-full uppercase tracking-tighter">
                          High Impact
                        </span>
=======
                    <img src={event.image} alt={event.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#84cc16] transition-colors">{event.name}</h4>
                      <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-1 font-medium">
                        <Calendar size={12} /> {event.date}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-black text-[#3b5a65]">K{(event.sponsorAmount/1000000).toFixed(1)}M</span>
                        <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[9px] font-black rounded-full uppercase tracking-tighter">High Impact</span>
>>>>>>> approver
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
<<<<<<< HEAD
            <button
              className="w-full mt-8 py-3 border rounded-2xl text-xs font-bold transition-colors"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
=======
            <button className="w-full mt-8 py-3 border border-gray-100 rounded-2xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
>>>>>>> approver
              Explore More Events
            </button>
          </div>
        </div>

<<<<<<< HEAD
        {/* Recent Transactions with Dark Mode */}
        <div
          className="p-8 rounded-[2.5rem] shadow-sm overflow-hidden transition-colors"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            borderWidth: 1,
          }}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
              Recent Transactions
            </h3>
            <button
              className="px-4 py-2 border rounded-xl text-xs font-bold transition-colors"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              View All
            </button>
=======
        {/* RECENT TRANSACTIONS SECTION */}
        <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-900">Recent Transactions</h3>
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700">View All</button>
>>>>>>> approver
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
<<<<<<< HEAD
                <tr
                  className="text-[10px] font-black uppercase tracking-widest border-b"
                  style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}
                >
=======
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
>>>>>>> approver
                  <th className="pb-4">Customer</th>
                  <th className="pb-4">Event</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Action</th>
                </tr>
              </thead>
<<<<<<< HEAD
              <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                {MOCK_TRANSACTIONS.map((tx) => (
                  <tr
                    key={tx.id}
                    className="group transition-colors"
                    style={{ hover: { backgroundColor: 'var(--hover-bg)' } }}
                  >
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black uppercase"
                          style={{
                            backgroundColor: 'var(--hover-bg)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {tx.customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                            {tx.customer.name}
                          </p>
                          <p
                            className="text-[10px] font-medium"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {tx.customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      className="py-5 text-sm font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {tx.event}
                    </td>
                    <td
                      className="py-5 text-sm font-black"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      K{tx.amount.toLocaleString()}
                    </td>
                    <td className="py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${tx.status === 'success' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}
                      >
=======
              <tbody className="divide-y divide-gray-50">
                {MOCK_TRANSACTIONS.map((tx) => (
                  <tr key={tx.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-400 uppercase">
                          {tx.customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{tx.customer.name}</p>
                          <p className="text-[10px] text-gray-500 font-medium">{tx.customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 text-sm text-gray-600 font-medium">{tx.event}</td>
                    <td className="py-5 text-sm font-black text-gray-900">K{tx.amount.toLocaleString()}</td>
                    <td className="py-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                        tx.status === 'success' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                      }`}>
>>>>>>> approver
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-5 text-right">
<<<<<<< HEAD
                      <button
                        className="p-2 transition-colors"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <ExternalLink size={16} />
                      </button>
=======
                      <button className="p-2 text-gray-300 hover:text-[#84cc16] transition-colors"><ExternalLink size={16} /></button>
>>>>>>> approver
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> approver
