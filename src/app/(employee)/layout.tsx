'use client';

import { useState } from 'react';
import { EmployeeSidebar } from '@/components/employee/EmployeeSidebar';
import { EmployeeTopbar } from '@/components/employee/EmployeeTopbar';
import { ThemeProvider } from '@/context/ThemeContext';

export default function EmployeeLayout({
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
    <ThemeProvider>
      <div className="flex min-h-screen">
        <EmployeeSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className="flex-1 flex flex-col min-w-0">
          <EmployeeTopbar theme={theme} toggleTheme={toggleTheme} />
          <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}