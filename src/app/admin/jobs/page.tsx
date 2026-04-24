'use client';

import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Activity, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { QueuesList } from '@/components/admin/jobs/QueuesList';
import { FailedJobsTable } from '@/components/admin/jobs/FailedJobsTable';
import { JobDetailModal } from '@/components/admin/jobs/JobDetailModal';
import { ScheduleForm } from '@/components/admin/jobs/ScheduleForm';
import { JobHistoryTimeline } from '@/components/admin/jobs/JobHistoryTimeline';
import { jobsService } from '@/services/admin/jobs.service';
import { JobQueue, FailedJob, ScheduledJob, JobHistory, JobStats } from '@/types/admin/jobs';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const getMockQueues = (): JobQueue[] => {
  return [
    { name: 'email', active: 5, waiting: 12, completed: 15420, failed: 23, delayed: 3, paused: false, processingRate: 15, status: 'healthy' },
    { name: 'payment', active: 8, waiting: 5, completed: 8450, failed: 8, delayed: 0, paused: false, processingRate: 25, status: 'healthy' },
    { name: 'notification', active: 3, waiting: 45, completed: 8765, failed: 15, delayed: 8, paused: false, processingRate: 30, status: 'busy' },
    { name: 'report', active: 2, waiting: 8, completed: 1234, failed: 2, delayed: 1, paused: false, processingRate: 5, status: 'healthy' },
    { name: 'sync', active: 1, waiting: 3, completed: 4321, failed: 5, delayed: 0, paused: false, processingRate: 8, status: 'healthy' },
  ];
};

const getMockFailedJobs = (): FailedJob[] => {
  return [
    {
      id: 'job-1',
      name: 'send-welcome-email',
      queue: 'email',
      data: { userId: '123', email: 'user@example.com' },
      failedReason: 'Connection timeout',
      stackTrace: 'Error: Connection timeout\n    at SMTPClient.send (email.js:45:23)\n    at sendWelcomeEmail (jobs/email.js:12:5)',
      attempts: 3,
      maxAttempts: 3,
      failedAt: new Date().toISOString(),
      retryAvailable: false,
    },
    {
      id: 'job-2',
      name: 'process-payment',
      queue: 'payment',
      data: { orderId: 'ORD-123', amount: 45000 },
      failedReason: 'Insufficient funds',
      stackTrace: 'Error: Insufficient funds\n    at PaymentProcessor.process (payment.js:78:12)\n    at processPayment (jobs/payment.js:8:3)',
      attempts: 2,
      maxAttempts: 5,
      failedAt: new Date(Date.now() - 3600000).toISOString(),
      retryAvailable: true,
    },
  ];
};

const getMockScheduledJobs = (): ScheduledJob[] => {
  return [
    {
      id: 'sched-1',
      name: 'daily-report',
      queue: 'report',
      data: { format: 'pdf' },
      schedule: '0 0 * * *',
      nextRun: new Date(Date.now() + 86400000).toISOString(),
      lastRun: new Date(Date.now() - 86400000).toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sched-2',
      name: 'hourly-sync',
      queue: 'sync',
      data: { source: 'api' },
      schedule: '0 * * * *',
      nextRun: new Date(Date.now() + 3600000).toISOString(),
      lastRun: new Date(Date.now() - 3600000).toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  ];
};

const getMockJobHistory = (): JobHistory[] => {
  return [
    {
      id: 'hist-1',
      name: 'send-welcome-email',
      queue: 'email',
      status: 'completed',
      startedAt: new Date(Date.now() - 600000).toISOString(),
      completedAt: new Date(Date.now() - 590000).toISOString(),
      duration: 10000,
      attempts: 1,
    },
    {
      id: 'hist-2',
      name: 'process-payment',
      queue: 'payment',
      status: 'failed',
      startedAt: new Date(Date.now() - 1800000).toISOString(),
      completedAt: new Date(Date.now() - 1790000).toISOString(),
      duration: 10000,
      attempts: 3,
    },
    {
      id: 'hist-3',
      name: 'sync-data',
      queue: 'sync',
      status: 'completed',
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 3595000).toISOString(),
      duration: 5000,
      attempts: 1,
    },
  ];
};

const getMockJobStats = (): JobStats => {
  return {
    total: 1250,
    completed: 1180,
    failed: 45,
    retried: 25,
    successRate: 94.4,
    avgDuration: 8500,
  };
};

