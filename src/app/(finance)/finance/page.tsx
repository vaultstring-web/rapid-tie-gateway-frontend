'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Wallet, Layers, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { MOCK_BUDGETS, MOCK_SPENDING_TRENDS, MOCK_BATCHES, MOCK_DISBURSEMENTS } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Budget, Batch } from '@/types';

export default function FinanceDashboard() {
  const pendingDisbursements = MOCK_DISBURSEMENTS?.filter((d: { status: string }) => d.status === 'Ready').length || 0;
  const activeBatches = MOCK_BATCHES?.filter((b: Batch) => b.status === 'Processing').length || 0;

  const budgetData = MOCK_BUDGETS?.map((b: Budget) => ({
    name: b.department,
    spent: b.spent,
    committed: b.committed,
    remaining: b.total - (b.spent + b.committed)
  })) || [];

  // Custom Tooltip component instead of formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="text-xs font-bold text-gray-500 mb-2">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-sm font-medium" style={{ color: item.color }}>
              {item.name}: MK {item.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Finance Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of budget utilization, disbursements, and reconciliation status.</p>
      </header>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card border-l-4 border-[#84cc16]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Disbursements</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{pendingDisbursements}</h3>
            </div>
            <div className="p-2 bg-[#84cc16]/10 rounded-lg">
              <Wallet className="w-5 h-5 text-[#84cc16]" />
            </div>
          </div>
          <Link href="/finance/disbursements/ready" className="text-[10px] text-[#84cc16] font-bold uppercase mt-4 flex items-center gap-1 hover:underline">
            View Ready List <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="card border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Batches</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{activeBatches}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Layers className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <Link href="/finance/disbursements/batches" className="text-[10px] text-blue-600 font-bold uppercase mt-4 flex items-center gap-1 hover:underline">
            Monitor Batches <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="card border-l-4 border-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reconciliation</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">94%</h3>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <p className="text-[10px] text-amber-600 font-bold uppercase mt-4">6 items pending</p>
        </div>

        <div className="card border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Budget Alerts</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">2</h3>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <Link href="/finance/budgets" className="text-[10px] text-red-600 font-bold uppercase mt-4 flex items-center gap-1 hover:underline">
            Review Budgets <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Budget Utilization Chart */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Budget Utilization by Department</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `MK ${value / 1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Legend iconType="circle" />
                <Bar dataKey="spent" name="Spent" fill="#84cc16" radius={[4, 4, 0, 0]} />
                <Bar dataKey="committed" name="Committed" fill="#3b5a65" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending Trend Overlay */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Spending Trend (Total vs Event)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_SPENDING_TRENDS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `MK ${value / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="total" name="Total Spend" stroke="#3b5a65" strokeWidth={3} dot={{ r: 4, fill: '#3b5a65' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="event" name="Event Spend" stroke="#84cc16" strokeWidth={3} dot={{ r: 4, fill: '#84cc16' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Batches Table */}
      <div className="card overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Recent Disbursement Batches</h3>
          <Link href="/finance/disbursements/batches" className="btn-secondary btn-small">View All Batches</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Batch Name</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase text-right">Items</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase text-right">Total Amount</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_BATCHES?.slice(0, 3).map((batch: Batch) => (
                <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4">
                    <div className="font-bold text-gray-900">{batch.name}</div>
                    <div className="text-[10px] text-gray-400">{batch.id}</div>
                  </td>
                  <td className="py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      batch.status === 'Completed' ? "bg-green-50 text-green-600" :
                      batch.status === 'Processing' ? "bg-blue-50 text-blue-600" :
                      "bg-red-50 text-red-600"
                    )}>
                      {batch.status}
                    </span>
                  </td>
                  <td className="py-4 text-right font-medium text-gray-600">{batch.itemCount}</td>
                  <td className="py-4 text-right font-bold text-gray-900">MK {batch.totalAmount.toLocaleString()}</td>
                  <td className="py-4 text-right text-gray-500 text-xs">
                    {new Date(batch.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}