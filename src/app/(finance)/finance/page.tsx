'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Download,
  Calendar
} from 'lucide-react';
import { BudgetUtilizationChart } from '@/components/finance/BudgetUtilizationChart';
import { EventSpendingTrend } from '@/components/finance/EventSpendingTrend';
import { ReconciliationStatusCard } from '@/components/finance/ReconciliationStatusCard';
import { RecentBatchesTable } from '@/components/finance/RecentBatchesTable';
import { 
  DepartmentBudget, 
  EventSpending, 
  PendingDisbursement,
  ReconciliationStatus,
  RecentBatch,
  FinanceSummary,
  DEPARTMENT_COLORS
} from '@/types/finance/dashboard';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data
const getMockDepartmentBudgets = (): DepartmentBudget[] => {
  return [
    { department: 'Finance', allocated: 2500000, spent: 1850000, committed: 320000, remaining: 330000, percentageUsed: 74, color: DEPARTMENT_COLORS.Finance },
    { department: 'Operations', allocated: 1800000, spent: 1560000, committed: 180000, remaining: 60000, percentageUsed: 87, color: DEPARTMENT_COLORS.Operations },
    { department: 'Field Operations', allocated: 3200000, spent: 2450000, committed: 450000, remaining: 300000, percentageUsed: 77, color: DEPARTMENT_COLORS['Field Operations'] },
    { department: 'HR', allocated: 1200000, spent: 890000, committed: 110000, remaining: 200000, percentageUsed: 74, color: DEPARTMENT_COLORS.HR },
    { department: 'IT', allocated: 1500000, spent: 920000, committed: 280000, remaining: 300000, percentageUsed: 61, color: DEPARTMENT_COLORS.IT },
    { department: 'Sales', allocated: 800000, spent: 650000, committed: 50000, remaining: 100000, percentageUsed: 81, color: DEPARTMENT_COLORS.Sales },
    { department: 'Marketing', allocated: 1000000, spent: 780000, committed: 120000, remaining: 100000, percentageUsed: 78, color: DEPARTMENT_COLORS.Marketing },
    { department: 'Administration', allocated: 600000, spent: 450000, committed: 80000, remaining: 70000, percentageUsed: 75, color: DEPARTMENT_COLORS.Administration },
  ];
};

const getMockEventSpending = (): EventSpending[] => {
  return [
    { month: 'Jan', eventSpending: 45000, regularSpending: 455000, total: 500000 },
    { month: 'Feb', eventSpending: 68000, regularSpending: 502000, total: 570000 },
    { month: 'Mar', eventSpending: 120000, regularSpending: 480000, total: 600000 },
    { month: 'Apr', eventSpending: 85000, regularSpending: 515000, total: 600000 },
    { month: 'May', eventSpending: 95000, regularSpending: 555000, total: 650000 },
    { month: 'Jun', eventSpending: 150000, regularSpending: 550000, total: 700000 },
  ];
};

const getMockPendingDisbursements = (): PendingDisbursement[] => {
  return [
    { id: '1', batchNumber: 'BATCH-001', department: 'Finance', amount: 250000, recipientCount: 12, submittedAt: new Date().toISOString(), priority: 'high', status: 'pending' },
    { id: '2', batchNumber: 'BATCH-002', department: 'Operations', amount: 180000, recipientCount: 8, submittedAt: new Date().toISOString(), priority: 'medium', status: 'processing' },
    { id: '3', batchNumber: 'BATCH-003', department: 'Field Operations', amount: 320000, recipientCount: 15, submittedAt: new Date().toISOString(), priority: 'high', status: 'pending' },
    { id: '4', batchNumber: 'BATCH-004', department: 'HR', amount: 95000, recipientCount: 5, submittedAt: new Date().toISOString(), priority: 'low', status: 'pending' },
    { id: '5', batchNumber: 'BATCH-005', department: 'IT', amount: 150000, recipientCount: 7, submittedAt: new Date().toISOString(), priority: 'medium', status: 'processing' },
  ];
};

const getMockReconciliationStatus = (): ReconciliationStatus[] => {
  return [
    { id: '1', period: 'Q1 2026', totalTransactions: 1250, matchedCount: 1180, unmatchedCount: 70, amountMatched: 2850000, amountUnmatched: 150000, status: 'completed', lastUpdated: new Date().toISOString() },
    { id: '2', period: 'Q2 2026', totalTransactions: 1340, matchedCount: 1280, unmatchedCount: 60, amountMatched: 3120000, amountUnmatched: 180000, status: 'in_progress', lastUpdated: new Date().toISOString() },
    { id: '3', period: 'June 2026', totalTransactions: 450, matchedCount: 420, unmatchedCount: 30, amountMatched: 980000, amountUnmatched: 45000, status: 'pending', lastUpdated: new Date().toISOString() },
  ];
};

const getMockRecentBatches = (): RecentBatch[] => {
  return [
    { id: '1', batchNumber: 'BATCH-2026-001', department: 'Finance', totalAmount: 1250000, recipientCount: 45, status: 'completed', createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), processedBy: 'John Doe' },
    { id: '2', batchNumber: 'BATCH-2026-002', department: 'Operations', totalAmount: 890000, recipientCount: 32, status: 'completed', createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), processedBy: 'Jane Smith' },
    { id: '3', batchNumber: 'BATCH-2026-003', department: 'Field Operations', totalAmount: 2100000, recipientCount: 78, status: 'processing', createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), processedBy: 'Mike Johnson' },
    { id: '4', batchNumber: 'BATCH-2026-004', department: 'HR', totalAmount: 450000, recipientCount: 18, status: 'pending', createdAt: new Date().toISOString(), processedBy: 'Sarah Williams' },
    { id: '5', batchNumber: 'BATCH-2026-005', department: 'IT', totalAmount: 680000, recipientCount: 24, status: 'completed', createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), processedBy: 'David Brown' },
  ];
};

