'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  ChevronDown,
  UserPlus,
  Mail,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

import { TeamMemberCard } from '@/components/approver/TeamMemberCard';
import { TeamPerformanceChart } from '@/components/approver/TeamPerformanceChart';
import { TeamMember, TeamStats, ROLES, DEPARTMENTS } from '@/types/approver/team';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data
const getMockTeamMembers = (): TeamMember[] => {
  const now = new Date();
  return [
    {
      id: '1',
      name: 'Jane Mbalame',
      email: 'jane.mbalame@vaultstring.com',
      role: 'Finance Manager',
      department: 'Finance',
      joinDate: new Date(now.setFullYear(now.getFullYear() - 2)).toISOString(),
      status: 'active',
      metrics: {
        totalApproved: 156,
        totalRejected: 23,
        totalPending: 8,
        approvalRate: 87,
        averageResponseTime: 12.5,
        totalAmountApproved: 4250000,
      },
      recentDecisions: [
        { id: 'd1', requestNumber: 'DSA-2024-001', employeeName: 'John Doe', amount: 135000, decision: 'approved', decidedAt: new Date().toISOString() },
        { id: 'd2', requestNumber: 'DSA-2024-002', employeeName: 'Jane Smith', amount: 80000, decision: 'approved', decidedAt: new Date().toISOString() },
      ],
    },
    {
      id: '2',
      name: 'Peter Kumwenda',
      email: 'peter.kumwenda@vaultstring.com',
      role: 'Senior Approver',
      department: 'Operations',
      joinDate: new Date(now.setFullYear(now.getFullYear() - 1.5)).toISOString(),
      status: 'active',
      metrics: {
        totalApproved: 98,
        totalRejected: 32,
        totalPending: 5,
        approvalRate: 75,
        averageResponseTime: 18.3,
        totalAmountApproved: 2850000,
      },
      recentDecisions: [],
    },
    {
      id: '3',
      name: 'Mary Phiri',
      email: 'mary.phiri@vaultstring.com',
      role: 'Approver',
      department: 'Finance',
      joinDate: new Date(now.setFullYear(now.getFullYear() - 1)).toISOString(),
      status: 'active',
      metrics: {
        totalApproved: 67,
        totalRejected: 11,
        totalPending: 3,
        approvalRate: 86,
        averageResponseTime: 9.2,
        totalAmountApproved: 1890000,
      },
      recentDecisions: [],
    },
    {
      id: '4',
      name: 'James Banda',
      email: 'james.banda@vaultstring.com',
      role: 'Trainee Approver',
      department: 'Field Operations',
      joinDate: new Date(now.setFullYear(now.getFullYear() - 0.5)).toISOString(),
      status: 'on_leave',
      metrics: {
        totalApproved: 23,
        totalRejected: 5,
        totalPending: 2,
        approvalRate: 82,
        averageResponseTime: 24.5,
        totalAmountApproved: 650000,
      },
      recentDecisions: [],
    },
    {
      id: '5',
      name: 'Lucy Chawinga',
      email: 'lucy.chawinga@vaultstring.com',
      role: 'Department Head',
      department: 'Administration',
      joinDate: new Date(now.setFullYear(now.getFullYear() - 3)).toISOString(),
      status: 'active',
      metrics: {
        totalApproved: 245,
        totalRejected: 28,
        totalPending: 12,
        approvalRate: 90,
        averageResponseTime: 6.8,
        totalAmountApproved: 6780000,
      },
      recentDecisions: [],
    },
  ];
};

const getMockTeamStats = (members: TeamMember[]): TeamStats => {
  const totalApproved = members.reduce((sum, m) => sum + m.metrics.totalApproved, 0);
  const totalRejected = members.reduce((sum, m) => sum + m.metrics.totalRejected, 0);
  const totalPending = members.reduce((sum, m) => sum + m.metrics.totalPending, 0);
  const totalAmountApproved = members.reduce((sum, m) => sum + m.metrics.totalAmountApproved, 0);
  const avgResponseTime = members.reduce((sum, m) => sum + m.metrics.averageResponseTime, 0) / members.length;
  const overallApprovalRate = totalApproved + totalRejected > 0 ? Math.round((totalApproved / (totalApproved + totalRejected)) * 100) : 0;

  return {
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'active').length,
    totalApproved,
    totalRejected,
    totalPending,
    overallApprovalRate,
    totalAmountApproved,
    averageResponseTime: Math.round(avgResponseTime * 10) / 10,
  };
};

