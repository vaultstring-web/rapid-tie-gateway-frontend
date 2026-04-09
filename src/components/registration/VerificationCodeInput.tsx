'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

interface VerificationCodeInputProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  loading?: boolean;
  error?: string;
}

export const VerificationCodeInput = ({
  email,
  onVerify,
  onResend,
  loading = false,
  error,
}: VerificationCodeInputProps) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const getFullCode = () => code.join('');

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setLocalError(null);

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    if (digits.length === 6) {
      const newCode = digits.split('');
      setCode(newCode);
      inputRefs[5].current?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = getFullCode();
    if (fullCode.length !== 6) {
      setLocalError('Please enter the 6-digit verification code');
      return;
    }
    setVerifying(true);
    setLocalError(null);

    try {
      await onVerify(fullCode);
    } catch (err: any) {
      setLocalError(err?.message || 'Invalid verification code');
      setCode(['', '', '', '', '', '']);
      inputRefs[0].current?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    try {
      await onResend();
      setResendCountdown(60);
      setLocalError(null);
    } catch (err: any) {
      setLocalError(err?.message || 'Failed to resend code');
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <EnvelopeIcon className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-h3 font-bold text-neutral-900 mb-2">Verify Your Email</h2>
        <p className="text-body text-neutral-600">We've sent a 6-digit verification code to</p>
        <p className="text-body font-semibold text-emerald-600 mt-1">{email}</p>
      </div>

      <div className="mt-8" onPaste={handlePaste}>
        <label className="label label-required text-center block mb-4">Verification Code</label>
        <div className="flex gap-2 justify-center">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={verifying || loading}
              className={`w-12 h-12 text-center text-h4 font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                localError || error
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                  : 'border-neutral-300 focus:border-emerald-500 focus:ring-emerald-200'
              } ${verifying || loading ? 'bg-neutral-100 cursor-not-allowed' : 'bg-white'}`}
            />
          ))}
        </div>

        {(localError || error) && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-text text-center mt-3"
          >
            {localError || error}
          </motion.p>
        )}
      </div>

      <div className="text-center">
        <p className="text-body-sm text-neutral-600">Didn't receive the code?</p>
        <button
          onClick={handleResend}
          disabled={resendCountdown > 0 || verifying || loading}
          className={`inline-flex items-center gap-2 mt-2 text-body-sm font-medium transition-colors ${
            resendCountdown > 0
              ? 'text-neutral-400 cursor-not-allowed'
              : 'text-emerald-500 hover:text-emerald-600'
          }`}
        >
          <ArrowPathIcon className={`w-4 h-4 ${resendCountdown === 0 ? 'animate-spin' : ''}`} />
          {resendCountdown > 0
            ? `Resend code in ${formatCountdown(resendCountdown)}`
            : 'Resend Code'}
        </button>
        {resendCountdown === 0 && (
          <p className="text-caption text-neutral-500 mt-2">
            Check your spam folder if you don't see the email
          </p>
        )}
      </div>

      <Button
        onClick={handleVerify}
        loading={verifying || loading}
        disabled={verifying || loading}
        size="large"
        className="w-full mt-4"
      >
        Verify & Create Account
      </Button>

      <div className="bg-neutral-50 rounded-lg p-4 text-center">
        <p className="text-caption text-neutral-600">
          Having trouble?{' '}
          <button className="text-emerald-500 hover:underline">Contact Support</button>
        </p>
      </div>
    </div>
  );
};
