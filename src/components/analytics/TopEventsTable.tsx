'use client';

import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { TopEventData } from '@/types/analytics/eventAnalytics';
import { formatCurrency } from '@/lib/utils/format';
import Link from 'next/link';

interface TopEventsTableProps {
  data: TopEventData[];
  loading?: boolean;
}

export const TopEventsTable = ({ data, loading }: TopEventsTableProps) => {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-gray-700">
            <th className="text-left py-3 font-medium text-neutral-600 dark:text-gray-400">Rank</th>
            <th className="text-left py-3 font-medium text-neutral-600 dark:text-gray-400">Event Name</th>
            <th className="text-left py-3 font-medium text-neutral-600 dark:text-gray-400">Category</th>
            <th className="text-right py-3 font-medium text-neutral-600 dark:text-gray-400">Tickets Sold</th>
            <th className="text-right py-3 font-medium text-neutral-600 dark:text-gray-400">Revenue</th>
            <th className="text-right py-3 font-medium text-neutral-600 dark:text-gray-400">Conversion Rate</th>
            <th className="text-right py-3 font-medium text-neutral-600 dark:text-gray-400">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((event, index) => (
            <tr key={event.id} className="border-b border-neutral-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td className="py-3">
                {index === 0 ? (
                  <Trophy className="w-5 h-5 text-yellow-500" />
                ) : index === 1 ? (
                  <Trophy className="w-5 h-5 text-gray-400" />
                ) : index === 2 ? (
                  <Trophy className="w-5 h-5 text-amber-600" />
                ) : (
                  <span className="text-gray-500">#{index + 1}</span>
                )}
              </td>
              <td className="py-3 font-medium text-gray-900 dark:text-white">{event.name}</td>
              <td className="py-3">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                  {event.category}
                </span>
              </td>
              <td className="py-3 text-right">{event.ticketsSold.toLocaleString()}</td>
              <td className="py-3 text-right font-medium text-primary-green-600">
                {formatCurrency(event.revenue)}
              </td>
              <td className="py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  {event.conversionRate > 10 ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={event.conversionRate > 10 ? 'text-green-600' : 'text-red-600'}>
                    {event.conversionRate}%
                  </span>
                </div>
              </td>
              <td className="py-3 text-right">
                <Link
                  href={`/events/${event.id}`}
                  className="text-primary-green-600 hover:text-primary-green-700 text-sm font-medium"
                >
                  View Details →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};