'use client';

import { useState } from 'react';
import Sidebar from '@/components/finance/sidebar';
import TopBar from '@/components/finance/topbar';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { UserProvider } from '@/contexts/UserContext';
import { ThemeProvider } from '@/context/ThemeContext';

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const openMobileSidebar = () => {
    setIsMobileSidebarOpen(true);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <ThemeProvider>
      <UserProvider>
        <div
          className="min-h-screen transition-colors"
          style={{ backgroundColor: 'var(--bg-primary)' }}
        >
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={closeMobileSidebar}
          />

          <div
            className={cn(
              'flex flex-col min-h-screen transition-all duration-300',
              !isSidebarCollapsed ? 'lg:ml-64' : 'lg:ml-20'
            )}
          >
            <TopBar onMenuClick={openMobileSidebar} />

            <main
              className="flex-grow p-4 md:p-6 lg:p-8"
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            >
              {children}
            </main>
          </div>
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}
