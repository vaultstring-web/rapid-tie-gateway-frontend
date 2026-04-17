'use client';

import React, { useState, useMemo } from 'react';
import { 
  DollarSign, Users, ArrowUpRight, TrendingUp, CreditCard, 
  Clock, CheckCircle, XCircle, Download, Search, 
  Filter, MoreVertical, Eye, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

const stats = [
  { title: 'Total Revenue', value: 'MK 12,345,000', change: '+12.5%', icon: DollarSign },
  { title: 'Total Transactions', value: '1,234', change: '+8.2%', icon: CreditCard },
  { title: 'Active Users', value: '567', change: '+3.1%', icon: Users },
  { title: 'Success Rate', value: '98.5%', change: '+2.4%', icon: TrendingUp },
];

const recentTransactions = [
  { id: 'TXN001', customer: 'John Doe', amount: 'MK 15,000', status: 'completed', date: '2024-01-15', type: 'payment' },
  { id: 'TXN002', customer: 'Jane Smith', amount: 'MK 7,500', status: 'pending', date: '2024-01-15', type: 'refund' },
  { id: 'TXN003', customer: 'Bob Johnson', amount: 'MK 23,000', status: 'completed', date: '2024-01-14', type: 'payment' },
  { id: 'TXN004', customer: 'Alice Brown', amount: 'MK 4,500', status: 'failed', date: '2024-01-14', type: 'payment' },
  { id: 'TXN005', customer: 'Charlie Wilson', amount: 'MK 32,000', status: 'completed', date: '2024-01-13', type: 'payment' },
];

export default function MerchantDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = useMemo(() => {
    return recentTransactions.filter(transaction =>
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Welcome back, {user?.firstName || 'Merchant'}!
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors text-sm font-medium">
            <Download className="h-4 w-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#84cc16] text-white hover:bg-[#84cc16]/90 transition-colors text-sm font-medium">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-[var(--bg-secondary)] border-[var(--border-color)] shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-[var(--text-secondary)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</div>
                <p className="text-xs text-[#84cc16] mt-1 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {stat.change} <span className="text-[var(--text-secondary)] ml-1">from last month</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <Card className="bg-[var(--bg-secondary)] border-[var(--border-color)] shadow-none">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-[var(--text-primary)]">Recent Transactions</CardTitle>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                <input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-9 pl-9 pr-4 rounded-md border bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[#84cc16]"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)] text-sm transition-colors">
                <Filter className="h-4 w-4" /> Filter
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[var(--border-color)] hover:bg-transparent">
                <TableHead className="text-[var(--text-secondary)]">Transaction ID</TableHead>
                <TableHead className="text-[var(--text-secondary)]">Customer</TableHead>
                <TableHead className="text-[var(--text-secondary)]">Amount</TableHead>
                <TableHead className="text-[var(--text-secondary)]">Status</TableHead>
                <TableHead className="text-[var(--text-secondary)]">Date</TableHead>
                <TableHead className="text-[var(--text-secondary)]">Type</TableHead>
                <TableHead className="text-right text-[var(--text-secondary)]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} 
                className="border-[var(--border-color)] hover:bg-[var(--hover-bg)] transition-colors">
                  <TableCell className="font-medium text-[var(--text-primary)]">{transaction.id}</TableCell>
                  <TableCell className="text-[var(--text-primary)]">{transaction.customer}</TableCell>
                  <TableCell className="text-[var(--text-primary)] font-semibold">{transaction.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                      transaction.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-[var(--text-secondary)]">{transaction.date}</TableCell>
                  <TableCell className="capitalize text-[var(--text-primary)]">{transaction.type}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-[var(--bg-secondary)] rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)]">
                        <DropdownMenuItem className="hover:bg-[var(--bg-primary)] cursor-pointer">
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredTransactions.length === 0 && (
            <div className="text-center py-12 text-[var(--text-secondary)]">No transactions found</div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[var(--bg-secondary)] border-[var(--border-color)] shadow-none">
          <CardHeader><CardTitle className="text-lg text-[var(--text-primary)]">Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full flex items-center px-4 py-2 rounded-md border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors text-sm">
              <CreditCard className="h-4 w-4 mr-2" /> Process Payment
            </button>
            <button className="w-full flex items-center px-4 py-2 rounded-md border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors text-sm">
              <Clock className="h-4 w-4 mr-2" /> View Settlements
            </button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-[var(--bg-secondary)] border-[var(--border-color)] shadow-none">
          <CardHeader><CardTitle className="text-lg text-[var(--text-primary)]">Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: CheckCircle, color: 'text-green-500', text: 'Payment received from John Doe', time: '2 mins ago' },
              { icon: Clock, color: 'text-yellow-500', text: 'Settlement pending for MK 1,234,000', time: '1 hour ago' },
              { icon: XCircle, color: 'text-red-500', text: 'Failed transaction: TXN004', time: '3 hours ago' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <item.icon className={`h-5 w-5 ${item.color} mt-0.5`} />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{item.text}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}