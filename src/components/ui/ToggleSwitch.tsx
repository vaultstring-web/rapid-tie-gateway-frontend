'use client';

import { useTheme } from '@/context/ThemeContext';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ToggleSwitch = ({ enabled, onChange, disabled = false, size = 'md' }: ToggleSwitchProps) => {
  const { theme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
    lg: 'w-14 h-7',
  };

  const toggleSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const translateX = {
    sm: enabled ? 'translate-x-4' : 'translate-x-0',
    md: enabled ? 'translate-x-5' : 'translate-x-0',
    lg: enabled ? 'translate-x-7' : 'translate-x-0',
  };

  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`
        relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out
        ${enabled ? 'bg-primary-green-500' : 'bg-gray-300 dark:bg-gray-600'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${sizeClasses[size]}
      `}
    >
      <span
        className={`
          inline-block transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out
          ${toggleSizeClasses[size]}
          ${translateX[size]}
        `}
      />
    </button>
  );
};