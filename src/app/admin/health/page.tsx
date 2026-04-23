'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Activity } from 'lucide-react';
import { StatusCards } from '@/components/admin/health/StatusCards';
import { DatabaseStatus } from '@/components/admin/health/DatabaseStatus';
import { RedisStatus } from '@/components/admin/health/RedisStatus';
import { WorkerQueues } from '@/components/admin/health/WorkerQueues';
import { StorageStatus } from '@/components/admin/health/StorageStatus';
import { ServicesStatus } from '@/components/admin/health/ServicesStatus';
import toast from 'react-hot-toast';

// Mock data for development
const getMockHealthData = (): any => ({
  overallStatus: 'healthy',
  database: {
    status: 'healthy',
    latency: 12,
    connections: 45,
    maxConnections: 100,
    version: 'PostgreSQL 15.3',
    uptime: 86400 * 14,
    replication: {
      enabled: true,
      role: 'primary',
      replicas: [
        { name: 'replica-01', status: 'synced', lag: 0, lastSync: new Date().toISOString() },
        { name: 'replica-02', status: 'syncing', lag: 2, lastSync: new Date().toISOString() },
      ],
    },
  },
  redis: {
    status: 'healthy',
    memory: { used: 256 * 1024 * 1024, peak: 380 * 1024 * 1024, max: 1024 * 1024 * 1024, fragmentation: 1.2 },
    hitRate: 98.5,
    connectedClients: 125,
    commandsProcessed: 12500000,
    uptime: 86400 * 7,
  },
  workerQueues: [
    { name: 'email-queue', active: 3, waiting: 12, completed: 12500, failed: 45, delayed: 2, processingRate: 15, status: 'healthy' },
    { name: 'payment-queue', active: 5, waiting: 8, completed: 8900, failed: 23, delayed: 1, processingRate: 22, status: 'healthy' },
    { name: 'notification-queue', active: 2, waiting: 25, completed: 34500, failed: 89, delayed: 5, processingRate: 30, status: 'busy' },
    { name: 'report-queue', active: 1, waiting: 3, completed: 1200, failed: 5, delayed: 0, processingRate: 5, status: 'healthy' },
  ],
  storage: [
    { type: 'database', used: 50 * 1024 * 1024 * 1024, total: 100 * 1024 * 1024 * 1024, path: '/data/postgres', status: 'healthy' },
    { type: 'uploads', used: 25 * 1024 * 1024 * 1024, total: 50 * 1024 * 1024 * 1024, path: '/data/uploads', status: 'healthy' },
    { type: 'logs', used: 80 * 1024 * 1024 * 1024, total: 100 * 1024 * 1024 * 1024, path: '/var/log', status: 'warning' },
    { type: 'backups', used: 200 * 1024 * 1024 * 1024, total: 500 * 1024 * 1024 * 1024, path: '/backup', status: 'healthy' },
  ],
  services: [
    { name: 'API Gateway', status: 'healthy', uptime: 86400 * 14, version: '2.1.0', lastChecked: new Date().toISOString() },
    { name: 'Auth Service', status: 'healthy', uptime: 86400 * 14, version: '1.8.0', lastChecked: new Date().toISOString() },
    { name: 'Payment Processor', status: 'healthy', uptime: 86400 * 10, version: '3.2.1', lastChecked: new Date().toISOString() },
    { name: 'Notification Service', status: 'degraded', uptime: 86400 * 5, version: '1.4.0', lastChecked: new Date().toISOString() },
    { name: 'WebSocket Server', status: 'healthy', uptime: 86400 * 7, version: '2.0.0', lastChecked: new Date().toISOString() },
  ],
  lastUpdated: new Date().toISOString(),
});

// Content component (no useTheme)
function SystemHealthContent() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [useMockData, setUseMockData] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadData();
    
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadData(true);
      }, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    setLoading(true);
    try {
      const mockData = getMockHealthData();
      setData(mockData);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load system health:', error);
      toast.error('Failed to load system health data');
      setData(getMockHealthData());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">Loading system health...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[var(--text-secondary)]">Failed to load system health data</p>
        <button onClick={() => loadData()} className="mt-4 px-4 py-2 rounded-lg bg-[#84cc16] text-white">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">System Health</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Monitor system performance and infrastructure status</p>
        </div>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]" />
            Auto-refresh (30s)
          </label>
          <button onClick={() => loadData(true)} disabled={refreshing} className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Demo Mode Notice */}
      {useMockData && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">ℹ️ Demo Mode - Using sample data. Connect to backend for live system metrics.</p>
        </div>
      )}

      {/* Status Cards */}
      <StatusCards data={data} loading={loading} />

      {/* Database & Redis Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <DatabaseStatus data={data.database} loading={loading} />
        <RedisStatus data={data.redis} loading={loading} />
      </div>

      {/* Worker Queues & Storage Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <WorkerQueues queues={data.workerQueues} loading={loading} />
        <StorageStatus storage={data.storage} loading={loading} />
      </div>

      {/* Services Status */}
      <ServicesStatus services={data.services} loading={loading} />

      {/* Last Updated */}
      <p className="text-xs text-center text-[var(--text-secondary)] pt-4">Last updated: {new Date(data.lastUpdated).toLocaleString()}</p>
    </div>
  );
}

// Main export
export default function SystemHealthPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <SystemHealthContent />;
}