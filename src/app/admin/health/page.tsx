'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Activity } from 'lucide-react';
import { OverallStatusHeader } from '@/components/admin/health/OverallStatusHeader';
import { DatabaseStatusCard } from '@/components/admin/health/DatabaseStatusCard';
import { RedisStatusCard } from '@/components/admin/health/RedisStatusCard';
import { WorkerQueues } from '@/components/admin/health/WorkerQueues';
import { StorageStatus } from '@/components/admin/health/StorageStatus';
import { healthService } from '@/services/admin/health.service';
import { SystemHealthData } from '@/types/admin/health';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const getMockHealthData = (): SystemHealthData => {
  return {
    database: {
      status: 'healthy',
      version: 'PostgreSQL 15.2',
      connections: 42,
      maxConnections: 100,
      uptime: 86400 * 14,
      replication: {
        role: 'primary',
        lag: 0,
        status: 'synced',
        replicas: [
          { name: 'replica-01', status: 'healthy', lag: 5 },
          { name: 'replica-02', status: 'healthy', lag: 8 },
        ],
      },
      queriesPerSecond: 245,
      slowQueries: 3,
      cacheHitRatio: 98.5,
    },
    redis: {
      status: 'healthy',
      version: 'Redis 7.0.12',
      memory: {
        used: 256 * 1024 * 1024,
        peak: 380 * 1024 * 1024,
        max: 1024 * 1024 * 1024,
        fragmentation: 1.05,
      },
      keys: 12450,
      hits: 987654,
      misses: 12345,
      hitRate: 98.8,
      connectedClients: 128,
      uptime: 86400 * 21,
    },
    workerQueues: [
      {
        queueName: 'email-queue',
        active: 5,
        waiting: 12,
        completed: 9876,
        failed: 23,
        delayed: 3,
        processingRate: 15,
        status: 'healthy',
      },
      {
        queueName: 'payment-queue',
        active: 8,
        waiting: 5,
        completed: 5432,
        failed: 5,
        delayed: 0,
        processingRate: 25,
        status: 'healthy',
      },
      {
        queueName: 'notification-queue',
        active: 3,
        waiting: 45,
        completed: 12345,
        failed: 12,
        delayed: 8,
        processingRate: 30,
        status: 'busy',
      },
    ],
    storage: {
      disk: [
        { name: '/var/lib/postgresql', total: 500 * 1024 * 1024 * 1024, used: 320 * 1024 * 1024 * 1024, free: 180 * 1024 * 1024 * 1024, usagePercent: 64, status: 'healthy' },
        { name: '/var/log', total: 100 * 1024 * 1024 * 1024, used: 45 * 1024 * 1024 * 1024, free: 55 * 1024 * 1024 * 1024, usagePercent: 45, status: 'healthy' },
        { name: '/backup', total: 1000 * 1024 * 1024 * 1024, used: 820 * 1024 * 1024 * 1024, free: 180 * 1024 * 1024 * 1024, usagePercent: 82, status: 'warning' },
      ],
      database: [
        { name: 'rapid_tie_db', total: 500 * 1024 * 1024 * 1024, used: 310 * 1024 * 1024 * 1024, free: 190 * 1024 * 1024 * 1024, usagePercent: 62 },
        { name: 'analytics_db', total: 200 * 1024 * 1024 * 1024, used: 98 * 1024 * 1024 * 1024, free: 102 * 1024 * 1024 * 1024, usagePercent: 49 },
      ],
    },
    lastChecked: new Date().toISOString(),
    overallStatus: 'healthy',
  };
};

export default function SystemHealthPage() {
  const { theme } = useTheme();
  const [data, setData] = useState<SystemHealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadData(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadData = async (silent: boolean = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    
    try {
      // Using mock data for now
      const mockData = getMockHealthData();
      setData(mockData);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load health data:', error);
      if (!silent) toast.error('Failed to load health data');
      const mockData = getMockHealthData();
      setData(mockData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadData();
    toast.success('Health data refreshed');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">Loading system health...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">System Health</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Monitor system performance and resource utilization
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Demo Mode Notice */}
      {useMockData && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ℹ️ Demo Mode - Using sample data. Connect to backend for live system metrics.
          </p>
        </div>
      )}

      {/* Overall Status */}
      {data && (
        <OverallStatusHeader status={data.overallStatus} lastChecked={data.lastChecked} />
      )}

      {/* Database and Redis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data && <DatabaseStatusCard status={data.database} loading={loading} />}
        {data && <RedisStatusCard status={data.redis} loading={loading} />}
      </div>

      {/* Worker Queues */}
      {data && <WorkerQueues queues={data.workerQueues} loading={loading} />}

      {/* Storage Status */}
      {data && <StorageStatus storage={data.storage} loading={loading} />}

      {/* Footer Note */}
      <div className="text-center text-xs text-[var(--text-secondary)] pt-4">
        <p>Data refreshes automatically every 30 seconds</p>
      </div>
    </div>
  );
}