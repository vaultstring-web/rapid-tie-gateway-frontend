'use client';

import { useState, useEffect } from 'react';
import { User, Bell, Shield } from 'lucide-react';
import { ProfileTab, NotificationsTab, SecurityTab } from '@/components/employee/settings';
import { EmployeeProfile, NotificationPreferences, SecuritySettings } from '@/types/employee/settings';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data
const mockProfile: EmployeeProfile = {
  id: 'emp-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+265 999 123 456',
  employeeId: 'EMP-2024-001',
  department: 'Finance',
  position: 'Senior Accountant',
  joinDate: '2024-01-15',
  address: '123 Independence Drive',
  city: 'Lilongwe',
  emergencyContact: {
    name: 'Jane Doe',
    phone: '+265 888 123 456',
    relationship: 'Spouse',
  },
};

const mockNotificationPrefs: NotificationPreferences = {
  email: {
    paymentReceived: true,
    dsaApproved: true,
    dsaDisbursed: true,
    systemUpdates: false,
  },
  push: {
    paymentReceived: true,
    dsaApproved: true,
    dsaDisbursed: false,
  },
  sms: {
    paymentReceived: false,
    dsaDisbursed: true,
  },
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
};

export default function EmployeeSettingsPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [profile, setProfile] = useState(mockProfile);
  const [notificationPrefs, setNotificationPrefs] = useState(mockNotificationPrefs);
  const [securitySettings, setSecuritySettings] = useState(mockSecuritySettings);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleUpdateProfile = async (data: Partial<EmployeeProfile>) => {
    setProfile(prev => ({ ...prev, ...data }));
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleUpdateNotifications = async (data: Partial<NotificationPreferences>) => {
    setNotificationPrefs(prev => ({ ...prev, ...data }));
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage your account settings and preferences
        </p>
      </div>

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
          <ProfileTab profile={profile} onUpdate={handleUpdateProfile} />
        )}
        
        {activeTab === 'notifications' && (
          <NotificationsTab preferences={notificationPrefs} onUpdate={handleUpdateNotifications} />
        )}
        
        {activeTab === 'security' && (
          <SecurityTab
            settings={securitySettings}
            onChangePassword={handleChangePassword}
            onToggle2FA={handleToggle2FA}
            onTerminateSession={handleTerminateSession}
          />
        )}
      </div>
    </div>
  );
}