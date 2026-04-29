'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Filter, 
  Search, 
  Download, 
  ChevronDown,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { RejectedRequestCard } from '@/components/approver/RejectedRequestCard';
import { RejectedRequest, RejectedRequestFilters, DEPARTMENTS, DESTINATIONS, REJECTION_CATEGORIES } from '@/types/approver/rejected';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data
const getMockRejectedRequests = (): RejectedRequest[] => {
  const now = new Date();
  return [
    {
      id: '1',
      requestNumber: 'DSA-2024-001',
      employeeName: 'John Doe',
      employeeId: 'EMP-001',
      department: 'Finance',
      destination: 'Lilongwe',
      purpose: 'Audit meeting',
      startDate: new Date(now.setDate(now.getDate() - 20)).toISOString(),
      endDate: new Date(now.setDate(now.getDate() - 17)).toISOString(),
      duration: 3,
      amount: 135000,
      rejectedAt: new Date(now.setDate(now.getDate() - 15)).toISOString(),
      rejectedBy: 'Jane Mbalame',
      approverRole: 'Finance Manager',
      rejectionReason: 'Missing travel authorization document. Please attach the approved travel authorization form.',
      rejectionCategory: 'missing_info',
      urgency: 'high',
      hasEventAttendance: true,
      eventName: 'Fintech Conference 2026',
      canResubmit: true,
      resubmitDeadline: new Date(now.setDate(now.getDate() + 15)).toISOString(),
    },
    {
      id: '2',
      requestNumber: 'DSA-2024-002',
      employeeName: 'Jane Smith',
      employeeId: 'EMP-002',
      department: 'Operations',
      destination: 'Blantyre',
      purpose: 'Field inspection',
      startDate: new Date(now.setDate(now.getDate() - 15)).toISOString(),
      endDate: new Date(now.setDate(now.getDate() - 13)).toISOString(),
      duration: 2,
      amount: 80000,
      rejectedAt: new Date(now.setDate(now.getDate() - 12)).toISOString(),
      rejectedBy: 'Peter Kumwenda',
      approverRole: 'Operations Director',
      rejectionReason: 'This trip does not align with current departmental priorities. Please consult with your manager.',
      rejectionCategory: 'policy_violation',
      urgency: 'medium',
      hasEventAttendance: false,
      canResubmit: false,
      notes: 'Employee was advised to schedule trip for next quarter.',
    },
    {
      id: '3',
      requestNumber: 'DSA-2024-003',
      employeeName: 'Mike Johnson',
      employeeId: 'EMP-003',
      department: 'HR',
      destination: 'Mzuzu',
      purpose: 'Staff training',
      startDate: new Date(now.setDate(now.getDate() - 10)).toISOString(),
      endDate: new Date(now.setDate(now.getDate() - 6)).toISOString(),
      duration: 4,
      amount: 152000,
      rejectedAt: new Date(now.setDate(now.getDate() - 8)).toISOString(),
      rejectedBy: 'Mary Phiri',
      approverRole: 'HR Director',
      rejectionReason: 'Budget allocation for this quarter has been exhausted. Please resubmit next quarter.',
      rejectionCategory: 'budget_constraint',
      urgency: 'high',
      hasEventAttendance: true,
      eventName: 'HR Leadership Summit',
      canResubmit: true,
      resubmitDeadline: new Date(now.setDate(now.getDate() + 30)).toISOString(),
    },
    {
      id: '4',
      requestNumber: 'DSA-2024-004',
      employeeName: 'Sarah Williams',
      employeeId: 'EMP-004',
      department: 'IT',
      destination: 'Lilongwe',
      purpose: 'Software implementation',
      startDate: new Date(now.setDate(now.getDate() - 5)).toISOString(),
      endDate: new Date(now.setDate(now.getDate() - 1)).toISOString(),
      duration: 5,
      amount: 225000,
      rejectedAt: new Date(now.setDate(now.getDate() - 3)).toISOString(),
      rejectedBy: 'James Banda',
      approverRole: 'IT Manager',
      rejectionReason: 'The per diem rate requested exceeds the approved rate for this destination. Maximum allowed is MWK 40,000/day.',
      rejectionCategory: 'invalid_request',
      urgency: 'low',
      hasEventAttendance: false,
      canResubmit: true,
      resubmitDeadline: new Date(now.setDate(now.getDate() + 7)).toISOString(),
    },
    {
      id: '5',
      requestNumber: 'DSA-2024-005',
      employeeName: 'David Brown',
      employeeId: 'EMP-005',
      department: 'Field Operations',
      destination: 'Zomba',
      purpose: 'Site visit',
      startDate: new Date(now.setDate(now.getDate() - 8)).toISOString(),
      endDate: new Date(now.setDate(now.getDate() - 6)).toISOString(),
      duration: 2,
      amount: 70000,
      rejectedAt: new Date(now.setDate(now.getDate() - 6)).toISOString(),
      rejectedBy: 'Lucy Chawinga',
      approverRole: 'Operations Manager',
      rejectionReason: 'Please provide more details about the specific sites to be visited and expected outcomes.',
      rejectionCategory: 'missing_info',
      urgency: 'medium',
      hasEventAttendance: false,
      canResubmit: true,
      resubmitDeadline: new Date(now.setDate(now.getDate() + 14)).toISOString(),
    },
  ];
};

