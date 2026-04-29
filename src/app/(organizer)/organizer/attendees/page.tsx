'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Mail, CheckCircle, Users } from 'lucide-react';
import { AttendeeTable } from '@/components/organizer/attendees/AttendeeTable';
import { AttendeeFilterBar } from '@/components/organizer/attendees/AttendeeFilterBar';
import { attendeeListService } from '@/services/organizer/attendeeList.service';
import { Attendee, AttendeeFilters } from '@/types/organizer/attendeeList';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const getMockAttendees = (): Attendee[] => {
  const roles = ['MERCHANT', 'ORGANIZER', 'EMPLOYEE', 'APPROVER', 'FINANCE_OFFICER', 'ADMIN', 'PUBLIC'];
  const tiers = ['VIP', 'General Admission', 'Early Bird', 'Group Ticket'];
  const statuses = ['checked_in', 'not_checked_in', 'refunded', 'cancelled'];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: `attendee-${i + 1}`,
    ticketNumber: `TKT-${String(i + 1).padStart(4, '0')}`,
    firstName: ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa'][i % 6],
    lastName: ['Smith', 'Doe', 'Johnson', 'Williams', 'Brown', 'Jones'][i % 6],
    email: `attendee${i + 1}@example.com`,
    phone: `+265 999 ${String(i + 100).padStart(3, '0')}`,
    role: roles[i % roles.length] as any,
    tierName: tiers[i % tiers.length],
    ticketPrice: [50000, 25000, 15000, 10000][i % 4],
    status: statuses[i % statuses.length] as any,
    checkedInAt: i % 3 === 0 ? new Date().toISOString() : undefined,
    checkedInBy: i % 3 === 0 ? 'Staff Member' : undefined,
    purchaseDate: new Date(Date.now() - i * 86400000).toISOString(),
    specialRequests: i % 5 === 0 ? 'Vegetarian meal requested' : undefined,
  }));
};

// Mock tiers for filter
const MOCK_TIERS = [
  { id: '1', name: 'VIP' },
  { id: '2', name: 'General Admission' },
  { id: '3', name: 'Early Bird' },
  { id: '4', name: 'Group Ticket' },
];

export default function AttendeeListPage() {
  const { theme } = useTheme();
  const router = useRouter();

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [filters, setFilters] = useState<AttendeeFilters>({
    search: '',
    role: '',
    tierId: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });
  const [sortField, setSortField] = useState('purchaseDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [useMockData, setUseMockData] = useState(true);

  const loadAttendees = useCallback(async () => {
    setLoading(true);
    
    try {
      // Using mock data for now since backend may not be ready
      const mockAttendees = getMockAttendees();
      setAttendees(mockAttendees);
      setTotal(mockAttendees.length);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load attendees:', error);
      toast.error('Failed to load attendees');
      // Fallback to mock data
      const mockAttendees = getMockAttendees();
      setAttendees(mockAttendees);
      setTotal(mockAttendees.length);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAttendees();
  }, [filters, sortField, sortDirection]);

  const handleFilterChange = (newFilters: Partial<AttendeeFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setSelectedAttendees([]);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      role: '',
      tierId: '',
      status: '',
      dateFrom: '',
      dateTo: '',
    });
    setSelectedAttendees([]);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCheckIn = async (attendeeId: string) => {
    toast.success('Demo: Attendee checked in');
    setAttendees(prev => prev.map(a =>
      a.id === attendeeId
        ? { ...a, status: 'checked_in', checkedInAt: new Date().toISOString(), checkedInBy: 'Staff' }
        : a
    ));
  };

  const handleBulkCheckIn = async () => {
    if (selectedAttendees.length === 0) {
      toast.error('No attendees selected');
      return;
    }
    toast.success(`Demo: ${selectedAttendees.length} attendees checked in`);
    setAttendees(prev => prev.map(a =>
      selectedAttendees.includes(a.id)
        ? { ...a, status: 'checked_in', checkedInAt: new Date().toISOString(), checkedInBy: 'Staff' }
        : a
    ));
    setSelectedAttendees([]);
  };

  const handleSendReminder = async (attendeeId: string) => {
    toast.success('Demo: Reminder sent');
  };

  const handleBulkReminder = async () => {
    if (selectedAttendees.length === 0) {
      toast.error('No attendees selected');
      return;
    }
    toast.success(`Demo: Reminders sent to ${selectedAttendees.length} attendees`);
    setSelectedAttendees([]);
  };

  const handleExport = async (format: 'csv' | 'excel') => {
    toast.info(`Demo: Exporting as ${format.toUpperCase()}`);
  };

  // Apply filters to attendees
  const filteredAttendees = attendees.filter(attendee => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchName = `${attendee.firstName} ${attendee.lastName}`.toLowerCase().includes(searchLower);
      const matchEmail = attendee.email.toLowerCase().includes(searchLower);
      const matchTicket = attendee.ticketNumber.toLowerCase().includes(searchLower);
      if (!matchName && !matchEmail && !matchTicket) return false;
    }
    if (filters.role && attendee.role !== filters.role) return false;
    if (filters.status && attendee.status !== filters.status) return false;
    if (filters.tierId) {
      const tierMap: Record<string, string> = { '1': 'VIP', '2': 'General Admission', '3': 'Early Bird', '4': 'Group Ticket' };
      if (attendee.tierName !== tierMap[filters.tierId]) return false;
    }
    return true;
  });

  // Sort attendees
  const sortedAttendees = [...filteredAttendees].sort((a, b) => {
    let aVal: any = a[sortField as keyof Attendee];
    let bVal: any = b[sortField as keyof Attendee];
    if (sortField === 'firstName') {
      aVal = `${a.firstName} ${a.lastName}`;
      bVal = `${b.firstName} ${b.lastName}`;
    }
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

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
                Attendee List
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {sortedAttendees.length} total attendees
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {selectedAttendees.length > 0 && (
              <>
                <button
                  onClick={handleBulkCheckIn}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                >
                  <CheckCircle size={16} />
                  Check In ({selectedAttendees.length})
                </button>
                <button
                  onClick={handleBulkReminder}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  <Mail size={16} />
                  Send Reminder
                </button>
              </>
            )}
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <Download size={16} />
              Export Excel
            </button>
          </div>
        </div>

        {/* Demo Mode Notice */}
        {useMockData && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              ℹ️ Demo Mode - Using sample data. Connect to backend for real data.
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <AttendeeFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            tiers={MOCK_TIERS}
          />
        </div>

        {/* Attendee Table */}
        <AttendeeTable
          attendees={sortedAttendees}
          loading={loading}
          onCheckIn={handleCheckIn}
          onSendReminder={handleSendReminder}
          selectedAttendees={selectedAttendees}
          onSelectAttendee={(id, selected) => {
            setSelectedAttendees(prev =>
              selected ? [...prev, id] : prev.filter(i => i !== id)
            );
          }}
          onSelectAll={(selected) => {
            setSelectedAttendees(selected ? sortedAttendees.map(a => a.id) : []);
          }}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>
    </div>
  );
}