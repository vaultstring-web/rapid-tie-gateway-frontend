'use client';

import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Info } from 'lucide-react';
import { CategoryCarousel } from '@/components/events/CategoryCarousel';
import { RecommendationFeedback } from '@/components/events/RecommendationFeedback';
import { eventRecommendationService } from '@/services/events/eventRecommendation.service';
import { RecommendationCategory, RecommendedEvent } from '@/types/events/eventRecommendation';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

export default function EventRecommendationsPage() {
  const { theme } = useTheme();
  const [categories, setCategories] = useState<RecommendationCategory[]>([]);
  const [personalizedMessage, setPersonalizedMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedbackEvent, setFeedbackEvent] = useState<{ id: string; name: string } | null>(null);

  const loadRecommendations = async () => {
    try {
      const data = await eventRecommendationService.getRecommendations();
      setCategories(data.categories);
      setPersonalizedMessage(data.personalizedMessage);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRecommendations();
    toast.success('Recommendations refreshed');
  };

  const handleSaveToggle = async (eventId: string, saved: boolean) => {
    try {
      if (saved) {
        await eventRecommendationService.saveEvent(eventId);
        toast.success('Event saved');
      } else {
        await eventRecommendationService.unsaveEvent(eventId);
        toast.success('Event removed');
      }
      
      // Update local state
      setCategories(prev => prev.map(category => ({
        ...category,
        events: category.events.map(event =>
          event.id === eventId ? { ...event, isSaved: saved } : event
        ),
      })));
    } catch (error) {
      toast.error('Failed to save event');
    }
  };

  const handleNotInterested = async (eventId: string) => {
    try {
      await eventRecommendationService.markNotInterested(eventId);
      
      // Remove event from all categories
      setCategories(prev => prev.map(category => ({
        ...category,
        events: category.events.filter(event => event.id !== eventId),
      })));
      
      toast.success('Event removed from recommendations');
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleFeedback = async (eventId: string, isHelpful: boolean) => {
    // Send feedback to backend
    console.log(`Feedback for ${eventId}: ${isHelpful ? 'helpful' : 'not helpful'}`);
    toast.success('Thank you for your feedback!');
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Finding personalized recommendations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary-green-500" />
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Personalized Recommendations
              </h1>
            </div>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {personalizedMessage || 'Events tailored just for you based on your interests'}
            </p>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh Recommendations
          </button>
        </div>

        {/* Info Banner */}
        <div
          className="rounded-xl p-4 mb-8 flex items-start gap-3"
          style={{
            backgroundColor: 'var(--hover-bg)',
            borderColor: 'var(--border-color)',
            borderWidth: 1,
          }}
        >
          <Info size={18} className="flex-shrink-0 mt-0.5 text-primary-green-500" />
          <div>
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
              <strong>How recommendations work:</strong> We analyze your past event attendance, 
              saved events, and role to find the best matches. The more you interact, the better 
              recommendations become!
            </p>
          </div>
        </div>

        {/* Category Carousels */}
        {categories.length > 0 ? (
          categories.map((category) => (
            <CategoryCarousel
              key={category.id}
              category={category}
              onSaveToggle={handleSaveToggle}
              onNotInterested={handleNotInterested}
            />
          ))
        ) : (
          <div
            className="rounded-xl p-12 text-center"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              borderWidth: 1,
            }}
          >
            <Sparkles size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-secondary)' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              No recommendations yet
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Start saving and attending events to get personalized recommendations
            </p>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {feedbackEvent && (
        <RecommendationFeedback
          eventId={feedbackEvent.id}
          eventName={feedbackEvent.name}
          onFeedback={handleFeedback}
          onClose={() => setFeedbackEvent(null)}
        />
      )}
    </div>
  );
}