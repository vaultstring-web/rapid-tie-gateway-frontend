'use client';

import { useState } from 'react';
import { User, Bell, Shield, CreditCard, Key, Users as UsersIcon } from 'lucide-react';
import { ProfileSection } from '@/components/organizer/settings/ProfileSection';
import { NotificationsSection } from '@/components/organizer/settings/NotificationsSection';
import { SecuritySection } from '@/components/organizer/settings/SecuritySection';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data
const mockProfile = {
  id: 'org-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+265 999 123 456',
  organizationName: 'VaultString Events',
  organizationType: 'company' as const,
  registrationNumber: 'REG-2024-001',
  taxId: 'TIN-123456789',
  website: 'https://events.vaultstring.com',
  bio: 'Leading event management platform in Malawi',
  logo: '',
  coverImage: '',
  address: '123 Convention Drive',
  city: 'Lilongwe',
  country: 'Malawi',
  postalCode: '2070',
  socialLinks: {
    facebook: 'https://facebook.com/vaultstring',
    twitter: 'https://twitter.com/vaultstring',
    instagram: 'https://instagram.com/vaultstring',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockNotificationSettings = {
  emailNotifications: {
    eventReminders: true,
    ticketSales: true,
    attendeeCheckins: false,
    newMessages: true,
    systemUpdates: true,
    marketingEmails: false,
  },
  pushNotifications: {
    eventReminders: true,
    ticketSales: true,
    attendeeCheckins: false,
    newMessages: true,
  },
  emailFrequency: 'instant' as const,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
};

const mockSecuritySettings = {
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

export default function OrganizerSettingsPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'billing' | 'api' | 'team'>('profile');
  const [profile, setProfile] = useState(mockProfile);
  const [notificationSettings, setNotificationSettings] = useState(mockNotificationSettings);
  const [securitySettings, setSecuritySettings] = useState(mockSecuritySettings);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'team', label: 'Team', icon: UsersIcon },
  ];

  const handleUpdateProfile = async (data: Partial<typeof mockProfile>) => {
    setProfile(prev => ({ ...prev, ...data }));
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('Profile updated successfully');
  };

  const handleUpdateNotifications = async (data: Partial<typeof mockNotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...data }));
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('Notification settings updated');
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('Password changed successfully');
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
          <ProfileSection profile={profile} onUpdate={handleUpdateProfile} />
        )}
        
        {activeTab === 'notifications' && (
          <NotificationsSection settings={notificationSettings} onUpdate={handleUpdateNotifications} />
        )}
        
        {activeTab === 'security' && (
          <SecuritySection
            settings={securitySettings}
            onChangePassword={handleChangePassword}
            onTerminateSession={handleTerminateSession}
          />
        )}
        
        {activeTab === 'billing' && (
          <div className="text-center py-12">
            <CreditCard size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Billing Information</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Billing settings will be available soon.
            </p>
          </div>
        )}
        
        {activeTab === 'api' && (
          <div className="text-center py-12">
            <Key size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">API Keys</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              API key management will be available soon.
            </p>
          </div>
        )}
        
        {activeTab === 'team' && (
          <div className="text-center py-12">
            <UsersIcon size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Team Management</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Team management features will be available soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}