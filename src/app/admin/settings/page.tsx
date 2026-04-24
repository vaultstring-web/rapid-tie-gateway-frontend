'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Shield, 
  Mail, 
  Bell, 
  Key, 
  Database, 
  HardDrive,
  Globe,
  Lock,
  MessageSquare,
  Code,
  Cloud
} from 'lucide-react';
import { SystemSettingsComponent } from '@/components/admin/settings/SystemSettings';
import { SecuritySettingsComponent } from '@/components/admin/settings/SecuritySettingsComponent';
import { adminSettingsService } from '@/services/admin/settings.service';
import { SystemSettings, SecuritySettings } from '@/types/admin/settings';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const getMockSystemSettings = (): SystemSettings => {
  return {
    siteName: 'Rapid Tie Payment Gateway',
    contactEmail: 'admin@rapidtie.com',
    supportEmail: 'support@rapidtie.com',
    timezone: 'Africa/Blantyre',
    dateFormat: 'YYYY-MM-DD',
    currency: 'MWK',
    maintenanceMode: false,
    maintenanceMessage: 'We are currently undergoing scheduled maintenance.',
  };
};

const getMockSecuritySettings = (): SecuritySettings => {
  return {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    passwordRequirement: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    twoFactorRequired: false,
    allowedIPs: ['192.168.1.0/24', '10.0.0.0/8'],
    blockedIPs: ['203.0.113.45', '198.51.100.67'],
  };
};

export default function AdminSettingsPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'email' | 'notifications' | 'api' | 'backup' | 'maintenance'>('general');
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const mockSystem = getMockSystemSettings();
      const mockSecurity = getMockSecuritySettings();
      
      setSystemSettings(mockSystem);
      setSecuritySettings(mockSecurity);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSystem = async (data: Partial<SystemSettings>) => {
    if (useMockData) {
      setSystemSettings(prev => ({ ...prev!, ...data }));
      toast.success('System settings saved (demo)');
      return;
    }
    await adminSettingsService.updateSystemSettings(data);
    await loadData();
  };

  const handleSaveSecurity = async (data: Partial<SecuritySettings>) => {
    if (useMockData) {
      setSecuritySettings(prev => ({ ...prev!, ...data }));
      toast.success('Security settings saved (demo)');
      return;
    }
    await adminSettingsService.updateSecuritySettings(data);
    await loadData();
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API', icon: Key },
    { id: 'backup', label: 'Backup', icon: HardDrive },
    { id: 'maintenance', label: 'Maintenance', icon: Database },
  ];

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
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Settings</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Configure system settings and preferences
        </p>
      </div>

      {/* Demo Mode Notice */}
      {useMockData && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ℹ️ Demo Mode - Using sample settings data. Connect to backend for live configuration.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
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
        {activeTab === 'general' && systemSettings && (
          <SystemSettingsComponent
            settings={systemSettings}
            onSave={handleSaveSystem}
            loading={loading}
          />
        )}

        {activeTab === 'security' && securitySettings && (
          <SecuritySettingsComponent
            settings={securitySettings}
            onSave={handleSaveSecurity}
            loading={loading}
          />
        )}

        {activeTab === 'email' && (
          <div className="text-center py-12">
            <Mail size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Email Settings</h3>
            <p className="text-sm text-[var(--text-secondary)]">SMTP configuration will be available soon.</p>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Notification Settings</h3>
            <p className="text-sm text-[var(--text-secondary)]">Notification preferences will be available soon.</p>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="text-center py-12">
            <Key size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">API Settings</h3>
            <p className="text-sm text-[var(--text-secondary)]">API configuration will be available soon.</p>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="text-center py-12">
            <HardDrive size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Backup Settings</h3>
            <p className="text-sm text-[var(--text-secondary)]">Backup configuration will be available soon.</p>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="text-center py-12">
            <Database size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Maintenance Settings</h3>
            <p className="text-sm text-[var(--text-secondary)]">Maintenance mode settings will be available soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}