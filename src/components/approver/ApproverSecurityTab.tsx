'use client';

import { useState } from 'react';
import { Lock, Shield, Smartphone, Eye, EyeOff, XCircle, Key } from 'lucide-react';
import { SecuritySettings } from '@/types/approver/settings';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface ApproverSecurityTabProps {
  settings: SecuritySettings;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  onToggle2FA: () => Promise<void>;
  onTerminateSession: (sessionId: string) => Promise<void>;
}

export const ApproverSecurityTab = ({ settings, onChangePassword, onToggle2FA, onTerminateSession }: ApproverSecurityTabProps) => {
  const { theme } = useTheme();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    setLoading(true);
    try {
      await onChangePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      await onToggle2FA();
    } catch (error) {
      toast.error('Failed to toggle 2FA');
    }
  };

  return (
    <div className="space-y-8">
      {/* Change Password */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lock size={18} className="text-[#84cc16]" />
          <h3 className="font-semibold text-[var(--text-primary)]">Change Password</h3>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] pr-10"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] pr-10"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-colors disabled:opacity-50"
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-[#84cc16]" />
          <h3 className="font-semibold text-[var(--text-primary)]">Two-Factor Authentication</h3>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <p className="font-medium text-[var(--text-primary)]">2FA Status</p>
            <p className="text-sm text-[var(--text-secondary)]">
              {settings.twoFactorEnabled 
                ? 'Enabled - Your account is protected' 
                : 'Disabled - Add an extra layer of security'}
            </p>
          </div>
          <button
            onClick={handleToggle2FA}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              settings.twoFactorEnabled
                ? 'border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                : 'bg-[#84cc16] text-white hover:brightness-110'
            }`}
          >
            {settings.twoFactorEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Smartphone size={18} className="text-[#84cc16]" />
          <h3 className="font-semibold text-[var(--text-primary)]">Active Sessions</h3>
        </div>
        <div className="space-y-2">
          {settings.sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <p className="font-medium text-[var(--text-primary)]">{session.device}</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {session.location} • Last active: {new Date(session.lastActive).toLocaleString()}
                  {session.current && <span className="ml-2 text-[#84cc16]">(Current)</span>}
                </p>
              </div>
              {!session.current && (
                <button
                  onClick={() => onTerminateSession(session.id)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <XCircle size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};