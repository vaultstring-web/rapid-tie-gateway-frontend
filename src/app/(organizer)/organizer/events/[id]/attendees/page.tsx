'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Mail, CheckCircle, Users, Filter } from 'lucide-react';
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

export default function AttendeeListPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  // Mock tiers for filter
  const tiers = [
    { id: '1', name: 'VIP' },
    { id: '2', name: 'General Admission' },
    { id: '3', name: 'Early Bird' },
    { id: '4', name: 'Group Ticket' },
  ];

  const loadAttendees = useCallback(async (resetPage = true) => {
    if (resetPage) setPage(1);
    setLoading(true);
    
    try {
      let data;
      try {
        data = await attendeeListService.getAttendees(eventId, resetPage ? 1 : page, 20, filters);
        setUseMockData(false);
      } catch (error) {
        console.warn('Failed to fetch from API, using mock data:', error);
        const mockAttendees = getMockAttendees();
        data = {
          attendees: mockAttendees,
          total: mockAttendees.length,
          page: 1,
          limit: 20,
          hasMore: false,
        };
        setUseMockData(true);
      }
      
      if (resetPage) {
        setAttendees(data.attendees);
      } else {
        setAttendees(prev => [...prev, ...data.attendees]);
      }
      setTotal(data.total);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Failed to load attendees:', error);
      toast.error('Failed to load attendees');
    } finally {
      setLoading(false);
    }
  }, [eventId, page, filters]);

  useEffect(() => {
    loadAttendees(true);
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
    if (useMockData) {
      toast.success('Demo: Attendee checked in');
      setAttendees(prev => prev.map(a =>
        a.id === attendeeId
          ? { ...a, status: 'checked_in', checkedInAt: new Date().toISOString(), checkedInBy: 'Staff' }
          : a
      ));
      return;
    }
    
    try {
      await attendeeListService.checkInAttendee(eventId, attendeeId);
      toast.success('Attendee checked in');
      loadAttendees(true);
    } catch (error) {
      toast.error('Failed to check in attendee');
    }
  };

  const handleBulkCheckIn = async () => {
    if (selectedAttendees.length === 0) {
      toast.error('No attendees selected');
      return;
    }
    
    if (useMockData) {
      toast.success(`Demo: ${selectedAttendees.length} attendees checked in`);
      setAttendees(prev => prev.map(a =>
        selectedAttendees.includes(a.id)
          ? { ...a, status: 'checked_in', checkedInAt: new Date().toISOString(), checkedInBy: 'Staff' }
          : a
      ));
      setSelectedAttendees([]);
      return;
    }
    
    try {
      await attendeeListService.bulkCheckIn(eventId, selectedAttendees);
      toast.success(`${selectedAttendees.length} attendees checked in`);
      loadAttendees(true);
      setSelectedAttendees([]);
    } catch (error) {
      toast.error('Failed to check in attendees');
    }
  };

  const handleSendReminder = async (attendeeId: string) => {
    if (useMockData) {
      toast.success('Demo: Reminder sent');
      return;
    }
    
    try {
      await attendeeListService.sendReminder(eventId, [attendeeId]);
      toast.success('Reminder sent');
    } catch (error) {
      toast.error('Failed to send reminder');
    }
  };

  const handleBulkReminder = async () => {
    if (selectedAttendees.length === 0) {
      toast.error('No attendees selected');
      return;
    }
    
    if (useMockData) {
      toast.success(`Demo: Reminders sent to ${selectedAttendees.length} attendees`);
      setSelectedAttendees([]);
      return;
    }
    
    try {
      await attendeeListService.sendReminder(eventId, selectedAttendees);
      toast.success(`Reminders sent to ${selectedAttendees.length} attendees`);
      setSelectedAttendees([]);
    } catch (error) {
      toast.error('Failed to send reminders');
    }
  };

  const handleExport = async (format: 'csv' | 'excel') => {
    if (useMockData) {
      toast.info('Export not available in demo mode');
      return;
    }
    
    try {
      const blob = await attendeeListService.exportAttendees(eventId, {
        format,
        includeFields: ['ticketNumber', 'firstName', 'lastName', 'email', 'phone', 'role', 'tierName', 'status', 'purchaseDate'],
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendees-${eventId}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export');
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
      loadAttendees(false);
    }
  };

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
                {total} total attendees
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
          <div className="mb-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              ⚠️ Demo Mode - Using sample data. Connect to backend for real data.
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <AttendeeFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            tiers={tiers}
          />
        </div>

        {/* Attendee Table */}
        <AttendeeTable
          attendees={attendees}
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
            setSelectedAttendees(selected ? attendees.map(a => a.id) : []);
          }}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {/* Load More */}
        {hasMore && attendees.length < total && (
          <div className="text-center mt-6">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-6 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}