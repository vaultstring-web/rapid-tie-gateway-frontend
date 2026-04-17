import apiClient from '@/lib/api/client';
import { 
  EventAnalyticsFilter, 
  RevenueData, 
  ConversionFunnelData,
  DemographicData,
  GeographicData,
  TopEventData,
  RoleAnalyticsData,
  EventAnalyticsSummary
} from '@/types/analytics/eventAnalytics';

class EventAnalyticsService {
  // Get analytics summary
  async getSummary(filters: EventAnalyticsFilter): Promise<EventAnalyticsSummary> {
    const response = await apiClient.post('/analytics/events/summary', filters);
    return response.data.data;
  }

  // Get revenue data over time
  async getRevenueData(filters: EventAnalyticsFilter): Promise<RevenueData[]> {
    const response = await apiClient.post('/analytics/events/revenue', filters);
    return response.data.data;
  }

  // Get conversion funnel data
  async getConversionFunnel(filters: EventAnalyticsFilter): Promise<ConversionFunnelData[]> {
    const response = await apiClient.post('/analytics/events/conversion-funnel', filters);
    return response.data.data;
  }

  // Get demographic data
  async getDemographicData(filters: EventAnalyticsFilter): Promise<DemographicData[]> {
    const response = await apiClient.post('/analytics/events/demographics', filters);
    return response.data.data;
  }

  // Get geographic data
  async getGeographicData(filters: EventAnalyticsFilter): Promise<GeographicData[]> {
    const response = await apiClient.post('/analytics/events/geographic', filters);
    return response.data.data;
  }

  // Get top events
  async getTopEvents(filters: EventAnalyticsFilter, limit: number = 10): Promise<TopEventData[]> {
    const response = await apiClient.post('/analytics/events/top', { ...filters, limit });
    return response.data.data;
  }

  // Get role-based analytics
  async getRoleAnalytics(filters: EventAnalyticsFilter): Promise<RoleAnalyticsData[]> {
    const response = await apiClient.post('/analytics/events/by-role', filters);
    return response.data.data;
  }

  // Export report
  async exportReport(filters: EventAnalyticsFilter, format: 'PDF' | 'CSV' | 'EXCEL'): Promise<Blob> {
    const response = await apiClient.post('/analytics/events/export', { ...filters, format }, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export const eventAnalyticsService = new EventAnalyticsService();