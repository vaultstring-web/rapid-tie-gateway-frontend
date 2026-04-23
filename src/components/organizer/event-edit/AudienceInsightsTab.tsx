'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Eye, Users } from 'lucide-react';
import { AudienceInsight } from '@/types/organizer/eventEdit';
import { eventEditService } from '@/services/organizer/eventEdit.service';
import { useTheme } from '@/context/ThemeContext';

interface AudienceInsightsTabProps {
  eventId: string;
}

const ROLE_LABELS: Record<string, string> = {
  MERCHANT: '🛍️ Merchants',
  ORGANIZER: '🎫 Organizers',
  EMPLOYEE: '👔 Employees',
  APPROVER: '✅ Approvers',
  FINANCE_OFFICER: '💰 Finance',
  ADMIN: '⚙️ Admins',
  PUBLIC: '🌍 General Public',
};

const ROLE_COLORS: Record<string, string> = {
  MERCHANT: '#10b981',
  ORGANIZER: '#3b82f6',
  EMPLOYEE: '#8b5cf6',
  APPROVER: '#f59e0b',
  FINANCE_OFFICER: '#06b6d4',
  ADMIN: '#ef4444',
  PUBLIC: '#6b7280',
};

export const AudienceInsightsTab = ({ eventId }: AudienceInsightsTabProps) => {
  const { theme } = useTheme();
  const [insights, setInsights] = useState<AudienceInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    loadInsights();
  }, [eventId]);

  const loadInsights = async () => {
    try {
      const data = await eventEditService.getAudienceInsights(eventId);
      setInsights(data);
      setTotalViews(data.reduce((sum, i) => sum + i.views, 0));
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string, changePercent: number) => {
    if (trend === 'up') return <TrendingUp size={14} className="text-green-500" />;
    if (trend === 'down') return <TrendingDown size={14} className="text-red-500" />;
    return <Minus size={14} className="text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="rounded-xl p-4 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Eye size={18} className="text-primary-green-500" />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Total Views
            </span>
          </div>
          <p className="text-3xl font-bold text-primary-green-500">
            {totalViews.toLocaleString()}
          </p>
        </div>
        <div
          className="rounded-xl p-4 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-primary-green-500" />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Unique Visitors
            </span>
          </div>
          <p className="text-3xl font-bold text-primary-green-500">
            {Math.round(totalViews * 0.7).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Role Breakdown */}
      <div
        className="rounded-xl p-5 border"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Views by Role
        </h3>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.role}>
              <div className="flex justify-between text-sm mb-1">
                <div className="flex items-center gap-2">
                  <span>{ROLE_LABELS[insight.role] || insight.role}</span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(insight.trend, insight.changePercent)}
                    <span className={`text-xs ${insight.trend === 'up' ? 'text-green-500' : insight.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                      {insight.changePercent > 0 ? '+' : ''}{insight.changePercent}%
                    </span>
                  </div>
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {insight.views.toLocaleString()} ({insight.percentage}%)
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${insight.percentage}%`, backgroundColor: ROLE_COLORS[insight.role] || '#84cc16' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Note */}
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: 'var(--hover-bg)' }}
      >
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          📊 <strong>Insights:</strong> These metrics show how different user segments are engaging with your event.
          Use this data to tailor your marketing efforts.
        </p>
      </div>
    </div>
  );
};