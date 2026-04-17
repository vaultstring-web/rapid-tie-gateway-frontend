"use client";

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, ChevronDown, ExternalLink, 
  ArrowUpDown, FileText, Printer 
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MOCK_TRANSACTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const tableRef = useRef<HTMLTableElement>(null);

  const formatMWK = (amount: number) => {
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredTransactions = useMemo(() => {
    let filtered = [...MOCK_TRANSACTIONS];
    if (search) {
      filtered = filtered.filter(tx => 
        tx.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        tx.customer.email.toLowerCase().includes(search.toLowerCase()) ||
        tx.id.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }
    filtered.sort((a, b) => {
      let aVal = sortField === 'amount' ? a.amount : new Date(a.date).getTime();
      let bVal = sortField === 'amount' ? b.amount : new Date(b.date).getTime();
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [search, statusFilter, sortField, sortDirection]);

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === filteredTransactions.length ? [] : filteredTransactions.map(t => t.id));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const selectedTotal = selectedIds.reduce((total, id) => {
    const tx = filteredTransactions.find(t => t.id === id);
    return total + (tx?.amount || 0);
  }, 0);

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['ID', 'Customer', 'Amount', 'Status', 'Date']],
      body: filteredTransactions.map(tx => [tx.id, tx.customer.name, formatMWK(tx.amount), tx.status, new Date(tx.date).toLocaleDateString()]),
      headStyles: { fillColor: [132, 204, 22] },
    });
    doc.save('transactions.pdf');
  };

  const printTable = () => window.print();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold transition-colors" style={{ color: 'var(--text-primary)' }}>Transactions</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage history in MWK.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportToPDF} className="btn-primary btn-small flex items-center gap-2">
            <FileText size={16} /> Export PDF
          </button>
          <button onClick={printTable} className="btn-secondary btn-small flex items-center gap-2">
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      <div className="card transition-colors" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderStyle: 'solid', borderWidth: '1px' }}>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="input pl-10 w-full transition-colors"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <select 
                className="input pr-10 appearance-none min-w-[140px] transition-colors" 
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={16} style={{ color: 'var(--text-secondary)' }} />
            </div>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="mb-4 p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: 'rgba(132, 204, 22, 0.1)' }}>
            <span className="text-sm font-medium" style={{ color: '#84cc16' }}>
              {selectedIds.length} selected ({formatMWK(selectedTotal)})
            </span>
          </div>
        )}

        <div id="transactions-table" className="overflow-x-auto">
          <table className="w-full text-left" ref={tableRef}>
            <thead>
              <tr className="text-xs uppercase tracking-wider border-b" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                <th className="pb-4 px-4">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === filteredTransactions.length && filteredTransactions.length > 0} 
                    onChange={toggleSelectAll} 
                  />
                </th>
                <th className="pb-4 font-semibold">Transaction ID</th>
                <th className="pb-4 font-semibold">Customer</th>
                <th className="pb-4 font-semibold cursor-pointer" onClick={() => handleSort('amount')}>
                  <div className="flex items-center gap-1">Amount <ArrowUpDown size={12} /></div>
                </th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold cursor-pointer" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1">Date <ArrowUpDown size={12} /></div>
                </th>
                <th className="pb-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className={cn("group transition-colors hover:bg-black/5", selectedIds.includes(tx.id) && "bg-[#84cc16]/5")}>
                  <td className="py-4 px-4">
                    <input type="checkbox" checked={selectedIds.includes(tx.id)} onChange={() => toggleSelect(tx.id)} />
                  </td>
                  <td className="py-4">
                    <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{tx.id}</span>
                  </td>
                  <td className="py-4">
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{tx.customer.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{tx.customer.email}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{formatMWK(tx.amount)}</span>
                  </td>
                  <td className="py-4">
                    <span className={cn(
                        "badge-success", 
                        tx.status === 'pending' && "badge-pending", 
                        tx.status === 'failed' && "badge-error"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 text-right">
                    <Link href={`/merchant/transactions/${tx.id}`} className="p-2 hover:text-[#84cc16]" style={{ color: 'var(--text-secondary)' }}>
                      <ExternalLink size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Showing {filteredTransactions.length} transactions
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded-lg text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>Previous</button>
            <button className="px-3 py-1 bg-[#84cc16] text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border rounded-lg text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}