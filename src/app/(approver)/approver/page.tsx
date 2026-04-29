'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Users, TrendingUp, Clock, RefreshCw, MapPin } from 'lucide-react';
import { PendingRequestsCard } from '@/components/approver/PendingRequestsCard';
import { EventsMapView } from '@/components/approver/EventsMapView';
import { TeamSummaryTable } from '@/components/approver/TeamSummaryTable';
import { RecentDecisionsFeed } from '@/components/approver/RecentDecisionsFeed';
import { ApprovalRateChart } from '@/components/approver/ApprovalRateChart';
import { DashboardData } from '@/types/rejected.ts/dashboard';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const getMockDashboardData = (): DashboardData => ({
  stats: {
    urgencyCounts: { high: 8, medium: 12, low: 5, total: 25 },
    approvalRate: 68,
    totalDecisions: 156,
    averageResponseTime: 24.5,
  },
  pendingRequests: [],
  teamMembers: [
    {
      id: '1',
      name: 'Jane Mbalame',
      role: 'Finance Manager',
      department: 'Finance',
      pendingCount: 5,
      approvedCount: 45,
      rejectedCount: 8,
      approvalRate: 85,
    },
    {
      id: '2',
      name: 'Peter Kumwenda',
      role: 'Department Head',
      department: 'Operations',
      pendingCount: 8,
      approvedCount: 32,
      rejectedCount: 12,
      approvalRate: 73,
    },
    {
      id: '3',
      name: 'Mary Phiri',
      role: 'Finance Officer',
      department: 'Finance',
      pendingCount: 3,
      approvedCount: 28,
      rejectedCount: 5,
      approvalRate: 85,
    },
    {
      id: '4',
      name: 'James Banda',
      role: 'Team Lead',
      department: 'Field Operations',
      pendingCount: 6,
      approvedCount: 38,
      rejectedCount: 10,
      approvalRate: 79,
    },
    {
      id: '5',
      name: 'Lucy Chawinga',
      role: 'Senior Manager',
      department: 'Administration',
      pendingCount: 3,
      approvedCount: 52,
      rejectedCount: 6,
      approvalRate: 90,
    },
  ],
  recentDecisions: [
    {
      id: '1',
      requestNumber: 'DSA-2024-001',
      employeeName: 'John Doe',
      destination: 'Lilongwe',
      amount: 45000,
      decision: 'approved',
      decidedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
      id: '2',
      requestNumber: 'DSA-2024-002',
      employeeName: 'Jane Smith',
      destination: 'Blantyre',
      amount: 38000,
      decision: 'approved',
      decidedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    },
    {
      id: '3',
      requestNumber: 'DSA-2024-003',
      employeeName: 'Mike Johnson',
      destination: 'Mzuzu',
      amount: 52000,
      decision: 'rejected',
      decidedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      comments: 'Missing travel authorization',
    },
    {
      id: '4',
      requestNumber: 'DSA-2024-004',
      employeeName: 'Sarah Williams',
      destination: 'Lilongwe',
      amount: 41000,
      decision: 'approved',
      decidedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: '5',
      requestNumber: 'DSA-2024-005',
      employeeName: 'David Brown',
      destination: 'Zomba',
      amount: 35000,
      decision: 'approved',
      decidedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  ],
  regionEvents: [
    {
      id: '1',
      name: 'Lilongwe Office',
      region: 'Lilongwe',
      latitude: -13.9833,
      longitude: 33.7833,
      requestCount: 25,
      pendingCount: 8,
    },
    {
      id: '2',
      name: 'Blantyre Office',
      region: 'Blantyre',
      latitude: -15.7861,
      longitude: 35.0058,
      requestCount: 18,
      pendingCount: 5,
    },
    {
      id: '3',
      name: 'Mzuzu Office',
      region: 'Mzuzu',
      latitude: -11.4656,
      longitude: 34.0207,
      requestCount: 12,
      pendingCount: 4,
    },
    {
      id: '4',
      name: 'Zomba Office',
      region: 'Zomba',
      latitude: -15.3767,
      longitude: 35.3356,
      requestCount: 8,
      pendingCount: 2,
    },
    {
      id: '5',
      name: 'Mangochi Office',
      region: 'Mangochi',
      latitude: -14.4783,
      longitude: 35.2645,
      requestCount: 6,
      pendingCount: 2,
    },
  ],
});

export default function ApproverDashboardPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [useMockData, setUseMockData] = useState(true);

  const loadData = useCallback(async () => {
    try {
      // Using mock data for development
      const mockData = getMockDashboardData();
      setData(mockData);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
      const mockData = getMockDashboardData();
      setData(mockData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleViewDecisionDetails = (decisionId: string) => {
    router.push(`/approver/requests/${decisionId}`);
  };

  if (loading && !data) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Approver Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage and track DSA requests across your team
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
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

      {/* Pending Requests Cards */}
      {data && <PendingRequestsCard counts={data.stats.urgencyCounts} loading={loading} />}

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Events Map View */}
        {data && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-[#84cc16]" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Requests by Region
              </h2>
            </div>
            <EventsMapView events={data.regionEvents} loading={loading} />
          </div>
        )}

        {/* Approval Rate Chart */}
        {data && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-[#84cc16]" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Approval Performance
              </h2>
            </div>
            <div
              className="rounded-xl p-5 border text-center"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <ApprovalRateChart
                approvalRate={data.stats.approvalRate}
                totalDecisions={data.stats.totalDecisions}
                loading={loading}
              />
              <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Avg Response Time</span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    {data.stats.averageResponseTime} hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Team Summary Table */}
      {data && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-[#84cc16]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Team Performance</h2>
          </div>
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <TeamSummaryTable members={data.teamMembers} loading={loading} />
          </div>
        </div>
      )}

      {/* Recent Decisions Feed */}
      {data && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-[#84cc16]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Decisions</h2>
          </div>
          <div
            className="rounded-xl border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <RecentDecisionsFeed
              decisions={data.recentDecisions}
              loading={loading}
              onViewDetails={handleViewDecisionDetails}
            />
          </div>
        </div>
      )}
    </div>
  );
}
