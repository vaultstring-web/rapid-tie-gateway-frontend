'use client';

import { useState, useEffect, useCallback } from 'react';
import { eventAnalyticsService } from '@/services/analytics/eventAnalytics.service';
import { EventAnalyticsFilter } from '@/types/analytics/eventAnalytics';
import toast from 'react-hot-toast';

export const useEventAnalytics = (initialFilters: EventAnalyticsFilter) => {
  const [filters, setFilters] = useState<EventAnalyticsFilter>(initialFilters);
  const [loading, setLoading] = useState({
    summary: true,
    revenue: true,
    funnel: true,
    demographics: true,
    geographic: true,
    topEvents: true,
    roleAnalytics: true,
  });
  const [data, setData] = useState({
    summary: null,
    revenue: [],
    funnel: [],
    demographics: [],
    geographic: [],
    topEvents: [],
    roleAnalytics: [],
  });
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async () => {
    setLoading({
      summary: true,
      revenue: true,
      funnel: true,
      demographics: true,
      geographic: true,
      topEvents: true,
      roleAnalytics: true,
    });
    setError(null);

    try {
      const [
        summary,
        revenue,
        funnel,
        demographics,
        geographic,
        topEvents,
        roleAnalytics,
      ] = await Promise.all([
        eventAnalyticsService.getSummary(filters),
        eventAnalyticsService.getRevenueData(filters),
        eventAnalyticsService.getConversionFunnel(filters),
        eventAnalyticsService.getDemographicData(filters),
        eventAnalyticsService.getGeographicData(filters),
        eventAnalyticsService.getTopEvents(filters),
        eventAnalyticsService.getRoleAnalytics(filters),
      ]);

      setData({
        summary,
        revenue,
        funnel,
        demographics,
        geographic,
        topEvents,
        roleAnalytics,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics data');
      toast.error('Failed to load analytics data');
    } finally {
      setLoading({
        summary: false,
        revenue: false,
        funnel: false,
        demographics: false,
        geographic: false,
        topEvents: false,
        roleAnalytics: false,
      });
    }
  }, [filters]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const updateFilters = (newFilters: Partial<EventAnalyticsFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const exportReport = async (format: 'PDF' | 'CSV' | 'EXCEL') => {
    try {
      const blob = await eventAnalyticsService.exportReport(filters, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `event-analytics-report.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success(`Report exported as ${format}`);
    } catch (err) {
      toast.error('Failed to export report');
    }
  };

  return {
    filters,
    data,
    loading,
    error,
    updateFilters,
    exportReport,
    refresh: fetchAllData,
  };
};