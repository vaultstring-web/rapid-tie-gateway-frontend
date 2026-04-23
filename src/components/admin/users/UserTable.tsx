'use client';

import { useState } from 'react';
import { 
  MoreVertical, 
  Eye, 
  Mail, 
  Power, 
  Trash2,
  Calendar,
  CheckCircle,
  XCircle,
  Send,
  Users,
  Building2
} from 'lucide-react';
import { User, USER_ROLES, USER_STATUS_CONFIG } from '@/types/admin/users';
import { formatDate } from '@/lib/utils/format';  // ← Add this import
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import toast from 'react-hot-toast';



interface UserTableProps {
  users: User[];
  loading?: boolean;
  onRoleChange?: (userId: string, role: string) => void;
  onStatusChange?: (userId: string, status: 'active' | 'inactive' | 'suspended') => void;
  onDelete?: (userId: string) => void;
  onResendVerification?: (userId: string) => void;
}

export const UserTable = ({
  users,
  loading,
  onRoleChange,
  onStatusChange,
  onDelete,
  onResendVerification,
}: UserTableProps) => {
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const [changingStatus, setChangingStatus] = useState<string | null>(null);

  const getRoleConfig = (role: string) => {
    return USER_ROLES.find(r => r.value === role) || USER_ROLES[0];
  };

  const getStatusConfig = (status: string) => {
    return USER_STATUS_CONFIG[status as keyof typeof USER_STATUS_CONFIG];
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setChangingRole(userId);
    try {
      await onRoleChange?.(userId, newRole);
      toast.success('Role updated successfully');
    } catch (error) {
      toast.error('Failed to update role');
    } finally {
      setChangingRole(null);
      setMenuOpen(null);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    setChangingStatus(userId);
    try {
      await onStatusChange?.(userId, newStatus);
      toast.success(`User ${newStatus === 'active' ? 'activated' : newStatus === 'suspended' ? 'suspended' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setChangingStatus(null);
      setMenuOpen(null);
    }
  };

  const handleResendVerification = async (userId: string) => {
    try {
      await onResendVerification?.(userId);
      toast.success('Verification email sent');
    } catch (error) {
      toast.error('Failed to send verification email');
    }
    setMenuOpen(null);
  };

  if (loading) {
    return (
      <div className="overflow-x-auto">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="flex gap-4">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <Users size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Users Found</h3>
        <p className="text-sm text-[var(--text-secondary)]">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">User</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Contact</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Role</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Status</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Events</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Last Login</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Verification</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
          {users.map((user) => {
            const roleConfig = getRoleConfig(user.role);
            const statusConfig = getStatusConfig(user.status);
            const fullName = `${user.firstName} ${user.lastName}`.trim();
            
            return (
              <tr key={user.id} className="hover:bg-[var(--hover-bg)] transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{fullName || user.email}</p>
                    <p className="text-xs text-[var(--text-secondary)]">ID: {user.id.slice(0, 8)}...</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-[var(--text-primary)]">{user.email}</p>
                  {user.phone && <p className="text-xs text-[var(--text-secondary)]">{user.phone}</p>}
                  {user.merchant && (
                    <p className="text-xs text-[#84cc16] mt-1">Merchant: {user.merchant.businessName}</p>
                  )}
                  {user.organizer && (
                    <p className="text-xs text-[#84cc16] mt-1">Organizer: {user.organizer.organizationName}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={changingRole === user.id}
                    className="px-2 py-1 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {USER_ROLES.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  {changingRole === user.id && (
                    <div className="inline-block ml-2">
                      <div className="w-3 h-3 border-2 border-[#84cc16] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => {
                        const newStatus = user.status === 'active' ? 'inactive' : 'active';
                        handleStatusChange(user.id, newStatus);
                      }}
                      disabled={changingStatus === user.id}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        user.status === 'active' ? 'bg-[#84cc16]' : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          user.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <span className={`text-xs mt-1 inline-block ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => {
                      if (user.eventsAttendedList && user.eventsAttendedList.length > 0) {
                        toast.info(`${user.eventsAttended} events attended`);
                      }
                    }}
                    className="text-sm font-semibold text-[#84cc16] hover:underline"
                  >
                    {user.eventsAttended}
                  </button>
                  {user.eventsAttendedList && user.eventsAttendedList.length > 0 && (
                    <div className="text-xs text-[var(--text-secondary)] mt-1">
                      {user.eventsAttendedList.slice(0, 2).map((event, idx) => (
                        <div key={event.id} className="truncate">
                          • {event.name}
                        </div>
                      ))}
                      {user.eventsAttendedList.length > 2 && (
                        <div className="text-[10px]">+{user.eventsAttendedList.length - 2} more</div>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {user.lastLoginAt ? (
                    <div>
                      <p className="text-sm text-[var(--text-primary)]">{formatDate(user.lastLoginAt)}</p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {new Date(user.lastLoginAt).toLocaleTimeString()}
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm text-[var(--text-secondary)]">Never</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {user.emailVerified ? (
                      <CheckCircle size={16} className="text-green-500" title="Email verified" />
                    ) : (
                      <XCircle size={16} className="text-red-500" title="Email not verified" />
                    )}
                    {user.twoFactorEnabled && (
                      <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                        <span className="text-white text-[8px]">2FA</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}
                      className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
                    >
                      <MoreVertical size={16} className="text-[var(--text-secondary)]" />
                    </button>
                    {menuOpen === user.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-lg z-10 overflow-hidden">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--hover-bg)] text-[var(--text-primary)]"
                          onClick={() => setMenuOpen(null)}
                        >
                          <Eye size={14} />
                          View Details
                        </Link>
                        {!user.emailVerified && (
                          <button
                            onClick={() => {
                              handleResendVerification(user.id);
                              setMenuOpen(null);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left hover:bg-[var(--hover-bg)] text-blue-600"
                          >
                            <Send size={14} />
                            Resend Verification
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this user?')) {
                              onDelete?.(user.id);
                            }
                            setMenuOpen(null);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left hover:bg-[var(--hover-bg)] text-red-600"
                        >
                          <Trash2 size={14} />
                          Delete User
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};