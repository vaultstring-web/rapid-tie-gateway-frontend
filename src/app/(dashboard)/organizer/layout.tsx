'use client';

import React, { useState, useEffect } from 'react';
import { OrganizerSidebar } from '@/components/organizer/sidebar';
import { OrganizerTopbar } from '@/components/organizer/topbar';
import { UserProvider } from '@/contexts/UserContext';

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <UserProvider>
      <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
        {/* Grid layout with auto sidebar width and flexible main content */}
        <div className="flex">
          {/* Sidebar - sticky, will stop at footer naturally */}
          <OrganizerSidebar 
            isCollapsed={isCollapsed} 
            setIsCollapsed={setIsCollapsed} 
          />
          
          {/* Main content area */}
          <div className={`flex-1 transition-all duration-300`}>
            <OrganizerTopbar 
              theme={theme} 
              toggleTheme={toggleTheme} 
            />
            
            {/* Main content */}
            <main className="p-6 md:p-10">
              {children}
            </main>
            
          </div>
        </div>
      </div>
    </UserProvider>
  );
}