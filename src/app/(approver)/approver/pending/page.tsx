'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, Search, ChevronDown, CheckCircle } from 'lucide-react';
import { PendingApprovalCard } from '@/components/approver/PendingApprovalCard';
import { ApprovalFilterSidebar } from '@/components/approver/ApprovalFilterSidebar';
import { BulkActionBar } from '@/components/approver/BulkActionBar';
import { PendingRequest, FilterOptions } from '@/types/approver/pending';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Rest of the file remains the same...

// Mock data
const getMockPendingRequests = (): PendingRequest[] => {
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
      startDate: new Date(now.setDate(now.getDate() + 2)).toISOString(),
      endDate: new Date(now.setDate(now.getDate() + 4)).toISOString(),
      duration: 3,
      amount: 135000,
      perDiemRate: 45000,
      accommodationRate: 60000,
      submittedAt: new Date(now.setDate(now.getDate() - 3)).toISOString(),
      daysPending: 3,
      urgency: 'high',
      deadline: new Date(now.setDate(now.getDate() + 1)).toISOString(),
      hasEventAttendance: true,
      eventDetails: {
        id: 'evt-1',
        name: 'Fintech Conference 2026',
        date: new Date(now.setDate(now.getDate() + 3)).toISOString(),
        location: 'BICC, Lilongwe',
      },
      travelAuthorizationRef: 'TA-2024-1234',
    },
    {
      id: '2',
      requestNumber: 'DSA-2024-002',
      employeeName: 'Jane Smith',
      employeeId: 'EMP-002',
      department: 'Operations',
      destination: 'Blantyre',
      purpose: 'Field inspection',
      startDate: new Date(now.setDate(now.getDate() + 5)).toISOString(),
      endDate: new Date(now.setDate(now.getDate() + 6)).toISOString(),
      duration: 2,
      amount: 80000,
      perDiemRate: 40000,
      submittedAt: new Date(now.setDate(now.getDate() - 5)).toISOString(),
      daysPending: 5,
      urgency: 'medium',
      deadline: new Date(now.setDate(now.getDate() + 3)).toISOString(),
      hasEventAttendance: false,
    },
    {
      id: '3',
      requestNumber: 'DSA-2024-003',
      employeeName: 'Mike Johnson',
      employeeId: 'EMP-003',
      department: 'HR',
      destination: 'Mzuzu',
      purpose: 'Staff training',
      startDate: new Date(now.setDate(now.getDate() - 1)).toISOString(),
      endDate: new Date(now.setDate(now.getDate() + 2)).toISOString(),
      duration: 4,
      amount: 152000,
      perDiemRate: 38000,
      accommodationRate: 55000,
      submittedAt: new Date(now.setDate(now.getDate() - 7)).toISOString(),
      daysPending: 7,
      urgency: 'high',
      deadline: new Date(now.setDate(now.getDate() - 1)).toISOString(),
      hasEventAttendance: true,
      eventDetails: {
        id: 'evt-2',
        name: 'HR Summit',
        date: new Date(now.setDate(now.getDate() + 1)).toISOString(),
        location: 'Mzuzu Hotel',
      },
      comments: 'Requesting advance payment for accommodation',
    },
    {
      id: '4',
      requestNumber: 'DSA-2024-004',
      employeeName: 'Sarah Williams',
      employeeId: 'EMP-004',
      department: 'IT',
      destination: 'Lilongwe',
      purpose: 'Software implementation',
      startDate: new Date(now.setDate(now.getDate() + 10)).toISOString(),
      endDate: new Date(now.setDate(now.getDate() + 14)).toISOString(),
      duration: 5,
      amount: 225000,
      perDiemRate: 45000,
      submittedAt: new Date(now.setDate(now.getDate() - 2)).toISOString(),
      daysPending: 2,
      urgency: 'low',
      deadline: new Date(now.setDate(now.getDate() + 8)).toISOString(),
      hasEventAttendance: false,
    },
    {
      id: '5',
      requestNumber: 'DSA-2024-005',
      employeeName: 'David Brown',
      employeeId: 'EMP-005',
      department: 'Field Operations',
      destination: 'Zomba',
      purpose: 'Site visit',
      startDate: new Date(now.setDate(now.getDate() + 1)).toISOString(),
      endDate: new Date(now.setDate(now.getDate() + 2)).toISOString(),
      duration: 2,
      amount: 70000,
      perDiemRate: 35000,
      submittedAt: new Date(now.setDate(now.getDate() - 1)).toISOString(),
      daysPending: 1,
      urgency: 'high',
      deadline: new Date(now.setDate(now.getDate())).toISOString(),
      hasEventAttendance: false,
    },
  ];
};

