'use client';

import { useState } from 'react';
import { XMarkIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { twoFactorService } from '@/services/twoFactor.service';

interface RecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export const RecoveryModal = ({ isOpen, onClose, email }: RecoveryModalProps) => {
  const [method, setMethod] = useState<'email' | 'sms'>('email');
  const [contact, setContact] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'method' | 'code'>('method');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contact.trim()) {
      setError('Please enter your contact information');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await twoFactorService.requestRecovery(method, contact);
      setStep('code');
    } catch (error: any) {
      setError(error.message || 'Failed to send recovery code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setError('Please enter the recovery code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await twoFactorService.verifyRecovery(code.trim());
      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.href = '/login';
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Invalid recovery code');
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

        {success ? (
          <div className="text-center">
            <div className="w-14 h-14 bg-semantic-success-light rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-semantic-success-main"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-h5 font-semibold text-neutral-900 mb-2">Recovery Successful</h3>
            <p className="text-body-sm text-neutral-600">
              2FA has been disabled. You can now sign in with your password.
            </p>
            <p className="text-caption text-neutral-500 mt-2">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h3 className="text-h5 font-semibold text-neutral-900">
                {step === 'method' ? 'Account Recovery' : 'Verify Recovery Code'}
              </h3>
              <p className="text-body-sm text-neutral-600 mt-1">
                {step === 'method'
                  ? 'Choose how to receive your recovery code'
                  : 'Enter the 6-digit code sent to your contact'}
              </p>
            </div>

            {step === 'method' ? (
              <form onSubmit={handleSendCode}>
                {/* Method Selection */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setMethod('email')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      method === 'email'
                        ? 'border-primary-green-500 bg-primary-green-50'
                        : 'border-neutral-200 hover:border-primary-green-300'
                    }`}
                  >
                    <EnvelopeIcon
                      className={`w-6 h-6 ${method === 'email' ? 'text-primary-green-500' : 'text-neutral-500'}`}
                    />
                    <span
                      className={`text-body-sm font-medium ${method === 'email' ? 'text-primary-green-700' : 'text-neutral-700'}`}
                    >
                      Email
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('sms')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      method === 'sms'
                        ? 'border-primary-green-500 bg-primary-green-50'
                        : 'border-neutral-200 hover:border-primary-green-300'
                    }`}
                  >
                    <PhoneIcon
                      className={`w-6 h-6 ${method === 'sms' ? 'text-primary-green-500' : 'text-neutral-500'}`}
                    />
                    <span
                      className={`text-body-sm font-medium ${method === 'sms' ? 'text-primary-green-700' : 'text-neutral-700'}`}
                    >
                      SMS
                    </span>
                  </button>
                </div>

                {/* Contact Input */}
                <Input
                  type={method === 'email' ? 'email' : 'tel'}
                  label={method === 'email' ? 'Email Address' : 'Phone Number'}
                  placeholder={method === 'email' ? 'you@example.com' : '+265 999 123 456'}
                  value={contact}
                  onChange={(e) => {
                    setContact(e.target.value);
                    setError(null);
                  }}
                  error={error ?? undefined}
                  required
                  className="mb-6"
                />

                <Button type="submit" loading={loading} className="w-full">
                  Send Recovery Code
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode}>
                <Input
                  type="text"
                  label="Recovery Code"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError(null);
                  }}
                  error={error ?? undefined}
                  required
                  className="mb-6 text-center text-h5 tracking-wider"
                />

                <Button type="submit" loading={loading} className="w-full mb-3">
                  Verify & Disable 2FA
                </Button>

                <button
                  type="button"
                  onClick={() => setStep('method')}
                  className="w-full text-center text-caption text-neutral-500 hover:text-neutral-700"
                >
                  ← Back to contact selection
                </button>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-neutral-200">
              <p className="text-caption text-neutral-500 text-center">
                Need additional help?{' '}
                <a href="/support" className="text-primary-green-500 hover:underline">
                  Contact Support
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
