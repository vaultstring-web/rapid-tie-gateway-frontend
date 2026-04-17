'use client';

import { useState } from 'react';
import { Calendar, Download, Filter, TrendingUp, Users, Ticket, DollarSign, BarChart3, PieChart, MapPin } from 'lucide-react';
import { useEventAnalytics } from '@/hooks/analytics/useEventAnalytics';
import { RevenueChart } from '@/components/analytics/RevenueChart';
import { ConversionFunnel } from '@/components/analytics/ConversionFunnel';
import { DemographicChart } from '@/components/analytics/DemographicChart';
import { GeographicHeatMap } from '@/components/analytics/GeographicHeatMap';
import { RoleFilter } from '@/components/analytics/RoleFilter';
import { TopEventsTable } from '@/components/analytics/TopEventsTable';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext'; 

export default function EventAnalyticsPage() {
  const { theme } = useTheme();
  const [dateRange, setDateRange] = useState({ 
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
    end: new Date() 
  });
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'overview' | 'demographics' | 'geographic'>('overview');
  
  const { data, loading, updateFilters, exportReport } = useEventAnalytics({
    startDate: dateRange.start,
    endDate: dateRange.end,
    role: selectedRole as any,
  });

  const summaryCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(data.summary?.totalRevenue || 0),
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
      trend: '+12.5%',
    },
    {
      title: 'Tickets Sold',
      value: data.summary?.totalTickets?.toLocaleString() || '0',
      icon: Ticket,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      trend: '+8.2%',
    },
    {
      title: 'Total Events',
      value: data.summary?.totalEvents?.toLocaleString() || '0',
      icon: Calendar,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      trend: '+5',
    },
    {
      title: 'Conversion Rate',
      value: `${data.summary?.overallConversionRate || 0}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      trend: '+2.3%',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'demographics', label: 'Demographics', icon: PieChart },
    { id: 'geographic', label: 'Geographic', icon: MapPin },
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Event Analytics
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Track event performance, audience insights, and revenue trends
            </p>
          </div>
          <button
            onClick={() => exportReport('PDF')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <Download size={16} />
            Export Report
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-xl p-4 border" style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter size={16} style={{ color: 'var(--text-secondary)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Filter by:
                </span>
              </div>
              <RoleFilter selectedRole={selectedRole} onRoleChange={setSelectedRole} />
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Calendar size={14} />
              <span>Last 30 days</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all
                  ${activeTab === tab.id
                    ? 'border-b-2 border-primary-green-500 text-primary-green-500'
                    : 'hover:text-primary-green-500'
                  }
                `}
                style={{ color: activeTab === tab.id ? undefined : 'var(--text-secondary)' }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-xl p-6 border transition-all hover:shadow-md"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className={`${card.bg} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <span className="text-xs font-medium text-green-600">
                    {card.trend}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                    {card.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Revenue Chart */}
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Revenue & Transaction Trends
              </h2>
              <RevenueChart data={data.revenue} loading={loading.revenue} />
            </div>

            {/* Conversion Funnel */}
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Conversion Funnel
              </h2>
              <ConversionFunnel data={data.funnel} loading={loading.funnel} />
            </div>

            {/* Role-Based Analytics */}
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Role-Based Performance
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                      <th className="text-left py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Role
                      </th>
                      <th className="text-right py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Views
                      </th>
                      <th className="text-right py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Purchases
                      </th>
                      <th className="text-right py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Revenue
                      </th>
                      <th className="text-right py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Conversion
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.roleAnalytics.map((role) => (
                      <tr key={role.role} className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                        <td className="py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                          {role.role}
                        </td>
                        <td className="py-3 text-right" style={{ color: 'var(--text-secondary)' }}>
                          {role.views.toLocaleString()}
                        </td>
                        <td className="py-3 text-right" style={{ color: 'var(--text-secondary)' }}>
                          {role.purchases.toLocaleString()}
                        </td>
                        <td className="py-3 text-right text-primary-green-600 font-medium">
                          {formatCurrency(role.revenue)}
                        </td>
                        <td className="py-3 text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              role.conversionRate > 10
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {role.conversionRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Events */}
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Top Performing Events
              </h2>
              <TopEventsTable data={data.topEvents} loading={loading.topEvents} />
            </div>
          </>
        )}

        {/* Demographics Tab Content */}
        {activeTab === 'demographics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Age Distribution
              </h2>
              <DemographicChart data={data.demographics} loading={loading.demographics} type="age" />
            </div>
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Gender Distribution
              </h2>
              <DemographicChart data={data.demographics} loading={loading.demographics} type="gender" />
            </div>
          </div>
        )}

        {/* Geographic Tab Content */}
        {activeTab === 'geographic' && (
          <div
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Geographic Distribution
            </h2>
            <GeographicHeatMap data={data.geographic} loading={loading.geographic} />
          </div>
        )}
      </div>
    </div>
  );
}