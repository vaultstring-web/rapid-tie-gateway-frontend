export interface DsaRequest {
  id: string;
  destination: string;
  purpose: string;
  startDate: string;
  endDate: string;
  duration: number;
  perDiemRate: number;
  accommodationRate: number;
  totalAmount: number;
  currency: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'paid';
  travelAuthRef?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DsaRate {
  location: string;
  grade: string;
  perDiemRate: number;
  accommodationRate: number;
}

export interface MatchingEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  city: string;
  category: string;
  imageUrl: string;
  relevanceScore: number;
}

export const DSA_PURPOSES = [
  { value: 'conference', label: 'Conference Attendance', icon: '🎤' },
  { value: 'training', label: 'Training Workshop', icon: '📚' },
  { value: 'field_visit', label: 'Field Visit', icon: '🌾' },
  { value: 'meeting', label: 'Meeting', icon: '🤝' },
  { value: 'assessment', label: 'Assessment', icon: '📋' },
  { value: 'monitoring', label: 'Monitoring', icon: '👁️' },
  { value: 'other', label: 'Other', icon: '📌' },
];

export const MALAWI_DESTINATIONS = [
  'Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Mangochi', 
  'Karonga', 'Salima', 'Nkhotakota', 'Kasungu', 'Dedza',
  'Rumphi', 'Mchinji', 'Liwonde', 'Monkey Bay', 'Chitipa'
];