'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserStatsCards } from '@/components/admin/users/UserStatsCards';
import { UserTable } from '@/components/admin/users/UserTable';
import { UserFilterBar } from '@/components/admin/users/UserFilterBar';
import { usersService } from '@/services/admin/users.service';
import { User, UserStats, UserFilter } from '@/types/admin/users';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const getMockUsers = (): User[] => {
  const roles = ['MERCHANT', 'ORGANIZER', 'EMPLOYEE', 'APPROVER', 'FINANCE_OFFICER', 'ADMIN', 'COMPLIANCE', 'PUBLIC'];
  const statuses = ['active', 'inactive', 'suspended'];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: `user-${i + 1}`,
    email: `user${i + 1}@example.com`,
    phone: `+265 999 ${String(i + 100).padStart(3, '0')}`,
    firstName: ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Peter', 'Mary'][i % 8],
    lastName: ['Smith', 'Doe', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'][i % 8],
    role: roles[i % roles.length] as any,
    status: statuses[i % statuses.length] as any,
    emailVerified: i % 2 === 0,
    phoneVerified: i % 3 === 0,
    twoFactorEnabled: i % 4 === 0,
    lastLoginAt: i % 5 === 0 ? new Date(Date.now() - i * 86400000).toISOString() : undefined,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    eventsAttended: Math.floor(Math.random() * 20),
    eventsAttendedList: [
      { id: '1', name: 'Malawi Fintech Expo', date: new Date().toISOString() },
      { id: '2', name: 'Tech Summit 2026', date: new Date().toISOString() },
    ].slice(0, Math.floor(Math.random() * 3) + 1),
    merchant: i % 3 === 0 ? { id: `merchant-${i}`, businessName: `Business ${i + 1}` } : undefined,
    organizer: i % 4 === 1 ? { id: `organizer-${i}`, organizationName: `Org ${i + 1}` } : undefined,
  }));
};

const getMockUserStats = (): UserStats => {
  const users = getMockUsers();
  return {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    byRole: {
      MERCHANT: users.filter(u => u.role === 'MERCHANT').length,
      ORGANIZER: users.filter(u => u.role === 'ORGANIZER').length,
      EMPLOYEE: users.filter(u => u.role === 'EMPLOYEE').length,
      APPROVER: users.filter(u => u.role === 'APPROVER').length,
      FINANCE_OFFICER: users.filter(u => u.role === 'FINANCE_OFFICER').length,
      ADMIN: users.filter(u => u.role === 'ADMIN').length,
      COMPLIANCE: users.filter(u => u.role === 'COMPLIANCE').length,
      PUBLIC: users.filter(u => u.role === 'PUBLIC').length,
    },
    newToday: 5,
    newThisWeek: 28,
    newThisMonth: 112,
  };
};

export default function UserManagementPage() {
  const { theme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilter>({
    search: '',
    role: '',
    status: '',
  });
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Using mock data for now
      let mockUsers = getMockUsers();
      const mockStats = getMockUserStats();
      
      // Apply filters
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        mockUsers = mockUsers.filter(u =>
          u.email.toLowerCase().includes(searchLower) ||
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchLower) ||
          u.id.toLowerCase().includes(searchLower)
        );
      }
      if (filters.role) {
        mockUsers = mockUsers.filter(u => u.role === filters.role);
      }
      if (filters.status) {
        mockUsers = mockUsers.filter(u => u.status === filters.status);
      }
      
      setUsers(mockUsers);
      setStats(mockStats);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
      setUsers(getMockUsers());
      setStats(getMockUserStats());
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (useMockData) {
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, role: newRole as any } : u
      ));
      return;
    }
    try {
      await usersService.updateUserRole(userId, newRole);
      await loadData();
    } catch (error) {
      toast.error('Failed to update role');
      throw error;
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    if (useMockData) {
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, status: newStatus } : u
      ));
      return;
    }
    try {
      await usersService.updateUserStatus(userId, newStatus);
      await loadData();
    } catch (error) {
      toast.error('Failed to update status');
      throw error;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (useMockData) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success('User deleted');
      return;
    }
    try {
      await usersService.deleteUser(userId);
      toast.success('User deleted');
      await loadData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleResendVerification = async (userId: string) => {
    if (useMockData) {
      toast.success('Verification email sent (demo)');
      return;
    }
    try {
      await usersService.resendVerificationEmail(userId);
    } catch (error) {
      toast.error('Failed to send verification');
      throw error;
    }
  };

  const handleFilterChange = (newFilters: Partial<UserFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({ search: '', role: '', status: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">User Management</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage all registered users and their accounts
        </p>
      </div>

      {/* Demo Mode Notice */}
      {useMockData && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ℹ️ Demo Mode - Using sample data. Connect to backend for live data.
          </p>
        </div>
      )}

      {/* Stats Cards */}
      {stats && <UserStatsCards stats={stats} loading={loading} />}

      {/* Filters */}
      <UserFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Users Table */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-color)]">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Users</h2>
            <p className="text-sm text-[var(--text-secondary)]">{users.length} total</p>
          </div>
        </div>
        <UserTable
          users={users}
          loading={loading}
          onRoleChange={handleRoleChange}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteUser}
          onResendVerification={handleResendVerification}
        />
      </div>
    </div>
  );
}