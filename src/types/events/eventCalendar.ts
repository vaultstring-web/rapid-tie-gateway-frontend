export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  venue: string;
  city: string;
  category: string;
  role: 'public' | 'merchant' | 'dsa-relevant';
  imageUrl: string;
  ticketPrice: {
    min: number;
    max: number;
  };
  weather?: WeatherForecast;
  isSaved: boolean;
}

export interface WeatherForecast {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'windy';
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export interface CalendarFilters {
  startDate?: Date;
  endDate?: Date;
  role?: string[];
  category?: string[];
  city?: string;
}

export const EVENT_CATEGORY_COLORS: Record<string, string> = {
  concert: '#8b5cf6', // purple
  conference: '#3b82f6', // blue
  workshop: '#10b981', // green
  sports: '#f59e0b', // orange
  festival: '#ec4899', // pink
  corporate: '#6b7280', // gray
  education: '#eab308', // yellow
};

export const EVENT_ROLE_COLORS: Record<string, string> = {
  public: '#3b82f6', // blue
  merchant: '#10b981', // green
  'dsa-relevant': '#8b5cf6', // purple
};

export const WEATHER_ICONS: Record<string, string> = {
  sunny: '☀️',
  cloudy: '☁️',
  rainy: '🌧️',
  stormy: '⛈️',
  windy: '💨',
};