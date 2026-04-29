'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, User, Heart, Share2, ExternalLink, Facebook, Twitter, Instagram, Globe, ArrowLeft } from 'lucide-react';
import { EventImageGallery } from '@/components/events/EventImageGallery';
import { CountdownTimer } from '@/components/events/CountdownTimer';
import { TicketTierCard } from '@/components/events/TicketTierCard';
import { InterestByRole } from '@/components/events/InterestByRole';
import { eventDetailsService } from '@/services/events/eventDetails.service';
import { EventDetails, TicketTier } from '@/types/events/eventDetails';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Similar Events Carousel Component
const SimilarEventsCarousel = ({ events, onEventClick }: { events: EventDetails[]; onEventClick: (id: string) => void }) => {
  const { theme } = useTheme();

  if (events.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
        Similar Events You Might Like
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => onEventClick(event.id)}
            className="rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="relative h-40 overflow-hidden">
              <Image
                src={event.images[0]?.url || '/images/event-placeholder.jpg'}
                alt={event.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="p-3">
              <h4 className="font-semibold line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                {event.name}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <Calendar size={10} />
                <span>{formatDate(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <MapPin size={10} />
                <span className="truncate">{event.venue}</span>
              </div>
              <div className="mt-2">
                <span className="text-sm font-bold text-primary-green-500">
                  From {formatCurrency(event.ticketTiers[0]?.price || 0)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function EventDetailsPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [similarEvents, setSimilarEvents] = useState<EventDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEventDetails();
  }, [eventId]);

  const loadEventDetails = async () => {
    setLoading(true);
    try {
      const data = await eventDetailsService.getEventDetails(eventId);
      setEvent(data);
      setIsSaved(data.isSaved);
      
      // Load similar events
      const similar = await eventDetailsService.getSimilarEvents(eventId, data.category);
      setSimilarEvents(similar);
    } catch (error) {
      console.error('Failed to load event details:', error);
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEvent = async () => {
    setSaving(true);
    try {
      if (isSaved) {
        await eventDetailsService.unsaveEvent(eventId);
        toast.success('Event removed from saved');
      } else {
        await eventDetailsService.saveEvent(eventId);
        toast.success('Event saved to your list');
      }
      setIsSaved(!isSaved);
    } catch (error) {
      toast.error('Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handlePurchaseTicket = async (tierId: string, quantity: number) => {
    try {
      const result = await eventDetailsService.purchaseTicket(eventId, tierId, quantity);
      router.push(`/checkout/${result.orderId}`);
    } catch (error) {
      throw error;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.name,
        text: event?.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Event Not Found</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>The event you're looking for doesn't exist.</p>
          <button onClick={() => router.back()} className="mt-4 px-4 py-2 rounded-lg bg-primary-green-500 text-white">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm mb-4 hover:text-primary-green-500 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Image Gallery */}
        <EventImageGallery images={event.images} eventName={event.name} />

        {/* Title and Actions */}
        <div className="flex flex-wrap justify-between items-start gap-4 mt-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {event.name}
              </h1>
              {event.isTrending && (
                <span className="px-2 py-1 rounded-full text-xs bg-red-500 text-white">🔥 Trending</span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formatDate(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{event.venue}, {event.city}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveEvent}
              disabled={saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${isSaved ? 'bg-red-500 text-white border-red-500' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              style={{
                borderColor: isSaved ? undefined : 'var(--border-color)',
                backgroundColor: isSaved ? undefined : 'var(--bg-secondary)',
              }}
            >
              <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'Saved' : 'Save Event'}
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="mt-6">
          <CountdownTimer targetDate={event.startDate} />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column - Description and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div
              className="rounded-xl p-5 border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                About This Event
              </h2>
              <div className="space-y-4">
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {event.description}
                </p>
                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-secondary)' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Organizer Info */}
            <div
              className="rounded-xl p-5 border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Organized by
              </h2>
              <div className="flex gap-4">
                <Image
                  src={event.organizer.avatar || '/images/default-avatar.png'}
                  alt={event.organizer.name}
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {event.organizer.name}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {event.organizer.bio}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {event.socialLinks?.website && (
                      <a href={event.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-primary-green-500 hover:underline text-sm">
                        <Globe size={14} className="inline mr-1" />
                        Website
                      </a>
                    )}
                    {event.socialLinks?.facebook && (
                      <a href={event.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-primary-green-500 hover:underline text-sm">
                        <Facebook size={14} className="inline mr-1" />
                        Facebook
                      </a>
                    )}
                    {event.socialLinks?.twitter && (
                      <a href={event.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-primary-green-500 hover:underline text-sm">
                        <Twitter size={14} className="inline mr-1" />
                        Twitter
                      </a>
                    )}
                    {event.socialLinks?.instagram && (
                      <a href={event.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-primary-green-500 hover:underline text-sm">
                        <Instagram size={14} className="inline mr-1" />
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Interest by Role */}
            <InterestByRole attendeesByRole={event.attendeesByRole} totalAttendees={event.totalAttendees} />

            {/* Similar Events */}
            {similarEvents.length > 0 && (
              <SimilarEventsCarousel events={similarEvents} onEventClick={(id) => router.push(`/events/${id}`)} />
            )}
          </div>

          {/* Right Column - Tickets */}
          <div className="space-y-4">
            <div
              className="rounded-xl p-5 border sticky top-24"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Tickets
              </h2>
              <div className="space-y-4">
                {event.ticketTiers.map((tier) => (
                  <TicketTierCard
                    key={tier.id}
                    tier={tier}
                    eventId={event.id}
                    onPurchase={handlePurchaseTicket}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}