'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import { TwoFactorVerification } from '@/components/auth/TwoFactorVerification';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';

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
    } finally {
      setLoading(false);
    }
  };

  // Handle 2FA success
  const handleTwoFactorSuccess = () => {
    setShow2FA(false);
    setPendingUser(null);
  };

  // Handle 2FA cancel
  const handleTwoFactorCancel = () => {
    setShow2FA(false);
    setPendingUser(null);
  };

  // If 2FA is required, show 2FA component
  if (show2FA && pendingUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
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
      {/* Subtle background pattern */}
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
          {/* Logo Section */}
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
                <p className="text-xl font-bold text-gray-900">VaultString</p>
                <p className="text-sm text-gray-600">Rapid Tie Payment Gateway</p>
              </div>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Welcome back</h1>
          <p className="text-center text-gray-500 mb-6">Sign in to continue to your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="jayne@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-[#84cc16] hover:underline"
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
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Remember Me & Register Link */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>

              <Link href="/register" className="text-sm text-[#84cc16] hover:underline">
                Create account
              </Link>
            </div>

            {/* GREEN SIGN IN BUTTON */}
            <button
              type="submit"
              disabled={loading || isLoading}
              className="w-full py-2.5 px-4 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
              style={{
                backgroundColor: loading || isLoading ? '#9ca3af' : '#84cc16',
              }}
            >
              {loading || isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Terms and Privacy */}
          <div className="mt-3 text-center text-xs text-gray-500">
            By signing in you agree to our{' '}
            <Link href="/legal/terms" className="text-[#84cc16] underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/legal/privacy" className="text-[#84cc16] underline">
              Privacy Policy
            </Link>
            .
          </div>

          {/* Demo Credentials (Development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-5 border-t pt-4 border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Demo credentials (development only)</p>
              <div className="flex gap-2 flex-wrap justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('merchant@example.com');
                    setPassword('Merchant@123');
                  }}
                  className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Merchant
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('organizer@example.com');
                    setPassword('Organizer@123');
                  }}
                  className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Organizer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@rapidtie.vaultstring.com');
                    setPassword('Admin@123');
                  }}
                  className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
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