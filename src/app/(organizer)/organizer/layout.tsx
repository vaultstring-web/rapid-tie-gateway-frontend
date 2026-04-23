'use client';

import { useState } from 'react';
import { OrganizerSidebar } from '@/components/organizer/OrganizerSidebar';
import { OrganizerTopbar } from '@/components/organizer/OrganizerTopbar';

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="flex min-h-screen">
      <OrganizerSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <OrganizerTopbar theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}