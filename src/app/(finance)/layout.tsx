"use client";

import Topbar from '@/components/layout/Topbar';

export default function DSALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Topbar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
