'use client';

import { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, BellRing, Clock, Send, Moon, Sun, ChevronDown } from 'lucide-react';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { ChannelSelector } from '@/components/notifications/ChannelSelector';
import { notificationPreferencesService } from '@/services/notificationPreferences.service';
import { 
  NotificationCategory, 
  NotificationPreferencesState, 
  EmailFrequency, 
  QuietHours,
  CATEGORY_CONFIG 
} from '@/types/notificationPreferences';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

const EMAIL_FREQUENCIES: { value: EmailFrequency; label: string; description: string }[] = [
  { value: 'instant', label: 'Instant', description: 'Send emails immediately' },
  { value: 'daily', label: 'Daily Digest', description: 'Send a summary once per day' },
  { value: 'weekly', label: 'Weekly Digest', description: 'Send a summary once per week' },
  { value: 'never', label: 'Never', description: "Don't send email notifications" },
];

export default function NotificationPreferencesPage() {
  const { theme } = useTheme();
  const [preferences, setPreferences] = useState<Record<NotificationCategory, boolean>>({} as Record<NotificationCategory, boolean>);
  const [channels, setChannels] = useState<Record<NotificationCategory, ('email' | 'sms' | 'push' | 'in_app')[]>>({} as any);
  const [emailFrequency, setEmailFrequency] = useState<EmailFrequency>('instant');
  const [quietHours, setQuietHours] = useState<QuietHours>({
    enabled: false,
    start: '22:00',
    end: '08:00',
    timezone: 'Africa/Blantyre',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<{ email: boolean; sms: boolean; push: boolean }>({
    email: false,
    sms: false,
    push: false,
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const data = await notificationPreferencesService.getPreferences();
      
      // Initialize preferences with defaults if needed
      const initialPrefs = {} as Record<NotificationCategory, boolean>;
      const initialChannels = {} as any;
      
      Object.keys(CATEGORY_CONFIG).forEach((key) => {
        const category = key as NotificationCategory;
        const existing = data.preferences?.[category];
        initialPrefs[category] = existing?.enabled ?? CATEGORY_CONFIG[category].defaultEnabled;
        initialChannels[category] = existing?.channels ?? ['email', 'in_app'];
      });
      
      setPreferences(initialPrefs);
      setChannels(initialChannels);
      setEmailFrequency(data.emailFrequency || 'instant');
      if (data.quietHours) {
        setQuietHours(data.quietHours);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
      toast.error('Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceToggle = (category: NotificationCategory, enabled: boolean) => {
    setPreferences(prev => ({ ...prev, [category]: enabled }));
  };

  const handleChannelToggle = (category: NotificationCategory, channel: 'email' | 'sms' | 'push' | 'in_app', enabled: boolean) => {
    setChannels(prev => {
      const current = prev[category] || [];
      const updated = enabled 
        ? [...current, channel]
        : current.filter(c => c !== channel);
      return { ...prev, [category]: updated };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save preferences
      await notificationPreferencesService.updatePreferences(preferences);
      
      // Save email frequency
      await notificationPreferencesService.updateEmailFrequency(emailFrequency);
      
      // Save quiet hours
      await notificationPreferencesService.updateQuietHours(quietHours);
      
      // Save channel preferences for each category
      for (const [category, channelList] of Object.entries(channels)) {
        for (const channel of channelList) {
          await notificationPreferencesService.updateChannelPreference(
            category as NotificationCategory,
            channel as any,
            true
          );
        }
      }
      
      toast.success('Notification preferences saved');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleTestNotification = async (channel: 'email' | 'sms' | 'push') => {
    setTesting(prev => ({ ...prev, [channel]: true }));
    try {
      await notificationPreferencesService.testNotification(channel);
      toast.success(`Test ${channel.toUpperCase()} notification sent!`);
    } catch (error) {
      toast.error(`Failed to send test ${channel.toUpperCase()} notification`);
    } finally {
      setTesting(prev => ({ ...prev, [channel]: false }));
    }
  };

  // Group categories by type
  const paymentCategories = ['payment_received', 'payment_sent'];
  const eventCategories = ['event_reminder', 'event_update', 'event_cancellation', 'new_event'];
  const dsaCategories = ['dsa_request_status', 'dsa_approved', 'dsa_disbursed'];
  const socialCategories = ['connection_request', 'connection_accepted', 'new_message'];
  const systemCategories = ['system_announcement', 'security_alert', 'feature_update'];
  const marketingCategories = ['marketing_promotion'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Notification Preferences
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Control how and when you receive notifications
          </p>
        </div>

        {/* Email Frequency Section */}
        <div
          className="rounded-xl p-6 mb-6 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Mail size={20} className="text-primary-green-500" />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Email Digest Frequency
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {EMAIL_FREQUENCIES.map((freq) => (
              <button
                key={freq.value}
                onClick={() => setEmailFrequency(freq.value)}
                className={`p-3 rounded-lg text-left transition-all border ${
                  emailFrequency === freq.value
                    ? 'border-primary-green-500 bg-primary-green-500/10'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                style={{
                  borderColor: emailFrequency === freq.value ? undefined : 'var(--border-color)',
                }}
              >
                <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                  {freq.label}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {freq.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quiet Hours Section */}
        <div
          className="rounded-xl p-6 mb-6 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Moon size={20} className="text-primary-green-500" />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Quiet Hours
              </h2>
            </div>
            <ToggleSwitch
              enabled={quietHours.enabled}
              onChange={(enabled) => setQuietHours(prev => ({ ...prev, enabled }))}
            />
          </div>
          
          {quietHours.enabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-1 block" style={{ color: 'var(--text-primary)' }}>
                  Start Time
                </label>
                <input
                  type="time"
                  value={quietHours.start}
                  onChange={(e) => setQuietHours(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-green-500"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block" style={{ color: 'var(--text-primary)' }}>
                  End Time
                </label>
                <input
                  type="time"
                  value={quietHours.end}
                  onChange={(e) => setQuietHours(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-green-500"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-1 block" style={{ color: 'var(--text-primary)' }}>
                  Timezone
                </label>
                <div className="relative">
                  <select
                    value={quietHours.timezone}
                    onChange={(e) => setQuietHours(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border appearance-none focus:outline-none focus:ring-2 focus:ring-primary-green-500"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="Africa/Blantyre">Africa/Blantyre (Malawi)</option>
                    <option value="Africa/Johannesburg">Africa/Johannesburg</option>
                    <option value="Africa/Nairobi">Africa/Nairobi</option>
                    <option value="UTC">UTC</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
                </div>
              </div>
            </div>
          )}
          
          <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
            During quiet hours, you won't receive any notifications except security alerts.
          </p>
        </div>

        {/* Payment Notifications */}
        <div
          className="rounded-xl p-6 mb-6 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">💰</span>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Payment Notifications
            </h2>
          </div>
          <div className="space-y-4">
            {paymentCategories.map((cat) => {
              const config = CATEGORY_CONFIG[cat as NotificationCategory];
              return (
                <div key={cat} className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {config.label}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {config.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <ChannelSelector
                      channels={channels[cat as NotificationCategory] || []}
                      onChange={(channel, enabled) => handleChannelToggle(cat as NotificationCategory, channel, enabled)}
                    />
                    <ToggleSwitch
                      enabled={preferences[cat as NotificationCategory] || false}
                      onChange={(enabled) => handlePreferenceToggle(cat as NotificationCategory, enabled)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Alerts Section */}
        <div
          className="rounded-xl p-6 mb-6 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🎫</span>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Event Alerts
            </h2>
          </div>
          <div className="space-y-4">
            {eventCategories.map((cat) => {
              const config = CATEGORY_CONFIG[cat as NotificationCategory];
              return (
                <div key={cat} className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {config.label}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {config.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <ChannelSelector
                      channels={channels[cat as NotificationCategory] || []}
                      onChange={(channel, enabled) => handleChannelToggle(cat as NotificationCategory, channel, enabled)}
                    />
                    <ToggleSwitch
                      enabled={preferences[cat as NotificationCategory] || false}
                      onChange={(enabled) => handlePreferenceToggle(cat as NotificationCategory, enabled)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DSA Notifications */}
        <div
          className="rounded-xl p-6 mb-6 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📋</span>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              DSA Notifications
            </h2>
          </div>
          <div className="space-y-4">
            {dsaCategories.map((cat) => {
              const config = CATEGORY_CONFIG[cat as NotificationCategory];
              return (
                <div key={cat} className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {config.label}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {config.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <ChannelSelector
                      channels={channels[cat as NotificationCategory] || []}
                      onChange={(channel, enabled) => handleChannelToggle(cat as NotificationCategory, channel, enabled)}
                    />
                    <ToggleSwitch
                      enabled={preferences[cat as NotificationCategory] || false}
                      onChange={(enabled) => handlePreferenceToggle(cat as NotificationCategory, enabled)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Social & Connections */}
        <div
          className="rounded-xl p-6 mb-6 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🤝</span>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Social & Connections
            </h2>
          </div>
          <div className="space-y-4">
            {socialCategories.map((cat) => {
              const config = CATEGORY_CONFIG[cat as NotificationCategory];
              return (
                <div key={cat} className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {config.label}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {config.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <ChannelSelector
                      channels={channels[cat as NotificationCategory] || []}
                      onChange={(channel, enabled) => handleChannelToggle(cat as NotificationCategory, channel, enabled)}
                    />
                    <ToggleSwitch
                      enabled={preferences[cat as NotificationCategory] || false}
                      onChange={(enabled) => handlePreferenceToggle(cat as NotificationCategory, enabled)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Notifications */}
        <div
          className="rounded-xl p-6 mb-6 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">⚙️</span>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              System Notifications
            </h2>
          </div>
          <div className="space-y-4">
            {systemCategories.map((cat) => {
              const config = CATEGORY_CONFIG[cat as NotificationCategory];
              return (
                <div key={cat} className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {config.label}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {config.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <ChannelSelector
                      channels={channels[cat as NotificationCategory] || []}
                      onChange={(channel, enabled) => handleChannelToggle(cat as NotificationCategory, channel, enabled)}
                    />
                    <ToggleSwitch
                      enabled={preferences[cat as NotificationCategory] || false}
                      onChange={(enabled) => handlePreferenceToggle(cat as NotificationCategory, enabled)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Marketing */}
        <div
          className="rounded-xl p-6 mb-6 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🎁</span>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Marketing & Promotions
            </h2>
          </div>
          <div className="space-y-4">
            {marketingCategories.map((cat) => {
              const config = CATEGORY_CONFIG[cat as NotificationCategory];
              return (
                <div key={cat} className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {config.label}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {config.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <ChannelSelector
                      channels={channels[cat as NotificationCategory] || []}
                      onChange={(channel, enabled) => handleChannelToggle(cat as NotificationCategory, channel, enabled)}
                    />
                    <ToggleSwitch
                      enabled={preferences[cat as NotificationCategory] || false}
                      onChange={(enabled) => handlePreferenceToggle(cat as NotificationCategory, enabled)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Test Notification Section */}
        <div
          className="rounded-xl p-6 mb-6 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Send size={20} className="text-primary-green-500" />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Test Notifications
            </h2>
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Send a test notification to verify your settings are working correctly.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleTestNotification('email')}
              disabled={testing.email}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {testing.email ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Mail size={16} />
              )}
              Test Email
            </button>
            <button
              onClick={() => handleTestNotification('sms')}
              disabled={testing.sms}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {testing.sms ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Smartphone size={16} />
              )}
              Test SMS
            </button>
            <button
              onClick={() => handleTestNotification('push')}
              disabled={testing.push}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors disabled:opacity-50"
            >
              {testing.push ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <BellRing size={16} />
              )}
              Test Push
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-primary-green-500 text-white font-medium hover:bg-primary-green-600 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              'Save Preferences'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}