'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  CheckCircle, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { BatchCard } from '@/components/finance/BatchCard';
import { BatchStatusFilter } from '@/components/finance/BatchStatusFilter';
import { Batch, BatchSummary, BatchStatus } from '@/types/finance/batches';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data
const getMockBatches = (): Batch[] => {
  return [
    {
      id: '1',
      batchNumber: 'BATCH-2026-001',
      department: 'Finance',
      totalAmount: 1250000,
      totalRecipients: 45,
      successfulCount: 42,
      failedCount: 3,
      pendingCount: 0,
      status: 'completed',
      progress: 100,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      completedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      processedBy: 'John Doe',
      items: [
        { id: 'i1', recipientName: 'John Doe', recipientPhone: '+265 999 123 456', amount: 50000, status: 'success', retryCount: 0 },
        { id: 'i2', recipientName: 'Jane Smith', recipientPhone: '+265 888 123 456', amount: 75000, status: 'success', retryCount: 0 },
        { id: 'i3', recipientName: 'Mike Johnson', recipientPhone: '+265 999 789 012', amount: 45000, status: 'failed', retryCount: 2, errorMessage: 'Invalid phone number' },
      ],
    },
    {
      id: '2',
      batchNumber: 'BATCH-2026-002',
      department: 'Operations',
      totalAmount: 890000,
      totalRecipients: 32,
      successfulCount: 28,
      failedCount: 4,
      pendingCount: 0,
      status: 'completed',
      progress: 100,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      completedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      processedBy: 'Jane Smith',
      items: [],
    },
    {
      id: '3',
      batchNumber: 'BATCH-2026-003',
      department: 'Field Operations',
      totalAmount: 2100000,
      totalRecipients: 78,
      successfulCount: 65,
      failedCount: 8,
      pendingCount: 5,
      status: 'processing',
      progress: 85,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      processedBy: 'Mike Johnson',
      items: [],
    },
    {
      id: '4',
      batchNumber: 'BATCH-2026-004',
      department: 'HR',
      totalAmount: 450000,
      totalRecipients: 18,
      successfulCount: 0,
      failedCount: 0,
      pendingCount: 18,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString(),
      processedBy: 'Sarah Williams',
      items: [],
    },
    {
      id: '5',
      batchNumber: 'BATCH-2026-005',
      department: 'IT',
      totalAmount: 680000,
      totalRecipients: 24,
      successfulCount: 15,
      failedCount: 9,
      pendingCount: 0,
      status: 'partial',
      progress: 62,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      processedBy: 'David Brown',
      failureReason: 'Some recipients had invalid account details',
      items: [
        { id: 'i4', recipientName: 'Alice Wonder', recipientPhone: '+265 999 111 222', amount: 35000, status: 'failed', retryCount: 1, errorMessage: 'Account not found' },
        { id: 'i5', recipientName: 'Bob Marley', recipientPhone: '+265 888 333 444', amount: 42000, status: 'failed', retryCount: 1, errorMessage: 'Insufficient funds' },
      ],
    },
  ];
};

const getMockSummary = (batches: Batch[]): BatchSummary => {
  const totalAmount = batches.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalRecipients = batches.reduce((sum, b) => sum + b.totalRecipients, 0);
  const successfulRecipients = batches.reduce((sum, b) => sum + b.successfulCount, 0);
  const totalProcessed = batches.reduce((sum, b) => sum + b.successfulCount + b.failedCount, 0);
  
  return {
    totalBatches: batches.length,
    totalAmount,
    totalRecipients,
    successRate: totalProcessed > 0 ? (successfulRecipients / totalProcessed) * 100 : 0,
    pendingBatches: batches.filter(b => b.status === 'pending').length,
    processingBatches: batches.filter(b => b.status === 'processing').length,
    completedBatches: batches.filter(b => b.status === 'completed').length,
    failedBatches: batches.filter(b => b.status === 'failed').length,
  };
};

export default function BatchesPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<Batch[]>([]);
  const [summary, setSummary] = useState<BatchSummary | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<BatchStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(true);
  const [statusCounts, setStatusCounts] = useState<Record<BatchStatus, number>>({
    all: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    partial: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterBatches();
  }, [batches, selectedStatus, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const mockData = getMockBatches();
      setBatches(mockData);
      setFilteredBatches(mockData);
      setSummary(getMockSummary(mockData));
      updateStatusCounts(mockData);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load batches:', error);
      toast.error('Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  const updateStatusCounts = (batchesList: Batch[]) => {
    const counts: Record<BatchStatus, number> = {
      all: batchesList.length,
      pending: batchesList.filter(b => b.status === 'pending').length,
      processing: batchesList.filter(b => b.status === 'processing').length,
      completed: batchesList.filter(b => b.status === 'completed').length,
      failed: batchesList.filter(b => b.status === 'failed').length,
      partial: batchesList.filter(b => b.status === 'partial').length,
    };
    setStatusCounts(counts);
  };

  const filterBatches = () => {
    let filtered = [...batches];
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((batch) => batch.status === selectedStatus);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (batch) =>
          batch.batchNumber.toLowerCase().includes(query) ||
          batch.department.toLowerCase().includes(query) ||
          batch.processedBy.toLowerCase().includes(query)
      );
    }
    
    setFilteredBatches(filtered);
    updateStatusCounts(filtered);
  };

  const handleViewDetails = (batchId: string) => {
    router.push(`/finance/disbursements/batches/${batchId}`);
  };

  const handleRetryFailed = (batchId: string) => {
    toast.success(`Retrying failed payments for batch ${batchId} (demo)`);
    // In real app, would call API to retry
  };

  const handleDownloadReport = (batchId: string) => {
    toast.info(`Downloading report for batch ${batchId} (demo)`);
  };

  const handleRefresh = () => {
    loadData();
    toast.success('Data refreshed');
  };

  const summaryCards = [
    {
      title: 'Total Batches',
      value: summary?.totalBatches || 0,
      icon: TrendingUp,
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Total Amount',
      value: formatCurrency(summary?.totalAmount || 0),
      icon: DollarSign,
      color: 'text-[#84cc16]',
      bg: 'bg-[#84cc16]/10',
    },
    {
      title: 'Total Recipients',
      value: summary?.totalRecipients || 0,
      icon: Users,
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Success Rate',
      value: `${summary?.successRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/20',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">Loading batches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Batch Processing</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Monitor and manage disbursement batches
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Demo Mode Notice */}
      {useMockData && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ℹ️ Demo Mode - Using sample data. Connect to backend for live data.
          </p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-xl p-4 border transition-all hover:shadow-md"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <Icon size={16} className={card.color} />
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{card.title}</p>
              <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Status Filter */}
      <BatchStatusFilter
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        counts={statusCounts}
      />

      {/* Search Bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="text"
          placeholder="Search by batch number, department, or processed by..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Batches List */}
      {filteredBatches.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <TrendingUp size={32} className="text-[var(--text-secondary)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Batches Found</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {searchQuery || selectedStatus !== 'all'
              ? 'Try adjusting your filters or search criteria'
              : 'No batches have been created yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBatches.map((batch) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              onViewDetails={handleViewDetails}
              onRetryFailed={handleRetryFailed}
              onDownloadReport={handleDownloadReport}
            />
          ))}
        </div>
      )}
    </div>
  );
}