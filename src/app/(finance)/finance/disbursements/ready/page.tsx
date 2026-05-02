'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Plus,
  Filter,
  Search,
  ChevronDown
} from 'lucide-react';
import { EventGroupAccordion } from '@/components/finance/EventGroupAccordion';
import { ReadyRequest, EventGroup, ValidationSummary } from '@/types/finance/readyRequests';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data
const getMockReadyRequests = (): ReadyRequest[] => {
  return [
    {
      id: '1',
      requestNumber: 'DSA-2024-001',
      employeeName: 'John Doe',
      employeeId: 'EMP-001',
      department: 'Finance',
      destination: 'Lilongwe',
      purpose: 'Audit meeting',
      startDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 9 * 86400000).toISOString(),
      duration: 3,
      amount: 135000,
      perDiemRate: 45000,
      accommodationRate: 60000,
      totalAmount: 195000,
      approvedAt: new Date().toISOString(),
      approvedBy: 'Jane Mbalame',
      hasEventAttendance: true,
      eventDetails: {
        id: 'evt-1',
        name: 'Fintech Conference 2026',
        date: new Date(Date.now() + 8 * 86400000).toISOString(),
        location: 'BICC, Lilongwe',
      },
      recipientDetails: {
        name: 'John Doe',
        phone: '+265 999 123 456',
        accountNumber: '1234567890',
        provider: 'airtel',
        isValid: true,
      },
      status: 'pending',
      selected: false,
    },
    {
      id: '2',
      requestNumber: 'DSA-2024-002',
      employeeName: 'Jane Smith',
      employeeId: 'EMP-002',
      department: 'Operations',
      destination: 'Blantyre',
      purpose: 'Field inspection',
      startDate: new Date(Date.now() + 5 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 6 * 86400000).toISOString(),
      duration: 2,
      amount: 80000,
      perDiemRate: 40000,
      totalAmount: 80000,
      approvedAt: new Date().toISOString(),
      approvedBy: 'Peter Kumwenda',
      hasEventAttendance: false,
      recipientDetails: {
        name: 'Jane Smith',
        phone: '+265 888 123 456',
        accountNumber: '0987654321',
        provider: 'mpamba',
        isValid: false,
        validationError: 'Phone number not registered with Mpamba',
      },
      status: 'pending',
      selected: false,
    },
    {
      id: '3',
      requestNumber: 'DSA-2024-003',
      employeeName: 'Mike Johnson',
      employeeId: 'EMP-003',
      department: 'Field Operations',
      destination: 'Mzuzu',
      purpose: 'Staff training',
      startDate: new Date(Date.now() + 10 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 14 * 86400000).toISOString(),
      duration: 5,
      amount: 190000,
      perDiemRate: 38000,
      totalAmount: 190000,
      approvedAt: new Date().toISOString(),
      approvedBy: 'Mary Phiri',
      hasEventAttendance: true,
      eventDetails: {
        id: 'evt-1',
        name: 'Fintech Conference 2026',
        date: new Date(Date.now() + 12 * 86400000).toISOString(),
        location: 'BICC, Lilongwe',
      },
      recipientDetails: {
        name: 'Mike Johnson',
        phone: '+265 999 789 012',
        accountNumber: '1122334455',
        provider: 'bank',
        isValid: true,
      },
      status: 'pending',
      selected: false,
    },
    {
      id: '4',
      requestNumber: 'DSA-2024-004',
      employeeName: 'Sarah Williams',
      employeeId: 'EMP-004',
      department: 'IT',
      destination: 'Lilongwe',
      purpose: 'Software implementation',
      startDate: new Date(Date.now() + 3 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      duration: 5,
      amount: 225000,
      perDiemRate: 45000,
      totalAmount: 225000,
      approvedAt: new Date().toISOString(),
      approvedBy: 'James Banda',
      hasEventAttendance: false,
      recipientDetails: {
        name: 'Sarah Williams',
        phone: '+265 888 456 789',
        accountNumber: '5544332211',
        provider: 'airtel',
        isValid: true,
      },
      status: 'pending',
      selected: false,
    },
  ];
};

const groupRequestsByEvent = (requests: ReadyRequest[]): EventGroup[] => {
  const eventMap = new Map<string, EventGroup>();
  
  requests.forEach((request) => {
    if (request.hasEventAttendance && request.eventDetails) {
      const eventId = request.eventDetails.id;
      if (!eventMap.has(eventId)) {
        eventMap.set(eventId, {
          eventId,
          eventName: request.eventDetails.name,
          eventDate: request.eventDetails.date,
          requests: [],
          totalAmount: 0,
          requestCount: 0,
        });
      }
      const group = eventMap.get(eventId)!;
      group.requests.push(request);
      group.totalAmount += request.totalAmount;
      group.requestCount++;
    }
  });
  
  // Also add non-event requests as individual groups or put them in an "Other" group
  const nonEventRequests = requests.filter(r => !r.hasEventAttendance);
  if (nonEventRequests.length > 0) {
    eventMap.set('other', {
      eventId: 'other',
      eventName: 'General Disbursements',
      eventDate: 'No event',
      requests: nonEventRequests,
      totalAmount: nonEventRequests.reduce((sum, r) => sum + r.totalAmount, 0),
      requestCount: nonEventRequests.length,
    });
  }
  
  return Array.from(eventMap.values());
};

