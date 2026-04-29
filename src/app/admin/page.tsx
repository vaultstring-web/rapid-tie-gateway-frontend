'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Activity, Calendar, DollarSign, Users, AlertCircle } from 'lucide-react';
import { SystemStatusIndicators } from '@/components/admin/SystemStatus';
import { EventPlatformHealth } from '@/components/admin/EventPlatformHealth';
import { TransactionVolumeChart } from '@/components/admin/TransactionVolumeChart';
import { ActiveUsers } from '@/components/admin/ActiveUsers';
import { RecentErrorsList } from '@/components/admin/RecentErrorsList';
import { adminService } from '@/services/admin/admin.service';
import { AdminDashboardData } from '@/types/admin';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const getMockDashboardData = (): AdminDashboardData => {
  return {
    systemStatus: {
      database: { status: 'healthy', latency: 12, connections: 45 },
      redis: { status: 'healthy', memory: 256 * 1024 * 1024, hitRate: 98.5 },
      api: { status: 'healthy', uptime: 86400 * 14, responseTime: 45 },
      websocket: { status: 'healthy', connections: 1234 },
    },
    eventMetrics: {
      totalEvents: 234,
      activeEvents: 56,
      totalTicketsSold: 12580,
      totalRevenue: 452000000,
      averageAttendance: 78,
      conversionRate: 24.5,
      eventsByStatus: {
        draft: 23,
        published: 56,
        completed: 145,
        cancelled: 10,
      },
    },
    transactionHistory: [
      { date: 'Mon', count: 245, amount: 1250000 },
      { date: 'Tue', count: 312, amount: 1580000 },
      { date: 'Wed', count: 289, amount: 1420000 },
      { date: 'Thu', count: 356, amount: 1780000 },
      { date: 'Fri', count: 423, amount: 2150000 },
      { date: 'Sat', count: 398, amount: 1980000 },
      { date: 'Sun', count: 367, amount: 1820000 },
    ],
    userStats: {
      total: 12580,
      active: 3450,
      newToday: 128,
      byRole: {
        MERCHANT: 4500,
        ORGANIZER: 2340,
        EMPLOYEE: 3250,
        APPROVER: 890,
        FINANCE_OFFICER: 450,
        ADMIN: 25,
        COMPLIANCE: 125,
      },
    },
    recentErrors: [
      {
        id: '1',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        level: 'error',
        message: 'Payment gateway timeout on order #ORD-12345',
        source: 'Payment Service',
        resolved: false,
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        level: 'warning',
        message: 'High memory usage detected on main database',
        source: 'Database',
        resolved: false,
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        level: 'info',
        message: 'Scheduled maintenance completed',
        source: 'System',
        resolved: true,
      },
    ],
    lastUpdated: new Date().toISOString(),
  };
};

function AdminOverviewContent() {
  const { theme } = useTheme();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const mockData = getMockDashboardData();
      setData(mockData);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast.error('Failed to load dashboard data');
      const mockData = getMockDashboardData();
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    toast.success('Dashboard refreshed');
  };

  const handleResolveError = async (errorId: string) => {
    if (useMockData) {
      setData(prev => prev ? {
        ...prev,
        recentErrors: prev.recentErrors.map(e =>
          e.id === errorId ? { ...e, resolved: true } : e
        ),
      } : null);
      toast.success('Error marked as resolved');
      return;
    }
    
    try {
      await adminService.resolveError(errorId);
      toast.success('Error resolved');
      loadData();
    } catch (error) {
      toast.error('Failed to resolve error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[var(--text-secondary)]">Failed to load dashboard data</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 rounded-lg bg-[#84cc16] text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Overview</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Monitor system health and platform performance
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
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

      {/* System Status Indicators */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
          <Activity size={20} className="text-[#84cc16]" />
          System Status
        </h2>
        <SystemStatusIndicators status={data.systemStatus} loading={loading} />
      </div>

      {/* Event Platform Health */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
          <Calendar size={20} className="text-[#84cc16]" />
          Event Platform Health
        </h2>
        <EventPlatformHealth metrics={data.eventMetrics} loading={loading} />
      </div>

      {/* Transaction Volume Chart */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
          <DollarSign size={20} className="text-[#84cc16]" />
          Transaction Volume (Last 7 Days)
        </h2>
        <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <TransactionVolumeChart data={data.transactionHistory} loading={loading} />
        </div>
      </div>

      {/* Active Users */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
          <Users size={20} className="text-[#84cc16]" />
          User Analytics
        </h2>
        <ActiveUsers stats={data.userStats} loading={loading} />
      </div>

      {/* Recent Errors */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
          <AlertCircle size={20} className="text-[#84cc16]" />
          Recent Errors
        </h2>
        <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <RecentErrorsList errors={data.recentErrors} loading={loading} onResolve={handleResolveError} />
        </div>
      </div>

      {/* Last Updated */}
      <p className="text-xs text-center text-[var(--text-secondary)] pt-4">
        Last updated: {new Date(data.lastUpdated).toLocaleString()}
      </p>
    </div>
  );
}

export default function AdminOverviewPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <AdminOverviewContent />;
}