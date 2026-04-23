export interface Event {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: 'concert' | 'conference' | 'workshop' | 'sports' | 'festival' | 'corporate' | 'education' | 'training';
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
  organizer: {
    id: string;
    name: string;
    logo?: string;
  };
}

export interface EventFilters {
  search?: string;
  category?: string[];
  type?: string[];
  city?: string;
  startDate?: Date;
  endDate?: Date;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'date' | 'price_asc' | 'price_desc' | 'popularity';
}

export interface EventsResponse {
  events: Event[];
  total: number;
  hasMore: boolean;
  page: number;
  limit: number;
}

export type ViewMode = 'grid' | 'list';

export const EVENT_CATEGORIES = [
  { value: 'concert', label: '🎤 Concert', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  { value: 'conference', label: '💼 Conference', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  { value: 'workshop', label: '🔧 Workshop', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  { value: 'training', label: '📚 Training', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
  { value: 'sports', label: '⚽ Sports', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
  { value: 'festival', label: '🎪 Festival', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' },
  { value: 'corporate', label: '🏢 Corporate', color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
  { value: 'education', label: '🎓 Education', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' },
];

export const EVENT_TYPES = [
  { value: 'public', label: '🌍 Public', color: 'text-blue-500' },
  { value: 'merchant', label: '🛍️ Merchant', color: 'text-green-500' },
  { value: 'dsa-relevant', label: '📋 DSA-Relevant', color: 'text-purple-500' },
];

export const MALAWI_CITIES = [
  'Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Mangochi', 
  'Karonga', 'Salima', 'Nkhotakota', 'Kasungu', 'Dedza', 'Balaka', 'Mchinji'
];

export const SORT_OPTIONS = [
  { value: 'date', label: 'Date (Soonest first)' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price (Low to High)' },
  { value: 'price_desc', label: 'Price (High to Low)' },
];