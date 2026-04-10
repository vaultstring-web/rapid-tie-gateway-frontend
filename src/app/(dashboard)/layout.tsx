<<<<<<< HEAD
﻿'use client';

import Sidebar from '@/components/merchant/Sidebar';
import Topbar from '@/components/merchant/Topbar';
import { ThemeProvider } from '@/context/ThemeContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
=======
﻿"use client";

import Sidebar from '@/components/merchant/Sidebar';
import Topbar from '@/components/merchant/Topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-8 overflow-y-auto bg-[#f8f9fa]">
          {children}
        </main>
      </div>
    </div>
>>>>>>> approver
  );
}
