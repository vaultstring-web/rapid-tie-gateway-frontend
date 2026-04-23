'use client';

import { useState } from 'react';
import { Bell, Mail, Smartphone, Moon, Save } from 'lucide-react';
import { NotificationSettings } from '@/types/organizer/settings';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface NotificationsSectionProps {
  settings: NotificationSettings;
  onUpdate: (data: Partial<NotificationSettings>) => Promise<void>;
}

export const NotificationsSection = ({ settings, onUpdate }: NotificationsSectionProps) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState(settings);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdate(formData);
      toast.success('Notification settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleEmailNotification = (key: keyof typeof formData.emailNotifications) => {
    setFormData(prev => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [key]: !prev.emailNotifications[key],
      },
    }));
  };

  const togglePushNotification = (key: keyof typeof formData.pushNotifications) => {
    setFormData(prev => ({
      ...prev,
      pushNotifications: {
        ...prev.pushNotifications,
        [key]: !prev.pushNotifications[key],
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Notifications */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Mail size={18} className="text-[#84cc16]" />
          <h3 className="font-semibold text-[var(--text-primary)]">Email Notifications</h3>
        </div>
        <div className="space-y-3">
          {Object.entries(formData.emailNotifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-[var(--text-primary)]">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <button
                type="button"
                onClick={() => toggleEmailNotification(key as keyof typeof formData.emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-[#84cc16]' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Smartphone size={18} className="text-[#84cc16]" />
          <h3 className="font-semibold text-[var(--text-primary)]">Push Notifications</h3>
        </div>
        <div className="space-y-3">
          {Object.entries(formData.pushNotifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-[var(--text-primary)]">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <button
                type="button"
                onClick={() => togglePushNotification(key as keyof typeof formData.pushNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-[#84cc16]' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
      </div>

      {/* Email Frequency */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} className="text-[#84cc16]" />
          <h3 className="font-semibold text-[var(--text-primary)]">Email Digest Frequency</h3>
        </div>
        <select
          value={formData.emailFrequency}
          onChange={(e) => setFormData(prev => ({ ...prev, emailFrequency: e.target.value as any }))}
          className="w-full max-w-xs px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="instant">Instant</option>
          <option value="daily">Daily Digest</option>
          <option value="weekly">Weekly Digest</option>
        </select>
      </div>

      {/* Quiet Hours */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Moon size={18} className="text-[#84cc16]" />
          <h3 className="font-semibold text-[var(--text-primary)]">Quiet Hours</h3>
        </div>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-[var(--text-primary)]">Enable Quiet Hours</span>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, quietHours: { ...prev.quietHours, enabled: !prev.quietHours.enabled } }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.quietHours.enabled ? 'bg-[#84cc16]' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </label>
          {formData.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Start Time</label>
                <input
                  type="time"
                  value={formData.quietHours.start}
                  onChange={(e) => setFormData(prev => ({ ...prev, quietHours: { ...prev.quietHours, start: e.target.value } }))}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">End Time</label>
                <input
                  type="time"
                  value={formData.quietHours.end}
                  onChange={(e) => setFormData(prev => ({ ...prev, quietHours: { ...prev.quietHours, end: e.target.value } }))}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Settings
        </button>
      </div>
    </form>
  );
};