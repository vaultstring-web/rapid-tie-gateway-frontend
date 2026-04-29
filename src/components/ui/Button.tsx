import { forwardRef } from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  href?: string;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'medium', 
    href, 
    loading = false,
    className = '',
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = `
      inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200
      ${loading ? 'cursor-wait opacity-70' : 'hover:shadow-lg hover:-translate-y-0.5'}
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
    `;
    
    const variantClasses = {
      primary: 'bg-primary-green-500 text-white hover:bg-primary-green-600',
      secondary: 'bg-transparent text-primary-blue-500 border-2 border-primary-blue-500 hover:bg-primary-blue-50',
      danger: 'bg-semantic-error-main text-white hover:bg-semantic-error-dark',
      success: 'bg-semantic-success-main text-white hover:bg-semantic-success-dark',
    };
    
    const sizeClasses = {
      small: 'px-4 py-1.5 text-button-small',
      medium: 'px-6 py-2 text-button-medium',
      large: 'px-8 py-3 text-button-large',
    };
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
    
    if (href) {
      return (
        <Link href={href} className={classes}>
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading...
            </span>
          ) : children}
        </Link>
      );
    }
    
    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </span>
        ) : children}
      </button>
    );
  }
);

Button.displayName = 'Button';