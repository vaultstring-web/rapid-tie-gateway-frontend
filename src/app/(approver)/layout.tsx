'use client';

import { useState } from 'react';
import { ApproverSidebar } from '@/components/approver/ApproverSidebar';
import { ApproverTopBar } from '@/components/approver/ApproverTopBar';
import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/contexts/UserContext';

export default function ApproverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <ThemeProvider>
      <UserProvider>
        <div className="flex min-h-screen">
          <ApproverSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <div className="flex-1 flex flex-col min-w-0">
            <ApproverTopBar />
            <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
              {children}
            </main>
          </div>
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}