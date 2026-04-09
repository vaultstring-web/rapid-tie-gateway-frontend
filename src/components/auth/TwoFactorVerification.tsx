'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShieldCheckIcon, KeyIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { twoFactorService } from '@/services/twoFactor.service';
import { authService } from '@/services/auth.service';
import { BackupCodeModal } from './BackupCodeModal';
import { RecoveryModal } from './RecoveryModal';

interface TwoFactorVerificationProps {
  email: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const TwoFactorVerification = ({
  email,
  onSuccess,
  onCancel,
}: TwoFactorVerificationProps) => {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [lockedUntil, setLockedUntil] = useState<string | null>(null);
  const [trustDevice, setTrustDevice] = useState(false);
  const [showBackupCodeModal, setShowBackupCodeModal] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  // Handle countdown timer for lockout
  useEffect(() => {
    if (lockedUntil) {
      const updateCountdown = () => {
        const remaining = twoFactorService.getLockoutRemainingTime(lockedUntil);
        if (remaining !== null && remaining > 0) {
          setCountdown(Math.ceil(remaining / 1000));
        } else {
          setCountdown(null);
          setLockedUntil(null);
          setRemainingAttempts(null);
        }
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [lockedUntil]);

  // Handle input change
  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d*$/.test(value)) return;

    const newCode = [...code];
    // Take only the last character if pasting multiple
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  // Handle key down (backspace)
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);

    if (digits.length === 6) {
      const newCode = digits.split('');
      setCode(newCode);

      // Auto-focus last input
      inputRefs[5].current?.focus();
    }
  };

  // Get full code string
  const getFullCode = (): string => {
    return code.join('');
  };

  // Handle verification
  const handleVerify = async () => {
    const fullCode = getFullCode();

    if (fullCode.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get device info
      const deviceName = `${navigator.platform} ${navigator.userAgent.split(' ').slice(-2).join(' ')}`;

      const result = await twoFactorService.verify({
        code: fullCode,
        trustDevice,
        deviceName,
      });

      // Store tokens
      if (result.token) {
        const user = authService.getCurrentUser();
        if (user) {
          authService.setSession(user, result.token, result.refreshToken, true);
        }
      }

      onSuccess();
    } catch (error: any) {
      if (error.remaining !== undefined) {
        setRemainingAttempts(error.remaining);
        setError(`${error.message} (${error.remaining} attempts remaining)`);

        // Check if locked
        if (error.remaining === 0) {
          setLockedUntil(new Date(Date.now() + 15 * 60 * 1000).toISOString());
        }
      } else {
        setError(error.message || 'Invalid verification code');
      }

      // Clear all inputs on error
      setCode(['', '', '', '', '', '']);
      inputRefs[0].current?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Format countdown time
  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isLocked = countdown !== null;

  return (
    <>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheckIcon className="w-8 h-8 text-primary-green-500" />
        </div>
        <h2 className="text-h4 font-bold text-neutral-900 mb-2">Two-Factor Authentication</h2>
        <p className="text-body-sm text-neutral-600">
          Enter the 6-digit code from your authenticator app
        </p>
        <p className="text-caption text-neutral-500 mt-1">For {email}</p>
      </div>

      {/* Lockout Warning */}
      {isLocked && (
        <div className="bg-semantic-error-light border border-semantic-error-main rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-semantic-error-main mt-0.5">⚠️</div>
            <div>
              <p className="text-body-sm font-semibold text-semantic-error-text">
                Too many failed attempts
              </p>
              <p className="text-caption text-semantic-error-text mt-1">
                Your account is temporarily locked. Please try again in{' '}
                <span className="font-mono font-semibold">{formatCountdown(countdown)}</span>
              </p>
              <button
                onClick={() => setShowRecoveryModal(true)}
                className="text-caption text-primary-green-500 hover:underline mt-2"
              >
                Use recovery options
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6-Digit Code Input */}
      <div className="mb-6" onPaste={handlePaste}>
        <label className="label mb-2">Verification Code</label>
        <div className="flex gap-2 justify-center">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={loading || isLocked}
              className={`
                w-12 h-12 text-center text-h4 font-semibold
                border-2 rounded-lg focus:outline-none focus:ring-2
                transition-all duration-200
                ${
                  error
                    ? 'border-semantic-error-main focus:border-semantic-error-main focus:ring-semantic-error-light'
                    : 'border-neutral-300 focus:border-primary-green-500 focus:ring-primary-green-200'
                }
                ${loading || isLocked ? 'bg-neutral-100 cursor-not-allowed' : 'bg-neutral-0'}
              `}
            />
          ))}
        </div>
        {error && <p className="error-text text-center mt-2">{error}</p>}
        {remainingAttempts !== null &&
          remainingAttempts > 0 &&
          remainingAttempts < 5 &&
          !isLocked && (
            <p className="text-caption text-center mt-2 text-semantic-warning-text">
              {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
            </p>
          )}
      </div>

      {/* Trust Device Checkbox */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={trustDevice}
            onChange={(e) => setTrustDevice(e.target.checked)}
            disabled={loading || isLocked}
            className="w-4 h-4 rounded border-neutral-300 text-primary-green-500 focus:ring-primary-green-500"
          />
          <span className="text-body-sm text-neutral-700">Remember this device for 30 days</span>
        </label>
        <p className="text-caption text-neutral-500 mt-1 ml-6">
          You won't be asked for a code on trusted devices
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleVerify}
          loading={loading}
          disabled={loading || isLocked}
          className="w-full"
          size="large"
        >
          Verify & Sign In
        </Button>

        <div className="flex gap-3">
          <button
            onClick={() => setShowBackupCodeModal(true)}
            disabled={isLocked}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-body-sm font-medium text-primary-blue-500 border border-primary-blue-500 rounded-lg hover:bg-primary-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <KeyIcon className="w-4 h-4" />
            Use Backup Code
          </button>

          <button
            onClick={() => setShowRecoveryModal(true)}
            disabled={isLocked}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-body-sm font-medium text-neutral-600 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DevicePhoneMobileIcon className="w-4 h-4" />
            Recovery Options
          </button>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="w-full text-center text-caption text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            Cancel and return to login
          </button>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-6 pt-4 border-t border-neutral-200">
        <p className="text-caption text-neutral-500 text-center">
          Can't access your authenticator app?{' '}
          <button
            onClick={() => setShowRecoveryModal(true)}
            className="text-primary-green-500 hover:underline"
          >
            Use recovery options
          </button>
        </p>
        <p className="text-caption text-neutral-400 text-center mt-2">
          Need help?{' '}
          <a href="/support" className="hover:underline">
            Contact Support
          </a>
        </p>
      </div>

      {/* Modals */}
      <BackupCodeModal
        isOpen={showBackupCodeModal}
        onClose={() => setShowBackupCodeModal(false)}
        email={email}
        onSuccess={onSuccess}
      />

      <RecoveryModal
        isOpen={showRecoveryModal}
        onClose={() => setShowRecoveryModal(false)}
        email={email}
      />
    </>
  );
};
