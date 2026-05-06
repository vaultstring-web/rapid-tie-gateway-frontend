export interface CreateEventFormData {
  // Step 1: Basic Information
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  type: 'public' | 'merchant' | 'dsa-relevant';
  
  // Step 2: Date & Location
  startDate: string;
  endDate: string;
  timezone: string;
  venue: string;
  city: string;
  address: string;
  isVirtual: boolean;
  virtualLink?: string;
  
  // Step 3: Tickets
  ticketTiers: TicketTierInput[];
  
  // Step 4: Media & Branding
  coverImage?: File | string;
  galleryImages: (File | string)[];
  
  // Step 5: Additional Settings
  capacity: number;
  tags: string[];
  organizerId: string;
}

export interface TicketTierInput {
  id?: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  maxPerPerson: number;
  benefits: string[];
  isActive: boolean;
  saleStartDate?: string;
  saleEndDate?: string;
}

export const EVENT_CATEGORIES = [
  { value: 'concert', label: '🎤 Concert', icon: '🎤' },
  { value: 'conference', label: '💼 Conference', icon: '💼' },
  { value: 'workshop', label: '🔧 Workshop', icon: '🔧' },
  { value: 'training', label: '📚 Training', icon: '📚' },
  { value: 'sports', label: '⚽ Sports', icon: '⚽' },
  { value: 'festival', label: '🎪 Festival', icon: '🎪' },
  { value: 'corporate', label: '🏢 Corporate', icon: '🏢' },
  { value: 'education', label: '📖 Education', icon: '📖' },
];

export const MALAWI_CITIES = [
  'Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Mangochi', 
  'Karonga', 'Salima', 'Nkhotakota', 'Kasungu', 'Dedza', 'Rumphi', 'Mchinji'
];

export const TIMEZONES = [
  { value: 'Africa/Blantyre', label: 'Africa/Blantyre (GMT+2)' },
  { value: 'Africa/Johannesburg', label: 'Africa/Johannesburg (GMT+2)' },
  { value: 'Africa/Nairobi', label: 'Africa/Nairobi (GMT+3)' },
  { value: 'UTC', label: 'UTC (GMT+0)' },
];