const getMockSummary = (): FinanceSummary => {
  const budgets = getMockDepartmentBudgets();
  const totalBudget = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalCommitted = budgets.reduce((sum, b) => sum + b.committed, 0);
  const pending = getMockPendingDisbursements();
  
  return {
    totalBudget,
    totalSpent,
    totalCommitted,
    remainingBudget: totalBudget - totalSpent - totalCommitted,
    budgetUtilization: (totalSpent / totalBudget) * 100,
    pendingDisbursements: pending.length,
    pendingAmount: pending.reduce((sum, p) => sum + p.amount, 0),
    completedDisbursements: 42,
    completedAmount: 8750000,
    reconciliationRate: 92.5,
  };
};

export default function FinanceDashboardPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [budgetData, setBudgetData] = useState<DepartmentBudget[]>([]);
  const [eventData, setEventData] = useState<EventSpending[]>([]);
  const [pendingData, setPendingData] = useState<PendingDisbursement[]>([]);
  const [reconciliationData, setReconciliationData] = useState<ReconciliationStatus[]>([]);
  const [recentBatches, setRecentBatches] = useState<RecentBatch[]>([]);
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      setBudgetData(getMockDepartmentBudgets());
      setEventData(getMockEventSpending());
      setPendingData(getMockPendingDisbursements());
      setReconciliationData(getMockReconciliationStatus());
      setRecentBatches(getMockRecentBatches());
      setSummary(getMockSummary());
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load finance data:', error);
      toast.error('Failed to load finance data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadData();
    toast.success('Data refreshed');
  };

  const handleExport = () => {
    toast.info('Exporting financial report... (demo)');
  };

  const summaryCards = [
    {
      title: 'Total Budget',
      value: formatCurrency(summary?.totalBudget || 0),
      icon: DollarSign,
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Budget Utilization',
      value: `${summary?.budgetUtilization.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-[#84cc16]',
      bg: 'bg-[#84cc16]/10',
    },
    {
      title: 'Pending Disbursements',
      value: summary?.pendingDisbursements || 0,
      subValue: formatCurrency(summary?.pendingAmount || 0),
      icon: Clock,
      color: 'text-yellow-500',
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      title: 'Completed Amount',
      value: formatCurrency(summary?.completedAmount || 0),
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Finance Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Budget tracking, disbursement monitoring, and financial reconciliation
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <Download size={16} />
            Export Report
          </button>
        </div>
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
              <p className="text-xl font-bold text-[var(--text-primary)] mt-1">{card.value}</p>
              {card.subValue && (
                <p className="text-xs text-[var(--text-secondary)] mt-1">{card.subValue}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Budget Utilization Chart */}
        <div
          className="rounded-xl p-5 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-[#84cc16]" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Budget Utilization by Department</h2>
            </div>
            <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
              <AlertCircle size={12} />
              <span>Red = Over 90%</span>
            </div>
          </div>
          <BudgetUtilizationChart data={budgetData} loading={loading} />
        </div>

        {/* Event Spending Trend */}
        <div
          className="rounded-xl p-5 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-[#84cc16]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Event Spending Trend</h2>
          </div>
          <EventSpendingTrend data={eventData} loading={loading} />
        </div>
      </div>

      {/* Pending Disbursements & Reconciliation */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Disbursements List */}
        <div
          className="lg:col-span-1 rounded-xl border overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="px-5 py-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-yellow-500" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Pending Disbursements</h2>
            </div>
            <span className="text-sm font-bold text-yellow-500">{pendingData.length}</span>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {pendingData.map((item) => (
              <div key={item.id} className="p-4 hover:bg-[var(--hover-bg)] transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{item.batchNumber}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{item.department}</p>
                  </div>
                  <div className={`text-xs px-2 py-0.5 rounded-full ${
                    item.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                    item.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                    'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  }`}>
                    {item.priority}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-[#84cc16]">{formatCurrency(item.amount)}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{item.recipientCount} recipients</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t text-center" style={{ borderColor: 'var(--border-color)' }}>
            <button
              onClick={() => router.push('/finance/disbursements/ready')}
              className="text-sm text-[#84cc16] hover:underline"
            >
              View All Pending →
            </button>
          </div>
        </div>

        {/* Reconciliation Status Cards */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={18} className="text-[#84cc16]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Reconciliation Status</h2>
          </div>
          <ReconciliationStatusCard status={reconciliationData} loading={loading} onRefresh={handleRefresh} />
        </div>
      </div>

      {/* Recent Batches Table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-[#84cc16]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Disbursement Batches</h2>
          </div>
        </div>
        <RecentBatchesTable
          batches={recentBatches}
          loading={loading}
          onViewDetails={(id) => router.push(`/finance/disbursements/batches/${id}`)}
          onDownloadReport={(id) => toast.info(`Downloading report for batch ${id} (demo)`)}
        />
      </div>
    </div>
  );
}