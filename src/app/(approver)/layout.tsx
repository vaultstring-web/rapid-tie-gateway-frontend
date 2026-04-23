'use client';

import { UserProvider } from '@/contexts/UserContext';
import Sidebar from '@/components/approver/Sidebar';
import TopBar from '@/components/approver/TopBar';

export default function ApproverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 p-8 overflow-y-auto bg-[#f8f9fa]">
            {children}
          </main>
        </div>
      </div>
    </UserProvider>
  );
}
