export interface EventFormData {
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  type: 'public' | 'merchant' | 'dsa-relevant';
  startDate: string;
  endDate: string;
  venue: string;
  city: string;
  address: string;
  capacity: number;
  images: { url: string; isPrimary: boolean; file?: File }[];
  ticketTiers: TicketTierForm[];
  tags: string[];
  organizerId: string;
}

export interface TicketTierForm {
  id?: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  maxPerPerson: number;
  benefits: string[];
  isAvailable: boolean;
  saleStartDate?: string;
  saleEndDate?: string;
}

export interface AudienceInsight {
  role: string;
  views: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export interface EventVersion {
  id: string;
  version: number;
  publishedAt: string;
  changes: string;
  publishedBy: string;
}

export const EVENT_CATEGORIES = [
  { value: 'concert', label: '🎤 Concert' },
  { value: 'conference', label: '💼 Conference' },
  { value: 'workshop', label: '🔧 Workshop' },
  { value: 'training', label: '📚 Training' },
  { value: 'sports', label: '⚽ Sports' },
  { value: 'festival', label: '🎪 Festival' },
  { value: 'corporate', label: '🏢 Corporate' },
  { value: 'education', label: '📖 Education' },
];

export const MALAWI_CITIES = [
  'Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Mangochi', 
  'Karonga', 'Salima', 'Nkhotakota', 'Kasungu', 'Dedza'
];