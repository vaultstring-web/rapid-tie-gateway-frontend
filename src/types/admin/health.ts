export interface DatabaseStatus {
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  connections: number;
  maxConnections: number;
  version: string;
  uptime: number;
  replication: {
    enabled: boolean;
    role: 'primary' | 'replica';
    replicas: {
      name: string;
      status: 'syncing' | 'synced' | 'down';
      lag: number;
      lastSync: string;
    }[];
  };
}

export interface RedisStatus {
  status: 'healthy' | 'degraded' | 'down';
  memory: {
    used: number;
    peak: number;
    max: number;
    fragmentation: number;
  };
  hitRate: number;
  connectedClients: number;
  commandsProcessed: number;
  uptime: number;
}

export interface WorkerQueue {
  name: string;
  active: number;
  waiting: number;
  completed: number;
  failed: number;
  delayed: number;
  processingRate: number;
  status: 'healthy' | 'busy' | 'stalled';
}

export interface StorageStatus {
  type: 'database' | 'uploads' | 'logs' | 'backups';
  used: number;
  total: number;
  path: string;
  status: 'healthy' | 'warning' | 'critical';
}

export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  version: string;
  lastChecked: string;
}

export interface SystemHealthData {
  database: DatabaseStatus;
  redis: RedisStatus;
  workerQueues: WorkerQueue[];
  storage: StorageStatus[];
  services: ServiceStatus[];
  lastUpdated: string;
  overallStatus: 'healthy' | 'degraded' | 'down';
}

export const STATUS_COLORS = {
  healthy: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', border: 'border-green-500' },
  degraded: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-500' },
  down: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', border: 'border-red-500' },
};

export const STORAGE_COLORS = {
  healthy: '#84cc16',
  warning: '#f59e0b',
  critical: '#ef4444',
};