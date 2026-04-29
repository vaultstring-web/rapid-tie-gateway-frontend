'use client';

import { useState, useEffect } from 'react';
import { Filter, RefreshCw, Download, Shield } from 'lucide-react';
import { AuditStatsCards } from '@/components/admin/audit/AuditStatsCards';
import { AuditLogTable } from '@/components/admin/audit/AuditLogTable';
import { AuditFilterPanel } from '@/components/admin/audit/AuditFilterPanel';
import { LogIntegrityBadge } from '@/components/admin/audit/LogIntegrityBadge';
import { ExportModal } from '@/components/admin/audit/ExportModal';
import { AuditLogDetailModal } from '@/components/admin/audit/AuditLogDetailModal';
import { auditService } from '@/services/admin/audit.service';
import { AuditLog, AuditFilter, AuditStats } from '@/types/admin/audit';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const getMockAuditLogs = (): AuditLog[] => {
  const actions = ['login', 'logout', 'user_create', 'user_update', 'role_change', 'merchant_approve', 'event_create', 'payment_process'];
  const statuses = ['success', 'success', 'success', 'failure', 'warning'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `log-${i + 1}`,
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    userId: `user-${Math.floor(Math.random() * 10) + 1}`,
    userEmail: [`admin@example.com`, 'merchant@example.com', 'organizer@example.com'][Math.floor(Math.random() * 3)],
    userRole: ['ADMIN', 'MERCHANT', 'ORGANIZER'][Math.floor(Math.random() * 3)],
    action: actions[i % actions.length],
    entity: ['user', 'merchant', 'event', 'payment'][Math.floor(Math.random() * 4)],
    entityId: `ent-${Math.floor(Math.random() * 1000)}`,
    oldValue: i % 3 === 0 ? { status: 'pending' } : undefined,
    newValue: i % 3 === 0 ? { status: 'approved' } : undefined,
    changes: i % 3 === 0 ? [{ field: 'status', oldValue: 'pending', newValue: 'approved' }] : undefined,
    ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: statuses[i % statuses.length] as any,
    details: i % 5 === 0 ? 'Additional details about this action' : undefined,
    hash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    previousHash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
  }));
};

const getMockStats = (): AuditStats => {
  const logs = getMockAuditLogs();
  const byAction: Record<string, number> = {};
  const byEntity: Record<string, number> = {};
  
  logs.forEach(log => {
    byAction[log.action] = (byAction[log.action] || 0) + 1;
    byEntity[log.entity] = (byEntity[log.entity] || 0) + 1;
  });
  
  return {
    total: logs.length,
    byAction,
    byEntity,
    today: Math.floor(Math.random() * 50) + 10,
    thisWeek: Math.floor(Math.random() * 200) + 50,
    thisMonth: Math.floor(Math.random() * 500) + 200,
  };
};

export default function AuditLogsPage() {
  const { theme } = useTheme();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [filters, setFilters] = useState<AuditFilter>({
    search: '',
    action: '',
    entity: '',
    userId: '',
    status: '',
  });
  const [useMockData, setUseMockData] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadData();
  }, [filters, page]);

  const loadData = async () => {
    setLoading(true);
    try {
      let mockLogs = getMockAuditLogs();
      const mockStats = getMockStats();
      
      // Apply filters
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        mockLogs = mockLogs.filter(log =>
          log.userEmail.toLowerCase().includes(searchLower) ||
          log.action.toLowerCase().includes(searchLower) ||
          log.entity.toLowerCase().includes(searchLower) ||
          log.entityId.toLowerCase().includes(searchLower)
        );
      }
      if (filters.action) {
        mockLogs = mockLogs.filter(log => log.action === filters.action);
      }
      if (filters.entity) {
        mockLogs = mockLogs.filter(log => log.entity === filters.entity);
      }
      if (filters.userId) {
        const userIdLower = filters.userId.toLowerCase();
        mockLogs = mockLogs.filter(log =>
          log.userEmail.toLowerCase().includes(userIdLower) ||
          log.userId.toLowerCase().includes(userIdLower)
        );
      }
      if (filters.status) {
        mockLogs = mockLogs.filter(log => log.status === filters.status);
      }
      
      setLogs(mockLogs.slice(0, page * 50));
      setStats(mockStats);
      setHasMore(mockLogs.length > page * 50);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      toast.error('Failed to load audit logs');
      setLogs(getMockAuditLogs());
      setStats(getMockStats());
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<AuditFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      action: '',
      entity: '',
      userId: '',
      status: '',
    });
    setPage(1);
    setIsFilterOpen(false);
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    loadData();
  };

  const handleExport = async (format: 'csv' | 'json' | 'excel') => {
    if (useMockData) {
      toast.info(`Demo: Exporting as ${format.toUpperCase()}`);
      return;
    }
    const blob = await auditService.exportAuditLogs(format, filters);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Audit Logs</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Complete audit trail of all system activities
          </p>
        </div>
        <div className="flex gap-3">
          <LogIntegrityBadge />
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <Filter size={16} />
            Filters
            {Object.keys(filters).some(k => filters[k as keyof AuditFilter]) && (
              <span className="w-2 h-2 rounded-full bg-[#84cc16]" />
            )}
          </button>
          <button
            onClick={() => { loadData(); toast.success('Data refreshed'); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Demo Mode Notice */}
      {useMockData && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ℹ️ Demo Mode - Using sample audit data. Connect to backend for real audit logs.
          </p>
        </div>
      )}

      {/* Stats Cards */}
      {stats && <AuditStatsCards stats={stats} loading={loading} />}

      {/* Audit Log Table */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-color)]">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Audit Trail</h2>
            <p className="text-sm text-[var(--text-secondary)]">{logs.length} records</p>
          </div>
        </div>
        <div className="p-4">
          <AuditLogTable
            logs={logs}
            loading={loading}
            onViewDetails={setSelectedLog}
          />
        </div>
        
        {/* Load More */}
        {hasMore && logs.length > 0 && (
          <div className="px-6 py-4 border-t border-[var(--border-color)] text-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <AuditFilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={handleExport}
      />

      {/* Log Detail Modal */}
      <AuditLogDetailModal
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}