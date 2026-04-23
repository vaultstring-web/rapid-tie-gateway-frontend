'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, TrendingUp, Users, Ticket, DollarSign, RefreshCw } from 'lucide-react';
import { LiveSalesCounter } from '@/components/organizer/sales/LiveSalesCounter';
import { RevenueChart } from '@/components/organizer/sales/RevenueChart';
import { AudienceBreakdown } from '@/components/organizer/sales/AudienceBreakdown';
import { SalesByTier } from '@/components/organizer/sales/SalesByTier';
import { RecentOrdersFeed } from '@/components/organizer/sales/RecentOrdersFeed';
import { salesDashboardService } from '@/services/organizer/salesDashboard.service';
import { SalesDashboardData, SalesMetrics, RevenueData, SalesByTier as SalesByTierType, AudienceBreakdown as AudienceBreakdownType, RecentOrder } from '@/types/organizer/salesDashboard';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const getMockSalesData = (): SalesDashboardData => {
  const now = new Date();
  const revenueHistory: RevenueData[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    revenueHistory.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Math.floor(Math.random() * 500000) + 100000,
      tickets: Math.floor(Math.random() * 100) + 20,
      refunds: Math.floor(Math.random() * 5000),
    });
  }

  return {
    metrics: {
      totalRevenue: 12500000,
      totalTicketsSold: 1250,
      totalAttendees: 1180,
      averageTicketPrice: 10000,
      revenueChange: 12.5,
      ticketsSoldChange: 8.3,
      capacityPercentage: 78,
      targetProgress: 65,
    },
    revenueHistory,
    salesByTier: [
      { tierId: '1', tierName: 'VIP', sold: 150, quantity: 200, revenue: 7500000, price: 50000, percentage: 75 },
      { tierId: '2', tierName: 'General Admission', sold: 800, quantity: 1000, revenue: 4000000, price: 5000, percentage: 80 },
      { tierId: '3', tierName: 'Early Bird', sold: 200, quantity: 250, revenue: 1000000, price: 5000, percentage: 80 },
      { tierId: '4', tierName: 'Group Ticket', sold: 100, quantity: 150, revenue: 0, price: 0, percentage: 0 },
    ],
    audienceBreakdown: [
      { role: 'MERCHANT', count: 450, percentage: 36, color: '#10b981' },
      { role: 'ORGANIZER', count: 120, percentage: 9.6, color: '#3b82f6' },
      { role: 'EMPLOYEE', count: 300, percentage: 24, color: '#8b5cf6' },
      { role: 'APPROVER', count: 80, percentage: 6.4, color: '#f59e0b' },
      { role: 'FINANCE_OFFICER', count: 50, percentage: 4, color: '#06b6d4' },
      { role: 'ADMIN', count: 10, percentage: 0.8, color: '#ef4444' },
      { role: 'PUBLIC', count: 240, percentage: 19.2, color: '#6b7280' },
    ],
    recentOrders: [
      {
        id: '1',
        orderNumber: 'ORD-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        tierName: 'VIP',
        quantity: 2,
        amount: 100000,
        status: 'completed',
        purchasedAt: new Date().toISOString(),
      },
      {
        id: '2',
        orderNumber: 'ORD-002',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        tierName: 'General Admission',
        quantity: 4,
        amount: 20000,
        status: 'completed',
        purchasedAt: new Date().toISOString(),
      },
      {
        id: '3',
        orderNumber: 'ORD-003',
        customerName: 'Mike Johnson',
        customerEmail: 'mike@example.com',
        tierName: 'Early Bird',
        quantity: 1,
        amount: 5000,
        status: 'pending',
        purchasedAt: new Date().toISOString(),
      },
    ],
    lastUpdated: new Date().toISOString(),
  };
};

export default function SalesDashboardPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [data, setData] = useState<SalesDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [useMockData, setUseMockData] = useState(false);

  const loadData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      let salesData: SalesDashboardData;
      try {
        salesData = await salesDashboardService.getSalesData(eventId);
        setUseMockData(false);
      } catch (error) {
        console.warn('Failed to fetch from API, using mock data:', error);
        salesData = getMockSalesData();
        setUseMockData(true);
        toast.error('Using demo data - backend not available');
      }
      setData(salesData);
      setLastUpdated(salesData.lastUpdated);
    } catch (error) {
      console.error('Failed to load sales data:', error);
      // Fallback to mock data
      const mockData = getMockSalesData();
      setData(mockData);
      setLastUpdated(mockData.lastUpdated);
      setUseMockData(true);
      toast.error('Failed to load sales data - using demo data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (!useMockData) {
        loadData(true);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [loadData, useMockData]);

  const handleExport = async (format: 'csv' | 'excel') => {
    if (useMockData) {
      toast.info('Export not available in demo mode');
      return;
    }
    try {
      const blob = await salesDashboardService.exportSalesReport(eventId, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-report-${eventId}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading sales data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Unable to load sales data.</p>
          <button
            onClick={() => loadData()}
            className="px-4 py-2 rounded-lg bg-primary-green-500 text-white hover:bg-primary-green-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Sales Dashboard
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Live sales tracking and analytics
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Demo Mode Notice */}
        {useMockData && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              ⚠️ Demo Mode - Using sample data. Connect to backend for live data.
            </p>
          </div>
        )}

        {/* Last Updated */}
        <p className="text-xs text-right mb-4" style={{ color: 'var(--text-secondary)' }}>
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </p>

        {/* Live Sales Counter */}
        <div className="mb-6">
          <LiveSalesCounter metrics={data.metrics} loading={loading} />
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <div
            className="rounded-xl p-5 border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <TrendingUp size={18} />
              Revenue & Ticket Trends
            </h2>
            <RevenueChart data={data.revenueHistory} loading={loading} />
          </div>

          {/* Audience Breakdown */}
          <div
            className="rounded-xl p-5 border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Users size={18} />
              Audience Breakdown by Role
            </h2>
            <AudienceBreakdown data={data.audienceBreakdown} loading={loading} />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sales by Tier */}
          <div
            className="lg:col-span-2 rounded-xl p-5 border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Ticket size={18} />
              Sales by Ticket Tier
            </h2>
            <SalesByTier data={data.salesByTier} loading={loading} />
          </div>

          {/* Recent Orders Feed */}
          <div
            className="rounded-xl p-5 border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <RecentOrdersFeed
              orders={data.recentOrders}
              loading={loading}
              onRefresh={() => loadData(true)}
            />
          </div>
        </div>

        {/* Auto-refresh Notice */}
        <p className="text-xs text-center mt-6" style={{ color: 'var(--text-secondary)' }}>
          Data auto-refreshes every 30 seconds
        </p>
      </div>
    </div>
  );
}