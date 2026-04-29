'use client';

import { useState } from 'react';
import { XMarkIcon, KeyIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { twoFactorService } from '@/services/twoFactor.service';
import { authService } from '@/services/auth.service';

interface BackupCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onSuccess: () => void;
}

export const BackupCodeModal = ({ isOpen, onClose, email, onSuccess }: BackupCodeModalProps) => {
  const [backupCode, setBackupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!backupCode.trim()) {
      setError('Please enter your backup code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await twoFactorService.verifyWithBackupCode({
        backupCode: backupCode.trim(),
      });

      // Store tokens
      if (result.token) {
        const user = authService.getCurrentUser();
        if (user) {
          authService.setSession(user, result.token, result.refreshToken, true);
        }
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      setError(error.message || 'Invalid backup code');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-neutral-0 rounded-xl w-full max-w-md p-6 shadow-xl animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-neutral-500" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <KeyIcon className="w-7 h-7 text-primary-blue-500" />
          </div>
          <h3 className="text-h5 font-semibold text-neutral-900">Use Backup Code</h3>
          <p className="text-body-sm text-neutral-600 mt-1">
            Enter one of your 8-digit backup codes
          </p>
          <p className="text-caption text-neutral-500 mt-1">For {email}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            label="Backup Code"
            placeholder="XXXX-XXXX"
            value={backupCode}
            onChange={(e) => {
              setBackupCode(e.target.value);
              setError(null);
            }}
            error={error ?? undefined}
            autoComplete="off"
            className="mb-6 text-center text-h5 tracking-wider"
          />

          <Button type="submit" loading={loading} className="w-full mb-3">
            Verify Backup Code
          </Button>

          <p className="text-caption text-neutral-500 text-center">
            Lost your backup codes?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                // Open recovery modal
              }}
              className="text-primary-green-500 hover:underline"
            >
              Use recovery options
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
