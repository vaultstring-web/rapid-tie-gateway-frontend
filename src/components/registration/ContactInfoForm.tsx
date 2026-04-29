'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { RegistrationData } from '@/types/registration';

interface ContactInfoFormProps {
  data: RegistrationData['contactInfo'];
  onChange: (data: Partial<RegistrationData['contactInfo']>) => void;
  errors: Partial<Record<keyof RegistrationData['contactInfo'], string>>;
}

export const ContactInfoForm = ({ data, onChange, errors }: ContactInfoFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ phone: formatPhoneNumber(e.target.value) });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-h3 font-bold text-neutral-900 mb-2">Contact Information</h2>
        <p className="text-body text-neutral-600">Tell us how to reach you</p>
      </div>

      <div className="space-y-5 mt-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label label-required">First Name</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <UserIcon className="w-5 h-5" />
              </div>
              <input
                id="field-firstName"
                type="text"
                value={data.firstName}
                onChange={(e) => onChange({ firstName: e.target.value })}
                className={`input pl-10 ${errors.firstName ? 'input-error' : ''}`}
                placeholder="John"
              />
            </div>
            {errors.firstName && <p className="error-text mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="label label-required">Last Name</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <UserIcon className="w-5 h-5" />
              </div>
              <input
                id="field-lastName"
                type="text"
                value={data.lastName}
                onChange={(e) => onChange({ lastName: e.target.value })}
                className={`input pl-10 ${errors.lastName ? 'input-error' : ''}`}
                placeholder="Doe"
              />
            </div>
            {errors.lastName && <p className="error-text mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label className="label label-required">Email Address</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <EnvelopeIcon className="w-5 h-5" />
            </div>
            <input
              id="field-email"
              type="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
              placeholder="john@example.com"
            />
          </div>
          {errors.email && <p className="error-text mt-1">{errors.email}</p>}
          <p className="text-caption text-neutral-500 mt-1">
            We'll send a verification code to this email
          </p>
        </div>

        <div>
          <label className="label label-required">Phone Number</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <PhoneIcon className="w-5 h-5" />
            </div>
            <input
              id="field-phone"
              type="tel"
              value={data.phone}
              onChange={handlePhoneChange}
              className={`input pl-10 ${errors.phone ? 'input-error' : ''}`}
              placeholder="0999 123 456"
            />
          </div>
          {errors.phone && <p className="error-text mt-1">{errors.phone}</p>}
          <p className="text-caption text-neutral-500 mt-1">
            Malawian phone number (e.g., 0999 123 456)
          </p>
        </div>

        <div>
          <label className="label label-required">Password</label>
          <div className="relative">
            <input
              id="field-password"
              type={showPassword ? 'text' : 'password'}
              value={data.password}
              onChange={(e) => onChange({ password: e.target.value })}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && <p className="error-text mt-1">{errors.password}</p>}
          <PasswordStrengthIndicator
            password={data.password}
            showRequirements={passwordFocused || data.password.length > 0}
          />
        </div>

        <div>
          <label className="label label-required">Confirm Password</label>
          <div className="relative">
            <input
              id="field-confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={data.confirmPassword}
              onChange={(e) => onChange({ confirmPassword: e.target.value })}
              className={`input pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && <p className="error-text mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>

      <div className="bg-emerald-50 rounded-lg p-4 mt-4">
        <p className="text-body-sm text-emerald-800">
          <strong>🔒 Security Notice:</strong> Your password is encrypted and never stored in plain
          text. We recommend using a unique password for your Rapid Tie account.
        </p>
      </div>
    </div>
  );
};