export default function TeamPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    department: '',
    status: '',
  });
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadTeamData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [members, searchQuery, filters]);

  const loadTeamData = async () => {
    setLoading(true);
    try {
      const mockMembers = getMockTeamMembers();
      setMembers(mockMembers);
      setFilteredMembers(mockMembers);
      setStats(getMockTeamStats(mockMembers));
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load team data:', error);
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...members];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query) ||
          member.role.toLowerCase().includes(query) ||
          member.department.toLowerCase().includes(query)
      );
    }

    if (filters.role) {
      filtered = filtered.filter((member) => member.role === filters.role);
    }

    if (filters.department) {
      filtered = filtered.filter((member) => member.department === filters.department);
    }

    if (filters.status) {
      filtered = filtered.filter((member) => member.status === filters.status);
    }

    setFilteredMembers(filtered);
    setStats(getMockTeamStats(filtered));
  };

  const handleResetFilters = () => {
    setFilters({ role: '', department: '', status: '' });
    setSearchQuery('');
    setIsFilterOpen(false);
  };

  const handleExport = () => {
    toast.info('Exporting team data... (demo)');
  };

  const handleInvite = () => {
    toast.info('Invite team member (demo)');
  };

  const handleSendReminder = () => {
    toast.info('Sending reminders to team (demo)');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Team Management</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {stats?.totalMembers} team members • {stats?.activeMembers} active
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleInvite}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-colors"
          >
            <UserPlus size={16} />
            Invite Member
          </button>
          <button
            onClick={handleSendReminder}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <Mail size={16} />
            Send Reminder
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <Download size={16} />
            Export
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-green-500" />
            <span className="text-sm text-[var(--text-secondary)]">Approved</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats?.totalApproved.toLocaleString()}</p>
        </div>
        <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={18} className="text-red-500" />
            <span className="text-sm text-[var(--text-secondary)]">Rejected</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats?.totalRejected.toLocaleString()}</p>
        </div>
        <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-yellow-500" />
            <span className="text-sm text-[var(--text-secondary)]">Pending</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats?.totalPending.toLocaleString()}</p>
        </div>
        <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-[#84cc16]" />
            <span className="text-sm text-[var(--text-secondary)]">Approval Rate</span>
          </div>
          <p className="text-2xl font-bold text-[#84cc16]">{stats?.overallApprovalRate}%</p>
        </div>
        <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} className="text-[#84cc16]" />
            <span className="text-sm text-[var(--text-secondary)]">Total Approved</span>
          </div>
          <p className="text-2xl font-bold text-[#84cc16]">{formatCurrency(stats?.totalAmountApproved || 0)}</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div
        className="rounded-xl p-5 border"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-[#84cc16]" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Team Performance</h2>
        </div>
        <TeamPerformanceChart members={filteredMembers} loading={loading} />
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Search by name, email, role, or department..."
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
        
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            isFilterOpen ? 'bg-[#84cc16]/10 border-[#84cc16]' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          <Filter size={16} />
          Filters
          {(filters.role || filters.department || filters.status) && (
            <span className="w-2 h-2 rounded-full bg-[#84cc16]" />
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div
          className="rounded-xl p-4 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Role Filter */}
            <div>
              <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Role</label>
              <select
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="">All Roles</option>
                {ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Department</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-lg border text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              Reset Filters
            </button>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="px-4 py-2 rounded-lg bg-[#84cc16] text-white text-sm font-medium hover:brightness-110 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Team Members List */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Users size={32} className="text-[var(--text-secondary)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Team Members Found</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {searchQuery || filters.role || filters.department || filters.status
              ? 'Try adjusting your filters or search criteria'
              : 'Invite team members to get started'}
          </p>
          {!searchQuery && !filters.role && !filters.department && !filters.status && (
            <button
              onClick={handleInvite}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white hover:brightness-110 transition-colors"
            >
              <UserPlus size={16} />
              Invite Member
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onViewDetails={(id) => router.push(`/approver/team/${id}`)}
              onViewDecisions={(id) => router.push(`/approver/team/${id}/decisions`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}