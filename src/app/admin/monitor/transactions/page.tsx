'use client';

import { useState, useEffect, useCallback } from 'react';
import { Filter, RefreshCw, Activity } from 'lucide-react';
import { TransactionStatsCards } from '@/components/admin/transactions/TransactionStatsCards';
import { LiveTransactionFeed } from '@/components/admin/transactions/LiveTransactionFeed';
import { TransactionFilterSidebar } from '@/components/admin/transactions/TransactionFilterSidebar';
import { TransactionDetailModal } from '@/components/admin/transactions/TransactionDetailModal';
import { transactionsService } from '@/services/admin/transactions.service';
import { Transaction, TransactionFilter, TransactionStats } from '@/types/admin/transactions';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const getMockTransactions = (): Transaction[] => {
  const statuses = ['pending', 'processing', 'completed', 'failed', 'held', 'approved'];
  const types = ['payment', 'refund', 'disbursement'];
  const methods = ['airtel_money', 'tnm_mpamba', 'card', 'bank_transfer'];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: `tx-${i + 1}`,
    reference: `TXN-${String(i + 1).padStart(8, '0')}`,
    amount: Math.floor(Math.random() * 500000) + 1000,
    currency: 'MWK',
    status: statuses[i % statuses.length] as any,
    type: types[i % types.length] as any,
    paymentMethod: methods[i % methods.length] as any,
    customer: {
      id: `cust-${i + 1}`,
      name: ['John Doe', 'Jane Smith', 'Michael Banda', 'Sarah Chilima', 'David Phiri'][i % 5],
      email: `customer${i + 1}@example.com`,
      phone: `+265 999 ${String(i + 100).padStart(3, '0')}`,
    },
    merchant: i % 3 === 0 ? { id: `merch-${i}`, name: `Merchant ${i + 1}` } : undefined,
    event: i % 4 === 0 ? {
      id: `event-${i}`,
      name: ['Malawi Fintech Expo', 'Tech Summit', 'Music Festival'][i % 3],
      date: new Date(Date.now() + i * 86400000).toISOString(),
    } : undefined,
    riskScore: Math.floor(Math.random() * 100),
    isAnomaly: i % 7 === 0,
    anomalyReason: i % 7 === 0 ? 'Unusual transaction amount pattern detected' : undefined,
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

const getMockStats = (): TransactionStats => {
  const transactions = getMockTransactions();
  return {
    total: transactions.length,
    pending: transactions.filter(t => t.status === 'pending').length,
    completed: transactions.filter(t => t.status === 'completed').length,
    failed: transactions.filter(t => t.status === 'failed').length,
    held: transactions.filter(t => t.status === 'held').length,
    approved: transactions.filter(t => t.status === 'approved').length,
    totalVolume: transactions.reduce((sum, t) => sum + t.amount, 0),
    averageAmount: transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length,
    anomalyCount: transactions.filter(t => t.isAnomaly).length,
  };
};

export default function TransactionMonitoringPage() {
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<TransactionFilter>({
    search: '',
    status: '',
    type: '',
    paymentMethod: '',
    isAnomaly: false,
  });
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      if (!useMockData) {
        loadData();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      let mockTransactions = getMockTransactions();
      const mockStats = getMockStats();
      
      // Apply filters
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        mockTransactions = mockTransactions.filter(t =>
          t.reference.toLowerCase().includes(searchLower) ||
          t.customer.name.toLowerCase().includes(searchLower) ||
          t.customer.email.toLowerCase().includes(searchLower)
        );
      }
      if (filters.status) {
        mockTransactions = mockTransactions.filter(t => t.status === filters.status);
      }
      if (filters.type) {
        mockTransactions = mockTransactions.filter(t => t.type === filters.type);
      }
      if (filters.paymentMethod) {
        mockTransactions = mockTransactions.filter(t => t.paymentMethod === filters.paymentMethod);
      }
      if (filters.isAnomaly) {
        mockTransactions = mockTransactions.filter(t => t.isAnomaly);
      }
      
      setTransactions(mockTransactions);
      setStats(mockStats);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      toast.error('Failed to load transactions');
      setTransactions(getMockTransactions());
      setStats(getMockStats());
    } finally {
      setLoading(false);
    }
  };

  const handleHoldTransaction = async (transactionId: string) => {
    if (useMockData) {
      setTransactions(prev => prev.map(t =>
        t.id === transactionId ? { ...t, status: 'held' as any } : t
      ));
      toast.success('Transaction held (demo)');
      return;
    }
    try {
      await transactionsService.holdTransaction(transactionId, 'Held by admin');
      toast.success('Transaction held');
      loadData();
    } catch (error) {
      toast.error('Failed to hold transaction');
    }
  };

  const handleApproveTransaction = async (transactionId: string) => {
    if (useMockData) {
      setTransactions(prev => prev.map(t =>
        t.id === transactionId ? { ...t, status: 'approved' as any } : t
      ));
      toast.success('Transaction approved (demo)');
      return;
    }
    try {
      await transactionsService.approveTransaction(transactionId, 'Approved by admin');
      toast.success('Transaction approved');
      loadData();
    } catch (error) {
      toast.error('Failed to approve transaction');
    }
  };

  const handleFilterChange = (newFilters: Partial<TransactionFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: '',
      type: '',
      paymentMethod: '',
      minAmount: undefined,
      maxAmount: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      isAnomaly: false,
    });
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Transaction Monitoring</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Monitor and manage transactions in real-time
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <Filter size={16} />
            Filters
            {Object.keys(filters).some(k => filters[k as keyof TransactionFilter] && k !== 'search') && (
              <span className="w-2 h-2 rounded-full bg-[#84cc16]" />
            )}
          </button>
          <button
            onClick={() => { loadData(); toast.success('Data refreshed'); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Demo Mode Notice */}
      {useMockData && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ℹ️ Demo Mode - Using sample transaction data. Connect to backend for live monitoring.
          </p>
        </div>
      )}

      {/* Stats Cards */}
      {stats && <TransactionStatsCards stats={stats} loading={loading} />}

      {/* Live Transaction Feed */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-color)]">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Live Transaction Feed</h2>
            <p className="text-sm text-[var(--text-secondary)]">{transactions.length} transactions</p>
          </div>
        </div>
        <div className="p-4">
          <LiveTransactionFeed
            transactions={transactions}
            loading={loading}
            onHold={handleHoldTransaction}
            onApprove={handleApproveTransaction}
            onViewDetails={setSelectedTransaction}
            autoScroll={true}
          />
        </div>
      </div>

      {/* Filter Sidebar */}
      <TransactionFilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}