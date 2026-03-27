'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { TwoFactorSetup } from '@/components/auth/TwoFactorSetup';
import { twoFactorService } from '@/services/twoFactor.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function TwoFactorSetupPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disabling, setDisabling] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const data = await twoFactorService.getStatus();
      setStatus(data);
    } catch (error) {
      console.error('Failed to load 2FA status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!disablePassword) {
      toast.error('Please enter your password');
      return;
    }

    setDisabling(true);
    try {
      await twoFactorService.disable(disablePassword);
      toast.success('2FA has been disabled');
      setShowDisableConfirm(false);
      loadStatus();
    } catch (error: any) {
      toast.error(error.message || 'Failed to disable 2FA');
    } finally {
      setDisabling(false);
      setDisablePassword('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/settings" className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-neutral-600" />
          </Link>
          <div>
            <h1 className="text-h3 font-bold text-neutral-900">Two-Factor Authentication</h1>
            <p className="text-body text-neutral-600">Secure your account with 2FA</p>
          </div>
        </div>

        {/* Current Status */}
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${status?.enabled ? 'bg-semantic-success-light' : 'bg-neutral-100'}`}
              >
                <ShieldCheckIcon
                  className={`w-6 h-6 ${status?.enabled ? 'text-semantic-success-main' : 'text-neutral-500'}`}
                />
              </div>
              <div>
                <h3 className="text-h5 font-semibold text-neutral-900">
                  {status?.enabled ? '2FA is Enabled' : '2FA is Disabled'}
                </h3>
                <p className="text-body-sm text-neutral-600">
                  {status?.enabled
                    ? 'Your account is protected with two-factor authentication'
                    : 'Add an extra layer of security to your account'}
                </p>
              </div>
            </div>

            {status?.enabled ? (
              <button
                onClick={() => setShowDisableConfirm(true)}
                className="px-4 py-2 text-body-sm font-medium text-semantic-error-main border border-semantic-error-main rounded-lg hover:bg-semantic-error-light transition-colors"
              >
                Disable 2FA
              </button>
            ) : (
              <Button onClick={() => setShowSetup(true)}>Enable 2FA</Button>
            )}
          </div>
        </div>

        {/* Trusted Devices */}
        {status?.enabled && status.trustedDevices?.length > 0 && (
          <div className="card">
            <h3 className="text-h5 font-semibold text-neutral-900 mb-4">Trusted Devices</h3>
            <div className="space-y-3">
              {status.trustedDevices.map((device: any) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between py-3 border-b border-neutral-200 last:border-0"
                >
                  <div>
                    <p className="text-body-sm font-medium text-neutral-900">{device.name}</p>
                    <p className="text-caption text-neutral-500">
                      Last used: {new Date(device.lastUsed).toLocaleDateString()}
                      {device.expiresAt &&
                        ` • Expires: ${new Date(device.expiresAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await twoFactorService.revokeDevice(device.id);
                        toast.success('Device removed');
                        loadStatus();
                      } catch (error) {
                        toast.error('Failed to remove device');
                      }
                    }}
                    className="text-caption text-semantic-error-main hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Backup Codes Section */}
        {status?.enabled && (
          <div className="card mt-8">
            <h3 className="text-h5 font-semibold text-neutral-900 mb-2">Backup Codes</h3>
            <p className="text-body-sm text-neutral-600 mb-4">
              You have {status.backupCodesRemaining} backup codes remaining. Each code can only be
              used once.
            </p>
            <Button
              variant="secondary"
              onClick={async () => {
                try {
                  const newCodes = await twoFactorService.regenerateBackupCodes();
                  // Show codes in modal
                  alert(
                    `New backup codes:\n\n${newCodes.join('\n')}\n\nSave these in a safe place!`
                  );
                  loadStatus();
                } catch (error) {
                  toast.error('Failed to regenerate backup codes');
                }
              }}
            >
              Regenerate Backup Codes
            </Button>
          </div>
        )}

        {/* 2FA Setup Modal */}
        {showSetup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-neutral-0 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
              <TwoFactorSetup
                onComplete={() => {
                  setShowSetup(false);
                  loadStatus();
                  toast.success('2FA has been enabled successfully!');
                }}
                onCancel={() => setShowSetup(false)}
              />
            </div>
          </div>
        )}

        {/* Disable Confirmation Modal */}
        {showDisableConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 p-6">
            <div className="bg-neutral-0 rounded-xl w-full max-w-md">
              <h3 className="text-h5 font-semibold text-neutral-900 mb-2">
                Disable Two-Factor Authentication
              </h3>
              <p className="text-body-sm text-neutral-600 mb-4">
                Are you sure you want to disable 2FA? This will make your account less secure.
              </p>
              <Input
                type="password"
                label="Confirm Password"
                placeholder="Enter your password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                className="mb-4"
              />
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  onClick={handleDisable}
                  loading={disabling}
                  className="flex-1"
                >
                  Disable 2FA
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowDisableConfirm(false);
                    setDisablePassword('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
