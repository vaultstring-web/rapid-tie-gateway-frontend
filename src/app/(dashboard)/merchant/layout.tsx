'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/hooks/useAuth';
import Sidebar from '@/components/merchant/Sidebar';
import Topbar from '@/components/merchant/Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="flex min-h-screen bg-[var(--bg-primary)] transition-colors">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Topbar />
            <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
              {children}
            </main>
          </div>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}