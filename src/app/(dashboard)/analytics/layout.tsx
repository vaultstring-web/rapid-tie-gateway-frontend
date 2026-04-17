'use client';

import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo / Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img 
                  src="/vault.png" 
                  alt="VaultString" 
                  className="h-8 w-auto"
                />
              </div>
              <div className="hidden md:block ml-4">
                <span className="text-gray-900 dark:text-white font-semibold text-lg">
                  Rapid Tie Analytics
                </span>
              </div>
            </div>

            {/* Right side - Dark Mode Toggle */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}