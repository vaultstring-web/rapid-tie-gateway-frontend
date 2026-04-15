"use client";

import Topbar from '@/components/layout/Topbar';
import EmployeeSidebar from '@/components/layout/EmployeeSidebar';

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar - fixed on the left */}
      <EmployeeSidebar />
      
      {/* Main content area - this will take the remaining width */}
      <div className="flex-1 flex flex-col">
        {/* Topbar now sits inside the main content area, next to the sidebar */}
        <Topbar />
        
        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}