export default function ReadyDisbursementsPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [requests, setRequests] = useState<ReadyRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ReadyRequest[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(true);
  const [validationSummary, setValidationSummary] = useState<ValidationSummary>({
    totalRequests: 0,
    validRequests: 0,
    invalidRequests: 0,
    totalAmount: 0,
    validAmount: 0,
    invalidAmount: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchQuery]);

  useEffect(() => {
    updateValidationSummary();
  }, [filteredRequests]);

  const loadData = async () => {
    setLoading(true);
    try {
      const mockData = getMockReadyRequests();
      setRequests(mockData);
      setFilteredRequests(mockData);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load ready requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    if (!searchQuery) {
      setFilteredRequests(requests);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = requests.filter(
      (req) =>
        req.employeeName.toLowerCase().includes(query) ||
        req.requestNumber.toLowerCase().includes(query) ||
        req.department.toLowerCase().includes(query) ||
        req.destination.toLowerCase().includes(query)
    );
    setFilteredRequests(filtered);
  };

  const updateValidationSummary = () => {
    const valid = filteredRequests.filter(r => r.recipientDetails.isValid);
    const invalid = filteredRequests.filter(r => !r.recipientDetails.isValid);
    const totalAmount = filteredRequests.reduce((sum, r) => sum + r.totalAmount, 0);
    const validAmount = valid.reduce((sum, r) => sum + r.totalAmount, 0);
    const invalidAmount = invalid.reduce((sum, r) => sum + r.totalAmount, 0);
    
    setValidationSummary({
      totalRequests: filteredRequests.length,
      validRequests: valid.length,
      invalidRequests: invalid.length,
      totalAmount,
      validAmount,
      invalidAmount,
    });
  };

  const handleSelectRequest = (id: string, selected: boolean) => {
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

  const handleSelectAllInGroup = (eventId: string, selected: boolean) => {
    const group = eventGroups.find(g => g.eventId === eventId);
    if (group) {
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        group.requests.forEach((req) => {
          if (selected) {
            newSet.add(req.id);
          } else {
            newSet.delete(req.id);
          }
        });
        return newSet;
      });
    }
  };

  const handleValidateRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              recipientDetails: { ...req.recipientDetails, isValid: true, validationError: undefined },
              status: 'validated',
            }
          : req
      )
    );
    toast.success('Recipient details validated');
  };

  const handleCreateBatch = () => {
    const selectedRequests = requests.filter(r => selectedIds.has(r.id));
    if (selectedRequests.length === 0) {
      toast.error('Please select at least one request');
      return;
    }
    
    const invalidSelected = selectedRequests.filter(r => !r.recipientDetails.isValid);
    if (invalidSelected.length > 0) {
      toast.error(`${invalidSelected.length} selected request(s) have invalid recipient details`);
      return;
    }
    
    toast.success(`Creating batch with ${selectedRequests.length} requests totaling ${formatCurrency(selectedRequests.reduce((sum, r) => sum + r.totalAmount, 0))}`);
    // Navigate to batch creation page
    // router.push('/finance/disbursements/bulk');
  };

  const eventGroups = groupRequestsByEvent(filteredRequests);
  const selectedTotalAmount = requests
    .filter(r => selectedIds.has(r.id))
    .reduce((sum, r) => sum + r.totalAmount, 0);
  const selectedCount = selectedIds.size;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">Loading ready requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Ready for Disbursement</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Approved requests ready for payment processing
          </p>
        </div>
        <button
          onClick={handleCreateBatch}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-colors"
        >
          <Plus size={16} />
          Create Batch ({selectedCount})
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

      {/* Validation Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-2">
            <FileText size={18} className="text-blue-500" />
            <span className="text-sm text-[var(--text-secondary)]">Total Requests</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{validationSummary.totalRequests}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{formatCurrency(validationSummary.totalAmount)}</p>
        </div>
        <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-green-500" />
            <span className="text-sm text-[var(--text-secondary)]">Valid Details</span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{validationSummary.validRequests}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{formatCurrency(validationSummary.validAmount)}</p>
        </div>
        <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={18} className="text-red-500" />
            <span className="text-sm text-[var(--text-secondary)]">Invalid Details</span>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{validationSummary.invalidRequests}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{formatCurrency(validationSummary.invalidAmount)}</p>
        </div>
        <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={18} className="text-yellow-500" />
            <span className="text-sm text-[var(--text-secondary)]">Selected</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{selectedCount}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{formatCurrency(selectedTotalAmount)}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
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

      {/* Event Groups */}
      {eventGroups.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#84cc16]/20 flex items-center justify-center">
            <CheckCircle size={32} className="text-[#84cc16]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Ready Requests</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            No approved requests are ready for disbursement at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {eventGroups.map((group) => (
            <EventGroupAccordion
              key={group.eventId}
              group={group}
              selectedIds={selectedIds}
              onSelectRequest={handleSelectRequest}
              onSelectAllInGroup={handleSelectAllInGroup}
              onValidateRequest={handleValidateRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
}