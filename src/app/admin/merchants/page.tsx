'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { MerchantStatsCards } from '@/components/admin/merchants/MerchantStatsCards';
import { MerchantTable } from '@/components/admin/merchants/MerchantTable';
import { MerchantFilterBar } from '@/components/admin/merchants/MerchantFilterBar';
import { merchantsService } from '@/services/admin/merchants.service';
import { Merchant, MerchantFilter, MerchantStats } from '@/types/admin/merchants';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const getMockMerchants = (): Merchant[] => {
  return [
    {
      id: '1',
      businessName: 'ABC Enterprises',
      email: 'contact@abcenterprises.com',
      phone: '+265 999 123 456',
      firstName: 'John',
      lastName: 'Doe',
      status: 'active',
      registrationNumber: 'REG-2024-001',
      taxId: 'TIN-123456789',
      businessType: 'limited_liability',
      website: 'https://abcenterprises.com',
      address: '123 Main Street',
      city: 'Lilongwe',
      country: 'Malawi',
      eventsSponsored: 12,
      totalRevenue: 2450000,
      totalTransactions: 156,
      joinedAt: new Date(Date.now() - 90 * 86400000).toISOString(),
      lastActive: new Date().toISOString(),
    },
    {
      id: '2',
      businessName: 'XYZ Retail',
      email: 'info@xyzretail.com',
      phone: '+265 888 456 789',
      firstName: 'Jane',
      lastName: 'Smith',
      status: 'pending',
      registrationNumber: 'REG-2024-002',
      taxId: 'TIN-987654321',
      businessType: 'sole_proprietorship',
      website: 'https://xyzretail.com',
      address: '456 Market Street',
      city: 'Blantyre',
      country: 'Malawi',
      eventsSponsored: 0,
      totalRevenue: 0,
      totalTransactions: 0,
      joinedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      lastActive: new Date().toISOString(),
    },
    {
      id: '3',
      businessName: 'Tech Solutions Malawi',
      email: 'admin@techsolutions.mw',
      phone: '+265 997 789 012',
      firstName: 'Michael',
      lastName: 'Banda',
      status: 'active',
      registrationNumber: 'REG-2024-003',
      taxId: 'TIN-456789123',
      businessType: 'corporation',
      website: 'https://techsolutions.mw',
      address: '789 Business Park',
      city: 'Lilongwe',
      country: 'Malawi',
      eventsSponsored: 8,
      totalRevenue: 1850000,
      totalTransactions: 98,
      joinedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      lastActive: new Date().toISOString(),
    },
    {
      id: '4',
      businessName: 'Style Fashion House',
      email: 'hello@stylefashion.com',
      phone: '+265 996 345 678',
      firstName: 'Sarah',
      lastName: 'Chilima',
      status: 'suspended',
      registrationNumber: 'REG-2024-004',
      taxId: 'TIN-321654987',
      businessType: 'partnership',
      website: 'https://stylefashion.com',
      address: '123 Fashion Avenue',
      city: 'Mzuzu',
      country: 'Malawi',
      eventsSponsored: 3,
      totalRevenue: 450000,
      totalTransactions: 34,
      joinedAt: new Date(Date.now() - 120 * 86400000).toISOString(),
      lastActive: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
  ];
};

const getMockStats = (): MerchantStats => {
  const merchants = getMockMerchants();
  return {
    total: merchants.length,
    active: merchants.filter(m => m.status === 'active').length,
    pending: merchants.filter(m => m.status === 'pending').length,
    suspended: merchants.filter(m => m.status === 'suspended').length,
    totalRevenue: merchants.reduce((sum, m) => sum + m.totalRevenue, 0),
    totalEvents: merchants.reduce((sum, m) => sum + m.eventsSponsored, 0),
  };
};

export default function MerchantManagementPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [stats, setStats] = useState<MerchantStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MerchantFilter>({
    search: '',
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
      const mockMerchants = getMockMerchants();
      const mockStats = getMockStats();
      
      // Apply filters
      let filtered = [...mockMerchants];
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(m =>
          m.businessName.toLowerCase().includes(searchLower) ||
          m.email.toLowerCase().includes(searchLower) ||
          `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchLower)
        );
      }
      if (filters.status) {
        filtered = filtered.filter(m => m.status === filters.status);
      }
      
      setMerchants(filtered);
      setStats(mockStats);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load merchants:', error);
      toast.error('Failed to load merchants');
      const mockMerchants = getMockMerchants();
      const mockStats = getMockStats();
      setMerchants(mockMerchants);
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (merchantId: string) => {
    if (useMockData) {
      setMerchants(prev => prev.map(m =>
        m.id === merchantId ? { ...m, status: 'active' } : m
      ));
      toast.success('Merchant approved');
      return;
    }
    try {
      await merchantsService.approveMerchant(merchantId);
      toast.success('Merchant approved');
      loadData();
    } catch (error) {
      toast.error('Failed to approve merchant');
    }
  };

  const handleReject = async (merchantId: string) => {
    if (useMockData) {
      setMerchants(prev => prev.filter(m => m.id !== merchantId));
      toast.success('Merchant rejected');
      return;
    }
    try {
      await merchantsService.rejectMerchant(merchantId, 'Rejected by admin');
      toast.success('Merchant rejected');
      loadData();
    } catch (error) {
      toast.error('Failed to reject merchant');
    }
  };

  const handleSuspend = async (merchantId: string) => {
    if (useMockData) {
      setMerchants(prev => prev.map(m =>
        m.id === merchantId ? { ...m, status: 'suspended' } : m
      ));
      toast.success('Merchant suspended');
      return;
    }
    try {
      await merchantsService.suspendMerchant(merchantId, 'Suspended by admin');
      toast.success('Merchant suspended');
      loadData();
    } catch (error) {
      toast.error('Failed to suspend merchant');
    }
  };

  const handleActivate = async (merchantId: string) => {
    if (useMockData) {
      setMerchants(prev => prev.map(m =>
        m.id === merchantId ? { ...m, status: 'active' } : m
      ));
      toast.success('Merchant activated');
      return;
    }
    try {
      await merchantsService.activateMerchant(merchantId);
      toast.success('Merchant activated');
      loadData();
    } catch (error) {
      toast.error('Failed to activate merchant');
    }
  };

  const handleDelete = async (merchantId: string) => {
    if (useMockData) {
      setMerchants(prev => prev.filter(m => m.id !== merchantId));
      toast.success('Merchant deleted');
      return;
    }
    try {
      await merchantsService.deleteMerchant(merchantId);
      toast.success('Merchant deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete merchant');
    }
  };

  const handleFilterChange = (newFilters: Partial<MerchantFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({ search: '', status: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Merchant Management</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage all registered merchants and their accounts
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/merchants/invite')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-all"
        >
          <Plus size={18} />
          Invite Merchant
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

      {/* Stats Cards */}
      {stats && <MerchantStatsCards stats={stats} loading={loading} />}

      {/* Filters */}
      <MerchantFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Merchants Table */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-color)]">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Merchants</h2>
            <p className="text-sm text-[var(--text-secondary)]">{merchants.length} total</p>
          </div>
        </div>
        <MerchantTable
          merchants={merchants}
          loading={loading}
          onApprove={handleApprove}
          onReject={handleReject}
          onSuspend={handleSuspend}
          onActivate={handleActivate}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}