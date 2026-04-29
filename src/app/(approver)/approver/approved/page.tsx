'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, Search, Download, ChevronDown, CheckCircle } from 'lucide-react';
import { ApprovedRequestCard } from '@/components/approver/ApprovedRequestCard';
import {
  ApprovedRequest,
  ApprovedRequestFilters,
  DEPARTMENTS,
  DESTINATIONS,
  PAYMENT_STATUS_CONFIG,
} from '@/types/approver/approved';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Rest of the file remains the same...

// Mock data
const getMockApprovedRequests = (): ApprovedRequest[] => {
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
      approvedAmount: 135000,
      approvedAt: new Date(now.setDate(now.getDate() - 15)).toISOString(),
      approvedBy: 'Jane Mbalame',
      approverRole: 'Finance Manager',
      urgency: 'high',
      hasEventAttendance: true,
      eventName: 'Fintech Conference 2026',
      paymentStatus: 'paid',
      paymentDate: new Date(now.setDate(now.getDate() - 10)).toISOString(),
      paymentReference: 'REF-2024-001',
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
      approvedAmount: 75000,
      approvedAt: new Date(now.setDate(now.getDate() - 12)).toISOString(),
      approvedBy: 'Peter Kumwenda',
      approverRole: 'Operations Director',
      urgency: 'medium',
      hasEventAttendance: false,
      paymentStatus: 'processing',
      notes: 'Request partially approved due to budget constraints',
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
      approvedAmount: 152000,
      approvedAt: new Date(now.setDate(now.getDate() - 8)).toISOString(),
      approvedBy: 'Mary Phiri',
      approverRole: 'HR Director',
      urgency: 'high',
      hasEventAttendance: true,
      eventName: 'HR Leadership Summit',
      paymentStatus: 'pending',
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
      approvedAmount: 200000,
      approvedAt: new Date(now.setDate(now.getDate() - 3)).toISOString(),
      approvedBy: 'James Banda',
      approverRole: 'IT Manager',
      urgency: 'low',
      hasEventAttendance: false,
      paymentStatus: 'paid',
      paymentDate: new Date(now.setDate(now.getDate() - 1)).toISOString(),
      paymentReference: 'REF-2024-002',
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
      approvedAmount: 70000,
      approvedAt: new Date(now.setDate(now.getDate() - 6)).toISOString(),
      approvedBy: 'Lucy Chawinga',
      approverRole: 'Operations Manager',
      urgency: 'medium',
      hasEventAttendance: false,
      paymentStatus: 'paid',
      paymentDate: new Date(now.setDate(now.getDate() - 4)).toISOString(),
      paymentReference: 'REF-2024-003',
    },
  ];
};

export default function ApprovedRequestsPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [requests, setRequests] = useState<ApprovedRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ApprovedRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);
  const [filters, setFilters] = useState<ApprovedRequestFilters>({
    department: '',
    destination: '',
    dateFrom: '',
    dateTo: '',
    minAmount: 0,
    maxAmount: 0,
    paymentStatus: '',
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
      const mockData = getMockApprovedRequests();
      setRequests(mockData);
      setFilteredRequests(mockData);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load approved requests:', error);
      toast.error('Failed to load approved requests');
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
          req.destination.toLowerCase().includes(query)
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

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter((req) => new Date(req.approvedAt) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter((req) => new Date(req.approvedAt) <= new Date(filters.dateTo));
    }

    // Amount range filter
    if (filters.minAmount > 0) {
      filtered = filtered.filter((req) => req.approvedAmount >= filters.minAmount);
    }
    if (filters.maxAmount > 0) {
      filtered = filtered.filter((req) => req.approvedAmount <= filters.maxAmount);
    }

    // Payment status filter
    if (filters.paymentStatus) {
      filtered = filtered.filter((req) => req.paymentStatus === filters.paymentStatus);
    }

    setFilteredRequests(filtered);
  };

  const handleResetFilters = () => {
    setFilters({
      department: '',
      destination: '',
      dateFrom: '',
      dateTo: '',
      minAmount: 0,
      maxAmount: 0,
      paymentStatus: '',
    });
    setSearchQuery('');
  };

  const handleExport = () => {
    toast.info('Exporting approved requests... (demo)');
  };

  const totalApprovedAmount = filteredRequests.reduce((sum, req) => sum + req.approvedAmount, 0);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">Loading approved requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Approved Requests</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {filteredRequests.length} approved request(s) • Total:{' '}
            {formatCurrency(totalApprovedAmount)}
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
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
          />
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
            isFilterOpen
              ? 'bg-[#84cc16]/10 border-[#84cc16]'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          <Filter size={16} />
          Filters
          {(filters.department ||
            filters.destination ||
            filters.dateFrom ||
            filters.dateTo ||
            filters.minAmount > 0 ||
            filters.maxAmount > 0 ||
            filters.paymentStatus) && <span className="w-2 h-2 rounded-full bg-[#84cc16]" />}
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
              <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => setFilters((prev) => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Filter */}
            <div>
              <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
                Destination
              </label>
              <select
                value={filters.destination}
                onChange={(e) => setFilters((prev) => ({ ...prev, destination: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="">All Destinations</option>
                {DESTINATIONS.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Status Filter */}
            <div>
              <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
                Payment Status
              </label>
              <select
                value={filters.paymentStatus}
                onChange={(e) => setFilters((prev) => ({ ...prev, paymentStatus: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
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
                    onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
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
                    onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
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
              <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
                Amount Range (MWK)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minAmount || ''}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, minAmount: parseInt(e.target.value) || 0 }))
                  }
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
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, maxAmount: parseInt(e.target.value) || 0 }))
                  }
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
          <div
            className="flex justify-end gap-3 mt-4 pt-4 border-t"
            style={{ borderColor: 'var(--border-color)' }}
          >
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#84cc16]/20 flex items-center justify-center">
            <CheckCircle size={32} className="text-[#84cc16]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            No Approved Requests
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {searchQuery ||
            filters.department ||
            filters.destination ||
            filters.paymentStatus ||
            filters.dateFrom ||
            filters.dateTo ||
            filters.minAmount > 0
              ? 'Try adjusting your filters or search criteria'
              : 'No requests have been approved yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <ApprovedRequestCard
              key={request.id}
              request={request}
              onViewDetails={(id) => router.push(`/approver/requests/${id}`)}
              onViewPayment={(id) => toast.info(`Viewing payment receipt for request ${id} (demo)`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
