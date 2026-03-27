'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Requirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
  description?: string;
}

interface PasswordStrengthMeterProps {
  password: string;
  confirmPassword?: string;
  showConfirmError?: boolean;
  onValidChange?: (isValid: boolean) => void;
}

const requirements: Requirement[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (p) => p.length >= 8,
    description: 'Use 8 or more characters',
  },
  {
    id: 'uppercase',
    label: 'Uppercase letter',
    test: (p) => /[A-Z]/.test(p),
    description: 'Include at least one uppercase letter (A-Z)',
  },
  {
    id: 'lowercase',
    label: 'Lowercase letter',
    test: (p) => /[a-z]/.test(p),
    description: 'Include at least one lowercase letter (a-z)',
  },
  {
    id: 'number',
    label: 'Number',
    test: (p) => /[0-9]/.test(p),
    description: 'Include at least one number (0-9)',
  },
  {
    id: 'special',
    label: 'Special character',
    test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p),
    description: 'Include at least one special character (!@#$%^&*)',
  },
];

export const PasswordStrengthMeter = ({
  password,
  confirmPassword = '',
  showConfirmError = false,
  onValidChange,
}: PasswordStrengthMeterProps) => {
  const [strength, setStrength] = useState<'weak' | 'medium' | 'strong' | 'very-strong'>('weak');
  const [score, setScore] = useState(0);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const met = requirements.filter((req) => req.test(password));
    const newScore = met.length;
    setScore(newScore);

    if (newScore <= 2) {
      setStrength('weak');
    } else if (newScore === 3) {
      setStrength('medium');
    } else if (newScore === 4) {
      setStrength('strong');
    } else {
      setStrength('very-strong');
    }

    const passwordsMatch = password === confirmPassword;
    const isPasswordValid = newScore === 5;
    const nextValid = isPasswordValid && (confirmPassword === '' || passwordsMatch);
    setIsValid(nextValid);
    onValidChange?.(nextValid);
  }, [password, confirmPassword, onValidChange]);

  const getStrengthColor = () => {
    switch (strength) {
      case 'weak':
        return 'bg-semantic-error-main';
      case 'medium':
        return 'bg-semantic-warning-main';
      case 'strong':
        return 'bg-primary-green-500';
      case 'very-strong':
        return 'bg-primary-green-600';
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

  const getStrengthIcon = () => {
    if (score === 5) {
      return <CheckCircleIcon className="w-4 h-4 text-semantic-success-main" />;
    }
    if (score >= 3) {
      return <ExclamationTriangleIcon className="w-4 h-4 text-semantic-warning-main" />;
    }
    if (password.length > 0) {
      return <XCircleIcon className="w-4 h-4 text-semantic-error-main" />;
    }
    return null;
  };

  return (
    <div className="space-y-3">
      {password.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {getStrengthIcon()}
              <span className="text-caption text-neutral-600">Password Strength:</span>
            </div>
            <span
              className={`text-caption font-medium ${
                strength === 'weak'
                  ? 'text-semantic-error-main'
                  : strength === 'medium'
                    ? 'text-semantic-warning-main'
                    : 'text-primary-green-500'
              }`}
            >
              {getStrengthText()}
            </span>
          </div>
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getStrengthColor()}`}
              style={{ width: `${(score / 5) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
        <p className="text-body-sm font-medium text-neutral-700 mb-2">Password requirements:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {requirements.map((req) => {
            const met = req.test(password);
            return (
              <div key={req.id} className="flex items-start gap-2">
                {met ? (
                  <CheckCircleIcon className="w-4 h-4 text-semantic-success-main mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircleIcon className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <span
                    className={`text-caption ${met ? 'text-semantic-success-text' : 'text-neutral-500'}`}
                  >
                    {req.label}
                  </span>
                  {!met && password.length > 0 && (
                    <p className="text-caption text-neutral-400 mt-0.5">{req.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showConfirmError && confirmPassword && password !== confirmPassword && (
        <div className="flex items-center gap-2 text-semantic-error-main bg-semantic-error-light rounded-lg p-3">
          <XCircleIcon className="w-4 h-4 flex-shrink-0" />
          <span className="text-caption">Passwords do not match</span>
        </div>
      )}

      {isValid && confirmPassword && password === confirmPassword && (
        <div className="flex items-center gap-2 text-semantic-success-main bg-semantic-success-light rounded-lg p-3">
          <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
          <span className="text-caption">Strong password! Ready to reset.</span>
        </div>
      )}
    </div>
  );
};
