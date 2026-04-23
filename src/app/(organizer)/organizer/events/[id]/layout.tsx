'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { EventManagementSidebar } from '@/components/organizer/EventManagementSidebar';

export default function EventPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const eventId = params.id as string;
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <EventManagementSidebar
        eventId={eventId}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <main 
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}