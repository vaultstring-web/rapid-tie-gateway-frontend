'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Trophy
} from 'lucide-react';
import { ApprovalTrendChart } from '@/components/approver/ApprovalTrendChart';
import { WorkloadDistributionChart } from '@/components/approver/WorkloadDistributionChart';
import { DepartmentPerformanceChart } from '@/components/approver/DepartmentPerformanceChart';
import { TopApproversTable } from '@/components/approver/TopApproversTable';
import { 
  MonthlyTrend, 
  WorkloadData, 
  DepartmentPerformance, 
  TopApprover,
  AnalyticsSummary,
  PeakHoursData
} from '@/types/approver/analytics';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data
const getMockMonthlyTrends = (): MonthlyTrend[] => {
  return [
    { month: 'Jan', approved: 45, rejected: 8, pending: 5, total: 58, approvalRate: 85 },
    { month: 'Feb', approved: 52, rejected: 6, pending: 4, total: 62, approvalRate: 90 },
    { month: 'Mar', approved: 48, rejected: 10, pending: 6, total: 64, approvalRate: 83 },
    { month: 'Apr', approved: 55, rejected: 7, pending: 3, total: 65, approvalRate: 89 },
    { month: 'May', approved: 62, rejected: 9, pending: 4, total: 75, approvalRate: 87 },
    { month: 'Jun', approved: 58, rejected: 5, pending: 2, total: 65, approvalRate: 92 },
  ];
};

const getMockWorkloadData = (): WorkloadData[] => {
  return [
    { name: 'Finance', value: 85, color: '#84cc16' },
    { name: 'Operations', value: 62, color: '#3b82f6' },
    { name: 'Field Ops', value: 48, color: '#f59e0b' },
    { name: 'HR', value: 35, color: '#8b5cf6' },
    { name: 'IT', value: 28, color: '#06b6d4' },
    { name: 'Sales', value: 20, color: '#ef4444' },
  ];
};

const getMockDepartmentPerformance = (): DepartmentPerformance[] => {
  return [
    { department: 'Finance', totalRequests: 85, approved: 72, rejected: 13, approvalRate: 85, avgResponseTime: 12.5, totalAmount: 1250000 },
    { department: 'Operations', totalRequests: 62, approved: 48, rejected: 14, approvalRate: 77, avgResponseTime: 18.3, totalAmount: 890000 },
    { department: 'Field Operations', totalRequests: 48, approved: 38, rejected: 10, approvalRate: 79, avgResponseTime: 15.2, totalAmount: 720000 },
    { department: 'HR', totalRequests: 35, approved: 30, rejected: 5, approvalRate: 86, avgResponseTime: 9.8, totalAmount: 450000 },
    { department: 'IT', totalRequests: 28, approved: 23, rejected: 5, approvalRate: 82, avgResponseTime: 11.4, totalAmount: 380000 },
    { department: 'Sales', totalRequests: 20, approved: 15, rejected: 5, approvalRate: 75, avgResponseTime: 14.2, totalAmount: 290000 },
  ];
};

const getMockTopApprovers = (): TopApprover[] => {
  return [
    { id: '1', name: 'Jane Mbalame', role: 'Finance Manager', approvals: 156, rejections: 23, approvalRate: 87, avgResponseTime: 12.5, totalAmount: 4250000 },
    { id: '2', name: 'Lucy Chawinga', role: 'Department Head', approvals: 245, rejections: 28, approvalRate: 90, avgResponseTime: 6.8, totalAmount: 6780000 },
    { id: '3', name: 'Peter Kumwenda', role: 'Senior Approver', approvals: 98, rejections: 32, approvalRate: 75, avgResponseTime: 18.3, totalAmount: 2850000 },
    { id: '4', name: 'Mary Phiri', role: 'Approver', approvals: 67, rejections: 11, approvalRate: 86, avgResponseTime: 9.2, totalAmount: 1890000 },
    { id: '5', name: 'James Banda', role: 'Trainee Approver', approvals: 23, rejections: 5, approvalRate: 82, avgResponseTime: 24.5, totalAmount: 650000 },
  ];
};

const getMockSummary = (): AnalyticsSummary => {
  const trends = getMockMonthlyTrends();
  const totalApproved = trends.reduce((sum, t) => sum + t.approved, 0);
  const totalRejected = trends.reduce((sum, t) => sum + t.rejected, 0);
  const totalPending = trends[trends.length - 1].pending;
  const lastMonth = trends[trends.length - 1];
  const prevMonth = trends[trends.length - 2];

  return {
    totalRequests: totalApproved + totalRejected,
    totalApproved,
    totalRejected,
    overallApprovalRate: (totalApproved / (totalApproved + totalRejected)) * 100,
    avgResponseTime: 14.2,
    totalAmountApproved: 16700000,
    pendingRequests: totalPending,
    thisMonthApproved: lastMonth.approved,
    thisMonthRejected: lastMonth.rejected,
    lastMonthApproved: prevMonth.approved,
    lastMonthRejected: prevMonth.rejected,
    monthOverMonthGrowth: ((lastMonth.approved - prevMonth.approved) / prevMonth.approved) * 100,
  };
};

