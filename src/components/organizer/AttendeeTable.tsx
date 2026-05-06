'use client';

import { CheckCircle, Mail, Phone } from 'lucide-react';
import { Attendee, ROLE_LABELS } from '@/types/organizer/eventManagement';

interface AttendeeTableProps {
  attendees: Attendee[];
  selectedAttendees: string[];
  onSelectAttendee: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onCheckIn?: (id: string) => void;
}

const roleBadges: Record<string, { label: string; color: string; bg: string }> = {
  MERCHANT: { label: 'Merchant', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  ORGANIZER: { label: 'Organizer', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  EMPLOYEE: { label: 'Employee', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  APPROVER: { label: 'Approver', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  FINANCE_OFFICER: { label: 'Finance', color: 'text-cyan-600', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
  ADMIN: { label: 'Admin', color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/30' },
  PUBLIC: { label: 'Public', color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-800' },
};

export const AttendeeTable = ({ attendees, selectedAttendees, onSelectAttendee, onSelectAll, onCheckIn }: AttendeeTableProps) => {
  const allSelected = attendees.length > 0 && selectedAttendees.length === attendees.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-[var(--border-color)]">
          <tr>
            <th className="px-4 py-3 w-10">
              <input type="checkbox" checked={allSelected} onChange={(e) => onSelectAll(e.target.checked)} className="w-4 h-4 rounded" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)]">Ticket</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)]">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)]">Role</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)]">Tier</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)]">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)]">Purchase Date</th>
            <th className="px-4 py-3 w-20"></th>
          </tr>
        </thead>
        <tbody>
          {attendees.map((attendee) => {
            const badge = roleBadges[attendee.role];
            const isSelected = selectedAttendees.includes(attendee.id);
            return (
              <tr key={attendee.id} className="border-b border-[var(--border-color)] hover:bg-[var(--hover-bg)]">
                <td className="px-4 py-3">
                  <input type="checkbox" checked={isSelected} onChange={(e) => onSelectAttendee(attendee.id, e.target.checked)} className="w-4 h-4 rounded" />
                </td>
                <td className="px-4 py-3 font-mono text-sm text-[var(--text-primary)]">{attendee.ticketNumber}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--text-primary)]">{attendee.firstName} {attendee.lastName}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{attendee.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge?.bg} ${badge?.color}`}>{badge?.label}</span>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{attendee.tierName}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs ${attendee.status === 'checked_in' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {attendee.status === 'checked_in' ? '✓ Checked In' : '⏳ Not Checked In'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{new Date(attendee.purchaseDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {attendee.status === 'not_checked_in' && onCheckIn && (
                    <button onClick={() => onCheckIn(attendee.id)} className="p-1 rounded-lg hover:bg-green-100" title="Check In">
                      <CheckCircle size={16} className="text-green-500" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};