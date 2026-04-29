'use client';

import { useState } from 'react';
import { Globe, Clock, DollarSign, Save, Mail, Shield } from 'lucide-react';
import { SystemSettings } from '@/types/admin/settings';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface SystemSettingsProps {
  settings: SystemSettings;
  onSave: (data: Partial<SystemSettings>) => Promise<void>;
  loading?: boolean;
}

export const SystemSettingsComponent = ({ settings, onSave, loading }: SystemSettingsProps) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState(settings);
  const [saving, setSaving] = useState(false);

  const timezones = [
    'Africa/Blantyre', 'Africa/Johannesburg', 'Africa/Nairobi', 
    'UTC', 'America/New_York', 'Europe/London', 'Asia/Dubai'
  ];
  
  const dateFormats = [
    'YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY', 'DD MMM YYYY'
  ];
  
  const currencies = [
    { value: 'MWK', label: 'Malawian Kwacha (MWK)' },
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'ZAR', label: 'South African Rand (ZAR)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      toast.success('System settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
            Site Name
          </label>
          <input
            type="text"
            value={formData.siteName}
            onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
            Support Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="email"
              value={formData.supportEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, supportEmail: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
            Contact Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
            Timezone
          </label>
          <div className="relative">
            <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <select
              value={formData.timezone}
              onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] appearance-none"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              {timezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
            Date Format
          </label>
          <div className="relative">
            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <select
              value={formData.dateFormat}
              onChange={(e) => setFormData(prev => ({ ...prev, dateFormat: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] appearance-none"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              {dateFormats.map(format => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
            Currency
          </label>
          <div className="relative">
            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <select
              value={formData.currency}
              onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] appearance-none"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              {currencies.map(curr => (
                <option key={curr.value} value={curr.value}>{curr.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.maintenanceMode}
            onChange={(e) => setFormData(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
            className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
          />
          <span className="text-sm text-[var(--text-primary)]">Enable Maintenance Mode</span>
        </label>
      </div>

      {formData.maintenanceMode && (
        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
            Maintenance Message
          </label>
          <textarea
            value={formData.maintenanceMessage}
            onChange={(e) => setFormData(prev => ({ ...prev, maintenanceMessage: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            placeholder="We are currently undergoing scheduled maintenance. Please check back soon."
          />
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || loading}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Changes
        </button>
      </div>
    </form>
  );
};