export default function ApproverAnalyticsPage() {
  const { theme } = useTheme();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [workloadData, setWorkloadData] = useState<WorkloadData[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentPerformance[]>([]);
  const [topApprovers, setTopApprovers] = useState<TopApprover[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(true);
  const [activeView, setActiveView] = useState<'trends' | 'departments'>('trends');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      setSummary(getMockSummary());
      setMonthlyTrends(getMockMonthlyTrends());
      setWorkloadData(getMockWorkloadData());
      setDepartmentData(getMockDepartmentPerformance());
      setTopApprovers(getMockTopApprovers());
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast.info('Exporting analytics report... (demo)');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      loadData();
    }, 500);
  };

  const summaryCards = [
    {
      title: 'Total Requests',
      value: summary?.totalRequests.toLocaleString() || '0',
      icon: Calendar,
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Approved',
      value: summary?.totalApproved.toLocaleString() || '0',
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/20',
      trend: summary?.monthOverMonthGrowth ? `+${summary.monthOverMonthGrowth.toFixed(1)}%` : undefined,
    },
    {
      title: 'Rejected',
      value: summary?.totalRejected.toLocaleString() || '0',
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-100 dark:bg-red-900/20',
    },
    {
      title: 'Approval Rate',
      value: `${summary?.overallApprovalRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-[#84cc16]',
      bg: 'bg-[#84cc16]/10',
    },
    {
      title: 'Avg Response Time',
      value: `${summary?.avgResponseTime} hrs`,
      icon: Clock,
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Total Approved Amount',
      value: formatCurrency(summary?.totalAmountApproved || 0),
      icon: DollarSign,
      color: 'text-[#84cc16]',
      bg: 'bg-[#84cc16]/10',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Analytics Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Track approval performance and insights
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
                {card.trend && (
                  <div className="flex items-center gap-1">
                    <TrendingUp size={12} className="text-green-500" />
                    <span className="text-xs text-green-500">{card.trend}</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{card.title}</p>
              <p className="text-xl font-bold text-[var(--text-primary)] mt-1">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Approval Trend Chart */}
        <div
          className="rounded-xl p-5 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-[#84cc16]" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Approval Trends</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('trends')}
                className={`p-1.5 rounded-lg transition-colors ${activeView === 'trends' ? 'bg-[#84cc16]/20 text-[#84cc16]' : 'text-[var(--text-secondary)]'}`}
              >
                <BarChart3 size={16} />
              </button>
              <button
                onClick={() => setActiveView('departments')}
                className={`p-1.5 rounded-lg transition-colors ${activeView === 'departments' ? 'bg-[#84cc16]/20 text-[#84cc16]' : 'text-[var(--text-secondary)]'}`}
              >
                <PieChart size={16} />
              </button>
            </div>
          </div>
          {activeView === 'trends' ? (
            <ApprovalTrendChart data={monthlyTrends} loading={loading} />
          ) : (
            <DepartmentPerformanceChart data={departmentData} loading={loading} />
          )}
        </div>

        {/* Workload Distribution */}
        <div
          className="rounded-xl p-5 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-[#84cc16]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Workload by Department</h2>
          </div>
          <WorkloadDistributionChart data={workloadData} loading={loading} />
        </div>
      </div>

      {/* Top Approvers Table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-yellow-500" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Top Performing Approvers</h2>
          </div>
        </div>
        <TopApproversTable approvers={topApprovers} loading={loading} />
      </div>

      {/* Insights Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div
          className="rounded-xl p-5 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Key Insights</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-[#84cc16] mt-2" />
              <p className="text-sm text-[var(--text-secondary)]">
                Approval rate has increased by <span className="text-[#84cc16] font-semibold">{summary?.monthOverMonthGrowth?.toFixed(1)}%</span> compared to last month
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-[#84cc16] mt-2" />
              <p className="text-sm text-[var(--text-secondary)]">
                Finance department has the highest approval rate at <span className="text-[#84cc16] font-semibold">85%</span>
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-[#84cc16] mt-2" />
              <p className="text-sm text-[var(--text-secondary)]">
                Average response time is <span className="text-[#84cc16] font-semibold">{summary?.avgResponseTime} hours</span>, target is 12 hours
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-[#84cc16] mt-2" />
              <p className="text-sm text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--text-primary)]">{topApprovers[0]?.name}</span> is the top performer with {topApprovers[0]?.approvals} approvals
              </p>
            </li>
          </ul>
        </div>

        <div
          className="rounded-xl p-5 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Recommendations</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-[#84cc16] mt-2" />
              <p className="text-sm text-[var(--text-secondary)]">
                <span className="text-[#84cc16] font-semibold">Operations department</span> could benefit from additional training (approval rate 77%)
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-[#84cc16] mt-2" />
              <p className="text-sm text-[var(--text-secondary)]">
                Consider implementing automated reminders for pending requests to reduce response time
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-[#84cc16] mt-2" />
              <p className="text-sm text-[var(--text-secondary)]">
                Recognize top performers to motivate the team and share best practices
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-[#84cc16] mt-2" />
              <p className="text-sm text-[var(--text-secondary)]">
                Monthly approval target achieved <span className="text-[#84cc16] font-semibold">92%</span> for June
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}