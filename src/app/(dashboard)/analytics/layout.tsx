'use client';

import { useTheme } from '@/context/ThemeContext';

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Top Navigation Bar - No ThemeToggle here, it belongs in the page or global header */}
      <nav className="sticky top-0 z-50 transition-colors duration-300" style={{ 
        backgroundColor: 'var(--bg-secondary)',
        borderBottomColor: 'var(--border-color)',
        borderBottomWidth: 1
      }}>
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
                <span className="font-semibold text-lg transition-colors duration-300" style={{ color: 'var(--text-primary)' }}>
                  Rapid Tie Analytics
                </span>
              </div>
            </div>

            {/* Right side - No ThemeToggle here (it should be in the page or global header) */}
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