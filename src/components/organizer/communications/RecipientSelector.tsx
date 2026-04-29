'use client';

import { useState, useEffect } from 'react';
import { Users, Filter, ChevronDown, Check, X, Mail, Smartphone } from 'lucide-react';
import { RecipientFilter, RecipientCountResponse, ROLES } from '@/types/events/bulkMessaging';
import { useTheme } from '@/context/ThemeContext';

interface RecipientSelectorProps {
  eventId: string;
  onFilterChange: (filter: RecipientFilter) => void;
  onCountChange?: (count: RecipientCountResponse) => void;
  loading?: boolean;
}

export const RecipientSelector = ({ eventId, onFilterChange, onCountChange, loading }: RecipientSelectorProps) => {
  const { theme } = useTheme();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [attendanceStatus, setAttendanceStatus] = useState<'all' | 'attended' | 'not_attended'>('all');
  const [checkInStatus, setCheckInStatus] = useState<'all' | 'checked_in' | 'not_checked_in'>('all');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showTierDropdown, setShowTierDropdown] = useState(false);
  const [recipientCount, setRecipientCount] = useState<RecipientCountResponse | null>(null);

  // Mock ticket tiers - would come from API
  const ticketTiers = ['VIP', 'General Admission', 'Early Bird', 'Group Ticket'];

  useEffect(() => {
    const filter: RecipientFilter = {
      roles: selectedRoles.length > 0 ? selectedRoles : undefined,
      ticketTiers: selectedTiers.length > 0 ? selectedTiers : undefined,
      attendanceStatus: attendanceStatus !== 'all' ? attendanceStatus : undefined,
      checkInStatus: checkInStatus !== 'all' ? checkInStatus : undefined,
    };
    onFilterChange(filter);
    
    // Mock count update
    const mockCount: RecipientCountResponse = {
      total: 1250,
      byRole: {
        MERCHANT: 450,
        ORGANIZER: 120,
        EMPLOYEE: 300,
        APPROVER: 80,
        FINANCE_OFFICER: 50,
        ADMIN: 10,
        PUBLIC: 240,
      },
      byTicketTier: {
        VIP: 200,
        'General Admission': 800,
        'Early Bird': 150,
        'Group Ticket': 100,
      },
    };
    setRecipientCount(mockCount);
    onCountChange?.(mockCount);
  }, [selectedRoles, selectedTiers, attendanceStatus, checkInStatus]);

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const toggleTier = (tier: string) => {
    setSelectedTiers(prev =>
      prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]
    );
  };

  const clearFilters = () => {
    setSelectedRoles([]);
    setSelectedTiers([]);
    setAttendanceStatus('all');
    setCheckInStatus('all');
  };

  const hasActiveFilters = selectedRoles.length > 0 || selectedTiers.length > 0 || 
    attendanceStatus !== 'all' || checkInStatus !== 'all';

  return (
    <div
      className="rounded-xl p-6 border"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-primary-green-500" />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Select Recipients
          </h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-green-500 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Role Selection */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
          Roles
        </label>
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="w-full px-3 py-2 rounded-lg border flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary-green-500"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <span>
              {selectedRoles.length === 0 
                ? 'All roles' 
                : `${selectedRoles.length} role${selectedRoles.length !== 1 ? 's' : ''} selected`}
            </span>
            <ChevronDown size={16} />
          </button>
          {showRoleDropdown && (
            <div
              className="absolute z-10 mt-1 w-full rounded-lg border shadow-lg max-h-64 overflow-y-auto"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              {ROLES.map((role) => (
                <label
                  key={role.value}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.value)}
                    onChange={() => toggleRole(role.value)}
                    className="w-4 h-4 rounded border-gray-300 text-primary-green-500 focus:ring-primary-green-500"
                  />
                  <span style={{ color: role.color }}>{role.icon}</span>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {role.label}
                  </span>
                  {recipientCount && (
                    <span className="text-xs ml-auto" style={{ color: 'var(--text-secondary)' }}>
                      {recipientCount.byRole[role.value] || 0}
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ticket Tier Selection */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
          Ticket Tier
        </label>
        <div className="relative">
          <button
            onClick={() => setShowTierDropdown(!showTierDropdown)}
            className="w-full px-3 py-2 rounded-lg border flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary-green-500"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <span>
              {selectedTiers.length === 0 
                ? 'All tiers' 
                : `${selectedTiers.length} tier${selectedTiers.length !== 1 ? 's' : ''} selected`}
            </span>
            <ChevronDown size={16} />
          </button>
          {showTierDropdown && (
            <div
              className="absolute z-10 mt-1 w-full rounded-lg border shadow-lg"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              {ticketTiers.map((tier) => (
                <label
                  key={tier}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={selectedTiers.includes(tier)}
                    onChange={() => toggleTier(tier)}
                    className="w-4 h-4 rounded border-gray-300 text-primary-green-500 focus:ring-primary-green-500"
                  />
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {tier}
                  </span>
                  {recipientCount && (
                    <span className="text-xs ml-auto" style={{ color: 'var(--text-secondary)' }}>
                      {recipientCount.byTicketTier[tier] || 0}
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Attendance Status */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
          Attendance Status
        </label>
        <div className="flex gap-2">
          {(['all', 'attended', 'not_attended'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setAttendanceStatus(status)}
              className={`flex-1 px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                attendanceStatus === status
                  ? 'bg-primary-green-500 text-white'
                  : 'border hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: attendanceStatus === status ? undefined : 'transparent',
              }}
            >
              {status === 'all' ? 'All' : status === 'attended' ? 'Attended' : 'Not Attended'}
            </button>
          ))}
        </div>
      </div>

      {/* Check-in Status */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
          Check-in Status
        </label>
        <div className="flex gap-2">
          {(['all', 'checked_in', 'not_checked_in'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setCheckInStatus(status)}
              className={`flex-1 px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                checkInStatus === status
                  ? 'bg-primary-green-500 text-white'
                  : 'border hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: checkInStatus === status ? undefined : 'transparent',
              }}
            >
              {status === 'all' ? 'All' : status === 'checked_in' ? 'Checked In' : 'Not Checked In'}
            </button>
          ))}
        </div>
      </div>

      {/* Recipient Count Summary */}
      {recipientCount && (
        <div
          className="mt-4 p-3 rounded-lg"
          style={{ backgroundColor: 'var(--hover-bg)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Total Recipients
            </span>
            <span className="text-xl font-bold text-primary-green-500">
              {recipientCount.total.toLocaleString()}
            </span>
          </div>
          <div className="flex gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span>📧 Email: {recipientCount.total}</span>
            <span>📱 SMS: {Math.floor(recipientCount.total * 0.7)}</span>
          </div>
        </div>
      )}
    </div>
  );
};