export default function BackgroundJobsPage() {
  const { theme } = useTheme();
  const [queues, setQueues] = useState<JobQueue[]>([]);
  const [failedJobs, setFailedJobs] = useState<FailedJob[]>([]);
  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>([]);
  const [jobHistory, setJobHistory] = useState<JobHistory[]>([]);
  const [stats, setStats] = useState<JobStats | null>(null);
  const [loading, setLoading] = useState({ queues: true, failed: true, history: true });
  const [selectedJob, setSelectedJob] = useState<FailedJob | null>(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'queues' | 'failed' | 'scheduled' | 'history'>('queues');
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await Promise.all([
      loadQueues(),
      loadFailedJobs(),
      loadScheduledJobs(),
      loadJobHistory(),
      loadStats(),
    ]);
  };

  const loadQueues = async () => {
    setLoading(prev => ({ ...prev, queues: true }));
    try {
      const data = getMockQueues();
      setQueues(data);
    } catch (error) {
      console.error('Failed to load queues:', error);
      setQueues(getMockQueues());
    } finally {
      setLoading(prev => ({ ...prev, queues: false }));
    }
  };

  const loadFailedJobs = async () => {
    setLoading(prev => ({ ...prev, failed: true }));
    try {
      const data = getMockFailedJobs();
      setFailedJobs(data);
    } catch (error) {
      console.error('Failed to load failed jobs:', error);
      setFailedJobs(getMockFailedJobs());
    } finally {
      setLoading(prev => ({ ...prev, failed: false }));
    }
  };

  const loadScheduledJobs = async () => {
    try {
      const data = getMockScheduledJobs();
      setScheduledJobs(data);
    } catch (error) {
      console.error('Failed to load scheduled jobs:', error);
      setScheduledJobs(getMockScheduledJobs());
    }
  };

  const loadJobHistory = async () => {
    setLoading(prev => ({ ...prev, history: true }));
    try {
      const data = getMockJobHistory();
      setJobHistory(data);
    } catch (error) {
      console.error('Failed to load job history:', error);
      setJobHistory(getMockJobHistory());
    } finally {
      setLoading(prev => ({ ...prev, history: false }));
    }
  };

  const loadStats = async () => {
    try {
      const data = getMockJobStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      setStats(getMockJobStats());
    }
  };

  const handleRetryJob = async (jobId: string) => {
    if (useMockData) {
      setFailedJobs(prev => prev.filter(j => j.id !== jobId));
      toast.success('Job retried successfully (demo)');
      return;
    }
    try {
      await jobsService.retryJob(jobId);
      toast.success('Job retried successfully');
      loadFailedJobs();
    } catch (error) {
      toast.error('Failed to retry job');
    }
  };

  const handleRetryAll = async () => {
    if (useMockData) {
      setFailedJobs([]);
      toast.success('All jobs retried (demo)');
      return;
    }
    try {
      await jobsService.retryAllJobs();
      toast.success('All jobs retried');
      loadFailedJobs();
    } catch (error) {
      toast.error('Failed to retry jobs');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (useMockData) {
      setFailedJobs(prev => prev.filter(j => j.id !== jobId));
      toast.success('Job deleted (demo)');
      return;
    }
    try {
      await jobsService.deleteJob(jobId);
      toast.success('Job deleted');
      loadFailedJobs();
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const handleDeleteAll = async () => {
    if (useMockData) {
      setFailedJobs([]);
      toast.success('All jobs deleted (demo)');
      return;
    }
    try {
      await jobsService.deleteAllJobs();
      toast.success('All jobs deleted');
      loadFailedJobs();
    } catch (error) {
      toast.error('Failed to delete jobs');
    }
  };

  const handleScheduleJob = async (data: Partial<ScheduledJob>) => {
    if (useMockData) {
      const newJob: ScheduledJob = {
        id: Date.now().toString(),
        name: data.name!,
        queue: data.queue!,
        data: data.data!,
        schedule: data.schedule!,
        nextRun: new Date().toISOString(),
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      setScheduledJobs(prev => [...prev, newJob]);
      setShowScheduleForm(false);
      toast.success('Job scheduled (demo)');
      return;
    }
    await jobsService.createScheduledJob(data);
    await loadScheduledJobs();
    setShowScheduleForm(false);
  };

  const handlePauseQueue = async (queueName: string) => {
    if (useMockData) {
      setQueues(prev => prev.map(q => q.name === queueName ? { ...q, paused: true } : q));
      toast.success(`Queue ${queueName} paused (demo)`);
      return;
    }
    await jobsService.pauseQueue(queueName);
    await loadQueues();
  };

  const handleResumeQueue = async (queueName: string) => {
    if (useMockData) {
      setQueues(prev => prev.map(q => q.name === queueName ? { ...q, paused: false } : q));
      toast.success(`Queue ${queueName} resumed (demo)`);
      return;
    }
    await jobsService.resumeQueue(queueName);
    await loadQueues();
  };

  const tabs = [
    { id: 'queues', label: 'Queues', icon: Activity, badge: queues.length },
    { id: 'failed', label: 'Failed Jobs', icon: AlertCircle, badge: failedJobs.length },
    { id: 'scheduled', label: 'Scheduled', icon: Clock, badge: scheduledJobs.length },
    { id: 'history', label: 'History', icon: CheckCircle, badge: jobHistory.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Background Jobs</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage queues, scheduled jobs, and view job history
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { loadAllData(); toast.success('Data refreshed'); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={() => setShowScheduleForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-all"
          >
            <Plus size={16} />
            Schedule Job
          </button>
        </div>
      </div>

      {/* Demo Mode Notice */}
      {useMockData && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ℹ️ Demo Mode - Using sample data. Connect to backend for live job management.
          </p>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.total.toLocaleString()}</p>
            <p className="text-xs text-[var(--text-secondary)]">Total Jobs</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <p className="text-2xl font-bold text-green-500">{stats.completed.toLocaleString()}</p>
            <p className="text-xs text-[var(--text-secondary)]">Completed</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <p className="text-2xl font-bold text-red-500">{stats.failed.toLocaleString()}</p>
            <p className="text-xs text-[var(--text-secondary)]">Failed</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <p className="text-2xl font-bold text-blue-500">{stats.retried.toLocaleString()}</p>
            <p className="text-xs text-[var(--text-secondary)]">Retried</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <p className="text-2xl font-bold text-[#84cc16]">{stats.successRate}%</p>
            <p className="text-xs text-[var(--text-secondary)]">Success Rate</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'border-b-2 border-[#84cc16] text-[#84cc16]'
                  : 'text-[var(--text-secondary)] hover:text-[#84cc16]'
              }`}
            >
              <Icon size={16} />
              {tab.label}
              {tab.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-[#84cc16]/20 text-[#84cc16]">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'queues' && (
          <QueuesList
            queues={queues}
            loading={loading.queues}
            onPause={handlePauseQueue}
            onResume={handleResumeQueue}
          />
        )}

        {activeTab === 'failed' && (
          <FailedJobsTable
            jobs={failedJobs}
            loading={loading.failed}
            onRetry={handleRetryJob}
            onRetryAll={handleRetryAll}
            onDelete={handleDeleteJob}
            onDeleteAll={handleDeleteAll}
            onViewDetails={setSelectedJob}
          />
        )}

        {activeTab === 'scheduled' && (
          <div className="space-y-4">
            {scheduledJobs.length === 0 ? (
              <div className="text-center py-12">
                <Clock size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Scheduled Jobs</h3>
                <p className="text-sm text-[var(--text-secondary)]">Click "Schedule Job" to create one</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {scheduledJobs.map((job) => (
                  <div key={job.id} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-[#84cc16]" />
                          <h3 className="font-semibold text-[var(--text-primary)]">{job.name}</h3>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">Queue: {job.queue}</p>
                        <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">Schedule: {job.schedule}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[var(--text-primary)]">Next: {new Date(job.nextRun).toLocaleString()}</p>
                        {job.lastRun && <p className="text-xs text-[var(--text-secondary)]">Last: {new Date(job.lastRun).toLocaleString()}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <JobHistoryTimeline
            jobs={jobHistory}
            loading={loading.history}
          />
        )}
      </div>

      {/* Schedule Form Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              borderWidth: 1,
            }}
          >
            <div className="sticky top-0 p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Schedule New Job</h2>
              <button onClick={() => setShowScheduleForm(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X size={18} className="text-[var(--text-secondary)]" />
              </button>
            </div>
            <div className="p-6">
              <ScheduleForm onSubmit={handleScheduleJob} onCancel={() => setShowScheduleForm(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}