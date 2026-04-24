'use client';

import { useState } from 'react';
import { Shield, Lock, Users, Save, Plus, X } from 'lucide-react';
import { SecuritySettings } from '@/types/admin/settings';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface SecuritySettingsProps {
  settings: SecuritySettings;
  onSave: (data: Partial<SecuritySettings>) => Promise<void>;
  loading?: boolean;
}

export const SecuritySettingsComponent = ({ settings, onSave, loading }: SecuritySettingsProps) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState(settings);
  const [newAllowedIP, setNewAllowedIP] = useState('');
  const [newBlockedIP, setNewBlockedIP] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      toast.success('Security settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addAllowedIP = () => {
    if (newAllowedIP && !formData.allowedIPs.includes(newAllowedIP)) {
      setFormData(prev => ({
        ...prev,
        allowedIPs: [...prev.allowedIPs, newAllowedIP]
      }));
      setNewAllowedIP('');
    }
  };

  const removeAllowedIP = (ip: string) => {
    setFormData(prev => ({
      ...prev,
      allowedIPs: prev.allowedIPs.filter(i => i !== ip)
    }));
  };

  const addBlockedIP = () => {
    if (newBlockedIP && !formData.blockedIPs.includes(newBlockedIP)) {
      setFormData(prev => ({
        ...prev,
        blockedIPs: [...prev.blockedIPs, newBlockedIP]
      }));
      setNewBlockedIP('');
    }
  };

  const removeBlockedIP = (ip: string) => {
    setFormData(prev => ({
      ...prev,
      blockedIPs: prev.blockedIPs.filter(i => i !== ip)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={formData.sessionTimeout}
            onChange={(e) => setFormData(prev => ({ ...prev, sessionTimeout: Number(e.target.value) }))}
            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            min={5}
            step={5}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
            Max Login Attempts
          </label>
          <input
            type="number"
            value={formData.maxLoginAttempts}
            onChange={(e) => setFormData(prev => ({ ...prev, maxLoginAttempts: Number(e.target.value) }))}
            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            min={1}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
            Lockout Duration (minutes)
          </label>
          <input
            type="number"
            value={formData.lockoutDuration}
            onChange={(e) => setFormData(prev => ({ ...prev, lockoutDuration: Number(e.target.value) }))}
            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            min={5}
            step={5}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block text-[var(--text-primary)]">
          Password Requirements
        </label>
        <div className="space-y-2 p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <label className="text-sm mb-1 block text-[var(--text-primary)]">Minimum Length</label>
            <input
              type="number"
              value={formData.passwordRequirement.minLength}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                passwordRequirement: { ...prev.passwordRequirement, minLength: Number(e.target.value) }
              }))}
              className="w-32 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              min={6}
              max={20}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.passwordRequirement.requireUppercase}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  passwordRequirement: { ...prev.passwordRequirement, requireUppercase: e.target.checked }
                }))}
                className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
              />
              <span className="text-sm text-[var(--text-primary)]">Require Uppercase</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.passwordRequirement.requireLowercase}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  passwordRequirement: { ...prev.passwordRequirement, requireLowercase: e.target.checked }
                }))}
                className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
              />
              <span className="text-sm text-[var(--text-primary)]">Require Lowercase</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.passwordRequirement.requireNumbers}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  passwordRequirement: { ...prev.passwordRequirement, requireNumbers: e.target.checked }
                }))}
                className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
              />
              <span className="text-sm text-[var(--text-primary)]">Require Numbers</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.passwordRequirement.requireSpecialChars}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  passwordRequirement: { ...prev.passwordRequirement, requireSpecialChars: e.target.checked }
                }))}
                className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
              />
              <span className="text-sm text-[var(--text-primary)]">Require Special Characters</span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={formData.twoFactorRequired}
            onChange={(e) => setFormData(prev => ({ ...prev, twoFactorRequired: e.target.checked }))}
            className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
          />
          <span className="text-sm text-[var(--text-primary)]">Require Two-Factor Authentication for all users</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Allowed IPs */}
        <div>
          <label className="text-sm font-medium mb-2 block text-[var(--text-primary)]">
            Allowed IP Addresses
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newAllowedIP}
              onChange={(e) => setNewAllowedIP(e.target.value)}
              placeholder="e.g., 192.168.1.1"
              className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              onKeyPress={(e) => e.key === 'Enter' && addAllowedIP()}
            />
            <button
              type="button"
              onClick={addAllowedIP}
              className="px-3 py-2 rounded-lg bg-[#84cc16] text-white hover:brightness-110"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-1">
            {formData.allowedIPs.map((ip) => (
              <div key={ip} className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-primary)]">
                <code className="text-sm text-[var(--text-primary)]">{ip}</code>
                <button
                  type="button"
                  onClick={() => removeAllowedIP(ip)}
                  className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  <X size={14} className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Blocked IPs */}
        <div>
          <label className="text-sm font-medium mb-2 block text-[var(--text-primary)]">
            Blocked IP Addresses
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newBlockedIP}
              onChange={(e) => setNewBlockedIP(e.target.value)}
              placeholder="e.g., 192.168.1.100"
              className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              onKeyPress={(e) => e.key === 'Enter' && addBlockedIP()}
            />
            <button
              type="button"
              onClick={addBlockedIP}
              className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-1">
            {formData.blockedIPs.map((ip) => (
              <div key={ip} className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-primary)]">
                <code className="text-sm text-red-600 dark:text-red-400">{ip}</code>
                <button
                  type="button"
                  onClick={() => removeBlockedIP(ip)}
                  className="p-1 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20"
                >
                  <X size={14} className="text-green-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

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