'use client';

import { useState } from 'react';
import { Plus, X, Calendar, Clock, Send } from 'lucide-react';
import { ScheduledJob, JOB_QUEUES } from '@/types/admin/jobs';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface ScheduleFormProps {
  onSubmit: (data: Partial<ScheduledJob>) => Promise<void>;
  onCancel?: () => void;
}

export const ScheduleForm = ({ onSubmit, onCancel }: ScheduleFormProps) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    queue: '',
    schedule: '',
    data: '{}',
  });
  const [loading, setLoading] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const scheduleOptions = [
    { value: '*/5 * * * *', label: 'Every 5 minutes' },
    { value: '*/15 * * * *', label: 'Every 15 minutes' },
    { value: '*/30 * * * *', label: 'Every 30 minutes' },
    { value: '0 * * * *', label: 'Every hour' },
    { value: '0 0 * * *', label: 'Daily at midnight' },
    { value: '0 9 * * *', label: 'Daily at 9 AM' },
    { value: '0 0 * * 0', label: 'Weekly on Sunday' },
    { value: '0 0 1 * *', label: 'Monthly on 1st' },
    { value: 'custom', label: 'Custom cron expression' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Job name is required');
      return;
    }
    if (!formData.queue) {
      toast.error('Queue selection is required');
      return;
    }
    if (!formData.schedule) {
      toast.error('Schedule is required');
      return;
    }

    // Validate JSON data
    try {
      JSON.parse(formData.data);
      setJsonError(null);
    } catch {
      setJsonError('Invalid JSON format');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: formData.name,
        queue: formData.queue,
        schedule: formData.schedule,
        data: JSON.parse(formData.data),
      });
      setFormData({ name: '', queue: '', schedule: '', data: '{}' });
      toast.success('Job scheduled successfully');
    } catch (error) {
      toast.error('Failed to schedule job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Job Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., send-daily-report"
          className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Queue *</label>
        <select
          value={formData.queue}
          onChange={(e) => setFormData(prev => ({ ...prev, queue: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
          required
        >
          <option value="">Select queue</option>
          {JOB_QUEUES.map((queue) => (
            <option key={queue.value} value={queue.value}>{queue.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Schedule *</label>
        <select
          value={formData.schedule}
          onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="">Select schedule</option>
          {scheduleOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {formData.schedule === 'custom' && (
          <input
            type="text"
            placeholder="* * * * *"
            className="w-full mt-2 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          />
        )}
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Job Data (JSON)</label>
        <textarea
          value={formData.data}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, data: e.target.value }));
            try {
              JSON.parse(e.target.value);
              setJsonError(null);
            } catch {
              setJsonError('Invalid JSON format');
            }
          }}
          rows={6}
          className={`w-full px-3 py-2 rounded-lg border font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#84cc16] ${
            jsonError ? 'border-red-500' : 'border-[var(--border-color)]'
          }`}
          style={{
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
          }}
          placeholder='{"key": "value"}'
        />
        {jsonError && <p className="text-xs text-red-500 mt-1">{jsonError}</p>}
      </div>

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg border"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !!jsonError}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={16} />
          )}
          Schedule Job
        </button>
      </div>
    </form>
  );
};