export default function PendingApprovalsPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PendingRequest[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    department: '',
    destination: '',
    urgency: '',
    dateRange: '',
    minAmount: 0,
    maxAmount: 0,
    hasEvent: false,
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
      const mockData = getMockPendingRequests();
      setRequests(mockData);
      setFilteredRequests(mockData);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load requests:', error);
      toast.error('Failed to load requests');
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

    // Urgency filter
    if (filters.urgency) {
      filtered = filtered.filter((req) => req.urgency === filters.urgency);
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter((req) => {
        const deadline = new Date(req.deadline);
        const deadlineDate = new Date(
          deadline.getFullYear(),
          deadline.getMonth(),
          deadline.getDate()
        );

        switch (filters.dateRange) {
          case 'today':
            return deadlineDate.getTime() === today.getTime();
          case 'week':
            const weekFromNow = new Date(today);
            weekFromNow.setDate(today.getDate() + 7);
            return deadlineDate <= weekFromNow && deadlineDate >= today;
          case 'month':
            const monthFromNow = new Date(today);
            monthFromNow.setMonth(today.getMonth() + 1);
            return deadlineDate <= monthFromNow && deadlineDate >= today;
          case 'overdue':
            return deadlineDate < today;
          default:
            return true;
        }
      });
    }

    // Amount range filter
    if (filters.minAmount > 0) {
      filtered = filtered.filter((req) => req.amount >= filters.minAmount);
    }
    if (filters.maxAmount > 0) {
      filtered = filtered.filter((req) => req.amount <= filters.maxAmount);
    }

    // Event attendance filter
    if (filters.hasEvent) {
      filtered = filtered.filter((req) => req.hasEventAttendance);
    }

    setFilteredRequests(filtered);
  };

  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredRequests.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRequests.map((r) => r.id)));
    }
  };

  const handleApprove = async (id: string) => {
    toast.success(`Request ${id} approved (demo)`);
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleReject = async (id: string) => {
    toast.success(`Request ${id} rejected (demo)`);
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleBulkApprove = () => {
    const count = selectedIds.size;
    toast.success(`${count} request(s) approved (demo)`);
    setRequests((prev) => prev.filter((r) => !selectedIds.has(r.id)));
    setSelectedIds(new Set());
  };

  const handleBulkReject = () => {
    const count = selectedIds.size;
    toast.success(`${count} request(s) rejected (demo)`);
    setRequests((prev) => prev.filter((r) => !selectedIds.has(r.id)));
    setSelectedIds(new Set());
  };

  const handleBulkAssign = () => {
    toast.success(`Assigning ${selectedIds.size} request(s) to another approver (demo)`);
  };

  const handleBulkEscalate = () => {
    toast.success(`${selectedIds.size} request(s) escalated to manager (demo)`);
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleViewDetails = (id: string) => {
    router.push(`/approver/requests/${id}`);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Pending Approvals</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {filteredRequests.length} request(s) awaiting your approval
          </p>
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
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          <Filter size={16} />
          Filters
          {(filters.department ||
            filters.destination ||
            filters.urgency ||
            filters.dateRange ||
            filters.minAmount > 0 ||
            filters.maxAmount > 0 ||
            filters.hasEvent) && <span className="w-2 h-2 rounded-full bg-[#84cc16]" />}
        </button>
      </div>

      {/* Select All Row */}
      {filteredRequests.length > 0 && (
        <div className="flex items-center gap-2 px-2">
          <input
            type="checkbox"
            checked={selectedIds.size === filteredRequests.length && filteredRequests.length > 0}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
          />
          <span className="text-sm text-[var(--text-secondary)]">
            Select All ({filteredRequests.length})
          </span>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <PendingApprovalCard
            key={request.id}
            request={request}
            isSelected={selectedIds.has(request.id)}
            onSelect={handleSelect}
            onApprove={handleApprove}
            onReject={handleReject}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#84cc16]/20 flex items-center justify-center">
            <CheckCircle size={32} className="text-[#84cc16]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            No Pending Approvals
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {searchQuery || Object.values(filters).some((v) => v)
              ? 'Try adjusting your filters or search criteria'
              : 'All caught up! No requests waiting for your approval.'}
          </p>
        </div>
      )}

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedIds.size}
        onApprove={handleBulkApprove}
        onReject={handleBulkReject}
        onAssign={handleBulkAssign}
        onEscalate={handleBulkEscalate}
        onClear={handleClearSelection}
      />

      {/* Filter Sidebar */}
      <ApprovalFilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onApply={() => setIsFilterOpen(false)}
        onReset={() => {
          setFilters({
            department: '',
            destination: '',
            urgency: '',
            dateRange: '',
            minAmount: 0,
            maxAmount: 0,
            hasEvent: false,
          });
        }}
      />
    </div>
  );
}
