'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Settings, Users, BarChart3, Ticket, QrCode, 
  ChevronLeft, Trash2, Save, Eye 
} from 'lucide-react';
import { MOCK_EVENTS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrganizerEventDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isPublished, setIsPublished] = useState(true);

  const event = MOCK_EVENTS.find(e => e.id === id);
  if (!event) return <div className="p-10 text-center">Event not found</div>;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'attendees', label: 'Attendees', icon: Users, link: `/organizer/events/${id}/attendees` },
    { id: 'sales', label: 'Sales', icon: Ticket, link: `/organizer/events/${id}/sales` },
    { id: 'checkin', label: 'Check-in', icon: QrCode, link: `/organizer/events/${id}/checkin` },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="container-custom py-8">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[var(--text-secondary)] mb-6 hover:text-[var(--text-primary)]"
      >
        <ChevronLeft size={20} /> Back to Dashboard
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{event.name}</h1>
          <p className="text-[var(--text-secondary)]">Manage event details and insights.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Eye size={18} /> Preview
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-[var(--border-color)] mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => tab.link ? router.push(tab.link) : setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-[var(--accent)] text-[var(--accent)]' 
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <Card>
              <CardHeader><CardTitle>Audience Insights</CardTitle></CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-[var(--border-color)] rounded-xl">
                  <p className="text-[var(--text-secondary)] text-sm">Views by Role (Chart Placeholder)</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
                <span className="text-sm font-bold">{isPublished ? 'Published' : 'Draft'}</span>
                <button 
                  onClick={() => setIsPublished(!isPublished)}
                  className={`px-3 py-1 rounded-md text-xs font-bold ${
                    isPublished ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                  }`}
                >
                  {isPublished ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-500/20 bg-red-500/5">
            <CardHeader><CardTitle className="text-red-500">Danger Zone</CardTitle></CardHeader>
            <CardContent>
              <button className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-2 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors">
                <Trash2 size={18} /> Delete Event
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}