import type { Config } from 'tailwindcss'
import { theme } from './src/styles/theme'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: theme.colors.primary.green,
          blue: theme.colors.primary.blue,
        },
        semantic: theme.colors.semantic,
        neutral: theme.colors.neutral,
        dark: theme.colors.dark,
      },
      spacing: {
        '2xs': `${theme.spacing.scale.xs}px`,
        'xs': `${theme.spacing.scale.sm}px`,
        'sm': `${theme.spacing.scale.md}px`,
        'md': `${theme.spacing.scale.lg}px`,
        'lg': `${theme.spacing.scale.xl}px`,
        'xl': `${theme.spacing.scale['2xl']}px`,
        '2xl': `${theme.spacing.scale['3xl']}px`,
        '3xl': `${theme.spacing.scale['4xl']}px`,
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      fontSize: {
        'h1': ['3rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }],
        'h2': ['2.25rem', { lineHeight: '1.25', fontWeight: '700', letterSpacing: '-0.01em' }],
        'h3': ['1.75rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['1.5rem', { lineHeight: '1.35', fontWeight: '600' }],
        'h5': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h6': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.57' }],
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.02em' }],
      },
      boxShadow: {
        'sm': theme.shadows.sm,
        'md': theme.shadows.md,
        'lg': theme.shadows.lg,
        'xl': theme.shadows.xl,
      },
      borderRadius: {
        'sm': theme.borderRadius.sm,
        'md': theme.borderRadius.md,
        'lg': theme.borderRadius.lg,
        'xl': theme.borderRadius.xl,
        'full': theme.borderRadius.full,
      },
      screens: {
        'mobile': theme.breakpoints.mobile,
        'tablet': theme.breakpoints.tablet,
        'desktop': theme.breakpoints.desktop,
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config