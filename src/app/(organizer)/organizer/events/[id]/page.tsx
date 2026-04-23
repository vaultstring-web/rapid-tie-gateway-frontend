'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, Eye, Trash2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { EventEditTabs, EditTab } from '@/components/organizer/event-edit/EventEditTabs';
import { BasicInfoTab } from '@/components/organizer/event-edit/BasicInfoTab';
import { AudienceInsightsTab } from '@/components/organizer/event-edit/AudienceInsightsTab';
import { PreviewTab } from '@/components/organizer/event-edit/PreviewTab';
import { VersionsTab } from '@/components/organizer/event-edit/VersionsTab';
import { TicketTiersTab } from '@/components/organizer/event-edit/TicketTiersTab';
import { eventEditService } from '@/services/organizer/eventEdit.service';
import { EventFormData } from '@/types/organizer/eventEdit';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

export default function EventEditPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [activeTab, setActiveTab] = useState<EditTab>('basic');
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    type: 'public',
    startDate: '',
    endDate: '',
    venue: '',
    city: '',
    address: '',
    capacity: 0,
    images: [],
    ticketTiers: [],
    tags: [],
    organizerId: '',
  });
  const [originalData, setOriginalData] = useState<EventFormData | null>(null);
  const [eventStatus, setEventStatus] = useState<'draft' | 'published' | 'cancelled'>('draft');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<'draft' | 'published' | 'cancelled' | null>(null);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      // For demo, use mock data
      const mockData: EventFormData = {
        name: 'Malawi Fintech Expo 2026',
        description: 'The largest fintech conference in Malawi featuring industry leaders and innovators.',
        shortDescription: 'Annual fintech conference',
        category: 'conference',
        type: 'public',
        startDate: new Date(Date.now() + 7 * 86400000).toISOString(),
        endDate: new Date(Date.now() + 8 * 86400000).toISOString(),
        venue: 'Bingu International Convention Centre',
        city: 'Lilongwe',
        address: 'Convention Drive, Lilongwe',
        capacity: 1000,
        images: [],
        ticketTiers: [
          { id: 't1', name: 'VIP', description: 'Full access', price: 150000, quantity: 100, sold: 45, maxPerPerson: 4, benefits: ['Backstage', 'VIP Lounge'], isAvailable: true },
          { id: 't2', name: 'Standard', description: 'Standard access', price: 45000, quantity: 500, sold: 320, maxPerPerson: 10, benefits: ['Standard Entry'], isAvailable: true },
        ],
        tags: ['fintech', 'conference', 'networking'],
        organizerId: 'org1',
      };
      setFormData(mockData);
      setOriginalData(mockData);
      setEventStatus('published');
    } catch (error) {
      console.error('Failed to load event:', error);
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const hasUnsavedChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
    if (!formData.city) newErrors.city = 'City is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setOriginalData({ ...formData });
      toast.success('Event saved successfully');
    } catch (error) {
      console.error('Failed to save event:', error);
      toast.error('Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: 'draft' | 'published' | 'cancelled') => {
    setPendingStatus(newStatus);
    setShowStatusConfirm(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatus) return;
    
    try {
      setEventStatus(pendingStatus);
      toast.success(`Event ${pendingStatus === 'published' ? 'published' : pendingStatus === 'cancelled' ? 'cancelled' : 'saved as draft'}`);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setShowStatusConfirm(false);
      setPendingStatus(null);
    }
  };

  const handleDelete = async () => {
    try {
      toast.success('Event deleted successfully');
      router.push('/organizer/events');
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Edit Event
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {formData.name || 'Untitled Event'}
            </p>
          </div>
          <div className="flex gap-3">
            {/* Status Toggle */}
            <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
              <button
                onClick={() => handleStatusChange('draft')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  eventStatus === 'draft'
                    ? 'bg-gray-500 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                style={{ backgroundColor: eventStatus === 'draft' ? '#6b7280' : 'var(--bg-secondary)' }}
              >
                Draft
              </button>
              <button
                onClick={() => handleStatusChange('published')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  eventStatus === 'published'
                    ? 'bg-green-500 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                style={{ backgroundColor: eventStatus === 'published' ? '#10b981' : 'var(--bg-secondary)' }}
              >
                Published
              </button>
              <button
                onClick={() => handleStatusChange('cancelled')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  eventStatus === 'cancelled'
                    ? 'bg-red-500 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                style={{ backgroundColor: eventStatus === 'cancelled' ? '#ef4444' : 'var(--bg-secondary)' }}
              >
                Cancelled
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving || !hasUnsavedChanges()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-green-500 text-white font-medium hover:bg-primary-green-600 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Save Changes
            </button>

            {/* Delete Button */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b mb-6" style={{ borderColor: 'var(--border-color)' }}>
          {['basic', 'tickets', 'audience', 'preview', 'versions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as EditTab)}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'border-b-2 border-primary-green-500 text-primary-green-500'
                  : 'text-[var(--text-secondary)] hover:text-primary-green-500'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Event Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg border"
                />
              </div>
            </div>
          )}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              {formData.ticketTiers.map((tier, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{tier.name}</h3>
                  <p>Price: MWK {tier.price.toLocaleString()}</p>
                  <p>Sold: {tier.sold} / {tier.quantity}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'audience' && (
            <div className="text-center py-12">
              <p>Audience insights will appear here</p>
            </div>
          )}
          {activeTab === 'preview' && (
            <div className="text-center py-12">
              <p>Event preview will appear here</p>
            </div>
          )}
          {activeTab === 'versions' && (
            <div className="text-center py-12">
              <p>Version history will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="rounded-xl max-w-md w-full p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold">Delete Event</h3>
            </div>
            <p className="text-sm mb-6 text-[var(--text-secondary)]">
              Are you sure you want to delete "{formData.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Confirmation Modal */}
      {showStatusConfirm && pendingStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="rounded-xl max-w-md w-full p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                <CheckCircle size={20} className="text-green-500" />
              </div>
              <h3 className="text-lg font-semibold">
                {pendingStatus === 'published' ? 'Publish Event' :
                 pendingStatus === 'cancelled' ? 'Cancel Event' :
                 'Save as Draft'}
              </h3>
            </div>
            <p className="text-sm mb-6 text-[var(--text-secondary)]">
              {pendingStatus === 'published' ? 
                'Publishing will make this event visible to the public. Are you sure?' :
               pendingStatus === 'cancelled' ?
                'Cancelling will notify attendees and prevent further ticket sales.' :
                'This will save your changes as a draft.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowStatusConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className={`flex-1 px-4 py-2 rounded-lg text-white ${
                  pendingStatus === 'published' ? 'bg-green-500 hover:bg-green-600' :
                  pendingStatus === 'cancelled' ? 'bg-red-500 hover:bg-red-600' :
                  'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}