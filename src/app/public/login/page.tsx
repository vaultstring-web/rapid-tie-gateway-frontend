'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import { TwoFactorVerification } from '@/components/auth/TwoFactorVerification';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';
import { twoFactorService } from '@/services/twoFactor.service';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 2FA State
  const [show2FA, setShow2FA] = useState(false);
  const [pendingUser, setPendingUser] = useState<{ email: string } | null>(null);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);

  // Load saved remember me preference
  useEffect(() => {
    const savedRememberMe = authService.getRememberMe();
    setRememberMe(savedRememberMe);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const user = authService.getCurrentUser();
      if (user) {
        authService.redirectToDashboard(user);
      }
    }
  }, [isAuthenticated, isLoading]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await login({
        email,
        password,
        rememberMe,
      });
    } catch (error: any) {
      console.error('Login failed', error);
      // Handle login error (user will see error from useAuth hook)
    } finally {
      setLoading(false);
    }
  };

  // Handle 2FA success
  const handleTwoFactorSuccess = () => {
    setShow2FA(false);
    setTwoFactorRequired(false);
    setPendingUser(null);
    // Redirect will happen via useAuth hook
  };

  // Handle 2FA cancel
  const handleTwoFactorCancel = () => {
    setShow2FA(false);
    setTwoFactorRequired(false);
    setPendingUser(null);
  };

  // If 2FA is required, show 2FA component
  if (show2FA && pendingUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Subtle background pattern for HD effect */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`,
            }}
          ></div>
        </div>
        <div className="max-w-md w-full relative z-10">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 backdrop-blur-sm">
            <TwoFactorVerification
              email={pendingUser.email}
              onSuccess={handleTwoFactorSuccess}
              onCancel={handleTwoFactorCancel}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background pattern for HD effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`,
          }}
        ></div>
      </div>
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 mb-6 backdrop-blur-sm">
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-3 justify-center">
              <div className="w-16 h-16 flex items-center justify-center">
                <Image
                  src="/vault.png"
                  width={80}
                  height={80}
                  alt="VaultString Rapid Tie Payment Gateway"
                  className="object-contain"
                />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-gray-1200">VaultString</p>
                <p className="text-sm text-gray-900">Rapid Tie Payment Gateway</p>
              </div>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Welcome back</h1>
          <p className="text-center text-gray-500 mb-6">Sign in to continue to your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              placeholder="jayne@example.com"
              error={errors.email}
              required
            />

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="label">Password</label>
                <button
                  type="button"
                  className="text-sm text-primary-green-500 hover:underline"
                  onClick={() => setIsForgotPasswordOpen(true)}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  className={`input w-full ${errors.password ? 'input-error' : ''}`}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && <p className="error-text mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>

              <Link href="/register" className="text-sm text-primary-green-500 hover:underline">
                Create account
              </Link>
            </div>

            <Button
              type="submit"
              loading={loading || isLoading}
              className="w-full"
              disabled={loading || isLoading}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-3 text-center text-xs text-gray-500">
            By signing in you agree to our{' '}
            <Link href="/legal/terms" className="text-primary-green-500 underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/legal/privacy" className="text-primary-green-500 underline">
              Privacy Policy
            </Link>
            .
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-5 border-t pt-4">
              <p className="text-xs text-gray-500 mb-2">Demo credentials (development only)</p>
              <div className="flex gap-2 flex-wrap justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('merchant@example.com');
                    setPassword('Merchant@123');
                  }}
                  className="text-xs px-3 py-1 border rounded"
                >
                  Merchant
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('organizer@example.com');
                    setPassword('Organizer@123');
                  }}
                  className="text-xs px-3 py-1 border rounded"
                >
                  Organizer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@rapidtie.vaultstring.com');
                    setPassword('Admin@123');
                  }}
                  className="text-xs px-3 py-1 border rounded"
                >
                  Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
}
