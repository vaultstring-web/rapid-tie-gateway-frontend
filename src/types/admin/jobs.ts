export interface JobQueue {
  name: string;
  active: number;
  waiting: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: boolean;
  processingRate: number;
  status: 'healthy' | 'busy' | 'degraded' | 'down';
}

export interface FailedJob {
  id: string;
  name: string;
  queue: string;
  data: any;
  failedReason: string;
  stackTrace: string;
  attempts: number;
  maxAttempts: number;
  failedAt: string;
  retryAvailable: boolean;
}

export interface ScheduledJob {
  id: string;
  name: string;
  queue: string;
  data: any;
  schedule: string;
  nextRun: string;
  lastRun?: string;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
}

export interface JobHistory {
  id: string;
  name: string;
  queue: string;
  status: 'completed' | 'failed' | 'retried';
  startedAt: string;
  completedAt: string;
  duration: number;
  attempts: number;
}

export interface JobStats {
  total: number;
  completed: number;
  failed: number;
  retried: number;
  successRate: number;
  avgDuration: number;
}

export const JOB_QUEUES = [
  { value: 'email', label: 'Email Queue', color: '#3b82f6' },
  { value: 'payment', label: 'Payment Queue', color: '#10b981' },
  { value: 'notification', label: 'Notification Queue', color: '#f59e0b' },
  { value: 'report', label: 'Report Queue', color: '#8b5cf6' },
  { value: 'sync', label: 'Sync Queue', color: '#ec4899' },
];