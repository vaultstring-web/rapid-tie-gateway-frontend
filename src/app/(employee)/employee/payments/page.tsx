'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Calendar, DollarSign } from 'lucide-react';
import { PaymentStatsCards } from '@/components/employee/payments/PaymentStatsCards';
import { PaymentsTable } from '@/components/employee/payments/PaymentsTable';
import { PaymentFilterBar } from '@/components/employee/payments/PaymentFilterBar';
import { PaymentDetailModal } from '@/components/employee/payments/PaymentDetailModal';
import { paymentsService } from '@/services/employee/payments.service';
import { Payment, PaymentFilter, PaymentStats } from '@/types/employee/payments';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const getMockPayments = (): Payment[] => {
  const types = ['dsa', 'salary', 'reimbursement', 'bonus'];
  const statuses = ['pending', 'processing', 'completed', 'failed'];
  const methods = ['bank_transfer', 'airtel_money', 'tnm_mpamba', 'cash'];
  const destinations = ['Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba'];
  
  return Array.from({ length: 15 }, (_, i) => ({
    id: `pay-${i + 1}`,
    transactionId: `TXN-${String(i + 1).padStart(8, '0')}`,
    reference: `PAY-${String(i + 1).padStart(6, '0')}`,
    requestId: i % 3 === 0 ? `req-${i + 1}` : undefined,
    requestNumber: i % 3 === 0 ? `DSA-2024-${String(i + 1).padStart(3, '0')}` : undefined,
    amount: [50000, 75000, 100000, 150000, 250000][i % 5],
    currency: 'MWK',
    type: types[i % types.length] as any,
    status: statuses[i % statuses.length] as any,
    paymentMethod: methods[i % methods.length] as any,
    recipientName: 'John Doe',
    recipientAccount: i % 2 === 0 ? `1000${String(i + 1).padStart(8, '0')}` : undefined,
    recipientPhone: i % 2 === 1 ? `0999${String(i + 100).padStart(6, '0')}` : undefined,
    destination: i % 2 === 0 ? destinations[i % destinations.length] : undefined,
    purpose: i % 3 === 0 ? 'Conference Attendance' : undefined,
    notes: i % 5 === 0 ? 'Special processing required' : undefined,
    processedAt: new Date(Date.now() - i * 86400000).toISOString(),
    completedAt: i % 3 !== 1 ? new Date(Date.now() - i * 86400000 + 3600000).toISOString() : undefined,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));
};

const getMockStats = (): PaymentStats => {
  const payments = getMockPayments();
  return {
    totalPayments: payments.length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    averageAmount: payments.reduce((sum, p) => sum + p.amount, 0) / payments.length,
    completedPayments: payments.filter(p => p.status === 'completed').length,
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    failedPayments: payments.filter(p => p.status === 'failed').length,
    lastPaymentDate: payments[0]?.processedAt,
  };
};

export default function PaymentHistoryPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [filters, setFilters] = useState<PaymentFilter>({
    search: '',
    type: '',
    status: '',
    paymentMethod: '',
  });
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      let mockPayments = getMockPayments();
      const mockStats = getMockStats();
      
      // Apply filters
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        mockPayments = mockPayments.filter(p =>
          p.reference.toLowerCase().includes(searchLower) ||
          (p.requestNumber && p.requestNumber.toLowerCase().includes(searchLower))
        );
      }
      if (filters.type) {
        mockPayments = mockPayments.filter(p => p.type === filters.type);
      }
      if (filters.status) {
        mockPayments = mockPayments.filter(p => p.status === filters.status);
      }
      if (filters.paymentMethod) {
        mockPayments = mockPayments.filter(p => p.paymentMethod === filters.paymentMethod);
      }
      if (filters.dateFrom) {
        mockPayments = mockPayments.filter(p => p.processedAt >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        mockPayments = mockPayments.filter(p => p.processedAt <= filters.dateTo!);
      }
      if (filters.minAmount) {
        mockPayments = mockPayments.filter(p => p.amount >= filters.minAmount!);
      }
      if (filters.maxAmount) {
        mockPayments = mockPayments.filter(p => p.amount <= filters.maxAmount!);
      }
      
      setPayments(mockPayments);
      setStats(mockStats);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load payments:', error);
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<PaymentFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: '',
      status: '',
      paymentMethod: '',
    });
  };

  const handleExport = async () => {
    if (useMockData) {
      toast.info('Demo: Exporting payments...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Payments exported (demo)');
      return;
    }
    try {
      const blob = await paymentsService.exportPayments('csv', filters);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Payments exported');
    } catch (error) {
      toast.error('Failed to export payments');
    }
  };

  const handleDownloadReceipt = async (paymentId: string) => {
    if (useMockData) {
      toast.info('Demo: Downloading receipt...');
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Receipt downloaded (demo)');
      return;
    }
    try {
      const blob = await paymentsService.downloadReceipt(paymentId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Receipt downloaded');
    } catch (error) {
      toast.error('Failed to download receipt');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Payment History</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          View and track all your payments and disbursements
        </p>
      </div>

      {/* Demo Mode Notice */}
      {useMockData && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ℹ️ Demo Mode - Using sample payment data. Connect to backend for live payment history.
          </p>
        </div>
      )}

      {/* Stats Cards */}
      {stats && <PaymentStatsCards stats={stats} loading={loading} />}

      {/* Filters */}
      <PaymentFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onExport={handleExport}
      />

      {/* Payments Table */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-color)]">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Payment Records</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { loadData(); toast.success('Data refreshed'); }}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Refresh"
              >
                <RefreshCw size={16} className="text-[var(--text-secondary)]" />
              </button>
              <p className="text-sm text-[var(--text-secondary)]">{payments.length} records</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <PaymentsTable
            payments={payments}
            loading={loading}
            onViewDetails={setSelectedPayment}
            onDownloadReceipt={handleDownloadReceipt}
          />
        </div>
      </div>

      {/* Payment Detail Modal */}
      <PaymentDetailModal
        payment={selectedPayment}
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        onDownloadReceipt={handleDownloadReceipt}
      />
    </div>
  );
}