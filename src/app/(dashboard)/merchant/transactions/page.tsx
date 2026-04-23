"use client";

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, Download, ChevronDown, ExternalLink, 
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

  // Format MWK currency
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
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'amount') {
        aVal = a.amount;
        bVal = b.amount;
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  }, [search, statusFilter, sortField, sortDirection]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTransactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTransactions.map(t => t.id));
    }
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

  // Calculate totals for selected transactions
  const selectedTotal = selectedIds.reduce((total, id) => {
    const tx = filteredTransactions.find(t => t.id === id);
    return total + (tx?.amount || 0);
  }, 0);

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const title = selectedIds.length > 0 ? 'Selected Transactions Report' : 'All Transactions Report';
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    
    // Prepare table data
    const tableData = filteredTransactions.map(tx => [
      tx.id,
      tx.customer.name,
      tx.event?.name || 'Direct Payment',
      formatMWK(tx.amount),
      tx.status,
      new Date(tx.date).toLocaleDateString()
    ]);
    
    autoTable(doc, {
      head: [['Transaction ID', 'Customer', 'Event', 'Amount', 'Status', 'Date']],
      body: tableData,
      startY: 35,
      theme: 'striped',
      headStyles: { fillColor: [132, 204, 22], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 30 },
        4: { cellWidth: 25 },
        5: { cellWidth: 30 },
      },
    });
    
    // Add summary if items selected
    if (selectedIds.length > 0) {
      const finalY = (doc as any).lastAutoTable.finalY || 80;
      doc.setFontSize(10);
      doc.text(`Summary: ${selectedIds.length} transactions selected`, 14, finalY + 10);
      doc.text(`Total Amount: ${formatMWK(selectedTotal)}`, 14, finalY + 17);
    }
    
    doc.save(`transactions-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Print table
  const printTable = () => {
    const printContent = document.getElementById('transactions-table');
    const originalContents = document.body.innerHTML;
    if (printContent) {
      document.body.innerHTML = printContent.outerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-gray-500">Manage and view all your payment history in Malawian Kwacha (MWK).</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportToPDF} className="btn-primary btn-small flex items-center gap-2">
            <FileText size={16} />
            Export PDF
          </button>
          <button onClick={printTable} className="btn-secondary btn-small flex items-center gap-2">
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by customer, email or ID..." 
              className="input pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <select 
                className="input pr-10 appearance-none bg-card" 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            <button className="btn-secondary flex items-center gap-2">
              <Filter size={18} />
              More Filters
            </button>
          </div>
        </div>

        {/* Bulk Selection Bar */}
        {selectedIds.length > 0 && (
          <div className="mb-4 p-3 bg-[#84cc16]/10 rounded-lg flex items-center justify-between">
            <span className="text-sm text-[#84cc16]">
              {selectedIds.length} transaction{selectedIds.length !== 1 ? 's' : ''} selected 
              (Total: {formatMWK(selectedTotal)})
            </span>
            <div className="flex gap-3">
              <button onClick={exportToPDF} className="text-sm text-[#84cc16] hover:underline">
                Export Selected
              </button>
              <button className="text-sm text-gray-500 hover:text-foreground/80">
                Bulk Action
              </button>
            </div>
          </div>
        )}

        <div id="transactions-table" className="overflow-x-auto">
          <table className="w-full text-left" ref={tableRef}>
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="pb-4 px-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-[#84cc16]"
                    checked={selectedIds.length === filteredTransactions.length && filteredTransactions.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="pb-4 font-semibold">Transaction ID</th>
                <th className="pb-4 font-semibold">Customer</th>
                <th className="pb-4 font-semibold">Event</th>
                <th className="pb-4 font-semibold cursor-pointer" onClick={() => handleSort('amount')}>
                  <div className="flex items-center gap-1">Amount (MWK) <ArrowUpDown size={12} /></div>
                </th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold cursor-pointer" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1">Date <ArrowUpDown size={12} /></div>
                </th>
                <th className="pb-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className={cn(
                  "group hover:bg-background transition-colors",
                  selectedIds.includes(tx.id) && "bg-[#84cc16]/5"
                )}>
                  <td className="py-4 px-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-[#84cc16]"
                      checked={selectedIds.includes(tx.id)}
                      onChange={() => toggleSelect(tx.id)}
                    />
                  </td>
                  <td className="py-4">
                    <span className="text-sm font-mono text-gray-500">{tx.id}</span>
                  </td>
                  <td className="py-4">
                    <div>
                      <p className="text-sm font-bold text-foreground">{tx.customer.name}</p>
                      <p className="text-xs text-gray-500">{tx.customer.email}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    {tx.event ? (
                      <Link 
                        href={`/merchant/analytics?event=${tx.event.id}`}
                        className="text-sm text-[#3b5a65] hover:text-[#84cc16] hover:underline flex items-center gap-1"
                      >
                        {tx.event.name}
                        <ExternalLink size={12} />
                      </Link>
                    ) : (
                      <span className="text-sm text-gray-400">Direct Payment</span>
                    )}
                  </td>
                  <td className="py-4">
                    <span className="text-sm font-bold text-foreground">{formatMWK(tx.amount)}</span>
                  </td>
                  <td className="py-4">
                    <span className={cn(
                      "badge-success",
                      tx.status === 'pending' && "badge-pending",
                      tx.status === 'failed' && "badge-error",
                      tx.status === 'refunded' && "bg-gray-100 text-foreground/70"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-500">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 text-right">
                    <Link 
                      href={`/merchant/transactions/${tx.id}`} 
                      className="p-2 text-gray-400 hover:text-[#84cc16] transition-colors"
                    >
                      <ExternalLink size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No transactions found matching your criteria.</p>
          </div>
        )}

        {/* Summary Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Showing {filteredTransactions.length} of {MOCK_TRANSACTIONS.length} transactions
            </p>
            {filteredTransactions.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                Total Volume: {formatMWK(filteredTransactions.reduce((sum, t) => sum + t.amount, 0))}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 bg-[#84cc16] text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

