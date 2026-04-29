'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, CheckCircle, XCircle, Mail, Phone, ChevronRight, ChevronLeft } from 'lucide-react';
import { Attendee, ROLE_BADGE_CONFIG, STATUS_CONFIG } from '@/types/organizer/attendeeList';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface AttendeeTableProps {
  attendees: Attendee[];
  loading?: boolean;
  onCheckIn?: (attendeeId: string) => void;
  onSendReminder?: (attendeeId: string) => void;
  selectedAttendees: string[];
  onSelectAttendee: (attendeeId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export const AttendeeTable = ({
  attendees,
  loading,
  onCheckIn,
  onSendReminder,
  selectedAttendees,
  onSelectAttendee,
  onSelectAll,
  sortField,
  sortDirection,
  onSort,
}: AttendeeTableProps) => {
  const { theme } = useTheme();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpand = (attendeeId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(attendeeId)) {
        newSet.delete(attendeeId);
      } else {
        newSet.add(attendeeId);
      }
      return newSet;
    });
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ChevronUp size={14} className="opacity-30" />;
    return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      style={{ color: 'var(--text-secondary)' }}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {getSortIcon(field)}
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="overflow-x-auto">
        <div className="animate-pulse space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (attendees.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No attendees found</p>
      </div>
    );
  }

  const allSelected = attendees.length > 0 && selectedAttendees.length === attendees.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
            <th className="px-4 py-3 w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
              />
            </th>
            <SortableHeader field="ticketNumber">Ticket #</SortableHeader>
            <SortableHeader field="firstName">Name</SortableHeader>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Contact
            </th>
            <SortableHeader field="role">Role</SortableHeader>
            <SortableHeader field="tierName">Ticket Tier</SortableHeader>
            <SortableHeader field="status">Status</SortableHeader>
            <SortableHeader field="purchaseDate">Purchase Date</SortableHeader>
            <th className="px-4 py-3 w-24"></th>
          </tr>
        </thead>
        <tbody>
          {attendees.map((attendee) => {
            const roleConfig = ROLE_BADGE_CONFIG[attendee.role];
            const statusConfig = STATUS_CONFIG[attendee.status];
            const isExpanded = expandedRows.has(attendee.id);
            const isSelected = selectedAttendees.includes(attendee.id);

            return (
              <>
                <tr
                  key={attendee.id}
                  className="border-b hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
                  style={{ borderColor: 'var(--border-color)' }}
                  onClick={() => toggleRowExpand(attendee.id)}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onSelectAttendee(attendee.id, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                    {attendee.ticketNumber}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {attendee.firstName} {attendee.lastName}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <Mail size={10} />
                        <span className="truncate max-w-[150px]">{attendee.email}</span>
                      </div>
                      {attendee.phone && (
                        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <Phone size={10} />
                          <span>{attendee.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleConfig.bgColor} ${roleConfig.color}`}>
                      {roleConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                    {attendee.tierName}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 text-xs ${statusConfig.color}`}>
                      <span>{statusConfig.icon}</span>
                      <span>{statusConfig.label}</span>
                    </span>
                    {attendee.checkedInAt && (
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {new Date(attendee.checkedInAt).toLocaleTimeString()}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {formatDate(attendee.purchaseDate)}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1">
                      {attendee.status === 'not_checked_in' && onCheckIn && (
                        <button
                          onClick={() => onCheckIn(attendee.id)}
                          className="p-1 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
                          title="Check In"
                        >
                          <CheckCircle size={16} className="text-green-500" />
                        </button>
                      )}
                      {onSendReminder && (
                        <button
                          onClick={() => onSendReminder(attendee.id)}
                          className="p-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                          title="Send Reminder"
                        >
                          <Mail size={16} className="text-blue-500" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {isExpanded && attendee.specialRequests && (
                  <tr className="border-b bg-[var(--hover-bg)]" style={{ borderColor: 'var(--border-color)' }}>
                    <td colSpan={9} className="px-4 py-3">
                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Special Requests:</p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{attendee.specialRequests}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};