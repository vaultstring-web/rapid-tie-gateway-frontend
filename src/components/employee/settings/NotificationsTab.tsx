'use client';

import { useState } from 'react';
import { Mail, Smartphone, Bell, Save } from 'lucide-react';
import { NotificationPreferences } from '@/types/employee/settings';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface NotificationsTabProps {
  preferences: NotificationPreferences;
  onUpdate: (data: Partial<NotificationPreferences>) => Promise<void>;
}

export const NotificationsTab = ({ preferences, onUpdate }: NotificationsTabProps) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState(preferences);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdate(formData);
      toast.success('Notification preferences updated');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  const toggleEmail = (key: keyof typeof formData.email) => {
    setFormData(prev => ({
      ...prev,
      email: { ...prev.email, [key]: !prev.email[key] }
    }));
  };

  const togglePush = (key: keyof typeof formData.push) => {
    setFormData(prev => ({
      ...prev,
      push: { ...prev.push, [key]: !prev.push[key] }
    }));
  };

  const toggleSms = (key: keyof typeof formData.sms) => {
    setFormData(prev => ({
      ...prev,
      sms: { ...prev.sms, [key]: !prev.sms[key] }
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
          {Object.entries(formData.email).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-[var(--text-primary)]">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <button
                type="button"
                onClick={() => toggleEmail(key as keyof typeof formData.email)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-[#84cc16]' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`} />
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
          {Object.entries(formData.push).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-[var(--text-primary)]">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <button
                type="button"
                onClick={() => togglePush(key as keyof typeof formData.push)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-[#84cc16]' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </label>
          ))}
        </div>
      </div>

      {/* SMS Notifications */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} className="text-[#84cc16]" />
          <h3 className="font-semibold text-[var(--text-primary)]">SMS Notifications</h3>
        </div>
        <div className="space-y-3">
          {Object.entries(formData.sms).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-[var(--text-primary)]">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <button
                type="button"
                onClick={() => toggleSms(key as keyof typeof formData.sms)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-[#84cc16]' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </label>
          ))}
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
          Save Preferences
        </button>
      </div>
    </form>
  );
};