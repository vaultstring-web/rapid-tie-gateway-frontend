'use client';

import { useState, useEffect } from 'react';
import { User, Bell, Shield, DollarSign } from 'lucide-react';
import { ApproverProfileTab } from '@/components/approver/ApproverProfileTab';
import { ApproverNotificationsTab } from '@/components/approver/ApproverNotificationsTab';
import { ApproverSecurityTab } from '@/components/approver/ApproverSecurityTab';
import { ApproverApprovalTab } from '@/components/approver/ApproverApprovalTab';
import { ApproverProfile, NotificationSettings, SecuritySettings, ApprovalLimits } from '@/types/approver/settings';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data
const mockProfile: ApproverProfile = {
  id: 'app-1',
  firstName: 'Jane',
  lastName: 'Mbalame',
  email: 'jane.mbalame@vaultstring.com',
  phone: '+265 999 123 456',
  role: 'Finance Manager',
  department: 'Finance',
  employeeId: 'APP-001',
  joinDate: '2022-01-15',
  bio: 'Senior finance manager with over 10 years of experience in financial operations and approvals.',
};

const mockNotificationSettings: NotificationSettings = {
  email: {
    newRequest: true,
    reminder: true,
    approvalUpdate: true,
    teamActivity: false,
    weeklyDigest: true,
  },
  push: {
    newRequest: true,
    reminder: true,
    approvalUpdate: true,
  },
  emailFrequency: 'instant',
};

const mockSecuritySettings: SecuritySettings = {
  twoFactorEnabled: false,
  lastPasswordChange: new Date().toISOString(),
  sessions: [
    {
      id: 'sess-1',
      device: 'Chrome on Windows',
      location: 'Lilongwe, Malawi',
      lastActive: new Date().toISOString(),
      current: true,
    },
    {
      id: 'sess-2',
      device: 'Safari on iPhone',
      location: 'Blantyre, Malawi',
      lastActive: new Date(Date.now() - 2 * 86400000).toISOString(),
      current: false,
    },
  ],
  loginHistory: [],
};

const mockApprovalLimits: ApprovalLimits = {
  maxAmount: 200000,
  requiresSecondApproval: 150000,
  autoApproveUnder: 50000,
  defaultDepartment: 'Finance',
  restrictedDestinations: ['Karonga', 'Mangochi'],
  delegatedTo: [],
};

export default function ApproverSettingsPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'approval'>('profile');
  const [profile, setProfile] = useState(mockProfile);
  const [notificationSettings, setNotificationSettings] = useState(mockNotificationSettings);
  const [securitySettings, setSecuritySettings] = useState(mockSecuritySettings);
  const [approvalLimits, setApprovalLimits] = useState(mockApprovalLimits);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(true);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'approval', label: 'Approval Limits', icon: DollarSign },
  ];

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleUpdateProfile = async (data: Partial<ApproverProfile>) => {
    setProfile(prev => ({ ...prev, ...data }));
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleUpdateNotifications = async (data: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...data }));
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleToggle2FA = async () => {
    setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
    toast.success(securitySettings.twoFactorEnabled ? '2FA disabled' : '2FA enabled (demo)');
  };

  const handleTerminateSession = async (sessionId: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      sessions: prev.sessions.filter(s => s.id !== sessionId),
    }));
    toast.success('Session terminated');
  };

  const handleUpdateApprovalLimits = async (data: Partial<ApprovalLimits>) => {
    setApprovalLimits(prev => ({ ...prev, ...data }));
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Demo Mode Notice */}
      {useMockData && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ℹ️ Demo Mode - Using sample data. Connect to backend for live data.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--border-color)]">
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
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-6">
        {activeTab === 'profile' && (
          <ApproverProfileTab profile={profile} onUpdate={handleUpdateProfile} />
        )}
        
        {activeTab === 'notifications' && (
          <ApproverNotificationsTab settings={notificationSettings} onUpdate={handleUpdateNotifications} />
        )}
        
        {activeTab === 'security' && (
          <ApproverSecurityTab
            settings={securitySettings}
            onChangePassword={handleChangePassword}
            onToggle2FA={handleToggle2FA}
            onTerminateSession={handleTerminateSession}
          />
        )}
        
        {activeTab === 'approval' && (
          <ApproverApprovalTab limits={approvalLimits} onUpdate={handleUpdateApprovalLimits} />
        )}
      </div>
    </div>
  );
}