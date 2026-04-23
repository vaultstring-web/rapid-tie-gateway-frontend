export interface RecommendationReason {
  type: 'similar_events' | 'your_interest' | 'trending_in_role' | 'location_match' | 'past_attendance';
  title: string;
  description: string;
  icon: string;
}

export interface RecommendedEvent {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  startDate: string;
  endDate: string;
  venue: string;
  city: string;
  imageUrl: string;
  ticketPrice: {
    min: number;
    max: number;
  };
  matchPercentage: number;
  reasons: RecommendationReason[];
  isSaved: boolean;
  isNotInterested: boolean;
}

export interface RecommendationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  events: RecommendedEvent[];
}

export interface RecommendationResponse {
  categories: RecommendationCategory[];
  personalizedMessage: string;
  lastUpdated: string;
}

export const REASON_ICONS: Record<string, string> = {
  similar_events: '🔄',
  your_interest: '❤️',
  trending_in_role: '📈',
  location_match: '📍',
  past_attendance: '🎫',
};