export default function RejectedRequestsPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [requests, setRequests] = useState<RejectedRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RejectedRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);
  const [filters, setFilters] = useState<RejectedRequestFilters>({
    department: '',
    destination: '',
    rejectionCategory: '',
    dateFrom: '',
    dateTo: '',
    minAmount: 0,
    maxAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [requests, searchQuery, filters]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const mockData = getMockRejectedRequests();
      setRequests(mockData);
      setFilteredRequests(mockData);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load rejected requests:', error);
      toast.error('Failed to load rejected requests');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...requests];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.employeeName.toLowerCase().includes(query) ||
          req.requestNumber.toLowerCase().includes(query) ||
          req.department.toLowerCase().includes(query) ||
          req.destination.toLowerCase().includes(query) ||
          req.rejectionReason.toLowerCase().includes(query)
      );
    }

    // Department filter
    if (filters.department) {
      filtered = filtered.filter((req) => req.department === filters.department);
    }

    // Destination filter
    if (filters.destination) {
      filtered = filtered.filter((req) => req.destination === filters.destination);
    }

    // Rejection category filter
    if (filters.rejectionCategory) {
      filtered = filtered.filter((req) => req.rejectionCategory === filters.rejectionCategory);
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter((req) => new Date(req.rejectedAt) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter((req) => new Date(req.rejectedAt) <= new Date(filters.dateTo));
    }

    // Amount range filter
    if (filters.minAmount > 0) {
      filtered = filtered.filter((req) => req.amount >= filters.minAmount);
    }
    if (filters.maxAmount > 0) {
      filtered = filtered.filter((req) => req.amount <= filters.maxAmount);
    }

    setFilteredRequests(filtered);
  };

  const handleResetFilters = () => {
    setFilters({
      department: '',
      destination: '',
      rejectionCategory: '',
      dateFrom: '',
      dateTo: '',
      minAmount: 0,
      maxAmount: 0,
    });
    setSearchQuery('');
  };

  const handleExport = () => {
    toast.info('Exporting rejected requests... (demo)');
  };

  const handleResubmit = (id: string) => {
    toast.success(`Request ${id} resubmitted (demo)`);
    // In real app, would navigate to resubmit form or trigger API
  };

  const resubmittableCount = filteredRequests.filter(r => r.canResubmit).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">Loading rejected requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Rejected Requests</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {filteredRequests.length} rejected request(s) • {resubmittableCount} can be resubmitted
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          <Download size={16} />
          Export
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

      {/* Search and Filter Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Search by employee name, request number, department, or destination..."
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
          {(filters.department || filters.destination || filters.rejectionCategory || filters.dateFrom || filters.dateTo || filters.minAmount > 0 || filters.maxAmount > 0) && (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* Destination Filter */}
            <div>
              <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Destination</label>
              <select
                value={filters.destination}
                onChange={(e) => setFilters(prev => ({ ...prev, destination: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="">All Destinations</option>
                {DESTINATIONS.map(dest => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
            </div>

            {/* Rejection Category Filter */}
            <div>
              <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Rejection Category</label>
              <select
                value={filters.rejectionCategory}
                onChange={(e) => setFilters(prev => ({ ...prev, rejectionCategory: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="">All Categories</option>
                {Object.entries(REJECTION_CATEGORIES).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <button
                onClick={() => setShowDateRange(!showDateRange)}
                className="flex items-center justify-between w-full text-sm font-medium mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                <span>Date Range</span>
                <ChevronDown size={14} className={showDateRange ? 'rotate-180' : ''} />
              </button>
              {showDateRange && (
                <div className="space-y-2">
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="From"
                  />
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="To"
                  />
                </div>
              )}
            </div>

            {/* Amount Range */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Amount Range (MWK)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minAmount || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, minAmount: parseInt(e.target.value) || 0 }))}
                  className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxAmount || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: parseInt(e.target.value) || 0 }))}
                  className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
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

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <XCircle size={32} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Rejected Requests</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {searchQuery || filters.department || filters.destination || filters.rejectionCategory || filters.dateFrom || filters.dateTo || filters.minAmount > 0
              ? 'Try adjusting your filters or search criteria'
              : 'No requests have been rejected yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <RejectedRequestCard
              key={request.id}
              request={request}
              onViewDetails={(id) => router.push(`/approver/requests/${id}`)}
              onResubmit={handleResubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
}