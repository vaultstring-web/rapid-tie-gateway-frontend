export interface DatabaseStatus {
  status: 'healthy' | 'degraded' | 'down';
  version: string;
  connections: number;
  maxConnections: number;
  uptime: number;
  replication: {
    role: 'primary' | 'replica';
    lag: number;
    status: 'syncing' | 'synced' | 'down';
    replicas: {
      name: string;
      status: 'healthy' | 'degraded' | 'down';
      lag: number;
    }[];
  };
  queriesPerSecond: number;
  slowQueries: number;
  cacheHitRatio: number;
}

export interface RedisStatus {
  status: 'healthy' | 'degraded' | 'down';
  version: string;
  memory: {
    used: number;
    peak: number;
    max: number;
    fragmentation: number;
  };
  keys: number;
  hits: number;
  misses: number;
  hitRate: number;
  connectedClients: number;
  uptime: number;
}

export interface WorkerQueueStatus {
  queueName: string;
  active: number;
  waiting: number;
  completed: number;
  failed: number;
  delayed: number;
  processingRate: number;
  status: 'healthy' | 'busy' | 'degraded' | 'down';
}

export interface StorageStatus {
  disk: {
    name: string;
    total: number;
    used: number;
    free: number;
    usagePercent: number;
    status: 'healthy' | 'warning' | 'critical';
  }[];
  database: {
    name: string;
    total: number;
    used: number;
    free: number;
    usagePercent: number;
  }[];
}

export interface SystemHealthData {
  database: DatabaseStatus;
  redis: RedisStatus;
  workerQueues: WorkerQueueStatus[];
  storage: StorageStatus;
  lastChecked: string;
  overallStatus: 'healthy' | 'degraded' | 'critical';
}