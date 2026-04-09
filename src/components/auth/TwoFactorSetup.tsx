'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  ShieldCheckIcon,
  KeyIcon,
  ClipboardDocumentIcon,
  PrinterIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { twoFactorService } from '@/services/twoFactor.service';

interface TwoFactorSetupProps {
  onComplete: () => void;
  onCancel?: () => void;
}

export const TwoFactorSetup = ({ onComplete, onCancel }: TwoFactorSetupProps) => {
  const [step, setStep] = useState<'intro' | 'qr' | 'verify' | 'backup' | 'complete'>('intro');
  const [setupData, setSetupData] = useState<any>(null);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [printed, setPrinted] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Initialize setup when component mounts
  useEffect(() => {
    initializeSetup();
  }, []);

  // Auto-focus first input on verify step
  useEffect(() => {
    if (step === 'verify') {
      inputRefs[0].current?.focus();
    }
  }, [step]);

  // Initialize 2FA setup
  const initializeSetup = async () => {
    setLoading(true);
    try {
      const data = await twoFactorService.setup();
      setSetupData(data);
    } catch (error) {
      console.error('Failed to initialize 2FA setup:', error);
      setError('Failed to initialize 2FA setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle code input change
  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError(null);

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
      inputRefs[5].current?.focus();
    }
  };

  // Get full code
  const getFullCode = (): string => {
    return code.join('');
  };

  // Verify code and enable 2FA
  const handleVerify = async () => {
    const fullCode = getFullCode();

    if (fullCode.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await twoFactorService.enable(fullCode);

      // Trigger confetti animation
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#448a33', '#3b5a65', '#28a745', '#ffc107'],
      });

      setStep('backup');
    } catch (error: any) {
      setError(error.message || 'Invalid verification code');
      setCode(['', '', '', '', '', '']);
      inputRefs[0].current?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Copy backup codes to clipboard
  const copyBackupCodes = () => {
    if (setupData?.backupCodes) {
      const codesText = setupData.backupCodes.join('\n');
      navigator.clipboard.writeText(codesText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Print backup codes
  const printBackupCodes = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Rapid Tie - 2FA Backup Codes</title>
            <style>
              body {
                font-family: 'Inter', sans-serif;
                padding: 40px;
                text-align: center;
              }
              .logo {
                margin-bottom: 20px;
              }
              h1 {
                font-size: 24px;
                margin-bottom: 10px;
              }
              .warning {
                background: #fff3cd;
                border: 1px solid #ffc107;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                color: #856404;
              }
              .codes {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin: 30px 0;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 12px;
              }
              .code {
                font-family: 'Roboto Mono', monospace;
                font-size: 18px;
                font-weight: 600;
                letter-spacing: 2px;
                padding: 10px;
                background: white;
                border-radius: 8px;
                border: 1px solid #dee2e6;
              }
              .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #6c757d;
              }
            </style>
          </head>
          <body>
            <div class="logo">
              <div style="display: inline-flex; align-items: center; gap: 8px;">
                <div style="width: 40px; height: 40px; background: #448a33; border-radius: 8px;"></div>
                <div><strong>Rapid Tie</strong><br><small>by VaultString</small></div>
              </div>
            </div>
            <h1>Two-Factor Authentication Backup Codes</h1>
            <p>Keep these codes in a safe place. Each code can only be used once.</p>
            <div class="warning">
              ⚠️ If you lose access to your authenticator app and these backup codes,
              you may lose access to your account.
            </div>
            <div class="codes">
              ${setupData?.backupCodes.map((code: string) => `<div class="code">${code}</div>`).join('')}
            </div>
            <div class="footer">
              Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}<br>
              Rapid Tie Payment Gateway - VaultString
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      setPrinted(true);
    }
  };

  // Download backup codes as PDF
  const downloadBackupCodes = () => {
    const content = `
RAPID TIE - 2FA BACKUP CODES
Generated: ${new Date().toLocaleString()}
Account: ${setupData?.userEmail || 'Your Account'}

IMPORTANT: Keep these codes safe. Each code can only be used once.

${setupData?.backupCodes.join('\n')}

If you lose access to your authenticator app and these backup codes,
you may lose access to your account.

Rapid Tie Payment Gateway - VaultString
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rapid-tie-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Complete setup
  const handleComplete = () => {
    onComplete();
  };

  if (loading && step === 'intro') {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-neutral-600">Setting up 2FA...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['intro', 'qr', 'verify', 'backup', 'complete'].map((s, idx) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === s ? 'bg-primary-green-500 text-white' : ['intro', 'qr', 'verify', 'backup', 'complete'].indexOf(step) > idx ? 'bg-primary-green-100 text-primary-green-600' : 'bg-neutral-200 text-neutral-500'}`}
              >
                {['intro', 'qr', 'verify', 'backup', 'complete'].indexOf(step) > idx
                  ? '✓'
                  : idx + 1}
              </div>
              {idx < 4 && (
                <div
                  className={`w-12 h-0.5 ${step !== 'intro' ? 'bg-primary-green-300' : 'bg-neutral-200'}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-caption text-neutral-500">Intro</span>
          <span className="text-caption text-neutral-500">QR Code</span>
          <span className="text-caption text-neutral-500">Verify</span>
          <span className="text-caption text-neutral-500">Backup Codes</span>
          <span className="text-caption text-neutral-500">Complete</span>
        </div>
      </div>

      {/* Intro Step */}
      {step === 'intro' && (
        <div className="text-center">
          <div className="w-20 h-20 bg-primary-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheckIcon className="w-10 h-10 text-primary-green-500" />
          </div>
          <h2 className="text-h3 font-bold text-neutral-900 mb-3">Secure Your Account with 2FA</h2>
          <p className="text-body text-neutral-600 mb-6 max-w-md mx-auto">
            Two-factor authentication adds an extra layer of security to your account. You'll need
            to enter a code from your authenticator app when signing in.
          </p>
          <div className="bg-neutral-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <KeyIcon className="w-5 h-5 text-primary-green-500 mt-0.5" />
              <div className="text-left">
                <p className="text-body-sm font-medium text-neutral-800">What you'll need:</p>
                <ul className="text-caption text-neutral-600 mt-1 space-y-1">
                  <li>
                    • An authenticator app (Google Authenticator, Microsoft Authenticator, or Authy)
                  </li>
                  <li>• Your phone or tablet to scan the QR code</li>
                  <li>• A safe place to store your backup codes</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => setStep('qr')} size="large">
              Get Started
            </Button>
            {onCancel && (
              <Button variant="secondary" onClick={onCancel} size="large">
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}

      {/* QR Code Step */}
      {step === 'qr' && setupData && (
        <div className="text-center">
          <h2 className="text-h4 font-bold text-neutral-900 mb-2">Scan QR Code</h2>
          <p className="text-body-sm text-neutral-600 mb-6">
            Scan this QR code with your authenticator app
          </p>

          {/* QR Code Display */}
          <div className="bg-neutral-0 p-6 rounded-xl shadow-md inline-block mb-6">
            {setupData.qrCode ? (
              <Image
                src={setupData.qrCode}
                alt="2FA QR Code"
                width={200}
                height={200}
                className="mx-auto"
              />
            ) : (
              <div className="w-[200px] h-[200px] bg-neutral-100 rounded-lg flex items-center justify-center">
                <ArrowPathIcon className="w-8 h-8 text-neutral-400 animate-spin" />
              </div>
            )}
          </div>

          {/* Manual Entry Option */}
          <div className="bg-neutral-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
            <p className="text-body-sm font-medium text-neutral-800 mb-2">
              Can't scan the QR code?
            </p>
            <p className="text-caption text-neutral-600 mb-2">
              Enter this code manually in your authenticator app:
            </p>
            <code className="block bg-neutral-200 px-4 py-2 rounded font-mono text-sm break-all">
              {setupData.secret}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(setupData.secret);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="inline-flex items-center gap-1 text-caption text-primary-green-500 hover:text-primary-green-600 mt-2"
            >
              <ClipboardDocumentIcon className="w-3 h-3" />
              {copied ? 'Copied!' : 'Copy code'}
            </button>
          </div>

          <Button onClick={() => setStep('verify')} size="large">
            I've Scanned the QR Code
          </Button>
        </div>
      )}

      {/* Verify Step */}
      {step === 'verify' && (
        <div className="text-center">
          <h2 className="text-h4 font-bold text-neutral-900 mb-2">Verify Your Code</h2>
          <p className="text-body-sm text-neutral-600 mb-6">
            Enter the 6-digit code from your authenticator app to enable 2FA
          </p>

          {/* 6-Digit Code Input */}
          <div className="mb-6" onPaste={handlePaste}>
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
                  disabled={loading}
                  className={`w-12 h-12 text-center text-h4 font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${error ? 'border-semantic-error-main focus:border-semantic-error-main focus:ring-semantic-error-light' : 'border-neutral-300 focus:border-primary-green-500 focus:ring-primary-green-200'} ${loading ? 'bg-neutral-100 cursor-not-allowed' : 'bg-neutral-0'}`}
                />
              ))}
            </div>
            {error && <p className="error-text text-center mt-2">{error}</p>}
          </div>

          <Button onClick={handleVerify} loading={loading} size="large" className="min-w-[200px]">
            Verify & Enable
          </Button>
        </div>
      )}

      {/* Backup Codes Step */}
      {step === 'backup' && setupData && (
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-semantic-warning-light rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyIcon className="w-8 h-8 text-semantic-warning-main" />
            </div>
            <h2 className="text-h4 font-bold text-neutral-900 mb-2">Save Your Backup Codes</h2>
            <p className="text-body-sm text-neutral-600 max-w-md mx-auto">
              These backup codes can be used to access your account if you lose your authenticator
              app.
              <span className="block text-semantic-warning-text font-medium mt-2">
                ⚠️ Save them in a safe place. You will only see them once!
              </span>
            </p>
          </div>

          {/* Backup Codes Display */}
          <div className="bg-neutral-50 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-3">
              {setupData.backupCodes.map((code: string, idx: number) => (
                <div
                  key={idx}
                  className="bg-neutral-0 rounded-lg p-3 text-center font-mono text-body font-semibold border border-neutral-200"
                >
                  {code}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <button
              onClick={copyBackupCodes}
              className="inline-flex items-center gap-2 px-4 py-2 text-body-sm font-medium text-primary-blue-600 border border-primary-blue-200 rounded-lg hover:bg-primary-blue-50 transition-colors"
            >
              <ClipboardDocumentIcon className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy All Codes'}
            </button>
            <button
              onClick={printBackupCodes}
              className="inline-flex items-center gap-2 px-4 py-2 text-body-sm font-medium text-primary-blue-600 border border-primary-blue-200 rounded-lg hover:bg-primary-blue-50 transition-colors"
            >
              <PrinterIcon className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={downloadBackupCodes}
              className="inline-flex items-center gap-2 px-4 py-2 text-body-sm font-medium text-primary-blue-600 border border-primary-blue-200 rounded-lg hover:bg-primary-blue-50 transition-colors"
            >
              Download
            </button>
          </div>

          <div className="bg-semantic-info-light rounded-lg p-4 mb-6">
            <p className="text-body-sm text-semantic-info-text">
              💡 <strong>Pro Tip:</strong> Store these codes in a password manager or print them and
              keep them somewhere safe.
            </p>
          </div>

          <Button onClick={() => setStep('complete')} size="large" className="min-w-[200px]">
            I've Saved My Backup Codes
          </Button>
        </div>
      )}

      {/* Complete Step */}
      {step === 'complete' && (
        <div className="text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-semantic-success-light rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-semantic-success-main"
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
            <h2 className="text-h3 font-bold text-neutral-900 mb-2">2FA Enabled Successfully!</h2>
            <p className="text-body text-neutral-600 max-w-md mx-auto">
              Your account is now more secure. You'll need to enter a verification code from your
              authenticator app each time you sign in.
            </p>
          </div>

          <div className="bg-primary-green-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <ShieldCheckIcon className="w-5 h-5 text-primary-green-500 mt-0.5" />
              <div className="text-left">
                <p className="text-body-sm font-medium text-primary-green-800">What's next?</p>
                <ul className="text-caption text-primary-green-700 mt-1 space-y-1">
                  <li>• You'll be prompted for a 2FA code on your next login</li>
                  <li>• Keep your backup codes safe for emergency access</li>
                  <li>• You can manage trusted devices in security settings</li>
                </ul>
              </div>
            </div>
          </div>

          <Button onClick={handleComplete} size="large" className="min-w-[200px]">
            Done
          </Button>
        </div>
      )}
    </div>
  );
};
