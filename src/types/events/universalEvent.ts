export interface UniversalEvent {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: 'concert' | 'conference' | 'workshop' | 'sports' | 'festival' | 'corporate' | 'education';
  type: 'public' | 'merchant' | 'dsa-relevant';
  startDate: string;
  endDate: string;
  venue: string;
  city: string;
  country: string;
  imageUrl: string;
  ticketPrice: {
    min: number;
    max: number;
  };
  attendees: number;
  capacity: number;
  isTrending: boolean;
  isSaved: boolean;
  relevanceScore?: number;
  roleSpecificBadges?: string[];
}

export interface EventFilter {
  type?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface EventsResponse {
  events: UniversalEvent[];
  hasMore: boolean;
  total: number;
  page: number;
  limit: number;
}

export type EventTab = 'for-you' | 'public' | 'merchant' | 'dsa-relevant';

export const EVENT_CATEGORIES = [
  { value: 'concert', label: '🎤 Concert', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  { value: 'conference', label: '💼 Conference', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  { value: 'workshop', label: '🔧 Workshop', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  { value: 'sports', label: '⚽ Sports', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
  { value: 'festival', label: '🎪 Festival', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' },
  { value: 'corporate', label: '🏢 Corporate', color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
  { value: 'education', label: '📚 Education', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
];

export const EVENT_TYPES = [
  { value: 'public', label: '🌍 Public', color: 'text-blue-500' },
  { value: 'merchant', label: '🛍️ Merchant', color: 'text-green-500' },
  { value: 'dsa-relevant', label: '📋 DSA-Relevant', color: 'text-purple-500' },
];

export const MALAWI_CITIES = [
  'Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Mangochi', 
  'Karonga', 'Salima', 'Nkhotakota', 'Kasungu', 'Dedza'
];