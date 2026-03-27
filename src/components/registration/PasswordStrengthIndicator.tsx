'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

interface Requirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (p) => p.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'At least one uppercase letter (A-Z)',
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: 'lowercase',
    label: 'At least one lowercase letter (a-z)',
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: 'number',
    label: 'At least one number (0-9)',
    test: (p) => /[0-9]/.test(p),
  },
  {
    id: 'special',
    label: 'At least one special character (!@#$%^&*)',
    test: (p) => /[!@#$%^&*]/.test(p),
  },
];

export const PasswordStrengthIndicator = ({
  password,
  showRequirements = true,
}: PasswordStrengthIndicatorProps) => {
  const [strength, setStrength] = useState<'weak' | 'medium' | 'strong' | 'very-strong'>('weak');
  const [score, setScore] = useState(0);

  useEffect(() => {
    const met = requirements.filter((req) => req.test(password));
    setScore(met.length);

    if (met.length <= 2) {
      setStrength('weak');
    } else if (met.length === 3) {
      setStrength('medium');
    } else if (met.length === 4) {
      setStrength('strong');
    } else {
      setStrength('very-strong');
    }
  }, [password]);

  const getStrengthColor = () => {
    switch (strength) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-500';
      case 'strong':
        return 'bg-emerald-500';
      case 'very-strong':
        return 'bg-emerald-600';
      default:
        return 'bg-neutral-300';
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case 'weak':
        return 'Weak';
      case 'medium':
        return 'Medium';
      case 'strong':
        return 'Strong';
      case 'very-strong':
        return 'Very Strong';
      default:
        return 'Weak';
    }
  };

  const getStrengthWidth = () => `${(score / 5) * 100}%`;

  return (
    <div className="space-y-3">
      {password.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-caption text-neutral-600">Password Strength:</span>
            <span
              className={`text-caption font-medium ${
                strength === 'weak'
                  ? 'text-red-500'
                  : strength === 'medium'
                    ? 'text-amber-500'
                    : 'text-emerald-500'
              }`}
            >
              {getStrengthText()}
            </span>
          </div>
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getStrengthColor()}`}
              style={{ width: getStrengthWidth() }}
            />
          </div>
        </div>
      )}

      {showRequirements && (
        <div className="bg-neutral-50 rounded-lg p-3 space-y-2">
          <p className="text-caption font-medium text-neutral-700 mb-2">Password requirements:</p>
          {requirements.map((req) => {
            const isMet = req.test(password);
            return (
              <div key={req.id} className="flex items-center gap-2">
                {isMet ? (
                  <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                ) : (
                  <XCircleIcon className="w-4 h-4 text-neutral-400" />
                )}
                <span className={`text-caption ${isMet ? 'text-neutral-700' : 'text-neutral-500'}`}>
                  {req.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
